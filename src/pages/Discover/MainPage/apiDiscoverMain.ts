/**
 * 发现主页面API接口层
 * 前端调用入口 - 主页面相关接口
 * 
 * TOC (快速跳转):
 * [1] Imports
 * [2] Types & Schema  
 * [3] Constants & Config
 * [4] Utils & Helpers
 * [5] API Methods
 * [6] Error Handling
 * [7] Cache Management
 * [8] Exports
 */

// #region 1. Imports
import { 
  ContentListParams, 
  ContentListResponse, 
  LikeActionParams, 
  LikeActionResponse,
  ContentItem,
  DiscoverTabType 
} from './types';
import { API_CONFIG } from './constants';
// #endregion

// #region 2. Types & Schema
interface ApiResponse<T> {
  code: number;
  message: string;
  data: T;
  timestamp: number;
}

interface PaginationMeta {
  currentPage: number;
  pageSize: number;
  total: number;
  hasMore: boolean;
}

interface ContentListData {
  list: ContentItem[];
  pagination: PaginationMeta;
  nextCursor?: string;
}

interface UserActionData {
  success: boolean;
  newState: boolean;
  count: number;
}
// #endregion

// #region 3. Constants & Config
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:8080/api';

const ENDPOINTS = {
  // 内容列表相关 - 前端三个Tab实际需要的接口
  HOT_CONTENT: '/discover/content/hot',
  FOLLOW_CONTENT: '/discover/content/follow', 
  LOCAL_CONTENT: '/discover/content/local',
  
  // 用户互动相关 - 前端卡片实际需要的交互
  LIKE_CONTENT: '/discover/interaction/like',
  COLLECT_CONTENT: '/discover/interaction/collect',
  
  // 用户关系相关 - 前端用户头像点击实际需要
  FOLLOW_USER: '/discover/user/follow',
} as const;

const REQUEST_CONFIG = {
  timeout: API_CONFIG.REQUEST_TIMEOUT,
  retryCount: API_CONFIG.MAX_RETRY_COUNT,
  retryDelay: API_CONFIG.RETRY_DELAY,
} as const;
// #endregion

// #region 4. Utils & Helpers
class ApiClient {
  private baseURL: string;
  private defaultHeaders: Record<string, string>;

  constructor() {
    this.baseURL = API_BASE_URL;
    this.defaultHeaders = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    };
  }

  private async request<T>(
    endpoint: string, 
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const url = `${this.baseURL}${endpoint}`;
    const config: RequestInit = {
      ...options,
      headers: {
        ...this.defaultHeaders,
        ...options.headers,
      },
      timeout: REQUEST_CONFIG.timeout,
    };

    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      const result = await response.json();
      return result;
    } catch (error) {
      console.error(`API请求失败: ${endpoint}`, error);
      throw this.handleError(error);
    }
  }

  private handleError(error: any): Error {
    if (error.name === 'AbortError') {
      return new Error('请求超时，请稍后重试');
    }
    if (error.message?.includes('Failed to fetch')) {
      return new Error('网络连接失败，请检查网络设置');
    }
    return error;
  }

  async get<T>(endpoint: string, params?: Record<string, any>): Promise<ApiResponse<T>> {
    const url = params ? `${endpoint}?${new URLSearchParams(params)}` : endpoint;
    return this.request<T>(url, { method: 'GET' });
  }

  async post<T>(endpoint: string, data?: any): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async put<T>(endpoint: string, data?: any): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async delete<T>(endpoint: string): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { method: 'DELETE' });
  }
}

const apiClient = new ApiClient();
// #endregion

// #region 5. API Methods

/**
 * 获取热门内容列表
 */
export const getHotContentList = async (params: ContentListParams): Promise<ContentListResponse> => {
  try {
    const response = await apiClient.get<ContentListData>(ENDPOINTS.HOT_CONTENT, {
      page: params.page,
      size: params.size,
      userId: params.userId,
      lastId: params.lastId,
      filter: params.filter ? JSON.stringify(params.filter) : undefined,
    });

    return {
      code: response.code,
      message: response.message,
      data: {
        list: response.data.list,
        hasMore: response.data.pagination.hasMore,
        nextCursor: response.data.nextCursor,
        total: response.data.pagination.total,
      },
    };
  } catch (error) {
    throw new Error(`获取热门内容失败: ${error.message}`);
  }
};

/**
 * 获取关注用户内容列表
 */
export const getFollowContentList = async (params: ContentListParams): Promise<ContentListResponse> => {
  if (!params.userId) {
    throw new Error('获取关注内容需要用户登录');
  }

  try {
    const response = await apiClient.get<ContentListData>(ENDPOINTS.FOLLOW_CONTENT, {
      page: params.page,
      size: params.size,
      userId: params.userId,
      lastId: params.lastId,
      filter: params.filter ? JSON.stringify(params.filter) : undefined,
    });

    return {
      code: response.code,
      message: response.message,
      data: {
        list: response.data.list,
        hasMore: response.data.pagination.hasMore,
        nextCursor: response.data.nextCursor,
        total: response.data.pagination.total,
      },
    };
  } catch (error) {
    throw new Error(`获取关注内容失败: ${error.message}`);
  }
};

/**
 * 获取同城内容列表
 */
export const getLocalContentList = async (params: ContentListParams): Promise<ContentListResponse> => {
  if (!params.location) {
    throw new Error('获取同城内容需要位置信息');
  }

  try {
    const response = await apiClient.get<ContentListData>(ENDPOINTS.LOCAL_CONTENT, {
      page: params.page,
      size: params.size,
      userId: params.userId,
      lastId: params.lastId,
      latitude: params.location.latitude,
      longitude: params.location.longitude,
      radius: params.filter?.distance || 5, // 默认5km
      filter: params.filter ? JSON.stringify(params.filter) : undefined,
    });

    return {
      code: response.code,
      message: response.message,
      data: {
        list: response.data.list,
        hasMore: response.data.pagination.hasMore,
        nextCursor: response.data.nextCursor,
        total: response.data.pagination.total,
      },
    };
  } catch (error) {
    throw new Error(`获取同城内容失败: ${error.message}`);
  }
};

/**
 * 点赞/取消点赞内容
 */
export const toggleLikeContent = async (params: LikeActionParams): Promise<LikeActionResponse> => {
  try {
    const response = await apiClient.post<UserActionData>(ENDPOINTS.LIKE_CONTENT, {
      contentId: params.contentId,
      action: params.action,
    });

    return {
      code: response.code,
      message: response.message,
      data: {
        liked: response.data.newState,
        likeCount: response.data.count,
      },
    };
  } catch (error) {
    throw new Error(`点赞操作失败: ${error.message}`);
  }
};

/**
 * 收藏/取消收藏内容
 */
export const toggleCollectContent = async (contentId: string, action: 'collect' | 'uncollect') => {
  try {
    const response = await apiClient.post<UserActionData>(ENDPOINTS.COLLECT_CONTENT, {
      contentId,
      action,
    });

    return {
      code: response.code,
      message: response.message,
      data: {
        collected: response.data.newState,
        collectCount: response.data.count,
      },
    };
  } catch (error) {
    throw new Error(`收藏操作失败: ${error.message}`);
  }
};

/**
 * 关注/取消关注用户
 * 前端需要：用户头像点击时关注操作
 */
export const toggleFollowUser = async (userId: string, action: 'follow' | 'unfollow') => {
  try {
    const response = await apiClient.post<UserActionData>(ENDPOINTS.FOLLOW_USER, {
      userId,
      action,
    });

    return {
      code: response.code,
      message: response.message,
      data: {
        followed: response.data.newState,
        followerCount: response.data.count,
      },
    };
  } catch (error) {
    throw new Error(`关注操作失败: ${error.message}`);
  }
};
// #endregion

// #region 6. Error Handling
export class DiscoverApiError extends Error {
  public code: string;
  public statusCode?: number;

  constructor(message: string, code: string = 'UNKNOWN_ERROR', statusCode?: number) {
    super(message);
    this.name = 'DiscoverApiError';
    this.code = code;
    this.statusCode = statusCode;
  }
}

export const handleApiError = (error: any): DiscoverApiError => {
  if (error instanceof DiscoverApiError) {
    return error;
  }

  // 网络错误
  if (error.message?.includes('Failed to fetch')) {
    return new DiscoverApiError('网络连接失败，请检查网络设置', 'NETWORK_ERROR');
  }

  // 超时错误
  if (error.name === 'AbortError') {
    return new DiscoverApiError('请求超时，请稍后重试', 'TIMEOUT_ERROR');
  }

  // HTTP错误
  if (error.message?.includes('HTTP')) {
    const statusCode = parseInt(error.message.match(/HTTP (\d+)/)?.[1] || '0');
    switch (statusCode) {
      case 401:
        return new DiscoverApiError('请先登录', 'UNAUTHORIZED', 401);
      case 403:
        return new DiscoverApiError('权限不足', 'FORBIDDEN', 403);
      case 404:
        return new DiscoverApiError('资源不存在', 'NOT_FOUND', 404);
      case 500:
        return new DiscoverApiError('服务器内部错误', 'SERVER_ERROR', 500);
      default:
        return new DiscoverApiError(`请求失败 (${statusCode})`, 'HTTP_ERROR', statusCode);
    }
  }

  return new DiscoverApiError(error.message || '未知错误', 'UNKNOWN_ERROR');
};
// #endregion

// #region 7. Cache Management
class ApiCache {
  private cache = new Map<string, { data: any; expiry: number }>();
  private maxSize = API_CONFIG.MAX_CACHE_SIZE;

  set(key: string, data: any, ttl: number = API_CONFIG.CACHE_EXPIRY_TIME): void {
    // LRU缓存实现
    if (this.cache.size >= this.maxSize) {
      const firstKey = this.cache.keys().next().value;
      this.cache.delete(firstKey);
    }

    this.cache.set(key, {
      data,
      expiry: Date.now() + ttl,
    });
  }

  get(key: string): any | null {
    const cached = this.cache.get(key);
    if (!cached) return null;

    if (cached.expiry < Date.now()) {
      this.cache.delete(key);
      return null;
    }

    return cached.data;
  }

  clear(): void {
    this.cache.clear();
  }

  clearExpired(): void {
    const now = Date.now();
    for (const [key, value] of this.cache.entries()) {
      if (value.expiry < now) {
        this.cache.delete(key);
      }
    }
  }
}

export const apiCache = new ApiCache();

// 自动清理过期缓存
setInterval(() => {
  apiCache.clearExpired();
}, 5 * 60 * 1000); // 每5分钟清理一次
// #endregion

// #region 8. Exports
export default {
  getHotContentList,
  getFollowContentList,
  getLocalContentList,
  toggleLikeContent,
  toggleCollectContent,
  shareContent,
  toggleFollowUser,
  updateUserLocation,
  DiscoverApiError,
  handleApiError,
  apiCache,
};
// #endregion
