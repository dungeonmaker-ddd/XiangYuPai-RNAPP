package com.xiangyupai.discover.publish.vo;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.experimental.Accessors;

import java.io.Serializable;
import java.time.LocalDateTime;
import java.util.List;

/**
 * 发布动态查询条件VO - 用于封装复杂查询条件
 */
@Data
@EqualsAndHashCode(callSuper = false)
@Accessors(chain = true)
@Schema(description = "发布动态查询条件")
public class PublishPostQueryVO implements Serializable {

    private static final long serialVersionUID = 1L;

    @Schema(description = "用户ID")
    private Long userId;

    @Schema(description = "动态状态列表", example = "[\"published\", \"draft\"]")
    private List<String> statusList;

    @Schema(description = "审核状态列表", example = "[\"approved\", \"pending\"]")
    private List<String> auditStatusList;

    @Schema(description = "隐私设置", example = "public")
    private String privacy;

    @Schema(description = "话题ID列表")
    private List<Long> topicIds;

    @Schema(description = "地理位置查询条件")
    private LocationQueryVO locationQuery;

    @Schema(description = "创建时间范围查询")
    private TimeRangeQueryVO createTimeRange;

    @Schema(description = "热度分数范围")
    private ScoreRangeQueryVO hotScoreRange;

    @Schema(description = "互动数据范围查询")
    private InteractionRangeQueryVO interactionRange;

    @Schema(description = "关键词搜索")
    private String keyword;

    @Schema(description = "搜索类型", example = "title_content", allowableValues = {"title", "content", "title_content"})
    private String searchType = "title_content";

    @Schema(description = "排序字段", example = "create_time")
    private String sortField = "create_time";

    @Schema(description = "排序方向", example = "DESC", allowableValues = {"ASC", "DESC"})
    private String sortOrder = "DESC";

    @Schema(description = "分页页码", example = "1")
    private Integer pageNum = 1;

    @Schema(description = "分页大小", example = "20")
    private Integer pageSize = 20;

    /**
     * 地理位置查询条件
     */
    @Data
    @Schema(description = "地理位置查询条件")
    public static class LocationQueryVO implements Serializable {
        
        @Schema(description = "中心点纬度", example = "22.5431")
        private Double centerLatitude;

        @Schema(description = "中心点经度", example = "114.0579")
        private Double centerLongitude;

        @Schema(description = "搜索半径（米）", example = "5000")
        private Integer radius;

        @Schema(description = "省份", example = "广东省")
        private String province;

        @Schema(description = "城市", example = "深圳市")
        private String city;

        @Schema(description = "区县", example = "南山区")
        private String district;

        @Schema(description = "地点分类", example = "商业区")
        private String category;
    }

    /**
     * 时间范围查询条件
     */
    @Data
    @Schema(description = "时间范围查询条件")
    public static class TimeRangeQueryVO implements Serializable {
        
        @Schema(description = "开始时间")
        private LocalDateTime startTime;

        @Schema(description = "结束时间")
        private LocalDateTime endTime;

        @Schema(description = "时间类型", example = "today", allowableValues = {"today", "week", "month", "custom"})
        private String timeType;
    }

    /**
     * 分数范围查询条件
     */
    @Data
    @Schema(description = "分数范围查询条件")
    public static class ScoreRangeQueryVO implements Serializable {
        
        @Schema(description = "最小分数", example = "0.0")
        private Double minScore;

        @Schema(description = "最大分数", example = "100.0")
        private Double maxScore;
    }

    /**
     * 互动数据范围查询条件
     */
    @Data
    @Schema(description = "互动数据范围查询条件")
    public static class InteractionRangeQueryVO implements Serializable {
        
        @Schema(description = "最小点赞数", example = "0")
        private Integer minLikeCount;

        @Schema(description = "最大点赞数", example = "10000")
        private Integer maxLikeCount;

        @Schema(description = "最小评论数", example = "0")
        private Integer minCommentCount;

        @Schema(description = "最大评论数", example = "1000")
        private Integer maxCommentCount;

        @Schema(description = "最小分享数", example = "0")
        private Integer minShareCount;

        @Schema(description = "最大分享数", example = "1000")
        private Integer maxShareCount;

        @Schema(description = "最小浏览数", example = "0")
        private Integer minViewCount;

        @Schema(description = "最大浏览数", example = "100000")
        private Integer maxViewCount;
    }
}

/**
 * 话题查询条件VO
 */
@Data
@EqualsAndHashCode(callSuper = false)
@Accessors(chain = true)
@Schema(description = "话题查询条件")
public class TopicQueryVO implements Serializable {

    private static final long serialVersionUID = 1L;

    @Schema(description = "话题名称关键词")
    private String nameKeyword;

    @Schema(description = "话题分类列表")
    private List<String> categoryList;

    @Schema(description = "是否热门")
    private Boolean isHot;

    @Schema(description = "话题状态", example = "active")
    private String status;

    @Schema(description = "最小参与人数", example = "100")
    private Integer minParticipantCount;

    @Schema(description = "最大参与人数", example = "100000")
    private Integer maxParticipantCount;

    @Schema(description = "热度分数范围")
    private PublishPostQueryVO.ScoreRangeQueryVO hotScoreRange;

    @Schema(description = "创建时间范围")
    private PublishPostQueryVO.TimeRangeQueryVO createTimeRange;

    @Schema(description = "排序字段", example = "hot_score")
    private String sortField = "hot_score";

    @Schema(description = "排序方向", example = "DESC")
    private String sortOrder = "DESC";

    @Schema(description = "分页页码", example = "1")
    private Integer pageNum = 1;

    @Schema(description = "分页大小", example = "20")
    private Integer pageSize = 20;
}

/**
 * 地点查询条件VO
 */
@Data
@EqualsAndHashCode(callSuper = false)
@Accessors(chain = true)
@Schema(description = "地点查询条件")
public class LocationQueryVO implements Serializable {

    private static final long serialVersionUID = 1L;

    @Schema(description = "地点名称关键词")
    private String nameKeyword;

    @Schema(description = "地址关键词")
    private String addressKeyword;

    @Schema(description = "地理范围查询")
    private PublishPostQueryVO.LocationQueryVO geoQuery;

    @Schema(description = "地点分类列表")
    private List<String> categoryList;

    @Schema(description = "最小使用次数", example = "1")
    private Integer minUsageCount;

    @Schema(description = "排序字段", example = "usage_count")
    private String sortField = "usage_count";

    @Schema(description = "排序方向", example = "DESC")
    private String sortOrder = "DESC";

    @Schema(description = "分页页码", example = "1")
    private Integer pageNum = 1;

    @Schema(description = "分页大小", example = "20")
    private Integer pageSize = 20;
}

/**
 * 媒体查询条件VO
 */
@Data
@EqualsAndHashCode(callSuper = false)
@Accessors(chain = true)
@Schema(description = "媒体查询条件")
public class MediaQueryVO implements Serializable {

    private static final long serialVersionUID = 1L;

    @Schema(description = "关联的动态ID")
    private Long postId;

    @Schema(description = "媒体类型列表", example = "[\"image\", \"video\"]")
    private List<String> mediaTypeList;

    @Schema(description = "上传状态", example = "completed")
    private String uploadStatus;

    @Schema(description = "文件大小范围")
    private FileSizeRangeVO fileSizeRange;

    @Schema(description = "媒体尺寸范围")
    private MediaSizeRangeVO mediaSizeRange;

    @Schema(description = "上传时间范围")
    private PublishPostQueryVO.TimeRangeQueryVO uploadTimeRange;

    @Schema(description = "排序字段", example = "sort_order")
    private String sortField = "sort_order";

    @Schema(description = "排序方向", example = "ASC")
    private String sortOrder = "ASC";

    /**
     * 文件大小范围查询条件
     */
    @Data
    @Schema(description = "文件大小范围查询条件")
    public static class FileSizeRangeVO implements Serializable {
        
        @Schema(description = "最小文件大小（字节）", example = "1024")
        private Long minSize;

        @Schema(description = "最大文件大小（字节）", example = "104857600")
        private Long maxSize;
    }

    /**
     * 媒体尺寸范围查询条件
     */
    @Data
    @Schema(description = "媒体尺寸范围查询条件")
    public static class MediaSizeRangeVO implements Serializable {
        
        @Schema(description = "最小宽度", example = "100")
        private Integer minWidth;

        @Schema(description = "最大宽度", example = "4096")
        private Integer maxWidth;

        @Schema(description = "最小高度", example = "100")
        private Integer minHeight;

        @Schema(description = "最大高度", example = "4096")
        private Integer maxHeight;

        @Schema(description = "最小时长（秒）", example = "1")
        private Integer minDuration;

        @Schema(description = "最大时长（秒）", example = "300")
        private Integer maxDuration;
    }
}

/**
 * 统计查询条件VO
 */
@Data
@EqualsAndHashCode(callSuper = false)
@Accessors(chain = true)
@Schema(description = "统计查询条件")
public class StatisticsQueryVO implements Serializable {

    private static final long serialVersionUID = 1L;

    @Schema(description = "用户ID")
    private Long userId;

    @Schema(description = "统计类型", example = "daily", allowableValues = {"daily", "weekly", "monthly", "yearly"})
    private String statisticsType = "daily";

    @Schema(description = "统计维度", example = "post_count", allowableValues = {"post_count", "like_count", "comment_count", "share_count", "view_count"})
    private String dimension = "post_count";

    @Schema(description = "统计时间范围")
    private PublishPostQueryVO.TimeRangeQueryVO timeRange;

    @Schema(description = "分组字段", example = "create_date")
    private String groupByField;

    @Schema(description = "聚合函数", example = "COUNT", allowableValues = {"COUNT", "SUM", "AVG", "MAX", "MIN"})
    private String aggregateFunction = "COUNT";
}

/**
 * 热门内容查询条件VO
 */
@Data
@EqualsAndHashCode(callSuper = false)
@Accessors(chain = true)
@Schema(description = "热门内容查询条件")
public class HotContentQueryVO implements Serializable {

    private static final long serialVersionUID = 1L;

    @Schema(description = "热门类型", example = "trending", allowableValues = {"trending", "popular", "latest_hot"})
    private String hotType = "trending";

    @Schema(description = "时间窗口", example = "24h", allowableValues = {"1h", "6h", "12h", "24h", "7d", "30d"})
    private String timeWindow = "24h";

    @Schema(description = "内容类型过滤")
    private List<String> contentTypeFilter;

    @Schema(description = "地理位置过滤")
    private PublishPostQueryVO.LocationQueryVO locationFilter;

    @Schema(description = "最小互动阈值")
    private PublishPostQueryVO.InteractionRangeQueryVO minInteractionThreshold;

    @Schema(description = "分页大小", example = "50")
    private Integer pageSize = 50;
}
