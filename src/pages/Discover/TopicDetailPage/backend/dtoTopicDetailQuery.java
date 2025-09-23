/**
 * 话题详情查询DTO - 只包含前端实际需要的数据传输对象
 * 
 * 核心DTO：
 * 1. 话题信息请求/响应
 * 2. 话题动态列表请求/响应  
 * 3. 点赞操作请求/响应
 * 
 * 设计原则：最小化数据传输，避免过度设计
 */

// #region 1. Imports
package com.xiangyupai.pages.discover.topicdetail.dto;

import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.validation.constraints.*;
import java.io.Serializable;
import java.time.LocalDateTime;
import java.util.List;
// #endregion

// #region 2. DTO Class Definitions

/**
 * 获取话题信息请求DTO
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class GetTopicInfoRequestDTO implements Serializable {

    private static final long serialVersionUID = 1L;

    /**
     * 话题ID
     */
    @NotBlank(message = "话题ID不能为空")
    private String topicId;

    /**
     * 当前用户ID (用于判断关注状态等)
     */
    private String currentUserId;
}

/**
 * 获取话题信息响应DTO
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class GetTopicInfoResponseDTO implements Serializable {

    private static final long serialVersionUID = 1L;

    /**
     * 话题ID
     */
    private String topicId;

    /**
     * 话题名称
     */
    private String topicName;

    /**
     * 话题标题
     */
    private String topicTitle;

    /**
     * 话题描述
     */
    private String topicDescription;

    /**
     * 话题封面图片URL
     */
    private String coverImageUrl;

    /**
     * 话题下的动态数量
     */
    private Integer postCount;

    /**
     * 参与话题的用户数量
     */
    private Integer participantCount;

    /**
     * 话题热度值
     */
    private Integer hotnessScore;

    /**
     * 话题分类
     */
    private String topicCategory;

    /**
     * 话题标签列表
     */
    private List<String> topicTags;

    /**
     * 当前用户是否关注该话题
     */
    private Boolean isFollowing;

    /**
     * 创建时间
     */
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private LocalDateTime createdAt;

    /**
     * 更新时间
     */
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private LocalDateTime updatedAt;
}
// #endregion

// #region 3. Request DTOs

/**
 * 获取话题动态列表请求DTO
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class GetTopicPostsRequestDTO implements Serializable {

    private static final long serialVersionUID = 1L;

    /**
     * 话题ID
     */
    @NotBlank(message = "话题ID不能为空")
    private String topicId;

    /**
     * 页码 (从1开始)
     */
    @Min(value = 1, message = "页码必须大于0")
    private Integer page = 1;

    /**
     * 每页数量
     */
    @Min(value = 1, message = "每页数量必须大于0")
    @Max(value = 50, message = "每页数量不能超过50")
    private Integer pageSize = 20;

    /**
     * 排序方式 (latest-最新, popular-热门, hot-最热)
     */
    @Pattern(regexp = "^(latest|popular|hot)$", message = "排序方式只能是latest、popular或hot")
    private String sortBy = "latest";

    /**
     * 时间范围筛选 (all-全部, today-今天, week-本周, month-本月)
     */
    @Pattern(regexp = "^(all|today|week|month)$", message = "时间范围只能是all、today、week或month")
    private String timeRange = "all";

    /**
     * 媒体类型筛选 (all-全部, image-图片, video-视频, text-纯文字)
     */
    @Pattern(regexp = "^(all|image|video|text)$", message = "媒体类型只能是all、image、video或text")
    private String mediaType = "all";

    /**
     * 当前用户ID (用于判断点赞状态等)
     */
    private String currentUserId;
}

/**
 * 点赞动态请求DTO
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class LikeTopicPostRequestDTO implements Serializable {

    private static final long serialVersionUID = 1L;

    /**
     * 动态ID
     */
    @NotBlank(message = "动态ID不能为空")
    private String postId;

    /**
     * 用户ID
     */
    @NotBlank(message = "用户ID不能为空")
    private String userId;

    /**
     * 操作类型 (like-点赞, unlike-取消点赞)
     */
    @NotBlank(message = "操作类型不能为空")
    @Pattern(regexp = "^(like|unlike)$", message = "操作类型只能是like或unlike")
    private String action;
}
// #endregion

// #region 4. Response DTOs

/**
 * 获取话题动态列表响应DTO
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class GetTopicPostsResponseDTO implements Serializable {

    private static final long serialVersionUID = 1L;

    /**
     * 动态列表
     */
    private List<TopicPostItemDTO> posts;

    /**
     * 分页信息
     */
    private PaginationDTO pagination;
}

/**
 * 话题动态项DTO
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TopicPostItemDTO implements Serializable {

    private static final long serialVersionUID = 1L;

    /**
     * 动态ID
     */
    private String postId;

    /**
     * 动态标题
     */
    private String postTitle;

    /**
     * 动态内容
     */
    private String postContent;

    /**
     * 发布用户信息
     */
    private PostUserDTO user;

    /**
     * 媒体文件列表
     */
    private List<String> mediaUrls;

    /**
     * 位置信息
     */
    private LocationDTO location;

    /**
     * 话题标签列表
     */
    private List<String> hashtags;

    /**
     * 统计信息
     */
    private PostStatsDTO stats;

    /**
     * 用户交互状态
     */
    private PostInteractionsDTO interactions;

    /**
     * 创建时间
     */
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private LocalDateTime createdAt;

    /**
     * 更新时间
     */
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private LocalDateTime updatedAt;
}

/**
 * 动态发布用户DTO
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PostUserDTO implements Serializable {

    private static final long serialVersionUID = 1L;

    /**
     * 用户ID
     */
    private String userId;

    /**
     * 用户昵称
     */
    private String nickname;

    /**
     * 用户头像URL
     */
    private String avatarUrl;

    /**
     * 用户等级
     */
    private Integer userLevel;

    /**
     * 是否认证
     */
    private Boolean verified;

    /**
     * 用户标签
     */
    private UserBadgeDTO badge;

    /**
     * 关注数量
     */
    private Integer followCount;

    /**
     * 当前用户是否关注该用户
     */
    private Boolean isFollowing;
}

/**
 * 用户标签DTO
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserBadgeDTO implements Serializable {

    private static final long serialVersionUID = 1L;

    /**
     * 标签类型 (vip, verified, popular)
     */
    private String type;

    /**
     * 标签文字
     */
    private String label;

    /**
     * 标签颜色
     */
    private String color;
}

/**
 * 位置信息DTO
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class LocationDTO implements Serializable {

    private static final long serialVersionUID = 1L;

    /**
     * 位置名称
     */
    private String name;

    /**
     * 详细地址
     */
    private String address;

    /**
     * 纬度
     */
    private Double latitude;

    /**
     * 经度
     */
    private Double longitude;
}

/**
 * 动态统计信息DTO
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PostStatsDTO implements Serializable {

    private static final long serialVersionUID = 1L;

    /**
     * 点赞数量
     */
    private Integer likeCount;

    /**
     * 评论数量
     */
    private Integer commentCount;

    /**
     * 分享数量
     */
    private Integer shareCount;

    /**
     * 浏览数量
     */
    private Integer viewCount;
}

/**
 * 用户交互状态DTO
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PostInteractionsDTO implements Serializable {

    private static final long serialVersionUID = 1L;

    /**
     * 是否已点赞
     */
    private Boolean isLiked;

    /**
     * 是否已收藏
     */
    private Boolean isCollected;

    /**
     * 是否关注发布者
     */
    private Boolean isFollowing;
}

/**
 * 分页信息DTO
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PaginationDTO implements Serializable {

    private static final long serialVersionUID = 1L;

    /**
     * 当前页码
     */
    private Integer page;

    /**
     * 每页数量
     */
    private Integer pageSize;

    /**
     * 总记录数
     */
    private Long total;

    /**
     * 总页数
     */
    private Integer totalPages;

    /**
     * 是否还有更多数据
     */
    private Boolean hasMore;
}

/**
 * 点赞动态响应DTO
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class LikeTopicPostResponseDTO implements Serializable {

    private static final long serialVersionUID = 1L;

    /**
     * 动态ID
     */
    private String postId;

    /**
     * 是否已点赞
     */
    private Boolean isLiked;

    /**
     * 点赞数量
     */
    private Integer likeCount;
}
// #endregion

// #region 5. Validation Rules
// 验证规则已在字段上使用注解定义
// #endregion

// #region 6. Builder Patterns
// Lombok @Builder 已处理
// #endregion

// #region 7. Utility Methods
// 工具方法可在后续需要时添加
// #endregion

// #region 8. Exports
// 所有DTO类已定义并可导出使用
// #endregion
