/**
 * 话题详情页面API服务
 * 
 * TOC (快速跳转):
 * [1] Imports
 * [2] Types & Schema  
 * [3] Constants & Config
 * [4] Utils & Helpers
 * [5] API Base Configuration
 * [6] Service Methods
 * [7] Error Handling
 * [8] Exports
 */

// #region 1. Imports
import {
  GetTopicInfoRequest,
  GetTopicInfoResponse,
  GetTopicPostsRequest,
  GetTopicPostsResponse,
  LikeTopicPostRequest,
  LikeTopicPostResponse,
  TopicInfo,
  TopicPostItem,
  PostUser,
} from '../types';
import { TOPIC_DETAIL_CONSTANTS } from '../constants';
// #endregion

// #region 2. Types & Schema
interface ApiResponse<T = any> {
  success: boolean;
  data: T;
  message?: string;
  code?: number;
}

interface ApiError {
  message: string;
  code?: number;
  details?: any;
}
// #endregion

// #region 3. Constants & Config
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'https://api.example.com';
const API_TIMEOUT = TOPIC_DETAIL_CONSTANTS.NETWORK_TIMEOUT;
const MOCK_DELAY = 800; // 模拟网络延迟

// API路径配置
const API_PATHS = {
  TOPIC_INFO: '/api/topics/{topicId}',
  TOPIC_POSTS: '/api/topics/{topicId}/posts',
  POST_LIKE: '/api/posts/{postId}/like',
  POST_UNLIKE: '/api/posts/{postId}/unlike',
} as const;
// #endregion

// #region 4. Utils & Helpers
// 模拟网络延迟
const mockDelay = (ms: number = MOCK_DELAY): Promise<void> => {
  return new Promise(resolve => setTimeout(resolve, ms));
};

// URL参数替换
const replaceUrlParams = (url: string, params: Record<string, string>): string => {
  let result = url;
  Object.entries(params).forEach(([key, value]) => {
    result = result.replace(`{${key}}`, encodeURIComponent(value));
  });
  return result;
};

// HTTP请求包装器（模拟）
const mockFetch = async <T>(
  url: string, 
  options: RequestInit = {}
): Promise<ApiResponse<T>> => {
  await mockDelay();
  
  // 这里应该是真实的网络请求
  // const response = await fetch(`${API_BASE_URL}${url}`, {
  //   ...options,
  //   timeout: API_TIMEOUT,
  // });
  // return response.json();
  
  // 模拟响应
  return { success: true, data: {} as T };
};

// 生成模拟数据
const generateMockUser = (id: string): PostUser => ({
  id,
  nickname: `用户名称${Math.floor(Math.random() * 1000)}`,
  avatar: `https://picsum.photos/48/48?random=${id}`,
  badge: Math.random() > 0.7 ? {
    type: Math.random() > 0.5 ? 'popular' : 'verified',
    label: Math.random() > 0.5 ? '人气用户' : '认证用户',
    color: Math.random() > 0.5 ? TOPIC_DETAIL_CONSTANTS.POPULAR_COLOR : TOPIC_DETAIL_CONSTANTS.VERIFIED_COLOR,
  } : undefined,
  level: Math.floor(Math.random() * 10) + 1,
  isFollowing: Math.random() > 0.5,
  followCount: Math.floor(Math.random() * 100),
});

const generateMockPost = (id: string, topicId: string): TopicPostItem => ({
  id,
  title: `新赛季，新征程 ${id}`,
  content: `英雄联盟2021新赛季已开启，段位解锁更改让赛季初上分更激动人心❤️，速速上分，体验全新的游戏内容和玩法机制。这个赛季带来了很多有趣的改动...`,
  user: generateMockUser(`user_${id}`),
  images: Math.random() > 0.3 ? [`https://picsum.photos/400/240?random=${id}`] : undefined,
  location: Math.random() > 0.6 ? {
    name: '河北',
    address: '河北省石家庄市',
    latitude: 38.0428,
    longitude: 114.5149,
  } : undefined,
  hashtags: ['S10全球总决赛', '英雄联盟', '新赛季'],
  stats: {
    likeCount: Math.floor(Math.random() * 100) + 1,
    commentCount: Math.floor(Math.random() * 50),
    shareCount: Math.floor(Math.random() * 20),
    viewCount: Math.floor(Math.random() * 1000) + 100,
  },
  interactions: {
    isLiked: Math.random() > 0.7,
    isCollected: Math.random() > 0.8,
    isFollowing: Math.random() > 0.6,
  },
  createdAt: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString(),
  updatedAt: new Date().toISOString(),
});
// #endregion

// #region 5. API Base Configuration
const createApiService = () => {
  return {
    // GET请求
    get: async <T>(url: string): Promise<ApiResponse<T>> => {
      return mockFetch<T>(url, { method: 'GET' });
    },
    
    // POST请求
    post: async <T>(url: string, data?: any): Promise<ApiResponse<T>> => {
      return mockFetch<T>(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: data ? JSON.stringify(data) : undefined,
      });
    },
    
    // PUT请求
    put: async <T>(url: string, data?: any): Promise<ApiResponse<T>> => {
      return mockFetch<T>(url, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: data ? JSON.stringify(data) : undefined,
      });
    },
    
    // DELETE请求
    delete: async <T>(url: string): Promise<ApiResponse<T>> => {
      return mockFetch<T>(url, { method: 'DELETE' });
    },
  };
};

const api = createApiService();
// #endregion

// #region 6. Service Methods
export const apiTopicDetail = {
  // 获取话题信息
  getTopicInfo: async (request: GetTopicInfoRequest): Promise<GetTopicInfoResponse> => {
    try {
      // 模拟API响应
      await mockDelay();
      
      const mockTopicInfo: TopicInfo = {
        id: request.topicId,
        name: 'S10全球总决赛',
        title: 'S10全球总决赛',
        description: '关于英雄联盟S10全球总决赛的所有精彩内容和讨论',
        coverImage: `https://picsum.photos/400/200?random=${request.topicId}`,
        postCount: Math.floor(Math.random() * 1000) + 100,
        participantCount: Math.floor(Math.random() * 500) + 50,
        isFollowing: Math.random() > 0.5,
        hotness: Math.floor(Math.random() * 10000) + 1000,
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: new Date().toISOString(),
        tags: ['游戏', '电竞', 'LOL'],
        category: '游戏',
      };

      return {
        success: true,
        data: mockTopicInfo,
      };
    } catch (error) {
      console.error('Get topic info error:', error);
      return {
        success: false,
        data: {} as TopicInfo,
        message: '获取话题信息失败',
      };
    }
  },

  // 获取话题动态列表
  getTopicPosts: async (request: GetTopicPostsRequest): Promise<GetTopicPostsResponse> => {
    try {
      await mockDelay();
      
      const page = request.page || 1;
      const pageSize = request.pageSize || TOPIC_DETAIL_CONSTANTS.DEFAULT_PAGE_SIZE;
      const total = 156; // 模拟总数
      const totalPages = Math.ceil(total / pageSize);
      
      // 生成模拟动态数据
      const posts: TopicPostItem[] = [];
      for (let i = 0; i < pageSize; i++) {
        const postId = `post_${page}_${i}`;
        posts.push(generateMockPost(postId, request.topicId));
      }

      return {
        success: true,
        data: {
          posts,
          pagination: {
            page,
            pageSize,
            total,
            totalPages,
            hasMore: page < totalPages,
          },
        },
      };
    } catch (error) {
      console.error('Get topic posts error:', error);
      return {
        success: false,
        data: {
          posts: [],
          pagination: {
            page: 1,
            pageSize: 20,
            total: 0,
            totalPages: 0,
            hasMore: false,
          },
        },
        message: '获取动态列表失败',
      };
    }
  },

  // 点赞/取消点赞动态
  likePost: async (request: LikeTopicPostRequest): Promise<LikeTopicPostResponse> => {
    try {
      await mockDelay(300); // 点赞操作稍快一些
      
      const isLiked = request.action === 'like';
      const likeCount = Math.floor(Math.random() * 100) + (isLiked ? 1 : 0);

      return {
        success: true,
        data: {
          postId: request.postId,
          isLiked,
          likeCount,
        },
      };
    } catch (error) {
      console.error('Like post error:', error);
      return {
        success: false,
        data: {
          postId: request.postId,
          isLiked: false,
          likeCount: 0,
        },
        message: '操作失败',
      };
    }
  },

  // 收藏/取消收藏动态
  collectPost: async (postId: string, action: 'collect' | 'uncollect') => {
    try {
      await mockDelay(300);
      
      return {
        success: true,
        data: {
          postId,
          isCollected: action === 'collect',
        },
      };
    } catch (error) {
      console.error('Collect post error:', error);
      return {
        success: false,
        data: {
          postId,
          isCollected: false,
        },
        message: '操作失败',
      };
    }
  },

  // 关注/取消关注用户
  followUser: async (userId: string, action: 'follow' | 'unfollow') => {
    try {
      await mockDelay(400);
      
      return {
        success: true,
        data: {
          userId,
          isFollowing: action === 'follow',
        },
      };
    } catch (error) {
      console.error('Follow user error:', error);
      return {
        success: false,
        data: {
          userId,
          isFollowing: false,
        },
        message: '操作失败',
      };
    }
  },
};
// #endregion

// #region 7. Error Handling
export const handleApiError = (error: any): ApiError => {
  if (error.response) {
    // 服务器响应错误
    return {
      message: error.response.data?.message || '服务器错误',
      code: error.response.status,
      details: error.response.data,
    };
  }
  
  if (error.request) {
    // 网络请求错误
    return {
      message: '网络连接失败，请检查网络设置',
      code: 0,
    };
  }
  
  // 其他错误
  return {
    message: error.message || '未知错误',
    code: -1,
  };
};
// #endregion

// #region 8. Exports
export default apiTopicDetail;

// 导出API相关工具
export {
  API_PATHS,
  replaceUrlParams,
  mockDelay,
};

// 导出类型
export type {
  ApiResponse,
  ApiError,
};
// #endregion
