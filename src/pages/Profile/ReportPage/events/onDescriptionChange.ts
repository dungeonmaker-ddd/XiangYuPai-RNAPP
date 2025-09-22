/**
 * 举报描述变化事件处理器
 * 
 * 功能：
 * - 处理用户输入描述文字的变化事件
 * - 实时字数统计
 * - 触发表单验证
 */

// #region [1] Imports
// 无需额外导入
// #endregion

// #region [2] Types
type OnDescriptionChangeCallback = (description: string) => void;

interface DescriptionChangeEventData {
  description: string;
  length: number;
  timestamp: number;
  source: 'user_input';
}

interface DescriptionValidationResult {
  isValid: boolean;
  errors: string[];
  length: number;
  maxLength: number;
}
// #endregion

// #region [3] Constants
const DESCRIPTION_CONSTRAINTS = {
  maxLength: 200,
  minLength: 1,
  forbiddenPatterns: [
    /^\s+$/, // 纯空白字符
    /^(.)\1{10,}$/, // 重复字符超过10个
  ],
} as const;
// #endregion

// #region [4] Utils
/**
 * 验证描述内容
 */
const validateDescription = (description: string): DescriptionValidationResult => {
  const errors: string[] = [];
  const length = description.length;
  const maxLength = DESCRIPTION_CONSTRAINTS.maxLength;

  // 检查长度限制
  if (length > maxLength) {
    errors.push(`描述不能超过${maxLength}字`);
  }

  // 检查最小长度（仅在有内容时检查）
  if (description.trim().length > 0 && description.trim().length < DESCRIPTION_CONSTRAINTS.minLength) {
    errors.push('描述内容不能为空');
  }

  // 检查禁止的模式
  for (const pattern of DESCRIPTION_CONSTRAINTS.forbiddenPatterns) {
    if (pattern.test(description)) {
      errors.push('描述内容格式不正确');
      break;
    }
  }

  return {
    isValid: errors.length === 0,
    errors,
    length,
    maxLength,
  };
};

/**
 * 清理描述内容
 */
const sanitizeDescription = (description: string): string => {
  // 移除首尾空白字符
  return description.trim();
};
// #endregion

// #region [5] Event Handler
/**
 * 举报描述变化事件处理器
 * 
 * @param description - 新的描述内容
 * @param callback - 内容变化后的回调函数
 * @returns 事件处理结果
 */
export const onDescriptionChange = (
  description: string,
  callback: OnDescriptionChangeCallback
): DescriptionChangeEventData => {
  // 创建事件数据
  const eventData: DescriptionChangeEventData = {
    description,
    length: description.length,
    timestamp: Date.now(),
    source: 'user_input',
  };

  // 验证描述内容
  const validationResult = validateDescription(description);

  // 执行回调
  try {
    callback(description);
  } catch (error) {
    console.warn('描述变化回调执行失败:', error);
  }

  // 可选：添加埋点统计（仅在开发环境）
  if (__DEV__) {
    console.log('描述变化事件:', {
      length: eventData.length,
      maxLength: DESCRIPTION_CONSTRAINTS.maxLength,
      isValid: validationResult.isValid,
      errors: validationResult.errors,
      timestamp: eventData.timestamp,
    });
  }

  return eventData;
};

/**
 * 获取描述验证结果
 * 
 * @param description - 要验证的描述内容
 * @returns 验证结果
 */
export const getDescriptionValidation = (description: string): DescriptionValidationResult => {
  return validateDescription(description);
};

/**
 * 清理并格式化描述内容
 * 
 * @param description - 原始描述内容
 * @returns 清理后的描述内容
 */
export const formatDescription = (description: string): string => {
  return sanitizeDescription(description);
};
// #endregion

// #region [6] Exports
export type {
  OnDescriptionChangeCallback,
  DescriptionChangeEventData,
  DescriptionValidationResult,
};

export { DESCRIPTION_CONSTRAINTS };
// #endregion
