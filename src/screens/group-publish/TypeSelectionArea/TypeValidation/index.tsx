/**
 * 🟢 类型验证功能区域 - 扁平实现
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
 * TypeValidation - 类型验证功能区域
 * 简单的验证信息展示，包含错误和警告提示
 */
// #endregion

// #region 2. Imports
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

// 导入工具函数
import { utilsValidation } from './utilsValidation';

// 导入类型和常量
import type { TypeValidationProps } from '../types';
import { COLORS, FONT_SIZE, SPACING } from '../../constants';
// #endregion

// #region 3. Types & Schema
// Props接口定义在父级 types.ts 中
// #endregion

// #region 4. Constants & Config
// 常量定义（如果需要）
// #endregion

// #region 5. Utils & Helpers
// 工具函数在 utilsValidation.ts 中定义
// #endregion

// #region 6. State Management
// 简单组件无需复杂状态管理
// #endregion

// #region 7. Domain Logic
// 简单的验证显示逻辑
// #endregion

// #region 8. UI Components & Rendering
export const TypeValidation: React.FC<TypeValidationProps> = ({
  validation,
}) => {
  if (!validation) return null;

  // 使用工具函数获取验证样式
  const validationStyle = utilsValidation.getValidationStyle(validation);
  const validationText = utilsValidation.getValidationText(validation);

  if (!validationText) return null;

  return (
    <View style={styles.container}>
      <Text style={[styles.validationText, validationStyle]}>
        {validationText}
      </Text>
    </View>
  );
};

// 样式定义
const styles = StyleSheet.create({
  container: {
    marginTop: SPACING.SM,
    alignItems: 'center',
  },
  validationText: {
    fontSize: FONT_SIZE.SM,
    textAlign: 'center',
  },
});
// #endregion

// #region 9. Exports
export default TypeValidation;
// #endregion
