/**
 * SearchResultsArea 布局工具模块
 * 处理搜索结果布局相关的工具函数
 */

import { COLORS, SPACING, LAYOUT } from '../constants';

/**
 * 搜索结果布局工具函数
 */
export const utilsResultsLayout = () => {
  /**
   * 获取容器样式
   */
  const getContainerStyle = () => {
    return {
      flex: 1,
      backgroundColor: COLORS.background,
    };
  };

  /**
   * 获取列表容器样式
   */
  const getListContainerStyle = () => {
    return {
      flex: 1,
      paddingHorizontal: SPACING.md,
    };
  };

  /**
   * 获取瀑布流列宽度
   */
  const getMasonryColumnWidth = (screenWidth: number, columns: number = 2): number => {
    const totalSpacing = SPACING.md * 2 + SPACING.sm * (columns - 1);
    return (screenWidth - totalSpacing) / columns;
  };

  /**
   * 获取列表项样式
   */
  const getListItemStyle = (index: number, total: number) => {
    return {
      marginBottom: index === total - 1 ? SPACING.xl : SPACING.md,
      paddingHorizontal: SPACING.md,
      backgroundColor: COLORS.white,
      borderRadius: 12,
      shadowColor: COLORS.shadow,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 2,
    };
  };

  return {
    getContainerStyle,
    getListContainerStyle,
    getMasonryColumnWidth,
    getListItemStyle,
  };
};

/**
 * 响应式布局工具
 */
export const utilsResponsiveLayout = (screenWidth: number) => {
  if (screenWidth < 350) {
    return {
      columns: 1,
      cardPadding: SPACING.sm,
      itemSpacing: SPACING.sm,
    };
  } else if (screenWidth < 500) {
    return {
      columns: 2,
      cardPadding: SPACING.md,
      itemSpacing: SPACING.md,
    };
  } else {
    return {
      columns: 3,
      cardPadding: SPACING.lg,
      itemSpacing: SPACING.lg,
    };
  }
};
