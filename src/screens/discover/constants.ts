/**
 * 发现页面 - 常量定义
 * 定义发现页面相关的常量配置
 */

import { TabType } from './types';

// API 端点配置
export const API_ENDPOINTS = {
  FOLLOWING: '/api/discover/following',
  TRENDING: '/api/discover/trending', 
  NEARBY: '/api/discover/nearby',
  LIKE: '/api/content/like',
  COMMENT: '/api/content/comment',
  SHARE: '/api/content/share',
  FOLLOW: '/api/user/follow',
  REPORT: '/api/content/report',
  LOCATION: '/api/location/update'
} as const;

// 分页配置
export const PAGINATION = {
  PAGE_SIZE: 20,
  INITIAL_PAGE: 1,
  PRELOAD_THRESHOLD: 2 // 距离底部2屏高度时开始预加载
} as const;

// 标签页配置
export const TAB_CONFIG = [
  {
    key: TabType.FOLLOWING,
    title: '关注',
    icon: null,
    badge: 0
  },
  {
    key: TabType.TRENDING, 
    title: '热门',
    icon: '🔥', // 可选的热门图标
    badge: 0
  },
  {
    key: TabType.NEARBY,
    title: '同城', 
    icon: '📍', // 可选的位置图标
    badge: 0
  }
] as const;

// 瀑布流布局配置
export const MASONRY_CONFIG = {
  NUM_COLUMNS: 2, // 固定双列
  COLUMN_GAP: 8, // 列间距8px
  CONTENT_PADDING: 16, // 容器左右边距16px
  MIN_COLUMN_WIDTH: 160, // 最小列宽
  MAX_COLUMN_WIDTH: 240, // 最大列宽
  CARD_VERTICAL_GAP: 0, // 卡片垂直间距(使用分割线)
  TOP_SAFE_DISTANCE: 16, // 顶部安全距离
  BOTTOM_SAFE_DISTANCE: 16 // 底部安全距离
} as const;

// 内容卡片配置
export const CARD_CONFIG = {
  // 用户信息区域
  USER_INFO_HEIGHT: 56,
  AVATAR_SIZE: 40,
  AVATAR_BORDER_RADIUS: 20,
  
  // 内容区域
  TEXT_LINE_HEIGHT: 20,
  MAX_TEXT_LINES: 3,
  TEXT_FONT_SIZE: 16,
  
  // 图片区域
  IMAGE_BORDER_RADIUS: 8,
  MAX_IMAGE_HEIGHT: 400,
  MIN_IMAGE_HEIGHT: 100,
  DEFAULT_IMAGE_HEIGHT: 200,
  
  // 视频区域
  VIDEO_ASPECT_RATIO: 16 / 9,
  VIDEO_BORDER_RADIUS: 8,
  
  // 互动操作栏
  ACTION_BAR_HEIGHT: 48,
  ACTION_BUTTON_SIZE: 44,
  ACTION_ICON_SIZE: 20,
  
  // 内边距
  CARD_PADDING: 12,
  CONTENT_SPACING: 8
} as const;

// 动画配置
export const ANIMATION_CONFIG = {
  // 标签切换动画
  TAB_SWITCH_DURATION: 300,
  TAB_INDICATOR_DURATION: 300,
  
  // 内容切换动画  
  CONTENT_FADE_DURATION: 200,
  CONTENT_SLIDE_DURATION: 300,
  
  // 卡片动画
  CARD_ENTER_DURATION: 300,
  CARD_PRESS_DURATION: 100,
  
  // 点赞动画
  LIKE_ANIMATION_DURATION: 300,
  LIKE_SCALE_FACTOR: 1.2,
  
  // 加载动画
  LOADING_DURATION: 1500,
  SKELETON_DURATION: 1500,
  
  // 刷新动画
  REFRESH_TRIGGER_DISTANCE: 80,
  REFRESH_ANIMATION_DURATION: 400
} as const;

// 颜色配置 [[memory:8830196]]
export const COLORS = {
  // 主色调 - 紫色渐变
  PRIMARY: '#8B5CF6',
  PRIMARY_LIGHT: '#A78BFA', 
  PRIMARY_DARK: '#7C3AED',
  PRIMARY_GRADIENT: ['rgba(115, 127, 225, 1)', 'rgba(175, 56, 217, 1)'],
  
  // 中性色
  BLACK: '#1F2937',
  GRAY_900: '#111827',
  GRAY_800: '#1F2937', 
  GRAY_700: '#374151',
  GRAY_600: '#4B5563',
  GRAY_500: '#6B7280',
  GRAY_400: '#9CA3AF',
  GRAY_300: '#D1D5DB',
  GRAY_200: '#E5E7EB',
  GRAY_100: '#F3F4F6',
  GRAY_50: '#F9FAFB',
  WHITE: '#FFFFFF',
  
  // 功能色
  SUCCESS: '#10B981',
  WARNING: '#F59E0B', 
  ERROR: '#EF4444',
  INFO: '#3B82F6',
  
  // 社交互动色
  LIKE_COLOR: '#EF4444', // 红色点赞
  COMMENT_COLOR: '#6B7280', // 灰色评论
  SHARE_COLOR: '#6B7280', // 灰色分享
  
  // 标签状态色
  TAB_ACTIVE: '#1F2937',
  TAB_INACTIVE: '#6B7280',
  TAB_INDICATOR: '#8B5CF6',
  
  // 背景色
  BACKGROUND: '#FFFFFF',
  CARD_BACKGROUND: '#FFFFFF',
  MODAL_BACKGROUND: 'rgba(0, 0, 0, 0.5)',
  
  // 边框色
  BORDER: '#E5E7EB',
  SEPARATOR: '#F3F4F6'
} as const;

// 字体配置
export const FONTS = {
  // 字体族
  FAMILY: 'PingFang SC',
  FAMILY_FALLBACK: ['Helvetica', 'Arial', 'sans-serif'],
  
  // 字号
  SIZE_10: 10,
  SIZE_12: 12, 
  SIZE_14: 14,
  SIZE_16: 16,
  SIZE_18: 18,
  SIZE_20: 20,
  
  // 字重
  WEIGHT_REGULAR: '400' as const,
  WEIGHT_MEDIUM: '500' as const,
  WEIGHT_BOLD: '600' as const,
  
  // 行高
  LINE_HEIGHT_1_2: 1.2,
  LINE_HEIGHT_1_4: 1.4, 
  LINE_HEIGHT_1_6: 1.6
} as const;

// 间距配置
export const SPACING = {
  XS: 4,
  SM: 8,
  MD: 12,
  LG: 16,
  XL: 20,
  XXL: 24,
  XXXL: 32
} as const;

// 圆角配置
export const BORDER_RADIUS = {
  SM: 4,
  MD: 8,
  LG: 12,
  XL: 16,
  ROUND: 50
} as const;

// 阴影配置
export const SHADOWS = {
  SMALL: {
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2
  },
  MEDIUM: {
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4
  },
  LARGE: {
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 8
  }
} as const;

// z-index层级
export const Z_INDEX = {
  MODAL: 1000,
  OVERLAY: 900,
  POPUP: 800,
  DROPDOWN: 700,
  HEADER: 100,
  CONTENT: 1
} as const;

// 测试ID
export const TEST_IDS = {
  // 主容器
  DISCOVER_SCREEN: 'discover-screen',
  
  // 导航标签
  TAB_FOLLOWING: 'tab-following',
  TAB_TRENDING: 'tab-trending', 
  TAB_NEARBY: 'tab-nearby',
  
  // 内容区域
  CONTENT_LIST: 'content-list',
  CONTENT_CARD: 'content-card',
  
  // 用户信息
  USER_AVATAR: 'user-avatar',
  USER_NICKNAME: 'user-nickname',
  
  // 互动按钮
  LIKE_BUTTON: 'like-button',
  COMMENT_BUTTON: 'comment-button',
  SHARE_BUTTON: 'share-button',
  MORE_BUTTON: 'more-button',
  
  // 拍摄按钮
  CAMERA_BUTTON: 'camera-button',
  
  // 加载状态
  LOADING_INDICATOR: 'loading-indicator',
  REFRESH_CONTROL: 'refresh-control',
  
  // 空状态
  EMPTY_STATE: 'empty-state',
  ERROR_STATE: 'error-state'
} as const;

// 无障碍标签
export const ACCESSIBILITY_LABELS = {
  TAB_FOLLOWING: '关注标签页',
  TAB_TRENDING: '热门标签页',
  TAB_NEARBY: '同城标签页',
  
  LIKE_BUTTON: '点赞',
  LIKED_BUTTON: '已点赞',
  COMMENT_BUTTON: '评论',
  SHARE_BUTTON: '分享',
  MORE_BUTTON: '更多操作',
  
  CAMERA_BUTTON: '拍摄发布内容',
  
  USER_AVATAR: '用户头像',
  CONTENT_IMAGE: '内容图片',
  CONTENT_VIDEO: '内容视频',
  
  REFRESH_CONTENT: '下拉刷新内容',
  LOAD_MORE: '加载更多内容'
} as const;

// 错误信息
export const ERROR_MESSAGES = {
  NETWORK_ERROR: '网络连接失败，请检查网络设置',
  LOAD_FAILED: '内容加载失败，请重试',
  LOCATION_DENIED: '位置权限被拒绝，无法获取同城内容',
  LOCATION_UNAVAILABLE: '位置服务不可用',
  NO_MORE_DATA: '已经到底了~',
  EMPTY_FOLLOWING: '暂无关注用户动态\n快去关注一些有趣的人吧',
  EMPTY_TRENDING: '暂无热门内容',
  EMPTY_NEARBY: '附近暂无动态\n换个地方试试吧'
} as const;

// 默认配置
export const DEFAULT_CONFIG = {
  REFRESH_THRESHOLD: 5000, // 5秒防抖间隔
  REQUEST_TIMEOUT: 30000, // 30秒请求超时
  MAX_RETRY_COUNT: 3, // 最大重试次数
  CACHE_DURATION: 300000, // 5分钟缓存时间
  
  // 虚拟滚动配置
  VIEWPORT_HEIGHT: 667, // iPhone标准屏幕高度
  BUFFER_SIZE: 1, // 缓冲区大小(屏幕数量)
  ITEM_HEIGHT_ESTIMATION: 200, // 预估项目高度
  
  // 图片加载配置
  IMAGE_QUALITY: 0.8, // 图片质量
  THUMBNAIL_SIZE: 200, // 缩略图尺寸
  MAX_IMAGE_SIZE: 1080 // 最大图片尺寸
} as const;
