/**
 * SearchSuggestionsArea 格式化工具模块
 * 处理搜索建议格式化相关的工具函数
 */

import React from 'react';
import { Text, StyleSheet } from 'react-native';
import { COLORS, FONTS } from '../constants';
import type { SearchSuggestion } from '../types';

/**
 * 建议格式化工具函数
 */
export const utilsSuggestionFormat = () => {
  /**
   * 获取建议图标
   */
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

  /**
   * 获取建议类型文本
   */
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

  /**
   * 渲染高亮文本
   */
  const renderHighlightedText = (text: string, keyword: string) => {
    if (!keyword) {
      return <Text style={suggestionTextStyle}>{text}</Text>;
    }

    const parts = highlightKeyword(text, keyword);
    
    return (
      <Text style={suggestionTextStyle}>
        {parts.map((part, index) => (
          <Text
            key={index}
            style={[
              suggestionTextStyle,
              part.highlighted && suggestionTextHighlightStyle,
            ]}
          >
            {part.text}
          </Text>
        ))}
      </Text>
    );
  };

  /**
   * 截断文本
   */
  const truncateText = (text: string, maxLength: number = 10): string => {
    if (!text || text.length <= maxLength) {
      return text;
    }
    
    return text.substring(0, maxLength - 3) + '...';
  };

  return {
    getSuggestionIcon,
    getSuggestionTypeText,
    renderHighlightedText,
    truncateText,
  };
};

/**
 * 关键词高亮处理
 */
const highlightKeyword = (text: string, keyword: string) => {
  if (!keyword || !text) {
    return [{ text, highlighted: false }];
  }

  const regex = new RegExp(`(${keyword})`, 'gi');
  const parts = text.split(regex);
  
  return parts.map((part, index) => ({
    text: part,
    highlighted: regex.test(part),
  }));
};

// 样式定义
const suggestionTextStyle = {
  flex: 1,
  fontSize: FONTS.size.md,
  color: COLORS.textPrimary,
  marginRight: 12,
};

const suggestionTextHighlightStyle = {
  color: COLORS.primary,
  fontWeight: FONTS.weight.semiBold,
  backgroundColor: COLORS.highlightBackground,
};
