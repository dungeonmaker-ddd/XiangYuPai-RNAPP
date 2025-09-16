/**
 * 💡 搜索建议组件
 * 
 * 功能特性：
 * - 实时搜索建议
 * - 关键词高亮显示
 * - 建议类型图标
 * - 点击补全搜索
 * - 快速搜索入口
 */

import React from 'react';
import {
  View,
  TouchableOpacity,
  Text,
  StyleSheet,
  FlatList,
  ListRenderItem,
} from 'react-native';

import { SearchSuggestionsProps, SearchSuggestion } from '../types';
import { COLORS, SPACING, FONTS, TEST_IDS, PLACEHOLDER_TEXTS } from '../constants';
import { highlightKeyword, truncateText } from '../utils';

const SearchSuggestions: React.FC<SearchSuggestionsProps> = ({
  suggestions,
  onSuggestionSelect,
  keyword,
}) => {
  // ══════════════════════════════════════════════════════════════
  // 1. 事件处理函数
  // ══════════════════════════════════════════════════════════════
  
  const handleSuggestionPress = (suggestion: SearchSuggestion) => {
    onSuggestionSelect(suggestion);
  };

  // ══════════════════════════════════════════════════════════════
  // 2. 渲染函数
  // ══════════════════════════════════════════════════════════════
  
  const getSuggestionIcon = (type: SearchSuggestion['type']): string => {
    switch (type) {
      case 'keyword':
        return '🔍';
      case 'user':
        return '👤';
      case 'topic':
        return '🏷️';
      default:
        return '🔍';
    }
  };

  const getSuggestionTypeText = (type: SearchSuggestion['type']): string => {
    switch (type) {
      case 'keyword':
        return '搜索';
      case 'user':
        return '用户';
      case 'topic':
        return '话题';
      default:
        return '搜索';
    }
  };

  const renderHighlightedText = (text: string, keyword: string) => {
    if (!keyword) {
      return <Text style={styles.suggestionText}>{text}</Text>;
    }

    const parts = highlightKeyword(text, keyword);
    
    return (
      <Text style={styles.suggestionText}>
        {parts.map((part, index) => (
          <Text
            key={index}
            style={[
              styles.suggestionText,
              part.highlighted && styles.suggestionTextHighlight,
            ]}
          >
            {part.text}
          </Text>
        ))}
      </Text>
    );
  };

  const renderSuggestionItem: ListRenderItem<SearchSuggestion> = ({ item, index }) => (
    <TouchableOpacity
      style={styles.suggestionItem}
      onPress={() => handleSuggestionPress(item)}
      activeOpacity={0.7}
      testID={`${TEST_IDS.SUGGESTION_ITEM}-${index}`}
    >
      {/* 建议项内容 */}
      <View style={styles.suggestionContent}>
        {/* 类型图标 */}
        <Text style={styles.suggestionIcon}>
          {getSuggestionIcon(item.type)}
        </Text>
        
        {/* 建议文本 */}
        <View style={styles.suggestionTextContainer}>
          {renderHighlightedText(item.text, keyword)}
          
          {/* 类型标签 */}
          <Text style={styles.suggestionType}>
            {getSuggestionTypeText(item.type)}
          </Text>
        </View>
      </View>
      
      {/* 补全箭头 */}
      <View style={styles.suggestionArrow}>
        <Text style={styles.suggestionArrowText}>↗</Text>
      </View>
    </TouchableOpacity>
  );

  const renderEmptyState = () => (
    <View style={styles.emptyContainer}>
      <Text style={styles.emptyIcon}>💡</Text>
      <Text style={styles.emptyText}>{PLACEHOLDER_TEXTS.SEARCH_SUGGESTIONS}</Text>
      <Text style={styles.emptyHint}>输入关键词获取搜索建议</Text>
    </View>
  );

  const renderSeparator = () => (
    <View style={styles.separator} />
  );

  // ══════════════════════════════════════════════════════════════
  // 3. 主渲染
  // ══════════════════════════════════════════════════════════════
  
  if (suggestions.length === 0) {
    return renderEmptyState();
  }

  return (
    <View style={styles.container}>
      {/* 建议标题 */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>搜索建议</Text>
        <Text style={styles.headerSubtitle}>
          为"{truncateText(keyword, 10)}"找到 {suggestions.length} 个建议
        </Text>
      </View>
      
      {/* 建议列表 */}
      <FlatList
        data={suggestions}
        renderItem={renderSuggestionItem}
        keyExtractor={(item) => item.id}
        ItemSeparatorComponent={renderSeparator}
        showsVerticalScrollIndicator={false}
        style={styles.suggestionList}
        contentContainerStyle={styles.suggestionListContent}
        keyboardShouldPersistTaps="handled"
      />
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
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.borderLight,
  },
  
  headerTitle: {
    fontSize: FONTS.size.lg,
    fontWeight: FONTS.weight.semiBold,
    color: COLORS.textPrimary,
    marginBottom: SPACING.xs,
  },
  
  headerSubtitle: {
    fontSize: FONTS.size.sm,
    color: COLORS.textLight,
  },
  
  suggestionList: {
    flex: 1,
  },
  
  suggestionListContent: {
    paddingBottom: SPACING.xl,
  },
  
  suggestionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
    minHeight: 56,
  },
  
  suggestionContent: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  
  suggestionIcon: {
    fontSize: FONTS.size.md,
    marginRight: SPACING.md,
    color: COLORS.textLight,
  },
  
  suggestionTextContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  
  suggestionText: {
    flex: 1,
    fontSize: FONTS.size.md,
    color: COLORS.textPrimary,
    marginRight: SPACING.md,
  },
  
  suggestionTextHighlight: {
    color: COLORS.primary,
    fontWeight: FONTS.weight.semiBold,
    backgroundColor: COLORS.highlightBackground,
  },
  
  suggestionType: {
    fontSize: FONTS.size.xs,
    fontWeight: FONTS.weight.medium,
    color: COLORS.textLight,
    backgroundColor: COLORS.gray100,
    paddingHorizontal: SPACING.xs,
    paddingVertical: 2,
    borderRadius: 8,
  },
  
  suggestionArrow: {
    width: 24,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  
  suggestionArrowText: {
    fontSize: FONTS.size.md,
    color: COLORS.textLight,
    transform: [{ rotate: '-45deg' }],
  },
  
  separator: {
    height: 1,
    backgroundColor: COLORS.borderLight,
    marginLeft: SPACING.lg + FONTS.size.md + SPACING.md, // 对齐文本
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

export default SearchSuggestions;
