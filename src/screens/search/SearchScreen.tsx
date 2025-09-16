/**
 * 🔍 搜索页面主组件
 * 
 * TOC (quick jump):
 * [1] Imports & Types (40-60行)
 * [2] Constants & Config (30-50行)
 * [3] State Management (80-120行)
 * [4] Utils & Helpers (60-80行)
 * [5] Event Handlers (100-150行)
 * [6] Render Functions (150-200行)
 * [7] Main Component (80-120行)
 * [8] Styles (60-100行)
 * [9] Exports (10-20行)
 * 
 * 基于搜索结果模块架构设计的完整搜索页面实现
 * 包含搜索输入、历史记录、搜索建议等核心功能
 */

// ══════════════════════════════════════════════════════════════
// 1. Imports & Types (40-60行)
// ══════════════════════════════════════════════════════════════

import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  View,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  TouchableOpacity,
  Text,
  Keyboard,
  BackHandler,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

// 导入搜索模块组件
import {
  SearchInput,
  SearchHistory,
  SearchSuggestions,
} from './components';

// 导入类型和常量
import {
  SearchHistoryItem,
  SearchSuggestion,
  TabType,
} from './types';
import {
  COLORS,
  SPACING,
  FONTS,
  LAYOUT,
  SEARCH_CONFIG,
  TEST_IDS,
} from './constants';

// 导入工具函数
import {
  debounce,
  validateKeyword,
  generateHistoryId,
  filterDuplicateHistory,
  limitHistoryCount,
} from './utils';

// ══════════════════════════════════════════════════════════════
// 2. Constants & Config (30-50行)
// ══════════════════════════════════════════════════════════════

// 模拟搜索建议数据
const MOCK_SUGGESTIONS: SearchSuggestion[] = [
  { id: '1', text: '王者荣耀', type: 'keyword' },
  { id: '2', text: '王者荣耀112', type: 'user' },
  { id: '3', text: '王者荣耀排位', type: 'topic' },
  { id: '4', text: '王者荣耀大师', type: 'user' },
  { id: '5', text: '王者荣耀交友', type: 'topic' },
];

// 模拟搜索历史数据
const MOCK_HISTORY: SearchHistoryItem[] = [
  {
    id: generateHistoryId('王者荣耀', Date.now() - 3600000),
    keyword: '王者荣耀',
    timestamp: Date.now() - 3600000,
    resultCount: 156,
  },
  {
    id: generateHistoryId('昵称123456', Date.now() - 7200000),
    keyword: '昵称123456',
    timestamp: Date.now() - 7200000,
    resultCount: 23,
  },
];

// 组件Props类型
interface SearchScreenProps {
  navigation?: any; // 导航对象
  route?: any;      // 路由对象
}

// ══════════════════════════════════════════════════════════════
// 3. State Management (80-120行)
// ══════════════════════════════════════════════════════════════

const SearchScreen: React.FC<SearchScreenProps> = ({ navigation }) => {
  const safeAreaInsets = useSafeAreaInsets();
  
  // 搜索状态
  const [keyword, setKeyword] = useState('');
  const [suggestions, setSuggestions] = useState<SearchSuggestion[]>([]);
  const [history, setHistory] = useState<SearchHistoryItem[]>(MOCK_HISTORY);
  
  // UI状态
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [showHistory, setShowHistory] = useState(true);
  const [loading, setLoading] = useState(false);
  
  // 引用
  const searchInputRef = useRef<any>(null);
  const keyboardDidHideListener = useRef<any>(null);

  // ══════════════════════════════════════════════════════════════
  // 4. Utils & Helpers (60-80行)
  // ══════════════════════════════════════════════════════════════
  
  // 防抖获取搜索建议
  const debouncedGetSuggestions = useCallback(
    debounce(async (searchKeyword: string) => {
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
    }, SEARCH_CONFIG.DEBOUNCE_DELAY),
    []
  );

  // ══════════════════════════════════════════════════════════════
  // 5. Event Handlers (100-150行)
  // ══════════════════════════════════════════════════════════════
  
  // 处理搜索输入变化
  const handleSearchInputChange = useCallback((text: string) => {
    setKeyword(text);
    
    if (text.trim()) {
      debouncedGetSuggestions(text.trim());
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
      setShowHistory(true);
    }
  }, [debouncedGetSuggestions]);

  // 处理搜索执行
  const handleSearch = useCallback((searchKeyword: string) => {
    const validation = validateKeyword(searchKeyword);
    
    if (!validation.valid) {
      console.warn('搜索关键词无效:', validation.error);
      return;
    }

    // 添加到搜索历史
    const newHistoryItem: SearchHistoryItem = {
      id: generateHistoryId(searchKeyword, Date.now()),
      keyword: searchKeyword,
      timestamp: Date.now(),
      resultCount: Math.floor(Math.random() * 200), // 模拟结果数量
    };

    setHistory(prevHistory => 
      limitHistoryCount(
        filterDuplicateHistory(prevHistory, newHistoryItem)
      )
    );

    // 隐藏键盘
    Keyboard.dismiss();

    // 跳转到搜索结果页面
    console.log('执行搜索:', searchKeyword);
    // navigation?.navigate('SearchResult', { keyword: searchKeyword });
  }, []);

  // 处理清空搜索
  const handleClearSearch = useCallback(() => {
    setKeyword('');
    setSuggestions([]);
    setShowSuggestions(false);
    setShowHistory(true);
  }, []);

  // 处理历史记录选择
  const handleHistorySelect = useCallback((item: SearchHistoryItem) => {
    setKeyword(item.keyword);
    handleSearch(item.keyword);
  }, [handleSearch]);

  // 处理历史记录清空
  const handleHistoryClear = useCallback(() => {
    setHistory([]);
  }, []);

  // 处理历史记录删除
  const handleHistoryDelete = useCallback((id: string) => {
    setHistory(prevHistory => prevHistory.filter(item => item.id !== id));
  }, []);

  // 处理搜索建议选择
  const handleSuggestionSelect = useCallback((suggestion: SearchSuggestion) => {
    setKeyword(suggestion.text);
    handleSearch(suggestion.text);
  }, [handleSearch]);

  // 处理返回按钮
  const handleBackPress = useCallback(() => {
    if (navigation?.canGoBack()) {
      navigation.goBack();
      return true;
    }
    return false;
  }, [navigation]);

  // ══════════════════════════════════════════════════════════════
  // 6. Render Functions (150-200行)
  // ══════════════════════════════════════════════════════════════
  
  // 渲染导航栏
  const renderHeader = () => (
    <View style={[
      styles.header,
      { paddingTop: safeAreaInsets.top + SPACING.md }
    ]}>
      {/* 返回按钮 */}
      <TouchableOpacity
        style={styles.backButton}
        onPress={handleBackPress}
        activeOpacity={0.7}
      >
        <Text style={styles.backButtonText}>←</Text>
      </TouchableOpacity>
      
      {/* 搜索输入框 */}
      <View style={styles.searchInputContainer}>
        <SearchInput
          ref={searchInputRef}
          value={keyword}
          placeholder="搜索更多"
          onChangeText={handleSearchInputChange}
          onSearch={handleSearch}
          onClear={handleClearSearch}
          loading={loading}
          autoFocus={true}
        />
      </View>
      
      {/* 搜索按钮 */}
      <TouchableOpacity
        style={[
          styles.searchButton,
          !keyword.trim() && styles.searchButtonDisabled
        ]}
        onPress={() => keyword.trim() && handleSearch(keyword.trim())}
        activeOpacity={0.8}
        disabled={!keyword.trim()}
        testID={TEST_IDS.SEARCH_BUTTON}
      >
        <Text style={[
          styles.searchButtonText,
          !keyword.trim() && styles.searchButtonTextDisabled
        ]}>
          搜索
        </Text>
      </TouchableOpacity>
    </View>
  );

  // 渲染内容区域
  const renderContent = () => {
    if (showSuggestions && suggestions.length > 0) {
      return (
        <SearchSuggestions
          suggestions={suggestions}
          onSuggestionSelect={handleSuggestionSelect}
          keyword={keyword}
        />
      );
    }

    if (showHistory) {
      return (
        <SearchHistory
          history={history}
          onHistorySelect={handleHistorySelect}
          onHistoryClear={handleHistoryClear}
          onHistoryDelete={handleHistoryDelete}
        />
      );
    }

    return null;
  };

  // ══════════════════════════════════════════════════════════════
  // 7. Effects & Lifecycle (60-80行)
  // ══════════════════════════════════════════════════════════════
  
  // 监听返回按钮
  useEffect(() => {
    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      handleBackPress
    );

    return () => backHandler.remove();
  }, [handleBackPress]);

  // 监听键盘隐藏
  useEffect(() => {
    keyboardDidHideListener.current = Keyboard.addListener(
      'keyboardDidHide',
      () => {
        // 键盘隐藏时的处理逻辑
      }
    );

    return () => {
      keyboardDidHideListener.current?.remove();
    };
  }, []);

  // ══════════════════════════════════════════════════════════════
  // 8. Main Render (80-120行)
  // ══════════════════════════════════════════════════════════════
  
  return (
    <SafeAreaView style={styles.container}>
      {/* 状态栏 */}
      <StatusBar
        barStyle="dark-content"
        backgroundColor={COLORS.white}
        translucent={false}
      />
      
      {/* 导航栏 */}
      {renderHeader()}
      
      {/* 内容区域 */}
      <View style={styles.content}>
        {renderContent()}
      </View>
    </SafeAreaView>
  );
};

// ══════════════════════════════════════════════════════════════
// 9. Styles (60-100行)
// ══════════════════════════════════════════════════════════════

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SPACING.lg,
    paddingBottom: SPACING.md,
    backgroundColor: COLORS.white,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.borderLight,
  },
  
  backButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: SPACING.md,
  },
  
  backButtonText: {
    fontSize: 24,
    color: COLORS.textPrimary,
    fontWeight: FONTS.weight.medium,
  },
  
  searchInputContainer: {
    flex: 1,
    marginRight: SPACING.md,
  },
  
  searchButton: {
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.sm,
    backgroundColor: COLORS.primary,
    borderRadius: 20,
    minWidth: 80,
    alignItems: 'center',
    justifyContent: 'center',
  },
  
  searchButtonDisabled: {
    backgroundColor: COLORS.gray400,
  },
  
  searchButtonText: {
    fontSize: FONTS.size.md,
    fontWeight: FONTS.weight.semiBold,
    color: COLORS.white,
  },
  
  searchButtonTextDisabled: {
    color: COLORS.gray200,
  },
  
  content: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
});

// ══════════════════════════════════════════════════════════════
// 10. Exports (10-20行)
// ══════════════════════════════════════════════════════════════

export default SearchScreen;
