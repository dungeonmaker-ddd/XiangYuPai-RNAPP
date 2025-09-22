/**
 * SearchInputArea 格式化工具模块
 * 处理搜索输入格式化相关的工具函数
 */

import { COLORS } from '../constants';

/**
 * 输入格式化工具函数
 */
export const utilsInputFormat = () => {
  /**
   * 格式化输入值
   */
  const formatInputValue = (text: string): string => {
    // 移除首尾空格，保留中间空格
    return text.replace(/^\s+/, '').replace(/\s+$/, '');
  };

  /**
   * 获取占位符颜色
   */
  const getPlaceholderColor = (): string => {
    return COLORS.textLight;
  };

  /**
   * 格式化搜索关键词
   */
  const formatSearchKeyword = (keyword: string): string => {
    return keyword.trim().replace(/\s+/g, ' ');
  };

  /**
   * 检查输入长度
   */
  const checkInputLength = (text: string, maxLength: number): boolean => {
    return text.length <= maxLength;
  };

  /**
   * 获取输入状态样式
   */
  const getInputStateStyle = (isFocused: boolean, hasError: boolean) => {
    if (hasError) {
      return {
        borderColor: COLORS.error,
        backgroundColor: COLORS.white,
      };
    }
    
    if (isFocused) {
      return {
        borderColor: COLORS.primary,
        backgroundColor: COLORS.white,
        elevation: 2,
      };
    }
    
    return {
      borderColor: COLORS.border,
      backgroundColor: COLORS.backgroundInput,
    };
  };

  return {
    formatInputValue,
    getPlaceholderColor,
    formatSearchKeyword,
    checkInputLength,
    getInputStateStyle,
  };
};

/**
 * 输入动画工具函数
 */
export const utilsInputAnimation = () => {
  /**
   * 获取聚焦动画配置
   */
  const getFocusAnimation = () => {
    return {
      duration: 200,
      useNativeDriver: false,
    };
  };

  /**
   * 获取错误抖动动画配置
   */
  const getErrorShakeAnimation = () => {
    return {
      duration: 300,
      useNativeDriver: true,
    };
  };

  return {
    getFocusAnimation,
    getErrorShakeAnimation,
  };
};
