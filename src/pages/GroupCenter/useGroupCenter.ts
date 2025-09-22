/**
 * GroupCenter 页面组主状态管理
 * 
 * 管理整个 GroupCenter 页面组的核心状态
 */

import { useState, useCallback } from 'react';
import { GroupCenterPageGroupState, GroupFilterOptions, GroupPublishData } from './types';
import { DEFAULT_FILTER_OPTIONS, DEFAULT_PUBLISH_DATA } from './constants';

export const useGroupCenter = () => {
  // 页面组状态
  const [state, setState] = useState<GroupCenterPageGroupState>({
    currentFilter: DEFAULT_FILTER_OPTIONS,
    currentGroupId: null,
    publishData: null,
    isLoading: false,
    error: null,
  });

  // 设置当前筛选选项
  const setCurrentFilter = useCallback((filter: Partial<GroupFilterOptions>) => {
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

  // 设置当前组局ID
  const setCurrentGroupId = useCallback((groupId: string | null) => {
    setState(prev => ({
      ...prev,
      currentGroupId: groupId,
    }));
  }, []);

  // 设置发布数据
  const setPublishData = useCallback((data: Partial<GroupPublishData> | null) => {
    setState(prev => ({
      ...prev,
      publishData: data ? {
        ...DEFAULT_PUBLISH_DATA,
        ...prev.publishData,
        ...data,
      } : null,
    }));
  }, []);

  // 更新发布数据的特定字段
  const updatePublishData = useCallback((field: keyof GroupPublishData, value: any) => {
    setState(prev => ({
      ...prev,
      publishData: prev.publishData ? {
        ...prev.publishData,
        [field]: value,
      } : {
        ...DEFAULT_PUBLISH_DATA,
        [field]: value,
      },
    }));
  }, []);

  // 清除发布数据
  const clearPublishData = useCallback(() => {
    setState(prev => ({
      ...prev,
      publishData: null,
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

  // 快捷筛选方法
  const filterByGameType = useCallback((gameType: string) => {
    setCurrentFilter({ gameType: [gameType] });
  }, [setCurrentFilter]);

  const filterByLocation = useCallback((location: string) => {
    setCurrentFilter({ location });
  }, [setCurrentFilter]);

  const filterByTimeRange = useCallback((timeRange: 'today' | 'tomorrow' | 'week' | 'all') => {
    setCurrentFilter({ timeRange });
  }, [setCurrentFilter]);

  const filterByPriceRange = useCallback((priceRange: [number, number]) => {
    setCurrentFilter({ priceRange });
  }, [setCurrentFilter]);

  // 排序方法
  const sortBy = useCallback((sortBy: 'time' | 'distance' | 'popularity' | 'price') => {
    setCurrentFilter({ sortBy });
  }, [setCurrentFilter]);

  // 验证发布数据
  const validatePublishData = useCallback(() => {
    if (!state.publishData) {
      return { isValid: false, errors: ['发布数据不能为空'] };
    }

    const errors: string[] = [];
    const { title, gameType, location, startTime, maxParticipants, price } = state.publishData;

    if (!title || title.trim().length === 0) {
      errors.push('标题不能为空');
    }
    if (!gameType) {
      errors.push('请选择游戏类型');
    }
    if (!location) {
      errors.push('请选择地点');
    }
    if (!startTime) {
      errors.push('请选择开始时间');
    }
    if (!maxParticipants || maxParticipants < 2) {
      errors.push('参与人数至少为2人');
    }
    if (price !== undefined && price < 0) {
      errors.push('价格不能为负数');
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }, [state.publishData]);

  return {
    // 状态
    currentFilter: state.currentFilter,
    currentGroupId: state.currentGroupId,
    publishData: state.publishData,
    isLoading: state.isLoading,
    error: state.error,
    
    // 操作方法
    setCurrentFilter,
    resetFilter,
    setCurrentGroupId,
    setPublishData,
    updatePublishData,
    clearPublishData,
    setLoading,
    setError,
    
    // 快捷方法
    filterByGameType,
    filterByLocation,
    filterByTimeRange,
    filterByPriceRange,
    sortBy,
    validatePublishData,
  };
};
