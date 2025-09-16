/**
 * 骨架屏加载组件
 * 用于显示加载状态的占位符
 */

import React, { useEffect, useRef } from 'react';
import {
  View,
  StyleSheet,
  Animated,
} from 'react-native';

import { COLORS, SIZES } from '../constants';

interface SkeletonLoaderProps {
  width: number;
  height: number;
  borderRadius?: number;
  style?: any;
}

export const SkeletonLoader: React.FC<SkeletonLoaderProps> = ({
  width,
  height,
  borderRadius = 4,
  style,
}) => {
  const animatedValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(animatedValue, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: false,
        }),
        Animated.timing(animatedValue, {
          toValue: 0,
          duration: 1000,
          useNativeDriver: false,
        }),
      ])
    );

    animation.start();

    return () => animation.stop();
  }, [animatedValue]);

  const backgroundColor = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: ['#E1E9EE', '#F2F8FC'],
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

export const TransactionSectionSkeleton: React.FC = () => (
  <View style={styles.transactionContainer}>
    <View style={styles.transactionCard}>
      {/* 标题骨架 */}
      <SkeletonLoader width={60} height={16} borderRadius={8} />
      
      {/* 功能网格骨架 */}
      <View style={styles.functionGrid}>
        {Array.from({ length: 4 }).map((_, index) => (
          <FunctionCardSkeleton key={index} />
        ))}
      </View>
      
      {/* 统计信息骨架 */}
      <View style={styles.statsContainer}>
        <View style={styles.statsRow}>
          {Array.from({ length: 4 }).map((_, index) => (
            <View key={index} style={styles.statItem}>
              <SkeletonLoader width={24} height={16} borderRadius={8} />
              <SkeletonLoader
                width={32}
                height={12}
                borderRadius={6}
                style={{ marginTop: 4 }}
              />
            </View>
          ))}
        </View>
      </View>
    </View>
  </View>
);

const styles = StyleSheet.create({
  skeleton: {
    backgroundColor: '#E1E9EE',
  },
  functionCardContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    width: SIZES.FUNCTION_CARD_SIZE,
    height: SIZES.FUNCTION_CARD_SIZE,
  },
  transactionContainer: {
    paddingHorizontal: SIZES.PADDING_M,
    marginTop: -SIZES.PADDING_XL,
  },
  transactionCard: {
    backgroundColor: COLORS.WHITE,
    borderRadius: SIZES.CARD_RADIUS + 4,
    paddingVertical: SIZES.PADDING_XL,
    paddingHorizontal: SIZES.PADDING_L,
    shadowColor: COLORS.PRIMARY,
    shadowOffset: {
      width: 0,
      height: 6,
    },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
  },
  functionGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: SIZES.PADDING_M,
    marginBottom: SIZES.PADDING_M,
  },
  statsContainer: {
    borderTopWidth: 1,
    borderTopColor: COLORS.LIGHT_GRAY,
    paddingTop: SIZES.PADDING_M,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  statItem: {
    alignItems: 'center',
  },
});

export default SkeletonLoader;
