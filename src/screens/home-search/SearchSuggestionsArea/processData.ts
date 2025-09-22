/**
 * SearchSuggestionsArea 数据处理模块
 * 处理搜索建议数据逻辑
 */

import type { SearchSuggestion } from '../types';

/**
 * 处理建议数据
 * 对搜索建议进行排序和过滤
 */
export const processSuggestionData = (
  suggestions: SearchSuggestion[], 
  keyword: string
): SearchSuggestion[] => {
  if (!keyword.trim()) {
    return suggestions;
  }

  // 按相关度排序
  return suggestions
    .filter(item => 
      item.text.toLowerCase().includes(keyword.toLowerCase())
    )
    .sort((a, b) => {
      // 计算相关度分数
      const scoreA = calculateSuggestionScore(a, keyword);
      const scoreB = calculateSuggestionScore(b, keyword);
      return scoreB - scoreA;
    })
    .slice(0, 10); // 限制显示数量
};

/**
 * 计算建议相关度分数
 */
const calculateSuggestionScore = (suggestion: SearchSuggestion, keyword: string): number => {
  let score = 0;
  const lowerText = suggestion.text.toLowerCase();
  const lowerKeyword = keyword.toLowerCase();
  
  // 完全匹配权重最高
  if (lowerText === lowerKeyword) {
    score += 100;
  }
  // 开头匹配权重较高
  else if (lowerText.startsWith(lowerKeyword)) {
    score += 50;
  }
  // 包含匹配权重一般
  else if (lowerText.includes(lowerKeyword)) {
    score += 20;
  }
  
  // 根据类型调整权重
  switch (suggestion.type) {
    case 'user':
      score += 10; // 用户建议权重较高
      break;
    case 'topic':
      score += 5;  // 话题建议权重中等
      break;
    case 'keyword':
    default:
      score += 2;  // 关键词建议权重较低
      break;
  }
  
  return score;
};

/**
 * 按类型分组建议
 */
export const processGroupSuggestionsByType = (
  suggestions: SearchSuggestion[]
): Record<string, SearchSuggestion[]> => {
  return suggestions.reduce((groups, suggestion) => {
    const type = suggestion.type;
    if (!groups[type]) {
      groups[type] = [];
    }
    groups[type].push(suggestion);
    return groups;
  }, {} as Record<string, SearchSuggestion[]>);
};

/**
 * 生成默认建议
 */
export const processGenerateDefaultSuggestions = (): SearchSuggestion[] => {
  return [
    { id: 'default-1', text: '王者荣耀', type: 'keyword' },
    { id: 'default-2', text: '英雄联盟', type: 'keyword' },
    { id: 'default-3', text: '和平精英', type: 'keyword' },
    { id: 'default-4', text: '私影', type: 'keyword' },
    { id: 'default-5', text: 'K歌', type: 'keyword' },
  ];
};
