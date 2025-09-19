/**
 * 瀑布流用户点击事件处理器
 * 基于通用组件架构核心标准 - 事件处理层
 * 
 * @version 2.0.0
 * @author 架构团队
 */

import { WaterfallUserClickParams, UserInfo, TabType } from './types';

// =====================================================
// 用户点击处理结果接口
// =====================================================

export interface WaterfallUserClickResult {
  success: boolean;
  action: 'navigate_profile' | 'follow_success' | 'unfollow_success' | 'login_required' | 'blocked' | 'error';
  message?: string;
  data?: {
    userId: string;
    clickType: 'avatar' | 'nickname' | 'userInfo';
    isFollowing?: boolean;
    targetScreen?: string;
  };
}

// =====================================================
// 主要事件处理函数
// =====================================================

/**
 * 处理瀑布流用户点击事件
 * @param params 用户点击事件参数
 * @returns 处理结果
 */
export const onWaterfallUserClick = async (params: WaterfallUserClickParams): Promise<WaterfallUserClickResult> => {
  const { 
    item,
    user,
    index, 
    tabType, 
    clickType,
    clickPosition, 
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

    // 2. 记录用户点击分析
    await recordUserClickAnalytics({
      user,
      item,
      index,
      tabType,
      clickType,
      clickPosition,
      analytics,
    });

    // 3. 检查用户登录状态
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

    // 4. 检查用户访问权限
    const accessCheck = await checkUserAccessPermission(user);
    if (!accessCheck.accessible) {
      showToast(accessCheck.reason || '用户信息不可访问');
      return {
        success: false,
        action: 'blocked',
        message: accessCheck.reason,
      };
    }

    // 5. 根据点击类型决定处理策略
    const actionStrategy = determineUserActionStrategy({
      user,
      clickType,
      currentUserId: loginCheck.userId,
    });

    // 6. 执行用户交互操作
    const actionResult = await performUserAction({
      user,
      strategy: actionStrategy,
      navigation,
      currentUserId: loginCheck.userId,
    });

    if (actionResult.success) {
      // 触发成功回调
      if (actionStrategy.type === 'navigate') {
        onUserProfileOpen?.(user.id);
      } else if (actionStrategy.type === 'follow' || actionStrategy.type === 'unfollow') {
        onFollowSuccess?.(user.id, actionResult.isFollowing || false);
      }
      
      showToast(actionResult.message || '操作成功');
      
      return {
        success: true,
        action: actionResult.action,
        data: {
          userId: user.id,
          clickType,
          isFollowing: actionResult.isFollowing,
          targetScreen: actionResult.targetScreen,
        },
      };
    } else {
      throw new Error(actionResult.error || '用户操作失败');
    }

  } catch (error) {
    console.error('用户点击处理失败:', error);
    
    // 记录错误分析
    await recordUserClickErrorAnalytics({
      error: error as Error,
      user,
      tabType,
      clickType,
      analytics,
    });

    // 触发错误回调
    onNavigationError?.(error as Error);

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
          userInfo: isLoggedIn ? { nickname: '当前用户' } : undefined,
        });
      }, 50);
    });
  } catch (error) {
    console.error('检查登录状态失败:', error);
    return { isLoggedIn: false };
  }
};

/**
 * 检查用户访问权限
 */
const checkUserAccessPermission = async (user: UserInfo): Promise<{
  accessible: boolean;
  reason?: string;
}> => {
  try {
    return new Promise(resolve => {
      setTimeout(() => {
        const scenarios = [
          { accessible: true },
          { accessible: false, reason: '该用户已注销' },
          { accessible: false, reason: '该用户已被封禁' },
          { accessible: false, reason: '该用户设置了隐私保护' },
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
    console.error('检查用户访问权限失败:', error);
    return { accessible: true };
  }
};

/**
 * 确定用户操作策略
 */
const determineUserActionStrategy = (params: {
  user: UserInfo;
  clickType: 'avatar' | 'nickname' | 'userInfo';
  currentUserId?: string;
}): {
  type: 'navigate' | 'follow' | 'unfollow' | 'menu';
  targetScreen?: string;
  params?: any;
} => {
  const { user, clickType, currentUserId } = params;

  // 如果是自己，直接导航到个人资料
  if (user.id === currentUserId) {
    return {
      type: 'navigate',
      targetScreen: 'MyProfile',
      params: {
        userId: user.id,
        editable: true,
      },
    };
  }

  switch (clickType) {
    case 'avatar':
      // 点击头像通常导航到用户资料页
      return {
        type: 'navigate',
        targetScreen: 'UserProfile',
        params: {
          userId: user.id,
          user: user,
          showFollowButton: true,
        },
      };
      
    case 'nickname':
      // 点击昵称可能显示快速操作菜单
      if (user.isFollowing) {
        return {
          type: 'menu',
          params: {
            actions: ['unfollow', 'message', 'block'],
          },
        };
      } else {
        return {
          type: 'follow',
          params: {
            followType: 'quick',
          },
        };
      }
      
    case 'userInfo':
    default:
      // 点击用户信息区域导航到资料页
      return {
        type: 'navigate',
        targetScreen: 'UserProfile',
        params: {
          userId: user.id,
          user: user,
          showFullProfile: true,
        },
      };
  }
};

/**
 * 执行用户操作
 */
const performUserAction = async (params: {
  user: UserInfo;
  strategy: any;
  navigation?: any;
  currentUserId?: string;
}): Promise<{
  success: boolean;
  action: 'navigate_profile' | 'follow_success' | 'unfollow_success';
  message?: string;
  isFollowing?: boolean;
  targetScreen?: string;
  error?: string;
}> => {
  const { user, strategy, navigation, currentUserId } = params;

  try {
    switch (strategy.type) {
      case 'navigate':
        if (!navigation || !navigation.navigate) {
          console.log('🚀 导航到用户资料:', {
            userId: user.id,
            targetScreen: strategy.targetScreen,
          });
          
          return {
            success: true,
            action: 'navigate_profile',
            message: '导航功能在当前环境不可用',
            targetScreen: strategy.targetScreen,
          };
        }

        navigation.navigate(strategy.targetScreen, {
          userId: user.id,
          ...strategy.params,
        });

        return {
          success: true,
          action: 'navigate_profile',
          message: `正在打开 ${user.nickname} 的资料`,
          targetScreen: strategy.targetScreen,
        };
        
      case 'follow':
        const followResult = await performFollowOperation(user.id, currentUserId, true);
        return {
          success: followResult.success,
          action: 'follow_success',
          message: followResult.success ? `已关注 ${user.nickname}` : '关注失败',
          isFollowing: followResult.success,
          error: followResult.error,
        };
        
      case 'unfollow':
        const unfollowResult = await performFollowOperation(user.id, currentUserId, false);
        return {
          success: unfollowResult.success,
          action: 'unfollow_success',
          message: unfollowResult.success ? `已取消关注 ${user.nickname}` : '取消关注失败',
          isFollowing: !unfollowResult.success,
          error: unfollowResult.error,
        };
        
      case 'menu':
        // 显示操作菜单 (这里简化处理)
        return {
          success: true,
          action: 'navigate_profile',
          message: '显示操作菜单',
        };
        
      default:
        throw new Error(`未知的操作类型: ${strategy.type}`);
    }
  } catch (error) {
    console.error('执行用户操作失败:', error);
    return {
      success: false,
      action: 'navigate_profile',
      error: (error as Error).message,
    };
  }
};

/**
 * 执行关注/取消关注操作
 */
const performFollowOperation = async (
  targetUserId: string, 
  currentUserId?: string, 
  isFollow: boolean = true
): Promise<{
  success: boolean;
  error?: string;
}> => {
  try {
    // 模拟关注操作
    return new Promise(resolve => {
      setTimeout(() => {
        const success = Math.random() > 0.05; // 95% 成功率
        resolve({
          success,
          error: success ? undefined : '网络错误，请重试',
        });
      }, 500);
    });
  } catch (error) {
    console.error('执行关注操作失败:', error);
    return {
      success: false,
      error: (error as Error).message,
    };
  }
};

/**
 * 记录用户点击分析数据
 */
const recordUserClickAnalytics = async (params: {
  user: UserInfo;
  item: any;
  index: number;
  tabType: TabType;
  clickType: 'avatar' | 'nickname' | 'userInfo';
  clickPosition?: { x: number; y: number };
  analytics?: any;
}): Promise<void> => {
  const { user, item, index, tabType, clickType, clickPosition, analytics } = params;

  const analyticsData = {
    event: 'user_click',
    properties: {
      target_user_id: user.id,
      target_user_nickname: user.nickname,
      target_user_verified: user.verified,
      target_user_following: user.isFollowing,
      content_id: item.id,
      content_type: item.type,
      position: index,
      tab_type: tabType,
      click_type: clickType,
      click_position: clickPosition,
      timestamp: Date.now(),
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
 * 记录用户点击错误分析
 */
const recordUserClickErrorAnalytics = async (params: {
  error: Error;
  user: UserInfo;
  tabType: TabType;
  clickType: 'avatar' | 'nickname' | 'userInfo';
  analytics?: any;
}): Promise<void> => {
  const { error, user, tabType, clickType, analytics } = params;

  const errorData = {
    event: 'user_click_error',
    properties: {
      error_message: error.message,
      error_stack: error.stack,
      target_user_id: user.id,
      tab_type: tabType,
      click_type: clickType,
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
    console.error('记录用户点击错误分析失败:', analyticsError);
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
 * 快速创建用户点击处理器
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
    item: any, 
    user: UserInfo, 
    index: number, 
    tabType: TabType, 
    clickType: 'avatar' | 'nickname' | 'userInfo',
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
 * 默认的用户点击处理器
 */
export const defaultWaterfallUserClickHandler = (
  item: any,
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
