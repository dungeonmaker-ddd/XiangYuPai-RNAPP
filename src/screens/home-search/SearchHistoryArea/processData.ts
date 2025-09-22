/**
 * SearchHistoryArea 数据处理模块
 * 处理搜索历史数据逻辑
 */

import type { SearchHistoryItem } from '../types';
import { SEARCH_CONFIG } from '../constants';

/**
 * 处理历史数据
 * 对搜索历史进行排序和过滤
 */
export const processHistoryData = (history: SearchHistoryItem[]): SearchHistoryItem[] => {
  return history
    .sort((a, b) => b.timestamp - a.timestamp) // 按时间倒序
    .slice(0, SEARCH_CONFIG.MAX_HISTORY); // 限制数量
};

/**
 * 生成搜索历史项ID
 */
export const processGenerateHistoryId = (keyword: string, timestamp: number): string => {
  return `${keyword}_${timestamp}`;
};

/**
 * 过滤重复的搜索历史
 */
export const processFilterDuplicateHistory = (
  history: SearchHistoryItem[],
  newItem: SearchHistoryItem
): SearchHistoryItem[] => {
  // 移除相同关键词的历史记录
  const filtered = history.filter(item => item.keyword !== newItem.keyword);
  
  // 添加新记录到开头
  return [newItem, ...filtered];
};

/**
 * 限制搜索历史数量
 */
export const processLimitHistoryCount = (
  history: SearchHistoryItem[],
  maxCount: number = SEARCH_CONFIG.MAX_HISTORY
): SearchHistoryItem[] => {
  return history.slice(0, maxCount);
};

/**
 * 按关键词搜索历史
 */
export const processSearchHistory = (
  history: SearchHistoryItem[],
  searchKeyword: string
): SearchHistoryItem[] => {
  if (!searchKeyword.trim()) {
    return history;
  }
  
  const lowerKeyword = searchKeyword.toLowerCase();
  return history.filter(item => 
    item.keyword.toLowerCase().includes(lowerKeyword)
  );
};

/**
 * 获取热门搜索关键词
 */
export const processGetPopularKeywords = (history: SearchHistoryItem[]): string[] => {
  // 统计关键词频率
  const keywordCount = new Map<string, number>();
  
  history.forEach(item => {
    const count = keywordCount.get(item.keyword) || 0;
    keywordCount.set(item.keyword, count + 1);
  });
  
  // 按频率排序并返回前5个
  return Array.from(keywordCount.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([keyword]) => keyword);
};
