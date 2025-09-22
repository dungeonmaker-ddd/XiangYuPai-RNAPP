/**
 * 🛠️ TypeTabs 标签显示工具
 */

import { COLORS } from '../../constants';

export const utilsDisplay = {
  // 获取标签样式
  getTabStyle: (isSelected: boolean) => {
    return isSelected ? {
      backgroundColor: COLORS.PRIMARY,
    } : {
      backgroundColor: COLORS.BACKGROUND,
    };
  },

  // 获取标签文字样式
  getTabTextStyle: (isSelected: boolean) => {
    return isSelected ? {
      color: COLORS.TEXT_WHITE,
    } : {
      color: COLORS.TEXT_PRIMARY,
    };
  },

  // 计算标签宽度
  calculateTabWidth: (text: string, minWidth: number): number => {
    const textWidth = text.length * 14; // 假设每个字符14px宽度
    const padding = 24; // 左右padding
    return Math.max(textWidth + padding, minWidth);
  },

  // 格式化标签文本
  formatTabText: (text: string, maxLength: number = 8): string => {
    if (text.length <= maxLength) {
      return text;
    }
    return text.slice(0, maxLength - 1) + '…';
  },
};
