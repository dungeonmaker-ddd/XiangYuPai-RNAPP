/**
 * 🛠️ PublishButton 按钮工具函数
 */

import { PUBLISH_CONSTANTS } from './constants';
import { COLORS } from '../../constants';

export const utilsButton = {
  // 获取按钮样式
  getButtonStyle: (disabled: boolean, loading: boolean) => {
    const baseStyle = {
      backgroundColor: COLORS.PRIMARY,
      opacity: 1,
    };

    if (disabled) {
      return {
        ...baseStyle,
        backgroundColor: COLORS.TEXT_SECONDARY,
        opacity: PUBLISH_CONSTANTS.DISABLED_OPACITY,
      };
    }

    if (loading) {
      return {
        ...baseStyle,
        opacity: PUBLISH_CONSTANTS.LOADING_OPACITY,
      };
    }

    return baseStyle;
  },

  // 获取文字样式
  getTextStyle: (disabled: boolean, loading: boolean) => {
    const baseStyle = {
      color: COLORS.TEXT_WHITE,
    };

    if (disabled || loading) {
      return {
        ...baseStyle,
        color: COLORS.TEXT_WHITE,
      };
    }

    return baseStyle;
  },

  // 验证按钮状态
  validateButtonState: (disabled: boolean, loading: boolean): boolean => {
    return !disabled && !loading;
  },
};
