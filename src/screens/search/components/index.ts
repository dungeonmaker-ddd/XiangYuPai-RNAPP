/**
 * 🔍 搜索模块组件导出索引
 * 
 * 统一导出所有搜索相关组件
 * 便于外部模块引用和使用
 */

// 基础搜索组件
export { default as SearchInput } from './SearchInput';
export { default as SearchTabs } from './SearchTabs';
export { default as SearchHistory } from './SearchHistory';
export { default as SearchSuggestions } from './SearchSuggestions';

// 结果展示组件 (待实现)
// export { default as ContentCard } from './ContentCard';
// export { default as UserResultCard } from './UserResultCard';
// export { default as ServiceResultCard } from './ServiceResultCard';
// export { default as TopicResultCard } from './TopicResultCard';
// export { default as MasonryLayout } from './MasonryLayout';

// 状态组件 (待实现)
// export { default as LoadingState } from './LoadingState';
// export { default as EmptyState } from './EmptyState';
// export { default as ErrorState } from './ErrorState';

// 重新导出类型和常量供组件使用
export * from '../types';
export * from '../constants';
