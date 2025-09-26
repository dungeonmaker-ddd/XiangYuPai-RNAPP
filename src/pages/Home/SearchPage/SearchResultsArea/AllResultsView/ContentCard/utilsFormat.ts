/**
 * ContentCard 格式化工具模块
 * 处理内容卡片格式化相关的工具函数
 */

import { COLORS, FONTS } from '../../../constants';
import type { ContentItem } from '../../../types';

/**
 * 内容格式化工具函数
 */
export const utilsContentFormat = () => {
  /**
   * 格式化计数显示
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
   * 截断文本
   */
  const truncateText = (text: string, maxLength: number = 50): string => {
    if (!text || text.length <= maxLength) {
      return text;
    }
    
    return text.substring(0, maxLength - 3) + '...';
  };

  /**
   * 获取高亮文本部分
   */
  const getHighlightedTextParts = (text: string, keyword: string) => {
    if (!keyword) {
      return [{ text, highlighted: false }];
    }

    return highlightKeyword(text, keyword);
  };

  /**
   * 获取内容类型图标
   */
  const getContentTypeIcon = (type: ContentItem['type']): string => {
    switch (type) {
      case 'image':
        return '🖼️';
      case 'video':
        return '🎬';
      case 'text':
        return '📝';
      case 'activity':
        return '🎉';
      default:
        return '📄';
    }
  };

  /**
   * 格式化时间显示
   */
  const formatTimeAgo = (timestamp: string): string => {
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

  return {
    formatCount,
    truncateText,
    getHighlightedTextParts,
    getContentTypeIcon,
    formatTimeAgo,
  };
};

/**
 * 关键词高亮处理
 */
const highlightKeyword = (text: string, keyword: string) => {
  if (!keyword || !text) {
    return [{ text, highlighted: false }];
  }

  const regex = new RegExp(`(${keyword})`, 'gi');
  const parts = text.split(regex);
  
  return parts.map((part, index) => ({
    text: part,
    highlighted: regex.test(part),
  }));
};

// 样式定义
export const contentCardStyles = {
  normalText: {
    fontSize: FONTS.size.md,
    color: COLORS.textPrimary,
    lineHeight: FONTS.lineHeight.normal * FONTS.size.md,
  },
  highlightedText: {
    color: COLORS.primary,
    fontWeight: FONTS.weight.semiBold,
    backgroundColor: COLORS.highlightBackground,
  },
};
