package com.xiangyupai.discover.publish.query;

import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;

import com.xiangyupai.discover.publish.entity.*;
import com.xiangyupai.discover.publish.vo.*;

import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;

import java.time.LocalDateTime;
import java.time.LocalDate;
import java.util.List;

/**
 * 发布查询构建器 - 复杂查询逻辑封装工具
 * 
 * 职责：
 * 1. 封装复杂的QueryWrapper查询逻辑
 * 2. 提供可复用的查询条件构建方法
 * 3. 支持动态查询条件组合
 * 4. 简化Service层的查询代码
 */
@Component
public class PublishQueryBuilder {

    /**
     * 构建发布动态查询条件
     * 
     * @param queryVO 查询条件VO
     * @param userId 当前用户ID
     * @return QueryWrapper查询条件
     */
    public QueryWrapper<PublishPost> buildPostQuery(PublishPostQueryVO queryVO, Long userId) {
        QueryWrapper<PublishPost> wrapper = new QueryWrapper<>();
        
        // 基础条件：未删除
        wrapper.eq("deleted", false);
        
        // 用户ID条件
        if (queryVO.getUserId() != null) {
            wrapper.eq("user_id", queryVO.getUserId());
        }
        
        // 状态条件
        if (queryVO.getStatusList() != null && !queryVO.getStatusList().isEmpty()) {
            wrapper.in("status", queryVO.getStatusList());
        } else {
            // 默认只查询已发布的
            wrapper.eq("status", "published");
        }
        
        // 审核状态条件
        if (queryVO.getAuditStatusList() != null && !queryVO.getAuditStatusList().isEmpty()) {
            wrapper.in("audit_status", queryVO.getAuditStatusList());
        } else {
            // 默认只查询已审核通过的
            wrapper.eq("audit_status", "approved");
        }
        
        // 隐私设置条件
        if (StringUtils.hasText(queryVO.getPrivacy())) {
            wrapper.eq("privacy", queryVO.getPrivacy());
        } else {
            // 如果不是查询自己的动态，只能看公开的
            if (queryVO.getUserId() == null || !queryVO.getUserId().equals(userId)) {
                wrapper.eq("privacy", "public");
            }
        }
        
        // 话题条件
        if (queryVO.getTopicIds() != null && !queryVO.getTopicIds().isEmpty()) {
            // 使用JSON_CONTAINS查询话题
            for (Long topicId : queryVO.getTopicIds()) {
                wrapper.apply("JSON_CONTAINS(topic_ids, {0})", "\"" + topicId + "\"");
            }
        }
        
        // 地理位置条件
        if (queryVO.getLocationQuery() != null) {
            buildLocationQuery(wrapper, queryVO.getLocationQuery());
        }
        
        // 时间范围条件
        if (queryVO.getCreateTimeRange() != null) {
            buildTimeRangeQuery(wrapper, queryVO.getCreateTimeRange(), "create_time");
        }
        
        // 热度分数范围条件
        if (queryVO.getHotScoreRange() != null) {
            buildScoreRangeQuery(wrapper, queryVO.getHotScoreRange(), "hot_score");
        }
        
        // 互动数据范围条件
        if (queryVO.getInteractionRange() != null) {
            buildInteractionRangeQuery(wrapper, queryVO.getInteractionRange());
        }
        
        // 关键词搜索条件
        if (StringUtils.hasText(queryVO.getKeyword())) {
            buildKeywordQuery(wrapper, queryVO.getKeyword(), queryVO.getSearchType());
        }
        
        // 排序条件
        buildOrderBy(wrapper, queryVO.getSortField(), queryVO.getSortOrder());
        
        return wrapper;
    }

    /**
     * 构建话题查询条件
     * 
     * @param queryVO 话题查询条件
     * @param userId 当前用户ID
     * @return QueryWrapper查询条件
     */
    public QueryWrapper<PublishTopic> buildTopicQuery(TopicQueryVO queryVO, Long userId) {
        QueryWrapper<PublishTopic> wrapper = new QueryWrapper<>();
        
        // 基础条件
        wrapper.eq("deleted", false)
               .eq("status", "active");
        
        // 话题名称关键词
        if (StringUtils.hasText(queryVO.getNameKeyword())) {
            wrapper.and(w -> w.like("topic_name", queryVO.getNameKeyword())
                             .or()
                             .like("description", queryVO.getNameKeyword()));
        }
        
        // 分类条件
        if (queryVO.getCategoryList() != null && !queryVO.getCategoryList().isEmpty()) {
            wrapper.in("category", queryVO.getCategoryList());
        }
        
        // 热门话题条件
        if (queryVO.getIsHot() != null) {
            wrapper.eq("is_hot", queryVO.getIsHot());
        }
        
        // 参与人数范围
        if (queryVO.getMinParticipantCount() != null) {
            wrapper.ge("participant_count", queryVO.getMinParticipantCount());
        }
        if (queryVO.getMaxParticipantCount() != null) {
            wrapper.le("participant_count", queryVO.getMaxParticipantCount());
        }
        
        // 热度分数范围
        if (queryVO.getHotScoreRange() != null) {
            buildScoreRangeQuery(wrapper, queryVO.getHotScoreRange(), "hot_score");
        }
        
        // 创建时间范围
        if (queryVO.getCreateTimeRange() != null) {
            buildTimeRangeQuery(wrapper, queryVO.getCreateTimeRange(), "create_time");
        }
        
        // 排序
        buildOrderBy(wrapper, queryVO.getSortField(), queryVO.getSortOrder());
        
        return wrapper;
    }

    /**
     * 构建地点查询条件
     * 
     * @param queryVO 地点查询条件
     * @param userId 当前用户ID
     * @return QueryWrapper查询条件
     */
    public QueryWrapper<PublishLocation> buildLocationQuery(LocationQueryVO queryVO, Long userId) {
        QueryWrapper<PublishLocation> wrapper = new QueryWrapper<>();
        
        // 基础条件
        wrapper.eq("deleted", false);
        
        // 地点名称关键词
        if (StringUtils.hasText(queryVO.getNameKeyword())) {
            wrapper.like("poi_name", queryVO.getNameKeyword());
        }
        
        // 地址关键词
        if (StringUtils.hasText(queryVO.getAddressKeyword())) {
            wrapper.like("address", queryVO.getAddressKeyword());
        }
        
        // 地理范围查询
        if (queryVO.getGeoQuery() != null) {
            buildGeoRangeQuery(wrapper, queryVO.getGeoQuery());
        }
        
        // 分类条件
        if (queryVO.getCategoryList() != null && !queryVO.getCategoryList().isEmpty()) {
            wrapper.in("category", queryVO.getCategoryList());
        }
        
        // 最小使用次数
        if (queryVO.getMinUsageCount() != null) {
            wrapper.ge("usage_count", queryVO.getMinUsageCount());
        }
        
        // 排序
        buildOrderBy(wrapper, queryVO.getSortField(), queryVO.getSortOrder());
        
        return wrapper;
    }

    /**
     * 构建媒体查询条件
     * 
     * @param queryVO 媒体查询条件
     * @param userId 当前用户ID
     * @return QueryWrapper查询条件
     */
    public QueryWrapper<PublishMedia> buildMediaQuery(MediaQueryVO queryVO, Long userId) {
        QueryWrapper<PublishMedia> wrapper = new QueryWrapper<>();
        
        // 基础条件
        wrapper.eq("deleted", false);
        
        // 动态ID条件
        if (queryVO.getPostId() != null) {
            wrapper.eq("post_id", queryVO.getPostId());
        }
        
        // 媒体类型条件
        if (queryVO.getMediaTypeList() != null && !queryVO.getMediaTypeList().isEmpty()) {
            wrapper.in("media_type", queryVO.getMediaTypeList());
        }
        
        // 上传状态条件
        if (StringUtils.hasText(queryVO.getUploadStatus())) {
            wrapper.eq("upload_status", queryVO.getUploadStatus());
        }
        
        // 文件大小范围
        if (queryVO.getFileSizeRange() != null) {
            if (queryVO.getFileSizeRange().getMinSize() != null) {
                wrapper.ge("file_size", queryVO.getFileSizeRange().getMinSize());
            }
            if (queryVO.getFileSizeRange().getMaxSize() != null) {
                wrapper.le("file_size", queryVO.getFileSizeRange().getMaxSize());
            }
        }
        
        // 媒体尺寸范围
        if (queryVO.getMediaSizeRange() != null) {
            MediaQueryVO.MediaSizeRangeVO sizeRange = queryVO.getMediaSizeRange();
            
            if (sizeRange.getMinWidth() != null) {
                wrapper.ge("width", sizeRange.getMinWidth());
            }
            if (sizeRange.getMaxWidth() != null) {
                wrapper.le("width", sizeRange.getMaxWidth());
            }
            if (sizeRange.getMinHeight() != null) {
                wrapper.ge("height", sizeRange.getMinHeight());
            }
            if (sizeRange.getMaxHeight() != null) {
                wrapper.le("height", sizeRange.getMaxHeight());
            }
            if (sizeRange.getMinDuration() != null) {
                wrapper.ge("duration", sizeRange.getMinDuration());
            }
            if (sizeRange.getMaxDuration() != null) {
                wrapper.le("duration", sizeRange.getMaxDuration());
            }
        }
        
        // 上传时间范围
        if (queryVO.getUploadTimeRange() != null) {
            buildTimeRangeQuery(wrapper, queryVO.getUploadTimeRange(), "create_time");
        }
        
        // 排序
        buildOrderBy(wrapper, queryVO.getSortField(), queryVO.getSortOrder());
        
        return wrapper;
    }

    /**
     * 构建统计查询条件
     * 
     * @param queryVO 统计查询条件
     * @param userId 当前用户ID
     * @return QueryWrapper查询条件
     */
    public QueryWrapper<PublishPost> buildStatisticsQuery(StatisticsQueryVO queryVO, Long userId) {
        QueryWrapper<PublishPost> wrapper = new QueryWrapper<>();
        
        // 基础条件
        wrapper.eq("deleted", false)
               .eq("status", "published");
        
        // 用户ID条件
        if (queryVO.getUserId() != null) {
            wrapper.eq("user_id", queryVO.getUserId());
        } else {
            wrapper.eq("user_id", userId);
        }
        
        // 时间范围条件
        if (queryVO.getTimeRange() != null) {
            buildTimeRangeQuery(wrapper, queryVO.getTimeRange(), "create_time");
        }
        
        // 构建统计字段选择
        buildStatisticsSelect(wrapper, queryVO);
        
        // 分组条件
        if (StringUtils.hasText(queryVO.getGroupByField())) {
            wrapper.groupBy(queryVO.getGroupByField());
        }
        
        return wrapper;
    }

    /**
     * 构建热门内容查询条件
     * 
     * @param queryVO 热门内容查询条件
     * @param userId 当前用户ID
     * @return QueryWrapper查询条件
     */
    public QueryWrapper<PublishPost> buildHotContentQuery(HotContentQueryVO queryVO, Long userId) {
        QueryWrapper<PublishPost> wrapper = new QueryWrapper<>();
        
        // 基础条件
        wrapper.eq("deleted", false)
               .eq("status", "published")
               .eq("audit_status", "approved")
               .eq("privacy", "public");
        
        // 时间窗口条件
        LocalDateTime timeThreshold = calculateTimeThreshold(queryVO.getTimeWindow());
        wrapper.ge("create_time", timeThreshold);
        
        // 内容类型过滤
        if (queryVO.getContentTypeFilter() != null && !queryVO.getContentTypeFilter().isEmpty()) {
            // 根据媒体类型过滤
            wrapper.and(w -> {
                for (String contentType : queryVO.getContentTypeFilter()) {
                    if ("image".equals(contentType)) {
                        w.or().apply("JSON_LENGTH(media_ids) > 0 AND JSON_CONTAINS(media_ids, JSON_QUOTE('image'))");
                    } else if ("video".equals(contentType)) {
                        w.or().apply("JSON_LENGTH(media_ids) > 0 AND JSON_CONTAINS(media_ids, JSON_QUOTE('video'))");
                    } else if ("text".equals(contentType)) {
                        w.or().apply("JSON_LENGTH(media_ids) = 0 OR media_ids IS NULL");
                    }
                }
            });
        }
        
        // 地理位置过滤
        if (queryVO.getLocationFilter() != null) {
            buildLocationQuery(wrapper, queryVO.getLocationFilter());
        }
        
        // 最小互动阈值
        if (queryVO.getMinInteractionThreshold() != null) {
            buildInteractionRangeQuery(wrapper, queryVO.getMinInteractionThreshold());
        }
        
        // 热门排序（根据热门类型）
        buildHotOrderBy(wrapper, queryVO.getHotType());
        
        return wrapper;
    }

    // ============ 私有辅助方法 ============

    /**
     * 构建地理位置查询条件
     */
    private void buildLocationQuery(QueryWrapper<?> wrapper, PublishPostQueryVO.LocationQueryVO locationQuery) {
        if (locationQuery.getCenterLatitude() != null && locationQuery.getCenterLongitude() != null) {
            // 使用球面距离公式查询指定范围内的位置
            if (locationQuery.getRadius() != null) {
                String distanceFormula = String.format(
                    "(6371 * acos(cos(radians(%f)) * cos(radians(JSON_EXTRACT(location_info, '$.latitude'))) * " +
                    "cos(radians(JSON_EXTRACT(location_info, '$.longitude')) - radians(%f)) + " +
                    "sin(radians(%f)) * sin(radians(JSON_EXTRACT(location_info, '$.latitude'))))) <= %d",
                    locationQuery.getCenterLatitude(), locationQuery.getCenterLongitude(),
                    locationQuery.getCenterLatitude(), locationQuery.getRadius() / 1000 // 转换为公里
                );
                wrapper.apply(distanceFormula);
            }
        }
        
        if (StringUtils.hasText(locationQuery.getProvince())) {
            wrapper.apply("JSON_EXTRACT(location_info, '$.province') = {0}", locationQuery.getProvince());
        }
        
        if (StringUtils.hasText(locationQuery.getCity())) {
            wrapper.apply("JSON_EXTRACT(location_info, '$.city') = {0}", locationQuery.getCity());
        }
        
        if (StringUtils.hasText(locationQuery.getDistrict())) {
            wrapper.apply("JSON_EXTRACT(location_info, '$.district') = {0}", locationQuery.getDistrict());
        }
        
        if (StringUtils.hasText(locationQuery.getCategory())) {
            wrapper.apply("JSON_EXTRACT(location_info, '$.category') = {0}", locationQuery.getCategory());
        }
    }

    /**
     * 构建时间范围查询条件
     */
    private void buildTimeRangeQuery(QueryWrapper<?> wrapper, PublishPostQueryVO.TimeRangeQueryVO timeRange, String timeField) {
        if (timeRange.getStartTime() != null) {
            wrapper.ge(timeField, timeRange.getStartTime());
        }
        
        if (timeRange.getEndTime() != null) {
            wrapper.le(timeField, timeRange.getEndTime());
        }
        
        // 预定义时间类型
        if (StringUtils.hasText(timeRange.getTimeType())) {
            LocalDateTime now = LocalDateTime.now();
            switch (timeRange.getTimeType()) {
                case "today":
                    wrapper.ge(timeField, now.toLocalDate().atStartOfDay());
                    break;
                case "week":
                    wrapper.ge(timeField, now.minusWeeks(1));
                    break;
                case "month":
                    wrapper.ge(timeField, now.minusMonths(1));
                    break;
            }
        }
    }

    /**
     * 构建分数范围查询条件
     */
    private void buildScoreRangeQuery(QueryWrapper<?> wrapper, PublishPostQueryVO.ScoreRangeQueryVO scoreRange, String scoreField) {
        if (scoreRange.getMinScore() != null) {
            wrapper.ge(scoreField, scoreRange.getMinScore());
        }
        
        if (scoreRange.getMaxScore() != null) {
            wrapper.le(scoreField, scoreRange.getMaxScore());
        }
    }

    /**
     * 构建互动数据范围查询条件
     */
    private void buildInteractionRangeQuery(QueryWrapper<?> wrapper, PublishPostQueryVO.InteractionRangeQueryVO interactionRange) {
        if (interactionRange.getMinLikeCount() != null) {
            wrapper.ge("like_count", interactionRange.getMinLikeCount());
        }
        if (interactionRange.getMaxLikeCount() != null) {
            wrapper.le("like_count", interactionRange.getMaxLikeCount());
        }
        
        if (interactionRange.getMinCommentCount() != null) {
            wrapper.ge("comment_count", interactionRange.getMinCommentCount());
        }
        if (interactionRange.getMaxCommentCount() != null) {
            wrapper.le("comment_count", interactionRange.getMaxCommentCount());
        }
        
        if (interactionRange.getMinShareCount() != null) {
            wrapper.ge("share_count", interactionRange.getMinShareCount());
        }
        if (interactionRange.getMaxShareCount() != null) {
            wrapper.le("share_count", interactionRange.getMaxShareCount());
        }
        
        if (interactionRange.getMinViewCount() != null) {
            wrapper.ge("view_count", interactionRange.getMinViewCount());
        }
        if (interactionRange.getMaxViewCount() != null) {
            wrapper.le("view_count", interactionRange.getMaxViewCount());
        }
    }

    /**
     * 构建关键词搜索条件
     */
    private void buildKeywordQuery(QueryWrapper<?> wrapper, String keyword, String searchType) {
        if (!StringUtils.hasText(keyword)) {
            return;
        }
        
        switch (searchType) {
            case "title":
                wrapper.like("title", keyword);
                break;
            case "content":
                wrapper.like("content", keyword);
                break;
            case "title_content":
            default:
                wrapper.and(w -> w.like("title", keyword).or().like("content", keyword));
                break;
        }
    }

    /**
     * 构建地理范围查询条件
     */
    private void buildGeoRangeQuery(QueryWrapper<PublishLocation> wrapper, PublishPostQueryVO.LocationQueryVO geoQuery) {
        if (geoQuery.getCenterLatitude() != null && geoQuery.getCenterLongitude() != null && geoQuery.getRadius() != null) {
            String distanceFormula = String.format(
                "(6371 * acos(cos(radians(%f)) * cos(radians(latitude)) * " +
                "cos(radians(longitude) - radians(%f)) + " +
                "sin(radians(%f)) * sin(radians(latitude)))) <= %d",
                geoQuery.getCenterLatitude(), geoQuery.getCenterLongitude(),
                geoQuery.getCenterLatitude(), geoQuery.getRadius() / 1000
            );
            wrapper.apply(distanceFormula);
        }
        
        if (StringUtils.hasText(geoQuery.getProvince())) {
            wrapper.eq("province", geoQuery.getProvince());
        }
        
        if (StringUtils.hasText(geoQuery.getCity())) {
            wrapper.eq("city", geoQuery.getCity());
        }
        
        if (StringUtils.hasText(geoQuery.getDistrict())) {
            wrapper.eq("district", geoQuery.getDistrict());
        }
    }

    /**
     * 构建排序条件
     */
    private void buildOrderBy(QueryWrapper<?> wrapper, String sortField, String sortOrder) {
        if (!StringUtils.hasText(sortField)) {
            sortField = "create_time";
        }
        
        if (!StringUtils.hasText(sortOrder)) {
            sortOrder = "DESC";
        }
        
        if ("ASC".equalsIgnoreCase(sortOrder)) {
            wrapper.orderByAsc(sortField);
        } else {
            wrapper.orderByDesc(sortField);
        }
    }

    /**
     * 构建统计字段选择
     */
    private void buildStatisticsSelect(QueryWrapper<PublishPost> wrapper, StatisticsQueryVO queryVO) {
        String dimension = queryVO.getDimension();
        String aggregateFunction = queryVO.getAggregateFunction();
        
        // 根据统计维度和聚合函数构建SELECT子句
        String selectSql = String.format("%s(%s) as result", aggregateFunction, dimension);
        wrapper.select(selectSql);
        
        // 如果有分组字段，也要选择
        if (StringUtils.hasText(queryVO.getGroupByField())) {
            wrapper.select(queryVO.getGroupByField());
        }
    }

    /**
     * 构建热门排序
     */
    private void buildHotOrderBy(QueryWrapper<PublishPost> wrapper, String hotType) {
        switch (hotType) {
            case "trending":
                // 趋势排序：综合热度分数和时间因子
                wrapper.orderByDesc("(hot_score * 0.4 + like_count * 0.3 + comment_count * 0.2 + share_count * 0.1)");
                break;
            case "popular":
                // 热门排序：主要看互动数据
                wrapper.orderByDesc("(like_count * 0.4 + comment_count * 0.3 + share_count * 0.2 + view_count * 0.1)");
                break;
            case "latest_hot":
                // 最新热门：最近的高互动内容
                wrapper.orderByDesc("create_time", "hot_score");
                break;
            default:
                wrapper.orderByDesc("hot_score", "create_time");
                break;
        }
    }

    /**
     * 计算时间阈值
     */
    private LocalDateTime calculateTimeThreshold(String timeWindow) {
        LocalDateTime now = LocalDateTime.now();
        
        switch (timeWindow) {
            case "1h":
                return now.minusHours(1);
            case "6h":
                return now.minusHours(6);
            case "12h":
                return now.minusHours(12);
            case "24h":
                return now.minusHours(24);
            case "7d":
                return now.minusDays(7);
            case "30d":
                return now.minusDays(30);
            default:
                return now.minusHours(24);
        }
    }
}
