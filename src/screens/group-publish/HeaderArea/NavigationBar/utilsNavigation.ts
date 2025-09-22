/**
 * 🛠️ NavigationBar 导航工具函数
 */

import { NAVIGATION_CONSTANTS } from './constants';

export const utilsNavigation = {
  // 格式化标题
  formatTitle: (title: string): string => {
    if (!title) return '';
    
    if (title.length > NAVIGATION_CONSTANTS.TITLE_MAX_LENGTH) {
      return title.slice(0, NAVIGATION_CONSTANTS.TITLE_MAX_LENGTH - 3) + '...';
    }
    
    return title;
  },

  // 验证标题
  validateTitle: (title: string): boolean => {
    return typeof title === 'string' && title.trim().length > 0;
  },

  // 生成导航日志
  generateNavigationLog: (action: string, timestamp: number): string => {
    return `[PublishNavigation] ${action} at ${new Date(timestamp).toISOString()}`;
  },

  // 检查是否需要确认
  shouldConfirmCancel: (hasUnsavedChanges: boolean): boolean => {
    return hasUnsavedChanges;
  },
};
