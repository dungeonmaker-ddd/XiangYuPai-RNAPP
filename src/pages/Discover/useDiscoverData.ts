/**
 * Discover 页面组数据状态管理
 * 
 * 管理 Discover 页面组的数据获取和缓存
 */

import { useState, useEffect, useCallback } from 'react';
import { DiscoverContentItem, DiscoverComment, DiscoverUserInfo, DiscoverFilterOptions } from './types';
import { DEFAULT_DISCOVER_CONFIG } from './constants';

export const useDiscoverData = () => {
  // 数据状态
  const [contentList, setContentList] = useState<DiscoverContentItem[]>([]);
  const [currentPost, setCurrentPost] = useState<DiscoverContentItem | null>(null);
  const [comments, setComments] = useState<DiscoverComment[]>([]);
  const [userInfo, setUserInfo] = useState<DiscoverUserInfo | null>(null);
  const [isLoadingContent, setIsLoadingContent] = useState(false);
  const [isLoadingComments, setIsLoadingComments] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(true);

  // 获取内容列表
  const fetchContentList = useCallback(async (filter?: DiscoverFilterOptions, refresh = false) => {
    setIsLoadingContent(true);
    setError(null);
    
    try {
      // TODO: 实际的 API 调用
      // const response = await apiDiscoverContentList({
      //   ...filter,
      //   pageSize: DEFAULT_DISCOVER_CONFIG.PAGE_SIZE
      // });
      
      // 模拟数据（YAGNI + MVP 原则）
      const mockContent: DiscoverContentItem[] = [
        {
          id: '1',
          userId: 'user1',
          userName: '用户A',
          userAvatar: 'avatar1.jpg',
          content: '今天天气真好，出来玩游戏啦！#王者荣耀 #开黑',
          images: ['image1.jpg', 'image2.jpg'],
          tags: ['王者荣耀', '开黑'],
          location: '北京市朝阳区',
          createdAt: '2024-01-01 10:00:00',
          likeCount: 128,
          commentCount: 32,
          shareCount: 15,
          isLiked: false,
          isCollected: false,
          isFollowing: false,
        },
        {
          id: '2',
          userId: 'user2',
          userName: '用户B',
          userAvatar: 'avatar2.jpg',
          content: '分享一下今天的游戏战绩，五连胜！',
          video: 'video1.mp4',
          tags: ['和平精英', '吃鸡'],
          location: '上海市浦东新区',
          createdAt: '2024-01-01 09:30:00',
          likeCount: 256,
          commentCount: 64,
          shareCount: 28,
          isLiked: true,
          isCollected: true,
          isFollowing: true,
        },
        // ... 更多模拟数据
      ];
      
      if (refresh) {
        setContentList(mockContent);
      } else {
        setContentList(prev => [...prev, ...mockContent]);
      }
      
      setHasMore(mockContent.length === DEFAULT_DISCOVER_CONFIG.PAGE_SIZE);
    } catch (err) {
      setError(err instanceof Error ? err.message : '获取内容失败');
    } finally {
      setIsLoadingContent(false);
    }
  }, []);

  // 获取帖子详情
  const fetchPostDetail = useCallback(async (postId: string) => {
    setIsLoadingContent(true);
    setError(null);
    
    try {
      // TODO: 实际的 API 调用
      // const response = await apiDiscoverPostDetail(postId);
      
      // 模拟数据（YAGNI + MVP 原则）
      const mockPost: DiscoverContentItem = {
        id: postId,
        userId: 'user1',
        userName: '用户A',
        userAvatar: 'avatar1.jpg',
        content: '详细的帖子内容...',
        images: ['detail1.jpg', 'detail2.jpg'],
        tags: ['王者荣耀', '开黑'],
        location: '北京市朝阳区',
        createdAt: '2024-01-01 10:00:00',
        likeCount: 128,
        commentCount: 32,
        shareCount: 15,
        isLiked: false,
        isCollected: false,
        isFollowing: false,
      };
      
      setCurrentPost(mockPost);
    } catch (err) {
      setError(err instanceof Error ? err.message : '获取帖子详情失败');
    } finally {
      setIsLoadingContent(false);
    }
  }, []);

  // 获取评论列表
  const fetchComments = useCallback(async (postId: string) => {
    setIsLoadingComments(true);
    setError(null);
    
    try {
      // TODO: 实际的 API 调用
      // const response = await apiDiscoverComments(postId);
      
      // 模拟数据（YAGNI + MVP 原则）
      const mockComments: DiscoverComment[] = [
        {
          id: 'comment1',
          userId: 'user2',
          userName: '用户B',
          userAvatar: 'avatar2.jpg',
          content: '很棒的分享！',
          createdAt: '2024-01-01 10:05:00',
          likeCount: 5,
          isLiked: false,
        },
        {
          id: 'comment2',
          userId: 'user3',
          userName: '用户C',
          userAvatar: 'avatar3.jpg',
          content: '一起开黑吗？',
          createdAt: '2024-01-01 10:10:00',
          likeCount: 2,
          isLiked: true,
          replies: [
            {
              id: 'reply1',
              userId: 'user1',
              userName: '用户A',
              userAvatar: 'avatar1.jpg',
              content: '好的，加我微信！',
              createdAt: '2024-01-01 10:12:00',
              likeCount: 1,
              isLiked: false,
            },
          ],
        },
        // ... 更多模拟数据
      ];
      
      setComments(mockComments);
    } catch (err) {
      setError(err instanceof Error ? err.message : '获取评论失败');
    } finally {
      setIsLoadingComments(false);
    }
  }, []);

  // 点赞/取消点赞
  const toggleLike = useCallback(async (postId: string) => {
    try {
      // TODO: 实际的 API 调用
      // await apiDiscoverToggleLike(postId);
      
      // 更新本地状态
      setContentList(prev => 
        prev.map(item => 
          item.id === postId 
            ? { 
                ...item, 
                isLiked: !item.isLiked,
                likeCount: item.isLiked ? item.likeCount - 1 : item.likeCount + 1
              }
            : item
        )
      );
      
      if (currentPost?.id === postId) {
        setCurrentPost(prev => prev ? {
          ...prev,
          isLiked: !prev.isLiked,
          likeCount: prev.isLiked ? prev.likeCount - 1 : prev.likeCount + 1
        } : prev);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : '点赞操作失败');
    }
  }, [currentPost]);

  // 收藏/取消收藏
  const toggleCollect = useCallback(async (postId: string) => {
    try {
      // TODO: 实际的 API 调用
      // await apiDiscoverToggleCollect(postId);
      
      // 更新本地状态
      setContentList(prev => 
        prev.map(item => 
          item.id === postId 
            ? { ...item, isCollected: !item.isCollected }
            : item
        )
      );
      
      if (currentPost?.id === postId) {
        setCurrentPost(prev => prev ? {
          ...prev,
          isCollected: !prev.isCollected
        } : prev);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : '收藏操作失败');
    }
  }, [currentPost]);

  // 关注/取消关注用户
  const toggleFollow = useCallback(async (userId: string) => {
    try {
      // TODO: 实际的 API 调用
      // await apiDiscoverToggleFollow(userId);
      
      // 更新本地状态
      setContentList(prev => 
        prev.map(item => 
          item.userId === userId 
            ? { ...item, isFollowing: !item.isFollowing }
            : item
        )
      );
      
      if (currentPost?.userId === userId) {
        setCurrentPost(prev => prev ? {
          ...prev,
          isFollowing: !prev.isFollowing
        } : prev);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : '关注操作失败');
    }
  }, [currentPost]);

  // 刷新数据
  const refreshData = useCallback(async (filter?: DiscoverFilterOptions) => {
    await fetchContentList(filter, true);
  }, [fetchContentList]);

  // 加载更多数据
  const loadMore = useCallback(async (filter?: DiscoverFilterOptions) => {
    if (!isLoadingContent && hasMore) {
      await fetchContentList(filter, false);
    }
  }, [fetchContentList, isLoadingContent, hasMore]);

  // 初始化数据加载
  useEffect(() => {
    fetchContentList(undefined, true);
  }, [fetchContentList]);

  return {
    // 数据状态
    contentList,
    currentPost,
    comments,
    userInfo,
    isLoadingContent,
    isLoadingComments,
    error,
    hasMore,
    
    // 操作方法
    fetchContentList,
    fetchPostDetail,
    fetchComments,
    toggleLike,
    toggleCollect,
    toggleFollow,
    refreshData,
    loadMore,
  };
};
