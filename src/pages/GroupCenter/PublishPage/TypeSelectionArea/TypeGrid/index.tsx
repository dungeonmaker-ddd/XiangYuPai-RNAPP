/**
 * 🔸 类型网格功能区域 - 复杂选择逻辑嵌套实现
 * 
 * TOC (quick jump):
 * [1] File Banner & TOC
 * [2] Imports
 * [3] Types & Schema
 * [4] Constants & Config
 * [5] Utils & Helpers
 * [6] State Management
 * [7] Domain Logic
 * [8] UI Components & Rendering
 * [9] Exports
 */

// #region 1. File Banner & TOC
/**
 * TypeGrid - 类型网格功能区域
 * 处理复杂的类型选择逻辑，包括6种活动类型的网格展示和选择交互
 */
// #endregion

// #region 2. Imports
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Animated } from 'react-native';

// 导入本地模块
import { useTypeSelection } from './useTypeSelection';
import { onTypeSelect } from './onTypeSelect';
import { processTypeData } from './processTypeData';
import { utilsType } from './utilsType';

// 导入类型和常量
import type { TypeGridProps } from '../types';
import { TYPE_GRID_CONSTANTS } from './constants';
import { COLORS, SPACING, BORDER_RADIUS, FONT_SIZE, FONT_WEIGHT, ACTIVITY_TYPES } from '../../constants';
// #endregion

// #region 3. Types & Schema
// Props接口定义在父级 types.ts 中
// #endregion

// #region 4. Constants & Config
// 常量定义在 constants.ts 中
// #endregion

// #region 5. Utils & Helpers
// 工具函数在 utilsType.ts 中定义
// #endregion

// #region 6. State Management
// 状态管理在 useTypeSelection.ts 中定义
// #endregion

// #region 7. Domain Logic
// 事件处理在 onTypeSelect.ts 中定义
// #endregion

// #region 8. UI Components & Rendering
export const TypeGrid: React.FC<TypeGridProps> = ({
  selectedType,
  onTypeSelect: onTypeSelectProp,
}) => {
  // 使用本地状态管理
  const { selectionState, updateSelectionState } = useTypeSelection({ selectedType });
  
  // 处理类型数据
  const typesData = processTypeData.processActivityTypes(ACTIVITY_TYPES);

  // 渲染类型卡片
  const renderTypeCard = (config: any) => {
    const isSelected = selectedType === config.id;
    const cardStyle = utilsType.getCardStyle(isSelected, config.bgColor);
    
    const handlePress = () => {
      onTypeSelect.handleTypeSelect(onTypeSelectProp, config.id, updateSelectionState);
    };

    return (
      <TouchableOpacity
        key={config.id}
        style={styles.cardContainer}
        onPress={handlePress}
        activeOpacity={0.8}
      >
        <Animated.View style={[styles.card, cardStyle]}>
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

  return (
    <View style={styles.container}>
      <View style={styles.grid}>
        {typesData.map(renderTypeCard)}
      </View>
    </View>
  );
};

// 样式定义
const styles = StyleSheet.create({
  container: {
    marginBottom: SPACING.LG,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginHorizontal: -SPACING.SM / 2,
  },
  cardContainer: {
    width: '31%', // 3列布局，留出间距
    marginBottom: SPACING.MD,
    marginHorizontal: SPACING.SM / 2,
  },
  card: {
    aspectRatio: TYPE_GRID_CONSTANTS.CARD_ASPECT_RATIO,
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
  selectedIndicator: {
    position: 'absolute',
    top: SPACING.SM,
    right: SPACING.SM,
    width: 24,
    height: 24,
    borderRadius: 12,
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
  iconContainer: {
    marginBottom: SPACING.SM,
  },
  emoji: {
    fontSize: 32,
  },
  label: {
    fontSize: FONT_SIZE.MD,
    fontWeight: FONT_WEIGHT.SEMIBOLD,
    textAlign: 'center',
  },
});
// #endregion

// #region 9. Exports
export default TypeGrid;
// #endregion
