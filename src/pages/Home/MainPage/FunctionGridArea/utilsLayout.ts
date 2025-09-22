/**
 * FunctionGridArea 布局工具模块
 * 处理网格布局相关的工具函数
 */

/**
 * 网格布局工具函数
 */
export const utilsGridLayout = (screenWidth: number) => {
  const containerPadding = 48; // 左右边距总和
  const gridGap = 16; // 网格间距

  /**
   * 计算每个功能项的宽度
   */
  const getItemWidth = () => {
    return (screenWidth - containerPadding) / 5;
  };

  /**
   * 获取容器样式
   */
  const getContainerStyle = () => {
    return {
      paddingHorizontal: 16,
      gap: gridGap,
    };
  };

  /**
   * 计算网格项间距
   */
  const getItemSpacing = () => {
    return {
      marginHorizontal: 2,
    };
  };

  return {
    getItemWidth,
    getContainerStyle,
    getItemSpacing,
  };
};

/**
 * 响应式布局计算
 */
export const utilsResponsiveLayout = (screenWidth: number) => {
  if (screenWidth < 350) {
    return {
      iconSize: 56,
      fontSize: 11,
      spacing: 12,
    };
  } else if (screenWidth < 400) {
    return {
      iconSize: 60,
      fontSize: 12,
      spacing: 14,
    };
  } else {
    return {
      iconSize: 64,
      fontSize: 12,
      spacing: 16,
    };
  }
};
