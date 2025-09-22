/**
 * 导航到发现页面相关事件处理器
 * 
 * 功能：
 * - 处理跳转到发现页面的导航逻辑
 * - 处理返回发现页面的导航逻辑
 * - 统一管理发现页面的参数传递
 */

import type { NavigationProp, ParamListBase } from '@react-navigation/native';

export interface DiscoverNavigationParams {
  /** 筛选标签（可选） */
  filterTag?: string;
  /** 搜索关键词（可选） */
  searchKeyword?: string;
  /** 定位到特定内容ID（可选） */
  focusContentId?: string;
}

/**
 * 导航到发现页面
 * @param navigation - React Navigation 实例
 * @param params - 发现页面参数（可选）
 * @returns Promise<boolean> - 导航是否成功
 */
export const navigateToDiscover = async (
  navigation: NavigationProp<ParamListBase>,
  params?: DiscoverNavigationParams
): Promise<boolean> => {
  try {
    console.log('NavigationEvent: 准备跳转到发现页面', params);

    // 执行导航
    if (params && Object.keys(params).length > 0) {
      (navigation as any).navigate('DiscoverScreen', params);
    } else {
      (navigation as any).navigate('DiscoverScreen');
    }

    console.log('NavigationEvent: 成功跳转到发现页面');
    return true;
  } catch (error) {
    console.error('NavigationEvent: 跳转到发现页面失败', error);
    return false;
  }
};

/**
 * 返回到发现页面
 * @param navigation - React Navigation 实例
 * @returns Promise<boolean> - 导航是否成功
 */
export const navigateBackToDiscover = async (
  navigation: NavigationProp<ParamListBase>
): Promise<boolean> => {
  try {
    console.log('NavigationEvent: 准备返回到发现页面');

    // 检查是否可以返回
    if (navigation.canGoBack()) {
      navigation.goBack();
    } else {
      // 如果不能返回，则导航到发现页面
      (navigation as any).navigate('DiscoverScreen');
    }

    console.log('NavigationEvent: 成功返回到发现页面');
    return true;
  } catch (error) {
    console.error('NavigationEvent: 返回到发现页面失败', error);
    return false;
  }
};

/**
 * 创建发现页面导航处理器
 * @param navigation - React Navigation 实例
 * @returns 发现页面导航处理函数集合
 */
export const createDiscoverNavigationHandlers = (navigation: NavigationProp<ParamListBase>) => {
  return {
    navigateToDiscover: (params?: DiscoverNavigationParams) => navigateToDiscover(navigation, params),
    navigateBackToDiscover: () => navigateBackToDiscover(navigation),
  };
};
