/**
 * Main 页面组 - 常量配置
 */

import type { TabScreen } from './types';

export const VALID_TABS: TabScreen[] = ['home', 'discover', 'message', 'profile'];

export const STATUS_BAR_CONFIG = {
  home: {
    barStyle: 'light-content' as const,
    backgroundColor: '#8B5CF6'
  },
  discover: {
    barStyle: 'dark-content' as const,
    backgroundColor: '#FFFFFF'
  },
  message: {
    barStyle: 'dark-content' as const,
    backgroundColor: '#FFFFFF'
  },
  profile: {
    barStyle: 'light-content' as const,
    backgroundColor: '#8A2BE2'
  }
} as const;
