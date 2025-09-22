/**
 * 🟢 类型标签功能区域 - 扁平实现
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
 * TypeTabs - 类型标签功能区域
 * 简单的活动类型标签展示，支持横向滚动和选中状态
 */
// #endregion

// #region 2. Imports
import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';

// 导入工具函数
import { utilsDisplay } from './utilsDisplay';
import { processData } from './processData';

// 导入类型和常量
import type { TypeTabsProps } from '../types';
import { TYPE_TAB_CONSTANTS } from './constants';
import { COLORS, FONT_SIZE, SPACING, BORDER_RADIUS } from '../../constants';
import { ACTIVITY_TYPES } from '../../constants';
// #endregion

// #region 3. Types & Schema
// Props接口定义在父级 types.ts 中
// #endregion

// #region 4. Constants & Config
// 常量定义在 constants.ts 中
// #endregion

// #region 5. Utils & Helpers
// 工具函数在 utilsDisplay.ts 中定义
// #endregion

// #region 6. State Management
// 简单组件无需复杂状态管理
// #endregion

// #region 7. Domain Logic
// 数据处理在 processData.ts 中定义
// #endregion

// #region 8. UI Components & Rendering
export const TypeTabs: React.FC<TypeTabsProps> = ({
  selectedType,
  onTypeChange,
}) => {
  // 处理标签数据
  const tabsData = processData.processTabsData(ACTIVITY_TYPES);
  
  // 处理标签点击
  const handleTabPress = (type: typeof selectedType) => {
    if (type !== selectedType) {
      onTypeChange(type);
    }
  };

  // 渲染标签项
  const renderTabItem = (type: typeof selectedType, label: string) => {
    const isSelected = type === selectedType;
    const tabStyle = utilsDisplay.getTabStyle(isSelected);
    const textStyle = utilsDisplay.getTabTextStyle(isSelected);

    return (
      <TouchableOpacity
        key={type}
        style={[styles.tab, tabStyle]}
        onPress={() => handleTabPress(type)}
        activeOpacity={0.8}
      >
        <Text style={[styles.tabText, textStyle]}>
          {label}
        </Text>
      </TouchableOpacity>
    );
  };

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.container}
    >
      {/* 全部标签 */}
      {renderTabItem('all', '全部')}
      
      {/* 活动类型标签 */}
      {tabsData.map(({ key, label }) => 
        renderTabItem(key, label)
      )}
    </ScrollView>
  );
};

// 样式定义
const styles = StyleSheet.create({
  container: {
    paddingHorizontal: SPACING.LG,
    marginTop: SPACING.SM,
    alignItems: 'center',
  },
  tab: {
    paddingHorizontal: SPACING.MD,
    paddingVertical: SPACING.SM,
    borderRadius: BORDER_RADIUS.LG,
    marginRight: SPACING.SM,
    backgroundColor: COLORS.BACKGROUND,
    minWidth: TYPE_TAB_CONSTANTS.TAB_MIN_WIDTH,
    height: TYPE_TAB_CONSTANTS.TAB_HEIGHT,
    justifyContent: 'center',
    alignItems: 'center',
  },
  tabText: {
    fontSize: FONT_SIZE.SM,
    color: COLORS.TEXT_PRIMARY,
  },
});
// #endregion

// #region 9. Exports
export default TypeTabs;
// #endregion
