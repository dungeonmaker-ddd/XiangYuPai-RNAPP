/**
 * useSearchNavigation - 搜索导航管理Hook
 * 统一管理搜索页面所有导航逻辑
 */

import { useCallback } from 'react';
import type { ContentItem, UserInfo, ServiceInfo, TopicInfo } from './types';

/**
 * 搜索导航管理Hook
 */
export const useSearchNavigation = (navigation?: any) => {
  // 返回按钮处理
  const handleBackPress = useCallback(() => {
    if (navigation?.canGoBack()) {
      navigation.goBack();
      return true;
    }
    return false;
  }, [navigation]);

  // 内容点击处理
  const handleContentPress = useCallback((item: ContentItem) => {
    if (navigation) {
      navigation.navigate('ContentDetail', { contentId: item.id });
    } else {
      console.log('Navigate to content detail:', item.id);
    }
  }, [navigation]);

  // 用户点击处理
  const handleUserPress = useCallback((user: UserInfo) => {
    if (navigation) {
      navigation.navigate('UserDetail', { userId: user.id });
    } else {
      console.log('Navigate to user detail:', user.id);
    }
  }, [navigation]);

  // 服务点击处理
  const handleServicePress = useCallback((service: ServiceInfo) => {
    if (navigation) {
      navigation.navigate('ServiceDetail', { serviceId: service.id });
    } else {
      console.log('Navigate to service detail:', service.id);
    }
  }, [navigation]);

  // 话题点击处理
  const handleTopicPress = useCallback((topic: TopicInfo) => {
    if (navigation) {
      navigation.navigate('TopicDetail', { topicId: topic.id });
    } else {
      console.log('Navigate to topic detail:', topic.id);
    }
  }, [navigation]);

  // 用户联系处理
  const handleContactUser = useCallback((userId: string) => {
    if (navigation) {
      navigation.navigate('PrivateChat', { userId });
    } else {
      console.log('Contact user:', userId);
    }
  }, [navigation]);

  // 服务下单处理
  const handleOrderService = useCallback((serviceId: string) => {
    if (navigation) {
      navigation.navigate('ServiceOrder', { serviceId });
    } else {
      console.log('Order service:', serviceId);
    }
  }, [navigation]);

  // 话题关注处理
  const handleFollowTopic = useCallback((topicId: string) => {
    console.log('Follow topic:', topicId);
    // 这里可以调用关注API
  }, []);

  // 用户关注处理
  const handleFollowUser = useCallback((userId: string) => {
    console.log('Follow user:', userId);
    // 这里可以调用关注API
  }, []);

  return {
    handleBackPress,
    handleContentPress,
    handleUserPress,
    handleServicePress,
    handleTopicPress,
    handleContactUser,
    handleOrderService,
    handleFollowTopic,
    handleFollowUser,
  };
};
