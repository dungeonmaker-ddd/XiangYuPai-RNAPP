/**
 * 瀑布流控制器
 * 基于通用组件架构核心标准 - 后端交互层
 * REST API控制器，处理HTTP请求和响应
 * 
 * @version 2.0.0
 * @author 架构团队
 */

package com.xiangyu.discover.waterfall.controller;

import com.xiangyu.common.result.ApiResult;
import com.xiangyu.common.result.PageResult;
import com.xiangyu.discover.waterfall.dto.*;
import com.xiangyu.discover.waterfall.service.WaterfallService;
import com.xiangyu.discover.waterfall.vo.*;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotEmpty;
import java.util.List;

/**
 * 瀑布流REST API控制器
 */
@Slf4j
@RestController
@RequestMapping("/api/v1/waterfall")
@RequiredArgsConstructor
@Validated
@Tag(name = "瀑布流API", description = "瀑布流内容相关接口")
public class WaterfallController {

    private final WaterfallService waterfallService;

    // =====================================================
    // 内容查询接口
    // =====================================================

    /**
     * 分页查询瀑布流内容
     */
    @GetMapping("/content")
    @Operation(summary = "分页查询瀑布流内容", description = "根据标签页类型和筛选条件分页查询瀑布流内容")
    public ApiResult<PageResult<WaterfallContentVO>> getWaterfallContent(
            @Valid @ModelAttribute WaterfallContentQueryRequest request) {
        
        log.info("分页查询瀑布流内容: tabType={}, page={}, limit={}, userId={}", 
                request.getTabType(), request.getPage(), request.getLimit(), request.getUserId());
        
        try {
            PageResult<WaterfallContentVO> result = waterfallService.getWaterfallContent(request);
            
            log.info("查询成功: 返回{}条内容, 总计{}条", 
                    result.getData().size(), result.getTotal());
            
            return ApiResult.success(result);
        } catch (Exception e) {
            log.error("查询瀑布流内容失败: {}", e.getMessage(), e);
            return ApiResult.error("查询失败: " + e.getMessage());
        }
    }

    /**
     * 刷新瀑布流内容
     */
    @PostMapping("/refresh")
    @Operation(summary = "刷新瀑布流内容", description = "获取最新的瀑布流内容")
    public ApiResult<WaterfallRefreshVO> refreshWaterfallContent(
            @Valid @RequestBody WaterfallRefreshRequest request) {
        
        log.info("刷新瀑布流内容: tabType={}, userId={}", 
                request.getTabType(), request.getUserId());
        
        try {
            WaterfallRefreshVO result = waterfallService.refreshWaterfallContent(request);
            
            log.info("刷新成功: 返回{}条新内容", result.getData().size());
            
            return ApiResult.success(result);
        } catch (Exception e) {
            log.error("刷新瀑布流内容失败: {}", e.getMessage(), e);
            return ApiResult.error("刷新失败: " + e.getMessage());
        }
    }

    /**
     * 获取推荐内容
     */
    @GetMapping("/recommend")
    @Operation(summary = "获取推荐内容", description = "基于用户偏好获取推荐内容")
    public ApiResult<List<WaterfallContentVO>> getRecommendedContent(
            @Parameter(description = "用户ID") @RequestParam(required = false) String userId,
            @Parameter(description = "推荐数量") @RequestParam(defaultValue = "10") Integer count) {
        
        log.info("获取推荐内容: userId={}, count={}", userId, count);
        
        try {
            List<WaterfallContentVO> result = waterfallService.getRecommendedContent(userId, count);
            
            log.info("推荐成功: 返回{}条推荐内容", result.size());
            
            return ApiResult.success(result);
        } catch (Exception e) {
            log.error("获取推荐内容失败: {}", e.getMessage(), e);
            return ApiResult.error("获取推荐失败: " + e.getMessage());
        }
    }

    // =====================================================
    // 点赞相关接口
    // =====================================================

    /**
     * 点赞/取消点赞内容
     */
    @PostMapping("/like")
    @Operation(summary = "点赞/取消点赞", description = "对瀑布流内容进行点赞或取消点赞操作")
    public ApiResult<WaterfallLikeVO> likeContent(@Valid @RequestBody WaterfallLikeRequest request) {
        
        log.info("点赞操作: contentId={}, userId={}, isLike={}", 
                request.getContentId(), request.getUserId(), request.getIsLike());
        
        try {
            WaterfallLikeVO result = waterfallService.likeContent(request);
            
            log.info("点赞操作成功: contentId={}, 当前点赞数={}", 
                    result.getContentId(), result.getLikeCount());
            
            return ApiResult.success(result);
        } catch (Exception e) {
            log.error("点赞操作失败: {}", e.getMessage(), e);
            return ApiResult.error("操作失败: " + e.getMessage());
        }
    }

    /**
     * 批量点赞操作
     */
    @PostMapping("/batch-like")
    @Operation(summary = "批量点赞操作", description = "批量对多个内容进行点赞或取消点赞")
    public ApiResult<WaterfallBatchLikeVO> batchLikeContent(
            @Valid @RequestBody WaterfallBatchLikeRequest request) {
        
        log.info("批量点赞操作: userId={}, 操作数量={}", 
                request.getUserId(), request.getOperations().size());
        
        try {
            WaterfallBatchLikeVO result = waterfallService.batchLikeContent(request);
            
            log.info("批量点赞操作完成: 成功{}个, 失败{}个", 
                    result.getSuccessCount(), result.getFailureCount());
            
            return ApiResult.success(result);
        } catch (Exception e) {
            log.error("批量点赞操作失败: {}", e.getMessage(), e);
            return ApiResult.error("批量操作失败: " + e.getMessage());
        }
    }

    /**
     * 获取内容点赞状态
     */
    @GetMapping("/like-status")
    @Operation(summary = "获取点赞状态", description = "获取多个内容的点赞状态")
    public ApiResult<WaterfallLikeStatusVO> getLikeStatus(
            @Parameter(description = "内容ID列表，逗号分隔") @RequestParam @NotBlank String contentIds,
            @Parameter(description = "用户ID") @RequestParam @NotBlank String userId) {
        
        log.info("获取点赞状态: contentIds={}, userId={}", contentIds, userId);
        
        try {
            String[] contentIdArray = contentIds.split(",");
            WaterfallLikeStatusVO result = waterfallService.getLikeStatus(contentIdArray, userId);
            
            log.info("获取点赞状态成功: 查询{}个内容", result.getStatuses().size());
            
            return ApiResult.success(result);
        } catch (Exception e) {
            log.error("获取点赞状态失败: {}", e.getMessage(), e);
            return ApiResult.error("获取状态失败: " + e.getMessage());
        }
    }

    /**
     * 获取用户点赞历史
     */
    @GetMapping("/user-likes")
    @Operation(summary = "获取用户点赞历史", description = "分页获取用户的点赞历史记录")
    public ApiResult<PageResult<WaterfallUserLikeVO>> getUserLikeHistory(
            @Parameter(description = "用户ID") @RequestParam @NotBlank String userId,
            @Parameter(description = "页码") @RequestParam(defaultValue = "1") Integer page,
            @Parameter(description = "每页数量") @RequestParam(defaultValue = "20") Integer limit) {
        
        log.info("获取用户点赞历史: userId={}, page={}, limit={}", userId, page, limit);
        
        try {
            PageResult<WaterfallUserLikeVO> result = waterfallService.getUserLikeHistory(userId, page, limit);
            
            log.info("获取点赞历史成功: 返回{}条记录", result.getData().size());
            
            return ApiResult.success(result);
        } catch (Exception e) {
            log.error("获取用户点赞历史失败: {}", e.getMessage(), e);
            return ApiResult.error("获取历史失败: " + e.getMessage());
        }
    }

    // =====================================================
    // 分页和统计接口
    // =====================================================

    /**
     * 游标分页查询
     */
    @GetMapping("/cursor-paginated")
    @Operation(summary = "游标分页查询", description = "使用游标进行分页查询，适用于实时性要求高的场景")
    public ApiResult<WaterfallCursorPageVO> getCursorPaginatedContent(
            @Parameter(description = "标签页类型") @RequestParam @NotBlank String tabType,
            @Parameter(description = "游标") @RequestParam(required = false) String cursor,
            @Parameter(description = "数量限制") @RequestParam(defaultValue = "20") Integer limit,
            @Parameter(description = "方向") @RequestParam(defaultValue = "forward") String direction,
            @Parameter(description = "用户ID") @RequestParam(required = false) String userId) {
        
        log.info("游标分页查询: tabType={}, cursor={}, limit={}", tabType, cursor, limit);
        
        try {
            WaterfallCursorPageVO result = waterfallService.getCursorPaginatedContent(
                    tabType, cursor, limit, direction, userId);
            
            log.info("游标分页查询成功: 返回{}条内容", result.getData().size());
            
            return ApiResult.success(result);
        } catch (Exception e) {
            log.error("游标分页查询失败: {}", e.getMessage(), e);
            return ApiResult.error("查询失败: " + e.getMessage());
        }
    }

    /**
     * 获取分页统计信息
     */
    @GetMapping("/pagination-stats")
    @Operation(summary = "获取分页统计", description = "获取瀑布流的分页统计信息")
    public ApiResult<WaterfallStatsVO> getPaginationStats(
            @Valid @ModelAttribute WaterfallStatsRequest request) {
        
        log.info("获取分页统计: tabType={}, userId={}", request.getTabType(), request.getUserId());
        
        try {
            WaterfallStatsVO result = waterfallService.getPaginationStats(request);
            
            log.info("获取统计成功: 总内容数={}", result.getTotalCount());
            
            return ApiResult.success(result);
        } catch (Exception e) {
            log.error("获取分页统计失败: {}", e.getMessage(), e);
            return ApiResult.error("获取统计失败: " + e.getMessage());
        }
    }

    /**
     * 预加载下一页内容
     */
    @GetMapping("/preload")
    @Operation(summary = "预加载内容", description = "预加载下一页内容，提升用户体验")
    public ApiResult<PageResult<WaterfallContentVO>> preloadContent(
            @Valid @ModelAttribute WaterfallContentQueryRequest request,
            @Parameter(description = "预加载优先级") @RequestParam(defaultValue = "low") String priority) {
        
        log.info("预加载内容: tabType={}, page={}, priority={}", 
                request.getTabType(), request.getPage(), priority);
        
        try {
            PageResult<WaterfallContentVO> result = waterfallService.preloadContent(request, priority);
            
            log.info("预加载成功: 返回{}条内容", result.getData().size());
            
            return ApiResult.success(result);
        } catch (Exception e) {
            log.error("预加载内容失败: {}", e.getMessage(), e);
            return ApiResult.error("预加载失败: " + e.getMessage());
        }
    }

    // =====================================================
    // 用户交互接口
    // =====================================================

    /**
     * 用户交互操作
     */
    @PostMapping("/user-interaction")
    @Operation(summary = "用户交互", description = "处理用户之间的交互操作，如关注、取消关注等")
    public ApiResult<WaterfallUserInteractionVO> handleUserInteraction(
            @Valid @RequestBody WaterfallUserInteractionRequest request) {
        
        log.info("用户交互: targetUserId={}, currentUserId={}, type={}", 
                request.getTargetUserId(), request.getCurrentUserId(), request.getInteractionType());
        
        try {
            WaterfallUserInteractionVO result = waterfallService.handleUserInteraction(request);
            
            log.info("用户交互成功: 操作类型={}, 结果={}", 
                    request.getInteractionType(), result.isSuccess());
            
            return ApiResult.success(result);
        } catch (Exception e) {
            log.error("用户交互失败: {}", e.getMessage(), e);
            return ApiResult.error("交互失败: " + e.getMessage());
        }
    }

    /**
     * 举报内容
     */
    @PostMapping("/report")
    @Operation(summary = "举报内容", description = "举报不当内容")
    public ApiResult<WaterfallReportVO> reportContent(@Valid @RequestBody WaterfallReportRequest request) {
        
        log.info("举报内容: contentId={}, reporterUserId={}, reportType={}", 
                request.getContentId(), request.getReporterUserId(), request.getReportType());
        
        try {
            WaterfallReportVO result = waterfallService.reportContent(request);
            
            log.info("举报成功: 举报ID={}", result.getReportId());
            
            return ApiResult.success(result);
        } catch (Exception e) {
            log.error("举报内容失败: {}", e.getMessage(), e);
            return ApiResult.error("举报失败: " + e.getMessage());
        }
    }

    // =====================================================
    // 健康检查和监控接口
    // =====================================================

    /**
     * 健康检查
     */
    @GetMapping("/health")
    @Operation(summary = "健康检查", description = "检查瀑布流服务健康状态")
    public ApiResult<WaterfallHealthVO> healthCheck() {
        
        log.debug("瀑布流服务健康检查");
        
        try {
            WaterfallHealthVO result = waterfallService.healthCheck();
            
            log.debug("健康检查完成: status={}", result.getStatus());
            
            return ApiResult.success(result);
        } catch (Exception e) {
            log.error("健康检查失败: {}", e.getMessage(), e);
            return ApiResult.error("健康检查失败: " + e.getMessage());
        }
    }

    /**
     * 获取服务监控指标
     */
    @GetMapping("/metrics")
    @Operation(summary = "服务监控指标", description = "获取瀑布流服务的监控指标")
    public ApiResult<WaterfallMetricsVO> getMetrics() {
        
        log.debug("获取瀑布流服务监控指标");
        
        try {
            WaterfallMetricsVO result = waterfallService.getMetrics();
            
            log.debug("获取监控指标成功: 请求总数={}", result.getTotalRequests());
            
            return ApiResult.success(result);
        } catch (Exception e) {
            log.error("获取监控指标失败: {}", e.getMessage(), e);
            return ApiResult.error("获取指标失败: " + e.getMessage());
        }
    }
}
