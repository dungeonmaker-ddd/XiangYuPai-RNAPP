/**
 * 📋 QuickFilters 区域类型定义
 */

import type { SortType, GenderFilter } from '../../types';

export interface FilterState {
  sortSelected: boolean;
  genderSelected: boolean;
  lastUpdateTime: number;
}

export interface FilterAction {
  type: 'UPDATE_SORT' | 'UPDATE_GENDER' | 'RESET_FILTERS';
  payload?: any;
}
