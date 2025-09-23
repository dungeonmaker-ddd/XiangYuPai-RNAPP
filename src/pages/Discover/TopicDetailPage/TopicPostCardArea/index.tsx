/**
 * 话题动态卡片区域组件
 * 
 * TOC (快速跳转):
 * [1] Imports
 * [2] Types & Schema  
 * [3] Constants & Config
 * [4] Utils & Helpers
 * [5] State Management
 * [6] Domain Logic
 * [7] UI Components & Rendering
 * [8] Exports
 */

// #region 1. Imports
import React, { memo, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  StyleSheet,
  Dimensions,
} from 'react-native';

import { TopicPostCardAreaProps } from '../types';
import { TOPIC_DETAIL_CONSTANTS } from '../constants';
// #endregion

// #region 2. Types & Schema
interface InteractionButtonProps {
  icon: string;
  count: number;
  isActive?: boolean;
  onPress: () => void;
  activeColor?: string;
  inactiveColor?: string;
}

interface UserBadgeProps {
  type: string;
  label: string;
  color: string;
}
// #endregion

// #region 3. Constants & Config
const { width: screenWidth } = Dimensions.get('window');
const IMAGE_SIZE = screenWidth - (TOPIC_DETAIL_CONSTANTS.SECTION_PADDING * 2);
const MAX_CONTENT_LINES = 3;
const PREVIEW_LENGTH = 120;
// #endregion

// #region 4. Utils & Helpers
const formatCount = (count: number): string => {
  if (count >= 1000000) {
    return `${(count / 1000000).toFixed(1)}M`;
  }
  if (count >= 1000) {
    return `${(count / 1000).toFixed(1)}k`;
  }
  return count.toString();
};

const formatTime = (dateString: string): string => {
  const now = new Date();
  const date = new Date(dateString);
  const diff = now.getTime() - date.getTime();
  
  const minutes = Math.floor(diff / (1000 * 60));
  const hours = Math.floor(diff / (1000 * 60 * 60));
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  
  if (minutes < 1) return '刚刚';
  if (minutes < 60) return `${minutes}分钟前`;
  if (hours < 24) return `${hours}小时前`;
  if (days < 30) return `${days}天前`;
  
  // 超过30天显示具体日期
  const month = date.getMonth() + 1;
  const day = date.getDate();
  return `${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
};

const truncateContent = (content: string, maxLength: number): { text: string; needsExpansion: boolean } => {
  if (content.length <= maxLength) {
    return { text: content, needsExpansion: false };
  }
  return { text: content.substring(0, maxLength) + '...', needsExpansion: true };
};
// #endregion

// #region 5. State Management
const TopicPostCardArea: React.FC<TopicPostCardAreaProps> = ({
  post,
  index,
  onPress,
  onLike,
  onComment,
  onShare,
  onUserPress,
  style,
}) => {
  const [imageError, setImageError] = useState(false);
  const [contentExpanded, setContentExpanded] = useState(false);
  
  const { text: displayContent, needsExpansion } = truncateContent(
    post.content, 
    contentExpanded ? Infinity : PREVIEW_LENGTH
  );
// #endregion

// #region 6. Domain Logic
  // 处理图片加载错误
  const handleImageError = () => {
    setImageError(true);
  };

  // 处理内容展开/收起
  const handleContentToggle = () => {
    setContentExpanded(!contentExpanded);
  };

  // 处理用户头像点击
  const handleUserAvatarPress = () => {
    onUserPress();
  };

  // 处理卡片点击
  const handleCardPress = () => {
    onPress();
  };
// #endregion

// #region 7. UI Components & Rendering
  // 用户标签组件
  const UserBadge: React.FC<UserBadgeProps> = ({ type, label, color }) => (
    <View style={[styles.userBadge, { backgroundColor: color }]}>
      <Text style={styles.userBadgeText}>{label}</Text>
    </View>
  );

  // 互动按钮组件
  const InteractionButton: React.FC<InteractionButtonProps> = ({
    icon,
    count,
    isActive = false,
    onPress,
    activeColor = TOPIC_DETAIL_CONSTANTS.LIKE_COLOR,
    inactiveColor = TOPIC_DETAIL_CONSTANTS.LIKE_COLOR_INACTIVE,
  }) => (
    <TouchableOpacity
      onPress={onPress}
      style={styles.interactionButton}
      activeOpacity={0.7}
      hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
    >
      <Text style={[
        styles.interactionIcon,
        { color: isActive ? activeColor : inactiveColor }
      ]}>
        {icon}
      </Text>
      {count > 0 && (
        <Text style={[
          styles.interactionCount,
          { color: isActive ? activeColor : inactiveColor }
        ]}>
          {formatCount(count)}
        </Text>
      )}
    </TouchableOpacity>
  );

  return (
    <TouchableOpacity
      style={[styles.container, style]}
      onPress={handleCardPress}
      activeOpacity={0.95}
    >
      {/* 用户信息区域 */}
      <View style={styles.userInfoSection}>
        <TouchableOpacity
          onPress={handleUserAvatarPress}
          style={styles.userInfoLeft}
          activeOpacity={0.7}
        >
          <Image
            source={{ uri: post.user.avatar }}
            style={styles.userAvatar}
            defaultSource={{ uri: 'https://via.placeholder.com/48x48/CCCCCC/666666?text=头像' }}
          />
          <View style={styles.userInfoText}>
            <View style={styles.userNicknameRow}>
              <Text style={styles.userNickname} numberOfLines={1}>
                {post.user.nickname}
              </Text>
              {post.user.followCount && (
                <Text style={styles.followCount}>
                  {post.user.followCount}
                </Text>
              )}
            </View>
            {post.user.badge && (
              <UserBadge
                type={post.user.badge.type}
                label={post.user.badge.label}
                color={post.user.badge.color}
              />
            )}
          </View>
        </TouchableOpacity>
        
        <View style={styles.userInfoRight}>
          <Text style={styles.timeText}>
            {formatTime(post.createdAt)}
          </Text>
          {post.location && (
            <Text style={styles.locationText} numberOfLines={1}>
              {post.location.name}
            </Text>
          )}
        </View>
      </View>

      {/* 动态内容区域 */}
      <View style={styles.contentSection}>
        {/* 标题 */}
        <Text style={styles.contentTitle} numberOfLines={2}>
          {post.title}
        </Text>
        
        {/* 正文 */}
        <View style={styles.contentTextContainer}>
          <Text style={styles.contentText}>
            {displayContent}
          </Text>
          {needsExpansion && !contentExpanded && (
            <TouchableOpacity onPress={handleContentToggle}>
              <Text style={styles.expandText}>展开全文</Text>
            </TouchableOpacity>
          )}
          {contentExpanded && needsExpansion && (
            <TouchableOpacity onPress={handleContentToggle}>
              <Text style={styles.expandText}>收起</Text>
            </TouchableOpacity>
          )}
        </View>
        
        {/* 话题标签 */}
        {post.hashtags.length > 0 && (
          <View style={styles.hashtagsContainer}>
            {post.hashtags.map((tag, tagIndex) => (
              <Text key={tagIndex} style={styles.hashtag}>
                #{tag}
              </Text>
            ))}
          </View>
        )}
      </View>

      {/* 媒体内容区域 */}
      {post.images && post.images.length > 0 && !imageError && (
        <View style={styles.mediaSection}>
          <Image
            source={{ uri: post.images[0] }}
            style={styles.contentImage}
            resizeMode="cover"
            onError={handleImageError}
          />
          {/* 如果有多张图片，显示指示器 */}
          {post.images.length > 1 && (
            <View style={styles.imageIndicator}>
              <Text style={styles.imageCount}>
                1/{post.images.length}
              </Text>
            </View>
          )}
        </View>
      )}

      {/* 互动操作区域 */}
      <View style={styles.interactionSection}>
        <View style={styles.interactionLeft}>
          <InteractionButton
            icon="❤️"
            count={post.stats.likeCount}
            isActive={post.interactions.isLiked}
            onPress={onLike}
          />
          <InteractionButton
            icon="💬"
            count={post.stats.commentCount}
            onPress={onComment}
            inactiveColor={TOPIC_DETAIL_CONSTANTS.TEXT_TERTIARY}
          />
        </View>
        
        <View style={styles.interactionRight}>
          <InteractionButton
            icon="↗️"
            count={0} // 分享不显示数字
            onPress={onShare}
            inactiveColor={TOPIC_DETAIL_CONSTANTS.TEXT_TERTIARY}
          />
        </View>
      </View>
    </TouchableOpacity>
  );
// #endregion

// #region 8. Styles
const styles = StyleSheet.create({
  container: {
    backgroundColor: TOPIC_DETAIL_CONSTANTS.CARD_BACKGROUND,
    marginHorizontal: TOPIC_DETAIL_CONSTANTS.SECTION_PADDING,
    marginBottom: TOPIC_DETAIL_CONSTANTS.ITEM_SPACING,
    borderRadius: TOPIC_DETAIL_CONSTANTS.BORDER_RADIUS,
    padding: TOPIC_DETAIL_CONSTANTS.CARD_PADDING,
    shadowColor: TOPIC_DETAIL_CONSTANTS.SHADOW_COLOR,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: TOPIC_DETAIL_CONSTANTS.SHADOW_OPACITY,
    shadowRadius: 4,
    elevation: TOPIC_DETAIL_CONSTANTS.SHADOW_ELEVATION,
  },
  
  // 用户信息区域
  userInfoSection: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: TOPIC_DETAIL_CONSTANTS.MEDIUM_SPACING,
  },
  userInfoLeft: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  userAvatar: {
    width: TOPIC_DETAIL_CONSTANTS.AVATAR_SIZE,
    height: TOPIC_DETAIL_CONSTANTS.AVATAR_SIZE,
    borderRadius: TOPIC_DETAIL_CONSTANTS.AVATAR_BORDER_RADIUS,
    marginRight: TOPIC_DETAIL_CONSTANTS.ITEM_SPACING,
  },
  userInfoText: {
    flex: 1,
  },
  userNicknameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: TOPIC_DETAIL_CONSTANTS.TINY_SPACING,
  },
  userNickname: {
    fontSize: TOPIC_DETAIL_CONSTANTS.FONT.MEDIUM,
    fontWeight: TOPIC_DETAIL_CONSTANTS.FONT_WEIGHT.SEMIBOLD,
    color: TOPIC_DETAIL_CONSTANTS.TEXT_PRIMARY,
    marginRight: TOPIC_DETAIL_CONSTANTS.SMALL_SPACING,
    flex: 1,
  },
  followCount: {
    fontSize: TOPIC_DETAIL_CONSTANTS.FONT.NORMAL,
    color: TOPIC_DETAIL_CONSTANTS.GENDER_FEMALE,
    fontWeight: TOPIC_DETAIL_CONSTANTS.FONT_WEIGHT.MEDIUM,
  },
  userBadge: {
    paddingHorizontal: TOPIC_DETAIL_CONSTANTS.SMALL_SPACING,
    paddingVertical: TOPIC_DETAIL_CONSTANTS.TINY_SPACING,
    borderRadius: TOPIC_DETAIL_CONSTANTS.SMALL_BORDER_RADIUS,
    alignSelf: 'flex-start',
  },
  userBadgeText: {
    fontSize: TOPIC_DETAIL_CONSTANTS.FONT.SMALL,
    color: TOPIC_DETAIL_CONSTANTS.TEXT_WHITE,
    fontWeight: TOPIC_DETAIL_CONSTANTS.FONT_WEIGHT.MEDIUM,
  },
  userInfoRight: {
    alignItems: 'flex-end',
  },
  timeText: {
    fontSize: TOPIC_DETAIL_CONSTANTS.FONT.SMALL,
    color: TOPIC_DETAIL_CONSTANTS.TEXT_TERTIARY,
    marginBottom: TOPIC_DETAIL_CONSTANTS.TINY_SPACING,
  },
  locationText: {
    fontSize: TOPIC_DETAIL_CONSTANTS.FONT.SMALL,
    color: TOPIC_DETAIL_CONSTANTS.TEXT_TERTIARY,
    maxWidth: 100,
  },
  
  // 内容区域
  contentSection: {
    marginBottom: TOPIC_DETAIL_CONSTANTS.MEDIUM_SPACING,
  },
  contentTitle: {
    fontSize: TOPIC_DETAIL_CONSTANTS.FONT.LARGE,
    fontWeight: TOPIC_DETAIL_CONSTANTS.FONT_WEIGHT.SEMIBOLD,
    color: TOPIC_DETAIL_CONSTANTS.TEXT_PRIMARY,
    lineHeight: TOPIC_DETAIL_CONSTANTS.LINE_HEIGHT.LARGE,
    marginBottom: TOPIC_DETAIL_CONSTANTS.ITEM_SPACING,
  },
  contentTextContainer: {
    marginBottom: TOPIC_DETAIL_CONSTANTS.SMALL_SPACING,
  },
  contentText: {
    fontSize: TOPIC_DETAIL_CONSTANTS.FONT.MEDIUM,
    lineHeight: TOPIC_DETAIL_CONSTANTS.LINE_HEIGHT.MEDIUM,
    color: TOPIC_DETAIL_CONSTANTS.TEXT_SECONDARY,
  },
  expandText: {
    fontSize: TOPIC_DETAIL_CONSTANTS.FONT.NORMAL,
    color: TOPIC_DETAIL_CONSTANTS.INFO,
    marginTop: TOPIC_DETAIL_CONSTANTS.TINY_SPACING,
  },
  hashtagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: TOPIC_DETAIL_CONSTANTS.SMALL_SPACING,
  },
  hashtag: {
    fontSize: TOPIC_DETAIL_CONSTANTS.FONT.NORMAL,
    color: TOPIC_DETAIL_CONSTANTS.INFO,
    marginRight: TOPIC_DETAIL_CONSTANTS.SMALL_SPACING,
    marginBottom: TOPIC_DETAIL_CONSTANTS.TINY_SPACING,
  },
  
  // 媒体区域
  mediaSection: {
    marginBottom: TOPIC_DETAIL_CONSTANTS.MEDIUM_SPACING,
    position: 'relative',
  },
  contentImage: {
    width: '100%',
    height: IMAGE_SIZE * 0.6, // 16:10 比例
    borderRadius: TOPIC_DETAIL_CONSTANTS.BORDER_RADIUS,
  },
  imageIndicator: {
    position: 'absolute',
    bottom: TOPIC_DETAIL_CONSTANTS.SMALL_SPACING,
    right: TOPIC_DETAIL_CONSTANTS.SMALL_SPACING,
    backgroundColor: TOPIC_DETAIL_CONSTANTS.OVERLAY,
    paddingHorizontal: TOPIC_DETAIL_CONSTANTS.SMALL_SPACING,
    paddingVertical: TOPIC_DETAIL_CONSTANTS.TINY_SPACING,
    borderRadius: TOPIC_DETAIL_CONSTANTS.SMALL_BORDER_RADIUS,
  },
  imageCount: {
    fontSize: TOPIC_DETAIL_CONSTANTS.FONT.SMALL,
    color: TOPIC_DETAIL_CONSTANTS.TEXT_WHITE,
    fontWeight: TOPIC_DETAIL_CONSTANTS.FONT_WEIGHT.MEDIUM,
  },
  
  // 互动区域
  interactionSection: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: TOPIC_DETAIL_CONSTANTS.ITEM_SPACING,
    borderTopWidth: 1,
    borderTopColor: TOPIC_DETAIL_CONSTANTS.BORDER_LIGHT,
  },
  interactionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  interactionRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  interactionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: TOPIC_DETAIL_CONSTANTS.SMALL_SPACING,
    paddingHorizontal: TOPIC_DETAIL_CONSTANTS.ITEM_SPACING,
    marginRight: TOPIC_DETAIL_CONSTANTS.MEDIUM_SPACING,
  },
  interactionIcon: {
    fontSize: TOPIC_DETAIL_CONSTANTS.FONT.LARGE,
    marginRight: TOPIC_DETAIL_CONSTANTS.TINY_SPACING,
  },
  interactionCount: {
    fontSize: TOPIC_DETAIL_CONSTANTS.FONT.NORMAL,
    fontWeight: TOPIC_DETAIL_CONSTANTS.FONT_WEIGHT.MEDIUM,
  },
});
// #endregion

// #region 9. Exports
export default memo(TopicPostCardArea);
// #endregion
