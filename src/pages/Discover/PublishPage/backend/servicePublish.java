package com.xiangyupai.discover.publish.service;

import com.xiangyupai.discover.publish.dto.*;
import com.xiangyupai.discover.publish.vo.*;
import com.xiangyupai.common.result.PageResult;

import org.springframework.web.multipart.MultipartFile;

/**
 * 发布动态业务服务接口 - 业务方法定义
 * 
 * 职责：
 * 1. 定义业务服务方法签名
 * 2. 声明业务异常
 * 3. 提供接口文档说明
 */
public interface PublishPostService {

    /**
     * 发布动态
     * 
     * @param request 发布请求
     * @param userId 用户ID
     * @return 发布响应
     * @throws BusinessException 业务异常
     */
    PublishPostResponseDTO publishPost(PublishPostRequestDTO request, Long userId);

    /**
     * 编辑动态
     * 
     * @param postId 动态ID
     * @param request 编辑请求
     * @param userId 用户ID
     * @return 编辑响应
     * @throws BusinessException 业务异常
     */
    PublishPostResponseDTO updatePost(String postId, PublishPostRequestDTO request, Long userId);

    /**
     * 删除动态
     * 
     * @param postId 动态ID
     * @param userId 用户ID
     * @throws BusinessException 业务异常
     */
    void deletePost(String postId, Long userId);

    /**
     * 查询动态列表
     * 
     * @param queryVO 查询条件
     * @param userId 用户ID
     * @return 分页结果
     */
    PageResult<PublishPostResponseDTO> queryPosts(PublishPostQueryVO queryVO, Long userId);

    /**
     * 获取动态详情
     * 
     * @param postId 动态ID
     * @param userId 用户ID
     * @return 动态详情
     * @throws BusinessException 业务异常
     */
    PublishPostResponseDTO getPostDetail(String postId, Long userId);

    /**
     * 保存草稿
     * 
     * @param request 草稿请求
     * @param userId 用户ID
     * @return 草稿响应
     */
    DraftSaveResponseDTO saveDraft(DraftSaveRequestDTO request, Long userId);

    /**
     * 获取草稿列表
     * 
     * @param pageNum 页码
     * @param pageSize 页大小
     * @param userId 用户ID
     * @return 草稿列表
     */
    PageResult<DraftSaveResponseDTO> getDrafts(Integer pageNum, Integer pageSize, Long userId);

    /**
     * 获取草稿详情
     * 
     * @param draftId 草稿ID
     * @param userId 用户ID
     * @return 草稿内容
     * @throws BusinessException 业务异常
     */
    PublishPostRequestDTO getDraftDetail(String draftId, Long userId);

    /**
     * 删除草稿
     * 
     * @param draftId 草稿ID
     * @param userId 用户ID
     * @throws BusinessException 业务异常
     */
    void deleteDraft(String draftId, Long userId);

    /**
     * 内容安全检测
     * 
     * @param content 检测内容
     * @param userId 用户ID
     * @return 是否安全
     */
    Boolean checkContentSecurity(String content, Long userId);

    /**
     * 获取用户发布统计
     * 
     * @param userId 用户ID
     * @param queryVO 统计查询条件
     * @return 统计结果
     */
    Object getUserPublishStatistics(Long userId, StatisticsQueryVO queryVO);

    /**
     * 获取热门内容
     * 
     * @param queryVO 热门查询条件
     * @param userId 用户ID
     * @return 热门内容列表
     */
    PageResult<PublishPostResponseDTO> getHotContent(HotContentQueryVO queryVO, Long userId);
}

/**
 * 媒体文件业务服务接口
 */
public interface PublishMediaService {

    /**
     * 上传媒体文件
     * 
     * @param file 文件
     * @param request 上传请求
     * @param userId 用户ID
     * @return 上传响应
     * @throws BusinessException 业务异常
     */
    MediaUploadResponseDTO uploadMedia(MultipartFile file, MediaUploadRequestDTO request, Long userId);

    /**
     * 删除媒体文件
     * 
     * @param mediaId 媒体ID
     * @param userId 用户ID
     * @throws BusinessException 业务异常
     */
    void deleteMedia(String mediaId, Long userId);

    /**
     * 查询媒体文件
     * 
     * @param queryVO 查询条件
     * @param userId 用户ID
     * @return 媒体文件列表
     */
    PageResult<MediaUploadResponseDTO> queryMedia(MediaQueryVO queryVO, Long userId);

    /**
     * 获取媒体文件详情
     * 
     * @param mediaId 媒体ID
     * @param userId 用户ID
     * @return 媒体详情
     * @throws BusinessException 业务异常
     */
    MediaUploadResponseDTO getMediaDetail(String mediaId, Long userId);

    /**
     * 媒体安全检测
     * 
     * @param mediaId 媒体ID
     * @param userId 用户ID
     * @return 是否安全
     */
    Boolean checkMediaSecurity(String mediaId, Long userId);

    /**
     * 批量上传媒体
     * 
     * @param files 文件列表
     * @param request 上传请求
     * @param userId 用户ID
     * @return 上传响应列表
     */
    List<MediaUploadResponseDTO> batchUploadMedia(
        List<MultipartFile> files, MediaUploadRequestDTO request, Long userId);

    /**
     * 生成媒体缩略图
     * 
     * @param mediaId 媒体ID
     * @param width 宽度
     * @param height 高度
     * @param userId 用户ID
     * @return 缩略图URL
     */
    String generateThumbnail(String mediaId, Integer width, Integer height, Long userId);

    /**
     * 压缩媒体文件
     * 
     * @param mediaId 媒体ID
     * @param quality 压缩质量
     * @param userId 用户ID
     * @return 压缩后的媒体信息
     */
    MediaUploadResponseDTO compressMedia(String mediaId, Double quality, Long userId);
}

/**
 * 话题业务服务接口
 */
public interface PublishTopicService {

    /**
     * 搜索话题
     * 
     * @param request 搜索请求
     * @param userId 用户ID
     * @return 搜索响应
     */
    TopicSearchResponseDTO searchTopics(TopicSearchRequestDTO request, Long userId);

    /**
     * 根据分类获取话题
     * 
     * @param category 分类
     * @param pageNum 页码
     * @param pageSize 页大小
     * @param userId 用户ID
     * @return 话题列表
     */
    PageResult<TopicSearchResponseDTO.TopicItemDTO> getTopicsByCategory(
        String category, Integer pageNum, Integer pageSize, Long userId);

    /**
     * 获取热门话题
     * 
     * @param pageNum 页码
     * @param pageSize 页大小
     * @param userId 用户ID
     * @return 热门话题列表
     */
    PageResult<TopicSearchResponseDTO.TopicItemDTO> getHotTopics(
        Integer pageNum, Integer pageSize, Long userId);

    /**
     * 获取推荐话题
     * 
     * @param pageNum 页码
     * @param pageSize 页大小
     * @param userId 用户ID
     * @return 推荐话题列表
     */
    PageResult<TopicSearchResponseDTO.TopicItemDTO> getRecommendedTopics(
        Integer pageNum, Integer pageSize, Long userId);

    /**
     * 创建话题
     * 
     * @param topicName 话题名称
     * @param description 话题描述
     * @param category 话题分类
     * @param userId 用户ID
     * @return 话题信息
     */
    TopicSearchResponseDTO.TopicItemDTO createTopic(
        String topicName, String description, String category, Long userId);

    /**
     * 获取话题详情
     * 
     * @param topicId 话题ID
     * @param userId 用户ID
     * @return 话题详情
     */
    TopicSearchResponseDTO.TopicItemDTO getTopicDetail(String topicId, Long userId);

    /**
     * 关注话题
     * 
     * @param topicId 话题ID
     * @param userId 用户ID
     */
    void followTopic(String topicId, Long userId);

    /**
     * 取消关注话题
     * 
     * @param topicId 话题ID
     * @param userId 用户ID
     */
    void unfollowTopic(String topicId, Long userId);

    /**
     * 获取用户关注的话题
     * 
     * @param pageNum 页码
     * @param pageSize 页大小
     * @param userId 用户ID
     * @return 关注的话题列表
     */
    PageResult<TopicSearchResponseDTO.TopicItemDTO> getUserFollowedTopics(
        Integer pageNum, Integer pageSize, Long userId);

    /**
     * 更新话题热度
     * 
     * @param topicId 话题ID
     * @param score 热度分数
     */
    void updateTopicHotScore(String topicId, Double score);
}

/**
 * 地点业务服务接口
 */
public interface PublishLocationService {

    /**
     * 搜索地点
     * 
     * @param request 搜索请求
     * @param userId 用户ID
     * @return 搜索响应
     */
    LocationSearchResponseDTO searchLocations(LocationSearchRequestDTO request, Long userId);

    /**
     * 获取周边地点
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

    /**
     * 地理编码
     * 
     * @param address 地址
     * @param userId 用户ID
     * @return 地点信息
     */
    LocationSearchResponseDTO.LocationItemDTO geocodeAddress(String address, Long userId);

    /**
     * 逆地理编码
     * 
     * @param latitude 纬度
     * @param longitude 经度
     * @param userId 用户ID
     * @return 地点信息
     */
    LocationSearchResponseDTO.LocationItemDTO reverseGeocodeCoordinate(
        Double latitude, Double longitude, Long userId);

    /**
     * 创建地点
     * 
     * @param poiName 地点名称
     * @param address 地址
     * @param latitude 纬度
     * @param longitude 经度
     * @param category 分类
     * @param userId 用户ID
     * @return 地点信息
     */
    LocationSearchResponseDTO.LocationItemDTO createLocation(
        String poiName, String address, Double latitude, Double longitude, String category, Long userId);

    /**
     * 获取地点详情
     * 
     * @param locationId 地点ID
     * @param userId 用户ID
     * @return 地点详情
     */
    LocationSearchResponseDTO.LocationItemDTO getLocationDetail(String locationId, Long userId);

    /**
     * 更新地点使用次数
     * 
     * @param locationId 地点ID
     */
    void incrementLocationUsage(String locationId);

    /**
     * 获取热门地点
     * 
     * @param latitude 纬度
     * @param longitude 经度
     * @param radius 半径
     * @param limit 限制数量
     * @param userId 用户ID
     * @return 热门地点列表
     */
    LocationSearchResponseDTO getHotLocations(
        Double latitude, Double longitude, Integer radius, Integer limit, Long userId);

    /**
     * 获取用户历史地点
     * 
     * @param pageNum 页码
     * @param pageSize 页大小
     * @param userId 用户ID
     * @return 历史地点列表
     */
    PageResult<LocationSearchResponseDTO.LocationItemDTO> getUserHistoryLocations(
        Integer pageNum, Integer pageSize, Long userId);

    /**
     * 清理无效地点
     * 
     * @param days 天数
     * @return 清理数量
     */
    Integer cleanupInvalidLocations(Integer days);
}
