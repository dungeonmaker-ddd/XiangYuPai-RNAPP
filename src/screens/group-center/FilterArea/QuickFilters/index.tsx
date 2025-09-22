/**
 * 🔸 快速筛选功能区域 - 复杂筛选逻辑嵌套实现
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
 * QuickFilters - 快速筛选功能区域
 * 处理复杂的筛选逻辑，包括排序、性别筛选和高级筛选入口
 */
// #endregion

// #region 2. Imports
import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';

// 导入本地模块
import { useFilters } from './useFilters';
import { onFilterChange } from './onFilterChange';
import { processFilterData } from './processFilterData';
import { utilsFilter } from './utilsFilter';

// 导入类型和常量
import type { QuickFiltersProps } from '../types';
import { QUICK_FILTER_CONSTANTS } from './constants';
import { COLORS, FONT_SIZE, SPACING, BORDER_RADIUS } from '../../constants';
import { SORT_OPTIONS, GENDER_OPTIONS } from '../../constants';
// #endregion

// #region 3. Types & Schema
// Props接口定义在父级 types.ts 中
// #endregion

// #region 4. Constants & Config
// 常量定义在 constants.ts 中
// #endregion

// #region 5. Utils & Helpers
// 工具函数在 utilsFilter.ts 中定义
// #endregion

// #region 6. State Management
// 状态管理在 useFilters.ts 中定义
// #endregion

// #region 7. Domain Logic
// 事件处理在 onFilterChange.ts 中定义
// #endregion

// #region 8. UI Components & Rendering
export const QuickFilters: React.FC<QuickFiltersProps> = ({
  sort,
  gender,
  onSortChange,
  onGenderChange,
  onAdvancedPress,
}) => {
  // 使用本地状态管理
  const { filterState, updateFilterState } = useFilters({ sort, gender });
  
  // 处理排序变更
  const handleSortChange = (newSort: typeof sort) => {
    const processedSort = processFilterData.processSortChange(newSort, sort);
    onFilterChange.handleSortChange(onSortChange, processedSort, updateFilterState);
  };

  // 处理性别筛选变更
  const handleGenderChange = (newGender: typeof gender) => {
    const processedGender = processFilterData.processGenderChange(newGender, gender);
    onFilterChange.handleGenderChange(onGenderChange, processedGender, updateFilterState);
  };

  // 获取排序按钮样式
  const getSortButtonStyle = utilsFilter.getSortButtonStyle;
  const getGenderButtonStyle = utilsFilter.getGenderButtonStyle;

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.container}
    >
      {/* 排序筛选按钮 */}
      <TouchableOpacity
        style={[styles.filterButton, getSortButtonStyle(filterState.sortSelected)]}
        onPress={() => {
          // 这里可以弹出排序选择弹窗
          // 暂时循环切换排序方式
          const currentIndex = SORT_OPTIONS.findIndex(option => option.key === sort);
          const nextIndex = (currentIndex + 1) % SORT_OPTIONS.length;
          handleSortChange(SORT_OPTIONS[nextIndex].key);
        }}
        activeOpacity={0.8}
      >
        <Text style={[styles.filterButtonText, filterState.sortSelected && styles.filterButtonTextActive]}>
          {SORT_OPTIONS.find(option => option.key === sort)?.label || '智能排序'}
        </Text>
        <Text style={styles.filterArrow}>▼</Text>
      </TouchableOpacity>

      {/* 性别筛选按钮 */}
      <TouchableOpacity
        style={[styles.filterButton, getGenderButtonStyle(filterState.genderSelected)]}
        onPress={() => {
          // 这里可以弹出性别选择弹窗
          // 暂时循环切换性别筛选
          const currentIndex = GENDER_OPTIONS.findIndex(option => option.key === gender);
          const nextIndex = (currentIndex + 1) % GENDER_OPTIONS.length;
          handleGenderChange(GENDER_OPTIONS[nextIndex].key);
        }}
        activeOpacity={0.8}
      >
        <Text style={[styles.filterButtonText, filterState.genderSelected && styles.filterButtonTextActive]}>
          {GENDER_OPTIONS.find(option => option.key === gender)?.label || '不限性别'}
        </Text>
        <Text style={styles.filterArrow}>▼</Text>
      </TouchableOpacity>

      {/* 高级筛选按钮 */}
      <TouchableOpacity
        style={styles.advancedButton}
        onPress={onAdvancedPress}
        activeOpacity={0.8}
      >
        <Text style={styles.advancedButtonText}>筛选</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

// 样式定义
const styles = StyleSheet.create({
  container: {
    paddingHorizontal: SPACING.LG,
    alignItems: 'center',
  },
  filterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.BACKGROUND,
    paddingHorizontal: SPACING.MD,
    paddingVertical: SPACING.SM,
    borderRadius: BORDER_RADIUS.LG,
    marginRight: SPACING.SM,
    minWidth: QUICK_FILTER_CONSTANTS.SORT_BUTTON_MIN_WIDTH,
    height: QUICK_FILTER_CONSTANTS.BUTTON_HEIGHT,
  },
  filterButtonText: {
    fontSize: FONT_SIZE.SM,
    color: COLORS.TEXT_PRIMARY,
    marginRight: SPACING.XS,
  },
  filterButtonTextActive: {
    color: COLORS.TEXT_WHITE,
  },
  filterArrow: {
    fontSize: FONT_SIZE.XS,
    color: COLORS.TEXT_SECONDARY,
  },
  advancedButton: {
    backgroundColor: COLORS.BACKGROUND,
    paddingHorizontal: SPACING.MD,
    paddingVertical: SPACING.SM,
    borderRadius: BORDER_RADIUS.LG,
    minWidth: QUICK_FILTER_CONSTANTS.ADVANCED_BUTTON_MIN_WIDTH,
    height: QUICK_FILTER_CONSTANTS.BUTTON_HEIGHT,
    justifyContent: 'center',
    alignItems: 'center',
  },
  advancedButtonText: {
    fontSize: FONT_SIZE.SM,
    color: COLORS.TEXT_PRIMARY,
  },
});
// #endregion

// #region 9. Exports
export default QuickFilters;
// #endregion
