/**
 * 发现页面模块类型定义
 * 包含所有接口、类型和枚举定义
 */

// 内容类型枚举
export type ContentType = 'image' | 'video' | 'live';

// Tab类型枚举
export type TabType = 'follow' | 'hot' | 'local';

// 地理位置信息
export interface LocationInfo {
  latitude: number;
  longitude: number;
  address: string;
  distance?: number;
}

// 用户信息
export interface UserInfo {
  id: string;
  nickname: string;
  avatar: string;
  isFollowing: boolean;
  verified?: boolean;
  level?: number;
}

// 内容项
export interface ContentItem {
  id: string;
  type: ContentType;
  imageUrl: string;
  videoUrl?: string;
  title: string;
  description?: string;
  user: UserInfo;
  likeCount: number;
  commentCount: number;
  shareCount: number;
  isLiked: boolean;
  isCollected: boolean;
  createdAt: string;
  updatedAt: string;
  location?: LocationInfo;
  tags?: string[];
  width: number;
  height: number;
}

// Tab配置
export interface TabConfig {
  key: TabType;
  title: string;
  icon?: string;
}

// 发现页面Props
export interface DiscoverScreenProps {
  navigation: any;
  route?: any;
}

// 内容卡片Props
export interface ContentCardProps {
  item: ContentItem;
  index: number;
  onPress: (item: ContentItem) => void;
  onLike: (itemId: string) => void;
  onCollect: (itemId: string) => void;
  onUserPress: (userId: string) => void;
  onShare: (item: ContentItem) => void;
}

// Tab栏Props (包含购物车功能)
export interface TabBarProps {
  tabs: TabConfig[];
  activeTab: TabType;
  onTabPress: (tab: TabType) => void;
  onCartPress?: () => void;
  cartBadgeCount?: number;
}

// 瀑布流列表Props
export interface WaterfallListProps {
  data: ContentItem[];
  loading: boolean;
  refreshing: boolean;
  hasMore: boolean;
  onRefresh: () => void;
  onLoadMore: () => void;
  onItemPress: (item: ContentItem) => void;
  onLike: (itemId: string) => void;
  onCollect: (itemId: string) => void;
  onUserPress: (userId: string) => void;
  onShare: (item: ContentItem) => void;
  // 导航和事件处理
  navigation?: any;
  analytics?: any;
  showToast?: (message: string) => void;
}

// API响应类型
export interface ApiResponse<T> {
  code: number;
  message: string;
  data: T;
  success: boolean;
}

// 内容列表响应
export interface ContentListResponse {
  list: ContentItem[];
  hasMore: boolean;
  nextCursor?: string;
  total: number;
}

// 点赞响应
export interface LikeResponse {
  isLiked: boolean;
  likeCount: number;
}

// 关注响应
export interface FollowResponse {
  isFollowing: boolean;
  followerCount: number;
}

// 错误类型
export interface AppError {
  code: string;
  message: string;
  details?: any;
}

// 状态类型
export interface DiscoverState {
  currentTab: TabType;
  content: {
    follow: ContentItem[];
    hot: ContentItem[];
    local: ContentItem[];
  };
  loading: {
    follow: boolean;
    hot: boolean;
    local: boolean;
  };
  refreshing: {
    follow: boolean;
    hot: boolean;
    local: boolean;
  };
  hasMore: {
    follow: boolean;
    hot: boolean;
    local: boolean;
  };
  error: string | null;
  lastRefreshTime: {
    follow: number;
    hot: number;
    local: number;
  };
}