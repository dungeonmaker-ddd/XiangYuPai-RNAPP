// #region 1. File Banner & TOC
/**
 * 页面跳转导航处理
 * 
 * TOC (快速跳转):
 * [1] Imports
 * [2] Types & Schema
 * [3] Constants & Config
 * [4] Utils & Helpers
 * [5] Navigation Functions
 * [6] Route Mapping
 * [7] Error Handling
 * [8] Exports
 */
// #endregion

// #region 2. Imports
import { Alert } from 'react-native';
import { MessageCategory, RecentChat, NavigationProp } from './types';
import { ROUTES, NAVIGATION_PARAMS } from './constants';
// #endregion

// #region 3. Types & Schema
interface NavigationOptions {
  animated?: boolean;
  duration?: number;
  showAlert?: boolean;
}

interface CategoryNavigationParams {
  categoryId: string;
  categoryType: string;
  title: string;
}

interface ChatNavigationParams {
  userId: string;
  userInfo: {
    id: string;
    nickname: string;
    avatar: string;
    isOnline: boolean;
  };
}
// #endregion

// #region 4. Constants & Config
const DEFAULT_NAVIGATION_OPTIONS: NavigationOptions = {
  animated: true,
  duration: NAVIGATION_PARAMS.SLIDE_DURATION,
  showAlert: false
};

const CATEGORY_ROUTE_MAP = {
  like_collect: ROUTES.LIKE_COLLECT,
  comment: ROUTES.COMMENT,
  follower: ROUTES.FOLLOWER,
  system: ROUTES.SYSTEM_NOTIFICATION
} as const;
// #endregion

// #region 5. Utils & Helpers
const createNavigationParams = <T>(params: T, options: NavigationOptions = {}): T & NavigationOptions => {
  return { ...params, ...DEFAULT_NAVIGATION_OPTIONS, ...options };
};

const logNavigation = (route: string, params?: any) => {
  if (__DEV__) {
    console.log(`[Navigation] 导航到: ${route}`, params);
  }
};

const showNavigationAlert = (title: string, message: string) => {
  Alert.alert(title, message, [{ text: '确定' }]);
};
// #endregion

// #region 6. Navigation Functions
export const navigateToCategory = (
  navigation: NavigationProp, 
  category: MessageCategory,
  options: NavigationOptions = {}
): void => {
  try {
    const route = CATEGORY_ROUTE_MAP[category.id as keyof typeof CATEGORY_ROUTE_MAP];
    
    if (!route) {
      if (options.showAlert !== false) {
        showNavigationAlert(
          '功能提示',
          `${category.title}功能正在开发中，敬请期待！`
        );
      }
      return;
    }

    const params = createNavigationParams<CategoryNavigationParams>({
      categoryId: category.id,
      categoryType: category.type,
      title: category.title
    }, options);

    logNavigation(route, params);
    
    // 实际项目中取消注释下面这行
    // navigation.navigate(route, params);
    
    // 临时显示提示
    showNavigationAlert(
      '功能提示',
      `点击了${category.title}功能，即将跳转到${route}页面`
    );
    
  } catch (error) {
    console.error('导航到分类页面失败:', error);
    showNavigationAlert('导航错误', '页面跳转失败，请稍后重试');
  }
};

export const navigateToChat = (
  navigation: NavigationProp,
  chat: RecentChat,
  options: NavigationOptions = {}
): void => {
  try {
    const params = createNavigationParams<ChatNavigationParams>({
      userId: chat.user.id,
      userInfo: {
        id: chat.user.id,
        nickname: chat.user.nickname,
        avatar: chat.user.avatar,
        isOnline: chat.user.isOnline
      }
    }, options);

    logNavigation(ROUTES.PRIVATE_CHAT, params);
    
    // 实际项目中取消注释下面这行
    // navigation.navigate(ROUTES.PRIVATE_CHAT, params);
    
    // 临时显示提示
    showNavigationAlert(
      '聊天功能',
      `即将进入与 ${chat.user.nickname} 的聊天页面`
    );
    
  } catch (error) {
    console.error('导航到聊天页面失败:', error);
    showNavigationAlert('导航错误', '进入聊天失败，请稍后重试');
  }
};
// #endregion

// #region 7. Route Mapping
export const getRouteByCategory = (categoryId: string): string | null => {
  return CATEGORY_ROUTE_MAP[categoryId as keyof typeof CATEGORY_ROUTE_MAP] || null;
};

export const getCategoryByRoute = (route: string): string | null => {
  const entry = Object.entries(CATEGORY_ROUTE_MAP).find(([_, r]) => r === route);
  return entry ? entry[0] : null;
};
// #endregion

// #region 8. Error Handling
export const handleNavigationError = (error: Error, context: string): void => {
  console.error(`[Navigation Error] ${context}:`, error);
  
  const userFriendlyMessage = error.message.includes('network') 
    ? '网络连接异常，请检查网络后重试'
    : '页面跳转失败，请稍后重试';
    
  showNavigationAlert('导航错误', userFriendlyMessage);
};
// #endregion

// #region 9. Exports
export const navigationUtils = {
  navigateToCategory,
  navigateToChat,
  getRouteByCategory,
  getCategoryByRoute,
  handleNavigationError
};

export default navigationUtils;
// #endregion
