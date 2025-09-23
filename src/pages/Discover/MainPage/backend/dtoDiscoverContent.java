/**
 * 发现内容DTO类
 * 前后端数据交换格式
 * 
 * 包含：请求DTO、响应DTO、查询DTO
 */

package com.xiangyupai.discover.dto;

import com.fasterxml.jackson.annotation.JsonFormat;
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.experimental.Accessors;

import javax.validation.constraints.*;
import java.io.Serializable;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

/**
 * 内容列表请求DTO
 */
@Data
@EqualsAndHashCode(callSuper = false)
@Accessors(chain = true)
@ApiModel(value = "ContentListRequestDTO", description = "内容列表请求参数")
public class ContentListRequestDTO implements Serializable {

    private static final long serialVersionUID = 1L;

    @ApiModelProperty(value = "Tab类型：hot-热门, follow-关注, local-同城", required = true)
    @NotBlank(message = "Tab类型不能为空")
    @Pattern(regexp = "^(hot|follow|local)$", message = "Tab类型只能是hot、follow、local")
    private String tab;

    @ApiModelProperty(value = "页码，从1开始", example = "1")
    @Min(value = 1, message = "页码必须大于0")
    @Max(value = 1000, message = "页码不能超过1000")
    private Integer page = 1;

    @ApiModelProperty(value = "每页数量", example = "20")
    @Min(value = 1, message = "每页数量必须大于0")
    @Max(value = 50, message = "每页数量不能超过50")
    private Integer size = 20;

    @ApiModelProperty(value = "用户ID")
    private String userId;

    @ApiModelProperty(value = "最后一条内容ID（游标分页）")
    private String lastId;

    @ApiModelProperty(value = "用户位置-纬度（同城Tab必填）")
    @DecimalMin(value = "-90.0", message = "纬度范围：-90到90")
    @DecimalMax(value = "90.0", message = "纬度范围：-90到90")
    private BigDecimal latitude;

    @ApiModelProperty(value = "用户位置-经度（同城Tab必填）")
    @DecimalMin(value = "-180.0", message = "经度范围：-180到180")
    @DecimalMax(value = "180.0", message = "经度范围：-180到180")
    private BigDecimal longitude;

    @ApiModelProperty(value = "搜索半径，单位km（同城Tab使用）", example = "5")
    @Min(value = 1, message = "搜索半径至少1km")
    @Max(value = 50, message = "搜索半径最大50km")
    private Integer radius = 5;

    @ApiModelProperty(value = "内容类型过滤")
    private List<String> contentTypes;

    @ApiModelProperty(value = "时间范围：today-今天, week-本周, month-本月, all-全部")
    @Pattern(regexp = "^(today|week|month|all)$", message = "时间范围参数错误")
    private String timeRange = "all";

    @ApiModelProperty(value = "排序方式：hot-热度, new-最新, distance-距离")
    @Pattern(regexp = "^(hot|new|distance)$", message = "排序方式参数错误")
    private String sortBy = "hot";
}

/**
 * 内容列表响应DTO
 */
@Data
@EqualsAndHashCode(callSuper = false)
@Accessors(chain = true)
@ApiModel(value = "ContentListResponseDTO", description = "内容列表响应数据")
public class ContentListResponseDTO implements Serializable {

    private static final long serialVersionUID = 1L;

    @ApiModelProperty(value = "内容列表")
    private List<ContentItemDTO> list;

    @ApiModelProperty(value = "分页信息")
    private PaginationDTO pagination;

    @ApiModelProperty(value = "下一页游标")
    private String nextCursor;
}

/**
 * 内容项目DTO
 */
@Data
@EqualsAndHashCode(callSuper = false)
@Accessors(chain = true)
@ApiModel(value = "ContentItemDTO", description = "内容项目数据")
public class ContentItemDTO implements Serializable {

    private static final long serialVersionUID = 1L;

    @ApiModelProperty(value = "内容ID")
    private String id;

    @ApiModelProperty(value = "内容类型：image-图片, video-视频, text-文字")
    private String type;

    @ApiModelProperty(value = "标题")
    private String title;

    @ApiModelProperty(value = "描述")
    private String description;

    @ApiModelProperty(value = "图片URL列表")
    private List<String> images;

    @ApiModelProperty(value = "视频URL")
    private String videoUrl;

    @ApiModelProperty(value = "视频缩略图")
    private String videoThumbnail;

    @ApiModelProperty(value = "视频时长（秒）")
    private Integer videoDuration;

    @ApiModelProperty(value = "发布者信息")
    private UserInfoDTO author;

    @ApiModelProperty(value = "点赞数量")
    private Integer likeCount;

    @ApiModelProperty(value = "收藏数量")
    private Integer collectCount;

    @ApiModelProperty(value = "评论数量")
    private Integer commentCount;

    @ApiModelProperty(value = "分享数量")
    private Integer shareCount;

    @ApiModelProperty(value = "浏览数量")
    private Integer viewCount;

    @ApiModelProperty(value = "当前用户是否已点赞")
    private Boolean isLiked;

    @ApiModelProperty(value = "当前用户是否已收藏")
    private Boolean isCollected;

    @ApiModelProperty(value = "发布时间")
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss", timezone = "GMT+8")
    private LocalDateTime createdAt;

    @ApiModelProperty(value = "标签列表")
    private List<String> tags;

    @ApiModelProperty(value = "话题列表")
    private List<TopicDTO> topics;

    // 热门Tab专用字段
    @ApiModelProperty(value = "热度分数（热门Tab）")
    private BigDecimal hotScore;

    @ApiModelProperty(value = "热门排名（热门Tab）")
    private Integer hotRank;

    // 关注Tab专用字段
    @ApiModelProperty(value = "关注时间（关注Tab）")
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss", timezone = "GMT+8")
    private LocalDateTime followedAt;

    @ApiModelProperty(value = "是否新内容（关注Tab）")
    private Boolean isNewContent;

    // 同城Tab专用字段
    @ApiModelProperty(value = "位置信息（同城Tab）")
    private LocationInfoDTO location;

    @ApiModelProperty(value = "距离（同城Tab），单位km")
    private BigDecimal distance;

    @ApiModelProperty(value = "商家信息（同城Tab）")
    private MerchantInfoDTO merchantInfo;
}

/**
 * 用户信息DTO
 */
@Data
@EqualsAndHashCode(callSuper = false)
@Accessors(chain = true)
@ApiModel(value = "UserInfoDTO", description = "用户信息")
public class UserInfoDTO implements Serializable {

    private static final long serialVersionUID = 1L;

    @ApiModelProperty(value = "用户ID")
    private String id;

    @ApiModelProperty(value = "昵称")
    private String nickname;

    @ApiModelProperty(value = "头像URL")
    private String avatar;

    @ApiModelProperty(value = "用户等级")
    private Integer level;

    @ApiModelProperty(value = "是否认证")
    private Boolean isVerified;

    @ApiModelProperty(value = "认证类型：1-个人, 2-企业, 3-官方")
    private Integer verifyType;

    @ApiModelProperty(value = "认证标识")
    private String verifyMark;

    @ApiModelProperty(value = "当前用户是否已关注")
    private Boolean isFollowed;

    @ApiModelProperty(value = "粉丝数量")
    private Integer followerCount;

    @ApiModelProperty(value = "关注数量")
    private Integer followingCount;

    @ApiModelProperty(value = "获赞总数")
    private Integer totalLikeCount;
}

/**
 * 位置信息DTO
 */
@Data
@EqualsAndHashCode(callSuper = false)
@Accessors(chain = true)
@ApiModel(value = "LocationInfoDTO", description = "位置信息")
public class LocationInfoDTO implements Serializable {

    private static final long serialVersionUID = 1L;

    @ApiModelProperty(value = "纬度")
    private BigDecimal latitude;

    @ApiModelProperty(value = "经度")
    private BigDecimal longitude;

    @ApiModelProperty(value = "详细地址")
    private String address;

    @ApiModelProperty(value = "城市")
    private String city;

    @ApiModelProperty(value = "区域")
    private String district;
}

/**
 * 商家信息DTO
 */
@Data
@EqualsAndHashCode(callSuper = false)
@Accessors(chain = true)
@ApiModel(value = "MerchantInfoDTO", description = "商家信息")
public class MerchantInfoDTO implements Serializable {

    private static final long serialVersionUID = 1L;

    @ApiModelProperty(value = "商家ID")
    private String id;

    @ApiModelProperty(value = "商家名称")
    private String name;

    @ApiModelProperty(value = "是否认证")
    private Boolean isVerified;

    @ApiModelProperty(value = "营业状态")
    private Boolean isOpen;

    @ApiModelProperty(value = "联系电话")
    private String phone;

    @ApiModelProperty(value = "营业时间")
    private String businessHours;

    @ApiModelProperty(value = "商家类型")
    private String category;

    @ApiModelProperty(value = "评分")
    private BigDecimal rating;

    @ApiModelProperty(value = "评价数量")
    private Integer reviewCount;
}

/**
 * 话题DTO
 */
@Data
@EqualsAndHashCode(callSuper = false)
@Accessors(chain = true)
@ApiModel(value = "TopicDTO", description = "话题信息")
public class TopicDTO implements Serializable {

    private static final long serialVersionUID = 1L;

    @ApiModelProperty(value = "话题ID")
    private String id;

    @ApiModelProperty(value = "话题名称")
    private String name;

    @ApiModelProperty(value = "参与人数")
    private Integer participantCount;
}

/**
 * 分页信息DTO
 */
@Data
@EqualsAndHashCode(callSuper = false)
@Accessors(chain = true)
@ApiModel(value = "PaginationDTO", description = "分页信息")
public class PaginationDTO implements Serializable {

    private static final long serialVersionUID = 1L;

    @ApiModelProperty(value = "当前页码")
    private Integer currentPage;

    @ApiModelProperty(value = "每页数量")
    private Integer pageSize;

    @ApiModelProperty(value = "总数量")
    private Long total;

    @ApiModelProperty(value = "总页数")
    private Integer totalPages;

    @ApiModelProperty(value = "是否有更多")
    private Boolean hasMore;
}

/**
 * 用户互动请求DTO
 */
@Data
@EqualsAndHashCode(callSuper = false)
@Accessors(chain = true)
@ApiModel(value = "UserInteractionRequestDTO", description = "用户互动请求")
public class UserInteractionRequestDTO implements Serializable {

    private static final long serialVersionUID = 1L;

    @ApiModelProperty(value = "内容ID", required = true)
    @NotBlank(message = "内容ID不能为空")
    private String contentId;

    @ApiModelProperty(value = "操作类型：like-点赞, unlike-取消点赞, collect-收藏, uncollect-取消收藏", required = true)
    @NotBlank(message = "操作类型不能为空")
    @Pattern(regexp = "^(like|unlike|collect|uncollect|share)$", message = "操作类型错误")
    private String action;

    @ApiModelProperty(value = "操作来源：1-热门页, 2-关注页, 3-同城页, 4-详情页")
    private Integer source;

    @ApiModelProperty(value = "用户位置-纬度")
    private BigDecimal latitude;

    @ApiModelProperty(value = "用户位置-经度")
    private BigDecimal longitude;
}

/**
 * 用户互动响应DTO
 */
@Data
@EqualsAndHashCode(callSuper = false)
@Accessors(chain = true)
@ApiModel(value = "UserInteractionResponseDTO", description = "用户互动响应")
public class UserInteractionResponseDTO implements Serializable {

    private static final long serialVersionUID = 1L;

    @ApiModelProperty(value = "操作是否成功")
    private Boolean success;

    @ApiModelProperty(value = "新状态（点赞/收藏状态）")
    private Boolean newState;

    @ApiModelProperty(value = "最新数量")
    private Integer count;

    @ApiModelProperty(value = "操作消息")
    private String message;
}

/**
 * 关注操作请求DTO
 */
@Data
@EqualsAndHashCode(callSuper = false)
@Accessors(chain = true)
@ApiModel(value = "FollowUserRequestDTO", description = "关注用户请求")
public class FollowUserRequestDTO implements Serializable {

    private static final long serialVersionUID = 1L;

    @ApiModelProperty(value = "目标用户ID", required = true)
    @NotBlank(message = "用户ID不能为空")
    private String userId;

    @ApiModelProperty(value = "操作类型：follow-关注, unfollow-取消关注", required = true)
    @NotBlank(message = "操作类型不能为空")
    @Pattern(regexp = "^(follow|unfollow)$", message = "操作类型只能是follow或unfollow")
    private String action;

    @ApiModelProperty(value = "关注来源：1-推荐, 2-搜索, 3-内容页, 4-用户页")
    private Integer source;
}

/**
 * 位置更新请求DTO
 */
@Data
@EqualsAndHashCode(callSuper = false)
@Accessors(chain = true)
@ApiModel(value = "LocationUpdateRequestDTO", description = "位置更新请求")
public class LocationUpdateRequestDTO implements Serializable {

    private static final long serialVersionUID = 1L;

    @ApiModelProperty(value = "纬度", required = true)
    @NotNull(message = "纬度不能为空")
    @DecimalMin(value = "-90.0", message = "纬度范围：-90到90")
    @DecimalMax(value = "90.0", message = "纬度范围：-90到90")
    private BigDecimal latitude;

    @ApiModelProperty(value = "经度", required = true)
    @NotNull(message = "经度不能为空")
    @DecimalMin(value = "-180.0", message = "经度范围：-180到180")
    @DecimalMax(value = "180.0", message = "经度范围：-180到180")
    private BigDecimal longitude;

    @ApiModelProperty(value = "详细地址")
    private String address;

    @ApiModelProperty(value = "城市")
    private String city;

    @ApiModelProperty(value = "区域")
    private String district;
}

/**
 * 位置更新响应DTO
 */
@Data
@EqualsAndHashCode(callSuper = false)
@Accessors(chain = true)
@ApiModel(value = "LocationUpdateResponseDTO", description = "位置更新响应")
public class LocationUpdateResponseDTO implements Serializable {

    private static final long serialVersionUID = 1L;

    @ApiModelProperty(value = "更新是否成功")
    private Boolean success;

    @ApiModelProperty(value = "解析后的详细地址")
    private String address;

    @ApiModelProperty(value = "城市")
    private String city;

    @ApiModelProperty(value = "区域")
    private String district;
}
