/**
 * 瀑布流卡片组件（简化版）
 * 基于《纯结构架构图标准模板》的L3级孙模块设计
 * 负责单个内容卡片的展示，业务逻辑完全外置
 * 
 * 特性：
 * - 极简UI组件：只负责展示，点击事件直接交给 onWaterfallCardClick 处理器
 * - 无业务逻辑：所有交互逻辑（导航、分析、权限等）都在事件处理器中
 * - 最小化props：移除了不必要的回调函数，简化组件接口
 * - 完全可复用：组件本身不包含任何业务假设
 */

import React, { useState, useCallback, memo, useMemo } from 'react';
import {
  View,
  TouchableOpacity,
  StyleSheet,
  Text,
  Image,
  Pressable,
  ViewStyle,
  ActivityIndicator,
} from 'react-native';
import { ContentItem, TabType } from '../types';
import { COLORS, TYPOGRAPHY, LAYOUT_CONSTANTS, IMAGE_CONFIG } from '../constants';
import { onWaterfallCardClick } from '../events/onWaterfallCardClick';
import { onWaterfallLikeClick } from '../events/onWaterfallLikeClick';
import { onWaterfallUserClick } from '../events/onWaterfallUserClick';

// 卡片属性接口 - 简化后只保留必要的props
export interface WaterfallCardProps {
  item: ContentItem;
  index: number;
  tabType: TabType;
  style?: ViewStyle;
  imageQuality?: 'high' | 'standard' | 'low';
  // 事件处理配置
  navigation?: any;
  analytics?: any;
  showToast?: (message: string) => void;
  // 保留必要的回调用于特殊交互
  onLike?: () => void;
  onLongPress?: () => void;
}


/**
 * 媒体类型指示器组件
 */
const MediaTypeIndicator: React.FC<{
  type: 'image' | 'video' | 'live';
}> = memo(({ type }) => {
  switch (type) {
    case 'video':
      return (
        <View style={styles.videoIndicator}>
          <Text style={styles.videoIcon}>▶</Text>
        </View>
      );
    case 'live':
      return (
        <View style={styles.liveIndicator}>
          <Text style={styles.liveText}>LIVE</Text>
        </View>
      );
    default:
      return null;
  }
});

/**
 * 瀑布流卡片主组件
 */
const WaterfallCard: React.FC<WaterfallCardProps> = ({
  item,
  index,
  tabType,
  style,
  onLike,
  onLongPress,
  imageQuality = 'standard',
  navigation,
  analytics,
  showToast,
}) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);

  // 简化的点击处理 - 直接调用瀑布流卡片事件处理器
  const handlePress = useCallback(() => {
    onWaterfallCardClick({
      item,
      index,
      tabType,
      navigation,
      analytics,
      showToast,
    });
  }, [item, index, tabType, navigation, analytics, showToast]);

  // 点赞处理 - 使用专用的点赞事件处理器
  const handleLikePress = useCallback(() => {
    onWaterfallLikeClick({
      item,
      index,
      tabType,
      navigation,
      analytics,
      showToast,
      onLikeSuccess: (itemId, newLikeCount) => {
        console.log(`点赞成功: ${itemId}, 新数量: ${newLikeCount}`);
        // 这里可以触发UI更新或调用外部回调
        onLike?.();
      },
      onLikeError: (itemId, error) => {
        console.error(`点赞失败: ${itemId}`, error);
      },
    });
  }, [item, index, tabType, navigation, analytics, showToast, onLike]);

  // 用户点击处理 - 使用专用的用户事件处理器
  const handleUserPress = useCallback((clickType: 'avatar' | 'nickname' | 'userInfo' = 'userInfo') => {
    onWaterfallUserClick({
      item,
      user: item.user,
      index,
      tabType,
      clickType,
      navigation,
      analytics,
      showToast,
      onUserProfileOpen: (userId) => {
        console.log(`用户资料已打开: ${userId}`);
      },
      onNavigationError: (error) => {
        console.error('用户导航失败:', error);
      },
    });
  }, [item, index, tabType, navigation, analytics, showToast]);

  // 获取图片URL（根据质量设置）
  const getImageUrl = useCallback((url: string, quality: string) => {
    // 这里可以根据不同的CDN服务调整参数
    switch (quality) {
      case 'low':
        return `${url}?imageView2/2/w/300/q/70`;
      case 'standard':
        return `${url}?imageView2/2/w/600/q/80`;
      case 'high':
      default:
        return url;
    }
  }, []);

  // 计算图片高度
  const imageHeight = useMemo(() => {
    if (!item.width || !item.height) return 200;
    
    // 假设卡片宽度已经在父组件中设置
    // 这里只是计算比例，实际宽度由父组件的style控制
    const aspectRatio = item.height / item.width;
    const cardWidth = 180; // 默认估算宽度，实际由父组件样式决定
    return cardWidth * aspectRatio;
  }, [item.width, item.height]);

  // 格式化数字显示
  const formatCount = useCallback((count: number): string => {
    if (count < 1000) return count.toString();
    if (count < 10000) return `${(count / 1000).toFixed(1)}k`;
    return `${(count / 10000).toFixed(1)}w`;
  }, []);

  return (
    <Pressable
      style={[styles.container, style]}
      onPress={handlePress}
      onLongPress={onLongPress}
      android_ripple={{ color: 'rgba(0,0,0,0.1)' }}
    >
      {/* 图片容器 */}
      <View style={styles.imageContainer}>
        <Image
          style={[styles.image, { height: imageHeight }]}
          source={{ uri: getImageUrl(item.imageUrl, imageQuality) }}
          onLoadStart={() => setImageLoaded(false)}
          onLoad={() => setImageLoaded(true)}
          onError={() => setImageError(true)}
          resizeMode="cover"
        />
        
        {/* 图片加载指示器 */}
        {!imageLoaded && !imageError && (
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
        <MediaTypeIndicator type={item.type} />
        
      </View>
      
      {/* 内容信息区域 */}
      <View style={styles.contentInfo}>
        {/* 内容标题/描述 */}
        <Text style={styles.contentTitle} numberOfLines={3}>
          {item.title}
        </Text>

        {/* 用户信息行 */}
        <View style={styles.userRow}>
          {/* 用户信息 - 可点击区域 */}
          <TouchableOpacity 
            style={styles.userInfo}
            onPress={() => handleUserPress('userInfo')}
            activeOpacity={0.7}
          >
            <TouchableOpacity 
              onPress={() => handleUserPress('avatar')}
              activeOpacity={0.8}
            >
              <Image
                source={{ 
                  uri: item.user.avatar,
                  cache: IMAGE_CONFIG.CACHE_CONTROL,
                }}
                style={styles.userAvatar}
                defaultSource={IMAGE_CONFIG.PLACEHOLDER_AVATAR}
              />
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.nicknameContainer}
              onPress={() => handleUserPress('nickname')}
              activeOpacity={0.8}
            >
              <Text style={styles.userNickname} numberOfLines={1}>
                {item.user.nickname}
              </Text>
            </TouchableOpacity>
          </TouchableOpacity>

          {/* 点赞信息 - 使用专用的点赞事件处理器 */}
          <TouchableOpacity 
            style={styles.likeContainer}
            onPress={handleLikePress}
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
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    borderRadius: LAYOUT_CONSTANTS.CARD_RADIUS,
    marginBottom: 0, // 间距完全由布局引擎控制，避免双重间距
    shadowOffset: LAYOUT_CONSTANTS.CARD_SHADOW_OFFSET,
    shadowOpacity: LAYOUT_CONSTANTS.CARD_SHADOW_OPACITY,
    shadowRadius: LAYOUT_CONSTANTS.CARD_SHADOW_RADIUS,
    shadowColor: COLORS.SHADOW,
    elevation: 3, // Android shadow
  },
  
  // 图片相关样式
  imageContainer: {
    borderTopLeftRadius: LAYOUT_CONSTANTS.CARD_RADIUS,
    borderTopRightRadius: LAYOUT_CONSTANTS.CARD_RADIUS,
    overflow: 'hidden',
    position: 'relative',
  },
  image: {
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
  
  // 内容信息样式
  contentInfo: {
    padding: LAYOUT_CONSTANTS.MARGIN_SMALL, // 统一使用更小的边距，让内容更紧凑
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
    // 移除底部边距，让卡片更紧凑
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
  
  nicknameContainer: {
    flex: 1,
    justifyContent: 'center',
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

export default memo(WaterfallCard);
