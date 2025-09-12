/**
 * 发现页面 - 内容卡片组件
 * 实现图片/视频/文字/活动等多种内容类型的展示
 */

import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Platform,
  Alert
} from 'react-native';
import { ContentCardProps, ContentType, UserInfo, LocationInfo } from './types';
import {
  COLORS,
  FONTS,
  SPACING,
  BORDER_RADIUS,
  CARD_CONFIG,
  TEST_IDS,
  ACCESSIBILITY_LABELS
} from './constants';

const { width: screenWidth } = Dimensions.get('window');

const ContentCard: React.FC<ContentCardProps> = ({
  item,
  onPress,
  onLike,
  onComment,
  onShare,
  onUserPress,
  onLocationPress,
  onMore
}) => {
  const [imageLoadError, setImageLoadError] = useState(false);

  // 处理卡片点击
  const handleCardPress = useCallback(() => {
    onPress?.(item);
  }, [item, onPress]);

  // 处理用户头像/昵称点击
  const handleUserPress = useCallback(() => {
    onUserPress?.(item.user);
  }, [item.user, onUserPress]);

  // 处理位置点击
  const handleLocationPress = useCallback(() => {
    if (item.location) {
      onLocationPress?.(item.location);
    }
  }, [item.location, onLocationPress]);

  // 处理点赞
  const handleLike = useCallback(() => {
    onLike?.(item);
  }, [item, onLike]);

  // 处理评论
  const handleComment = useCallback(() => {
    onComment?.(item);
  }, [item, onComment]);

  // 处理分享
  const handleShare = useCallback(() => {
    onShare?.(item);
  }, [item, onShare]);

  // 处理更多操作
  const handleMore = useCallback(() => {
    onMore?.(item);
  }, [item, onMore]);

  // 格式化数量显示
  const formatCount = (count: number): string => {
    if (count < 1000) return count.toString();
    if (count < 10000) return `${(count / 1000).toFixed(1)}k`;
    if (count < 100000) return `${Math.floor(count / 1000)}k`;
    return `${Math.floor(count / 10000)}w`;
  };

  // 格式化时间显示
  const formatTime = (dateString: string): string => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    
    const minutes = Math.floor(diff / (1000 * 60));
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    
    if (minutes < 1) return '刚刚';
    if (minutes < 60) return `${minutes}分钟前`;
    if (hours < 24) return `${hours}小时前`;
    if (days < 7) return `${days}天前`;
    
    return date.toLocaleDateString('zh-CN', {
      month: 'numeric',
      day: 'numeric'
    });
  };

  // 渲染用户信息区域
  const renderUserInfo = () => (
    <View style={styles.userInfoContainer}>
      {/* 用户头像 */}
      <TouchableOpacity
        style={styles.avatarContainer}
        onPress={handleUserPress}
        testID={TEST_IDS.USER_AVATAR}
        accessibilityLabel={ACCESSIBILITY_LABELS.USER_AVATAR}
      >
        <Image
          source={{ uri: item.user.avatar }}
          style={styles.avatar}
          defaultSource={{ uri: 'https://via.placeholder.com/40x40/E5E7EB/6B7280?text=U' }}
        />
        {/* 在线状态指示器 */}
        {item.user.isOnline && (
          <View style={styles.onlineIndicator} />
        )}
      </TouchableOpacity>

      {/* 用户信息文字区域 */}
      <View style={styles.userTextContainer}>
        <View style={styles.nicknameRow}>
          <TouchableOpacity onPress={handleUserPress}>
            <Text
              style={styles.nickname}
              numberOfLines={1}
              testID={TEST_IDS.USER_NICKNAME}
            >
              {item.user.nickname}
            </Text>
          </TouchableOpacity>
          
          {/* 认证标识 */}
          {item.user.isVerified && (
            <View style={styles.verifiedBadge}>
              <Text style={styles.verifiedIcon}>✓</Text>
            </View>
          )}
          
          {/* 关注状态标签 */}
          {item.user.isFollowed && (
            <View style={styles.followedBadge}>
              <Text style={styles.followedText}>已关注</Text>
            </View>
          )}
        </View>

        {/* 发布时间和位置 */}
        <View style={styles.metaRow}>
          <Text style={styles.timeText}>{formatTime(item.createdAt)}</Text>
          
          {/* 位置信息 */}
          {item.location && (
            <TouchableOpacity
              style={styles.locationContainer}
              onPress={handleLocationPress}
            >
              <Text style={styles.locationIcon}>📍</Text>
              <Text style={styles.locationText} numberOfLines={1}>
                {item.location.name}
              </Text>
              {item.distanceFromUser && (
                <Text style={styles.distanceText}>
                  · {item.distanceFromUser}
                </Text>
              )}
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* 更多操作按钮 */}
      <TouchableOpacity
        style={styles.moreButton}
        onPress={handleMore}
        testID={TEST_IDS.MORE_BUTTON}
        accessibilityLabel={ACCESSIBILITY_LABELS.MORE_BUTTON}
      >
        <Text style={styles.moreIcon}>...</Text>
      </TouchableOpacity>
    </View>
  );

  // 渲染文字内容
  const renderTextContent = () => {
    if (!item.content) return null;

    return (
      <View style={styles.textContainer}>
        <Text style={styles.contentText} numberOfLines={3}>
          {item.content}
        </Text>
        
        {/* 话题标签 */}
        {item.tags && item.tags.length > 0 && (
          <View style={styles.tagsContainer}>
            {item.tags.map((tag, index) => (
              <Text key={index} style={styles.tagText}>
                #{tag}#
              </Text>
            ))}
          </View>
        )}
      </View>
    );
  };

  // 渲染图片内容
  const renderImageContent = () => {
    if (!item.media || item.media.length === 0 || item.type !== ContentType.IMAGE) {
      return null;
    }

    const media = item.media[0]; // 简化处理，只显示第一张图片

    return (
      <TouchableOpacity style={styles.mediaContainer} onPress={handleCardPress}>
        <Image
          source={{ uri: imageLoadError ? undefined : media.url }}
          style={[
            styles.contentImage,
            {
              aspectRatio: media.width && media.height ? media.width / media.height : 1,
            }
          ]}
          onError={() => setImageLoadError(true)}
          resizeMode="cover"
          accessibilityLabel={ACCESSIBILITY_LABELS.CONTENT_IMAGE}
        />
        
        {/* 多图标识 */}
        {item.media.length > 1 && (
          <View style={styles.multiImageBadge}>
            <Text style={styles.multiImageText}>+{item.media.length - 1}</Text>
          </View>
        )}
      </TouchableOpacity>
    );
  };

  // 渲染视频内容
  const renderVideoContent = () => {
    if (!item.media || item.media.length === 0 || item.type !== ContentType.VIDEO) {
      return null;
    }

    const media = item.media[0];

    return (
      <TouchableOpacity style={styles.mediaContainer} onPress={handleCardPress}>
        <Image
          source={{ uri: media.thumbnailUrl || media.url }}
          style={[
            styles.contentImage,
            { aspectRatio: 16 / 9 } // 标准视频比例
          ]}
          resizeMode="cover"
          accessibilityLabel={ACCESSIBILITY_LABELS.CONTENT_VIDEO}
        />
        
        {/* 播放按钮 */}
        <View style={styles.playButton}>
          <Text style={styles.playIcon}>▶</Text>
        </View>
        
        {/* 视频时长 */}
        {media.duration && (
          <View style={styles.durationBadge}>
            <Text style={styles.durationText}>
              {Math.floor(media.duration / 60)}:{(media.duration % 60).toString().padStart(2, '0')}
            </Text>
          </View>
        )}
      </TouchableOpacity>
    );
  };

  // 渲染活动内容
  const renderActivityContent = () => {
    if (item.type !== ContentType.ACTIVITY) return null;

    return (
      <View style={styles.activityContainer}>
        <View style={styles.activityHeader}>
          <Text style={styles.activityTitle} numberOfLines={2}>
            {(item as any).title || item.content}
          </Text>
        </View>
        
        <View style={styles.activityMeta}>
          <Text style={styles.activityMetaText}>
            🕐 {(item as any).startTime || '待定'}
          </Text>
          <Text style={styles.activityMetaText}>
            👥 已有{(item as any).participantCount || 0}人参加
          </Text>
          {(item as any).fee && (
            <Text style={styles.activityMetaText}>
              💰 {(item as any).fee}
            </Text>
          )}
        </View>
      </View>
    );
  };

  // 渲染互动操作栏
  const renderActionBar = () => (
    <View style={styles.actionBar}>
      {/* 点赞按钮 */}
      <TouchableOpacity
        style={styles.actionButton}
        onPress={handleLike}
        testID={TEST_IDS.LIKE_BUTTON}
        accessibilityLabel={item.isLiked ? ACCESSIBILITY_LABELS.LIKED_BUTTON : ACCESSIBILITY_LABELS.LIKE_BUTTON}
      >
        <Text style={[
          styles.actionIcon,
          item.isLiked && styles.actionIconLiked
        ]}>
          {item.isLiked ? '❤️' : '🤍'}
        </Text>
        {item.likeCount > 0 && (
          <Text style={[
            styles.actionText,
            item.isLiked && styles.actionTextLiked
          ]}>
            {formatCount(item.likeCount)}
          </Text>
        )}
      </TouchableOpacity>

      {/* 评论按钮 */}
      <TouchableOpacity
        style={styles.actionButton}
        onPress={handleComment}
        testID={TEST_IDS.COMMENT_BUTTON}
        accessibilityLabel={ACCESSIBILITY_LABELS.COMMENT_BUTTON}
      >
        <Text style={styles.actionIcon}>💬</Text>
        {item.commentCount > 0 && (
          <Text style={styles.actionText}>
            {formatCount(item.commentCount)}
          </Text>
        )}
      </TouchableOpacity>

      {/* 分享按钮 */}
      <TouchableOpacity
        style={styles.actionButton}
        onPress={handleShare}
        testID={TEST_IDS.SHARE_BUTTON}
        accessibilityLabel={ACCESSIBILITY_LABELS.SHARE_BUTTON}
      >
        <Text style={styles.actionIcon}>🔗</Text>
        <Text style={styles.actionText}>分享</Text>
      </TouchableOpacity>

      {/* 热门标识 */}
      {item.hotScore && item.hotScore > 1000 && (
        <View style={styles.hotBadge}>
          <Text style={styles.hotText}>🔥 热门</Text>
        </View>
      )}
    </View>
  );

  return (
    <TouchableOpacity
      style={styles.cardContainer}
      activeOpacity={0.98}
      onPress={handleCardPress}
      testID={TEST_IDS.CONTENT_CARD}
    >
      {/* 用户信息区域 */}
      {renderUserInfo()}

      {/* 文字内容 */}
      {renderTextContent()}

      {/* 媒体内容 */}
      {item.type === ContentType.IMAGE && renderImageContent()}
      {item.type === ContentType.VIDEO && renderVideoContent()}
      {item.type === ContentType.ACTIVITY && renderActivityContent()}

      {/* 互动操作栏 */}
      {renderActionBar()}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    backgroundColor: COLORS.CARD_BACKGROUND,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.SEPARATOR,
    paddingHorizontal: SPACING.MD,
    paddingVertical: SPACING.MD
  },

  // 用户信息区域
  userInfoContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: SPACING.SM
  },

  avatarContainer: {
    position: 'relative'
  },

  avatar: {
    width: CARD_CONFIG.AVATAR_SIZE,
    height: CARD_CONFIG.AVATAR_SIZE,
    borderRadius: CARD_CONFIG.AVATAR_BORDER_RADIUS,
    backgroundColor: COLORS.GRAY_200
  },

  onlineIndicator: {
    position: 'absolute',
    bottom: -2,
    right: -2,
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: COLORS.SUCCESS,
    borderWidth: 2,
    borderColor: COLORS.WHITE
  },

  userTextContainer: {
    flex: 1,
    marginLeft: SPACING.MD
  },

  nicknameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 2
  },

  nickname: {
    fontSize: FONTS.SIZE_14,
    fontWeight: FONTS.WEIGHT_MEDIUM,
    color: COLORS.BLACK,
    maxWidth: 120
  },

  verifiedBadge: {
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: COLORS.INFO,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 4
  },

  verifiedIcon: {
    fontSize: 8,
    color: COLORS.WHITE,
    fontWeight: FONTS.WEIGHT_BOLD
  },

  followedBadge: {
    backgroundColor: COLORS.GRAY_100,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    marginLeft: 6
  },

  followedText: {
    fontSize: FONTS.SIZE_10,
    color: COLORS.GRAY_600,
    fontWeight: FONTS.WEIGHT_MEDIUM
  },

  metaRow: {
    flexDirection: 'row',
    alignItems: 'center'
  },

  timeText: {
    fontSize: FONTS.SIZE_12,
    color: COLORS.GRAY_500
  },

  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: SPACING.SM,
    flex: 1
  },

  locationIcon: {
    fontSize: FONTS.SIZE_10
  },

  locationText: {
    fontSize: FONTS.SIZE_12,
    color: COLORS.GRAY_500,
    marginLeft: 2,
    flex: 1
  },

  distanceText: {
    fontSize: FONTS.SIZE_12,
    color: COLORS.GRAY_400
  },

  moreButton: {
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center'
  },

  moreIcon: {
    fontSize: FONTS.SIZE_16,
    color: COLORS.GRAY_500
  },

  // 文字内容
  textContainer: {
    marginBottom: SPACING.SM
  },

  contentText: {
    fontSize: FONTS.SIZE_16,
    lineHeight: CARD_CONFIG.TEXT_LINE_HEIGHT,
    color: COLORS.BLACK
  },

  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: SPACING.XS
  },

  tagText: {
    fontSize: FONTS.SIZE_14,
    color: COLORS.INFO,
    marginRight: SPACING.SM,
    marginBottom: SPACING.XS
  },

  // 媒体内容
  mediaContainer: {
    position: 'relative',
    marginBottom: SPACING.SM,
    borderRadius: CARD_CONFIG.IMAGE_BORDER_RADIUS,
    overflow: 'hidden'
  },

  contentImage: {
    width: '100%',
    backgroundColor: COLORS.GRAY_200,
    borderRadius: CARD_CONFIG.IMAGE_BORDER_RADIUS
  },

  multiImageBadge: {
    position: 'absolute',
    top: SPACING.SM,
    right: SPACING.SM,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    paddingHorizontal: SPACING.SM,
    paddingVertical: SPACING.XS,
    borderRadius: 12
  },

  multiImageText: {
    fontSize: FONTS.SIZE_12,
    color: COLORS.WHITE,
    fontWeight: FONTS.WEIGHT_MEDIUM
  },

  playButton: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    transform: [{ translateX: -24 }, { translateY: -24 }]
  },

  playIcon: {
    fontSize: 20,
    color: COLORS.WHITE,
    marginLeft: 2
  },

  durationBadge: {
    position: 'absolute',
    bottom: SPACING.SM,
    right: SPACING.SM,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    paddingHorizontal: SPACING.SM,
    paddingVertical: SPACING.XS,
    borderRadius: 4
  },

  durationText: {
    fontSize: FONTS.SIZE_12,
    color: COLORS.WHITE,
    fontWeight: FONTS.WEIGHT_MEDIUM
  },

  // 活动内容
  activityContainer: {
    backgroundColor: COLORS.PRIMARY,
    borderRadius: BORDER_RADIUS.LG,
    padding: SPACING.LG,
    marginBottom: SPACING.SM
  },

  activityHeader: {
    marginBottom: SPACING.SM
  },

  activityTitle: {
    fontSize: FONTS.SIZE_18,
    fontWeight: FONTS.WEIGHT_BOLD,
    color: COLORS.WHITE
  },

  activityMeta: {
    gap: SPACING.XS
  },

  activityMetaText: {
    fontSize: FONTS.SIZE_14,
    color: 'rgba(255, 255, 255, 0.9)'
  },

  // 互动操作栏
  actionBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: SPACING.SM,
    borderTopWidth: 1,
    borderTopColor: COLORS.SEPARATOR
  },

  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: SPACING.SM,
    paddingHorizontal: SPACING.MD,
    marginRight: SPACING.LG,
    minWidth: 44,
    minHeight: 44
  },

  actionIcon: {
    fontSize: CARD_CONFIG.ACTION_ICON_SIZE,
    color: COLORS.GRAY_500
  },

  actionIconLiked: {
    color: COLORS.LIKE_COLOR
  },

  actionText: {
    fontSize: FONTS.SIZE_14,
    color: COLORS.GRAY_500,
    marginLeft: SPACING.XS,
    fontWeight: FONTS.WEIGHT_MEDIUM
  },

  actionTextLiked: {
    color: COLORS.LIKE_COLOR
  },

  hotBadge: {
    marginLeft: 'auto',
    backgroundColor: COLORS.ERROR,
    paddingHorizontal: SPACING.SM,
    paddingVertical: SPACING.XS,
    borderRadius: 12
  },

  hotText: {
    fontSize: FONTS.SIZE_12,
    color: COLORS.WHITE,
    fontWeight: FONTS.WEIGHT_MEDIUM
  }
});

export default ContentCard;
