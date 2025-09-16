/**
 * 内容卡片组件
 * 展示用户发布的图片/视频内容，支持点赞、收藏、分享等交互
 */

import React, { memo, useCallback, useState } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  ActivityIndicator,
} from 'react-native';
import { ContentCardProps } from '../types';
import { COLORS, TYPOGRAPHY, LAYOUT_CONSTANTS, TEST_IDS, IMAGE_CONFIG } from '../constants';
import { calculateImageDimensions } from '../utils/imageUtils';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const CARD_WIDTH = (SCREEN_WIDTH - LAYOUT_CONSTANTS.PADDING_HORIZONTAL * 2 - LAYOUT_CONSTANTS.COLUMN_GAP) / 2;

export const ContentCard = memo<ContentCardProps>(({
  item,
  index,
  onPress,
  onLike,
  onUserPress,
}) => {
  const [imageLoading, setImageLoading] = useState(true);
  const [imageError, setImageError] = useState(false);

  // 使用新的图片尺寸计算函数
  const { displayWidth, displayHeight } = calculateImageDimensions(item, CARD_WIDTH);

  // 处理图片加载完成
  const handleImageLoad = useCallback(() => {
    setImageLoading(false);
  }, []);

  // 处理图片加载错误
  const handleImageError = useCallback(() => {
    setImageLoading(false);
    setImageError(true);
  }, []);

  // 处理卡片点击
  const handleCardPress = useCallback(() => {
    onPress(item);
  }, [item, onPress]);

  // 处理点赞
  const handleLikePress = useCallback(() => {
    onLike(item.id);
  }, [item.id, onLike]);

  // 处理用户头像/昵称点击
  const handleUserPress = useCallback(() => {
    onUserPress(item.user.id);
  }, [item.user.id, onUserPress]);

  // 格式化数字显示
  const formatCount = useCallback((count: number): string => {
    if (count < 1000) return count.toString();
    if (count < 10000) return `${(count / 1000).toFixed(1)}k`;
    return `${(count / 10000).toFixed(1)}w`;
  }, []);

  return (
    <TouchableOpacity
      style={[styles.container, { height: displayHeight + IMAGE_CONFIG.WATERFALL.CONTENT_HEIGHT }]}
      onPress={handleCardPress}
      activeOpacity={0.95}
      testID={`${TEST_IDS.CONTENT_CARD}_${index}`}
    >
      {/* 主要内容图片区域 */}
      <View style={[styles.imageContainer, { height: displayHeight }]}>
        {/* 图片 */}
        <Image
          source={{ 
            uri: item.imageUrl,
            cache: IMAGE_CONFIG.CACHE_CONTROL,
          }}
          style={styles.contentImage}
          onLoad={handleImageLoad}
          onError={handleImageError}
          resizeMode="cover"
        />
        
        {/* 图片加载指示器 */}
        {imageLoading && (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="small" color={COLORS.PRIMARY} />
          </View>
        )}

        {/* 图片加载错误 */}
        {imageError && (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>加载失败</Text>
          </View>
        )}

        {/* 内容类型标识 */}
        {item.type === 'video' && (
          <View style={styles.videoIndicator}>
            <Text style={styles.videoIcon}>▶</Text>
          </View>
        )}
        
        {item.type === 'live' && (
          <View style={styles.liveIndicator}>
            <Text style={styles.liveText}>LIVE</Text>
          </View>
        )}
      </View>

      {/* 内容信息区域 */}
      <View style={styles.contentInfo}>
        {/* 内容标题/描述 */}
        <Text style={styles.contentTitle} numberOfLines={3}>
          {item.title}
        </Text>

        {/* 用户信息行 */}
        <View style={styles.userRow}>
          {/* 用户信息 */}
          <TouchableOpacity style={styles.userInfo} onPress={handleUserPress}>
            <Image
              source={{ 
                uri: item.user.avatar,
                cache: IMAGE_CONFIG.CACHE_CONTROL,
              }}
              style={styles.userAvatar}
              defaultSource={IMAGE_CONFIG.PLACEHOLDER_AVATAR}
            />
            <Text style={styles.userNickname} numberOfLines={1}>
              {item.user.nickname}
            </Text>
          </TouchableOpacity>

          {/* 点赞信息 */}
          <TouchableOpacity 
            style={styles.likeContainer}
            onPress={handleLikePress}
            testID={TEST_IDS.LIKE_BUTTON}
          >
            <Text style={[styles.likeIcon, { color: item.isLiked ? COLORS.LIKE_ACTIVE : COLORS.TEXT_TERTIARY }]}>
              ♥
            </Text>
            <Text style={styles.likeCount}>
              {formatCount(item.likeCount)}
            </Text>
          </TouchableOpacity>
        </View>

      </View>
    </TouchableOpacity>
  );
});

ContentCard.displayName = 'ContentCard';

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    borderRadius: LAYOUT_CONSTANTS.CARD_RADIUS,
    marginBottom: LAYOUT_CONSTANTS.MARGIN_MEDIUM,
    shadowOffset: LAYOUT_CONSTANTS.CARD_SHADOW_OFFSET,
    shadowOpacity: LAYOUT_CONSTANTS.CARD_SHADOW_OPACITY,
    shadowRadius: LAYOUT_CONSTANTS.CARD_SHADOW_RADIUS,
    shadowColor: COLORS.SHADOW,
    elevation: 3, // Android shadow
  },
  
  imageContainer: {
    borderTopLeftRadius: LAYOUT_CONSTANTS.CARD_RADIUS,
    borderTopRightRadius: LAYOUT_CONSTANTS.CARD_RADIUS,
    overflow: 'hidden',
    position: 'relative',
  },
  
  contentImage: {
    width: '100%',
    height: '100%',
  },
  
  loadingContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: COLORS.BACKGROUND_GRAY,
    justifyContent: 'center',
    alignItems: 'center',
  },
  
  errorContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: COLORS.BACKGROUND_GRAY,
    justifyContent: 'center',
    alignItems: 'center',
  },
  
  errorText: {
    ...TYPOGRAPHY.CAPTION,
    color: COLORS.TEXT_TERTIARY,
  },
  
  videoIndicator: {
    position: 'absolute',
    top: LAYOUT_CONSTANTS.MARGIN_SMALL,
    left: LAYOUT_CONSTANTS.MARGIN_SMALL,
    backgroundColor: COLORS.OVERLAY,
    borderRadius: 12,
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  
  videoIcon: {
    color: COLORS.BACKGROUND,
    fontSize: 10,
    fontWeight: 'bold',
  },
  
  liveIndicator: {
    position: 'absolute',
    top: LAYOUT_CONSTANTS.MARGIN_SMALL,
    right: LAYOUT_CONSTANTS.MARGIN_SMALL,
    backgroundColor: COLORS.ERROR,
    borderRadius: 4,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  
  liveText: {
    color: COLORS.BACKGROUND,
    fontSize: 10,
    fontWeight: 'bold',
  },
  
  contentInfo: {
    padding: LAYOUT_CONSTANTS.PADDING_VERTICAL,
    paddingHorizontal: LAYOUT_CONSTANTS.MARGIN_MEDIUM,
  },
  
  contentTitle: {
    ...TYPOGRAPHY.BODY_MEDIUM,
    color: COLORS.TEXT_PRIMARY,
    marginBottom: LAYOUT_CONSTANTS.MARGIN_SMALL,
  },
  
  userRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: LAYOUT_CONSTANTS.MARGIN_SMALL,
  },
  
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  
  userAvatar: {
    width: LAYOUT_CONSTANTS.AVATAR_SIZE_SMALL,
    height: LAYOUT_CONSTANTS.AVATAR_SIZE_SMALL,
    borderRadius: LAYOUT_CONSTANTS.AVATAR_SIZE_SMALL / 2,
    marginRight: LAYOUT_CONSTANTS.MARGIN_SMALL,
    backgroundColor: COLORS.BACKGROUND_GRAY,
  },
  
  userNickname: {
    ...TYPOGRAPHY.BODY_SMALL,
    color: COLORS.TEXT_SECONDARY,
    flex: 1,
  },
  
  
  likeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  
  likeIcon: {
    fontSize: LAYOUT_CONSTANTS.ICON_SIZE_SMALL,
    marginRight: 2,
  },
  
  likeCount: {
    ...TYPOGRAPHY.BODY_SMALL,
    color: COLORS.TEXT_SECONDARY,
  },
  
});