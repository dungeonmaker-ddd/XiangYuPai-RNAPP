/**
 * 瀑布流模块统一类型定义
 * 基于通用组件架构核心标准 - 类型定义层
 * 
 * @version 2.0.0
 * @author 架构团队
 */

import { ViewStyle } from 'react-native';

// =====================================================
// 核心数据类型
// =====================================================

/**
 * 内容项数据结构
 */
export interface ContentItem {
  id: string;
  title: string;
  imageUrl: string;
  width: number;
  height: number;
  type: 'image' | 'video' | 'live';
  likeCount: number;
  isLiked: boolean;
  isCollected: boolean;
  commentCount: number;
  shareCount: number;
  createdAt: string;
  updatedAt: string;
  user: UserInfo;
  liveRoomId?: string;
  videoUrl?: string;
  description?: string;
  tags?: string[];
}

/**
 * 用户信息结构
 */
export interface UserInfo {
  id: string;
  nickname: string;
  avatar: string;
  verified?: boolean;
  level?: number;
  isFollowing: boolean;
}

/**
 * 标签页类型
 */
export type TabType = 'follow' | 'hot' | 'local';

/**
 * 图片质量类型
 */
export type ImageQuality = 'high' | 'standard' | 'low';

/**
 * 媒体类型
 */
export type MediaType = 'image' | 'video' | 'live';

// =====================================================
// 布局相关类型
// =====================================================

/**
 * 布局配置接口
 */
export interface LayoutConfig {
  columnCount: number;
  columnSpacing: number;
  rowSpacing: number;
  containerPadding: number;
  itemBorderRadius: number;
  screenWidth: number;
}

/**
 * 布局项目接口
 */
export interface LayoutItem {
  id: string;
  data: ContentItem;
  x: number;
  y: number;
  width: number;
  height: number;
  column: number;
}

// =====================================================
// 虚拟化相关类型
// =====================================================

/**
 * 虚拟化配置接口
 */
export interface VirtualizationConfig {
  enabled: boolean;
  bufferSize: number;
  recycleThreshold: number;
  maxCacheSize: number;
}

/**
 * 虚拟化项目状态
 */
export type VirtualizationItemState = 'visible' | 'buffered' | 'recycled';

// =====================================================
// 组件Props接口
// =====================================================

/**
 * 瀑布流模块主组件Props
 */
export interface WaterfallModuleProps {
  data: ContentItem[];
  tabType: TabType;
  loading?: boolean;
  refreshing?: boolean;
  hasMore?: boolean;
  
  // 事件回调
  onRefresh: () => void;
  onLoadMore: () => void;
  onLike?: (itemId: string) => void;
  
  // 配置选项
  showStatusBar?: boolean;
  enableVirtualization?: boolean;
  customLayoutConfig?: Partial<LayoutConfig>;
  imageQuality?: ImageQuality;
  
  // 外部依赖注入
  navigation?: any;
  analytics?: any;
  showToast?: (message: string) => void;
  
  // 样式
  style?: ViewStyle;
}

/**
 * 瀑布流容器Props
 */
export interface WaterfallContainerProps {
  data: ContentItem[];
  tabType: TabType;
  onLoadMore: () => void;
  onRefresh: () => void;
  refreshing: boolean;
  loading: boolean;
  hasMore: boolean;
  onLike?: (itemId: string) => void;
  
  // 配置选项
  showStatusBar?: boolean;
  enableVirtualization?: boolean;
  customLayoutConfig?: Partial<LayoutConfig>;
  imageQuality?: ImageQuality;
  
  // 事件处理配置
  navigation?: any;
  analytics?: any;
  showToast?: (message: string) => void;
}

/**
 * 瀑布流滚动视图Props
 */
export interface WaterfallScrollViewProps {
  data: ContentItem[];
  layoutEngine: any; // 布局引擎实例
  virtualizationManager: any; // 虚拟化管理器实例
  tabType: TabType;
  onLoadMore: () => void;
  onRefresh: () => void;
  refreshing: boolean;
  loading: boolean;
  hasMore: boolean;
  onLike?: (itemId: string) => void;
  imageQuality?: ImageQuality;
  
  // 事件处理配置
  navigation?: any;
  analytics?: any;
  showToast?: (message: string) => void;
}

/**
 * 瀑布流列表Props (兼容性)
 */
export interface WaterfallListProps {
  data: ContentItem[];
  loading?: boolean;
  refreshing?: boolean;
  hasMore?: boolean;
  onRefresh: () => void;
  onLoadMore: () => void;
  onItemPress?: (item: ContentItem, index: number) => void;
  onLike?: (itemId: string) => void;
  onCollect?: (itemId: string) => void;
  onUserPress?: (user: UserInfo, item: ContentItem) => void;
  onShare?: (item: ContentItem) => void;
  
  // 外部依赖
  navigation?: any;
  analytics?: any;
  showToast?: (message: string) => void;
}

/**
 * 瀑布流卡片Props
 */
export interface WaterfallCardProps {
  item: ContentItem;
  index: number;
  tabType: TabType;
  style?: ViewStyle;
  imageQuality?: ImageQuality;
  
  // 事件处理依赖注入
  navigation?: any;
  analytics?: any;
  showToast?: (message: string) => void;
  
  // 可选回调函数
  onLike?: () => void;
  onLongPress?: () => void;
}

// =====================================================
// 状态管理相关类型
// =====================================================

/**
 * 瀑布流模块状态
 */
export interface WaterfallModuleState {
  // 数据状态
  data: ContentItem[];
  loading: boolean;
  refreshing: boolean;
  hasMore: boolean;
  
  // 布局状态
  layoutConfig: LayoutConfig;
  layoutItems: LayoutItem[];
  totalHeight: number;
  
  // 滚动状态
  scrollOffset: number;
  containerHeight: number;
  lastScrollDirection: 'up' | 'down';
  
  // 虚拟化状态
  visibleItems: LayoutItem[];
  virtualizedItemStates: Map<string, VirtualizationItemState>;
}

/**
 * 瀑布流卡片状态
 */
export interface WaterfallCardState {
  // 图片状态
  imageLoaded: boolean;
  imageError: boolean;
  imageLoadingStartTime: number | null;
  
  // 交互状态
  isPressed: boolean;
  isLongPressed: boolean;
  
  // 数据状态
  likeCount: number;
  isLiked: boolean;
  
  // UI状态
  isVisible: boolean;
  animationPhase: 'idle' | 'entering' | 'visible' | 'exiting';
}

// =====================================================
// 事件处理相关类型
// =====================================================

/**
 * 瀑布流事件处理器参数基类
 */
export interface WaterfallEventParams {
  item: ContentItem;
  index: number;
  tabType: TabType;
  navigation?: any;
  analytics?: any;
  showToast?: (message: string) => void;
}

/**
 * 卡片点击事件参数
 */
export interface WaterfallCardClickParams extends WaterfallEventParams {
  clickPosition?: { x: number; y: number };
  onCardOpen?: (itemId: string) => void;
  onNavigationSuccess?: (itemId: string, targetScreen: string) => void;
  onNavigationError?: (itemId: string, error: Error) => void;
}

/**
 * 点赞事件参数
 */
export interface WaterfallLikeClickParams extends WaterfallEventParams {
  clickPosition?: { x: number; y: number };
  onLikeSuccess?: (itemId: string, newLikeCount: number) => void;
  onLikeError?: (itemId: string, error: Error) => void;
}

/**
 * 用户点击事件参数
 */
export interface WaterfallUserClickParams extends WaterfallEventParams {
  user: UserInfo;
  clickType: 'avatar' | 'nickname' | 'userInfo';
  clickPosition?: { x: number; y: number };
  onUserProfileOpen?: (userId: string) => void;
  onFollowSuccess?: (userId: string, isFollowing: boolean) => void;
  onNavigationError?: (error: Error) => void;
}

// =====================================================
// API相关类型
// =====================================================

/**
 * 分页请求参数
 */
export interface PaginationParams {
  page: number;
  limit: number;
  tabType: TabType;
  lastItemId?: string;
}

/**
 * 分页响应数据
 */
export interface PaginationResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    hasMore: boolean;
    nextCursor?: string;
  };
}

/**
 * 内容列表API响应
 */
export interface ContentListResponse extends PaginationResponse<ContentItem> {
  metadata?: {
    totalCount: number;
    refreshTime: string;
    algorithm?: string;
  };
}

// =====================================================
// 工具类型
// =====================================================

/**
 * 可选属性工具类型
 */
export type Optional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;

/**
 * 深度只读类型
 */
export type DeepReadonly<T> = {
  readonly [P in keyof T]: T[P] extends object ? DeepReadonly<T[P]> : T[P];
};

/**
 * 事件处理器类型
 */
export type EventHandler<T = void> = (params: any) => Promise<T> | T;
