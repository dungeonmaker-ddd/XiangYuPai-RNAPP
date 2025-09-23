package com.xiangyupai.discover.publish.controller;

import com.xiangyupai.discover.publish.dto.*;
import com.xiangyupai.discover.publish.service.PublishPostService;
import com.xiangyupai.discover.publish.service.PublishMediaService;
import com.xiangyupai.discover.publish.service.PublishTopicService;
import com.xiangyupai.discover.publish.service.PublishLocationService;
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
 * 发布动态控制器 - 精简版，只包含前端实际需要的接口
 * 
 * 🎯 按需设计原则：严格按照前端页面功能需求设计接口
 * ❌ 移除过度设计：批量操作、管理员功能、复杂统计等前端未明确需要的接口
 */
@Slf4j
@RestController
@RequestMapping("/api/v1/publish")
@RequiredArgsConstructor
@Validated
@Tag(name = "发布动态", description = "发布动态核心接口")
public class PublishController {

    private final PublishPostService publishPostService;
    private final PublishMediaService publishMediaService;
    private final PublishTopicService publishTopicService;
    private final PublishLocationService publishLocationService;

    // ============ 核心发布功能 - 前端PublishPage实际需要 ============

    @PostMapping("/posts")
    @Operation(summary = "发布动态", description = "前端发布页面的核心功能")
    public Result<PublishPostResponseDTO> publishPost(
            @Valid @RequestBody PublishPostRequestDTO request,
            @RequestHeader("User-Id") Long userId) {
        
        log.info("用户[{}]发布动态: {}", userId, request.getTitle());
        
        try {
            PublishPostResponseDTO response = publishPostService.publishPost(request, userId);
            return Result.success(response);
        } catch (Exception e) {
            log.error("发布动态失败: {}", e.getMessage(), e);
            return Result.error("发布失败: " + e.getMessage());
        }
    }

    @DeleteMapping("/posts/{postId}")
    @Operation(summary = "删除动态", description = "用户删除自己的动态")
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

    // ============ 媒体上传功能 - 前端MediaManagerArea实际需要 ============

    @PostMapping("/media/upload")
    @Operation(summary = "上传媒体文件", description = "前端媒体管理组件的核心功能")
    public Result<MediaUploadResponseDTO> uploadMedia(
            @Parameter(description = "媒体文件", required = true) @RequestParam("file") MultipartFile file,
            @Valid MediaUploadRequestDTO request,
            @RequestHeader("User-Id") Long userId) {
        
        log.info("用户[{}]上传媒体文件: {}", userId, file.getOriginalFilename());
        
        try {
            MediaUploadResponseDTO response = publishMediaService.uploadMedia(file, request, userId);
            return Result.success(response);
        } catch (Exception e) {
            log.error("上传媒体文件失败: {}", e.getMessage(), e);
            return Result.error("上传失败: " + e.getMessage());
        }
    }

    @DeleteMapping("/media/{mediaId}")
    @Operation(summary = "删除媒体文件", description = "用户删除上传的媒体文件")
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

    // ============ 话题搜索功能 - 前端TopicSelectorPage实际需要 ============

    @GetMapping("/topics/search")
    @Operation(summary = "搜索话题", description = "前端话题选择页面的搜索功能")
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

    @GetMapping("/topics/hot")
    @Operation(summary = "获取热门话题", description = "前端话题选择页面的热门推荐")
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

    // ============ 地点搜索功能 - 前端LocationSelectorDrawer实际需要 ============

    @GetMapping("/locations/search")
    @Operation(summary = "搜索地点", description = "前端地点选择组件的搜索功能")
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
    @Operation(summary = "获取周边地点", description = "前端地点选择组件的GPS定位功能")
    public Result<LocationSearchResponseDTO> getNearbyLocations(
            @RequestParam @NotNull Double latitude,
            @RequestParam @NotNull Double longitude,
            @RequestParam(defaultValue = "5000") Integer radius,
            @RequestParam(defaultValue = "20") Integer limit,
            @RequestHeader("User-Id") Long userId) {
        
        log.info("用户[{}]获取周边地点: 纬度={}, 经度={}", userId, latitude, longitude);
        
        try {
            LocationSearchResponseDTO response = 
                publishLocationService.getNearbyLocations(latitude, longitude, radius, limit, userId);
            return Result.success(response);
        } catch (Exception e) {
            log.error("获取周边地点失败: {}", e.getMessage(), e);
            return Result.error("获取失败: " + e.getMessage());
        }
    }

    // ============ 草稿功能 - 前端DraftManager实际需要 ============

    @PostMapping("/drafts")
    @Operation(summary = "保存草稿", description = "前端草稿管理功能")
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

    @GetMapping("/drafts/{draftId}")
    @Operation(summary = "获取草稿详情", description = "前端恢复草稿功能")
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
    @Operation(summary = "删除草稿", description = "用户删除草稿")
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

    // ============ 内容安全检测 - 前端ContentValidator实际需要 ============

    @PostMapping("/security/content-check")
    @Operation(summary = "内容安全检测", description = "前端发布前的安全验证")
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

    // ============ 🚫 已移除的过度设计接口 ============
    /*
     * 以下接口已移除，因为前端实际不需要：
     * 
     * ❌ 批量操作接口：
     *    - batchDeletePosts() - 前端没有批量删除功能
     *    - batchPublishPosts() - 前端没有批量发布功能
     *    - batchUpdateStatus() - 前端没有批量状态更新功能
     * 
     * ❌ 管理员功能接口：
     *    - auditPost() - 前端不是管理后台
     *    - banUser() - 前端不需要封禁功能
     *    - getAuditList() - 前端不需要审核列表
     * 
     * ❌ 复杂统计接口：
     *    - getUserPublishStatistics() - 前端没有统计页面
     *    - getHotContent() - 前端没有热门内容展示页
     *    - getContentAnalytics() - 前端没有分析功能
     * 
     * ❌ 高级功能接口：
     *    - exportPosts() - 前端没有导出功能
     *    - importPosts() - 前端没有导入功能
     *    - schedulePost() - 前端没有定时发布功能
     * 
     * ❌ 复杂查询接口：
     *    - advancedSearch() - 前端搜索功能简单
     *    - getRecommendations() - 前端没有推荐算法展示
     *    - getTrendingTopics() - 前端只需要热门话题
     * 
     * 🎯 精简后的接口总数：12个核心接口
     *    vs 原设计的30+个接口（减少60%以上）
     */
}
