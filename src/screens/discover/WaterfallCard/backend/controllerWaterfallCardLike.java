/**
 * 瀑布流卡片点赞控制器
 * 基于通用组件架构核心标准 - 后端交互层
 * 
 * @version 2.0.0
 * @author 架构团队
 */

package com.xiangyu.waterfall.controller;

import com.xiangyu.waterfall.dto.WaterfallCardLikeDTO.*;
import com.xiangyu.waterfall.service.WaterfallCardLikeService;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import io.swagger.annotations.ApiParam;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotEmpty;
import java.util.List;

/**
 * 瀑布流卡片点赞REST控制器
 * 提供完整的点赞相关API接口
 */
@Slf4j
@RestController
@RequestMapping("/api/v1/waterfall/like")
@Api(tags = "瀑布流卡片点赞管理")
@Validated
public class WaterfallCardLikeController {

    @Autowired
    private WaterfallCardLikeService waterfallCardLikeService;

    // =====================================================
    // 核心点赞操作接口
    // =====================================================

    /**
     * 点赞或取消点赞内容
     */
    @PostMapping("/toggle")
    @ApiOperation("点赞/取消点赞内容")
    public BaseResponse<LikeResponse> toggleLike(
            @ApiParam("点赞请求参数") @Valid @RequestBody LikeRequest request) {
        
        log.info("收到点赞请求: contentId={}, action={}, sourceTab={}", 
                request.getContentId(), request.getAction(), request.getSourceTab());
        
        try {
            LikeResponse response = waterfallCardLikeService.toggleLike(request);
            
            log.info("点赞操作完成: contentId={}, isLiked={}, likeCount={}", 
                    response.getContentId(), response.getIsLiked(), response.getLikeCount());
            
            return BaseResponse.<LikeResponse>builder()
                    .code(200)
                    .message("操作成功")
                    .data(response)
                    .timestamp(System.currentTimeMillis())
                    .build();
                    
        } catch (Exception e) {
            log.error("点赞操作失败: contentId={}, error={}", request.getContentId(), e.getMessage(), e);
            
            return BaseResponse.<LikeResponse>builder()
                    .code(500)
                    .message("操作失败: " + e.getMessage())
                    .timestamp(System.currentTimeMillis())
                    .build();
        }
    }

    /**
     * 批量点赞操作
     */
    @PostMapping("/batch")
    @ApiOperation("批量点赞/取消点赞")
    public BaseResponse<BatchLikeResponse> batchToggleLike(
            @ApiParam("批量点赞请求参数") @Valid @RequestBody BatchLikeRequest request) {
        
        log.info("收到批量点赞请求: batchId={}, actionCount={}", 
                request.getBatchId(), request.getActions().size());
        
        try {
            BatchLikeResponse response = waterfallCardLikeService.batchToggleLike(request);
            
            log.info("批量点赞操作完成: batchId={}, successCount={}, failureCount={}", 
                    response.getBatchId(), response.getSuccessCount(), response.getFailureCount());
            
            return BaseResponse.<BatchLikeResponse>builder()
                    .code(200)
                    .message("批量操作完成")
                    .data(response)
                    .timestamp(System.currentTimeMillis())
                    .build();
                    
        } catch (Exception e) {
            log.error("批量点赞操作失败: batchId={}, error={}", request.getBatchId(), e.getMessage(), e);
            
            return BaseResponse.<BatchLikeResponse>builder()
                    .code(500)
                    .message("批量操作失败: " + e.getMessage())
                    .timestamp(System.currentTimeMillis())
                    .build();
        }
    }

    // =====================================================
    // 查询接口
    // =====================================================

    /**
     * 获取内容点赞状态
     */
    @GetMapping("/status")
    @ApiOperation("获取内容点赞状态")
    public BaseResponse<LikeStatusResponse> getLikeStatus(
            @ApiParam("内容ID列表，逗号分隔") @RequestParam @NotBlank String contentIds,
            @ApiParam("是否包含详细信息") @RequestParam(defaultValue = "false") Boolean includeDetails) {
        
        List<String> contentIdList = List.of(contentIds.split(","));
        
        log.info("查询点赞状态: contentIds={}, includeDetails={}", contentIdList, includeDetails);
        
        try {
            LikeStatusRequest request = LikeStatusRequest.builder()
                    .contentIds(contentIdList)
                    .includeDetails(includeDetails)
                    .build();
                    
            LikeStatusResponse response = waterfallCardLikeService.getLikeStatus(request);
            
            log.info("点赞状态查询完成: contentCount={}", response.getLikeStatuses().size());
            
            return BaseResponse.<LikeStatusResponse>builder()
                    .code(200)
                    .message("查询成功")
                    .data(response)
                    .timestamp(System.currentTimeMillis())
                    .build();
                    
        } catch (Exception e) {
            log.error("点赞状态查询失败: contentIds={}, error={}", contentIdList, e.getMessage(), e);
            
            return BaseResponse.<LikeStatusResponse>builder()
                    .code(500)
                    .message("查询失败: " + e.getMessage())
                    .timestamp(System.currentTimeMillis())
                    .build();
        }
    }

    /**
     * 获取单个内容点赞状态
     */
    @GetMapping("/status/{contentId}")
    @ApiOperation("获取单个内容点赞状态")
    public BaseResponse<ContentLikeStatus> getSingleLikeStatus(
            @ApiParam("内容ID") @PathVariable @NotBlank String contentId) {
        
        log.info("查询单个内容点赞状态: contentId={}", contentId);
        
        try {
            ContentLikeStatus status = waterfallCardLikeService.getSingleLikeStatus(contentId);
            
            log.info("单个内容点赞状态查询完成: contentId={}, isLiked={}, likeCount={}", 
                    contentId, status.getIsLiked(), status.getLikeCount());
            
            return BaseResponse.<ContentLikeStatus>builder()
                    .code(200)
                    .message("查询成功")
                    .data(status)
                    .timestamp(System.currentTimeMillis())
                    .build();
                    
        } catch (Exception e) {
            log.error("单个内容点赞状态查询失败: contentId={}, error={}", contentId, e.getMessage(), e);
            
            return BaseResponse.<ContentLikeStatus>builder()
                    .code(500)
                    .message("查询失败: " + e.getMessage())
                    .timestamp(System.currentTimeMillis())
                    .build();
        }
    }

    /**
     * 获取用户点赞历史
     */
    @GetMapping("/history")
    @ApiOperation("获取用户点赞历史")
    public BaseResponse<PageResponse<LikeHistoryResponse>> getLikeHistory(
            @ApiParam("用户ID") @RequestParam(required = false) Long userId,
            @ApiParam("内容类型") @RequestParam(required = false) String contentType,
            @ApiParam("来源标签") @RequestParam(required = false) String sourceTab,
            @ApiParam("当前页码") @RequestParam(defaultValue = "1") Long current,
            @ApiParam("每页大小") @RequestParam(defaultValue = "10") Long size,
            @ApiParam("排序字段") @RequestParam(defaultValue = "created_at") String orderBy,
            @ApiParam("是否升序") @RequestParam(defaultValue = "false") Boolean isAsc,
            @ApiParam("是否只查询点赞状态") @RequestParam(defaultValue = "true") Boolean onlyLiked) {
        
        log.info("查询用户点赞历史: userId={}, contentType={}, sourceTab={}, current={}, size={}", 
                userId, contentType, sourceTab, current, size);
        
        try {
            LikeHistoryRequest request = LikeHistoryRequest.builder()
                    .userId(userId)
                    .contentType(contentType)
                    .sourceTab(sourceTab)
                    .current(current)
                    .size(size)
                    .orderBy(orderBy)
                    .isAsc(isAsc)
                    .onlyLiked(onlyLiked)
                    .build();
                    
            PageResponse<LikeHistoryResponse> response = waterfallCardLikeService.getLikeHistory(request);
            
            log.info("用户点赞历史查询完成: userId={}, total={}, records={}", 
                    userId, response.getTotal(), response.getRecords().size());
            
            return BaseResponse.<PageResponse<LikeHistoryResponse>>builder()
                    .code(200)
                    .message("查询成功")
                    .data(response)
                    .timestamp(System.currentTimeMillis())
                    .build();
                    
        } catch (Exception e) {
            log.error("用户点赞历史查询失败: userId={}, error={}", userId, e.getMessage(), e);
            
            return BaseResponse.<PageResponse<LikeHistoryResponse>>builder()
                    .code(500)
                    .message("查询失败: " + e.getMessage())
                    .timestamp(System.currentTimeMillis())
                    .build();
        }
    }

    // =====================================================
    // 统计接口
    // =====================================================

    /**
     * 获取内容点赞统计
     */
    @GetMapping("/statistics/{contentId}")
    @ApiOperation("获取内容点赞统计")
    public BaseResponse<ContentLikeStatistics> getContentLikeStatistics(
            @ApiParam("内容ID") @PathVariable @NotBlank String contentId) {
        
        log.info("查询内容点赞统计: contentId={}", contentId);
        
        try {
            ContentLikeStatistics statistics = waterfallCardLikeService.getContentLikeStatistics(contentId);
            
            log.info("内容点赞统计查询完成: contentId={}, totalLikes={}, todayLikes={}", 
                    contentId, statistics.getTotalLikes(), statistics.getTodayLikes());
            
            return BaseResponse.<ContentLikeStatistics>builder()
                    .code(200)
                    .message("查询成功")
                    .data(statistics)
                    .timestamp(System.currentTimeMillis())
                    .build();
                    
        } catch (Exception e) {
            log.error("内容点赞统计查询失败: contentId={}, error={}", contentId, e.getMessage(), e);
            
            return BaseResponse.<ContentLikeStatistics>builder()
                    .code(500)
                    .message("查询失败: " + e.getMessage())
                    .timestamp(System.currentTimeMillis())
                    .build();
        }
    }

    /**
     * 获取用户点赞统计
     */
    @GetMapping("/user-statistics")
    @ApiOperation("获取用户点赞统计")
    public BaseResponse<UserLikeStatistics> getUserLikeStatistics(
            @ApiParam("用户ID") @RequestParam(required = false) Long userId) {
        
        log.info("查询用户点赞统计: userId={}", userId);
        
        try {
            UserLikeStatistics statistics = waterfallCardLikeService.getUserLikeStatistics(userId);
            
            log.info("用户点赞统计查询完成: userId={}, totalLikes={}, todayLikes={}", 
                    userId, statistics.getTotalLikes(), statistics.getTodayLikes());
            
            return BaseResponse.<UserLikeStatistics>builder()
                    .code(200)
                    .message("查询成功")
                    .data(statistics)
                    .timestamp(System.currentTimeMillis())
                    .build();
                    
        } catch (Exception e) {
            log.error("用户点赞统计查询失败: userId={}, error={}", userId, e.getMessage(), e);
            
            return BaseResponse.<UserLikeStatistics>builder()
                    .code(500)
                    .message("查询失败: " + e.getMessage())
                    .timestamp(System.currentTimeMillis())
                    .build();
        }
    }

    // =====================================================
    // 管理接口
    // =====================================================

    /**
     * 删除点赞记录
     */
    @DeleteMapping("/{likeId}")
    @ApiOperation("删除点赞记录")
    public BaseResponse<Boolean> deleteLikeRecord(
            @ApiParam("点赞记录ID") @PathVariable @NotBlank String likeId) {
        
        log.info("删除点赞记录: likeId={}", likeId);
        
        try {
            Boolean result = waterfallCardLikeService.deleteLikeRecord(likeId);
            
            log.info("点赞记录删除完成: likeId={}, result={}", likeId, result);
            
            return BaseResponse.<Boolean>builder()
                    .code(200)
                    .message("删除成功")
                    .data(result)
                    .timestamp(System.currentTimeMillis())
                    .build();
                    
        } catch (Exception e) {
            log.error("点赞记录删除失败: likeId={}, error={}", likeId, e.getMessage(), e);
            
            return BaseResponse.<Boolean>builder()
                    .code(500)
                    .message("删除失败: " + e.getMessage())
                    .timestamp(System.currentTimeMillis())
                    .build();
        }
    }

    /**
     * 清理用户点赞历史
     */
    @DeleteMapping("/cleanup")
    @ApiOperation("清理用户点赞历史")
    public BaseResponse<Integer> cleanupUserLikeHistory(
            @ApiParam("用户ID") @RequestParam(required = false) Long userId,
            @ApiParam("保留天数") @RequestParam(defaultValue = "30") Integer keepDays) {
        
        log.info("清理用户点赞历史: userId={}, keepDays={}", userId, keepDays);
        
        try {
            Integer cleanedCount = waterfallCardLikeService.cleanupUserLikeHistory(userId, keepDays);
            
            log.info("用户点赞历史清理完成: userId={}, cleanedCount={}", userId, cleanedCount);
            
            return BaseResponse.<Integer>builder()
                    .code(200)
                    .message("清理完成")
                    .data(cleanedCount)
                    .timestamp(System.currentTimeMillis())
                    .build();
                    
        } catch (Exception e) {
            log.error("用户点赞历史清理失败: userId={}, error={}", userId, e.getMessage(), e);
            
            return BaseResponse.<Integer>builder()
                    .code(500)
                    .message("清理失败: " + e.getMessage())
                    .timestamp(System.currentTimeMillis())
                    .build();
        }
    }

    // =====================================================
    // 内部统计类定义
    // =====================================================

    /**
     * 内容点赞统计
     */
    @lombok.Data
    @lombok.Builder
    @lombok.NoArgsConstructor
    @lombok.AllArgsConstructor
    public static class ContentLikeStatistics {
        private String contentId;
        private Integer totalLikes;
        private Integer todayLikes;
        private Integer weekLikes;
        private Integer monthLikes;
        private java.time.LocalDateTime lastLikeTime;
        private List<HourlyLikeCount> hourlyStats;
    }

    /**
     * 用户点赞统计
     */
    @lombok.Data
    @lombok.Builder
    @lombok.NoArgsConstructor
    @lombok.AllArgsConstructor
    public static class UserLikeStatistics {
        private Long userId;
        private Integer totalLikes;
        private Integer todayLikes;
        private Integer weekLikes;
        private Integer monthLikes;
        private java.time.LocalDateTime lastLikeTime;
        private List<String> favoriteContentTypes;
        private List<String> favoriteTabs;
    }

    /**
     * 每小时点赞统计
     */
    @lombok.Data
    @lombok.Builder
    @lombok.NoArgsConstructor
    @lombok.AllArgsConstructor
    public static class HourlyLikeCount {
        private Integer hour;
        private Integer count;
    }
}
