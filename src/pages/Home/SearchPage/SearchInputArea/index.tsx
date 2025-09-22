/**
 * SearchInputArea - 搜索输入区域组件
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
import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  TextInput,
  TouchableOpacity,
  Text,
  ActivityIndicator,
  StyleSheet,
} from 'react-native';

// 内部模块导入
import { COLORS, SPACING, FONTS, LAYOUT } from '../constants';
import { processInputValidation } from './processValidation';
import { utilsInputFormat } from './utilsFormat';
// #endregion

// #region 2. Types & Schema
interface SearchInputAreaProps {
  value: string;
  placeholder?: string;
  onChangeText: (text: string) => void;
  onSearch: (keyword: string) => void;
  onClear: () => void;
  loading?: boolean;
  autoFocus?: boolean;
  showSearchButton?: boolean;
}
// #endregion

// #region 3. Constants & Config
const INPUT_CONFIG = {
  maxLength: 50,
  height: 40,
  borderRadius: 20,
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
// 业务逻辑已移至 ./processValidation.ts
// #endregion

// #region 7. UI Components & Rendering
/**
 * SearchInputArea 组件 - 搜索输入区域
 * 包含搜索框、清空按钮、搜索按钮
 */
const SearchInputArea: React.FC<SearchInputAreaProps> = ({
  value,
  placeholder = '搜索更多',
  onChangeText,
  onSearch,
  onClear,
  loading = false,
  autoFocus = false,
  showSearchButton = true,
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<TextInput>(null);
  
  const { formatInputValue, getPlaceholderColor } = utilsInputFormat();

  const handleTextChange = (text: string) => {
    const formattedText = formatInputValue(text);
    onChangeText(formattedText);
    
    // 清除错误状态
    if (error) {
      setError(null);
    }
  };

  const handleClear = () => {
    onClear();
    setError(null);
    inputRef.current?.focus();
  };

  const handleSubmitEditing = () => {
    if (value.trim()) {
      const validation = processInputValidation(value.trim());
      
      if (!validation.valid) {
        setError(validation.error || null);
        return;
      }
      
      setError(null);
      onSearch(value.trim());
    }
  };

  const handleSearchPress = () => {
    if (value.trim()) {
      handleSubmitEditing();
    }
  };

  useEffect(() => {
    if (autoFocus) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
    }
  }, [autoFocus]);

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

  const renderSearchButton = () => {
    if (!showSearchButton) {
      return null;
    }

    return (
      <TouchableOpacity
        style={[
          styles.searchButton,
          !value.trim() && styles.searchButtonDisabled
        ]}
        onPress={handleSearchPress}
        activeOpacity={0.8}
        disabled={!value.trim()}
      >
        <Text style={[
          styles.searchButtonText,
          !value.trim() && styles.searchButtonTextDisabled
        ]}>
          搜索
        </Text>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.inputRow}>
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
            placeholderTextColor={getPlaceholderColor()}
            onChangeText={handleTextChange}
            onSubmitEditing={handleSubmitEditing}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            returnKeyType="search"
            clearButtonMode="never"
            autoCapitalize="none"
            autoCorrect={false}
            maxLength={INPUT_CONFIG.maxLength}
          />
          
          {/* 加载指示器 */}
          {renderLoadingIndicator()}
          
          {/* 清空按钮 */}
          {renderClearButton()}
        </View>
        
        {/* 搜索按钮 */}
        {renderSearchButton()}
      </View>
      
      {/* 错误提示 */}
      {error && (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      )}
    </View>
  );
};
// #endregion

// #region 8. Styles
const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.md,
  },
  inputContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    height: INPUT_CONFIG.height,
    backgroundColor: COLORS.backgroundInput,
    borderRadius: INPUT_CONFIG.borderRadius,
    borderWidth: 1,
    borderColor: COLORS.border,
    paddingHorizontal: SPACING.md,
  },
  inputContainerFocused: {
    borderColor: COLORS.primary,
    backgroundColor: COLORS.white,
    elevation: 2,
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 1 },
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
    fontSize: INPUT_CONFIG.iconSize,
    color: COLORS.textLight,
  },
  textInput: {
    flex: 1,
    fontSize: FONTS.size.md,
    color: COLORS.textPrimary,
    paddingVertical: 0,
    includeFontPadding: false,
    textAlignVertical: 'center',
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
  searchButton: {
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.sm,
    backgroundColor: COLORS.primary,
    borderRadius: INPUT_CONFIG.borderRadius,
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
// #endregion

// #region 9. Exports
export default SearchInputArea;
export type { SearchInputAreaProps };
// #endregion
