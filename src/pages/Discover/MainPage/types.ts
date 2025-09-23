/**
 * 发现主页面类型定义
 * 支持三标签内容分发系统（热门/关注/同城）
 */

// #region 1. 核心枚举类型

/** 发现页面标签类型 */
export enum DiscoverTabType {
  HOT = 'hot',        // 热门Tab
  FOLLOW = 'follow',  // 关注Tab
  LOCAL = 'local'     // 同城Tab
}

/** 内容类型 */
export enum ContentType {
  IMAGE = 'image',    // 图片内容
  VIDEO = 'video',    // 视频内容
  TEXT = 'text'       // 文字内容
}

/** 互动类型 */
export enum InteractionType {
  LIKE = 'like',      // 点赞
  COLLECT = 'collect', // 收藏
  SHARE = 'share',    // 分享
  COMMENT = 'comment' // 评论
}

// #endregion

// #region 2. 基础数据结构

/** 用户信息 */
export interface UserInfo {
  id: string;
  nickname: string;
  avatar: string;
  level?: number;
  isVerified?: boolean;
  isFollowed?: boolean;
}

/** 内容项目 */
export interface ContentItem {
  id: string;
  type: ContentType;
  title: string;
  description?: string;
  images: string[];
  videoUrl?: string;
  author: UserInfo;
  likeCount: number;
  collectCount: number;
  commentCount: number;
  shareCount: number;
  isLiked: boolean;
  isCollected: boolean;
  createdAt: string;
  tags?: string[];
  
  // 热门Tab专用字段
  hotScore?: number;
  hotRank?: number;
  
  // 关注Tab专用字段
  followedAt?: string;
  isNewContent?: boolean;
  
  // 同城Tab专用字段
  location?: LocationInfo;
  distance?: number;
  merchantInfo?: MerchantInfo;
}

/** 地理位置信息 */
export interface LocationInfo {
  latitude: number;
  longitude: number;
  address: string;
  city: string;
  district?: string;
}

/** 商家信息 */
export interface MerchantInfo {
  id: string;
  name: string;
  isVerified: boolean;
  isOpen: boolean;
  phone?: string;
  businessHours?: string;
  category?: string;
}

// #endregion

// #region 3. 组件Props接口

/** 发现主页面Props */
export interface DiscoverMainPageProps {
  initialTab?: DiscoverTabType;
  onTabChange?: (tab: DiscoverTabType) => void;
  onContentPress?: (content: ContentItem) => void;
  onUserPress?: (user: UserInfo) => void;
  onCameraPress?: () => void;
}

/** Tab导航Props */
export interface TabNavigationProps {
  activeTab: DiscoverTabType;
  onTabChange: (tab: DiscoverTabType) => void;
  hasNewContent?: boolean;
}

/** 瀑布流容器Props */
export interface MasonryContainerProps {
  contentList: ContentItem[];
  loading: boolean;
  hasMore: boolean;
  onLoadMore: () => void;
  onContentPress: (content: ContentItem) => void;
  onLike: (contentId: string) => void;
  onUserPress: (user: UserInfo) => void;
  tabType: DiscoverTabType;
}

/** 内容卡片Props */
export interface ContentCardProps {
  content: ContentItem;
  onPress: () => void;
  onLike: () => void;
  onUserPress: () => void;
  onLongPress?: () => void;
  tabType: DiscoverTabType;
}

/** 头部区域Props */
export interface HeaderAreaProps {
  onCameraPress: () => void;
  showLocationIcon?: boolean;
  currentLocation?: string;
}

// #endregion

// #region 4. 状态管理接口

/** 发现页面状态 */
export interface DiscoverState {
  activeTab: DiscoverTabType;
  
  // 各Tab内容列表
  hotContent: ContentItem[];
  followContent: ContentItem[];
  localContent: ContentItem[];
  
  // 加载状态
  hotLoading: boolean;
  followLoading: boolean;
  localLoading: boolean;
  
  // 是否有更多
  hotHasMore: boolean;
  followHasMore: boolean;
  localHasMore: boolean;
  
  // 滚动位置记忆
  scrollPositions: Record<DiscoverTabType, number>;
  
  // 用户状态
  isLoggedIn: boolean;
  currentUser?: UserInfo;
  
  // 位置信息
  locationPermission: 'granted' | 'denied' | 'pending';
  currentLocation?: LocationInfo;
}

/** 筛选配置 */
export interface FilterConfig {
  contentType?: ContentType[];
  timeRange?: 'today' | 'week' | 'month' | 'all';
  sortBy?: 'hot' | 'new' | 'distance';
  distance?: number; // 同城Tab专用，单位：km
}

// #endregion

// #region 5. API接口类型

/** 内容列表请求参数 */
export interface ContentListParams {
  tab: DiscoverTabType;
  page: number;
  size: number;
  userId?: string;
  lastId?: string;
  location?: LocationInfo;
  filter?: FilterConfig;
}

/** 内容列表响应 */
export interface ContentListResponse {
  code: number;
  message: string;
  data: {
    list: ContentItem[];
    hasMore: boolean;
    nextCursor?: string;
    total?: number;
  };
}

/** 点赞操作参数 */
export interface LikeActionParams {
  contentId: string;
  action: 'like' | 'unlike';
}

/** 点赞操作响应 */
export interface LikeActionResponse {
  code: number;
  message: string;
  data: {
    liked: boolean;
    likeCount: number;
  };
}

// #endregion

// #region 6. 事件处理类型

/** 内容互动事件 */
export interface ContentInteractionEvent {
  type: InteractionType;
  contentId: string;
  userId: string;
  timestamp: number;
}

/** 用户行为事件 */
export interface UserBehaviorEvent {
  action: string;
  tab: DiscoverTabType;
  contentId?: string;
  position?: number;
  duration?: number;
  timestamp: number;
}

// #endregion

// #region 7. 样式配置类型

/** 卡片尺寸配置 */
export interface CardDimensions {
  width: number;
  minHeight: number;
  maxHeight: number;
  imageAspectRatio: number;
}

/** 瀑布流配置 */
export interface MasonryConfig {
  columns: number;
  gap: number;
  cardWidth: number;
  bufferSize: number;
}

// #endregion

export default {};