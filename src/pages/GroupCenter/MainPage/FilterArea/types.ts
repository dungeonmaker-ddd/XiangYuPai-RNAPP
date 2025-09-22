/**
 * 📋 FilterArea 类型定义
 */

import type { FilterOptions, SortType, GenderFilter, ActivityType } from '../types';

export interface FilterAreaProps {
  filter: FilterOptions;
  onFilterChange: (filter: Partial<FilterOptions>) => void;
  onAdvancedPress: () => void;
}

export interface QuickFiltersProps {
  sort: SortType;
  gender: GenderFilter;
  onSortChange: (sort: SortType) => void;
  onGenderChange: (gender: GenderFilter) => void;
  onAdvancedPress: () => void;
}

export interface TypeTabsProps {
  selectedType: ActivityType | 'all';
  onTypeChange: (type: ActivityType | 'all') => void;
}
