/**
 * SearchSuggestionsArea - 搜索建议区域组件
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
  FlatList,
  ListRenderItem,
} from 'react-native';

// 内部模块导入
import { COLORS, SPACING, FONTS } from '../constants';
import type { SearchSuggestion } from '../types';
import { processSuggestionData } from './processData';
import { utilsSuggestionFormat } from './utilsFormat';
// #endregion

// #region 2. Types & Schema
interface SearchSuggestionsAreaProps {
  suggestions: SearchSuggestion[];
  onSuggestionSelect: (suggestion: SearchSuggestion) => void;
  keyword: string;
}
// #endregion

// #region 3. Constants & Config
const SUGGESTIONS_CONFIG = {
  itemHeight: 56,
  maxDisplayItems: 10,
  iconSize: 18,
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
 * SearchSuggestionsArea 组件 - 搜索建议区域
 * 展示实时搜索建议和智能提示
 */
const SearchSuggestionsArea: React.FC<SearchSuggestionsAreaProps> = ({
  suggestions,
  onSuggestionSelect,
  keyword,
}) => {
  const processedSuggestions = processSuggestionData(suggestions, keyword);
  const { 
    getSuggestionIcon, 
    getSuggestionTypeText, 
    getHighlightedTextParts,
    truncateText 
  } = utilsSuggestionFormat();

  const handleSuggestionPress = (suggestion: SearchSuggestion) => {
    onSuggestionSelect(suggestion);
  };

  const renderSuggestionItem: ListRenderItem<SearchSuggestion> = ({ item, index }) => (
    <TouchableOpacity
      style={styles.suggestionItem}
      onPress={() => handleSuggestionPress(item)}
      activeOpacity={0.7}
    >
      <View style={styles.suggestionContent}>
        {/* 类型图标 */}
        <Text style={styles.suggestionIcon}>
          {getSuggestionIcon(item.type)}
        </Text>
        
        {/* 建议文本 */}
        <View style={styles.suggestionTextContainer}>
          <Text style={styles.suggestionText}>
            {getHighlightedTextParts(item.text, keyword).map((part, index) => (
              <Text
                key={index}
                style={[
                  styles.suggestionText,
                  part.highlighted && styles.suggestionTextHighlighted,
                ]}
              >
                {part.text}
              </Text>
            ))}
          </Text>
          
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
      <Text style={styles.emptyText}>暂无搜索建议</Text>
      <Text style={styles.emptyHint}>输入关键词获取搜索建议</Text>
    </View>
  );

  const renderSeparator = () => (
    <View style={styles.separator} />
  );

  if (processedSuggestions.length === 0) {
    return renderEmptyState();
  }

  return (
    <View style={styles.container}>
      {/* 建议标题 */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>搜索建议</Text>
        <Text style={styles.headerSubtitle}>
          为"{truncateText(keyword, 10)}"找到 {processedSuggestions.length} 个建议
        </Text>
      </View>
      
      {/* 建议列表 */}
      <FlatList
        data={processedSuggestions}
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
// #endregion

// #region 8. Styles
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
    minHeight: SUGGESTIONS_CONFIG.itemHeight,
  },
  suggestionContent: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  suggestionIcon: {
    fontSize: SUGGESTIONS_CONFIG.iconSize,
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
    marginRight: 12,
  },
  suggestionTextHighlighted: {
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
    marginLeft: SPACING.lg + SUGGESTIONS_CONFIG.iconSize + SPACING.md,
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
export default SearchSuggestionsArea;
export type { SearchSuggestionsAreaProps };
// #endregion
