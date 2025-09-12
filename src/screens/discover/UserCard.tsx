/**
 * 发现页面 - 用户卡片组件
 * 简化的用户信息展示，用于内容卡片中的用户信息区域
 */

import React, { useCallback } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  StyleSheet
} from 'react-native';
import { UserInfo } from './types';
import {
  COLORS,
  FONTS,
  SPACING,
  CARD_CONFIG,
  TEST_IDS,
  ACCESSIBILITY_LABELS
} from './constants';

interface UserCardProps {
  user: UserInfo;
  showTime?: boolean;
  timeText?: string;
  showLocation?: boolean;
  locationText?: string;
  distanceText?: string;
  onUserPress?: (user: UserInfo) => void;
  onLocationPress?: () => void;
  onMore?: () => void;
  style?: any;
}

const UserCard: React.FC<UserCardProps> = ({
  user,
  showTime = true,
  timeText,
  showLocation = false,
  locationText,
  distanceText,
  onUserPress,
  onLocationPress,
  onMore,
  style
}) => {
  // 处理用户点击
  const handleUserPress = useCallback(() => {
    onUserPress?.(user);
  }, [user, onUserPress]);

  // 处理位置点击
  const handleLocationPress = useCallback(() => {
    onLocationPress?.();
  }, [onLocationPress]);

  // 处理更多操作点击
  const handleMorePress = useCallback(() => {
    onMore?.();
  }, [onMore]);

  return (
    <View style={[styles.container, style]}>
      {/* 用户头像 */}
      <TouchableOpacity
        style={styles.avatarContainer}
        onPress={handleUserPress}
        testID={TEST_IDS.USER_AVATAR}
        accessibilityLabel={ACCESSIBILITY_LABELS.USER_AVATAR}
      >
        <Image
          source={{ uri: user.avatar }}
          style={styles.avatar}
          defaultSource={{ uri: 'https://via.placeholder.com/40x40/E5E7EB/6B7280?text=U' }}
        />
        
        {/* 在线状态指示器 */}
        {user.isOnline && (
          <View style={styles.onlineIndicator} />
        )}
      </TouchableOpacity>

      {/* 用户信息文字区域 */}
      <View style={styles.userInfoContainer}>
        {/* 昵称行 */}
        <View style={styles.nicknameRow}>
          <TouchableOpacity onPress={handleUserPress}>
            <Text
              style={styles.nickname}
              numberOfLines={1}
              testID={TEST_IDS.USER_NICKNAME}
            >
              {user.nickname}
            </Text>
          </TouchableOpacity>
          
          {/* 认证标识 */}
          {user.isVerified && (
            <View style={styles.verifiedBadge}>
              <Text style={styles.verifiedIcon}>✓</Text>
            </View>
          )}
          
          {/* 关注状态标签 */}
          {user.isFollowed && (
            <View style={styles.followedBadge}>
              <Text style={styles.followedText}>已关注</Text>
            </View>
          )}
        </View>

        {/* 时间和位置信息行 */}
        <View style={styles.metaRow}>
          {/* 时间信息 */}
          {showTime && timeText && (
            <Text style={styles.timeText}>{timeText}</Text>
          )}
          
          {/* 位置信息 */}
          {showLocation && locationText && (
            <TouchableOpacity
              style={styles.locationContainer}
              onPress={handleLocationPress}
            >
              <Text style={styles.locationIcon}>📍</Text>
              <Text style={styles.locationText} numberOfLines={1}>
                {locationText}
              </Text>
              {distanceText && (
                <Text style={styles.distanceText}>
                  · {distanceText}
                </Text>
              )}
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* 更多操作按钮 */}
      {onMore && (
        <TouchableOpacity
          style={styles.moreButton}
          onPress={handleMorePress}
          testID={TEST_IDS.MORE_BUTTON}
          accessibilityLabel={ACCESSIBILITY_LABELS.MORE_BUTTON}
        >
          <Text style={styles.moreIcon}>...</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingVertical: SPACING.SM
  },

  // 头像区域
  avatarContainer: {
    position: 'relative',
    marginRight: SPACING.MD
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

  // 用户信息区域
  userInfoContainer: {
    flex: 1,
    justifyContent: 'center'
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

  // 更多按钮
  moreButton: {
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: SPACING.SM
  },

  moreIcon: {
    fontSize: FONTS.SIZE_16,
    color: COLORS.GRAY_500
  }
});

export default UserCard;
