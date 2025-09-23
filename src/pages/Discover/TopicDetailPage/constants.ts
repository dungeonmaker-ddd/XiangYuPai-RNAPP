/**
 * 话题详情页面常量配置
 * 
 * TOC (快速跳转):
 * [1] UI Constants
 * [2] Animation Constants  
 * [3] Layout Constants
 * [4] Text Constants
 * [5] Color Constants
 * [6] Size Constants
 * [7] Timing Constants
 * [8] Exports
 */

// #region 1. UI Constants
export const UI_CONSTANTS = {
  // 头像和图标尺寸
  AVATAR_SIZE: 48,
  SMALL_AVATAR_SIZE: 36,
  ICON_SIZE: 24,
  LARGE_ICON_SIZE: 32,
  
  // 按钮尺寸
  BUTTON_HEIGHT: 48,
  SMALL_BUTTON_HEIGHT: 36,
  
  // 圆角
  BORDER_RADIUS: 12,
  SMALL_BORDER_RADIUS: 8,
  LARGE_BORDER_RADIUS: 16,
  AVATAR_BORDER_RADIUS: 24,
  
  // 投影
  SHADOW_ELEVATION: 3,
  SHADOW_OPACITY: 0.1,
} as const;
// #endregion

// #region 2. Animation Constants
export const ANIMATION_CONSTANTS = {
  // 动画时长
  FAST_DURATION: 150,
  NORMAL_DURATION: 250,
  SLOW_DURATION: 400,
  
  // 特定动画时长
  LIKE_ANIMATION_DURATION: 300,
  CARD_PRESS_DURATION: 100,
  REFRESH_DURATION: 500,
  
  // 动画配置
  SPRING_CONFIG: {
    tension: 100,
    friction: 8,
    useNativeDriver: true,
  },
  
  TIMING_CONFIG: {
    useNativeDriver: true,
  },
} as const;
// #endregion

// #region 3. Layout Constants
export const LAYOUT_CONSTANTS = {
  // 页面边距
  CONTAINER_PADDING: 20,
  SECTION_PADDING: 16,
  CARD_PADDING: 16,
  
  // 间距
  TINY_SPACING: 4,
  SMALL_SPACING: 8,
  ITEM_SPACING: 12,
  MEDIUM_SPACING: 16,
  LARGE_SPACING: 24,
  HUGE_SPACING: 32,
  
  // 高度
  HEADER_HEIGHT: 56,
  STATUS_BAR_HEIGHT: 44, // iOS
  ANDROID_STATUS_BAR_HEIGHT: 24,
  POST_CARD_MIN_HEIGHT: 280,
  USER_INFO_HEIGHT: 64,
  INTERACTION_HEIGHT: 48,
  
  // 宽度限制
  MAX_CONTENT_WIDTH: 400,
  MIN_TOUCH_AREA: 44,
  
  // 列表相关
  LOAD_MORE_THRESHOLD: 0.7,
  INITIAL_RENDER_COUNT: 5,
  MAX_RENDER_BATCH: 10,
  WINDOW_SIZE: 10,
} as const;
// #endregion

// #region 4. Text Constants
export const TEXT_CONSTANTS = {
  // 字符限制
  MAX_TITLE_LENGTH: 100,
  MAX_CONTENT_LENGTH: 2000,
  PREVIEW_CONTENT_LENGTH: 120,
  
  // 占位文本
  LOADING_TEXT: '加载中...',
  EMPTY_TOPIC_TEXT: '暂无动态',
  EMPTY_TOPIC_SUB_TEXT: '来发布第一条动态吧',
  END_TEXT: '已经到底了',
  ERROR_TEXT: '加载失败',
  RETRY_TEXT: '重试',
  
  // 按钮文本
  LIKE_TEXT: '点赞',
  COMMENT_TEXT: '评论',
  SHARE_TEXT: '分享',
  FOLLOW_TEXT: '关注',
  FOLLOWING_TEXT: '已关注',
  
  // 格式化文本
  COUNT_FORMAT: {
    THOUSAND: 'k',
    MILLION: 'M',
    BILLION: 'B',
  },
  
  // 时间格式
  TIME_FORMAT: {
    JUST_NOW: '刚刚',
    MINUTE_AGO: '分钟前',
    HOUR_AGO: '小时前',
    DAY_AGO: '天前',
    MONTH_AGO: '个月前',
    YEAR_AGO: '年前',
  },
} as const;
// #endregion

// #region 5. Color Constants
export const COLOR_CONSTANTS = {
  // 主题色
  PRIMARY: '#8A2BE2',           // 紫色 - 主要按钮
  SECONDARY: '#FF3B30',         // 红色 - 点赞、删除
  SUCCESS: '#07C160',           // 绿色 - 成功状态
  WARNING: '#FFA502',           // 橙色 - 警告
  INFO: '#007AFF',              // 蓝色 - 链接、话题标签
  
  // 背景色
  BACKGROUND: '#F5F5F5',        // 浅灰色页面背景
  CARD_BACKGROUND: '#FFFFFF',   // 白色卡片背景
  OVERLAY: 'rgba(0, 0, 0, 0.5)', // 黑色半透明遮罩
  OVERLAY_LIGHT: 'rgba(0, 0, 0, 0.3)', // 浅黑色遮罩
  
  // 文字颜色
  TEXT_PRIMARY: '#000000',      // 黑色主要文字
  TEXT_SECONDARY: '#333333',    // 深灰色次要文字
  TEXT_TERTIARY: '#999999',     // 灰色辅助文字
  TEXT_QUATERNARY: '#CCCCCC',   // 浅灰色占位文字
  TEXT_WHITE: '#FFFFFF',        // 白色文字
  TEXT_WHITE_SECONDARY: 'rgba(255, 255, 255, 0.8)', // 半透明白色
  
  // 边框颜色
  BORDER: '#E5E5E5',            // 标准边框
  BORDER_LIGHT: '#F0F0F0',      // 浅色边框
  BORDER_DARK: '#D0D0D0',       // 深色边框
  
  // 状态颜色
  LIKE_COLOR: '#FF4757',        // 点赞红色
  LIKE_COLOR_INACTIVE: '#999999', // 未点赞灰色
  
  // 用户标识颜色
  VIP_COLOR: '#FFD700',         // VIP金色
  VERIFIED_COLOR: '#1890FF',    // 认证蓝色
  POPULAR_COLOR: '#FF8C00',     // 人气橙色
  
  // 性别标识颜色
  GENDER_MALE: '#4A90E2',       // 男性蓝色
  GENDER_FEMALE: '#FF69B4',     // 女性粉色
  
  // 话题标签颜色
  HASHTAG_BACKGROUND: '#F0F8FF', // 话题标签背景
  HASHTAG_TEXT: '#1890FF',      // 话题标签文字
  
  // 阴影颜色
  SHADOW_COLOR: 'rgba(0, 0, 0, 0.1)', // 标准阴影
  SHADOW_COLOR_DARK: 'rgba(0, 0, 0, 0.2)', // 深色阴影
} as const;
// #endregion

// #region 6. Size Constants
export const SIZE_CONSTANTS = {
  // 字体大小
  FONT: {
    HUGE: 24,
    EXTRA_LARGE: 20,
    LARGE: 18,
    MEDIUM: 16,
    NORMAL: 14,
    SMALL: 12,
    TINY: 10,
  },
  
  // 行高
  LINE_HEIGHT: {
    HUGE: 32,
    EXTRA_LARGE: 28,
    LARGE: 24,
    MEDIUM: 22,
    NORMAL: 20,
    SMALL: 16,
    TINY: 14,
  },
  
  // 字体粗细
  FONT_WEIGHT: {
    LIGHT: '300' as const,
    NORMAL: '400' as const,
    MEDIUM: '500' as const,
    SEMIBOLD: '600' as const,
    BOLD: '700' as const,
  },
} as const;
// #endregion

// #region 7. Timing Constants
export const TIMING_CONSTANTS = {
  // 防抖延迟
  DEBOUNCE_DELAY: 300,
  SEARCH_DEBOUNCE_DELAY: 500,
  
  // 节流延迟
  THROTTLE_DELAY: 100,
  SCROLL_THROTTLE_DELAY: 16, // 60fps
  
  // 交互延迟
  LONG_PRESS_DELAY: 500,
  DOUBLE_TAP_DELAY: 300,
  TOUCH_DELAY: 100,
  
  // 自动隐藏延迟
  AUTO_HIDE_DELAY: 3000,
  TOAST_DELAY: 2000,
  
  // 网络请求超时
  NETWORK_TIMEOUT: 10000,
  UPLOAD_TIMEOUT: 30000,
} as const;
// #endregion

// #region 8. API Constants
export const API_CONSTANTS = {
  // 分页配置
  DEFAULT_PAGE_SIZE: 20,
  MAX_PAGE_SIZE: 50,
  MIN_PAGE_SIZE: 10,
  
  // 重试配置
  MAX_RETRY_TIMES: 3,
  RETRY_DELAY: 1000,
  
  // 缓存配置
  CACHE_EXPIRE_TIME: 5 * 60 * 1000, // 5分钟
  IMAGE_CACHE_SIZE: 100,
  
  // 排序选项
  SORT_OPTIONS: {
    LATEST: 'latest',
    POPULAR: 'popular',
    HOT: 'hot',
  } as const,
} as const;
// #endregion

// #region 9. Exports
export const TOPIC_DETAIL_CONSTANTS = {
  ...UI_CONSTANTS,
  ...ANIMATION_CONSTANTS,
  ...LAYOUT_CONSTANTS,
  ...TEXT_CONSTANTS,
  ...COLOR_CONSTANTS,
  ...SIZE_CONSTANTS,
  ...TIMING_CONSTANTS,
  ...API_CONSTANTS,
} as const;

export default TOPIC_DETAIL_CONSTANTS;

// Re-export individual constant groups
export {
  UI_CONSTANTS,
  ANIMATION_CONSTANTS,
  LAYOUT_CONSTANTS,
  TEXT_CONSTANTS,
  COLOR_CONSTANTS,
  SIZE_CONSTANTS,
  TIMING_CONSTANTS,
  API_CONSTANTS,
};
// #endregion
