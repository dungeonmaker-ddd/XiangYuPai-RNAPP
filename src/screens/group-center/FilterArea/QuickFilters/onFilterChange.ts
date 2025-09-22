/**
 * 🎯 QuickFilters 区域事件处理
 */

import type { SortType, GenderFilter } from '../../types';

export const onFilterChange = {
  // 处理排序变更
  handleSortChange: (
    onSortChange: (sort: SortType) => void,
    sort: SortType,
    updateFilterState: (updates: any) => void
  ) => {
    // 更新本地状态
    updateFilterState({
      sortSelected: sort !== 'smart',
    });

    // 调用父组件回调
    onSortChange(sort);
  },

  // 处理性别筛选变更
  handleGenderChange: (
    onGenderChange: (gender: GenderFilter) => void,
    gender: GenderFilter,
    updateFilterState: (updates: any) => void
  ) => {
    // 更新本地状态
    updateFilterState({
      genderSelected: gender !== 'all',
    });

    // 调用父组件回调
    onGenderChange(gender);
  },
};
