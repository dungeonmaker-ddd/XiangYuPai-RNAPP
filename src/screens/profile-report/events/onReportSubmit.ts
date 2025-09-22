/**
 * 举报提交事件处理器
 * 
 * 功能：
 * - 处理举报表单提交事件
 * - 数据验证和格式化
 * - 提交状态管理
 * - 错误处理和重试机制
 */

// #region [1] Imports
import { ReportFormData } from '../types';
import { ReportService } from '../services/ReportService';
// #endregion

// #region [2] Types
interface SubmitCallbacks {
  onStart: () => void;
  onSuccess: (result: SubmitSuccessResult) => void;
  onError: (error: SubmitErrorResult) => void;
}

interface SubmitSuccessResult {
  reportId: string;
  message: string;
  timestamp: number;
}

interface SubmitErrorResult {
  code: string;
  message: string;
  details?: any;
  timestamp: number;
}

interface ReportSubmitEventData {
  formData: ReportFormData;
  targetInfo: TargetInfo;
  timestamp: number;
  source: 'user_submit';
}

interface TargetInfo {
  targetId: string;
  targetType: string;
}

type SubmitStatus = 'idle' | 'submitting' | 'success' | 'error';
// #endregion

// #region [3] Constants
const SUBMIT_CONFIG = {
  maxRetries: 3,
  retryDelay: 1000, // ms
  timeout: 30000, // 30s
} as const;

const ERROR_MESSAGES = {
  NETWORK_ERROR: '网络连接失败，请检查网络后重试',
  VALIDATION_ERROR: '提交数据格式错误，请检查后重试',
  SERVER_ERROR: '服务器繁忙，请稍后重试',
  TIMEOUT_ERROR: '请求超时，请重试',
  UNKNOWN_ERROR: '提交失败，请稍后重试',
  RATE_LIMIT_ERROR: '操作过于频繁，请稍后再试',
  DUPLICATE_ERROR: '请勿重复提交',
} as const;

const ERROR_CODES = {
  NETWORK_ERROR: 'NETWORK_ERROR',
  VALIDATION_ERROR: 'VALIDATION_ERROR',
  SERVER_ERROR: 'SERVER_ERROR',
  TIMEOUT_ERROR: 'TIMEOUT_ERROR',
  RATE_LIMIT_ERROR: 'RATE_LIMIT_ERROR',
  DUPLICATE_ERROR: 'DUPLICATE_ERROR',
  UNKNOWN_ERROR: 'UNKNOWN_ERROR',
} as const;
// #endregion

// #region [4] Utils
/**
 * 验证表单数据完整性
 */
const validateFormData = (formData: ReportFormData): { isValid: boolean; errors: string[] } => {
  const errors: string[] = [];

  // 检查必填字段
  if (!formData.selectedType) {
    errors.push('请选择举报类型');
  }

  if (!formData.description || formData.description.trim().length === 0) {
    errors.push('请填写举报描述');
  }

  // 检查描述长度
  if (formData.description && formData.description.length > 200) {
    errors.push('举报描述不能超过200字');
  }

  // 检查图片数量
  if (formData.images && formData.images.length > 9) {
    errors.push('图片数量不能超过9张');
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};

/**
 * 格式化提交数据
 */
const formatSubmitData = (
  formData: ReportFormData,
  targetInfo: TargetInfo
) => {
  return {
    type: formData.selectedType?.id || '',
    description: formData.description.trim(),
    images: formData.images || [],
    targetId: targetInfo.targetId,
    targetType: targetInfo.targetType,
    timestamp: Date.now(),
  };
};

/**
 * 处理提交错误
 */
const handleSubmitError = (error: any): SubmitErrorResult => {
  const timestamp = Date.now();

  // 网络错误
  if (error.name === 'NetworkError' || error.code === 'NETWORK_ERROR') {
    return {
      code: ERROR_CODES.NETWORK_ERROR,
      message: ERROR_MESSAGES.NETWORK_ERROR,
      timestamp,
    };
  }

  // 超时错误
  if (error.name === 'TimeoutError' || error.code === 'TIMEOUT_ERROR') {
    return {
      code: ERROR_CODES.TIMEOUT_ERROR,
      message: ERROR_MESSAGES.TIMEOUT_ERROR,
      timestamp,
    };
  }

  // 服务器错误
  if (error.status >= 500) {
    return {
      code: ERROR_CODES.SERVER_ERROR,
      message: ERROR_MESSAGES.SERVER_ERROR,
      timestamp,
    };
  }

  // 验证错误
  if (error.status === 400) {
    return {
      code: ERROR_CODES.VALIDATION_ERROR,
      message: error.message || ERROR_MESSAGES.VALIDATION_ERROR,
      timestamp,
    };
  }

  // 频率限制
  if (error.status === 429) {
    return {
      code: ERROR_CODES.RATE_LIMIT_ERROR,
      message: ERROR_MESSAGES.RATE_LIMIT_ERROR,
      timestamp,
    };
  }

  // 重复提交
  if (error.status === 409) {
    return {
      code: ERROR_CODES.DUPLICATE_ERROR,
      message: ERROR_MESSAGES.DUPLICATE_ERROR,
      timestamp,
    };
  }

  // 未知错误
  return {
    code: ERROR_CODES.UNKNOWN_ERROR,
    message: error.message || ERROR_MESSAGES.UNKNOWN_ERROR,
    details: error,
    timestamp,
  };
};

/**
 * 延迟执行
 */
const delay = (ms: number): Promise<void> => {
  return new Promise(resolve => setTimeout(resolve, ms));
};
// #endregion

// #region [5] Event Handler
/**
 * 举报提交事件处理器
 * 
 * @param formData - 表单数据
 * @param targetInfo - 举报目标信息
 * @param callbacks - 回调函数
 * @returns Promise<ReportSubmitEventData>
 */
export const onReportSubmit = async (
  formData: ReportFormData,
  targetInfo: TargetInfo,
  callbacks: SubmitCallbacks
): Promise<ReportSubmitEventData> => {
  const eventData: ReportSubmitEventData = {
    formData,
    targetInfo,
    timestamp: Date.now(),
    source: 'user_submit',
  };

  // 开始提交
  callbacks.onStart();

  try {
    // 1. 验证表单数据
    const validation = validateFormData(formData);
    if (!validation.isValid) {
      throw new Error(validation.errors.join('; '));
    }

    // 2. 格式化提交数据
    const submitData = formatSubmitData(formData, targetInfo);

    // 3. 提交数据（带重试机制）
    let lastError: any;
    for (let attempt = 1; attempt <= SUBMIT_CONFIG.maxRetries; attempt++) {
      try {
        const result = await ReportService.submitReport(submitData);
        
        // 提交成功
        const successResult: SubmitSuccessResult = {
          reportId: result.reportId,
          message: result.message || '举报提交成功',
          timestamp: Date.now(),
        };

        callbacks.onSuccess(successResult);

        // 埋点统计（仅开发环境）
        if (__DEV__) {
          console.log('举报提交成功:', {
            reportId: successResult.reportId,
            targetType: targetInfo.targetType,
            targetId: targetInfo.targetId,
            attempt,
            timestamp: successResult.timestamp,
          });
        }

        return eventData;

      } catch (error) {
        lastError = error;
        
        // 如果不是最后一次尝试，等待后重试
        if (attempt < SUBMIT_CONFIG.maxRetries) {
          await delay(SUBMIT_CONFIG.retryDelay * attempt);
          continue;
        }
      }
    }

    // 所有重试都失败了
    throw lastError;

  } catch (error) {
    // 处理错误
    const errorResult = handleSubmitError(error);
    callbacks.onError(errorResult);

    // 错误埋点统计（仅开发环境）
    if (__DEV__) {
      console.error('举报提交失败:', {
        errorCode: errorResult.code,
        errorMessage: errorResult.message,
        targetType: targetInfo.targetType,
        targetId: targetInfo.targetId,
        timestamp: errorResult.timestamp,
      });
    }

    return eventData;
  }
};

/**
 * 检查是否可以提交
 * 
 * @param formData - 表单数据
 * @returns 是否可以提交
 */
export const canSubmitReport = (formData: ReportFormData): boolean => {
  const validation = validateFormData(formData);
  return validation.isValid;
};

/**
 * 获取表单验证结果
 * 
 * @param formData - 表单数据
 * @returns 验证结果
 */
export const getFormValidation = (formData: ReportFormData) => {
  return validateFormData(formData);
};
// #endregion

// #region [6] Exports
export type {
  SubmitCallbacks,
  SubmitSuccessResult,
  SubmitErrorResult,
  ReportSubmitEventData,
  TargetInfo,
  SubmitStatus,
};

export {
  SUBMIT_CONFIG,
  ERROR_MESSAGES,
  ERROR_CODES,
};
// #endregion
