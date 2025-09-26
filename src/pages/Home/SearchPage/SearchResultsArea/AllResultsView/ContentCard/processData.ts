/**
 * ContentCard 数据处理模块
 * 处理内容卡片数据逻辑
 */

import type { ContentItem } from '../../../types';

/**
 * 处理内容数据
 * 对内容项进行处理和格式化
 */
export const processContentData = (item: ContentItem): ContentItem => {
  return {
    ...item,
    // 确保必要字段有默认值
    images: item.images || [],
    likeCount: item.likeCount || 0,
    commentCount: item.commentCount || 0,
    shareCount: item.shareCount || 0,
    tags: item.tags || [],
  };
};

/**
 * 计算内容相关度分数
 */
export const processCalculateContentRelevance = (
  item: ContentItem, 
  keyword: string
): number => {
  let score = 0;
  const lowerKeyword = keyword.toLowerCase();
  
  // 标题匹配权重最高
  if (item.title.toLowerCase().includes(lowerKeyword)) {
    score += 10;
  }
  
  // 描述匹配
  if (item.description.toLowerCase().includes(lowerKeyword)) {
    score += 5;
  }
  
  // 标签匹配
  score += item.tags.filter(tag => 
    tag.toLowerCase().includes(lowerKeyword)
  ).length * 3;
  
  // 用户名匹配
  if (item.author.username.toLowerCase().includes(lowerKeyword)) {
    score += 2;
  }
  
  return score;
};

/**
 * 处理视频时长格式化
 */
export const processFormatVideoDuration = (duration?: number): string => {
  if (!duration) return '';
  
  const minutes = Math.floor(duration / 60);
  const seconds = duration % 60;
  
  return `${minutes}:${seconds.toString().padStart(2, '0')}`;
};

/**
 * 处理内容类型图标
 */
export const processGetContentTypeIcon = (type: ContentItem['type']): string => {
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
