/**
 * Main 页面组 - 类型定义
 */

export type TabScreen = 'home' | 'discover' | 'message' | 'profile';

export interface StatusBarConfig {
  barStyle: 'light-content' | 'dark-content';
  backgroundColor: string;
}
