/**
 * 地点选择钩子
 * 
 * 管理地点选择功能的状态和操作
 */

import { useState, useCallback } from 'react';
import type { UseLocationSelectorReturn } from './types';
import type { PublishLocationData } from '../types';

/**
 * 地点选择钩子
 */
export const useLocationSelector = (): UseLocationSelectorReturn => {
  const [isLocationSelectorVisible, setIsLocationSelectorVisible] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState<PublishLocationData | null>(null);
  const [currentLocation, setCurrentLocation] = useState<PublishLocationData | null>(null);
  const [searchResults, setSearchResults] = useState<PublishLocationData[]>([]);
  const [isLocating, setIsLocating] = useState(false);

  // 显示地点选择器
  const showLocationSelector = useCallback(() => {
    setIsLocationSelectorVisible(true);
  }, []);

  // 隐藏地点选择器
  const hideLocationSelector = useCallback(() => {
    setIsLocationSelectorVisible(false);
  }, []);

  // 选择地点
  const selectLocation = useCallback((location: PublishLocationData) => {
    setSelectedLocation(location);
    setIsLocationSelectorVisible(false);
  }, []);

  // 清除地点
  const clearLocation = useCallback(() => {
    setSelectedLocation(null);
  }, []);

  // 获取当前位置
  const getCurrentLocation = useCallback(async () => {
    setIsLocating(true);
    try {
      // TODO: 实现GPS定位逻辑
      // 模拟定位
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const mockLocation: PublishLocationData = {
        id: 'current',
        name: '当前位置',
        address: '深圳市南山区科技园',
        latitude: 22.5431,
        longitude: 114.0579,
        category: 'current',
      };
      
      setCurrentLocation(mockLocation);
    } catch (error) {
      console.error('定位失败:', error);
    } finally {
      setIsLocating(false);
    }
  }, []);

  // 搜索地点
  const searchLocations = useCallback(async (keyword: string) => {
    if (!keyword.trim()) {
      setSearchResults([]);
      return;
    }

    try {
      // TODO: 实现地点搜索API调用
      // 模拟搜索结果
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const mockResults: PublishLocationData[] = [
        {
          id: '1',
          name: `${keyword}相关地点1`,
          address: '深圳市南山区',
          latitude: 22.5431,
          longitude: 114.0579,
          distance: 100,
        },
        {
          id: '2',
          name: `${keyword}相关地点2`,
          address: '深圳市福田区',
          latitude: 22.5422,
          longitude: 114.0578,
          distance: 200,
        },
      ];
      
      setSearchResults(mockResults);
    } catch (error) {
      console.error('搜索地点失败:', error);
      setSearchResults([]);
    }
  }, []);

  return {
    isLocationSelectorVisible,
    selectedLocation,
    currentLocation,
    searchResults,
    isLocating,
    showLocationSelector,
    hideLocationSelector,
    selectLocation,
    clearLocation,
    getCurrentLocation,
    searchLocations,
  };
};
