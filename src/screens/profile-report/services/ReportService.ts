/**
 * 举报服务类
 * 
 * 功能：
 * - 举报数据的网络请求
 * - API接口封装
 * - 数据格式转换
 * - 错误处理和重试机制
 */

// #region [1] Imports
import { ReportType } from '../types';
// #endregion

// #region [2] Types
interface SubmitReportRequest {
  type: string;
  description: string;
  images: string[];
  targetId: string;
  targetType: string;
  timestamp: number;
}

interface SubmitReportResponse {
  reportId: string;
  message: string;
  status: 'success';
  timestamp: number;
}

interface GetReportTypesResponse {
  reportTypes: ReportType[];
  status: 'success';
  timestamp: number;
}

interface ApiError {
  code: string;
  message: string;
  status: number;
  timestamp: number;
}
// #endregion

// #region [3] Constants
const API_CONFIG = {
  baseUrl: 'https://api.example.com', // 替换为实际API地址
  timeout: 30000, // 30秒超时
  retryAttempts: 3,
  retryDelay: 1000, // 1秒
} as const;

const API_ENDPOINTS = {
  submitReport: '/reports',
  getReportTypes: '/reports/types',
  uploadImage: '/upload/images',
} as const;

const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  TOO_MANY_REQUESTS: 429,
  INTERNAL_SERVER_ERROR: 500,
} as const;
// #endregion

// #region [4] Utils
/**
 * 创建网络请求错误
 */
const createApiError = (
  status: number,
  message: string,
  code: string = 'API_ERROR'
): ApiError => ({
  code,
  message,
  status,
  timestamp: Date.now(),
});

/**
 * 处理网络响应
 */
const handleResponse = async <T>(response: Response): Promise<T> => {
  if (!response.ok) {
    let errorMessage = `HTTP ${response.status}: ${response.statusText}`;
    let errorCode = 'HTTP_ERROR';

    try {
      const errorData = await response.json();
      errorMessage = errorData.message || errorMessage;
      errorCode = errorData.code || errorCode;
    } catch {
      // 忽略JSON解析错误，使用默认错误信息
    }

    throw createApiError(response.status, errorMessage, errorCode);
  }

  try {
    return await response.json();
  } catch (error) {
    throw createApiError(
      response.status,
      '响应数据格式错误',
      'PARSE_ERROR'
    );
  }
};

/**
 * 创建网络请求
 */
const createRequest = async <T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> => {
  const url = `${API_CONFIG.baseUrl}${endpoint}`;
  
  const defaultOptions: RequestInit = {
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
    timeout: API_CONFIG.timeout,
  };

  const requestOptions = {
    ...defaultOptions,
    ...options,
    headers: {
      ...defaultOptions.headers,
      ...options.headers,
    },
  };

  try {
    const response = await fetch(url, requestOptions);
    return await handleResponse<T>(response);
  } catch (error) {
    if (error instanceof Error) {
      // 网络错误
      if (error.name === 'TypeError' || error.name === 'NetworkError') {
        throw createApiError(0, '网络连接失败，请检查网络设置', 'NETWORK_ERROR');
      }
      
      // 超时错误
      if (error.name === 'AbortError' || error.message.includes('timeout')) {
        throw createApiError(0, '请求超时，请重试', 'TIMEOUT_ERROR');
      }
    }

    // 重新抛出已处理的API错误
    if ('status' in (error as any)) {
      throw error;
    }

    // 未知错误
    throw createApiError(0, '请求失败，请稍后重试', 'UNKNOWN_ERROR');
  }
};

/**
 * 延迟执行
 */
const delay = (ms: number): Promise<void> => {
  return new Promise(resolve => setTimeout(resolve, ms));
};

/**
 * 带重试机制的请求
 */
const requestWithRetry = async <T>(
  endpoint: string,
  options: RequestInit = {},
  maxRetries: number = API_CONFIG.retryAttempts
): Promise<T> => {
  let lastError: ApiError | null = null;

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await createRequest<T>(endpoint, options);
    } catch (error) {
      lastError = error as ApiError;

      // 如果是客户端错误（4xx），不重试
      if (lastError.status >= 400 && lastError.status < 500) {
        throw lastError;
      }

      // 如果不是最后一次尝试，等待后重试
      if (attempt < maxRetries) {
        await delay(API_CONFIG.retryDelay * attempt);
        continue;
      }
    }
  }

  throw lastError;
};
// #endregion

// #region [5] Service Class
/**
 * 举报服务类
 */
export class ReportService {
  /**
   * 提交举报
   * 
   * @param reportData - 举报数据
   * @returns Promise<SubmitReportResponse>
   */
  static async submitReport(reportData: SubmitReportRequest): Promise<SubmitReportResponse> {
    const options: RequestInit = {
      method: 'POST',
      body: JSON.stringify(reportData),
    };

    try {
      const response = await requestWithRetry<SubmitReportResponse>(
        API_ENDPOINTS.submitReport,
        options
      );

      // 记录成功日志
      if (__DEV__) {
        console.log('举报提交成功:', {
          reportId: response.reportId,
          targetType: reportData.targetType,
          targetId: reportData.targetId,
        });
      }

      return response;
    } catch (error) {
      // 记录错误日志
      if (__DEV__) {
        console.error('举报提交失败:', {
          error,
          reportData: {
            type: reportData.type,
            targetType: reportData.targetType,
            targetId: reportData.targetId,
          },
        });
      }

      throw error;
    }
  }

  /**
   * 获取举报类型列表
   * 
   * @returns Promise<ReportType[]>
   */
  static async getReportTypes(): Promise<ReportType[]> {
    try {
      const response = await requestWithRetry<GetReportTypesResponse>(
        API_ENDPOINTS.getReportTypes,
        { method: 'GET' }
      );

      // 记录成功日志
      if (__DEV__) {
        console.log('举报类型获取成功:', {
          count: response.reportTypes.length,
        });
      }

      return response.reportTypes;
    } catch (error) {
      // 记录错误日志
      if (__DEV__) {
        console.error('举报类型获取失败:', error);
      }

      throw error;
    }
  }

  /**
   * 上传图片
   * 
   * @param imageUri - 图片URI
   * @returns Promise<string> 返回上传后的图片URL
   */
  static async uploadImage(imageUri: string): Promise<string> {
    const formData = new FormData();
    formData.append('file', {
      uri: imageUri,
      type: 'image/jpeg',
      name: 'report_image.jpg',
    } as any);

    const options: RequestInit = {
      method: 'POST',
      body: formData,
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    };

    try {
      const response = await requestWithRetry<{ url: string }>(
        API_ENDPOINTS.uploadImage,
        options
      );

      // 记录成功日志
      if (__DEV__) {
        console.log('图片上传成功:', {
          originalUri: imageUri,
          uploadedUrl: response.url,
        });
      }

      return response.url;
    } catch (error) {
      // 记录错误日志
      if (__DEV__) {
        console.error('图片上传失败:', {
          error,
          imageUri,
        });
      }

      throw error;
    }
  }

  /**
   * 批量上传图片
   * 
   * @param imageUris - 图片URI数组
   * @returns Promise<string[]> 返回上传后的图片URL数组
   */
  static async uploadImages(imageUris: string[]): Promise<string[]> {
    if (imageUris.length === 0) {
      return [];
    }

    try {
      // 并行上传所有图片
      const uploadPromises = imageUris.map(uri => this.uploadImage(uri));
      const uploadedUrls = await Promise.all(uploadPromises);

      return uploadedUrls;
    } catch (error) {
      // 记录错误日志
      if (__DEV__) {
        console.error('批量图片上传失败:', {
          error,
          imageCount: imageUris.length,
        });
      }

      throw error;
    }
  }
}
// #endregion

// #region [6] Exports
export type {
  SubmitReportRequest,
  SubmitReportResponse,
  GetReportTypesResponse,
  ApiError,
};

export {
  API_CONFIG,
  API_ENDPOINTS,
  HTTP_STATUS,
};
// #endregion
