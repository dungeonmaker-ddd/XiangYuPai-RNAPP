/**
 * useHomeState - 首页状态管理Hook
 * 统一管理首页所有状态逻辑
 */

import { useState, useCallback, useEffect, useMemo } from 'react';
import type { UserCard, LocationInfo } from './types';

// Mock数据生成函数
const generateMockUsers = (filter: string = 'nearby', region?: string): UserCard[] => {
  const baseCount = 20;
  const users: UserCard[] = [];
  
  for (let i = 0; i < baseCount; i++) {
    const user: UserCard = {
      id: `user-${filter}-${i + 1}`,
      avatar: `https://picsum.photos/100/100?random=${i + 1}&sig=${filter}`,
      username: `用户${i + 1}`,
      age: 18 + (i % 12),
      bio: '这个家伙很懒惰，没有填写简介',
      services: ['模特', '陪玩', '聊天'][i % 3] ? [['模特', '陪玩', '聊天'][i % 3]] : ['模特'],
      distance: Math.round((Math.random() * 10) * 10) / 10,
      status: ['online', 'available', 'offline'][i % 3] as any,
      photos: Array.from({ length: 3 }, (_, j) => 
        `https://picsum.photos/200/200?random=${i * 10 + j + 100}&sig=${filter}`
      ),
      price: i % 3 === 0 ? `¥${80 + i * 15}/小时` : undefined,
      region: region || '南山区',
      lastActive: Date.now() - Math.random() * 24 * 60 * 60 * 1000,
      rating: 4.2 + Math.random() * 0.8,
      reviewCount: Math.floor(Math.random() * 200) + 10,
    };
    
    users.push(user);
  }
  
  return users;
};

/**
 * 首页状态管理Hook
 */
export const useHomeState = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('nearby');
  const [activeRegion, setActiveRegion] = useState('全部');
  const [users, setUsers] = useState<UserCard[]>([]);
  const [limitedOffers, setLimitedOffers] = useState<UserCard[]>([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [location, setLocation] = useState<LocationInfo>({ city: '深圳' });

  // 加载用户数据
  const loadUsers = useCallback(async () => {
    setLoading(true);
    try {
      await new Promise<void>(resolve => setTimeout(() => resolve(), 800));
      const regionFilter = activeRegion === '全部' ? undefined : activeRegion;
      const mockUsers = generateMockUsers(activeFilter, regionFilter);
      setUsers(mockUsers);
    } catch (error) {
      console.error('Failed to load users:', error);
    } finally {
      setLoading(false);
    }
  }, [activeFilter, activeRegion]);

  // 加载限时专享数据
  const loadLimitedOffers = useCallback(async () => {
    try {
      const mockOffers = generateMockUsers().slice(0, 5);
      setLimitedOffers(mockOffers);
    } catch (error) {
      console.error('Failed to load limited offers:', error);
    }
  }, []);

  // 搜索处理
  const handleSearch = useMemo(
    () => {
      let timeoutId: number;
      return (query: string) => {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(async () => {
          if (query.trim()) {
            const regionFilter = activeRegion === '全部' ? undefined : activeRegion;
            const allUsers = generateMockUsers(activeFilter, regionFilter);
            const filteredUsers = allUsers.filter(user =>
              user.username.includes(query) || 
              user.services.some((service: string) => service.includes(query)) ||
              user.bio.includes(query)
            );
            setUsers(filteredUsers);
          } else {
            loadUsers();
          }
        }, 300);
      };
    },
    [loadUsers, activeFilter, activeRegion]
  );

  // 刷新处理
  const handleRefresh = useCallback(() => {
    setRefreshing(true);
    Promise.all([loadUsers(), loadLimitedOffers()]).finally(() => {
      setRefreshing(false);
    });
  }, [loadUsers, loadLimitedOffers]);

  // 初始化数据加载
  useEffect(() => {
    loadUsers();
    loadLimitedOffers();
  }, [loadUsers, loadLimitedOffers]);

  return {
    searchQuery,
    setSearchQuery,
    activeFilter,
    setActiveFilter,
    activeRegion,
    setActiveRegion,
    users,
    limitedOffers,
    loading,
    refreshing,
    location,
    setLocation,
    handleSearch,
    handleRefresh,
  };
};
