/**
 * Discover 页面组常量配置
 * 
 * 定义页面组级别的通用常量
 */

// 页面组标识
export const DISCOVER_PAGE_GROUP = 'Discover';

// 页面类型常量
export const DISCOVER_PAGES = {
  MAIN: 'MainPage',
  DETAIL: 'DetailPage',
} as const;

// 导航路由常量
export const DISCOVER_ROUTES = {
  MAIN: '/discover',
  DETAIL: '/discover/detail',
} as const;

// 内容分类常量
export const DISCOVER_CATEGORIES = {
  HOT: 'hot',
  NEARBY: 'nearby',
  FOLLOWING: 'following',
} as const;

// 内容类型常量
export const CONTENT_TYPES = {
  ALL: 'all',
  IMAGE: 'image',
  VIDEO: 'video',
  TEXT: 'text',
} as const;

// 排序方式常量
export const SORT_OPTIONS = {
  TIME: 'time',
  POPULARITY: 'popularity',
  DISTANCE: 'distance',
} as const;

// 交互类型常量
export const INTERACTION_TYPES = {
  LIKE: 'like',
  COMMENT: 'comment',
  SHARE: 'share',
  COLLECT: 'collect',
  FOLLOW: 'follow',
  REPORT: 'report',
} as const;

// 默认配置
export const DEFAULT_DISCOVER_CONFIG = {
  PAGE_SIZE: 10,
  MAX_IMAGES_PER_POST: 9,
  MAX_VIDEO_DURATION: 60, // 秒
  MAX_CONTENT_LENGTH: 500,
  AUTO_REFRESH_INTERVAL: 60000, // 60秒
  IMAGE_QUALITY: 0.8,
  VIDEO_QUALITY: 'medium',
};

// 默认筛选选项
export const DEFAULT_FILTER_OPTIONS: DiscoverFilterOptions = {
  category: 'hot',
  contentType: 'all',
  sortBy: 'time',
  tags: [],
};

// 从子页面导入的常量（重新导出）
export * from './MainPage/constants';
export * from './DetailPage/constants';
