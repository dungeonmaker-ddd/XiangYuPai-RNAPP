/**
 * 发现详情页面主业务逻辑Hook
 * 
 * TOC (快速跳转):
 * [1] Imports
 * [2] Types & Schema  
 * [3] Constants & Config
 * [4] Utils & Helpers
 * [5] State Management
 * [6] Domain Logic
 * [7] Effect Handlers
 * [8] Exports
 */

// ==================== 1. Imports ====================
import { useState, useCallback, useEffect } from 'react';
import { Alert } from 'react-native';
import type { 
  ContentItem, 
  CommentItem, 
  CommentActionType,
  DetailPageState 
} from '../types';

// ==================== 2. Types & Schema ====================
export interface UseDiscoverDetailReturn {
  // State
  contentItem: ContentItem | null;
  comments: CommentItem[];
  isContentLoading: boolean;
  isCommentsLoading: boolean;
  isCommentExpanded: boolean;
  commentInputText: string;
  showImageViewer: boolean;
  currentImageIndex: number;
  hasContent: boolean;
  
  // Actions
  handleLike: () => void;
  handleCollect: () => void;
  handleFollow: () => void;
  handleShare: () => void;
  handleAddComment: (text: string, parentId?: string) => void;
  handleCommentLike: (commentId: string) => void;
  handleCommentAction: (commentId: string, action: CommentActionType) => void;
  toggleCommentExpansion: () => void;
  updateCommentInput: (text: string) => void;
  openImageViewer: (index: number) => void;
  hideImageViewer: () => void;
}

// ==================== 3. Constants & Config ====================
const MOCK_COMMENTS: CommentItem[] = [
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
    location: {
      address: '北京市朝阳区',
      distance: 2.5,
    },
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
    replies: [
      {
        id: 'reply_1',
        content: '用的iPhone 15 Pro Max，主要是光线好',
        user: {
          id: 'user_3',
          nickname: '楼主',
          avatar: 'https://picsum.photos/100/100?random=3',
        },
        likeCount: 3,
        isLiked: false,
        createdAt: '2024-12-19T11:20:00Z',
        parentId: 'comment_2',
      },
    ],
  },
];

// ==================== 4. Utils & Helpers ====================
const generateMockContent = (contentId: string, initialContent?: ContentItem): ContentItem => {
  if (initialContent) {
    return initialContent;
  }

  return {
    id: contentId,
    title: '探索城市中的隐秘角落 🌆',
    description: '今天发现了一个超棒的拍照地点，夕阳西下的时候特别美，分享给大家！记得带上相机哦～',
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
};

// ==================== 5. State Management ====================
export const useDiscoverDetail = (
  contentId: string,
  initialContent?: ContentItem
): UseDiscoverDetailReturn => {
  const [state, setState] = useState<DetailPageState>({
    contentItem: null,
    comments: [],
    isContentLoading: true,
    isCommentsLoading: true,
    isCommentExpanded: false,
    commentInputText: '',
    showImageViewer: false,
    currentImageIndex: 0,
    hasContent: false,
  });

  // ==================== 6. Domain Logic ====================
  const handleLike = useCallback(() => {
    if (!state.contentItem) return;

    const newIsLiked = !state.contentItem.interactions.isLiked;
    const newCount = newIsLiked 
      ? state.contentItem.stats.likeCount + 1 
      : state.contentItem.stats.likeCount - 1;

    setState(prev => ({
      ...prev,
      contentItem: prev.contentItem ? {
        ...prev.contentItem,
        interactions: {
          ...prev.contentItem.interactions,
          isLiked: newIsLiked,
        },
        stats: {
          ...prev.contentItem.stats,
          likeCount: newCount,
        },
      } : null,
    }));

    console.log('点赞操作:', { newIsLiked, newCount });
  }, [state.contentItem]);

  const handleCollect = useCallback(() => {
    if (!state.contentItem) return;

    const newIsCollected = !state.contentItem.interactions.isCollected;
    const newCount = newIsCollected 
      ? state.contentItem.stats.collectCount + 1 
      : state.contentItem.stats.collectCount - 1;

    setState(prev => ({
      ...prev,
      contentItem: prev.contentItem ? {
        ...prev.contentItem,
        interactions: {
          ...prev.contentItem.interactions,
          isCollected: newIsCollected,
        },
        stats: {
          ...prev.contentItem.stats,
          collectCount: newCount,
        },
      } : null,
    }));

    Alert.alert('提示', newIsCollected ? '已收藏' : '已取消收藏');
  }, [state.contentItem]);

  const handleFollow = useCallback(() => {
    if (!state.contentItem) return;

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

    Alert.alert('提示', newIsFollowing ? '已关注' : '已取消关注');
  }, [state.contentItem]);

  const handleShare = useCallback(() => {
    if (!state.contentItem) return;

    setState(prev => ({
      ...prev,
      contentItem: prev.contentItem ? {
        ...prev.contentItem,
        stats: {
          ...prev.contentItem.stats,
          shareCount: prev.contentItem.stats.shareCount + 1,
        },
      } : null,
    }));

    Alert.alert('分享', '分享功能开发中...');
  }, [state.contentItem]);

  const handleAddComment = useCallback((text: string, parentId?: string) => {
    if (!text.trim()) return;

    const newComment: CommentItem = {
      id: `comment_${Date.now()}`,
      content: text,
      user: {
        id: 'current_user',
        nickname: '我',
        avatar: 'https://picsum.photos/100/100?random=current',
      },
      likeCount: 0,
      isLiked: false,
      createdAt: new Date().toISOString(),
    };

    setState(prev => ({
      ...prev,
      comments: [newComment, ...prev.comments],
      commentInputText: '',
      contentItem: prev.contentItem ? {
        ...prev.contentItem,
        stats: {
          ...prev.contentItem.stats,
          commentCount: prev.contentItem.stats.commentCount + 1,
        },
      } : null,
    }));

    Alert.alert('成功', '评论发布成功');
  }, []);

  const handleCommentLike = useCallback((commentId: string) => {
    setState(prev => ({
      ...prev,
      comments: prev.comments.map(comment => {
        if (comment.id === commentId) {
          const newIsLiked = !comment.isLiked;
          const newCount = newIsLiked ? comment.likeCount + 1 : comment.likeCount - 1;
          return {
            ...comment,
            isLiked: newIsLiked,
            likeCount: newCount,
          };
        }
        return comment;
      }),
    }));
  }, []);

  const handleCommentAction = useCallback((commentId: string, action: CommentActionType) => {
    switch (action) {
      case 'delete':
        setState(prev => ({
          ...prev,
          comments: prev.comments.filter(c => c.id !== commentId),
        }));
        Alert.alert('成功', '评论已删除');
        break;
      case 'report':
        Alert.alert('举报', '举报功能开发中...');
        break;
      default:
        console.log('评论操作:', action, commentId);
    }
  }, []);

  const toggleCommentExpansion = useCallback(() => {
    setState(prev => ({
      ...prev,
      isCommentExpanded: !prev.isCommentExpanded,
    }));
  }, []);

  const updateCommentInput = useCallback((text: string) => {
    setState(prev => ({
      ...prev,
      commentInputText: text,
    }));
  }, []);

  const openImageViewer = useCallback((index: number) => {
    setState(prev => ({
      ...prev,
      showImageViewer: true,
      currentImageIndex: index,
    }));
  }, []);

  const hideImageViewer = useCallback(() => {
    setState(prev => ({
      ...prev,
      showImageViewer: false,
    }));
  }, []);

  // ==================== 7. Effect Handlers ====================
  useEffect(() => {
    // 模拟加载内容数据
    const loadContent = async () => {
      try {
        setState(prev => ({ ...prev, isContentLoading: true }));
        
        // 模拟网络延迟
        await new Promise(resolve => setTimeout(resolve, 500));
        
        const content = generateMockContent(contentId, initialContent);
        
        setState(prev => ({
          ...prev,
          contentItem: content,
          isContentLoading: false,
          hasContent: true,
        }));
      } catch (error) {
        console.error('加载内容失败:', error);
        setState(prev => ({
          ...prev,
          isContentLoading: false,
          hasContent: false,
        }));
      }
    };

    loadContent();
  }, [contentId, initialContent]);

  useEffect(() => {
    // 模拟加载评论数据
    const loadComments = async () => {
      try {
        setState(prev => ({ ...prev, isCommentsLoading: true }));
        
        // 模拟网络延迟
        await new Promise(resolve => setTimeout(resolve, 300));
        
        setState(prev => ({
          ...prev,
          comments: MOCK_COMMENTS,
          isCommentsLoading: false,
        }));
      } catch (error) {
        console.error('加载评论失败:', error);
        setState(prev => ({
          ...prev,
          isCommentsLoading: false,
        }));
      }
    };

    loadComments();
  }, [contentId]);

  // ==================== 8. Exports ====================
  return {
    // State
    contentItem: state.contentItem,
    comments: state.comments,
    isContentLoading: state.isContentLoading,
    isCommentsLoading: state.isCommentsLoading,
    isCommentExpanded: state.isCommentExpanded,
    commentInputText: state.commentInputText,
    showImageViewer: state.showImageViewer,
    currentImageIndex: state.currentImageIndex,
    hasContent: state.hasContent,
    
    // Actions
    handleLike,
    handleCollect,
    handleFollow,
    handleShare,
    handleAddComment,
    handleCommentLike,
    handleCommentAction,
    toggleCommentExpansion,
    updateCommentInput,
    openImageViewer,
    hideImageViewer,
  };
};
