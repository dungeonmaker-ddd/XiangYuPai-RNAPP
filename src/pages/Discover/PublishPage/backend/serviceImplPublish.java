package com.xiangyupai.discover.publish.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.core.conditions.update.UpdateWrapper;
import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;

import com.xiangyupai.discover.publish.dto.*;
import com.xiangyupai.discover.publish.entity.*;
import com.xiangyupai.discover.publish.mapper.*;
import com.xiangyupai.discover.publish.service.PublishPostService;
import com.xiangyupai.discover.publish.vo.*;
import com.xiangyupai.discover.publish.query.PublishQueryBuilder;
import com.xiangyupai.common.result.PageResult;
import com.xiangyupai.common.exception.BusinessException;
import com.xiangyupai.common.utils.IdGenerator;
import com.xiangyupai.common.utils.JsonUtils;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;
import java.util.Objects;
import java.util.stream.Collectors;

/**
 * 发布动态业务服务实现 - 使用QueryWrapper/LambdaQueryWrapper执行数据库查询
 * 
 * 职责：
 * 1. 实现业务服务接口定义的方法
 * 2. 使用QueryWrapper进行数据库操作
 * 3. 处理业务逻辑和数据转换
 * 4. 管理事务和异常处理
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class PublishPostServiceImpl extends ServiceImpl<PublishPostMapper, PublishPost> 
    implements PublishPostService {

    private final PublishPostMapper publishPostMapper;
    private final PublishMediaMapper publishMediaMapper;
    private final PublishTopicMapper publishTopicMapper;
    private final PublishLocationMapper publishLocationMapper;
    private final PublishQueryBuilder queryBuilder;

    @Override
    @Transactional(rollbackFor = Exception.class)
    public PublishPostResponseDTO publishPost(PublishPostRequestDTO request, Long userId) {
        log.info("开始发布动态: 用户ID={}, 标题={}", userId, request.getTitle());

        // 1. 数据验证
        validatePublishRequest(request, userId);

        // 2. 创建动态实体
        PublishPost post = buildPublishPost(request, userId);
        post.setStatus("published");
        post.setAuditStatus("pending");

        // 3. 保存动态
        boolean saved = save(post);
        if (!saved) {
            throw new BusinessException("发布动态失败");
        }

        // 4. 处理媒体文件关联
        if (request.getMediaIds() != null && !request.getMediaIds().isEmpty()) {
            updateMediaPostRelation(request.getMediaIds(), post.getId());
        }

        // 5. 更新话题统计
        if (request.getTopicIds() != null && !request.getTopicIds().isEmpty()) {
            updateTopicStatistics(request.getTopicIds());
        }

        // 6. 处理地点信息
        if (request.getLocation() != null) {
            processLocationInfo(request.getLocation(), post.getId());
        }

        // 7. 构建响应
        PublishPostResponseDTO response = buildPublishResponse(post);
        
        log.info("动态发布成功: 动态ID={}", post.getId());
        return response;
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public PublishPostResponseDTO updatePost(String postId, PublishPostRequestDTO request, Long userId) {
        log.info("开始编辑动态: 动态ID={}, 用户ID={}", postId, userId);

        // 1. 查询现有动态
        Long postIdLong = Long.valueOf(postId);
        PublishPost existingPost = getById(postIdLong);
        if (existingPost == null) {
            throw new BusinessException("动态不存在");
        }

        // 2. 权限检查
        if (!Objects.equals(existingPost.getUserId(), userId)) {
            throw new BusinessException("无权限编辑此动态");
        }

        // 3. 状态检查
        if ("deleted".equals(existingPost.getStatus())) {
            throw new BusinessException("已删除的动态无法编辑");
        }

        // 4. 更新动态信息
        PublishPost updatedPost = buildPublishPost(request, userId);
        updatedPost.setId(postIdLong);
        updatedPost.setStatus(existingPost.getStatus());
        updatedPost.setAuditStatus("pending"); // 重新审核

        boolean updated = updateById(updatedPost);
        if (!updated) {
            throw new BusinessException("编辑动态失败");
        }

        // 5. 更新媒体关联
        updateMediaPostRelation(request.getMediaIds(), postIdLong);

        // 6. 构建响应
        PublishPostResponseDTO response = buildPublishResponse(updatedPost);
        
        log.info("动态编辑成功: 动态ID={}", postIdLong);
        return response;
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public void deletePost(String postId, Long userId) {
        log.info("开始删除动态: 动态ID={}, 用户ID={}", postId, userId);

        Long postIdLong = Long.valueOf(postId);
        PublishPost post = getById(postIdLong);
        if (post == null) {
            throw new BusinessException("动态不存在");
        }

        if (!Objects.equals(post.getUserId(), userId)) {
            throw new BusinessException("无权限删除此动态");
        }

        // 使用UpdateWrapper进行逻辑删除
        UpdateWrapper<PublishPost> updateWrapper = new UpdateWrapper<>();
        updateWrapper.eq("id", postIdLong)
                    .eq("user_id", userId)
                    .set("status", "deleted")
                    .set("update_time", LocalDateTime.now());

        boolean updated = update(updateWrapper);
        if (!updated) {
            throw new BusinessException("删除动态失败");
        }

        log.info("动态删除成功: 动态ID={}", postIdLong);
    }

    @Override
    public PageResult<PublishPostResponseDTO> queryPosts(PublishPostQueryVO queryVO, Long userId) {
        log.info("开始查询动态列表: 用户ID={}", userId);

        // 1. 构建查询条件
        QueryWrapper<PublishPost> queryWrapper = queryBuilder.buildPostQuery(queryVO, userId);

        // 2. 分页查询
        Page<PublishPost> page = new Page<>(queryVO.getPageNum(), queryVO.getPageSize());
        IPage<PublishPost> result = page(page, queryWrapper);

        // 3. 转换结果
        List<PublishPostResponseDTO> records = result.getRecords().stream()
                .map(this::buildPublishResponse)
                .collect(Collectors.toList());

        return PageResult.<PublishPostResponseDTO>builder()
                .records(records)
                .total(result.getTotal())
                .current(result.getCurrent())
                .size(result.getSize())
                .pages(result.getPages())
                .build();
    }

    @Override
    public PublishPostResponseDTO getPostDetail(String postId, Long userId) {
        log.info("获取动态详情: 动态ID={}, 用户ID={}", postId, userId);

        Long postIdLong = Long.valueOf(postId);
        
        // 使用LambdaQueryWrapper查询
        LambdaQueryWrapper<PublishPost> queryWrapper = new LambdaQueryWrapper<>();
        queryWrapper.eq(PublishPost::getId, postIdLong)
                    .eq(PublishPost::getDeleted, false);

        PublishPost post = getOne(queryWrapper);
        if (post == null) {
            throw new BusinessException("动态不存在");
        }

        // 增加浏览数
        incrementViewCount(postIdLong);

        return buildPublishResponse(post);
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public DraftSaveResponseDTO saveDraft(DraftSaveRequestDTO request, Long userId) {
        log.info("保存草稿: 用户ID={}", userId);

        PublishPost draft;
        
        if (StringUtils.hasText(request.getDraftId())) {
            // 更新现有草稿
            Long draftIdLong = Long.valueOf(request.getDraftId());
            draft = getById(draftIdLong);
            if (draft == null || !Objects.equals(draft.getUserId(), userId)) {
                throw new BusinessException("草稿不存在或无权限");
            }
            updateDraftFromRequest(draft, request);
        } else {
            // 创建新草稿
            draft = createDraftFromRequest(request, userId);
        }

        draft.setStatus("draft");
        boolean saved = saveOrUpdate(draft);
        if (!saved) {
            throw new BusinessException("保存草稿失败");
        }

        return DraftSaveResponseDTO.builder()
                .draftId(draft.getId().toString())
                .savedAt(LocalDateTime.now())
                .message("草稿保存成功")
                .build();
    }

    @Override
    public PageResult<DraftSaveResponseDTO> getDrafts(Integer pageNum, Integer pageSize, Long userId) {
        log.info("获取草稿列表: 用户ID={}", userId);

        // 使用LambdaQueryWrapper查询草稿
        LambdaQueryWrapper<PublishPost> queryWrapper = new LambdaQueryWrapper<>();
        queryWrapper.eq(PublishPost::getUserId, userId)
                    .eq(PublishPost::getStatus, "draft")
                    .eq(PublishPost::getDeleted, false)
                    .orderByDesc(PublishPost::getUpdateTime);

        Page<PublishPost> page = new Page<>(pageNum, pageSize);
        IPage<PublishPost> result = page(page, queryWrapper);

        List<DraftSaveResponseDTO> records = result.getRecords().stream()
                .map(this::buildDraftResponse)
                .collect(Collectors.toList());

        return PageResult.<DraftSaveResponseDTO>builder()
                .records(records)
                .total(result.getTotal())
                .current(result.getCurrent())
                .size(result.getSize())
                .pages(result.getPages())
                .build();
    }

    @Override
    public PublishPostRequestDTO getDraftDetail(String draftId, Long userId) {
        log.info("获取草稿详情: 草稿ID={}, 用户ID={}", draftId, userId);

        Long draftIdLong = Long.valueOf(draftId);
        
        LambdaQueryWrapper<PublishPost> queryWrapper = new LambdaQueryWrapper<>();
        queryWrapper.eq(PublishPost::getId, draftIdLong)
                    .eq(PublishPost::getUserId, userId)
                    .eq(PublishPost::getStatus, "draft")
                    .eq(PublishPost::getDeleted, false);

        PublishPost draft = getOne(queryWrapper);
        if (draft == null) {
            throw new BusinessException("草稿不存在");
        }

        return buildPublishRequest(draft);
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public void deleteDraft(String draftId, Long userId) {
        log.info("删除草稿: 草稿ID={}, 用户ID={}", draftId, userId);

        Long draftIdLong = Long.valueOf(draftId);
        
        UpdateWrapper<PublishPost> updateWrapper = new UpdateWrapper<>();
        updateWrapper.eq("id", draftIdLong)
                    .eq("user_id", userId)
                    .eq("status", "draft")
                    .set("deleted", true)
                    .set("update_time", LocalDateTime.now());

        boolean updated = update(updateWrapper);
        if (!updated) {
            throw new BusinessException("删除草稿失败");
        }

        log.info("草稿删除成功: 草稿ID={}", draftIdLong);
    }

    @Override
    public Boolean checkContentSecurity(String content, Long userId) {
        log.info("内容安全检测: 用户ID={}", userId);
        
        // TODO: 实现内容安全检测逻辑
        // 1. 敏感词过滤
        // 2. AI内容检测
        // 3. 黑名单检查
        
        // 模拟检测结果
        return !content.contains("敏感词");
    }

    @Override
    public Object getUserPublishStatistics(Long userId, StatisticsQueryVO queryVO) {
        log.info("获取用户发布统计: 用户ID={}", userId);

        // 使用QueryWrapper构建统计查询
        QueryWrapper<PublishPost> queryWrapper = queryBuilder.buildStatisticsQuery(queryVO, userId);
        
        // TODO: 实现具体的统计逻辑
        return publishPostMapper.selectMaps(queryWrapper);
    }

    @Override
    public PageResult<PublishPostResponseDTO> getHotContent(HotContentQueryVO queryVO, Long userId) {
        log.info("获取热门内容: 用户ID={}", userId);

        // 使用QueryWrapper构建热门内容查询
        QueryWrapper<PublishPost> queryWrapper = queryBuilder.buildHotContentQuery(queryVO, userId);
        
        Page<PublishPost> page = new Page<>(1, queryVO.getPageSize());
        IPage<PublishPost> result = page(page, queryWrapper);

        List<PublishPostResponseDTO> records = result.getRecords().stream()
                .map(this::buildPublishResponse)
                .collect(Collectors.toList());

        return PageResult.<PublishPostResponseDTO>builder()
                .records(records)
                .total(result.getTotal())
                .current(result.getCurrent())
                .size(result.getSize())
                .pages(result.getPages())
                .build();
    }

    // ============ 私有辅助方法 ============

    /**
     * 验证发布请求
     */
    private void validatePublishRequest(PublishPostRequestDTO request, Long userId) {
        if (!StringUtils.hasText(request.getTitle())) {
            throw new BusinessException("标题不能为空");
        }
        if (!StringUtils.hasText(request.getContent())) {
            throw new BusinessException("内容不能为空");
        }
        if (request.getMediaIds() != null && request.getMediaIds().size() > 9) {
            throw new BusinessException("媒体文件不能超过9个");
        }
        if (request.getTopicIds() != null && request.getTopicIds().size() > 3) {
            throw new BusinessException("话题不能超过3个");
        }
    }

    /**
     * 构建发布动态实体
     */
    private PublishPost buildPublishPost(PublishPostRequestDTO request, Long userId) {
        PublishPost post = new PublishPost();
        post.setUserId(userId);
        post.setTitle(request.getTitle());
        post.setContent(request.getContent());
        
        // 转换媒体ID列表为JSON
        if (request.getMediaIds() != null) {
            post.setMediaIds(JsonUtils.toJson(request.getMediaIds()));
        }
        
        // 转换话题ID列表为JSON
        if (request.getTopicIds() != null) {
            post.setTopicIds(JsonUtils.toJson(request.getTopicIds()));
        }
        
        // 转换地点信息为JSON
        if (request.getLocation() != null) {
            post.setLocationInfo(JsonUtils.toJson(request.getLocation()));
        }
        
        post.setPrivacy(request.getPrivacy());
        post.setAllowComment(request.getSettings().getAllowComment());
        post.setAllowShare(request.getSettings().getAllowShare());
        
        // 初始化统计数据
        post.setLikeCount(0);
        post.setCommentCount(0);
        post.setShareCount(0);
        post.setViewCount(0);
        post.setHotScore(0.0);
        
        return post;
    }

    /**
     * 构建发布响应
     */
    private PublishPostResponseDTO buildPublishResponse(PublishPost post) {
        return PublishPostResponseDTO.builder()
                .postId(post.getId().toString())
                .url("/posts/" + post.getId())
                .createdAt(post.getCreateTime())
                .status(post.getStatus())
                .auditStatus(post.getAuditStatus())
                .message("操作成功")
                .build();
    }

    /**
     * 构建草稿响应
     */
    private DraftSaveResponseDTO buildDraftResponse(PublishPost post) {
        return DraftSaveResponseDTO.builder()
                .draftId(post.getId().toString())
                .savedAt(post.getUpdateTime())
                .message("草稿")
                .build();
    }

    /**
     * 构建发布请求（从草稿恢复）
     */
    private PublishPostRequestDTO buildPublishRequest(PublishPost post) {
        PublishPostRequestDTO request = new PublishPostRequestDTO();
        request.setTitle(post.getTitle());
        request.setContent(post.getContent());
        
        // 从JSON恢复列表
        if (StringUtils.hasText(post.getMediaIds())) {
            List<String> mediaIds = JsonUtils.fromJson(post.getMediaIds(), List.class);
            request.setMediaIds(mediaIds);
        }
        
        if (StringUtils.hasText(post.getTopicIds())) {
            List<String> topicIds = JsonUtils.fromJson(post.getTopicIds(), List.class);
            request.setTopicIds(topicIds);
        }
        
        if (StringUtils.hasText(post.getLocationInfo())) {
            PublishPostRequestDTO.LocationDTO location = 
                JsonUtils.fromJson(post.getLocationInfo(), PublishPostRequestDTO.LocationDTO.class);
            request.setLocation(location);
        }
        
        request.setPrivacy(post.getPrivacy());
        
        PublishPostRequestDTO.PublishSettingsDTO settings = new PublishPostRequestDTO.PublishSettingsDTO();
        settings.setAllowComment(post.getAllowComment());
        settings.setAllowShare(post.getAllowShare());
        request.setSettings(settings);
        
        return request;
    }

    /**
     * 更新媒体文件关联
     */
    private void updateMediaPostRelation(List<String> mediaIds, Long postId) {
        if (mediaIds == null || mediaIds.isEmpty()) {
            return;
        }

        // 使用UpdateWrapper更新媒体文件的关联关系
        for (String mediaIdStr : mediaIds) {
            Long mediaId = Long.valueOf(mediaIdStr);
            UpdateWrapper<PublishMedia> updateWrapper = new UpdateWrapper<>();
            updateWrapper.eq("id", mediaId)
                        .set("post_id", postId)
                        .set("upload_status", "completed")
                        .set("update_time", LocalDateTime.now());
            
            publishMediaMapper.update(null, updateWrapper);
        }
    }

    /**
     * 更新话题统计
     */
    private void updateTopicStatistics(List<String> topicIds) {
        for (String topicIdStr : topicIds) {
            Long topicId = Long.valueOf(topicIdStr);
            
            // 使用UpdateWrapper增加话题的动态数量
            UpdateWrapper<PublishTopic> updateWrapper = new UpdateWrapper<>();
            updateWrapper.eq("id", topicId)
                        .setSql("post_count = post_count + 1")
                        .set("update_time", LocalDateTime.now());
            
            publishTopicMapper.update(null, updateWrapper);
        }
    }

    /**
     * 处理地点信息
     */
    private void processLocationInfo(PublishPostRequestDTO.LocationDTO location, Long postId) {
        // 查询或创建地点信息
        LambdaQueryWrapper<PublishLocation> queryWrapper = new LambdaQueryWrapper<>();
        queryWrapper.eq(PublishLocation::getLatitude, location.getLatitude())
                    .eq(PublishLocation::getLongitude, location.getLongitude())
                    .eq(PublishLocation::getDeleted, false);

        PublishLocation existingLocation = publishLocationMapper.selectOne(queryWrapper);
        
        if (existingLocation != null) {
            // 更新使用次数
            UpdateWrapper<PublishLocation> updateWrapper = new UpdateWrapper<>();
            updateWrapper.eq("id", existingLocation.getId())
                        .setSql("usage_count = usage_count + 1")
                        .set("update_time", LocalDateTime.now());
            
            publishLocationMapper.update(null, updateWrapper);
        } else {
            // 创建新地点
            PublishLocation newLocation = new PublishLocation();
            newLocation.setPoiName(location.getPoiName());
            newLocation.setAddress(location.getAddress());
            newLocation.setLatitude(location.getLatitude());
            newLocation.setLongitude(location.getLongitude());
            newLocation.setUsageCount(1);
            
            publishLocationMapper.insert(newLocation);
        }
    }

    /**
     * 增加浏览数
     */
    private void incrementViewCount(Long postId) {
        UpdateWrapper<PublishPost> updateWrapper = new UpdateWrapper<>();
        updateWrapper.eq("id", postId)
                    .setSql("view_count = view_count + 1");
        
        update(updateWrapper);
    }

    /**
     * 从请求更新草稿
     */
    private void updateDraftFromRequest(PublishPost draft, DraftSaveRequestDTO request) {
        if (StringUtils.hasText(request.getTitle())) {
            draft.setTitle(request.getTitle());
        }
        if (StringUtils.hasText(request.getContent())) {
            draft.setContent(request.getContent());
        }
        if (request.getMediaIds() != null) {
            draft.setMediaIds(JsonUtils.toJson(request.getMediaIds()));
        }
        if (request.getTopicIds() != null) {
            draft.setTopicIds(JsonUtils.toJson(request.getTopicIds()));
        }
        if (request.getLocation() != null) {
            draft.setLocationInfo(JsonUtils.toJson(request.getLocation()));
        }
        if (StringUtils.hasText(request.getPrivacy())) {
            draft.setPrivacy(request.getPrivacy());
        }
        if (request.getSettings() != null) {
            draft.setAllowComment(request.getSettings().getAllowComment());
            draft.setAllowShare(request.getSettings().getAllowShare());
        }
    }

    /**
     * 从请求创建草稿
     */
    private PublishPost createDraftFromRequest(DraftSaveRequestDTO request, Long userId) {
        PublishPost draft = new PublishPost();
        draft.setUserId(userId);
        draft.setTitle(request.getTitle());
        draft.setContent(request.getContent());
        
        if (request.getMediaIds() != null) {
            draft.setMediaIds(JsonUtils.toJson(request.getMediaIds()));
        }
        if (request.getTopicIds() != null) {
            draft.setTopicIds(JsonUtils.toJson(request.getTopicIds()));
        }
        if (request.getLocation() != null) {
            draft.setLocationInfo(JsonUtils.toJson(request.getLocation()));
        }
        
        draft.setPrivacy(request.getPrivacy() != null ? request.getPrivacy() : "public");
        
        if (request.getSettings() != null) {
            draft.setAllowComment(request.getSettings().getAllowComment());
            draft.setAllowShare(request.getSettings().getAllowShare());
        } else {
            draft.setAllowComment(true);
            draft.setAllowShare(true);
        }
        
        // 初始化统计数据
        draft.setLikeCount(0);
        draft.setCommentCount(0);
        draft.setShareCount(0);
        draft.setViewCount(0);
        draft.setHotScore(0.0);
        
        return draft;
    }
}
