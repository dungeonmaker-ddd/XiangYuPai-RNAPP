/**
 * 瀑布流点赞点击事件处理器
 * 专门处理用户点击瀑布流卡片中点赞按钮后的所有业务逻辑
 * 让UI组件保持纯净，业务逻辑集中管理
 */

import { ContentItem, TabType } from './types';

// =====================================================
// 事件参数接口
// =====================================================

export interface WaterfallLikeClickParams {
  item: ContentItem;
  index: number;
  tabType: TabType;
  clickPosition?: { x: number; y: number };
  navigation?: any; // React Navigation
  analytics?: any; // 分析服务
  showToast?: (message: string) => void;
  // 点赞相关的回调
  onLikeSuccess?: (itemId: string, newLikeCount: number) => void;
  onLikeError?: (itemId: string, error: Error) => void;
}

// =====================================================
// 事件处理结果接口
// =====================================================

export interface WaterfallLikeClickResult {
  success: boolean;
  action: 'like' | 'unlike' | 'error' | 'blocked';
  message?: string;
  data?: {
    itemId: string;
    newLikeStatus: boolean;
    newLikeCount: number;
  };
}

// =====================================================
// 主要事件处理函数
// =====================================================

/**
 * 处理瀑布流点赞点击事件
 * @param params 点击事件参数
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
      
      // 可选：导航到登录页面
      if (navigation && navigation.navigate) {
        navigation.navigate('Login');
      }
      
      return {
        success: false,
        action: 'blocked',
        message: '用户未登录',
      };
    }

    // 3. 记录点赞分析
    await recordLikeAnalytics({
      item,
      index,
      tabType,
      clickPosition,
      analytics,
      currentLikeStatus: item.isLiked,
    });

    // 4. 检查是否可以点赞（频率限制等）
    const rateCheck = await checkLikeRateLimit(item.id);
    if (!rateCheck.allowed) {
      showToast(rateCheck.reason || '点赞太频繁，请稍后再试');
      return {
        success: false,
        action: 'blocked',
        message: rateCheck.reason,
      };
    }

    // 5. 执行点赞/取消点赞操作
    const newLikeStatus = !item.isLiked;
    const likeResult = await performLikeAction({
      itemId: item.id,
      newLikeStatus,
      currentLikeCount: item.likeCount,
    });

    if (likeResult.success) {
      // 6. 记录用户行为（用于推荐算法）
      await recordUserBehavior({
        action: newLikeStatus ? 'like' : 'unlike',
        itemId: item.id,
        itemType: item.type,
        tabType,
        index,
        timestamp: Date.now(),
      });

      // 7. 显示成功反馈
      const actionText = newLikeStatus ? '点赞' : '取消点赞';
      showToast(`${actionText}成功`);

      // 8. 触发成功回调
      onLikeSuccess?.(item.id, likeResult.newLikeCount);

      return {
        success: true,
        action: newLikeStatus ? 'like' : 'unlike',
        data: {
          itemId: item.id,
          newLikeStatus,
          newLikeCount: likeResult.newLikeCount,
        },
      };
    } else {
      throw new Error(likeResult.error || '点赞操作失败');
    }

  } catch (error) {
    console.error('点赞处理失败:', error);
    
    // 记录错误分析
    await recordErrorAnalytics({
      error: error as Error,
      context: 'like_click',
      item,
      tabType,
      analytics,
    });

    // 触发错误回调
    onLikeError?.(item.id, error as Error);

    showToast('点赞失败，请重试');
    
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
 * 记录点赞分析数据
 */
const recordLikeAnalytics = async (params: {
  item: ContentItem;
  index: number;
  tabType: TabType;
  clickPosition?: { x: number; y: number };
  analytics?: any;
  currentLikeStatus: boolean;
}): Promise<void> => {
  const { item, index, tabType, clickPosition, analytics, currentLikeStatus } = params;

  const analyticsData = {
    event: 'like_click',
    properties: {
      // 内容相关
      content_id: item.id,
      content_type: item.type,
      content_title: item.title,
      author_id: item.user.id,
      author_nickname: item.user.nickname,
      
      // 点赞相关
      current_like_status: currentLikeStatus,
      new_like_status: !currentLikeStatus,
      current_like_count: item.likeCount,
      
      // 位置相关
      position: index,
      tab_type: tabType,
      click_position: clickPosition,
      
      // 时间相关
      content_created_at: item.createdAt,
      click_timestamp: Date.now(),
      
      // 设备相关
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
 * 检查用户登录状态
 */
const checkUserLoginStatus = async (): Promise<{
  isLoggedIn: boolean;
  userId?: string;
}> => {
  try {
    // 这里应该调用实际的用户认证服务
    return new Promise(resolve => {
      setTimeout(() => {
        // 模拟检查登录状态
        resolve({
          isLoggedIn: Math.random() > 0.2, // 模拟80%的用户已登录
          userId: 'user_' + Math.random().toString(36).substr(2, 9),
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
const checkLikeRateLimit = async (itemId: string): Promise<{
  allowed: boolean;
  reason?: string;
}> => {
  try {
    // 这里应该调用实际的频率限制检查API
    return new Promise(resolve => {
      setTimeout(() => {
        // 模拟频率限制检查
        const isAllowed = Math.random() > 0.05; // 95%的情况下允许
        resolve({
          allowed: isAllowed,
          reason: isAllowed ? undefined : '点赞过于频繁，请稍后再试',
        });
      }, 30);
    });
  } catch (error) {
    console.error('检查点赞频率限制失败:', error);
    return { allowed: true }; // 默认允许
  }
};

/**
 * 执行点赞/取消点赞操作
 */
const performLikeAction = async (params: {
  itemId: string;
  newLikeStatus: boolean;
  currentLikeCount: number;
}): Promise<{
  success: boolean;
  newLikeCount: number;
  error?: string;
}> => {
  const { itemId, newLikeStatus, currentLikeCount } = params;

  try {
    // 这里应该调用实际的点赞API
    return new Promise(resolve => {
      setTimeout(() => {
        // 模拟API调用
        const success = Math.random() > 0.1; // 90%成功率
        
        if (success) {
          const newLikeCount = newLikeStatus 
            ? currentLikeCount + 1 
            : Math.max(0, currentLikeCount - 1);
          
          resolve({
            success: true,
            newLikeCount,
          });
        } else {
          resolve({
            success: false,
            newLikeCount: currentLikeCount,
            error: '网络错误，请重试',
          });
        }
      }, 200);
    });
  } catch (error) {
    console.error('执行点赞操作失败:', error);
    return {
      success: false,
      newLikeCount: currentLikeCount,
      error: (error as Error).message,
    };
  }
};

/**
 * 记录用户行为
 */
const recordUserBehavior = async (behaviorData: {
  action: string;
  itemId: string;
  itemType: string;
  tabType: TabType;
  index: number;
  timestamp: number;
}): Promise<void> => {
  try {
    // 这里应该调用实际的用户行为记录API
    if (__DEV__) {
      console.log('📝 用户行为记录:', behaviorData);
    }
    // await UserBehaviorAPI.record(behaviorData);
  } catch (error) {
    console.error('记录用户行为失败:', error);
  }
};

/**
 * 记录错误分析
 */
const recordErrorAnalytics = async (params: {
  error: Error;
  context: string;
  item: ContentItem;
  tabType: TabType;
  analytics?: any;
}): Promise<void> => {
  const { error, context, item, tabType, analytics } = params;

  const errorData = {
    event: 'error_occurred',
    properties: {
      error_message: error.message,
      error_stack: error.stack,
      context,
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
    console.error('记录错误分析失败:', analyticsError);
  }
};

/**
 * 默认的Toast显示函数
 */
const defaultShowToast = (message: string): void => {
  if (__DEV__) {
    console.log('🔔 Toast:', message);
  }
  // 在生产环境中，这里应该调用实际的Toast组件
};

// =====================================================
// 便捷导出
// =====================================================

/**
 * 快速创建瀑布流点赞点击处理器
 * 预配置常用参数
 */
export const createWaterfallLikeClickHandler = (config: {
  navigation?: any;
  analytics?: any;
  showToast?: (message: string) => void;
  onLikeSuccess?: (itemId: string, newLikeCount: number) => void;
  onLikeError?: (itemId: string, error: Error) => void;
}) => {
  return (item: ContentItem, index: number, tabType: TabType, clickPosition?: { x: number; y: number }) => {
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
 * 默认的瀑布流点赞点击处理器
 * 用于快速集成
 */
export const defaultWaterfallLikeClickHandler = (
  item: ContentItem, 
  index: number, 
  tabType: TabType
) => {
  return onWaterfallLikeClick({
    item,
    index,
    tabType,
  });
};
