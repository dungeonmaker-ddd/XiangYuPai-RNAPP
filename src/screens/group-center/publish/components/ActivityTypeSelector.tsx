/**
 * 🎯 活动类型选择器组件
 * 
 * 功能：
 * - 6种活动类型的网格选择界面
 * - 选中状态的视觉反馈
 * - 验证状态显示
 * - 点击动画效果
 */

import React, { useCallback } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Animated,
} from 'react-native';

import {
  ActivityType,
  ActivityTypeSelectorProps,
  ValidationState,
} from '../types';
import {
  COLORS,
  SPACING,
  BORDER_RADIUS,
  FONT_SIZE,
  FONT_WEIGHT,
  ACTIVITY_TYPES,
  TEXTS,
} from '../constants';

// ══════════════════════════════════════════════════════════════
// 1. 子组件：活动类型卡片
// ══════════════════════════════════════════════════════════════

interface ActivityTypeCardProps {
  config: typeof ACTIVITY_TYPES[0];
  isSelected: boolean;
  onPress: () => void;
}

const ActivityTypeCard: React.FC<ActivityTypeCardProps> = ({
  config,
  isSelected,
  onPress,
}) => {
  const scaleValue = React.useRef(new Animated.Value(1)).current;

  const handlePressIn = useCallback(() => {
    Animated.spring(scaleValue, {
      toValue: 0.95,
      useNativeDriver: true,
    }).start();
  }, [scaleValue]);

  const handlePressOut = useCallback(() => {
    Animated.spring(scaleValue, {
      toValue: 1,
      useNativeDriver: true,
    }).start();
  }, [scaleValue]);

  return (
    <TouchableOpacity
      style={styles.cardContainer}
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      activeOpacity={0.8}
    >
      <Animated.View
        style={[
          styles.card,
          { backgroundColor: config.bgColor },
          isSelected && styles.cardSelected,
          { transform: [{ scale: scaleValue }] },
        ]}
      >
        {/* 选中状态指示器 */}
        {isSelected && (
          <View style={styles.selectedIndicator}>
            <Text style={styles.checkMark}>✓</Text>
          </View>
        )}
        
        {/* 图标区域 */}
        <View style={styles.iconContainer}>
          <Text style={styles.emoji}>{config.emoji}</Text>
        </View>
        
        {/* 文字标签 */}
        <Text style={[styles.label, { color: config.color }]}>
          {config.name}
        </Text>
      </Animated.View>
    </TouchableOpacity>
  );
};

// ══════════════════════════════════════════════════════════════
// 2. 主组件：活动类型选择器
// ══════════════════════════════════════════════════════════════

const ActivityTypeSelector: React.FC<ActivityTypeSelectorProps> = ({
  selectedType,
  onTypeSelect,
  validation,
}) => {
  // 处理类型选择
  const handleTypeSelect = useCallback((type: ActivityType) => {
    onTypeSelect(type);
  }, [onTypeSelect]);

  // 渲染验证错误信息
  const renderValidationMessage = () => {
    if (!validation) return null;

    if (validation.error) {
      return (
        <Text style={styles.errorText}>
          {validation.error}
        </Text>
      );
    }

    if (validation.warning) {
      return (
        <Text style={styles.warningText}>
          {validation.warning}
        </Text>
      );
    }

    return null;
  };

  return (
    <View style={styles.container}>
      {/* 标题区域 */}
      <View style={styles.header}>
        <Text style={styles.title}>
          {TEXTS.ACTIVITY_TYPE.TITLE}
        </Text>
        <Text style={styles.requiredMark}>
          {TEXTS.ACTIVITY_TYPE.REQUIRED_HINT}
        </Text>
      </View>

      {/* 副标题 */}
      <Text style={styles.subtitle}>
        {TEXTS.ACTIVITY_TYPE.SUBTITLE}
      </Text>

      {/* 类型网格 */}
      <View style={styles.grid}>
        {ACTIVITY_TYPES.map((config) => (
          <ActivityTypeCard
            key={config.id}
            config={config}
            isSelected={selectedType === config.id}
            onPress={() => handleTypeSelect(config.id)}
          />
        ))}
      </View>

      {/* 验证信息 */}
      {renderValidationMessage()}
    </View>
  );
};

// ══════════════════════════════════════════════════════════════
// 3. 样式定义
// ══════════════════════════════════════════════════════════════

const styles = StyleSheet.create({
  // 容器样式
  container: {
    paddingHorizontal: SPACING.MD,
    paddingVertical: SPACING.LG,
  },

  // 标题区域
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.SM,
  },

  title: {
    fontSize: FONT_SIZE.LG,
    fontWeight: FONT_WEIGHT.SEMIBOLD,
    color: COLORS.TEXT_PRIMARY,
    marginRight: SPACING.SM,
  },

  requiredMark: {
    fontSize: FONT_SIZE.SM,
    color: COLORS.ERROR,
    fontWeight: FONT_WEIGHT.MEDIUM,
  },

  subtitle: {
    fontSize: FONT_SIZE.MD,
    color: COLORS.TEXT_SECONDARY,
    marginBottom: SPACING.LG,
  },

  // 网格布局
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginHorizontal: -SPACING.SM / 2,
  },

  // 卡片容器
  cardContainer: {
    width: '31%', // 3列布局，留出间距
    marginBottom: SPACING.MD,
    marginHorizontal: SPACING.SM / 2,
  },

  // 卡片样式
  card: {
    aspectRatio: 1, // 正方形
    borderRadius: BORDER_RADIUS.LG,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    shadowColor: COLORS.BLACK,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },

  cardSelected: {
    borderWidth: 3,
    borderColor: COLORS.PRIMARY,
    shadowColor: COLORS.PRIMARY,
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },

  // 选中指示器
  selectedIndicator: {
    position: 'absolute',
    top: SPACING.SM,
    right: SPACING.SM,
    width: 24,
    height: 24,
    borderRadius: BORDER_RADIUS.FULL,
    backgroundColor: COLORS.PRIMARY,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },

  checkMark: {
    color: COLORS.WHITE,
    fontSize: FONT_SIZE.SM,
    fontWeight: FONT_WEIGHT.BOLD,
  },

  // 图标区域
  iconContainer: {
    marginBottom: SPACING.SM,
  },

  emoji: {
    fontSize: 32,
  },

  // 文字标签
  label: {
    fontSize: FONT_SIZE.MD,
    fontWeight: FONT_WEIGHT.SEMIBOLD,
    textAlign: 'center',
  },

  // 验证信息
  errorText: {
    fontSize: FONT_SIZE.SM,
    color: COLORS.ERROR,
    marginTop: SPACING.SM,
    textAlign: 'center',
  },

  warningText: {
    fontSize: FONT_SIZE.SM,
    color: COLORS.WARNING,
    marginTop: SPACING.SM,
    textAlign: 'center',
  },
});

export default ActivityTypeSelector;
