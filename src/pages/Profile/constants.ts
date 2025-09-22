/**
 * Profile 页面组常量配置
 * 
 * 定义页面组级别的通用常量
 */

// 页面组标识
export const PROFILE_PAGE_GROUP = 'Profile';

// 页面类型常量
export const PROFILE_PAGES = {
  MAIN: 'MainPage',
  REPORT: 'ReportPage',
} as const;

// 导航路由常量
export const PROFILE_ROUTES = {
  MAIN: '/profile',
  REPORT: '/profile/report',
} as const;

// 从子页面导入的常量（重新导出）
export * from './MainPage/constants';
export * from './ReportPage/constants';
