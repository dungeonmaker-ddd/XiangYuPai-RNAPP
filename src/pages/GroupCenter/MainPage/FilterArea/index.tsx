/**
 * ✅ 筛选标签区域组件
 * 提供快速筛选和类型标签切换功能
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
 * FilterArea - 筛选标签区域
 * 
 * TOC (快速跳转):
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
// #endregion

// #region 2. Imports
import React from 'react';
import { View, StyleSheet } from 'react-native';

// 导入子功能区域
import { QuickFilters } from './QuickFilters';
import { TypeTabs } from './TypeTabs';

// 导入类型和常量
import type { FilterAreaProps } from './types';
import { FILTER_CONSTANTS } from './constants';
import { COLORS, SPACING } from '../constants';
// #endregion

// #region 3. Types & Schema
// Props接口定义在 types.ts 中
// #endregion

// #region 4. Constants & Config
// 本地常量在 constants.ts 中定义
// #endregion

// #region 5. Utils & Helpers
// 本地工具函数（如果需要）
// #endregion

// #region 6. State Management
// 状态管理由父组件传递
// #endregion

// #region 7. Domain Logic
// 业务逻辑函数（如果需要）
// #endregion

// #region 8. UI Components & Rendering
export const FilterArea: React.FC<FilterAreaProps> = ({
  filter,
  onFilterChange,
  onAdvancedPress,
}) => {
  return (
    <View style={styles.container}>
      {/* 快速筛选区域 */}
      <QuickFilters
        sort={filter.sort}
        gender={filter.gender}
        onSortChange={(sort) => onFilterChange({ sort })}
        onGenderChange={(gender) => onFilterChange({ gender })}
        onAdvancedPress={onAdvancedPress}
      />
      
      {/* 类型标签区域 */}
      <TypeTabs
        selectedType={filter.activityType}
        onTypeChange={(activityType) => onFilterChange({ activityType })}
      />
    </View>
  );
};

// 样式定义
const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.CARD_BACKGROUND,
    paddingVertical: SPACING.SM,
  },
});
// #endregion

// #region 9. Exports
export default FilterArea;
export type { FilterAreaProps } from './types';
// #endregion
