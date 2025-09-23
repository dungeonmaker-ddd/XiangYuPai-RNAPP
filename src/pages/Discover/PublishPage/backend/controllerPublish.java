package com.xiangyupai.discover.publish.controller;

import com.xiangyupai.discover.publish.dto.*;
import com.xiangyupai.discover.publish.service.PublishPostService;
import com.xiangyupai.discover.publish.service.PublishMediaService;
import com.xiangyupai.discover.publish.service.PublishTopicService;
import com.xiangyupai.discover.publish.service.PublishLocationService;
import com.xiangyupai.discover.publish.vo.*;
import com.xiangyupai.common.result.Result;
import com.xiangyupai.common.result.PageResult;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import javax.validation.Valid;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;

/**
 * 发布动态控制器 - HTTP请求处理入口
 * 
 * 职责：
 * 1. 接收HTTP请求并进行参数验证
 * 2. 调用业务服务处理请求
 * 3. 封装响应结果并返回
 * 4. 处理异常情况
 */
@Slf4j
@RestController
@RequestMapping("/api/v1/publish")
@RequiredArgsConstructor
@Validated
@Tag(name = "发布动态", description = "发布动态相关接口")
public class PublishController {

    private final PublishPostService publishPostService;
    private final PublishMediaService publishMediaService;
    private final PublishTopicService publishTopicService;
    private final PublishLocationService publishLocationService;

    // ============ 动态发布相关接口 ============

    @PostMapping("/posts")
    @Operation(summary = "发布动态", description = "创建并发布新的动态内容")
    public Result<PublishPostResponseDTO> publishPost(
            @Valid @RequestBody PublishPostRequestDTO request,
            @Parameter(description = "用户ID", required = true) @RequestHeader("User-Id") Long userId) {
        
        log.info("用户[{}]发布动态: {}", userId, request.getTitle());
        
        try {
            PublishPostResponseDTO response = publishPostService.publishPost(request, userId);
            return Result.success(response);
        } catch (Exception e) {
            log.error("发布动态失败: {}", e.getMessage(), e);
            return Result.error("发布失败: " + e.getMessage());
        }
    }

    @PutMapping("/posts/{postId}")
    @Operation(summary = "编辑动态", description = "编辑已发布的动态内容")
    public Result<PublishPostResponseDTO> updatePost(
            @PathVariable @NotBlank String postId,
            @Valid @RequestBody PublishPostRequestDTO request,
            @RequestHeader("User-Id") Long userId) {
        
        log.info("用户[{}]编辑动态[{}]", userId, postId);
        
        try {
            PublishPostResponseDTO response = publishPostService.updatePost(postId, request, userId);
            return Result.success(response);
        } catch (Exception e) {
            log.error("编辑动态失败: {}", e.getMessage(), e);
            return Result.error("编辑失败: " + e.getMessage());
        }
    }

    @DeleteMapping("/posts/{postId}")
    @Operation(summary = "删除动态", description = "删除指定的动态内容")
    public Result<Void> deletePost(
            @PathVariable @NotBlank String postId,
            @RequestHeader("User-Id") Long userId) {
        
        log.info("用户[{}]删除动态[{}]", userId, postId);
        
        try {
            publishPostService.deletePost(postId, userId);
            return Result.success();
        } catch (Exception e) {
            log.error("删除动态失败: {}", e.getMessage(), e);
            return Result.error("删除失败: " + e.getMessage());
        }
    }

    @GetMapping("/posts")
    @Operation(summary = "查询动态列表", description = "根据条件查询动态列表")
    public Result<PageResult<PublishPostResponseDTO>> queryPosts(
            @Valid PublishPostQueryVO queryVO,
            @RequestHeader("User-Id") Long userId) {
        
        log.info("用户[{}]查询动态列表", userId);
        
        try {
            PageResult<PublishPostResponseDTO> result = publishPostService.queryPosts(queryVO, userId);
            return Result.success(result);
        } catch (Exception e) {
            log.error("查询动态列表失败: {}", e.getMessage(), e);
            return Result.error("查询失败: " + e.getMessage());
        }
    }

    @GetMapping("/posts/{postId}")
    @Operation(summary = "获取动态详情", description = "获取指定动态的详细信息")
    public Result<PublishPostResponseDTO> getPostDetail(
            @PathVariable @NotBlank String postId,
            @RequestHeader("User-Id") Long userId) {
        
        log.info("用户[{}]获取动态详情[{}]", userId, postId);
        
        try {
            PublishPostResponseDTO response = publishPostService.getPostDetail(postId, userId);
            return Result.success(response);
        } catch (Exception e) {
            log.error("获取动态详情失败: {}", e.getMessage(), e);
            return Result.error("获取失败: " + e.getMessage());
        }
    }

    // ============ 媒体文件相关接口 ============

    @PostMapping("/media/upload")
    @Operation(summary = "上传媒体文件", description = "上传图片或视频文件")
    public Result<MediaUploadResponseDTO> uploadMedia(
            @Parameter(description = "媒体文件", required = true) @RequestParam("file") MultipartFile file,
            @Valid MediaUploadRequestDTO request,
            @RequestHeader("User-Id") Long userId) {
        
        log.info("用户[{}]上传媒体文件: {}, 大小: {}", userId, file.getOriginalFilename(), file.getSize());
        
        try {
            MediaUploadResponseDTO response = publishMediaService.uploadMedia(file, request, userId);
            return Result.success(response);
        } catch (Exception e) {
            log.error("上传媒体文件失败: {}", e.getMessage(), e);
            return Result.error("上传失败: " + e.getMessage());
        }
    }

    @DeleteMapping("/media/{mediaId}")
    @Operation(summary = "删除媒体文件", description = "删除指定的媒体文件")
    public Result<Void> deleteMedia(
            @PathVariable @NotBlank String mediaId,
            @RequestHeader("User-Id") Long userId) {
        
        log.info("用户[{}]删除媒体文件[{}]", userId, mediaId);
        
        try {
            publishMediaService.deleteMedia(mediaId, userId);
            return Result.success();
        } catch (Exception e) {
            log.error("删除媒体文件失败: {}", e.getMessage(), e);
            return Result.error("删除失败: " + e.getMessage());
        }
    }

    @GetMapping("/media")
    @Operation(summary = "查询媒体文件", description = "查询用户的媒体文件列表")
    public Result<PageResult<MediaUploadResponseDTO>> queryMedia(
            @Valid MediaQueryVO queryVO,
            @RequestHeader("User-Id") Long userId) {
        
        log.info("用户[{}]查询媒体文件列表", userId);
        
        try {
            PageResult<MediaUploadResponseDTO> result = publishMediaService.queryMedia(queryVO, userId);
            return Result.success(result);
        } catch (Exception e) {
            log.error("查询媒体文件失败: {}", e.getMessage(), e);
            return Result.error("查询失败: " + e.getMessage());
        }
    }

    // ============ 话题相关接口 ============

    @GetMapping("/topics/search")
    @Operation(summary = "搜索话题", description = "根据关键词搜索话题")
    public Result<TopicSearchResponseDTO> searchTopics(
            @Valid TopicSearchRequestDTO request,
            @RequestHeader("User-Id") Long userId) {
        
        log.info("用户[{}]搜索话题: {}", userId, request.getKeyword());
        
        try {
            TopicSearchResponseDTO response = publishTopicService.searchTopics(request, userId);
            return Result.success(response);
        } catch (Exception e) {
            log.error("搜索话题失败: {}", e.getMessage(), e);
            return Result.error("搜索失败: " + e.getMessage());
        }
    }

    @GetMapping("/topics/categories")
    @Operation(summary = "获取话题分类", description = "获取所有话题分类列表")
    public Result<PageResult<TopicSearchResponseDTO.TopicItemDTO>> getTopicCategories(
            @RequestParam(defaultValue = "recommended") String category,
            @RequestParam(defaultValue = "1") Integer pageNum,
            @RequestParam(defaultValue = "20") Integer pageSize,
            @RequestHeader("User-Id") Long userId) {
        
        log.info("用户[{}]获取话题分类[{}]", userId, category);
        
        try {
            PageResult<TopicSearchResponseDTO.TopicItemDTO> result = 
                publishTopicService.getTopicsByCategory(category, pageNum, pageSize, userId);
            return Result.success(result);
        } catch (Exception e) {
            log.error("获取话题分类失败: {}", e.getMessage(), e);
            return Result.error("获取失败: " + e.getMessage());
        }
    }

    @GetMapping("/topics/hot")
    @Operation(summary = "获取热门话题", description = "获取当前热门话题列表")
    public Result<PageResult<TopicSearchResponseDTO.TopicItemDTO>> getHotTopics(
            @RequestParam(defaultValue = "1") Integer pageNum,
            @RequestParam(defaultValue = "20") Integer pageSize,
            @RequestHeader("User-Id") Long userId) {
        
        log.info("用户[{}]获取热门话题", userId);
        
        try {
            PageResult<TopicSearchResponseDTO.TopicItemDTO> result = 
                publishTopicService.getHotTopics(pageNum, pageSize, userId);
            return Result.success(result);
        } catch (Exception e) {
            log.error("获取热门话题失败: {}", e.getMessage(), e);
            return Result.error("获取失败: " + e.getMessage());
        }
    }

    @GetMapping("/topics/recommended")
    @Operation(summary = "获取推荐话题", description = "根据用户偏好推荐话题")
    public Result<PageResult<TopicSearchResponseDTO.TopicItemDTO>> getRecommendedTopics(
            @RequestParam(defaultValue = "1") Integer pageNum,
            @RequestParam(defaultValue = "20") Integer pageSize,
            @RequestHeader("User-Id") Long userId) {
        
        log.info("用户[{}]获取推荐话题", userId);
        
        try {
            PageResult<TopicSearchResponseDTO.TopicItemDTO> result = 
                publishTopicService.getRecommendedTopics(pageNum, pageSize, userId);
            return Result.success(result);
        } catch (Exception e) {
            log.error("获取推荐话题失败: {}", e.getMessage(), e);
            return Result.error("获取失败: " + e.getMessage());
        }
    }

    // ============ 地点相关接口 ============

    @GetMapping("/locations/search")
    @Operation(summary = "搜索地点", description = "根据关键词和位置搜索地点")
    public Result<LocationSearchResponseDTO> searchLocations(
            @Valid LocationSearchRequestDTO request,
            @RequestHeader("User-Id") Long userId) {
        
        log.info("用户[{}]搜索地点: {}", userId, request.getKeyword());
        
        try {
            LocationSearchResponseDTO response = publishLocationService.searchLocations(request, userId);
            return Result.success(response);
        } catch (Exception e) {
            log.error("搜索地点失败: {}", e.getMessage(), e);
            return Result.error("搜索失败: " + e.getMessage());
        }
    }

    @GetMapping("/locations/nearby")
    @Operation(summary = "获取周边地点", description = "获取指定位置周边的地点")
    public Result<LocationSearchResponseDTO> getNearbyLocations(
            @RequestParam @NotNull Double latitude,
            @RequestParam @NotNull Double longitude,
            @RequestParam(defaultValue = "5000") Integer radius,
            @RequestParam(defaultValue = "20") Integer limit,
            @RequestHeader("User-Id") Long userId) {
        
        log.info("用户[{}]获取周边地点: 纬度={}, 经度={}, 半径={}米", userId, latitude, longitude, radius);
        
        try {
            LocationSearchResponseDTO response = 
                publishLocationService.getNearbyLocations(latitude, longitude, radius, limit, userId);
            return Result.success(response);
        } catch (Exception e) {
            log.error("获取周边地点失败: {}", e.getMessage(), e);
            return Result.error("获取失败: " + e.getMessage());
        }
    }

    @PostMapping("/locations/geocode")
    @Operation(summary = "地理编码", description = "将地址转换为经纬度坐标")
    public Result<LocationSearchResponseDTO.LocationItemDTO> geocodeAddress(
            @RequestParam @NotBlank String address,
            @RequestHeader("User-Id") Long userId) {
        
        log.info("用户[{}]地理编码: {}", userId, address);
        
        try {
            LocationSearchResponseDTO.LocationItemDTO response = 
                publishLocationService.geocodeAddress(address, userId);
            return Result.success(response);
        } catch (Exception e) {
            log.error("地理编码失败: {}", e.getMessage(), e);
            return Result.error("编码失败: " + e.getMessage());
        }
    }

    @PostMapping("/locations/reverse-geocode")
    @Operation(summary = "逆地理编码", description = "将经纬度坐标转换为地址")
    public Result<LocationSearchResponseDTO.LocationItemDTO> reverseGeocodeCoordinate(
            @RequestParam @NotNull Double latitude,
            @RequestParam @NotNull Double longitude,
            @RequestHeader("User-Id") Long userId) {
        
        log.info("用户[{}]逆地理编码: 纬度={}, 经度={}", userId, latitude, longitude);
        
        try {
            LocationSearchResponseDTO.LocationItemDTO response = 
                publishLocationService.reverseGeocodeCoordinate(latitude, longitude, userId);
            return Result.success(response);
        } catch (Exception e) {
            log.error("逆地理编码失败: {}", e.getMessage(), e);
            return Result.error("编码失败: " + e.getMessage());
        }
    }

    // ============ 草稿相关接口 ============

    @PostMapping("/drafts")
    @Operation(summary = "保存草稿", description = "保存动态草稿")
    public Result<DraftSaveResponseDTO> saveDraft(
            @Valid @RequestBody DraftSaveRequestDTO request,
            @RequestHeader("User-Id") Long userId) {
        
        log.info("用户[{}]保存草稿", userId);
        
        try {
            DraftSaveResponseDTO response = publishPostService.saveDraft(request, userId);
            return Result.success(response);
        } catch (Exception e) {
            log.error("保存草稿失败: {}", e.getMessage(), e);
            return Result.error("保存失败: " + e.getMessage());
        }
    }

    @GetMapping("/drafts")
    @Operation(summary = "获取草稿列表", description = "获取用户的草稿列表")
    public Result<PageResult<DraftSaveResponseDTO>> getDrafts(
            @RequestParam(defaultValue = "1") Integer pageNum,
            @RequestParam(defaultValue = "20") Integer pageSize,
            @RequestHeader("User-Id") Long userId) {
        
        log.info("用户[{}]获取草稿列表", userId);
        
        try {
            PageResult<DraftSaveResponseDTO> result = 
                publishPostService.getDrafts(pageNum, pageSize, userId);
            return Result.success(result);
        } catch (Exception e) {
            log.error("获取草稿列表失败: {}", e.getMessage(), e);
            return Result.error("获取失败: " + e.getMessage());
        }
    }

    @GetMapping("/drafts/{draftId}")
    @Operation(summary = "获取草稿详情", description = "获取指定草稿的详细内容")
    public Result<PublishPostRequestDTO> getDraftDetail(
            @PathVariable @NotBlank String draftId,
            @RequestHeader("User-Id") Long userId) {
        
        log.info("用户[{}]获取草稿详情[{}]", userId, draftId);
        
        try {
            PublishPostRequestDTO response = publishPostService.getDraftDetail(draftId, userId);
            return Result.success(response);
        } catch (Exception e) {
            log.error("获取草稿详情失败: {}", e.getMessage(), e);
            return Result.error("获取失败: " + e.getMessage());
        }
    }

    @DeleteMapping("/drafts/{draftId}")
    @Operation(summary = "删除草稿", description = "删除指定的草稿")
    public Result<Void> deleteDraft(
            @PathVariable @NotBlank String draftId,
            @RequestHeader("User-Id") Long userId) {
        
        log.info("用户[{}]删除草稿[{}]", userId, draftId);
        
        try {
            publishPostService.deleteDraft(draftId, userId);
            return Result.success();
        } catch (Exception e) {
            log.error("删除草稿失败: {}", e.getMessage(), e);
            return Result.error("删除失败: " + e.getMessage());
        }
    }

    // ============ 内容安全相关接口 ============

    @PostMapping("/security/content-check")
    @Operation(summary = "内容安全检测", description = "检测文本内容的安全性")
    public Result<Boolean> checkContentSecurity(
            @RequestParam @NotBlank String content,
            @RequestHeader("User-Id") Long userId) {
        
        log.info("用户[{}]内容安全检测", userId);
        
        try {
            Boolean isSecure = publishPostService.checkContentSecurity(content, userId);
            return Result.success(isSecure);
        } catch (Exception e) {
            log.error("内容安全检测失败: {}", e.getMessage(), e);
            return Result.error("检测失败: " + e.getMessage());
        }
    }

    @PostMapping("/security/media-check")
    @Operation(summary = "媒体安全检测", description = "检测媒体文件的安全性")
    public Result<Boolean> checkMediaSecurity(
            @RequestParam @NotBlank String mediaId,
            @RequestHeader("User-Id") Long userId) {
        
        log.info("用户[{}]媒体安全检测[{}]", userId, mediaId);
        
        try {
            Boolean isSecure = publishMediaService.checkMediaSecurity(mediaId, userId);
            return Result.success(isSecure);
        } catch (Exception e) {
            log.error("媒体安全检测失败: {}", e.getMessage(), e);
            return Result.error("检测失败: " + e.getMessage());
        }
    }
}
