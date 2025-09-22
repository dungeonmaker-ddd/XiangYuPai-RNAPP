/**
 * 🧭 页面跳转导航 - 跳转到组局详情
 * 统一管理页面级导航跳转
 */

import type { GroupActivity } from './types';

interface NavigationProps {
  navigate: (screen: string, params?: any) => void;
  push?: (screen: string, params?: any) => void;
}

export const navigateToDetail = (
  navigation: NavigationProps,
  activity: GroupActivity,
  options?: {
    animation?: 'slide' | 'fade' | 'none';
    replace?: boolean;
  }
) => {
  const params = {
    activityId: activity.id,
    activity: activity,
    ...options,
  };

  if (options?.replace && navigation.push) {
    navigation.push('GroupDetail', params);
  } else {
    navigation.navigate('GroupDetail', params);
  }
};
