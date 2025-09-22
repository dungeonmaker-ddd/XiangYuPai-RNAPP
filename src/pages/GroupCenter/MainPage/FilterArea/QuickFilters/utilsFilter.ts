/**
 * 🛠️ QuickFilters 筛选工具函数
 */

import { COLORS } from '../../constants';

export const utilsFilter = {
  // 获取排序按钮样式
  getSortButtonStyle: (isSelected: boolean) => {
    return isSelected ? {
      backgroundColor: COLORS.PRIMARY,
    } : {
      backgroundColor: COLORS.BACKGROUND,
    };
  },

  // 获取性别按钮样式
  getGenderButtonStyle: (isSelected: boolean) => {
    return isSelected ? {
      backgroundColor: COLORS.PRIMARY,
    } : {
      backgroundColor: COLORS.BACKGROUND,
    };
  },

  // 格式化筛选标签文本
  formatFilterText: (text: string, maxLength: number = 10): string => {
    if (text.length <= maxLength) {
      return text;
    }
    return text.slice(0, maxLength - 3) + '...';
  },

  // 计算筛选按钮宽度
  calculateButtonWidth: (text: string, minWidth: number): number => {
    // 简单的文本宽度计算，实际可以使用更精确的方法
    const textWidth = text.length * 14; // 假设每个字符14px宽度
    const padding = 24; // 左右padding
    return Math.max(textWidth + padding, minWidth);
  },
};
