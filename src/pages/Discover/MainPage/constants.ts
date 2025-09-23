/**
 * 发现主页面常量配置
 * 包含三标签系统的所有常量定义
 */

import { DiscoverTabType, MasonryConfig } from './types';

// #region 1. 基础配置常量

/** 页面基础配置 */
export const PAGE_CONFIG = {
  // 页面标识
  PAGE_NAME: 'DiscoverMainPage',
  PAGE_TITLE: '发现',
  
  // 布局尺寸
  HEADER_HEIGHT: 56,
  TAB_HEIGHT: 44,
  BOTTOM_TAB_HEIGHT: 80,
  STATUS_BAR_HEIGHT: 44,
  
  // 安全区域
  SAFE_AREA_TOP: 44,
  SAFE_AREA_BOTTOM: 34,
} as const;

/** Tab配置 */
export const TAB_CONFIG = {
  DEFAULT_TAB: DiscoverTabType.HOT,
  TAB_SWITCH_ANIMATION_DURATION: 300,
  TAB_INDICATOR_HEIGHT: 3,
  TAB_INDICATOR_WIDTH: 24,
} as const;

// #endregion

// #region 2. 瀑布流配置

/** 瀑布流布局配置 */
export const MASONRY_CONFIG: MasonryConfig = {
  columns: 2,           // 双列布局
  gap: 8,              // 8px间距
  cardWidth: 0,        // 动态计算
  bufferSize: 5,       // 缓冲区大小
};

/** 卡片配置 */
export const CARD_CONFIG = {
  // 基础尺寸
  MIN_HEIGHT: 200,
  MAX_HEIGHT: 400,
  BORDER_RADIUS: 12,
  
  // 内容区域
  CONTENT_PADDING: 12,
  IMAGE_ASPECT_RATIO_MIN: 0.7,
  IMAGE_ASPECT_RATIO_MAX: 1.5,
  
  // 用户信息区域
  AVATAR_SIZE: 32,
  AVATAR_MARGIN: 8,
  USER_INFO_HEIGHT: 48,
} as const;

// #endregion

// #region 3. 颜色系统

/** 主题色彩 */
export const COLORS = {
  // 主色调
  PRIMARY: '#8A2BE2',      // 紫色
  BACKGROUND: '#FFFFFF',   // 白色背景
  
  // 文字颜色
  TEXT_PRIMARY: '#333333',   // 主要文字
  TEXT_SECONDARY: '#666666', // 次要文字
  TEXT_TERTIARY: '#999999',  // 辅助文字
  
  // Tab专用色彩
  HOT_COLOR: '#FF4500',      // 热门橙红色
  HOT_BG: 'rgba(255, 69, 0, 0.1)',
  
  FOLLOW_COLOR: '#8A2BE2',   // 关注紫色
  FOLLOW_BG: 'rgba(138, 43, 226, 0.1)',
  
  LOCAL_COLOR: '#00AA00',    // 同城绿色
  LOCAL_BG: 'rgba(0, 170, 0, 0.1)',
  
  // 特殊标识色彩
  MERCHANT_COLOR: '#007AFF', // 商家认证蓝色
  NEW_CONTENT: '#32CD32',    // 新内容绿色
  RECOMMEND_GOLD: '#FFD700', // 推荐金色
  
  // 状态颜色
  LIKE_COLOR: '#FF3B30',     // 点赞红色
  BORDER_LIGHT: '#F5F5F5',   // 浅色边框
  SHADOW_COLOR: 'rgba(0, 0, 0, 0.1)', // 阴影颜色
} as const;

// #endregion

// #region 4. 字体规范

/** 字体大小 */
export const FONT_SIZES = {
  // Tab标签
  TAB_ACTIVE: 18,    // 选中标签
  TAB_INACTIVE: 16,  // 未选中标签
  
  // 内容文字
  TITLE: 16,         // 内容标题
  USERNAME: 14,      // 用户昵称
  LIKES: 14,         // 点赞数量
  DISTANCE: 10,      // 距离显示
  BADGE: 10,         // 标识文字
  
  // 底部导航
  BOTTOM_TAB: 12,    // 底部Tab文字
} as const;

/** 字体权重 */
export const FONT_WEIGHTS = {
  REGULAR: '400',
  MEDIUM: '500',
  SEMIBOLD: '600',
  BOLD: '700',
} as const;

// #endregion

// #region 5. 动画配置

/** 动画时长 */
export const ANIMATION_DURATION = {
  FAST: 100,      // 快速反馈
  NORMAL: 200,    // 标准过渡
  SLOW: 300,      // 慢速强调
  TAB_SWITCH: 300, // Tab切换
  HEART_BEAT: 300, // 心跳动画
} as const;

/** 动画缓动函数 */
export const ANIMATION_EASING = {
  EASE_OUT: 'easeOut',
  EASE_IN_OUT: 'easeInOut',
  SPRING: 'spring',
} as const;

// #endregion

// #region 6. 交互配置

/** 手势配置 */
export const GESTURE_CONFIG = {
  LONG_PRESS_DURATION: 1000,    // 长按时长
  DOUBLE_TAP_DELAY: 300,        // 双击延迟
  SWIPE_THRESHOLD: 50,          // 滑动阈值
  SCALE_MIN: 0.95,              // 最小缩放
  SCALE_MAX: 1.05,              // 最大缩放
} as const;

/** 触觉反馈 */
export const HAPTIC_FEEDBACK = {
  LIGHT: 'light',
  MEDIUM: 'medium',
  HEAVY: 'heavy',
  SUCCESS: 'success',
  WARNING: 'warning',
  ERROR: 'error',
} as const;

// #endregion

// #region 7. 网络配置

/** API配置 */
export const API_CONFIG = {
  // 分页配置
  DEFAULT_PAGE_SIZE: 20,
  MAX_PAGE_SIZE: 50,
  
  // 缓存配置
  CACHE_EXPIRY_TIME: 30 * 60 * 1000, // 30分钟
  MAX_CACHE_SIZE: 100,
  
  // 重试配置
  MAX_RETRY_COUNT: 3,
  RETRY_DELAY: 1000,
  
  // 超时配置
  REQUEST_TIMEOUT: 10000,
  IMAGE_TIMEOUT: 5000,
} as const;

/** 地理位置配置 */
export const LOCATION_CONFIG = {
  // 定位精度
  ACCURACY: 100,          // 精度范围(米)
  TIMEOUT: 10000,         // 定位超时
  MAX_AGE: 5 * 60 * 1000, // 缓存有效期(5分钟)
  
  // 距离配置
  DEFAULT_RADIUS: 5,      // 默认搜索半径(km)
  MAX_RADIUS: 50,         // 最大搜索半径(km)
  DISTANCE_THRESHOLDS: [1, 3, 5, 10, 20], // 距离筛选选项
} as const;

// #endregion

// #region 8. 性能配置

/** 性能优化配置 */
export const PERFORMANCE_CONFIG = {
  // 虚拟滚动
  VIRTUAL_ITEM_HEIGHT: 200,     // 平均条目高度
  VIRTUAL_BUFFER_SIZE: 5,       // 虚拟滚动缓冲区
  
  // 图片优化
  IMAGE_QUALITY: 0.8,           // 图片质量
  THUMBNAIL_SIZE: 300,          // 缩略图尺寸
  PRELOAD_COUNT: 10,            // 预加载数量
  
  // 内存管理
  MAX_CACHED_IMAGES: 50,        // 最大缓存图片数
  MEMORY_WARNING_THRESHOLD: 0.8, // 内存警告阈值
  
  // 渲染优化
  MAX_RENDER_ITEMS: 50,         // 最大渲染条目
  DEBOUNCE_SCROLL: 16,          // 滚动防抖(60fps)
} as const;

// #endregion

// #region 9. 错误处理

/** 错误类型 */
export const ERROR_TYPES = {
  NETWORK_ERROR: 'NETWORK_ERROR',
  PERMISSION_DENIED: 'PERMISSION_DENIED',
  DATA_PARSE_ERROR: 'DATA_PARSE_ERROR',
  CACHE_ERROR: 'CACHE_ERROR',
  LOCATION_ERROR: 'LOCATION_ERROR',
} as const;

/** 错误消息 */
export const ERROR_MESSAGES = {
  NETWORK_UNAVAILABLE: '网络连接不可用，请检查网络设置',
  LOCATION_PERMISSION_DENIED: '需要位置权限才能查看同城内容',
  CONTENT_LOAD_FAILED: '内容加载失败，请稍后重试',
  IMAGE_LOAD_FAILED: '图片加载失败',
  LOGIN_REQUIRED: '请先登录后查看关注内容',
} as const;

// #endregion

// #region 10. Tab标签配置

/** Tab标签信息 */
export const TAB_LABELS = {
  [DiscoverTabType.HOT]: {
    title: '热门',
    icon: '🔥',
    color: COLORS.HOT_COLOR,
    backgroundColor: COLORS.HOT_BG,
  },
  [DiscoverTabType.FOLLOW]: {
    title: '关注',
    icon: '👥',
    color: COLORS.FOLLOW_COLOR,
    backgroundColor: COLORS.FOLLOW_BG,
  },
  [DiscoverTabType.LOCAL]: {
    title: '同城',
    icon: '📍',
    color: COLORS.LOCAL_COLOR,
    backgroundColor: COLORS.LOCAL_BG,
  },
} as const;

// #endregion

export default {
  PAGE_CONFIG,
  TAB_CONFIG,
  MASONRY_CONFIG,
  CARD_CONFIG,
  COLORS,
  FONT_SIZES,
  FONT_WEIGHTS,
  ANIMATION_DURATION,
  ANIMATION_EASING,
  GESTURE_CONFIG,
  HAPTIC_FEEDBACK,
  API_CONFIG,
  LOCATION_CONFIG,
  PERFORMANCE_CONFIG,
  ERROR_TYPES,
  ERROR_MESSAGES,
  TAB_LABELS,
};
