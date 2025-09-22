// #region 1. File Banner & TOC
/**
 * 模态按钮组件 - 模态弹窗中的按钮
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
  ActivityIndicator,
} from 'react-native';

// 内部导入
import { REPORT_CONSTANTS } from '../../../constants';
// #endregion

// #region 3. Types & Schema
interface ModalButtonProps {
  text: string;
  onPress: () => void;
  type: 'primary' | 'secondary';
  disabled?: boolean;
  loading?: boolean;
  style?: any;
}
// #endregion

// #region 4. Constants & Config
const BUTTON_CONFIG = {
  height: 44,
  borderRadius: 8,
} as const;
// #endregion

// #region 5. Utils & Helpers
// 获取按钮样式
const getButtonStyles = (type: 'primary' | 'secondary', disabled: boolean) => {
  const isPrimary = type === 'primary';
  
  return {
    backgroundColor: isPrimary 
      ? REPORT_CONSTANTS.COLORS.primary 
      : 'transparent',
    borderWidth: isPrimary ? 0 : 1,
    borderColor: isPrimary 
      ? 'transparent' 
      : REPORT_CONSTANTS.COLORS.border.default,
    opacity: disabled ? 0.6 : 1,
  };
};

// 获取文字样式
const getTextStyles = (type: 'primary' | 'secondary', disabled: boolean) => {
  const isPrimary = type === 'primary';
  
  return {
    color: isPrimary 
      ? REPORT_CONSTANTS.COLORS.background.primary 
      : REPORT_CONSTANTS.COLORS.text.secondary,
    opacity: disabled ? 0.6 : 1,
  };
};
// #endregion

// #region 6. State Management
// 无状态管理需求
// #endregion

// #region 7. Domain Logic
// 无复杂业务逻辑
// #endregion

// #region 8. UI Components & Rendering
export const ModalButton: React.FC<ModalButtonProps> = React.memo(({
  text,
  onPress,
  type,
  disabled = false,
  loading = false,
  style,
}) => {
  const isPrimary = type === 'primary';
  const buttonStyles = getButtonStyles(type, disabled);
  const textStyles = getTextStyles(type, disabled);

  return (
    <TouchableOpacity
      style={[
        styles.button,
        buttonStyles,
        style,
      ]}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.8}
      accessible={true}
      accessibilityRole="button"
      accessibilityLabel={text}
      accessibilityState={{ disabled: disabled || loading }}
    >
      {loading ? (
        <ActivityIndicator
          size="small"
          color={isPrimary 
            ? REPORT_CONSTANTS.COLORS.background.primary 
            : REPORT_CONSTANTS.COLORS.primary
          }
        />
      ) : (
        <Text style={[styles.buttonText, textStyles]}>
          {text}
        </Text>
      )}
    </TouchableOpacity>
  );
});

const styles = StyleSheet.create({
  button: {
    height: BUTTON_CONFIG.height,
    borderRadius: BUTTON_CONFIG.borderRadius,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '500',
    textAlign: 'center',
  },
});
// #endregion

// #region 9. Exports
export default ModalButton;
// #endregion
