/**
 * ✅ 头部导航区域组件
 * 负责发布页面头部导航栏（取消/标题/保存）的展示和交互
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
 * HeaderArea - 发布页面头部导航区域
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
import { View, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

// 导入子功能区域
import { NavigationBar } from './NavigationBar';
import { SaveButton } from './SaveButton';

// 导入类型和常量
import type { HeaderAreaProps } from './types';
import { HEADER_CONSTANTS } from './constants';
import { COLORS, SPACING } from '../constants';
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
export const HeaderArea: React.FC<HeaderAreaProps> = ({
  title,
  onCancelPress,
  onSavePress,
  showSaveButton = true,
  isDraftSaving = false,
}) => {
  const safeAreaInsets = useSafeAreaInsets();

  return (
    <View style={[styles.container, { paddingTop: safeAreaInsets.top }]}>
      <View style={styles.content}>
        <NavigationBar 
          title={title}
          onCancelPress={onCancelPress}
        />
        {showSaveButton && (
          <SaveButton 
            onPress={onSavePress}
            loading={isDraftSaving}
          />
        )}
      </View>
    </View>
  );
};

// 样式定义
const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.WHITE,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.BORDER,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.MD,
    paddingVertical: SPACING.MD,
    minHeight: HEADER_CONSTANTS.MIN_HEIGHT,
  },
});
// #endregion

// #region 9. Exports
export default HeaderArea;
export type { HeaderAreaProps } from './types';
// #endregion
