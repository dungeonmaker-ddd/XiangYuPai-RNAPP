/**
 * 瀑布流卡片点赞实体类
 * 基于通用组件架构核心标准 - 后端交互层
 * 使用 MyBatis Plus 注解
 * 
 * @version 2.0.0
 * @author 架构团队
 */

package com.xiangyu.waterfall.entity;

import com.baomidou.mybatisplus.annotation.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

/**
 * 瀑布流内容点赞实体类
 * 记录用户对瀑布流内容的点赞行为
 */
@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
@TableName("waterfall_content_like")
public class WaterfallCardLike {

    // =====================================================
    // 主键字段
    // =====================================================
    
    /**
     * 主键ID - 自增
     */
    @TableId(type = IdType.AUTO)
    private Long id;
    
    /**
     * 全局唯一标识
     */
    @TableField("uuid")
    private String uuid;

    // =====================================================
    // 核心业务字段
    // =====================================================
    
    /**
     * 内容ID - 被点赞的内容
     */
    @TableField("content_id")
    private String contentId;
    
    /**
     * 用户ID - 点赞的用户
     */
    @TableField("user_id")
    private Long userId;
    
    /**
     * 点赞状态 - 1:点赞, 0:取消点赞
     */
    @TableField("like_status")
    private Integer likeStatus;
    
    /**
     * 内容类型 - image, video, live
     */
    @TableField("content_type")
    private String contentType;
    
    /**
     * 来源标签页 - recommend, following, nearby等
     */
    @TableField("source_tab")
    private String sourceTab;
    
    /**
     * 来源位置索引
     */
    @TableField("source_index")
    private Integer sourceIndex;

    // =====================================================
    // 扩展信息字段
    // =====================================================
    
    /**
     * 客户端时间戳
     */
    @TableField("client_timestamp")
    private Long clientTimestamp;
    
    /**
     * IP地址
     */
    @TableField("ip_address")
    private String ipAddress;
    
    /**
     * 设备信息
     */
    @TableField("device_info")
    private String deviceInfo;
    
    /**
     * 用户代理
     */
    @TableField("user_agent")
    private String userAgent;
    
    /**
     * 地理位置信息 - JSON格式
     */
    @TableField("location_info")
    private String locationInfo;

    // =====================================================
    // 统计字段
    // =====================================================
    
    /**
     * 点赞持续时长（毫秒）- 用于分析用户行为
     */
    @TableField("like_duration")
    private Long likeDuration;
    
    /**
     * 是否快速点赞 - 连续快速点击标识
     */
    @TableField("is_quick_like")
    private Boolean isQuickLike;
    
    /**
     * 同批次操作ID - 用于批量操作关联
     */
    @TableField("batch_id")
    private String batchId;

    // =====================================================
    // 时间字段
    // =====================================================
    
    /**
     * 创建时间 - 插入时自动填充
     */
    @TableField(value = "created_at", fill = FieldFill.INSERT)
    private LocalDateTime createdAt;
    
    /**
     * 更新时间 - 插入和更新时自动填充
     */
    @TableField(value = "updated_at", fill = FieldFill.INSERT_UPDATE)
    private LocalDateTime updatedAt;
    
    /**
     * 软删除时间
     */
    @TableLogic
    @TableField("deleted_at")
    private LocalDateTime deletedAt;

    // =====================================================
    // 操作字段
    // =====================================================
    
    /**
     * 创建人ID
     */
    @TableField(value = "created_by", fill = FieldFill.INSERT)
    private Long createdBy;
    
    /**
     * 更新人ID
     */
    @TableField(value = "updated_by", fill = FieldFill.INSERT_UPDATE)
    private Long updatedBy;

    // =====================================================
    // 扩展字段
    // =====================================================
    
    /**
     * 扩展信息 - JSON格式存储额外数据
     */
    @TableField(value = "extra_data", typeHandler = com.baomidou.mybatisplus.extension.handlers.JacksonTypeHandler.class)
    private java.util.Map<String, Object> extraData;
    
    /**
     * 标签列表 - JSON数组格式
     */
    @TableField(value = "tags", typeHandler = com.baomidou.mybatisplus.extension.handlers.JacksonTypeHandler.class)
    private java.util.List<String> tags;
    
    /**
     * 版本号 - 乐观锁
     */
    @Version
    @TableField("version")
    private Integer version;

    // =====================================================
    // 非数据库字段
    // =====================================================
    
    /**
     * 用户信息 - 关联查询时使用
     */
    @TableField(exist = false)
    private UserInfo userInfo;
    
    /**
     * 内容信息 - 关联查询时使用
     */
    @TableField(exist = false)
    private ContentInfo contentInfo;
    
    /**
     * 是否为新记录 - 业务逻辑判断使用
     */
    @TableField(exist = false)
    private Boolean isNewRecord;

    // =====================================================
    // 内部类定义
    // =====================================================
    
    /**
     * 用户信息内部类
     */
    @Data
    public static class UserInfo {
        private Long userId;
        private String nickname;
        private String avatar;
        private Boolean verified;
        private Integer level;
    }
    
    /**
     * 内容信息内部类
     */
    @Data
    public static class ContentInfo {
        private String contentId;
        private String title;
        private String type;
        private Long authorId;
        private String authorNickname;
        private Integer totalLikes;
    }

    // =====================================================
    // 业务方法
    // =====================================================
    
    /**
     * 是否为点赞状态
     */
    public boolean isLiked() {
        return this.likeStatus != null && this.likeStatus == 1;
    }
    
    /**
     * 是否为有效记录（未删除）
     */
    public boolean isValid() {
        return this.deletedAt == null;
    }
    
    /**
     * 获取点赞操作类型描述
     */
    public String getLikeActionDescription() {
        return isLiked() ? "点赞" : "取消点赞";
    }
    
    /**
     * 是否为今天的记录
     */
    public boolean isToday() {
        if (this.createdAt == null) return false;
        return this.createdAt.toLocalDate().equals(java.time.LocalDate.now());
    }
    
    /**
     * 获取点赞时长描述
     */
    public String getLikeDurationDescription() {
        if (this.likeDuration == null) return "未知";
        
        if (this.likeDuration < 1000) {
            return "瞬间点赞";
        } else if (this.likeDuration < 5000) {
            return "快速点赞";
        } else {
            return "深度点赞";
        }
    }

    // =====================================================
    // 常量定义
    // =====================================================
    
    /**
     * 点赞状态常量
     */
    public static final class LikeStatus {
        public static final Integer LIKED = 1;
        public static final Integer UNLIKED = 0;
    }
    
    /**
     * 内容类型常量
     */
    public static final class ContentType {
        public static final String IMAGE = "image";
        public static final String VIDEO = "video";
        public static final String LIVE = "live";
    }
    
    /**
     * 来源标签常量
     */
    public static final class SourceTab {
        public static final String RECOMMEND = "recommend";
        public static final String FOLLOWING = "following";
        public static final String NEARBY = "nearby";
        public static final String HOT = "hot";
    }
}
