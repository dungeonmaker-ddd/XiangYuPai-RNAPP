/**
 * 🎯 发布表单组件
 * 
 * 功能：
 * - 标题输入框（字数统计）
 * - 正文多行输入框（自适应高度）
 * - 系数项配置（可选）
 * - 实时验证反馈
 */

import React, { useCallback, useRef, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Animated,
} from 'react-native';

import {
  PublishFormProps,
  TitleInputState,
  ContentInputState,
  ParameterConfig,
} from '../types';
import {
  COLORS,
  SPACING,
  BORDER_RADIUS,
  FONT_SIZE,
  FONT_WEIGHT,
  FORM_CONFIG,
  TEXTS,
} from '../constants';

// ══════════════════════════════════════════════════════════════
// 1. 子组件：标题输入框
// ══════════════════════════════════════════════════════════════

interface TitleInputProps {
  state: TitleInputState;
  onTextChange: (text: string) => void;
}

const TitleInput: React.FC<TitleInputProps> = ({ state, onTextChange }) => {
  const [isFocused, setIsFocused] = useState(false);
  const borderColorAnim = useRef(new Animated.Value(0)).current;

  const handleFocus = useCallback(() => {
    setIsFocused(true);
    Animated.timing(borderColorAnim, {
      toValue: 1,
      duration: 200,
      useNativeDriver: false,
    }).start();
  }, [borderColorAnim]);

  const handleBlur = useCallback(() => {
    setIsFocused(false);
    Animated.timing(borderColorAnim, {
      toValue: 0,
      duration: 200,
      useNativeDriver: false,
    }).start();
  }, [borderColorAnim]);

  const borderColor = borderColorAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [COLORS.BORDER, COLORS.BORDER_FOCUS],
  });

  // 字数统计颜色
  const getCountColor = () => {
    const ratio = state.characterCount / state.maxLength;
    if (ratio >= 1) return COLORS.ERROR;
    if (ratio >= 0.8) return COLORS.WARNING;
    return COLORS.TEXT_SECONDARY;
  };

  return (
    <View style={styles.inputSection}>
      {/* 标题标签 */}
      <View style={styles.labelContainer}>
        <Text style={styles.label}>
          {TEXTS.FORM.TITLE_LABEL}
        </Text>
        <Text style={styles.requiredMark}>
          {TEXTS.FORM.TITLE_REQUIRED}
        </Text>
      </View>

      {/* 输入框容器 */}
      <Animated.View style={[styles.inputContainer, { borderColor }]}>
        <TextInput
          style={styles.titleInput}
          placeholder={FORM_CONFIG.TITLE.PLACEHOLDER}
          placeholderTextColor={COLORS.TEXT_PLACEHOLDER}
          value={state.value}
          onChangeText={onTextChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          maxLength={state.maxLength}
          returnKeyType="next"
          autoCapitalize="sentences"
          autoCorrect={false}
        />
      </Animated.View>

      {/* 字数统计和错误信息 */}
      <View style={styles.inputFooter}>
        {state.validation.error ? (
          <Text style={styles.errorText}>
            {state.validation.error}
          </Text>
        ) : null}
        
        <Text style={[styles.characterCount, { color: getCountColor() }]}>
          {state.characterCount}/{state.maxLength}
        </Text>
      </View>
    </View>
  );
};

// ══════════════════════════════════════════════════════════════
// 2. 子组件：正文输入框
// ══════════════════════════════════════════════════════════════

interface ContentInputProps {
  state: ContentInputState;
  onTextChange: (text: string) => void;
}

const ContentInput: React.FC<ContentInputProps> = ({ state, onTextChange }) => {
  const [isFocused, setIsFocused] = useState(false);
  const [inputHeight, setInputHeight] = useState(FORM_CONFIG.CONTENT.MIN_HEIGHT);
  const borderColorAnim = useRef(new Animated.Value(0)).current;

  const handleFocus = useCallback(() => {
    setIsFocused(true);
    Animated.timing(borderColorAnim, {
      toValue: 1,
      duration: 200,
      useNativeDriver: false,
    }).start();
  }, [borderColorAnim]);

  const handleBlur = useCallback(() => {
    setIsFocused(false);
    Animated.timing(borderColorAnim, {
      toValue: 0,
      duration: 200,
      useNativeDriver: false,
    }).start();
  }, [borderColorAnim]);

  const handleContentSizeChange = useCallback((event: any) => {
    const { height } = event.nativeEvent.contentSize;
    const newHeight = Math.max(
      FORM_CONFIG.CONTENT.MIN_HEIGHT,
      Math.min(height + 20, FORM_CONFIG.CONTENT.MAX_HEIGHT)
    );
    setInputHeight(newHeight);
  }, []);

  const borderColor = borderColorAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [COLORS.BORDER, COLORS.BORDER_FOCUS],
  });

  // 字数统计颜色和进度条
  const getCountColor = () => {
    const ratio = state.characterCount / state.maxLength;
    if (ratio >= 1) return COLORS.ERROR;
    if (ratio >= 0.8) return COLORS.WARNING;
    return COLORS.TEXT_SECONDARY;
  };

  const getProgressWidth = () => {
    return Math.min((state.characterCount / state.maxLength) * 100, 100);
  };

  return (
    <View style={styles.inputSection}>
      {/* 标题标签 */}
      <View style={styles.labelContainer}>
        <Text style={styles.label}>
          {TEXTS.FORM.CONTENT_LABEL}
        </Text>
        <Text style={styles.requiredMark}>
          {TEXTS.FORM.CONTENT_REQUIRED}
        </Text>
      </View>

      {/* 输入框容器 */}
      <Animated.View style={[styles.inputContainer, { borderColor }]}>
        <TextInput
          style={[styles.contentInput, { height: inputHeight }]}
          placeholder={FORM_CONFIG.CONTENT.PLACEHOLDER}
          placeholderTextColor={COLORS.TEXT_PLACEHOLDER}
          value={state.value}
          onChangeText={onTextChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          onContentSizeChange={handleContentSizeChange}
          maxLength={state.maxLength}
          multiline={true}
          textAlignVertical="top"
          autoCapitalize="sentences"
          autoCorrect={true}
        />
      </Animated.View>

      {/* 字数统计、进度条和错误信息 */}
      <View style={styles.inputFooter}>
        <View style={styles.contentFooterLeft}>
          {state.validation.error ? (
            <Text style={styles.errorText}>
              {state.validation.error}
            </Text>
          ) : null}
          
          {/* 进度条 */}
          <View style={styles.progressBarContainer}>
            <View style={styles.progressBarBackground}>
              <View
                style={[
                  styles.progressBar,
                  {
                    width: `${getProgressWidth()}%`,
                    backgroundColor: getCountColor(),
                  },
                ]}
              />
            </View>
          </View>
        </View>
        
        <Text style={[styles.characterCount, { color: getCountColor() }]}>
          {state.characterCount}/{state.maxLength}
        </Text>
      </View>
    </View>
  );
};

// ══════════════════════════════════════════════════════════════
// 3. 子组件：系数项配置
// ══════════════════════════════════════════════════════════════

interface ParameterInputProps {
  parameters: ParameterConfig;
  onParametersChange: (params: ParameterConfig) => void;
}

const ParameterInput: React.FC<ParameterInputProps> = ({
  parameters,
  onParametersChange,
}) => {
  const handleParameterPress = useCallback(() => {
    // 这里可以打开参数配置弹窗或页面
    // 暂时使用简单的示例
    console.log('打开参数配置');
  }, []);

  const hasParameters = Object.keys(parameters).length > 0;

  return (
    <View style={styles.inputSection}>
      {/* 标题标签 */}
      <View style={styles.labelContainer}>
        <Text style={styles.label}>
          {TEXTS.FORM.PARAMETERS_LABEL}
        </Text>
        <Text style={styles.optionalMark}>
          {TEXTS.FORM.PARAMETERS_HINT}
        </Text>
      </View>

      {/* 参数配置按钮 */}
      <TouchableOpacity
        style={[
          styles.parameterButton,
          hasParameters && styles.parameterButtonActive,
        ]}
        onPress={handleParameterPress}
        activeOpacity={0.7}
      >
        <Text
          style={[
            styles.parameterButtonText,
            hasParameters && styles.parameterButtonTextActive,
          ]}
        >
          {hasParameters
            ? `已设置 ${Object.keys(parameters).length} 个参数`
            : FORM_CONFIG.PARAMETERS.PLACEHOLDER
          }
        </Text>
        <Text style={styles.parameterButtonIcon}>⚙️</Text>
      </TouchableOpacity>

      {/* 参数预览 */}
      {hasParameters && (
        <View style={styles.parameterPreview}>
          <Text style={styles.parameterPreviewTitle}>参数预览:</Text>
          {Object.entries(parameters).map(([key, value]) => (
            <Text key={key} style={styles.parameterPreviewItem}>
              • {key}: {String(value)}
            </Text>
          ))}
        </View>
      )}
    </View>
  );
};

// ══════════════════════════════════════════════════════════════
// 4. 主组件：发布表单
// ══════════════════════════════════════════════════════════════

const PublishForm: React.FC<PublishFormProps> = ({
  title,
  content,
  parameters,
  onTitleChange,
  onContentChange,
  onParametersChange,
}) => {
  return (
    <View style={styles.container}>
      {/* 标题输入 */}
      <TitleInput
        state={title}
        onTextChange={onTitleChange}
      />

      {/* 正文输入 */}
      <ContentInput
        state={content}
        onTextChange={onContentChange}
      />

      {/* 系数项配置 */}
      <ParameterInput
        parameters={parameters}
        onParametersChange={onParametersChange}
      />
    </View>
  );
};

// ══════════════════════════════════════════════════════════════
// 5. 样式定义
// ══════════════════════════════════════════════════════════════

const styles = StyleSheet.create({
  // 容器样式
  container: {
    paddingHorizontal: SPACING.MD,
  },

  // 输入区域
  inputSection: {
    marginBottom: SPACING.LG,
  },

  // 标签容器
  labelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.SM,
  },

  label: {
    fontSize: FONT_SIZE.LG,
    fontWeight: FONT_WEIGHT.SEMIBOLD,
    color: COLORS.TEXT_PRIMARY,
    marginRight: SPACING.SM,
  },

  requiredMark: {
    fontSize: FONT_SIZE.SM,
    color: COLORS.ERROR,
    fontWeight: FONT_WEIGHT.MEDIUM,
  },

  optionalMark: {
    fontSize: FONT_SIZE.SM,
    color: COLORS.TEXT_SECONDARY,
    fontWeight: FONT_WEIGHT.MEDIUM,
  },

  // 输入框容器
  inputContainer: {
    borderWidth: 1,
    borderRadius: BORDER_RADIUS.MD,
    backgroundColor: COLORS.WHITE,
    paddingHorizontal: SPACING.MD,
    paddingVertical: SPACING.SM,
  },

  // 标题输入框
  titleInput: {
    fontSize: FONT_SIZE.MD,
    color: COLORS.TEXT_PRIMARY,
    padding: 0,
    margin: 0,
    minHeight: 24,
  },

  // 正文输入框
  contentInput: {
    fontSize: FONT_SIZE.MD,
    color: COLORS.TEXT_PRIMARY,
    padding: 0,
    margin: 0,
    textAlignVertical: 'top',
  },

  // 输入框底部
  inputFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    marginTop: SPACING.SM,
  },

  contentFooterLeft: {
    flex: 1,
    marginRight: SPACING.MD,
  },

  // 字数统计
  characterCount: {
    fontSize: FONT_SIZE.SM,
    fontWeight: FONT_WEIGHT.MEDIUM,
  },

  // 进度条
  progressBarContainer: {
    marginTop: SPACING.XS,
  },

  progressBarBackground: {
    height: 2,
    backgroundColor: COLORS.GRAY_200,
    borderRadius: 1,
    overflow: 'hidden',
  },

  progressBar: {
    height: '100%',
    borderRadius: 1,
  },

  // 错误信息
  errorText: {
    fontSize: FONT_SIZE.SM,
    color: COLORS.ERROR,
    marginBottom: SPACING.XS,
  },

  // 参数配置按钮
  parameterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.MD,
    paddingVertical: SPACING.LG,
    borderWidth: 1,
    borderColor: COLORS.BORDER,
    borderRadius: BORDER_RADIUS.MD,
    backgroundColor: COLORS.GRAY_50,
  },

  parameterButtonActive: {
    borderColor: COLORS.PRIMARY,
    backgroundColor: COLORS.PRIMARY + '10',
  },

  parameterButtonText: {
    fontSize: FONT_SIZE.MD,
    color: COLORS.TEXT_SECONDARY,
    flex: 1,
  },

  parameterButtonTextActive: {
    color: COLORS.PRIMARY,
    fontWeight: FONT_WEIGHT.MEDIUM,
  },

  parameterButtonIcon: {
    fontSize: FONT_SIZE.LG,
    marginLeft: SPACING.SM,
  },

  // 参数预览
  parameterPreview: {
    marginTop: SPACING.SM,
    padding: SPACING.MD,
    backgroundColor: COLORS.GRAY_50,
    borderRadius: BORDER_RADIUS.SM,
    borderLeftWidth: 3,
    borderLeftColor: COLORS.PRIMARY,
  },

  parameterPreviewTitle: {
    fontSize: FONT_SIZE.SM,
    fontWeight: FONT_WEIGHT.SEMIBOLD,
    color: COLORS.TEXT_PRIMARY,
    marginBottom: SPACING.XS,
  },

  parameterPreviewItem: {
    fontSize: FONT_SIZE.SM,
    color: COLORS.TEXT_SECONDARY,
    marginBottom: 2,
  },
});

export default PublishForm;
