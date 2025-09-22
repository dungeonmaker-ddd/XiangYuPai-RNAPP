/**
 * Home 页面组主状态管理
 * 
 * 管理整个 Home 页面组的核心状态
 */

import { useState, useCallback } from 'react';
import { HomePageGroupState, HomeFilterOptions } from './types';
import { DEFAULT_FILTER_OPTIONS } from './constants';

export const useHome = () => {
  // 页面组状态
  const [state, setState] = useState<HomePageGroupState>({
    currentRegion: null,
    selectedFilters: DEFAULT_FILTER_OPTIONS,
    isLoading: false,
    error: null,
  });

  // 设置当前地区
  const setCurrentRegion = useCallback((region: string | null) => {
    setState(prev => ({
      ...prev,
      currentRegion: region,
    }));
  }, []);

  // 更新筛选选项
  const updateFilters = useCallback((filters: Partial<HomeFilterOptions>) => {
    setState(prev => ({
      ...prev,
      selectedFilters: {
        ...prev.selectedFilters,
        ...filters,
      },
    }));
  }, []);

  // 重置筛选选项
  const resetFilters = useCallback(() => {
    setState(prev => ({
      ...prev,
      selectedFilters: DEFAULT_FILTER_OPTIONS,
    }));
  }, []);

  // 设置加载状态
  const setLoading = useCallback((loading: boolean) => {
    setState(prev => ({
      ...prev,
      isLoading: loading,
    }));
  }, []);

  // 设置错误状态
  const setError = useCallback((error: string | null) => {
    setState(prev => ({
      ...prev,
      error,
    }));
  }, []);

  return {
    // 状态
    currentRegion: state.currentRegion,
    selectedFilters: state.selectedFilters,
    isLoading: state.isLoading,
    error: state.error,
    
    // 操作方法
    setCurrentRegion,
    updateFilters,
    resetFilters,
    setLoading,
    setError,
  };
};
