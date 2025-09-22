/**
 * 🔄 组局中心页面数据状态管理
 * 专门管理数据获取、缓存和同步相关状态
 */

import { useState, useCallback, useEffect } from 'react';
import type { GroupActivity, FilterOptions } from './types';
import { PAGINATION, LOADING } from './constants';

interface DataState {
  cache: Map<string, GroupActivity[]>;
  lastFetchTime: number;
  retryCount: number;
}

export const useGroupCenterData = () => {
  const [dataState, setDataState] = useState<DataState>({
    cache: new Map(),
    lastFetchTime: 0,
    retryCount: 0,
  });

  // 生成缓存键
  const generateCacheKey = useCallback((filter: FilterOptions, page: number): string => {
    return `${JSON.stringify(filter)}_${page}`;
  }, []);

  // 获取缓存数据
  const getCachedData = useCallback((key: string): GroupActivity[] | null => {
    return dataState.cache.get(key) || null;
  }, [dataState.cache]);

  // 设置缓存数据
  const setCachedData = useCallback((key: string, data: GroupActivity[]) => {
    setDataState(prev => ({
      ...prev,
      cache: new Map(prev.cache).set(key, data),
      lastFetchTime: Date.now(),
    }));
  }, []);

  // 清除缓存
  const clearCache = useCallback(() => {
    setDataState(prev => ({
      ...prev,
      cache: new Map(),
      lastFetchTime: 0,
    }));
  }, []);

  // 增加重试次数
  const incrementRetryCount = useCallback(() => {
    setDataState(prev => ({
      ...prev,
      retryCount: prev.retryCount + 1,
    }));
  }, []);

  // 重置重试次数
  const resetRetryCount = useCallback(() => {
    setDataState(prev => ({
      ...prev,
      retryCount: 0,
    }));
  }, []);

  // 检查是否需要刷新数据
  const shouldRefreshData = useCallback((): boolean => {
    const now = Date.now();
    const timeSinceLastFetch = now - dataState.lastFetchTime;
    return timeSinceLastFetch > LOADING.REFRESH_TIMEOUT;
  }, [dataState.lastFetchTime]);

  // 检查是否可以重试
  const canRetry = useCallback((): boolean => {
    return dataState.retryCount < LOADING.RETRY_ATTEMPTS;
  }, [dataState.retryCount]);

  return {
    // 状态
    cache: dataState.cache,
    lastFetchTime: dataState.lastFetchTime,
    retryCount: dataState.retryCount,
    
    // 方法
    generateCacheKey,
    getCachedData,
    setCachedData,
    clearCache,
    incrementRetryCount,
    resetRetryCount,
    shouldRefreshData,
    canRetry,
  };
};
