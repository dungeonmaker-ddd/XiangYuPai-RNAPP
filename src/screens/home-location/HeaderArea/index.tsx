/**
 * 地区选择模块 - 顶部导航区域
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

// #region 1. Imports
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { COLORS, FONTS, SIZES, SPACING } from '../constants';
// #endregion

// #region 2. Types & Schema
interface HeaderAreaProps {
  title?: string;
  onBackPress: () => void;
  showBackButton?: boolean;
}
// #endregion

// #region 3. Constants & Config
const DEFAULT_TITLE = '定位';
// #endregion

// #region 4. Utils & Helpers
// 此组件不需要工具函数
// #endregion

// #region 5. State Management
// 此组件不包含状态管理
// #endregion

// #region 6. Domain Logic
// 此组件的业务逻辑通过props传入
// #endregion

// #region 7. UI Components & Rendering
const HeaderArea: React.FC<HeaderAreaProps> = ({
  title = DEFAULT_TITLE,
  onBackPress,
  showBackButton = true,
}) => {
  return (
    <View style={styles.header}>
      {showBackButton ? (
        <TouchableOpacity style={styles.backButton} onPress={onBackPress}>
          <Text style={styles.backButtonText}>←</Text>
        </TouchableOpacity>
      ) : (
        <View style={styles.backButton} />
      )}
      
      <Text style={styles.headerTitle}>{title}</Text>
      
      <View style={styles.headerRight} />
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    height: SIZES.headerHeight,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SPACING.lg,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
    backgroundColor: COLORS.background,
  },
  backButton: {
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backButtonText: {
    fontSize: FONTS.size.xl,
    color: COLORS.textPrimary,
    fontWeight: '500',
  },
  headerTitle: {
    flex: 1,
    textAlign: 'center',
    fontSize: FONTS.size.lg,
    fontWeight: '600',
    color: COLORS.textPrimary,
  },
  headerRight: {
    width: 32,
  },
});
// #endregion

// #region 8. Exports
export default HeaderArea;
export type { HeaderAreaProps };
// #endregion
