/**
 * 瀑布流模块统一导出
 * 基于通用组件架构核心标准 - 主组件导出层
 * 
 * @version 2.0.0
 * @author 架构团队
 */

// #region 主要组件导出
// ==========================================

// 主要瀑布流组件
export { default as WaterfallContainer } from './WaterfallContainer';
export { default as WaterfallScrollView } from './WaterfallScrollView';
export { default as WaterfallList } from './WaterfallList';
export { default as WaterfallCard } from './WaterfallCard';

// 默认导出主容器组件
export { default } from './WaterfallContainer';

// #endregion

// #region 类型定义导出
// ==========================================

export type {
  // 核心数据类型
  ContentItem,
  UserInfo,
  TabType,
  ImageQuality,
  MediaType,
  
  // 布局相关类型
  LayoutConfig,
  LayoutItem,
  
  // 虚拟化相关类型
  VirtualizationConfig,
  VirtualizationItemState,
  
  // 组件Props类型
  WaterfallModuleProps,
  WaterfallContainerProps,
  WaterfallScrollViewProps,
  WaterfallListProps,
  WaterfallCardProps,
  
  // 状态管理类型
  WaterfallModuleState,
  WaterfallCardState,
  
  // 事件处理类型
  WaterfallEventParams,
  WaterfallCardClickParams,
  WaterfallLikeClickParams,
  WaterfallUserClickParams,
  
  // API相关类型
  PaginationParams,
  PaginationResponse,
  ContentListResponse,
} from './types';

// #endregion

// #region 常量导出
// ==========================================

export {
  // 布局常量
  DEFAULT_LAYOUT_CONFIG,
  LAYOUT_CONSTANTS,
  
  // 虚拟化常量
  DEFAULT_VIRTUALIZATION_CONFIG,
  VIRTUALIZATION_CONSTANTS,
  
  // 图片常量
  IMAGE_QUALITY_CONFIG,
  IMAGE_CONSTANTS,
  
  // 设计系统常量
  COLORS,
  TYPOGRAPHY,
  ANIMATION_CONSTANTS,
  
  // API常量
  API_CONSTANTS,
  
  // 性能常量
  PERFORMANCE_CONSTANTS,
  
  // 用户体验常量
  UX_CONSTANTS,
} from './constants';

// #endregion

// #region 工具函数导出
// ==========================================

// 布局引擎
export { WaterfallLayoutEngine } from './WaterfallLayoutEngine';

// 虚拟化管理器
export { VirtualizationManager } from './VirtualizationManager';

// 格式化工具
export {
  formatDisplayCount,
  formatUserNickname,
  formatContentTitle,
} from './formatWaterfallCardDisplay';

// 图片处理工具
export {
  getOptimizedImageUrl,
  calculateImageDisplayHeight,
  validateImageUrl,
  getPlaceholderImageUrl,
} from './processWaterfallCardImage';

// #endregion

// #region 事件处理器导出
// ==========================================

// 卡片点击事件
export {
  onWaterfallCardClick,
  createWaterfallCardClickHandler,
  defaultWaterfallCardClickHandler,
} from './onWaterfallCardClick';

// 点赞事件
export {
  onWaterfallLikeClick,
  createWaterfallLikeClickHandler,
  defaultWaterfallLikeClickHandler,
} from './onWaterfallLikeClick';

// 刷新事件
export {
  onWaterfallRefresh,
  createWaterfallRefreshHandler,
  defaultWaterfallRefreshHandler,
} from './onWaterfallRefresh';

// 加载更多事件
export {
  onWaterfallLoadMore,
  createWaterfallLoadMoreHandler,
  defaultWaterfallLoadMoreHandler,
} from './onWaterfallLoadMore';

// 用户点击事件
export {
  onWaterfallUserClick,
  createWaterfallUserClickHandler,
  defaultWaterfallUserClickHandler,
} from './onWaterfallUserClick';

// #endregion

// #region 状态管理导出
// ==========================================

// 主状态管理
export { useWaterfallModule } from './useWaterfallModule';

// 卡片状态管理
export { useWaterfallCard } from './useWaterfallCard';

// #endregion

// #region 导航处理导出
// ==========================================

// 导航处理
export {
  navigateToContentDetail,
  createContentDetailNavigationHandler,
  defaultContentDetailNavigationHandler,
} from './navigateToContentDetail';

// #endregion

// #region API接口导出
// ==========================================

// 内容API接口
export {
  fetchWaterfallContentList,
  refreshWaterfallContent,
  fetchRecommendedContent,
  apiConfig,
  setApiConfig,
} from './apiWaterfallContent';

// 点赞API接口
export {
  likeWaterfallContent,
  batchLikeWaterfallContent,
  getWaterfallLikeStatus,
  getUserLikeHistory,
  likeApiConfig,
  setLikeApiConfig,
} from './apiWaterfallCardLike';

// 分页API接口
export {
  fetchPaginatedWaterfallContent,
  fetchCursorPaginatedContent,
  getPaginationStats,
  preloadNextPage,
  paginationApiConfig,
  setPaginationApiConfig,
} from './apiWaterfallPagination';

// #endregion
