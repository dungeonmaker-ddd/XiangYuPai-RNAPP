/**
 * 发现页面模块常量配置
 * 包含API端点、布局常量、颜色主题等
 */

import { TabConfig } from './types';

// API端点配置
export const API_ENDPOINTS = {
  // 内容相关
  DISCOVER_HOT: '/api/discover/hot',
  DISCOVER_FOLLOW: '/api/discover/follow', 
  DISCOVER_LOCAL: '/api/discover/local',
  CONTENT_DETAIL: '/api/content/detail',
  
  // 用户交互
  LIKE_CONTENT: '/api/content/like',
  COLLECT_CONTENT: '/api/content/collect',
  FOLLOW_USER: '/api/user/follow',
  SHARE_CONTENT: '/api/content/share',
  
  // 用户相关
  USER_PROFILE: '/api/user/profile',
  USER_CONTENT: '/api/user/content',
} as const;

// 布局常量
export const LAYOUT_CONSTANTS = {
  // 卡片相关
  CARD_MARGIN: 8,
  CARD_RADIUS: 12,
  CARD_SHADOW_OFFSET: { width: 0, height: 2 },
  CARD_SHADOW_OPACITY: 0.1,
  CARD_SHADOW_RADIUS: 4,
  
  // 列数配置
  COLUMN_COUNT: 2,
  COLUMN_GAP: 8,
  
  // 头像相关
  AVATAR_SIZE_SMALL: 24,
  AVATAR_SIZE_MEDIUM: 36,
  AVATAR_SIZE_LARGE: 48,
  
  // 图标尺寸
  ICON_SIZE_SMALL: 16,
  ICON_SIZE_MEDIUM: 20,
  ICON_SIZE_LARGE: 24,
  
  // 间距
  PADDING_HORIZONTAL: 16,
  PADDING_VERTICAL: 12,
  MARGIN_SMALL: 4,
  MARGIN_MEDIUM: 8,
  MARGIN_LARGE: 16,
  
  // 高度
  HEADER_HEIGHT: 56,
  TAB_BAR_HEIGHT: 48,
  BOTTOM_NAV_HEIGHT: 80,
  
  // 加载更多阈值
  LOAD_MORE_THRESHOLD: 0.7,
} as const;

// 颜色主题
export const COLORS = {
  // 主色调
  PRIMARY: '#8A2BE2',
  PRIMARY_LIGHT: '#9370DB',
  PRIMARY_DARK: '#7B68EE',
  
  // 文字颜色
  TEXT_PRIMARY: '#000000',
  TEXT_SECONDARY: '#666666',
  TEXT_TERTIARY: '#999999',
  TEXT_PLACEHOLDER: '#CCCCCC',
  
  // 背景颜色
  BACKGROUND: '#F8F8F8',
  BACKGROUND_GRAY: '#F5F5F5',
  CARD_BACKGROUND: '#FFFFFF',
  
  // 边框颜色
  BORDER: '#EEEEEE',
  BORDER_LIGHT: '#F0F0F0',
  SEPARATOR: '#E5E5E5',
  
  // 状态颜色
  SUCCESS: '#4CAF50',
  WARNING: '#FF9800',
  ERROR: '#F44336',
  INFO: '#2196F3',
  
  // 交互颜色
  LIKE: '#FF3B30',
  LIKE_ACTIVE: '#FF1744',
  COLLECT: '#FF9800',
  COLLECT_ACTIVE: '#FF8F00',
  SHARE: '#2196F3',
  
  // 透明色
  TRANSPARENT: 'transparent',
  OVERLAY: 'rgba(0, 0, 0, 0.3)',
  SHADOW: 'rgba(0, 0, 0, 0.1)',
} as const;

// 字体样式
export const TYPOGRAPHY = {
  // 标题
  TITLE_LARGE: {
    fontSize: 20,
    fontWeight: 'bold' as const,
    lineHeight: 28,
    color: COLORS.TEXT_PRIMARY,
  },
  TITLE_MEDIUM: {
    fontSize: 18,
    fontWeight: 'bold' as const,
    lineHeight: 24,
    color: COLORS.TEXT_PRIMARY,
  },
  TITLE_SMALL: {
    fontSize: 16,
    fontWeight: 'bold' as const,
    lineHeight: 22,
    color: COLORS.TEXT_PRIMARY,
  },
  
  // 正文
  BODY_LARGE: {
    fontSize: 16,
    fontWeight: 'normal' as const,
    lineHeight: 22,
    color: COLORS.TEXT_PRIMARY,
  },
  BODY_MEDIUM: {
    fontSize: 14,
    fontWeight: 'normal' as const,
    lineHeight: 20,
    color: COLORS.TEXT_PRIMARY,
  },
  BODY_SMALL: {
    fontSize: 12,
    fontWeight: 'normal' as const,
    lineHeight: 16,
    color: COLORS.TEXT_SECONDARY,
  },
  
  // 标签
  CAPTION: {
    fontSize: 12,
    fontWeight: 'normal' as const,
    lineHeight: 16,
    color: COLORS.TEXT_TERTIARY,
  },
  
  // 按钮
  BUTTON_TEXT: {
    fontSize: 16,
    fontWeight: '500' as const,
    lineHeight: 22,
  },
} as const;

// Tab配置
export const TABS: TabConfig[] = [
  {
    key: 'follow',
    title: '关注',
  },
  {
    key: 'hot', 
    title: '热门',
  },
  {
    key: 'local',
    title: '同城',
  },
];

// 动画配置
export const ANIMATION_CONFIG = {
  // 持续时间
  DURATION_SHORT: 200,
  DURATION_MEDIUM: 300,
  DURATION_LONG: 500,
  
  // 缓动函数
  EASING_IN: 'ease-in',
  EASING_OUT: 'ease-out',
  EASING_IN_OUT: 'ease-in-out',
  
  // Tab切换动画
  TAB_SWITCH_DURATION: 300,
  
  // 点赞动画
  LIKE_ANIMATION_DURATION: 200,
  LIKE_SCALE_START: 1,
  LIKE_SCALE_END: 1.2,
  
  // 下拉刷新
  REFRESH_DURATION: 1000,
  
  // 加载更多
  LOAD_MORE_DURATION: 500,
} as const;

// 请求配置
export const REQUEST_CONFIG = {
  // 超时时间
  TIMEOUT: 10000,
  
  // 重试次数
  RETRY_COUNT: 3,
  
  // 分页大小
  PAGE_SIZE: 20,
  
  // 缓存时间（毫秒）
  CACHE_TIME: 5 * 60 * 1000, // 5分钟
  
  // 刷新间隔
  REFRESH_INTERVAL: 30 * 1000, // 30秒
} as const;

// 图片配置
export const IMAGE_CONFIG = {
  // 质量
  QUALITY_HIGH: 0.9,
  QUALITY_MEDIUM: 0.7,
  QUALITY_LOW: 0.5,
  
  // 压缩尺寸
  THUMBNAIL_SIZE: 300,
  MEDIUM_SIZE: 600,
  LARGE_SIZE: 1200,
  
  // 瀑布流图片尺寸限制
  WATERFALL: {
    // 最小宽度 (px)
    MIN_WIDTH: 200,
    // 最大宽度 (px) 
    MAX_WIDTH: 800,
    // 最小高度 (px)
    MIN_HEIGHT: 150,
    // 最大高度 (px)
    MAX_HEIGHT: 1200,
    // 默认宽高比 (当原图比例异常时使用)
    DEFAULT_ASPECT_RATIO: 3 / 4,
    // 最小宽高比
    MIN_ASPECT_RATIO: 1 / 3,
    // 最大宽高比
    MAX_ASPECT_RATIO: 3 / 1,
    // 内容区域固定高度 (用户信息、标题等)
    CONTENT_HEIGHT: 52, // 精确计算：padding(8) + title(18) + userRow(26) = 52px
  },
  
  // 占位图
  PLACEHOLDER_AVATAR: require('../../../assets/images/common/default-avatar.png'),
  PLACEHOLDER_IMAGE: require('../../../assets/images/common/default-avatar.png'), // 暂时使用default-avatar作为placeholder
  
  // 缓存配置
  CACHE_CONTROL: 'force-cache',
  PRIORITY_NORMAL: 'normal',
  PRIORITY_HIGH: 'high',
} as const;

// 错误消息
export const ERROR_MESSAGES = {
  NETWORK_ERROR: '网络连接失败，请检查网络设置',
  SERVER_ERROR: '服务器异常，请稍后重试',
  DATA_ERROR: '数据格式错误',
  PERMISSION_ERROR: '权限不足',
  NOT_FOUND: '内容不存在或已被删除',
  LIKE_ERROR: '点赞失败，请重试',
  FOLLOW_ERROR: '关注失败，请重试',
  SHARE_ERROR: '分享失败，请重试',
  LOAD_MORE_ERROR: '加载更多失败',
  REFRESH_ERROR: '刷新失败',
} as const;

// 成功消息
export const SUCCESS_MESSAGES = {
  LIKE_SUCCESS: '点赞成功',
  UNLIKE_SUCCESS: '取消点赞',
  FOLLOW_SUCCESS: '关注成功', 
  UNFOLLOW_SUCCESS: '取消关注',
  COLLECT_SUCCESS: '收藏成功',
  UNCOLLECT_SUCCESS: '取消收藏',
  SHARE_SUCCESS: '分享成功',
} as const;

// TestID常量（用于自动化测试）
export const TEST_IDS = {
  DISCOVER_SCREEN: 'discover_screen',
  TAB_BAR: 'discover_tab_bar',
  TAB_FOLLOW: 'tab_follow',
  TAB_HOT: 'tab_hot', 
  TAB_LOCAL: 'tab_local',
  WATERFALL_LIST: 'waterfall_list',
  CONTENT_CARD: 'content_card',
  LIKE_BUTTON: 'like_button',
  AVATAR: 'user_avatar',
  CART_ICON: 'cart_icon',
  REFRESH_CONTROL: 'refresh_control',
} as const;