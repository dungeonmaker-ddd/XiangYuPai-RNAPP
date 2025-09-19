/**
 * 举报类型选择组件
 * 
 * 功能：
 * - 展示8种举报类型的网格选择器
 * - 支持单选模式，选中状态有紫色边框和文字
 * - 包含选中状态的动画效果
 */

// #region [1] Imports
import React, { useCallback } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Animated,
} from 'react-native';

import { ReportType, ReportValidationError } from '../types';
import { REPORT_CONSTANTS } from '../constants';
// #endregion

// #region [2] Types
interface ReportTypeSelectorProps {
  reportTypes: ReportType[];
  selectedType: ReportType | null;
  onTypeSelect: (type: ReportType) => void;
  validationError?: ReportValidationError;
}

interface TypeCardProps {
  type: ReportType;
  isSelected: boolean;
  onPress: (type: ReportType) => void;
}
// #endregion

// #region [3] Constants
const CARD_CONFIG = {
  cardHeight: 56,
  borderRadius: 12,
  animationDuration: 200,
  cardsPerRow: 2,
} as const;

const CARD_SPACING = {
  horizontal: 16,
  vertical: 12,
  grid: 12,
} as const;
// #endregion

// #region [4] Subcomponents
/**
 * 单个举报类型卡片组件
 */
const TypeCard: React.FC<TypeCardProps> = ({ type, isSelected, onPress }) => {
  const animatedValue = React.useRef(new Animated.Value(isSelected ? 1 : 0)).current;

  React.useEffect(() => {
    Animated.timing(animatedValue, {
      toValue: isSelected ? 1 : 0,
      duration: CARD_CONFIG.animationDuration,
      useNativeDriver: false,
    }).start();
  }, [isSelected, animatedValue]);

  const handlePress = useCallback(() => {
    onPress(type);
  }, [type, onPress]);

  const borderColor = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: ['#E0E0E0', REPORT_CONSTANTS.COLORS.PRIMARY],
  });

  const textColor = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: ['#666666', REPORT_CONSTANTS.COLORS.PRIMARY],
  });

  return (
    <TouchableOpacity
      style={styles.cardTouchable}
      onPress={handlePress}
      activeOpacity={0.8}
    >
      <Animated.View
        style={[
          styles.card,
          {
            borderColor,
            borderWidth: isSelected ? 2 : 1,
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
        >
          {type.label}
        </Animated.Text>
      </Animated.View>
    </TouchableOpacity>
  );
};
// #endregion

// #region [5] Main Component
/**
 * 举报类型选择器主组件
 */
export const ReportTypeSelector: React.FC<ReportTypeSelectorProps> = ({
  reportTypes,
  selectedType,
  onTypeSelect,
  validationError,
}) => {
  const handleTypeSelect = useCallback((type: ReportType) => {
    onTypeSelect(type);
  }, [onTypeSelect]);

  return (
    <View style={styles.container}>
      {/* 标题区域 */}
      <View style={styles.titleContainer}>
        <Text style={styles.title}>请选择你要举报的类型</Text>
        {validationError && (
          <Text style={styles.errorText}>{validationError.message}</Text>
        )}
      </View>

      {/* 类型选择网格 */}
      <View style={styles.gridContainer}>
        {reportTypes.map((type, index) => (
          <TypeCard
            key={type.id}
            type={type}
            isSelected={selectedType?.id === type.id}
            onPress={handleTypeSelect}
          />
        ))}
      </View>
    </View>
  );
};
// #endregion

// #region [6] Styles
const styles = StyleSheet.create({
  container: {
    paddingHorizontal: CARD_SPACING.horizontal,
    paddingTop: 32,
    paddingBottom: 24,
  },

  // 标题样式
  titleContainer: {
    marginBottom: 24,
  },
  title: {
    fontSize: 18,
    color: '#333333',
    fontWeight: '600',
    lineHeight: 24,
  },
  errorText: {
    fontSize: 14,
    color: '#FF4444',
    marginTop: 8,
    lineHeight: 20,
  },

  // 网格容器样式
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: CARD_SPACING.grid,
  },

  // 卡片样式
  cardTouchable: {
    width: `48%`, // 每行两个，留出间距
    marginBottom: CARD_SPACING.vertical,
  },
  card: {
    height: CARD_CONFIG.cardHeight,
    borderRadius: CARD_CONFIG.borderRadius,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    shadowColor: '#000000',
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

export default ReportTypeSelector;
