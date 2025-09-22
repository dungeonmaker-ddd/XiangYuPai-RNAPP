/**
 * 🛠️ TypeValidation 验证工具函数
 */

import { COLORS } from '../../constants';
import type { ValidationState } from '../../types';

export const utilsValidation = {
  // 获取验证样式
  getValidationStyle: (validation: ValidationState) => {
    if (validation.error) {
      return { color: COLORS.ERROR };
    }
    
    if (validation.warning) {
      return { color: COLORS.WARNING };
    }
    
    return { color: COLORS.TEXT_SECONDARY };
  },

  // 获取验证文本
  getValidationText: (validation: ValidationState): string => {
    if (validation.error) {
      return validation.error;
    }
    
    if (validation.warning) {
      return validation.warning;
    }
    
    return '';
  },

  // 验证状态是否有效
  isValidationVisible: (validation?: ValidationState): boolean => {
    return !!(validation && (validation.error || validation.warning));
  },
};
