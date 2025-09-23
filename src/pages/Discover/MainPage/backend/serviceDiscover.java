/**
 * 发现模块Service接口
 * 业务服务接口定义
 * 
 * 包含：内容服务、互动服务、位置服务
 */

package com.xiangyupai.discover.service;

import com.xiangyupai.discover.dto.*;
import java.util.List;

/**
 * 发现内容服务接口
 */
public interface DiscoverContentService {

    /**
     * 获取内容列表
     * 
     * @param request 查询请求参数
     * @return 内容列表响应
     */
    ContentListResponseDTO getContentList(ContentListRequestDTO request);

    /**
     * 获取热门内容列表
     * 
     * @param request 查询请求参数
     * @return 内容列表响应
     */
    ContentListResponseDTO getHotContentList(ContentListRequestDTO request);

    /**
     * 获取关注用户内容列表
     * 
     * @param request 查询请求参数
     * @return 内容列表响应
     */
    ContentListResponseDTO getFollowContentList(ContentListRequestDTO request);

    /**
     * 获取同城内容列表
     * 
     * @param request 查询请求参数
     * @return 内容列表响应
     */
    ContentListResponseDTO getLocalContentList(ContentListRequestDTO request);

    /**
     * 获取用户信息
     * 
     * @param userId 目标用户ID
     * @param currentUserId 当前用户ID
     * @return 用户信息
     */
    UserInfoDTO getUserInfo(String userId, String currentUserId);

    /**
     * 批量获取内容详情
     * 
     * @param contentIds 内容ID列表
     * @param currentUserId 当前用户ID
     * @return 内容详情列表
     */
    List<ContentItemDTO> batchGetContentDetails(List<String> contentIds, String currentUserId);

    /**
     * 增加内容浏览量
     * 
     * @param contentId 内容ID
     * @param userId 用户ID
     */
    void incrementViewCount(String contentId, String userId);

    /**
     * 获取推荐内容
     * 
     * @param userId 用户ID
     * @param tab 当前Tab
     * @param limit 推荐数量
     * @return 推荐内容列表
     */
    List<ContentItemDTO> getRecommendedContent(String userId, String tab, Integer limit);

    /**
     * 更新内容热度分数
     * 
     * @param contentId 内容ID
     */
    void updateHotScore(String contentId);

    /**
     * 检查内容是否存在
     * 
     * @param contentId 内容ID
     * @return 是否存在
     */
    boolean isContentExists(String contentId);
}

/**
 * 发现互动服务接口
 */
public interface DiscoverInteractionService {

    /**
     * 处理用户互动操作
     * 
     * @param userId 用户ID
     * @param request 互动请求
     * @return 互动响应
     */
    UserInteractionResponseDTO handleUserInteraction(String userId, UserInteractionRequestDTO request);

    /**
     * 处理点赞操作
     * 
     * @param userId 用户ID
     * @param contentId 内容ID
     * @param action 操作类型
     * @return 互动响应
     */
    UserInteractionResponseDTO handleLikeAction(String userId, String contentId, String action);

    /**
     * 处理收藏操作
     * 
     * @param userId 用户ID
     * @param contentId 内容ID
     * @param action 操作类型
     * @return 互动响应
     */
    UserInteractionResponseDTO handleCollectAction(String userId, String contentId, String action);

    /**
     * 处理分享操作
     * 
     * @param userId 用户ID
     * @param contentId 内容ID
     * @return 互动响应
     */
    UserInteractionResponseDTO handleShareAction(String userId, String contentId);

    /**
     * 处理关注用户操作
     * 
     * @param currentUserId 当前用户ID
     * @param request 关注请求
     * @return 互动响应
     */
    UserInteractionResponseDTO handleFollowUser(String currentUserId, FollowUserRequestDTO request);

    /**
     * 检查用户互动状态
     * 
     * @param userId 用户ID
     * @param contentId 内容ID
     * @param interactionType 互动类型
     * @return 是否已互动
     */
    boolean checkUserInteractionStatus(String userId, String contentId, Integer interactionType);

    /**
     * 获取用户互动统计
     * 
     * @param userId 用户ID
     * @return 互动统计数据
     */
    UserInteractionStatsDTO getUserInteractionStats(String userId);

    /**
     * 批量处理用户互动
     * 
     * @param userId 用户ID
     * @param interactions 互动列表
     * @return 批量操作结果
     */
    List<UserInteractionResponseDTO> batchHandleInteractions(String userId, List<UserInteractionRequestDTO> interactions);

    /**
     * 检查关注关系
     * 
     * @param followerId 关注者ID
     * @param followingId 被关注者ID
     * @return 是否已关注
     */
    boolean checkFollowStatus(String followerId, String followingId);
}

/**
 * 发现位置服务接口
 */
public interface DiscoverLocationService {

    /**
     * 更新用户位置
     * 
     * @param userId 用户ID
     * @param request 位置更新请求
     * @return 位置更新响应
     */
    LocationUpdateResponseDTO updateUserLocation(String userId, LocationUpdateRequestDTO request);

    /**
     * 获取附近内容
     * 
     * @param latitude 纬度
     * @param longitude 经度
     * @param radius 搜索半径（公里）
     * @param userId 用户ID
     * @param limit 限制数量
     * @return 附近内容列表
     */
    List<ContentItemDTO> getNearbyContent(Double latitude, Double longitude, Integer radius, String userId, Integer limit);

    /**
     * 计算两点间距离
     * 
     * @param lat1 纬度1
     * @param lon1 经度1
     * @param lat2 纬度2
     * @param lon2 经度2
     * @return 距离（公里）
     */
    Double calculateDistance(Double lat1, Double lon1, Double lat2, Double lon2);

    /**
     * 地理编码：坐标转地址
     * 
     * @param latitude 纬度
     * @param longitude 经度
     * @return 地址信息
     */
    LocationInfoDTO geocodeLocation(Double latitude, Double longitude);

    /**
     * 获取热门同城区域
     * 
     * @param city 城市
     * @param limit 限制数量
     * @return 热门区域列表
     */
    List<LocationInfoDTO> getHotLocalAreas(String city, Integer limit);

    /**
     * 获取用户历史位置
     * 
     * @param userId 用户ID
     * @param limit 限制数量
     * @return 历史位置列表
     */
    List<LocationInfoDTO> getUserLocationHistory(String userId, Integer limit);

    /**
     * 检查位置是否在服务范围内
     * 
     * @param latitude 纬度
     * @param longitude 经度
     * @return 是否在服务范围内
     */
    boolean isLocationInServiceArea(Double latitude, Double longitude);
}

/**
 * 用户互动统计DTO
 */
public class UserInteractionStatsDTO {
    private String userId;
    private Integer totalLikes;
    private Integer totalCollects;
    private Integer totalShares;
    private Integer totalFollowers;
    private Integer totalFollowing;
    
    // getters and setters...
}
