/**
 * 话题详情页面类型定义
 * 
 * TOC (快速跳转):
 * [1] Navigation Types
 * [2] Topic Types  
 * [3] Post Types
 * [4] User Types
 * [5] Component Props Types
 * [6] State Types
 * [7] Event Handler Types
 * [8] Exports
 */

// #region 1. Navigation Types
export interface TopicDetailPageProps {
  navigation: any;
  route: {
    params: {
      topicId: string;
      topicName: string;
      topicData?: TopicInfo;
    };
  };
}
// #endregion

// #region 2. Topic Types
export interface TopicInfo {
  id: string;
  name: string;
  title: string;
  description?: string;
  coverImage?: string;
  postCount: number;
  participantCount: number;
  isFollowing?: boolean;
  hotness: number;
  createdAt: string;
  updatedAt: string;
  tags?: string[];
  category?: string;
}

export interface TopicStats {
  totalPosts: number;
  totalParticipants: number;
  todayPosts: number;
  weeklyPosts: number;
  monthlyPosts: number;
}
// #endregion

// #region 3. Post Types
export interface TopicPostItem {
  id: string;
  title: string;
  content: string;
  user: PostUser;
  images?: string[];
  video?: {
    url: string;
    thumbnail: string;
    duration: number;
  };
  location?: {
    name: string;
    address: string;
    latitude?: number;
    longitude?: number;
  };
  hashtags: string[];
  stats: {
    likeCount: number;
    commentCount: number;
    shareCount: number;
    viewCount: number;
  };
  interactions: {
    isLiked: boolean;
    isCollected: boolean;
    isFollowing: boolean;
  };
  createdAt: string;
  updatedAt: string;
}

export interface PostUser {
  id: string;
  nickname: string;
  avatar: string;
  badge?: {
    type: 'vip' | 'verified' | 'popular';
    label: string;
    color: string;
  };
  level?: number;
  isFollowing?: boolean;
  followCount?: number;
}
// #endregion

// #region 4. User Types
export interface UserInfo {
  id: string;
  nickname: string;
  avatar: string;
  isFollowing?: boolean;
  verified?: boolean;
  level?: number;
  badge?: {
    type: string;
    label: string;
    color: string;
  };
}
// #endregion

// #region 5. Component Props Types
export interface TopicHeaderAreaProps {
  title: string;
  onBackPress: () => void;
  onShare?: () => void;
  showBackground?: boolean;
  backgroundColor?: string;
}

export interface TopicPostCardAreaProps {
  post: TopicPostItem;
  index: number;
  onPress: () => void;
  onLike: () => void;
  onComment: () => void;
  onShare: () => void;
  onUserPress: () => void;
  style?: any;
}

export interface TopicLoadingAreaProps {
  type: 'initial' | 'loadMore' | 'refresh';
  message?: string;
}

export interface TopicStatsAreaProps {
  stats: TopicStats;
  loading?: boolean;
}
// #endregion

// #region 6. State Types
export interface TopicDetailState {
  topicInfo: TopicInfo | null;
  posts: TopicPostItem[];
  isLoading: boolean;
  isRefreshing: boolean;
  isLoadingMore: boolean;
  error: string | null;
  hasMore: boolean;
  currentPage: number;
  totalPages: number;
}

export interface TopicFilters {
  sortBy: 'latest' | 'popular' | 'hot';
  timeRange: 'all' | 'today' | 'week' | 'month';
  mediaType: 'all' | 'image' | 'video' | 'text';
}
// #endregion

// #region 7. Event Handler Types
export type TopicRefreshHandler = () => void;
export type TopicLoadMoreHandler = () => void;
export type TopicPostLikeHandler = (postId: string) => void;
export type TopicPostCommentHandler = (postId: string) => void;
export type TopicPostShareHandler = (postId: string) => void;
export type TopicUserPressHandler = (userId: string) => void;
export type TopicPostPressHandler = (post: TopicPostItem) => void;
export type TopicShareHandler = () => void;
export type TopicFollowHandler = () => void;
// #endregion

// #region 8. API Types
export interface GetTopicInfoRequest {
  topicId: string;
}

export interface GetTopicInfoResponse {
  success: boolean;
  data: TopicInfo;
  message?: string;
}

export interface GetTopicPostsRequest {
  topicId: string;
  page?: number;
  pageSize?: number;
  sortBy?: 'latest' | 'popular' | 'hot';
  filters?: TopicFilters;
}

export interface GetTopicPostsResponse {
  success: boolean;
  data: {
    posts: TopicPostItem[];
    pagination: {
      page: number;
      pageSize: number;
      total: number;
      totalPages: number;
      hasMore: boolean;
    };
  };
  message?: string;
}

export interface LikeTopicPostRequest {
  postId: string;
  action: 'like' | 'unlike';
}

export interface LikeTopicPostResponse {
  success: boolean;
  data: {
    postId: string;
    isLiked: boolean;
    likeCount: number;
  };
  message?: string;
}
// #endregion

// #region 9. Exports
export type {
  // Re-export all types for convenience
  TopicDetailPageProps,
  TopicInfo,
  TopicStats,
  TopicPostItem,
  PostUser,
  UserInfo,
  TopicHeaderAreaProps,
  TopicPostCardAreaProps,
  TopicLoadingAreaProps,
  TopicStatsAreaProps,
  TopicDetailState,
  TopicFilters,
  TopicRefreshHandler,
  TopicLoadMoreHandler,
  TopicPostLikeHandler,
  TopicPostCommentHandler,
  TopicPostShareHandler,
  TopicUserPressHandler,
  TopicPostPressHandler,
  TopicShareHandler,
  TopicFollowHandler,
  GetTopicInfoRequest,
  GetTopicInfoResponse,
  GetTopicPostsRequest,
  GetTopicPostsResponse,
  LikeTopicPostRequest,
  LikeTopicPostResponse,
};
// #endregion
