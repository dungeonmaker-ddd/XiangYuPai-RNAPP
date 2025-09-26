/**
 * 组局中心模块 - 导出索引
 * 基于通用组件架构核心标准的模块导出
 */

// 主页面组件
export { default as GroupCenterScreen } from './index.tsx';

// 类型定义
export * from './types';

// 常量配置
export * from './constants';

// 组件区域导出
export { HeaderArea } from './HeaderArea';
export { FilterArea } from './FilterArea';
export { ContentArea } from './ContentArea';

// 状态管理导出
export { useGroupCenter } from './useGroupCenter';
export { useGroupCenterData } from './useGroupCenterData';

// 导航功能导出
export { navigateToDetail } from './navigateToDetail';
export { navigateBack } from './navigateBack';
