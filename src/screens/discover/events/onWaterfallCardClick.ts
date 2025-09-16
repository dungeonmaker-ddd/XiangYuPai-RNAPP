/**
 * 瀑布流卡片点击事件处理器
 * 专门处理用户点击瀑布流卡片后的所有业务逻辑
 * 让UI组件保持纯净，业务逻辑集中管理
 */

import { ContentItem, TabType } from '../types';

// =====================================================
// 事件参数接口
// =====================================================

export interface WaterfallCardClickParams {
  item: ContentItem;
  index: number;
  tabType: TabType;
  clickPosition?: { x: number; y: number };
  navigation?: any; // React Navigation
  analytics?: any; // 分析服务
  showToast?: (message: string) => void;
}

// =====================================================
// 事件处理结果接口
// =====================================================

export interface WaterfallCardClickResult {
  success: boolean;
  action: 'navigate' | 'error' | 'blocked';
  message?: string;
  data?: any;
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
    showToast = defaultShowToast 
  } = params;


  try {
    // 1. 验证参数
    if (!item || !item.id) {
      throw new Error('无效的内容项');
    }

    // 2. 记录点击分析
    await recordClickAnalytics({
      item,
      index,
      tabType,
      clickPosition,
      analytics,
    });

    // 3. 检查内容是否可访问
    const accessCheck = await checkContentAccess(item);
    if (!accessCheck.allowed) {
      showToast(accessCheck.reason || '内容不可访问');
      return {
        success: false,
        action: 'blocked',
        message: accessCheck.reason,
      };
    }

    // 4. 记录用户行为（用于推荐算法）
    await recordUserBehavior({
      action: 'content_view',
      itemId: item.id,
      itemType: item.type,
      tabType,
      index,
      timestamp: Date.now(),
    });

    // 5. 处理导航
    const navigationResult = await handleNavigation({
      item,
      index,
      tabType,
      navigation,
    });

    if (navigationResult.success) {
      showToast(`查看内容: ${item.title}`);
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
 * 记录点击分析数据
 */
const recordClickAnalytics = async (params: {
  item: ContentItem;
  index: number;
  tabType: TabType;
  clickPosition?: { x: number; y: number };
  analytics?: any;
}): Promise<void> => {
  const { item, index, tabType, clickPosition, analytics } = params;

  const analyticsData = {
    event: 'card_click',
    properties: {
      // 内容相关
      content_id: item.id,
      content_type: item.type,
      content_title: item.title,
      author_id: item.user.id,
      author_nickname: item.user.nickname,
      
      // 位置相关
      position: index,
      tab_type: tabType,
      click_position: clickPosition,
      
      // 内容统计
      like_count: item.likeCount,
      comment_count: item.commentCount,
      share_count: item.shareCount,
      
      // 用户状态
      is_liked: item.isLiked,
      is_collected: item.isCollected,
      is_following_author: item.user.isFollowing,
      
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
      console.log('📊 点击分析:', analyticsData);
    }
  } catch (error) {
    console.error('记录分析数据失败:', error);
  }
};

/**
 * 检查内容访问权限
 */
const checkContentAccess = async (item: ContentItem): Promise<{
  allowed: boolean;
  reason?: string;
}> => {
  try {
    // 检查内容是否被删除
    if (item.title === '内容已删除' || item.title === '[已删除]') {
      return {
        allowed: false,
        reason: '该内容已被删除',
      };
    }

    // 检查是否需要会员权限
    if (item.tags?.includes('VIP') || item.tags?.includes('会员专享')) {
      // 这里应该检查用户的会员状态
      const userVipStatus = await checkUserVipStatus();
      if (!userVipStatus.isVip) {
        return {
          allowed: false,
          reason: '该内容需要会员权限',
        };
      }
    }

    // 检查地区限制
    if (item.location) {
      const geoCheck = await checkGeoRestriction(item.location);
      if (!geoCheck.allowed) {
        return {
          allowed: false,
          reason: '该内容在您所在地区不可用',
        };
      }
    }

    // 检查年龄限制
    if (item.tags?.includes('18+')) {
      const ageVerification = await checkAgeVerification();
      if (!ageVerification.verified) {
        return {
          allowed: false,
          reason: '该内容需要年龄验证',
        };
      }
    }

    return { allowed: true };

  } catch (error) {
    console.error('检查内容访问权限失败:', error);
    return { allowed: true }; // 默认允许访问
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
    // 用于推荐算法、用户画像等
    
    if (__DEV__) {
      console.log('📝 用户行为记录:', behaviorData);
    }

    // 模拟API调用
    // await UserBehaviorAPI.record(behaviorData);
    
  } catch (error) {
    console.error('记录用户行为失败:', error);
    // 不抛出错误，因为这不应该影响主流程
  }
};

/**
 * 处理导航逻辑
 */
const handleNavigation = async (params: {
  item: ContentItem;
  index: number;
  tabType: TabType;
  navigation?: any;
}): Promise<WaterfallCardClickResult> => {
  const { item, index, tabType, navigation } = params;


  try {
    if (navigation && navigation.navigate) {
      // 使用React Navigation导航到发现详情页面
      navigation.navigate('DiscoverDetail', {
        contentId: item.id,
        contentItem: item,
        // 保留额外的上下文信息用于分析
        sourceTab: tabType,
        sourceIndex: index,
        context: {
          referrer: 'discover_waterfall',
          timestamp: Date.now(),
        },
      });

      return {
        success: true,
        action: 'navigate',
        data: {
          screen: 'DiscoverDetail',
          params: { contentId: item.id, contentItem: item },
        },
      };
    } else {
      // 如果没有navigation，记录日志（可能在测试环境）
      console.log('🚀 导航到内容详情:', {
        contentId: item.id,
        title: item.title,
        type: item.type,
        author: item.user.nickname,
      });

      return {
        success: true,
        action: 'navigate',
        message: '导航功能在当前环境不可用',
      };
    }
  } catch (error) {
    console.error('导航处理失败:', error);
    throw error;
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
      console.error('🚨 错误分析:', errorData);
    }
  } catch (analyticsError) {
    console.error('记录错误分析失败:', analyticsError);
  }
};

// =====================================================
// 模拟的辅助函数（实际项目中应该替换为真实实现）
// =====================================================

/**
 * 检查用户VIP状态
 */
const checkUserVipStatus = async (): Promise<{ isVip: boolean; expiresAt?: number }> => {
  // 模拟检查用户VIP状态
  return new Promise(resolve => {
    setTimeout(() => {
      // 这里应该调用实际的用户服务API
      resolve({
        isVip: Math.random() > 0.7, // 模拟70%的用户是VIP
        expiresAt: Date.now() + 30 * 24 * 60 * 60 * 1000, // 30天后过期
      });
    }, 100);
  });
};

/**
 * 检查地理位置限制
 */
const checkGeoRestriction = async (location: { latitude: number; longitude: number }): Promise<{ allowed: boolean }> => {
  // 模拟地理位置检查
  return new Promise(resolve => {
    setTimeout(() => {
      // 这里应该调用实际的地理服务API
      resolve({ allowed: true }); // 默认允许
    }, 50);
  });
};

/**
 * 检查年龄验证
 */
const checkAgeVerification = async (): Promise<{ verified: boolean }> => {
  // 模拟年龄验证检查
  return new Promise(resolve => {
    setTimeout(() => {
      // 这里应该检查用户的年龄验证状态
      resolve({ verified: true }); // 默认已验证
    }, 50);
  });
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
 * 快速创建瀑布流卡片点击处理器
 * 预配置常用参数
 */
export const createWaterfallCardClickHandler = (config: {
  navigation?: any;
  analytics?: any;
  showToast?: (message: string) => void;
}) => {
  return (item: ContentItem, index: number, tabType: TabType, clickPosition?: { x: number; y: number }) => {
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
 * 用于快速集成
 */
export const defaultWaterfallCardClickHandler = (
  item: ContentItem, 
  index: number, 
  tabType: TabType
) => {
  return onWaterfallCardClick({
    item,
    index,
    tabType,
  });
};

