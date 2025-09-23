/**
 * 话题详情数据访问接口 - 继承BaseMapper，使用MyBatis-Plus内置方法
 * 
 * TOC (快速跳转):
 * [1] Imports
 * [2] Mapper Interface Definitions  
 * [3] Topic Related Mappers
 * [4] Post Related Mappers
 * [5] User Related Mappers
 * [6] Interaction Related Mappers
 * [7] Custom Query Methods
 * [8] Statistical Query Methods
 */

// #region 1. Imports
package com.xiangyupai.pages.discover.topicdetail.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;

import com.xiangyupai.pages.discover.topicdetail.entity.*;

import org.apache.ibatis.annotations.*;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
// #endregion

// #region 2. Mapper Interface Definitions

// #region 3. Topic Related Mappers

/**
 * 话题信息数据访问接口
 * 继承BaseMapper，自动获得CRUD方法
 */
@Repository
@Mapper
public interface TopicMapper extends BaseMapper<TopicEntity> {
    
    /**
     * 根据话题名称查询话题信息
     * 
     * @param topicName 话题名称
     * @return 话题实体
     */
    @Select("SELECT * FROM xp_topic WHERE topic_name = #{topicName} AND topic_status = 1 AND is_deleted IS NULL")
    TopicEntity selectByTopicName(@Param("topicName") String topicName);
    
    /**
     * 批量查询话题信息
     * 
     * @param topicIds 话题ID列表
     * @return 话题实体列表
     */
    @Select("<script>" +
            "SELECT * FROM xp_topic WHERE topic_id IN " +
            "<foreach collection='topicIds' item='topicId' open='(' separator=',' close=')'>" +
            "#{topicId}" +
            "</foreach>" +
            " AND topic_status = 1 AND is_deleted IS NULL" +
            "</script>")
    List<TopicEntity> selectByTopicIds(@Param("topicIds") List<String> topicIds);
    
    /**
     * 更新话题统计信息
     * 
     * @param topicId 话题ID
     * @param postCount 动态数量
     * @param participantCount 参与用户数
     * @param hotnessScore 热度分数
     * @return 更新行数
     */
    @Update("UPDATE xp_topic SET " +
            "post_count = #{postCount}, " +
            "participant_count = #{participantCount}, " +
            "hotness_score = #{hotnessScore}, " +
            "updated_at = #{updatedAt} " +
            "WHERE topic_id = #{topicId}")
    int updateTopicStats(@Param("topicId") String topicId,
                        @Param("postCount") Integer postCount,
                        @Param("participantCount") Integer participantCount,
                        @Param("hotnessScore") Integer hotnessScore,
                        @Param("updatedAt") LocalDateTime updatedAt);
    
    /**
     * 获取热门话题列表
     * 
     * @param limit 返回数量限制
     * @return 热门话题列表
     */
    @Select("SELECT * FROM xp_topic " +
            "WHERE topic_status = 1 AND is_deleted IS NULL " +
            "ORDER BY hotness_score DESC, post_count DESC " +
            "LIMIT #{limit}")
    List<TopicEntity> selectHotTopics(@Param("limit") Integer limit);
}

/**
 * 话题关注数据访问接口
 */
@Repository
@Mapper
public interface TopicFollowMapper extends BaseMapper<TopicFollowEntity> {
    
    /**
     * 查询用户关注的话题列表
     * 
     * @param userId 用户ID
     * @param page 分页参数
     * @return 分页结果
     */
    @Select("SELECT t.* FROM xp_topic t " +
            "INNER JOIN xp_topic_follow tf ON t.topic_id = tf.topic_id " +
            "WHERE tf.user_id = #{userId} AND tf.follow_status = 1 " +
            "AND t.topic_status = 1 AND t.is_deleted IS NULL " +
            "ORDER BY tf.created_at DESC")
    IPage<TopicEntity> selectFollowedTopics(@Param("userId") String userId, Page<?> page);
    
    /**
     * 获取话题的关注用户数量
     * 
     * @param topicId 话题ID
     * @return 关注用户数量
     */
    @Select("SELECT COUNT(*) FROM xp_topic_follow " +
            "WHERE topic_id = #{topicId} AND follow_status = 1")
    Long countTopicFollowers(@Param("topicId") String topicId);
}

/**
 * 话题关注实体类（补充定义）
 */
// 注意：这个实体类应该在entity文件中定义，这里仅作为示例
class TopicFollowEntity {
    private String followId;
    private String topicId;
    private String userId;
    private Integer followStatus;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    
    // getters and setters...
}
// #endregion

// #region 4. Post Related Mappers

/**
 * 话题动态数据访问接口
 */
@Repository
@Mapper
public interface TopicPostMapper extends BaseMapper<TopicPostEntity> {
    
    /**
     * 根据话题ID分页查询动态列表（带用户信息）
     * 
     * @param topicId 话题ID
     * @param page 分页参数
     * @return 分页结果
     */
    @Select("SELECT p.*, u.nickname, u.avatar_url, u.user_level, u.verified_status, u.user_badges " +
            "FROM xp_topic_post p " +
            "LEFT JOIN xp_user u ON p.user_id = u.user_id " +
            "WHERE p.topic_id = #{topicId} AND p.post_status = 1 AND p.is_deleted IS NULL " +
            "AND (u.user_status = 1 AND u.is_deleted IS NULL) " +
            "ORDER BY p.created_at DESC")
    IPage<Map<String, Object>> selectTopicPostsWithUser(@Param("topicId") String topicId, Page<?> page);
    
    /**
     * 查询热门动态（按互动数量排序）
     * 
     * @param topicId 话题ID
     * @param page 分页参数
     * @return 分页结果
     */
    @Select("SELECT p.*, u.nickname, u.avatar_url, u.user_level, u.verified_status, u.user_badges, " +
            "(p.like_count * 0.6 + p.comment_count * 0.3 + p.share_count * 0.1) as hot_score " +
            "FROM xp_topic_post p " +
            "LEFT JOIN xp_user u ON p.user_id = u.user_id " +
            "WHERE p.topic_id = #{topicId} AND p.post_status = 1 AND p.is_deleted IS NULL " +
            "AND (u.user_status = 1 AND u.is_deleted IS NULL) " +
            "ORDER BY hot_score DESC, p.created_at DESC")
    IPage<Map<String, Object>> selectHotTopicPosts(@Param("topicId") String topicId, Page<?> page);
    
    /**
     * 查询用户在话题下的动态数量
     * 
     * @param topicId 话题ID
     * @param userId 用户ID
     * @return 动态数量
     */
    @Select("SELECT COUNT(*) FROM xp_topic_post " +
            "WHERE topic_id = #{topicId} AND user_id = #{userId} " +
            "AND post_status = 1 AND is_deleted IS NULL")
    Long countUserPostsInTopic(@Param("topicId") String topicId, @Param("userId") String userId);
    
    /**
     * 获取话题下的动态统计信息
     * 
     * @param topicId 话题ID
     * @return 统计信息
     */
    @Select("SELECT " +
            "COUNT(*) as total_posts, " +
            "COUNT(DISTINCT user_id) as unique_users, " +
            "SUM(like_count) as total_likes, " +
            "SUM(comment_count) as total_comments, " +
            "SUM(share_count) as total_shares, " +
            "SUM(view_count) as total_views " +
            "FROM xp_topic_post " +
            "WHERE topic_id = #{topicId} AND post_status = 1 AND is_deleted IS NULL")
    Map<String, Object> selectTopicPostStats(@Param("topicId") String topicId);
    
    /**
     * 搜索话题动态
     * 
     * @param topicId 话题ID
     * @param keyword 搜索关键词
     * @param page 分页参数
     * @return 搜索结果
     */
    @Select("SELECT p.*, u.nickname, u.avatar_url, u.user_level, u.verified_status, u.user_badges " +
            "FROM xp_topic_post p " +
            "LEFT JOIN xp_user u ON p.user_id = u.user_id " +
            "WHERE p.topic_id = #{topicId} AND p.post_status = 1 AND p.is_deleted IS NULL " +
            "AND (u.user_status = 1 AND u.is_deleted IS NULL) " +
            "AND (p.post_title LIKE CONCAT('%', #{keyword}, '%') " +
            "     OR p.post_content LIKE CONCAT('%', #{keyword}, '%')) " +
            "ORDER BY p.created_at DESC")
    IPage<Map<String, Object>> searchTopicPosts(@Param("topicId") String topicId, 
                                               @Param("keyword") String keyword, 
                                               Page<?> page);
    
    /**
     * 批量更新动态浏览量
     * 
     * @param postIds 动态ID列表
     * @return 更新行数
     */
    @Update("<script>" +
            "UPDATE xp_topic_post SET view_count = view_count + 1, updated_at = NOW() " +
            "WHERE post_id IN " +
            "<foreach collection='postIds' item='postId' open='(' separator=',' close=')'>" +
            "#{postId}" +
            "</foreach>" +
            "</script>")
    int batchUpdateViewCount(@Param("postIds") List<String> postIds);
}
// #endregion

// #region 5. User Related Mappers

/**
 * 用户信息数据访问接口
 */
@Repository
@Mapper
public interface UserMapper extends BaseMapper<UserEntity> {
    
    /**
     * 批量查询用户基本信息
     * 
     * @param userIds 用户ID列表
     * @return 用户信息列表
     */
    @Select("<script>" +
            "SELECT user_id, nickname, avatar_url, user_level, verified_status, user_badges, " +
            "follow_count, fans_count FROM xp_user WHERE user_id IN " +
            "<foreach collection='userIds' item='userId' open='(' separator=',' close=')'>" +
            "#{userId}" +
            "</foreach>" +
            " AND user_status = 1 AND is_deleted IS NULL" +
            "</script>")
    List<Map<String, Object>> selectUserBasicInfoBatch(@Param("userIds") List<String> userIds);
    
    /**
     * 查询话题活跃用户排行
     * 
     * @param topicId 话题ID
     * @param limit 返回数量限制
     * @return 活跃用户列表
     */
    @Select("SELECT u.user_id, u.nickname, u.avatar_url, u.user_level, u.verified_status, u.user_badges, " +
            "COUNT(p.post_id) as post_count, " +
            "SUM(p.like_count) as total_likes " +
            "FROM xp_user u " +
            "INNER JOIN xp_topic_post p ON u.user_id = p.user_id " +
            "WHERE p.topic_id = #{topicId} AND p.post_status = 1 AND p.is_deleted IS NULL " +
            "AND u.user_status = 1 AND u.is_deleted IS NULL " +
            "GROUP BY u.user_id " +
            "ORDER BY post_count DESC, total_likes DESC " +
            "LIMIT #{limit}")
    List<Map<String, Object>> selectTopicActiveUsers(@Param("topicId") String topicId, @Param("limit") Integer limit);
}
// #endregion

// #region 6. Interaction Related Mappers

/**
 * 动态点赞数据访问接口
 */
@Repository
@Mapper
public interface PostLikeMapper extends BaseMapper<PostLikeEntity> {
    
    /**
     * 批量查询用户点赞状态
     * 
     * @param postIds 动态ID列表
     * @param userId 用户ID
     * @return 点赞状态列表
     */
    @Select("<script>" +
            "SELECT post_id, like_status FROM xp_post_like " +
            "WHERE post_id IN " +
            "<foreach collection='postIds' item='postId' open='(' separator=',' close=')'>" +
            "#{postId}" +
            "</foreach>" +
            " AND user_id = #{userId}" +
            "</script>")
    List<Map<String, Object>> selectBatchLikeStatus(@Param("postIds") List<String> postIds, 
                                                   @Param("userId") String userId);
    
    /**
     * 统计动态的点赞数量
     * 
     * @param postId 动态ID
     * @return 点赞数量
     */
    @Select("SELECT COUNT(*) FROM xp_post_like " +
            "WHERE post_id = #{postId} AND like_status = 1")
    Long countPostLikes(@Param("postId") String postId);
    
    /**
     * 获取动态的点赞用户列表
     * 
     * @param postId 动态ID
     * @param page 分页参数
     * @return 点赞用户列表
     */
    @Select("SELECT u.user_id, u.nickname, u.avatar_url, u.user_level, u.verified_status " +
            "FROM xp_post_like pl " +
            "INNER JOIN xp_user u ON pl.user_id = u.user_id " +
            "WHERE pl.post_id = #{postId} AND pl.like_status = 1 " +
            "AND u.user_status = 1 AND u.is_deleted IS NULL " +
            "ORDER BY pl.created_at DESC")
    IPage<Map<String, Object>> selectPostLikeUsers(@Param("postId") String postId, Page<?> page);
}

/**
 * 动态点赞实体类（补充定义）
 */
class PostLikeEntity {
    private String likeId;
    private String postId;
    private String userId;
    private Integer likeStatus;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    
    // getters and setters...
}

/**
 * 动态交互数据访问接口
 */
@Repository
@Mapper
public interface PostInteractionMapper extends BaseMapper<PostInteractionEntity> {
    
    /**
     * 批量查询用户交互状态
     * 
     * @param postIds 动态ID列表
     * @param userId 用户ID
     * @return 交互状态列表
     */
    @Select("<script>" +
            "SELECT post_id, interaction_type, interaction_status FROM xp_post_interaction " +
            "WHERE post_id IN " +
            "<foreach collection='postIds' item='postId' open='(' separator=',' close=')'>" +
            "#{postId}" +
            "</foreach>" +
            " AND user_id = #{userId} AND interaction_status = 1" +
            "</script>")
    List<Map<String, Object>> selectBatchInteractionStatus(@Param("postIds") List<String> postIds, 
                                                          @Param("userId") String userId);
    
    /**
     * 记录用户交互行为
     * 
     * @param userId 用户ID
     * @param postId 动态ID
     * @param interactionType 交互类型 (like, share, view, comment)
     * @return 插入行数
     */
    @Insert("INSERT INTO xp_post_interaction " +
            "(user_id, post_id, interaction_type, interaction_status, created_at) " +
            "VALUES (#{userId}, #{postId}, #{interactionType}, 1, #{createdAt}) " +
            "ON DUPLICATE KEY UPDATE " +
            "interaction_status = 1, updated_at = #{createdAt}")
    int insertOrUpdateInteraction(@Param("userId") String userId,
                                 @Param("postId") String postId,
                                 @Param("interactionType") String interactionType,
                                 @Param("createdAt") LocalDateTime createdAt);
}

/**
 * 动态交互实体类（补充定义）
 */
class PostInteractionEntity {
    private String interactionId;
    private String userId;
    private String postId;
    private String interactionType;
    private Integer interactionStatus;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    
    // getters and setters...
}
// #endregion

// #region 7. Custom Query Methods

/**
 * 自定义复杂查询接口
 */
@Repository
@Mapper
public interface TopicDetailCustomMapper {
    
    /**
     * 查询话题趋势数据
     * 
     * @param topicId 话题ID
     * @param startDate 开始日期
     * @param endDate 结束日期
     * @return 趋势数据
     */
    @Select("SELECT " +
            "DATE(created_at) as date, " +
            "COUNT(*) as post_count, " +
            "COUNT(DISTINCT user_id) as unique_users, " +
            "SUM(like_count) as total_likes, " +
            "SUM(comment_count) as total_comments " +
            "FROM xp_topic_post " +
            "WHERE topic_id = #{topicId} " +
            "AND created_at BETWEEN #{startDate} AND #{endDate} " +
            "AND post_status = 1 AND is_deleted IS NULL " +
            "GROUP BY DATE(created_at) " +
            "ORDER BY date DESC")
    List<Map<String, Object>> selectTopicTrends(@Param("topicId") String topicId,
                                               @Param("startDate") LocalDateTime startDate,
                                               @Param("endDate") LocalDateTime endDate);
    
    /**
     * 查询相关话题推荐
     * 
     * @param topicId 当前话题ID
     * @param limit 返回数量限制
     * @return 相关话题列表
     */
    @Select("SELECT t.topic_id, t.topic_name, t.topic_title, t.post_count, t.hotness_score " +
            "FROM xp_topic t " +
            "WHERE t.topic_id != #{topicId} " +
            "AND t.topic_status = 1 AND t.is_deleted IS NULL " +
            "AND EXISTS (" +
            "    SELECT 1 FROM xp_topic_post p1 " +
            "    WHERE p1.topic_id = #{topicId} " +
            "    AND EXISTS (" +
            "        SELECT 1 FROM xp_topic_post p2 " +
            "        WHERE p2.topic_id = t.topic_id " +
            "        AND p2.user_id = p1.user_id" +
            "    )" +
            ") " +
            "ORDER BY t.hotness_score DESC, t.post_count DESC " +
            "LIMIT #{limit}")
    List<Map<String, Object>> selectRelatedTopics(@Param("topicId") String topicId, @Param("limit") Integer limit);
}
// #endregion

// #region 8. Statistical Query Methods

/**
 * 统计查询接口
 */
@Repository
@Mapper
public interface TopicDetailStatsMapper {
    
    /**
     * 获取话题详细统计信息
     * 
     * @param topicId 话题ID
     * @return 统计信息
     */
    @Select("SELECT " +
            "t.topic_id, " +
            "t.post_count, " +
            "t.participant_count, " +
            "t.hotness_score, " +
            "COALESCE(ps.total_likes, 0) as total_likes, " +
            "COALESCE(ps.total_comments, 0) as total_comments, " +
            "COALESCE(ps.total_shares, 0) as total_shares, " +
            "COALESCE(ps.total_views, 0) as total_views, " +
            "COALESCE(tf.follower_count, 0) as follower_count " +
            "FROM xp_topic t " +
            "LEFT JOIN (" +
            "    SELECT topic_id, " +
            "           SUM(like_count) as total_likes, " +
            "           SUM(comment_count) as total_comments, " +
            "           SUM(share_count) as total_shares, " +
            "           SUM(view_count) as total_views " +
            "    FROM xp_topic_post " +
            "    WHERE post_status = 1 AND is_deleted IS NULL " +
            "    GROUP BY topic_id" +
            ") ps ON t.topic_id = ps.topic_id " +
            "LEFT JOIN (" +
            "    SELECT topic_id, COUNT(*) as follower_count " +
            "    FROM xp_topic_follow " +
            "    WHERE follow_status = 1 " +
            "    GROUP BY topic_id" +
            ") tf ON t.topic_id = tf.topic_id " +
            "WHERE t.topic_id = #{topicId}")
    Map<String, Object> selectTopicDetailStats(@Param("topicId") String topicId);
    
    /**
     * 批量获取多个话题的统计信息
     * 
     * @param topicIds 话题ID列表
     * @return 统计信息列表
     */
    @Select("<script>" +
            "SELECT topic_id, post_count, participant_count, hotness_score " +
            "FROM xp_topic WHERE topic_id IN " +
            "<foreach collection='topicIds' item='topicId' open='(' separator=',' close=')'>" +
            "#{topicId}" +
            "</foreach>" +
            " AND topic_status = 1 AND is_deleted IS NULL" +
            "</script>")
    List<Map<String, Object>> selectBatchTopicStats(@Param("topicIds") List<String> topicIds);
}
// #endregion
