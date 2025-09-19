/**
 * 瀑布流内容API接口
 * 基于通用组件架构核心标准 - API接口层
 * 
 * @version 2.0.0
 * @author 架构团队
 */

import { ContentItem, TabType, PaginationParams, ContentListResponse } from './types';
import { API_CONSTANTS } from './constants';

// =====================================================
// API请求参数接口
// =====================================================

export interface FetchContentListParams extends PaginationParams {
  userId?: string;
  location?: {
    latitude: number;
    longitude: number;
  };
  filters?: {
    contentType?: ('image' | 'video' | 'live')[];
    dateRange?: {
      start: string;
      end: string;
    };
    tags?: string[];
  };
}

export interface RefreshContentParams {
  tabType: TabType;
  userId?: string;
  location?: {
    latitude: number;
    longitude: number;
  };
  lastRefreshTime?: string;
}

// =====================================================
// API响应接口
// =====================================================

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
 * 获取瀑布流内容列表
 * @param params 请求参数
 * @returns 内容列表响应
 */
export const fetchWaterfallContentList = async (
  params: FetchContentListParams
): Promise<ApiResponse<ContentListResponse>> => {
  try {
    const { tabType, page, limit, lastItemId, userId, location, filters } = params;

    // 构建请求URL
    const url = buildApiUrl('/waterfall/content', {
      tab: tabType,
      page: page.toString(),
      limit: limit.toString(),
      ...(lastItemId && { lastItemId }),
      ...(userId && { userId }),
      ...(location && { 
        lat: location.latitude.toString(),
        lng: location.longitude.toString()
      }),
      ...(filters?.contentType && { 
        types: filters.contentType.join(',')
      }),
      ...(filters?.tags && { 
        tags: filters.tags.join(',')
      }),
    });

    // 发起请求
    const response = await makeApiRequest(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'WaterfallModule/2.0.0',
      },
    });

    if (response.success && response.data) {
      // 数据转换和验证
      const transformedData = transformContentListResponse(response.data);
      
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
          code: 'FETCH_ERROR',
          message: '获取内容列表失败',
        },
      };
    }
  } catch (error) {
    console.error('获取瀑布流内容列表失败:', error);
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
 * 刷新瀑布流内容
 * @param params 刷新参数
 * @returns 刷新响应
 */
export const refreshWaterfallContent = async (
  params: RefreshContentParams
): Promise<ApiResponse<ContentListResponse>> => {
  try {
    const { tabType, userId, location, lastRefreshTime } = params;

    const url = buildApiUrl('/waterfall/refresh', {
      tab: tabType,
      ...(userId && { userId }),
      ...(location && { 
        lat: location.latitude.toString(),
        lng: location.longitude.toString()
      }),
      ...(lastRefreshTime && { lastRefreshTime }),
    });

    const response = await makeApiRequest(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'WaterfallModule/2.0.0',
      },
      body: JSON.stringify({
        refreshTime: new Date().toISOString(),
        clientVersion: '2.0.0',
      }),
    });

    if (response.success && response.data) {
      const transformedData = transformContentListResponse(response.data);
      
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
          code: 'REFRESH_ERROR',
          message: '刷新内容失败',
        },
      };
    }
  } catch (error) {
    console.error('刷新瀑布流内容失败:', error);
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
 * 获取推荐内容
 * @param userId 用户ID
 * @param count 推荐数量
 * @returns 推荐内容响应
 */
export const fetchRecommendedContent = async (
  userId?: string,
  count: number = 10
): Promise<ApiResponse<ContentItem[]>> => {
  try {
    const url = buildApiUrl('/waterfall/recommend', {
      count: count.toString(),
      ...(userId && { userId }),
    });

    const response = await makeApiRequest(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (response.success && response.data) {
      const transformedData = response.data.map(transformContentItem);
      
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
          code: 'RECOMMEND_ERROR',
          message: '获取推荐内容失败',
        },
      };
    }
  } catch (error) {
    console.error('获取推荐内容失败:', error);
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
        const success = Math.random() > 0.1; // 90% 成功率
        
        if (success) {
          // 模拟成功响应
          resolve({
            success: true,
            data: generateMockContentList(),
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
      }, Math.random() * 1000 + 500); // 500-1500ms 随机延迟
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
 * 生成模拟内容列表
 */
const generateMockContentList = (): any => {
  const itemCount = Math.floor(Math.random() * 20) + 10; // 10-30 items
  const items = Array.from({ length: itemCount }, (_, index) => ({
    id: `content_${Date.now()}_${index}`,
    title: `精彩内容 ${index + 1}`,
    imageUrl: `https://picsum.photos/300/${300 + Math.floor(Math.random() * 200)}?random=${Date.now()}_${index}`,
    width: 300,
    height: 300 + Math.floor(Math.random() * 200),
    type: ['image', 'video', 'live'][Math.floor(Math.random() * 3)],
    likeCount: Math.floor(Math.random() * 1000),
    isLiked: Math.random() > 0.7,
    isCollected: Math.random() > 0.8,
    commentCount: Math.floor(Math.random() * 100),
    shareCount: Math.floor(Math.random() * 50),
    createdAt: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date().toISOString(),
    user: {
      id: `user_${Math.random().toString(36).substr(2, 9)}`,
      nickname: `用户${Math.floor(Math.random() * 1000)}`,
      avatar: `https://picsum.photos/50/50?random=user_${Date.now()}_${index}`,
      isFollowing: Math.random() > 0.6,
    },
  }));

  return {
    data: items,
    pagination: {
      page: 1,
      limit: 20,
      total: itemCount + Math.floor(Math.random() * 1000),
      hasMore: Math.random() > 0.3,
    },
    metadata: {
      totalCount: itemCount,
      refreshTime: new Date().toISOString(),
      algorithm: 'v2.0',
    },
  };
};

/**
 * 转换内容列表响应
 */
const transformContentListResponse = (rawData: any): ContentListResponse => {
  return {
    data: rawData.data.map(transformContentItem),
    pagination: rawData.pagination,
    metadata: rawData.metadata,
  };
};

/**
 * 转换内容项
 */
const transformContentItem = (rawItem: any): ContentItem => {
  return {
    id: rawItem.id,
    title: rawItem.title,
    imageUrl: rawItem.imageUrl,
    width: rawItem.width,
    height: rawItem.height,
    type: rawItem.type,
    likeCount: rawItem.likeCount,
    isLiked: rawItem.isLiked,
    isCollected: rawItem.isCollected,
    commentCount: rawItem.commentCount,
    shareCount: rawItem.shareCount,
    createdAt: rawItem.createdAt,
    updatedAt: rawItem.updatedAt,
    user: {
      id: rawItem.user.id,
      nickname: rawItem.user.nickname,
      avatar: rawItem.user.avatar,
      isFollowing: rawItem.user.isFollowing,
      verified: rawItem.user.verified,
      level: rawItem.user.level,
    },
    liveRoomId: rawItem.liveRoomId,
    videoUrl: rawItem.videoUrl,
    description: rawItem.description,
    tags: rawItem.tags,
  };
};

/**
 * 生成请求ID
 */
const generateRequestId = (): string => {
  return `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};

// =====================================================
// API配置和工具
// =====================================================

/**
 * API客户端配置
 */
export const apiConfig = {
  baseUrl: API_CONSTANTS.BASE_URL,
  timeout: API_CONSTANTS.TIMEOUT,
  retryCount: API_CONSTANTS.RETRY_COUNT,
  retryDelay: API_CONSTANTS.RETRY_DELAY,
};

/**
 * 设置API配置
 */
export const setApiConfig = (config: Partial<typeof apiConfig>) => {
  Object.assign(apiConfig, config);
};
