/**
 * SearchResultsArea - 搜索结果区域组件
 * 
 * TOC (快速跳转):
 * [1] Imports
 * [2] Types & Schema  
 * [3] Constants & Config
 * [4] Utils & Helpers
 * [5] State Management
 * [6] Domain Logic
 * [7] UI Components & Rendering
 * [8] Exports
 */

// #region 1. Imports
import React from 'react';
import {
  View,
  StyleSheet,
} from 'react-native';

// 内部模块导入
import { COLORS } from '../constants';
import type { TabType, ContentItem, UserInfo, ServiceInfo, TopicInfo } from '../types';
import { AllResultsView } from './AllResultsView';
import { UserResultsView } from './UserResultsView';
import { ServiceResultsView } from './ServiceResultsView';
import { TopicResultsView } from './TopicResultsView';
import { processResultsData } from './processData';
import { utilsResultsLayout } from './utilsLayout';
// #endregion

// #region 2. Types & Schema
interface SearchResultsAreaProps {
  activeTab: TabType;
  keyword: string;
  allResults: ContentItem[];
  userResults: UserInfo[];
  serviceResults: ServiceInfo[];
  topicResults: TopicInfo[];
  loading: boolean;
  onLoadMore?: () => void;
  onRefresh?: () => void;
  refreshing?: boolean;
  // 交互回调
  onContentPress?: (item: ContentItem) => void;
  onUserPress?: (user: UserInfo) => void;
  onServicePress?: (service: ServiceInfo) => void;
  onTopicPress?: (topic: TopicInfo) => void;
}
// #endregion

// #region 3. Constants & Config
const RESULTS_CONFIG = {
  emptyStateHeight: 200,
  loadingStateHeight: 100,
} as const;
// #endregion

// #region 4. Utils & Helpers
// 工具函数已移至 ./utilsLayout.ts
// #endregion

// #region 5. State Management
// 状态管理逻辑
// #endregion

// #region 6. Domain Logic
// 业务逻辑已移至 ./processData.ts
// #endregion

// #region 7. UI Components & Rendering
/**
 * SearchResultsArea 组件 - 搜索结果区域
 * 根据激活标签动态切换不同类型的搜索结果展示
 */
const SearchResultsArea: React.FC<SearchResultsAreaProps> = ({
  activeTab,
  keyword,
  allResults,
  userResults,
  serviceResults,
  topicResults,
  loading,
  onLoadMore,
  onRefresh,
  refreshing = false,
  onContentPress,
  onUserPress,
  onServicePress,
  onTopicPress,
}) => {
  const {
    processedAllResults,
    processedUserResults,
    processedServiceResults,
    processedTopicResults,
  } = processResultsData({
    allResults,
    userResults,
    serviceResults,
    topicResults,
    keyword,
  });

  const { getContainerStyle } = utilsResultsLayout();

  const renderActiveTabContent = () => {
    switch (activeTab) {
      case 'all':
        return (
          <AllResultsView
            results={processedAllResults}
            keyword={keyword}
            loading={loading}
            onLoadMore={onLoadMore}
            onRefresh={onRefresh}
            refreshing={refreshing}
            onContentPress={onContentPress}
          />
        );
      
      case 'users':
        return (
          <UserResultsView
            results={processedUserResults}
            keyword={keyword}
            loading={loading}
            onLoadMore={onLoadMore}
            onRefresh={onRefresh}
            refreshing={refreshing}
            onUserPress={onUserPress}
          />
        );
      
      case 'orders':
        return (
          <ServiceResultsView
            results={processedServiceResults}
            keyword={keyword}
            loading={loading}
            onLoadMore={onLoadMore}
            onRefresh={onRefresh}
            refreshing={refreshing}
            onServicePress={onServicePress}
          />
        );
      
      case 'topics':
        return (
          <TopicResultsView
            results={processedTopicResults}
            keyword={keyword}
            loading={loading}
            onLoadMore={onLoadMore}
            onRefresh={onRefresh}
            refreshing={refreshing}
            onTopicPress={onTopicPress}
          />
        );
      
      default:
        return null;
    }
  };

  return (
    <View style={[styles.container, getContainerStyle()]}>
      {renderActiveTabContent()}
    </View>
  );
};
// #endregion

// #region 8. Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
});
// #endregion

// #region 9. Exports
export default SearchResultsArea;
export type { SearchResultsAreaProps };
// #endregion
