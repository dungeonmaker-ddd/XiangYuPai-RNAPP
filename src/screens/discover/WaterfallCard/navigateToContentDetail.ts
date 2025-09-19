/**
 * 瀑布流卡片内容详情导航处理器
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
  sourceIndex: number;
  sourceTab: TabType;
  navigation?: any;
  analytics?: any;
  // 导航配置
  animationType?: 'slide' | 'fade' | 'modal' | 'push';
  showComments?: boolean;
  showRelated?: boolean;
  autoPlay?: boolean;
  // 回调函数
  onNavigationStart?: (itemId: string) => void;
  onNavigationComplete?: (itemId: string, screen: string) => void;
  onNavigationError?: (itemId: string, error: Error) => void;
}

// =====================================================
// 导航结果接口
// =====================================================

export interface NavigateToContentDetailResult {
  success: boolean;
  targetScreen: string;
  navigationParams: any;
  error?: Error;
}

// =====================================================
// 主要导航函数
// =====================================================

/**
 * 导航到内容详情页面
 * @param params 导航参数
 * @returns 导航结果
 */
export const navigateToContentDetail = async (
  params: NavigateToContentDetailParams
): Promise<NavigateToContentDetailResult> => {
  const {
    item,
    sourceIndex,
    sourceTab,
    navigation,
    analytics,
    animationType = 'slide',
    showComments = true,
    showRelated = true,
    autoPlay = false,
    onNavigationStart,
    onNavigationComplete,
    onNavigationError,
  } = params;

  try {
    // 1. 验证参数
    if (!item || !item.id) {
      throw new Error('导航参数无效：缺少内容项');
    }

    // 2. 记录导航开始
    onNavigationStart?.(item.id);

    // 3. 记录导航分析
    await recordNavigationAnalytics({
      item,
      sourceIndex,
      sourceTab,
      targetScreen: 'ContentDetail',
      animationType,
      analytics,
    });

    // 4. 构建导航参数
    const navigationParams = buildNavigationParams({
      item,
      sourceIndex,
      sourceTab,
      showComments,
      showRelated,
      autoPlay,
      animationType,
    });

    // 5. 执行导航
    const targetScreen = determineTargetScreen(item);
    
    if (!navigation || typeof navigation.navigate !== 'function') {
      // 模拟导航（开发环境）
      console.log('🚀 导航到内容详情:', {
        screen: targetScreen,
        params: navigationParams,
      });
    } else {
      // 实际导航
      navigation.navigate(targetScreen, navigationParams);
    }

    // 6. 记录导航完成
    onNavigationComplete?.(item.id, targetScreen);

    return {
      success: true,
      targetScreen,
      navigationParams,
    };

  } catch (error) {
    console.error('导航到内容详情失败:', error);
    
    // 记录导航错误
    await recordNavigationError({
      error: error as Error,
      item,
      sourceTab,
      analytics,
    });

    // 触发错误回调
    onNavigationError?.(item.id, error as Error);

    return {
      success: false,
      targetScreen: '',
      navigationParams: {},
      error: error as Error,
    };
  }
};

// =====================================================
// 辅助函数
// =====================================================

/**
 * 构建导航参数
 */
const buildNavigationParams = (params: {
  item: ContentItem;
  sourceIndex: number;
  sourceTab: TabType;
  showComments: boolean;
  showRelated: boolean;
  autoPlay: boolean;
  animationType: string;
}) => {
  const {
    item,
    sourceIndex,
    sourceTab,
    showComments,
    showRelated,
    autoPlay,
    animationType,
  } = params;

  return {
    // 内容数据
    itemId: item.id,
    item: item,
    
    // 来源信息
    sourceIndex,
    sourceTab,
    sourceScreen: 'Discover',
    
    // 显示配置
    showComments,
    showRelated,
    autoPlay,
    
    // 动画配置
    animationType,
    
    // 时间戳
    navigationTime: Date.now(),
    
    // 额外配置
    enableSwipeBack: true,
    preloadRelated: showRelated,
    trackViewTime: true,
  };
};

/**
 * 确定目标屏幕
 */
const determineTargetScreen = (item: ContentItem): string => {
  switch (item.type) {
    case 'video':
      return 'VideoDetail';
    case 'live':
      return 'LiveDetail';
    case 'image':
      return 'ImageDetail';
    default:
      return 'ContentDetail';
  }
};

/**
 * 记录导航分析数据
 */
const recordNavigationAnalytics = async (params: {
  item: ContentItem;
  sourceIndex: number;
  sourceTab: TabType;
  targetScreen: string;
  animationType: string;
  analytics?: any;
}): Promise<void> => {
  const { item, sourceIndex, sourceTab, targetScreen, animationType, analytics } = params;

  const analyticsData = {
    event: 'navigation_to_detail',
    properties: {
      // 目标信息
      target_screen: targetScreen,
      content_id: item.id,
      content_type: item.type,
      content_title: item.title,
      
      // 来源信息
      source_screen: 'Discover',
      source_tab: sourceTab,
      source_index: sourceIndex,
      
      // 导航信息
      animation_type: animationType,
      navigation_timestamp: Date.now(),
      
      // 内容信息
      author_id: item.user.id,
      like_count: item.likeCount,
      content_created_at: item.createdAt,
      
      // 设备信息
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
    console.error('记录导航分析失败:', error);
  }
};

/**
 * 记录导航错误
 */
const recordNavigationError = async (params: {
  error: Error;
  item: ContentItem;
  sourceTab: TabType;
  analytics?: any;
}): Promise<void> => {
  const { error, item, sourceTab, analytics } = params;

  const errorData = {
    event: 'navigation_error',
    properties: {
      error_message: error.message,
      error_stack: error.stack,
      content_id: item.id,
      content_type: item.type,
      source_tab: sourceTab,
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

// =====================================================
// 便捷导出
// =====================================================

/**
 * 快速导航到内容详情
 * 使用默认配置的便捷函数
 */
export const quickNavigateToContentDetail = (
  item: ContentItem,
  sourceIndex: number,
  sourceTab: TabType,
  navigation?: any
) => {
  return navigateToContentDetail({
    item,
    sourceIndex,
    sourceTab,
    navigation,
    // 使用默认配置
    animationType: 'slide',
    showComments: true,
    showRelated: true,
    autoPlay: false,
  });
};

/**
 * 创建内容详情导航处理器
 * 预配置常用参数的工厂函数
 */
export const createContentDetailNavigator = (config: {
  navigation?: any;
  analytics?: any;
  defaultAnimationType?: 'slide' | 'fade' | 'modal' | 'push';
  defaultShowComments?: boolean;
  defaultShowRelated?: boolean;
  onNavigationStart?: (itemId: string) => void;
  onNavigationComplete?: (itemId: string, screen: string) => void;
  onNavigationError?: (itemId: string, error: Error) => void;
}) => {
  return (
    item: ContentItem,
    sourceIndex: number,
    sourceTab: TabType,
    overrides?: Partial<NavigateToContentDetailParams>
  ) => {
    return navigateToContentDetail({
      item,
      sourceIndex,
      sourceTab,
      navigation: config.navigation,
      analytics: config.analytics,
      animationType: config.defaultAnimationType || 'slide',
      showComments: config.defaultShowComments ?? true,
      showRelated: config.defaultShowRelated ?? true,
      onNavigationStart: config.onNavigationStart,
      onNavigationComplete: config.onNavigationComplete,
      onNavigationError: config.onNavigationError,
      ...overrides,
    });
  };
};
