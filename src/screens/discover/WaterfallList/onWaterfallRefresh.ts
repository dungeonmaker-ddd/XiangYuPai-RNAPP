/**
 * 瀑布流下拉刷新事件处理器
 * 基于通用组件架构核心标准 - 事件处理层
 * 
 * @version 2.0.0
 * @author 架构团队
 */

import { TabType } from './types';
import { API_CONSTANTS, UX_CONSTANTS } from './constants';

// =====================================================
// 刷新事件参数接口
// =====================================================

export interface WaterfallRefreshParams {
  tabType: TabType;
  currentData?: any[];
  onRefreshStart?: () => void;
  onRefreshComplete?: (data: any[]) => void;
  onRefreshError?: (error: Error) => void;
  analytics?: any;
  showToast?: (message: string) => void;
  apiService?: any;
}

// =====================================================
// 刷新处理结果接口
// =====================================================

export interface WaterfallRefreshResult {
  success: boolean;
  action: 'refresh_completed' | 'no_new_data' | 'network_error' | 'error';
  message?: string;
  data?: {
    newData: any[];
    totalCount: number;
    refreshTime: string;
    hasNewContent: boolean;
  };
}

// =====================================================
// 主要事件处理函数
// =====================================================

/**
 * 处理瀑布流下拉刷新事件
 * @param params 刷新事件参数
 * @returns 处理结果
 */
export const onWaterfallRefresh = async (params: WaterfallRefreshParams): Promise<WaterfallRefreshResult> => {
  const { 
    tabType, 
    currentData = [],
    onRefreshStart,
    onRefreshComplete,
    onRefreshError,
    analytics, 
    showToast = defaultShowToast,
    apiService
  } = params;

  try {
    // 1. 记录刷新开始
    await recordRefreshAnalytics({
      tabType,
      action: 'refresh_start',
      currentItemCount: currentData.length,
      analytics,
    });

    // 2. 触发刷新开始回调
    onRefreshStart?.();

    // 3. 检查网络状态
    const networkCheck = await checkNetworkStatus();
    if (!networkCheck.isConnected) {
      showToast('网络连接失败，请检查网络设置');
      return {
        success: false,
        action: 'network_error',
        message: '网络连接失败',
      };
    }

    // 4. 确保最小刷新时间，避免闪烁
    const refreshStartTime = Date.now();
    
    // 5. 获取最新数据
    const refreshResult = await fetchLatestContent({
      tabType,
      currentData,
      apiService,
    });

    // 6. 确保最小刷新时间
    const refreshDuration = Date.now() - refreshStartTime;
    if (refreshDuration < UX_CONSTANTS.MIN_LOADING_TIME) {
      await new Promise(resolve => 
        setTimeout(resolve, UX_CONSTANTS.MIN_LOADING_TIME - refreshDuration)
      );
    }

    if (refreshResult.success) {
      const { newData, hasNewContent } = refreshResult;
      
      // 7. 记录刷新完成
      await recordRefreshAnalytics({
        tabType,
        action: 'refresh_complete',
        currentItemCount: currentData.length,
        newItemCount: newData.length,
        hasNewContent,
        analytics,
      });

      // 8. 触发刷新完成回调
      onRefreshComplete?.(newData);

      // 9. 显示刷新结果提示
      if (hasNewContent) {
        const newItemCount = newData.length - currentData.length;
        showToast(`刷新成功，获取到 ${newItemCount} 条新内容`);
      } else {
        showToast('已是最新内容');
      }

      return {
        success: true,
        action: hasNewContent ? 'refresh_completed' : 'no_new_data',
        data: {
          newData,
          totalCount: newData.length,
          refreshTime: new Date().toISOString(),
          hasNewContent,
        },
      };
    } else {
      throw new Error(refreshResult.error || '刷新失败');
    }

  } catch (error) {
    console.error('刷新处理失败:', error);
    
    // 记录错误分析
    await recordRefreshErrorAnalytics({
      error: error as Error,
      tabType,
      analytics,
    });

    // 触发错误回调
    onRefreshError?.(error as Error);

    showToast('刷新失败，请重试');
    
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
 * 获取最新内容
 */
const fetchLatestContent = async (params: {
  tabType: TabType;
  currentData: any[];
  apiService?: any;
}): Promise<{
  success: boolean;
  newData: any[];
  hasNewContent: boolean;
  error?: string;
}> => {
  const { tabType, currentData, apiService } = params;

  try {
    // 模拟API调用
    return new Promise(resolve => {
      setTimeout(() => {
        const success = Math.random() > 0.1; // 90% 成功率
        
        if (success) {
          // 模拟新数据
          const hasNewContent = Math.random() > 0.3; // 70% 有新内容
          const newItemCount = hasNewContent ? Math.floor(Math.random() * 10) + 1 : 0;
          
          const newItems = Array.from({ length: newItemCount }, (_, index) => ({
            id: `refresh_${Date.now()}_${index}`,
            title: `刷新获取的新内容 ${index + 1}`,
            imageUrl: `https://picsum.photos/300/400?random=${Date.now()}_${index}`,
            width: 300,
            height: 400,
            type: 'image',
            likeCount: Math.floor(Math.random() * 100),
            isLiked: false,
            isCollected: false,
            commentCount: Math.floor(Math.random() * 50),
            shareCount: Math.floor(Math.random() * 20),
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            user: {
              id: `user_${Math.random().toString(36).substr(2, 9)}`,
              nickname: `用户${Math.floor(Math.random() * 1000)}`,
              avatar: `https://picsum.photos/50/50?random=user_${Date.now()}`,
              isFollowing: false,
            },
          }));

          const newData = hasNewContent ? [...newItems, ...currentData] : currentData;
          
          resolve({
            success: true,
            newData,
            hasNewContent,
          });
        } else {
          resolve({
            success: false,
            newData: currentData,
            hasNewContent: false,
            error: '服务器错误',
          });
        }
      }, Math.random() * 1000 + 500); // 500-1500ms 随机延迟
    });
  } catch (error) {
    console.error('获取最新内容失败:', error);
    return {
      success: false,
      newData: currentData,
      hasNewContent: false,
      error: (error as Error).message,
    };
  }
};

/**
 * 记录刷新分析数据
 */
const recordRefreshAnalytics = async (params: {
  tabType: TabType;
  action: 'refresh_start' | 'refresh_complete';
  currentItemCount: number;
  newItemCount?: number;
  hasNewContent?: boolean;
  analytics?: any;
}): Promise<void> => {
  const { tabType, action, currentItemCount, newItemCount, hasNewContent, analytics } = params;

  const analyticsData = {
    event: 'waterfall_refresh',
    properties: {
      tab_type: tabType,
      action,
      current_item_count: currentItemCount,
      new_item_count: newItemCount,
      has_new_content: hasNewContent,
      timestamp: Date.now(),
      platform: 'react-native',
    },
  };

  try {
    if (analytics && typeof analytics.track === 'function') {
      analytics.track(analyticsData.event, analyticsData.properties);
    } else if (__DEV__) {
      console.log('📊 刷新分析:', analyticsData);
    }
  } catch (error) {
    console.error('记录刷新分析数据失败:', error);
  }
};

/**
 * 记录刷新错误分析
 */
const recordRefreshErrorAnalytics = async (params: {
  error: Error;
  tabType: TabType;
  analytics?: any;
}): Promise<void> => {
  const { error, tabType, analytics } = params;

  const errorData = {
    event: 'refresh_error',
    properties: {
      error_message: error.message,
      error_stack: error.stack,
      tab_type: tabType,
      timestamp: Date.now(),
    },
  };

  try {
    if (analytics && typeof analytics.track === 'function') {
      analytics.track(errorData.event, errorData.properties);
    } else if (__DEV__) {
      console.error('🚨 刷新错误分析:', errorData);
    }
  } catch (analyticsError) {
    console.error('记录刷新错误分析失败:', analyticsError);
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
 * 快速创建刷新处理器
 */
export const createWaterfallRefreshHandler = (config: {
  analytics?: any;
  showToast?: (message: string) => void;
  apiService?: any;
  onRefreshStart?: () => void;
  onRefreshComplete?: (data: any[]) => void;
  onRefreshError?: (error: Error) => void;
}) => {
  return (tabType: TabType, currentData?: any[]) => {
    return onWaterfallRefresh({
      tabType,
      currentData,
      ...config,
    });
  };
};

/**
 * 默认的刷新处理器
 */
export const defaultWaterfallRefreshHandler = (
  tabType: TabType, 
  currentData?: any[]
) => {
  return onWaterfallRefresh({
    tabType,
    currentData,
  });
};
