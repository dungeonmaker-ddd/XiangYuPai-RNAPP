/**
 * 瀑布流卡片点击事件处理器
 * 基于通用组件架构核心标准 - 事件处理层
 * 专门处理用户点击瀑布流卡片后的所有业务逻辑
 * 
 * @version 2.0.0
 * @author 架构团队
 */

import { WaterfallCardClickParams } from './types';

// =====================================================
// 事件处理结果接口
// =====================================================

export interface WaterfallCardClickResult {
  success: boolean;
  action: 'navigate_detail' | 'show_preview' | 'blocked' | 'error';
  message?: string;
  targetScreen?: string;
  data?: {
    itemId: string;
    targetScreen?: string;
    previewData?: any;
  };
}

// =====================================================
// 主要事件处理函数
// =====================================================

/**
 * 处理瀑布流卡片点击事件
 * @param params 点击事件参数
 * @returns 处理结果
 */
export const onWaterfallCardClick = async (params: WaterfallCardClickParams): Promise<WaterfallCardClickResult> => {
  const { 
    item, 
    index, 
    tabType, 
    clickPosition, 
    navigation, 
    analytics, 
    showToast = defaultShowToast,
    onCardOpen,
    onNavigationSuccess,
    onNavigationError
  } = params;

  try {
    // 1. 验证参数
    if (!item || !item.id) {
      throw new Error('无效的内容项');
    }

    // 2. 记录卡片点击分析
    await recordCardClickAnalytics({
      item,
      index,
      tabType,
      clickPosition,
      analytics,
    });

    // 3. 检查内容访问权限
    const accessCheck = await checkContentAccess(item);
    if (!accessCheck.accessible) {
      showToast(accessCheck.reason || '内容不可访问');
      return {
        success: false,
        action: 'blocked',
        message: accessCheck.reason,
      };
    }

    // 4. 记录用户行为（用于推荐算法）
    await recordUserBehavior({
      action: 'content_click',
      itemId: item.id,
      itemType: item.type,
      tabType,
      index,
      timestamp: Date.now(),
    });

    // 5. 根据内容类型决定导航策略
    const navigationStrategy = await determineNavigationStrategy({
      item,
      tabType,
      index,
    });

    // 6. 执行导航
    const navigationResult = await handleContentNavigation({
      item,
      strategy: navigationStrategy,
      navigation,
    });

    if (navigationResult.success) {
      // 触发成功回调
      onCardOpen?.(item.id);
      onNavigationSuccess?.(item.id, navigationResult.targetScreen || '');
      
      showToast(`正在打开 ${item.title}`);
    }

    return navigationResult;

  } catch (error) {
    console.error('卡片点击处理失败:', error);
    
    // 记录错误分析
    await recordErrorAnalytics({
      error: error as Error,
      context: 'card_click',
      item,
      tabType,
      analytics,
    });

    // 触发错误回调
    onNavigationError?.(item.id, error as Error);

    showToast('打开内容失败，请重试');
    
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
 * 记录卡片点击分析数据
 */
const recordCardClickAnalytics = async (params: {
  item: any;
  index: number;
  tabType: string;
  clickPosition?: { x: number; y: number };
  analytics?: any;
}): Promise<void> => {
  const { item, index, tabType, clickPosition, analytics } = params;

  const analyticsData = {
    event: 'card_click',
    properties: {
      content_id: item.id,
      content_type: item.type,
      content_title: item.title,
      author_id: item.user.id,
      author_nickname: item.user.nickname,
      like_count: item.likeCount,
      comment_count: item.commentCount || 0,
      share_count: item.shareCount || 0,
      position: index,
      tab_type: tabType,
      click_position: clickPosition,
      content_created_at: item.createdAt,
      click_timestamp: Date.now(),
      platform: 'react-native',
    },
  };

  try {
    if (analytics && typeof analytics.track === 'function') {
      analytics.track(analyticsData.event, analyticsData.properties);
    } else if (__DEV__) {
      console.log('📊 卡片点击分析:', analyticsData);
    }
  } catch (error) {
    console.error('记录卡片点击分析数据失败:', error);
  }
};

/**
 * 检查内容访问权限
 */
const checkContentAccess = async (item: any): Promise<{
  accessible: boolean;
  reason?: string;
}> => {
  try {
    return new Promise(resolve => {
      setTimeout(() => {
        const scenarios = [
          { accessible: true },
          { accessible: false, reason: '内容已被删除' },
          { accessible: false, reason: '内容审核中' },
          { accessible: false, reason: '内容需要付费查看' },
          { accessible: false, reason: '地区限制' },
        ];
        
        const isAccessible = Math.random() > 0.05;
        if (isAccessible) {
          resolve(scenarios[0]);
        } else {
          const randomScenario = scenarios[Math.floor(Math.random() * (scenarios.length - 1)) + 1];
          resolve(randomScenario);
        }
      }, 80);
    });
  } catch (error) {
    console.error('检查内容访问权限失败:', error);
    return { accessible: true };
  }
};

/**
 * 确定导航策略
 */
const determineNavigationStrategy = async (params: {
  item: any;
  tabType: string;
  index: number;
}): Promise<{
  type: 'detail' | 'preview' | 'external' | 'modal';
  params?: any;
}> => {
  const { item, tabType, index } = params;

  switch (item.type) {
    case 'video':
      return {
        type: 'detail',
        params: {
          autoPlay: true,
          showRelated: true,
          sourceTab: tabType,
        },
      };
      
    case 'live':
      return {
        type: 'external',
        params: {
          liveRoomId: item.liveRoomId,
          enterAnimation: 'slide',
        },
      };
      
    case 'image':
    default:
      if (index < 3) {
        return {
          type: 'detail',
          params: {
            showComments: true,
            showRelated: true,
            sourceTab: tabType,
          },
        };
      } else {
        return {
          type: 'preview',
          params: {
            quickActions: true,
            sourceTab: tabType,
          },
        };
      }
  }
};

/**
 * 处理内容导航
 */
const handleContentNavigation = async (params: {
  item: any;
  strategy: any;
  navigation?: any;
}): Promise<WaterfallCardClickResult> => {
  const { item, strategy, navigation } = params;

  try {
    if (!navigation || !navigation.navigate) {
      console.log('🚀 导航到内容详情:', {
        itemId: item.id,
        title: item.title,
        strategy: strategy.type,
      });

      return {
        success: true,
        action: 'navigate_detail',
        message: '导航功能在当前环境不可用',
        data: {
          itemId: item.id,
        },
      };
    }

    switch (strategy.type) {
      case 'detail':
        navigation.navigate('ContentDetail', {
          itemId: item.id,
          item: item,
          ...strategy.params,
        });
        break;

      case 'preview':
        navigation.navigate('ContentPreview', {
          itemId: item.id,
          item: item,
          ...strategy.params,
        });
        break;

      case 'external':
        navigation.navigate('ExternalContent', {
          itemId: item.id,
          item: item,
          ...strategy.params,
        });
        break;

      case 'modal':
        navigation.navigate('ContentModal', {
          itemId: item.id,
          item: item,
          ...strategy.params,
        });
        break;

      default:
        throw new Error(`未知的导航策略: ${strategy.type}`);
    }

    return {
      success: true,
      action: strategy.type === 'preview' ? 'show_preview' : 'navigate_detail',
      data: {
        itemId: item.id,
        targetScreen: strategy.type === 'detail' ? 'ContentDetail' : 'ContentPreview',
      },
    };

  } catch (error) {
    console.error('内容导航处理失败:', error);
    throw error;
  }
};

/**
 * 记录用户行为
 */
const recordUserBehavior = async (behaviorData: {
  action: string;
  itemId: string;
  itemType: string;
  tabType: string;
  index: number;
  timestamp: number;
}): Promise<void> => {
  try {
    if (__DEV__) {
      console.log('📝 用户行为记录:', behaviorData);
    }
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
  item: any;
  tabType: string;
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
      console.error('🚨 卡片点击错误分析:', errorData);
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
};

// =====================================================
// 便捷导出
// =====================================================

/**
 * 快速创建瀑布流卡片点击处理器
 */
export const createWaterfallCardClickHandler = (config: {
  navigation?: any;
  analytics?: any;
  showToast?: (message: string) => void;
  onCardOpen?: (itemId: string) => void;
  onNavigationSuccess?: (itemId: string, targetScreen: string) => void;
  onNavigationError?: (itemId: string, error: Error) => void;
}) => {
  return (item: any, index: number, tabType: TabType, clickPosition?: { x: number; y: number }) => {
    return onWaterfallCardClick({
      item,
      index,
      tabType,
      clickPosition,
      ...config,
    });
  };
};

/**
 * 默认的瀑布流卡片点击处理器
 */
export const defaultWaterfallCardClickHandler = (
  item: any, 
  index: number, 
  tabType: TabType
) => {
  return onWaterfallCardClick({
    item,
    index,
    tabType,
  });
};
