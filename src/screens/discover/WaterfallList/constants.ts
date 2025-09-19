/**
 * 瀑布流模块统一常量定义
 * 基于通用组件架构核心标准 - 常量配置层
 * 
 * @version 2.0.0
 * @author 架构团队
 */

import { LayoutConfig, VirtualizationConfig, ImageQuality } from './types';

// =====================================================
// 布局相关常量
// =====================================================

/**
 * 默认布局配置
 */
export const DEFAULT_LAYOUT_CONFIG: LayoutConfig = {
  columnCount: 2,
  columnSpacing: 8,
  rowSpacing: 12,
  containerPadding: 16,
  itemBorderRadius: 12,
  screenWidth: 375, // 默认屏幕宽度，会动态更新
};

/**
 * 布局计算常量
 */
export const LAYOUT_CONSTANTS = {
  // 间距
  PADDING_HORIZONTAL: 16,
  PADDING_VERTICAL: 12,
  MARGIN_SMALL: 8,
  MARGIN_MEDIUM: 12,
  MARGIN_LARGE: 16,
  MARGIN_XLARGE: 24,
  
  // 列相关
  MIN_COLUMN_COUNT: 1,
  MAX_COLUMN_COUNT: 4,
  MIN_COLUMN_WIDTH: 150,
  COLUMN_GAP: 8,
  
  // 卡片相关
  CARD_RADIUS: 12,
  CARD_MIN_HEIGHT: 120,
  CARD_MAX_HEIGHT: 400,
  CARD_SHADOW_OFFSET: { width: 0, height: 2 },
  CARD_SHADOW_OPACITY: 0.1,
  CARD_SHADOW_RADIUS: 4,
  
  // 头像和图标
  AVATAR_SIZE_SMALL: 32,
  AVATAR_SIZE_MEDIUM: 40,
  ICON_SIZE_SMALL: 16,
  ICON_SIZE_MEDIUM: 20,
  
  // 滚动相关
  LOAD_MORE_THRESHOLD: 100, // 距离底部100px时触发加载更多
  SCROLL_THROTTLE: 16, // 滚动事件节流间隔
} as const;

// =====================================================
// 虚拟化相关常量
// =====================================================

/**
 * 默认虚拟化配置
 */
export const DEFAULT_VIRTUALIZATION_CONFIG: VirtualizationConfig = {
  enabled: true,
  bufferSize: 1.5, // 缓冲区大小倍数
  recycleThreshold: 50, // 回收阈值
  maxCacheSize: 100, // 最大缓存大小
};

/**
 * 虚拟化性能常量
 */
export const VIRTUALIZATION_CONSTANTS = {
  DEFAULT_BUFFER_SIZE: 1.5,
  MIN_BUFFER_SIZE: 1.0,
  MAX_BUFFER_SIZE: 3.0,
  DEFAULT_RECYCLE_THRESHOLD: 50,
  MIN_RECYCLE_THRESHOLD: 20,
  MAX_RECYCLE_THRESHOLD: 100,
  DEFAULT_CACHE_SIZE: 100,
  MIN_CACHE_SIZE: 50,
  MAX_CACHE_SIZE: 200,
  PRELOAD_DISTANCE: 200, // 预加载距离
} as const;

// =====================================================
// 图片相关常量
// =====================================================

/**
 * 图片质量配置
 */
export const IMAGE_QUALITY_CONFIG = {
  low: '?imageView2/2/w/300/q/70',
  standard: '?imageView2/2/w/600/q/80',
  high: '',
} as const;

/**
 * 图片处理常量
 */
export const IMAGE_CONSTANTS = {
  DEFAULT_QUALITY: 'standard' as ImageQuality,
  DEFAULT_WIDTH: 180,
  DEFAULT_HEIGHT: 200,
  MIN_HEIGHT: 120,
  MAX_HEIGHT: 400,
  LOADING_TIMEOUT: 5000, // 图片加载超时时间
  RETRY_COUNT: 3, // 重试次数
  PLACEHOLDER_COLOR: '#F5F5F5',
} as const;

// =====================================================
// 颜色系统
// =====================================================

/**
 * 颜色常量
 */
export const COLORS = {
  // 主色调
  PRIMARY: '#007AFF',
  PRIMARY_LIGHT: '#34A3FF',
  PRIMARY_DARK: '#0056CC',
  
  // 背景色
  BACKGROUND: '#FFFFFF',
  BACKGROUND_GRAY: '#F8F9FA',
  CARD_BACKGROUND: '#FFFFFF',
  OVERLAY: 'rgba(0,0,0,0.6)',
  
  // 文字颜色
  TEXT_PRIMARY: '#1D1D1F',
  TEXT_SECONDARY: '#6D6D80',
  TEXT_TERTIARY: '#8E8E93',
  TEXT_QUATERNARY: '#C7C7CC',
  
  // 边框颜色
  BORDER: '#E5E5EA',
  BORDER_LIGHT: '#F2F2F7',
  SEPARATOR: '#C6C6C8',
  
  // 状态颜色
  SUCCESS: '#34C759',
  WARNING: '#FF9500',
  ERROR: '#FF3B30',
  INFO: '#007AFF',
  
  // 交互颜色
  LIKE_ACTIVE: '#FF3B30',
  LIKE_INACTIVE: '#C7C7CC',
  FOLLOW_ACTIVE: '#007AFF',
  
  // 阴影颜色
  SHADOW: '#000000',
  SHADOW_LIGHT: 'rgba(0,0,0,0.1)',
  SHADOW_MEDIUM: 'rgba(0,0,0,0.2)',
} as const;

// =====================================================
// 排版系统
// =====================================================

/**
 * 排版常量
 */
export const TYPOGRAPHY = {
  // 标题
  TITLE_LARGE: {
    fontSize: 28,
    fontWeight: '700' as const,
    lineHeight: 34,
  },
  TITLE_MEDIUM: {
    fontSize: 24,
    fontWeight: '600' as const,
    lineHeight: 30,
  },
  TITLE_SMALL: {
    fontSize: 20,
    fontWeight: '600' as const,
    lineHeight: 26,
  },
  
  // 正文
  BODY_LARGE: {
    fontSize: 18,
    fontWeight: '400' as const,
    lineHeight: 24,
  },
  BODY_MEDIUM: {
    fontSize: 16,
    fontWeight: '400' as const,
    lineHeight: 22,
  },
  BODY_SMALL: {
    fontSize: 14,
    fontWeight: '400' as const,
    lineHeight: 20,
  },
  
  // 辅助文字
  CAPTION: {
    fontSize: 12,
    fontWeight: '400' as const,
    lineHeight: 16,
  },
  OVERLINE: {
    fontSize: 10,
    fontWeight: '500' as const,
    lineHeight: 14,
    letterSpacing: 0.5,
  },
  
  // 按钮文字
  BUTTON_LARGE: {
    fontSize: 16,
    fontWeight: '600' as const,
    lineHeight: 20,
  },
  BUTTON_MEDIUM: {
    fontSize: 14,
    fontWeight: '600' as const,
    lineHeight: 18,
  },
  BUTTON_SMALL: {
    fontSize: 12,
    fontWeight: '600' as const,
    lineHeight: 16,
  },
} as const;

// =====================================================
// 动画相关常量
// =====================================================

/**
 * 动画常量
 */
export const ANIMATION_CONSTANTS = {
  // 持续时间
  DURATION_FAST: 200,
  DURATION_NORMAL: 300,
  DURATION_SLOW: 500,
  
  // 缓动函数
  EASING_STANDARD: 'ease-out',
  EASING_ENTER: 'ease-out',
  EASING_EXIT: 'ease-in',
  
  // 变换
  SCALE_PRESS: 0.95,
  OPACITY_DISABLED: 0.6,
  
  // 弹簧动画
  SPRING_CONFIG: {
    damping: 15,
    mass: 1,
    stiffness: 150,
  },
} as const;

// =====================================================
// API相关常量
// =====================================================

/**
 * API配置常量
 */
export const API_CONSTANTS = {
  BASE_URL: '/api/v1',
  TIMEOUT: 10000,
  RETRY_COUNT: 3,
  RETRY_DELAY: 1000,
  
  // 分页相关
  DEFAULT_PAGE_SIZE: 20,
  MIN_PAGE_SIZE: 10,
  MAX_PAGE_SIZE: 50,
  
  // 缓存相关
  CACHE_DURATION: 5 * 60 * 1000, // 5分钟
  MAX_CACHE_SIZE: 100,
} as const;

// =====================================================
// 性能相关常量
// =====================================================

/**
 * 性能监控常量
 */
export const PERFORMANCE_CONSTANTS = {
  // 渲染性能
  MAX_RENDER_TIME: 100, // 最大渲染时间(ms)
  FPS_THRESHOLD: 50, // FPS阈值
  
  // 内存使用
  MAX_MEMORY_USAGE: 100 * 1024 * 1024, // 100MB
  MEMORY_WARNING_THRESHOLD: 80 * 1024 * 1024, // 80MB
  
  // 网络性能
  SLOW_NETWORK_THRESHOLD: 3000, // 慢网络阈值(ms)
  IMAGE_LOAD_TIMEOUT: 10000, // 图片加载超时(ms)
} as const;

// =====================================================
// 用户体验相关常量
// =====================================================

/**
 * 用户体验常量
 */
export const UX_CONSTANTS = {
  // 触摸反馈
  TOUCH_SLOP: 8, // 触摸容差
  LONG_PRESS_DELAY: 500, // 长按延迟
  DOUBLE_TAP_DELAY: 300, // 双击延迟
  
  // 加载状态
  MIN_LOADING_TIME: 300, // 最小加载时间，避免闪烁
  SKELETON_ANIMATION_DURATION: 1500,
  
  // 错误重试
  AUTO_RETRY_DELAY: 2000,
  MAX_AUTO_RETRY_COUNT: 3,
  
  // 提示消息
  TOAST_DURATION: 3000,
  SNACKBAR_DURATION: 4000,
} as const;

// =====================================================
// 调试相关常量
// =====================================================

/**
 * 调试常量
 */
export const DEBUG_CONSTANTS = {
  ENABLE_PERFORMANCE_MONITOR: __DEV__,
  ENABLE_LAYOUT_DEBUG: false,
  ENABLE_VIRTUALIZATION_DEBUG: false,
  LOG_LEVEL: __DEV__ ? 'debug' : 'error',
} as const;
