/**
 * SearchHistoryArea 格式化工具模块
 * 处理搜索历史格式化相关的工具函数
 */

/**
 * 历史格式化工具函数
 */
export const utilsHistoryFormat = () => {
  /**
   * 格式化时间显示
   */
  const formatTime = (timestamp: number | string): string => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);
    
    if (diffMins < 1) {
      return '刚刚';
    }
    
    if (diffMins < 60) {
      return `${diffMins}分钟前`;
    }
    
    if (diffHours < 24) {
      return `${diffHours}小时前`;
    }
    
    if (diffDays < 7) {
      return `${diffDays}天前`;
    }
    
    return date.toLocaleDateString('zh-CN', {
      month: 'short',
      day: 'numeric',
    });
  };

  /**
   * 截断文本
   */
  const truncateText = (text: string, maxLength: number = 20): string => {
    if (!text || text.length <= maxLength) {
      return text;
    }
    
    return text.substring(0, maxLength - 3) + '...';
  };

  /**
   * 格式化结果数量
   */
  const formatResultCount = (count: number): string => {
    if (count === 0) return '无结果';
    if (count < 1000) return `${count}个结果`;
    if (count < 10000) return `${(count / 1000).toFixed(1)}k个结果`;
    return `${Math.round(count / 1000)}k个结果`;
  };

  /**
   * 获取历史项样式
   */
  const getHistoryItemStyle = (index: number, total: number) => {
    return {
      borderBottomWidth: index === total - 1 ? 0 : 1,
    };
  };

  return {
    formatTime,
    truncateText,
    formatResultCount,
    getHistoryItemStyle,
  };
};

/**
 * 历史排序工具函数
 */
export const utilsHistorySort = () => {
  /**
   * 按时间排序
   */
  const sortByTime = (history: any[]): any[] => {
    return [...history].sort((a, b) => b.timestamp - a.timestamp);
  };

  /**
   * 按使用频率排序
   */
  const sortByFrequency = (history: any[]): any[] => {
    // 这里可以根据使用频率进行排序
    return [...history];
  };

  /**
   * 按结果数量排序
   */
  const sortByResultCount = (history: any[]): any[] => {
    return [...history].sort((a, b) => b.resultCount - a.resultCount);
  };

  return {
    sortByTime,
    sortByFrequency,
    sortByResultCount,
  };
};
