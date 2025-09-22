// #region 1. File Banner & TOC
/**
 * 举报类型卡片组件 - 单个举报类型的选择卡片
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
import React, { useCallback, useRef, useEffect } from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  Animated,
} from 'react-native';

// 内部导入
import { REPORT_CONSTANTS } from '../../constants';
// #endregion

// #region 3. Types & Schema
interface TypeCardProps {
  type: {
    id: string;
    label: string;
    description?: string;
  };
  isSelected: boolean;
  onPress: (type: any) => void;
  style?: any;
}
// #endregion

// #region 4. Constants & Config
const CARD_CONFIG = {
  height: 56,
  borderRadius: 12,
  animationDuration: 200,
  borderWidth: {
    normal: 1,
    selected: 2,
  },
} as const;
// #endregion

// #region 5. Utils & Helpers
// 无复杂工具函数需求
// #endregion

// #region 6. State Management
// 动画状态通过useRef管理
// #endregion

// #region 7. Domain Logic
// 事件处理逻辑
// #endregion

// #region 8. UI Components & Rendering
export const TypeCard: React.FC<TypeCardProps> = React.memo(({
  type,
  isSelected,
  onPress,
  style,
}) => {
  const animatedValue = useRef(new Animated.Value(isSelected ? 1 : 0)).current;

  // 选中状态动画
  useEffect(() => {
    Animated.timing(animatedValue, {
      toValue: isSelected ? 1 : 0,
      duration: CARD_CONFIG.animationDuration,
      useNativeDriver: false,
    }).start();
  }, [isSelected, animatedValue]);

  const handlePress = useCallback(() => {
    onPress(type);
  }, [type, onPress]);

  // 动画插值
  const borderColor = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [
      REPORT_CONSTANTS.COLORS.border.default,
      REPORT_CONSTANTS.COLORS.primary,
    ],
  });

  const textColor = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [
      REPORT_CONSTANTS.COLORS.text.secondary,
      REPORT_CONSTANTS.COLORS.primary,
    ],
  });

  return (
    <TouchableOpacity
      style={[styles.cardTouchable, style]}
      onPress={handlePress}
      activeOpacity={0.8}
      accessible={true}
      accessibilityRole="button"
      accessibilityLabel={`选择举报类型: ${type.label}`}
      accessibilityState={{ selected: isSelected }}
    >
      <Animated.View
        style={[
          styles.card,
          {
            borderColor,
            borderWidth: isSelected 
              ? CARD_CONFIG.borderWidth.selected 
              : CARD_CONFIG.borderWidth.normal,
          }
        ]}
      >
        <Animated.Text
          style={[
            styles.cardText,
            {
              color: textColor,
              fontWeight: isSelected ? '600' : '400',
            }
          ]}
          numberOfLines={1}
        >
          {type.label}
        </Animated.Text>
      </Animated.View>
    </TouchableOpacity>
  );
});

const styles = StyleSheet.create({
  cardTouchable: {
    // 尺寸由父组件控制
  },
  card: {
    height: CARD_CONFIG.height,
    borderRadius: CARD_CONFIG.borderRadius,
    backgroundColor: REPORT_CONSTANTS.COLORS.background.primary,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    shadowColor: REPORT_CONSTANTS.COLORS.text.primary,
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  cardText: {
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 22,
  },
});
// #endregion

// #region 9. Exports
export default TypeCard;
// #endregion
