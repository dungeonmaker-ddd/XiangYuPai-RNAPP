/**
 * ✅ 活动类型选择区域组件
 * 提供6种活动类型的图标化选择功能
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
 * TypeSelectionArea - 活动类型选择区域
 * 
 * TOC (快速跳转):
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
// #endregion

// #region 2. Imports
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

// 导入子功能区域
import { TypeGrid } from './TypeGrid';
import { TypeValidation } from './TypeValidation';

// 导入类型和常量
import type { TypeSelectionAreaProps } from './types';
import { TYPE_SELECTION_CONSTANTS } from './constants';
import { COLORS, SPACING, FONT_SIZE, FONT_WEIGHT } from '../constants';
// #endregion

// #region 3. Types & Schema
// Props接口定义在 types.ts 中
// #endregion

// #region 4. Constants & Config
// 本地常量在 constants.ts 中定义
// #endregion

// #region 5. Utils & Helpers
// 本地工具函数（如果需要）
// #endregion

// #region 6. State Management
// 状态管理由父组件传递
// #endregion

// #region 7. Domain Logic
// 业务逻辑函数（如果需要）
// #endregion

// #region 8. UI Components & Rendering
export const TypeSelectionArea: React.FC<TypeSelectionAreaProps> = ({
  selectedType,
  onTypeSelect,
  validation,
}) => {
  return (
    <View style={styles.container}>
      {/* 标题区域 */}
      <View style={styles.header}>
        <Text style={styles.title}>类型</Text>
        <Text style={styles.requiredMark}>* 必选</Text>
      </View>

      {/* 副标题 */}
      <Text style={styles.subtitle}>选择活动类型</Text>

      {/* 类型网格 */}
      <TypeGrid
        selectedType={selectedType}
        onTypeSelect={onTypeSelect}
      />

      {/* 验证信息 */}
      <TypeValidation validation={validation} />
    </View>
  );
};

// 样式定义
const styles = StyleSheet.create({
  container: {
    paddingHorizontal: SPACING.MD,
    paddingVertical: SPACING.LG,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.SM,
  },
  title: {
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
  subtitle: {
    fontSize: FONT_SIZE.MD,
    color: COLORS.TEXT_SECONDARY,
    marginBottom: SPACING.LG,
  },
});
// #endregion

// #region 9. Exports
export default TypeSelectionArea;
export type { TypeSelectionAreaProps } from './types';
// #endregion
