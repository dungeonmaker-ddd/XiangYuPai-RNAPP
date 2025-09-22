/**
 * 🔍 搜索模块常量配置
 * 
 * 基于搜索结果模块架构设计的常量定义
 * 包含颜色、尺寸、配置项等所有常量
 */

import { Dimensions } from 'react-native';
import { TabType } from './types';

// ══════════════════════════════════════════════════════════════
// 1. 屏幕尺寸常量
// ══════════════════════════════════════════════════════════════

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

export const SCREEN_WIDTH = screenWidth;
export const SCREEN_HEIGHT = screenHeight;

// ══════════════════════════════════════════════════════════════
// 2. 颜色常量
// ══════════════════════════════════════════════════════════════

export const COLORS = {
  // 主色调
  primary: '#6C5CE7',        // 紫色主色
  primaryLight: '#A29BFE',   // 浅紫色
  primaryDark: '#5F3DC4',    // 深紫色
  
  // 基础颜色
  white: '#FFFFFF',
  black: '#000000',
  transparent: 'transparent',
  
  // 灰度色系
  gray50: '#FAFAFA',
  gray100: '#F5F5F5',
  gray200: '#EEEEEE',
  gray300: '#E0E0E0',
  gray400: '#BDBDBD',
  gray500: '#9E9E9E',
  gray600: '#757575',
  gray700: '#616161',
  gray800: '#424242',
  gray900: '#212121',
  
  // 文字颜色
  textPrimary: '#212121',    // 主要文字
  textSecondary: '#757575',  // 次要文字
  textLight: '#9E9E9E',      // 浅色文字
  textDisabled: '#BDBDBD',   // 禁用文字
  
  // 状态颜色
  success: '#4CAF50',        // 成功绿色
  warning: '#FF9800',        // 警告橙色
  error: '#F44336',          // 错误红色
  info: '#2196F3',          // 信息蓝色
  
  // 在线状态颜色
  online: '#4CAF50',         // 在线绿色
  offline: '#9E9E9E',        // 离线灰色
  available: '#FF9800',      // 可预约橙色
  busy: '#F44336',          // 忙碌红色
  
  // 背景颜色
  background: '#FFFFFF',     // 主背景
  backgroundSecondary: '#F5F5F5', // 次要背景
  backgroundCard: '#FFFFFF', // 卡片背景
  backgroundInput: '#F5F5F5', // 输入框背景
  
  // 边框颜色
  border: '#E0E0E0',        // 主边框
  borderLight: '#EEEEEE',   // 浅色边框
  borderDark: '#BDBDBD',    // 深色边框
  
  // 阴影颜色
  shadow: '#000000',
  shadowLight: 'rgba(0, 0, 0, 0.1)',
  shadowMedium: 'rgba(0, 0, 0, 0.15)',
  shadowDark: 'rgba(0, 0, 0, 0.25)',
  
  // 高亮颜色
  highlight: '#6C5CE7',      // 关键词高亮
  highlightBackground: 'rgba(108, 92, 231, 0.1)', // 高亮背景
};

// ══════════════════════════════════════════════════════════════
// 3. 间距常量
// ══════════════════════════════════════════════════════════════

export const SPACING = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  xxxl: 32,
  
  // 页面边距
  pageHorizontal: 16,
  pageVertical: 16,
  
  // 卡片间距
  cardPadding: 12,
  cardMargin: 8,
  cardRadius: 12,
  
  // 组件间距
  componentGap: 16,
  sectionGap: 24,
  
  // 列表间距
  listItemGap: 1,
  listSectionGap: 16,
};

// ══════════════════════════════════════════════════════════════
// 4. 字体常量
// ══════════════════════════════════════════════════════════════

export const FONTS = {
  // 字体大小
  size: {
    xs: 10,
    sm: 12,
    md: 14,
    lg: 16,
    xl: 18,
    xxl: 20,
    xxxl: 24,
    title: 28,
  },
  
  // 字体权重
  weight: {
    light: '300' as const,
    normal: '400' as const,
    medium: '500' as const,
    semiBold: '600' as const,
    bold: '700' as const,
  },
  
  // 行高
  lineHeight: {
    tight: 1.2,
    normal: 1.4,
    relaxed: 1.6,
  },
};

// ══════════════════════════════════════════════════════════════
// 5. Z-Index层级常量
// ══════════════════════════════════════════════════════════════

export const Z_INDEX = {
  base: 1,
  overlay: 10,
  modal: 100,
  toast: 1000,
  loading: 999,
  header: 50,
  tabBar: 49,
  searchInput: 20,
  suggestions: 30,
};

// ══════════════════════════════════════════════════════════════
// 6. 搜索配置常量
// ══════════════════════════════════════════════════════════════

/** 分页配置 */
export const PAGINATION = {
  PAGE_SIZE: 20,             // 每页数量
  MAX_PAGES: 50,             // 最大页数
  LOAD_MORE_THRESHOLD: 100,  // 触发加载更多的距离(px)
};

/** 搜索配置 */
export const SEARCH_CONFIG = {
  DEBOUNCE_DELAY: 300,       // 搜索防抖延迟(ms)
  MIN_KEYWORD_LENGTH: 1,     // 最小搜索关键词长度
  MAX_KEYWORD_LENGTH: 50,    // 最大搜索关键词长度
  MAX_SUGGESTIONS: 10,       // 最大建议数量
  MAX_HISTORY: 20,           // 最大历史记录数量
  CACHE_DURATION: 5 * 60 * 1000, // 缓存时长(5分钟)
};

/** 标签配置 */
export const TAB_CONFIG = {
  [TabType.ALL]: {
    key: TabType.ALL,
    title: '全部',
    icon: '🔍',
  },
  [TabType.USERS]: {
    key: TabType.USERS,
    title: '用户',
    icon: '👤',
  },
  [TabType.ORDERS]: {
    key: TabType.ORDERS,
    title: '下单',
    icon: '📋',
  },
  [TabType.TOPICS]: {
    key: TabType.TOPICS,
    title: '话题',
    icon: '🏷️',
  },
};

// ══════════════════════════════════════════════════════════════
// 7. 错误消息常量
// ══════════════════════════════════════════════════════════════

export const ERROR_MESSAGES = {
  NETWORK_ERROR: '网络连接失败，请检查网络设置',
  SEARCH_FAILED: '搜索失败，请稍后重试',
  LOAD_MORE_FAILED: '加载更多失败',
  EMPTY_KEYWORD: '请输入搜索关键词',
  KEYWORD_TOO_SHORT: '搜索关键词太短',
  KEYWORD_TOO_LONG: '搜索关键词太长',
  NO_RESULTS: '没有找到相关结果',
  SERVER_ERROR: '服务器错误，请稍后重试',
  TIMEOUT_ERROR: '请求超时，请稍后重试',
  UNKNOWN_ERROR: '未知错误',
};

// ══════════════════════════════════════════════════════════════
// 8. 占位符文本常量
// ══════════════════════════════════════════════════════════════

export const PLACEHOLDER_TEXTS = {
  SEARCH_INPUT: '搜索更多',
  SEARCH_HISTORY: '暂无搜索历史',
  SEARCH_SUGGESTIONS: '暂无搜索建议',
  LOADING: '加载中...',
  LOAD_MORE: '加载更多',
  NO_MORE: '已经到底了',
  REFRESH: '下拉刷新',
  RETRY: '点击重试',
  EMPTY_ALL: '暂无相关内容',
  EMPTY_USERS: '暂无相关用户',
  EMPTY_ORDERS: '暂无相关服务',
  EMPTY_TOPICS: '暂无相关话题',
};

// ══════════════════════════════════════════════════════════════
// 9. 动画配置常量
// ══════════════════════════════════════════════════════════════

export const ANIMATION = {
  DURATION: {
    fast: 200,
    normal: 300,
    slow: 500,
  },
  
  EASING: {
    ease: 'ease',
    easeIn: 'ease-in',
    easeOut: 'ease-out',
    easeInOut: 'ease-in-out',
  },
  
  SCALE: {
    press: 0.95,
    normal: 1.0,
    expand: 1.05,
  },
};

// ══════════════════════════════════════════════════════════════
// 10. 布局配置常量
// ══════════════════════════════════════════════════════════════

/** 搜索页面布局 */
export const LAYOUT = {
  HEADER_HEIGHT: 56,         // 导航栏高度
  TAB_BAR_HEIGHT: 48,        // 标签栏高度
  SEARCH_INPUT_HEIGHT: 40,   // 搜索框高度
  USER_CARD_HEIGHT: 80,      // 用户卡片高度
  SERVICE_CARD_HEIGHT: 120,  // 服务卡片高度
  TOPIC_CARD_HEIGHT: 80,     // 话题卡片高度
  
  // 瀑布流配置
  MASONRY_COLUMNS: 2,        // 瀑布流列数
  MASONRY_SPACING: 8,        // 瀑布流间距
  MIN_CARD_WIDTH: 160,       // 最小卡片宽度
  MAX_CARD_WIDTH: 240,       // 最大卡片宽度
};

// ══════════════════════════════════════════════════════════════
// 11. 图片配置常量
// ══════════════════════════════════════════════════════════════

export const IMAGE_CONFIG = {
  PLACEHOLDER: 'https://via.placeholder.com/300x200?text=Loading',
  AVATAR_PLACEHOLDER: 'https://via.placeholder.com/48x48?text=Avatar',
  
  // 图片尺寸
  AVATAR_SIZE: {
    small: 24,
    medium: 48,
    large: 72,
  },
  
  // 图片质量
  QUALITY: {
    low: 0.3,
    medium: 0.7,
    high: 0.9,
  },
  
  // 缓存配置
  CACHE_POLICY: {
    memory: 'memory',
    disk: 'disk',
    web: 'web',
  },
};

// ══════════════════════════════════════════════════════════════
// 12. API配置常量
// ══════════════════════════════════════════════════════════════

export const API_CONFIG = {
  BASE_URL: 'https://api.example.com',
  TIMEOUT: 15000,            // 请求超时时间(ms)
  RETRY_TIMES: 3,            // 重试次数
  RETRY_DELAY: 1000,         // 重试延迟(ms)
  
  // API端点
  ENDPOINTS: {
    SEARCH_ALL: '/search',
    SEARCH_USERS: '/search/users',
    SEARCH_ORDERS: '/search/orders',
    SEARCH_TOPICS: '/search/topics',
    SUGGESTIONS: '/search/suggestions',
    HISTORY: '/search/history',
  },
};

// ══════════════════════════════════════════════════════════════
// 13. 性能配置常量
// ══════════════════════════════════════════════════════════════

export const PERFORMANCE = {
  // 虚拟列表配置
  VIRTUAL_LIST: {
    ITEM_HEIGHT: 80,           // 列表项高度
    BUFFER_SIZE: 10,           // 缓冲区大小
    THRESHOLD: 0.5,            // 触发阈值
  },
  
  // 图片加载配置
  IMAGE_LOADING: {
    CONCURRENT_LIMIT: 3,       // 并发加载限制
    CACHE_SIZE: 50,           // 缓存大小(MB)
    PRELOAD_COUNT: 5,         // 预加载数量
  },
  
  // 搜索优化配置
  SEARCH_OPTIMIZATION: {
    CACHE_SIZE: 100,          // 搜索缓存大小
    DEBOUNCE_DELAY: 300,      // 防抖延迟
    MIN_QUERY_LENGTH: 1,      // 最小查询长度
  },
};

// ══════════════════════════════════════════════════════════════
// 14. 测试ID常量
// ══════════════════════════════════════════════════════════════

export const TEST_IDS = {
  SEARCH_INPUT: 'search-input',
  SEARCH_BUTTON: 'search-button',
  CLEAR_BUTTON: 'clear-button',
  TAB_ALL: 'tab-all',
  TAB_USERS: 'tab-users',
  TAB_ORDERS: 'tab-orders',
  TAB_TOPICS: 'tab-topics',
  HISTORY_ITEM: 'history-item',
  SUGGESTION_ITEM: 'suggestion-item',
  CONTENT_CARD: 'content-card',
  USER_CARD: 'user-card',
  SERVICE_CARD: 'service-card',
  TOPIC_CARD: 'topic-card',
  LOAD_MORE: 'load-more',
  EMPTY_STATE: 'empty-state',
  ERROR_STATE: 'error-state',
};

// ══════════════════════════════════════════════════════════════
// 15. 默认值常量
// ══════════════════════════════════════════════════════════════

export const DEFAULTS = {
  SEARCH_KEYWORD: '',
  ACTIVE_TAB: TabType.ALL,
  PAGE_SIZE: PAGINATION.PAGE_SIZE,
  DEBOUNCE_DELAY: SEARCH_CONFIG.DEBOUNCE_DELAY,
  CACHE_DURATION: SEARCH_CONFIG.CACHE_DURATION,
  MAX_HISTORY: SEARCH_CONFIG.MAX_HISTORY,
};
