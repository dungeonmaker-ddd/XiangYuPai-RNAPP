/**
 * 发现模块Service实现类
 * 业务服务实现 - 使用QueryWrapper/LambdaQueryWrapper进行数据库查询
 * 
 * 包含：内容服务实现、互动服务实现、位置服务实现
 */

package com.xiangyupai.discover.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.baomidou.mybatisplus.core.conditions.update.LambdaUpdateWrapper;
import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.xiangyupai.common.util.BeanUtils;
import com.xiangyupai.discover.dto.*;
import com.xiangyupai.discover.entity.*;
import com.xiangyupai.discover.mapper.*;
import com.xiangyupai.discover.query.DiscoverQueryBuilder;
import com.xiangyupai.discover.service.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.CollectionUtils;
import org.springframework.util.StringUtils;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

/**
 * 发现内容服务实现类
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class DiscoverContentServiceImpl implements DiscoverContentService {

    private final DiscoverContentMapper discoverContentMapper;
    private final UserInfoMapper userInfoMapper;
    private final UserInteractionMapper userInteractionMapper;
    private final UserFollowMapper userFollowMapper;
    private final MerchantInfoMapper merchantInfoMapper;
    private final DiscoverQueryBuilder discoverQueryBuilder;

    @Override
    public ContentListResponseDTO getContentList(ContentListRequestDTO request) {
        switch (request.getTab()) {
            case "hot":
                return getHotContentList(request);
            case "follow":
                return getFollowContentList(request);
            case "local":
                return getLocalContentList(request);
            default:
                throw new IllegalArgumentException("不支持的Tab类型: " + request.getTab());
        }
    }

    @Override
    public ContentListResponseDTO getHotContentList(ContentListRequestDTO request) {
        try {
            log.info("查询热门内容，参数：{}", request);
            
            // 使用QueryBuilder构建复杂查询
            IPage<DiscoverContentEntity> page = discoverQueryBuilder.buildHotContentQuery(request);
            
            // 转换为DTO
            List<ContentItemDTO> contentList = convertToContentItemDTOs(page.getRecords(), request.getUserId(), "hot");
            
            // 构建响应
            ContentListResponseDTO response = new ContentListResponseDTO();
            response.setList(contentList);
            response.setPagination(buildPaginationDTO(page));
            response.setNextCursor(buildNextCursor(page));
            
            log.info("查询热门内容完成，返回{}条数据", contentList.size());
            return response;
            
        } catch (Exception e) {
            log.error("查询热门内容失败", e);
            throw new RuntimeException("查询热门内容失败：" + e.getMessage());
        }
    }

    @Override
    public ContentListResponseDTO getFollowContentList(ContentListRequestDTO request) {
        try {
            log.info("查询关注内容，用户：{}，参数：{}", request.getUserId(), request);
            
            if (!StringUtils.hasText(request.getUserId())) {
                throw new IllegalArgumentException("查询关注内容需要用户ID");
            }
            
            // 先查询用户关注列表
            LambdaQueryWrapper<UserFollowEntity> followQueryWrapper = new LambdaQueryWrapper<>();
            followQueryWrapper.eq(UserFollowEntity::getFollowerId, request.getUserId())
                    .eq(UserFollowEntity::getStatus, 1) // 已关注状态
                    .select(UserFollowEntity::getFollowingId);
            
            List<UserFollowEntity> followList = userFollowMapper.selectList(followQueryWrapper);
            
            if (CollectionUtils.isEmpty(followList)) {
                // 没有关注任何用户，返回空列表
                return buildEmptyResponse();
            }
            
            List<String> followingUserIds = followList.stream()
                    .map(UserFollowEntity::getFollowingId)
                    .collect(Collectors.toList());
            
            // 查询关注用户的内容
            IPage<DiscoverContentEntity> page = discoverQueryBuilder.buildFollowContentQuery(request, followingUserIds);
            
            // 转换为DTO
            List<ContentItemDTO> contentList = convertToContentItemDTOs(page.getRecords(), request.getUserId(), "follow");
            
            // 构建响应
            ContentListResponseDTO response = new ContentListResponseDTO();
            response.setList(contentList);
            response.setPagination(buildPaginationDTO(page));
            response.setNextCursor(buildNextCursor(page));
            
            log.info("查询关注内容完成，返回{}条数据", contentList.size());
            return response;
            
        } catch (Exception e) {
            log.error("查询关注内容失败", e);
            throw new RuntimeException("查询关注内容失败：" + e.getMessage());
        }
    }

    @Override
    public ContentListResponseDTO getLocalContentList(ContentListRequestDTO request) {
        try {
            log.info("查询同城内容，位置：{},{}, 参数：{}", 
                    request.getLatitude(), request.getLongitude(), request);
            
            if (request.getLatitude() == null || request.getLongitude() == null) {
                throw new IllegalArgumentException("查询同城内容需要位置信息");
            }
            
            // 使用QueryBuilder构建基于地理位置的查询
            IPage<DiscoverContentEntity> page = discoverQueryBuilder.buildLocalContentQuery(request);
            
            // 转换为DTO
            List<ContentItemDTO> contentList = convertToContentItemDTOs(page.getRecords(), request.getUserId(), "local");
            
            // 计算距离并设置位置相关信息
            contentList.forEach(content -> {
                if (content.getLocation() != null) {
                    Double distance = calculateDistance(
                            request.getLatitude().doubleValue(),
                            request.getLongitude().doubleValue(),
                            content.getLocation().getLatitude().doubleValue(),
                            content.getLocation().getLongitude().doubleValue()
                    );
                    content.setDistance(BigDecimal.valueOf(distance));
                }
            });
            
            // 构建响应
            ContentListResponseDTO response = new ContentListResponseDTO();
            response.setList(contentList);
            response.setPagination(buildPaginationDTO(page));
            response.setNextCursor(buildNextCursor(page));
            
            log.info("查询同城内容完成，返回{}条数据", contentList.size());
            return response;
            
        } catch (Exception e) {
            log.error("查询同城内容失败", e);
            throw new RuntimeException("查询同城内容失败：" + e.getMessage());
        }
    }

    @Override
    public UserInfoDTO getUserInfo(String userId, String currentUserId) {
        try {
            // 查询用户基本信息
            UserInfoEntity userEntity = userInfoMapper.selectById(userId);
            if (userEntity == null) {
                throw new IllegalArgumentException("用户不存在");
            }
            
            UserInfoDTO userInfo = BeanUtils.copyProperties(userEntity, UserInfoDTO.class);
            userInfo.setId(userEntity.getUserId());
            
            // 检查当前用户是否已关注该用户
            if (StringUtils.hasText(currentUserId) && !currentUserId.equals(userId)) {
                LambdaQueryWrapper<UserFollowEntity> queryWrapper = new LambdaQueryWrapper<>();
                queryWrapper.eq(UserFollowEntity::getFollowerId, currentUserId)
                        .eq(UserFollowEntity::getFollowingId, userId)
                        .eq(UserFollowEntity::getStatus, 1);
                
                UserFollowEntity followEntity = userFollowMapper.selectOne(queryWrapper);
                userInfo.setIsFollowed(followEntity != null);
            } else {
                userInfo.setIsFollowed(false);
            }
            
            return userInfo;
            
        } catch (Exception e) {
            log.error("获取用户信息失败，用户ID：{}", userId, e);
            throw new RuntimeException("获取用户信息失败：" + e.getMessage());
        }
    }

    @Override
    public List<ContentItemDTO> batchGetContentDetails(List<String> contentIds, String currentUserId) {
        if (CollectionUtils.isEmpty(contentIds)) {
            return new ArrayList<>();
        }
        
        try {
            // 批量查询内容
            LambdaQueryWrapper<DiscoverContentEntity> queryWrapper = new LambdaQueryWrapper<>();
            queryWrapper.in(DiscoverContentEntity::getContentId, contentIds)
                    .eq(DiscoverContentEntity::getStatus, 1) // 已发布状态
                    .eq(DiscoverContentEntity::getAuditStatus, 1); // 审核通过
            
            List<DiscoverContentEntity> contentEntities = discoverContentMapper.selectList(queryWrapper);
            
            return convertToContentItemDTOs(contentEntities, currentUserId, "batch");
            
        } catch (Exception e) {
            log.error("批量获取内容详情失败", e);
            throw new RuntimeException("批量获取内容详情失败：" + e.getMessage());
        }
    }

    @Override
    @Transactional
    public void incrementViewCount(String contentId, String userId) {
        try {
            // 增加浏览量
            LambdaUpdateWrapper<DiscoverContentEntity> updateWrapper = new LambdaUpdateWrapper<>();
            updateWrapper.eq(DiscoverContentEntity::getContentId, contentId)
                    .setSql("view_count = view_count + 1");
            
            discoverContentMapper.update(null, updateWrapper);
            
            // 记录浏览行为
            if (StringUtils.hasText(userId)) {
                UserInteractionEntity interaction = new UserInteractionEntity();
                interaction.setUserId(userId);
                interaction.setContentId(contentId);
                interaction.setInteractionType(5); // 浏览类型
                interaction.setStatus(1);
                interaction.setSource(1); // 默认来源
                
                userInteractionMapper.insert(interaction);
            }
            
        } catch (Exception e) {
            log.error("增加浏览量失败，内容ID：{}", contentId, e);
        }
    }

    @Override
    public List<ContentItemDTO> getRecommendedContent(String userId, String tab, Integer limit) {
        try {
            // 基于用户行为和偏好的推荐算法
            // 这里可以集成机器学习推荐系统
            
            ContentListRequestDTO request = new ContentListRequestDTO();
            request.setTab(tab);
            request.setUserId(userId);
            request.setPage(1);
            request.setSize(limit);
            request.setSortBy("hot");
            
            ContentListResponseDTO response = getContentList(request);
            return response.getList();
            
        } catch (Exception e) {
            log.error("获取推荐内容失败", e);
            return new ArrayList<>();
        }
    }

    @Override
    @Transactional
    public void updateHotScore(String contentId) {
        try {
            // 热度分数计算算法
            // 热度 = 点赞数 * 2 + 评论数 * 3 + 分享数 * 5 + 浏览数 * 0.1 - 时间衰减
            
            DiscoverContentEntity content = discoverContentMapper.selectById(contentId);
            if (content == null) return;
            
            // 计算基础分数
            double baseScore = content.getLikeCount() * 2.0 
                    + content.getCommentCount() * 3.0 
                    + content.getShareCount() * 5.0 
                    + content.getViewCount() * 0.1;
            
            // 时间衰减因子
            long hoursAgo = java.time.Duration.between(content.getCreatedAt(), LocalDateTime.now()).toHours();
            double timeDecay = Math.exp(-hoursAgo / 24.0); // 24小时衰减因子
            
            double finalScore = baseScore * timeDecay;
            
            // 更新热度分数
            LambdaUpdateWrapper<DiscoverContentEntity> updateWrapper = new LambdaUpdateWrapper<>();
            updateWrapper.eq(DiscoverContentEntity::getContentId, contentId)
                    .set(DiscoverContentEntity::getHotScore, BigDecimal.valueOf(finalScore));
            
            discoverContentMapper.update(null, updateWrapper);
            
        } catch (Exception e) {
            log.error("更新热度分数失败，内容ID：{}", contentId, e);
        }
    }

    @Override
    public boolean isContentExists(String contentId) {
        LambdaQueryWrapper<DiscoverContentEntity> queryWrapper = new LambdaQueryWrapper<>();
        queryWrapper.eq(DiscoverContentEntity::getContentId, contentId)
                .eq(DiscoverContentEntity::getStatus, 1);
        
        return discoverContentMapper.selectCount(queryWrapper) > 0;
    }

    // 私有辅助方法

    /**
     * 转换为ContentItemDTO列表
     */
    private List<ContentItemDTO> convertToContentItemDTOs(List<DiscoverContentEntity> entities, String currentUserId, String tabType) {
        if (CollectionUtils.isEmpty(entities)) {
            return new ArrayList<>();
        }
        
        // 获取所有用户ID
        List<String> userIds = entities.stream()
                .map(DiscoverContentEntity::getUserId)
                .distinct()
                .collect(Collectors.toList());
        
        // 批量查询用户信息
        LambdaQueryWrapper<UserInfoEntity> userQueryWrapper = new LambdaQueryWrapper<>();
        userQueryWrapper.in(UserInfoEntity::getUserId, userIds);
        List<UserInfoEntity> userEntities = userInfoMapper.selectList(userQueryWrapper);
        Map<String, UserInfoEntity> userMap = userEntities.stream()
                .collect(Collectors.toMap(UserInfoEntity::getUserId, user -> user));
        
        // 批量查询用户互动状态
        Map<String, Boolean> likeStatusMap = new java.util.HashMap<>();
        Map<String, Boolean> collectStatusMap = new java.util.HashMap<>();
        Map<String, Boolean> followStatusMap = new java.util.HashMap<>();
        
        if (StringUtils.hasText(currentUserId)) {
            // 查询点赞状态
            List<String> contentIds = entities.stream()
                    .map(DiscoverContentEntity::getContentId)
                    .collect(Collectors.toList());
            
            LambdaQueryWrapper<UserInteractionEntity> likeQueryWrapper = new LambdaQueryWrapper<>();
            likeQueryWrapper.eq(UserInteractionEntity::getUserId, currentUserId)
                    .in(UserInteractionEntity::getContentId, contentIds)
                    .eq(UserInteractionEntity::getInteractionType, 1) // 点赞
                    .eq(UserInteractionEntity::getStatus, 1);
            
            List<UserInteractionEntity> likeInteractions = userInteractionMapper.selectList(likeQueryWrapper);
            likeStatusMap = likeInteractions.stream()
                    .collect(Collectors.toMap(
                            UserInteractionEntity::getContentId, 
                            interaction -> true
                    ));
            
            // 查询收藏状态
            LambdaQueryWrapper<UserInteractionEntity> collectQueryWrapper = new LambdaQueryWrapper<>();
            collectQueryWrapper.eq(UserInteractionEntity::getUserId, currentUserId)
                    .in(UserInteractionEntity::getContentId, contentIds)
                    .eq(UserInteractionEntity::getInteractionType, 2) // 收藏
                    .eq(UserInteractionEntity::getStatus, 1);
            
            List<UserInteractionEntity> collectInteractions = userInteractionMapper.selectList(collectQueryWrapper);
            collectStatusMap = collectInteractions.stream()
                    .collect(Collectors.toMap(
                            UserInteractionEntity::getContentId, 
                            interaction -> true
                    ));
            
            // 查询关注状态
            LambdaQueryWrapper<UserFollowEntity> followQueryWrapper = new LambdaQueryWrapper<>();
            followQueryWrapper.eq(UserFollowEntity::getFollowerId, currentUserId)
                    .in(UserFollowEntity::getFollowingId, userIds)
                    .eq(UserFollowEntity::getStatus, 1);
            
            List<UserFollowEntity> followRelations = userFollowMapper.selectList(followQueryWrapper);
            followStatusMap = followRelations.stream()
                    .collect(Collectors.toMap(
                            UserFollowEntity::getFollowingId, 
                            follow -> true
                    ));
        }
        
        // 转换为DTO
        List<ContentItemDTO> result = new ArrayList<>();
        for (DiscoverContentEntity entity : entities) {
            ContentItemDTO dto = convertToContentItemDTO(entity, userMap.get(entity.getUserId()), currentUserId, tabType);
            
            // 设置互动状态
            dto.setIsLiked(likeStatusMap.getOrDefault(entity.getContentId(), false));
            dto.setIsCollected(collectStatusMap.getOrDefault(entity.getContentId(), false));
            
            if (dto.getAuthor() != null) {
                dto.getAuthor().setIsFollowed(followStatusMap.getOrDefault(entity.getUserId(), false));
            }
            
            result.add(dto);
        }
        
        return result;
    }

    /**
     * 转换单个ContentItemDTO
     */
    private ContentItemDTO convertToContentItemDTO(DiscoverContentEntity entity, UserInfoEntity userEntity, String currentUserId, String tabType) {
        ContentItemDTO dto = BeanUtils.copyProperties(entity, ContentItemDTO.class);
        dto.setId(entity.getContentId());
        dto.setType(entity.getContentType());
        
        // 处理图片列表
        if (StringUtils.hasText(entity.getImages())) {
            List<String> imageList = com.alibaba.fastjson.JSON.parseArray(entity.getImages(), String.class);
            dto.setImages(imageList);
        }
        
        // 设置用户信息
        if (userEntity != null) {
            UserInfoDTO authorDTO = BeanUtils.copyProperties(userEntity, UserInfoDTO.class);
            authorDTO.setId(userEntity.getUserId());
            dto.setAuthor(authorDTO);
        }
        
        // 设置位置信息（同城Tab）
        if ("local".equals(tabType) && entity.getLatitude() != null && entity.getLongitude() != null) {
            LocationInfoDTO locationDTO = new LocationInfoDTO();
            locationDTO.setLatitude(entity.getLatitude());
            locationDTO.setLongitude(entity.getLongitude());
            locationDTO.setAddress(entity.getAddress());
            locationDTO.setCity(entity.getCity());
            locationDTO.setDistrict(entity.getDistrict());
            dto.setLocation(locationDTO);
            
            // 设置商家信息
            if (StringUtils.hasText(entity.getMerchantId())) {
                MerchantInfoEntity merchantEntity = merchantInfoMapper.selectById(entity.getMerchantId());
                if (merchantEntity != null) {
                    MerchantInfoDTO merchantDTO = BeanUtils.copyProperties(merchantEntity, MerchantInfoDTO.class);
                    merchantDTO.setId(merchantEntity.getMerchantId());
                    dto.setMerchantInfo(merchantDTO);
                }
            }
        }
        
        // 设置热门信息（热门Tab）
        if ("hot".equals(tabType)) {
            dto.setHotScore(entity.getHotScore());
        }
        
        // 设置关注信息（关注Tab）
        if ("follow".equals(tabType)) {
            // 可以设置关注时间等信息
            dto.setIsNewContent(isNewContent(entity.getCreatedAt()));
        }
        
        return dto;
    }

    /**
     * 构建分页信息
     */
    private PaginationDTO buildPaginationDTO(IPage<?> page) {
        PaginationDTO pagination = new PaginationDTO();
        pagination.setCurrentPage((int) page.getCurrent());
        pagination.setPageSize((int) page.getSize());
        pagination.setTotal(page.getTotal());
        pagination.setTotalPages((int) page.getPages());
        pagination.setHasMore(page.getCurrent() < page.getPages());
        return pagination;
    }

    /**
     * 构建下一页游标
     */
    private String buildNextCursor(IPage<DiscoverContentEntity> page) {
        if (page.getCurrent() >= page.getPages()) {
            return null;
        }
        
        List<DiscoverContentEntity> records = page.getRecords();
        if (CollectionUtils.isEmpty(records)) {
            return null;
        }
        
        // 使用最后一条记录的ID作为游标
        return records.get(records.size() - 1).getContentId();
    }

    /**
     * 构建空响应
     */
    private ContentListResponseDTO buildEmptyResponse() {
        ContentListResponseDTO response = new ContentListResponseDTO();
        response.setList(new ArrayList<>());
        
        PaginationDTO pagination = new PaginationDTO();
        pagination.setCurrentPage(1);
        pagination.setPageSize(20);
        pagination.setTotal(0L);
        pagination.setTotalPages(0);
        pagination.setHasMore(false);
        response.setPagination(pagination);
        
        return response;
    }

    /**
     * 计算两点间距离（公里）
     */
    private Double calculateDistance(Double lat1, Double lon1, Double lat2, Double lon2) {
        final double R = 6371; // 地球半径，公里
        
        double latDistance = Math.toRadians(lat2 - lat1);
        double lonDistance = Math.toRadians(lon2 - lon1);
        
        double a = Math.sin(latDistance / 2) * Math.sin(latDistance / 2)
                + Math.cos(Math.toRadians(lat1)) * Math.cos(Math.toRadians(lat2))
                * Math.sin(lonDistance / 2) * Math.sin(lonDistance / 2);
        
        double c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        
        return R * c;
    }

    /**
     * 判断是否为新内容（24小时内）
     */
    private Boolean isNewContent(LocalDateTime createdAt) {
        return createdAt.isAfter(LocalDateTime.now().minusHours(24));
    }
}
