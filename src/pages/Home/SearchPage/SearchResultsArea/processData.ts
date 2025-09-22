/**
 * SearchResultsArea 数据处理模块
 * 处理搜索结果数据逻辑
 */

import type { ContentItem, UserInfo, ServiceInfo, TopicInfo } from '../types';

/**
 * 搜索结果数据处理参数
 */
interface ProcessResultsParams {
  allResults: ContentItem[];
  userResults: UserInfo[];
  serviceResults: ServiceInfo[];
  topicResults: TopicInfo[];
  keyword: string;
}

/**
 * 处理搜索结果数据
 * 对所有类型的搜索结果进行统一处理
 */
export const processResultsData = (params: ProcessResultsParams) => {
  const { allResults, userResults, serviceResults, topicResults, keyword } = params;

  return {
    processedAllResults: processAllResults(allResults, keyword),
    processedUserResults: processUserResults(userResults, keyword),
    processedServiceResults: processServiceResults(serviceResults, keyword),
    processedTopicResults: processTopicResults(topicResults, keyword),
  };
};

/**
 * 处理全部结果数据
 */
const processAllResults = (results: ContentItem[], keyword: string): ContentItem[] => {
  return results
    .map(item => ({
      ...item,
      // 添加搜索相关性评分
      relevanceScore: calculateContentRelevance(item, keyword),
    }))
    .sort((a, b) => (b as any).relevanceScore - (a as any).relevanceScore);
};

/**
 * 处理用户结果数据
 */
const processUserResults = (results: UserInfo[], keyword: string): UserInfo[] => {
  return results
    .map(user => ({
      ...user,
      // 添加搜索相关性评分
      relevanceScore: calculateUserRelevance(user, keyword),
    }))
    .sort((a, b) => {
      // 在线用户优先
      if (a.status === 'online' && b.status !== 'online') return -1;
      if (b.status === 'online' && a.status !== 'online') return 1;
      
      // 然后按相关性排序
      return (b as any).relevanceScore - (a as any).relevanceScore;
    });
};

/**
 * 处理服务结果数据
 */
const processServiceResults = (results: ServiceInfo[], keyword: string): ServiceInfo[] => {
  return results
    .map(service => ({
      ...service,
      // 添加搜索相关性评分
      relevanceScore: calculateServiceRelevance(service, keyword),
    }))
    .sort((a, b) => {
      // 评分高的优先
      if (a.rating !== b.rating) {
        return b.rating - a.rating;
      }
      
      // 然后按相关性排序
      return (b as any).relevanceScore - (a as any).relevanceScore;
    });
};

/**
 * 处理话题结果数据
 */
const processTopicResults = (results: TopicInfo[], keyword: string): TopicInfo[] => {
  return results
    .map(topic => ({
      ...topic,
      // 添加搜索相关性评分
      relevanceScore: calculateTopicRelevance(topic, keyword),
    }))
    .sort((a, b) => {
      // 热门话题优先
      if (a.isHot && !b.isHot) return -1;
      if (b.isHot && !a.isHot) return 1;
      
      // 然后按相关性排序
      return (b as any).relevanceScore - (a as any).relevanceScore;
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
  
  return score;
};

/**
 * 计算用户相关度
 */
const calculateUserRelevance = (user: UserInfo, keyword: string): number => {
  let score = 0;
  const lowerKeyword = keyword.toLowerCase();
  
  // 用户名匹配权重最高
  if (user.username.toLowerCase().includes(lowerKeyword)) {
    score += 10;
  }
  
  // 简介匹配
  if (user.bio.toLowerCase().includes(lowerKeyword)) {
    score += 5;
  }
  
  // 标签匹配
  score += user.tags.filter(tag => 
    tag.toLowerCase().includes(lowerKeyword)
  ).length * 3;
  
  // 游戏技能匹配
  score += user.gameSkills.filter(skill => 
    skill.toLowerCase().includes(lowerKeyword)
  ).length * 2;
  
  return score;
};

/**
 * 计算服务相关度
 */
const calculateServiceRelevance = (service: ServiceInfo, keyword: string): number => {
  let score = 0;
  const lowerKeyword = keyword.toLowerCase();
  
  // 服务标题匹配权重最高
  if (service.title.toLowerCase().includes(lowerKeyword)) {
    score += 10;
  }
  
  // 游戏类型匹配
  if (service.gameType.toLowerCase().includes(lowerKeyword)) {
    score += 8;
  }
  
  // 描述匹配
  if (service.description.toLowerCase().includes(lowerKeyword)) {
    score += 5;
  }
  
  // 标签匹配
  score += service.tags.filter(tag => 
    tag.toLowerCase().includes(lowerKeyword)
  ).length * 3;
  
  return score;
};

/**
 * 计算话题相关度
 */
const calculateTopicRelevance = (topic: TopicInfo, keyword: string): number => {
  let score = 0;
  const lowerKeyword = keyword.toLowerCase();
  
  // 话题名匹配权重最高
  if (topic.name.toLowerCase().includes(lowerKeyword)) {
    score += 10;
  }
  
  // 描述匹配
  if (topic.description.toLowerCase().includes(lowerKeyword)) {
    score += 5;
  }
  
  // 标签匹配
  score += topic.tags.filter(tag => 
    tag.toLowerCase().includes(lowerKeyword)
  ).length * 3;
  
  // 分类匹配
  if (topic.category.toLowerCase().includes(lowerKeyword)) {
    score += 2;
  }
  
  return score;
};
