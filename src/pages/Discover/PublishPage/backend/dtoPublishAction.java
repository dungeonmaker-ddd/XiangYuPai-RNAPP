package com.xiangyupai.discover.publish.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.experimental.Accessors;

import javax.validation.constraints.*;
import java.io.Serializable;
import java.time.LocalDateTime;
import java.util.List;

/**
 * 发布动态请求DTO - 与前端API一致的数据交换格式
 */
@Data
@EqualsAndHashCode(callSuper = false)
@Accessors(chain = true)
@Schema(description = "发布动态请求对象")
public class PublishPostRequestDTO implements Serializable {

    private static final long serialVersionUID = 1L;

    @Schema(description = "动态标题", example = "分享一个有趣的发现")
    @NotBlank(message = "标题不能为空")
    @Size(max = 50, message = "标题长度不能超过50字符")
    private String title;

    @Schema(description = "动态内容", example = "今天发现了一个很棒的地方...")
    @NotBlank(message = "内容不能为空")
    @Size(max = 1000, message = "内容长度不能超过1000字符")
    private String content;

    @Schema(description = "媒体文件ID列表")
    @Size(max = 9, message = "媒体文件不能超过9个")
    private List<String> mediaIds;

    @Schema(description = "话题ID列表")
    @Size(max = 3, message = "话题不能超过3个")
    private List<String> topicIds;

    @Schema(description = "地理位置信息")
    private LocationDTO location;

    @Schema(description = "隐私设置", example = "public", allowableValues = {"public", "friends", "private"})
    @Pattern(regexp = "^(public|friends|private)$", message = "隐私设置只能是public、friends或private")
    private String privacy = "public";

    @Schema(description = "发布设置")
    @NotNull(message = "发布设置不能为空")
    private PublishSettingsDTO settings;

    /**
     * 地理位置DTO
     */
    @Data
    @Schema(description = "地理位置信息")
    public static class LocationDTO implements Serializable {
        
        @Schema(description = "纬度", example = "22.5431")
        @DecimalMin(value = "-90.0", message = "纬度必须大于等于-90")
        @DecimalMax(value = "90.0", message = "纬度必须小于等于90")
        private Double latitude;

        @Schema(description = "经度", example = "114.0579")
        @DecimalMin(value = "-180.0", message = "经度必须大于等于-180")
        @DecimalMax(value = "180.0", message = "经度必须小于等于180")
        private Double longitude;

        @Schema(description = "地址描述", example = "深圳市南山区科技园")
        @NotBlank(message = "地址不能为空")
        @Size(max = 200, message = "地址长度不能超过200字符")
        private String address;

        @Schema(description = "POI地点ID")
        private String poiId;

        @Schema(description = "地点名称", example = "深圳科技园")
        private String poiName;
    }

    /**
     * 发布设置DTO
     */
    @Data
    @Schema(description = "发布设置")
    public static class PublishSettingsDTO implements Serializable {
        
        @Schema(description = "是否允许评论", example = "true")
        @NotNull(message = "评论设置不能为空")
        private Boolean allowComment = true;

        @Schema(description = "是否允许分享", example = "true")
        @NotNull(message = "分享设置不能为空")
        private Boolean allowShare = true;
    }
}

/**
 * 发布动态响应DTO
 */
@Data
@EqualsAndHashCode(callSuper = false)
@Accessors(chain = true)
@Schema(description = "发布动态响应对象")
public class PublishPostResponseDTO implements Serializable {

    private static final long serialVersionUID = 1L;

    @Schema(description = "动态ID", example = "1234567890")
    private String postId;

    @Schema(description = "动态URL", example = "/posts/1234567890")
    private String url;

    @Schema(description = "创建时间")
    private LocalDateTime createdAt;

    @Schema(description = "发布状态", example = "published")
    private String status;

    @Schema(description = "审核状态", example = "approved")
    private String auditStatus;

    @Schema(description = "返回消息", example = "动态发布成功")
    private String message;
}

/**
 * 媒体上传请求DTO
 */
@Data
@EqualsAndHashCode(callSuper = false)
@Accessors(chain = true)
@Schema(description = "媒体上传请求对象")
public class MediaUploadRequestDTO implements Serializable {

    private static final long serialVersionUID = 1L;

    @Schema(description = "媒体类型", example = "image", allowableValues = {"image", "video"})
    @NotBlank(message = "媒体类型不能为空")
    @Pattern(regexp = "^(image|video)$", message = "媒体类型只能是image或video")
    private String type;

    @Schema(description = "是否压缩", example = "true")
    private Boolean compress = true;

    @Schema(description = "压缩质量", example = "0.8")
    @DecimalMin(value = "0.1", message = "压缩质量不能小于0.1")
    @DecimalMax(value = "1.0", message = "压缩质量不能大于1.0")
    private Double quality = 0.8;

    @Schema(description = "原始文件名", example = "image.jpg")
    private String originalFileName;

    @Schema(description = "文件大小", example = "1024000")
    @Max(value = 104857600, message = "文件大小不能超过100MB") // 100MB
    private Long fileSize;
}

/**
 * 媒体上传响应DTO
 */
@Data
@EqualsAndHashCode(callSuper = false)
@Accessors(chain = true)
@Schema(description = "媒体上传响应对象")
public class MediaUploadResponseDTO implements Serializable {

    private static final long serialVersionUID = 1L;

    @Schema(description = "媒体ID", example = "media_1234567890")
    private String id;

    @Schema(description = "文件URL", example = "https://cdn.example.com/media/image.jpg")
    private String url;

    @Schema(description = "缩略图URL", example = "https://cdn.example.com/media/thumb_image.jpg")
    private String thumbnailUrl;

    @Schema(description = "媒体类型", example = "image")
    private String type;

    @Schema(description = "文件大小", example = "1024000")
    private Long fileSize;

    @Schema(description = "媒体宽度", example = "1920")
    private Integer width;

    @Schema(description = "媒体高度", example = "1080")
    private Integer height;

    @Schema(description = "视频时长（秒）", example = "30")
    private Integer duration;

    @Schema(description = "上传时间")
    private LocalDateTime uploadedAt;

    @Schema(description = "媒体元数据")
    private MediaMetadataDTO metadata;

    /**
     * 媒体元数据DTO
     */
    @Data
    @Schema(description = "媒体元数据")
    public static class MediaMetadataDTO implements Serializable {
        
        @Schema(description = "MIME类型", example = "image/jpeg")
        private String mimeType;

        @Schema(description = "文件格式", example = "JPEG")
        private String format;

        @Schema(description = "色彩空间", example = "sRGB")
        private String colorSpace;

        @Schema(description = "是否有透明通道", example = "false")
        private Boolean hasAlpha;
    }
}

/**
 * 话题搜索请求DTO
 */
@Data
@EqualsAndHashCode(callSuper = false)
@Accessors(chain = true)
@Schema(description = "话题搜索请求对象")
public class TopicSearchRequestDTO implements Serializable {

    private static final long serialVersionUID = 1L;

    @Schema(description = "搜索关键词", example = "前端开发")
    @NotBlank(message = "搜索关键词不能为空")
    @Size(max = 50, message = "搜索关键词长度不能超过50字符")
    private String keyword;

    @Schema(description = "话题分类", example = "tech")
    private String category;

    @Schema(description = "分页大小", example = "20")
    @Min(value = 1, message = "分页大小不能小于1")
    @Max(value = 100, message = "分页大小不能超过100")
    private Integer limit = 20;

    @Schema(description = "分页偏移", example = "0")
    @Min(value = 0, message = "分页偏移不能小于0")
    private Integer offset = 0;

    @Schema(description = "排序方式", example = "hot", allowableValues = {"hot", "latest", "participant"})
    private String sortBy = "hot";
}

/**
 * 话题搜索响应DTO
 */
@Data
@EqualsAndHashCode(callSuper = false)
@Accessors(chain = true)
@Schema(description = "话题搜索响应对象")
public class TopicSearchResponseDTO implements Serializable {

    private static final long serialVersionUID = 1L;

    @Schema(description = "话题列表")
    private List<TopicItemDTO> topics;

    @Schema(description = "总数量", example = "100")
    private Integer total;

    @Schema(description = "是否还有更多", example = "true")
    private Boolean hasMore;

    @Schema(description = "搜索关键词", example = "前端开发")
    private String query;

    /**
     * 话题项DTO
     */
    @Data
    @Schema(description = "话题项信息")
    public static class TopicItemDTO implements Serializable {
        
        @Schema(description = "话题ID", example = "topic_1234567890")
        private String id;

        @Schema(description = "话题名称", example = "前端开发")
        private String name;

        @Schema(description = "话题描述", example = "前端开发技术交流")
        private String description;

        @Schema(description = "封面图URL", example = "https://cdn.example.com/topic/cover.jpg")
        private String coverUrl;

        @Schema(description = "热度分数", example = "95.5")
        private Double hotScore;

        @Schema(description = "参与人数", example = "10000")
        private Integer participantCount;

        @Schema(description = "话题分类", example = "tech")
        private String category;

        @Schema(description = "是否热门", example = "true")
        private Boolean isHot;
    }
}

/**
 * 地点搜索请求DTO
 */
@Data
@EqualsAndHashCode(callSuper = false)
@Accessors(chain = true)
@Schema(description = "地点搜索请求对象")
public class LocationSearchRequestDTO implements Serializable {

    private static final long serialVersionUID = 1L;

    @Schema(description = "搜索关键词", example = "科技园")
    @NotBlank(message = "搜索关键词不能为空")
    @Size(max = 50, message = "搜索关键词长度不能超过50字符")
    private String keyword;

    @Schema(description = "当前纬度", example = "22.5431")
    private Double latitude;

    @Schema(description = "当前经度", example = "114.0579")
    private Double longitude;

    @Schema(description = "搜索半径（米）", example = "5000")
    @Min(value = 100, message = "搜索半径不能小于100米")
    @Max(value = 50000, message = "搜索半径不能超过50000米")
    private Integer radius = 5000;

    @Schema(description = "分页大小", example = "20")
    @Min(value = 1, message = "分页大小不能小于1")
    @Max(value = 100, message = "分页大小不能超过100")
    private Integer limit = 20;
}

/**
 * 地点搜索响应DTO
 */
@Data
@EqualsAndHashCode(callSuper = false)
@Accessors(chain = true)
@Schema(description = "地点搜索响应对象")
public class LocationSearchResponseDTO implements Serializable {

    private static final long serialVersionUID = 1L;

    @Schema(description = "地点列表")
    private List<LocationItemDTO> locations;

    @Schema(description = "总数量", example = "50")
    private Integer total;

    @Schema(description = "搜索关键词", example = "科技园")
    private String query;

    /**
     * 地点项DTO
     */
    @Data
    @Schema(description = "地点项信息")
    public static class LocationItemDTO implements Serializable {
        
        @Schema(description = "地点ID", example = "location_1234567890")
        private String id;

        @Schema(description = "地点名称", example = "深圳科技园")
        private String name;

        @Schema(description = "详细地址", example = "深圳市南山区科技园")
        private String address;

        @Schema(description = "纬度", example = "22.5431")
        private Double latitude;

        @Schema(description = "经度", example = "114.0579")
        private Double longitude;

        @Schema(description = "距离（米）", example = "1200")
        private Double distance;

        @Schema(description = "地点分类", example = "商业区")
        private String category;

        @Schema(description = "使用次数", example = "100")
        private Integer usageCount;
    }
}

/**
 * 草稿保存请求DTO
 */
@Data
@EqualsAndHashCode(callSuper = false)
@Accessors(chain = true)
@Schema(description = "草稿保存请求对象")
public class DraftSaveRequestDTO implements Serializable {

    private static final long serialVersionUID = 1L;

    @Schema(description = "草稿ID（可选，用于更新现有草稿）")
    private String draftId;

    @Schema(description = "动态标题")
    @Size(max = 50, message = "标题长度不能超过50字符")
    private String title;

    @Schema(description = "动态内容")
    @Size(max = 1000, message = "内容长度不能超过1000字符")
    private String content;

    @Schema(description = "媒体文件ID列表")
    private List<String> mediaIds;

    @Schema(description = "话题ID列表")
    private List<String> topicIds;

    @Schema(description = "地理位置信息")
    private PublishPostRequestDTO.LocationDTO location;

    @Schema(description = "隐私设置")
    private String privacy;

    @Schema(description = "发布设置")
    private PublishPostRequestDTO.PublishSettingsDTO settings;
}

/**
 * 草稿保存响应DTO
 */
@Data
@EqualsAndHashCode(callSuper = false)
@Accessors(chain = true)
@Schema(description = "草稿保存响应对象")
public class DraftSaveResponseDTO implements Serializable {

    private static final long serialVersionUID = 1L;

    @Schema(description = "草稿ID", example = "draft_1234567890")
    private String draftId;

    @Schema(description = "保存时间")
    private LocalDateTime savedAt;

    @Schema(description = "返回消息", example = "草稿保存成功")
    private String message;
}
