package com.xiangyupai.discover.publish.entity;

import com.baomidou.mybatisplus.annotation.*;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.experimental.Accessors;

import java.io.Serializable;
import java.time.LocalDateTime;

/**
 * 发布动态实体类 - MyBatis-Plus注解配置
 * 
 * 数据表: publish_post
 * 描述: 用户发布的动态内容主表
 */
@Data
@EqualsAndHashCode(callSuper = false)
@Accessors(chain = true)
@TableName("publish_post")
public class PublishPost implements Serializable {

    private static final long serialVersionUID = 1L;

    /**
     * 主键ID - 雪花算法生成
     */
    @TableId(value = "id", type = IdType.ASSIGN_ID)
    private Long id;

    /**
     * 用户ID - 发布者用户标识
     */
    @TableField("user_id")
    private Long userId;

    /**
     * 动态标题 - 不超过50字符
     */
    @TableField("title")
    private String title;

    /**
     * 动态正文内容 - 不超过1000字符
     */
    @TableField("content")
    private String content;

    /**
     * 媒体文件ID列表 - JSON数组格式存储
     */
    @TableField("media_ids")
    private String mediaIds;

    /**
     * 话题ID列表 - JSON数组格式存储
     */
    @TableField("topic_ids")
    private String topicIds;

    /**
     * 地理位置信息 - JSON对象格式存储
     */
    @TableField("location_info")
    private String locationInfo;

    /**
     * 隐私设置 - public/friends/private
     */
    @TableField("privacy")
    private String privacy;

    /**
     * 发布状态 - draft/published/deleted/banned
     */
    @TableField("status")
    private String status;

    /**
     * 是否允许评论 - 0:不允许 1:允许
     */
    @TableField("allow_comment")
    private Boolean allowComment;

    /**
     * 是否允许分享 - 0:不允许 1:允许
     */
    @TableField("allow_share")
    private Boolean allowShare;

    /**
     * 点赞数量
     */
    @TableField("like_count")
    private Integer likeCount;

    /**
     * 评论数量
     */
    @TableField("comment_count")
    private Integer commentCount;

    /**
     * 分享数量
     */
    @TableField("share_count")
    private Integer shareCount;

    /**
     * 浏览数量
     */
    @TableField("view_count")
    private Integer viewCount;

    /**
     * 热度分数 - 用于排序推荐
     */
    @TableField("hot_score")
    private Double hotScore;

    /**
     * IP地址 - 发布时的IP地址
     */
    @TableField("ip_address")
    private String ipAddress;

    /**
     * 设备信息 - 发布设备标识
     */
    @TableField("device_info")
    private String deviceInfo;

    /**
     * 审核状态 - pending/approved/rejected
     */
    @TableField("audit_status")
    private String auditStatus;

    /**
     * 审核员ID
     */
    @TableField("auditor_id")
    private Long auditorId;

    /**
     * 审核时间
     */
    @TableField("audit_time")
    private LocalDateTime auditTime;

    /**
     * 审核备注
     */
    @TableField("audit_remark")
    private String auditRemark;

    /**
     * 创建时间 - 自动填充
     */
    @TableField(value = "create_time", fill = FieldFill.INSERT)
    private LocalDateTime createTime;

    /**
     * 更新时间 - 自动填充
     */
    @TableField(value = "update_time", fill = FieldFill.INSERT_UPDATE)
    private LocalDateTime updateTime;

    /**
     * 逻辑删除字段 - 0:未删除 1:已删除
     */
    @TableLogic
    @TableField("deleted")
    private Boolean deleted;

    /**
     * 乐观锁版本号
     */
    @Version
    @TableField("version")
    private Integer version;
}

/**
 * 媒体文件实体类
 * 
 * 数据表: publish_media
 * 描述: 发布动态的媒体文件信息
 */
@Data
@EqualsAndHashCode(callSuper = false)
@Accessors(chain = true)
@TableName("publish_media")
class PublishMedia implements Serializable {

    private static final long serialVersionUID = 1L;

    /**
     * 主键ID
     */
    @TableId(value = "id", type = IdType.ASSIGN_ID)
    private Long id;

    /**
     * 关联的动态ID
     */
    @TableField("post_id")
    private Long postId;

    /**
     * 媒体类型 - image/video
     */
    @TableField("media_type")
    private String mediaType;

    /**
     * 原始文件名
     */
    @TableField("original_name")
    private String originalName;

    /**
     * 存储文件名
     */
    @TableField("storage_name")
    private String storageName;

    /**
     * 文件大小 - 字节数
     */
    @TableField("file_size")
    private Long fileSize;

    /**
     * 媒体宽度
     */
    @TableField("width")
    private Integer width;

    /**
     * 媒体高度
     */
    @TableField("height")
    private Integer height;

    /**
     * 视频时长 - 秒数
     */
    @TableField("duration")
    private Integer duration;

    /**
     * 缩略图URL
     */
    @TableField("thumbnail_url")
    private String thumbnailUrl;

    /**
     * 完整文件URL
     */
    @TableField("file_url")
    private String fileUrl;

    /**
     * 存储路径
     */
    @TableField("storage_path")
    private String storagePath;

    /**
     * MIME类型
     */
    @TableField("mime_type")
    private String mimeType;

    /**
     * 排序顺序
     */
    @TableField("sort_order")
    private Integer sortOrder;

    /**
     * 上传状态 - uploading/completed/failed
     */
    @TableField("upload_status")
    private String uploadStatus;

    /**
     * 创建时间
     */
    @TableField(value = "create_time", fill = FieldFill.INSERT)
    private LocalDateTime createTime;

    /**
     * 更新时间
     */
    @TableField(value = "update_time", fill = FieldFill.INSERT_UPDATE)
    private LocalDateTime updateTime;

    /**
     * 逻辑删除
     */
    @TableLogic
    @TableField("deleted")
    private Boolean deleted;
}

/**
 * 话题实体类
 * 
 * 数据表: publish_topic
 * 描述: 话题标签信息
 */
@Data
@EqualsAndHashCode(callSuper = false)
@Accessors(chain = true)
@TableName("publish_topic")
class PublishTopic implements Serializable {

    private static final long serialVersionUID = 1L;

    /**
     * 主键ID
     */
    @TableId(value = "id", type = IdType.ASSIGN_ID)
    private Long id;

    /**
     * 话题名称
     */
    @TableField("topic_name")
    private String topicName;

    /**
     * 话题描述
     */
    @TableField("description")
    private String description;

    /**
     * 话题分类
     */
    @TableField("category")
    private String category;

    /**
     * 封面图URL
     */
    @TableField("cover_url")
    private String coverUrl;

    /**
     * 参与人数
     */
    @TableField("participant_count")
    private Integer participantCount;

    /**
     * 动态数量
     */
    @TableField("post_count")
    private Integer postCount;

    /**
     * 热度分数
     */
    @TableField("hot_score")
    private Double hotScore;

    /**
     * 是否热门话题
     */
    @TableField("is_hot")
    private Boolean isHot;

    /**
     * 话题状态 - active/inactive/banned
     */
    @TableField("status")
    private String status;

    /**
     * 创建时间
     */
    @TableField(value = "create_time", fill = FieldFill.INSERT)
    private LocalDateTime createTime;

    /**
     * 更新时间
     */
    @TableField(value = "update_time", fill = FieldFill.INSERT_UPDATE)
    private LocalDateTime updateTime;

    /**
     * 逻辑删除
     */
    @TableLogic
    @TableField("deleted")
    private Boolean deleted;
}

/**
 * 地点信息实体类
 * 
 * 数据表: publish_location
 * 描述: 地理位置信息
 */
@Data
@EqualsAndHashCode(callSuper = false)
@Accessors(chain = true)
@TableName("publish_location")
class PublishLocation implements Serializable {

    private static final long serialVersionUID = 1L;

    /**
     * 主键ID
     */
    @TableId(value = "id", type = IdType.ASSIGN_ID)
    private Long id;

    /**
     * POI名称
     */
    @TableField("poi_name")
    private String poiName;

    /**
     * 详细地址
     */
    @TableField("address")
    private String address;

    /**
     * 纬度
     */
    @TableField("latitude")
    private Double latitude;

    /**
     * 经度
     */
    @TableField("longitude")
    private Double longitude;

    /**
     * 地点分类
     */
    @TableField("category")
    private String category;

    /**
     * 省份
     */
    @TableField("province")
    private String province;

    /**
     * 城市
     */
    @TableField("city")
    private String city;

    /**
     * 区县
     */
    @TableField("district")
    private String district;

    /**
     * 使用次数
     */
    @TableField("usage_count")
    private Integer usageCount;

    /**
     * 创建时间
     */
    @TableField(value = "create_time", fill = FieldFill.INSERT)
    private LocalDateTime createTime;

    /**
     * 更新时间
     */
    @TableField(value = "update_time", fill = FieldFill.INSERT_UPDATE)
    private LocalDateTime updateTime;

    /**
     * 逻辑删除
     */
    @TableLogic
    @TableField("deleted")
    private Boolean deleted;
}
