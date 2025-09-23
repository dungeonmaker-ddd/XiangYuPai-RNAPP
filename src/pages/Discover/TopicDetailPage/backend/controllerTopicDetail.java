/**
 * 话题详情控制器 - 只包含前端实际需要的3个核心接口
 * 
 * 核心接口：
 * 1. 获取话题信息
 * 2. 获取话题动态列表（分页）
 * 3. 点赞/取消点赞动态
 * 
 * 设计原则：最小化接口，避免过度设计
 */

// #region 1. Imports
package com.xiangyupai.pages.discover.topicdetail.controller;

import com.xiangyupai.pages.discover.topicdetail.dto.*;
import com.xiangyupai.pages.discover.topicdetail.service.TopicDetailService;
import com.xiangyupai.common.response.ApiResponse;
import com.xiangyupai.common.response.PageResult;
import com.xiangyupai.common.annotation.ApiLog;
import com.xiangyupai.common.annotation.RateLimit;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.responses.ApiResponse as SwaggerApiResponse;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import javax.validation.constraints.NotBlank;
import java.util.concurrent.CompletableFuture;
// #endregion

// #region 2. Controller Configuration

/**
 * 话题详情API控制器
 * 
 * 只提供前端实际需要的3个核心接口：
 * - 话题信息查询
 * - 话题动态列表查询（分页）
 * - 动态点赞操作
 */
@Slf4j
@RestController
@RequestMapping("/api/v1/discover/topic-detail")
@RequiredArgsConstructor
@Validated
@Tag(name = "话题详情", description = "话题详情页面核心API接口")
public class TopicDetailController {

    private final TopicDetailService topicDetailService;
// #endregion

// #region 3. API Endpoints

    /**
     * 获取话题基本信息
     * 
     * @param topicId 话题ID
     * @param currentUserId 当前用户ID (可选，用于判断关注状态)
     * @return 话题详细信息
     */
    @GetMapping("/topic/{topicId}")
    @Operation(summary = "获取话题信息", description = "根据话题ID获取话题的详细信息，包括统计数据和当前用户的关注状态")
    @ApiResponses({
        @SwaggerApiResponse(responseCode = "200", description = "获取成功"),
        @SwaggerApiResponse(responseCode = "404", description = "话题不存在"),
        @SwaggerApiResponse(responseCode = "500", description = "服务器内部错误")
    })
    @ApiLog(module = "话题详情", operation = "获取话题信息")
    @RateLimit(key = "topic-info", maxRequests = 100, timeWindow = 60) // 每分钟最多100次请求
    public ApiResponse<GetTopicInfoResponseDTO> getTopicInfo(
            @Parameter(description = "话题ID", required = true)
            @PathVariable @NotBlank(message = "话题ID不能为空") String topicId,
            
            @Parameter(description = "当前用户ID", required = false)
            @RequestHeader(value = "X-User-Id", required = false) String currentUserId) {
        
        log.info("获取话题信息请求 - topicId: {}, currentUserId: {}", topicId, currentUserId);
        
        try {
            GetTopicInfoRequestDTO request = GetTopicInfoRequestDTO.builder()
                    .topicId(topicId)
                    .currentUserId(currentUserId)
                    .build();
            
            GetTopicInfoResponseDTO response = topicDetailService.getTopicInfo(request);
            
            log.info("获取话题信息成功 - topicId: {}, topicName: {}", topicId, response.getTopicName());
            return ApiResponse.success(response);
            
        } catch (Exception e) {
            log.error("获取话题信息失败 - topicId: {}, error: {}", topicId, e.getMessage(), e);
            return ApiResponse.error("获取话题信息失败: " + e.getMessage());
        }
    }

    /**
     * 获取话题动态列表
     * 
     * @param topicId 话题ID
     * @param request 查询请求参数
     * @param currentUserId 当前用户ID
     * @return 分页的动态列表
     */
    @GetMapping("/topic/{topicId}/posts")
    @Operation(summary = "获取话题动态列表", description = "获取指定话题下的动态列表，支持分页、排序和筛选")
    @ApiResponses({
        @SwaggerApiResponse(responseCode = "200", description = "获取成功"),
        @SwaggerApiResponse(responseCode = "400", description = "请求参数错误"),
        @SwaggerApiResponse(responseCode = "404", description = "话题不存在"),
        @SwaggerApiResponse(responseCode = "500", description = "服务器内部错误")
    })
    @ApiLog(module = "话题详情", operation = "获取动态列表")
    @RateLimit(key = "topic-posts", maxRequests = 200, timeWindow = 60) // 每分钟最多200次请求
    public ApiResponse<PageResult<TopicPostItemDTO>> getTopicPosts(
            @Parameter(description = "话题ID", required = true)
            @PathVariable @NotBlank(message = "话题ID不能为空") String topicId,
            
            @Parameter(description = "页码", example = "1")
            @RequestParam(defaultValue = "1") Integer page,
            
            @Parameter(description = "每页数量", example = "20")
            @RequestParam(defaultValue = "20") Integer pageSize,
            
            @Parameter(description = "排序方式", example = "latest")
            @RequestParam(defaultValue = "latest") String sortBy,
            
            @Parameter(description = "时间范围", example = "all")
            @RequestParam(defaultValue = "all") String timeRange,
            
            @Parameter(description = "媒体类型", example = "all")
            @RequestParam(defaultValue = "all") String mediaType,
            
            @Parameter(description = "当前用户ID", required = false)
            @RequestHeader(value = "X-User-Id", required = false) String currentUserId) {
        
        log.info("获取话题动态列表请求 - topicId: {}, page: {}, pageSize: {}, sortBy: {}", 
                topicId, page, pageSize, sortBy);
        
        try {
            GetTopicPostsRequestDTO request = GetTopicPostsRequestDTO.builder()
                    .topicId(topicId)
                    .page(page)
                    .pageSize(pageSize)
                    .sortBy(sortBy)
                    .timeRange(timeRange)
                    .mediaType(mediaType)
                    .currentUserId(currentUserId)
                    .build();
            
            GetTopicPostsResponseDTO response = topicDetailService.getTopicPosts(request);
            
            PageResult<TopicPostItemDTO> pageResult = PageResult.<TopicPostItemDTO>builder()
                    .data(response.getPosts())
                    .page(response.getPagination().getPage())
                    .pageSize(response.getPagination().getPageSize())
                    .total(response.getPagination().getTotal())
                    .totalPages(response.getPagination().getTotalPages())
                    .hasMore(response.getPagination().getHasMore())
                    .build();
            
            log.info("获取话题动态列表成功 - topicId: {}, 返回{}条数据", topicId, response.getPosts().size());
            return ApiResponse.success(pageResult);
            
        } catch (Exception e) {
            log.error("获取话题动态列表失败 - topicId: {}, error: {}", topicId, e.getMessage(), e);
            return ApiResponse.error("获取动态列表失败: " + e.getMessage());
        }
    }

    /**
     * 点赞/取消点赞动态
     * 
     * @param postId 动态ID
     * @param request 点赞请求参数
     * @param currentUserId 当前用户ID
     * @return 点赞结果
     */
    @PostMapping("/post/{postId}/like")
    @Operation(summary = "点赞动态", description = "点赞或取消点赞指定的动态")
    @ApiResponses({
        @SwaggerApiResponse(responseCode = "200", description = "操作成功"),
        @SwaggerApiResponse(responseCode = "400", description = "请求参数错误"),
        @SwaggerApiResponse(responseCode = "401", description = "用户未登录"),
        @SwaggerApiResponse(responseCode = "404", description = "动态不存在"),
        @SwaggerApiResponse(responseCode = "500", description = "服务器内部错误")
    })
    @ApiLog(module = "话题详情", operation = "点赞动态")
    @RateLimit(key = "like-post", maxRequests = 50, timeWindow = 60) // 每分钟最多50次请求
    public ApiResponse<LikeTopicPostResponseDTO> likePost(
            @Parameter(description = "动态ID", required = true)
            @PathVariable @NotBlank(message = "动态ID不能为空") String postId,
            
            @Parameter(description = "点赞操作类型", required = true)
            @RequestBody @Valid LikeTopicPostRequestDTO request,
            
            @Parameter(description = "当前用户ID", required = true)
            @RequestHeader("X-User-Id") @NotBlank(message = "用户ID不能为空") String currentUserId) {
        
        log.info("点赞动态请求 - postId: {}, userId: {}, action: {}", 
                postId, currentUserId, request.getAction());
        
        try {
            // 设置请求参数
            request.setPostId(postId);
            request.setUserId(currentUserId);
            
            LikeTopicPostResponseDTO response = topicDetailService.likePost(request);
            
            log.info("点赞动态成功 - postId: {}, userId: {}, isLiked: {}, likeCount: {}", 
                    postId, currentUserId, response.getIsLiked(), response.getLikeCount());
            return ApiResponse.success(response);
            
        } catch (Exception e) {
            log.error("点赞动态失败 - postId: {}, userId: {}, error: {}", 
                    postId, currentUserId, e.getMessage(), e);
            return ApiResponse.error("点赞操作失败: " + e.getMessage());
        }
    }

    // 删除了不必要的批量接口和统计接口
    // 前端只需要3个核心接口即可满足需求
// #endregion

// #region 4. Request Validation
// 验证逻辑已通过注解实现
// #endregion

// #region 5. Response Formatting
// 响应格式化通过ApiResponse统一处理
// #endregion

// #region 6. Error Handling

    /**
     * 全局异常处理
     */
    @ExceptionHandler(javax.validation.ConstraintViolationException.class)
    public ApiResponse<Void> handleValidationException(javax.validation.ConstraintViolationException e) {
        log.warn("参数验证失败: {}", e.getMessage());
        return ApiResponse.error("参数验证失败: " + e.getMessage());
    }

    @ExceptionHandler(IllegalArgumentException.class)
    public ApiResponse<Void> handleIllegalArgumentException(IllegalArgumentException e) {
        log.warn("参数错误: {}", e.getMessage());
        return ApiResponse.error("参数错误: " + e.getMessage());
    }

    @ExceptionHandler(RuntimeException.class)
    public ApiResponse<Void> handleRuntimeException(RuntimeException e) {
        log.error("运行时异常: {}", e.getMessage(), e);
        return ApiResponse.error("操作失败，请稍后重试");
    }
// #endregion

// #region 7. Security & Auth
// 安全认证通过拦截器和注解实现
// #endregion

// #region 8. Documentation
/**
 * API接口文档说明：
 * 
 * 1. 话题信息接口：
 *    - GET /api/v1/discover/topic-detail/topic/{topicId}
 *    - 获取话题的基本信息和统计数据
 *    - 支持用户关注状态查询
 * 
 * 2. 话题动态列表接口：
 *    - GET /api/v1/discover/topic-detail/topic/{topicId}/posts
 *    - 支持分页、排序、筛选
 *    - 支持时间范围和媒体类型筛选
 * 
 * 3. 动态点赞接口：
 *    - POST /api/v1/discover/topic-detail/post/{postId}/like
 *    - 支持点赞和取消点赞操作
 *    - 实时更新点赞数量
 * 
 * 4. 话题统计接口：
 *    - GET /api/v1/discover/topic-detail/topic/{topicId}/stats
 *    - 异步获取话题统计信息
 *    - 提升页面加载性能
 * 
 * 5. 批量互动状态接口：
 *    - POST /api/v1/discover/topic-detail/posts/interactions/batch
 *    - 批量获取多个动态的用户互动状态
 *    - 优化列表页面性能
 */
// #endregion
}
