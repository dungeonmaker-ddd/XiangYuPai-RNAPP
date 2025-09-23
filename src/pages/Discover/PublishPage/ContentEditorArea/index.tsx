// #region 1. File Banner & TOC
/**
 * 内容编辑区域组件 - 标题和正文编辑功能
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
import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Keyboard,
  Platform,
  LayoutChangeEvent,
} from 'react-native';

// 类型和常量导入
import type { ContentEditorAreaProps, InputValidationState } from './types';
import {
  INPUT_LIMITS,
  INPUT_HEIGHTS,
  EDITOR_COLORS,
  EDITOR_FONTS,
  EDITOR_SPACING,
  PLACEHOLDER_TEXTS,
  VALIDATION_MESSAGES,
  KEYBOARD_CONFIG,
} from './constants';
// #endregion

// #region 3. Types & Schema
interface LocalState {
  titleFocused: boolean;
  contentFocused: boolean;
  contentHeight: number;
  keyboardHeight: number;
}

interface ValidationState {
  titleValid: boolean;
  contentValid: boolean;
  titleError?: string;
  contentError?: string;
}
// #endregion

// #region 4. Constants & Config
const KEYBOARD_BEHAVIOR = Platform.OS === 'ios' ? 'padding' : 'height';
const MULTILINE_PROPS = {
  multiline: true,
  textAlignVertical: 'top' as const,
  scrollEnabled: false,
};

const TITLE_INPUT_PROPS = {
  returnKeyType: KEYBOARD_CONFIG.TITLE_RETURN_KEY as any,
  keyboardType: KEYBOARD_CONFIG.TITLE_KEYBOARD_TYPE as any,
  autoCapitalize: KEYBOARD_CONFIG.AUTO_CAPITALIZE as any,
  autoCorrect: KEYBOARD_CONFIG.AUTO_CORRECT,
  spellCheck: KEYBOARD_CONFIG.SPELL_CHECK,
};

const CONTENT_INPUT_PROPS = {
  ...MULTILINE_PROPS,
  returnKeyType: KEYBOARD_CONFIG.CONTENT_RETURN_KEY as any,
  keyboardType: KEYBOARD_CONFIG.CONTENT_KEYBOARD_TYPE as any,
  autoCapitalize: KEYBOARD_CONFIG.AUTO_CAPITALIZE as any,
  autoCorrect: KEYBOARD_CONFIG.AUTO_CORRECT,
  spellCheck: KEYBOARD_CONFIG.SPELL_CHECK,
};
// #endregion

// #region 5. Utils & Helpers
const validateTitle = (title: string): { valid: boolean; error?: string } => {
  if (title.length === 0) {
    return { valid: false, error: VALIDATION_MESSAGES.TITLE_REQUIRED };
  }
  if (title.length > INPUT_LIMITS.TITLE_MAX_LENGTH) {
    return { valid: false, error: VALIDATION_MESSAGES.TITLE_TOO_LONG };
  }
  return { valid: true };
};

const validateContent = (content: string): { valid: boolean; error?: string } => {
  if (content.length === 0) {
    return { valid: false, error: VALIDATION_MESSAGES.CONTENT_REQUIRED };
  }
  if (content.length > INPUT_LIMITS.CONTENT_MAX_LENGTH) {
    return { valid: false, error: VALIDATION_MESSAGES.CONTENT_TOO_LONG };
  }
  return { valid: true };
};

const shouldShowWarning = (current: number, max: number): boolean => {
  return current / max >= INPUT_LIMITS.WARNING_THRESHOLD;
};

const getCounterColor = (current: number, max: number): string => {
  if (current > max) return EDITOR_COLORS.COUNTER_ERROR;
  if (shouldShowWarning(current, max)) return EDITOR_COLORS.COUNTER_WARNING;
  return EDITOR_COLORS.COUNTER_NORMAL;
};

const calculateContentHeight = (text: string, baseHeight: number): number => {
  const lines = text.split('\n').length;
  const calculatedHeight = Math.max(
    baseHeight,
    Math.min(lines * INPUT_HEIGHTS.LINE_HEIGHT_CONTENT + 20, INPUT_HEIGHTS.CONTENT_MAX_HEIGHT)
  );
  return calculatedHeight;
};
// #endregion

// #region 6. State Management
const ContentEditorArea: React.FC<ContentEditorAreaProps> = ({
  title,
  content,
  onTitleChange,
  onContentChange,
  titlePlaceholder = PLACEHOLDER_TEXTS.TITLE,
  contentPlaceholder = PLACEHOLDER_TEXTS.CONTENT,
  maxTitleLength = INPUT_LIMITS.TITLE_MAX_LENGTH,
  maxContentLength = INPUT_LIMITS.CONTENT_MAX_LENGTH,
  errors,
  disabled = false,
  autoFocus = false,
}) => {
  // 本地状态
  const [localState, setLocalState] = useState<LocalState>({
    titleFocused: false,
    contentFocused: false,
    contentHeight: INPUT_HEIGHTS.CONTENT_MIN_HEIGHT,
    keyboardHeight: 0,
  });

  // 引用
  const titleInputRef = useRef<TextInput>(null);
  const contentInputRef = useRef<TextInput>(null);

  // 验证状态
  const [validation, setValidation] = useState<ValidationState>({
    titleValid: false,
    contentValid: false,
  });
// #endregion

// #region 7. Domain Logic
  // 键盘事件处理
  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      'keyboardDidShow',
      (e) => {
        setLocalState(prev => ({
          ...prev,
          keyboardHeight: e.endCoordinates.height,
        }));
      }
    );

    const keyboardDidHideListener = Keyboard.addListener(
      'keyboardDidHide',
      () => {
        setLocalState(prev => ({
          ...prev,
          keyboardHeight: 0,
        }));
      }
    );

    return () => {
      keyboardDidShowListener.remove();
      keyboardDidHideListener.remove();
    };
  }, []);

  // 自动聚焦处理
  useEffect(() => {
    if (autoFocus && titleInputRef.current) {
      setTimeout(() => {
        titleInputRef.current?.focus();
      }, 100);
    }
  }, [autoFocus]);

  // 内容验证
  useEffect(() => {
    const titleValidation = validateTitle(title);
    const contentValidation = validateContent(content);

    setValidation({
      titleValid: titleValidation.valid,
      contentValid: contentValidation.valid,
      titleError: titleValidation.error,
      contentError: contentValidation.error,
    });
  }, [title, content]);

  // 标题变化处理
  const handleTitleChange = useCallback((text: string) => {
    if (text.length <= maxTitleLength) {
      onTitleChange(text);
    }
  }, [onTitleChange, maxTitleLength]);

  // 正文变化处理
  const handleContentChange = useCallback((text: string) => {
    if (text.length <= maxContentLength) {
      onContentChange(text);
      
      // 动态调整高度
      const newHeight = calculateContentHeight(text, INPUT_HEIGHTS.CONTENT_MIN_HEIGHT);
      setLocalState(prev => ({
        ...prev,
        contentHeight: newHeight,
      }));
    }
  }, [onContentChange, maxContentLength]);

  // 标题聚焦处理
  const handleTitleFocus = useCallback(() => {
    setLocalState(prev => ({ ...prev, titleFocused: true }));
  }, []);

  // 标题失焦处理
  const handleTitleBlur = useCallback(() => {
    setLocalState(prev => ({ ...prev, titleFocused: false }));
  }, []);

  // 正文聚焦处理
  const handleContentFocus = useCallback(() => {
    setLocalState(prev => ({ ...prev, contentFocused: true }));
  }, []);

  // 正文失焦处理
  const handleContentBlur = useCallback(() => {
    setLocalState(prev => ({ ...prev, contentFocused: false }));
  }, []);

  // 标题提交处理（跳转到正文）
  const handleTitleSubmit = useCallback(() => {
    contentInputRef.current?.focus();
  }, []);

  // 内容尺寸变化处理
  const handleContentSizeChange = useCallback((event: any) => {
    const { height } = event.nativeEvent.contentSize;
    const newHeight = Math.max(
      INPUT_HEIGHTS.CONTENT_MIN_HEIGHT,
      Math.min(height + 20, INPUT_HEIGHTS.CONTENT_MAX_HEIGHT)
    );
    
    setLocalState(prev => ({
      ...prev,
      contentHeight: newHeight,
    }));
  }, []);
// #endregion

// #region 8. UI Components & Rendering
  // 字符计数器组件
  const CharacterCounter: React.FC<{ current: number; max: number; style?: any }> = ({
    current,
    max,
    style,
  }) => (
    <Text style={[
      styles.characterCounter,
      { color: getCounterColor(current, max) },
      style,
    ]}>
      {current}/{max}
    </Text>
  );

  // 错误信息组件
  const ErrorMessage: React.FC<{ error?: string }> = ({ error }) => {
    if (!error) return null;
    
    return (
      <Text style={styles.errorText}>
        {error}
      </Text>
    );
  };

  return (
    <View style={styles.container}>
      {/* 标题输入区域 */}
      <View style={styles.titleContainer}>
        <TextInput
          ref={titleInputRef}
          style={[
            styles.titleInput,
            localState.titleFocused && styles.titleInputFocused,
            errors?.title && styles.titleInputError,
            disabled && styles.inputDisabled,
          ]}
          value={title}
          onChangeText={handleTitleChange}
          placeholder={localState.titleFocused ? PLACEHOLDER_TEXTS.TITLE_FOCUSED : titlePlaceholder}
          placeholderTextColor={EDITOR_COLORS.PLACEHOLDER}
          maxLength={maxTitleLength}
          editable={!disabled}
          onFocus={handleTitleFocus}
          onBlur={handleTitleBlur}
          onSubmitEditing={handleTitleSubmit}
          blurOnSubmit={false}
          {...TITLE_INPUT_PROPS}
        />
        
        <View style={styles.titleBottomRow}>
          <ErrorMessage error={errors?.title || validation.titleError} />
          <CharacterCounter 
            current={title.length} 
            max={maxTitleLength}
            style={styles.titleCounter}
          />
        </View>
      </View>

      {/* 正文输入区域 */}
      <View style={styles.contentContainer}>
        <TextInput
          ref={contentInputRef}
          style={[
            styles.contentInput,
            { height: localState.contentHeight },
            localState.contentFocused && styles.contentInputFocused,
            errors?.content && styles.contentInputError,
            disabled && styles.inputDisabled,
          ]}
          value={content}
          onChangeText={handleContentChange}
          placeholder={localState.contentFocused ? PLACEHOLDER_TEXTS.CONTENT_FOCUSED : contentPlaceholder}
          placeholderTextColor={EDITOR_COLORS.PLACEHOLDER}
          maxLength={maxContentLength}
          editable={!disabled}
          onFocus={handleContentFocus}
          onBlur={handleContentBlur}
          onContentSizeChange={handleContentSizeChange}
          {...CONTENT_INPUT_PROPS}
        />
        
        <View style={styles.contentBottomRow}>
          <ErrorMessage error={errors?.content || validation.contentError} />
          <CharacterCounter 
            current={content.length} 
            max={maxContentLength}
            style={styles.contentCounter}
          />
        </View>
      </View>
    </View>
  );
};

// 样式定义
const styles = StyleSheet.create({
  container: {
    backgroundColor: EDITOR_COLORS.BACKGROUND,
    paddingHorizontal: EDITOR_SPACING.CONTAINER_PADDING,
    paddingVertical: EDITOR_SPACING.INPUT_MARGIN,
  },
  
  // 标题样式
  titleContainer: {
    marginBottom: EDITOR_SPACING.INPUT_MARGIN,
  },
  titleInput: {
    height: INPUT_HEIGHTS.TITLE_HEIGHT,
    fontSize: EDITOR_FONTS.TITLE_SIZE,
    fontWeight: EDITOR_FONTS.TITLE_WEIGHT,
    color: EDITOR_COLORS.TEXT,
    paddingHorizontal: 0,
    paddingVertical: EDITOR_SPACING.INPUT_MARGIN,
    borderBottomWidth: EDITOR_SPACING.BORDER_WIDTH,
    borderBottomColor: EDITOR_COLORS.BORDER,
    lineHeight: INPUT_HEIGHTS.LINE_HEIGHT_TITLE,
  },
  titleInputFocused: {
    borderBottomColor: EDITOR_COLORS.BORDER_FOCUSED,
  },
  titleInputError: {
    borderBottomColor: EDITOR_COLORS.BORDER_ERROR,
  },
  titleBottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: EDITOR_SPACING.COUNTER_MARGIN,
    minHeight: 16,
  },
  titleCounter: {
    marginLeft: 'auto',
  },
  
  // 正文样式
  contentContainer: {
    marginBottom: EDITOR_SPACING.INPUT_MARGIN,
  },
  contentInput: {
    fontSize: EDITOR_FONTS.CONTENT_SIZE,
    fontWeight: EDITOR_FONTS.CONTENT_WEIGHT,
    color: EDITOR_COLORS.TEXT,
    paddingHorizontal: 0,
    paddingVertical: EDITOR_SPACING.INPUT_MARGIN,
    lineHeight: INPUT_HEIGHTS.LINE_HEIGHT_CONTENT,
    minHeight: INPUT_HEIGHTS.CONTENT_MIN_HEIGHT,
    maxHeight: INPUT_HEIGHTS.CONTENT_MAX_HEIGHT,
  },
  contentInputFocused: {
    // 正文聚焦时的样式
  },
  contentInputError: {
    // 正文错误时的样式
  },
  contentBottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: EDITOR_SPACING.COUNTER_MARGIN,
    minHeight: 16,
  },
  contentCounter: {
    marginLeft: 'auto',
  },
  
  // 通用样式
  inputDisabled: {
    opacity: 0.5,
    backgroundColor: '#F5F5F5',
  },
  characterCounter: {
    fontSize: EDITOR_FONTS.COUNTER_SIZE,
    fontWeight: EDITOR_FONTS.COUNTER_WEIGHT,
  },
  errorText: {
    fontSize: EDITOR_FONTS.COUNTER_SIZE,
    color: EDITOR_COLORS.ERROR_TEXT,
    flex: 1,
  },
});
// #endregion

// #region 9. Exports
export default ContentEditorArea;
export type { ContentEditorAreaProps };
// #endregion
