/**
 * 瀑布流请求DTO类
 * 基于通用组件架构核心标准 - 后端交互层
 * 数据传输对象，用于前后端数据交互
 * 
 * @version 2.0.0
 * @author 架构团队
 */

package com.xiangyu.discover.waterfall.dto;

import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.Data;
import lombok.experimental.Accessors;

import javax.validation.constraints.*;
import java.io.Serializable;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

/**
 * 瀑布流内容查询请求DTO
 */
@Data
@Accessors(chain = true)
public class WaterfallContentQueryRequest implements Serializable {

    private static final long serialVersionUID = 1L;

    /**
     * 标签页类型: follow, hot, local
     */
    @NotBlank(message = "标签页类型不能为空")
    @Pattern(regexp = "^(follow|hot|local)$", message = "标签页类型无效")
    private String tabType;

    /**
     * 页码，从1开始
     */
    @Min(value = 1, message = "页码必须大于0")
    private Integer page = 1;

    /**
     * 每页数量
     */
    @Min(value = 1, message = "每页数量必须大于0")
    @Max(value = 50, message = "每页数量不能超过50")
    private Integer limit = 20;

    /**
     * 最后一项ID (用于游标分页)
     */
    private String lastItemId;

    /**
     * 用户ID
     */
    private String userId;

    /**
     * 地理位置纬度
     */
    @DecimalMin(value = "-90.0", message = "纬度值无效")
    @DecimalMax(value = "90.0", message = "纬度值无效")
    private BigDecimal latitude;

    /**
     * 地理位置经度
     */
    @DecimalMin(value = "-180.0", message = "经度值无效")
    @DecimalMax(value = "180.0", message = "经度值无效")
    private BigDecimal longitude;

    /**
     * 内容类型过滤
     */
    private List<String> contentTypes;

    /**
     * 标签过滤
     */
    private List<String> tags;

    /**
     * 最小点赞数
     */
    @Min(value = 0, message = "最小点赞数不能为负数")
    private Integer minLikeCount;

    /**
     * 最大点赞数
     */
    @Min(value = 0, message = "最大点赞数不能为负数")
    private Integer maxLikeCount;

    /**
     * 排序字段: created, likes, comments, hot
     */
    @Pattern(regexp = "^(created|likes|comments|hot)$", message = "排序字段无效")
    private String sortBy = "created";

    /**
     * 排序方向: asc, desc
     */
    @Pattern(regexp = "^(asc|desc)$", message = "排序方向无效")
    private String sortOrder = "desc";

    /**
     * 时间范围开始
     */
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private LocalDateTime startTime;

    /**
     * 时间范围结束
     */
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private LocalDateTime endTime;
}

/**
 * 瀑布流内容点赞请求DTO
 */
@Data
@Accessors(chain = true)
public class WaterfallLikeRequest implements Serializable {

    private static final long serialVersionUID = 1L;

    /**
     * 内容ID
     */
    @NotBlank(message = "内容ID不能为空")
    private String contentId;

    /**
     * 用户ID
     */
    @NotBlank(message = "用户ID不能为空")
    private String userId;

    /**
     * 是否点赞: true-点赞, false-取消点赞
     */
    @NotNull(message = "点赞状态不能为空")
    private Boolean isLike;

    /**
     * 标签页类型
     */
    @NotBlank(message = "标签页类型不能为空")
    private String tabType;

    /**
     * 来源页面
     */
    private String sourceScreen;

    /**
     * 点击位置
     */
    private ClickPosition clickPosition;

    /**
     * 客户端时间戳
     */
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private LocalDateTime timestamp;

    @Data
    @Accessors(chain = true)
    public static class ClickPosition implements Serializable {
        private Double x;
        private Double y;
    }
}

/**
 * 瀑布流批量点赞请求DTO
 */
@Data
@Accessors(chain = true)
public class WaterfallBatchLikeRequest implements Serializable {

    private static final long serialVersionUID = 1L;

    /**
     * 批量操作列表
     */
    @NotEmpty(message = "操作列表不能为空")
    @Size(max = 50, message = "批量操作数量不能超过50")
    private List<LikeOperation> operations;

    /**
     * 用户ID
     */
    @NotBlank(message = "用户ID不能为空")
    private String userId;

    /**
     * 标签页类型
     */
    @NotBlank(message = "标签页类型不能为空")
    private String tabType;

    @Data
    @Accessors(chain = true)
    public static class LikeOperation implements Serializable {
        @NotBlank(message = "内容ID不能为空")
        private String contentId;

        @NotNull(message = "点赞状态不能为空")
        private Boolean isLike;
    }
}

/**
 * 瀑布流内容刷新请求DTO
 */
@Data
@Accessors(chain = true)
public class WaterfallRefreshRequest implements Serializable {

    private static final long serialVersionUID = 1L;

    /**
     * 标签页类型
     */
    @NotBlank(message = "标签页类型不能为空")
    private String tabType;

    /**
     * 用户ID
     */
    private String userId;

    /**
     * 地理位置纬度
     */
    private BigDecimal latitude;

    /**
     * 地理位置经度
     */
    private BigDecimal longitude;

    /**
     * 上次刷新时间
     */
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private LocalDateTime lastRefreshTime;

    /**
     * 客户端版本
     */
    private String clientVersion;

    /**
     * 刷新时间
     */
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private LocalDateTime refreshTime;
}

/**
 * 瀑布流分页统计请求DTO
 */
@Data
@Accessors(chain = true)
public class WaterfallStatsRequest implements Serializable {

    private static final long serialVersionUID = 1L;

    /**
     * 标签页类型
     */
    @NotBlank(message = "标签页类型不能为空")
    private String tabType;

    /**
     * 用户ID
     */
    private String userId;

    /**
     * 统计时间范围开始
     */
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private LocalDateTime startTime;

    /**
     * 统计时间范围结束
     */
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private LocalDateTime endTime;
}

/**
 * 瀑布流用户交互请求DTO
 */
@Data
@Accessors(chain = true)
public class WaterfallUserInteractionRequest implements Serializable {

    private static final long serialVersionUID = 1L;

    /**
     * 目标用户ID
     */
    @NotBlank(message = "目标用户ID不能为空")
    private String targetUserId;

    /**
     * 当前用户ID
     */
    @NotBlank(message = "当前用户ID不能为空")
    private String currentUserId;

    /**
     * 交互类型: follow, unfollow, block, report
     */
    @NotBlank(message = "交互类型不能为空")
    @Pattern(regexp = "^(follow|unfollow|block|report)$", message = "交互类型无效")
    private String interactionType;

    /**
     * 内容ID (如果是从内容页面触发的交互)
     */
    private String contentId;

    /**
     * 点击类型: avatar, nickname, userInfo
     */
    private String clickType;

    /**
     * 标签页类型
     */
    private String tabType;

    /**
     * 点击位置
     */
    private WaterfallLikeRequest.ClickPosition clickPosition;

    /**
     * 交互原因 (用于举报等场景)
     */
    private String reason;
}

/**
 * 瀑布流内容举报请求DTO
 */
@Data
@Accessors(chain = true)
public class WaterfallReportRequest implements Serializable {

    private static final long serialVersionUID = 1L;

    /**
     * 内容ID
     */
    @NotBlank(message = "内容ID不能为空")
    private String contentId;

    /**
     * 举报用户ID
     */
    @NotBlank(message = "举报用户ID不能为空")
    private String reporterUserId;

    /**
     * 举报类型: spam, inappropriate, copyright, other
     */
    @NotBlank(message = "举报类型不能为空")
    @Pattern(regexp = "^(spam|inappropriate|copyright|other)$", message = "举报类型无效")
    private String reportType;

    /**
     * 举报原因描述
     */
    @NotBlank(message = "举报原因不能为空")
    @Size(max = 500, message = "举报原因不能超过500字符")
    private String reason;

    /**
     * 举报证据图片URLs
     */
    @Size(max = 9, message = "举报证据图片不能超过9张")
    private List<String> evidenceImages;

    /**
     * 标签页类型
     */
    private String tabType;
}
