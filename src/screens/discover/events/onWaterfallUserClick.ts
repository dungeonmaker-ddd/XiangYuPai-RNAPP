/**
 * 瀑布流用户头像及名称点击事件处理器
 * 专门处理用户点击瀑布流卡片中用户头像或名称后的所有业务逻辑
 * 让UI组件保持纯净，业务逻辑集中管理
 */

import { ContentItem, TabType, UserInfo } from '../types';

// =====================================================
// 事件参数接口
// =====================================================

export interface WaterfallUserClickParams {
  item: ContentItem;
  user: UserInfo;
  index: number;
  tabType: TabType;
  clickPosition?: { x: number; y: number };
  clickType: 'avatar' | 'nickname' | 'userInfo'; // 点击的具体部位
  navigation?: any; // React Navigation
  analytics?: any; // 分析服务
  showToast?: (message: string) => void;
  // 用户相关的回调
  onUserProfileOpen?: (userId: string) => void;
  onFollowSuccess?: (userId: string, isFollowing: boolean) => void;
  onNavigationError?: (error: Error) => void;
}

// =====================================================
// 事件处理结果接口
// =====================================================

export interface WaterfallUserClickResult {
  success: boolean;
  action: 'navigate_profile' | 'show_preview' | 'follow' | 'error' | 'blocked';
  message?: string;
  data?: {
    userId: string;
    targetScreen?: string;
    previewData?: any;
  };
}

// =====================================================
// 主要事件处理函数
// =====================================================

/**
 * 处理瀑布流用户点击事件
 * @param params 点击事件参数
 * @returns 处理结果
 */
export const onWaterfallUserClick = async (params: WaterfallUserClickParams): Promise<WaterfallUserClickResult> => {
  const { 
    item, 
    user, 
    index, 
    tabType, 
    clickPosition, 
    clickType,
    navigation, 
    analytics, 
    showToast = defaultShowToast,
    onUserProfileOpen,
    onFollowSuccess,
    onNavigationError
  } = params;

  try {
    // 1. 验证参数
    if (!user || !user.id) {
      throw new Error('无效的用户信息');
    }

    // 2. 检查是否点击的是自己
    const currentUserCheck = await checkCurrentUser();
    if (currentUserCheck.userId === user.id) {
      showToast('这是您自己的内容');
      
      // 导航到自己的个人资料页面
      if (navigation && navigation.navigate) {
        navigation.navigate('MyProfile');
        return {
          success: true,
          action: 'navigate_profile',
          data: {
            userId: user.id,
            targetScreen: 'MyProfile',
          },
        };
      }
    }

    // 3. 记录用户点击分析
    await recordUserClickAnalytics({
      item,
      user,
      index,
      tabType,
      clickPosition,
      clickType,
      analytics,
    });

    // 4. 检查用户是否存在且可访问
    const userCheck = await checkUserAccessibility(user.id);
    if (!userCheck.accessible) {
      showToast(userCheck.reason || '该用户不可访问');
      return {
        success: false,
        action: 'blocked',
        message: userCheck.reason,
      };
    }

    // 5. 记录用户行为（用于推荐算法）
    await recordUserBehavior({
      action: 'user_profile_click',
      targetUserId: user.id,
      sourceContentId: item.id,
      sourceContentType: item.type,
      tabType,
      index,
      clickType,
      timestamp: Date.now(),
    });

    // 6. 根据配置决定导航方式
    const navigationStrategy = await determineNavigationStrategy({
      user,
      clickType,
      currentTab: tabType,
    });

    // 7. 执行导航
    const navigationResult = await handleUserNavigation({
      user,
      strategy: navigationStrategy,
      navigation,
      item,
    });

    if (navigationResult.success) {
      // 触发成功回调
      onUserProfileOpen?.(user.id);
      
      showToast(`查看 ${user.nickname} 的资料`);
    }

    return navigationResult;

  } catch (error) {
    console.error('用户点击处理失败:', error);
    
    // 记录错误分析
    await recordErrorAnalytics({
      error: error as Error,
      context: 'user_click',
      item,
      user,
      tabType,
      analytics,
    });

    // 触发错误回调
    onNavigationError?.(error as Error);

    showToast('打开用户资料失败，请重试');
    
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
 * 记录用户点击分析数据
 */
const recordUserClickAnalytics = async (params: {
  item: ContentItem;
  user: UserInfo;
  index: number;
  tabType: TabType;
  clickPosition?: { x: number; y: number };
  clickType: string;
  analytics?: any;
}): Promise<void> => {
  const { item, user, index, tabType, clickPosition, clickType, analytics } = params;

  const analyticsData = {
    event: 'user_click',
    properties: {
      // 目标用户相关
      target_user_id: user.id,
      target_user_nickname: user.nickname,
      target_user_verified: user.verified,
      target_user_level: user.level,
      target_user_is_following: user.isFollowing,
      
      // 源内容相关
      source_content_id: item.id,
      source_content_type: item.type,
      source_content_title: item.title,
      
      // 点击相关
      click_type: clickType, // avatar, nickname, userInfo
      click_position: clickPosition,
      
      // 位置相关
      position: index,
      tab_type: tabType,
      
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
      console.log('📊 用户点击分析:', analyticsData);
    }
  } catch (error) {
    console.error('记录用户点击分析数据失败:', error);
  }
};

/**
 * 检查当前用户
 */
const checkCurrentUser = async (): Promise<{
  userId?: string;
  isLoggedIn: boolean;
}> => {
  try {
    // 这里应该调用实际的用户认证服务
    return new Promise(resolve => {
      setTimeout(() => {
        // 模拟获取当前用户信息
        resolve({
          userId: 'current_user_' + Math.random().toString(36).substr(2, 9),
          isLoggedIn: Math.random() > 0.2, // 80%已登录
        });
      }, 50);
    });
  } catch (error) {
    console.error('检查当前用户失败:', error);
    return { isLoggedIn: false };
  }
};

/**
 * 检查目标用户的可访问性
 */
const checkUserAccessibility = async (userId: string): Promise<{
  accessible: boolean;
  reason?: string;
}> => {
  try {
    // 这里应该调用实际的用户服务API
    return new Promise(resolve => {
      setTimeout(() => {
        // 模拟检查用户状态
        const scenarios = [
          { accessible: true },
          { accessible: false, reason: '该用户已注销' },
          { accessible: false, reason: '该用户已被封禁' },
          { accessible: false, reason: '该用户设置了隐私保护' },
        ];
        
        // 95%的情况下用户可访问
        const isAccessible = Math.random() > 0.05;
        if (isAccessible) {
          resolve(scenarios[0]);
        } else {
          const randomScenario = scenarios[Math.floor(Math.random() * (scenarios.length - 1)) + 1];
          resolve(randomScenario);
        }
      }, 100);
    });
  } catch (error) {
    console.error('检查用户可访问性失败:', error);
    return { accessible: true }; // 默认可访问
  }
};

/**
 * 确定导航策略
 */
const determineNavigationStrategy = async (params: {
  user: UserInfo;
  clickType: string;
  currentTab: TabType;
}): Promise<{
  type: 'full_profile' | 'preview' | 'modal';
  params?: any;
}> => {
  const { user, clickType, currentTab } = params;

  // 根据不同的点击类型和用户状态决定导航策略
  if (clickType === 'avatar') {
    // 点击头像 - 通常显示快速预览
    return {
      type: 'preview',
      params: {
        showFollowButton: !user.isFollowing,
        showQuickActions: true,
      },
    };
  } else if (clickType === 'nickname') {
    // 点击昵称 - 通常直接跳转到完整资料页
    return {
      type: 'full_profile',
      params: {
        highlightPosts: true,
        sourceTab: currentTab,
      },
    };
  } else {
    // 点击用户信息区域 - 根据用户级别决定
    return {
      type: user.verified ? 'full_profile' : 'preview',
      params: {
        showVerificationBadge: user.verified,
      },
    };
  }
};

/**
 * 处理用户导航
 */
const handleUserNavigation = async (params: {
  user: UserInfo;
  strategy: any;
  navigation?: any;
  item: ContentItem;
}): Promise<WaterfallUserClickResult> => {
  const { user, strategy, navigation, item } = params;

  try {
    if (!navigation || !navigation.navigate) {
      console.log('🚀 导航到用户资料:', {
        userId: user.id,
        nickname: user.nickname,
        strategy: strategy.type,
      });

      return {
        success: true,
        action: 'navigate_profile',
        message: '导航功能在当前环境不可用',
        data: {
          userId: user.id,
        },
      };
    }

    switch (strategy.type) {
      case 'full_profile':
        navigation.navigate('UserProfile', {
          userId: user.id,
          user: user,
          sourceContent: item,
          ...strategy.params,
        });
        break;

      case 'preview':
        navigation.navigate('UserPreview', {
          userId: user.id,
          user: user,
          sourceContent: item,
          ...strategy.params,
        });
        break;

      case 'modal':
        navigation.navigate('UserModal', {
          userId: user.id,
          user: user,
          sourceContent: item,
          ...strategy.params,
        });
        break;

      default:
        throw new Error(`未知的导航策略: ${strategy.type}`);
    }

    return {
      success: true,
      action: strategy.type === 'preview' ? 'show_preview' : 'navigate_profile',
      data: {
        userId: user.id,
        targetScreen: strategy.type === 'full_profile' ? 'UserProfile' : 'UserPreview',
      },
    };

  } catch (error) {
    console.error('用户导航处理失败:', error);
    throw error;
  }
};

/**
 * 记录用户行为
 */
const recordUserBehavior = async (behaviorData: {
  action: string;
  targetUserId: string;
  sourceContentId: string;
  sourceContentType: string;
  tabType: TabType;
  index: number;
  clickType: string;
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
  user: UserInfo;
  tabType: TabType;
  analytics?: any;
}): Promise<void> => {
  const { error, context, item, user, tabType, analytics } = params;

  const errorData = {
    event: 'error_occurred',
    properties: {
      error_message: error.message,
      error_stack: error.stack,
      context,
      content_id: item.id,
      content_type: item.type,
      target_user_id: user.id,
      tab_type: tabType,
      timestamp: Date.now(),
    },
  };

  try {
    if (analytics && typeof analytics.track === 'function') {
      analytics.track(errorData.event, errorData.properties);
    } else if (__DEV__) {
      console.error('🚨 用户点击错误分析:', errorData);
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
 * 快速创建瀑布流用户点击处理器
 * 预配置常用参数
 */
export const createWaterfallUserClickHandler = (config: {
  navigation?: any;
  analytics?: any;
  showToast?: (message: string) => void;
  onUserProfileOpen?: (userId: string) => void;
  onFollowSuccess?: (userId: string, isFollowing: boolean) => void;
  onNavigationError?: (error: Error) => void;
}) => {
  return (
    item: ContentItem, 
    user: UserInfo, 
    index: number, 
    tabType: TabType, 
    clickType: 'avatar' | 'nickname' | 'userInfo' = 'userInfo',
    clickPosition?: { x: number; y: number }
  ) => {
    return onWaterfallUserClick({
      item,
      user,
      index,
      tabType,
      clickType,
      clickPosition,
      ...config,
    });
  };
};

/**
 * 默认的瀑布流用户点击处理器
 * 用于快速集成
 */
export const defaultWaterfallUserClickHandler = (
  item: ContentItem, 
  user: UserInfo,
  index: number, 
  tabType: TabType,
  clickType: 'avatar' | 'nickname' | 'userInfo' = 'userInfo'
) => {
  return onWaterfallUserClick({
    item,
    user,
    index,
    tabType,
    clickType,
  });
};
