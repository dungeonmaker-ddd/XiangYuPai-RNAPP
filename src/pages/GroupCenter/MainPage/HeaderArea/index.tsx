/**
 * ✅ 头部导航区域组件
 * 负责页面头部导航栏和发布按钮的展示和交互
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
 * HeaderArea - 头部导航区域
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
import { PublishButton } from './PublishButton';

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
// 状态管理（如果需要本地状态）
// #endregion

// #region 7. Domain Logic
// 业务逻辑函数（如果需要）
// #endregion

// #region 8. UI Components & Rendering
export const HeaderArea: React.FC<HeaderAreaProps> = ({
  title,
  onBackPress,
  onPublishPress,
  showPublishButton = true,
}) => {
  const safeAreaInsets = useSafeAreaInsets();

  return (
    <View style={[styles.container, { paddingTop: safeAreaInsets.top }]}>
      <View style={styles.content}>
        <NavigationBar 
          title={title}
          onBackPress={onBackPress}
        />
        {showPublishButton && (
          <PublishButton onPress={onPublishPress} />
        )}
      </View>
    </View>
  );
};

// 样式定义
const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.CARD_BACKGROUND,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.BORDER_LIGHT,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.LG,
    paddingBottom: SPACING.MD,
    minHeight: HEADER_CONSTANTS.MIN_HEIGHT,
  },
});
// #endregion

// #region 9. Exports
export default HeaderArea;
export type { HeaderAreaProps } from './types';
// #endregion
