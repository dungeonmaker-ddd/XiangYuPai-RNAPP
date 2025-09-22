/**
 * 🛠️ TypeGrid 类型工具函数
 */

import { COLORS } from '../../constants';
import { TYPE_GRID_CONSTANTS } from './constants';

export const utilsType = {
  // 获取卡片样式
  getCardStyle: (isSelected: boolean, bgColor: string) => {
    const baseStyle = {
      backgroundColor: bgColor,
      borderWidth: 0,
      shadowOpacity: 0.1,
      elevation: TYPE_GRID_CONSTANTS.SHADOW_ELEVATION,
    };

    if (isSelected) {
      return {
        ...baseStyle,
        borderWidth: TYPE_GRID_CONSTANTS.SELECTED_BORDER_WIDTH,
        borderColor: COLORS.PRIMARY,
        shadowColor: COLORS.PRIMARY,
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: TYPE_GRID_CONSTANTS.SELECTED_SHADOW_ELEVATION,
      };
    }

    return {
      ...baseStyle,
      shadowColor: COLORS.BLACK,
    };
  },

  // 获取文字颜色
  getTextColor: (isSelected: boolean, defaultColor: string): string => {
    return isSelected ? COLORS.WHITE : defaultColor;
  },

  // 计算网格布局
  calculateGridLayout: (totalItems: number, columns: number) => {
    const rows = Math.ceil(totalItems / columns);
    const itemWidth = `${100 / columns - 2}%`; // 减去间距
    
    return {
      rows,
      columns,
      itemWidth,
    };
  },

  // 验证类型选择
  validateTypeSelection: (type: string): boolean => {
    const validTypes = ['explore', 'cinema', 'billiards', 'karaoke', 'drinking', 'massage'];
    return validTypes.includes(type);
  },
};
