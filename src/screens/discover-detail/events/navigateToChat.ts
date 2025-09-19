/**
 * 导航到聊天页面事件处理器
 * 
 * 功能：
 * - 处理跳转到私聊页面的导航逻辑
 * - 统一管理聊天页面的参数传递
 * - 提供错误处理和日志记录
 */

import type { NavigationProp, ParamListBase } from '@react-navigation/native';

export interface ChatNavigationParams {
  /** 对方用户ID */
  userId: string;
  /** 对方用户名（可选） */
  username?: string;
  /** 对方用户头像URL（可选） */
  avatarUrl?: string;
  /** 聊天室ID（可选，如果已存在） */
  chatRoomId?: string;
}

/**
 * 导航到私聊页面
 * @param navigation - React Navigation 实例
 * @param params - 聊天页面参数
 * @returns Promise<boolean> - 导航是否成功
 */
export const navigateToChat = async (
  navigation: NavigationProp<ParamListBase>,
  params: ChatNavigationParams
): Promise<boolean> => {
  try {
    console.log('NavigationEvent: 准备跳转到私聊页面', params);
    
    // 参数验证
    if (!params.userId) {
      console.error('NavigationEvent: 私聊页面参数不完整', params);
      return false;
    }

    // 执行导航
    (navigation as any).navigate('PrivateChatScreen', {
      userId: params.userId,
      username: params.username,
      avatarUrl: params.avatarUrl,
      chatRoomId: params.chatRoomId,
    });

    console.log('NavigationEvent: 成功跳转到私聊页面');
    return true;
  } catch (error) {
    console.error('NavigationEvent: 跳转到私聊页面失败', error);
    return false;
  }
};

/**
 * 创建私聊导航处理器
 * @param navigation - React Navigation 实例
 * @returns 私聊导航处理函数
 */
export const createChatNavigationHandler = (navigation: NavigationProp<ParamListBase>) => {
  return (params: ChatNavigationParams) => navigateToChat(navigation, params);
};
