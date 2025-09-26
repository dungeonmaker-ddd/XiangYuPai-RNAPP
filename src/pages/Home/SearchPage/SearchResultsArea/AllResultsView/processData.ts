/**
 * AllResultsView 数据处理模块
 * 处理全部搜索结果数据逻辑
 */

import type { ContentItem } from '../../types';

/**
 * 处理全部结果数据
 * 对内容项进行排序和过滤
 */
export const processAllResultsData = (
  results: ContentItem[], 
  keyword: string
): ContentItem[] => {
  return results
    .map(item => ({
      ...item,
      // 添加搜索相关性评分
      relevanceScore: calculateContentRelevance(item, keyword),
    }))
    .sort((a, b) => {
      // 按相关性排序
      const scoreA = (a as any).relevanceScore || 0;
      const scoreB = (b as any).relevanceScore || 0;
      
      if (scoreA !== scoreB) {
        return scoreB - scoreA;
      }
      
      // 相关性相同时，按时间排序
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });
};

/**
 * 计算内容相关度
 */
const calculateContentRelevance = (item: ContentItem, keyword: string): number => {
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
  
  // 视频内容权重稍高
  if (item.type === 'video') {
    score += 1;
  }
  
  return score;
};

/**
 * 按内容类型分组
 */
export const processGroupByContentType = (results: ContentItem[]): Record<string, ContentItem[]> => {
  return results.reduce((groups, item) => {
    const type = item.type;
    if (!groups[type]) {
      groups[type] = [];
    }
    groups[type].push(item);
    return groups;
  }, {} as Record<string, ContentItem[]>);
};

/**
 * 过滤热门内容
 */
export const processFilterPopularContent = (results: ContentItem[], threshold: number = 100): ContentItem[] => {
  return results.filter(item => 
    item.likeCount >= threshold || 
    item.commentCount >= threshold / 2 ||
    item.shareCount >= threshold / 5
  );
};

/**
 * 处理瀑布流布局数据
 */
export const processMasonryLayoutData = (results: ContentItem[], columns: number = 2): ContentItem[][] => {
  const columnArrays: ContentItem[][] = Array.from({ length: columns }, () => []);
  
  results.forEach((item, index) => {
    const columnIndex = index % columns;
    columnArrays[columnIndex].push(item);
  });
  
  return columnArrays;
};
