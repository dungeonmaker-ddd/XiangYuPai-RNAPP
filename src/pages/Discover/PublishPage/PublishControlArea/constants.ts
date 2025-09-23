/**
 * 发布控制区域常量配置
 * 
 * 定义发布控制的所有常量配置
 */

// #region 1. 控制区域尺寸
export const CONTROL_UI = {
  AREA_HEIGHT: 80,
  SAFE_AREA_BOTTOM: 34,
  BUTTON_HEIGHT: 48,
  BUTTON_MIN_WIDTH: 120,
  BUTTON_BORDER_RADIUS: 24,
  PROGRESS_HEIGHT: 4,
  CONTAINER_PADDING_HORIZONTAL: 16,
  CONTAINER_PADDING_VERTICAL: 16,
  BUTTON_SPACING: 12,
} as const;

export const CONTROL_COLORS = {
  BACKGROUND: '#FFFFFF',
  BORDER: '#E5E5E5',
  
  // 主要按钮（发布）
  PRIMARY_BG: '#8A2BE2',
  PRIMARY_TEXT: '#FFFFFF',
  PRIMARY_DISABLED_BG: '#CCCCCC',
  PRIMARY_DISABLED_TEXT: '#999999',
  PRIMARY_LOADING_BG: '#9370DB',
  PRIMARY_SUCCESS_BG: '#34C759',
  PRIMARY_ERROR_BG: '#FF3B30',
  
  // 次要按钮（草稿）
  SECONDARY_BG: 'transparent',
  SECONDARY_TEXT: '#666666',
  SECONDARY_BORDER: '#E5E5E5',
  SECONDARY_DISABLED_TEXT: '#CCCCCC',
  
  // 进度条
  PROGRESS_BG: 'rgba(138, 43, 226, 0.2)',
  PROGRESS_FILL: '#8A2BE2',
  
  // 阴影
  SHADOW: 'rgba(0, 0, 0, 0.1)',
} as const;
// #endregion

// #region 2. 字体配置
export const CONTROL_FONTS = {
  BUTTON_SIZE: 18,
  BUTTON_WEIGHT: '600',
  SECONDARY_BUTTON_SIZE: 16,
  SECONDARY_BUTTON_WEIGHT: '500',
  PROGRESS_TEXT_SIZE: 12,
  PROGRESS_TEXT_WEIGHT: '500',
  MESSAGE_SIZE: 14,
  MESSAGE_WEIGHT: '400',
} as const;
// #endregion

// #region 3. 按钮文本
export const BUTTON_TEXTS = {
  PUBLISH: '发布',
  PUBLISHING: '发布中...',
  PUBLISH_SUCCESS: '发布成功',
  PUBLISH_FAILED: '发布失败',
  RETRY: '重试',
  CANCEL: '取消',
  DRAFT: '存草稿',
  DRAFTING: '保存中...',
  DRAFT_SAVED: '已保存',
  VALIDATE: '验证中...',
  UPLOAD: '上传中...',
  SUBMIT: '提交中...',
} as const;

export const PROGRESS_MESSAGES = {
  VALIDATING: '正在验证内容...',
  UPLOADING: '正在上传媒体...',
  PROCESSING: '正在处理...',
  SUBMITTING: '正在发布...',
  COMPLETING: '即将完成...',
  SUCCESS: '发布成功！',
  ERROR: '发布失败',
} as const;
// #endregion

// #region 4. 状态配置
export const PUBLISH_STATES = {
  IDLE: 'idle',
  VALIDATING: 'validating',
  UPLOADING: 'uploading',
  SUBMITTING: 'submitting',
  SUCCESS: 'success',
  ERROR: 'error',
} as const;

export const BUTTON_VARIANTS = {
  PRIMARY: 'primary',
  SECONDARY: 'secondary',
  DISABLED: 'disabled',
  LOADING: 'loading',
  SUCCESS: 'success',
  ERROR: 'error',
} as const;

export const PROGRESS_VARIANTS = {
  LINEAR: 'linear',
  CIRCULAR: 'circular',
  DOTS: 'dots',
  SPINNER: 'spinner',
} as const;
// #endregion

// #region 5. 动画配置
export const CONTROL_ANIMATION = {
  BUTTON_PRESS_SCALE: 0.98,
  BUTTON_PRESS_OPACITY: 0.8,
  PRESS_DURATION: 100,
  SCALE_DURATION: 150,
  PROGRESS_DURATION: 300,
  SUCCESS_DURATION: 2000,
  ERROR_DURATION: 3000,
  
  SPRING_CONFIG: {
    tension: 100,
    friction: 8,
  },
  
  EASING: {
    EASE_OUT: 'ease-out',
    EASE_IN: 'ease-in',
    EASE_IN_OUT: 'ease-in-out',
  },
} as const;
// #endregion

// #region 6. 触觉反馈配置
export const HAPTIC_FEEDBACK = {
  ENABLED: true,
  
  BUTTON_PRESS: {
    type: 'light',
    enabled: true,
  },
  
  PUBLISH_START: {
    type: 'medium',
    enabled: true,
  },
  
  PUBLISH_SUCCESS: {
    type: 'success',
    enabled: true,
    pattern: [0, 100, 50, 100],
  },
  
  PUBLISH_ERROR: {
    type: 'error',
    enabled: true,
    pattern: [0, 100, 100, 100, 100, 100],
  },
  
  VALIDATION_ERROR: {
    type: 'warning',
    enabled: true,
  },
} as const;
// #endregion

// #region 7. 按钮状态配置
export const BUTTON_STATES = {
  [BUTTON_VARIANTS.PRIMARY]: {
    backgroundColor: CONTROL_COLORS.PRIMARY_BG,
    textColor: CONTROL_COLORS.PRIMARY_TEXT,
    borderColor: 'transparent',
    borderWidth: 0,
    elevation: 2,
    shadowEnabled: true,
  },
  
  [BUTTON_VARIANTS.SECONDARY]: {
    backgroundColor: CONTROL_COLORS.SECONDARY_BG,
    textColor: CONTROL_COLORS.SECONDARY_TEXT,
    borderColor: CONTROL_COLORS.SECONDARY_BORDER,
    borderWidth: 1,
    elevation: 0,
    shadowEnabled: false,
  },
  
  [BUTTON_VARIANTS.DISABLED]: {
    backgroundColor: CONTROL_COLORS.PRIMARY_DISABLED_BG,
    textColor: CONTROL_COLORS.PRIMARY_DISABLED_TEXT,
    borderColor: 'transparent',
    borderWidth: 0,
    elevation: 0,
    shadowEnabled: false,
  },
  
  [BUTTON_VARIANTS.LOADING]: {
    backgroundColor: CONTROL_COLORS.PRIMARY_LOADING_BG,
    textColor: CONTROL_COLORS.PRIMARY_TEXT,
    borderColor: 'transparent',
    borderWidth: 0,
    elevation: 1,
    shadowEnabled: true,
  },
  
  [BUTTON_VARIANTS.SUCCESS]: {
    backgroundColor: CONTROL_COLORS.PRIMARY_SUCCESS_BG,
    textColor: CONTROL_COLORS.PRIMARY_TEXT,
    borderColor: 'transparent',
    borderWidth: 0,
    elevation: 2,
    shadowEnabled: true,
  },
  
  [BUTTON_VARIANTS.ERROR]: {
    backgroundColor: CONTROL_COLORS.PRIMARY_ERROR_BG,
    textColor: CONTROL_COLORS.PRIMARY_TEXT,
    borderColor: 'transparent',
    borderWidth: 0,
    elevation: 1,
    shadowEnabled: true,
  },
} as const;
// #endregion

// #region 8. 进度配置
export const PROGRESS_CONFIG = {
  [PROGRESS_VARIANTS.LINEAR]: {
    height: CONTROL_UI.PROGRESS_HEIGHT,
    backgroundColor: CONTROL_COLORS.PROGRESS_BG,
    fillColor: CONTROL_COLORS.PROGRESS_FILL,
    borderRadius: CONTROL_UI.PROGRESS_HEIGHT / 2,
    showPercentage: true,
    showMessage: true,
  },
  
  [PROGRESS_VARIANTS.CIRCULAR]: {
    size: 24,
    strokeWidth: 3,
    backgroundColor: CONTROL_COLORS.PROGRESS_BG,
    fillColor: CONTROL_COLORS.PROGRESS_FILL,
    showPercentage: false,
    showMessage: false,
  },
  
  [PROGRESS_VARIANTS.DOTS]: {
    dotSize: 8,
    dotSpacing: 4,
    dotCount: 3,
    backgroundColor: CONTROL_COLORS.PROGRESS_BG,
    fillColor: CONTROL_COLORS.PROGRESS_FILL,
    showPercentage: false,
    showMessage: true,
  },
  
  [PROGRESS_VARIANTS.SPINNER]: {
    size: 20,
    strokeWidth: 2,
    backgroundColor: 'transparent',
    fillColor: CONTROL_COLORS.PROGRESS_FILL,
    showPercentage: false,
    showMessage: false,
  },
} as const;
// #endregion

// #region 9. 验证配置
export const VALIDATION_CONFIG = {
  REQUIRE_CONTENT: true,
  REQUIRE_MEDIA: false,
  REQUIRE_TOPICS: false,
  REQUIRE_LOCATION: false,
  
  MIN_CONTENT_LENGTH: 1,
  MAX_CONTENT_LENGTH: 1000,
  MIN_TOPICS: 0,
  MAX_TOPICS: 3,
  
  ALLOWED_MEDIA_TYPES: ['image', 'video'],
  MAX_MEDIA_SIZE: 10 * 1024 * 1024, // 10MB
  MAX_MEDIA_COUNT: 9,
  
  VALIDATION_DEBOUNCE: 300, // ms
  AUTO_VALIDATE: true,
} as const;

export const VALIDATION_MESSAGES = {
  CONTENT_REQUIRED: '请输入内容',
  CONTENT_TOO_SHORT: '内容太短',
  CONTENT_TOO_LONG: '内容超出长度限制',
  MEDIA_REQUIRED: '请添加媒体文件',
  MEDIA_TOO_LARGE: '媒体文件过大',
  MEDIA_INVALID_FORMAT: '媒体格式不支持',
  TOPICS_REQUIRED: '请选择话题',
  TOPICS_TOO_MANY: '话题数量超出限制',
  LOCATION_REQUIRED: '请选择位置',
  NETWORK_ERROR: '网络连接异常',
  SERVER_ERROR: '服务器错误',
  UNKNOWN_ERROR: '未知错误',
} as const;
// #endregion

// #region 10. 默认配置
export const DEFAULT_CONFIG = {
  SHOW_PROGRESS: true,
  SHOW_DRAFT: true,
  AUTO_SAVE_DRAFT: true,
  ENABLE_HAPTIC: true,
  ENABLE_ANIMATION: true,
  BUTTON_VARIANT: BUTTON_VARIANTS.PRIMARY,
  PROGRESS_VARIANT: PROGRESS_VARIANTS.LINEAR,
  VALIDATION_ENABLED: true,
  DEBOUNCE_VALIDATION: true,
} as const;

export const DEFAULT_TIMEOUTS = {
  UPLOAD_TIMEOUT: 30000, // 30秒
  SUBMIT_TIMEOUT: 15000, // 15秒
  VALIDATION_TIMEOUT: 5000, // 5秒
  SUCCESS_DISPLAY: 2000, // 2秒
  ERROR_DISPLAY: 5000, // 5秒
} as const;
// #endregion
