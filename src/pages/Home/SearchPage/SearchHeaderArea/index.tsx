/**
 * SearchHeaderArea - 搜索页面头部区域组件
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
import {
  View,
  TouchableOpacity,
  Text,
  StyleSheet,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

// 内部模块导入
import { COLORS, SPACING, FONTS } from '../constants';
// #endregion

// #region 2. Types & Schema
interface SearchHeaderAreaProps {
  onBackPress: () => void;
  showBackButton?: boolean;
  title?: string;
}
// #endregion

// #region 3. Constants & Config
const HEADER_CONFIG = {
  height: 56,
  backButtonSize: 40,
  titleFontSize: 18,
} as const;
// #endregion

// #region 4. Utils & Helpers
// 本地工具函数
// #endregion

// #region 5. State Management
// 状态管理逻辑
// #endregion

// #region 6. Domain Logic
// 业务逻辑处理
// #endregion

// #region 7. UI Components & Rendering
/**
 * SearchHeaderArea 组件 - 搜索页面头部区域
 * 包含返回按钮和页面标题
 */
const SearchHeaderArea: React.FC<SearchHeaderAreaProps> = ({ 
  onBackPress, 
  showBackButton = true, 
  title = "搜索" 
}) => {
  const safeAreaInsets = useSafeAreaInsets();

  return (
    <View style={[
      styles.container,
      { paddingTop: safeAreaInsets.top + SPACING.md }
    ]}>
      {/* 返回按钮 */}
      {showBackButton && (
        <TouchableOpacity
          style={styles.backButton}
          onPress={onBackPress}
          activeOpacity={0.7}
        >
          <Text style={styles.backButtonText}>←</Text>
        </TouchableOpacity>
      )}
      
      {/* 页面标题 */}
      <View style={styles.titleContainer}>
        <Text style={styles.titleText}>{title}</Text>
      </View>
      
      {/* 右侧占位 */}
      <View style={styles.rightSpace} />
    </View>
  );
};
// #endregion

// #region 8. Styles
const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SPACING.lg,
    paddingBottom: SPACING.md,
    backgroundColor: COLORS.white,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.borderLight,
    height: HEADER_CONFIG.height,
  },
  backButton: {
    width: HEADER_CONFIG.backButtonSize,
    height: HEADER_CONFIG.backButtonSize,
    alignItems: 'center',
    justifyContent: 'center',
  },
  backButtonText: {
    fontSize: 24,
    color: COLORS.textPrimary,
    fontWeight: FONTS.weight.medium,
  },
  titleContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  titleText: {
    fontSize: HEADER_CONFIG.titleFontSize,
    fontWeight: FONTS.weight.semiBold,
    color: COLORS.textPrimary,
  },
  rightSpace: {
    width: HEADER_CONFIG.backButtonSize,
  },
});
// #endregion

// #region 9. Exports
export default SearchHeaderArea;
export type { SearchHeaderAreaProps };
// #endregion
