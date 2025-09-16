/**
 * 🔍 搜索输入框组件
 * 
 * 功能特性：
 * - 实时搜索输入
 * - 防抖处理
 * - 清空按钮
 * - 加载状态
 * - 自动聚焦
 */

import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  TextInput,
  TouchableOpacity,
  Text,
  ActivityIndicator,
  StyleSheet,
} from 'react-native';

import { SearchInputProps } from '../types';
import { COLORS, SPACING, FONTS, LAYOUT, TEST_IDS } from '../constants';
import { debounce, validateKeyword } from '../utils';

const SearchInput: React.FC<SearchInputProps> = ({
  value,
  placeholder = '搜索更多',
  onChangeText,
  onSearch,
  onClear,
  loading = false,
  autoFocus = false,
}) => {
  // ══════════════════════════════════════════════════════════════
  // 1. 状态管理
  // ══════════════════════════════════════════════════════════════
  
  const [isFocused, setIsFocused] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<TextInput>(null);

  // ══════════════════════════════════════════════════════════════
  // 2. 防抖搜索处理
  // ══════════════════════════════════════════════════════════════
  
  const debouncedSearch = useRef(
    debounce((keyword: string) => {
      const validation = validateKeyword(keyword);
      
      if (!validation.valid) {
        setError(validation.error || null);
        return;
      }
      
      setError(null);
      onSearch(keyword);
    }, 300)
  ).current;

  // ══════════════════════════════════════════════════════════════
  // 3. 事件处理函数
  // ══════════════════════════════════════════════════════════════
  
  const handleTextChange = (text: string) => {
    onChangeText(text);
    
    // 清除错误状态
    if (error) {
      setError(null);
    }
    
    // 如果有内容则触发防抖搜索
    if (text.trim()) {
      debouncedSearch(text.trim());
    }
  };

  const handleClear = () => {
    onClear();
    setError(null);
    inputRef.current?.focus();
  };

  const handleSubmitEditing = () => {
    if (value.trim()) {
      const validation = validateKeyword(value.trim());
      
      if (!validation.valid) {
        setError(validation.error || null);
        return;
      }
      
      setError(null);
      onSearch(value.trim());
    }
  };

  const handleFocus = () => {
    setIsFocused(true);
  };

  const handleBlur = () => {
    setIsFocused(false);
  };

  // ══════════════════════════════════════════════════════════════
  // 4. 生命周期处理
  // ══════════════════════════════════════════════════════════════
  
  useEffect(() => {
    if (autoFocus) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
    }
  }, [autoFocus]);

  // ══════════════════════════════════════════════════════════════
  // 5. 渲染函数
  // ══════════════════════════════════════════════════════════════
  
  const renderSearchIcon = () => (
    <View style={styles.searchIcon}>
      <Text style={styles.searchIconText}>🔍</Text>
    </View>
  );

  const renderClearButton = () => {
    if (!value || loading) {
      return null;
    }

    return (
      <TouchableOpacity
        style={styles.clearButton}
        onPress={handleClear}
        activeOpacity={0.7}
        testID={TEST_IDS.CLEAR_BUTTON}
      >
        <Text style={styles.clearButtonText}>✕</Text>
      </TouchableOpacity>
    );
  };

  const renderLoadingIndicator = () => {
    if (!loading) {
      return null;
    }

    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator
          size="small"
          color={COLORS.primary}
        />
      </View>
    );
  };

  const renderError = () => {
    if (!error) {
      return null;
    }

    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  };

  // ══════════════════════════════════════════════════════════════
  // 6. 主渲染
  // ══════════════════════════════════════════════════════════════
  
  return (
    <View style={styles.container}>
      {/* 搜索输入框容器 */}
      <View style={[
        styles.inputContainer,
        isFocused && styles.inputContainerFocused,
        error && styles.inputContainerError,
      ]}>
        {/* 搜索图标 */}
        {renderSearchIcon()}
        
        {/* 输入框 */}
        <TextInput
          ref={inputRef}
          style={styles.textInput}
          value={value}
          placeholder={placeholder}
          placeholderTextColor={COLORS.textLight}
          onChangeText={handleTextChange}
          onSubmitEditing={handleSubmitEditing}
          onFocus={handleFocus}
          onBlur={handleBlur}
          returnKeyType="search"
          clearButtonMode="never" // 使用自定义清空按钮
          autoCapitalize="none"
          autoCorrect={false}
          maxLength={50}
          testID={TEST_IDS.SEARCH_INPUT}
        />
        
        {/* 加载指示器 */}
        {renderLoadingIndicator()}
        
        {/* 清空按钮 */}
        {renderClearButton()}
      </View>
      
      {/* 错误提示 */}
      {renderError()}
    </View>
  );
};

// ══════════════════════════════════════════════════════════════
// 7. 样式定义
// ══════════════════════════════════════════════════════════════

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    height: LAYOUT.SEARCH_INPUT_HEIGHT,
    backgroundColor: COLORS.backgroundInput,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: COLORS.border,
    paddingHorizontal: SPACING.md,
  },
  
  inputContainerFocused: {
    borderColor: COLORS.primary,
    backgroundColor: COLORS.white,
    elevation: 2,
    shadowColor: COLORS.shadow,
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  
  inputContainerError: {
    borderColor: COLORS.error,
  },
  
  searchIcon: {
    marginRight: SPACING.sm,
  },
  
  searchIconText: {
    fontSize: FONTS.size.lg,
    color: COLORS.textLight,
  },
  
  textInput: {
    flex: 1,
    fontSize: FONTS.size.md,
    color: COLORS.textPrimary,
    paddingVertical: 0, // 移除默认内边距
    includeFontPadding: false, // Android专用
    textAlignVertical: 'center', // Android专用
  },
  
  loadingContainer: {
    marginLeft: SPACING.sm,
  },
  
  clearButton: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: COLORS.gray400,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: SPACING.sm,
  },
  
  clearButtonText: {
    fontSize: FONTS.size.sm,
    color: COLORS.white,
    fontWeight: FONTS.weight.bold,
  },
  
  errorContainer: {
    marginTop: SPACING.xs,
    paddingHorizontal: SPACING.md,
  },
  
  errorText: {
    fontSize: FONTS.size.sm,
    color: COLORS.error,
    fontWeight: FONTS.weight.medium,
  },
});

export default SearchInput;
