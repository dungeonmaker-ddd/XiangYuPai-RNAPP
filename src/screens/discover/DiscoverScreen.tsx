/**
 * 发现页面主组件
 * 整合Tab切换、瀑布流列表、用户交互等功能
 */

import React, { useState, useCallback, useEffect, useMemo } from 'react';
import {
  View,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  Alert,
} from 'react-native';
import TabBar from './TabBar';
import { WaterfallList } from './WaterfallList';
import { 
  DiscoverScreenProps, 
  TabType, 
  ContentItem, 
  DiscoverState,
  ApiResponse,
  ContentListResponse,
  LikeResponse,
} from './types';
import { 
  COLORS, 
  LAYOUT_CONSTANTS, 
  TABS, 
  TEST_IDS,
  ERROR_MESSAGES,
} from './constants';

// 模拟API调用（实际项目中应该使用真实的API）
const mockApiCall = <T,>(data: T, delay = 1000): Promise<ApiResponse<T>> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        code: 200,
        message: 'success',
        data,
        success: true,
      });
    }, delay);
  });
};

// 模拟内容数据
const generateMockContent = (page = 1, tabType: TabType): ContentItem[] => {
  const baseItems: ContentItem[] = Array.from({ length: 20 }, (_, index) => {
    const id = `${tabType}_${page}_${index}`;
    const imageIndex = (page - 1) * 20 + index + 1;
    
    return {
      id,
      type: Math.random() > 0.8 ? 'video' : 'image',
      imageUrl: `https://picsum.photos/400/${300 + Math.floor(Math.random() * 200)}?random=${imageIndex}`,
      title: `请你们看雪 ${tabType} ${imageIndex}`,
      description: '这是一个测试描述内容，用于展示卡片布局效果。',
      user: {
        id: `user_${imageIndex}`,
        nickname: `用户名称${imageIndex}`,
        avatar: `https://picsum.photos/100/100?random=${imageIndex + 1000}`,
        isFollowing: Math.random() > 0.7,
        verified: Math.random() > 0.8,
      },
      likeCount: Math.floor(Math.random() * 1000),
      commentCount: Math.floor(Math.random() * 100),
      shareCount: Math.floor(Math.random() * 50),
      isLiked: Math.random() > 0.8,
      isCollected: Math.random() > 0.9,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      width: 400,
      height: 300 + Math.floor(Math.random() * 200),
    };
  });
  
  return baseItems;
};

export const DiscoverScreen: React.FC<DiscoverScreenProps> = ({ navigation }) => {
  // 状态管理
  const [state, setState] = useState<DiscoverState>({
    currentTab: 'hot',
    content: {
      follow: [],
      hot: [],
      local: [],
    },
    loading: {
      follow: false,
      hot: false,
      local: false,
    },
    refreshing: {
      follow: false,
      hot: false,
      local: false,
    },
    hasMore: {
      follow: true,
      hot: true,
      local: true,
    },
    error: null,
    lastRefreshTime: {
      follow: 0,
      hot: 0,
      local: 0,
    },
  });

  // 页面计数器
  const [pages, setPages] = useState<Record<TabType, number>>({
    follow: 1,
    hot: 1,
    local: 1,
  });

  // 当前Tab的内容数据
  const currentContent = useMemo(() => {
    return state.content[state.currentTab];
  }, [state.content, state.currentTab]);

  // 当前Tab的加载状态
  const currentLoading = useMemo(() => {
    return state.loading[state.currentTab];
  }, [state.loading, state.currentTab]);

  // 当前Tab的刷新状态
  const currentRefreshing = useMemo(() => {
    return state.refreshing[state.currentTab];
  }, [state.refreshing, state.currentTab]);

  // 当前Tab是否还有更多数据
  const currentHasMore = useMemo(() => {
    return state.hasMore[state.currentTab];
  }, [state.hasMore, state.currentTab]);

  // 加载内容数据
  const loadContent = useCallback(async (tabType: TabType, page = 1, isRefresh = false) => {
    try {
      // 更新加载状态
      setState(prev => ({
        ...prev,
        loading: { ...prev.loading, [tabType]: !isRefresh },
        refreshing: { ...prev.refreshing, [tabType]: isRefresh },
        error: null,
      }));

      // 模拟API调用
      const mockData: ContentListResponse = {
        list: generateMockContent(page, tabType),
        hasMore: page < 5, // 模拟5页数据
        nextCursor: `page_${page + 1}`,
        total: 100,
      };

      const response = await mockApiCall(mockData, 800);

      if (response.success) {
        setState(prev => ({
          ...prev,
          content: {
            ...prev.content,
            [tabType]: isRefresh ? response.data.list : [...prev.content[tabType], ...response.data.list],
          },
          hasMore: { ...prev.hasMore, [tabType]: response.data.hasMore },
          lastRefreshTime: { ...prev.lastRefreshTime, [tabType]: Date.now() },
        }));

        // 更新页面计数
        if (!isRefresh) {
          setPages(prev => ({ ...prev, [tabType]: page + 1 }));
        } else {
          setPages(prev => ({ ...prev, [tabType]: 2 }));
        }
      }
    } catch (error) {
      console.error('加载内容失败:', error);
      setState(prev => ({ ...prev, error: ERROR_MESSAGES.NETWORK_ERROR }));
    } finally {
      setState(prev => ({
        ...prev,
        loading: { ...prev.loading, [tabType]: false },
        refreshing: { ...prev.refreshing, [tabType]: false },
      }));
    }
  }, []);

  // 初始化数据
  useEffect(() => {
    loadContent('hot', 1, true);
  }, [loadContent]);

  // 处理Tab切换
  const handleTabPress = useCallback((tabType: TabType) => {
    setState(prev => ({ ...prev, currentTab: tabType }));
    
    // 如果该Tab没有数据，则加载
    if (state.content[tabType].length === 0) {
      loadContent(tabType, 1, true);
    }
  }, [state.content, loadContent]);

  // 处理下拉刷新
  const handleRefresh = useCallback(() => {
    loadContent(state.currentTab, 1, true);
  }, [state.currentTab, loadContent]);

  // 处理加载更多
  const handleLoadMore = useCallback(() => {
    if (currentHasMore && !currentLoading) {
      loadContent(state.currentTab, pages[state.currentTab]);
    }
  }, [currentHasMore, currentLoading, state.currentTab, pages, loadContent]);


  // 处理点赞
  const handleLike = useCallback(async (itemId: string) => {
    try {
      const item = currentContent.find(item => item.id === itemId);
      if (!item) return;

      // 乐观更新UI
      setState(prev => ({
        ...prev,
        content: {
          ...prev.content,
          [state.currentTab]: prev.content[state.currentTab].map(contentItem =>
            contentItem.id === itemId
              ? {
                  ...contentItem,
                  isLiked: !contentItem.isLiked,
                  likeCount: contentItem.isLiked 
                    ? contentItem.likeCount - 1 
                    : contentItem.likeCount + 1,
                }
              : contentItem
          ),
        },
      }));

      // 模拟API调用
      const mockResponse: LikeResponse = {
        isLiked: !item.isLiked,
        likeCount: item.isLiked ? item.likeCount - 1 : item.likeCount + 1,
      };

      await mockApiCall(mockResponse, 300);
      
      // 这里可以显示成功提示
      // Toast.show(item.isLiked ? SUCCESS_MESSAGES.UNLIKE_SUCCESS : SUCCESS_MESSAGES.LIKE_SUCCESS);
      
    } catch (error) {
      console.error('点赞失败:', error);
      // 回滚UI状态
      setState(prev => ({
        ...prev,
        content: {
          ...prev.content,
          [state.currentTab]: prev.content[state.currentTab].map(contentItem =>
            contentItem.id === itemId
              ? {
                  ...contentItem,
                  isLiked: !contentItem.isLiked,
                  likeCount: contentItem.isLiked 
                    ? contentItem.likeCount + 1 
                    : contentItem.likeCount - 1,
                }
              : contentItem
          ),
        },
      }));
      Alert.alert('提示', ERROR_MESSAGES.LIKE_ERROR);
    }
  }, [currentContent, state.currentTab]);





  return (
    <SafeAreaView style={styles.container} testID={TEST_IDS.DISCOVER_SCREEN}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.BACKGROUND} />
      
      {/* 顶部导航栏 */}
      {/* @ts-ignore */}
      <TabBar
        tabs={TABS}
        activeTab={state.currentTab}
        onTabPress={handleTabPress}
      />

      {/* 主内容区域 */}
      <View style={styles.content}>
        <WaterfallList
          data={currentContent}
          loading={currentLoading}
          refreshing={currentRefreshing}
          hasMore={currentHasMore}
          onRefresh={handleRefresh}
          onLoadMore={handleLoadMore}
          onLike={handleLike}
          navigation={navigation}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.BACKGROUND,
  },
  
  content: {
    flex: 1,
  },
});