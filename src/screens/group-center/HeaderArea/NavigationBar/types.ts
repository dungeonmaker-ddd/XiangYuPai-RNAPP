/**
 * 📋 NavigationBar 区域类型定义
 */

export interface NavigationState {
  isNavigating: boolean;
  canGoBack: boolean;
  lastNavigationTime: number;
}

export interface NavigationAction {
  type: 'START_NAVIGATION' | 'FINISH_NAVIGATION' | 'UPDATE_BACK_STATE';
  payload?: any;
}
