/**
 * Discover 页面组主状态管理
 * 
 * 管理整个 Discover 页面组的核心状态
 */

import { useState, useCallback } from 'react';
import { DiscoverPageGroupState, DiscoverFilterOptions } from './types';
import { DEFAULT_FILTER_OPTIONS } from './constants';

export const useDiscover = () => {
  // 页面组状态
  const [state, setState] = useState<DiscoverPageGroupState>({
    currentFilter: DEFAULT_FILTER_OPTIONS,
    currentPostId: null,
    isLoading: false,
    error: null,
  });

  // 设置当前筛选选项
  const setCurrentFilter = useCallback((filter: DiscoverFilterOptions) => {
    setState(prev => ({
      ...prev,
      currentFilter: {
        ...prev.currentFilter,
        ...filter,
      },
    }));
  }, []);

  // 重置筛选选项
  const resetFilter = useCallback(() => {
    setState(prev => ({
      ...prev,
      currentFilter: DEFAULT_FILTER_OPTIONS,
    }));
  }, []);

  // 设置当前查看的帖子ID
  const setCurrentPostId = useCallback((postId: string | null) => {
    setState(prev => ({
      ...prev,
      currentPostId: postId,
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

  // 切换内容分类
  const switchCategory = useCallback((category: 'hot' | 'nearby' | 'following') => {
    setCurrentFilter({ category });
  }, [setCurrentFilter]);

  // 切换内容类型
  const switchContentType = useCallback((contentType: 'all' | 'image' | 'video' | 'text') => {
    setCurrentFilter({ contentType });
  }, [setCurrentFilter]);

  // 切换排序方式
  const switchSortBy = useCallback((sortBy: 'time' | 'popularity' | 'distance') => {
    setCurrentFilter({ sortBy });
  }, [setCurrentFilter]);

  // 添加标签筛选
  const addTagFilter = useCallback((tag: string) => {
    setState(prev => ({
      ...prev,
      currentFilter: {
        ...prev.currentFilter,
        tags: [...(prev.currentFilter.tags || []), tag],
      },
    }));
  }, []);

  // 移除标签筛选
  const removeTagFilter = useCallback((tag: string) => {
    setState(prev => ({
      ...prev,
      currentFilter: {
        ...prev.currentFilter,
        tags: (prev.currentFilter.tags || []).filter(t => t !== tag),
      },
    }));
  }, []);

  return {
    // 状态
    currentFilter: state.currentFilter,
    currentPostId: state.currentPostId,
    isLoading: state.isLoading,
    error: state.error,
    
    // 操作方法
    setCurrentFilter,
    resetFilter,
    setCurrentPostId,
    setLoading,
    setError,
    switchCategory,
    switchContentType,
    switchSortBy,
    addTagFilter,
    removeTagFilter,
  };
};
