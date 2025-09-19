/**
 * 瀑布流卡片点赞业务服务
 * 基于通用组件架构核心标准 - 后端交互层
 * 使用 QueryWrapper 进行数据库操作
 * 
 * @version 2.0.0
 * @author 架构团队
 */

package com.xiangyu.waterfall.service;

import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.baomidou.mybatisplus.core.conditions.update.UpdateWrapper;
import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.xiangyu.waterfall.entity.WaterfallCardLike;
import com.xiangyu.waterfall.mapper.WaterfallCardLikeMapper;
import com.xiangyu.waterfall.dto.WaterfallCardLikeDTO.*;
import com.xiangyu.waterfall.controller.WaterfallCardLikeController.*;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.*;
import java.util.stream.Collectors;

/**
 * 瀑布流卡片点赞业务服务
 * 使用 QueryWrapper 实现所有数据库操作
 */
@Slf4j
@Service
@Transactional
public class WaterfallCardLikeService {

    @Autowired
    private WaterfallCardLikeMapper waterfallCardLikeMapper;
    
    @Autowired
    private RedisTemplate<String, Object> redisTemplate;

    // Redis 缓存键前缀
    private static final String CACHE_PREFIX = "waterfall:like:";
    private static final String CONTENT_LIKE_COUNT_KEY = CACHE_PREFIX + "count:";
    private static final String USER_LIKE_STATUS_KEY = CACHE_PREFIX + "user:";
    private static final int CACHE_EXPIRE_HOURS = 24;

    // =====================================================
    // 核心点赞业务方法
    // =====================================================

    /**
     * 点赞或取消点赞内容
     */
    public LikeResponse toggleLike(LikeRequest request) {
        log.info("处理点赞操作: contentId={}, action={}", request.getContentId(), request.getAction());
        
        try {
            // 1. 获取当前用户ID (实际项目中从安全上下文获取)
            Long currentUserId = getCurrentUserId();
            
            // 2. 查询现有点赞记录
            QueryWrapper<WaterfallCardLike> queryWrapper = new QueryWrapper<WaterfallCardLike>()
                    .eq("content_id", request.getContentId())
                    .eq("user_id", currentUserId)
                    .eq("deleted_at", null);
                    
            WaterfallCardLike existingLike = waterfallCardLikeMapper.selectOne(queryWrapper);
            
            // 3. 根据操作类型处理
            boolean isLiked;
            if ("like".equals(request.getAction())) {
                isLiked = handleLikeAction(request, existingLike, currentUserId);
            } else {
                isLiked = handleUnlikeAction(request, existingLike, currentUserId);
            }
            
            // 4. 更新缓存
            updateLikeCache(request.getContentId(), currentUserId, isLiked);
            
            // 5. 获取最新点赞数
            Integer likeCount = getContentLikeCount(request.getContentId());
            
            // 6. 构建响应
            return LikeResponse.builder()
                    .contentId(request.getContentId())
                    .isLiked(isLiked)
                    .likeCount(likeCount)
                    .likeId(existingLike != null ? existingLike.getUuid() : null)
                    .operationTime(LocalDateTime.now())
                    .userInfo(buildUserInfo(currentUserId))
                    .build();
                    
        } catch (Exception e) {
            log.error("点赞操作失败: contentId={}, action={}, error={}", 
                    request.getContentId(), request.getAction(), e.getMessage(), e);
            throw new RuntimeException("点赞操作失败: " + e.getMessage(), e);
        }
    }

    /**
     * 处理点赞操作
     */
    private boolean handleLikeAction(LikeRequest request, WaterfallCardLike existingLike, Long userId) {
        if (existingLike == null) {
            // 创建新的点赞记录
            WaterfallCardLike newLike = WaterfallCardLike.builder()
                    .uuid(generateUUID())
                    .contentId(request.getContentId())
                    .userId(userId)
                    .likeStatus(WaterfallCardLike.LikeStatus.LIKED)
                    .sourceTab(request.getSourceTab())
                    .sourceIndex(request.getSourceIndex())
                    .clientTimestamp(request.getClientTimestamp())
                    .deviceInfo(request.getDeviceInfo())
                    .ipAddress(getClientIpAddress())
                    .userAgent(getClientUserAgent())
                    .locationInfo(convertLocationInfoToJson(request.getLocationInfo()))
                    .extraData(request.getExtraData())
                    .createdAt(LocalDateTime.now())
                    .updatedAt(LocalDateTime.now())
                    .createdBy(userId)
                    .updatedBy(userId)
                    .version(1)
                    .build();
                    
            waterfallCardLikeMapper.insert(newLike);
            log.info("创建新点赞记录: contentId={}, userId={}", request.getContentId(), userId);
            return true;
            
        } else if (!existingLike.isLiked()) {
            // 更新现有记录为点赞状态
            UpdateWrapper<WaterfallCardLike> updateWrapper = new UpdateWrapper<WaterfallCardLike>()
                    .eq("id", existingLike.getId())
                    .set("like_status", WaterfallCardLike.LikeStatus.LIKED)
                    .set("client_timestamp", request.getClientTimestamp())
                    .set("device_info", request.getDeviceInfo())
                    .set("updated_at", LocalDateTime.now())
                    .set("updated_by", userId);
                    
            waterfallCardLikeMapper.update(null, updateWrapper);
            log.info("更新点赞状态: contentId={}, userId={}, liked=true", request.getContentId(), userId);
            return true;
            
        } else {
            // 已经是点赞状态，无需操作
            log.info("内容已点赞: contentId={}, userId={}", request.getContentId(), userId);
            return true;
        }
    }

    /**
     * 处理取消点赞操作
     */
    private boolean handleUnlikeAction(LikeRequest request, WaterfallCardLike existingLike, Long userId) {
        if (existingLike != null && existingLike.isLiked()) {
            // 更新现有记录为取消点赞状态
            UpdateWrapper<WaterfallCardLike> updateWrapper = new UpdateWrapper<WaterfallCardLike>()
                    .eq("id", existingLike.getId())
                    .set("like_status", WaterfallCardLike.LikeStatus.UNLIKED)
                    .set("client_timestamp", request.getClientTimestamp())
                    .set("device_info", request.getDeviceInfo())
                    .set("updated_at", LocalDateTime.now())
                    .set("updated_by", userId);
                    
            waterfallCardLikeMapper.update(null, updateWrapper);
            log.info("更新点赞状态: contentId={}, userId={}, liked=false", request.getContentId(), userId);
            return false;
            
        } else {
            // 没有点赞记录或已经是取消点赞状态
            log.info("内容未点赞或已取消: contentId={}, userId={}", request.getContentId(), userId);
            return false;
        }
    }

    /**
     * 批量点赞操作
     */
    public BatchLikeResponse batchToggleLike(BatchLikeRequest request) {
        log.info("处理批量点赞操作: batchId={}, actionCount={}", 
                request.getBatchId(), request.getActions().size());
        
        List<BatchLikeResult> results = new ArrayList<>();
        int successCount = 0;
        int failureCount = 0;
        
        for (BatchLikeAction action : request.getActions()) {
            try {
                // 构建单个点赞请求
                LikeRequest likeRequest = LikeRequest.builder()
                        .contentId(action.getContentId())
                        .action(action.getAction())
                        .sourceIndex(action.getSourceIndex())
                        .clientTimestamp(request.getClientTimestamp())
                        .build();
                
                // 执行点赞操作
                LikeResponse likeResponse = toggleLike(likeRequest);
                
                // 构建批量结果
                results.add(BatchLikeResult.builder()
                        .contentId(action.getContentId())
                        .success(true)
                        .isLiked(likeResponse.getIsLiked())
                        .likeCount(likeResponse.getLikeCount())
                        .build());
                
                successCount++;
                
            } catch (Exception e) {
                log.error("批量点赞单个操作失败: contentId={}, action={}, error={}", 
                        action.getContentId(), action.getAction(), e.getMessage());
                
                results.add(BatchLikeResult.builder()
                        .contentId(action.getContentId())
                        .success(false)
                        .isLiked(false)
                        .likeCount(0)
                        .error(e.getMessage())
                        .build());
                
                failureCount++;
            }
        }
        
        return BatchLikeResponse.builder()
                .batchId(request.getBatchId())
                .results(results)
                .successCount(successCount)
                .failureCount(failureCount)
                .operationTime(LocalDateTime.now())
                .build();
    }

    // =====================================================
    // 查询业务方法
    // =====================================================

    /**
     * 获取内容点赞状态
     */
    public LikeStatusResponse getLikeStatus(LikeStatusRequest request) {
        log.info("查询点赞状态: contentIds={}, includeDetails={}", 
                request.getContentIds(), request.getIncludeDetails());
        
        Long currentUserId = getCurrentUserId();
        List<ContentLikeStatus> likeStatuses = new ArrayList<>();
        
        for (String contentId : request.getContentIds()) {
            try {
                // 查询用户对该内容的点赞状态
                QueryWrapper<WaterfallCardLike> queryWrapper = new QueryWrapper<WaterfallCardLike>()
                        .eq("content_id", contentId)
                        .eq("user_id", currentUserId)
                        .eq("like_status", WaterfallCardLike.LikeStatus.LIKED)
                        .eq("deleted_at", null)
                        .orderByDesc("updated_at")
                        .last("LIMIT 1");
                
                WaterfallCardLike userLike = waterfallCardLikeMapper.selectOne(queryWrapper);
                boolean isLiked = userLike != null;
                
                // 获取总点赞数
                Integer likeCount = getContentLikeCount(contentId);
                
                // 构建状态对象
                ContentLikeStatus.ContentLikeStatusBuilder statusBuilder = ContentLikeStatus.builder()
                        .contentId(contentId)
                        .isLiked(isLiked)
                        .likeCount(likeCount)
                        .lastLikeTime(userLike != null ? userLike.getUpdatedAt() : null);
                
                // 如果需要详细信息
                if (request.getIncludeDetails()) {
                    ContentDetail contentDetail = getContentDetail(contentId);
                    statusBuilder.contentDetail(contentDetail);
                }
                
                likeStatuses.add(statusBuilder.build());
                
            } catch (Exception e) {
                log.error("查询单个内容点赞状态失败: contentId={}, error={}", contentId, e.getMessage());
                
                // 添加默认状态
                likeStatuses.add(ContentLikeStatus.builder()
                        .contentId(contentId)
                        .isLiked(false)
                        .likeCount(0)
                        .build());
            }
        }
        
        return LikeStatusResponse.builder()
                .likeStatuses(likeStatuses)
                .queryTime(LocalDateTime.now())
                .build();
    }

    /**
     * 获取单个内容点赞状态
     */
    public ContentLikeStatus getSingleLikeStatus(String contentId) {
        log.info("查询单个内容点赞状态: contentId={}", contentId);
        
        Long currentUserId = getCurrentUserId();
        
        // 查询用户点赞状态
        QueryWrapper<WaterfallCardLike> queryWrapper = new QueryWrapper<WaterfallCardLike>()
                .eq("content_id", contentId)
                .eq("user_id", currentUserId)
                .eq("like_status", WaterfallCardLike.LikeStatus.LIKED)
                .eq("deleted_at", null)
                .orderByDesc("updated_at")
                .last("LIMIT 1");
        
        WaterfallCardLike userLike = waterfallCardLikeMapper.selectOne(queryWrapper);
        boolean isLiked = userLike != null;
        
        // 获取总点赞数
        Integer likeCount = getContentLikeCount(contentId);
        
        return ContentLikeStatus.builder()
                .contentId(contentId)
                .isLiked(isLiked)
                .likeCount(likeCount)
                .lastLikeTime(userLike != null ? userLike.getUpdatedAt() : null)
                .build();
    }

    /**
     * 获取用户点赞历史
     */
    public PageResponse<LikeHistoryResponse> getLikeHistory(LikeHistoryRequest request) {
        log.info("查询用户点赞历史: userId={}, contentType={}, sourceTab={}, current={}, size={}", 
                request.getUserId(), request.getContentType(), request.getSourceTab(), 
                request.getCurrent(), request.getSize());
        
        // 如果没有指定用户ID，使用当前用户
        Long targetUserId = request.getUserId() != null ? request.getUserId() : getCurrentUserId();
        
        // 构建查询条件
        QueryWrapper<WaterfallCardLike> queryWrapper = new QueryWrapper<WaterfallCardLike>()
                .eq("user_id", targetUserId)
                .eq("deleted_at", null);
        
        // 添加可选条件
        if (StringUtils.hasText(request.getContentType())) {
            queryWrapper.eq("content_type", request.getContentType());
        }
        
        if (StringUtils.hasText(request.getSourceTab())) {
            queryWrapper.eq("source_tab", request.getSourceTab());
        }
        
        if (request.getOnlyLiked()) {
            queryWrapper.eq("like_status", WaterfallCardLike.LikeStatus.LIKED);
        }
        
        if (request.getStartTime() != null) {
            queryWrapper.ge("created_at", request.getStartTime());
        }
        
        if (request.getEndTime() != null) {
            queryWrapper.le("created_at", request.getEndTime());
        }
        
        // 排序
        if (request.getIsAsc()) {
            queryWrapper.orderByAsc(request.getOrderBy());
        } else {
            queryWrapper.orderByDesc(request.getOrderBy());
        }
        
        // 分页查询
        Page<WaterfallCardLike> page = new Page<>(request.getCurrent(), request.getSize());
        IPage<WaterfallCardLike> result = waterfallCardLikeMapper.selectPage(page, queryWrapper);
        
        // 转换为响应对象
        List<LikeHistoryResponse> historyList = result.getRecords().stream()
                .map(this::convertToLikeHistoryResponse)
                .collect(Collectors.toList());
        
        return PageResponse.<LikeHistoryResponse>builder()
                .records(historyList)
                .total(result.getTotal())
                .current(result.getCurrent())
                .size(result.getSize())
                .pages(result.getPages())
                .build();
    }

    // =====================================================
    // 统计业务方法
    // =====================================================

    /**
     * 获取内容点赞统计
     */
    public ContentLikeStatistics getContentLikeStatistics(String contentId) {
        log.info("查询内容点赞统计: contentId={}", contentId);
        
        // 总点赞数
        QueryWrapper<WaterfallCardLike> totalWrapper = new QueryWrapper<WaterfallCardLike>()
                .eq("content_id", contentId)
                .eq("like_status", WaterfallCardLike.LikeStatus.LIKED)
                .eq("deleted_at", null);
        Integer totalLikes = waterfallCardLikeMapper.selectCount(totalWrapper);
        
        // 今日点赞数
        LocalDateTime todayStart = LocalDateTime.now().withHour(0).withMinute(0).withSecond(0).withNano(0);
        QueryWrapper<WaterfallCardLike> todayWrapper = new QueryWrapper<WaterfallCardLike>()
                .eq("content_id", contentId)
                .eq("like_status", WaterfallCardLike.LikeStatus.LIKED)
                .eq("deleted_at", null)
                .ge("created_at", todayStart);
        Integer todayLikes = waterfallCardLikeMapper.selectCount(todayWrapper);
        
        // 本周点赞数
        LocalDateTime weekStart = LocalDateTime.now().minusDays(7);
        QueryWrapper<WaterfallCardLike> weekWrapper = new QueryWrapper<WaterfallCardLike>()
                .eq("content_id", contentId)
                .eq("like_status", WaterfallCardLike.LikeStatus.LIKED)
                .eq("deleted_at", null)
                .ge("created_at", weekStart);
        Integer weekLikes = waterfallCardLikeMapper.selectCount(weekWrapper);
        
        // 本月点赞数
        LocalDateTime monthStart = LocalDateTime.now().minusDays(30);
        QueryWrapper<WaterfallCardLike> monthWrapper = new QueryWrapper<WaterfallCardLike>()
                .eq("content_id", contentId)
                .eq("like_status", WaterfallCardLike.LikeStatus.LIKED)
                .eq("deleted_at", null)
                .ge("created_at", monthStart);
        Integer monthLikes = waterfallCardLikeMapper.selectCount(monthWrapper);
        
        // 最后点赞时间
        QueryWrapper<WaterfallCardLike> lastWrapper = new QueryWrapper<WaterfallCardLike>()
                .eq("content_id", contentId)
                .eq("like_status", WaterfallCardLike.LikeStatus.LIKED)
                .eq("deleted_at", null)
                .orderByDesc("created_at")
                .last("LIMIT 1");
        WaterfallCardLike lastLike = waterfallCardLikeMapper.selectOne(lastWrapper);
        
        return ContentLikeStatistics.builder()
                .contentId(contentId)
                .totalLikes(totalLikes)
                .todayLikes(todayLikes)
                .weekLikes(weekLikes)
                .monthLikes(monthLikes)
                .lastLikeTime(lastLike != null ? lastLike.getCreatedAt() : null)
                .build();
    }

    /**
     * 获取用户点赞统计
     */
    public UserLikeStatistics getUserLikeStatistics(Long userId) {
        Long targetUserId = userId != null ? userId : getCurrentUserId();
        
        log.info("查询用户点赞统计: userId={}", targetUserId);
        
        // 总点赞数
        QueryWrapper<WaterfallCardLike> totalWrapper = new QueryWrapper<WaterfallCardLike>()
                .eq("user_id", targetUserId)
                .eq("like_status", WaterfallCardLike.LikeStatus.LIKED)
                .eq("deleted_at", null);
        Integer totalLikes = waterfallCardLikeMapper.selectCount(totalWrapper);
        
        // 今日点赞数
        LocalDateTime todayStart = LocalDateTime.now().withHour(0).withMinute(0).withSecond(0).withNano(0);
        QueryWrapper<WaterfallCardLike> todayWrapper = new QueryWrapper<WaterfallCardLike>()
                .eq("user_id", targetUserId)
                .eq("like_status", WaterfallCardLike.LikeStatus.LIKED)
                .eq("deleted_at", null)
                .ge("created_at", todayStart);
        Integer todayLikes = waterfallCardLikeMapper.selectCount(todayWrapper);
        
        // 本周和本月点赞数（类似上面的逻辑）
        // ... 省略具体实现
        
        return UserLikeStatistics.builder()
                .userId(targetUserId)
                .totalLikes(totalLikes)
                .todayLikes(todayLikes)
                .weekLikes(0) // 简化实现
                .monthLikes(0) // 简化实现
                .build();
    }

    // =====================================================
    // 管理业务方法
    // =====================================================

    /**
     * 删除点赞记录
     */
    public Boolean deleteLikeRecord(String likeId) {
        log.info("删除点赞记录: likeId={}", likeId);
        
        UpdateWrapper<WaterfallCardLike> updateWrapper = new UpdateWrapper<WaterfallCardLike>()
                .eq("uuid", likeId)
                .set("deleted_at", LocalDateTime.now())
                .set("updated_at", LocalDateTime.now());
        
        int updated = waterfallCardLikeMapper.update(null, updateWrapper);
        return updated > 0;
    }

    /**
     * 清理用户点赞历史
     */
    public Integer cleanupUserLikeHistory(Long userId, Integer keepDays) {
        Long targetUserId = userId != null ? userId : getCurrentUserId();
        
        log.info("清理用户点赞历史: userId={}, keepDays={}", targetUserId, keepDays);
        
        LocalDateTime cutoffTime = LocalDateTime.now().minusDays(keepDays);
        
        UpdateWrapper<WaterfallCardLike> updateWrapper = new UpdateWrapper<WaterfallCardLike>()
                .eq("user_id", targetUserId)
                .lt("created_at", cutoffTime)
                .eq("deleted_at", null)
                .set("deleted_at", LocalDateTime.now())
                .set("updated_at", LocalDateTime.now());
        
        return waterfallCardLikeMapper.update(null, updateWrapper);
    }

    // =====================================================
    // 辅助方法
    // =====================================================

    /**
     * 获取内容点赞总数
     */
    private Integer getContentLikeCount(String contentId) {
        // 先尝试从缓存获取
        String cacheKey = CONTENT_LIKE_COUNT_KEY + contentId;
        Object cached = redisTemplate.opsForValue().get(cacheKey);
        
        if (cached != null) {
            return (Integer) cached;
        }
        
        // 从数据库查询
        QueryWrapper<WaterfallCardLike> queryWrapper = new QueryWrapper<WaterfallCardLike>()
                .eq("content_id", contentId)
                .eq("like_status", WaterfallCardLike.LikeStatus.LIKED)
                .eq("deleted_at", null);
        
        Integer count = waterfallCardLikeMapper.selectCount(queryWrapper);
        
        // 缓存结果
        redisTemplate.opsForValue().set(cacheKey, count, 
                java.time.Duration.ofHours(CACHE_EXPIRE_HOURS));
        
        return count;
    }

    /**
     * 更新点赞缓存
     */
    private void updateLikeCache(String contentId, Long userId, boolean isLiked) {
        try {
            // 更新内容点赞数缓存
            String countCacheKey = CONTENT_LIKE_COUNT_KEY + contentId;
            redisTemplate.delete(countCacheKey); // 删除缓存，下次查询时重新计算
            
            // 更新用户点赞状态缓存
            String userCacheKey = USER_LIKE_STATUS_KEY + userId + ":" + contentId;
            redisTemplate.opsForValue().set(userCacheKey, isLiked, 
                    java.time.Duration.ofHours(CACHE_EXPIRE_HOURS));
                    
        } catch (Exception e) {
            log.warn("更新点赞缓存失败: contentId={}, userId={}, error={}", 
                    contentId, userId, e.getMessage());
        }
    }

    /**
     * 转换为点赞历史响应对象
     */
    private LikeHistoryResponse convertToLikeHistoryResponse(WaterfallCardLike like) {
        return LikeHistoryResponse.builder()
                .likeId(like.getUuid())
                .contentId(like.getContentId())
                .contentSummary(getContentSummary(like.getContentId()))
                .isLiked(like.isLiked())
                .operationTime(like.getUpdatedAt())
                .sourceInfo(SourceInfo.builder()
                        .sourceTab(like.getSourceTab())
                        .sourceIndex(like.getSourceIndex())
                        .deviceInfo(like.getDeviceInfo())
                        .build())
                .build();
    }

    /**
     * 获取当前用户ID（模拟实现）
     */
    private Long getCurrentUserId() {
        // 实际项目中应该从 Spring Security 上下文或 JWT Token 中获取
        return 1001L; // 模拟用户ID
    }

    /**
     * 生成UUID
     */
    private String generateUUID() {
        return "like_" + System.currentTimeMillis() + "_" + 
               UUID.randomUUID().toString().replace("-", "").substring(0, 8);
    }

    /**
     * 获取客户端IP地址（模拟实现）
     */
    private String getClientIpAddress() {
        return "192.168.1.100"; // 模拟IP
    }

    /**
     * 获取客户端用户代理（模拟实现）
     */
    private String getClientUserAgent() {
        return "ReactNative/2.0.0"; // 模拟User-Agent
    }

    /**
     * 转换位置信息为JSON字符串
     */
    private String convertLocationInfoToJson(LocationInfo locationInfo) {
        if (locationInfo == null) return null;
        
        try {
            // 使用 Jackson 或其他 JSON 库转换
            return com.fasterxml.jackson.databind.ObjectMapper().writeValueAsString(locationInfo);
        } catch (Exception e) {
            log.warn("转换位置信息为JSON失败: {}", e.getMessage());
            return null;
        }
    }

    /**
     * 构建用户信息
     */
    private UserInfo buildUserInfo(Long userId) {
        return UserInfo.builder()
                .userId(userId)
                .nickname("用户" + userId)
                .avatar("https://example.com/avatar/" + userId)
                .verified(false)
                .level(1)
                .build();
    }

    /**
     * 获取内容详情（模拟实现）
     */
    private ContentDetail getContentDetail(String contentId) {
        return ContentDetail.builder()
                .contentId(contentId)
                .title("内容标题 " + contentId)
                .type("image")
                .thumbnail("https://example.com/thumb/" + contentId)
                .totalLikes(getContentLikeCount(contentId))
                .totalComments(0)
                .createdAt(LocalDateTime.now().minusDays(1))
                .build();
    }

    /**
     * 获取内容摘要（模拟实现）
     */
    private ContentSummary getContentSummary(String contentId) {
        return ContentSummary.builder()
                .contentId(contentId)
                .title("内容标题 " + contentId)
                .type("image")
                .thumbnail("https://example.com/thumb/" + contentId)
                .authorNickname("作者昵称")
                .build();
    }
}
