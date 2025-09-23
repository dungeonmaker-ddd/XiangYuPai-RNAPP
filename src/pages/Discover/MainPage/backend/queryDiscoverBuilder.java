/**
 * 发现模块查询构建器
 * 查询构建器 - 复杂查询封装工具
 * 
 * 包含：热门查询、关注查询、同城查询的复杂逻辑封装
 */

package com.xiangyupai.discover.query;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.xiangyupai.discover.dto.ContentListRequestDTO;
import com.xiangyupai.discover.entity.DiscoverContentEntity;
import com.xiangyupai.discover.mapper.DiscoverContentMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;
import org.springframework.util.CollectionUtils;
import org.springframework.util.StringUtils;

import java.time.LocalDateTime;
import java.util.List;

/**
 * 发现查询构建器
 * 
 * 功能：封装复杂查询逻辑，支持查询复用和优化
 */
@Component
@RequiredArgsConstructor
@Slf4j
public class DiscoverQueryBuilder {

    private final DiscoverContentMapper discoverContentMapper;

    /**
     * 构建热门内容查询
     * 
     * @param request 查询请求参数
     * @return 热门内容分页结果
     */
    public IPage<DiscoverContentEntity> buildHotContentQuery(ContentListRequestDTO request) {
        log.info("构建热门内容查询，参数：{}", request);
        
        Page<DiscoverContentEntity> page = new Page<>(request.getPage(), request.getSize());
        
        // 优先使用自定义SQL查询（包含复杂排序逻辑）
        if (hasComplexConditions(request)) {
            return discoverContentMapper.selectHotContentWithPagination(
                    page, 
                    request.getUserId(), 
                    request.getContentTypes(), 
                    request.getTimeRange()
            );
        }
        
        // 简单查询使用QueryWrapper
        LambdaQueryWrapper<DiscoverContentEntity> queryWrapper = new LambdaQueryWrapper<>();
        
        // 基础条件
        queryWrapper.eq(DiscoverContentEntity::getStatus, 1) // 已发布
                   .eq(DiscoverContentEntity::getAuditStatus, 1); // 审核通过
        
        // 内容类型过滤
        if (!CollectionUtils.isEmpty(request.getContentTypes())) {
            queryWrapper.in(DiscoverContentEntity::getContentType, request.getContentTypes());
        }
        
        // 时间范围过滤
        applyTimeRangeFilter(queryWrapper, request.getTimeRange());
        
        // 排序逻辑
        applyHotSortOrder(queryWrapper, request.getSortBy());
        
        return discoverContentMapper.selectPage(page, queryWrapper);
    }

    /**
     * 构建关注用户内容查询
     * 
     * @param request 查询请求参数
     * @param followingUserIds 关注的用户ID列表
     * @return 关注内容分页结果
     */
    public IPage<DiscoverContentEntity> buildFollowContentQuery(ContentListRequestDTO request, List<String> followingUserIds) {
        log.info("构建关注内容查询，关注用户数量：{}", followingUserIds.size());
        
        if (CollectionUtils.isEmpty(followingUserIds)) {
            // 返回空结果
            return new Page<>(request.getPage(), request.getSize());
        }
        
        Page<DiscoverContentEntity> page = new Page<>(request.getPage(), request.getSize());
        
        // 使用自定义SQL查询（包含关注时间等信息）
        if (request.getContentTypes() != null && !request.getContentTypes().isEmpty()) {
            return discoverContentMapper.selectFollowContentWithPagination(
                    page,
                    request.getUserId(),
                    followingUserIds,
                    request.getContentTypes()
            );
        }
        
        // 简单查询使用QueryWrapper
        LambdaQueryWrapper<DiscoverContentEntity> queryWrapper = new LambdaQueryWrapper<>();
        
        // 基础条件
        queryWrapper.eq(DiscoverContentEntity::getStatus, 1)
                   .eq(DiscoverContentEntity::getAuditStatus, 1)
                   .in(DiscoverContentEntity::getUserId, followingUserIds);
        
        // 时间范围过滤
        applyTimeRangeFilter(queryWrapper, request.getTimeRange());
        
        // 关注内容排序：时间倒序为主
        queryWrapper.orderByDesc(DiscoverContentEntity::getCreatedAt);
        
        return discoverContentMapper.selectPage(page, queryWrapper);
    }

    /**
     * 构建同城内容查询
     * 
     * @param request 查询请求参数
     * @return 同城内容分页结果
     */
    public IPage<DiscoverContentEntity> buildLocalContentQuery(ContentListRequestDTO request) {
        log.info("构建同城内容查询，位置：{},{}, 半径：{}km", 
                request.getLatitude(), request.getLongitude(), request.getRadius());
        
        Page<DiscoverContentEntity> page = new Page<>(request.getPage(), request.getSize());
        
        // 同城查询必须使用自定义SQL（包含距离计算）
        return discoverContentMapper.selectLocalContentWithPagination(
                page,
                request.getLatitude(),
                request.getLongitude(),
                request.getRadius(),
                request.getContentTypes(),
                request.getSortBy()
        );
    }

    /**
     * 构建用户内容查询（用户主页）
     * 
     * @param userId 用户ID
     * @param currentUserId 当前查看用户ID
     * @param page 分页参数
     * @return 用户内容分页结果
     */
    public IPage<DiscoverContentEntity> buildUserContentQuery(String userId, String currentUserId, Page<DiscoverContentEntity> page) {
        LambdaQueryWrapper<DiscoverContentEntity> queryWrapper = new LambdaQueryWrapper<>();
        
        queryWrapper.eq(DiscoverContentEntity::getUserId, userId)
                   .eq(DiscoverContentEntity::getStatus, 1);
        
        // 如果是查看自己的内容，可以看到审核中的内容
        if (!userId.equals(currentUserId)) {
            queryWrapper.eq(DiscoverContentEntity::getAuditStatus, 1);
        }
        
        // 按发布时间倒序
        queryWrapper.orderByDesc(DiscoverContentEntity::getCreatedAt);
        
        return discoverContentMapper.selectPage(page, queryWrapper);
    }

    /**
     * 构建推荐内容查询
     * 
     * @param userId 用户ID
     * @param excludeContentIds 排除的内容ID列表
     * @param tags 用户兴趣标签
     * @param limit 限制数量
     * @return 推荐内容列表
     */
    public List<DiscoverContentEntity> buildRecommendContentQuery(String userId, List<String> excludeContentIds, 
                                                                List<String> tags, int limit) {
        log.info("构建推荐内容查询，用户：{}, 兴趣标签：{}", userId, tags);
        
        if (!CollectionUtils.isEmpty(tags)) {
            // 基于标签的推荐
            return discoverContentMapper.selectContentByTags(tags, limit);
        }
        
        // fallback到热门内容
        LambdaQueryWrapper<DiscoverContentEntity> queryWrapper = new LambdaQueryWrapper<>();
        
        queryWrapper.eq(DiscoverContentEntity::getStatus, 1)
                   .eq(DiscoverContentEntity::getAuditStatus, 1);
        
        // 排除已查看的内容
        if (!CollectionUtils.isEmpty(excludeContentIds)) {
            queryWrapper.notIn(DiscoverContentEntity::getContentId, excludeContentIds);
        }
        
        queryWrapper.orderByDesc(DiscoverContentEntity::getHotScore)
                   .orderByDesc(DiscoverContentEntity::getCreatedAt)
                   .last("LIMIT " + limit);
        
        return discoverContentMapper.selectList(queryWrapper);
    }

    /**
     * 构建搜索内容查询
     * 
     * @param keyword 搜索关键词
     * @param contentTypes 内容类型
     * @param sortBy 排序方式
     * @param page 分页参数
     * @return 搜索结果分页
     */
    public IPage<DiscoverContentEntity> buildSearchContentQuery(String keyword, List<String> contentTypes, 
                                                              String sortBy, Page<DiscoverContentEntity> page) {
        QueryWrapper<DiscoverContentEntity> queryWrapper = new QueryWrapper<>();
        
        // 基础条件
        queryWrapper.eq("status", 1)
                   .eq("audit_status", 1);
        
        // 关键词搜索（标题和描述）
        if (StringUtils.hasText(keyword)) {
            queryWrapper.and(wrapper -> 
                wrapper.like("title", keyword)
                       .or()
                       .like("description", keyword)
            );
        }
        
        // 内容类型过滤
        if (!CollectionUtils.isEmpty(contentTypes)) {
            queryWrapper.in("content_type", contentTypes);
        }
        
        // 排序
        switch (sortBy) {
            case "new":
                queryWrapper.orderByDesc("created_at");
                break;
            case "hot":
                queryWrapper.orderByDesc("hot_score", "created_at");
                break;
            default:
                queryWrapper.orderByDesc("hot_score", "created_at");
        }
        
        return discoverContentMapper.selectPage(page, queryWrapper);
    }

    /**
     * 构建内容统计查询
     * 
     * @param contentIds 内容ID列表
     * @return 内容统计信息
     */
    public List<DiscoverContentEntity> buildContentStatsQuery(List<String> contentIds) {
        if (CollectionUtils.isEmpty(contentIds)) {
            return List.of();
        }
        
        LambdaQueryWrapper<DiscoverContentEntity> queryWrapper = new LambdaQueryWrapper<>();
        
        queryWrapper.in(DiscoverContentEntity::getContentId, contentIds)
                   .select(DiscoverContentEntity::getContentId,
                          DiscoverContentEntity::getLikeCount,
                          DiscoverContentEntity::getCollectCount,
                          DiscoverContentEntity::getCommentCount,
                          DiscoverContentEntity::getShareCount,
                          DiscoverContentEntity::getViewCount);
        
        return discoverContentMapper.selectList(queryWrapper);
    }

    // 私有辅助方法

    /**
     * 检查是否有复杂查询条件
     */
    private boolean hasComplexConditions(ContentListRequestDTO request) {
        return !CollectionUtils.isEmpty(request.getContentTypes()) 
                || StringUtils.hasText(request.getTimeRange()) && !"all".equals(request.getTimeRange())
                || StringUtils.hasText(request.getUserId()); // 个性化推荐
    }

    /**
     * 应用时间范围过滤
     */
    private void applyTimeRangeFilter(LambdaQueryWrapper<DiscoverContentEntity> queryWrapper, String timeRange) {
        if (!StringUtils.hasText(timeRange) || "all".equals(timeRange)) {
            return;
        }
        
        LocalDateTime now = LocalDateTime.now();
        LocalDateTime startTime;
        
        switch (timeRange) {
            case "today":
                startTime = now.toLocalDate().atStartOfDay();
                break;
            case "week":
                startTime = now.minusWeeks(1);
                break;
            case "month":
                startTime = now.minusMonths(1);
                break;
            default:
                return;
        }
        
        queryWrapper.ge(DiscoverContentEntity::getCreatedAt, startTime);
    }

    /**
     * 应用热门排序规则
     */
    private void applyHotSortOrder(LambdaQueryWrapper<DiscoverContentEntity> queryWrapper, String sortBy) {
        switch (sortBy) {
            case "new":
                queryWrapper.orderByDesc(DiscoverContentEntity::getCreatedAt);
                break;
            case "hot":
            default:
                queryWrapper.orderByDesc(DiscoverContentEntity::getHotScore)
                           .orderByDesc(DiscoverContentEntity::getCreatedAt);
        }
    }

    /**
     * 构建距离查询条件
     * 
     * @param queryWrapper 查询包装器
     * @param latitude 纬度
     * @param longitude 经度
     * @param radius 半径（公里）
     */
    private void applyDistanceFilter(QueryWrapper<DiscoverContentEntity> queryWrapper, 
                                   Double latitude, Double longitude, Integer radius) {
        if (latitude == null || longitude == null || radius == null) {
            return;
        }
        
        // 使用Haversine公式计算距离
        String distanceFormula = String.format(
                "(6371 * acos(cos(radians(%f)) * cos(radians(latitude)) * " +
                "cos(radians(longitude) - radians(%f)) + " +
                "sin(radians(%f)) * sin(radians(latitude)))) <= %d",
                latitude, longitude, latitude, radius
        );
        
        queryWrapper.apply(distanceFormula);
    }

    /**
     * 构建个性化推荐查询
     * 
     * @param userId 用户ID
     * @param userInterests 用户兴趣标签
     * @param userBehavior 用户行为数据
     * @return 个性化查询条件
     */
    public LambdaQueryWrapper<DiscoverContentEntity> buildPersonalizedQuery(String userId, 
                                                                           List<String> userInterests,
                                                                           Map<String, Object> userBehavior) {
        LambdaQueryWrapper<DiscoverContentEntity> queryWrapper = new LambdaQueryWrapper<>();
        
        // 基础条件
        queryWrapper.eq(DiscoverContentEntity::getStatus, 1)
                   .eq(DiscoverContentEntity::getAuditStatus, 1);
        
        // TODO: 基于用户兴趣和行为的复杂推荐逻辑
        // 这里可以集成机器学习模型或协同过滤算法
        
        // 临时使用热度排序
        queryWrapper.orderByDesc(DiscoverContentEntity::getHotScore)
                   .orderByDesc(DiscoverContentEntity::getCreatedAt);
        
        return queryWrapper;
    }

    /**
     * 构建缓存键
     * 
     * @param prefix 前缀
     * @param params 参数
     * @return 缓存键
     */
    public String buildCacheKey(String prefix, Object... params) {
        StringBuilder keyBuilder = new StringBuilder(prefix);
        for (Object param : params) {
            keyBuilder.append(":").append(param != null ? param.toString() : "null");
        }
        return keyBuilder.toString();
    }

    /**
     * 构建排序SQL片段
     * 
     * @param sortBy 排序方式
     * @param isLocal 是否同城查询
     * @return SQL排序片段
     */
    public String buildOrderByClause(String sortBy, boolean isLocal) {
        switch (sortBy) {
            case "new":
                return "ORDER BY created_at DESC";
            case "distance":
                return isLocal ? "ORDER BY distance ASC, created_at DESC" : "ORDER BY created_at DESC";
            case "hot":
            default:
                return isLocal ? "ORDER BY hot_score DESC, distance ASC" : "ORDER BY hot_score DESC, created_at DESC";
        }
    }
}
