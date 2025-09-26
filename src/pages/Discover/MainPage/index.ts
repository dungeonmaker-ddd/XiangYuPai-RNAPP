/**
 * Discover MainPage 导出文件
 * 
 * 导出主页面组件和相关模块
 */

// 主页面组件导出
export { default as DiscoverMainPage } from './index.tsx';
export { default } from './index.tsx';

// 区域组件导出
export { default as HeaderArea } from './HeaderArea';
export { default as TabNavigationArea } from './TabNavigationArea';
export { default as MasonryContentArea } from './MasonryContentArea';
export { default as ContentCardArea } from './ContentCardArea';

// 类型和常量导出
export * from './types';
export * from './constants';
