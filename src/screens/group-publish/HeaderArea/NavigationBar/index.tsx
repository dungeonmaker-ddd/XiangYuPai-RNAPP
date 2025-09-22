/**
 * 🔸 导航栏功能区域 - 复杂导航逻辑嵌套实现
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
 * NavigationBar - 发布页面导航栏功能区域
 * 处理复杂的导航逻辑，包括取消按钮交互和页面标题显示
 */
// #endregion

// #region 2. Imports
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

// 导入本地模块
import { useNavigation } from './useNavigation';
import { onNavigate } from './onNavigate';
import { utilsNavigation } from './utilsNavigation';

// 导入类型和常量
import type { NavigationBarProps } from '../types';
import { NAVIGATION_CONSTANTS } from './constants';
import { COLORS, FONT_SIZE, SPACING, FONT_WEIGHT } from '../../constants';
// #endregion

// #region 3. Types & Schema
// Props接口定义在父级 types.ts 中
// #endregion

// #region 4. Constants & Config
// 常量定义在 constants.ts 中
// #endregion

// #region 5. Utils & Helpers
// 工具函数在 utilsNavigation.ts 中定义
// #endregion

// #region 6. State Management
// 状态管理在 useNavigation.ts 中定义
// #endregion

// #region 7. Domain Logic
// 事件处理在 onNavigate.ts 中定义
// #endregion

// #region 8. UI Components & Rendering
export const NavigationBar: React.FC<NavigationBarProps> = ({
  title,
  onCancelPress,
}) => {
  // 使用本地状态管理
  const { navigationState } = useNavigation();
  
  // 处理取消按钮点击
  const handleCancelPress = () => {
    onNavigate.handleCancelPress(onCancelPress, navigationState);
  };

  // 格式化标题
  const formattedTitle = utilsNavigation.formatTitle(title);

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.cancelButton}
        onPress={handleCancelPress}
        activeOpacity={0.7}
        hitSlop={NAVIGATION_CONSTANTS.HIT_SLOP}
      >
        <Text style={styles.cancelText}>{NAVIGATION_CONSTANTS.CANCEL_TEXT}</Text>
      </TouchableOpacity>
      
      <Text style={styles.title} numberOfLines={1}>
        {formattedTitle}
      </Text>
      
      {/* 占位符，保持布局平衡 */}
      <View style={styles.placeholder} />
    </View>
  );
};

// 样式定义
const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  cancelButton: {
    paddingHorizontal: SPACING.SM,
    paddingVertical: SPACING.XS,
    minWidth: 60,
  },
  cancelText: {
    fontSize: FONT_SIZE.MD,
    color: COLORS.PRIMARY,
    fontWeight: FONT_WEIGHT.MEDIUM,
  },
  title: {
    flex: 1,
    fontSize: FONT_SIZE.LG,
    fontWeight: FONT_WEIGHT.SEMIBOLD,
    color: COLORS.TEXT_PRIMARY,
    textAlign: 'center',
  },
  placeholder: {
    width: 60, // 与取消按钮宽度保持一致
  },
});
// #endregion

// #region 9. Exports
export default NavigationBar;
// #endregion
