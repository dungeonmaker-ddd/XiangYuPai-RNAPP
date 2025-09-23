/**
 * 话题详情前端API接口层 - 仅包含前端实际需要的核心接口
 * 
 * 核心接口：
 * 1. 获取话题信息
 * 2. 获取话题动态列表（分页）
 * 3. 点赞/取消点赞动态
 * 
 * 设计原则：最小化接口，避免过度设计
 */

// #region 1. Imports
import {
  GetTopicInfoRequest,
  GetTopicInfoResponse,
  GetTopicPostsRequest,
  GetTopicPostsResponse,
  LikeTopicPostRequest,
  LikeTopicPostResponse,
} from './types';

import { TOPIC_DETAIL_CONSTANTS } from './constants';
// #endregion

// #region 2. API Configuration

/**
 * API基础配置
 */
const API_CONFIG = {
  BASE_URL: process.env.REACT_APP_API_BASE_URL || 'http://localhost:8080',
  TIMEOUT: TOPIC_DETAIL_CONSTANTS.NETWORK_TIMEOUT,
  VERSION: 'v1',
} as const;

/**
 * API路径配置 - 只保留前端实际需要的接口
 */
const API_PATHS = {
  // 话题信息
  TOPIC_INFO: '/api/v1/discover/topic-detail/topic/{topicId}',
  
  // 话题动态列表
  TOPIC_POSTS: '/api/v1/discover/topic-detail/topic/{topicId}/posts',
  
  // 动态点赞
  LIKE_POST: '/api/v1/discover/topic-detail/post/{postId}/like',
} as const;

/**
 * 请求头配置
 */
const getRequestHeaders = (): Record<string, string> => {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  };
  
  // 添加用户认证信息
  const userToken = localStorage.getItem('userToken');
  if (userToken) {
    headers['Authorization'] = `Bearer ${userToken}`;
  }
  
  // 添加用户ID（如果有）
  const userId = localStorage.getItem('userId');
  if (userId) {
    headers['X-User-Id'] = userId;
  }
  
  return headers;
};
// #endregion

// #region 3. Core API Methods

/**
 * 通用HTTP请求方法
 */
const request = async <T>(
  url: string,
  options: RequestInit = {}
): Promise<T> => {
  const fullUrl = `${API_CONFIG.BASE_URL}${url}`;
  
  const config: RequestInit = {
    ...options,
    headers: {
      ...getRequestHeaders(),
      ...options.headers,
    },
    timeout: API_CONFIG.TIMEOUT,
  };
  
  try {
    const response = await fetch(fullUrl, config);
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    
    const data = await response.json();
    
    // 检查业务状态码
    if (data.code !== undefined && data.code !== 200) {
      throw new Error(data.message || '请求失败');
    }
    
    return data.data || data;
    
  } catch (error: any) {
    console.error('API请求失败:', error);
    throw new Error(error.message || '网络请求失败');
  }
};

/**
 * URL参数替换工具
 */
const replaceUrlParams = (url: string, params: Record<string, string>): string => {
  let result = url;
  Object.entries(params).forEach(([key, value]) => {
    result = result.replace(`{${key}}`, encodeURIComponent(value));
  });
  return result;
};

/**
 * 话题详情API服务 - 只包含3个核心接口
 */
export const apiDiscoverTopicDetail = {
  
  /**
   * 获取话题基本信息
   */
  getTopicInfo: async (request: GetTopicInfoRequest): Promise<GetTopicInfoResponse> => {
    const url = replaceUrlParams(API_PATHS.TOPIC_INFO, { topicId: request.topicId });
    
    return request<GetTopicInfoResponse>(url, {
      method: 'GET',
    });
  },

  /**
   * 获取话题动态列表（分页）
   */
  getTopicPosts: async (requestData: GetTopicPostsRequest): Promise<GetTopicPostsResponse> => {
    const url = replaceUrlParams(API_PATHS.TOPIC_POSTS, { topicId: requestData.topicId });
    
    // 构建查询参数
    const queryParams = new URLSearchParams();
    
    if (requestData.page) {
      queryParams.append('page', requestData.page.toString());
    }
    if (requestData.pageSize) {
      queryParams.append('pageSize', requestData.pageSize.toString());
    }
    if (requestData.sortBy) {
      queryParams.append('sortBy', requestData.sortBy);
    }
    if (requestData.timeRange) {
      queryParams.append('timeRange', requestData.timeRange);
    }
    if (requestData.mediaType) {
      queryParams.append('mediaType', requestData.mediaType);
    }
    
    const fullUrl = `${url}?${queryParams.toString()}`;
    
    return request<GetTopicPostsResponse>(fullUrl, {
      method: 'GET',
    });
  },

  /**
   * 点赞/取消点赞动态
   */
  likePost: async (requestData: LikeTopicPostRequest): Promise<LikeTopicPostResponse> => {
    const url = replaceUrlParams(API_PATHS.LIKE_POST, { postId: requestData.postId });
    
    return request<LikeTopicPostResponse>(url, {
      method: 'POST',
      body: JSON.stringify({
        action: requestData.action,
      }),
    });
  },

};
// #endregion

// #region 4. Request Interceptors

/**
 * 请求拦截器 - 添加通用请求处理逻辑
 */
const requestInterceptor = (config: RequestInit): RequestInit => {
  // 添加请求时间戳
  const timestamp = Date.now();
  
  // 添加请求ID用于追踪
  const requestId = `req_${timestamp}_${Math.random().toString(36).substr(2, 9)}`;
  
  // 添加到请求头
  config.headers = {
    ...config.headers,
    'X-Request-ID': requestId,
    'X-Request-Time': timestamp.toString(),
  };
  
  // 请求日志
  console.log(`[API Request] ${requestId}:`, config);
  
  return config;
};
// #endregion

// #region 5. Response Handlers

/**
 * 响应处理器 - 统一处理响应数据
 */
const responseHandler = <T>(response: T): T => {
  // 响应日志
  console.log('[API Response]:', response);
  
  // 数据转换处理
  if (typeof response === 'object' && response !== null) {
    // 处理日期字符串转换
    const dateFields = ['createdAt', 'updatedAt', 'publishTime'];
    const processDateFields = (obj: any): any => {
      if (Array.isArray(obj)) {
        return obj.map(processDateFields);
      }
      
      if (typeof obj === 'object' && obj !== null) {
        const processed = { ...obj };
        dateFields.forEach(field => {
          if (processed[field] && typeof processed[field] === 'string') {
            try {
              processed[field] = new Date(processed[field]);
            } catch (e) {
              console.warn(`Failed to parse date field ${field}:`, processed[field]);
            }
          }
        });
        
        // 递归处理嵌套对象
        Object.keys(processed).forEach(key => {
          if (typeof processed[key] === 'object') {
            processed[key] = processDateFields(processed[key]);
          }
        });
        
        return processed;
      }
      
      return obj;
    };
    
    return processDateFields(response);
  }
  
  return response;
};
// #endregion

// #region 6. Error Handling

/**
 * API错误类型
 */
export interface ApiError {
  code: number;
  message: string;
  details?: any;
  timestamp: number;
}

/**
 * 错误处理器
 */
export const handleApiError = (error: any): ApiError => {
  const timestamp = Date.now();
  
  if (error.response) {
    // HTTP响应错误
    return {
      code: error.response.status,
      message: error.response.data?.message || error.response.statusText || 'HTTP请求失败',
      details: error.response.data,
      timestamp,
    };
  }
  
  if (error.request) {
    // 网络错误
    return {
      code: 0,
      message: '网络连接失败，请检查网络设置',
      details: error.request,
      timestamp,
    };
  }
  
  // 其他错误
  return {
    code: -1,
    message: error.message || '未知错误',
    details: error,
    timestamp,
  };
};

/**
 * 重试机制
 */
export const withRetry = async <T>(
  apiCall: () => Promise<T>,
  maxRetries: number = 3,
  delay: number = 1000
): Promise<T> => {
  let lastError: any;
  
  for (let i = 0; i <= maxRetries; i++) {
    try {
      return await apiCall();
    } catch (error) {
      lastError = error;
      
      if (i < maxRetries) {
        // 指数退避延迟
        const waitTime = delay * Math.pow(2, i);
        await new Promise(resolve => setTimeout(resolve, waitTime));
        
        console.log(`API重试 ${i + 1}/${maxRetries}，等待 ${waitTime}ms`);
      }
    }
  }
  
  throw lastError;
};
// #endregion

// #region 7. Cache Integration

/**
 * 缓存管理器
 */
class ApiCacheManager {
  private cache = new Map<string, { data: any; timestamp: number; ttl: number }>();
  
  /**
   * 生成缓存键
   */
  private generateKey(url: string, params?: any): string {
    const baseKey = url;
    if (params) {
      const sortedParams = Object.keys(params)
        .sort()
        .map(key => `${key}=${params[key]}`)
        .join('&');
      return `${baseKey}?${sortedParams}`;
    }
    return baseKey;
  }
  
  /**
   * 获取缓存数据
   */
  get(url: string, params?: any): any | null {
    const key = this.generateKey(url, params);
    const cached = this.cache.get(key);
    
    if (!cached) {
      return null;
    }
    
    // 检查是否过期
    if (Date.now() - cached.timestamp > cached.ttl) {
      this.cache.delete(key);
      return null;
    }
    
    console.log('[Cache Hit]:', key);
    return cached.data;
  }
  
  /**
   * 设置缓存数据
   */
  set(url: string, data: any, ttl: number = 300000, params?: any): void {
    const key = this.generateKey(url, params);
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      ttl,
    });
    
    console.log('[Cache Set]:', key);
  }
  
  /**
   * 清除缓存
   */
  clear(pattern?: string): void {
    if (pattern) {
      for (const key of this.cache.keys()) {
        if (key.includes(pattern)) {
          this.cache.delete(key);
        }
      }
    } else {
      this.cache.clear();
    }
  }
}

export const apiCache = new ApiCacheManager();

/**
 * 带缓存的API请求
 */
export const requestWithCache = async <T>(
  url: string,
  options: RequestInit = {},
  ttl: number = 300000
): Promise<T> => {
  // 检查缓存（仅对GET请求）
  if (options.method === 'GET' || !options.method) {
    const cached = apiCache.get(url);
    if (cached) {
      return cached;
    }
  }
  
  const result = await request<T>(url, options);
  
  // 缓存结果（仅对GET请求）
  if (options.method === 'GET' || !options.method) {
    apiCache.set(url, result, ttl);
  }
  
  return result;
};
// #endregion

// #region 8. Exports

export default apiDiscoverTopicDetail;

// 导出工具函数
export {
  replaceUrlParams,
  request,
  requestWithCache,
  requestInterceptor,
  responseHandler,
  API_PATHS,
  API_CONFIG,
};

// 导出类型
export type { ApiError };
// #endregion
