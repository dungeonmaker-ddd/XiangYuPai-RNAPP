// #region 1. File Banner & TOC
/**
 * 骨架屏加载组件 - 用于显示加载状态的占位符
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
// #endregion

// #region 2. Imports
import React, { useEffect, useRef } from 'react';
import {
  View,
  StyleSheet,
  Animated,
} from 'react-native';

// 内部导入
import { COLORS, SIZES } from '../../constants';
// #endregion

// #region 3. Types & Schema
interface SkeletonLoaderProps {
  width: number;
  height: number;
  borderRadius?: number;
  style?: any;
}
// #endregion

// #region 4. Constants & Config
const ANIMATION_DURATION = 1000;
const SKELETON_COLORS = {
  START: '#E1E9EE',
  END: '#F2F8FC',
};
// #endregion

// #region 5. Utils & Helpers
// 无复杂工具函数需求
// #endregion

// #region 6. State Management
// 动画状态通过useRef管理
// #endregion

// #region 7. Domain Logic
// 动画逻辑
const createSkeletonAnimation = (animatedValue: Animated.Value) => {
  return Animated.loop(
    Animated.sequence([
      Animated.timing(animatedValue, {
        toValue: 1,
        duration: ANIMATION_DURATION,
        useNativeDriver: false,
      }),
      Animated.timing(animatedValue, {
        toValue: 0,
        duration: ANIMATION_DURATION,
        useNativeDriver: false,
      }),
    ])
  );
};
// #endregion

// #region 8. UI Components & Rendering
export const SkeletonLoader: React.FC<SkeletonLoaderProps> = ({
  width,
  height,
  borderRadius = 4,
  style,
}) => {
  const animatedValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const animation = createSkeletonAnimation(animatedValue);
    animation.start();

    return () => animation.stop();
  }, [animatedValue]);

  const backgroundColor = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [SKELETON_COLORS.START, SKELETON_COLORS.END],
  });

  return (
    <Animated.View
      style={[
        styles.skeleton,
        {
          width,
          height,
          borderRadius,
          backgroundColor,
        },
        style,
      ]}
    />
  );
};

// 预定义的骨架屏组件
export const AvatarSkeleton: React.FC = () => (
  <SkeletonLoader
    width={SIZES.AVATAR_SIZE}
    height={SIZES.AVATAR_SIZE}
    borderRadius={SIZES.AVATAR_SIZE / 2}
  />
);

export const FunctionCardSkeleton: React.FC = () => (
  <View style={styles.functionCardContainer}>
    <SkeletonLoader
      width={SIZES.FUNCTION_ICON_SIZE}
      height={SIZES.FUNCTION_ICON_SIZE}
      borderRadius={SIZES.ICON_RADIUS}
    />
    <SkeletonLoader
      width={SIZES.FUNCTION_CARD_SIZE - 8}
      height={12}
      borderRadius={6}
      style={{ marginTop: SIZES.PADDING_XXS }}
    />
  </View>
);

const styles = StyleSheet.create({
  skeleton: {
    backgroundColor: SKELETON_COLORS.START,
  },
  functionCardContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    width: SIZES.FUNCTION_CARD_SIZE,
    height: SIZES.FUNCTION_CARD_SIZE,
  },
});
// #endregion

// #region 9. Exports
export default SkeletonLoader;
// #endregion
