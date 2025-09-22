/**
 * 🔄 QuickFilters 区域本地状态管理
 */

import { useState, useCallback, useEffect } from 'react';
import type { SortType, GenderFilter } from '../../types';

interface FilterState {
  sortSelected: boolean;
  genderSelected: boolean;
  lastUpdateTime: number;
}

interface UseFiltersProps {
  sort: SortType;
  gender: GenderFilter;
}

export const useFilters = ({ sort, gender }: UseFiltersProps) => {
  const [filterState, setFilterState] = useState<FilterState>({
    sortSelected: sort !== 'smart',
    genderSelected: gender !== 'all',
    lastUpdateTime: Date.now(),
  });

  // 更新筛选状态
  const updateFilterState = useCallback((updates: Partial<FilterState>) => {
    setFilterState(prev => ({
      ...prev,
      ...updates,
      lastUpdateTime: Date.now(),
    }));
  }, []);

  // 监听外部筛选变化
  useEffect(() => {
    setFilterState(prev => ({
      ...prev,
      sortSelected: sort !== 'smart',
      genderSelected: gender !== 'all',
    }));
  }, [sort, gender]);

  return {
    filterState,
    updateFilterState,
  };
};
