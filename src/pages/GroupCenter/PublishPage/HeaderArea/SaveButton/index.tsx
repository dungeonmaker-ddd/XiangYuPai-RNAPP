/**
 * 🟢 保存按钮功能区域 - 扁平实现
 * 
 * TOC (quick jump):
 * [1] File Banner & TOC
 * [2] Imports
 * [3] Types & Schema
 * [4] Constants & Config
 * [5] Utils & Helpers
 * [6] State Management
 * [7] Domain Logic
 * [8] UI Components & Rendering
 * [9] Exports
 */

// #region 1. File Banner & TOC
/**
 * SaveButton - 保存按钮功能区域
 * 简单的保存按钮实现，包含基本的点击交互和加载状态
 */
// #endregion

// #region 2. Imports
import React from 'react';
import { Text, TouchableOpacity, ActivityIndicator, StyleSheet } from 'react-native';

// 导入工具函数
import { utilsButton } from './utilsButton';

// 导入类型和常量
import type { SaveButtonProps } from '../types';
import { SAVE_CONSTANTS } from './constants';
import { COLORS, FONT_SIZE, SPACING, FONT_WEIGHT } from '../../constants';
// #endregion

// #region 3. Types & Schema
// Props接口定义在父级 types.ts 中
// #endregion

// #region 4. Constants & Config
// 常量定义在 constants.ts 中
// #endregion

// #region 5. Utils & Helpers
// 工具函数在 utilsButton.ts 中定义
// #endregion

// #region 6. State Management
// 简单组件无需复杂状态管理
// #endregion

// #region 7. Domain Logic
// 简单的点击处理逻辑
// #endregion

// #region 8. UI Components & Rendering
export const SaveButton: React.FC<SaveButtonProps> = ({
  onPress,
  loading = false,
  disabled = false,
}) => {
  // 处理按钮点击
  const handlePress = () => {
    if (disabled || loading) return;
    onPress();
  };

  // 获取按钮样式
  const buttonStyle = utilsButton.getButtonStyle(disabled, loading);
  const textStyle = utilsButton.getTextStyle(disabled, loading);

  return (
    <TouchableOpacity
      style={[styles.button, buttonStyle]}
      onPress={handlePress}
      activeOpacity={disabled || loading ? 1 : 0.7}
      disabled={disabled || loading}
    >
      {loading ? (
        <ActivityIndicator 
          size="small" 
          color={COLORS.PRIMARY} 
          style={styles.loadingIndicator}
        />
      ) : (
        <Text style={[styles.text, textStyle]}>
          {SAVE_CONSTANTS.BUTTON_TEXT}
        </Text>
      )}
    </TouchableOpacity>
  );
};

// 样式定义
const styles = StyleSheet.create({
  button: {
    paddingHorizontal: SPACING.SM,
    paddingVertical: SPACING.XS,
    minWidth: SAVE_CONSTANTS.MIN_WIDTH,
    height: SAVE_CONSTANTS.BUTTON_HEIGHT,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontSize: FONT_SIZE.MD,
    color: COLORS.PRIMARY,
    fontWeight: FONT_WEIGHT.MEDIUM,
  },
  loadingIndicator: {
    // 加载指示器样式
  },
});
// #endregion

// #region 9. Exports
export default SaveButton;
// #endregion
