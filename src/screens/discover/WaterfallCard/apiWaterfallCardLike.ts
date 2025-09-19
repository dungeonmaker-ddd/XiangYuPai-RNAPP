/**
 * 瀑布流卡片点赞API接口层
 * 基于通用组件架构核心标准 - API接口层
 * 
 * @version 2.0.0
 * @author 架构团队
 */

import { ContentItem } from './types';

// =====================================================
// API请求接口
// =====================================================

export interface LikeContentRequest {
  contentId: string;
  action: 'like' | 'unlike';
  sourceTab?: string;
  sourceIndex?: number;
  clientTimestamp: number;
}

export interface LikeContentResponse {
  success: boolean;
  data: {
    contentId: string;
    isLiked: boolean;
    likeCount: number;
    likeId?: string; // 点赞记录ID
  };
  message?: string;
  error?: string;
}

export interface BatchLikeRequest {
  actions: Array<{
    contentId: string;
    action: 'like' | 'unlike';
  }>;
  clientTimestamp: number;
}

export interface BatchLikeResponse {
  success: boolean;
  data: Array<{
    contentId: string;
    isLiked: boolean;
    likeCount: number;
    success: boolean;
    error?: string;
  }>;
  message?: string;
}

export interface GetLikeStatusRequest {
  contentIds: string[];
}

export interface GetLikeStatusResponse {
  success: boolean;
  data: Array<{
    contentId: string;
    isLiked: boolean;
    likeCount: number;
  }>;
}

// =====================================================
// API配置
// =====================================================

const API_CONFIG = {
  BASE_URL: '/api/v1/content',
  ENDPOINTS: {
    LIKE: '/like',
    BATCH_LIKE: '/batch-like',
    LIKE_STATUS: '/like-status',
  },
  TIMEOUT: 5000,
  RETRY_ATTEMPTS: 3,
  RETRY_DELAY: 1000,
};

// =====================================================
// 主要API函数
// =====================================================

/**
 * 点赞或取消点赞内容
 */
export const apiWaterfallCardLike = async (
  request: LikeContentRequest
): Promise<LikeContentResponse> => {
  const url = `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.LIKE}`;
  
  try {
    const response = await fetchWithRetry(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Client-Version': '2.0.0',
        'X-Request-ID': generateRequestId(),
      },
      body: JSON.stringify(request),
      timeout: API_CONFIG.TIMEOUT,
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const data: LikeContentResponse = await response.json();
    
    // 验证响应数据
    validateLikeResponse(data);
    
    return data;

  } catch (error) {
    console.error('点赞API调用失败:', error);
    
    // 返回错误响应
    return {
      success: false,
      data: {
        contentId: request.contentId,
        isLiked: false,
        likeCount: 0,
      },
      error: (error as Error).message,
    };
  }
};

/**
 * 批量点赞操作
 */
export const apiWaterfallCardBatchLike = async (
  request: BatchLikeRequest
): Promise<BatchLikeResponse> => {
  const url = `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.BATCH_LIKE}`;
  
  try {
    const response = await fetchWithRetry(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Client-Version': '2.0.0',
        'X-Request-ID': generateRequestId(),
      },
      body: JSON.stringify(request),
      timeout: API_CONFIG.TIMEOUT,
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const data: BatchLikeResponse = await response.json();
    return data;

  } catch (error) {
    console.error('批量点赞API调用失败:', error);
    
    return {
      success: false,
      data: request.actions.map(action => ({
        contentId: action.contentId,
        isLiked: false,
        likeCount: 0,
        success: false,
        error: (error as Error).message,
      })),
    };
  }
};

/**
 * 获取内容点赞状态
 */
export const apiWaterfallCardLikeStatus = async (
  request: GetLikeStatusRequest
): Promise<GetLikeStatusResponse> => {
  const url = `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.LIKE_STATUS}`;
  const queryParams = new URLSearchParams({
    contentIds: request.contentIds.join(','),
  });
  
  try {
    const response = await fetchWithRetry(`${url}?${queryParams}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'X-Client-Version': '2.0.0',
        'X-Request-ID': generateRequestId(),
      },
      timeout: API_CONFIG.TIMEOUT,
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const data: GetLikeStatusResponse = await response.json();
    return data;

  } catch (error) {
    console.error('获取点赞状态API调用失败:', error);
    
    return {
      success: false,
      data: request.contentIds.map(contentId => ({
        contentId,
        isLiked: false,
        likeCount: 0,
      })),
    };
  }
};

// =====================================================
// 辅助函数
// =====================================================

/**
 * 带重试机制的fetch
 */
const fetchWithRetry = async (
  url: string, 
  options: RequestInit & { timeout?: number },
  retryCount = 0
): Promise<Response> => {
  const { timeout = API_CONFIG.TIMEOUT, ...fetchOptions } = options;
  
  try {
    // 添加超时控制
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);
    
    const response = await fetch(url, {
      ...fetchOptions,
      signal: controller.signal,
    });
    
    clearTimeout(timeoutId);
    return response;
    
  } catch (error) {
    // 如果是网络错误且还有重试次数，则重试
    if (retryCount < API_CONFIG.RETRY_ATTEMPTS && isRetryableError(error)) {
      console.warn(`API调用失败，${API_CONFIG.RETRY_DELAY}ms后重试 (${retryCount + 1}/${API_CONFIG.RETRY_ATTEMPTS}):`, error);
      
      await delay(API_CONFIG.RETRY_DELAY);
      return fetchWithRetry(url, options, retryCount + 1);
    }
    
    throw error;
  }
};

/**
 * 判断错误是否可重试
 */
const isRetryableError = (error: any): boolean => {
  // 网络错误、超时错误、5xx服务器错误可以重试
  if (error.name === 'AbortError') return true;
  if (error.name === 'TypeError' && error.message.includes('fetch')) return true;
  if (error.status >= 500) return true;
  
  return false;
};

/**
 * 延迟函数
 */
const delay = (ms: number): Promise<void> => {
  return new Promise(resolve => setTimeout(resolve, ms));
};

/**
 * 生成请求ID
 */
const generateRequestId = (): string => {
  return `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};

/**
 * 验证点赞响应数据
 */
const validateLikeResponse = (response: LikeContentResponse): void => {
  if (!response.data || typeof response.data.contentId !== 'string') {
    throw new Error('无效的API响应数据');
  }
  
  if (typeof response.data.isLiked !== 'boolean') {
    throw new Error('点赞状态数据类型错误');
  }
  
  if (typeof response.data.likeCount !== 'number' || response.data.likeCount < 0) {
    throw new Error('点赞数量数据无效');
  }
};

// =====================================================
// 便捷导出
// =====================================================

/**
 * 快速点赞函数
 */
export const quickLikeContent = async (
  contentId: string,
  currentLiked: boolean
): Promise<{ success: boolean; newLikeStatus: boolean; newLikeCount: number }> => {
  const response = await apiWaterfallCardLike({
    contentId,
    action: currentLiked ? 'unlike' : 'like',
    clientTimestamp: Date.now(),
  });

  return {
    success: response.success,
    newLikeStatus: response.data.isLiked,
    newLikeCount: response.data.likeCount,
  };
};

/**
 * 从ContentItem创建点赞请求
 */
export const createLikeRequestFromItem = (
  item: ContentItem,
  action: 'like' | 'unlike',
  sourceTab?: string,
  sourceIndex?: number
): LikeContentRequest => {
  return {
    contentId: item.id,
    action,
    sourceTab,
    sourceIndex,
    clientTimestamp: Date.now(),
  };
};

/**
 * 创建预配置的点赞API调用器
 */
export const createWaterfallCardLikeAPI = (config: {
  sourceTab: string;
  analytics?: any;
  onSuccess?: (contentId: string, result: LikeContentResponse) => void;
  onError?: (contentId: string, error: Error) => void;
}) => {
  return async (
    contentId: string,
    action: 'like' | 'unlike',
    sourceIndex?: number
  ) => {
    try {
      const request: LikeContentRequest = {
        contentId,
        action,
        sourceTab: config.sourceTab,
        sourceIndex,
        clientTimestamp: Date.now(),
      };

      const response = await apiWaterfallCardLike(request);
      
      if (response.success) {
        config.onSuccess?.(contentId, response);
      } else {
        throw new Error(response.error || '点赞操作失败');
      }
      
      return response;
      
    } catch (error) {
      config.onError?.(contentId, error as Error);
      throw error;
    }
  };
};
