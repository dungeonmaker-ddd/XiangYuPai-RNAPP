/**
 * 发现页面数据管理Hook
 * 基于《纯结构架构图标准模板》的状态管理层
 * 整合数据服务与React状态管理
 */

import { useState, useCallback, useEffect, useMemo } from 'react';
import { TabType, ContentItem, DiscoverState } from '../types';
import { DiscoverAPI, discoverDataService } from '../services/DiscoverDataService';
import { ERROR_MESSAGES, SUCCESS_MESSAGES } from '../constants';

// Hook配置接口
export interface UseDiscoverDataConfig {
  initialTab?: TabType;
  enableAutoRefresh?: boolean;
  autoRefreshInterval?: number;
  enableCache?: boolean;
}

// Hook返回值接口
export interface UseDiscoverDataReturn {
  // 状态数据
  state: DiscoverState;
  currentContent: ContentItem[];
  currentLoading: boolean;
  currentRefreshing: boolean;
  currentHasMore: boolean;
  
  // 操作函数
  switchTab: (tabType: TabType) => void;
  refreshContent: () => Promise<void>;
  loadMoreContent: () => Promise<void>;
  likeContent: (itemId: string) => Promise<void>;
  unlikeContent: (itemId: string) => Promise<void>;
  
  // 工具函数
  clearCache: () => void;
  getCacheStats: () => any;
  retryLastRequest: () => Promise<void>;
}

/**
 * 发现页面数据管理Hook
 */
export const useDiscoverData = (config: UseDiscoverDataConfig = {}): UseDiscoverDataReturn => {
  const {
    initialTab = 'hot',
    enableAutoRefresh = false,
    autoRefreshInterval = 30000, // 30秒
    enableCache = true,
  } = config;

  // 主状态管理
  const [state, setState] = useState<DiscoverState>({
    currentTab: initialTab,
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

  // 错误重试状态
  const [lastFailedRequest, setLastFailedRequest] = useState<{
    type: 'load' | 'refresh' | 'loadMore';
    tabType: TabType;
  } | null>(null);

  // 计算当前Tab的相关数据
  const currentContent = useMemo(() => 
    state.content[state.currentTab], 
    [state.content, state.currentTab]
  );

  const currentLoading = useMemo(() => 
    state.loading[state.currentTab], 
    [state.loading, state.currentTab]
  );

  const currentRefreshing = useMemo(() => 
    state.refreshing[state.currentTab], 
    [state.refreshing, state.currentTab]
  );

  const currentHasMore = useMemo(() => 
    state.hasMore[state.currentTab], 
    [state.hasMore, state.currentTab]
  );

  // 更新特定Tab的状态
  const updateTabState = useCallback((
    tabType: TabType, 
    updates: Partial<{
      content: ContentItem[];
      loading: boolean;
      refreshing: boolean;
      hasMore: boolean;
      error: string | null;
    }>
  ) => {
    setState(prev => ({
      ...prev,
      content: updates.content !== undefined ? 
        { ...prev.content, [tabType]: updates.content } : prev.content,
      loading: updates.loading !== undefined ? 
        { ...prev.loading, [tabType]: updates.loading } : prev.loading,
      refreshing: updates.refreshing !== undefined ? 
        { ...prev.refreshing, [tabType]: updates.refreshing } : prev.refreshing,
      hasMore: updates.hasMore !== undefined ? 
        { ...prev.hasMore, [tabType]: updates.hasMore } : prev.hasMore,
      error: updates.error !== undefined ? updates.error : prev.error,
      lastRefreshTime: updates.content !== undefined ? 
        { ...prev.lastRefreshTime, [tabType]: Date.now() } : prev.lastRefreshTime,
    }));
  }, []);

  // 加载内容
  const loadContent = useCallback(async (
    tabType: TabType, 
    isRefresh: boolean = false,
    isLoadMore: boolean = false
  ) => {
    try {
      // 设置加载状态
      updateTabState(tabType, {
        loading: !isRefresh && !isLoadMore,
        refreshing: isRefresh,
        error: null,
      });

      let response;
      if (isRefresh) {
        response = await DiscoverAPI.refreshContent(tabType);
      } else if (isLoadMore) {
        response = await DiscoverAPI.loadMoreContent(tabType);
      } else {
        response = await DiscoverAPI.getContentList(tabType, 1);
      }

      // 更新内容
      const newContent = isLoadMore 
        ? [...state.content[tabType], ...response.list]
        : response.list;

      updateTabState(tabType, {
        content: newContent,
        hasMore: response.hasMore,
        loading: false,
        refreshing: false,
      });

      // 清除错误重试状态
      setLastFailedRequest(null);

    } catch (error) {
      console.error(`加载${tabType}内容失败:`, error);
      
      // 记录失败的请求
      setLastFailedRequest({
        type: isRefresh ? 'refresh' : isLoadMore ? 'loadMore' : 'load',
        tabType,
      });

      updateTabState(tabType, {
        loading: false,
        refreshing: false,
        error: error instanceof Error ? error.message : ERROR_MESSAGES.NETWORK_ERROR,
      });
    }
  }, [state.content, updateTabState]);

  // 切换Tab
  const switchTab = useCallback((tabType: TabType) => {
    setState(prev => ({ ...prev, currentTab: tabType }));
    
    // 如果该Tab没有数据，则加载
    if (state.content[tabType].length === 0) {
      loadContent(tabType, false, false);
    }
  }, [state.content, loadContent]);

  // 刷新当前Tab内容
  const refreshContent = useCallback(async () => {
    await loadContent(state.currentTab, true, false);
  }, [state.currentTab, loadContent]);

  // 加载更多内容
  const loadMoreContent = useCallback(async () => {
    if (currentHasMore && !currentLoading && !currentRefreshing) {
      await loadContent(state.currentTab, false, true);
    }
  }, [currentHasMore, currentLoading, currentRefreshing, state.currentTab, loadContent]);

  // 点赞内容
  const likeContent = useCallback(async (itemId: string) => {
    try {
      const item = currentContent.find(item => item.id === itemId);
      if (!item) return;

      // 乐观更新UI
      const optimisticContent = currentContent.map(contentItem =>
        contentItem.id === itemId
          ? {
              ...contentItem,
              isLiked: !contentItem.isLiked,
              likeCount: contentItem.isLiked 
                ? contentItem.likeCount - 1 
                : contentItem.likeCount + 1,
            }
          : contentItem
      );

      updateTabState(state.currentTab, { content: optimisticContent });

      // 调用API
      if (item.isLiked) {
        await DiscoverAPI.unlikeContent(itemId);
      } else {
        await DiscoverAPI.likeContent(itemId);
      }

    } catch (error) {
      console.error('点赞操作失败:', error);
      
      // 回滚乐观更新
      const rollbackContent = currentContent.map(contentItem =>
        contentItem.id === itemId
          ? {
              ...contentItem,
              isLiked: !contentItem.isLiked,
              likeCount: contentItem.isLiked 
                ? contentItem.likeCount + 1 
                : contentItem.likeCount - 1,
            }
          : contentItem
      );

      updateTabState(state.currentTab, { 
        content: rollbackContent,
        error: ERROR_MESSAGES.LIKE_ERROR,
      });
    }
  }, [currentContent, state.currentTab, updateTabState]);

  // 取消点赞内容
  const unlikeContent = useCallback(async (itemId: string) => {
    await likeContent(itemId); // 复用点赞逻辑，因为它会自动切换状态
  }, [likeContent]);

  // 重试最后失败的请求
  const retryLastRequest = useCallback(async () => {
    if (!lastFailedRequest) return;

    const { type, tabType } = lastFailedRequest;
    
    switch (type) {
      case 'refresh':
        await loadContent(tabType, true, false);
        break;
      case 'loadMore':
        await loadContent(tabType, false, true);
        break;
      case 'load':
      default:
        await loadContent(tabType, false, false);
        break;
    }
  }, [lastFailedRequest, loadContent]);

  // 清除缓存
  const clearCache = useCallback(() => {
    DiscoverAPI.clearCache();
    
    // 重置状态
    setState(prev => ({
      ...prev,
      content: {
        follow: [],
        hot: [],
        local: [],
      },
      hasMore: {
        follow: true,
        hot: true,
        local: true,
      },
      lastRefreshTime: {
        follow: 0,
        hot: 0,
        local: 0,
      },
    }));
  }, []);

  // 获取缓存统计
  const getCacheStats = useCallback(() => {
    return DiscoverAPI.getCacheStats();
  }, []);

  // 初始化数据
  useEffect(() => {
    loadContent(initialTab, true, false);
  }, [initialTab]); // 只在初始化时执行

  // 自动刷新（可选）
  useEffect(() => {
    if (!enableAutoRefresh) return;

    const interval = setInterval(() => {
      // 只有当前没有在加载时才自动刷新
      if (!currentLoading && !currentRefreshing) {
        refreshContent();
      }
    }, autoRefreshInterval);

    return () => clearInterval(interval);
  }, [enableAutoRefresh, autoRefreshInterval, currentLoading, currentRefreshing, refreshContent]);

  // 配置数据服务
  useEffect(() => {
    discoverDataService.updateConfig({
      enableCache,
    });
  }, [enableCache]);

  return {
    // 状态数据
    state,
    currentContent,
    currentLoading,
    currentRefreshing,
    currentHasMore,
    
    // 操作函数
    switchTab,
    refreshContent,
    loadMoreContent,
    likeContent,
    unlikeContent,
    
    // 工具函数
    clearCache,
    getCacheStats,
    retryLastRequest,
  };
};
