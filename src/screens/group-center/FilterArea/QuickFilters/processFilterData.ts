/**
 * 🔄 QuickFilters 数据处理
 */

import type { SortType, GenderFilter } from '../../types';

export const processFilterData = {
  // 处理排序变更数据
  processSortChange: (newSort: SortType, currentSort: SortType): SortType => {
    // 验证新的排序类型
    const validSortTypes: SortType[] = ['smart', 'latest', 'nearest', 'cheapest'];
    
    if (!validSortTypes.includes(newSort)) {
      console.warn(`Invalid sort type: ${newSort}, falling back to current: ${currentSort}`);
      return currentSort;
    }

    // 如果与当前相同，不做处理
    if (newSort === currentSort) {
      return currentSort;
    }

    return newSort;
  },

  // 处理性别筛选变更数据
  processGenderChange: (newGender: GenderFilter, currentGender: GenderFilter): GenderFilter => {
    // 验证新的性别筛选
    const validGenderTypes: GenderFilter[] = ['all', 'female', 'male'];
    
    if (!validGenderTypes.includes(newGender)) {
      console.warn(`Invalid gender filter: ${newGender}, falling back to current: ${currentGender}`);
      return currentGender;
    }

    // 如果与当前相同，不做处理
    if (newGender === currentGender) {
      return currentGender;
    }

    return newGender;
  },

  // 验证筛选数据完整性
  validateFilterData: (sort: SortType, gender: GenderFilter): boolean => {
    const validSortTypes: SortType[] = ['smart', 'latest', 'nearest', 'cheapest'];
    const validGenderTypes: GenderFilter[] = ['all', 'female', 'male'];
    
    return validSortTypes.includes(sort) && validGenderTypes.includes(gender);
  },
};
