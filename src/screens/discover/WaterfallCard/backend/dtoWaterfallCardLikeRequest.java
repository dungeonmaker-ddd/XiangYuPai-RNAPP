/**
 * 瀑布流卡片点赞请求响应DTO
 * 基于通用组件架构核心标准 - 后端交互层
 * 
 * @version 2.0.0
 * @author 架构团队
 */

package com.xiangyu.waterfall.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.validation.Valid;
import javax.validation.constraints.*;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

/**
 * 瀑布流卡片点赞相关DTO类集合
 */
public class WaterfallCardLikeDTO {

    // =====================================================
    // 请求DTO类
    // =====================================================

    /**
     * 点赞/取消点赞请求
     */
    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class LikeRequest {
        
        /**
         * 内容ID - 必填
         */
        @NotBlank(message = "内容ID不能为空")
        @Size(max = 64, message = "内容ID长度不能超过64个字符")
        private String contentId;
        
        /**
         * 操作类型 - like/unlike
         */
        @NotBlank(message = "操作类型不能为空")
        @Pattern(regexp = "^(like|unlike)$", message = "操作类型只能是like或unlike")
        private String action;
        
        /**
         * 来源标签页
         */
        @Size(max = 32, message = "来源标签页长度不能超过32个字符")
        private String sourceTab;
        
        /**
         * 来源位置索引
         */
        @Min(value = 0, message = "位置索引不能小于0")
        @Max(value = 9999, message = "位置索引不能大于9999")
        private Integer sourceIndex;
        
        /**
         * 客户端时间戳
         */
        @NotNull(message = "客户端时间戳不能为空")
        @Min(value = 1000000000000L, message = "时间戳格式不正确")
        private Long clientTimestamp;
        
        /**
         * 设备信息
         */
        @Size(max = 256, message = "设备信息长度不能超过256个字符")
        private String deviceInfo;
        
        /**
         * 地理位置信息
         */
        private LocationInfo locationInfo;
        
        /**
         * 扩展数据
         */
        private Map<String, Object> extraData;
    }

    /**
     * 批量点赞请求
     */
    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class BatchLikeRequest {
        
        /**
         * 批量操作列表
         */
        @NotEmpty(message = "批量操作列表不能为空")
        @Size(max = 100, message = "单次批量操作不能超过100个")
        @Valid
        private List<BatchLikeAction> actions;
        
        /**
         * 客户端时间戳
         */
        @NotNull(message = "客户端时间戳不能为空")
        private Long clientTimestamp;
        
        /**
         * 批次ID
         */
        @Size(max = 64, message = "批次ID长度不能超过64个字符")
        private String batchId;
    }

    /**
     * 批量点赞单个操作
     */
    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class BatchLikeAction {
        
        @NotBlank(message = "内容ID不能为空")
        private String contentId;
        
        @Pattern(regexp = "^(like|unlike)$", message = "操作类型只能是like或unlike")
        private String action;
        
        private Integer sourceIndex;
    }

    /**
     * 查询点赞状态请求
     */
    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class LikeStatusRequest {
        
        /**
         * 内容ID列表
         */
        @NotEmpty(message = "内容ID列表不能为空")
        @Size(max = 200, message = "单次查询不能超过200个内容")
        private List<@NotBlank String> contentIds;
        
        /**
         * 是否包含详细信息
         */
        private Boolean includeDetails = false;
    }

    /**
     * 分页查询点赞记录请求
     */
    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class LikeHistoryRequest extends PageRequest {
        
        /**
         * 用户ID - 可选，不传则查询当前用户
         */
        private Long userId;
        
        /**
         * 内容类型过滤
         */
        @Pattern(regexp = "^(image|video|live)$", message = "内容类型不正确")
        private String contentType;
        
        /**
         * 来源标签过滤
         */
        private String sourceTab;
        
        /**
         * 时间范围 - 开始时间
         */
        private LocalDateTime startTime;
        
        /**
         * 时间范围 - 结束时间
         */
        private LocalDateTime endTime;
        
        /**
         * 是否只查询点赞状态（排除取消点赞）
         */
        private Boolean onlyLiked = true;
    }

    // =====================================================
    // 响应DTO类
    // =====================================================

    /**
     * 点赞操作响应
     */
    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class LikeResponse {
        
        /**
         * 内容ID
         */
        private String contentId;
        
        /**
         * 当前点赞状态
         */
        private Boolean isLiked;
        
        /**
         * 总点赞数
         */
        private Integer likeCount;
        
        /**
         * 点赞记录ID
         */
        private String likeId;
        
        /**
         * 操作时间
         */
        private LocalDateTime operationTime;
        
        /**
         * 用户信息
         */
        private UserInfo userInfo;
    }

    /**
     * 批量点赞响应
     */
    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class BatchLikeResponse {
        
        /**
         * 批次ID
         */
        private String batchId;
        
        /**
         * 批量操作结果
         */
        private List<BatchLikeResult> results;
        
        /**
         * 成功数量
         */
        private Integer successCount;
        
        /**
         * 失败数量
         */
        private Integer failureCount;
        
        /**
         * 操作时间
         */
        private LocalDateTime operationTime;
    }

    /**
     * 批量操作单个结果
     */
    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class BatchLikeResult {
        
        private String contentId;
        private Boolean success;
        private Boolean isLiked;
        private Integer likeCount;
        private String error;
    }

    /**
     * 点赞状态响应
     */
    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class LikeStatusResponse {
        
        /**
         * 点赞状态列表
         */
        private List<ContentLikeStatus> likeStatuses;
        
        /**
         * 查询时间
         */
        private LocalDateTime queryTime;
    }

    /**
     * 内容点赞状态
     */
    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class ContentLikeStatus {
        
        private String contentId;
        private Boolean isLiked;
        private Integer likeCount;
        private LocalDateTime lastLikeTime;
        
        // 详细信息（当includeDetails=true时返回）
        private ContentDetail contentDetail;
    }

    /**
     * 点赞历史记录响应
     */
    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class LikeHistoryResponse {
        
        /**
         * 点赞记录ID
         */
        private String likeId;
        
        /**
         * 内容ID
         */
        private String contentId;
        
        /**
         * 内容信息
         */
        private ContentSummary contentSummary;
        
        /**
         * 点赞状态
         */
        private Boolean isLiked;
        
        /**
         * 操作时间
         */
        private LocalDateTime operationTime;
        
        /**
         * 来源信息
         */
        private SourceInfo sourceInfo;
    }

    // =====================================================
    // 通用内部类
    // =====================================================

    /**
     * 地理位置信息
     */
    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class LocationInfo {
        
        @DecimalMin(value = "-90.0", message = "纬度范围不正确")
        @DecimalMax(value = "90.0", message = "纬度范围不正确")
        private Double latitude;
        
        @DecimalMin(value = "-180.0", message = "经度范围不正确")
        @DecimalMax(value = "180.0", message = "经度范围不正确")
        private Double longitude;
        
        @Size(max = 100, message = "地址信息长度不能超过100个字符")
        private String address;
        
        @Size(max = 50, message = "城市名称长度不能超过50个字符")
        private String city;
        
        @Size(max = 50, message = "省份名称长度不能超过50个字符")
        private String province;
    }

    /**
     * 用户信息
     */
    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class UserInfo {
        
        private Long userId;
        private String nickname;
        private String avatar;
        private Boolean verified;
        private Integer level;
    }

    /**
     * 内容详情
     */
    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class ContentDetail {
        
        private String contentId;
        private String title;
        private String type;
        private String thumbnail;
        private UserInfo author;
        private Integer totalLikes;
        private Integer totalComments;
        private LocalDateTime createdAt;
    }

    /**
     * 内容摘要
     */
    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class ContentSummary {
        
        private String contentId;
        private String title;
        private String type;
        private String thumbnail;
        private String authorNickname;
    }

    /**
     * 来源信息
     */
    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class SourceInfo {
        
        private String sourceTab;
        private Integer sourceIndex;
        private String deviceInfo;
        private LocationInfo locationInfo;
    }

    // =====================================================
    // 基础分页请求类
    // =====================================================

    /**
     * 分页请求基类
     */
    @Data
    public static class PageRequest {
        
        /**
         * 当前页码
         */
        @Min(value = 1, message = "页码不能小于1")
        private Long current = 1L;
        
        /**
         * 每页大小
         */
        @Min(value = 1, message = "每页大小不能小于1")
        @Max(value = 100, message = "每页大小不能超过100")
        private Long size = 10L;
        
        /**
         * 排序字段
         */
        @Size(max = 50, message = "排序字段长度不能超过50个字符")
        private String orderBy = "created_at";
        
        /**
         * 是否升序
         */
        private Boolean isAsc = false;
    }

    // =====================================================
    // 统一响应包装类
    // =====================================================

    /**
     * 统一响应包装
     */
    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class BaseResponse<T> {
        
        /**
         * 响应码
         */
        private Integer code;
        
        /**
         * 响应消息
         */
        private String message;
        
        /**
         * 响应数据
         */
        private T data;
        
        /**
         * 响应时间戳
         */
        private Long timestamp;
        
        /**
         * 请求ID
         */
        private String requestId;
        
        /**
         * 是否成功
         */
        public boolean isSuccess() {
            return code != null && code == 200;
        }
    }

    /**
     * 分页响应包装
     */
    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class PageResponse<T> {
        
        /**
         * 数据列表
         */
        private List<T> records;
        
        /**
         * 总记录数
         */
        private Long total;
        
        /**
         * 当前页码
         */
        private Long current;
        
        /**
         * 每页大小
         */
        private Long size;
        
        /**
         * 总页数
         */
        private Long pages;
        
        /**
         * 是否有下一页
         */
        public boolean hasNext() {
            return current != null && pages != null && current < pages;
        }
        
        /**
         * 是否有上一页
         */
        public boolean hasPrevious() {
            return current != null && current > 1;
        }
    }
}
