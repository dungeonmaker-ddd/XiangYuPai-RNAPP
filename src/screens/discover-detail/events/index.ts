/**
 * 发现详情页面导航事件统一导出
 * 
 * 该文件统一管理所有与发现详情页面相关的导航事件处理器
 * 提供一致的API和错误处理机制
 */

// 导出所有导航事件处理器
export * from './navigateToReport';
export * from './navigateToProfile';
export * from './navigateToChat';
export * from './navigateToDiscover';

// 导出类型定义
export type {
  ReportNavigationParams,
} from './navigateToReport';

export type {
  ProfileNavigationParams,
} from './navigateToProfile';

export type {
  ChatNavigationParams,
} from './navigateToChat';

export type {
  DiscoverNavigationParams,
} from './navigateToDiscover';

import type { NavigationProp, ParamListBase } from '@react-navigation/native';
import { 
  createReportNavigationHandler,
  createProfileNavigationHandler,
  createChatNavigationHandler,
  createDiscoverNavigationHandlers,
} from './';

/**
 * 创建所有导航事件处理器的工厂函数
 * @param navigation - React Navigation 实例
 * @returns 所有导航事件处理器的集合
 */
export const createNavigationEventHandlers = (navigation: NavigationProp<ParamListBase>) => {
  return {
    // 举报相关导航
    navigateToReport: createReportNavigationHandler(navigation),
    
    // 用户资料相关导航
    navigateToProfile: createProfileNavigationHandler(navigation),
    
    // 私聊相关导航
    navigateToChat: createChatNavigationHandler(navigation),
    
    // 发现页面相关导航
    ...createDiscoverNavigationHandlers(navigation),
  };
};

/**
 * 导航事件处理器类型定义
 */
export type NavigationEventHandlers = ReturnType<typeof createNavigationEventHandlers>;
