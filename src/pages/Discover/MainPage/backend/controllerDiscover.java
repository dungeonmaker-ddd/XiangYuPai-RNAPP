/**
 * 发现模块控制器
 * HTTP请求处理入口
 * 
 * 包含：内容列表、用户互动、关注操作、位置更新
 */

package com.xiangyupai.discover.controller;

import com.xiangyupai.common.result.Result;
import com.xiangyupai.common.util.SecurityUtils;
import com.xiangyupai.discover.dto.*;
import com.xiangyupai.discover.service.DiscoverContentService;
import com.xiangyupai.discover.service.DiscoverInteractionService;
import com.xiangyupai.discover.service.DiscoverLocationService;
import io.swagger.annotations.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.util.List;

/**
 * 发现内容控制器
 * 
 * 功能：处理发现页面相关的HTTP请求
 * 路径：/api/discover
 */
@Api(tags = "发现模块")
@RestController
@RequestMapping("/api/discover")
@RequiredArgsConstructor
@Slf4j
@Validated
public class DiscoverController {

    private final DiscoverContentService discoverContentService;
    private final DiscoverInteractionService discoverInteractionService;
    private final DiscoverLocationService discoverLocationService;

    /**
     * 获取热门内容列表
     * 
     * @param request 请求参数
     * @return 内容列表响应
     */
    @ApiOperation(value = "获取热门内容列表", notes = "获取全网热门内容，支持分页和筛选")
    @ApiResponses({
        @ApiResponse(code = 200, message = "成功"),
        @ApiResponse(code = 400, message = "参数错误"),
        @ApiResponse(code = 500, message = "服务器内部错误")
    })
    @GetMapping("/content/hot")
    public Result<ContentListResponseDTO> getHotContent(
            @ApiParam(value = "查询参数") @Valid ContentListRequestDTO request) {
        
        try {
            // 设置Tab类型为热门
            request.setTab("hot");
            
            // 获取当前用户ID（可能为空，未登录用户）
            String currentUserId = SecurityUtils.getCurrentUserId();
            request.setUserId(currentUserId);
            
            log.info("获取热门内容列表，参数：{}", request);
            
            ContentListResponseDTO response = discoverContentService.getContentList(request);
            
            log.info("获取热门内容成功，返回{}条数据", response.getList().size());
            
            return Result.success(response);
            
        } catch (Exception e) {
            log.error("获取热门内容失败", e);
            return Result.error("获取热门内容失败：" + e.getMessage());
        }
    }

    /**
     * 获取关注用户内容列表
     * 
     * @param request 请求参数
     * @return 内容列表响应
     */
    @ApiOperation(value = "获取关注用户内容列表", notes = "获取已关注用户发布的内容，需要登录")
    @ApiResponses({
        @ApiResponse(code = 200, message = "成功"),
        @ApiResponse(code = 401, message = "未登录"),
        @ApiResponse(code = 400, message = "参数错误"),
        @ApiResponse(code = 500, message = "服务器内部错误")
    })
    @GetMapping("/content/follow")
    public Result<ContentListResponseDTO> getFollowContent(
            @ApiParam(value = "查询参数") @Valid ContentListRequestDTO request) {
        
        try {
            // 设置Tab类型为关注
            request.setTab("follow");
            
            // 获取当前用户ID（必须登录）
            String currentUserId = SecurityUtils.getCurrentUserIdRequired();
            request.setUserId(currentUserId);
            
            log.info("获取关注内容列表，用户：{}，参数：{}", currentUserId, request);
            
            ContentListResponseDTO response = discoverContentService.getContentList(request);
            
            log.info("获取关注内容成功，返回{}条数据", response.getList().size());
            
            return Result.success(response);
            
        } catch (SecurityException e) {
            log.warn("获取关注内容失败：用户未登录");
            return Result.error(401, "请先登录");
        } catch (Exception e) {
            log.error("获取关注内容失败", e);
            return Result.error("获取关注内容失败：" + e.getMessage());
        }
    }

    /**
     * 获取同城内容列表
     * 
     * @param request 请求参数
     * @return 内容列表响应
     */
    @ApiOperation(value = "获取同城内容列表", notes = "获取基于地理位置的本地内容")
    @ApiResponses({
        @ApiResponse(code = 200, message = "成功"),
        @ApiResponse(code = 400, message = "参数错误，缺少位置信息"),
        @ApiResponse(code = 500, message = "服务器内部错误")
    })
    @GetMapping("/content/local")
    public Result<ContentListResponseDTO> getLocalContent(
            @ApiParam(value = "查询参数") @Valid ContentListRequestDTO request) {
        
        try {
            // 设置Tab类型为同城
            request.setTab("local");
            
            // 验证位置信息
            if (request.getLatitude() == null || request.getLongitude() == null) {
                return Result.error(400, "获取同城内容需要提供位置信息");
            }
            
            // 获取当前用户ID（可能为空）
            String currentUserId = SecurityUtils.getCurrentUserId();
            request.setUserId(currentUserId);
            
            log.info("获取同城内容列表，位置：{},{}, 参数：{}", 
                    request.getLatitude(), request.getLongitude(), request);
            
            ContentListResponseDTO response = discoverContentService.getContentList(request);
            
            log.info("获取同城内容成功，返回{}条数据", response.getList().size());
            
            return Result.success(response);
            
        } catch (Exception e) {
            log.error("获取同城内容失败", e);
            return Result.error("获取同城内容失败：" + e.getMessage());
        }
    }

    /**
     * 用户互动操作（点赞、收藏）
     * 
     * @param request 互动请求参数
     * @return 互动结果
     */
    @ApiOperation(value = "用户互动操作", notes = "处理用户的点赞、收藏等互动操作")
    @ApiResponses({
        @ApiResponse(code = 200, message = "操作成功"),
        @ApiResponse(code = 401, message = "未登录"),
        @ApiResponse(code = 400, message = "参数错误"),
        @ApiResponse(code = 404, message = "内容不存在"),
        @ApiResponse(code = 500, message = "服务器内部错误")
    })
    @PostMapping("/interaction/like")
    public Result<UserInteractionResponseDTO> likeContent(
            @ApiParam(value = "互动请求参数") @Valid @RequestBody UserInteractionRequestDTO request) {
        
        try {
            // 获取当前用户ID（必须登录）
            String currentUserId = SecurityUtils.getCurrentUserIdRequired();
            
            log.info("用户互动操作，用户：{}，内容：{}，操作：{}", 
                    currentUserId, request.getContentId(), request.getAction());
            
            UserInteractionResponseDTO response = discoverInteractionService
                    .handleUserInteraction(currentUserId, request);
            
            log.info("用户互动操作成功，新状态：{}，数量：{}", 
                    response.getNewState(), response.getCount());
            
            return Result.success(response);
            
        } catch (SecurityException e) {
            log.warn("用户互动失败：用户未登录");
            return Result.error(401, "请先登录");
        } catch (IllegalArgumentException e) {
            log.warn("用户互动失败：参数错误 - {}", e.getMessage());
            return Result.error(400, e.getMessage());
        } catch (Exception e) {
            log.error("用户互动操作失败", e);
            return Result.error("互动操作失败：" + e.getMessage());
        }
    }

    /**
     * 收藏操作
     * 前端需要：长按菜单中的收藏功能
     * 
     * @param request 收藏请求参数
     * @return 收藏结果
     */
    @ApiOperation(value = "收藏操作", notes = "收藏或取消收藏内容")
    @PostMapping("/interaction/collect")
    public Result<UserInteractionResponseDTO> collectContent(
            @ApiParam(value = "收藏请求参数") @Valid @RequestBody UserInteractionRequestDTO request) {
        
        try {
            // 获取当前用户ID（必须登录）
            String currentUserId = SecurityUtils.getCurrentUserIdRequired();
            
            log.info("收藏操作，用户：{}，内容：{}，操作：{}", 
                    currentUserId, request.getContentId(), request.getAction());
            
            UserInteractionResponseDTO response = discoverInteractionService
                    .handleUserInteraction(currentUserId, request);
            
            return Result.success(response);
            
        } catch (SecurityException e) {
            return Result.error(401, "请先登录");
        } catch (Exception e) {
            log.error("收藏操作失败", e);
            return Result.error("收藏操作失败：" + e.getMessage());
        }
    }

    /**
     * 关注/取消关注用户
     * 
     * @param request 关注请求参数
     * @return 关注结果
     */
    @ApiOperation(value = "关注用户", notes = "关注或取消关注用户")
    @ApiResponses({
        @ApiResponse(code = 200, message = "操作成功"),
        @ApiResponse(code = 401, message = "未登录"),
        @ApiResponse(code = 400, message = "不能关注自己"),
        @ApiResponse(code = 404, message = "用户不存在"),
        @ApiResponse(code = 500, message = "服务器内部错误")
    })
    @PostMapping("/user/follow")
    public Result<UserInteractionResponseDTO> followUser(
            @ApiParam(value = "关注请求参数") @Valid @RequestBody FollowUserRequestDTO request) {
        
        try {
            // 获取当前用户ID（必须登录）
            String currentUserId = SecurityUtils.getCurrentUserIdRequired();
            
            // 不能关注自己
            if (currentUserId.equals(request.getUserId())) {
                return Result.error(400, "不能关注自己");
            }
            
            log.info("关注操作，当前用户：{}，目标用户：{}，操作：{}", 
                    currentUserId, request.getUserId(), request.getAction());
            
            UserInteractionResponseDTO response = discoverInteractionService
                    .handleFollowUser(currentUserId, request);
            
            log.info("关注操作成功，新状态：{}，粉丝数：{}", 
                    response.getNewState(), response.getCount());
            
            return Result.success(response);
            
        } catch (SecurityException e) {
            log.warn("关注操作失败：用户未登录");
            return Result.error(401, "请先登录");
        } catch (IllegalArgumentException e) {
            log.warn("关注操作失败：参数错误 - {}", e.getMessage());
            return Result.error(400, e.getMessage());
        } catch (Exception e) {
            log.error("关注操作失败", e);
            return Result.error("关注操作失败：" + e.getMessage());
        }
    }

    // 移除过度设计的接口 - 前端同城Tab的位置信息在查询参数中传递，不需要单独的位置更新接口
    // 移除批量获取内容详情 - 前端是逐个查看，不需要批量接口
    // 移除获取用户信息接口 - 用户信息已包含在内容列表的author字段中

    /**
     * 健康检查接口
     * 
     * @return 服务状态
     */
    @ApiOperation(value = "健康检查", notes = "检查发现模块服务状态")
    @GetMapping("/health")
    public Result<String> healthCheck() {
        return Result.success("发现模块服务正常");
    }
}
