/**
 * UserListArea 布局工具模块
 * 处理用户列表布局相关的工具函数
 */

/**
 * 列表布局工具函数
 */
export const utilsListLayout = () => {
  /**
   * 获取列表样式
   */
  const getListStyle = () => {
    return {
      flex: 1,
    };
  };

  /**
   * 获取内容样式
   */
  const getContentStyle = () => {
    return {
      flexGrow: 1,
    };
  };

  /**
   * 获取项目布局
   */
  const getItemLayout = (data: any, index: number) => ({
    length: 120, // 预估项目高度
    offset: 120 * index,
    index,
  });

  return {
    getListStyle,
    getContentStyle,
    getItemLayout,
  };
};

/**
 * 性能优化配置
 */
export const utilsListPerformance = () => {
  return {
    initialNumToRender: 10,
    maxToRenderPerBatch: 5,
    windowSize: 10,
    removeClippedSubviews: true,
    updateCellsBatchingPeriod: 50,
  };
};

/**
 * 响应式列表布局
 */
export const utilsResponsiveList = (screenWidth: number) => {
  if (screenWidth < 350) {
    return {
      cardMargin: 12,
      cardPadding: 12,
      avatarSize: 50,
    };
  } else if (screenWidth < 400) {
    return {
      cardMargin: 13,
      cardPadding: 14,
      avatarSize: 55,
    };
  } else {
    return {
      cardMargin: 14,
      cardPadding: 16,
      avatarSize: 60,
    };
  }
};
