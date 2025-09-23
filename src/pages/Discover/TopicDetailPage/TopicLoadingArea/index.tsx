/**
 * 话题加载状态区域组件
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
import React, { memo, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
  Easing,
  Dimensions,
} from 'react-native';

import { TopicLoadingAreaProps } from '../types';
import { TOPIC_DETAIL_CONSTANTS } from '../constants';
// #endregion

// #region 2. Types & Schema
interface LoadingSkeletonProps {
  width: number | string;
  height: number;
  borderRadius?: number;
  style?: any;
}
// #endregion

// #region 3. Constants & Config
const { width: screenWidth } = Dimensions.get('window');
const LOADING_ANIMATION_DURATION = 1500;
const SKELETON_BASE_COLOR = TOPIC_DETAIL_CONSTANTS.BORDER_LIGHT;
const SKELETON_HIGHLIGHT_COLOR = TOPIC_DETAIL_CONSTANTS.CARD_BACKGROUND;
// #endregion

// #region 4. Utils & Helpers
const getLoadingMessage = (type: string): string => {
  switch (type) {
    case 'initial':
      return '正在加载话题内容...';
    case 'loadMore':
      return '加载更多中...';
    case 'refresh':
      return '刷新中...';
    default:
      return TOPIC_DETAIL_CONSTANTS.LOADING_TEXT;
  }
};
// #endregion

// #region 5. State Management
const TopicLoadingArea: React.FC<TopicLoadingAreaProps> = ({
  type,
  message,
}) => {
  // 动画值
  const shimmerAnimation = useRef(new Animated.Value(0)).current;
  const fadeAnimation = useRef(new Animated.Value(0)).current;
// #endregion

// #region 6. Domain Logic
  // 启动闪烁动画
  useEffect(() => {
    // 淡入动画
    Animated.timing(fadeAnimation, {
      toValue: 1,
      duration: TOPIC_DETAIL_CONSTANTS.FAST_DURATION,
      useNativeDriver: true,
    }).start();

    // 持续的闪烁动画
    const shimmerLoop = Animated.loop(
      Animated.timing(shimmerAnimation, {
        toValue: 1,
        duration: LOADING_ANIMATION_DURATION,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    );
    
    shimmerLoop.start();
    
    return () => {
      shimmerLoop.stop();
    };
  }, [shimmerAnimation, fadeAnimation]);

  // 获取闪烁动画样式
  const getShimmerStyle = () => {
    const translateX = shimmerAnimation.interpolate({
      inputRange: [0, 1],
      outputRange: [-screenWidth, screenWidth],
    });

    return {
      transform: [{ translateX }],
    };
  };
// #endregion

// #region 7. UI Components & Rendering
  // 骨架屏组件
  const LoadingSkeleton: React.FC<LoadingSkeletonProps> = ({
    width,
    height,
    borderRadius = TOPIC_DETAIL_CONSTANTS.SMALL_BORDER_RADIUS,
    style,
  }) => (
    <View
      style={[
        styles.skeletonContainer,
        {
          width,
          height,
          borderRadius,
        },
        style,
      ]}
    >
      <Animated.View style={[styles.shimmerOverlay, getShimmerStyle()]} />
    </View>
  );

  // 渲染不同类型的加载状态
  const renderLoadingContent = () => {
    switch (type) {
      case 'initial':
        return (
          <View style={styles.initialLoadingContainer}>
            {/* 渲染多个骨架屏卡片 */}
            {[...Array(3)].map((_, index) => (
              <View key={index} style={styles.skeletonCard}>
                {/* 用户信息骨架 */}
                <View style={styles.skeletonUserInfo}>
                  <LoadingSkeleton
                    width={TOPIC_DETAIL_CONSTANTS.AVATAR_SIZE}
                    height={TOPIC_DETAIL_CONSTANTS.AVATAR_SIZE}
                    borderRadius={TOPIC_DETAIL_CONSTANTS.AVATAR_BORDER_RADIUS}
                  />
                  <View style={styles.skeletonUserText}>
                    <LoadingSkeleton width="60%" height={16} style={{ marginBottom: 4 }} />
                    <LoadingSkeleton width="40%" height={12} />
                  </View>
                  <LoadingSkeleton width={60} height={12} />
                </View>
                
                {/* 内容骨架 */}
                <View style={styles.skeletonContent}>
                  <LoadingSkeleton width="90%" height={20} style={{ marginBottom: 8 }} />
                  <LoadingSkeleton width="100%" height={16} style={{ marginBottom: 4 }} />
                  <LoadingSkeleton width="80%" height={16} style={{ marginBottom: 8 }} />
                  <LoadingSkeleton width="50%" height={14} />
                </View>
                
                {/* 图片骨架 */}
                <LoadingSkeleton
                  width="100%"
                  height={200}
                  borderRadius={TOPIC_DETAIL_CONSTANTS.BORDER_RADIUS}
                  style={{ marginVertical: TOPIC_DETAIL_CONSTANTS.MEDIUM_SPACING }}
                />
                
                {/* 互动按钮骨架 */}
                <View style={styles.skeletonInteraction}>
                  <LoadingSkeleton width={60} height={24} style={{ marginRight: 20 }} />
                  <LoadingSkeleton width={60} height={24} style={{ marginRight: 20 }} />
                  <View style={styles.flex} />
                  <LoadingSkeleton width={40} height={24} />
                </View>
              </View>
            ))}
          </View>
        );
      
      case 'loadMore':
        return (
          <View style={styles.loadMoreContainer}>
            <View style={styles.loadingIndicator}>
              <LoadingSkeleton
                width={24}
                height={24}
                borderRadius={12}
                style={{ marginRight: TOPIC_DETAIL_CONSTANTS.SMALL_SPACING }}
              />
              <Text style={styles.loadingText}>
                {message || getLoadingMessage(type)}
              </Text>
            </View>
          </View>
        );
      
      case 'refresh':
        return (
          <View style={styles.refreshContainer}>
            <LoadingSkeleton
              width={32}
              height={32}
              borderRadius={16}
              style={{ marginBottom: TOPIC_DETAIL_CONSTANTS.SMALL_SPACING }}
            />
            <Text style={styles.loadingText}>
              {message || getLoadingMessage(type)}
            </Text>
          </View>
        );
      
      default:
        return (
          <View style={styles.defaultContainer}>
            <Text style={styles.loadingText}>
              {message || getLoadingMessage(type)}
            </Text>
          </View>
        );
    }
  };

  return (
    <Animated.View style={[styles.container, { opacity: fadeAnimation }]}>
      {renderLoadingContent()}
    </Animated.View>
  );
// #endregion

// #region 8. Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  
  // 骨架屏样式
  skeletonContainer: {
    backgroundColor: SKELETON_BASE_COLOR,
    overflow: 'hidden',
  },
  shimmerOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: SKELETON_HIGHLIGHT_COLOR,
    opacity: 0.3,
  },
  
  // 初始加载
  initialLoadingContainer: {
    paddingHorizontal: TOPIC_DETAIL_CONSTANTS.SECTION_PADDING,
    paddingTop: TOPIC_DETAIL_CONSTANTS.LARGE_SPACING,
  },
  skeletonCard: {
    backgroundColor: TOPIC_DETAIL_CONSTANTS.CARD_BACKGROUND,
    borderRadius: TOPIC_DETAIL_CONSTANTS.BORDER_RADIUS,
    padding: TOPIC_DETAIL_CONSTANTS.CARD_PADDING,
    marginBottom: TOPIC_DETAIL_CONSTANTS.MEDIUM_SPACING,
    shadowColor: TOPIC_DETAIL_CONSTANTS.SHADOW_COLOR,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: TOPIC_DETAIL_CONSTANTS.SHADOW_OPACITY,
    shadowRadius: 4,
    elevation: TOPIC_DETAIL_CONSTANTS.SHADOW_ELEVATION,
  },
  skeletonUserInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: TOPIC_DETAIL_CONSTANTS.MEDIUM_SPACING,
  },
  skeletonUserText: {
    flex: 1,
    marginLeft: TOPIC_DETAIL_CONSTANTS.ITEM_SPACING,
  },
  skeletonContent: {
    marginBottom: TOPIC_DETAIL_CONSTANTS.MEDIUM_SPACING,
  },
  skeletonInteraction: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: TOPIC_DETAIL_CONSTANTS.ITEM_SPACING,
    borderTopWidth: 1,
    borderTopColor: TOPIC_DETAIL_CONSTANTS.BORDER_LIGHT,
  },
  
  // 加载更多
  loadMoreContainer: {
    paddingVertical: TOPIC_DETAIL_CONSTANTS.LARGE_SPACING,
    alignItems: 'center',
  },
  loadingIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  
  // 刷新
  refreshContainer: {
    paddingVertical: TOPIC_DETAIL_CONSTANTS.HUGE_SPACING,
    alignItems: 'center',
  },
  
  // 默认
  defaultContainer: {
    paddingVertical: TOPIC_DETAIL_CONSTANTS.LARGE_SPACING,
    alignItems: 'center',
  },
  
  // 通用样式
  loadingText: {
    fontSize: TOPIC_DETAIL_CONSTANTS.FONT.NORMAL,
    color: TOPIC_DETAIL_CONSTANTS.TEXT_TERTIARY,
    fontWeight: TOPIC_DETAIL_CONSTANTS.FONT_WEIGHT.MEDIUM,
  },
  flex: {
    flex: 1,
  },
});
// #endregion

// #region 9. Exports
export default memo(TopicLoadingArea);
// #endregion
