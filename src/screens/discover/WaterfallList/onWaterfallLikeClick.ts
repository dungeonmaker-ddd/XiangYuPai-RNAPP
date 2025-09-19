/**
 * 瀑布流点赞事件处理器
 * 基于通用组件架构核心标准 - 事件处理层
 * 
 * @version 2.0.0
 * @author 架构团队
 */

import { WaterfallLikeClickParams, TabType } from './types';

// =====================================================
// 点赞处理结果接口
// =====================================================

export interface WaterfallLikeClickResult {
  success: boolean;
  action: 'like_added' | 'like_removed' | 'login_required' | 'rate_limited' | 'error';
  message?: string;
  data?: {
    itemId: string;
    newLikeCount: number;
    isLiked: boolean;
    userId?: string;
  };
}

// =====================================================
// 主要事件处理函数
// =====================================================

/**
 * 处理瀑布流卡片点赞事件
 * @param params 点赞事件参数
 * @returns 处理结果
 */
export const onWaterfallLikeClick = async (params: WaterfallLikeClickParams): Promise<WaterfallLikeClickResult> => {
  const { 
    item, 
    index, 
    tabType, 
    clickPosition, 
    navigation, 
    analytics, 
    showToast = defaultShowToast,
    onLikeSuccess,
    onLikeError
  } = params;

  try {
    // 1. 验证参数
    if (!item || !item.id) {
      throw new Error('无效的内容项');
    }

    // 2. 检查用户登录状态
    const loginCheck = await checkUserLoginStatus();
    if (!loginCheck.isLoggedIn) {
      showToast('请先登录');
      // 可以导航到登录页面
      if (navigation) {
        navigation.navigate('Login');
      }
      return {
        success: false,
        action: 'login_required',
        message: '用户未登录',
      };
    }

    // 3. 检查点赞频率限制
    const rateLimitCheck = await checkLikeRateLimit(item.id, loginCheck.userId || '');
    if (!rateLimitCheck.allowed) {
      showToast('操作太频繁，请稍后再试');
      return {
        success: false,
        action: 'rate_limited',
        message: rateLimitCheck.reason,
      };
    }

    // 4. 记录点赞分析
    await recordLikeAnalytics({
      item,
      index,
      tabType,
      clickPosition,
      analytics,
      action: item.isLiked ? 'unlike' : 'like',
    });

    // 5. 执行点赞/取消点赞操作
    const likeResult = await performLikeOperation({
      item,
      userId: loginCheck.userId || '',
      isCurrentlyLiked: item.isLiked,
    });

    if (likeResult.success) {
      // 触发成功回调
      onLikeSuccess?.(item.id, likeResult.newLikeCount);
      
      const actionText = likeResult.isLiked ? '点赞成功' : '取消点赞';
      showToast(actionText);
      
      return {
        success: true,
        action: likeResult.isLiked ? 'like_added' : 'like_removed',
        data: {
          itemId: item.id,
          newLikeCount: likeResult.newLikeCount,
          isLiked: likeResult.isLiked,
          userId: loginCheck.userId || '',
        },
      };
    } else {
      throw new Error(likeResult.error || '点赞操作失败');
    }

  } catch (error) {
    console.error('点赞处理失败:', error);
    
    // 记录错误分析
    await recordLikeErrorAnalytics({
      error: error as Error,
      item,
      tabType,
      analytics,
    });

    // 触发错误回调
    onLikeError?.(item.id, error as Error);

    showToast('操作失败，请重试');
    
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
 * 检查用户登录状态
 */
const checkUserLoginStatus = async (): Promise<{
  isLoggedIn: boolean;
  userId?: string;
  userInfo?: any;
}> => {
  try {
    // 模拟登录检查
    return new Promise(resolve => {
      setTimeout(() => {
        const isLoggedIn = Math.random() > 0.1; // 90% 已登录
        resolve({
          isLoggedIn,
          userId: isLoggedIn ? `user_${Math.random().toString(36).substr(2, 9)}` : undefined,
          userInfo: isLoggedIn ? { nickname: '测试用户' } : undefined,
        });
      }, 50);
    });
  } catch (error) {
    console.error('检查登录状态失败:', error);
    return { isLoggedIn: false };
  }
};

/**
 * 检查点赞频率限制
 */
const checkLikeRateLimit = async (itemId: string, userId: string): Promise<{
  allowed: boolean;
  reason?: string;
  remainingCount?: number;
}> => {
  try {
    return new Promise(resolve => {
      setTimeout(() => {
        const allowed = Math.random() > 0.05; // 95% 通过
        resolve({
          allowed,
          reason: allowed ? undefined : '操作太频繁',
          remainingCount: allowed ? 10 : 0,
        });
      }, 30);
    });
  } catch (error) {
    console.error('检查点赞频率限制失败:', error);
    return { allowed: true };
  }
};

/**
 * 执行点赞操作
 */
const performLikeOperation = async (params: {
  item: any;
  userId: string;
  isCurrentlyLiked: boolean;
}): Promise<{
  success: boolean;
  newLikeCount: number;
  isLiked: boolean;
  error?: string;
}> => {
  const { item, userId, isCurrentlyLiked } = params;

  try {
    return new Promise(resolve => {
      setTimeout(() => {
        const success = Math.random() > 0.02; // 98% 成功率
        
        if (success) {
          const newIsLiked = !isCurrentlyLiked;
          const newLikeCount = newIsLiked 
            ? item.likeCount + 1 
            : Math.max(0, item.likeCount - 1);
            
          resolve({
            success: true,
            newLikeCount,
            isLiked: newIsLiked,
          });
        } else {
          resolve({
            success: false,
            newLikeCount: item.likeCount,
            isLiked: isCurrentlyLiked,
            error: '网络错误',
          });
        }
      }, 200);
    });
  } catch (error) {
    console.error('执行点赞操作失败:', error);
    return {
      success: false,
      newLikeCount: item.likeCount,
      isLiked: isCurrentlyLiked,
      error: (error as Error).message,
    };
  }
};

/**
 * 记录点赞分析数据
 */
const recordLikeAnalytics = async (params: {
  item: any;
  index: number;
  tabType: TabType;
  clickPosition?: { x: number; y: number };
  analytics?: any;
  action: 'like' | 'unlike';
}): Promise<void> => {
  const { item, index, tabType, clickPosition, analytics, action } = params;

  const analyticsData = {
    event: 'content_like',
    properties: {
      content_id: item.id,
      content_type: item.type,
      content_title: item.title,
      author_id: item.user.id,
      author_nickname: item.user.nickname,
      like_action: action,
      current_like_count: item.likeCount,
      position: index,
      tab_type: tabType,
      click_position: clickPosition,
      timestamp: Date.now(),
      platform: 'react-native',
    },
  };

  try {
    if (analytics && typeof analytics.track === 'function') {
      analytics.track(analyticsData.event, analyticsData.properties);
    } else if (__DEV__) {
      console.log('📊 点赞分析:', analyticsData);
    }
  } catch (error) {
    console.error('记录点赞分析数据失败:', error);
  }
};

/**
 * 记录点赞错误分析
 */
const recordLikeErrorAnalytics = async (params: {
  error: Error;
  item: any;
  tabType: TabType;
  analytics?: any;
}): Promise<void> => {
  const { error, item, tabType, analytics } = params;

  const errorData = {
    event: 'like_error',
    properties: {
      error_message: error.message,
      error_stack: error.stack,
      content_id: item.id,
      content_type: item.type,
      tab_type: tabType,
      timestamp: Date.now(),
    },
  };

  try {
    if (analytics && typeof analytics.track === 'function') {
      analytics.track(errorData.event, errorData.properties);
    } else if (__DEV__) {
      console.error('🚨 点赞错误分析:', errorData);
    }
  } catch (analyticsError) {
    console.error('记录点赞错误分析失败:', analyticsError);
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
 * 快速创建点赞处理器
 */
export const createWaterfallLikeClickHandler = (config: {
  navigation?: any;
  analytics?: any;
  showToast?: (message: string) => void;
  onLikeSuccess?: (itemId: string, newLikeCount: number) => void;
  onLikeError?: (itemId: string, error: Error) => void;
}) => {
  return (item: any, index: number, tabType: TabType, clickPosition?: { x: number; y: number }) => {
    return onWaterfallLikeClick({
      item,
      index,
      tabType,
      clickPosition,
      ...config,
    });
  };
};

/**
 * 默认的点赞处理器
 */
export const defaultWaterfallLikeClickHandler = (
  item: any, 
  index: number, 
  tabType: TabType
) => {
  return onWaterfallLikeClick({
    item,
    index,
    tabType,
  });
};
