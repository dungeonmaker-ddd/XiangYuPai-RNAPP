/**
 * 🔄 组局中心页面主状态管理
 * 统一管理页面级状态，子组件只管理简单本地状态
 * 
 * TOC (quick jump):
 * [1] Imports & Types
 * [2] Constants & Config  
 * [3] Utils & Helpers
 * [4] State Management
 * [5] Domain Logic
 * [6] Exports
 */

// #region 1. Imports & Types
import { useState, useCallback, useEffect, useMemo } from 'react';
import type { 
  GroupCenterState, 
  GroupActivity, 
  FilterOptions,
  UserInfo 
} from './types';
import { PAGINATION, LOADING } from './constants';
// #endregion

// #region 2. Constants & Config
const DEFAULT_FILTER: FilterOptions = {
  sort: 'smart',
  gender: 'all',
  activityType: 'all',
  advanced: {},
};

const INITIAL_STATE: GroupCenterState = {
  activities: [],
  loading: false,
  refreshing: false,
  hasMore: true,
  page: PAGINATION.INITIAL_PAGE,
  error: null,
  filter: {
    options: DEFAULT_FILTER,
    isAdvancedVisible: false,
    activeFiltersCount: 0,
  },
  selectedActivity: null,
  userLocation: null,
};
// #endregion

// #region 3. Utils & Helpers
const calculateActiveFiltersCount = (filter: FilterOptions): number => {
  let count = 0;
  if (filter.sort !== 'smart') count++;
  if (filter.gender !== 'all') count++;
  if (filter.activityType !== 'all') count++;
  if (filter.advanced.priceRange) count++;
  if (filter.advanced.distanceRange) count++;
  if (filter.advanced.timeRange) count++;
  return count;
};
// #endregion

// #region 4. State Management
export const useGroupCenter = () => {
  const [state, setState] = useState<GroupCenterState>(INITIAL_STATE);

  // 计算衍生状态
  const filteredActivities = useMemo(() => {
    let filtered = [...state.activities];
    const { options } = state.filter;
    
    // 按活动类型筛选
    if (options.activityType !== 'all') {
      filtered = filtered.filter(activity => activity.type === options.activityType);
    }
    
    // 按排序方式排序
    switch (options.sort) {
      case 'latest':
        filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        break;
      case 'nearest':
        filtered.sort((a, b) => (a.stats.distance || 0) - (b.stats.distance || 0));
        break;
      case 'cheapest':
        filtered.sort((a, b) => a.details.price.amount - b.details.price.amount);
        break;
      default: // smart
        // 智能排序逻辑
        break;
    }
    
    return filtered;
  }, [state.activities, state.filter.options]);

  const isLoading = state.loading || state.refreshing;
  const isEmpty = !isLoading && filteredActivities.length === 0;
// #endregion

// #region 5. Domain Logic
  // 设置活动列表
  const setActivities = useCallback((activities: GroupActivity[]) => {
    setState(prev => ({ ...prev, activities }));
  }, []);

  // 添加活动到列表
  const addActivities = useCallback((newActivities: GroupActivity[]) => {
    setState(prev => ({
      ...prev,
      activities: [...prev.activities, ...newActivities],
    }));
  }, []);

  // 更新筛选条件
  const updateFilter = useCallback((newFilter: Partial<FilterOptions>) => {
    setState(prev => {
      const updatedOptions = { ...prev.filter.options, ...newFilter };
      const activeFiltersCount = calculateActiveFiltersCount(updatedOptions);
      
      return {
        ...prev,
        filter: {
          ...prev.filter,
          options: updatedOptions,
          activeFiltersCount,
        },
      };
    });
  }, []);

  // 设置加载状态
  const setLoading = useCallback((loading: boolean) => {
    setState(prev => ({ ...prev, loading }));
  }, []);

  // 设置刷新状态
  const setRefreshing = useCallback((refreshing: boolean) => {
    setState(prev => ({ ...prev, refreshing }));
  }, []);

  // 设置错误状态
  const setError = useCallback((error: string | null) => {
    setState(prev => ({ ...prev, error }));
  }, []);

  // 设置选中活动
  const setSelectedActivity = useCallback((activity: GroupActivity | null) => {
    setState(prev => ({ ...prev, selectedActivity: activity }));
  }, []);

  // 设置用户位置
  const setUserLocation = useCallback((location: { latitude: number; longitude: number } | null) => {
    setState(prev => ({ ...prev, userLocation: location }));
  }, []);

  // 设置高级筛选可见性
  const setAdvancedFilterVisible = useCallback((visible: boolean) => {
    setState(prev => ({
      ...prev,
      filter: { ...prev.filter, isAdvancedVisible: visible },
    }));
  }, []);

  // 重置筛选条件
  const resetFilter = useCallback(() => {
    setState(prev => ({
      ...prev,
      filter: {
        options: DEFAULT_FILTER,
        isAdvancedVisible: false,
        activeFiltersCount: 0,
      },
    }));
  }, []);

  // 更新分页信息
  const updatePagination = useCallback((page: number, hasMore: boolean) => {
    setState(prev => ({ ...prev, page, hasMore }));
  }, []);
// #endregion

// #region 6. Exports
  return {
    // 状态
    state,
    filteredActivities,
    isLoading,
    isEmpty,
    
    // 操作方法
    setActivities,
    addActivities,
    updateFilter,
    setLoading,
    setRefreshing,
    setError,
    setSelectedActivity,
    setUserLocation,
    setAdvancedFilterVisible,
    resetFilter,
    updatePagination,
  };
};
// #endregion
