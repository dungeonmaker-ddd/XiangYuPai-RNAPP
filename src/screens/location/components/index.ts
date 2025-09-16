/**
 * 地区选择模块 - 组件导出索引
 */

// 注意：当前所有组件都在 LocationSelectorScreen.tsx 中实现
// 这符合单文件模块的架构原则，避免过度拆分

// 如果将来需要独立组件，可以在这里导出：
// export { CurrentLocationCard } from './CurrentLocationCard';
// export { HotCitiesGrid } from './HotCitiesGrid';
// export { AlphabetIndex } from './AlphabetIndex';
// export { RegionList } from './RegionList';

// 当前导出主屏幕组件
export { default as LocationSelectorScreen } from '../LocationSelectorScreen';

// 导出类型和常量
export * from '../types';
export * from '../constants';
