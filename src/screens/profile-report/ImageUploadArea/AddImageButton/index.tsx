// #region 1. File Banner & TOC
/**
 * 添加图片按钮组件 - 触发图片选择的虚线边框按钮
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
import { REPORT_CONSTANTS } from '../../constants';
// #endregion

// #region 3. Types & Schema
interface AddImageButtonProps {
  onPress: () => void;
  disabled?: boolean;
  style?: any;
}
// #endregion

// #region 4. Constants & Config
const BUTTON_CONFIG = {
  size: 120,
  borderRadius: 12,
  borderWidth: 2,
  iconSize: 32,
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
export const AddImageButton: React.FC<AddImageButtonProps> = React.memo(({
  onPress,
  disabled = false,
  style,
}) => {
  return (
    <TouchableOpacity
      style={[
        styles.button,
        disabled && styles.buttonDisabled,
        style,
      ]}
      onPress={onPress}
      disabled={disabled}
      activeOpacity={0.7}
      accessible={true}
      accessibilityRole="button"
      accessibilityLabel="添加图片"
      accessibilityHint="点击选择图片上传"
    >
      <Text style={[
        styles.icon,
        disabled && styles.iconDisabled,
      ]}>
        +
      </Text>
    </TouchableOpacity>
  );
});

const styles = StyleSheet.create({
  button: {
    width: BUTTON_CONFIG.size,
    height: BUTTON_CONFIG.size,
    borderRadius: BUTTON_CONFIG.borderRadius,
    borderWidth: BUTTON_CONFIG.borderWidth,
    borderColor: REPORT_CONSTANTS.COLORS.border.default,
    borderStyle: 'dashed',
    backgroundColor: 'transparent',
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  icon: {
    fontSize: BUTTON_CONFIG.iconSize,
    color: REPORT_CONSTANTS.COLORS.text.disabled,
    fontWeight: '300',
    lineHeight: BUTTON_CONFIG.iconSize + 4,
    textAlign: 'center',
  },
  iconDisabled: {
    opacity: 0.5,
  },
});
// #endregion

// #region 9. Exports
export default AddImageButton;
// #endregion
