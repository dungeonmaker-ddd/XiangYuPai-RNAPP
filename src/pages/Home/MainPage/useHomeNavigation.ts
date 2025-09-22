/**
 * useHomeNavigation - 首页导航管理Hook
 * 统一管理首页所有导航逻辑
 */

import { useCallback } from 'react';
import { Linking } from 'react-native';
import type { UserCard } from './types';

/**
 * 首页导航管理Hook
 */
export const useHomeNavigation = (navigation?: any) => {
  // 用户点击处理
  const handleUserPress = useCallback((user: UserCard) => {
    if (navigation) {
      navigation.navigate('UserDetail', { userId: user.id });
    } else {
      console.log('Navigate to user detail:', user.id);
    }
  }, [navigation]);

  // 功能点击处理
  const handleFunctionPress = useCallback((functionId: string) => {
    if (navigation) {
      navigation.navigate('FunctionDetail', { functionId });
    } else {
      console.log('Navigate to function detail:', functionId);
    }
  }, [navigation]);

  // 位置点击处理
  const handleLocationPress = useCallback(() => {
    if (navigation) {
      navigation.navigate('LocationSelector');
    } else {
      console.log('Open location selector - navigation not available');
    }
  }, [navigation]);

  // 更多组队聚会处理
  const handleMoreTeamPartyPress = useCallback(() => {
    if (navigation) {
      navigation.navigate('GroupCenter');
    } else {
      console.log('Navigate to group center (navigation not available)');
    }
  }, [navigation]);

  // 游戏横幅点击处理
  const handleGameBannerPress = useCallback(() => {
    Linking.openURL('https://apps.apple.com/app/example');
  }, []);

  // 组队聚会点击处理
  const handleTeamPartyPress = useCallback(() => {
    if (navigation) {
      navigation.navigate('GroupCenter');
    } else {
      console.log('Navigate to group center (navigation not available)');
    }
  }, [navigation]);

  // 更多专享处理
  const handleMoreOffersPress = useCallback(() => {
    if (navigation) {
      navigation.navigate('LimitedOffers');
    } else {
      console.log('Navigate to more offers');
    }
  }, [navigation]);

  // 搜索点击处理
  const handleSearchPress = useCallback(() => {
    if (navigation) {
      navigation.navigate('Search');
    } else {
      console.log('Navigate to search - navigation not available');
    }
  }, [navigation]);

  return {
    handleUserPress,
    handleFunctionPress,
    handleLocationPress,
    handleMoreTeamPartyPress,
    handleGameBannerPress,
    handleTeamPartyPress,
    handleMoreOffersPress,
    handleSearchPress,
  };
};
