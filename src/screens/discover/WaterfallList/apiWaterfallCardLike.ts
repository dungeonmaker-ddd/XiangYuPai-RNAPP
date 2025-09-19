/**
 * 瀑布流卡片点赞API接口
 * 基于通用组件架构核心标准 - API接口层
 * 
 * @version 2.0.0
 * @author 架构团队
 */

import { TabType } from './types';
import { API_CONSTANTS } from './constants';

// =====================================================
// API请求参数接口
// =====================================================

export interface LikeContentParams {
  contentId: string;
  userId: string;
  isLike: boolean; // true: 点赞, false: 取消点赞
  tabType: TabType;
  sourceScreen?: string;
}

export interface BatchLikeParams {
  operations: {
    contentId: string;
    isLike: boolean;
  }[];
  userId: string;
  tabType: TabType;
}

export interface GetLikeStatusParams {
  contentIds: string[];
  userId: string;
}

// =====================================================
// API响应接口
// =====================================================

export interface LikeContentResponse {
  contentId: string;
  isLiked: boolean;
  likeCount: number;
  timestamp: string;
}

export interface BatchLikeResponse {
  results: {
    contentId: string;
    success: boolean;
    isLiked?: boolean;
    likeCount?: number;
    error?: string;
  }[];
  successCount: number;
  failureCount: number;
}

export interface LikeStatusResponse {
  statuses: {
    contentId: string;
    isLiked: boolean;
    likeCount: number;
  }[];
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
    details?: any;
  };
  metadata?: {
    requestId: string;
    timestamp: string;
    version: string;
  };
}

// =====================================================
// 主要API函数
// =====================================================

/**
 * 点赞/取消点赞内容
 * @param params 点赞参数
 * @returns 点赞响应
 */
export const likeWaterfallContent = async (
  params: LikeContentParams
): Promise<ApiResponse<LikeContentResponse>> => {
  try {
    const { contentId, userId, isLike, tabType, sourceScreen } = params;

    // 构建请求URL
    const url = buildApiUrl('/waterfall/like', {
      contentId,
      userId,
      action: isLike ? 'like' : 'unlike',
      tabType,
      ...(sourceScreen && { sourceScreen }),
    });

    // 发起请求
    const response = await makeApiRequest(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'WaterfallModule/2.0.0',
      },
      body: JSON.stringify({
        contentId,
        userId,
        isLike,
        timestamp: new Date().toISOString(),
        clientVersion: '2.0.0',
      }),
    });

    if (response.success && response.data) {
      const transformedData = transformLikeResponse(response.data);
      
      return {
        success: true,
        data: transformedData,
        metadata: {
          requestId: generateRequestId(),
          timestamp: new Date().toISOString(),
          version: '2.0.0',
        },
      };
    } else {
      return {
        success: false,
        error: response.error || {
          code: 'LIKE_ERROR',
          message: '点赞操作失败',
        },
      };
    }
  } catch (error) {
    console.error('点赞内容失败:', error);
    return {
      success: false,
      error: {
        code: 'NETWORK_ERROR',
        message: '网络请求失败',
        details: error,
      },
    };
  }
};

/**
 * 批量点赞操作
 * @param params 批量点赞参数
 * @returns 批量点赞响应
 */
export const batchLikeWaterfallContent = async (
  params: BatchLikeParams
): Promise<ApiResponse<BatchLikeResponse>> => {
  try {
    const { operations, userId, tabType } = params;

    const url = buildApiUrl('/waterfall/batch-like');

    const response = await makeApiRequest(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'WaterfallModule/2.0.0',
      },
      body: JSON.stringify({
        operations,
        userId,
        tabType,
        timestamp: new Date().toISOString(),
        clientVersion: '2.0.0',
      }),
    });

    if (response.success && response.data) {
      const transformedData = transformBatchLikeResponse(response.data);
      
      return {
        success: true,
        data: transformedData,
        metadata: {
          requestId: generateRequestId(),
          timestamp: new Date().toISOString(),
          version: '2.0.0',
        },
      };
    } else {
      return {
        success: false,
        error: response.error || {
          code: 'BATCH_LIKE_ERROR',
          message: '批量点赞操作失败',
        },
      };
    }
  } catch (error) {
    console.error('批量点赞失败:', error);
    return {
      success: false,
      error: {
        code: 'NETWORK_ERROR',
        message: '网络请求失败',
        details: error,
      },
    };
  }
};

/**
 * 获取内容点赞状态
 * @param params 查询参数
 * @returns 点赞状态响应
 */
export const getWaterfallLikeStatus = async (
  params: GetLikeStatusParams
): Promise<ApiResponse<LikeStatusResponse>> => {
  try {
    const { contentIds, userId } = params;

    const url = buildApiUrl('/waterfall/like-status', {
      contentIds: contentIds.join(','),
      userId,
    });

    const response = await makeApiRequest(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'WaterfallModule/2.0.0',
      },
    });

    if (response.success && response.data) {
      const transformedData = transformLikeStatusResponse(response.data);
      
      return {
        success: true,
        data: transformedData,
        metadata: {
          requestId: generateRequestId(),
          timestamp: new Date().toISOString(),
          version: '2.0.0',
        },
      };
    } else {
      return {
        success: false,
        error: response.error || {
          code: 'STATUS_ERROR',
          message: '获取点赞状态失败',
        },
      };
    }
  } catch (error) {
    console.error('获取点赞状态失败:', error);
    return {
      success: false,
      error: {
        code: 'NETWORK_ERROR',
        message: '网络请求失败',
        details: error,
      },
    };
  }
};

/**
 * 获取用户点赞历史
 * @param userId 用户ID
 * @param page 页码
 * @param limit 每页数量
 * @returns 点赞历史响应
 */
export const getUserLikeHistory = async (
  userId: string,
  page: number = 1,
  limit: number = 20
): Promise<ApiResponse<{
  likes: Array<{
    contentId: string;
    likedAt: string;
    contentTitle: string;
    contentImageUrl: string;
  }>;
  pagination: {
    page: number;
    limit: number;
    total: number;
    hasMore: boolean;
  };
}>> => {
  try {
    const url = buildApiUrl('/waterfall/user-likes', {
      userId,
      page: page.toString(),
      limit: limit.toString(),
    });

    const response = await makeApiRequest(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (response.success && response.data) {
      return {
        success: true,
        data: response.data,
        metadata: {
          requestId: generateRequestId(),
          timestamp: new Date().toISOString(),
          version: '2.0.0',
        },
      };
    } else {
      return {
        success: false,
        error: response.error || {
          code: 'HISTORY_ERROR',
          message: '获取点赞历史失败',
        },
      };
    }
  } catch (error) {
    console.error('获取用户点赞历史失败:', error);
    return {
      success: false,
      error: {
        code: 'NETWORK_ERROR',
        message: '网络请求失败',
        details: error,
      },
    };
  }
};

// =====================================================
// 辅助函数
// =====================================================

/**
 * 构建API URL
 */
const buildApiUrl = (endpoint: string, params?: Record<string, string>): string => {
  const baseUrl = API_CONSTANTS.BASE_URL;
  const url = new URL(endpoint, `${baseUrl}`);
  
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      url.searchParams.append(key, value);
    });
  }
  
  return url.toString();
};

/**
 * 发起API请求
 */
const makeApiRequest = async (url: string, options: RequestInit): Promise<{
  success: boolean;
  data?: any;
  error?: {
    code: string;
    message: string;
    details?: any;
  };
}> => {
  try {
    // 模拟网络请求
    return new Promise((resolve) => {
      setTimeout(() => {
        const success = Math.random() > 0.05; // 95% 成功率
        
        if (success) {
          // 模拟成功响应
          resolve({
            success: true,
            data: generateMockLikeResponse(url, options),
          });
        } else {
          // 模拟失败响应
          resolve({
            success: false,
            error: {
              code: 'API_ERROR',
              message: '服务器错误',
            },
          });
        }
      }, Math.random() * 1000 + 200); // 200-1200ms 随机延迟
    });
  } catch (error) {
    return {
      success: false,
      error: {
        code: 'REQUEST_ERROR',
        message: '请求失败',
        details: error,
      },
    };
  }
};

/**
 * 生成模拟点赞响应
 */
const generateMockLikeResponse = (url: string, options: RequestInit): any => {
  if (url.includes('/like-status')) {
    // 模拟点赞状态响应
    return {
      statuses: [
        {
          contentId: 'content_1',
          isLiked: Math.random() > 0.5,
          likeCount: Math.floor(Math.random() * 1000),
        },
      ],
    };
  } else if (url.includes('/batch-like')) {
    // 模拟批量点赞响应
    return {
      results: [
        {
          contentId: 'content_1',
          success: true,
          isLiked: true,
          likeCount: Math.floor(Math.random() * 1000),
        },
      ],
      successCount: 1,
      failureCount: 0,
    };
  } else if (url.includes('/user-likes')) {
    // 模拟用户点赞历史响应
    return {
      likes: Array.from({ length: 10 }, (_, index) => ({
        contentId: `content_${index}`,
        likedAt: new Date(Date.now() - index * 24 * 60 * 60 * 1000).toISOString(),
        contentTitle: `点赞的内容 ${index + 1}`,
        contentImageUrl: `https://picsum.photos/300/400?random=${index}`,
      })),
      pagination: {
        page: 1,
        limit: 20,
        total: 100,
        hasMore: true,
      },
    };
  } else {
    // 模拟单个点赞响应
    return {
      contentId: 'content_1',
      isLiked: true,
      likeCount: Math.floor(Math.random() * 1000),
      timestamp: new Date().toISOString(),
    };
  }
};

/**
 * 转换点赞响应
 */
const transformLikeResponse = (rawData: any): LikeContentResponse => {
  return {
    contentId: rawData.contentId,
    isLiked: rawData.isLiked,
    likeCount: rawData.likeCount,
    timestamp: rawData.timestamp,
  };
};

/**
 * 转换批量点赞响应
 */
const transformBatchLikeResponse = (rawData: any): BatchLikeResponse => {
  return {
    results: rawData.results,
    successCount: rawData.successCount,
    failureCount: rawData.failureCount,
  };
};

/**
 * 转换点赞状态响应
 */
const transformLikeStatusResponse = (rawData: any): LikeStatusResponse => {
  return {
    statuses: rawData.statuses,
  };
};

/**
 * 生成请求ID
 */
const generateRequestId = (): string => {
  return `req_like_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};

// =====================================================
// API配置和工具
// =====================================================

/**
 * 点赞API客户端配置
 */
export const likeApiConfig = {
  baseUrl: API_CONSTANTS.BASE_URL,
  timeout: API_CONSTANTS.TIMEOUT,
  retryCount: API_CONSTANTS.RETRY_COUNT,
  retryDelay: API_CONSTANTS.RETRY_DELAY,
};

/**
 * 设置点赞API配置
 */
export const setLikeApiConfig = (config: Partial<typeof likeApiConfig>) => {
  Object.assign(likeApiConfig, config);
};
