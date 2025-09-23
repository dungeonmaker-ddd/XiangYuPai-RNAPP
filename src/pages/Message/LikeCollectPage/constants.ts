// #region 1. File Banner & TOC
/**
 * 赞和收藏页面 - 常量定义
 * 
 * TOC (快速跳转):
 * [1] Page Config
 * [2] Action Types
 * [3] UI Constants
 * [4] Animation Constants
 * [5] API Constants
 * [6] Time Constants
 */
// #endregion

// #region 2. Page Config
export const LIKE_COLLECT_PAGE_CONFIG = {
  PAGE_TITLE: '赞和收藏',
  PAGE_SIZE: 20,
  AUTO_REFRESH_INTERVAL: 30000, // 30秒
  PULL_REFRESH_THRESHOLD: 50,
} as const;
// #endregion

// #region 3. Action Types
export const ACTION_TYPES = {
  LIKE: 'like',
  COLLECT: 'collect',
} as const;

export const ACTION_CONFIG = {
  [ACTION_TYPES.LIKE]: {
    icon: '💖',
    text: '点赞了你的',
    color: '#FF69B4',
  },
  [ACTION_TYPES.COLLECT]: {
    icon: '⭐',
    text: '收藏了你的',
    color: '#FFD700',
  },
} as const;

export const TARGET_CONTENT_TYPES = {
  POST: 'post',
  COMMENT: 'comment',
  IMAGE: 'image',
  VIDEO: 'video',
} as const;

export const CONTENT_TYPE_CONFIG = {
  [TARGET_CONTENT_TYPES.POST]: {
    icon: '📝',
    label: '作品',
  },
  [TARGET_CONTENT_TYPES.COMMENT]: {
    icon: '💬',
    label: '评论',
  },
  [TARGET_CONTENT_TYPES.IMAGE]: {
    icon: '🖼️',
    label: '图片',
  },
  [TARGET_CONTENT_TYPES.VIDEO]: {
    icon: '🎬',
    label: '视频',
  },
} as const;
// #endregion

// #region 4. UI Constants
export const UI_CONSTANTS = {
  ITEM_HEIGHT: 80,
  THUMBNAIL_SIZE: {
    width: 48,
    height: 48,
  },
  ACTION_ICON_SIZE: {
    width: 20,
    height: 20,
  },
  AVATAR_SIZE: 48,
  SEPARATOR_HEIGHT: 1,
  EMPTY_STATE_ICON_SIZE: 64,
} as const;

export const LAYOUT_CONSTANTS = {
  HEADER_HEIGHT: 56,
  HORIZONTAL_PADDING: 16,
  VERTICAL_PADDING: 12,
  ITEM_SPACING: 12,
  BORDER_RADIUS: 8,
} as const;
// #endregion

// #region 5. Animation Constants
export const ANIMATIONS = {
  ITEM_PRESS: {
    SCALE: 0.98,
    DURATION: 150,
  },
  REFRESH: {
    DURATION: 300,
  },
  READ_STATE_CHANGE: {
    DURATION: 200,
  },
} as const;
// #endregion

// #region 6. API Constants
export const API_ENDPOINTS = {
  GET_LIKE_COLLECT_MESSAGES: '/api/messages/like-collect',
  MARK_MESSAGE_READ: '/api/messages/mark-read',
  CLEAR_ALL_MESSAGES: '/api/messages/clear-all',
} as const;

export const API_CONFIG = {
  TIMEOUT: 10000, // 10秒
  RETRY_TIMES: 3,
  RETRY_DELAY: 1000, // 1秒
} as const;
// #endregion

// #region 7. Time Constants
export const TIME_FORMATS = {
  JUST_NOW: '刚刚',
  MINUTES_AGO: (n: number) => `${n}分钟前`,
  HOURS_AGO: (n: number) => `${n}小时前`,
  YESTERDAY: '昨天',
  DATE_FORMAT: 'MM-DD',
  TIME_FORMAT: 'HH:mm',
} as const;

export const TIME_THRESHOLDS = {
  JUST_NOW: 1 * 60 * 1000, // 1分钟
  MINUTES: 60 * 60 * 1000, // 1小时
  HOURS: 24 * 60 * 60 * 1000, // 24小时
} as const;
// #endregion

// #region 8. Error Messages
export const ERROR_MESSAGES = {
  LOAD_FAILED: '加载失败，请重试',
  NETWORK_ERROR: '网络连接异常',
  CLEAR_FAILED: '清空失败，请重试',
  MARK_READ_FAILED: '标记已读失败',
} as const;
// #endregion

// #region 9. Empty State
export const EMPTY_STATE = {
  ICON: '💌',
  TITLE: '暂无赞和收藏消息',
  SUBTITLE: '当有人点赞或收藏你的内容时会在这里显示',
} as const;
// #endregion
