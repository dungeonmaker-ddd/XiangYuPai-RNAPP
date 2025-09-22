/**
 * 🏠 首页模块统一导出 - 嵌套化主导架构
 */

// 主页面组件（页面父组件） - 重命名避免循环引用
export { default as HomeScreen } from './HomeScreen';
export { default } from './HomeScreen';

// 区域组件导出
export { default as HeaderArea } from './HeaderArea';
export { default as GameBannerArea } from './GameBannerArea';
export { default as FunctionGridArea } from './FunctionGridArea';
export { default as LimitedOffersArea } from './LimitedOffersArea';
export { default as TeamPartyArea } from './TeamPartyArea';
export { default as FilterTabsArea } from './FilterTabsArea';
export { default as UserListArea } from './UserListArea';

// 状态管理Hooks导出
export { useHomeState } from './useHomeState';
export { useHomeNavigation } from './useHomeNavigation';
export { useHomeData } from './useHomeData';

// 类型和常量导出
export type { UserCard, FunctionItem, LocationInfo } from './types';
export { COLORS, SCREEN_WIDTH, SCREEN_HEIGHT } from './constants';
