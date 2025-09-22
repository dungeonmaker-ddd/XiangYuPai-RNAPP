/**
 * useSearchState - 搜索状态管理Hook
 * 统一管理搜索页面所有状态逻辑
 */

import { useState, useCallback, useRef } from 'react';
import type { SearchHistoryItem, SearchSuggestion, TabType, ContentItem, UserInfo, ServiceInfo, TopicInfo } from './types';
import { SEARCH_CONFIG } from './constants';

// Mock数据
const MOCK_SUGGESTIONS: SearchSuggestion[] = [
  { id: '1', text: '王者荣耀', type: 'keyword' },
  { id: '2', text: '王者荣耀112', type: 'user' },
  { id: '3', text: '王者荣耀排位', type: 'topic' },
  { id: '4', text: '王者荣耀大师', type: 'user' },
  { id: '5', text: '王者荣耀交友', type: 'topic' },
];

const MOCK_HISTORY: SearchHistoryItem[] = [
  {
    id: 'history-1',
    keyword: '王者荣耀',
    timestamp: Date.now() - 3600000,
    resultCount: 156,
  },
  {
    id: 'history-2',
    keyword: '昵称123456',
    timestamp: Date.now() - 7200000,
    resultCount: 23,
  },
];

/**
 * 搜索状态管理Hook
 */
export const useSearchState = () => {
  // 基础搜索状态
  const [keyword, setKeyword] = useState('');
  const [activeTab, setActiveTab] = useState<TabType>('all');
  
  // 搜索建议和历史
  const [suggestions, setSuggestions] = useState<SearchSuggestion[]>([]);
  const [history, setHistory] = useState<SearchHistoryItem[]>(MOCK_HISTORY);
  
  // UI显示状态
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [showHistory, setShowHistory] = useState(true);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  
  // 搜索结果状态
  const [allResults, setAllResults] = useState<ContentItem[]>([]);
  const [userResults, setUserResults] = useState<UserInfo[]>([]);
  const [serviceResults, setServiceResults] = useState<ServiceInfo[]>([]);
  const [topicResults, setTopicResults] = useState<TopicInfo[]>([]);
  
  // 防抖引用
  const debouncedGetSuggestions = useRef<any>(null);

  // 防抖获取搜索建议
  const getSuggestions = useCallback(async (searchKeyword: string) => {
    if (!searchKeyword.trim()) {
      setSuggestions([]);
      setShowSuggestions(false);
      setShowHistory(true);
      return;
    }

    setLoading(true);
    
    try {
      // 模拟API请求延迟
      await new Promise(resolve => setTimeout(resolve, 300));
      
      // 过滤匹配的建议
      const filteredSuggestions = MOCK_SUGGESTIONS.filter(item =>
        item.text.toLowerCase().includes(searchKeyword.toLowerCase())
      );
      
      setSuggestions(filteredSuggestions);
      setShowSuggestions(true);
      setShowHistory(false);
    } catch (error) {
      console.error('获取搜索建议失败:', error);
      setSuggestions([]);
    } finally {
      setLoading(false);
    }
  }, []);

  // 初始化防抖函数
  if (!debouncedGetSuggestions.current) {
    debouncedGetSuggestions.current = debounce(getSuggestions, SEARCH_CONFIG.DEBOUNCE_DELAY);
  }

  // 处理关键词变化
  const handleKeywordChange = useCallback((text: string) => {
    setKeyword(text);
    
    if (text.trim()) {
      debouncedGetSuggestions.current(text.trim());
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
      setShowHistory(true);
    }
  }, []);

  // 处理搜索执行
  const handleSearch = useCallback(async (searchKeyword: string) => {
    if (!searchKeyword.trim()) return;

    // 添加到搜索历史
    const newHistoryItem: SearchHistoryItem = {
      id: `${searchKeyword}_${Date.now()}`,
      keyword: searchKeyword,
      timestamp: Date.now(),
      resultCount: Math.floor(Math.random() * 200),
    };

    setHistory(prevHistory => {
      const filtered = prevHistory.filter(item => item.keyword !== searchKeyword);
      return [newHistoryItem, ...filtered].slice(0, SEARCH_CONFIG.MAX_HISTORY);
    });

    // 隐藏建议和历史，显示结果
    setShowSuggestions(false);
    setShowHistory(false);
    setLoading(true);

    try {
      // 模拟搜索API调用
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // 模拟搜索结果
      setAllResults([]);
      setUserResults([]);
      setServiceResults([]);
      setTopicResults([]);
      
    } catch (error) {
      console.error('搜索失败:', error);
    } finally {
      setLoading(false);
    }

    Keyboard.dismiss();
  }, []);

  // 处理刷新
  const handleRefresh = useCallback(async () => {
    if (!keyword.trim()) return;
    
    setRefreshing(true);
    try {
      await handleSearch(keyword);
    } finally {
      setRefreshing(false);
    }
  }, [keyword, handleSearch]);

  // 处理清空搜索
  const handleClearSearch = useCallback(() => {
    setKeyword('');
    setSuggestions([]);
    setShowSuggestions(false);
    setShowHistory(true);
  }, []);

  // 处理历史选择
  const handleHistorySelect = useCallback((item: SearchHistoryItem) => {
    setKeyword(item.keyword);
    handleSearch(item.keyword);
  }, [handleSearch]);

  // 处理历史清空
  const handleHistoryClear = useCallback(() => {
    setHistory([]);
  }, []);

  // 处理历史删除
  const handleHistoryDelete = useCallback((id: string) => {
    setHistory(prevHistory => prevHistory.filter(item => item.id !== id));
  }, []);

  // 处理建议选择
  const handleSuggestionSelect = useCallback((suggestion: SearchSuggestion) => {
    setKeyword(suggestion.text);
    handleSearch(suggestion.text);
  }, [handleSearch]);

  return {
    keyword,
    setKeyword: handleKeywordChange,
    activeTab,
    setActiveTab,
    suggestions,
    history,
    showSuggestions,
    showHistory,
    loading,
    refreshing,
    allResults,
    userResults,
    serviceResults,
    topicResults,
    handleSearch,
    handleRefresh,
    handleClearSearch,
    handleHistorySelect,
    handleHistoryClear,
    handleHistoryDelete,
    handleSuggestionSelect,
  };
};

// 防抖函数
const debounce = (func: Function, delay: number) => {
  let timeoutId: NodeJS.Timeout;
  return (...args: any[]) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func.apply(null, args), delay);
  };
};
