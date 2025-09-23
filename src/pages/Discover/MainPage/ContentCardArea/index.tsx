/**
 * 内容卡片组件
 * 支持三种Tab类型的差异化展示（热门/关注/同城）
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
import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  StyleSheet,
  Animated,
  Dimensions,
} from 'react-native';
import { ContentCardProps, DiscoverTabType } from '../types';
import { COLORS, FONT_SIZES, CARD_CONFIG, ANIMATION_DURATION } from '../constants';
// #endregion

// #region 2. Types & Schema
interface CardState {
  imageHeight: number;
  likeAnimation: Animated.Value;
  scaleAnimation: Animated.Value;
}
// #endregion

// #region 3. Constants & Config
const SCREEN_WIDTH = Dimensions.get('window').width;
const CARD_WIDTH = (SCREEN_WIDTH - 32 - 8) / 2; // 减去左右边距和中间间距

const DEFAULT_IMAGE_ASPECT_RATIO = 1.2;
const LIKE_ICON_FILLED = '❤️';
const LIKE_ICON_OUTLINE = '🤍';
const VIDEO_PLAY_ICON = '▶️';
// #endregion

// #region 4. Utils & Helpers
const calculateImageHeight = (images: string[]): number => {
  // 这里应该根据实际图片尺寸计算，暂时使用默认比例
  return CARD_WIDTH / DEFAULT_IMAGE_ASPECT_RATIO;
};

const formatLikeCount = (count: number): string => {
  if (count >= 1000) {
    return `${(count / 1000).toFixed(1)}k`;
  }
  return count.toString();
};

const formatDistance = (distance?: number): string => {
  if (!distance) return '';
  if (distance < 1) {
    return `${(distance * 1000).toFixed(0)}m`;
  }
  return `${distance.toFixed(1)}km`;
};
// #endregion

// #region 5. State Management
const ContentCardArea: React.FC<ContentCardProps> = ({
  content,
  onPress,
  onLike,
  onUserPress,
  onLongPress,
  tabType,
}) => {
  const [state] = React.useState<CardState>(() => ({
    imageHeight: calculateImageHeight(content.images),
    likeAnimation: new Animated.Value(1),
    scaleAnimation: new Animated.Value(1),
  }));

  // 点赞动画效果
  React.useEffect(() => {
    if (content.isLiked) {
      Animated.sequence([
        Animated.timing(state.likeAnimation, {
          toValue: 1.3,
          duration: ANIMATION_DURATION.FAST,
          useNativeDriver: true,
        }),
        Animated.timing(state.likeAnimation, {
          toValue: 1,
          duration: ANIMATION_DURATION.FAST,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [content.isLiked, state.likeAnimation]);
// #endregion

// #region 6. Domain Logic
const handleCardPress = React.useCallback(() => {
  // 点击缩放动画
  Animated.sequence([
    Animated.timing(state.scaleAnimation, {
      toValue: 0.95,
      duration: ANIMATION_DURATION.FAST,
      useNativeDriver: true,
    }),
    Animated.timing(state.scaleAnimation, {
      toValue: 1,
      duration: ANIMATION_DURATION.FAST,
      useNativeDriver: true,
    }),
  ]).start();
  
  onPress();
}, [onPress, state.scaleAnimation]);

const handleLikePress = React.useCallback(() => {
  onLike();
}, [onLike]);

const handleUserPress = React.useCallback(() => {
  onUserPress();
}, [onUserPress]);

const handleLongPress = React.useCallback(() => {
  onLongPress?.();
}, [onLongPress]);

// 渲染Tab特殊标识
const renderTabBadge = () => {
  switch (tabType) {
    case DiscoverTabType.HOT:
      if (content.hotScore && content.hotScore > 1000) {
        return (
          <View style={[styles.badge, styles.hotBadge]}>
            <Text style={styles.badgeText}>🔥 {content.hotScore}</Text>
          </View>
        );
      }
      break;
      
    case DiscoverTabType.FOLLOW:
      if (content.isNewContent) {
        return (
          <View style={[styles.badge, styles.followBadge]}>
            <Text style={styles.badgeText}>👥 新</Text>
          </View>
        );
      }
      break;
      
    case DiscoverTabType.LOCAL:
      if (content.distance !== undefined) {
        return (
          <View style={[styles.badge, styles.localBadge]}>
            <Text style={styles.badgeText}>📍 {formatDistance(content.distance)}</Text>
          </View>
        );
      }
      break;
  }
  return null;
};

// 渲染商家认证标识（同城Tab专用）
const renderMerchantBadge = () => {
  if (tabType === DiscoverTabType.LOCAL && content.merchantInfo?.isVerified) {
    return (
      <View style={[styles.badge, styles.merchantBadge]}>
        <Text style={styles.badgeText}>✓ 商家</Text>
      </View>
    );
  }
  return null;
};
// #endregion

// #region 7. UI Components & Rendering
  return (
    <Animated.View
      style={[
        styles.container,
        { transform: [{ scale: state.scaleAnimation }] }
      ]}
    >
      <TouchableOpacity
        onPress={handleCardPress}
        onLongPress={handleLongPress}
        activeOpacity={0.9}
      >
        {/* 图片区域 */}
        <View style={styles.imageContainer}>
          <Image
            source={{ uri: content.images[0] }}
            style={[styles.image, { height: state.imageHeight }]}
            resizeMode="cover"
          />
          
          {/* 视频播放标识 */}
          {content.type === 'video' && (
            <View style={styles.videoOverlay}>
              <Text style={styles.playIcon}>{VIDEO_PLAY_ICON}</Text>
            </View>
          )}
          
          {/* Tab特殊标识 */}
          <View style={styles.badgeContainer}>
            {renderTabBadge()}
          </View>
          
          {/* 商家认证标识（右上角） */}
          <View style={styles.merchantBadgeContainer}>
            {renderMerchantBadge()}
          </View>
        </View>
        
        {/* 内容信息区域 */}
        <View style={styles.contentInfo}>
          {/* 标题 */}
          <Text style={styles.title} numberOfLines={2}>
            {content.title}
          </Text>
          
          {/* 用户信息行 */}
          <View style={styles.userRow}>
            {/* 用户头像和昵称 */}
            <TouchableOpacity
              style={styles.userInfo}
              onPress={handleUserPress}
              activeOpacity={0.7}
            >
              <Image
                source={{ uri: content.author.avatar }}
                style={styles.avatar}
              />
              <Text style={styles.username} numberOfLines={1}>
                {content.author.nickname}
              </Text>
            </TouchableOpacity>
            
            {/* 点赞区域 */}
            <TouchableOpacity
              style={styles.likeContainer}
              onPress={handleLikePress}
              activeOpacity={0.7}
            >
              <Animated.Text
                style={[
                  styles.likeIcon,
                  { transform: [{ scale: state.likeAnimation }] }
                ]}
              >
                {content.isLiked ? LIKE_ICON_FILLED : LIKE_ICON_OUTLINE}
              </Animated.Text>
              <Text style={styles.likeCount}>
                {formatLikeCount(content.likeCount)}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: CARD_WIDTH,
    backgroundColor: COLORS.BACKGROUND,
    borderRadius: CARD_CONFIG.BORDER_RADIUS,
    shadowColor: COLORS.SHADOW_COLOR,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
    marginBottom: 12,
  },
  imageContainer: {
    position: 'relative',
    borderTopLeftRadius: CARD_CONFIG.BORDER_RADIUS,
    borderTopRightRadius: CARD_CONFIG.BORDER_RADIUS,
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    backgroundColor: COLORS.BORDER_LIGHT,
  },
  videoOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
  },
  playIcon: {
    fontSize: 32,
    color: COLORS.BACKGROUND,
  },
  badgeContainer: {
    position: 'absolute',
    top: 8,
    left: 8,
  },
  merchantBadgeContainer: {
    position: 'absolute',
    top: 8,
    right: 8,
  },
  badge: {
    paddingHorizontal: 6,
    paddingVertical: 4,
    borderRadius: 4,
  },
  hotBadge: {
    backgroundColor: COLORS.HOT_BG,
  },
  followBadge: {
    backgroundColor: COLORS.FOLLOW_BG,
  },
  localBadge: {
    backgroundColor: COLORS.LOCAL_BG,
  },
  merchantBadge: {
    backgroundColor: COLORS.MERCHANT_COLOR,
  },
  badgeText: {
    fontSize: FONT_SIZES.BADGE,
    color: COLORS.BACKGROUND,
    fontWeight: '500',
  },
  contentInfo: {
    padding: CARD_CONFIG.CONTENT_PADDING,
  },
  title: {
    fontSize: FONT_SIZES.TITLE,
    color: COLORS.TEXT_PRIMARY,
    lineHeight: 22,
    marginBottom: 8,
  },
  userRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: 8,
  },
  avatar: {
    width: CARD_CONFIG.AVATAR_SIZE,
    height: CARD_CONFIG.AVATAR_SIZE,
    borderRadius: CARD_CONFIG.AVATAR_SIZE / 2,
    marginRight: CARD_CONFIG.AVATAR_MARGIN,
    backgroundColor: COLORS.BORDER_LIGHT,
  },
  username: {
    fontSize: FONT_SIZES.USERNAME,
    color: COLORS.TEXT_SECONDARY,
    flex: 1,
  },
  likeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  likeIcon: {
    fontSize: 16,
    marginRight: 4,
  },
  likeCount: {
    fontSize: FONT_SIZES.LIKES,
    color: COLORS.TEXT_TERTIARY,
  },
});
// #endregion

// #region 8. Exports
export default ContentCardArea;
// #endregion
