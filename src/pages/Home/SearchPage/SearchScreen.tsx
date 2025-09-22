/**
 * 🔍 搜索模块 - 基于嵌套化主导架构的页面父组件集成
 *
 * TOC (快速跳转):
 * [1] Imports & Types
 * [2] Constants & Config
 * [3] Utils & Helpers
 * [4] State Management
 * [5] Domain Logic
 * [6] UI Components & Rendering
 * [7] Exports
 */

// #region 1. Imports & Types
import React, { useState, useCallback, useEffect, useRef } from 'react';
import {
  View,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  Keyboard,
  BackHandler,
} from 'react-native';

// 导入嵌套化组件架构
import SearchHeaderArea from './SearchHeaderArea';
import SearchInputArea from './SearchInputArea';
import SearchHistoryArea from './SearchHistoryArea';
import SearchSuggestionsArea from './SearchSuggestionsArea';
import SearchTabsArea from './SearchTabsArea';
import SearchResultsArea from './SearchResultsArea';

// 导入常量和类型
import { COLORS, SEARCH_CONFIG } from './constants';
import type { SearchHistoryItem, SearchSuggestion, TabType } from './types';
import { useSearchState } from './useSearchState';
import { useSearchNavigation } from './useSearchNavigation';
import { useSearchData } from './useSearchData';

interface SearchScreenProps {
  navigation?: any;
  route?: any;
}
// #endregion

// #region 2. Constants & Config
// 常量已移至 ./constants.ts
// #endregion

// #region 3. Utils & Helpers
// 工具函数已移至各个区域组件
// #endregion

// #region 4. State Management
// 状态管理已移至 ./useSearchState.ts
// #endregion

// #region 5. Domain Logic
// 业务逻辑已移至各个区域组件
// #endregion

// #region 6. UI Components & Rendering
/**
 * SearchScreen 组件 - 搜索页面父组件
 * 集成所有子组件区域的完整搜索系统
 */
const SearchScreen: React.FC<SearchScreenProps> = ({ navigation, route }) => {
  // 使用自定义hooks管理状态和逻辑
  const {
    keyword,
    setKeyword,
    activeTab,
    setActiveTab,
    suggestions,
    history,
    showSuggestions,
    showHistory,
    loading,
    allResults,
    userResults,
    serviceResults,
    topicResults,
    refreshing,
    handleSearch,
    handleRefresh,
    handleClearSearch,
    handleHistorySelect,
    handleHistoryClear,
    handleHistoryDelete,
    handleSuggestionSelect,
  } = useSearchState();

  const {
    handleBackPress,
    handleContentPress,
    handleUserPress,
    handleServicePress,
    handleTopicPress,
  } = useSearchNavigation(navigation);

  // 渲染当前内容区域
  const renderCurrentContent = () => {
    // 如果显示搜索建议
    if (showSuggestions && suggestions.length > 0) {
      return (
        <SearchSuggestionsArea
          suggestions={suggestions}
          onSuggestionSelect={handleSuggestionSelect}
          keyword={keyword}
        />
      );
    }

    // 如果显示搜索历史
    if (showHistory) {
      return (
        <SearchHistoryArea
          history={history}
          onHistorySelect={handleHistorySelect}
          onHistoryClear={handleHistoryClear}
          onHistoryDelete={handleHistoryDelete}
        />
      );
    }

    // 如果显示搜索结果
    return (
      <View style={styles.resultsContainer}>
        <SearchTabsArea
          activeTab={activeTab}
          onTabChange={setActiveTab}
          resultCounts={{
            all: allResults.length,
            users: userResults.length,
            orders: serviceResults.length,
            topics: topicResults.length,
          }}
        />
        
        <SearchResultsArea
          activeTab={activeTab}
          keyword={keyword}
          allResults={allResults}
          userResults={userResults}
          serviceResults={serviceResults}
          topicResults={topicResults}
          loading={loading}
          refreshing={refreshing}
          onRefresh={handleRefresh}
          onContentPress={handleContentPress}
          onUserPress={handleUserPress}
          onServicePress={handleServicePress}
          onTopicPress={handleTopicPress}
        />
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* 状态栏 */}
      <StatusBar
        barStyle="dark-content"
        backgroundColor={COLORS.white}
        translucent={false}
      />
      
      {/* 搜索头部区域 */}
      <SearchHeaderArea
        onBackPress={handleBackPress}
        title="搜索"
      />
      
      {/* 搜索输入区域 */}
      <View style={styles.inputSection}>
        <SearchInputArea
          value={keyword}
          placeholder="搜索更多"
          onChangeText={setKeyword}
          onSearch={handleSearch}
          onClear={handleClearSearch}
          loading={loading}
          autoFocus={true}
          showSearchButton={true}
        />
      </View>
      
      {/* 内容区域 */}
      <View style={styles.content}>
        {renderCurrentContent()}
      </View>
    </SafeAreaView>
  );
};
// #endregion

// #region 7. Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  inputSection: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: COLORS.white,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.borderLight,
  },
  content: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  resultsContainer: {
    flex: 1,
  },
});
// #endregion

// #region 8. Exports
export default SearchScreen;
export type { SearchScreenProps };
// #endregion