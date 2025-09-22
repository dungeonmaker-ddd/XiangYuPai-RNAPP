/**
 * Home 页面组数据状态管理
 * 
 * 管理 Home 页面组的数据获取和缓存
 */

import { useState, useEffect, useCallback } from 'react';
import { HomeFilterOptions } from './types';

// 用户数据类型（简化版）
interface UserData {
  id: string;
  name: string;
  avatar?: string;
  age: number;
  gender: string;
  distance: number;
  gameTypes: string[];
}

// 地区数据类型
interface RegionData {
  id: string;
  name: string;
  code: string;
  isHot?: boolean;
}

export const useHomeData = () => {
  // 数据状态
  const [users, setUsers] = useState<UserData[]>([]);
  const [regions, setRegions] = useState<RegionData[]>([]);
  const [isLoadingUsers, setIsLoadingUsers] = useState(false);
  const [isLoadingRegions, setIsLoadingRegions] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 获取用户列表数据
  const fetchUsers = useCallback(async (filters?: HomeFilterOptions) => {
    setIsLoadingUsers(true);
    setError(null);
    
    try {
      // TODO: 实际的 API 调用
      // const response = await apiHomeUserList(filters);
      
      // 模拟数据（YAGNI + MVP 原则）
      const mockUsers: UserData[] = [
        {
          id: '1',
          name: '用户1',
          age: 25,
          gender: 'male',
          distance: 1.2,
          gameTypes: ['王者荣耀', '和平精英'],
        },
        // ... 更多模拟数据
      ];
      
      setUsers(mockUsers);
    } catch (err) {
      setError(err instanceof Error ? err.message : '获取用户数据失败');
    } finally {
      setIsLoadingUsers(false);
    }
  }, []);

  // 获取地区列表数据
  const fetchRegions = useCallback(async () => {
    setIsLoadingRegions(true);
    setError(null);
    
    try {
      // TODO: 实际的 API 调用
      // const response = await apiHomeRegionList();
      
      // 模拟数据（YAGNI + MVP 原则）
      const mockRegions: RegionData[] = [
        { id: '1', name: '北京', code: 'BJ', isHot: true },
        { id: '2', name: '上海', code: 'SH', isHot: true },
        { id: '3', name: '广州', code: 'GZ', isHot: true },
        // ... 更多模拟数据
      ];
      
      setRegions(mockRegions);
    } catch (err) {
      setError(err instanceof Error ? err.message : '获取地区数据失败');
    } finally {
      setIsLoadingRegions(false);
    }
  }, []);

  // 刷新数据
  const refreshData = useCallback(async (filters?: HomeFilterOptions) => {
    await Promise.all([
      fetchUsers(filters),
      fetchRegions(),
    ]);
  }, [fetchUsers, fetchRegions]);

  // 初始化数据加载
  useEffect(() => {
    refreshData();
  }, [refreshData]);

  return {
    // 数据状态
    users,
    regions,
    isLoadingUsers,
    isLoadingRegions,
    error,
    
    // 操作方法
    fetchUsers,
    fetchRegions,
    refreshData,
  };
};
