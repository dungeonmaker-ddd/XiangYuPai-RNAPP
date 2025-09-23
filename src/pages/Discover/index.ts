/**
 * Discover 页面组入口文件
 * 
 * 导出页面组的所有页面和相关模块
 */

// 主页面导出
export { default as DiscoverMainPage } from './MainPage';

// 主页面组件区域导出
export { default as HeaderArea } from './MainPage/HeaderArea';
export { default as TabNavigationArea } from './MainPage/TabNavigationArea';
export { default as MasonryContentArea } from './MainPage/MasonryContentArea';
export { default as ContentCardArea } from './MainPage/ContentCardArea';

// 子页面导出
export { default as DiscoverDetailPage } from './DetailPage';
export { default as DiscoverPublishPage } from './PublishPage';
export { default as DiscoverReportPage } from './ReportPage';

// 类型和常量导出
export * from './types';
export * from './constants';
export * from './MainPage/types';
export { default as DiscoverMainConstants } from './MainPage/constants';

// 状态管理导出
export * from './useDiscover';
export * from './useDiscoverData';
export * from './navigateDiscoverFlow';
