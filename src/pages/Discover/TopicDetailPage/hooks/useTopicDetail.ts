/**
 * 话题详情页面主要业务Hook
 * 
 * TOC (快速跳转):
 * [1] Imports
 * [2] Types & Schema  
 * [3] Constants & Config
 * [4] Utils & Helpers
 * [5] State Management
 * [6] Domain Logic
 * [7] Side Effects
 * [8] Exports
 */

// #region 1. Imports
import { useState, useEffect, useCallback, useRef } from 'react';
import { 
  TopicInfo, 
  TopicPostItem, 
  TopicDetailState,
  GetTopicPostsRequest,
} from '../types';
import { TOPIC_DETAIL_CONSTANTS } from '../constants';
import { apiTopicDetail } from '../services';
// #endregion

// #region 2. Types & Schema
interface UseTopicDetailReturn {
  // 数据状态
  topicInfo: TopicInfo | null;
  posts: TopicPostItem[];
  
  // 加载状态
  isLoading: boolean;
  isRefreshing: boolean;
  isLoadingMore: boolean;
  error: string | null;
  hasMore: boolean;
  
  // 操作方法
  refreshTopic: () => void;
  loadMorePosts: () => void;
  handlePostLike: (postId: string) => void;
  handlePostComment: (postId: string) => void;
  handlePostShare: (postId: string) => void;
  handleUserPress: (userId: string) => void;
  
  // 分页信息
  currentPage: number;
  totalPages: number;
}

interface TopicDetailCache {
  [topicId: string]: {
    topicInfo: TopicInfo;
    posts: TopicPostItem[];
    timestamp: number;
  };
}
// #endregion

// #region 3. Constants & Config
const CACHE_EXPIRE_TIME = TOPIC_DETAIL_CONSTANTS.CACHE_EXPIRE_TIME;
const DEFAULT_PAGE_SIZE = TOPIC_DETAIL_CONSTANTS.DEFAULT_PAGE_SIZE;
const MAX_RETRY_TIMES = TOPIC_DETAIL_CONSTANTS.MAX_RETRY_TIMES;
// #endregion

// #region 4. Utils & Helpers
// 缓存管理
const cache: TopicDetailCache = {};

const isCacheValid = (timestamp: number): boolean => {
  return Date.now() - timestamp < CACHE_EXPIRE_TIME;
};

const getCachedData = (topicId: string) => {
  const cached = cache[topicId];
  if (cached && isCacheValid(cached.timestamp)) {
    return cached;
  }
  return null;
};

const setCacheData = (topicId: string, topicInfo: TopicInfo, posts: TopicPostItem[]) => {
  cache[topicId] = {
    topicInfo,
    posts,
    timestamp: Date.now(),
  };
};

// 处理API错误
const handleApiError = (error: any): string => {
  if (error.response) {
    return error.response.data?.message || '服务器错误';
  }
  if (error.request) {
    return '网络连接失败';
  }
  return error.message || '未知错误';
};

// 乐观更新帮助函数
const updatePostInList = (
  posts: TopicPostItem[], 
  postId: string, 
  updater: (post: TopicPostItem) => TopicPostItem
): TopicPostItem[] => {
  return posts.map(post => 
    post.id === postId ? updater(post) : post
  );
};
// #endregion

// #region 5. State Management
export const useTopicDetail = (topicId: string): UseTopicDetailReturn => {
  // 主要状态
  const [state, setState] = useState<TopicDetailState>({
    topicInfo: null,
    posts: [],
    isLoading: true,
    isRefreshing: false,
    isLoadingMore: false,
    error: null,
    hasMore: true,
    currentPage: 1,
    totalPages: 1,
  });

  // 重试计数器
  const retryCountRef = useRef(0);
  const abortControllerRef = useRef<AbortController | null>(null);
// #endregion

// #region 6. Domain Logic
  // 加载话题信息和初始动态
  const loadTopicData = useCallback(async (isRefresh = false) => {
    try {
      // 取消之前的请求
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
      
      abortControllerRef.current = new AbortController();
      
      // 检查缓存
      if (!isRefresh) {
        const cached = getCachedData(topicId);
        if (cached) {
          setState(prev => ({
            ...prev,
            topicInfo: cached.topicInfo,
            posts: cached.posts,
            isLoading: false,
            error: null,
          }));
          return;
        }
      }

      // 设置加载状态
      setState(prev => ({
        ...prev,
        isLoading: !isRefresh,
        isRefreshing: isRefresh,
        error: null,
      }));

      // 并行加载话题信息和动态列表
      const [topicResponse, postsResponse] = await Promise.all([
        apiTopicDetail.getTopicInfo({ topicId }),
        apiTopicDetail.getTopicPosts({ 
          topicId, 
          page: 1, 
          pageSize: DEFAULT_PAGE_SIZE 
        }),
      ]);

      if (topicResponse.success && postsResponse.success) {
        const { data: topicInfo } = topicResponse;
        const { data: postsData } = postsResponse;

        // 更新状态
        setState(prev => ({
          ...prev,
          topicInfo,
          posts: postsData.posts,
          isLoading: false,
          isRefreshing: false,
          error: null,
          hasMore: postsData.pagination.hasMore,
          currentPage: postsData.pagination.page,
          totalPages: postsData.pagination.totalPages,
        }));

        // 缓存数据
        setCacheData(topicId, topicInfo, postsData.posts);
        
        // 重置重试计数
        retryCountRef.current = 0;
      } else {
        throw new Error(topicResponse.message || postsResponse.message || '加载失败');
      }
    } catch (error: any) {
      console.error('Load topic data error:', error);
      
      const errorMessage = handleApiError(error);
      
      setState(prev => ({
        ...prev,
        isLoading: false,
        isRefreshing: false,
        error: errorMessage,
      }));

      // 重试逻辑
      if (retryCountRef.current < MAX_RETRY_TIMES && !error.name?.includes('AbortError')) {
        retryCountRef.current++;
        setTimeout(() => {
          loadTopicData(isRefresh);
        }, TOPIC_DETAIL_CONSTANTS.RETRY_DELAY * retryCountRef.current);
      }
    }
  }, [topicId]);

  // 加载更多动态
  const loadMorePosts = useCallback(async () => {
    if (state.isLoadingMore || !state.hasMore) return;

    try {
      setState(prev => ({ ...prev, isLoadingMore: true }));

      const response = await apiTopicDetail.getTopicPosts({
        topicId,
        page: state.currentPage + 1,
        pageSize: DEFAULT_PAGE_SIZE,
      });

      if (response.success) {
        const { data } = response;
        
        setState(prev => ({
          ...prev,
          posts: [...prev.posts, ...data.posts],
          isLoadingMore: false,
          hasMore: data.pagination.hasMore,
          currentPage: data.pagination.page,
          totalPages: data.pagination.totalPages,
        }));
      } else {
        throw new Error(response.message || '加载更多失败');
      }
    } catch (error: any) {
      console.error('Load more posts error:', error);
      setState(prev => ({
        ...prev,
        isLoadingMore: false,
        error: handleApiError(error),
      }));
    }
  }, [topicId, state.currentPage, state.hasMore, state.isLoadingMore]);

  // 刷新话题
  const refreshTopic = useCallback(() => {
    loadTopicData(true);
  }, [loadTopicData]);

  // 处理动态点赞
  const handlePostLike = useCallback(async (postId: string) => {
    try {
      // 找到当前动态
      const currentPost = state.posts.find(post => post.id === postId);
      if (!currentPost) return;

      const isCurrentlyLiked = currentPost.interactions.isLiked;
      const action = isCurrentlyLiked ? 'unlike' : 'like';

      // 乐观更新UI
      setState(prev => ({
        ...prev,
        posts: updatePostInList(prev.posts, postId, post => ({
          ...post,
          interactions: {
            ...post.interactions,
            isLiked: !isCurrentlyLiked,
          },
          stats: {
            ...post.stats,
            likeCount: isCurrentlyLiked 
              ? Math.max(0, post.stats.likeCount - 1)
              : post.stats.likeCount + 1,
          },
        })),
      }));

      // 调用API
      const response = await apiTopicDetail.likePost({ postId, action });

      if (response.success) {
        // API成功，更新为准确数据
        setState(prev => ({
          ...prev,
          posts: updatePostInList(prev.posts, postId, post => ({
            ...post,
            interactions: {
              ...post.interactions,
              isLiked: response.data.isLiked,
            },
            stats: {
              ...post.stats,
              likeCount: response.data.likeCount,
            },
          })),
        }));
      } else {
        // API失败，回滚乐观更新
        setState(prev => ({
          ...prev,
          posts: updatePostInList(prev.posts, postId, post => ({
            ...post,
            interactions: {
              ...post.interactions,
              isLiked: isCurrentlyLiked,
            },
            stats: {
              ...post.stats,
              likeCount: currentPost.stats.likeCount,
            },
          })),
        }));
      }
    } catch (error: any) {
      console.error('Handle post like error:', error);
      
      // 发生错误，回滚乐观更新
      const currentPost = state.posts.find(post => post.id === postId);
      if (currentPost) {
        setState(prev => ({
          ...prev,
          posts: updatePostInList(prev.posts, postId, () => currentPost),
        }));
      }
    }
  }, [state.posts]);

  // 处理动态评论
  const handlePostComment = useCallback((postId: string) => {
    // TODO: 实现评论功能
    console.log('Comment post:', postId);
  }, []);

  // 处理动态分享
  const handlePostShare = useCallback((postId: string) => {
    // TODO: 实现分享功能
    console.log('Share post:', postId);
  }, []);

  // 处理用户点击
  const handleUserPress = useCallback((userId: string) => {
    // TODO: 导航到用户详情页
    console.log('Navigate to user:', userId);
  }, []);
// #endregion

// #region 7. Side Effects
  // 初始化加载
  useEffect(() => {
    loadTopicData();
    
    // 清理函数
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [loadTopicData]);

  // 组件卸载时清理
  useEffect(() => {
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);
// #endregion

// #region 8. Exports
  return {
    // 数据状态
    topicInfo: state.topicInfo,
    posts: state.posts,
    
    // 加载状态
    isLoading: state.isLoading,
    isRefreshing: state.isRefreshing,
    isLoadingMore: state.isLoadingMore,
    error: state.error,
    hasMore: state.hasMore,
    
    // 操作方法
    refreshTopic,
    loadMorePosts,
    handlePostLike,
    handlePostComment,
    handlePostShare,
    handleUserPress,
    
    // 分页信息
    currentPage: state.currentPage,
    totalPages: state.totalPages,
  };
};
// #endregion
