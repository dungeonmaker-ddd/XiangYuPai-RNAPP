// #region 1. File Banner & TOC
/**
 * 私聊对话页面 - 常量定义
 * 
 * TOC (快速跳转):
 * [1] Page Config
 * [2] Message Types
 * [3] Input Constants
 * [4] UI Constants
 * [5] Animation Constants
 * [6] Keyboard Constants
 * [7] API Constants
 * [8] Media Constants
 */
// #endregion

// #region 2. Page Config
export const PRIVATE_CHAT_CONFIG = {
  PAGE_TITLE: '私聊',
  MAX_MESSAGE_LENGTH: 500,
  MESSAGE_PAGE_SIZE: 20,
  AUTO_SCROLL_THRESHOLD: 100,
  TYPING_INDICATOR_TIMEOUT: 3000, // 3秒
} as const;
// #endregion

// #region 3. Message Types
export const MESSAGE_TYPES = {
  TEXT: 'text',
  IMAGE: 'image',
  DYNAMIC: 'dynamic',
  SYSTEM: 'system',
} as const;

export const MESSAGE_STATUS = {
  SENDING: 'sending',
  SENT: 'sent',
  DELIVERED: 'delivered',
  READ: 'read',
  FAILED: 'failed',
} as const;

export const MESSAGE_STATUS_CONFIG = {
  [MESSAGE_STATUS.SENDING]: {
    icon: '⏳',
    color: '#999999',
    text: '发送中',
  },
  [MESSAGE_STATUS.SENT]: {
    icon: '✓',
    color: '#999999',
    text: '已发送',
  },
  [MESSAGE_STATUS.DELIVERED]: {
    icon: '✓✓',
    color: '#999999',
    text: '已送达',
  },
  [MESSAGE_STATUS.READ]: {
    icon: '✓✓',
    color: '#4A90E2',
    text: '已读',
  },
  [MESSAGE_STATUS.FAILED]: {
    icon: '❌',
    color: '#FF4444',
    text: '发送失败',
  },
} as const;
// #endregion

// #region 4. Input Constants
export const INPUT_CONFIG = {
  MIN_HEIGHT: 40,
  MAX_HEIGHT: 100,
  PLACEHOLDER: '请输入内容...',
  BORDER_RADIUS: 20,
  PADDING_HORIZONTAL: 16,
  PADDING_VERTICAL: 8,
} as const;

export const INPUT_BUTTONS = {
  SEND: {
    WIDTH: 60,
    HEIGHT: 36,
    BORDER_RADIUS: 18,
    BACKGROUND_COLOR: '#8A2BE2',
    TEXT_COLOR: '#FFFFFF',
    FONT_SIZE: 14,
  },
  ATTACHMENT: {
    SIZE: 36,
    ICON_SIZE: 20,
    COLOR: '#8A2BE2',
  },
  CAMERA: {
    SIZE: 36,
    ICON_SIZE: 20,
    COLOR: '#8A2BE2',
  },
} as const;
// #endregion

// #region 5. UI Constants
export const UI_CONSTANTS = {
  // 头部区域
  HEADER_HEIGHT: 56,
  
  // 消息气泡
  BUBBLE_MAX_WIDTH: 0.75, // 75% of screen width
  BUBBLE_MIN_HEIGHT: 36,
  BUBBLE_BORDER_RADIUS: 18,
  BUBBLE_PADDING_HORIZONTAL: 12,
  BUBBLE_PADDING_VERTICAL: 8,
  
  // 头像尺寸
  AVATAR_SIZE: 36,
  
  // 间距
  MESSAGE_SPACING: 8,
  MESSAGE_GROUP_SPACING: 16,
  HORIZONTAL_PADDING: 16,
  
  // 时间戳
  TIMESTAMP_HEIGHT: 20,
  TIMESTAMP_MARGIN: 12,
  
  // 输入区域
  INPUT_AREA_HEIGHT: 60,
  INPUT_AREA_PADDING: 12,
} as const;

export const BUBBLE_COLORS = {
  FROM_ME: {
    BACKGROUND: '#8A2BE2',
    TEXT: '#FFFFFF',
    BORDER: 'transparent',
  },
  FROM_OTHER: {
    BACKGROUND: '#F5F5F5',
    TEXT: '#000000',
    BORDER: '#E0E0E0',
  },
  SYSTEM: {
    BACKGROUND: '#E8E8E8',
    TEXT: '#666666',
    BORDER: 'transparent',
  },
} as const;
// #endregion

// #region 6. Animation Constants
export const ANIMATIONS = {
  MESSAGE_APPEAR: {
    DURATION: 300,
    DELAY: 0,
    SPRING_CONFIG: {
      damping: 0.8,
      stiffness: 100,
    },
  },
  TYPING_INDICATOR: {
    DURATION: 1000,
    SCALE_RANGE: [0.8, 1.2],
  },
  KEYBOARD: {
    DURATION: 250,
  },
  SEND_BUTTON: {
    DURATION: 150,
    SCALE: 0.95,
  },
} as const;
// #endregion

// #region 7. Keyboard Constants
export const KEYBOARD_CONFIG = {
  IOS_OFFSET: 88,
  ANDROID_OFFSET: 0,
  DISMISS_TIMEOUT: 100,
} as const;
// #endregion

// #region 8. API Constants
export const API_ENDPOINTS = {
  GET_CHAT_HISTORY: '/api/chat/history',
  SEND_MESSAGE: '/api/chat/send',
  MARK_MESSAGES_READ: '/api/chat/mark-read',
  UPLOAD_IMAGE: '/api/chat/upload-image',
  GET_USER_INFO: '/api/users/info',
} as const;

export const API_CONFIG = {
  TIMEOUT: 15000, // 15秒
  RETRY_TIMES: 3,
  RETRY_DELAY: 1000, // 1秒
  UPLOAD_TIMEOUT: 30000, // 30秒上传超时
} as const;
// #endregion

// #region 9. Media Constants
export const MEDIA_CONFIG = {
  IMAGE: {
    MAX_SIZE: 5 * 1024 * 1024, // 5MB
    QUALITY: 0.8,
    MAX_WIDTH: 1080,
    MAX_HEIGHT: 1080,
    ALLOWED_TYPES: ['image/jpeg', 'image/png', 'image/gif'],
  },
  DYNAMIC: {
    MAX_PHOTOS: 9,
    PHOTO_SIZE: {
      width: 300,
      height: 360,
    },
    BORDER_RADIUS: 8,
  },
} as const;

export const PICKER_OPTIONS = {
  CAMERA: {
    mediaType: 'photo' as const,
    quality: 0.8,
    includeBase64: false,
  },
  GALLERY: {
    mediaType: 'photo' as const,
    quality: 0.8,
    includeBase64: false,
    selectionLimit: 1,
  },
} as const;
// #endregion

// #region 10. Time Format Constants
export const TIME_FORMATS = {
  JUST_NOW: '刚刚',
  MINUTES_AGO: (n: number) => `${n}分钟前`,
  HOURS_AGO: (n: number) => `${n}小时前`,
  YESTERDAY: '昨天',
  DATE_TIME: 'MM-DD HH:mm',
  TIME_ONLY: 'HH:mm',
} as const;

export const TIME_THRESHOLDS = {
  JUST_NOW: 1 * 60 * 1000, // 1分钟
  MINUTES: 60 * 60 * 1000, // 1小时
  HOURS: 24 * 60 * 60 * 1000, // 24小时
  SHOW_DATE: 7 * 24 * 60 * 60 * 1000, // 7天
} as const;
// #endregion

// #region 11. Error Messages
export const ERROR_MESSAGES = {
  SEND_FAILED: '消息发送失败',
  NETWORK_ERROR: '网络连接异常',
  UPLOAD_FAILED: '图片上传失败',
  FILE_TOO_LARGE: '文件大小超出限制',
  INVALID_FILE_TYPE: '不支持的文件类型',
  USER_NOT_FOUND: '用户不存在',
} as const;
// #endregion

// #region 12. Action Types
export const ACTION_TYPES = {
  SEND_TEXT: 'send_text',
  SEND_IMAGE: 'send_image',
  SEND_DYNAMIC: 'send_dynamic',
  RETRY_SEND: 'retry_send',
  MARK_READ: 'mark_read',
  DELETE_MESSAGE: 'delete_message',
} as const;
// #endregion
