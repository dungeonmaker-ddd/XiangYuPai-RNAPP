/**
 * 发现页面 - 类型定义
 * 定义发现页面相关的所有类型接口
 */

// 内容类型枚举
export enum ContentType {
  IMAGE = 'image',
  VIDEO = 'video',
  TEXT = 'text',
  ACTIVITY = 'activity'
}

// 标签页类型
export enum TabType {
  FOLLOWING = 'following',
  TRENDING = 'trending', 
  NEARBY = 'nearby'
}

// 用户信息接口
export interface UserInfo {
  id: string;
  avatar: string;
  nickname: string;
  isVerified: boolean;
  isFollowed: boolean;
  isOnline?: boolean;
}

// 位置信息接口
export interface LocationInfo {
  id: string;
  name: string;
  distance?: string;
  coordinates?: {
    latitude: number;
    longitude: number;
  };
}

// 媒体文件接口
export interface MediaFile {
  id: string;
  url: string;
  width: number;
  height: number;
  thumbnailUrl?: string;
  duration?: number; // 视频时长(秒)
}

// 内容项接口
export interface ContentItem {
  id: string;
  type: ContentType;
  user: UserInfo;
  content?: string; // 文字内容
  media?: MediaFile[]; // 媒体文件
  tags?: string[]; // 话题标签
  mentions?: string[]; // @用户
  location?: LocationInfo; // 位置信息
  createdAt: string;
  updatedAt: string;
  
  // 互动数据
  likeCount: number;
  commentCount: number; 
  shareCount: number;
  isLiked: boolean;
  
  // 热门相关
  hotScore?: number; // 热度值
  trendingReason?: string; // 推荐理由
  
  // 同城相关
  isNearby?: boolean;
  distanceFromUser?: string;
}

// 活动内容接口
export interface ActivityContent extends ContentItem {
  type: ContentType.ACTIVITY;
  title: string;
  description: string;
  startTime: string;
  endTime: string;
  participantCount: number;
  maxParticipants?: number;
  fee?: string;
  organizer: UserInfo;
}

// 内容卡片Props
export interface ContentCardProps {
  item: ContentItem;
  onPress?: (item: ContentItem) => void;
  onLike?: (item: ContentItem) => void;
  onComment?: (item: ContentItem) => void;
  onShare?: (item: ContentItem) => void;
  onUserPress?: (user: UserInfo) => void;
  onLocationPress?: (location: LocationInfo) => void;
  onMore?: (item: ContentItem) => void;
}

// 瀑布流布局Props
export interface MasonryLayoutProps {
  data: ContentItem[];
  renderItem: (item: ContentItem, index: number) => React.ReactNode;
  onEndReached?: () => void;
  onRefresh?: () => void;
  refreshing?: boolean;
  loading?: boolean;
  error?: string | null;
  emptyText?: string;
  numColumns?: number;
  columnGap?: number;
  contentPadding?: number;
}

// 标签页Props
export interface FilterTabsProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
  tabs: Array<{
    key: TabType;
    title: string;
    badge?: number;
  }>;
}

// 发现页面状态接口
export interface DiscoverState {
  // 当前标签页
  activeTab: TabType;
  
  // 内容数据
  followingData: ContentItem[];
  trendingData: ContentItem[];
  nearbyData: ContentItem[];
  
  // 加载状态
  followingLoading: boolean;
  trendingLoading: boolean;
  nearbyLoading: boolean;
  
  // 刷新状态
  followingRefreshing: boolean;
  trendingRefreshing: boolean;
  nearbyRefreshing: boolean;
  
  // 错误状态
  followingError: string | null;
  trendingError: string | null;
  nearbyError: string | null;
  
  // 分页信息
  followingPage: number;
  trendingPage: number;
  nearbyPage: number;
  
  // 是否还有更多数据
  followingHasMore: boolean;
  trendingHasMore: boolean;
  nearbyHasMore: boolean;
  
  // 用户位置信息
  userLocation: LocationInfo | null;
  locationPermission: 'granted' | 'denied' | 'undetermined';
}

// 网络请求参数
export interface FetchContentParams {
  page: number;
  pageSize: number;
  type: TabType;
  location?: {
    latitude: number;
    longitude: number;
  };
}

// API响应接口
export interface ContentResponse {
  data: ContentItem[];
  total: number;
  page: number;
  hasMore: boolean;
}

// 点赞请求参数
export interface LikeParams {
  contentId: string;
  isLike: boolean;
}

// 评论请求参数  
export interface CommentParams {
  contentId: string;
  content: string;
  replyToId?: string;
}

// 分享请求参数
export interface ShareParams {
  contentId: string;
  platform: 'wechat' | 'qq' | 'weibo' | 'copy' | 'system';
}

// 关注请求参数
export interface FollowParams {
  userId: string;
  isFollow: boolean;
}

// 举报请求参数
export interface ReportParams {
  contentId: string;
  reason: string;
  description?: string;
}

// 地理位置权限状态
export type LocationPermissionStatus = 'granted' | 'denied' | 'undetermined';

// 内容筛选参数
export interface ContentFilterParams {
  distance?: 'nearby' | 'sameDistrict' | 'sameCity' | 'all';
  time?: 'realtime' | 'today' | 'thisWeek' | 'all';
  contentType?: 'all' | 'posts' | 'activities' | 'help';
}
