/**
 * 我的页面模块 - 常量配置
 * 基于设计文档的完整常量定义
 */

// 颜色常量 - 基于设计文档的色彩体系
export const COLORS = {
  // 主色系 - 紫色渐变
  PRIMARY: '#8A2BE2',
  PRIMARY_LIGHT: '#B19CD9',
  
  // 辅助色系
  BLUE: '#007AFF',
  GREEN: '#34C759',
  ORANGE: '#FF9500',
  RED: '#FF3B30',
  PINK: '#FF3B30',
  YELLOW: '#FFD700',
  
  // 基础色系
  WHITE: '#FFFFFF',
  BLACK: '#000000',
  GRAY: '#8E8E93',
  LIGHT_GRAY: '#F2F2F7',
  
  // 状态色
  SUCCESS: '#34C759',
  WARNING: '#FF9500',
  ERROR: '#FF3B30',
  INFO: '#007AFF',
} as const;

// 尺寸常量 - 基于设计文档的尺寸规范
export const SIZES = {
  // 头像尺寸
  AVATAR_SIZE: 80,
  AVATAR_BORDER: 4,
  
  // 功能卡片尺寸
  FUNCTION_CARD_SIZE: 64,
  FUNCTION_ICON_SIZE: 40,
  FUNCTION_ICON_INNER: 24,
  
  // 圆角
  CARD_RADIUS: 12,
  COMPONENT_RADIUS: 8,
  ICON_RADIUS: 20,
  
  // 间距
  PADDING_XL: 24,
  PADDING_L: 20,
  PADDING_M: 16,
  PADDING_S: 14,
  PADDING_XS: 8,
  PADDING_XXS: 4,
  
  // 高度
  HEADER_HEIGHT: 200,
  TRANSACTION_CARD_HEIGHT: 120,
  BOTTOM_NAV_HEIGHT: 80,
  STATUS_BAR_HEIGHT: 20,
} as const;

// 字体尺寸常量 - 基于设计文档的字体体系
export const FONT_SIZES = {
  TITLE_LARGE: 20,
  TITLE_MEDIUM: 18,
  TITLE_SMALL: 16,
  BODY_LARGE: 14,
  BODY_SMALL: 12,
  CAPTION: 10,
} as const;

// 动画常量
export const ANIMATIONS = {
  DURATION_SHORT: 150,
  DURATION_MEDIUM: 200,
  DURATION_LONG: 300,
  SCALE_PRESS: 0.95,
} as const;

// 交易功能配置 - 基于设计文档的4宫格布局
export const TRANSACTION_FUNCTIONS = [
  {
    id: 'publish',
    title: '我的发布',
    icon: 'document-text-outline',
    color: COLORS.PRIMARY,
    route: '/my-publish',
  },
  {
    id: 'orders',
    title: '我的订单',
    icon: 'receipt-outline',
    color: COLORS.BLUE,
    route: '/my-orders',
  },
  {
    id: 'purchase',
    title: '我的购买',
    icon: 'bag-outline',
    color: COLORS.GREEN,
    route: '/my-purchase',
  },
  {
    id: 'enrollment',
    title: '我的报名',
    icon: 'mail-outline',
    color: COLORS.ORANGE,
    route: '/my-enrollment',
  },
] as const;

// 工具功能配置 - 基于设计文档的更多内容区域
export const TOOL_FUNCTIONS = [
  // 第一行功能组
  {
    id: 'profile-center',
    title: '个人中心',
    icon: 'person-outline',
    color: COLORS.ORANGE,
    route: '/profile-center',
  },
  {
    id: 'status',
    title: '状态',
    icon: 'radio-button-on-outline',
    color: COLORS.RED,
    route: '/status',
  },
  {
    id: 'wallet',
    title: '钱包',
    icon: 'wallet-outline',
    color: COLORS.BLUE,
    route: '/wallet',
  },
  {
    id: 'coins',
    title: '金币',
    icon: 'diamond-outline',
    color: COLORS.YELLOW,
    route: '/coins',
  },
  // 第二行功能组
  {
    id: 'settings',
    title: '设置',
    icon: 'settings-outline',
    color: COLORS.PRIMARY,
    route: '/settings',
  },
  {
    id: 'customer-service',
    title: '客服',
    icon: 'headset-outline',
    color: COLORS.GREEN,
    route: '/customer-service',
  },
  {
    id: 'verification',
    title: '达人认证',
    icon: 'ribbon-outline',
    color: COLORS.PINK,
    route: '/verification',
  },
] as const;

// API端点常量
export const API_ENDPOINTS = {
  USER_PROFILE: '/api/v1/user/profile',
  USER_UPDATE: '/api/v1/user/profile',
  AVATAR_UPLOAD: '/api/v1/user/avatar',
  TRANSACTION_COUNTS: '/api/v1/transactions/counts',
  WALLET_INFO: '/api/v1/wallet/info',
} as const;

// 默认值常量
export const DEFAULT_VALUES = {
  DEFAULT_AVATAR: 'https://example.com/default-avatar.png',
  DEFAULT_BIO: '这个家伙很神秘，没有填写简介',
  MAX_NICKNAME_LENGTH: 20,
  MAX_BIO_LENGTH: 200,
  AVATAR_MAX_SIZE: 5 * 1024 * 1024, // 5MB
} as const;

// 状态常量
export const USER_STATUS = {
  ONLINE: 'online',
  BUSY: 'busy', 
  AWAY: 'away',
  OFFLINE: 'offline',
} as const;

// 错误消息常量
export const ERROR_MESSAGES = {
  NETWORK_ERROR: '网络连接失败，请检查网络设置',
  UPLOAD_FAILED: '上传失败，请重试',
  UPDATE_FAILED: '更新失败，请重试',
  NICKNAME_TOO_LONG: `昵称不能超过${DEFAULT_VALUES.MAX_NICKNAME_LENGTH}个字符`,
  BIO_TOO_LONG: `简介不能超过${DEFAULT_VALUES.MAX_BIO_LENGTH}个字符`,
  AVATAR_TOO_LARGE: `头像文件不能超过${DEFAULT_VALUES.AVATAR_MAX_SIZE / 1024 / 1024}MB`,
} as const;
