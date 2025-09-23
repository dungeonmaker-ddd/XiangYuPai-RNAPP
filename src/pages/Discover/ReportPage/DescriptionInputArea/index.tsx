// #region 1. File Banner & TOC
/**
 * DescriptionInputArea - 举报描述输入区域组件
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
import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Animated,
} from 'react-native';

import { DescriptionInputAreaProps } from '../types';
import { REPORT_CONSTANTS } from '../constants';
// #endregion

// #region 3. Types & Schema
interface InputState {
  isFocused: boolean;
  borderAnimation: Animated.Value;
}
// #endregion

// #region 4. Constants & Config
const COMPONENT_CONFIG = {
  inputHeight: REPORT_CONSTANTS.LAYOUT.DESCRIPTION_INPUT_HEIGHT,
  borderRadius: REPORT_CONSTANTS.UI.SIZES.INPUT_BORDER_RADIUS,
  padding: REPORT_CONSTANTS.LAYOUT.INPUT_PADDING,
  animationDuration: REPORT_CONSTANTS.UI.ANIMATION.DURATION_FAST,
} as const;
// #endregion

// #region 5. Utils & Helpers
const getCharacterCountColor = (currentLength: number, maxLength: number): string => {
  const ratio = currentLength / maxLength;
  if (ratio >= 0.9) return REPORT_CONSTANTS.UI.COLORS.ERROR;
  if (ratio >= 0.8) return REPORT_CONSTANTS.UI.COLORS.WARNING;
  return REPORT_CONSTANTS.UI.COLORS.TEXT_PLACEHOLDER;
};

const formatCharacterCount = (current: number, max: number): string => {
  return `${current}/${max}`;
};
// #endregion

// #region 6. State Management
const useInputState = (): [InputState, (updates: Partial<InputState>) => void] => {
  const [state, setState] = useState<InputState>({
    isFocused: false,
    borderAnimation: new Animated.Value(0),
  });

  const updateState = (updates: Partial<InputState>) => {
    setState(prev => ({ ...prev, ...updates }));
  };

  return [state, updateState];
};
// #endregion

// #region 7. Domain Logic
const useInputLogic = (
  value: string,
  onChange: (text: string) => void,
  maxLength: number,
  state: InputState,
  updateState: (updates: Partial<InputState>) => void,
) => {
  const inputRef = useRef<TextInput>(null);

  const handleFocus = () => {
    updateState({ isFocused: true });
    Animated.timing(state.borderAnimation, {
      toValue: 1,
      duration: COMPONENT_CONFIG.animationDuration,
      useNativeDriver: false,
    }).start();
  };

  const handleBlur = () => {
    updateState({ isFocused: false });
    Animated.timing(state.borderAnimation, {
      toValue: 0,
      duration: COMPONENT_CONFIG.animationDuration,
      useNativeDriver: false,
    }).start();
  };

  const handleChangeText = (text: string) => {
    if (text.length <= maxLength) {
      onChange(text);
    }
  };

  const focusInput = () => {
    inputRef.current?.focus();
  };

  return {
    inputRef,
    handleFocus,
    handleBlur,
    handleChangeText,
    focusInput,
  };
};
// #endregion

// #region 8. UI Components & Rendering
const DescriptionInputArea: React.FC<DescriptionInputAreaProps> = ({
  value,
  onChange,
  maxLength,
  placeholder = REPORT_CONSTANTS.TEXT.DESCRIPTION_PLACEHOLDER,
}) => {
  const [state, updateState] = useInputState();
  const {
    inputRef,
    handleFocus,
    handleBlur,
    handleChangeText,
  } = useInputLogic(value, onChange, maxLength, state, updateState);

  // 计算动画样式
  const animatedBorderColor = state.borderAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: [REPORT_CONSTANTS.UI.COLORS.BORDER, REPORT_CONSTANTS.UI.COLORS.BORDER_ACTIVE],
  });

  const animatedShadowOpacity = state.borderAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 0.1],
  });

  return (
    <View style={styles.container}>
      {/* 区域标题 */}
      <Text style={styles.sectionTitle}>
        {REPORT_CONSTANTS.TEXT.DESCRIPTION_TITLE}
      </Text>

      {/* 输入框容器 */}
      <Animated.View
        style={[
          styles.inputContainer,
          {
            borderColor: animatedBorderColor,
            shadowOpacity: animatedShadowOpacity,
          },
        ]}
      >
        <TextInput
          ref={inputRef}
          style={styles.textInput}
          value={value}
          onChangeText={handleChangeText}
          onFocus={handleFocus}
          onBlur={handleBlur}
          placeholder={placeholder}
          placeholderTextColor={REPORT_CONSTANTS.UI.COLORS.TEXT_PLACEHOLDER}
          multiline
          textAlignVertical="top"
          maxLength={maxLength}
          returnKeyType="default"
          blurOnSubmit={false}
        />
      </Animated.View>

      {/* 字数统计 */}
      <View style={styles.counterContainer}>
        <Text
          style={[
            styles.counterText,
            { color: getCharacterCountColor(value.length, maxLength) },
          ]}
        >
          {formatCharacterCount(value.length, maxLength)}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: REPORT_CONSTANTS.UI.SPACING.MD,
    paddingTop: REPORT_CONSTANTS.UI.SPACING.XL,
  },
  sectionTitle: {
    fontSize: REPORT_CONSTANTS.UI.FONTS.LARGE,
    color: REPORT_CONSTANTS.UI.COLORS.TEXT_PRIMARY,
    fontWeight: '600',
    marginBottom: REPORT_CONSTANTS.UI.SPACING.MD,
  },
  inputContainer: {
    backgroundColor: REPORT_CONSTANTS.UI.COLORS.INPUT_BACKGROUND,
    borderRadius: COMPONENT_CONFIG.borderRadius,
    borderWidth: 1,
    minHeight: COMPONENT_CONFIG.inputHeight,
    shadowColor: REPORT_CONSTANTS.UI.COLORS.PRIMARY,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowRadius: 4,
    elevation: 2,
  },
  textInput: {
    flex: 1,
    fontSize: REPORT_CONSTANTS.UI.FONTS.MEDIUM,
    color: REPORT_CONSTANTS.UI.COLORS.TEXT_PRIMARY,
    padding: COMPONENT_CONFIG.padding,
    lineHeight: REPORT_CONSTANTS.UI.FONTS.MEDIUM * 1.4,
    textAlignVertical: 'top',
  },
  counterContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    paddingTop: REPORT_CONSTANTS.UI.SPACING.SM,
  },
  counterText: {
    fontSize: REPORT_CONSTANTS.UI.FONTS.SMALL,
    fontWeight: '400',
  },
});
// #endregion

// #region 9. Exports
export default DescriptionInputArea;
export { DescriptionInputArea };
// #endregion
