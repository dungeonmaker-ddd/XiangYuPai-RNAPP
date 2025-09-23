package com.xiangyupai.discover.publish.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;

import com.xiangyupai.discover.publish.entity.*;
import com.xiangyupai.discover.publish.vo.*;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import org.apache.ibatis.annotations.Select;
import org.apache.ibatis.annotations.Update;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

/**
 * 发布动态数据访问接口 - 继承BaseMapper<PublishPost>
 * 
 * 职责：
 * 1. 继承MyBatis-Plus的BaseMapper，获得基础CRUD方法
 * 2. 定义复杂查询的自定义方法
 * 3. 利用MyBatis-Plus内置方法进行数据操作
 * 4. 支持QueryWrapper动态查询
 */
@Mapper
public interface PublishPostMapper extends BaseMapper<PublishPost> {

    /**
     * 根据用户ID查询发布统计
     * 
     * @param userId 用户ID
     * @param startTime 开始时间
     * @param endTime 结束时间
     * @return 统计结果
     */
    @Select("SELECT " +
            "COUNT(*) as total_posts, " +
            "SUM(like_count) as total_likes, " +
            "SUM(comment_count) as total_comments, " +
            "SUM(share_count) as total_shares, " +
            "SUM(view_count) as total_views, " +
            "AVG(hot_score) as avg_hot_score " +
            "FROM publish_post " +
            "WHERE user_id = #{userId} " +
            "AND status = 'published' " +
            "AND deleted = 0 " +
            "AND create_time BETWEEN #{startTime} AND #{endTime}")
    Map<String, Object> getUserPublishStatistics(
        @Param("userId") Long userId,
        @Param("startTime") LocalDateTime startTime,
        @Param("endTime") LocalDateTime endTime);

    /**
     * 查询热门动态（基于热度分数和互动数据）
     * 
     * @param timeWindow 时间窗口（小时）
     * @param limit 限制数量
     * @return 热门动态列表
     */
    @Select("SELECT * FROM publish_post " +
            "WHERE status = 'published' " +
            "AND audit_status = 'approved' " +
            "AND deleted = 0 " +
            "AND create_time >= DATE_SUB(NOW(), INTERVAL #{timeWindow} HOUR) " +
            "ORDER BY (hot_score * 0.4 + like_count * 0.3 + comment_count * 0.2 + share_count * 0.1) DESC " +
            "LIMIT #{limit}")
    List<PublishPost> getHotPosts(@Param("timeWindow") Integer timeWindow, @Param("limit") Integer limit);

    /**
     * 根据地理位置查询附近的动态
     * 
     * @param latitude 纬度
     * @param longitude 经度
     * @param radius 半径（公里）
     * @param page 分页对象
     * @return 附近动态分页结果
     */
    @Select("SELECT p.*, " +
            "(6371 * acos(cos(radians(#{latitude})) * cos(radians(l.latitude)) * " +
            "cos(radians(l.longitude) - radians(#{longitude})) + " +
            "sin(radians(#{latitude})) * sin(radians(l.latitude)))) AS distance " +
            "FROM publish_post p " +
            "INNER JOIN publish_location l ON JSON_EXTRACT(p.location_info, '$.latitude') = l.latitude " +
            "AND JSON_EXTRACT(p.location_info, '$.longitude') = l.longitude " +
            "WHERE p.status = 'published' " +
            "AND p.audit_status = 'approved' " +
            "AND p.deleted = 0 " +
            "AND p.privacy = 'public' " +
            "HAVING distance <= #{radius} " +
            "ORDER BY distance ASC, p.create_time DESC")
    IPage<PublishPost> getNearbyPosts(
        Page<?> page,
        @Param("latitude") Double latitude, 
        @Param("longitude") Double longitude, 
        @Param("radius") Double radius);

    /**
     * 根据话题查询相关动态
     * 
     * @param topicId 话题ID
     * @param page 分页对象
     * @return 话题相关动态
     */
    @Select("SELECT * FROM publish_post " +
            "WHERE status = 'published' " +
            "AND audit_status = 'approved' " +
            "AND deleted = 0 " +
            "AND JSON_CONTAINS(topic_ids, JSON_QUOTE(#{topicId})) " +
            "ORDER BY hot_score DESC, create_time DESC")
    IPage<PublishPost> getPostsByTopic(Page<?> page, @Param("topicId") String topicId);

    /**
     * 更新动态热度分数
     * 
     * @param postId 动态ID
     * @param hotScore 热度分数
     * @return 更新行数
     */
    @Update("UPDATE publish_post SET hot_score = #{hotScore}, update_time = NOW() " +
            "WHERE id = #{postId} AND deleted = 0")
    int updateHotScore(@Param("postId") Long postId, @Param("hotScore") Double hotScore);

    /**
     * 批量更新动态的审核状态
     * 
     * @param postIds 动态ID列表
     * @param auditStatus 审核状态
     * @param auditorId 审核员ID
     * @param auditRemark 审核备注
     * @return 更新行数
     */
    @Update("<script>" +
            "UPDATE publish_post SET " +
            "audit_status = #{auditStatus}, " +
            "auditor_id = #{auditorId}, " +
            "audit_time = NOW(), " +
            "audit_remark = #{auditRemark}, " +
            "update_time = NOW() " +
            "WHERE id IN " +
            "<foreach collection='postIds' item='id' open='(' separator=',' close=')'>" +
            "#{id}" +
            "</foreach>" +
            "</script>")
    int batchUpdateAuditStatus(
        @Param("postIds") List<Long> postIds,
        @Param("auditStatus") String auditStatus,
        @Param("auditorId") Long auditorId,
        @Param("auditRemark") String auditRemark);

    /**
     * 查询待审核的动态数量
     * 
     * @return 待审核数量
     */
    @Select("SELECT COUNT(*) FROM publish_post " +
            "WHERE audit_status = 'pending' " +
            "AND status = 'published' " +
            "AND deleted = 0")
    Long getPendingAuditCount();

    /**
     * 查询用户在指定时间段内的发布数量
     * 
     * @param userId 用户ID
     * @param startTime 开始时间
     * @param endTime 结束时间
     * @return 发布数量
     */
    @Select("SELECT COUNT(*) FROM publish_post " +
            "WHERE user_id = #{userId} " +
            "AND status = 'published' " +
            "AND deleted = 0 " +
            "AND create_time BETWEEN #{startTime} AND #{endTime}")
    Long getUserPostCountInPeriod(
        @Param("userId") Long userId,
        @Param("startTime") LocalDateTime startTime,
        @Param("endTime") LocalDateTime endTime);
}

/**
 * 媒体文件数据访问接口
 */
@Mapper
public interface PublishMediaMapper extends BaseMapper<PublishMedia> {

    /**
     * 根据动态ID查询媒体文件列表
     * 
     * @param postId 动态ID
     * @return 媒体文件列表
     */
    @Select("SELECT * FROM publish_media " +
            "WHERE post_id = #{postId} " +
            "AND deleted = 0 " +
            "ORDER BY sort_order ASC")
    List<PublishMedia> getMediaByPostId(@Param("postId") Long postId);

    /**
     * 根据用户ID查询媒体文件统计
     * 
     * @param userId 用户ID
     * @return 统计结果
     */
    @Select("SELECT " +
            "COUNT(*) as total_count, " +
            "SUM(file_size) as total_size, " +
            "COUNT(CASE WHEN media_type = 'image' THEN 1 END) as image_count, " +
            "COUNT(CASE WHEN media_type = 'video' THEN 1 END) as video_count " +
            "FROM publish_media m " +
            "INNER JOIN publish_post p ON m.post_id = p.id " +
            "WHERE p.user_id = #{userId} " +
            "AND m.deleted = 0 " +
            "AND p.deleted = 0")
    Map<String, Object> getUserMediaStatistics(@Param("userId") Long userId);

    /**
     * 清理未关联的媒体文件
     * 
     * @param days 天数
     * @return 清理数量
     */
    @Update("UPDATE publish_media SET deleted = 1, update_time = NOW() " +
            "WHERE post_id IS NULL " +
            "AND upload_status != 'completed' " +
            "AND create_time < DATE_SUB(NOW(), INTERVAL #{days} DAY)")
    int cleanupUnusedMedia(@Param("days") Integer days);

    /**
     * 批量更新媒体文件的动态关联
     * 
     * @param mediaIds 媒体ID列表
     * @param postId 动态ID
     * @return 更新行数
     */
    @Update("<script>" +
            "UPDATE publish_media SET " +
            "post_id = #{postId}, " +
            "upload_status = 'completed', " +
            "update_time = NOW() " +
            "WHERE id IN " +
            "<foreach collection='mediaIds' item='id' open='(' separator=',' close=')'>" +
            "#{id}" +
            "</foreach>" +
            "</script>")
    int batchUpdatePostRelation(@Param("mediaIds") List<Long> mediaIds, @Param("postId") Long postId);
}

/**
 * 话题数据访问接口
 */
@Mapper
public interface PublishTopicMapper extends BaseMapper<PublishTopic> {

    /**
     * 搜索话题（支持模糊搜索）
     * 
     * @param keyword 关键词
     * @param category 分类
     * @param page 分页对象
     * @return 话题分页结果
     */
    @Select("SELECT * FROM publish_topic " +
            "WHERE status = 'active' " +
            "AND deleted = 0 " +
            "AND (topic_name LIKE CONCAT('%', #{keyword}, '%') " +
            "OR description LIKE CONCAT('%', #{keyword}, '%')) " +
            "AND (#{category} IS NULL OR category = #{category}) " +
            "ORDER BY hot_score DESC, participant_count DESC")
    IPage<PublishTopic> searchTopics(
        Page<?> page,
        @Param("keyword") String keyword, 
        @Param("category") String category);

    /**
     * 获取热门话题
     * 
     * @param limit 限制数量
     * @return 热门话题列表
     */
    @Select("SELECT * FROM publish_topic " +
            "WHERE status = 'active' " +
            "AND deleted = 0 " +
            "AND is_hot = 1 " +
            "ORDER BY hot_score DESC, participant_count DESC " +
            "LIMIT #{limit}")
    List<PublishTopic> getHotTopics(@Param("limit") Integer limit);

    /**
     * 根据分类获取话题
     * 
     * @param category 分类
     * @param page 分页对象
     * @return 话题分页结果
     */
    @Select("SELECT * FROM publish_topic " +
            "WHERE status = 'active' " +
            "AND deleted = 0 " +
            "AND category = #{category} " +
            "ORDER BY post_count DESC, hot_score DESC")
    IPage<PublishTopic> getTopicsByCategory(Page<?> page, @Param("category") String category);

    /**
     * 更新话题统计数据
     * 
     * @param topicId 话题ID
     * @return 更新行数
     */
    @Update("UPDATE publish_topic SET " +
            "post_count = (SELECT COUNT(*) FROM publish_post " +
            "WHERE JSON_CONTAINS(topic_ids, JSON_QUOTE(#{topicId})) " +
            "AND status = 'published' AND deleted = 0), " +
            "participant_count = (SELECT COUNT(DISTINCT user_id) FROM publish_post " +
            "WHERE JSON_CONTAINS(topic_ids, JSON_QUOTE(#{topicId})) " +
            "AND status = 'published' AND deleted = 0), " +
            "update_time = NOW() " +
            "WHERE id = #{topicId}")
    int updateTopicStatistics(@Param("topicId") Long topicId);

    /**
     * 批量更新话题热度分数
     * 
     * @return 更新行数
     */
    @Update("UPDATE publish_topic SET " +
            "hot_score = (post_count * 0.4 + participant_count * 0.6), " +
            "is_hot = CASE WHEN (post_count * 0.4 + participant_count * 0.6) > 80 THEN 1 ELSE 0 END, " +
            "update_time = NOW() " +
            "WHERE status = 'active' AND deleted = 0")
    int batchUpdateHotScore();
}

/**
 * 地点数据访问接口
 */
@Mapper
public interface PublishLocationMapper extends BaseMapper<PublishLocation> {

    /**
     * 根据关键词搜索地点
     * 
     * @param keyword 关键词
     * @param page 分页对象
     * @return 地点分页结果
     */
    @Select("SELECT * FROM publish_location " +
            "WHERE deleted = 0 " +
            "AND (poi_name LIKE CONCAT('%', #{keyword}, '%') " +
            "OR address LIKE CONCAT('%', #{keyword}, '%')) " +
            "ORDER BY usage_count DESC")
    IPage<PublishLocation> searchLocations(Page<?> page, @Param("keyword") String keyword);

    /**
     * 查询指定范围内的地点
     * 
     * @param latitude 纬度
     * @param longitude 经度
     * @param radius 半径（公里）
     * @param limit 限制数量
     * @return 附近地点列表
     */
    @Select("SELECT *, " +
            "(6371 * acos(cos(radians(#{latitude})) * cos(radians(latitude)) * " +
            "cos(radians(longitude) - radians(#{longitude})) + " +
            "sin(radians(#{latitude})) * sin(radians(latitude)))) AS distance " +
            "FROM publish_location " +
            "WHERE deleted = 0 " +
            "HAVING distance <= #{radius} " +
            "ORDER BY distance ASC, usage_count DESC " +
            "LIMIT #{limit}")
    List<Map<String, Object>> getNearbyLocations(
        @Param("latitude") Double latitude,
        @Param("longitude") Double longitude,
        @Param("radius") Double radius,
        @Param("limit") Integer limit);

    /**
     * 获取热门地点
     * 
     * @param limit 限制数量
     * @return 热门地点列表
     */
    @Select("SELECT * FROM publish_location " +
            "WHERE deleted = 0 " +
            "AND usage_count > 0 " +
            "ORDER BY usage_count DESC " +
            "LIMIT #{limit}")
    List<PublishLocation> getHotLocations(@Param("limit") Integer limit);

    /**
     * 根据城市获取地点
     * 
     * @param city 城市
     * @param page 分页对象
     * @return 地点分页结果
     */
    @Select("SELECT * FROM publish_location " +
            "WHERE deleted = 0 " +
            "AND city = #{city} " +
            "ORDER BY usage_count DESC")
    IPage<PublishLocation> getLocationsByCity(Page<?> page, @Param("city") String city);

    /**
     * 清理低使用率的地点
     * 
     * @param minUsageCount 最小使用次数
     * @param days 天数
     * @return 清理数量
     */
    @Update("UPDATE publish_location SET deleted = 1, update_time = NOW() " +
            "WHERE usage_count < #{minUsageCount} " +
            "AND create_time < DATE_SUB(NOW(), INTERVAL #{days} DAY)")
    int cleanupLowUsageLocations(@Param("minUsageCount") Integer minUsageCount, @Param("days") Integer days);
}
