/**
 * 发现模块Mapper接口
 * 数据访问接口 - 继承BaseMapper，利用MyBatis-Plus内置方法
 * 
 * 包含：内容Mapper、用户Mapper、互动Mapper、关注Mapper、商家Mapper
 */

package com.xiangyupai.discover.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.xiangyupai.discover.entity.*;
import org.apache.ibatis.annotations.*;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;

/**
 * 发现内容Mapper接口
 */
@Repository
@Mapper
public interface DiscoverContentMapper extends BaseMapper<DiscoverContentEntity> {

    /**
     * 查询热门内容（复杂排序逻辑）
     * 
     * @param page 分页参数
     * @param userId 用户ID（用于个性化）
     * @param contentTypes 内容类型过滤
     * @param timeRange 时间范围
     * @return 热门内容分页结果
     */
    @Select({
        "<script>",
        "SELECT c.*, u.nickname, u.avatar, u.level, u.is_verified ",
        "FROM discover_content c ",
        "LEFT JOIN user_info u ON c.user_id = u.user_id ",
        "WHERE c.status = 1 AND c.audit_status = 1 ",
        "<if test='contentTypes != null and contentTypes.size() > 0'>",
        "AND c.content_type IN ",
        "<foreach collection='contentTypes' item='type' open='(' separator=',' close=')'>",
        "#{type}",
        "</foreach>",
        "</if>",
        "<if test='timeRange == \"today\"'>",
        "AND c.created_at >= CURDATE() ",
        "</if>",
        "<if test='timeRange == \"week\"'>",
        "AND c.created_at >= DATE_SUB(CURDATE(), INTERVAL 7 DAY) ",
        "</if>",
        "<if test='timeRange == \"month\"'>",
        "AND c.created_at >= DATE_SUB(CURDATE(), INTERVAL 30 DAY) ",
        "</if>",
        "ORDER BY c.hot_score DESC, c.created_at DESC",
        "</script>"
    })
    IPage<DiscoverContentEntity> selectHotContentWithPagination(
            Page<?> page,
            @Param("userId") String userId,
            @Param("contentTypes") List<String> contentTypes,
            @Param("timeRange") String timeRange
    );

    /**
     * 查询关注用户内容
     * 
     * @param page 分页参数
     * @param userId 当前用户ID
     * @param followingUserIds 关注的用户ID列表
     * @param contentTypes 内容类型过滤
     * @return 关注内容分页结果
     */
    @Select({
        "<script>",
        "SELECT c.*, u.nickname, u.avatar, u.level, u.is_verified, ",
        "uf.created_at as followed_at ",
        "FROM discover_content c ",
        "LEFT JOIN user_info u ON c.user_id = u.user_id ",
        "LEFT JOIN user_follow uf ON c.user_id = uf.following_id AND uf.follower_id = #{userId} ",
        "WHERE c.status = 1 AND c.audit_status = 1 ",
        "AND c.user_id IN ",
        "<foreach collection='followingUserIds' item='followingId' open='(' separator=',' close=')'>",
        "#{followingId}",
        "</foreach>",
        "<if test='contentTypes != null and contentTypes.size() > 0'>",
        "AND c.content_type IN ",
        "<foreach collection='contentTypes' item='type' open='(' separator=',' close=')'>",
        "#{type}",
        "</foreach>",
        "</if>",
        "ORDER BY c.created_at DESC",
        "</script>"
    })
    IPage<DiscoverContentEntity> selectFollowContentWithPagination(
            Page<?> page,
            @Param("userId") String userId,
            @Param("followingUserIds") List<String> followingUserIds,
            @Param("contentTypes") List<String> contentTypes
    );

    /**
     * 查询同城内容（基于地理位置）
     * 
     * @param page 分页参数
     * @param latitude 用户纬度
     * @param longitude 用户经度
     * @param radius 搜索半径（公里）
     * @param contentTypes 内容类型过滤
     * @param sortBy 排序方式
     * @return 同城内容分页结果
     */
    @Select({
        "<script>",
        "SELECT c.*, u.nickname, u.avatar, u.level, u.is_verified, ",
        "m.name as merchant_name, m.is_verified as merchant_verified, m.is_open as merchant_open, ",
        "(6371 * acos(cos(radians(#{latitude})) * cos(radians(c.latitude)) * ",
        "cos(radians(c.longitude) - radians(#{longitude})) + ",
        "sin(radians(#{latitude})) * sin(radians(c.latitude)))) AS distance ",
        "FROM discover_content c ",
        "LEFT JOIN user_info u ON c.user_id = u.user_id ",
        "LEFT JOIN merchant_info m ON c.merchant_id = m.merchant_id ",
        "WHERE c.status = 1 AND c.audit_status = 1 ",
        "AND c.latitude IS NOT NULL AND c.longitude IS NOT NULL ",
        "<if test='contentTypes != null and contentTypes.size() > 0'>",
        "AND c.content_type IN ",
        "<foreach collection='contentTypes' item='type' open='(' separator=',' close=')'>",
        "#{type}",
        "</foreach>",
        "</if>",
        "HAVING distance <= #{radius} ",
        "<choose>",
        "<when test='sortBy == \"distance\"'>",
        "ORDER BY distance ASC, c.created_at DESC",
        "</when>",
        "<when test='sortBy == \"new\"'>",
        "ORDER BY c.created_at DESC",
        "</when>",
        "<otherwise>",
        "ORDER BY c.hot_score DESC, distance ASC",
        "</otherwise>",
        "</choose>",
        "</script>"
    })
    IPage<DiscoverContentEntity> selectLocalContentWithPagination(
            Page<?> page,
            @Param("latitude") BigDecimal latitude,
            @Param("longitude") BigDecimal longitude,
            @Param("radius") Integer radius,
            @Param("contentTypes") List<String> contentTypes,
            @Param("sortBy") String sortBy
    );

    /**
     * 批量更新内容统计数据
     * 
     * @param contentId 内容ID
     * @param field 字段名（like_count, collect_count, share_count等）
     * @param increment 增量（正数增加，负数减少）
     * @return 更新行数
     */
    @Update("UPDATE discover_content SET ${field} = ${field} + #{increment} WHERE content_id = #{contentId}")
    int updateContentStats(@Param("contentId") String contentId, 
                          @Param("field") String field, 
                          @Param("increment") int increment);

    /**
     * 查询用户发布的内容数量
     * 
     * @param userId 用户ID
     * @return 内容数量
     */
    @Select("SELECT COUNT(*) FROM discover_content WHERE user_id = #{userId} AND status = 1")
    int selectContentCountByUserId(@Param("userId") String userId);

    /**
     * 查询热门内容ID列表（用于缓存预热）
     * 
     * @param limit 限制数量
     * @return 内容ID列表
     */
    @Select("SELECT content_id FROM discover_content WHERE status = 1 AND audit_status = 1 " +
            "ORDER BY hot_score DESC, created_at DESC LIMIT #{limit}")
    List<String> selectHotContentIds(@Param("limit") int limit);

    /**
     * 根据标签查询相关内容
     * 
     * @param tags 标签列表
     * @param limit 限制数量
     * @return 相关内容列表
     */
    @Select({
        "<script>",
        "SELECT * FROM discover_content ",
        "WHERE status = 1 AND audit_status = 1 ",
        "AND (",
        "<foreach collection='tags' item='tag' separator=' OR '>",
        "JSON_CONTAINS(tags, JSON_QUOTE(#{tag}))",
        "</foreach>",
        ") ORDER BY hot_score DESC LIMIT #{limit}",
        "</script>"
    })
    List<DiscoverContentEntity> selectContentByTags(@Param("tags") List<String> tags, 
                                                   @Param("limit") int limit);
}

/**
 * 用户信息Mapper接口
 */
@Repository
@Mapper
public interface UserInfoMapper extends BaseMapper<UserInfoEntity> {

    /**
     * 批量查询用户基本信息
     * 
     * @param userIds 用户ID列表
     * @return 用户信息列表
     */
    @Select({
        "<script>",
        "SELECT user_id, nickname, avatar, level, is_verified, verify_type, verify_mark, ",
        "follower_count, following_count, total_like_count, content_count ",
        "FROM user_info WHERE user_id IN ",
        "<foreach collection='userIds' item='userId' open='(' separator=',' close=')'>",
        "#{userId}",
        "</foreach>",
        "</script>"
    })
    List<UserInfoEntity> selectBatchByUserIds(@Param("userIds") List<String> userIds);

    /**
     * 更新用户统计数据
     * 
     * @param userId 用户ID
     * @param field 字段名
     * @param increment 增量
     * @return 更新行数
     */
    @Update("UPDATE user_info SET ${field} = ${field} + #{increment} WHERE user_id = #{userId}")
    int updateUserStats(@Param("userId") String userId, 
                       @Param("field") String field, 
                       @Param("increment") int increment);

    /**
     * 查询活跃用户列表
     * 
     * @param days 最近天数
     * @param limit 限制数量
     * @return 活跃用户列表
     */
    @Select("SELECT * FROM user_info WHERE last_active_at >= DATE_SUB(NOW(), INTERVAL #{days} DAY) " +
            "ORDER BY last_active_at DESC LIMIT #{limit}")
    List<UserInfoEntity> selectActiveUsers(@Param("days") int days, @Param("limit") int limit);
}

/**
 * 用户互动Mapper接口
 */
@Repository
@Mapper
public interface UserInteractionMapper extends BaseMapper<UserInteractionEntity> {

    /**
     * 查询用户对内容的互动状态
     * 
     * @param userId 用户ID
     * @param contentIds 内容ID列表
     * @param interactionTypes 互动类型列表
     * @return 互动记录列表
     */
    @Select({
        "<script>",
        "SELECT * FROM user_interaction ",
        "WHERE user_id = #{userId} AND status = 1 ",
        "AND content_id IN ",
        "<foreach collection='contentIds' item='contentId' open='(' separator=',' close=')'>",
        "#{contentId}",
        "</foreach>",
        "<if test='interactionTypes != null and interactionTypes.size() > 0'>",
        "AND interaction_type IN ",
        "<foreach collection='interactionTypes' item='type' open='(' separator=',' close=')'>",
        "#{type}",
        "</foreach>",
        "</if>",
        "</script>"
    })
    List<UserInteractionEntity> selectUserInteractionStatus(
            @Param("userId") String userId,
            @Param("contentIds") List<String> contentIds,
            @Param("interactionTypes") List<Integer> interactionTypes
    );

    /**
     * 查询用户互动统计
     * 
     * @param userId 用户ID
     * @return 互动统计数据
     */
    @Select("SELECT interaction_type, COUNT(*) as count FROM user_interaction " +
            "WHERE user_id = #{userId} AND status = 1 GROUP BY interaction_type")
    List<Map<String, Object>> selectUserInteractionStats(@Param("userId") String userId);

    /**
     * 查询内容的互动用户列表
     * 
     * @param contentId 内容ID
     * @param interactionType 互动类型
     * @param limit 限制数量
     * @return 用户ID列表
     */
    @Select("SELECT user_id FROM user_interaction " +
            "WHERE content_id = #{contentId} AND interaction_type = #{interactionType} AND status = 1 " +
            "ORDER BY created_at DESC LIMIT #{limit}")
    List<String> selectInteractionUserIds(@Param("contentId") String contentId,
                                        @Param("interactionType") Integer interactionType,
                                        @Param("limit") int limit);

    /**
     * 删除用户的某个互动记录
     * 
     * @param userId 用户ID
     * @param contentId 内容ID
     * @param interactionType 互动类型
     * @return 删除行数
     */
    @Update("UPDATE user_interaction SET status = 0, updated_at = NOW() " +
            "WHERE user_id = #{userId} AND content_id = #{contentId} AND interaction_type = #{interactionType}")
    int removeUserInteraction(@Param("userId") String userId,
                            @Param("contentId") String contentId,
                            @Param("interactionType") Integer interactionType);
}

/**
 * 用户关注Mapper接口
 */
@Repository
@Mapper
public interface UserFollowMapper extends BaseMapper<UserFollowEntity> {

    /**
     * 查询用户关注列表
     * 
     * @param followerId 关注者ID
     * @param status 关注状态
     * @return 关注关系列表
     */
    @Select("SELECT * FROM user_follow WHERE follower_id = #{followerId} AND status = #{status} " +
            "ORDER BY created_at DESC")
    List<UserFollowEntity> selectFollowingList(@Param("followerId") String followerId,
                                             @Param("status") Integer status);

    /**
     * 查询用户粉丝列表
     * 
     * @param followingId 被关注者ID
     * @param status 关注状态
     * @return 关注关系列表
     */
    @Select("SELECT * FROM user_follow WHERE following_id = #{followingId} AND status = #{status} " +
            "ORDER BY created_at DESC")
    List<UserFollowEntity> selectFollowerList(@Param("followingId") String followingId,
                                            @Param("status") Integer status);

    /**
     * 检查关注关系
     * 
     * @param followerId 关注者ID
     * @param followingId 被关注者ID
     * @return 关注关系
     */
    @Select("SELECT * FROM user_follow WHERE follower_id = #{followerId} AND following_id = #{followingId}")
    UserFollowEntity selectFollowRelation(@Param("followerId") String followerId,
                                        @Param("followingId") String followingId);

    /**
     * 批量查询关注状态
     * 
     * @param followerId 关注者ID
     * @param followingIds 被关注者ID列表
     * @return 关注关系列表
     */
    @Select({
        "<script>",
        "SELECT * FROM user_follow ",
        "WHERE follower_id = #{followerId} AND status = 1 ",
        "AND following_id IN ",
        "<foreach collection='followingIds' item='followingId' open='(' separator=',' close=')'>",
        "#{followingId}",
        "</foreach>",
        "</script>"
    })
    List<UserFollowEntity> selectBatchFollowStatus(@Param("followerId") String followerId,
                                                 @Param("followingIds") List<String> followingIds);

    /**
     * 更新关注状态
     * 
     * @param followerId 关注者ID
     * @param followingId 被关注者ID
     * @param status 新状态
     * @return 更新行数
     */
    @Update("UPDATE user_follow SET status = #{status}, updated_at = NOW() " +
            "WHERE follower_id = #{followerId} AND following_id = #{followingId}")
    int updateFollowStatus(@Param("followerId") String followerId,
                          @Param("followingId") String followingId,
                          @Param("status") Integer status);
}

/**
 * 商家信息Mapper接口
 */
@Repository
@Mapper
public interface MerchantInfoMapper extends BaseMapper<MerchantInfoEntity> {

    /**
     * 查询附近商家
     * 
     * @param latitude 纬度
     * @param longitude 经度
     * @param radius 搜索半径（公里）
     * @param category 商家类型
     * @param limit 限制数量
     * @return 商家列表
     */
    @Select({
        "<script>",
        "SELECT *, ",
        "(6371 * acos(cos(radians(#{latitude})) * cos(radians(latitude)) * ",
        "cos(radians(longitude) - radians(#{longitude})) + ",
        "sin(radians(#{latitude})) * sin(radians(latitude)))) AS distance ",
        "FROM merchant_info ",
        "WHERE status = 0 ",
        "<if test='category != null'>",
        "AND category = #{category}",
        "</if>",
        "HAVING distance <= #{radius} ",
        "ORDER BY distance ASC LIMIT #{limit}",
        "</script>"
    })
    List<MerchantInfoEntity> selectNearbyMerchants(@Param("latitude") BigDecimal latitude,
                                                  @Param("longitude") BigDecimal longitude,
                                                  @Param("radius") Integer radius,
                                                  @Param("category") Integer category,
                                                  @Param("limit") int limit);

    /**
     * 查询城市热门商家
     * 
     * @param city 城市
     * @param limit 限制数量
     * @return 商家列表
     */
    @Select("SELECT * FROM merchant_info WHERE city = #{city} AND status = 0 AND is_verified = 1 " +
            "ORDER BY rating DESC, review_count DESC LIMIT #{limit}")
    List<MerchantInfoEntity> selectHotMerchantsByCity(@Param("city") String city, @Param("limit") int limit);

    /**
     * 更新商家评分
     * 
     * @param merchantId 商家ID
     * @param rating 新评分
     * @param reviewCount 评价数量增量
     * @return 更新行数
     */
    @Update("UPDATE merchant_info SET rating = #{rating}, review_count = review_count + #{reviewCount}, " +
            "updated_at = NOW() WHERE merchant_id = #{merchantId}")
    int updateMerchantRating(@Param("merchantId") String merchantId,
                           @Param("rating") BigDecimal rating,
                           @Param("reviewCount") int reviewCount);
}
