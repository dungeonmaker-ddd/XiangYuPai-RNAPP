/**
 * 🛠️ SaveButton 按钮工具函数
 */

import { SAVE_CONSTANTS } from './constants';
import { COLORS } from '../../constants';

export const utilsButton = {
  // 获取按钮样式
  getButtonStyle: (disabled: boolean, loading: boolean) => {
    const baseStyle = {
      backgroundColor: 'transparent',
      opacity: 1,
    };

    if (disabled) {
      return {
        ...baseStyle,
        opacity: SAVE_CONSTANTS.DISABLED_OPACITY,
      };
    }

    if (loading) {
      return {
        ...baseStyle,
        opacity: SAVE_CONSTANTS.LOADING_OPACITY,
      };
    }

    return baseStyle;
  },

  // 获取文字样式
  getTextStyle: (disabled: boolean, loading: boolean) => {
    const baseStyle = {
      color: COLORS.PRIMARY,
    };

    if (disabled) {
      return {
        ...baseStyle,
        color: COLORS.TEXT_SECONDARY,
      };
    }

    if (loading) {
      return {
        ...baseStyle,
        color: COLORS.TEXT_SECONDARY,
      };
    }

    return baseStyle;
  },

  // 验证按钮状态
  validateButtonState: (disabled: boolean, loading: boolean): boolean => {
    return !disabled && !loading;
  },
};
