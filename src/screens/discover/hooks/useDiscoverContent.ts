/**
 * 内容数据管理Hook
 * 负责发现页面的数据获取、状态管理、用户交互等核心业务逻辑
 */

import { useState, useCallback, useEffect, useRef } from 'react';
import { 
  ContentItem, 
  TabType, 
  ApiResponse, 
  ContentListResponse, 
  LikeResponse,
  FollowResponse,
  AppError 
} from '../types';
import { 
  API_ENDPOINTS, 
  REQUEST_CONFIG, 
  ERROR_MESSAGES, 
  SUCCESS_MESSAGES 
} from '../constants';

// Hook状态接口
interface UseDiscoverContentState {
  content: Record<TabType, ContentItem[]>;
  loading: Record<TabType, boolean>;
  refreshing: Record<TabType, boolean>;
  hasMore: Record<TabType, boolean>;
  error: string | null;
  lastRefreshTime: Record<TabType, number>;
}

// 分页信息接口
interface PageInfo {
  page: number;
  nextCursor?: string;
  total: number;
}

// Hook返回值接口
interface UseDiscoverContentResult {
  // 数据状态
  currentTabContent: ContentItem[];
  loading: boolean;
  refreshing: boolean;
  hasMore: boolean;
  error: string | null;
  
  // 操作方法
  loadContent: (tabType: TabType, refresh?: boolean) => Promise<void>;
  loadMore: () => Promise<void>;
  refresh: () => Promise<void>;
  likeContent: (contentId: string) => Promise<void>;
  collectContent: (contentId: string) => Promise<void>;
  followUser: (userId: string) => Promise<void>;
  shareContent: (contentId: string, platform: string) => Promise<void>;
  
  // 工具方法
  getContentById: (contentId: string) => ContentItem | undefined;
  getContentsByUser: (userId: string) => ContentItem[];
  clearTabContent: (tabType: TabType) => void;
  resetAllData: () => void;
  
  // 统计信息
  getTotalContentCount: () => number;
  getTabContentCount: (tabType: TabType) => number;
}

// 模拟API调用函数
const mockApiCall = <T,>(data: T, delay = 800): Promise<ApiResponse<T>> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      // 10% 的概率模拟网络错误
      if (Math.random() < 0.1) {
        reject(new Error(ERROR_MESSAGES.NETWORK_ERROR));
        return;
      }
      
      resolve({
        code: 200,
        message: 'success',
        data,
        success: true,
      });
    }, delay);
  });
};

// 生成模拟内容数据
const generateMockContent = (page: number, tabType: TabType, limit = 20): ContentItem[] => {
  return Array.from({ length: limit }, (_, index) => {
    const globalIndex = (page - 1) * limit + index + 1;
    const id = `${tabType}_${page}_${index}`;
    
    return {
      id,
      type: Math.random() > 0.8 ? 'video' : 'image',
      imageUrl: `https://picsum.photos/400/${300 + Math.floor(Math.random() * 200)}?random=${globalIndex}`,
      title: `请你们看雪 ${tabType} ${globalIndex}`,
      description: `这是一个${tabType}内容的描述文字，用于展示卡片布局效果。`,
      user: {
        id: `user_${globalIndex}`,
        nickname: `用户名称${globalIndex}`,
        avatar: `https://picsum.photos/100/100?random=${globalIndex + 1000}`,
        isFollowing: Math.random() > 0.7,
        verified: Math.random() > 0.8,
      },
      likeCount: Math.floor(Math.random() * 1000),
      commentCount: Math.floor(Math.random() * 100),
      shareCount: Math.floor(Math.random() * 50),
      isLiked: Math.random() > 0.8,
      isCollected: Math.random() > 0.9,
      createdAt: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date().toISOString(),
      width: 400,
      height: 300 + Math.floor(Math.random() * 200),
      tags: [`标签${globalIndex % 5 + 1}`, `分类${globalIndex % 3 + 1}`],
    };
  });
};

export const useDiscoverContent = (initialTab: TabType = 'hot'): UseDiscoverContentResult => {
  // 当前活跃Tab
  const [currentTab, setCurrentTab] = useState<TabType>(initialTab);
  
  // Hook主状态
  const [state, setState] = useState<UseDiscoverContentState>({
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
  
  // 分页信息状态
  const [pageInfo, setPageInfo] = useState<Record<TabType, PageInfo>>({
    follow: { page: 1, total: 0 },
    hot: { page: 1, total: 0 },
    local: { page: 1, total: 0 },
  });
  
  // 进行中的请求引用（用于取消请求）
  const requestsRef = useRef<Map<string, AbortController>>(new Map());
  
  // 防重复操作的引用
  const operationLocksRef = useRef<Set<string>>(new Set());

  // 取消指定的请求
  const cancelRequest = useCallback((requestKey: string) => {
    const controller = requestsRef.current.get(requestKey);
    if (controller) {
      controller.abort();
      requestsRef.current.delete(requestKey);
    }
  }, []);

  // 取消所有请求
  const cancelAllRequests = useCallback(() => {
    requestsRef.current.forEach((controller) => {
      controller.abort();
    });
    requestsRef.current.clear();
  }, []);

  // 创建请求控制器
  const createRequestController = useCallback((requestKey: string): AbortController => {
    // 取消之前的同类请求
    cancelRequest(requestKey);
    
    const controller = new AbortController();
    requestsRef.current.set(requestKey, controller);
    return controller;
  }, [cancelRequest]);

  // 模拟API：获取关注内容
  const fetchFollowContent = useCallback(async (page: number, limit: number): Promise<ContentListResponse> => {
    const mockData: ContentListResponse = {
      list: generateMockContent(page, 'follow', limit),
      hasMore: page < 5,
      nextCursor: page < 5 ? `follow_page_${page + 1}` : undefined,
      total: 100,
    };
    
    const response = await mockApiCall(mockData);
    return response.data;
  }, []);

  // 模拟API：获取热门内容
  const fetchHotContent = useCallback(async (page: number, limit: number): Promise<ContentListResponse> => {
    const mockData: ContentListResponse = {
      list: generateMockContent(page, 'hot', limit),
      hasMore: page < 5,
      nextCursor: page < 5 ? `hot_page_${page + 1}` : undefined,
      total: 100,
    };
    
    const response = await mockApiCall(mockData);
    return response.data;
  }, []);

  // 模拟API：获取同城内容
  const fetchLocalContent = useCallback(async (page: number, limit: number): Promise<ContentListResponse> => {
    const mockData: ContentListResponse = {
      list: generateMockContent(page, 'local', limit),
      hasMore: page < 5,
      nextCursor: page < 5 ? `local_page_${page + 1}` : undefined,
      total: 100,
    };
    
    const response = await mockApiCall(mockData);
    return response.data;
  }, []);

  // 根据Tab类型获取对应的API函数
  const getApiFunctionByTab = useCallback((tabType: TabType) => {
    switch (tabType) {
      case 'follow':
        return fetchFollowContent;
      case 'hot':
        return fetchHotContent;
      case 'local':
        return fetchLocalContent;
      default:
        return fetchHotContent;
    }
  }, [fetchFollowContent, fetchHotContent, fetchLocalContent]);

  // 加载内容数据
  const loadContent = useCallback(async (tabType: TabType, refresh = false) => {
    try {
      const requestKey = `load_${tabType}`;
      const controller = createRequestController(requestKey);
      
      // 更新加载状态
      setState(prev => ({
        ...prev,
        loading: { ...prev.loading, [tabType]: !refresh },
        refreshing: { ...prev.refreshing, [tabType]: refresh },
        error: null,
      }));

      // 获取分页信息
      const currentPage = refresh ? 1 : pageInfo[tabType].page;
      const apiFn = getApiFunctionByTab(tabType);
      
      // 调用API
      const result = await apiFn(currentPage, REQUEST_CONFIG.PAGE_SIZE);
      
      // 检查请求是否被取消
      if (controller.signal.aborted) {
        return;
      }

      // 更新数据
      setState(prev => ({
        ...prev,
        content: {
          ...prev.content,
          [tabType]: refresh ? result.list : [...prev.content[tabType], ...result.list],
        },
        hasMore: { ...prev.hasMore, [tabType]: result.hasMore },
        lastRefreshTime: { ...prev.lastRefreshTime, [tabType]: Date.now() },
      }));

      // 更新分页信息
      setPageInfo(prev => ({
        ...prev,
        [tabType]: {
          page: refresh ? 2 : currentPage + 1,
          nextCursor: result.nextCursor,
          total: result.total,
        },
      }));

    } catch (error) {
      console.error(`加载${tabType}内容失败:`, error);
      setState(prev => ({
        ...prev,
        error: error instanceof Error ? error.message : ERROR_MESSAGES.NETWORK_ERROR,
      }));
    } finally {
      setState(prev => ({
        ...prev,
        loading: { ...prev.loading, [tabType]: false },
        refreshing: { ...prev.refreshing, [tabType]: false },
      }));
      
      // 清理请求引用
      requestsRef.current.delete(`load_${tabType}`);
    }
  }, [pageInfo, getApiFunctionByTab, createRequestController]);

  // 加载更多数据
  const loadMore = useCallback(async () => {
    if (!state.hasMore[currentTab] || state.loading[currentTab]) {
      return;
    }
    
    await loadContent(currentTab, false);
  }, [currentTab, state.hasMore, state.loading, loadContent]);

  // 刷新数据
  const refresh = useCallback(async () => {
    await loadContent(currentTab, true);
  }, [currentTab, loadContent]);

  // 点赞内容
  const likeContent = useCallback(async (contentId: string) => {
    const operationKey = `like_${contentId}`;
    
    // 防重复操作
    if (operationLocksRef.current.has(operationKey)) {
      return;
    }
    
    operationLocksRef.current.add(operationKey);
    
    try {
      // 找到对应的内容项
      const currentContent = state.content[currentTab];
      const item = currentContent.find(item => item.id === contentId);
      
      if (!item) {
        throw new Error('内容不存在');
      }

      // 乐观更新UI
      const newIsLiked = !item.isLiked;
      const newLikeCount = newIsLiked ? item.likeCount + 1 : item.likeCount - 1;
      
      setState(prev => ({
        ...prev,
        content: {
          ...prev.content,
          [currentTab]: prev.content[currentTab].map(contentItem =>
            contentItem.id === contentId
              ? { ...contentItem, isLiked: newIsLiked, likeCount: newLikeCount }
              : contentItem
          ),
        },
      }));

      // 模拟API调用
      const mockResponse: LikeResponse = {
        isLiked: newIsLiked,
        likeCount: newLikeCount,
      };

      await mockApiCall(mockResponse, 300);
      
      // 这里可以显示成功提示
      console.log(newIsLiked ? SUCCESS_MESSAGES.LIKE_SUCCESS : SUCCESS_MESSAGES.UNLIKE_SUCCESS);
      
    } catch (error) {
      console.error('点赞操作失败:', error);
      
      // 回滚UI状态
      setState(prev => ({
        ...prev,
        content: {
          ...prev.content,
          [currentTab]: prev.content[currentTab].map(contentItem =>
            contentItem.id === contentId
              ? { 
                  ...contentItem, 
                  isLiked: !contentItem.isLiked,
                  likeCount: contentItem.isLiked ? contentItem.likeCount - 1 : contentItem.likeCount + 1
                }
              : contentItem
          ),
        },
      }));
      
      throw error;
    } finally {
      operationLocksRef.current.delete(operationKey);
    }
  }, [state.content, currentTab]);

  // 收藏内容
  const collectContent = useCallback(async (contentId: string) => {
    const operationKey = `collect_${contentId}`;
    
    if (operationLocksRef.current.has(operationKey)) {
      return;
    }
    
    operationLocksRef.current.add(operationKey);
    
    try {
      // 乐观更新UI
      setState(prev => ({
        ...prev,
        content: {
          ...prev.content,
          [currentTab]: prev.content[currentTab].map(contentItem =>
            contentItem.id === contentId
              ? { ...contentItem, isCollected: !contentItem.isCollected }
              : contentItem
          ),
        },
      }));

      // 模拟API调用
      await mockApiCall({ success: true }, 300);
      
    } catch (error) {
      console.error('收藏操作失败:', error);
      
      // 回滚UI状态
      setState(prev => ({
        ...prev,
        content: {
          ...prev.content,
          [currentTab]: prev.content[currentTab].map(contentItem =>
            contentItem.id === contentId
              ? { ...contentItem, isCollected: !contentItem.isCollected }
              : contentItem
          ),
        },
      }));
      
      throw error;
    } finally {
      operationLocksRef.current.delete(operationKey);
    }
  }, [currentTab]);

  // 关注用户
  const followUser = useCallback(async (userId: string) => {
    const operationKey = `follow_${userId}`;
    
    if (operationLocksRef.current.has(operationKey)) {
      return;
    }
    
    operationLocksRef.current.add(operationKey);
    
    try {
      // 乐观更新UI（影响该用户的所有内容）
      setState(prev => ({
        ...prev,
        content: {
          ...prev.content,
          [currentTab]: prev.content[currentTab].map(contentItem =>
            contentItem.user.id === userId
              ? { 
                  ...contentItem, 
                  user: { ...contentItem.user, isFollowing: !contentItem.user.isFollowing }
                }
              : contentItem
          ),
        },
      }));

      // 模拟API调用
      const mockResponse: FollowResponse = {
        isFollowing: true,
        followerCount: 100,
      };

      await mockApiCall(mockResponse, 500);
      
    } catch (error) {
      console.error('关注操作失败:', error);
      
      // 回滚UI状态
      setState(prev => ({
        ...prev,
        content: {
          ...prev.content,
          [currentTab]: prev.content[currentTab].map(contentItem =>
            contentItem.user.id === userId
              ? { 
                  ...contentItem, 
                  user: { ...contentItem.user, isFollowing: !contentItem.user.isFollowing }
                }
              : contentItem
          ),
        },
      }));
      
      throw error;
    } finally {
      operationLocksRef.current.delete(operationKey);
    }
  }, [currentTab]);

  // 分享内容
  const shareContent = useCallback(async (contentId: string, platform: string) => {
    try {
      console.log(`分享内容 ${contentId} 到 ${platform}`);
      
      // 模拟API调用
      await mockApiCall({ success: true }, 200);
      
      // 更新分享计数（可选）
      setState(prev => ({
        ...prev,
        content: {
          ...prev.content,
          [currentTab]: prev.content[currentTab].map(contentItem =>
            contentItem.id === contentId
              ? { ...contentItem, shareCount: contentItem.shareCount + 1 }
              : contentItem
          ),
        },
      }));
      
    } catch (error) {
      console.error('分享操作失败:', error);
      throw error;
    }
  }, [currentTab]);

  // 工具方法：根据ID获取内容
  const getContentById = useCallback((contentId: string): ContentItem | undefined => {
    for (const tabType of Object.keys(state.content) as TabType[]) {
      const item = state.content[tabType].find(item => item.id === contentId);
      if (item) return item;
    }
    return undefined;
  }, [state.content]);

  // 工具方法：获取指定用户的所有内容
  const getContentsByUser = useCallback((userId: string): ContentItem[] => {
    const userContents: ContentItem[] = [];
    
    for (const tabType of Object.keys(state.content) as TabType[]) {
      const tabContents = state.content[tabType].filter(item => item.user.id === userId);
      userContents.push(...tabContents);
    }
    
    return userContents;
  }, [state.content]);

  // 工具方法：清空指定Tab的内容
  const clearTabContent = useCallback((tabType: TabType) => {
    setState(prev => ({
      ...prev,
      content: { ...prev.content, [tabType]: [] },
      hasMore: { ...prev.hasMore, [tabType]: true },
    }));
    
    setPageInfo(prev => ({
      ...prev,
      [tabType]: { page: 1, total: 0 },
    }));
  }, []);

  // 工具方法：重置所有数据
  const resetAllData = useCallback(() => {
    setState({
      content: { follow: [], hot: [], local: [] },
      loading: { follow: false, hot: false, local: false },
      refreshing: { follow: false, hot: false, local: false },
      hasMore: { follow: true, hot: true, local: true },
      error: null,
      lastRefreshTime: { follow: 0, hot: 0, local: 0 },
    });
    
    setPageInfo({
      follow: { page: 1, total: 0 },
      hot: { page: 1, total: 0 },
      local: { page: 1, total: 0 },
    });
  }, []);

  // 统计方法：获取总内容数量
  const getTotalContentCount = useCallback((): number => {
    return Object.values(state.content).reduce((total, contents) => total + contents.length, 0);
  }, [state.content]);

  // 统计方法：获取指定Tab的内容数量
  const getTabContentCount = useCallback((tabType: TabType): number => {
    return state.content[tabType].length;
  }, [state.content]);

  // 更新当前Tab（外部调用）
  const updateCurrentTab = useCallback((tabType: TabType) => {
    setCurrentTab(tabType);
  }, []);

  // 组件卸载时清理
  useEffect(() => {
    return () => {
      cancelAllRequests();
      operationLocksRef.current.clear();
    };
  }, [cancelAllRequests]);

  // 返回Hook接口
  return {
    // 数据状态
    currentTabContent: state.content[currentTab],
    loading: state.loading[currentTab],
    refreshing: state.refreshing[currentTab],
    hasMore: state.hasMore[currentTab],
    error: state.error,
    
    // 操作方法
    loadContent,
    loadMore,
    refresh,
    likeContent,
    collectContent,
    followUser,
    shareContent,
    
    // 工具方法
    getContentById,
    getContentsByUser,
    clearTabContent,
    resetAllData,
    
    // 统计信息
    getTotalContentCount,
    getTabContentCount,
  };
};
