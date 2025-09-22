/**
 * 🔍 搜索模块统一导出 - 嵌套化主导架构
 */

// 主页面组件（页面父组件）
export { default as SearchScreen } from './SearchScreen';
export { default } from './SearchScreen';

// 区域组件导出
export { default as SearchHeaderArea } from './SearchHeaderArea';
export { default as SearchInputArea } from './SearchInputArea';
export { default as SearchHistoryArea } from './SearchHistoryArea';
export { default as SearchSuggestionsArea } from './SearchSuggestionsArea';
export { default as SearchTabsArea } from './SearchTabsArea';
export { default as SearchResultsArea } from './SearchResultsArea';

// 状态管理Hooks导出
export { useSearchState } from './useSearchState';
export { useSearchNavigation } from './useSearchNavigation';
export { useSearchData } from './useSearchData';

// 类型和常量导出
export * from './types';
export * from './constants';
export * from './utils';
