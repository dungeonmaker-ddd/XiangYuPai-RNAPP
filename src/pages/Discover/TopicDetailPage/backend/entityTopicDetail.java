/**
 * 话题详情数据实体类 - MyBatis-Plus标准配置
 * 
 * TOC (快速跳转):
 * [1] Imports
 * [2] Entity Class Definition  
 * [3] Table Configuration
 * [4] Field Definitions
 * [5] Constructors
 * [6] Getters & Setters
 * [7] Override Methods
 * [8] Builder Pattern
 */

// #region 1. Imports
package com.xiangyupai.pages.discover.topicdetail.entity;

import com.baomidou.mybatisplus.annotation.*;
import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serializable;
import java.time.LocalDateTime;
import java.util.Date;
// #endregion

// #region 2. Entity Class Definition
/**
 * 话题实体类
 * 对应数据库表: xp_topic
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@TableName("xp_topic")
public class TopicEntity implements Serializable {

    private static final long serialVersionUID = 1L;
// #endregion

// #region 3. Table Configuration & Primary Key
    /**
     * 话题ID - 主键
     */
    @TableId(value = "topic_id", type = IdType.ASSIGN_ID)
    private String topicId;
// #endregion

// #region 4. Field Definitions
    /**
     * 话题名称 (如: S10全球总决赛)
     */
    @TableField("topic_name")
    private String topicName;

    /**
     * 话题标题 (显示用)
     */
    @TableField("topic_title")
    private String topicTitle;

    /**
     * 话题描述
     */
    @TableField("topic_description")
    private String topicDescription;

    /**
     * 话题封面图片URL
     */
    @TableField("cover_image_url")
    private String coverImageUrl;

    /**
     * 话题下的动态数量
     */
    @TableField("post_count")
    private Integer postCount;

    /**
     * 参与话题的用户数量
     */
    @TableField("participant_count")
    private Integer participantCount;

    /**
     * 话题热度值
     */
    @TableField("hotness_score")
    private Integer hotnessScore;

    /**
     * 话题分类
     */
    @TableField("topic_category")
    private String topicCategory;

    /**
     * 话题标签 (JSON格式存储)
     */
    @TableField("topic_tags")
    private String topicTags;

    /**
     * 话题状态 (0-禁用, 1-启用, 2-热门推荐)
     */
    @TableField("topic_status")
    private Integer topicStatus;

    /**
     * 创建时间
     */
    @TableField(value = "created_at", fill = FieldFill.INSERT)
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private LocalDateTime createdAt;

    /**
     * 更新时间
     */
    @TableField(value = "updated_at", fill = FieldFill.INSERT_UPDATE)
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private LocalDateTime updatedAt;

    /**
     * 逻辑删除标记 (0-未删除, 1-已删除)
     */
    @TableLogic
    @TableField("is_deleted")
    private Integer isDeleted;
// #endregion

// #region 5. Constructors
    // Lombok @NoArgsConstructor, @AllArgsConstructor 已处理
// #endregion

// #region 6. Getters & Setters  
    // Lombok @Data 已处理
// #endregion

// #region 7. Override Methods
    @Override
    public String toString() {
        return "TopicEntity{" +
                "topicId='" + topicId + '\'' +
                ", topicName='" + topicName + '\'' +
                ", topicTitle='" + topicTitle + '\'' +
                ", postCount=" + postCount +
                ", participantCount=" + participantCount +
                ", hotnessScore=" + hotnessScore +
                ", topicStatus=" + topicStatus +
                ", createdAt=" + createdAt +
                ", updatedAt=" + updatedAt +
                '}';
    }
// #endregion

// #region 8. Builder Pattern
    // Lombok @Builder 已处理
// #endregion
}

/**
 * 话题动态实体类
 * 对应数据库表: xp_topic_post
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@TableName("xp_topic_post")
class TopicPostEntity implements Serializable {

    private static final long serialVersionUID = 1L;

    /**
     * 动态ID - 主键
     */
    @TableId(value = "post_id", type = IdType.ASSIGN_ID)
    private String postId;

    /**
     * 关联话题ID
     */
    @TableField("topic_id")
    private String topicId;

    /**
     * 发布用户ID
     */
    @TableField("user_id")
    private String userId;

    /**
     * 动态标题
     */
    @TableField("post_title")
    private String postTitle;

    /**
     * 动态内容
     */
    @TableField("post_content")
    private String postContent;

    /**
     * 媒体文件URLs (JSON格式存储)
     */
    @TableField("media_urls")
    private String mediaUrls;

    /**
     * 发布位置信息 (JSON格式存储)
     */
    @TableField("location_info")
    private String locationInfo;

    /**
     * 话题标签 (JSON格式存储)
     */
    @TableField("hashtags")
    private String hashtags;

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
     * 动态状态 (0-草稿, 1-已发布, 2-已隐藏)
     */
    @TableField("post_status")
    private Integer postStatus;

    /**
     * 创建时间
     */
    @TableField(value = "created_at", fill = FieldFill.INSERT)
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private LocalDateTime createdAt;

    /**
     * 更新时间
     */
    @TableField(value = "updated_at", fill = FieldFill.INSERT_UPDATE)
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private LocalDateTime updatedAt;

    /**
     * 逻辑删除标记
     */
    @TableLogic
    @TableField("is_deleted")
    private Integer isDeleted;
}

/**
 * 用户信息实体类 (简化版，用于话题详情关联)
 * 对应数据库表: xp_user
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@TableName("xp_user")
class UserEntity implements Serializable {

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
     * 用户头像URL
     */
    @TableField("avatar_url")
    private String avatarUrl;

    /**
     * 用户等级
     */
    @TableField("user_level")
    private Integer userLevel;

    /**
     * 认证状态 (0-未认证, 1-已认证)
     */
    @TableField("verified_status")
    private Integer verifiedStatus;

    /**
     * 用户标签信息 (JSON格式存储)
     */
    @TableField("user_badges")
    private String userBadges;

    /**
     * 关注数量
     */
    @TableField("follow_count")
    private Integer followCount;

    /**
     * 粉丝数量
     */
    @TableField("fans_count")
    private Integer fansCount;

    /**
     * 用户状态 (0-禁用, 1-正常, 2-VIP)
     */
    @TableField("user_status")
    private Integer userStatus;

    /**
     * 创建时间
     */
    @TableField(value = "created_at", fill = FieldFill.INSERT)
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private LocalDateTime createdAt;

    /**
     * 更新时间  
     */
    @TableField(value = "updated_at", fill = FieldFill.INSERT_UPDATE)
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private LocalDateTime updatedAt;

    /**
     * 逻辑删除标记
     */
    @TableLogic
    @TableField("is_deleted")
    private Integer isDeleted;
}
