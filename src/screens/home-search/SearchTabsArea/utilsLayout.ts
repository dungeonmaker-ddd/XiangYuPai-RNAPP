/**
 * SearchTabsArea 布局工具模块
 * 处理搜索标签布局相关的工具函数
 */

import { COLORS } from '../constants';

/**
 * 标签布局工具函数
 */
export const utilsTabLayout = () => {
  /**
   * 获取标签样式
   */
  const getTabStyle = (isActive: boolean) => {
    if (isActive) {
      return {
        backgroundColor: COLORS.primaryLight + '20', // 20% 透明度
      };
    }
    return {
      backgroundColor: 'transparent',
    };
  };

  /**
   * 格式化数字显示
   */
  const formatCount = (count: number): string => {
    if (count < 1000) {
      return count.toString();
    }
    
    if (count < 10000) {
      return `${(count / 1000).toFixed(1)}k`;
    }
    
    if (count < 1000000) {
      return `${Math.round(count / 1000)}k`;
    }
    
    return `${(count / 1000000).toFixed(1)}M`;
  };

  /**
   * 获取标签指示器位置
   */
  const getIndicatorPosition = (tabIndex: number, totalTabs: number) => {
    const tabWidth = 100 / totalTabs;
    const left = tabWidth * tabIndex + tabWidth * 0.2;
    const right = tabWidth * (totalTabs - tabIndex - 1) + tabWidth * 0.2;
    
    return {
      left: `${left}%`,
      right: `${right}%`,
    };
  };

  /**
   * 获取标签动画配置
   */
  const getTabAnimationConfig = () => {
    return {
      duration: 200,
      useNativeDriver: false,
    };
  };

  return {
    getTabStyle,
    formatCount,
    getIndicatorPosition,
    getTabAnimationConfig,
  };
};

/**
 * 响应式标签布局
 */
export const utilsResponsiveTab = (screenWidth: number) => {
  if (screenWidth < 350) {
    return {
      tabPadding: 8,
      fontSize: 12,
      iconSize: 14,
      spacing: 4,
    };
  } else if (screenWidth < 400) {
    return {
      tabPadding: 10,
      fontSize: 13,
      iconSize: 15,
      spacing: 6,
    };
  } else {
    return {
      tabPadding: 12,
      fontSize: 14,
      iconSize: 16,
      spacing: 8,
    };
  }
};
