/**
 * 话题详情查询VO - 只包含前端实际需要的查询条件封装
 * 
 * 核心VO：
 * 1. 话题动态查询条件
 * 2. 基础过滤条件
 * 3. 基础排序条件
 * 
 * 设计原则：最小化查询条件，避免过度抽象
 */

// #region 1. Imports
package com.xiangyupai.pages.discover.topicdetail.vo;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serializable;
import java.time.LocalDateTime;
import java.util.List;
// #endregion

// #region 2. Query VO Definitions

/**
 * 话题动态查询视图对象
 * 用于封装复杂的话题动态查询条件
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TopicPostQueryVO implements Serializable {

    private static final long serialVersionUID = 1L;

    /**
     * 话题ID
     */
    private String topicId;

    /**
     * 当前用户ID (用于个性化查询)
     */
    private String currentUserId;

    /**
     * 分页信息
     */
    private PageQueryVO pageQuery;

    /**
     * 排序条件
     */
    private SortQueryVO sortQuery;

    /**
     * 筛选条件
     */
    private FilterQueryVO filterQuery;

    /**
     * 搜索条件
     */
    private SearchQueryVO searchQuery;

    /**
     * 时间范围条件
     */
    private DateRangeQueryVO dateRangeQuery;
}

/**
 * 分页查询视图对象
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PageQueryVO implements Serializable {

    private static final long serialVersionUID = 1L;

    /**
     * 页码 (从1开始)
     */
    private Integer page;

    /**
     * 每页数量
     */
    private Integer pageSize;

    /**
     * 偏移量 (计算得出)
     */
    private Integer offset;

    /**
     * 获取偏移量
     */
    public Integer getOffset() {
        if (page != null && pageSize != null) {
            return (page - 1) * pageSize;
        }
        return 0;
    }
}

/**
 * 排序查询视图对象
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SortQueryVO implements Serializable {

    private static final long serialVersionUID = 1L;

    /**
     * 排序字段
     */
    private String sortField;

    /**
     * 排序方向 (ASC, DESC)
     */
    private String sortDirection;

    /**
     * 排序类型 (latest, popular, hot)
     */
    private String sortType;

    /**
     * 多字段排序 (可选)
     */
    private List<SortItemVO> multipleSorts;
}

/**
 * 排序项视图对象
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SortItemVO implements Serializable {

    private static final long serialVersionUID = 1L;

    /**
     * 排序字段
     */
    private String field;

    /**
     * 排序方向
     */
    private String direction;

    /**
     * 排序优先级
     */
    private Integer priority;
}
// #endregion

// #region 3. Filter Conditions

/**
 * 筛选查询视图对象
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class FilterQueryVO implements Serializable {

    private static final long serialVersionUID = 1L;

    /**
     * 媒体类型筛选 (all, image, video, text)
     */
    private String mediaType;

    /**
     * 动态状态筛选
     */
    private List<Integer> postStatuses;

    /**
     * 用户等级筛选
     */
    private List<Integer> userLevels;

    /**
     * 认证用户筛选
     */
    private Boolean verifiedOnly;

    /**
     * 最小点赞数筛选
     */
    private Integer minLikeCount;

    /**
     * 最小评论数筛选
     */
    private Integer minCommentCount;

    /**
     * 地理位置筛选
     */
    private LocationFilterVO locationFilter;

    /**
     * 标签筛选
     */
    private List<String> hashtags;

    /**
     * 关注用户筛选 (仅显示关注用户的动态)
     */
    private Boolean followingOnly;
}

/**
 * 地理位置筛选视图对象
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class LocationFilterVO implements Serializable {

    private static final long serialVersionUID = 1L;

    /**
     * 城市名称
     */
    private String cityName;

    /**
     * 省份名称
     */
    private String provinceName;

    /**
     * 中心点纬度 (用于范围查询)
     */
    private Double centerLatitude;

    /**
     * 中心点经度 (用于范围查询)
     */
    private Double centerLongitude;

    /**
     * 搜索半径 (单位：公里)
     */
    private Double radiusKm;

    /**
     * 是否只显示有位置信息的动态
     */
    private Boolean hasLocationOnly;
}
// #endregion

// #region 4. Sort & Pagination
// 已在上面定义
// #endregion

// #region 5. Search Criteria

/**
 * 搜索查询视图对象
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SearchQueryVO implements Serializable {

    private static final long serialVersionUID = 1L;

    /**
     * 搜索关键词
     */
    private String keyword;

    /**
     * 搜索字段 (title, content, both)
     */
    private String searchFields;

    /**
     * 是否模糊搜索
     */
    private Boolean fuzzySearch;

    /**
     * 用户昵称搜索
     */
    private String userNickname;

    /**
     * 标签搜索
     */
    private List<String> searchHashtags;

    /**
     * 是否启用高亮
     */
    private Boolean highlightEnabled;

    /**
     * 搜索结果最小相关度
     */
    private Double minRelevanceScore;
}
// #endregion

// #region 6. Date Range Filters

/**
 * 时间范围查询视图对象
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DateRangeQueryVO implements Serializable {

    private static final long serialVersionUID = 1L;

    /**
     * 开始时间
     */
    private LocalDateTime startTime;

    /**
     * 结束时间
     */
    private LocalDateTime endTime;

    /**
     * 时间范围类型 (all, today, week, month, custom)
     */
    private String timeRangeType;

    /**
     * 相对时间天数 (如最近7天)
     */
    private Integer relativeDays;

    /**
     * 时间字段类型 (created_at, updated_at)
     */
    private String timeFieldType;

    /**
     * 时区偏移 (小时)
     */
    private Integer timezoneOffset;
}
// #endregion

// #region 7. Builder Patterns
// Lombok @Builder 已处理所有类
// #endregion

// #region 8. Query Helper Methods

/**
 * 查询条件构建辅助类
 */
public class TopicPostQueryVOBuilder {

    /**
     * 构建默认查询条件
     */
    public static TopicPostQueryVO buildDefault(String topicId, String currentUserId) {
        return TopicPostQueryVO.builder()
                .topicId(topicId)
                .currentUserId(currentUserId)
                .pageQuery(PageQueryVO.builder()
                        .page(1)
                        .pageSize(20)
                        .build())
                .sortQuery(SortQueryVO.builder()
                        .sortType("latest")
                        .sortField("created_at")
                        .sortDirection("DESC")
                        .build())
                .filterQuery(FilterQueryVO.builder()
                        .mediaType("all")
                        .verifiedOnly(false)
                        .followingOnly(false)
                        .build())
                .dateRangeQuery(DateRangeQueryVO.builder()
                        .timeRangeType("all")
                        .timeFieldType("created_at")
                        .build())
                .build();
    }

    /**
     * 构建热门动态查询条件
     */
    public static TopicPostQueryVO buildPopular(String topicId, String currentUserId) {
        TopicPostQueryVO baseQuery = buildDefault(topicId, currentUserId);
        baseQuery.getSortQuery().setSortType("popular");
        baseQuery.getSortQuery().setSortField("like_count");
        baseQuery.getFilterQuery().setMinLikeCount(1);
        return baseQuery;
    }

    /**
     * 构建最热动态查询条件
     */
    public static TopicPostQueryVO buildHot(String topicId, String currentUserId) {
        TopicPostQueryVO baseQuery = buildDefault(topicId, currentUserId);
        baseQuery.getSortQuery().setSortType("hot");
        // 热度计算：点赞数 * 0.6 + 评论数 * 0.3 + 分享数 * 0.1
        baseQuery.getFilterQuery().setMinLikeCount(5);
        baseQuery.getFilterQuery().setMinCommentCount(2);
        return baseQuery;
    }

    /**
     * 构建关注用户动态查询条件
     */
    public static TopicPostQueryVO buildFollowing(String topicId, String currentUserId) {
        TopicPostQueryVO baseQuery = buildDefault(topicId, currentUserId);
        baseQuery.getFilterQuery().setFollowingOnly(true);
        return baseQuery;
    }

    /**
     * 构建媒体筛选查询条件
     */
    public static TopicPostQueryVO buildMediaFilter(String topicId, String currentUserId, String mediaType) {
        TopicPostQueryVO baseQuery = buildDefault(topicId, currentUserId);
        baseQuery.getFilterQuery().setMediaType(mediaType);
        return baseQuery;
    }

    /**
     * 构建时间范围查询条件
     */
    public static TopicPostQueryVO buildTimeRange(String topicId, String currentUserId, String timeRange) {
        TopicPostQueryVO baseQuery = buildDefault(topicId, currentUserId);
        DateRangeQueryVO dateRange = baseQuery.getDateRangeQuery();
        dateRange.setTimeRangeType(timeRange);
        
        LocalDateTime now = LocalDateTime.now();
        switch (timeRange) {
            case "today":
                dateRange.setStartTime(now.toLocalDate().atStartOfDay());
                dateRange.setEndTime(now);
                break;
            case "week":
                dateRange.setStartTime(now.minusDays(7));
                dateRange.setEndTime(now);
                break;
            case "month":
                dateRange.setStartTime(now.minusDays(30));
                dateRange.setEndTime(now);
                break;
            default:
                // "all" 不设置时间范围
                break;
        }
        
        return baseQuery;
    }

    /**
     * 构建搜索查询条件
     */
    public static TopicPostQueryVO buildSearch(String topicId, String currentUserId, String keyword) {
        TopicPostQueryVO baseQuery = buildDefault(topicId, currentUserId);
        baseQuery.setSearchQuery(SearchQueryVO.builder()
                .keyword(keyword)
                .searchFields("both")
                .fuzzySearch(true)
                .highlightEnabled(true)
                .minRelevanceScore(0.3)
                .build());
        return baseQuery;
    }
}
// #endregion
