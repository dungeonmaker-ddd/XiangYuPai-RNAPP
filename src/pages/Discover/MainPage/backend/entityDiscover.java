/**
 * 发现内容实体类
 * MyBatis-Plus标准实体配置
 * 
 * 包含：内容实体、用户实体、互动实体、位置实体
 */

package com.xiangyupai.discover.entity;

import com.baomidou.mybatisplus.annotation.*;
import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.experimental.Accessors;

import java.io.Serializable;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

/**
 * 发现内容实体
 * 
 * 表名：discover_content
 * 主键：content_id
 * 功能：存储用户发布的内容信息
 */
@Data
@EqualsAndHashCode(callSuper = false)
@Accessors(chain = true)
@TableName("discover_content")
public class DiscoverContentEntity implements Serializable {

    private static final long serialVersionUID = 1L;

    /**
     * 内容ID - 主键
     */
    @TableId(value = "content_id", type = IdType.ASSIGN_ID)
    private String contentId;

    /**
     * 发布用户ID
     */
    @TableField("user_id")
    private String userId;

    /**
     * 内容类型：image-图片, video-视频, text-文字
     */
    @TableField("content_type")
    private String contentType;

    /**
     * 内容标题
     */
    @TableField("title")
    private String title;

    /**
     * 内容描述
     */
    @TableField("description")
    private String description;

    /**
     * 图片URL列表（JSON格式存储）
     */
    @TableField("images")
    private String images;

    /**
     * 视频URL
     */
    @TableField("video_url")
    private String videoUrl;

    /**
     * 视频缩略图URL
     */
    @TableField("video_thumbnail")
    private String videoThumbnail;

    /**
     * 视频时长（秒）
     */
    @TableField("video_duration")
    private Integer videoDuration;

    /**
     * 点赞数量
     */
    @TableField("like_count")
    private Integer likeCount;

    /**
     * 收藏数量
     */
    @TableField("collect_count")
    private Integer collectCount;

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
     * 热度分数（用于热门排序）
     */
    @TableField("hot_score")
    private BigDecimal hotScore;

    /**
     * 内容标签（JSON格式存储）
     */
    @TableField("tags")
    private String tags;

    /**
     * 话题ID列表（JSON格式存储）
     */
    @TableField("topic_ids")
    private String topicIds;

    /**
     * 发布位置 - 纬度
     */
    @TableField("latitude")
    private BigDecimal latitude;

    /**
     * 发布位置 - 经度
     */
    @TableField("longitude")
    private BigDecimal longitude;

    /**
     * 详细地址
     */
    @TableField("address")
    private String address;

    /**
     * 城市
     */
    @TableField("city")
    private String city;

    /**
     * 区域
     */
    @TableField("district")
    private String district;

    /**
     * 商家ID（同城内容关联商家）
     */
    @TableField("merchant_id")
    private String merchantId;

    /**
     * 内容状态：0-草稿, 1-已发布, 2-审核中, 3-审核失败, 4-已删除
     */
    @TableField("status")
    private Integer status;

    /**
     * 审核状态：0-待审核, 1-审核通过, 2-审核拒绝
     */
    @TableField("audit_status")
    private Integer auditStatus;

    /**
     * 审核失败原因
     */
    @TableField("audit_reason")
    private String auditReason;

    /**
     * 是否置顶：0-否, 1-是
     */
    @TableField("is_top")
    private Integer isTop;

    /**
     * 是否推荐：0-否, 1-是
     */
    @TableField("is_recommend")
    private Integer isRecommend;

    /**
     * 权重（影响排序）
     */
    @TableField("weight")
    private Integer weight;

    /**
     * 扩展字段（JSON格式）
     */
    @TableField("extra_data")
    private String extraData;

    /**
     * 创建时间
     */
    @TableField(value = "created_at", fill = FieldFill.INSERT)
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss", timezone = "GMT+8")
    private LocalDateTime createdAt;

    /**
     * 更新时间
     */
    @TableField(value = "updated_at", fill = FieldFill.INSERT_UPDATE)
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss", timezone = "GMT+8")
    private LocalDateTime updatedAt;

    /**
     * 是否删除：0-未删除, 1-已删除
     */
    @TableLogic
    @TableField("is_deleted")
    private Integer isDeleted;

    /**
     * 版本号（乐观锁）
     */
    @Version
    @TableField("version")
    private Integer version;
}

/**
 * 用户信息实体
 * 
 * 表名：user_info
 * 主键：user_id
 * 功能：存储用户基本信息
 */
@Data
@EqualsAndHashCode(callSuper = false)
@Accessors(chain = true)
@TableName("user_info")
public class UserInfoEntity implements Serializable {

    private static final long serialVersionUID = 1L;

    /**
     * 用户ID - 主键
     */
    @TableId(value = "user_id", type = IdType.ASSIGN_ID)
    private String userId;

    /**
     * 用户昵称
     */
    @TableField("nickname")
    private String nickname;

    /**
     * 头像URL
     */
    @TableField("avatar")
    private String avatar;

    /**
     * 用户等级
     */
    @TableField("level")
    private Integer level;

    /**
     * 是否认证：0-未认证, 1-已认证
     */
    @TableField("is_verified")
    private Integer isVerified;

    /**
     * 认证类型：1-个人认证, 2-企业认证, 3-官方认证
     */
    @TableField("verify_type")
    private Integer verifyType;

    /**
     * 认证标识
     */
    @TableField("verify_mark")
    private String verifyMark;

    /**
     * 粉丝数量
     */
    @TableField("follower_count")
    private Integer followerCount;

    /**
     * 关注数量
     */
    @TableField("following_count")
    private Integer followingCount;

    /**
     * 获赞总数
     */
    @TableField("total_like_count")
    private Integer totalLikeCount;

    /**
     * 作品数量
     */
    @TableField("content_count")
    private Integer contentCount;

    /**
     * 用户状态：0-正常, 1-封禁, 2-注销
     */
    @TableField("status")
    private Integer status;

    /**
     * 最后活跃时间
     */
    @TableField("last_active_at")
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss", timezone = "GMT+8")
    private LocalDateTime lastActiveAt;

    /**
     * 创建时间
     */
    @TableField(value = "created_at", fill = FieldFill.INSERT)
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss", timezone = "GMT+8")
    private LocalDateTime createdAt;

    /**
     * 更新时间
     */
    @TableField(value = "updated_at", fill = FieldFill.INSERT_UPDATE)
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss", timezone = "GMT+8")
    private LocalDateTime updatedAt;

    /**
     * 是否删除：0-未删除, 1-已删除
     */
    @TableLogic
    @TableField("is_deleted")
    private Integer isDeleted;
}

/**
 * 用户互动实体
 * 
 * 表名：user_interaction
 * 主键：interaction_id
 * 功能：存储用户与内容的互动记录（点赞、收藏、分享等）
 */
@Data
@EqualsAndHashCode(callSuper = false)
@Accessors(chain = true)
@TableName("user_interaction")
public class UserInteractionEntity implements Serializable {

    private static final long serialVersionUID = 1L;

    /**
     * 互动ID - 主键
     */
    @TableId(value = "interaction_id", type = IdType.ASSIGN_ID)
    private String interactionId;

    /**
     * 用户ID
     */
    @TableField("user_id")
    private String userId;

    /**
     * 内容ID
     */
    @TableField("content_id")
    private String contentId;

    /**
     * 内容作者ID
     */
    @TableField("author_id")
    private String authorId;

    /**
     * 互动类型：1-点赞, 2-收藏, 3-分享, 4-评论, 5-浏览
     */
    @TableField("interaction_type")
    private Integer interactionType;

    /**
     * 互动状态：0-取消, 1-生效
     */
    @TableField("status")
    private Integer status;

    /**
     * 互动来源：1-热门页, 2-关注页, 3-同城页, 4-详情页, 5-搜索页
     */
    @TableField("source")
    private Integer source;

    /**
     * 互动设备：1-iOS, 2-Android, 3-Web, 4-小程序
     */
    @TableField("device")
    private Integer device;

    /**
     * 用户位置 - 纬度
     */
    @TableField("latitude")
    private BigDecimal latitude;

    /**
     * 用户位置 - 经度
     */
    @TableField("longitude")
    private BigDecimal longitude;

    /**
     * 扩展数据（JSON格式）
     */
    @TableField("extra_data")
    private String extraData;

    /**
     * 创建时间
     */
    @TableField(value = "created_at", fill = FieldFill.INSERT)
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss", timezone = "GMT+8")
    private LocalDateTime createdAt;

    /**
     * 更新时间
     */
    @TableField(value = "updated_at", fill = FieldFill.INSERT_UPDATE)
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss", timezone = "GMT+8")
    private LocalDateTime updatedAt;

    /**
     * 是否删除：0-未删除, 1-已删除
     */
    @TableLogic
    @TableField("is_deleted")
    private Integer isDeleted;
}

/**
 * 用户关注关系实体
 * 
 * 表名：user_follow
 * 主键：follow_id
 * 功能：存储用户之间的关注关系
 */
@Data
@EqualsAndHashCode(callSuper = false)
@Accessors(chain = true)
@TableName("user_follow")
public class UserFollowEntity implements Serializable {

    private static final long serialVersionUID = 1L;

    /**
     * 关注ID - 主键
     */
    @TableId(value = "follow_id", type = IdType.ASSIGN_ID)
    private String followId;

    /**
     * 关注者ID
     */
    @TableField("follower_id")
    private String followerId;

    /**
     * 被关注者ID
     */
    @TableField("following_id")
    private String followingId;

    /**
     * 关注状态：0-取消关注, 1-已关注, 2-互相关注
     */
    @TableField("status")
    private Integer status;

    /**
     * 关注来源：1-推荐, 2-搜索, 3-内容页, 4-用户页
     */
    @TableField("source")
    private Integer source;

    /**
     * 关注时间
     */
    @TableField(value = "created_at", fill = FieldFill.INSERT)
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss", timezone = "GMT+8")
    private LocalDateTime createdAt;

    /**
     * 更新时间
     */
    @TableField(value = "updated_at", fill = FieldFill.INSERT_UPDATE)
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss", timezone = "GMT+8")
    private LocalDateTime updatedAt;

    /**
     * 是否删除：0-未删除, 1-已删除
     */
    @TableLogic
    @TableField("is_deleted")
    private Integer isDeleted;
}

/**
 * 商家信息实体
 * 
 * 表名：merchant_info
 * 主键：merchant_id
 * 功能：存储商家信息（同城Tab专用）
 */
@Data
@EqualsAndHashCode(callSuper = false)
@Accessors(chain = true)
@TableName("merchant_info")
public class MerchantInfoEntity implements Serializable {

    private static final long serialVersionUID = 1L;

    /**
     * 商家ID - 主键
     */
    @TableId(value = "merchant_id", type = IdType.ASSIGN_ID)
    private String merchantId;

    /**
     * 商家名称
     */
    @TableField("name")
    private String name;

    /**
     * 商家类型：1-餐饮, 2-购物, 3-娱乐, 4-服务, 5-其他
     */
    @TableField("category")
    private Integer category;

    /**
     * 是否认证：0-未认证, 1-已认证
     */
    @TableField("is_verified")
    private Integer isVerified;

    /**
     * 营业状态：0-休息中, 1-营业中, 2-暂停营业
     */
    @TableField("is_open")
    private Integer isOpen;

    /**
     * 联系电话
     */
    @TableField("phone")
    private String phone;

    /**
     * 营业时间
     */
    @TableField("business_hours")
    private String businessHours;

    /**
     * 商家位置 - 纬度
     */
    @TableField("latitude")
    private BigDecimal latitude;

    /**
     * 商家位置 - 经度
     */
    @TableField("longitude")
    private BigDecimal longitude;

    /**
     * 详细地址
     */
    @TableField("address")
    private String address;

    /**
     * 城市
     */
    @TableField("city")
    private String city;

    /**
     * 区域
     */
    @TableField("district")
    private String district;

    /**
     * 商家评分
     */
    @TableField("rating")
    private BigDecimal rating;

    /**
     * 评价数量
     */
    @TableField("review_count")
    private Integer reviewCount;

    /**
     * 商家状态：0-正常, 1-暂停, 2-关闭
     */
    @TableField("status")
    private Integer status;

    /**
     * 创建时间
     */
    @TableField(value = "created_at", fill = FieldFill.INSERT)
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss", timezone = "GMT+8")
    private LocalDateTime createdAt;

    /**
     * 更新时间
     */
    @TableField(value = "updated_at", fill = FieldFill.INSERT_UPDATE)
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss", timezone = "GMT+8")
    private LocalDateTime updatedAt;

    /**
     * 是否删除：0-未删除, 1-已删除
     */
    @TableLogic
    @TableField("is_deleted")
    private Integer isDeleted;
}
