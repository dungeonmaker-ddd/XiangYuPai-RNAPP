/**
 * LimitedOffersArea 布局工具模块
 * 处理专享卡片布局相关的工具函数
 */

/**
 * 卡片布局工具函数
 */
export const utilsCardLayout = () => {
  /**
   * 获取卡片样式
   */
  const getCardStyle = () => {
    return {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 2,
    };
  };

  /**
   * 获取图片容器样式
   */
  const getImageStyle = () => {
    return {
      backgroundColor: '#f5f5f5',
    };
  };

  /**
   * 获取滚动容器样式
   */
  const getScrollStyle = () => {
    return {
      paddingLeft: 16,
      paddingRight: 16,
    };
  };

  return {
    getCardStyle,
    getImageStyle,
    getScrollStyle,
  };
};

/**
 * 响应式卡片布局
 */
export const utilsResponsiveCard = (screenWidth: number) => {
  if (screenWidth < 350) {
    return {
      cardWidth: 120,
      cardHeight: 120,
      fontSize: 14,
    };
  } else if (screenWidth < 400) {
    return {
      cardWidth: 130,
      cardHeight: 130,
      fontSize: 15,
    };
  } else {
    return {
      cardWidth: 140,
      cardHeight: 140,
      fontSize: 16,
    };
  }
};
