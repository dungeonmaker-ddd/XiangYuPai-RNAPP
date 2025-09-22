/**
 * 发型详情页面类型定义
 * 基于架构设计文档的类型系统
 */

import { ContentItem, UserInfo } from '../../discover/WaterfallList/types';

// 详情页面路由参数
export interface DiscoverDetailRouteParams {
  contentId: string;
  contentItem?: ContentItem;
}

// 详情页面Props
export interface DiscoverDetailPageProps {
  navigation: any;
  route: {
    params: DiscoverDetailRouteParams;
  };
}

// 评论信息
export interface CommentItem {
  id: string;
  content: string;
  user: UserInfo;
  likeCount: number;
  isLiked: boolean;
  createdAt: string;
  location?: LocationInfo;
  parentId?: string; // 父评论ID，用于回复
  replies?: CommentItem[]; // 子评论列表
}

// 详情页面状态
export interface DiscoverDetailState {
  // 内容相关
  contentItem: ContentItem | null;
  isContentLoading: boolean;
  contentError: string | null;
  
  // 评论相关
  comments: CommentItem[];
  isCommentsLoading: boolean;
  commentsError: string | null;
  commentInputText: string;
  isCommentExpanded: boolean;
  
  // 互动相关
  isLiking: boolean;
  isCollecting: boolean;
  isFollowing: boolean;
  
  // 推荐相关
  recommendedItems: ContentItem[];
  isRecommendLoading: boolean;
  
  // UI状态
  imageScale: number;
  showImageViewer: boolean;
  currentImageIndex: number;
}

// 互动操作类型
export type InteractionType = 'like' | 'collect' | 'comment' | 'share' | 'follow';

// 评论操作类型
export type CommentActionType = 'like' | 'reply' | 'delete' | 'report';

// 扩展用户信息类型 - 详情页专用
export interface ExtendedUserInfo extends UserInfo {
  gender?: 'male' | 'female';
  age?: number;
  bio?: string;
}

// 用户卡片Props
export interface UserInfoCardProps {
  user: UserInfo | ExtendedUserInfo;
  content: Pick<ContentItem, 'title' | 'description' | 'createdAt' | 'location' | 'tags'>;
  isFollowing: boolean;
  onFollowPress: () => void;
  onUserPress: () => void;
}

// 评论列表Props
export interface CommentListProps {
  comments: CommentItem[];
  loading: boolean;
  onCommentLike: (commentId: string) => void;
  onCommentReply: (comment: CommentItem) => void;
  onCommentAction: (commentId: string, action: CommentActionType) => void;
  onUserPress: (userId: string) => void;
}

// 评论输入框Props
export interface CommentInputProps {
  value: string;
  placeholder?: string;
  replyToUser?: string;
  loading?: boolean;
  onValueChange: (text: string) => void;
  onSubmit: () => void;
  onCancel?: () => void;
}

// 互动操作栏Props (扩展自CommentInputProps)
export interface InteractionActionBarProps extends CommentInputProps {
  // 互动数据
  initialLikeCount?: number;
  initialCollectCount?: number;
  initialShareCount?: number;
  initialIsLiked?: boolean;
  initialIsCollected?: boolean;
  // 互动回调
  onLike?: (isLiked: boolean, newCount: number) => void;
  onCollect?: (isCollected: boolean, newCount: number) => void;
  onShare?: (platform: string) => void;
  // 分享配置
  shareContent?: {
    title: string;
    description: string;
    url: string;
    imageUrl?: string;
  };
}

// 图片查看器Props
export interface ImageViewerProps {
  images: string[];
  currentIndex: number;
  visible: boolean;
  onClose: () => void;
  onIndexChange?: (index: number) => void;
}

// API请求类型
export interface DetailContentRequest {
  contentId: string;
}

export interface CommentsRequest {
  contentId: string;
  page?: number;
  limit?: number;
  sortBy?: 'latest' | 'hottest';
}

export interface AddCommentRequest {
  contentId: string;
  content: string;
  parentId?: string;
}

export interface InteractionRequest {
  contentId: string;
  type: InteractionType;
}

// API响应类型
export interface DetailContentResponse {
  content: ContentItem;
  relatedContents?: ContentItem[];
}

export interface CommentsResponse {
  comments: CommentItem[];
  total: number;
  hasMore: boolean;
}

export interface InteractionResponse {
  success: boolean;
  newCount: number;
  isActive: boolean;
}

// 错误类型
export interface DetailPageError {
  type: 'content' | 'comments' | 'interaction' | 'network';
  message: string;
  code?: number;
}

// 手势相关类型
export interface GestureState {
  scale: number;
  translationX: number;
  translationY: number;
}

// 动画配置类型
export interface AnimationConfig {
  duration: number;
  easing?: 'linear' | 'ease' | 'ease-in' | 'ease-out' | 'ease-in-out';
  useNativeDriver?: boolean;
}
