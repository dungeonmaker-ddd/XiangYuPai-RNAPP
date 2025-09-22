/**
 * Home 页面组类型定义
 * 
 * 定义页面组级别的通用类型和接口
 */

// 页面组导航参数类型
export interface HomeNavigationParams {
  tab?: 'main' | 'location' | 'search';
  region?: string;
  searchKeyword?: string;
  filters?: HomeFilterOptions;
}

// 页面组状态类型
export interface HomePageGroupState {
  currentRegion: string | null;
  selectedFilters: HomeFilterOptions;
  isLoading: boolean;
  error: string | null;
}

// 筛选选项类型
export interface HomeFilterOptions {
  gameType?: string[];
  ageRange?: string;
  gender?: string;
  distance?: number;
  sortBy?: 'distance' | 'time' | 'popularity';
}

// 从子页面导入的类型（重新导出）
export * from './MainPage/types';
export * from './LocationPage/types';
export * from './SearchPage/types';
