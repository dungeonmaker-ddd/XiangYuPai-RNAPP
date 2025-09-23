/**
 * 话题选择钩子
 * 
 * 管理话题选择功能的状态和操作
 */

import { useState, useCallback } from 'react';
import type { UseTopicSelectorReturn } from './types';
import type { PublishTopicData } from '../types';
import { TAG_LIMITS } from '../constants';

/**
 * 话题选择钩子
 */
export const useTopicSelector = (): UseTopicSelectorReturn => {
  const [isTopicSelectorVisible, setIsTopicSelectorVisible] = useState(false);
  const [selectedTopics, setSelectedTopics] = useState<PublishTopicData[]>([]);
  const [categoryTopics, setCategoryTopics] = useState<Record<string, PublishTopicData[]>>({});
  const [searchResults, setSearchResults] = useState<PublishTopicData[]>([]);

  // 显示话题选择器
  const showTopicSelector = useCallback(() => {
    setIsTopicSelectorVisible(true);
  }, []);

  // 隐藏话题选择器
  const hideTopicSelector = useCallback(() => {
    setIsTopicSelectorVisible(false);
  }, []);

  // 选择话题列表
  const selectTopics = useCallback((topics: PublishTopicData[]) => {
    const limitedTopics = topics.slice(0, TAG_LIMITS.MAX_TOPICS);
    setSelectedTopics(limitedTopics);
  }, []);

  // 添加单个话题
  const addTopic = useCallback((topic: PublishTopicData): boolean => {
    if (selectedTopics.length >= TAG_LIMITS.MAX_TOPICS) {
      return false; // 已达到最大数量
    }
    
    // 检查是否已存在
    if (selectedTopics.some(t => t.id === topic.id)) {
      return false; // 已存在
    }
    
    setSelectedTopics(prev => [...prev, topic]);
    return true;
  }, [selectedTopics]);

  // 移除话题
  const removeTopic = useCallback((topicId: string) => {
    setSelectedTopics(prev => prev.filter(topic => topic.id !== topicId));
  }, []);

  // 清除所有话题
  const clearTopics = useCallback(() => {
    setSelectedTopics([]);
  }, []);

  // 搜索话题
  const searchTopics = useCallback(async (keyword: string) => {
    if (!keyword.trim()) {
      setSearchResults([]);
      return;
    }

    try {
      // TODO: 实现话题搜索API调用
      // 模拟搜索结果
      await new Promise(resolve => setTimeout(resolve, 300));
      
      const mockResults: PublishTopicData[] = [
        {
          id: `search-${keyword}-1`,
          name: `${keyword}相关话题1`,
          description: '热门话题',
          hotScore: 95,
          participantCount: 10000,
          category: 'hot',
          isHot: true,
        },
        {
          id: `search-${keyword}-2`,
          name: `${keyword}相关话题2`,
          description: '游戏话题',
          hotScore: 80,
          participantCount: 5000,
          category: 'game',
          isHot: false,
        },
      ];
      
      setSearchResults(mockResults);
    } catch (error) {
      console.error('搜索话题失败:', error);
      setSearchResults([]);
    }
  }, []);

  // 加载分类话题
  const loadCategoryTopics = useCallback(async (category: string) => {
    if (categoryTopics[category]) {
      return; // 已加载过
    }

    try {
      // TODO: 实现分类话题API调用
      // 模拟分类话题数据
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const mockTopics: PublishTopicData[] = [
        {
          id: `${category}-1`,
          name: `${category}话题1`,
          description: `${category}分类下的热门话题`,
          hotScore: 90,
          participantCount: 8000,
          category,
          isHot: category === 'hot',
        },
        {
          id: `${category}-2`,
          name: `${category}话题2`,
          description: `${category}分类下的推荐话题`,
          hotScore: 75,
          participantCount: 6000,
          category,
          isHot: false,
        },
        {
          id: `${category}-3`,
          name: `${category}话题3`,
          description: `${category}分类下的新兴话题`,
          hotScore: 60,
          participantCount: 3000,
          category,
          isHot: false,
        },
      ];
      
      setCategoryTopics(prev => ({
        ...prev,
        [category]: mockTopics,
      }));
    } catch (error) {
      console.error('加载分类话题失败:', error);
    }
  }, [categoryTopics]);

  return {
    isTopicSelectorVisible,
    selectedTopics,
    categoryTopics,
    searchResults,
    showTopicSelector,
    hideTopicSelector,
    selectTopics,
    addTopic,
    removeTopic,
    clearTopics,
    searchTopics,
    loadCategoryTopics,
  };
};
