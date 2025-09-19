/**
 * 瀑布流分页API接口
 * 基于通用组件架构核心标准 - API接口层
 * 
 * @version 2.0.0
 * @author 架构团队
 */

import { TabType, PaginationParams, PaginationResponse, ContentItem } from './types';
import { API_CONSTANTS } from './constants';

// =====================================================
// API请求参数接口
// =====================================================

export interface PaginationRequestParams extends PaginationParams {
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
    minLikeCount?: number;
    maxLikeCount?: number;
  };
  sortBy?: 'created' | 'likes' | 'comments' | 'hot';
  sortOrder?: 'asc' | 'desc';
}

export interface CursorPaginationParams {
  tabType: TabType;
  cursor?: string; // 游标分页
  limit: number;
  direction?: 'forward' | 'backward';
  userId?: string;
}

// =====================================================
// API响应接口
// =====================================================

export interface PaginationMetadata {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasMore: boolean;
  hasPrevious: boolean;
  nextCursor?: string;
  previousCursor?: string;
}

export interface CursorPaginationResponse<T> {
  data: T[];
  pagination: {
    cursor?: string;
    nextCursor?: string;
    previousCursor?: string;
    hasMore: boolean;
    hasPrevious: boolean;
    limit: number;
  };
  metadata?: {
    totalCount?: number;
    algorithm?: string;
    refreshTime: string;
  };
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
 * 基于页码的分页查询
 * @param params 分页参数
 * @returns 分页响应
 */
export const fetchPaginatedWaterfallContent = async (
  params: PaginationRequestParams
): Promise<ApiResponse<PaginationResponse<ContentItem>>> => {
  try {
    const { 
      page, 
      limit, 
      tabType, 
      lastItemId, 
      userId, 
      location, 
      filters, 
      sortBy = 'created', 
      sortOrder = 'desc' 
    } = params;

    // 构建请求URL
    const url = buildApiUrl('/waterfall/paginated', {
      page: page.toString(),
      limit: limit.toString(),
      tabType,
      sortBy,
      sortOrder,
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
      ...(filters?.minLikeCount && { 
        minLikes: filters.minLikeCount.toString()
      }),
      ...(filters?.maxLikeCount && { 
        maxLikes: filters.maxLikeCount.toString()
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
      const transformedData = transformPaginationResponse(response.data);
      
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
          code: 'PAGINATION_ERROR',
          message: '分页查询失败',
        },
      };
    }
  } catch (error) {
    console.error('分页查询失败:', error);
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
 * 基于游标的分页查询
 * @param params 游标分页参数
 * @returns 游标分页响应
 */
export const fetchCursorPaginatedContent = async (
  params: CursorPaginationParams
): Promise<ApiResponse<CursorPaginationResponse<ContentItem>>> => {
  try {
    const { tabType, cursor, limit, direction = 'forward', userId } = params;

    const url = buildApiUrl('/waterfall/cursor-paginated', {
      tabType,
      limit: limit.toString(),
      direction,
      ...(cursor && { cursor }),
      ...(userId && { userId }),
    });

    const response = await makeApiRequest(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'WaterfallModule/2.0.0',
      },
    });

    if (response.success && response.data) {
      const transformedData = transformCursorPaginationResponse(response.data);
      
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
          code: 'CURSOR_PAGINATION_ERROR',
          message: '游标分页查询失败',
        },
      };
    }
  } catch (error) {
    console.error('游标分页查询失败:', error);
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
 * 获取分页统计信息
 * @param tabType 标签页类型
 * @param userId 用户ID
 * @returns 统计信息响应
 */
export const getPaginationStats = async (
  tabType: TabType,
  userId?: string
): Promise<ApiResponse<{
  totalCount: number;
  totalPages: number;
  averagePageSize: number;
  lastUpdated: string;
  contentDistribution: {
    image: number;
    video: number;
    live: number;
  };
}>> => {
  try {
    const url = buildApiUrl('/waterfall/pagination-stats', {
      tabType,
      ...(userId && { userId }),
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
          code: 'STATS_ERROR',
          message: '获取统计信息失败',
        },
      };
    }
  } catch (error) {
    console.error('获取分页统计失败:', error);
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
 * 预加载下一页内容
 * @param params 预加载参数
 * @returns 预加载响应
 */
export const preloadNextPage = async (
  params: PaginationRequestParams
): Promise<ApiResponse<PaginationResponse<ContentItem>>> => {
  try {
    // 预加载下一页
    const nextPageParams = {
      ...params,
      page: params.page + 1,
    };

    const url = buildApiUrl('/waterfall/preload', {
      page: nextPageParams.page.toString(),
      limit: nextPageParams.limit.toString(),
      tabType: nextPageParams.tabType,
      priority: 'low', // 低优先级预加载
    });

    const response = await makeApiRequest(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'max-age=300', // 5分钟缓存
      },
    });

    if (response.success && response.data) {
      const transformedData = transformPaginationResponse(response.data);
      
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
          code: 'PRELOAD_ERROR',
          message: '预加载失败',
        },
      };
    }
  } catch (error) {
    console.error('预加载下一页失败:', error);
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
            data: generateMockPaginationResponse(url),
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
      }, Math.random() * 1500 + 500); // 500-2000ms 随机延迟
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
 * 生成模拟分页响应
 */
const generateMockPaginationResponse = (url: string): any => {
  const urlObj = new URL(url);
  const page = parseInt(urlObj.searchParams.get('page') || '1');
  const limit = parseInt(urlObj.searchParams.get('limit') || '20');

  if (url.includes('/pagination-stats')) {
    // 模拟统计信息响应
    return {
      totalCount: 10000,
      totalPages: 500,
      averagePageSize: 20,
      lastUpdated: new Date().toISOString(),
      contentDistribution: {
        image: 6000,
        video: 3000,
        live: 1000,
      },
    };
  } else if (url.includes('/cursor-paginated')) {
    // 模拟游标分页响应
    const itemCount = Math.min(limit, Math.floor(Math.random() * limit) + 1);
    const items = Array.from({ length: itemCount }, (_, index) => ({
      id: `cursor_${Date.now()}_${page}_${index}`,
      title: `游标分页内容 ${page}-${index + 1}`,
      imageUrl: `https://picsum.photos/300/${300 + Math.floor(Math.random() * 200)}?random=cursor_${page}_${index}`,
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
        avatar: `https://picsum.photos/50/50?random=user_cursor_${index}`,
        isFollowing: Math.random() > 0.6,
      },
    }));

    return {
      data: items,
      pagination: {
        cursor: `cursor_${page}`,
        nextCursor: `cursor_${page + 1}`,
        previousCursor: page > 1 ? `cursor_${page - 1}` : null,
        hasMore: Math.random() > 0.2,
        hasPrevious: page > 1,
        limit,
      },
      metadata: {
        totalCount: 10000,
        algorithm: 'timeline_v2',
        refreshTime: new Date().toISOString(),
      },
    };
  } else {
    // 模拟标准分页响应
    const itemCount = Math.min(limit, Math.floor(Math.random() * limit) + 1);
    const items = Array.from({ length: itemCount }, (_, index) => ({
      id: `page_${Date.now()}_${page}_${index}`,
      title: `分页内容 ${page}-${index + 1}`,
      imageUrl: `https://picsum.photos/300/${300 + Math.floor(Math.random() * 200)}?random=page_${page}_${index}`,
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
        avatar: `https://picsum.photos/50/50?random=user_page_${index}`,
        isFollowing: Math.random() > 0.6,
      },
    }));

    const totalCount = 10000;
    const totalPages = Math.ceil(totalCount / limit);

    return {
      data: items,
      pagination: {
        page,
        limit,
        total: totalCount,
        totalPages,
        hasMore: page < totalPages,
        hasPrevious: page > 1,
      },
      metadata: {
        totalCount,
        refreshTime: new Date().toISOString(),
        algorithm: 'recommendation_v2',
      },
    };
  }
};

/**
 * 转换分页响应
 */
const transformPaginationResponse = (rawData: any): PaginationResponse<ContentItem> => {
  return {
    data: rawData.data.map(transformContentItem),
    pagination: {
      page: rawData.pagination.page,
      limit: rawData.pagination.limit,
      total: rawData.pagination.total,
      hasMore: rawData.pagination.hasMore,
      nextCursor: rawData.pagination.nextCursor,
    },
  };
};

/**
 * 转换游标分页响应
 */
const transformCursorPaginationResponse = (rawData: any): CursorPaginationResponse<ContentItem> => {
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
  return `req_pagination_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};

// =====================================================
// API配置和工具
// =====================================================

/**
 * 分页API客户端配置
 */
export const paginationApiConfig = {
  baseUrl: API_CONSTANTS.BASE_URL,
  timeout: API_CONSTANTS.TIMEOUT,
  retryCount: API_CONSTANTS.RETRY_COUNT,
  retryDelay: API_CONSTANTS.RETRY_DELAY,
  defaultPageSize: API_CONSTANTS.DEFAULT_PAGE_SIZE,
  maxPageSize: API_CONSTANTS.MAX_PAGE_SIZE,
};

/**
 * 设置分页API配置
 */
export const setPaginationApiConfig = (config: Partial<typeof paginationApiConfig>) => {
  Object.assign(paginationApiConfig, config);
};
