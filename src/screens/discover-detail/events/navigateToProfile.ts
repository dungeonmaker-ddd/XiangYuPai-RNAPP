/**
 * 导航到用户资料页面事件处理器
 * 
 * 功能：
 * - 处理跳转到用户资料页面的导航逻辑
 * - 统一管理用户资料页面的参数传递
 * - 提供错误处理和日志记录
 */

import type { NavigationProp, ParamListBase } from '@react-navigation/native';

export interface ProfileNavigationParams {
  /** 用户ID */
  userId: string;
  /** 用户名（可选，用于显示） */
  username?: string;
  /** 用户头像URL（可选） */
  avatarUrl?: string;
}

/**
 * 导航到用户资料页面
 * @param navigation - React Navigation 实例
 * @param params - 用户资料页面参数
 * @returns Promise<boolean> - 导航是否成功
 */
export const navigateToProfile = async (
  navigation: NavigationProp<ParamListBase>,
  params: ProfileNavigationParams
): Promise<boolean> => {
  try {
    console.log('NavigationEvent: 准备跳转到用户资料页面', params);
    
    // 参数验证
    if (!params.userId) {
      console.error('NavigationEvent: 用户资料页面参数不完整', params);
      return false;
    }

    // 执行导航
    (navigation as any).navigate('ProfileScreen', {
      userId: params.userId,
      username: params.username,
      avatarUrl: params.avatarUrl,
    });

    console.log('NavigationEvent: 成功跳转到用户资料页面');
    return true;
  } catch (error) {
    console.error('NavigationEvent: 跳转到用户资料页面失败', error);
    return false;
  }
};

/**
 * 创建用户资料导航处理器
 * @param navigation - React Navigation 实例
 * @returns 用户资料导航处理函数
 */
export const createProfileNavigationHandler = (navigation: NavigationProp<ParamListBase>) => {
  return (params: ProfileNavigationParams) => navigateToProfile(navigation, params);
};
