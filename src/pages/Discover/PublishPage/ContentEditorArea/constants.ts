/**
 * 内容编辑区域常量配置
 * 
 * 定义内容编辑器的所有常量配置
 */

// #region 1. 输入限制常量
export const INPUT_LIMITS = {
  TITLE_MAX_LENGTH: 50,
  TITLE_MIN_LENGTH: 1,
  CONTENT_MAX_LENGTH: 1000,
  CONTENT_MIN_LENGTH: 1,
  WARNING_THRESHOLD: 0.9, // 90%时显示警告
} as const;

export const INPUT_HEIGHTS = {
  TITLE_HEIGHT: 60,
  CONTENT_MIN_HEIGHT: 120,
  CONTENT_MAX_HEIGHT: 300,
  LINE_HEIGHT_TITLE: 24,
  LINE_HEIGHT_CONTENT: 22,
} as const;
// #endregion

// #region 2. 样式常量
export const EDITOR_COLORS = {
  BACKGROUND: '#FFFFFF',
  TEXT: '#333333',
  PLACEHOLDER: '#999999',
  BORDER: '#E5E5E5',
  BORDER_FOCUSED: '#8A2BE2',
  BORDER_ERROR: '#FF3B30',
  ERROR_TEXT: '#FF3B30',
  WARNING_TEXT: '#FF9500',
  COUNTER_NORMAL: '#999999',
  COUNTER_WARNING: '#FF9500',
  COUNTER_ERROR: '#FF3B30',
} as const;

export const EDITOR_FONTS = {
  TITLE_SIZE: 16,
  CONTENT_SIZE: 16,
  COUNTER_SIZE: 12,
  TITLE_WEIGHT: '400',
  CONTENT_WEIGHT: '400',
  COUNTER_WEIGHT: '400',
} as const;

export const EDITOR_SPACING = {
  CONTAINER_PADDING: 16,
  INPUT_MARGIN: 12,
  COUNTER_MARGIN: 8,
  BORDER_WIDTH: 1,
  BORDER_RADIUS: 0,
} as const;
// #endregion

// #region 3. 占位符文本
export const PLACEHOLDER_TEXTS = {
  TITLE: '添加标题',
  CONTENT: '添加正文',
  TITLE_FOCUSED: '请输入标题...',
  CONTENT_FOCUSED: '分享你的想法...',
} as const;

export const VALIDATION_MESSAGES = {
  TITLE_REQUIRED: '请输入标题',
  TITLE_TOO_LONG: '标题不能超过50个字符',
  CONTENT_REQUIRED: '请输入正文内容',
  CONTENT_TOO_LONG: '正文不能超过1000个字符',
  TITLE_WARNING: '标题即将达到字数限制',
  CONTENT_WARNING: '正文即将达到字数限制',
} as const;
// #endregion

// #region 4. 自动保存配置
export const AUTO_SAVE_CONFIG = {
  ENABLED: true,
  INTERVAL: 2000, // 2秒
  DEBOUNCE_DELAY: 500, // 500ms防抖
  MAX_DRAFTS: 10,
} as const;
// #endregion

// #region 5. 键盘配置
export const KEYBOARD_CONFIG = {
  TITLE_RETURN_KEY: 'next',
  CONTENT_RETURN_KEY: 'default',
  TITLE_KEYBOARD_TYPE: 'default',
  CONTENT_KEYBOARD_TYPE: 'default',
  AUTO_CAPITALIZE: 'sentences',
  AUTO_CORRECT: true,
  SPELL_CHECK: true,
} as const;
// #endregion
