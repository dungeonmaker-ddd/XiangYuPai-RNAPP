/**
 * TabBar 组件常量定义
 * 包含 Tab 栏相关的常量配置、样式常量和测试 ID
 */

import { TabConfig } from './types';

// Tab 栏布局常量
export const TAB_BAR_CONSTANTS = {
  // 高度配置
  TAB_BAR_HEIGHT: 48,
  STATUS_BAR_PADDING: 44,
  
  // 指示器配置
  INDICATOR_HEIGHT: 2,
  INDICATOR_WIDTH_RATIO: 0.3, // 指示器宽度为 Tab 宽度的 30%
  INDICATOR_OFFSET_RATIO: 0.35, // 居中对齐偏移量
  INDICATOR_BORDER_RADIUS: 1,
  
  // 交互配置
  ACTIVE_OPACITY: 0.7,
  
  // 边框配置
  BORDER_WIDTH: 1,
} as const;

// 动画配置
export const TAB_ANIMATION_CONFIG = {
  SWITCH_DURATION: 300,
  USE_NATIVE_DRIVER: true,
} as const;

// Tab 配置数据
export const DEFAULT_TABS: TabConfig[] = [
  { key: 'follow', title: '关注' },
  { key: 'hot', title: '热门' },
  { key: 'local', title: '同城' },
];

// 颜色常量 (从 discover/constants 继承)
export const TAB_BAR_COLORS = {
  BACKGROUND: '#FFFFFF',
  BORDER_LIGHT: '#F0F0F0',
  TEXT_PRIMARY: '#333333',
  TEXT_SECONDARY: '#999999',
  PRIMARY: '#FF6B6B',
  TRANSPARENT: 'transparent',
} as const;

// 字体样式常量
export const TAB_BAR_TYPOGRAPHY = {
  BODY_MEDIUM: {
    fontSize: 16,
    lineHeight: 24,
  },
  ACTIVE_FONT_SIZE: 18,
  INACTIVE_FONT_SIZE: 16,
  ACTIVE_FONT_WEIGHT: 'bold' as const,
  INACTIVE_FONT_WEIGHT: '500' as const,
} as const;

// 测试 ID 常量
export const TAB_BAR_TEST_IDS = {
  TAB_BAR: 'tab_bar_container',
  TAB_ITEM: 'tab_bar_item',
  TAB_INDICATOR: 'tab_bar_indicator',
} as const;
