// #region 1. File Banner & TOC
/**
 * 发布控制区域组件 - 发布按钮和进度控制
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
import React, { useCallback, useMemo } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Animated,
} from 'react-native';

// 类型和常量导入
import type { PublishControlAreaProps } from './types';
import {
  CONTROL_UI,
  CONTROL_COLORS,
  CONTROL_FONTS,
  BUTTON_TEXTS,
  BUTTON_VARIANTS,
  BUTTON_STATES,
} from './constants';
// #endregion

// #region 3. Types & Schema
interface ButtonConfig {
  text: string;
  backgroundColor: string;
  textColor: string;
  disabled: boolean;
  loading: boolean;
}
// #endregion

// #region 4. Constants & Config
const SAFE_AREA_HEIGHT = CONTROL_UI.SAFE_AREA_BOTTOM;
const TOTAL_HEIGHT = CONTROL_UI.AREA_HEIGHT + SAFE_AREA_HEIGHT;
// #endregion

// #region 5. Utils & Helpers
const getButtonConfig = (
  isValid: boolean,
  isPublishing: boolean,
  disabled: boolean
): ButtonConfig => {
  if (disabled) {
    return {
      text: BUTTON_TEXTS.PUBLISH,
      backgroundColor: CONTROL_COLORS.PRIMARY_DISABLED_BG,
      textColor: CONTROL_COLORS.PRIMARY_DISABLED_TEXT,
      disabled: true,
      loading: false,
    };
  }

  if (isPublishing) {
    return {
      text: BUTTON_TEXTS.PUBLISHING,
      backgroundColor: CONTROL_COLORS.PRIMARY_LOADING_BG,
      textColor: CONTROL_COLORS.PRIMARY_TEXT,
      disabled: true,
      loading: true,
    };
  }

  if (!isValid) {
    return {
      text: BUTTON_TEXTS.PUBLISH,
      backgroundColor: CONTROL_COLORS.PRIMARY_DISABLED_BG,
      textColor: CONTROL_COLORS.PRIMARY_DISABLED_TEXT,
      disabled: true,
      loading: false,
    };
  }

  return {
    text: BUTTON_TEXTS.PUBLISH,
    backgroundColor: CONTROL_COLORS.PRIMARY_BG,
    textColor: CONTROL_COLORS.PRIMARY_TEXT,
    disabled: false,
    loading: false,
  };
};

const formatProgress = (progress: number): string => {
  return `${Math.round(progress)}%`;
};
// #endregion

// #region 6. State Management
const PublishControlArea: React.FC<PublishControlAreaProps> = ({
  isValid,
  isPublishing,
  publishProgress,
  onPublish,
  onCancel,
  onDraft,
  disabled = false,
  showProgress = true,
  showDraft = true,
}) => {
  // 按钮配置
  const buttonConfig = useMemo(() => 
    getButtonConfig(isValid, isPublishing, disabled),
    [isValid, isPublishing, disabled]
  );
// #endregion

// #region 7. Domain Logic
  // 发布按钮处理
  const handlePublish = useCallback(() => {
    if (buttonConfig.disabled) return;
    onPublish();
  }, [buttonConfig.disabled, onPublish]);

  // 取消按钮处理
  const handleCancel = useCallback(() => {
    if (isPublishing) return; // 发布中不允许取消
    onCancel();
  }, [isPublishing, onCancel]);

  // 草稿按钮处理
  const handleDraft = useCallback(() => {
    if (isPublishing) return; // 发布中不允许保存草稿
    onDraft();
  }, [isPublishing, onDraft]);
// #endregion

// #region 8. UI Components & Rendering
  // 进度条组件
  const ProgressBar: React.FC<{ progress: number }> = ({ progress }) => (
    <View style={styles.progressContainer}>
      <View style={styles.progressBar}>
        <View 
          style={[
            styles.progressFill,
            { width: `${Math.min(100, Math.max(0, progress))}%` }
          ]} 
        />
      </View>
      <Text style={styles.progressText}>
        {formatProgress(progress)}
      </Text>
    </View>
  );

  // 发布按钮组件
  const PublishButton: React.FC = () => (
    <TouchableOpacity
      style={[
        styles.publishButton,
        {
          backgroundColor: buttonConfig.backgroundColor,
          opacity: buttonConfig.disabled ? 0.6 : 1,
        },
      ]}
      onPress={handlePublish}
      disabled={buttonConfig.disabled}
      activeOpacity={0.8}
    >
      <View style={styles.buttonContent}>
        {buttonConfig.loading && (
          <ActivityIndicator
            size="small"
            color={buttonConfig.textColor}
            style={styles.buttonLoader}
          />
        )}
        <Text style={[
          styles.publishButtonText,
          { color: buttonConfig.textColor }
        ]}>
          {buttonConfig.text}
        </Text>
      </View>
    </TouchableOpacity>
  );

  // 辅助按钮组件
  const SecondaryButtons: React.FC = () => (
    <View style={styles.secondaryButtons}>
      {showDraft && (
        <TouchableOpacity
          style={styles.secondaryButton}
          onPress={handleDraft}
          disabled={isPublishing}
          activeOpacity={0.7}
        >
          <Text style={[
            styles.secondaryButtonText,
            isPublishing && styles.secondaryButtonTextDisabled,
          ]}>
            {BUTTON_TEXTS.DRAFT}
          </Text>
        </TouchableOpacity>
      )}
      
      <TouchableOpacity
        style={styles.secondaryButton}
        onPress={handleCancel}
        disabled={isPublishing}
        activeOpacity={0.7}
      >
        <Text style={[
          styles.secondaryButtonText,
          isPublishing && styles.secondaryButtonTextDisabled,
        ]}>
          {BUTTON_TEXTS.CANCEL}
        </Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* 进度条 */}
      {showProgress && isPublishing && (
        <ProgressBar progress={publishProgress} />
      )}
      
      {/* 控制区域 */}
      <View style={styles.controlArea}>
        {/* 辅助按钮 */}
        <SecondaryButtons />
        
        {/* 发布按钮 */}
        <PublishButton />
      </View>
      
      {/* 安全区域 */}
      <View style={styles.safeArea} />
    </View>
  );
};

// 样式定义
const styles = StyleSheet.create({
  container: {
    backgroundColor: CONTROL_COLORS.BACKGROUND,
    borderTopWidth: 1,
    borderTopColor: CONTROL_COLORS.BORDER,
  },
  
  // 进度条
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: CONTROL_UI.CONTAINER_PADDING_HORIZONTAL,
    paddingTop: 8,
    paddingBottom: 4,
  },
  progressBar: {
    flex: 1,
    height: CONTROL_UI.PROGRESS_HEIGHT,
    backgroundColor: CONTROL_COLORS.PROGRESS_BG,
    borderRadius: CONTROL_UI.PROGRESS_HEIGHT / 2,
    overflow: 'hidden',
    marginRight: 8,
  },
  progressFill: {
    height: '100%',
    backgroundColor: CONTROL_COLORS.PROGRESS_FILL,
    borderRadius: CONTROL_UI.PROGRESS_HEIGHT / 2,
  },
  progressText: {
    fontSize: 12,
    color: CONTROL_COLORS.PROGRESS_FILL,
    fontWeight: '500',
    minWidth: 40,
    textAlign: 'right',
  },
  
  // 控制区域
  controlArea: {
    height: CONTROL_UI.AREA_HEIGHT,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: CONTROL_UI.CONTAINER_PADDING_HORIZONTAL,
    paddingVertical: CONTROL_UI.CONTAINER_PADDING_VERTICAL,
  },
  
  // 发布按钮
  publishButton: {
    height: CONTROL_UI.BUTTON_HEIGHT,
    borderRadius: CONTROL_UI.BUTTON_BORDER_RADIUS,
    paddingHorizontal: 32,
    justifyContent: 'center',
    alignItems: 'center',
    minWidth: CONTROL_UI.BUTTON_MIN_WIDTH,
    shadowColor: CONTROL_COLORS.SHADOW,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  buttonLoader: {
    marginRight: 8,
  },
  publishButtonText: {
    fontSize: CONTROL_FONTS.BUTTON_SIZE,
    fontWeight: CONTROL_FONTS.BUTTON_WEIGHT,
  },
  
  // 辅助按钮
  secondaryButtons: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  secondaryButton: {
    height: CONTROL_UI.BUTTON_HEIGHT,
    paddingHorizontal: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: CONTROL_UI.BUTTON_SPACING,
  },
  secondaryButtonText: {
    fontSize: CONTROL_FONTS.SECONDARY_BUTTON_SIZE,
    fontWeight: CONTROL_FONTS.SECONDARY_BUTTON_WEIGHT,
    color: CONTROL_COLORS.SECONDARY_TEXT,
  },
  secondaryButtonTextDisabled: {
    color: CONTROL_COLORS.SECONDARY_DISABLED_TEXT,
  },
  
  // 安全区域
  safeArea: {
    height: SAFE_AREA_HEIGHT,
    backgroundColor: CONTROL_COLORS.BACKGROUND,
  },
});
// #endregion

// #region 9. Exports
export default PublishControlArea;
export type { PublishControlAreaProps };
// #endregion
