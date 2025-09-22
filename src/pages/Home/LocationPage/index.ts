/**
 * 地区选择模块 - 主导出索引
 */

// 主页面组件
export { default as HomeLocationScreen } from './HomeLocationScreen';
export { default as LocationSelectorScreen } from './HomeLocationScreen'; // 兼容性导出
export type { HomeLocationScreenProps } from './types';

// 状态管理导出
export { default as useHomeLocation } from './useHomeLocation';

// 导航导出
export * from './navigateToHomeLocation';

// 类型和常量导出
export * from './types';
export * from './constants';
