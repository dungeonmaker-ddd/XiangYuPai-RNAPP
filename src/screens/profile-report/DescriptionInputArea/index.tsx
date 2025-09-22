// #region 1. File Banner & TOC
/**
 * 举报描述输入区域 - 200字限制的多行文本输入
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
// #endregion

// #region 2. Imports
import React, { useCallback, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Platform,
} from 'react-native';

// 内部导入
import type { DescriptionInputAreaProps } from '../types';
import { REPORT_CONSTANTS } from '../constants';
import { CharacterCounter } from './CharacterCounter';
// #endregion

// #region 3. Types & Schema
interface LocalProps extends DescriptionInputAreaProps {
  // 扩展本地Props
}
// #endregion

// #region 4. Constants & Config
const INPUT_CONFIG = {
  minHeight: 200,
  borderRadius: 12,
  padding: 16,
  fontSize: 16,
  lineHeight: 22,
  defaultPlaceholder: '请描述你举报的原因',
} as const;

const COUNTER_CONFIG = {
  bottomSpacing: 8,
  rightSpacing: 8,
} as const;
// #endregion

// #region 5. Utils & Helpers
// 获取字数统计的颜色
const getCounterColor = (currentLength: number, maxLength: number): string => {
  if (currentLength > maxLength) {
    return REPORT_CONSTANTS.COLORS.error;
  }
  if (currentLength > maxLength * 0.9) {
    return REPORT_CONSTANTS.COLORS.warning;
  }
  return REPORT_CONSTANTS.COLORS.text.disabled;
};

// 获取边框颜色
const getBorderColor = (isFocused: boolean, hasError: boolean): string => {
  if (hasError) {
    return REPORT_CONSTANTS.COLORS.border.error;
  }
  if (isFocused) {
    return REPORT_CONSTANTS.COLORS.border.active;
  }
  return REPORT_CONSTANTS.COLORS.border.default;
};
// #endregion

// #region 6. State Management
// 焦点状态通过useState管理
// #endregion

// #region 7. Domain Logic
// 事件处理逻辑已通过props传入
// #endregion

// #region 8. UI Components & Rendering
export const DescriptionInputArea: React.FC<LocalProps> = ({
  value,
  onChangeText,
  maxLength,
  placeholder = INPUT_CONFIG.defaultPlaceholder,
  validationError,
  disabled = false,
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
      <View style={[
        styles.inputContainer,
        { borderColor },
        disabled && styles.inputContainerDisabled,
      ]}>
        <TextInput
          style={[
            styles.textInput,
            disabled && styles.textInputDisabled,
          ]}
          value={value}
          onChangeText={handleChangeText}
          onFocus={handleFocus}
          onBlur={handleBlur}
          placeholder={placeholder}
          placeholderTextColor={REPORT_CONSTANTS.COLORS.text.placeholder}
          multiline
          textAlignVertical="top"
          maxLength={undefined} // 不在这里限制，允许超出以显示错误状态
          selectionColor={REPORT_CONSTANTS.COLORS.primary}
          keyboardType="default"
          returnKeyType="default"
          blurOnSubmit={false}
          scrollEnabled={true}
          editable={!disabled}
          accessible={true}
          accessibilityLabel={`举报描述输入框，当前${currentLength}字，最多${maxLength}字`}
          accessibilityHint="输入举报的详细原因"
        />

        {/* 字数统计 */}
        <CharacterCounter
          currentLength={currentLength}
          maxLength={maxLength}
          color={counterColor}
          style={styles.counter}
        />
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
    color: REPORT_CONSTANTS.COLORS.text.primary,
    fontWeight: '600',
    lineHeight: 24,
  },
  errorText: {
    fontSize: 14,
    color: REPORT_CONSTANTS.COLORS.error,
    marginTop: 8,
    lineHeight: 20,
  },

  // 输入框样式
  inputContainer: {
    backgroundColor: REPORT_CONSTANTS.COLORS.background.secondary,
    borderRadius: INPUT_CONFIG.borderRadius,
    borderWidth: 1,
    minHeight: INPUT_CONFIG.minHeight,
    position: 'relative',
  },
  inputContainerDisabled: {
    opacity: 0.6,
  },
  textInput: {
    flex: 1,
    fontSize: INPUT_CONFIG.fontSize,
    lineHeight: INPUT_CONFIG.lineHeight,
    color: REPORT_CONSTANTS.COLORS.text.primary,
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
  textInputDisabled: {
    color: REPORT_CONSTANTS.COLORS.text.disabled,
  },

  // 字数统计样式
  counter: {
    position: 'absolute',
    bottom: COUNTER_CONFIG.bottomSpacing,
    right: COUNTER_CONFIG.rightSpacing,
  },

  // 超出限制提示样式
  overLimitText: {
    fontSize: 12,
    color: REPORT_CONSTANTS.COLORS.error,
    marginTop: 8,
    lineHeight: 16,
    paddingLeft: 4,
  },
});
// #endregion

// #region 9. Exports
export default DescriptionInputArea;
// #endregion
