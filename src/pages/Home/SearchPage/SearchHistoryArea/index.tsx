/**
 * SearchHistoryArea - 搜索历史区域组件
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
  TouchableOpacity,
  Text,
  StyleSheet,
  Alert,
  ScrollView,
} from 'react-native';

// 内部模块导入
import { COLORS, SPACING, FONTS } from '../constants';
import type { SearchHistoryItem } from '../types';
import { processHistoryData } from './processData';
import { utilsHistoryFormat } from './utilsFormat';
// #endregion

// #region 2. Types & Schema
interface SearchHistoryAreaProps {
  history: SearchHistoryItem[];
  onHistorySelect: (item: SearchHistoryItem) => void;
  onHistoryClear: () => void;
  onHistoryDelete: (id: string) => void;
}
// #endregion

// #region 3. Constants & Config
const HISTORY_CONFIG = {
  maxDisplayItems: 8,
  itemHeight: 56,
  tagHeight: 32,
} as const;
// #endregion

// #region 4. Utils & Helpers
// 工具函数已移至 ./utilsFormat.ts
// #endregion

// #region 5. State Management
// 状态管理逻辑
// #endregion

// #region 6. Domain Logic
// 业务逻辑已移至 ./processData.ts
// #endregion

// #region 7. UI Components & Rendering
/**
 * SearchHistoryArea 组件 - 搜索历史区域
 * 展示搜索历史记录和管理功能
 */
const SearchHistoryArea: React.FC<SearchHistoryAreaProps> = ({
  history,
  onHistorySelect,
  onHistoryClear,
  onHistoryDelete,
}) => {
  const processedHistory = processHistoryData(history);
  const { formatTime, truncateText } = utilsHistoryFormat();

  const handleHistoryPress = (item: SearchHistoryItem) => {
    onHistorySelect(item);
  };

  const handleHistoryLongPress = (item: SearchHistoryItem) => {
    Alert.alert(
      '删除搜索记录',
      `确定要删除"${item.keyword}"吗？`,
      [
        {
          text: '取消',
          style: 'cancel',
        },
        {
          text: '删除',
          style: 'destructive',
          onPress: () => onHistoryDelete(item.id),
        },
      ]
    );
  };

  const handleClearAll = () => {
    if (processedHistory.length === 0) {
      return;
    }

    Alert.alert(
      '清空搜索历史',
      '确定要清空所有搜索历史吗？',
      [
        {
          text: '取消',
          style: 'cancel',
        },
        {
          text: '清空',
          style: 'destructive',
          onPress: onHistoryClear,
        },
      ]
    );
  };

  const renderHistoryHeader = () => (
    <View style={styles.header}>
      <Text style={styles.headerTitle}>历史记录</Text>
      
      {processedHistory.length > 0 && (
        <TouchableOpacity
          style={styles.clearButton}
          onPress={handleClearAll}
          activeOpacity={0.7}
        >
          <Text style={styles.clearButtonText}>清空</Text>
        </TouchableOpacity>
      )}
    </View>
  );

  const renderHistoryItem = (item: SearchHistoryItem, index: number) => (
    <TouchableOpacity
      key={item.id}
      style={styles.historyItem}
      onPress={() => handleHistoryPress(item)}
      onLongPress={() => handleHistoryLongPress(item)}
      activeOpacity={0.7}
    >
      <View style={styles.historyItemContent}>
        <Text style={styles.historyIcon}>🕐</Text>
        
        <Text style={styles.historyKeyword} numberOfLines={1}>
          {truncateText(item.keyword, 20)}
        </Text>
        
        {item.resultCount > 0 && (
          <Text style={styles.historyCount}>
            {item.resultCount}个结果
          </Text>
        )}
      </View>
      
      <Text style={styles.historyTime}>
        {formatTime(item.timestamp)}
      </Text>
    </TouchableOpacity>
  );

  const renderEmptyState = () => (
    <View style={styles.emptyContainer}>
      <Text style={styles.emptyIcon}>🔍</Text>
      <Text style={styles.emptyText}>暂无搜索历史</Text>
      <Text style={styles.emptyHint}>搜索后会显示历史记录</Text>
    </View>
  );

  const renderHistoryList = () => {
    if (processedHistory.length === 0) {
      return renderEmptyState();
    }

    return (
      <View style={styles.historyList}>
        {processedHistory.map((item, index) => renderHistoryItem(item, index))}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {renderHistoryHeader()}
      
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {renderHistoryList()}
      </ScrollView>
    </View>
  );
};
// #endregion

// #region 8. Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.borderLight,
  },
  headerTitle: {
    fontSize: FONTS.size.lg,
    fontWeight: FONTS.weight.semiBold,
    color: COLORS.textPrimary,
  },
  clearButton: {
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.xs,
    borderRadius: 16,
    backgroundColor: COLORS.gray100,
  },
  clearButtonText: {
    fontSize: FONTS.size.sm,
    fontWeight: FONTS.weight.medium,
    color: COLORS.textSecondary,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: SPACING.xl,
  },
  historyList: {
    paddingHorizontal: SPACING.lg,
  },
  historyItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.borderLight,
  },
  historyItemContent: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  historyIcon: {
    fontSize: FONTS.size.md,
    marginRight: SPACING.md,
    color: COLORS.textLight,
  },
  historyKeyword: {
    flex: 1,
    fontSize: FONTS.size.md,
    fontWeight: FONTS.weight.medium,
    color: COLORS.textPrimary,
    marginRight: SPACING.md,
  },
  historyCount: {
    fontSize: FONTS.size.xs,
    fontWeight: FONTS.weight.medium,
    color: COLORS.textLight,
    backgroundColor: COLORS.gray100,
    paddingHorizontal: SPACING.xs,
    paddingVertical: 2,
    borderRadius: 8,
  },
  historyTime: {
    fontSize: FONTS.size.xs,
    color: COLORS.textLight,
    marginLeft: SPACING.md,
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: SPACING.xxxl * 2,
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
    lineHeight: FONTS.lineHeight.relaxed * FONTS.size.sm,
  },
});
// #endregion

// #region 9. Exports
export default SearchHistoryArea;
export type { SearchHistoryAreaProps };
// #endregion
