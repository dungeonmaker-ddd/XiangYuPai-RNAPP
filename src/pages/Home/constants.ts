/**
 * Home 页面组常量配置
 * 
 * 定义页面组级别的通用常量
 */

// 页面组标识
export const HOME_PAGE_GROUP = 'Home';

// 页面类型常量
export const HOME_PAGES = {
  MAIN: 'MainPage',
  LOCATION: 'LocationPage',
  SEARCH: 'SearchPage',
} as const;

// 导航路由常量
export const HOME_ROUTES = {
  MAIN: '/home',
  LOCATION: '/home/location',
  SEARCH: '/home/search',
} as const;

// 默认筛选配置
export const DEFAULT_FILTER_OPTIONS = {
  gameType: [],
  ageRange: 'all',
  gender: 'all',
  distance: 10,
  sortBy: 'distance' as const,
};

// 从子页面导入的常量（重新导出）
export * from './MainPage/constants';
export * from './LocationPage/constants';
export * from './SearchPage/constants';
