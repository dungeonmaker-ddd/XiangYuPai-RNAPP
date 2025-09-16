/**
 * 地区选择模块 - 常量配置
 */

import { Dimensions } from 'react-native';

// 屏幕尺寸
const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

// 颜色配置
export const COLORS = {
  // 主色调
  primary: '#8B5CF6',
  primaryLight: '#A78BFA',
  primaryDark: '#7C3AED',
  
  // 背景色
  background: '#FFFFFF',
  backgroundGray: '#F8FAFC',
  backgroundDark: '#1F2937',
  
  // 文字颜色
  textPrimary: '#1F2937',
  textSecondary: '#6B7280',
  textLight: '#9CA3AF',
  textWhite: '#FFFFFF',
  
  // 边框颜色
  border: '#E5E7EB',
  borderLight: '#F3F4F6',
  borderDark: '#D1D5DB',
  
  // 状态颜色
  success: '#10B981',
  warning: '#F59E0B',
  error: '#EF4444',
  info: '#3B82F6',
  
  // 透明色
  overlay: 'rgba(0, 0, 0, 0.5)',
  cardOverlay: 'rgba(255, 255, 255, 0.95)',
  
  // 选中状态
  selected: '#EEF2FF',
  selectedBorder: '#8B5CF6',
} as const;

// 间距配置
export const SPACING = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  xxxl: 32,
} as const;

// 尺寸配置
export const SIZES = {
  // 屏幕尺寸
  screenWidth: SCREEN_WIDTH,
  screenHeight: SCREEN_HEIGHT,
  
  // 头部高度
  headerHeight: 56,
  statusBarHeight: 44, // iOS默认值，Android会动态获取
  
  // 卡片尺寸
  cardHeight: 48,
  hotCityCardHeight: 40,
  hotCityCardWidth: (SCREEN_WIDTH - 48) / 4, // 4列布局，考虑边距
  
  // 字母导航
  alphabetWidth: 24,
  alphabetItemHeight: 20,
  
  // 图标尺寸
  iconSmall: 16,
  iconMedium: 20,
  iconLarge: 24,
  
  // 圆角
  radiusSmall: 4,
  radiusMedium: 8,
  radiusLarge: 12,
  radiusXLarge: 16,
} as const;

// 字体配置
export const FONTS = {
  // 字体族
  family: {
    regular: 'PingFang SC',
    medium: 'PingFang SC Medium',
    semibold: 'PingFang SC Semibold',
  },
  
  // 字体大小
  size: {
    xs: 10,
    sm: 12,
    md: 14,
    lg: 16,
    xl: 18,
    xxl: 20,
    xxxl: 24,
  },
  
  // 行高
  lineHeight: {
    tight: 1.2,
    normal: 1.4,
    relaxed: 1.6,
  },
} as const;

// 热门城市配置
export const HOT_CITIES = [
  { code: '440300', name: '深圳', pinyin: 'shenzhen', firstLetter: 'S' },
  { code: '330100', name: '杭州', pinyin: 'hangzhou', firstLetter: 'H' },
  { code: '110100', name: '北京', pinyin: 'beijing', firstLetter: 'B' },
  { code: '310100', name: '上海', pinyin: 'shanghai', firstLetter: 'S' },
  { code: '440100', name: '广州', pinyin: 'guangzhou', firstLetter: 'G' },
  { code: '320100', name: '南京', pinyin: 'nanjing', firstLetter: 'N' },
  { code: '420100', name: '武汉', pinyin: 'wuhan', firstLetter: 'W' },
  { code: '510100', name: '成都', pinyin: 'chengdu', firstLetter: 'C' },
] as const;

// 字母表
export const ALPHABET = [
  'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J',
  'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T',
  'U', 'V', 'W', 'X', 'Y', 'Z'
] as const;

// 动画配置
export const ANIMATION = {
  // 动画时长
  duration: {
    fast: 150,
    normal: 300,
    slow: 500,
  },
  
  // 缓动函数
  easing: {
    ease: [0.25, 0.1, 0.25, 1],
    easeIn: [0.42, 0, 1, 1],
    easeOut: [0, 0, 0.58, 1],
    easeInOut: [0.42, 0, 0.58, 1],
  },
} as const;

// API配置
export const API_CONFIG = {
  // 请求超时
  timeout: 10000,
  
  // 重试配置
  retryCount: 3,
  retryDelay: 1000,
  
  // 定位配置
  location: {
    timeout: 15000,
    maximumAge: 300000, // 5分钟缓存
    enableHighAccuracy: true,
  },
} as const;

// 存储键名
export const STORAGE_KEYS = {
  recentLocations: '@location_recent',
  defaultLocation: '@location_default',
  locationPermission: '@location_permission',
} as const;

// 错误消息
export const ERROR_MESSAGES = {
  // 网络错误
  networkError: '网络连接失败，请检查网络设置',
  timeout: '请求超时，请重试',
  
  // 定位错误
  locationDenied: '定位权限被拒绝，请在设置中开启定位权限',
  locationUnavailable: '定位服务不可用',
  locationTimeout: '定位超时，请重试',
  locationUnknown: '定位失败，未知错误',
  
  // 数据错误
  dataLoadFailed: '数据加载失败，请重试',
  searchFailed: '搜索失败，请重试',
  
  // 通用错误
  unknown: '未知错误，请重试',
} as const;

// 成功消息
export const SUCCESS_MESSAGES = {
  locationSelected: '位置选择成功',
  locationUpdated: '位置更新成功',
} as const;

// 占位文本
export const PLACEHOLDER_TEXTS = {
  search: '搜索城市或地区',
  currentLocation: '获取当前位置...',
  noRecentLocations: '暂无最近访问',
  noSearchResults: '未找到匹配的地区',
} as const;

// Z-Index层级
export const Z_INDEX = {
  modal: 1000,
  overlay: 999,
  popup: 998,
  dropdown: 997,
  header: 100,
  alphabetIndex: 50,
} as const;
