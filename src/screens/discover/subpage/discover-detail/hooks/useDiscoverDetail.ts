/**
 * 详情页面主要业务逻辑Hook
 * 管理内容加载、互动操作、状态管理等核心功能
 */

import { useState, useEffect, useCallback, useRef } from 'react';
import { Alert, Share, Animated } from 'react-native';
import {
  DiscoverDetailState,
  CommentItem,
  InteractionType,
  CommentActionType,
  DetailPageError,
} from '../types';
import { ContentItem } from '../../../types';
import DetailDataService from '../services/DetailDataService';

/**
 * 详情页面主Hook
 */
export const useDiscoverDetail = (contentId: string, initialContent?: ContentItem) => {
  // 状态管理
  const [state, setState] = useState<DiscoverDetailState>({
    // 内容相关
    contentItem: initialContent || null,
    isContentLoading: !initialContent,
    contentError: null,
    
    // 评论相关
    comments: [],
    isCommentsLoading: false,
    commentsError: null,
    commentInputText: '',
    isCommentExpanded: false,
    
    // 互动相关
    isLiking: false,
    isCollecting: false,
    isFollowing: false,
    
    // 推荐相关
    recommendedItems: [],
    isRecommendLoading: false,
    
    // UI状态
    imageScale: 1,
    showImageViewer: false,
    currentImageIndex: 0,
  });

  // 动画值
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const fadeAnim = useRef(new Animated.Value(1)).current;

  /**
   * 加载内容详情
   */
  const loadContentDetail = useCallback(async () => {
    if (!contentId) return;

    setState(prev => ({ ...prev, isContentLoading: true, contentError: null }));

    try {
      const response = await DetailDataService.getContentDetail({ contentId });
      setState(prev => ({
        ...prev,
        contentItem: response.content,
        recommendedItems: response.relatedContents || [],
        isContentLoading: false,
      }));
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : '加载内容失败';
      setState(prev => ({
        ...prev,
        contentError: errorMessage,
        isContentLoading: false,
      }));
    }
  }, [contentId]);

  /**
   * 加载评论列表
   */
  const loadComments = useCallback(async () => {
    if (!contentId) return;

    setState(prev => ({ ...prev, isCommentsLoading: true, commentsError: null }));

    try {
      const response = await DetailDataService.getComments({ 
        contentId,
        sortBy: 'latest',
      });
      setState(prev => ({
        ...prev,
        comments: response.comments,
        isCommentsLoading: false,
      }));
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : '加载评论失败';
      setState(prev => ({
        ...prev,
        commentsError: errorMessage,
        isCommentsLoading: false,
      }));
    }
  }, [contentId]);

  /**
   * 点赞操作
   */
  const handleLike = useCallback(async () => {
    if (!state.contentItem || state.isLiking) return;

    setState(prev => ({ ...prev, isLiking: true }));

    // 乐观更新UI
    const newIsLiked = !state.contentItem.isLiked;
    const newLikeCount = state.contentItem.likeCount + (newIsLiked ? 1 : -1);
    
    setState(prev => ({
      ...prev,
      contentItem: prev.contentItem ? {
        ...prev.contentItem,
        isLiked: newIsLiked,
        likeCount: Math.max(0, newLikeCount),
      } : null,
    }));

    // 点赞动画
    Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: 1.2,
        duration: 150,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 150,
        useNativeDriver: true,
      }),
    ]).start();

    try {
      const response = await DetailDataService.toggleLike({
        contentId,
        type: 'like',
      });

      // 更新实际数据
      setState(prev => ({
        ...prev,
        contentItem: prev.contentItem ? {
          ...prev.contentItem,
          isLiked: response.isActive,
          likeCount: response.newCount,
        } : null,
        isLiking: false,
      }));
    } catch (error) {
      // 错误回滚
      setState(prev => ({
        ...prev,
        contentItem: prev.contentItem ? {
          ...prev.contentItem,
          isLiked: !newIsLiked,
          likeCount: state.contentItem?.likeCount || 0,
        } : null,
        isLiking: false,
      }));
      
      Alert.alert('操作失败', '点赞失败，请重试');
    }
  }, [state.contentItem, state.isLiking, contentId, scaleAnim]);

  /**
   * 收藏操作
   */
  const handleCollect = useCallback(async () => {
    if (!state.contentItem || state.isCollecting) return;

    setState(prev => ({ ...prev, isCollecting: true }));

    const newIsCollected = !state.contentItem.isCollected;
    
    setState(prev => ({
      ...prev,
      contentItem: prev.contentItem ? {
        ...prev.contentItem,
        isCollected: newIsCollected,
      } : null,
    }));

    try {
      const response = await DetailDataService.toggleCollect({
        contentId,
        type: 'collect',
      });

      setState(prev => ({
        ...prev,
        contentItem: prev.contentItem ? {
          ...prev.contentItem,
          isCollected: response.isActive,
        } : null,
        isCollecting: false,
      }));
    } catch (error) {
      setState(prev => ({
        ...prev,
        contentItem: prev.contentItem ? {
          ...prev.contentItem,
          isCollected: !newIsCollected,
        } : null,
        isCollecting: false,
      }));
      
      Alert.alert('操作失败', '收藏失败，请重试');
    }
  }, [state.contentItem, state.isCollecting, contentId]);

  /**
   * 关注操作
   */
  const handleFollow = useCallback(async () => {
    if (!state.contentItem?.user || state.isFollowing) return;

    setState(prev => ({ ...prev, isFollowing: true }));

    const newIsFollowing = !state.contentItem.user.isFollowing;
    
    setState(prev => ({
      ...prev,
      contentItem: prev.contentItem ? {
        ...prev.contentItem,
        user: {
          ...prev.contentItem.user,
          isFollowing: newIsFollowing,
        },
      } : null,
    }));

    try {
      const response = await DetailDataService.toggleFollow(state.contentItem.user.id);

      setState(prev => ({
        ...prev,
        contentItem: prev.contentItem ? {
          ...prev.contentItem,
          user: {
            ...prev.contentItem.user,
            isFollowing: response.isActive,
          },
        } : null,
        isFollowing: false,
      }));
    } catch (error) {
      setState(prev => ({
        ...prev,
        contentItem: prev.contentItem ? {
          ...prev.contentItem,
          user: {
            ...prev.contentItem.user,
            isFollowing: !newIsFollowing,
          },
        } : null,
        isFollowing: false,
      }));
      
      Alert.alert('操作失败', '关注失败，请重试');
    }
  }, [state.contentItem?.user, state.isFollowing]);

  /**
   * 分享操作
   */
  const handleShare = useCallback(async () => {
    if (!state.contentItem) return;

    try {
      const shareContent = {
        title: state.contentItem.title,
        message: `${state.contentItem.title}\n${state.contentItem.description || ''}`,
        url: `https://app.xiangyupai.com/content/${contentId}`,
      };

      const result = await Share.share(shareContent);
      
      if (result.action === Share.sharedAction) {
        // 分享成功，可以记录分析数据
        await DetailDataService.shareContent(contentId);
      }
    } catch (error) {
      Alert.alert('分享失败', '无法分享此内容');
    }
  }, [state.contentItem, contentId]);

  /**
   * 添加评论
   */
  const handleAddComment = useCallback(async (content: string, parentId?: string) => {
    if (!content.trim()) return;

    try {
      const newComment = await DetailDataService.addComment({
        contentId,
        content: content.trim(),
        parentId,
      });

      setState(prev => ({
        ...prev,
        comments: parentId 
          ? prev.comments.map(comment => 
              comment.id === parentId 
                ? { ...comment, replies: [...(comment.replies || []), newComment] }
                : comment
            )
          : [newComment, ...prev.comments],
        commentInputText: '',
        contentItem: prev.contentItem ? {
          ...prev.contentItem,
          commentCount: prev.contentItem.commentCount + 1,
        } : null,
      }));
    } catch (error) {
      Alert.alert('评论失败', '发送评论失败，请重试');
    }
  }, [contentId]);

  /**
   * 评论点赞
   */
  const handleCommentLike = useCallback(async (commentId: string) => {
    try {
      const response = await DetailDataService.toggleCommentLike(commentId);
      
      setState(prev => ({
        ...prev,
        comments: prev.comments.map(comment => {
          if (comment.id === commentId) {
            return {
              ...comment,
              isLiked: response.isActive,
              likeCount: response.newCount,
            };
          }
          if (comment.replies) {
            return {
              ...comment,
              replies: comment.replies.map(reply =>
                reply.id === commentId
                  ? { ...reply, isLiked: response.isActive, likeCount: response.newCount }
                  : reply
              ),
            };
          }
          return comment;
        }),
      }));
    } catch (error) {
      Alert.alert('操作失败', '评论点赞失败');
    }
  }, []);

  /**
   * 评论操作处理
   */
  const handleCommentAction = useCallback(async (commentId: string, action: CommentActionType) => {
    switch (action) {
      case 'like':
        await handleCommentLike(commentId);
        break;
      case 'delete':
        Alert.alert(
          '删除评论',
          '确定要删除这条评论吗？',
          [
            { text: '取消', style: 'cancel' },
            {
              text: '删除',
              style: 'destructive',
              onPress: async () => {
                try {
                  await DetailDataService.deleteComment(commentId);
                  setState(prev => ({
                    ...prev,
                    comments: prev.comments.filter(comment => comment.id !== commentId),
                  }));
                } catch (error) {
                  Alert.alert('删除失败', '无法删除评论');
                }
              },
            },
          ]
        );
        break;
      case 'report':
        Alert.alert('举报', '已提交举报，我们会尽快处理');
        break;
    }
  }, [handleCommentLike]);

  /**
   * 切换评论展开状态
   */
  const toggleCommentExpansion = useCallback(() => {
    setState(prev => ({ ...prev, isCommentExpanded: !prev.isCommentExpanded }));
  }, []);

  /**
   * 更新评论输入文本
   */
  const updateCommentInput = useCallback((text: string) => {
    setState(prev => ({ ...prev, commentInputText: text }));
  }, []);

  /**
   * 显示图片查看器
   */
  const showImageViewer = useCallback((index: number = 0) => {
    setState(prev => ({ 
      ...prev, 
      showImageViewer: true, 
      currentImageIndex: index 
    }));
  }, []);

  /**
   * 隐藏图片查看器
   */
  const hideImageViewer = useCallback(() => {
    setState(prev => ({ ...prev, showImageViewer: false }));
  }, []);

  // 初始化加载
  useEffect(() => {
    if (!initialContent) {
      loadContentDetail();
    }
    loadComments();
  }, [loadContentDetail, loadComments, initialContent]);

  // 返回状态和操作函数
  return {
    // 状态
    ...state,
    
    // 动画值
    scaleAnim,
    fadeAnim,
    
    // 操作函数
    loadContentDetail,
    loadComments,
    handleLike,
    handleCollect,
    handleFollow,
    handleShare,
    handleAddComment,
    handleCommentLike,
    handleCommentAction,
    toggleCommentExpansion,
    updateCommentInput,
    openImageViewer: showImageViewer,
    hideImageViewer,
    
    // 便捷状态
    hasContent: !!state.contentItem,
    hasComments: state.comments.length > 0,
    isLoading: state.isContentLoading || state.isCommentsLoading,
    hasError: !!(state.contentError || state.commentsError),
  };
};

export default useDiscoverDetail;
