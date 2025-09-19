/**
 * 瀑布流业务服务类
 * 基于通用组件架构核心标准 - 后端交互层
 * 使用 MyBatis Plus + QueryWrapper 架构
 * 
 * @version 2.0.0
 * @author 架构团队
 */

package com.xiangyu.discover.waterfall.service;

import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.baomidou.mybatisplus.core.conditions.update.UpdateWrapper;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;

import com.xiangyu.common.result.PageResult;
import com.xiangyu.common.utils.BeanCopyUtils;
import com.xiangyu.discover.waterfall.dto.*;
import com.xiangyu.discover.waterfall.entity.WaterfallContentEntity;
import com.xiangyu.discover.waterfall.mapper.WaterfallContentMapper;
import com.xiangyu.discover.waterfall.vo.*;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

/**
 * 瀑布流业务服务实现类
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class WaterfallService extends ServiceImpl<WaterfallContentMapper, WaterfallContentEntity> {

    private final WaterfallContentMapper waterfallContentMapper;
    
    // =====================================================
    // 内容查询服务
    // =====================================================

    /**
     * 分页查询瀑布流内容
     * 使用 QueryWrapper 构建复杂查询条件
     */
    @Cacheable(value = "waterfall:content", key = "#request.tabType + ':' + #request.page + ':' + #request.limit")
    public PageResult<WaterfallContentVO> getWaterfallContent(WaterfallContentQueryRequest request) {
        
        log.info("开始查询瀑布流内容: {}", request);
        
        // 1. 构建 QueryWrapper
        QueryWrapper<WaterfallContentEntity> queryWrapper = buildContentQueryWrapper(request);
        
        // 2. 构建分页对象
        Page<WaterfallContentEntity> page = new Page<>(request.getPage(), request.getLimit());
        
        // 3. 执行分页查询
        Page<WaterfallContentEntity> resultPage = waterfallContentMapper.selectPage(page, queryWrapper);
        
        // 4. 转换为 VO 对象
        List<WaterfallContentVO> contentVOList = resultPage.getRecords().stream()
                .map(this::convertToContentVO)
                .collect(Collectors.toList());
        
        // 5. 构建分页结果
        PageResult<WaterfallContentVO> pageResult = new PageResult<>();
        pageResult.setData(contentVOList);
        pageResult.setTotal(resultPage.getTotal());
        pageResult.setPage(request.getPage());
        pageResult.setLimit(request.getLimit());
        pageResult.setHasMore(request.getPage() < resultPage.getPages());
        
        log.info("查询完成: 返回{}条记录, 总计{}条", contentVOList.size(), resultPage.getTotal());
        
        return pageResult;
    }

    /**
     * 刷新瀑布流内容
     */
    @CacheEvict(value = "waterfall:content", allEntries = true)
    public WaterfallRefreshVO refreshWaterfallContent(WaterfallRefreshRequest request) {
        
        log.info("开始刷新瀑布流内容: {}", request);
        
        // 1. 构建查询条件 - 获取最新内容
        QueryWrapper<WaterfallContentEntity> queryWrapper = new QueryWrapper<>();
        queryWrapper.eq("status", WaterfallContentEntity.Status.PUBLISHED)
                   .eq("audit_status", WaterfallContentEntity.AuditStatus.PASSED)
                   .orderByDesc("created_at")
                   .last("LIMIT 20"); // 限制返回最新20条
        
        // 添加标签页类型过滤
        addTabTypeFilter(queryWrapper, request.getTabType(), request.getUserId(), 
                        request.getLatitude(), request.getLongitude());
        
        // 添加时间过滤 - 只获取上次刷新后的新内容
        if (request.getLastRefreshTime() != null) {
            queryWrapper.gt("created_at", request.getLastRefreshTime());
        }
        
        // 2. 执行查询
        List<WaterfallContentEntity> newContent = waterfallContentMapper.selectList(queryWrapper);
        
        // 3. 转换为 VO
        List<WaterfallContentVO> newContentVOList = newContent.stream()
                .map(this::convertToContentVO)
                .collect(Collectors.toList());
        
        // 4. 构建刷新结果
        WaterfallRefreshVO refreshVO = new WaterfallRefreshVO();
        refreshVO.setData(newContentVOList);
        refreshVO.setRefreshTime(LocalDateTime.now());
        refreshVO.setHasNewContent(!newContentVOList.isEmpty());
        refreshVO.setNewContentCount(newContentVOList.size());
        
        log.info("刷新完成: 获取到{}条新内容", newContentVOList.size());
        
        return refreshVO;
    }

    /**
     * 获取推荐内容
     */
    @Cacheable(value = "waterfall:recommend", key = "#userId + ':' + #count")
    public List<WaterfallContentVO> getRecommendedContent(String userId, Integer count) {
        
        log.info("获取推荐内容: userId={}, count={}", userId, count);
        
        // 1. 构建推荐查询条件
        QueryWrapper<WaterfallContentEntity> queryWrapper = new QueryWrapper<>();
        queryWrapper.eq("status", WaterfallContentEntity.Status.PUBLISHED)
                   .eq("audit_status", WaterfallContentEntity.AuditStatus.PASSED)
                   .eq("is_recommend", 1)
                   .orderByDesc("recommend_weight", "hot_score", "created_at")
                   .last("LIMIT " + count);
        
        // 2. 如果有用户ID，可以根据用户偏好进行个性化推荐
        if (StringUtils.hasText(userId)) {
            // 这里可以添加基于用户行为的个性化推荐逻辑
            // 例如：根据用户的点赞、关注等行为推荐相似内容
        }
        
        // 3. 执行查询
        List<WaterfallContentEntity> recommendedContent = waterfallContentMapper.selectList(queryWrapper);
        
        // 4. 转换为 VO
        List<WaterfallContentVO> recommendedVOList = recommendedContent.stream()
                .map(this::convertToContentVO)
                .collect(Collectors.toList());
        
        log.info("推荐内容获取完成: 返回{}条推荐", recommendedVOList.size());
        
        return recommendedVOList;
    }

    // =====================================================
    // 点赞相关服务
    // =====================================================

    /**
     * 点赞/取消点赞内容
     */
    @Transactional(rollbackFor = Exception.class)
    public WaterfallLikeVO likeContent(WaterfallLikeRequest request) {
        
        log.info("处理点赞操作: contentId={}, userId={}, isLike={}", 
                request.getContentId(), request.getUserId(), request.getIsLike());
        
        // 1. 验证内容是否存在
        WaterfallContentEntity content = waterfallContentMapper.selectById(request.getContentId());
        if (content == null) {
            throw new RuntimeException("内容不存在");
        }
        
        // 2. 处理点赞逻辑
        int likeCountChange = request.getIsLike() ? 1 : -1;
        
        // 使用 UpdateWrapper 更新点赞数
        UpdateWrapper<WaterfallContentEntity> updateWrapper = new UpdateWrapper<>();
        updateWrapper.eq("id", request.getContentId())
                    .setSql("like_count = like_count + " + likeCountChange)
                    .setSql("updated_at = NOW()");
        
        // 防止点赞数为负数
        if (!request.getIsLike()) {
            updateWrapper.gt("like_count", 0);
        }
        
        int updateResult = waterfallContentMapper.update(null, updateWrapper);
        
        if (updateResult == 0) {
            throw new RuntimeException("点赞操作失败");
        }
        
        // 3. 获取更新后的点赞数
        WaterfallContentEntity updatedContent = waterfallContentMapper.selectById(request.getContentId());
        
        // 4. 记录用户点赞行为 (这里可以异步处理)
        recordUserLikeBehavior(request);
        
        // 5. 构建返回结果
        WaterfallLikeVO likeVO = new WaterfallLikeVO();
        likeVO.setContentId(request.getContentId());
        likeVO.setIsLiked(request.getIsLike());
        likeVO.setLikeCount(updatedContent.getLikeCount());
        likeVO.setTimestamp(LocalDateTime.now());
        
        log.info("点赞操作完成: contentId={}, 当前点赞数={}", 
                request.getContentId(), updatedContent.getLikeCount());
        
        return likeVO;
    }

    /**
     * 批量点赞操作
     */
    @Transactional(rollbackFor = Exception.class)
    public WaterfallBatchLikeVO batchLikeContent(WaterfallBatchLikeRequest request) {
        
        log.info("处理批量点赞: userId={}, 操作数量={}", 
                request.getUserId(), request.getOperations().size());
        
        List<WaterfallBatchLikeVO.LikeOperationResult> results = new ArrayList<>();
        int successCount = 0;
        int failureCount = 0;
        
        // 逐个处理点赞操作
        for (WaterfallBatchLikeRequest.LikeOperation operation : request.getOperations()) {
            try {
                // 构建单个点赞请求
                WaterfallLikeRequest likeRequest = new WaterfallLikeRequest()
                        .setContentId(operation.getContentId())
                        .setUserId(request.getUserId())
                        .setIsLike(operation.getIsLike())
                        .setTabType(request.getTabType());
                
                // 执行点赞操作
                WaterfallLikeVO likeResult = likeContent(likeRequest);
                
                // 记录成功结果
                WaterfallBatchLikeVO.LikeOperationResult result = new WaterfallBatchLikeVO.LikeOperationResult();
                result.setContentId(operation.getContentId());
                result.setSuccess(true);
                result.setIsLiked(likeResult.getIsLiked());
                result.setLikeCount(likeResult.getLikeCount());
                
                results.add(result);
                successCount++;
                
            } catch (Exception e) {
                log.error("批量点赞操作失败: contentId={}, error={}", 
                         operation.getContentId(), e.getMessage());
                
                // 记录失败结果
                WaterfallBatchLikeVO.LikeOperationResult result = new WaterfallBatchLikeVO.LikeOperationResult();
                result.setContentId(operation.getContentId());
                result.setSuccess(false);
                result.setError(e.getMessage());
                
                results.add(result);
                failureCount++;
            }
        }
        
        // 构建批量操作结果
        WaterfallBatchLikeVO batchResult = new WaterfallBatchLikeVO();
        batchResult.setResults(results);
        batchResult.setSuccessCount(successCount);
        batchResult.setFailureCount(failureCount);
        
        log.info("批量点赞操作完成: 成功{}个, 失败{}个", successCount, failureCount);
        
        return batchResult;
    }

    /**
     * 获取内容点赞状态
     */
    public WaterfallLikeStatusVO getLikeStatus(String[] contentIds, String userId) {
        
        log.info("获取点赞状态: contentIds={}, userId={}", Arrays.toString(contentIds), userId);
        
        // 1. 查询内容信息
        QueryWrapper<WaterfallContentEntity> queryWrapper = new QueryWrapper<>();
        queryWrapper.in("id", Arrays.asList(contentIds))
                   .select("id", "like_count");
        
        List<WaterfallContentEntity> contents = waterfallContentMapper.selectList(queryWrapper);
        
        // 2. 查询用户点赞状态 (这里简化处理，实际应该查询用户点赞表)
        List<WaterfallLikeStatusVO.LikeStatus> statuses = contents.stream()
                .map(content -> {
                    WaterfallLikeStatusVO.LikeStatus status = new WaterfallLikeStatusVO.LikeStatus();
                    status.setContentId(content.getId());
                    status.setIsLiked(checkUserLikeStatus(content.getId(), userId)); // 模拟查询
                    status.setLikeCount(content.getLikeCount());
                    return status;
                })
                .collect(Collectors.toList());
        
        // 3. 构建返回结果
        WaterfallLikeStatusVO statusVO = new WaterfallLikeStatusVO();
        statusVO.setStatuses(statuses);
        
        log.info("获取点赞状态完成: 查询{}个内容", statuses.size());
        
        return statusVO;
    }

    // =====================================================
    // 分页和统计服务
    // =====================================================

    /**
     * 游标分页查询
     */
    public WaterfallCursorPageVO getCursorPaginatedContent(
            String tabType, String cursor, Integer limit, String direction, String userId) {
        
        log.info("游标分页查询: tabType={}, cursor={}, limit={}", tabType, cursor, limit);
        
        // 1. 构建基础查询条件
        QueryWrapper<WaterfallContentEntity> queryWrapper = new QueryWrapper<>();
        queryWrapper.eq("status", WaterfallContentEntity.Status.PUBLISHED)
                   .eq("audit_status", WaterfallContentEntity.AuditStatus.PASSED);
        
        // 2. 添加游标条件
        if (StringUtils.hasText(cursor)) {
            if ("forward".equals(direction)) {
                queryWrapper.lt("id", cursor); // 向前翻页
            } else {
                queryWrapper.gt("id", cursor); // 向后翻页
            }
        }
        
        // 3. 添加标签页过滤
        addTabTypeFilter(queryWrapper, tabType, userId, null, null);
        
        // 4. 排序和限制
        queryWrapper.orderByDesc("created_at", "id")
                   .last("LIMIT " + (limit + 1)); // 多查询一条用于判断是否还有更多
        
        // 5. 执行查询
        List<WaterfallContentEntity> contents = waterfallContentMapper.selectList(queryWrapper);
        
        // 6. 判断是否还有更多数据
        boolean hasMore = contents.size() > limit;
        if (hasMore) {
            contents = contents.subList(0, limit);
        }
        
        // 7. 转换为 VO
        List<WaterfallContentVO> contentVOList = contents.stream()
                .map(this::convertToContentVO)
                .collect(Collectors.toList());
        
        // 8. 构建游标分页结果
        WaterfallCursorPageVO cursorPageVO = new WaterfallCursorPageVO();
        cursorPageVO.setData(contentVOList);
        cursorPageVO.setCursor(cursor);
        cursorPageVO.setNextCursor(hasMore && !contents.isEmpty() ? 
                                  contents.get(contents.size() - 1).getId() : null);
        cursorPageVO.setHasMore(hasMore);
        cursorPageVO.setLimit(limit);
        
        log.info("游标分页查询完成: 返回{}条内容, hasMore={}", contentVOList.size(), hasMore);
        
        return cursorPageVO;
    }

    /**
     * 获取分页统计信息
     */
    @Cacheable(value = "waterfall:stats", key = "#request.tabType + ':' + #request.userId")
    public WaterfallStatsVO getPaginationStats(WaterfallStatsRequest request) {
        
        log.info("获取分页统计: {}", request);
        
        // 1. 构建统计查询条件
        QueryWrapper<WaterfallContentEntity> queryWrapper = new QueryWrapper<>();
        queryWrapper.eq("status", WaterfallContentEntity.Status.PUBLISHED)
                   .eq("audit_status", WaterfallContentEntity.AuditStatus.PASSED);
        
        // 添加时间范围过滤
        if (request.getStartTime() != null) {
            queryWrapper.ge("created_at", request.getStartTime());
        }
        if (request.getEndTime() != null) {
            queryWrapper.le("created_at", request.getEndTime());
        }
        
        // 2. 获取总数
        Long totalCount = waterfallContentMapper.selectCount(queryWrapper);
        
        // 3. 按内容类型统计
        Map<String, Long> contentDistribution = new HashMap<>();
        for (String contentType : Arrays.asList("image", "video", "live")) {
            QueryWrapper<WaterfallContentEntity> typeWrapper = queryWrapper.clone();
            typeWrapper.eq("content_type", contentType);
            Long typeCount = waterfallContentMapper.selectCount(typeWrapper);
            contentDistribution.put(contentType, typeCount);
        }
        
        // 4. 构建统计结果
        WaterfallStatsVO statsVO = new WaterfallStatsVO();
        statsVO.setTotalCount(totalCount);
        statsVO.setTotalPages((int) Math.ceil((double) totalCount / 20)); // 假设每页20条
        statsVO.setAveragePageSize(20);
        statsVO.setLastUpdated(LocalDateTime.now());
        statsVO.setContentDistribution(contentDistribution);
        
        log.info("分页统计获取完成: 总数={}", totalCount);
        
        return statsVO;
    }

    // =====================================================
    // 辅助方法
    // =====================================================

    /**
     * 构建内容查询 QueryWrapper
     */
    private QueryWrapper<WaterfallContentEntity> buildContentQueryWrapper(WaterfallContentQueryRequest request) {
        
        QueryWrapper<WaterfallContentEntity> queryWrapper = new QueryWrapper<>();
        
        // 基础过滤条件
        queryWrapper.eq("status", WaterfallContentEntity.Status.PUBLISHED)
                   .eq("audit_status", WaterfallContentEntity.AuditStatus.PASSED);
        
        // 内容类型过滤
        if (request.getContentTypes() != null && !request.getContentTypes().isEmpty()) {
            queryWrapper.in("content_type", request.getContentTypes());
        }
        
        // 点赞数范围过滤
        if (request.getMinLikeCount() != null) {
            queryWrapper.ge("like_count", request.getMinLikeCount());
        }
        if (request.getMaxLikeCount() != null) {
            queryWrapper.le("like_count", request.getMaxLikeCount());
        }
        
        // 时间范围过滤
        if (request.getStartTime() != null) {
            queryWrapper.ge("created_at", request.getStartTime());
        }
        if (request.getEndTime() != null) {
            queryWrapper.le("created_at", request.getEndTime());
        }
        
        // 标签页类型过滤
        addTabTypeFilter(queryWrapper, request.getTabType(), request.getUserId(), 
                        request.getLatitude(), request.getLongitude());
        
        // 排序
        addSortCondition(queryWrapper, request.getSortBy(), request.getSortOrder());
        
        return queryWrapper;
    }

    /**
     * 添加标签页类型过滤条件
     */
    private void addTabTypeFilter(QueryWrapper<WaterfallContentEntity> queryWrapper, 
                                 String tabType, String userId, BigDecimal latitude, BigDecimal longitude) {
        
        switch (tabType) {
            case "follow":
                // 关注页：只显示关注用户的内容
                if (StringUtils.hasText(userId)) {
                    // 这里应该关联查询用户关注表，简化处理
                    queryWrapper.exists("SELECT 1 FROM user_follow WHERE follower_id = {0} AND followed_id = user_id", userId);
                }
                break;
                
            case "local":
                // 本地页：显示附近的内容
                if (latitude != null && longitude != null) {
                    // 使用地理位置计算距离，这里简化处理
                    queryWrapper.isNotNull("latitude")
                               .isNotNull("longitude");
                    // 实际应该使用地理位置函数计算距离
                }
                break;
                
            case "hot":
            default:
                // 热门页：按热度排序
                queryWrapper.orderByDesc("hot_score");
                break;
        }
    }

    /**
     * 添加排序条件
     */
    private void addSortCondition(QueryWrapper<WaterfallContentEntity> queryWrapper, String sortBy, String sortOrder) {
        
        boolean isAsc = "asc".equals(sortOrder);
        
        switch (sortBy) {
            case "likes":
                if (isAsc) {
                    queryWrapper.orderByAsc("like_count");
                } else {
                    queryWrapper.orderByDesc("like_count");
                }
                break;
                
            case "comments":
                if (isAsc) {
                    queryWrapper.orderByAsc("comment_count");
                } else {
                    queryWrapper.orderByDesc("comment_count");
                }
                break;
                
            case "hot":
                if (isAsc) {
                    queryWrapper.orderByAsc("hot_score");
                } else {
                    queryWrapper.orderByDesc("hot_score");
                }
                break;
                
            case "created":
            default:
                if (isAsc) {
                    queryWrapper.orderByAsc("created_at");
                } else {
                    queryWrapper.orderByDesc("created_at");
                }
                break;
        }
    }

    /**
     * 转换实体为 VO 对象
     */
    private WaterfallContentVO convertToContentVO(WaterfallContentEntity entity) {
        WaterfallContentVO vo = BeanCopyUtils.copyBean(entity, WaterfallContentVO.class);
        
        // 设置用户信息
        WaterfallContentVO.UserInfo userInfo = new WaterfallContentVO.UserInfo();
        userInfo.setId(entity.getUserId());
        userInfo.setNickname(entity.getUserNickname());
        userInfo.setAvatar(entity.getUserAvatar());
        vo.setUser(userInfo);
        
        return vo;
    }

    /**
     * 记录用户点赞行为
     */
    private void recordUserLikeBehavior(WaterfallLikeRequest request) {
        // 这里可以异步记录用户行为，用于推荐算法
        log.debug("记录用户点赞行为: userId={}, contentId={}, isLike={}", 
                 request.getUserId(), request.getContentId(), request.getIsLike());
    }

    /**
     * 检查用户点赞状态
     */
    private Boolean checkUserLikeStatus(String contentId, String userId) {
        // 这里应该查询用户点赞表，简化处理返回随机结果
        return Math.random() > 0.5;
    }
}
