// #region 1. File Banner & TOC
/**
 * 消息页面主状态管理
 * 
 * TOC (快速跳转):
 * [1] Imports
 * [2] Types & Schema
 * [3] Constants & Config
 * [4] Utils & Helpers
 * [5] State Management
 * [6] Domain Logic
 * [7] API Integration
 * [8] Exports
 */
// #endregion

// #region 2. Imports
import { useState, useCallback, useRef } from 'react';
import { MessageCategory, RecentChat, MessageState } from './types';
import { MESSAGE_CATEGORIES, MESSAGE_CONFIG } from './constants';
// #endregion

// #region 3. Types & Schema
interface UseMessageReturn {
  categories: MessageCategory[];
  recentChats: RecentChat[];
  loading: boolean;
  error: string | null;
  loadMessageData: () => Promise<void>;
  refreshMessageData: () => Promise<void>;
  clearAllChats: () => Promise<void>;
  updateCategoryCount: (categoryId: string, count: number) => void;
}

interface MessageLoadOptions {
  forceRefresh?: boolean;
  showLoading?: boolean;
}
// #endregion

// #region 4. Constants & Config
const INITIAL_STATE: MessageState = {
  categories: MESSAGE_CATEGORIES.map(cat => ({ ...cat, unreadCount: 0 })),
  recentChats: [],
  loading: false,
  error: null
};

const MOCK_DELAY = 800;
const MAX_RETRY_ATTEMPTS = 3;
// #endregion

// #region 5. Utils & Helpers
const generateMockUnreadCounts = () => ({
  like_collect: Math.floor(Math.random() * 5),
  comment: Math.floor(Math.random() * 3) + 1, // 至少1个
  follower: Math.floor(Math.random() * 8),
  system: Math.floor(Math.random() * 2)
});

const simulateApiCall = async <T>(data: T, delay: number = MOCK_DELAY): Promise<T> => {
  await new Promise(resolve => setTimeout(resolve, delay));
  
  // 模拟随机失败
  if (Math.random() < 0.1) {
    throw new Error('网络请求失败，请稍后重试');
  }
  
  return data;
};

const createMockRecentChats = (): RecentChat[] => [
  {
    id: '1',
    user: {
      id: 'u1',
      nickname: '小明',
      avatar: '',
      isOnline: true,
      lastActiveTime: new Date().toISOString()
    },
    lastMessage: {
      content: '今晚一起玩游戏吗？',
      type: 'text',
      timestamp: new Date(Date.now() - 2 * 60 * 1000).toISOString() // 2分钟前
    },
    unreadCount: 2,
    isTop: false,
    isMuted: false
  },
  {
    id: '2',
    user: {
      id: 'u2',
      nickname: '小红',
      avatar: '',
      isOnline: false,
      lastActiveTime: new Date(Date.now() - 45 * 60 * 1000).toISOString() // 45分钟前
    },
    lastMessage: {
      content: '好的，没问题',
      type: 'text',
      timestamp: new Date(Date.now() - 45 * 60 * 1000).toISOString()
    },
    unreadCount: 0,
    isTop: true,
    isMuted: false
  },
  {
    id: '3',
    user: {
      id: 'u3',
      nickname: '游戏达人',
      avatar: '',
      isOnline: true,
      lastActiveTime: new Date(Date.now() - 75 * 60 * 1000).toISOString() // 75分钟前
    },
    lastMessage: {
      content: '[图片]',
      type: 'image',
      timestamp: new Date(Date.now() - 75 * 60 * 1000).toISOString()
    },
    unreadCount: 5,
    isTop: false,
    isMuted: true
  }
];
// #endregion

// #region 6. State Management
export const useMessage = (): UseMessageReturn => {
  const [state, setState] = useState<MessageState>(INITIAL_STATE);
  const loadingRef = useRef(false);
  const retryCountRef = useRef(0);

  const updateState = useCallback((updates: Partial<MessageState>) => {
    setState(prev => ({ ...prev, ...updates }));
  }, []);

  const resetError = useCallback(() => {
    updateState({ error: null });
  }, [updateState]);
// #endregion

// #region 7. Domain Logic
  const loadMessageData = useCallback(async (options: MessageLoadOptions = {}) => {
    if (loadingRef.current && !options.forceRefresh) {
      return;
    }

    loadingRef.current = true;
    
    if (options.showLoading !== false) {
      updateState({ loading: true, error: null });
    }

    try {
      resetError();
      
      // 模拟并发请求
      const [mockUnreadCounts, mockChats] = await Promise.all([
        simulateApiCall(generateMockUnreadCounts()),
        simulateApiCall(createMockRecentChats())
      ]);
      
      const categoriesWithUnread = MESSAGE_CATEGORIES.map(cat => ({
        ...cat,
        unreadCount: mockUnreadCounts[cat.id as keyof typeof mockUnreadCounts] || 0
      }));
      
      updateState({
        categories: categoriesWithUnread,
        recentChats: mockChats,
        loading: false,
        error: null
      });
      
      retryCountRef.current = 0;
    } catch (error) {
      console.error('加载消息数据失败:', error);
      
      const errorMessage = error instanceof Error ? error.message : '加载消息数据失败';
      updateState({ 
        loading: false, 
        error: errorMessage 
      });
      
      // 自动重试机制
      if (retryCountRef.current < MAX_RETRY_ATTEMPTS) {
        retryCountRef.current++;
        setTimeout(() => {
          loadMessageData(options);
        }, 2000 * retryCountRef.current); // 递增延迟
      }
    } finally {
      loadingRef.current = false;
    }
  }, [updateState, resetError]);

  const refreshMessageData = useCallback(async () => {
    await loadMessageData({ forceRefresh: true, showLoading: false });
  }, [loadMessageData]);

  const clearAllChats = useCallback(async () => {
    try {
      updateState({ loading: true });
      
      await simulateApiCall(null, 500); // 模拟清空操作
      
      updateState({ 
        recentChats: [],
        loading: false 
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : '清空对话失败';
      updateState({ 
        loading: false, 
        error: errorMessage 
      });
    }
  }, [updateState]);

  const updateCategoryCount = useCallback((categoryId: string, count: number) => {
    setState(prev => ({
      ...prev,
      categories: prev.categories.map(cat => 
        cat.id === categoryId 
          ? { ...cat, unreadCount: Math.max(0, count) }
          : cat
      )
    }));
  }, []);
// #endregion

// #region 8. API Integration
  // 这里可以添加实际的API调用逻辑
  // const fetchMessageData = async () => { ... };
  // const clearChatsApi = async () => { ... };
// #endregion

// #region 9. Exports
  return {
    categories: state.categories,
    recentChats: state.recentChats,
    loading: state.loading,
    error: state.error,
    loadMessageData,
    refreshMessageData,
    clearAllChats,
    updateCategoryCount
  };
};
// #endregion
