/**
 * 瀑布流内容实体类
 * 基于通用组件架构核心标准 - 后端交互层
 * 使用 MyBatis Plus 框架
 * 
 * @version 2.0.0
 * @author 架构团队
 */

package com.xiangyu.discover.waterfall.entity;

import com.baomidou.mybatisplus.annotation.*;
import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.experimental.Accessors;

import java.io.Serializable;
import java.time.LocalDateTime;
import java.math.BigDecimal;

/**
 * 瀑布流内容实体
 * 对应数据库表: waterfall_content
 */
@Data
@EqualsAndHashCode(callSuper = false)
@Accessors(chain = true)
@TableName("waterfall_content")
public class WaterfallContentEntity implements Serializable {

    private static final long serialVersionUID = 1L;

    /**
     * 主键ID
     */
    @TableId(value = "id", type = IdType.ASSIGN_ID)
    private String id;

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
     * 图片URL
     */
    @TableField("image_url")
    private String imageUrl;

    /**
     * 视频URL
     */
    @TableField("video_url")
    private String videoUrl;

    /**
     * 直播间ID
     */
    @TableField("live_room_id")
    private String liveRoomId;

    /**
     * 内容类型: image, video, live
     */
    @TableField("content_type")
    private String contentType;

    /**
     * 图片宽度
     */
    @TableField("image_width")
    private Integer imageWidth;

    /**
     * 图片高度
     */
    @TableField("image_height")
    private Integer imageHeight;

    /**
     * 发布用户ID
     */
    @TableField("user_id")
    private String userId;

    /**
     * 发布用户昵称 (冗余字段，用于查询优化)
     */
    @TableField("user_nickname")
    private String userNickname;

    /**
     * 发布用户头像 (冗余字段，用于查询优化)
     */
    @TableField("user_avatar")
    private String userAvatar;

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
     * 收藏数量
     */
    @TableField("collect_count")
    private Integer collectCount;

    /**
     * 浏览数量
     */
    @TableField("view_count")
    private Integer viewCount;

    /**
     * 内容标签，JSON格式存储
     */
    @TableField("tags")
    private String tags;

    /**
     * 地理位置纬度
     */
    @TableField("latitude")
    private BigDecimal latitude;

    /**
     * 地理位置经度
     */
    @TableField("longitude")
    private BigDecimal longitude;

    /**
     * 地址信息
     */
    @TableField("address")
    private String address;

    /**
     * 内容状态: 0-草稿, 1-已发布, 2-审核中, 3-审核失败, 4-已删除
     */
    @TableField("status")
    private Integer status;

    /**
     * 审核状态: 0-待审核, 1-审核通过, 2-审核拒绝
     */
    @TableField("audit_status")
    private Integer auditStatus;

    /**
     * 审核备注
     */
    @TableField("audit_remark")
    private String auditRemark;

    /**
     * 热度分数 (用于热门排序)
     */
    @TableField("hot_score")
    private BigDecimal hotScore;

    /**
     * 推荐权重
     */
    @TableField("recommend_weight")
    private BigDecimal recommendWeight;

    /**
     * 是否置顶: 0-否, 1-是
     */
    @TableField("is_top")
    private Integer isTop;

    /**
     * 置顶过期时间
     */
    @TableField("top_expire_time")
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private LocalDateTime topExpireTime;

    /**
     * 是否推荐: 0-否, 1-是
     */
    @TableField("is_recommend")
    private Integer isRecommend;

    /**
     * 推荐过期时间
     */
    @TableField("recommend_expire_time")
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private LocalDateTime recommendExpireTime;

    /**
     * 扩展字段，JSON格式存储
     */
    @TableField("extra_data")
    private String extraData;

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
     * 创建人ID
     */
    @TableField(value = "created_by", fill = FieldFill.INSERT)
    private String createdBy;

    /**
     * 更新人ID
     */
    @TableField(value = "updated_by", fill = FieldFill.INSERT_UPDATE)
    private String updatedBy;

    /**
     * 逻辑删除标记: 0-未删除, 1-已删除
     */
    @TableLogic
    @TableField("is_deleted")
    private Integer isDeleted;

    /**
     * 乐观锁版本号
     */
    @Version
    @TableField("version")
    private Integer version;

    // =====================================================
    // 业务方法
    // =====================================================

    /**
     * 是否为图片内容
     */
    public boolean isImageContent() {
        return "image".equals(this.contentType);
    }

    /**
     * 是否为视频内容
     */
    public boolean isVideoContent() {
        return "video".equals(this.contentType);
    }

    /**
     * 是否为直播内容
     */
    public boolean isLiveContent() {
        return "live".equals(this.contentType);
    }

    /**
     * 是否已发布
     */
    public boolean isPublished() {
        return Integer.valueOf(1).equals(this.status);
    }

    /**
     * 是否审核通过
     */
    public boolean isAuditPassed() {
        return Integer.valueOf(1).equals(this.auditStatus);
    }

    /**
     * 是否置顶且未过期
     */
    public boolean isTopAndValid() {
        return Integer.valueOf(1).equals(this.isTop) && 
               (this.topExpireTime == null || this.topExpireTime.isAfter(LocalDateTime.now()));
    }

    /**
     * 是否推荐且未过期
     */
    public boolean isRecommendAndValid() {
        return Integer.valueOf(1).equals(this.isRecommend) && 
               (this.recommendExpireTime == null || this.recommendExpireTime.isAfter(LocalDateTime.now()));
    }

    /**
     * 计算互动总数
     */
    public Integer getTotalInteractionCount() {
        int likes = this.likeCount != null ? this.likeCount : 0;
        int comments = this.commentCount != null ? this.commentCount : 0;
        int shares = this.shareCount != null ? this.shareCount : 0;
        int collects = this.collectCount != null ? this.collectCount : 0;
        return likes + comments + shares + collects;
    }

    /**
     * 获取宽高比
     */
    public Double getAspectRatio() {
        if (this.imageWidth != null && this.imageHeight != null && this.imageHeight > 0) {
            return (double) this.imageWidth / this.imageHeight;
        }
        return null;
    }

    // =====================================================
    // 常量定义
    // =====================================================

    /**
     * 内容类型常量
     */
    public static class ContentType {
        public static final String IMAGE = "image";
        public static final String VIDEO = "video";
        public static final String LIVE = "live";
    }

    /**
     * 状态常量
     */
    public static class Status {
        public static final int DRAFT = 0;      // 草稿
        public static final int PUBLISHED = 1;  // 已发布
        public static final int AUDITING = 2;   // 审核中
        public static final int AUDIT_FAILED = 3; // 审核失败
        public static final int DELETED = 4;    // 已删除
    }

    /**
     * 审核状态常量
     */
    public static class AuditStatus {
        public static final int PENDING = 0;    // 待审核
        public static final int PASSED = 1;     // 审核通过
        public static final int REJECTED = 2;   // 审核拒绝
    }
}
