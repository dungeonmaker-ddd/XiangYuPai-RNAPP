/**
 * 发现详情页面类型定义
 * 
 * TOC (快速跳转):
 * [1] Navigation Types
 * [2] Content Types  
 * [3] User Types
 * [4] Comment Types
 * [5] Component Props Types
 * [6] State Types
 * [7] Event Handler Types
 * [8] Exports
 */

// ==================== 1. Navigation Types ====================
export interface DiscoverDetailPageProps {
  navigation: any;
  route: {
    params: {
      contentId: string;
      contentItem?: ContentItem;
    };
  };
}

// ==================== 2. Content Types ====================
export interface ContentItem {
  id: string;
  title: string;
  description?: string;
  imageUrl: string;
  createdAt: string;
  user: UserInfo;
  location?: {
    address: string;
    latitude?: number;
    longitude?: number;
  };
  tags?: string[];
  stats: {
    likeCount: number;
    collectCount: number;
    commentCount: number;
    shareCount: number;
  };
  interactions: {
    isLiked: boolean;
    isCollected: boolean;
  };
}

// ==================== 3. User Types ====================
export interface UserInfo {
  id: string;
  nickname: string;
  avatar: string;
  isFollowing?: boolean;
  verified?: boolean;
  level?: number;
}

export interface ExtendedUserInfo extends UserInfo {
  gender?: 'male' | 'female';
  age?: number;
  bio?: string;
}

// ==================== 4. Comment Types ====================
export interface CommentItem {
  id: string;
  content: string;
  user: UserInfo;
  likeCount: number;
  isLiked: boolean;
  createdAt: string;
  location?: {
    address: string;
    latitude?: number;
    longitude?: number;
    distance?: number;
  };
  parentId?: string;
  replies?: CommentItem[];
}

export type CommentActionType = 'like' | 'reply' | 'delete' | 'report';

// ==================== 5. Component Props Types ====================
export interface UserInfoCardProps {
  user: UserInfo | ExtendedUserInfo;
  content: {
    title: string;
    description?: string;
    createdAt: string;
    location?: {
      address: string;
    };
    tags?: string[];
  };
  isFollowing: boolean;
  onFollowPress: () => void;
  onUserPress: () => void;
}

export interface CommentListProps {
  comments: CommentItem[];
  loading: boolean;
  onCommentLike: (commentId: string) => void;
  onCommentReply: (comment: CommentItem) => void;
  onCommentAction: (commentId: string, action: CommentActionType) => void;
  onUserPress: (userId: string) => void;
  ListHeaderComponent?: React.ComponentType<any> | React.ReactElement | null;
  style?: any;
  contentContainerStyle?: any;
  showsVerticalScrollIndicator?: boolean;
  bounces?: boolean;
  showHeader?: boolean;
  commentCount?: number;
}

export interface CommentInputProps {
  value: string;
  placeholder?: string;
  replyToUser?: string;
  loading?: boolean;
  onValueChange: (text: string) => void;
  onSubmit: () => void;
  onCancel?: () => void;
  initialLikeCount?: number;
  initialCollectCount?: number;
  initialShareCount?: number;
  initialIsLiked?: boolean;
  initialIsCollected?: boolean;
  onLike?: (isLiked: boolean, newCount: number) => void;
  onCollect?: (isCollected: boolean, newCount: number) => void;
  onShare?: (platform: string) => void;
  shareContent?: {
    title: string;
    description: string;
    url: string;
    imageUrl?: string;
  };
}

export interface ImageViewerProps {
  images: string[];
  currentIndex: number;
  visible: boolean;
  onClose: () => void;
  onIndexChange?: (index: number) => void;
}

export interface DetailHeaderProps {
  onBackPress: () => void;
  onShare?: () => void;
  onReport?: () => void;
  onBlockUser?: () => void;
  customActions?: Array<{
    title: string;
    onPress: () => void;
    style?: 'default' | 'cancel' | 'destructive';
  }>;
  showBackground?: boolean;
  backgroundOpacity?: number;
  reportTarget?: {
    targetId: string;
    targetType: string;
    targetTitle?: string;
    targetAuthor?: string;
  };
}

// ==================== 6. State Types ====================
export interface DetailPageState {
  contentItem: ContentItem | null;
  comments: CommentItem[];
  isContentLoading: boolean;
  isCommentsLoading: boolean;
  isCommentExpanded: boolean;
  commentInputText: string;
  showImageViewer: boolean;
  currentImageIndex: number;
  hasContent: boolean;
}

// ==================== 7. Event Handler Types ====================
export type LikeHandler = () => void;
export type CollectHandler = () => void;
export type FollowHandler = () => void;
export type ShareHandler = () => void;
export type CommentHandler = (text: string, parentId?: string) => void;
export type CommentLikeHandler = (commentId: string) => void;
export type CommentActionHandler = (commentId: string, action: CommentActionType) => void;
export type UserPressHandler = (userId?: string) => void;
export type ImageViewerHandler = (index: number) => void;

// ==================== 8. Exports ====================
export type {
  // Re-export all types for convenience
  DiscoverDetailPageProps,
  ContentItem,
  UserInfo,
  ExtendedUserInfo,
  CommentItem,
  CommentActionType,
  UserInfoCardProps,
  CommentListProps,
  CommentInputProps,
  ImageViewerProps,
  DetailHeaderProps,
  DetailPageState,
  LikeHandler,
  CollectHandler,
  FollowHandler,
  ShareHandler,
  CommentHandler,
  CommentLikeHandler,
  CommentActionHandler,
  UserPressHandler,
  ImageViewerHandler,
};
