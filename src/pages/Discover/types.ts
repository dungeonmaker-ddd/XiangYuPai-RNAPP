/**
 * Discover 页面组类型定义
 * 
 * 定义页面组级别的通用类型和接口
 */

// 页面组导航参数类型
export interface DiscoverNavigationParams {
  tab?: 'main' | 'detail';
  postId?: string;
  userId?: string;
  filter?: DiscoverFilterOptions;
  category?: string;
}

// 页面组状态类型
export interface DiscoverPageGroupState {
  currentFilter: DiscoverFilterOptions;
  currentPostId: string | null;
  isLoading: boolean;
  error: string | null;
}

// 筛选选项类型
export interface DiscoverFilterOptions {
  category?: 'hot' | 'nearby' | 'following';
  contentType?: 'all' | 'image' | 'video' | 'text';
  sortBy?: 'time' | 'popularity' | 'distance';
  tags?: string[];
}

// 内容项类型
export interface DiscoverContentItem {
  id: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  content: string;
  images?: string[];
  video?: string;
  tags: string[];
  location?: string;
  createdAt: string;
  likeCount: number;
  commentCount: number;
  shareCount: number;
  isLiked: boolean;
  isCollected: boolean;
  isFollowing: boolean;
}

// 评论类型
export interface DiscoverComment {
  id: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  content: string;
  createdAt: string;
  likeCount: number;
  isLiked: boolean;
  replies?: DiscoverComment[];
}

// 用户信息类型
export interface DiscoverUserInfo {
  id: string;
  name: string;
  avatar?: string;
  bio?: string;
  followersCount: number;
  followingCount: number;
  postsCount: number;
  isFollowing: boolean;
  isOnline: boolean;
}

// 从子页面导入的类型（重新导出）
export * from './MainPage/types';
export * from './DetailPage/types';
