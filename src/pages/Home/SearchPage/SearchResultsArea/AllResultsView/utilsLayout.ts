/**
 * AllResultsView 布局工具模块
 * 处理全部结果视图布局相关的工具函数
 */

import { Dimensions } from 'react-native';
import { SPACING } from '../../constants';

const { width: screenWidth } = Dimensions.get('window');

/**
 * 瀑布流布局工具函数
 */
export const utilsMasonryLayout = () => {
  /**
   * 获取瀑布流项目样式
   */
  const getMasonryItemStyle = (index: number, columns: number = 2) => {
    const isLeftColumn = index % columns === 0;
    
    return {
      marginLeft: isLeftColumn ? 0 : SPACING.sm,
      marginRight: isLeftColumn ? SPACING.sm : 0,
      marginBottom: SPACING.sm,
    };
  };

  /**
   * 获取列宽度
   */
  const getColumnWidth = (columns: number = 2): number => {
    const totalHorizontalPadding = SPACING.md * 2; // 左右边距
    const totalColumnSpacing = SPACING.sm * (columns - 1); // 列间距
    const availableWidth = screenWidth - totalHorizontalPadding - totalColumnSpacing;
    
    return availableWidth / columns;
  };

  /**
   * 计算项目高度（基于内容）
   */
  const calculateItemHeight = (
    imageAspectRatio: number = 4/3,
    hasVideo: boolean = false,
    descriptionLength: number = 0
  ): number => {
    const columnWidth = getColumnWidth();
    const imageHeight = columnWidth / imageAspectRatio;
    const contentPadding = SPACING.md * 2; // 上下内边距
    const textHeight = Math.max(40, Math.ceil(descriptionLength / 30) * 20); // 估算文本高度
    const authorHeight = 32; // 作者信息高度
    const statsHeight = 24; // 统计信息高度
    
    let totalHeight = imageHeight + contentPadding + textHeight + authorHeight + statsHeight;
    
    // 视频内容额外高度（播放按钮等）
    if (hasVideo) {
      totalHeight += 10;
    }
    
    return totalHeight;
  };

  /**
   * 获取瀑布流容器样式
   */
  const getMasonryContainerStyle = () => {
    return {
      paddingHorizontal: SPACING.sm,
      paddingVertical: SPACING.sm,
    };
  };

  return {
    getMasonryItemStyle,
    getColumnWidth,
    calculateItemHeight,
    getMasonryContainerStyle,
  };
};

/**
 * 响应式瀑布流布局
 */
export const utilsResponsiveMasonry = () => {
  /**
   * 根据屏幕宽度获取列数
   */
  const getResponsiveColumns = (): number => {
    if (screenWidth < 350) {
      return 1;
    } else if (screenWidth < 500) {
      return 2;
    } else if (screenWidth < 800) {
      return 3;
    } else {
      return 4;
    }
  };

  /**
   * 获取响应式间距
   */
  const getResponsiveSpacing = () => {
    if (screenWidth < 350) {
      return {
        horizontal: SPACING.sm,
        vertical: SPACING.sm,
        item: SPACING.xs,
      };
    } else if (screenWidth < 500) {
      return {
        horizontal: SPACING.md,
        vertical: SPACING.md,
        item: SPACING.sm,
      };
    } else {
      return {
        horizontal: SPACING.lg,
        vertical: SPACING.lg,
        item: SPACING.md,
      };
    }
  };

  return {
    getResponsiveColumns,
    getResponsiveSpacing,
  };
};
