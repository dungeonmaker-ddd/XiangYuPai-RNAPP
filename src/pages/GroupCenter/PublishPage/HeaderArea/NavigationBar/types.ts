/**
 * 📋 NavigationBar 区域类型定义
 */

export interface NavigationState {
  isNavigating: boolean;
  canCancel: boolean;
  lastNavigationTime: number;
  confirmationRequired: boolean;
}

export interface NavigationAction {
  type: 'START_NAVIGATION' | 'FINISH_NAVIGATION' | 'SET_CONFIRMATION' | 'SET_CANCEL_STATE';
  payload?: any;
}
