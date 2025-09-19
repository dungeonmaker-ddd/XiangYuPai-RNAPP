/**
 * 举报描述输入组件
 * 
 * 功能：
 * - 多行文本输入框，支持200字限制
 * - 实时字数统计显示
 * - 超出字数限制时红色提示
 * - 表单验证错误显示
 */

// #region [1] Imports
import React, { useCallback, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Platform,
} from 'react-native';

import { ReportValidationError } from '../types';
import { REPORT_CONSTANTS } from '../constants';
// #endregion

// #region [2] Types
interface ReportDescriptionInputProps {
  value: string;
  onChangeText: (text: string) => void;
  maxLength: number;
  placeholder?: string;
  validationError?: ReportValidationError;
}
// #endregion

// #region [3] Constants
const INPUT_CONFIG = {
  minHeight: 200,
  borderRadius: 12,
  padding: 16,
  fontSize: 16,
  lineHeight: 22,
} as const;

const COUNTER_CONFIG = {
  fontSize: 12,
  bottomSpacing: 8,
  rightSpacing: 8,
} as const;

const DEFAULT_PLACEHOLDER = '请描述你举报的原因';
// #endregion

// #region [4] Utils
/**
 * 获取字数统计的颜色
 */
const getCounterColor = (currentLength: number, maxLength: number): string => {
  if (currentLength > maxLength) {
    return '#FF4444'; // 红色 - 超出限制
  }
  if (currentLength > maxLength * 0.9) {
    return '#FF8800'; // 橙色 - 接近限制
  }
  return '#999999'; // 灰色 - 正常状态
};

/**
 * 获取边框颜色
 */
const getBorderColor = (isFocused: boolean, hasError: boolean): string => {
  if (hasError) {
    return '#FF4444';
  }
  if (isFocused) {
    return REPORT_CONSTANTS.COLORS.PRIMARY;
  }
  return '#E0E0E0';
};
// #endregion

// #region [5] Main Component
/**
 * 举报描述输入组件
 */
export const ReportDescriptionInput: React.FC<ReportDescriptionInputProps> = ({
  value,
  onChangeText,
  maxLength,
  placeholder = DEFAULT_PLACEHOLDER,
  validationError,
}) => {
  const [isFocused, setIsFocused] = useState(false);

  const handleChangeText = useCallback((text: string) => {
    // 允许输入超过限制，但会有视觉提示
    onChangeText(text);
  }, [onChangeText]);

  const handleFocus = useCallback(() => {
    setIsFocused(true);
  }, []);

  const handleBlur = useCallback(() => {
    setIsFocused(false);
  }, []);

  const currentLength = value.length;
  const isOverLimit = currentLength > maxLength;
  const hasError = !!validationError || isOverLimit;

  const borderColor = getBorderColor(isFocused, hasError);
  const counterColor = getCounterColor(currentLength, maxLength);

  return (
    <View style={styles.container}>
      {/* 标题区域 */}
      <View style={styles.titleContainer}>
        <Text style={styles.title}>举报描述</Text>
        {validationError && (
          <Text style={styles.errorText}>{validationError.message}</Text>
        )}
      </View>

      {/* 输入框容器 */}
      <View style={[styles.inputContainer, { borderColor }]}>
        <TextInput
          style={styles.textInput}
          value={value}
          onChangeText={handleChangeText}
          onFocus={handleFocus}
          onBlur={handleBlur}
          placeholder={placeholder}
          placeholderTextColor="#999999"
          multiline
          textAlignVertical="top"
          maxLength={undefined} // 不在这里限制，允许超出以显示错误状态
          selectionColor={REPORT_CONSTANTS.COLORS.PRIMARY}
          keyboardType="default"
          returnKeyType="default"
          blurOnSubmit={false}
          scrollEnabled={true}
        />

        {/* 字数统计 */}
        <View style={styles.counterContainer}>
          <Text style={[styles.counterText, { color: counterColor }]}>
            {currentLength}/{maxLength}
          </Text>
        </View>
      </View>

      {/* 超出限制提示 */}
      {isOverLimit && (
        <Text style={styles.overLimitText}>
          描述内容超出{maxLength}字限制，请适当精简
        </Text>
      )}
    </View>
  );
};
// #endregion

// #region [6] Styles
const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingBottom: 24,
  },

  // 标题样式
  titleContainer: {
    marginBottom: 16,
  },
  title: {
    fontSize: 18,
    color: '#333333',
    fontWeight: '600',
    lineHeight: 24,
  },
  errorText: {
    fontSize: 14,
    color: '#FF4444',
    marginTop: 8,
    lineHeight: 20,
  },

  // 输入框样式
  inputContainer: {
    backgroundColor: '#F5F5F5',
    borderRadius: INPUT_CONFIG.borderRadius,
    borderWidth: 1,
    minHeight: INPUT_CONFIG.minHeight,
    position: 'relative',
  },
  textInput: {
    flex: 1,
    fontSize: INPUT_CONFIG.fontSize,
    lineHeight: INPUT_CONFIG.lineHeight,
    color: '#333333',
    padding: INPUT_CONFIG.padding,
    paddingBottom: INPUT_CONFIG.padding + 24, // 为字数统计留出空间
    textAlignVertical: 'top',
    ...Platform.select({
      ios: {
        paddingTop: INPUT_CONFIG.padding,
      },
      android: {
        paddingTop: INPUT_CONFIG.padding,
        textAlignVertical: 'top',
      },
    }),
  },

  // 字数统计样式
  counterContainer: {
    position: 'absolute',
    bottom: COUNTER_CONFIG.bottomSpacing,
    right: COUNTER_CONFIG.rightSpacing,
  },
  counterText: {
    fontSize: COUNTER_CONFIG.fontSize,
    lineHeight: 16,
  },

  // 超出限制提示样式
  overLimitText: {
    fontSize: 12,
    color: '#FF4444',
    marginTop: 8,
    lineHeight: 16,
    paddingLeft: 4,
  },
});
// #endregion

export default ReportDescriptionInput;
