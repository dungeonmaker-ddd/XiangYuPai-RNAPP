/**
 * 瀑布流内容详情导航处理器
 * 基于通用组件架构核心标准 - 导航处理层
 * 
 * @version 2.0.0
 * @author 架构团队
 */

import { ContentItem, TabType } from './types';

// =====================================================
// 导航参数接口
// =====================================================

export interface NavigateToContentDetailParams {
  item: ContentItem;
  index?: number;
  tabType: TabType;
  sourceScreen?: string;
  navigation?: any;
  analytics?: any;
  showToast?: (message: string) => void;
  onNavigationStart?: (itemId: string) => void;
  onNavigationComplete?: (itemId: string, targetScreen: string) => void;
  onNavigationError?: (itemId: string, error: Error) => void;
}

// =====================================================
// 导航结果接口
// =====================================================

export interface NavigateToContentDetailResult {
  success: boolean;
  action: 'navigate_detail' | 'navigate_preview' | 'navigate_external' | 'blocked' | 'error';
  message?: string;
  data?: {
    itemId: string;
    targetScreen: string;
    navigationParams?: any;
    transitionType?: string;
  };
}

// =====================================================
// 主要导航处理函数
// =====================================================

/**
 * 导航到内容详情页面
 * @param params 导航参数
 * @returns 导航结果
 */
export const navigateToContentDetail = async (params: NavigateToContentDetailParams): Promise<NavigateToContentDetailResult> => {
  const { 
    item, 
    index = 0,
    tabType, 
    sourceScreen = 'WaterfallModule',
    navigation, 
    analytics, 
    showToast = defaultShowToast,
    onNavigationStart,
    onNavigationComplete,
    onNavigationError
  } = params;

  try {
    // 1. 验证参数
    if (!item || !item.id) {
      throw new Error('无效的内容项');
    }

    // 2. 检查导航器可用性
    if (!navigation || !navigation.navigate) {
      throw new Error('导航器不可用');
    }

    // 3. 触发导航开始回调
    onNavigationStart?.(item.id);

    // 4. 记录导航分析
    await recordNavigationAnalytics({
      item,
      index,
      tabType,
      sourceScreen,
      analytics,
      action: 'navigation_start',
    });

    // 5. 检查内容访问权限
    const accessCheck = await checkContentAccessPermission(item);
    if (!accessCheck.accessible) {
      showToast(accessCheck.reason || '内容不可访问');
      return {
        success: false,
        action: 'blocked',
        message: accessCheck.reason,
      };
    }

    // 6. 确定导航策略
    const navigationStrategy = determineNavigationStrategy(item, index, tabType);
    
    // 7. 准备导航参数
    const navigationParams = prepareNavigationParams({
      item,
      index,
      tabType,
      sourceScreen,
      strategy: navigationStrategy,
    });

    // 8. 执行导航
    const navigationResult = await performNavigation({
      navigation,
      strategy: navigationStrategy,
      params: navigationParams,
    });

    if (navigationResult.success) {
      // 9. 记录导航完成
      await recordNavigationAnalytics({
        item,
        index,
        tabType,
        sourceScreen,
        analytics,
        action: 'navigation_complete',
        targetScreen: navigationResult.targetScreen,
      });

      // 10. 触发导航完成回调
      onNavigationComplete?.(item.id, navigationResult.targetScreen);

      return {
        success: true,
        action: navigationStrategy.action,
        data: {
          itemId: item.id,
          targetScreen: navigationResult.targetScreen,
          navigationParams,
          transitionType: navigationStrategy.transition,
        },
      };
    } else {
      throw new Error(navigationResult.error || '导航失败');
    }

  } catch (error) {
    console.error('内容详情导航失败:', error);
    
    // 记录导航错误
    await recordNavigationErrorAnalytics({
      error: error as Error,
      item,
      tabType,
      sourceScreen,
      analytics,
    });

    // 触发错误回调
    onNavigationError?.(item.id, error as Error);

    showToast('打开失败，请重试');
    
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
 * 检查内容访问权限
 */
const checkContentAccessPermission = async (item: ContentItem): Promise<{
  accessible: boolean;
  reason?: string;
}> => {
  try {
    // 模拟权限检查
    return new Promise(resolve => {
      setTimeout(() => {
        const scenarios = [
          { accessible: true },
          { accessible: false, reason: '内容已被删除' },
          { accessible: false, reason: '内容审核中，暂不可查看' },
          { accessible: false, reason: '该内容需要付费查看' },
          { accessible: false, reason: '地区限制，暂不可查看' },
        ];
        
        const isAccessible = Math.random() > 0.05; // 95% 可访问
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
    return { accessible: true }; // 默认可访问
  }
};

/**
 * 确定导航策略
 */
const determineNavigationStrategy = (item: ContentItem, index: number, tabType: TabType): {
  action: 'navigate_detail' | 'navigate_preview' | 'navigate_external';
  targetScreen: string;
  transition: 'push' | 'modal' | 'fade' | 'slide';
  params?: any;
} => {
  switch (item.type) {
    case 'video':
      return {
        action: 'navigate_detail',
        targetScreen: 'VideoDetail',
        transition: 'push',
        params: {
          autoPlay: true,
          showRelated: true,
          enableFullscreen: true,
        },
      };
      
    case 'live':
      return {
        action: 'navigate_external',
        targetScreen: 'LiveRoom',
        transition: 'slide',
        params: {
          liveRoomId: item.liveRoomId,
          enterAnimation: 'slide',
          showChat: true,
        },
      };
      
    case 'image':
    default:
      // 根据位置和标签页决定导航方式
      if (index < 3 && tabType === 'hot') {
        return {
          action: 'navigate_detail',
          targetScreen: 'ContentDetail',
          transition: 'push',
          params: {
            showComments: true,
            showRelated: true,
            enableShare: true,
          },
        };
      } else {
        return {
          action: 'navigate_preview',
          targetScreen: 'ContentPreview',
          transition: 'modal',
          params: {
            quickActions: true,
            swipeToClose: true,
          },
        };
      }
  }
};

/**
 * 准备导航参数
 */
const prepareNavigationParams = (params: {
  item: ContentItem;
  index: number;
  tabType: TabType;
  sourceScreen: string;
  strategy: any;
}) => {
  const { item, index, tabType, sourceScreen, strategy } = params;

  return {
    // 基础参数
    itemId: item.id,
    item: item,
    
    // 来源信息
    sourceScreen,
    sourceIndex: index,
    sourceTab: tabType,
    
    // 策略参数
    ...strategy.params,
    
    // 元数据
    navigationTime: Date.now(),
    userAgent: 'WaterfallModule/2.0.0',
  };
};

/**
 * 执行导航
 */
const performNavigation = async (params: {
  navigation: any;
  strategy: any;
  params: any;
}): Promise<{
  success: boolean;
  targetScreen: string;
  error?: string;
}> => {
  const { navigation, strategy, params: navParams } = params;

  try {
    switch (strategy.transition) {
      case 'push':
        navigation.navigate(strategy.targetScreen, navParams);
        break;
        
      case 'modal':
        navigation.navigate(strategy.targetScreen, {
          ...navParams,
          presentation: 'modal',
        });
        break;
        
      case 'fade':
        navigation.navigate(strategy.targetScreen, {
          ...navParams,
          animation: 'fade',
        });
        break;
        
      case 'slide':
        navigation.navigate(strategy.targetScreen, {
          ...navParams,
          animation: 'slide_from_right',
        });
        break;
        
      default:
        navigation.navigate(strategy.targetScreen, navParams);
    }

    return {
      success: true,
      targetScreen: strategy.targetScreen,
    };
  } catch (error) {
    console.error('执行导航失败:', error);
    return {
      success: false,
      targetScreen: strategy.targetScreen,
      error: (error as Error).message,
    };
  }
};

/**
 * 记录导航分析数据
 */
const recordNavigationAnalytics = async (params: {
  item: ContentItem;
  index: number;
  tabType: TabType;
  sourceScreen: string;
  analytics?: any;
  action: 'navigation_start' | 'navigation_complete';
  targetScreen?: string;
}): Promise<void> => {
  const { item, index, tabType, sourceScreen, analytics, action, targetScreen } = params;

  const analyticsData = {
    event: 'content_navigation',
    properties: {
      content_id: item.id,
      content_type: item.type,
      content_title: item.title,
      author_id: item.user.id,
      position: index,
      tab_type: tabType,
      source_screen: sourceScreen,
      target_screen: targetScreen,
      action,
      timestamp: Date.now(),
      platform: 'react-native',
    },
  };

  try {
    if (analytics && typeof analytics.track === 'function') {
      analytics.track(analyticsData.event, analyticsData.properties);
    } else if (__DEV__) {
      console.log('📊 导航分析:', analyticsData);
    }
  } catch (error) {
    console.error('记录导航分析数据失败:', error);
  }
};

/**
 * 记录导航错误分析
 */
const recordNavigationErrorAnalytics = async (params: {
  error: Error;
  item: ContentItem;
  tabType: TabType;
  sourceScreen: string;
  analytics?: any;
}): Promise<void> => {
  const { error, item, tabType, sourceScreen, analytics } = params;

  const errorData = {
    event: 'navigation_error',
    properties: {
      error_message: error.message,
      error_stack: error.stack,
      content_id: item.id,
      content_type: item.type,
      tab_type: tabType,
      source_screen: sourceScreen,
      timestamp: Date.now(),
    },
  };

  try {
    if (analytics && typeof analytics.track === 'function') {
      analytics.track(errorData.event, errorData.properties);
    } else if (__DEV__) {
      console.error('🚨 导航错误分析:', errorData);
    }
  } catch (analyticsError) {
    console.error('记录导航错误分析失败:', analyticsError);
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
 * 快速创建导航处理器
 */
export const createContentDetailNavigationHandler = (config: {
  navigation?: any;
  analytics?: any;
  showToast?: (message: string) => void;
  onNavigationStart?: (itemId: string) => void;
  onNavigationComplete?: (itemId: string, targetScreen: string) => void;
  onNavigationError?: (itemId: string, error: Error) => void;
}) => {
  return (item: ContentItem, index?: number, tabType?: TabType, sourceScreen?: string) => {
    return navigateToContentDetail({
      item,
      index,
      tabType: tabType || 'hot',
      sourceScreen,
      ...config,
    });
  };
};

/**
 * 默认的导航处理器
 */
export const defaultContentDetailNavigationHandler = (
  item: ContentItem,
  navigation: any,
  index?: number,
  tabType?: TabType
) => {
  return navigateToContentDetail({
    item,
    index,
    tabType: tabType || 'hot',
    navigation,
  });
};
