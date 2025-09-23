/**
 * 工具函数相关类型定义
 */

/**
 * 验证结果类型
 */
export interface ValidationResult {
  isValid: boolean;
  errors: string[];
}

/**
 * 文件验证结果类型
 */
export interface FileValidationResult {
  isValid: boolean;
  error?: string;
}

/**
 * 违规检查结果类型
 */
export interface ViolationCheckResult {
  isViolation: boolean;
  violationType?: string;
  reason?: string;
}

/**
 * 地点格式化参数类型
 */
export interface LocationFormatData {
  name: string;
  address?: string;
  distance?: number;
}

/**
 * Toast消息类型
 */
export type ToastType = 'success' | 'error' | 'warning' | 'info';

/**
 * 格式化选项类型
 */
export interface FormatOptions {
  useThousandSeparator?: boolean;
  decimalPlaces?: number;
  suffix?: string;
  prefix?: string;
}
