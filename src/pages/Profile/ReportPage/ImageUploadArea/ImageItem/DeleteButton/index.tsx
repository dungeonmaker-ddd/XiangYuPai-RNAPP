// #region 1. File Banner & TOC
/**
 * 删除按钮组件 - 图片删除操作按钮
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
import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
} from 'react-native';

// 内部导入
import { REPORT_CONSTANTS } from '../../../constants';
// #endregion

// #region 3. Types & Schema
interface DeleteButtonProps {
  onPress: () => void;
  style?: any;
  accessibilityLabel?: string;
}
// #endregion

// #region 4. Constants & Config
const BUTTON_CONFIG = {
  size: 20,
  borderRadius: 10,
  iconSize: 14,
} as const;
// #endregion

// #region 5. Utils & Helpers
// 无复杂工具函数需求
// #endregion

// #region 6. State Management
// 无状态管理需求
// #endregion

// #region 7. Domain Logic
// 无复杂业务逻辑
// #endregion

// #region 8. UI Components & Rendering
export const DeleteButton: React.FC<DeleteButtonProps> = React.memo(({
  onPress,
  style,
  accessibilityLabel = '删除图片',
}) => {
  return (
    <TouchableOpacity
      style={[styles.button, style]}
      onPress={onPress}
      hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
      activeOpacity={0.8}
      accessible={true}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
    >
      <Text style={styles.icon}>×</Text>
    </TouchableOpacity>
  );
});

const styles = StyleSheet.create({
  button: {
    width: BUTTON_CONFIG.size,
    height: BUTTON_CONFIG.size,
    borderRadius: BUTTON_CONFIG.borderRadius,
    backgroundColor: REPORT_CONSTANTS.COLORS.error,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: REPORT_CONSTANTS.COLORS.text.primary,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 3,
  },
  icon: {
    fontSize: BUTTON_CONFIG.iconSize,
    color: REPORT_CONSTANTS.COLORS.background.primary,
    fontWeight: 'bold',
    lineHeight: BUTTON_CONFIG.iconSize + 2,
    textAlign: 'center',
  },
});
// #endregion

// #region 9. Exports
export default DeleteButton;
// #endregion
