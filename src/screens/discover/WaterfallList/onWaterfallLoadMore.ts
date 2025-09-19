/**
 * 瀑布流加载更多事件处理器
 * 基于通用组件架构核心标准 - 事件处理层
 * 
 * @version 2.0.0
 * @author 架构团队
 */

import { TabType, PaginationParams } from './types';
import { API_CONSTANTS, UX_CONSTANTS } from './constants';

// =====================================================
// 加载更多事件参数接口
// =====================================================

export interface WaterfallLoadMoreParams {
  tabType: TabType;
  currentData: any[];
  currentPage: number;
  pageSize?: number;
  lastItemId?: string;
  onLoadStart?: () => void;
  onLoadComplete?: (newData: any[], hasMore: boolean) => void;
  onLoadError?: (error: Error) => void;
  analytics?: any;
  showToast?: (message: string) => void;
  apiService?: any;
}

// =====================================================
// 加载更多处理结果接口
// =====================================================

export interface WaterfallLoadMoreResult {
  success: boolean;
  action: 'load_completed' | 'no_more_data' | 'network_error' | 'rate_limited' | 'error';
  message?: string;
  data?: {
    newData: any[];
    currentPage: number;
    totalCount: number;
    hasMore: boolean;
    loadTime: number;
  };
}

// =====================================================
// 主要事件处理函数
// =====================================================

/**
 * 处理瀑布流加载更多事件
 * @param params 加载更多事件参数
 * @returns 处理结果
 */
export const onWaterfallLoadMore = async (params: WaterfallLoadMoreParams): Promise<WaterfallLoadMoreResult> => {
  const { 
    tabType, 
    currentData,
    currentPage,
    pageSize = API_CONSTANTS.DEFAULT_PAGE_SIZE,
    lastItemId,
    onLoadStart,
    onLoadComplete,
    onLoadError,
    analytics, 
    showToast = defaultShowToast,
    apiService
  } = params;

  const loadStartTime = Date.now();

  try {
    // 1. 验证参数
    if (!currentData || !Array.isArray(currentData)) {
      throw new Error('当前数据无效');
    }

    // 2. 检查加载频率限制
    const rateLimitCheck = await checkLoadMoreRateLimit(tabType);
    if (!rateLimitCheck.allowed) {
      showToast('加载太频繁，请稍后再试');
      return {
        success: false,
        action: 'rate_limited',
        message: rateLimitCheck.reason,
      };
    }

    // 3. 记录加载开始分析
    await recordLoadMoreAnalytics({
      tabType,
      action: 'load_start',
      currentPage,
      currentItemCount: currentData.length,
      analytics,
    });

    // 4. 触发加载开始回调
    onLoadStart?.();

    // 5. 检查网络状态
    const networkCheck = await checkNetworkStatus();
    if (!networkCheck.isConnected) {
      showToast('网络连接失败，请检查网络设置');
      return {
        success: false,
        action: 'network_error',
        message: '网络连接失败',
      };
    }

    // 6. 构建分页参数
    const paginationParams: PaginationParams = {
      page: currentPage + 1,
      limit: pageSize,
      tabType,
      lastItemId,
    };

    // 7. 获取更多数据
    const loadResult = await fetchMoreContent({
      params: paginationParams,
      currentData,
      apiService,
    });

    const loadTime = Date.now() - loadStartTime;

    if (loadResult.success) {
      const { newItems, hasMore, totalCount } = loadResult;
      
      // 8. 记录加载完成分析
      await recordLoadMoreAnalytics({
        tabType,
        action: 'load_complete',
        currentPage,
        currentItemCount: currentData.length,
        newItemCount: newItems.length,
        hasMore,
        loadTime,
        analytics,
      });

      // 9. 触发加载完成回调
      onLoadComplete?.(newItems, hasMore);

      // 10. 显示加载结果提示
      if (newItems.length > 0) {
        if (newItems.length < pageSize) {
          showToast(`加载了 ${newItems.length} 条内容，已加载全部`);
        } else {
          showToast(`加载了 ${newItems.length} 条新内容`);
        }
      } else {
        showToast('没有更多内容了');
      }

      return {
        success: true,
        action: hasMore ? 'load_completed' : 'no_more_data',
        data: {
          newData: newItems,
          currentPage: currentPage + 1,
          totalCount,
          hasMore,
          loadTime,
        },
      };
    } else {
      throw new Error(loadResult.error || '加载更多失败');
    }

  } catch (error) {
    console.error('加载更多处理失败:', error);
    
    // 记录错误分析
    await recordLoadMoreErrorAnalytics({
      error: error as Error,
      tabType,
      currentPage,
      analytics,
    });

    // 触发错误回调
    onLoadError?.(error as Error);

    showToast('加载失败，请重试');
    
    return {
      success: false,
      action: 'error',
      message: (error as Error).message,
    };
  }
};

// =====================================================
// 辅助处理函数
// =====================================================

/**
 * 检查加载更多频率限制
 */
const checkLoadMoreRateLimit = async (tabType: TabType): Promise<{
  allowed: boolean;
  reason?: string;
  remainingRequests?: number;
}> => {
  try {
    // 模拟频率限制检查
    return new Promise(resolve => {
      setTimeout(() => {
        const allowed = Math.random() > 0.02; // 98% 通过
        resolve({
          allowed,
          reason: allowed ? undefined : '请求太频繁，请稍后再试',
          remainingRequests: allowed ? 10 : 0,
        });
      }, 50);
    });
  } catch (error) {
    console.error('检查加载频率限制失败:', error);
    return { allowed: true }; // 默认允许
  }
};

/**
 * 检查网络状态
 */
const checkNetworkStatus = async (): Promise<{
  isConnected: boolean;
  connectionType?: string;
  speed?: string;
}> => {
  try {
    // 模拟网络检查
    return new Promise(resolve => {
      setTimeout(() => {
        const isConnected = Math.random() > 0.05; // 95% 网络正常
        resolve({
          isConnected,
          connectionType: isConnected ? 'wifi' : 'none',
          speed: isConnected ? 'fast' : 'none',
        });
      }, 100);
    });
  } catch (error) {
    console.error('网络状态检查失败:', error);
    return { isConnected: true }; // 默认认为网络正常
  }
};

/**
 * 获取更多内容
 */
const fetchMoreContent = async (params: {
  params: PaginationParams;
  currentData: any[];
  apiService?: any;
}): Promise<{
  success: boolean;
  newItems: any[];
  hasMore: boolean;
  totalCount: number;
  error?: string;
}> => {
  const { params: paginationParams, currentData, apiService } = params;

  try {
    // 模拟API调用
    return new Promise(resolve => {
      setTimeout(() => {
        const success = Math.random() > 0.1; // 90% 成功率
        
        if (success) {
          // 模拟分页数据
          const hasMore = Math.random() > 0.2; // 80% 还有更多数据
          const newItemCount = hasMore 
            ? Math.floor(Math.random() * paginationParams.limit) + 1 
            : Math.floor(Math.random() * (paginationParams.limit / 2));
          
          const newItems = Array.from({ length: newItemCount }, (_, index) => ({
            id: `loadmore_${Date.now()}_${paginationParams.page}_${index}`,
            title: `加载更多内容 ${paginationParams.page}-${index + 1}`,
            imageUrl: `https://picsum.photos/300/${300 + Math.floor(Math.random() * 200)}?random=${Date.now()}_${paginationParams.page}_${index}`,
            width: 300,
            height: 300 + Math.floor(Math.random() * 200),
            type: ['image', 'video', 'live'][Math.floor(Math.random() * 3)],
            likeCount: Math.floor(Math.random() * 100),
            isLiked: false,
            isCollected: false,
            commentCount: Math.floor(Math.random() * 50),
            shareCount: Math.floor(Math.random() * 20),
            createdAt: new Date(Date.now() - Math.random() * 24 * 60 * 60 * 1000).toISOString(),
            updatedAt: new Date().toISOString(),
            user: {
              id: `user_${Math.random().toString(36).substr(2, 9)}`,
              nickname: `用户${Math.floor(Math.random() * 1000)}`,
              avatar: `https://picsum.photos/50/50?random=user_${Date.now()}_${index}`,
              isFollowing: false,
            },
          }));

          resolve({
            success: true,
            newItems,
            hasMore,
            totalCount: currentData.length + newItems.length + (hasMore ? Math.floor(Math.random() * 100) : 0),
          });
        } else {
          resolve({
            success: false,
            newItems: [],
            hasMore: false,
            totalCount: currentData.length,
            error: '服务器错误',
          });
        }
      }, Math.random() * 2000 + 1000); // 1-3秒随机延迟
    });
  } catch (error) {
    console.error('获取更多内容失败:', error);
    return {
      success: false,
      newItems: [],
      hasMore: false,
      totalCount: currentData.length,
      error: (error as Error).message,
    };
  }
};

/**
 * 记录加载更多分析数据
 */
const recordLoadMoreAnalytics = async (params: {
  tabType: TabType;
  action: 'load_start' | 'load_complete';
  currentPage: number;
  currentItemCount: number;
  newItemCount?: number;
  hasMore?: boolean;
  loadTime?: number;
  analytics?: any;
}): Promise<void> => {
  const { 
    tabType, 
    action, 
    currentPage, 
    currentItemCount, 
    newItemCount, 
    hasMore, 
    loadTime, 
    analytics 
  } = params;

  const analyticsData = {
    event: 'waterfall_load_more',
    properties: {
      tab_type: tabType,
      action,
      current_page: currentPage,
      current_item_count: currentItemCount,
      new_item_count: newItemCount,
      has_more: hasMore,
      load_time: loadTime,
      timestamp: Date.now(),
      platform: 'react-native',
    },
  };

  try {
    if (analytics && typeof analytics.track === 'function') {
      analytics.track(analyticsData.event, analyticsData.properties);
    } else if (__DEV__) {
      console.log('📊 加载更多分析:', analyticsData);
    }
  } catch (error) {
    console.error('记录加载更多分析数据失败:', error);
  }
};

/**
 * 记录加载更多错误分析
 */
const recordLoadMoreErrorAnalytics = async (params: {
  error: Error;
  tabType: TabType;
  currentPage: number;
  analytics?: any;
}): Promise<void> => {
  const { error, tabType, currentPage, analytics } = params;

  const errorData = {
    event: 'load_more_error',
    properties: {
      error_message: error.message,
      error_stack: error.stack,
      tab_type: tabType,
      current_page: currentPage,
      timestamp: Date.now(),
    },
  };

  try {
    if (analytics && typeof analytics.track === 'function') {
      analytics.track(errorData.event, errorData.properties);
    } else if (__DEV__) {
      console.error('🚨 加载更多错误分析:', errorData);
    }
  } catch (analyticsError) {
    console.error('记录加载更多错误分析失败:', analyticsError);
  }
};

/**
 * 默认的Toast显示函数
 */
const defaultShowToast = (message: string): void => {
  if (__DEV__) {
    console.log('🔔 Toast:', message);
  }
};

// =====================================================
// 便捷导出
// =====================================================

/**
 * 快速创建加载更多处理器
 */
export const createWaterfallLoadMoreHandler = (config: {
  analytics?: any;
  showToast?: (message: string) => void;
  apiService?: any;
  onLoadStart?: () => void;
  onLoadComplete?: (newData: any[], hasMore: boolean) => void;
  onLoadError?: (error: Error) => void;
}) => {
  return (tabType: TabType, currentData: any[], currentPage: number, pageSize?: number) => {
    return onWaterfallLoadMore({
      tabType,
      currentData,
      currentPage,
      pageSize,
      ...config,
    });
  };
};

/**
 * 默认的加载更多处理器
 */
export const defaultWaterfallLoadMoreHandler = (
  tabType: TabType, 
  currentData: any[], 
  currentPage: number
) => {
  return onWaterfallLoadMore({
    tabType,
    currentData,
    currentPage,
  });
};
