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
    return `[Navigation] ${action} at ${new Date(timestamp).toISOString()}`;
  },

  // 计算导航延迟
  calculateNavigationDelay: (startTime: number, endTime: number): number => {
    return endTime - startTime;
  },
};
