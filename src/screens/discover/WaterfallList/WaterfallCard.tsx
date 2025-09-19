/**
 * 瀑布流卡片组件
 * 基于通用组件架构核心标准 - 统一模块版本
 * 
 * 架构特性：
 * - 8段式编码逻辑：导入→类型→常量→工具→状态→事件→渲染→样式
 * - 具名化原则：所有函数和变量都有明确含义的名称
 * - 单一职责：专注于瀑布流卡片的展示和基础交互
 * - 统一模块：与其他瀑布流组件共享状态和事件处理
 * 
 * @version 2.0.0 - 统一模块架构版本
 * @complexity Intermediate (200-300行)
 */

// #region 1. 导入声明区域
// ==========================================
// React 核心库
import React, { useState, useCallback, memo, useMemo } from 'react';

// React Native 组件
import {
  View,
  TouchableOpacity,
  StyleSheet,
  Text,
  Image,
  Pressable,
  ActivityIndicator,
} from 'react-native';

// 模块内部导入
import { WaterfallCardProps, MediaType } from './types';
import { 
  COLORS, 
  TYPOGRAPHY, 
  LAYOUT_CONSTANTS,
  IMAGE_CONSTANTS,
  ANIMATION_CONSTANTS 
} from './constants';

// 事件处理器
import { onWaterfallCardClick } from './onWaterfallCardClick';

// 工具函数
import { formatDisplayCount } from './formatWaterfallCardDisplay';
import { 
  getOptimizedImageUrl, 
  calculateImageDisplayHeight 
} from './processWaterfallCardImage';
// #endregion

// #region 2. 媒体类型指示器子组件
// ==========================================
/**
 * 媒体类型指示器组件
 * 负责显示视频、直播等媒体类型标识
 */
const MediaTypeIndicator: React.FC<{
  type: MediaType;
}> = memo(({ type }) => {
  switch (type) {
    case 'video':
      return (
        <View style={waterfallCardStyles.videoIndicator}>
          <Text style={waterfallCardStyles.videoIcon}>▶</Text>
        </View>
      );
    case 'live':
      return (
        <View style={waterfallCardStyles.liveIndicator}>
          <Text style={waterfallCardStyles.liveText}>LIVE</Text>
        </View>
      );
    default:
      return null;
  }
});

MediaTypeIndicator.displayName = 'MediaTypeIndicator';
// #endregion

// #region 3. 主组件定义区域
// ==========================================
/**
 * 瀑布流卡片主组件
 * 基于统一模块架构的完整实现
 */
const WaterfallCard: React.FC<WaterfallCardProps> = ({
  item,
  index,
  tabType,
  style,
  onLike,
  onLongPress,
  imageQuality = IMAGE_CONSTANTS.DEFAULT_QUALITY,
  navigation,
  analytics,
  showToast,
}) => {
  // #region 3.1 状态管理区域
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);
  // #endregion

  // #region 3.2 事件处理区域
  /**
   * 卡片点击事件处理
   * 使用统一模块的事件处理器
   */
  const handleCardPress = useCallback(() => {
    onWaterfallCardClick({
      item,
      index,
      tabType,
      navigation,
      analytics,
      showToast,
    });
  }, [item, index, tabType, navigation, analytics, showToast]);

  /**
   * 点赞事件处理
   * 使用统一模块的点赞事件处理器
   */
  const handleLikePress = useCallback(() => {
    // 这里可以调用统一的点赞处理器
    console.log('点赞处理:', item.id);
    onLike?.();
  }, [item.id, onLike]);

  /**
   * 用户信息点击事件处理
   */
  const handleUserPress = useCallback((clickType: 'avatar' | 'nickname' | 'userInfo' = 'userInfo') => {
    // 这里可以调用统一的用户点击处理器
    console.log('用户点击:', { userId: item.user.id, clickType });
  }, [item.user.id]);
  // #endregion

  // #region 3.3 计算属性区域
  /**
   * 优化后的图片URL
   */
  const optimizedImageUrl = useMemo(() => 
    getOptimizedImageUrl(item.imageUrl, imageQuality), 
    [item.imageUrl, imageQuality]
  );

  /**
   * 计算图片显示高度
   */
  const calculatedImageHeight = useMemo(() => 
    calculateImageDisplayHeight(item.width, item.height), 
    [item.width, item.height]
  );

  /**
   * 格式化后的点赞数显示
   */
  const formattedLikeCount = useMemo(() => 
    formatDisplayCount(item.likeCount), 
    [item.likeCount]
  );
  // #endregion

  // #region 3.4 渲染逻辑区域
  return (
    <Pressable
      style={[waterfallCardStyles.container, style]}
      onPress={handleCardPress}
      onLongPress={onLongPress}
      android_ripple={{ color: 'rgba(0,0,0,0.1)' }}
    >
      {/* 图片容器 */}
      <View style={waterfallCardStyles.imageContainer}>
        <Image
          style={[waterfallCardStyles.image, { height: calculatedImageHeight }]}
          source={{ uri: optimizedImageUrl }}
          onLoadStart={() => setImageLoaded(false)}
          onLoad={() => setImageLoaded(true)}
          onError={() => setImageError(true)}
          resizeMode="cover"
        />
        
        {/* 图片加载指示器 */}
        {!imageLoaded && !imageError && (
          <View style={waterfallCardStyles.loadingContainer}>
            <ActivityIndicator size="small" color={COLORS.PRIMARY} />
          </View>
        )}

        {/* 图片加载错误 */}
        {imageError && (
          <View style={waterfallCardStyles.errorContainer}>
            <Text style={waterfallCardStyles.errorText}>加载失败</Text>
          </View>
        )}
        
        {/* 内容类型标识 */}
        <MediaTypeIndicator type={item.type as MediaType} />
      </View>
      
      {/* 内容信息区域 */}
      <View style={waterfallCardStyles.contentInfo}>
        {/* 内容标题/描述 */}
        <Text style={waterfallCardStyles.contentTitle} numberOfLines={3}>
          {item.title}
        </Text>

        {/* 用户信息行 */}
        <View style={waterfallCardStyles.userRow}>
          {/* 用户信息 - 可点击区域 */}
          <TouchableOpacity 
            style={waterfallCardStyles.userInfo}
            onPress={() => handleUserPress('userInfo')}
            activeOpacity={0.7}
          >
            <TouchableOpacity 
              onPress={() => handleUserPress('avatar')}
              activeOpacity={0.8}
            >
              <Image
                source={{ uri: item.user.avatar }}
                style={waterfallCardStyles.userAvatar}
              />
            </TouchableOpacity>
            <TouchableOpacity 
              style={waterfallCardStyles.nicknameContainer}
              onPress={() => handleUserPress('nickname')}
              activeOpacity={0.8}
            >
              <Text style={waterfallCardStyles.userNickname} numberOfLines={1}>
                {item.user.nickname}
              </Text>
            </TouchableOpacity>
          </TouchableOpacity>

          {/* 点赞信息 */}
          <TouchableOpacity 
            style={waterfallCardStyles.likeContainer}
            onPress={handleLikePress}
          >
            <Text style={[
              waterfallCardStyles.likeIcon, 
              { color: item.isLiked ? COLORS.LIKE_ACTIVE : COLORS.LIKE_INACTIVE }
            ]}>
              ♥
            </Text>
            <Text style={waterfallCardStyles.likeCount}>
              {formattedLikeCount}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </Pressable>
  );
  // #endregion
};

WaterfallCard.displayName = 'WaterfallCard';
// #endregion

// #region 4. 样式定义区域
// ==========================================
/**
 * 瀑布流卡片样式定义
 * 基于统一模块的设计系统规范
 */
const waterfallCardStyles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.CARD_BACKGROUND,
    borderRadius: LAYOUT_CONSTANTS.CARD_RADIUS,
    marginBottom: 0,
    shadowOffset: LAYOUT_CONSTANTS.CARD_SHADOW_OFFSET,
    shadowOpacity: LAYOUT_CONSTANTS.CARD_SHADOW_OPACITY,
    shadowRadius: LAYOUT_CONSTANTS.CARD_SHADOW_RADIUS,
    shadowColor: COLORS.SHADOW,
    elevation: 3,
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
    padding: LAYOUT_CONSTANTS.MARGIN_SMALL,
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
// #endregion

// #region 5. 导出声明区域
// ==========================================
/**
 * 导出瀑布流卡片组件
 * 使用 memo 包装以优化性能
 */
export default memo(WaterfallCard);
// #endregion
