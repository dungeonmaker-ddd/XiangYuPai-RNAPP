/**
 * 组局中心模块 - 常量配置
 * 基于架构设计文档的配置项
 */

import { Dimensions } from 'react-native';
import type { ActivityType, SortType, GenderFilter } from './types';

// ══════════════════════════════════════════════════════════════
// 1. 屏幕尺寸相关
// ══════════════════════════════════════════════════════════════

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

export const SCREEN_WIDTH = screenWidth;
export const SCREEN_HEIGHT = screenHeight;

// ══════════════════════════════════════════════════════════════
// 2. 颜色主题
// ══════════════════════════════════════════════════════════════

export const COLORS = {
  // 主色调
  PRIMARY: '#8B5CF6',        // 紫色主题
  PRIMARY_LIGHT: '#A78BFA',  // 浅紫色
  PRIMARY_DARK: '#7C3AED',   // 深紫色
  
  // 状态颜色
  SUCCESS: '#10B981',        // 绿色 - 成功
  ERROR: '#EF4444',          // 红色 - 错误
  WARNING: '#F59E0B',        // 橙色 - 警告
  INFO: '#3B82F6',          // 蓝色 - 信息
  
  // 文字颜色
  TEXT_PRIMARY: '#1F2937',   // 主要文字
  TEXT_SECONDARY: '#6B7280', // 次要文字
  TEXT_PLACEHOLDER: '#9CA3AF', // 占位符文字
  TEXT_WHITE: '#FFFFFF',     // 白色文字
  
  // 背景颜色
  BACKGROUND: '#F9FAFB',     // 页面背景
  CARD_BACKGROUND: '#FFFFFF', // 卡片背景
  OVERLAY: 'rgba(0, 0, 0, 0.5)', // 遮罩
  
  // 边框颜色
  BORDER_LIGHT: '#E5E7EB',   // 浅边框
  BORDER_MEDIUM: '#D1D5DB',  // 中等边框
  
  // 活动类型颜色
  ACTIVITY_COLORS: {
    explore: '#F59E0B',      // 探店 - 橙色
    movie: '#EF4444',        // 私影 - 红色
    billiards: '#3B82F6',    // 台球 - 蓝色
    ktv: '#EC4899',          // K歌 - 粉色
    drink: '#10B981',        // 喝酒 - 绿色
    massage: '#F97316',      // 按摩 - 橙红色
  },
} as const;

// ══════════════════════════════════════════════════════════════
// 3. 间距和尺寸
// ══════════════════════════════════════════════════════════════

export const SPACING = {
  XS: 4,
  SM: 8,
  MD: 12,
  LG: 16,
  XL: 20,
  XXL: 24,
  XXXL: 32,
} as const;

export const BORDER_RADIUS = {
  SM: 4,
  MD: 8,
  LG: 12,
  XL: 16,
  ROUND: 9999,
} as const;

export const FONT_SIZE = {
  XS: 12,
  SM: 14,
  MD: 16,
  LG: 18,
  XL: 20,
  XXL: 24,
  XXXL: 32,
} as const;

// ══════════════════════════════════════════════════════════════
// 4. 活动类型配置
// ══════════════════════════════════════════════════════════════

export const ACTIVITY_TYPES: Array<{
  key: ActivityType;
  label: string;
  icon: string;
  color: string;
  description: string;
}> = [
  {
    key: 'explore',
    label: '探店',
    icon: '🏪',
    color: COLORS.ACTIVITY_COLORS.explore,
    description: '发现新店铺，品味生活',
  },
  {
    key: 'movie',
    label: '私影',
    icon: '🎬',
    color: COLORS.ACTIVITY_COLORS.movie,
    description: '私人影院，独享时光',
  },
  {
    key: 'billiards',
    label: '台球',
    icon: '🎱',
    color: COLORS.ACTIVITY_COLORS.billiards,
    description: '台球竞技，技艺切磋',
  },
  {
    key: 'ktv',
    label: 'K歌',
    icon: '🎤',
    color: COLORS.ACTIVITY_COLORS.ktv,
    description: '尽情歌唱，释放心情',
  },
  {
    key: 'drink',
    label: '喝酒',
    icon: '🍺',
    color: COLORS.ACTIVITY_COLORS.drink,
    description: '小酌怡情，交流感情',
  },
  {
    key: 'massage',
    label: '按摩',
    icon: '💆',
    color: COLORS.ACTIVITY_COLORS.massage,
    description: '放松身心，舒缓疲劳',
  },
] as const;

// ══════════════════════════════════════════════════════════════
// 5. 筛选配置
// ══════════════════════════════════════════════════════════════

export const SORT_OPTIONS: Array<{
  key: SortType;
  label: string;
  description: string;
}> = [
  {
    key: 'smart',
    label: '智能排序',
    description: 'AI推荐，个性化排序',
  },
  {
    key: 'latest',
    label: '最新发布',
    description: '按发布时间排序',
  },
  {
    key: 'nearest',
    label: '距离最近',
    description: '按距离远近排序',
  },
  {
    key: 'cheapest',
    label: '价格最低',
    description: '按价格从低到高',
  },
] as const;

export const GENDER_OPTIONS: Array<{
  key: GenderFilter;
  label: string;
}> = [
  { key: 'all', label: '不限性别' },
  { key: 'female', label: '只看女生' },
  { key: 'male', label: '只看男生' },
] as const;

export const PRICE_RANGES = [
  { label: '100以下', min: 0, max: 100 },
  { label: '100-200', min: 100, max: 200 },
  { label: '200-500', min: 200, max: 500 },
  { label: '500以上', min: 500, max: 9999 },
] as const;

export const DISTANCE_RANGES = [
  { label: '1km内', max: 1 },
  { label: '3km内', max: 3 },
  { label: '5km内', max: 5 },
  { label: '不限距离', max: 9999 },
] as const;

export const TIME_RANGES = [
  { label: '今天', hours: 24 },
  { label: '明天', hours: 48 },
  { label: '本周内', hours: 24 * 7 },
  { label: '下周内', hours: 24 * 14 },
] as const;

// ══════════════════════════════════════════════════════════════
// 6. 分页和加载配置
// ══════════════════════════════════════════════════════════════

export const PAGINATION = {
  PAGE_SIZE: 10,
  INITIAL_PAGE: 1,
  MAX_PAGES: 100,
} as const;

export const LOADING = {
  DEBOUNCE_DELAY: 300,      // 防抖延迟
  REFRESH_TIMEOUT: 5000,    // 刷新超时
  RETRY_ATTEMPTS: 3,        // 重试次数
  RETRY_DELAY: 1000,        // 重试延迟
} as const;

// ══════════════════════════════════════════════════════════════
// 7. 表单验证配置
// ══════════════════════════════════════════════════════════════

export const FORM_LIMITS = {
  TITLE: {
    MIN_LENGTH: 2,
    MAX_LENGTH: 30,
  },
  DESCRIPTION: {
    MIN_LENGTH: 10,
    MAX_LENGTH: 200,
  },
  PARAMETERS: {
    MAX_LENGTH: 100,
  },
  MAX_PARTICIPANTS: {
    MIN: 2,
    MAX: 50,
  },
  PRICE: {
    MIN: 1,
    MAX: 9999,
  },
} as const;

// ══════════════════════════════════════════════════════════════
// 8. 支付配置
// ══════════════════════════════════════════════════════════════

export const PAYMENT = {
  CURRENCY: 'coins',
  SERVICE_FEE_RATE: 0.05,    // 5% 服务费
  MIN_BALANCE: 10,           // 最低余额
  REFUND_POLICY: {
    FULL_REFUND_HOURS: 24,   // 24小时内全额退款
    PARTIAL_REFUND_HOURS: 2, // 2小时内部分退款
    PARTIAL_REFUND_RATE: 0.5, // 部分退款比例
  },
} as const;

// ══════════════════════════════════════════════════════════════
// 9. 文案配置
// ══════════════════════════════════════════════════════════════

export const TEXTS = {
  // 页面标题
  TITLES: {
    GROUP_CENTER: '组局中心',
    PUBLISH_GROUP: '发布组局',
    GROUP_DETAIL: '详情',
    ADVANCED_FILTER: '筛选',
    PAYMENT_CONFIRM: '确认支付',
  },
  
  // 按钮文字
  BUTTONS: {
    PUBLISH: '发布',
    CANCEL: '取消',
    SAVE: '保存',
    BACK: '返回',
    CONFIRM: '确认',
    PAY_NOW: '立即支付',
    CONTACT: '私信',
    REGISTER: '报名',
    RETRY: '重试',
    RESET: '重置',
    COMPLETE: '完成',
  },
  
  // 状态文字
  STATUS: {
    LOADING: '加载中...',
    REFRESHING: '刷新中...',
    LOAD_MORE: '加载更多',
    NO_MORE: '没有更多了',
    EMPTY: '暂无数据',
    ERROR: '加载失败',
    WAITING: '等待对方选择中',
    APPROVED: '报名成功',
    REJECTED: '报名未成功',
  },
  
  // 提示文字
  HINTS: {
    TITLE_PLACEHOLDER: '添加标题...',
    DESCRIPTION_PLACEHOLDER: '添加正文...',
    PARAMETERS_PLACEHOLDER: '设置活动相关参数...',
    AGREEMENT_PLACEHOLDER: '时间/地点/定价/人数/报名截止时间',
    SEARCH_PLACEHOLDER: '搜索活动...',
  },
  
  // 规则文字
  RULES: {
    PUBLISH_FEE: '发布组局，平台会收取一定手续费',
    ORGANIZER_DEFAULT: '组局双方达，因活动的组织方默认',
    TIME_RECORD: '组局双方达，因活动的时间的配录',
    COMPLETION_PROOF: '组局完成后，劳动人缺少，将会进行一步的证据',
    PAYMENT_AGREEMENT: '我同意支付以下费用，该金额(含服务费)',
    WAITING_PROCESS: '透露信息与选择过程可能需要金满',
    REGISTRATION_PRIORITY: '报名更先锁的得金满',
  },
} as const;

// ══════════════════════════════════════════════════════════════
// 10. 动画配置
// ══════════════════════════════════════════════════════════════

export const ANIMATIONS = {
  DURATION: {
    SHORT: 200,
    MEDIUM: 300,
    LONG: 500,
  },
  EASING: {
    EASE_IN: 'ease-in',
    EASE_OUT: 'ease-out',
    EASE_IN_OUT: 'ease-in-out',
  },
} as const;

// ══════════════════════════════════════════════════════════════
// 11. Z-Index 层级
// ══════════════════════════════════════════════════════════════

export const Z_INDEX = {
  BACKGROUND: 0,
  CONTENT: 1,
  HEADER: 10,
  OVERLAY: 50,
  MODAL: 100,
  TOAST: 200,
} as const;

// ══════════════════════════════════════════════════════════════
// 12. 错误消息
// ══════════════════════════════════════════════════════════════

export const ERROR_MESSAGES = {
  NETWORK_ERROR: '网络连接失败，请检查网络设置',
  TIMEOUT_ERROR: '请求超时，请稍后重试',
  UNKNOWN_ERROR: '未知错误，请稍后重试',
  PERMISSION_DENIED: '权限不足，请联系管理员',
  INSUFFICIENT_BALANCE: '余额不足，请先充值',
  REGISTRATION_FAILED: '报名失败，请稍后重试',
  PAYMENT_FAILED: '支付失败，请稍后重试',
  FORM_VALIDATION_ERROR: '请检查表单信息',
  LOCATION_ERROR: '无法获取位置信息',
} as const;
