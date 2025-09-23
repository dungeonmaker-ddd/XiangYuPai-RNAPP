/**
 * 发现详情页面服务层
 * 
 * TOC (快速跳转):
 * [1] Imports
 * [2] Types & Schema  
 * [3] Constants & Config
 * [4] API Services
 * [5] Data Processing
 * [6] Error Handling
 * [7] Cache Management
 * [8] Exports
 */

// ==================== 1. Imports ====================
import type { ContentItem, CommentItem } from '../types';

// ==================== 2. Types & Schema ====================
interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

interface ContentDetailResponse {
  content: ContentItem;
}

interface CommentsResponse {
  comments: CommentItem[];
  total: number;
  hasMore: boolean;
}

interface LikeResponse {
  success: boolean;
  newCount: number;
}

// ==================== 3. Constants & Config ====================
const API_BASE_URL = 'https://api.example.com';
const ENDPOINTS = {
  CONTENT_DETAIL: '/content',
  COMMENTS: '/comments',
  LIKE: '/like',
  COLLECT: '/collect',
  FOLLOW: '/follow',
  SHARE: '/share',
} as const;

const REQUEST_TIMEOUT = 10000; // 10 seconds

// ==================== 4. API Services ====================
class DetailDataService {
  private static instance: DetailDataService;
  
  public static getInstance(): DetailDataService {
    if (!DetailDataService.instance) {
      DetailDataService.instance = new DetailDataService();
    }
    return DetailDataService.instance;
  }

  /**
   * 获取内容详情
   */
  async getContentDetail(contentId: string): Promise<ContentItem> {
    try {
      // 模拟API调用
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // 模拟返回数据
      const mockContent: ContentItem = {
        id: contentId,
        title: '探索城市中的隐秘角落 🌆',
        description: '今天发现了一个超棒的拍照地点，夕阳西下的时候特别美，分享给大家！',
        imageUrl: 'https://picsum.photos/400/600?random=detail',
        createdAt: '2024-12-19T09:00:00Z',
        user: {
          id: 'user_main',
          nickname: '城市探索者',
          avatar: 'https://picsum.photos/100/100?random=main',
          isFollowing: false,
          verified: true,
          level: 5,
        },
        location: {
          address: '上海市黄浦区外滩',
          latitude: 31.2304,
          longitude: 121.4737,
        },
        tags: ['摄影', '城市探索', '夕阳', '外滩'],
        stats: {
          likeCount: 128,
          collectCount: 45,
          commentCount: 23,
          shareCount: 12,
        },
        interactions: {
          isLiked: false,
          isCollected: false,
        },
      };

      return mockContent;
    } catch (error) {
      throw new Error(`获取内容详情失败: ${error}`);
    }
  }

  /**
   * 获取评论列表
   */
  async getComments(contentId: string, page = 1, limit = 20): Promise<CommentsResponse> {
    try {
      // 模拟API调用
      await new Promise(resolve => setTimeout(resolve, 300));
      
      // 模拟返回数据
      const mockComments: CommentItem[] = [
        {
          id: 'comment_1',
          content: '这个地方真的很漂亮！我也想去看看',
          user: {
            id: 'user_1',
            nickname: '旅行达人小王',
            avatar: 'https://picsum.photos/100/100?random=1',
          },
          likeCount: 12,
          isLiked: false,
          createdAt: '2024-12-19T10:30:00Z',
        },
        {
          id: 'comment_2',
          content: '哇，拍得太好了！请问用的什么相机？',
          user: {
            id: 'user_2',
            nickname: '摄影爱好者',
            avatar: 'https://picsum.photos/100/100?random=2',
          },
          likeCount: 8,
          isLiked: true,
          createdAt: '2024-12-19T11:15:00Z',
        },
      ];

      return {
        comments: mockComments,
        total: mockComments.length,
        hasMore: false,
      };
    } catch (error) {
      throw new Error(`获取评论列表失败: ${error}`);
    }
  }

  /**
   * 点赞/取消点赞
   */
  async toggleLike(contentId: string, isLiked: boolean): Promise<LikeResponse> {
    try {
      // 模拟API调用
      await new Promise(resolve => setTimeout(resolve, 200));
      
      return {
        success: true,
        newCount: isLiked ? 129 : 127,
      };
    } catch (error) {
      throw new Error(`点赞操作失败: ${error}`);
    }
  }

  /**
   * 收藏/取消收藏
   */
  async toggleCollect(contentId: string, isCollected: boolean): Promise<LikeResponse> {
    try {
      // 模拟API调用
      await new Promise(resolve => setTimeout(resolve, 200));
      
      return {
        success: true,
        newCount: isCollected ? 46 : 44,
      };
    } catch (error) {
      throw new Error(`收藏操作失败: ${error}`);
    }
  }

  /**
   * 关注/取消关注用户
   */
  async toggleFollow(userId: string, isFollowing: boolean): Promise<{ success: boolean }> {
    try {
      // 模拟API调用
      await new Promise(resolve => setTimeout(resolve, 300));
      
      return { success: true };
    } catch (error) {
      throw new Error(`关注操作失败: ${error}`);
    }
  }

  /**
   * 添加评论
   */
  async addComment(contentId: string, content: string, parentId?: string): Promise<CommentItem> {
    try {
      // 模拟API调用
      await new Promise(resolve => setTimeout(resolve, 400));
      
      const newComment: CommentItem = {
        id: `comment_${Date.now()}`,
        content,
        user: {
          id: 'current_user',
          nickname: '我',
          avatar: 'https://picsum.photos/100/100?random=current',
        },
        likeCount: 0,
        isLiked: false,
        createdAt: new Date().toISOString(),
        parentId,
      };

      return newComment;
    } catch (error) {
      throw new Error(`添加评论失败: ${error}`);
    }
  }

  /**
   * 评论点赞
   */
  async toggleCommentLike(commentId: string, isLiked: boolean): Promise<LikeResponse> {
    try {
      // 模拟API调用
      await new Promise(resolve => setTimeout(resolve, 200));
      
      return {
        success: true,
        newCount: isLiked ? 13 : 11,
      };
    } catch (error) {
      throw new Error(`评论点赞失败: ${error}`);
    }
  }
}

// ==================== 5. Data Processing ====================
export const processContentData = (rawData: any): ContentItem => {
  // 数据处理和转换逻辑
  return rawData;
};

export const processCommentsData = (rawData: any[]): CommentItem[] => {
  // 评论数据处理和转换逻辑
  return rawData;
};

// ==================== 6. Error Handling ====================
export const handleApiError = (error: any): string => {
  if (error.response?.data?.message) {
    return error.response.data.message;
  }
  
  if (error.message) {
    return error.message;
  }
  
  return '网络错误，请稍后重试';
};

// ==================== 7. Cache Management ====================
class CacheManager {
  private static cache = new Map<string, { data: any; timestamp: number }>();
  private static readonly CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

  static set(key: string, data: any): void {
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
    });
  }

  static get(key: string): any | null {
    const cached = this.cache.get(key);
    if (!cached) return null;

    if (Date.now() - cached.timestamp > this.CACHE_DURATION) {
      this.cache.delete(key);
      return null;
    }

    return cached.data;
  }

  static clear(): void {
    this.cache.clear();
  }
}

// ==================== 8. Exports ====================
export const detailDataService = DetailDataService.getInstance();
export { CacheManager };
export default detailDataService;

// Re-export types for convenience
export type {
  ApiResponse,
  ContentDetailResponse,
  CommentsResponse,
  LikeResponse,
};
