/**
 * Profile 页面组类型定义
 * 
 * 定义页面组级别的通用类型和接口
 */

// 页面组导航参数类型
export interface ProfileNavigationParams {
  userId?: string;
  tab?: 'main' | 'report';
  reportType?: string;
}

// 页面组状态类型
export interface ProfilePageGroupState {
  currentUserId: string | null;
  isLoading: boolean;
  error: string | null;
}

// 从子页面导入的类型（重新导出）
export * from './MainPage/types';
export * from './ReportPage/types';
