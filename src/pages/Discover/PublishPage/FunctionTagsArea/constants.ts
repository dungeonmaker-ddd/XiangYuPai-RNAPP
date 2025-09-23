/**
 * 功能标签区域常量配置
 * 
 * 定义功能标签的所有常量配置
 */

// #region 1. 标签限制常量
export const TAG_LIMITS = {
  MAX_TOPICS: 3,
  MAX_TOPIC_NAME_LENGTH: 20,
  MAX_LOCATION_NAME_LENGTH: 50,
  MAX_LOCATION_ADDRESS_LENGTH: 100,
} as const;

export const TAG_DISPLAY = {
  MAX_VISIBLE_TOPICS: 3,
  TOPIC_TRUNCATE_LENGTH: 15,
  LOCATION_TRUNCATE_LENGTH: 20,
  SHOW_MORE_THRESHOLD: 3,
} as const;
// #endregion

// #region 2. UI尺寸常量
export const TAGS_UI = {
  CONTAINER_HEIGHT: 100,
  CARD_HEIGHT: 80,
  CARD_PADDING: 16,
  CARD_MARGIN: 12,
  CARD_BORDER_RADIUS: 8,
  TAG_HEIGHT: 28,
  TAG_PADDING_HORIZONTAL: 12,
  TAG_PADDING_VERTICAL: 4,
  TAG_BORDER_RADIUS: 14,
  TAG_MARGIN: 4,
  ICON_SIZE: 24,
  ARROW_SIZE: 12,
} as const;

export const TAGS_COLORS = {
  BACKGROUND: '#FFFFFF',
  CARD_BACKGROUND: '#FFFFFF',
  CARD_BORDER: '#E5E5E5',
  CARD_BORDER_PRESSED: '#8A2BE2',
  ICON_COLOR: '#666666',
  ARROW_COLOR: '#999999',
  TEXT_PRIMARY: '#333333',
  TEXT_SECONDARY: '#666666',
  TEXT_PLACEHOLDER: '#999999',
  TAG_BACKGROUND: '#8A2BE2',
  TAG_TEXT: '#FFFFFF',
  TAG_REMOVE: '#FFFFFF',
  DIVIDER: '#F0F0F0',
} as const;
// #endregion

// #region 3. 字体常量
export const TAGS_FONTS = {
  LABEL_SIZE: 16,
  LABEL_WEIGHT: '500',
  VALUE_SIZE: 14,
  VALUE_WEIGHT: '400',
  TAG_SIZE: 14,
  TAG_WEIGHT: '500',
  PLACEHOLDER_SIZE: 14,
  PLACEHOLDER_WEIGHT: '400',
  ICON_SIZE: 16,
} as const;
// #endregion

// #region 4. 文本常量
export const TAG_LABELS = {
  SELECT_TOPIC: '选择话题',
  SELECT_LOCATION: '选择地点',
  TOPIC_PLACEHOLDER: '添加话题标签',
  LOCATION_PLACEHOLDER: '添加位置信息',
  NO_TOPICS_SELECTED: '未选择话题',
  NO_LOCATION_SELECTED: '未选择地点',
  MULTIPLE_TOPICS: '个话题',
  CURRENT_LOCATION: '当前位置',
} as const;

export const TAG_HINTS = {
  MAX_TOPICS_HINT: '最多可选择3个话题',
  TOPIC_HELP: '选择相关话题，让更多人发现你的内容',
  LOCATION_HELP: '添加位置信息，与附近的朋友分享',
  TOPIC_LIMIT_REACHED: '话题数量已达上限',
  LONG_PRESS_REMOVE: '长按标签可删除',
} as const;

export const TAG_ICONS = {
  TOPIC: '#️⃣',
  LOCATION: '📍',
  ARROW_RIGHT: '▶️',
  CLOSE: '✕',
  ADD: '➕',
  HOT: '🔥',
  NEARBY: '🎯',
} as const;
// #endregion

// #region 5. 动画常量
export const TAG_ANIMATION = {
  PRESS_SCALE: 0.98,
  PRESS_OPACITY: 0.8,
  DURATION_FAST: 150,
  DURATION_NORMAL: 200,
  SPRING_CONFIG: {
    tension: 100,
    friction: 8,
  },
  TAG_ENTER_DELAY: 50,
  TAG_EXIT_DURATION: 200,
} as const;
// #endregion

// #region 6. 卡片配置
export const CARD_CONFIG = {
  TOPIC_CARD: {
    icon: TAG_ICONS.TOPIC,
    label: TAG_LABELS.SELECT_TOPIC,
    placeholder: TAG_LABELS.TOPIC_PLACEHOLDER,
    minHeight: TAGS_UI.CARD_HEIGHT,
  },
  LOCATION_CARD: {
    icon: TAG_ICONS.LOCATION,
    label: TAG_LABELS.SELECT_LOCATION,
    placeholder: TAG_LABELS.LOCATION_PLACEHOLDER,
    minHeight: TAGS_UI.CARD_HEIGHT,
  },
} as const;
// #endregion

// #region 7. 标签样式变体
export const TAG_VARIANTS = {
  DEFAULT: {
    backgroundColor: TAGS_COLORS.TAG_BACKGROUND,
    textColor: TAGS_COLORS.TAG_TEXT,
    borderColor: 'transparent',
    borderWidth: 0,
  },
  OUTLINE: {
    backgroundColor: 'transparent',
    textColor: TAGS_COLORS.TAG_BACKGROUND,
    borderColor: TAGS_COLORS.TAG_BACKGROUND,
    borderWidth: 1,
  },
  COMPACT: {
    backgroundColor: TAGS_COLORS.TAG_BACKGROUND,
    textColor: TAGS_COLORS.TAG_TEXT,
    borderColor: 'transparent',
    borderWidth: 0,
    paddingHorizontal: 8,
    paddingVertical: 2,
    fontSize: 12,
  },
  SOLID: {
    backgroundColor: TAGS_COLORS.TAG_BACKGROUND,
    textColor: TAGS_COLORS.TAG_TEXT,
    borderColor: TAGS_COLORS.TAG_BACKGROUND,
    borderWidth: 1,
  },
} as const;
// #endregion

// #region 8. 验证规则
export const VALIDATION_RULES = {
  TOPIC_REQUIRED: false,
  LOCATION_REQUIRED: false,
  MIN_TOPICS: 0,
  MAX_TOPICS: TAG_LIMITS.MAX_TOPICS,
  TOPIC_NAME_MIN_LENGTH: 1,
  TOPIC_NAME_MAX_LENGTH: TAG_LIMITS.MAX_TOPIC_NAME_LENGTH,
  LOCATION_NAME_MIN_LENGTH: 1,
  LOCATION_NAME_MAX_LENGTH: TAG_LIMITS.MAX_LOCATION_NAME_LENGTH,
} as const;

export const VALIDATION_MESSAGES = {
  TOPICS_REQUIRED: '请至少选择一个话题',
  LOCATION_REQUIRED: '请选择一个位置',
  TOO_MANY_TOPICS: `最多只能选择${TAG_LIMITS.MAX_TOPICS}个话题`,
  TOPIC_NAME_TOO_LONG: `话题名称不能超过${TAG_LIMITS.MAX_TOPIC_NAME_LENGTH}个字符`,
  LOCATION_NAME_TOO_LONG: `位置名称不能超过${TAG_LIMITS.MAX_LOCATION_NAME_LENGTH}个字符`,
  DUPLICATE_TOPIC: '话题已存在',
  INVALID_LOCATION: '位置信息无效',
} as const;
// #endregion

// #region 9. 默认配置
export const DEFAULT_CONFIG = {
  MAX_TOPICS: TAG_LIMITS.MAX_TOPICS,
  REQUIRE_LOCATION: false,
  REQUIRE_TOPICS: false,
  ENABLE_MULTIPLE_TOPICS: true,
  ENABLE_LOCATION_SEARCH: true,
  ENABLE_TOPIC_SEARCH: true,
  AUTO_SELECT_CURRENT_LOCATION: false,
  SHOW_HOT_TOPICS: true,
  SHOW_NEARBY_LOCATIONS: true,
} as const;

export const DEFAULT_STYLES = {
  CARD_ELEVATION: 0,
  CARD_SHADOW_OFFSET: { x: 0, y: 1 },
  CARD_SHADOW_OPACITY: 0.1,
  CARD_SHADOW_RADIUS: 2,
  TAG_ELEVATION: 0,
  TAG_SHADOW_OFFSET: { x: 0, y: 1 },
  TAG_SHADOW_OPACITY: 0.1,
  TAG_SHADOW_RADIUS: 1,
} as const;
// #endregion
