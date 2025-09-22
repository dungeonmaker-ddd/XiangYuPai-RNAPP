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
 * NavigationBar - 导航栏功能区域
 * 处理复杂的导航逻辑，包括返回按钮交互和页面标题显示
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
import { COLORS, FONT_SIZE, SPACING } from '../../constants';
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
  onBackPress,
}) => {
  // 使用本地状态管理
  const { navigationState } = useNavigation();
  
  // 处理返回按钮点击
  const handleBackPress = () => {
    onNavigate.handleBackPress(onBackPress, navigationState);
  };

  // 格式化标题
  const formattedTitle = utilsNavigation.formatTitle(title);

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.backButton}
        onPress={handleBackPress}
        activeOpacity={0.7}
        hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
      >
        <Text style={styles.backIcon}>{NAVIGATION_CONSTANTS.BACK_ICON}</Text>
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
  backButton: {
    padding: SPACING.SM,
    marginRight: SPACING.SM,
  },
  backIcon: {
    fontSize: FONT_SIZE.LG,
    color: COLORS.TEXT_PRIMARY,
    fontWeight: '600',
  },
  title: {
    flex: 1,
    fontSize: FONT_SIZE.LG,
    fontWeight: 'bold',
    color: COLORS.TEXT_PRIMARY,
    textAlign: 'center',
  },
  placeholder: {
    width: 40, // 与返回按钮宽度保持一致
  },
});
// #endregion

// #region 9. Exports
export default NavigationBar;
// #endregion
