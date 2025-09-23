/**
 * 发现详情页面常量配置
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

// ==================== 1. UI Constants ====================
export const UI_CONSTANTS = {
  AVATAR_SIZE: 48,
  BORDER_RADIUS: 24,
  SMALL_AVATAR_SIZE: 36,
  SMALL_BORDER_RADIUS: 18,
  BUTTON_HEIGHT: 48,
  ICON_SIZE: 34,
  ACTION_BUTTON_SIZE: 28,
  ACTION_ICON_SIZE: 16,
} as const;

// ==================== 2. Animation Constants ====================
export const ANIMATION_CONSTANTS = {
  DURATION: 250,
  FAST_DURATION: 100,
  SLOW_DURATION: 300,
  LIKE_DURATION: 300,
  COLLECT_DURATION: 400,
  SHARE_PANEL_DURATION: 300,
  SPRING_CONFIG: {
    tension: 100,
    friction: 8,
  },
} as const;

// ==================== 3. Layout Constants ====================
export const LAYOUT_CONSTANTS = {
  CONTAINER_PADDING: 20,
  SECTION_PADDING: 16,
  ITEM_SPACING: 12,
  SMALL_SPACING: 8,
  LARGE_SPACING: 24,
  REPLY_INDENT: 24,
  ACTION_BAR_HEIGHT: 40,
  MIN_INPUT_HEIGHT: 18,
  MAX_INPUT_HEIGHT: 80,
  MAX_INPUT_HEIGHT_SMALL: 56,
  SMALL_SCREEN_WIDTH: 375,
} as const;

// ==================== 4. Text Constants ====================
export const TEXT_CONSTANTS = {
  MAX_COMMENT_LENGTH: 1000,
  WARNING_THRESHOLD: 900,
  PLACEHOLDER_COMMENT: '写评论...',
  PLACEHOLDER_REPLY: '回复 @',
  LOADING_TEXT: '加载中...',
  EMPTY_COMMENT_TEXT: '还没有评论，来说点什么吧~',
} as const;

// ==================== 5. Color Constants ====================
export const COLOR_CONSTANTS = {
  PRIMARY: '#8A2BE2',
  SECONDARY: '#FF3B30',
  SUCCESS: '#07C160',
  WARNING: '#FFA502',
  INFO: '#007AFF',
  BACKGROUND: '#FFFFFF',
  TEXT_PRIMARY: '#333333',
  TEXT_SECONDARY: '#666666',
  TEXT_TERTIARY: '#999999',
  TEXT_WHITE: '#FFFFFF',
  TEXT_WHITE_SECONDARY: 'rgba(255, 255, 255, 0.6)',
  BORDER: '#E0E0E0',
  BORDER_LIGHT: '#F0F0F0',
  OVERLAY: 'rgba(0, 0, 0, 0.5)',
  OVERLAY_LIGHT: 'rgba(0, 0, 0, 0.3)',
  SHADOW: 'rgba(0, 0, 0, 0.1)',
  GENDER: {
    MALE: '#4A90E2',
    FEMALE: '#FF69B4',
  },
  TAG: {
    BACKGROUND: '#F0F8FF',
    TEXT: '#1890FF',
  },
} as const;

// ==================== 6. Size Constants ====================
export const SIZE_CONSTANTS = {
  FONT: {
    LARGE: 18,
    MEDIUM: 16,
    NORMAL: 14,
    SMALL: 12,
  },
  LINE_HEIGHT: {
    LARGE: 24,
    MEDIUM: 20,
    NORMAL: 18,
    SMALL: 16,
  },
  RADIUS: {
    LARGE: 24,
    MEDIUM: 16,
    NORMAL: 12,
    SMALL: 8,
    TINY: 4,
  },
} as const;

// ==================== 7. Timing Constants ====================
export const TIMING_CONSTANTS = {
  DEBOUNCE_DELAY: 300,
  THROTTLE_DELAY: 100,
  LONG_PRESS_DELAY: 300,
  DOUBLE_TAP_DELAY: 300,
  AUTO_HIDE_DELAY: 3000,
} as const;

// ==================== 8. Exports ====================
export const DETAIL_PAGE_CONSTANTS = {
  ...UI_CONSTANTS,
  ...ANIMATION_CONSTANTS,
  ...LAYOUT_CONSTANTS,
  ...TEXT_CONSTANTS,
  ...COLOR_CONSTANTS,
  ...SIZE_CONSTANTS,
  ...TIMING_CONSTANTS,
} as const;

export default DETAIL_PAGE_CONSTANTS;

// Re-export individual constant groups
export {
  UI_CONSTANTS,
  ANIMATION_CONSTANTS,
  LAYOUT_CONSTANTS,
  TEXT_CONSTANTS,
  COLOR_CONSTANTS,
  SIZE_CONSTANTS,
  TIMING_CONSTANTS,
};
