/**
 * AllResultsView - 全部搜索结果视图组件
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
import React, { useCallback } from 'react';
import {
  View,
  FlatList,
  RefreshControl,
  StyleSheet,
  Text,
  ActivityIndicator,
} from 'react-native';

// 内部模块导入
import { COLORS, SPACING, FONTS } from '../../constants';
import type { ContentItem } from '../../types';
import { ContentCard } from './ContentCard';
import { processAllResultsData } from './processData';
import { utilsMasonryLayout } from './utilsLayout';
// #endregion

// #region 2. Types & Schema
interface AllResultsViewProps {
  results: ContentItem[];
  keyword: string;
  loading: boolean;
  onLoadMore?: () => void;
  onRefresh?: () => void;
  refreshing?: boolean;
  onContentPress?: (item: ContentItem) => void;
}
// #endregion

// #region 3. Constants & Config
const MASONRY_CONFIG = {
  columns: 2,
  spacing: 8,
  itemMinHeight: 120,
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
 * AllResultsView 组件 - 全部搜索结果视图
 * 瀑布流布局展示混合内容类型
 */
const AllResultsView: React.FC<AllResultsViewProps> = ({
  results,
  keyword,
  loading,
  onLoadMore,
  onRefresh,
  refreshing = false,
  onContentPress,
}) => {
  const processedResults = processAllResultsData(results, keyword);
  const { getMasonryItemStyle, getColumnWidth } = utilsMasonryLayout();

  const renderContentItem = useCallback(({ item, index }: { item: ContentItem; index: number }) => (
    <View style={[
      styles.masonryItem,
      getMasonryItemStyle(index),
      { width: getColumnWidth() }
    ]}>
      <ContentCard
        item={item}
        keyword={keyword}
        onPress={onContentPress}
      />
    </View>
  ), [keyword, onContentPress, getMasonryItemStyle, getColumnWidth]);

  const renderListEmpty = useCallback(() => {
    if (loading) {
      return (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={COLORS.primary} />
          <Text style={styles.loadingText}>搜索中...</Text>
        </View>
      );
    }
    
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyIcon}>🔍</Text>
        <Text style={styles.emptyText}>暂无相关内容</Text>
        <Text style={styles.emptyHint}>试试其他关键词</Text>
      </View>
    );
  }, [loading]);

  const renderListFooter = useCallback(() => {
    if (loading && processedResults.length > 0) {
      return (
        <View style={styles.footerContainer}>
          <ActivityIndicator size="small" color={COLORS.primary} />
          <Text style={styles.footerText}>加载更多...</Text>
        </View>
      );
    }
    return null;
  }, [loading, processedResults.length]);

  const keyExtractor = useCallback((item: ContentItem) => item.id, []);

  return (
    <View style={styles.container}>
      <FlatList
        data={processedResults}
        renderItem={renderContentItem}
        keyExtractor={keyExtractor}
        numColumns={MASONRY_CONFIG.columns}
        ListEmptyComponent={renderListEmpty}
        ListFooterComponent={renderListFooter}
        contentContainerStyle={styles.listContent}
        columnWrapperStyle={styles.row}
        showsVerticalScrollIndicator={false}
        onEndReached={onLoadMore}
        onEndReachedThreshold={0.1}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[COLORS.primary]}
            tintColor={COLORS.primary}
          />
        }
      />
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
  listContent: {
    padding: MASONRY_CONFIG.spacing,
    flexGrow: 1,
  },
  row: {
    justifyContent: 'space-between',
    paddingHorizontal: MASONRY_CONFIG.spacing,
  },
  masonryItem: {
    marginBottom: MASONRY_CONFIG.spacing,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 40,
  },
  loadingText: {
    fontSize: FONTS.size.md,
    color: COLORS.textLight,
    marginTop: SPACING.md,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyIcon: {
    fontSize: 48,
    marginBottom: SPACING.lg,
    opacity: 0.3,
  },
  emptyText: {
    fontSize: FONTS.size.lg,
    fontWeight: FONTS.weight.medium,
    color: COLORS.textLight,
    marginBottom: SPACING.sm,
  },
  emptyHint: {
    fontSize: FONTS.size.sm,
    color: COLORS.textLight,
    textAlign: 'center',
  },
  footerContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 20,
    gap: 8,
  },
  footerText: {
    fontSize: FONTS.size.sm,
    color: COLORS.textLight,
  },
});
// #endregion

// #region 9. Exports
export default AllResultsView;
export type { AllResultsViewProps };
// #endregion
