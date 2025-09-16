/**
 * 📝 搜索历史组件
 * 
 * 功能特性：
 * - 显示搜索历史记录
 * - 点击历史项快速搜索
 * - 长按删除单个历史
 * - 一键清空所有历史
 * - 流式标签布局
 */

import React from 'react';
import {
  View,
  TouchableOpacity,
  Text,
  StyleSheet,
  Alert,
  ScrollView,
} from 'react-native';

import { SearchHistoryProps } from '../types';
import { COLORS, SPACING, FONTS, TEST_IDS, PLACEHOLDER_TEXTS } from '../constants';
import { formatTime, truncateText } from '../utils';

const SearchHistory: React.FC<SearchHistoryProps> = ({
  history,
  onHistorySelect,
  onHistoryClear,
  onHistoryDelete,
}) => {
  // ══════════════════════════════════════════════════════════════
  // 1. 事件处理函数
  // ══════════════════════════════════════════════════════════════
  
  const handleHistoryPress = (item: typeof history[0]) => {
    onHistorySelect(item);
  };

  const handleHistoryLongPress = (item: typeof history[0]) => {
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
    if (history.length === 0) {
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

  // ══════════════════════════════════════════════════════════════
  // 2. 渲染函数
  // ══════════════════════════════════════════════════════════════
  
  const renderHistoryHeader = () => (
    <View style={styles.header}>
      <Text style={styles.headerTitle}>历史记录</Text>
      
      {history.length > 0 && (
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

  const renderHistoryItem = (item: typeof history[0], index: number) => (
    <TouchableOpacity
      key={item.id}
      style={styles.historyItem}
      onPress={() => handleHistoryPress(item)}
      onLongPress={() => handleHistoryLongPress(item)}
      activeOpacity={0.7}
      testID={`${TEST_IDS.HISTORY_ITEM}-${index}`}
    >
      {/* 历史项内容 */}
      <View style={styles.historyItemContent}>
        {/* 搜索图标 */}
        <Text style={styles.historyIcon}>🕐</Text>
        
        {/* 关键词文本 */}
        <Text style={styles.historyKeyword} numberOfLines={1}>
          {truncateText(item.keyword, 20)}
        </Text>
        
        {/* 结果数量 */}
        {item.resultCount > 0 && (
          <Text style={styles.historyCount}>
            {item.resultCount}个结果
          </Text>
        )}
      </View>
      
      {/* 时间戳 */}
      <Text style={styles.historyTime}>
        {formatTime(item.timestamp)}
      </Text>
    </TouchableOpacity>
  );

  const renderEmptyState = () => (
    <View style={styles.emptyContainer}>
      <Text style={styles.emptyIcon}>🔍</Text>
      <Text style={styles.emptyText}>{PLACEHOLDER_TEXTS.SEARCH_HISTORY}</Text>
      <Text style={styles.emptyHint}>搜索后会显示历史记录</Text>
    </View>
  );

  const renderHistoryList = () => {
    if (history.length === 0) {
      return renderEmptyState();
    }

    return (
      <View style={styles.historyList}>
        {history.map((item, index) => renderHistoryItem(item, index))}
      </View>
    );
  };

  // ══════════════════════════════════════════════════════════════
  // 3. 主渲染
  // ══════════════════════════════════════════════════════════════
  
  return (
    <View style={styles.container}>
      {/* 历史记录标题 */}
      {renderHistoryHeader()}
      
      {/* 历史记录列表 */}
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

// ══════════════════════════════════════════════════════════════
// 4. 样式定义
// ══════════════════════════════════════════════════════════════

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

export default SearchHistory;
