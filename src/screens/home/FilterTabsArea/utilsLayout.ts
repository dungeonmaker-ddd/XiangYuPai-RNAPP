/**
 * FilterTabsArea 布局工具模块
 * 处理筛选标签布局相关的工具函数
 */

import { COLORS } from '../constants';

/**
 * 标签布局工具函数
 */
export const utilsTabLayout = () => {
  /**
   * 获取容器样式
   */
  const getContainerStyle = () => {
    return {
      backgroundColor: COLORS.gray50,
      borderBottomColor: COLORS.gray100,
    };
  };

  /**
   * 获取标签样式
   */
  const getTabStyle = (isActive: boolean) => {
    if (isActive) {
      return {
        borderColor: '#AF38D9',
        backgroundColor: '#AF38D9',
        shadowColor: 'rgba(175, 56, 217, 0.55)',
        shadowOffset: { width: 1.5, height: 1.5 },
        shadowOpacity: 1,
        shadowRadius: 5,
        elevation: 3,
      };
    }
    return {
      borderColor: COLORS.gray100,
      backgroundColor: 'transparent',
    };
  };

  /**
   * 获取筛选按钮样式
   */
  const getFilterButtonStyle = () => {
    return {
      backgroundColor: 'rgba(153, 153, 153, 0.1)',
      borderRadius: 4,
    };
  };

  return {
    getContainerStyle,
    getTabStyle,
    getFilterButtonStyle,
  };
};

/**
 * 响应式标签布局
 */
export const utilsResponsiveTab = (screenWidth: number) => {
  if (screenWidth < 350) {
    return {
      tabWidth: 55,
      tabHeight: 26,
      fontSize: 12,
      gap: 8,
    };
  } else if (screenWidth < 400) {
    return {
      tabWidth: 60,
      tabHeight: 28,
      fontSize: 13,
      gap: 9,
    };
  } else {
    return {
      tabWidth: 65,
      tabHeight: 30,
      fontSize: 14,
      gap: 10,
    };
  }
};
