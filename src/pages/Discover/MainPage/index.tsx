/**
 * 发现主页面组件
 * 实现三标签内容分发系统（热门/关注/同城）
 * 
 * TOC (快速跳转):
 * [1] Imports
 * [2] Types & Schema  
 * [3] Constants & Config
 * [4] Utils & Helpers
 * [5] State Management
 * [6] Domain Logic
 * [7] UI Components & Rendering
 * [8] Exports
 */

// #region 1. Imports
import React from 'react';
import {
  View,
  StyleSheet,
  StatusBar,
  Platform,
  SafeAreaView,
} from 'react-native';
import { DiscoverMainPageProps, DiscoverTabType, DiscoverState, ContentItem, UserInfo } from './types';
import { COLORS, PAGE_CONFIG, TAB_CONFIG } from './constants';
import HeaderArea from './HeaderArea';
import TabNavigationArea from './TabNavigationArea';
import MasonryContentArea from './MasonryContentArea';
// #endregion

// #region 2. Types & Schema
interface MockDataConfig {
  pageSize: number;
  totalPages: number;
}
// #endregion

// #region 3. Constants & Config
const MOCK_DATA_CONFIG: MockDataConfig = {
  pageSize: 20,
  totalPages: 5,
};

// 模拟数据生成
const generateMockContent = (tab: DiscoverTabType, page: number = 1): ContentItem[] => {
  const baseContent: Omit<ContentItem, 'id' | 'author'>[] = [
    {
      type: 'image',
      title: '请你们看雪',
      description: '今天下雪了，很美的雪景分享给大家',
      images: ['https://picsum.photos/300/400?random=1'],
      likeCount: 88,
      collectCount: 23,
      commentCount: 12,
      shareCount: 5,
      isLiked: false,
      isCollected: false,
      createdAt: '2024-01-15T10:30:00Z',
      tags: ['雪景', '摄影'],
    },
    {
      type: 'video',
      title: '街拍日常分享',
      description: '今日街拍穿搭分享',
      images: ['https://picsum.photos/300/500?random=2'],
      videoUrl: 'https://example.com/video1.mp4',
      likeCount: 156,
      collectCount: 45,
      commentCount: 28,
      shareCount: 12,
      isLiked: true,
      isCollected: false,
      createdAt: '2024-01-15T09:20:00Z',
      tags: ['街拍', '穿搭'],
    },
  ];

  return baseContent.map((content, index) => ({
    ...content,
    id: `${tab}_${page}_${index}`,
    author: {
      id: `user_${index}`,
      nickname: `用户${index + 1}`,
      avatar: `https://picsum.photos/64/64?random=${index + 10}`,
      level: Math.floor(Math.random() * 10) + 1,
      isVerified: Math.random() > 0.7,
      isFollowed: tab === DiscoverTabType.FOLLOW,
    },
    // Tab特殊字段
    ...(tab === DiscoverTabType.HOT && {
      hotScore: Math.floor(Math.random() * 5000) + 1000,
      hotRank: index + 1,
    }),
    ...(tab === DiscoverTabType.FOLLOW && {
      followedAt: '2024-01-10T00:00:00Z',
      isNewContent: Math.random() > 0.8,
    }),
    ...(tab === DiscoverTabType.LOCAL && {
      distance: Math.random() * 10,
      location: {
        latitude: 39.9042,
        longitude: 116.4074,
        address: '北京市朝阳区',
        city: '北京',
        district: '朝阳区',
      },
      merchantInfo: Math.random() > 0.6 ? {
        id: `merchant_${index}`,
        name: `商家${index + 1}`,
        isVerified: true,
        isOpen: Math.random() > 0.3,
        phone: '400-123-4567',
        businessHours: '09:00-21:00',
        category: '餐饮',
      } : undefined,
    }),
  }));
};
// #endregion

// #region 4. Utils & Helpers
const getInitialState = (): DiscoverState => ({
  activeTab: TAB_CONFIG.DEFAULT_TAB,
  hotContent: generateMockContent(DiscoverTabType.HOT),
  followContent: generateMockContent(DiscoverTabType.FOLLOW),
  localContent: generateMockContent(DiscoverTabType.LOCAL),
  hotLoading: false,
  followLoading: false,
  localLoading: false,
  hotHasMore: true,
  followHasMore: true,
  localHasMore: true,
  scrollPositions: {
    [DiscoverTabType.HOT]: 0,
    [DiscoverTabType.FOLLOW]: 0,
    [DiscoverTabType.LOCAL]: 0,
  },
  isLoggedIn: true,
  currentUser: {
    id: 'current_user',
    nickname: '当前用户',
    avatar: 'https://picsum.photos/64/64?random=999',
  },
  locationPermission: 'granted',
  currentLocation: {
    latitude: 39.9042,
    longitude: 116.4074,
    address: '北京市朝阳区',
    city: '北京',
  },
});
// #endregion

// #region 5. State Management
const DiscoverMainPage: React.FC<DiscoverMainPageProps> = ({
  initialTab = TAB_CONFIG.DEFAULT_TAB,
  onTabChange,
  onContentPress,
  onUserPress,
  onCameraPress,
}) => {
  const [state, setState] = React.useState<DiscoverState>(() => ({
    ...getInitialState(),
    activeTab: initialTab,
  }));

  // 状态更新辅助函数
  const updateTabContent = React.useCallback((
    tab: DiscoverTabType,
    updates: Partial<Pick<DiscoverState, 'hotContent' | 'followContent' | 'localContent' | 'hotLoading' | 'followLoading' | 'localLoading' | 'hotHasMore' | 'followHasMore' | 'localHasMore'>>
  ) => {
    setState(prev => ({ ...prev, ...updates }));
  }, []);
// #endregion

// #region 6. Domain Logic
const handleTabChange = React.useCallback((newTab: DiscoverTabType) => {
  setState(prev => ({ ...prev, activeTab: newTab }));
  onTabChange?.(newTab);
}, [onTabChange]);

const handleLoadMore = React.useCallback(() => {
  const { activeTab } = state;
  const loadingKey = `${activeTab}Loading` as keyof DiscoverState;
  const hasMoreKey = `${activeTab}HasMore` as keyof DiscoverState;
  
  if (state[loadingKey] || !state[hasMoreKey]) return;

  // 设置加载状态
  setState(prev => ({ ...prev, [loadingKey]: true }));

  // 模拟API请求
  setTimeout(() => {
    const newContent = generateMockContent(activeTab, 2);
    const contentKey = `${activeTab}Content` as keyof DiscoverState;
    
    setState(prev => ({
      ...prev,
      [contentKey]: [...(prev[contentKey] as ContentItem[]), ...newContent],
      [loadingKey]: false,
      [hasMoreKey]: Math.random() > 0.3, // 随机模拟是否还有更多
    }));
  }, 1500);
}, [state]);

const handleContentPress = React.useCallback((content: ContentItem) => {
  onContentPress?.(content);
}, [onContentPress]);

const handleLike = React.useCallback((contentId: string) => {
  const { activeTab } = state;
  const contentKey = `${activeTab}Content` as keyof DiscoverState;
  
  setState(prev => ({
    ...prev,
    [contentKey]: (prev[contentKey] as ContentItem[]).map(item =>
      item.id === contentId
        ? {
            ...item,
            isLiked: !item.isLiked,
            likeCount: item.isLiked ? item.likeCount - 1 : item.likeCount + 1,
          }
        : item
    ),
  }));
}, [state]);

const handleUserPress = React.useCallback((user: UserInfo) => {
  onUserPress?.(user);
}, [onUserPress]);

const handleCameraPress = React.useCallback(() => {
  onCameraPress?.();
}, [onCameraPress]);

// 获取当前Tab的内容数据
const getCurrentTabData = () => {
  const { activeTab } = state;
  switch (activeTab) {
    case DiscoverTabType.HOT:
      return {
        contentList: state.hotContent,
        loading: state.hotLoading,
        hasMore: state.hotHasMore,
      };
    case DiscoverTabType.FOLLOW:
      return {
        contentList: state.followContent,
        loading: state.followLoading,
        hasMore: state.followHasMore,
      };
    case DiscoverTabType.LOCAL:
      return {
        contentList: state.localContent,
        loading: state.localLoading,
        hasMore: state.localHasMore,
      };
    default:
      return {
        contentList: state.hotContent,
        loading: state.hotLoading,
        hasMore: state.hotHasMore,
      };
  }
};
// #endregion

// #region 7. UI Components & Rendering
  const currentTabData = getCurrentTabData();
  const hasNewContent = state.followContent.some(item => item.isNewContent);

  return (
    <SafeAreaView style={styles.container}>
      {/* 状态栏配置 */}
      <StatusBar 
        barStyle="dark-content" 
        backgroundColor={COLORS.BACKGROUND}
        translucent={Platform.OS === 'android'}
      />
      
      {/* 头部区域 */}
      <HeaderArea
        onCameraPress={handleCameraPress}
        showLocationIcon={state.activeTab === DiscoverTabType.LOCAL}
        currentLocation={state.currentLocation?.address}
      />
      
      {/* Tab导航区域 */}
      <TabNavigationArea
        activeTab={state.activeTab}
        onTabChange={handleTabChange}
        hasNewContent={hasNewContent}
      />
      
      {/* 瀑布流内容区域 */}
      <MasonryContentArea
        contentList={currentTabData.contentList}
        loading={currentTabData.loading}
        hasMore={currentTabData.hasMore}
        onLoadMore={handleLoadMore}
        onContentPress={handleContentPress}
        onLike={handleLike}
        onUserPress={handleUserPress}
        tabType={state.activeTab}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.BACKGROUND,
  },
});
// #endregion

// #region 8. Exports
export default DiscoverMainPage;
// #endregion
