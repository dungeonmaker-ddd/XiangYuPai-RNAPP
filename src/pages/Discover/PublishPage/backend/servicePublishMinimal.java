package com.xiangyupai.discover.publish.service;

import com.xiangyupai.discover.publish.dto.*;
import com.xiangyupai.common.result.PageResult;

import org.springframework.web.multipart.MultipartFile;

/**
 * 发布动态业务服务接口 - 精简版，只包含前端实际需要的方法
 * 
 * 🎯 按需设计原则：严格按照前端页面功能需求定义业务方法
 * ❌ 移除过度设计：批量操作、复杂统计、管理员功能等方法
 */
public interface PublishPostService {

    /**
     * 发布动态 - 前端PublishPage核心功能
     * 
     * @param request 发布请求
     * @param userId 用户ID
     * @return 发布响应
     */
    PublishPostResponseDTO publishPost(PublishPostRequestDTO request, Long userId);

    /**
     * 删除动态 - 前端用户删除自己的动态
     * 
     * @param postId 动态ID
     * @param userId 用户ID
     */
    void deletePost(String postId, Long userId);

    /**
     * 保存草稿 - 前端DraftManager功能
     * 
     * @param request 草稿请求
     * @param userId 用户ID
     * @return 草稿响应
     */
    DraftSaveResponseDTO saveDraft(DraftSaveRequestDTO request, Long userId);

    /**
     * 获取草稿详情 - 前端恢复草稿功能
     * 
     * @param draftId 草稿ID
     * @param userId 用户ID
     * @return 草稿内容
     */
    PublishPostRequestDTO getDraftDetail(String draftId, Long userId);

    /**
     * 删除草稿 - 前端删除草稿功能
     * 
     * @param draftId 草稿ID
     * @param userId 用户ID
     */
    void deleteDraft(String draftId, Long userId);

    /**
     * 内容安全检测 - 前端ContentValidator功能
     * 
     * @param content 检测内容
     * @param userId 用户ID
     * @return 是否安全
     */
    Boolean checkContentSecurity(String content, Long userId);

    // ============ 🚫 已移除的过度设计方法 ============
    /*
     * 以下方法已移除，因为前端实际不需要：
     * 
     * ❌ 复杂查询方法：
     *    - queryPosts() - 前端没有复杂查询页面
     *    - getPostDetail() - 前端发布页面不需要查看详情
     *    - getUserPublishStatistics() - 前端没有统计功能
     * 
     * ❌ 批量操作方法：
     *    - batchDeletePosts() - 前端没有批量删除
     *    - batchUpdateStatus() - 前端没有批量状态更新
     * 
     * ❌ 管理功能方法：
     *    - auditPost() - 前端不是管理后台
     *    - getHotContent() - 前端没有热门内容管理
     * 
     * ❌ 高级功能方法：
     *    - schedulePost() - 前端没有定时发布
     *    - exportUserPosts() - 前端没有导出功能
     *    - getRecommendations() - 前端没有推荐功能
     * 
     * 🎯 精简后的方法总数：6个核心方法
     *    vs 原设计的15+个方法（减少60%以上）
     */
}

/**
 * 媒体文件业务服务接口 - 精简版
 */
public interface PublishMediaService {

    /**
     * 上传媒体文件 - 前端MediaManagerArea核心功能
     * 
     * @param file 文件
     * @param request 上传请求
     * @param userId 用户ID
     * @return 上传响应
     */
    MediaUploadResponseDTO uploadMedia(MultipartFile file, MediaUploadRequestDTO request, Long userId);

    /**
     * 删除媒体文件 - 前端删除上传的媒体
     * 
     * @param mediaId 媒体ID
     * @param userId 用户ID
     */
    void deleteMedia(String mediaId, Long userId);

    // ============ 🚫 已移除的过度设计方法 ============
    /*
     * ❌ queryMedia() - 前端没有媒体查询页面
     * ❌ getMediaDetail() - 前端不需要查看媒体详情
     * ❌ checkMediaSecurity() - 简化为上传时检测
     * ❌ batchUploadMedia() - 前端没有批量上传功能
     * ❌ generateThumbnail() - 后端自动处理
     * ❌ compressMedia() - 上传时自动压缩
     * 
     * 🎯 精简后的方法总数：2个核心方法
     */
}

/**
 * 话题业务服务接口 - 精简版
 */
public interface PublishTopicService {

    /**
     * 搜索话题 - 前端TopicSelectorPage搜索功能
     * 
     * @param request 搜索请求
     * @param userId 用户ID
     * @return 搜索响应
     */
    TopicSearchResponseDTO searchTopics(TopicSearchRequestDTO request, Long userId);

    /**
     * 获取热门话题 - 前端话题选择页面的热门推荐
     * 
     * @param pageNum 页码
     * @param pageSize 页大小
     * @param userId 用户ID
     * @return 热门话题列表
     */
    PageResult<TopicSearchResponseDTO.TopicItemDTO> getHotTopics(
        Integer pageNum, Integer pageSize, Long userId);

    // ============ 🚫 已移除的过度设计方法 ============
    /*
     * ❌ getTopicsByCategory() - 前端搜索已包含分类
     * ❌ getRecommendedTopics() - 前端只需要热门话题
     * ❌ createTopic() - 前端没有创建话题功能
     * ❌ getTopicDetail() - 前端选择话题不需要详情
     * ❌ followTopic() - 前端没有关注功能
     * ❌ unfollowTopic() - 前端没有取消关注功能
     * ❌ getUserFollowedTopics() - 前端没有关注列表
     * ❌ updateTopicHotScore() - 后端自动更新
     * 
     * 🎯 精简后的方法总数：2个核心方法
     */
}

/**
 * 地点业务服务接口 - 精简版
 */
public interface PublishLocationService {

    /**
     * 搜索地点 - 前端LocationSelectorDrawer搜索功能
     * 
     * @param request 搜索请求
     * @param userId 用户ID
     * @return 搜索响应
     */
    LocationSearchResponseDTO searchLocations(LocationSearchRequestDTO request, Long userId);

    /**
     * 获取周边地点 - 前端地点选择的GPS定位功能
     * 
     * @param latitude 纬度
     * @param longitude 经度
     * @param radius 半径
     * @param limit 限制数量
     * @param userId 用户ID
     * @return 周边地点列表
     */
    LocationSearchResponseDTO getNearbyLocations(
        Double latitude, Double longitude, Integer radius, Integer limit, Long userId);

    // ============ 🚫 已移除的过度设计方法 ============
    /*
     * ❌ geocodeAddress() - 前端没有地址编码需求
     * ❌ reverseGeocodeCoordinate() - 前端没有反向编码需求
     * ❌ createLocation() - 后端自动创建
     * ❌ getLocationDetail() - 前端选择地点不需要详情
     * ❌ incrementLocationUsage() - 后端自动更新
     * ❌ getHotLocations() - 前端搜索和周边已覆盖
     * ❌ getUserHistoryLocations() - 前端没有历史记录功能
     * ❌ cleanupInvalidLocations() - 后端定时任务处理
     * 
     * 🎯 精简后的方法总数：2个核心方法
     */
}

/**
 * 🎯 精简设计总结：
 * 
 * 原设计方法总数：35+ 个方法
 * 精简后方法总数：12 个方法  
 * 减少比例：约65%
 * 
 * 🎯 精简原则：
 * 1. 只保留前端页面实际需要的功能
 * 2. 移除批量操作（前端没有批量功能）
 * 3. 移除管理员功能（前端不是管理后台）
 * 4. 移除复杂统计（前端没有统计页面）
 * 5. 移除高级功能（前端没有对应界面）
 * 
 * ✅ 保留的核心功能：
 * - 发布动态（发布、删除）
 * - 媒体管理（上传、删除）
 * - 话题选择（搜索、热门）
 * - 地点选择（搜索、周边）
 * - 草稿管理（保存、恢复、删除）
 * - 安全检测（内容验证）
 */
