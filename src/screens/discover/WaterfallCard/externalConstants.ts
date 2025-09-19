/**
 * 外部常量临时定义
 * 基于通用组件架构核心标准 - 外部依赖适配层
 * 
 * @version 2.0.0
 * @author 架构团队
 */

// 临时颜色常量定义
export const COLORS = {
  PRIMARY: '#007AFF',
  BACKGROUND: '#FFFFFF',
  TEXT_PRIMARY: '#333333',
  TEXT_SECONDARY: '#666666',
  TEXT_TERTIARY: '#999999',
  BACKGROUND_GRAY: '#F5F5F5',
  SHADOW: '#000000',
  OVERLAY: 'rgba(0,0,0,0.6)',
  ERROR: '#FF3B30',
  LIKE_ACTIVE: '#FF3B30',
};

// 临时排版常量定义
export const TYPOGRAPHY = {
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
  CAPTION: {
    fontSize: 12,
    fontWeight: '400' as const,
    lineHeight: 16,
  },
};

// 临时布局常量定义
export const LAYOUT_CONSTANTS = {
  CARD_RADIUS: 12,
  MARGIN_SMALL: 8,
  MARGIN_MEDIUM: 16,
  AVATAR_SIZE_SMALL: 32,
  ICON_SIZE_SMALL: 16,
  CARD_SHADOW_OFFSET: { width: 0, height: 2 },
  CARD_SHADOW_OPACITY: 0.1,
  CARD_SHADOW_RADIUS: 4,
};

// 临时图片配置常量定义
export const IMAGE_CONFIG = {
  CACHE_CONTROL: 'default' as const,
  PLACEHOLDER_AVATAR: require('../../../assets/images/common/default-avatar.png'),
};
