/**
 * 🎯 组局发布功能 - 常量配置
 * 
 * 基于架构设计文档的完整常量系统
 */

import { Dimensions } from 'react-native';
import { ActivityType, ActivityTypeConfig, PaymentMethod } from './types';

// ══════════════════════════════════════════════════════════════
// 1. 屏幕尺寸和布局常量
// ══════════════════════════════════════════════════════════════

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

export const SCREEN = {
  WIDTH: screenWidth,
  HEIGHT: screenHeight,
} as const;

export const SPACING = {
  XS: 4,
  SM: 8,
  MD: 16,
  LG: 24,
  XL: 32,
  XXL: 48,
} as const;

export const BORDER_RADIUS = {
  SM: 4,
  MD: 8,
  LG: 12,
  XL: 16,
  XXL: 24,
  FULL: 999,
} as const;

// ══════════════════════════════════════════════════════════════
// 2. 颜色系统
// ══════════════════════════════════════════════════════════════

export const COLORS = {
  // 主色调
  PRIMARY: '#8B5CF6',      // 紫色主题
  PRIMARY_LIGHT: '#A78BFA',
  PRIMARY_DARK: '#7C3AED',
  
  // 功能色
  SUCCESS: '#10B981',
  WARNING: '#F59E0B', 
  ERROR: '#EF4444',
  INFO: '#3B82F6',
  
  // 中性色
  WHITE: '#FFFFFF',
  BLACK: '#000000',
  GRAY_50: '#F9FAFB',
  GRAY_100: '#F3F4F6',
  GRAY_200: '#E5E7EB',
  GRAY_300: '#D1D5DB',
  GRAY_400: '#9CA3AF',
  GRAY_500: '#6B7280',
  GRAY_600: '#4B5563',
  GRAY_700: '#374151',
  GRAY_800: '#1F2937',
  GRAY_900: '#111827',
  
  // 背景色
  BACKGROUND: '#FFFFFF',
  SURFACE: '#F9FAFB',
  OVERLAY: 'rgba(0, 0, 0, 0.5)',
  
  // 边框色
  BORDER: '#E5E7EB',
  BORDER_FOCUS: '#8B5CF6',
  
  // 文字色
  TEXT_PRIMARY: '#111827',
  TEXT_SECONDARY: '#6B7280',
  TEXT_PLACEHOLDER: '#9CA3AF',
  
  // 活动类型专用色
  ACTIVITY: {
    EXPLORE: '#F59E0B',      // 探店 - 黄色
    CINEMA: '#8B5CF6',       // 私影 - 紫色  
    BILLIARDS: '#3B82F6',    // 台球 - 蓝色
    KARAOKE: '#EC4899',      // K歌 - 粉色
    DRINKING: '#10B981',     // 喝酒 - 绿色
    MASSAGE: '#F97316',      // 按摩 - 橙色
  },
} as const;

// ══════════════════════════════════════════════════════════════
// 3. 字体系统
// ══════════════════════════════════════════════════════════════

export const FONT_SIZE = {
  XS: 12,
  SM: 14,
  MD: 16,
  LG: 18,
  XL: 20,
  XXL: 24,
  XXXL: 32,
} as const;

export const FONT_WEIGHT = {
  NORMAL: '400',
  MEDIUM: '500',
  SEMIBOLD: '600',
  BOLD: '700',
} as const;

export const LINE_HEIGHT = {
  XS: 16,
  SM: 20,
  MD: 24,
  LG: 28,
  XL: 32,
  XXL: 36,
  XXXL: 48,
} as const;

// ══════════════════════════════════════════════════════════════
// 4. 活动类型配置
// ══════════════════════════════════════════════════════════════

export const ACTIVITY_TYPES: ActivityTypeConfig[] = [
  {
    id: ActivityType.EXPLORE,
    name: '探店',
    icon: 'store',
    color: COLORS.WHITE,
    bgColor: COLORS.ACTIVITY.EXPLORE,
    emoji: '🏪',
  },
  {
    id: ActivityType.PRIVATE_CINEMA,
    name: '私影',
    icon: 'movie',
    color: COLORS.WHITE,
    bgColor: COLORS.ACTIVITY.CINEMA,
    emoji: '🎬',
  },
  {
    id: ActivityType.BILLIARDS,
    name: '台球',
    icon: 'billiards',
    color: COLORS.WHITE,
    bgColor: COLORS.ACTIVITY.BILLIARDS,
    emoji: '🎱',
  },
  {
    id: ActivityType.KARAOKE,
    name: 'K歌',
    icon: 'microphone',
    color: COLORS.WHITE,
    bgColor: COLORS.ACTIVITY.KARAOKE,
    emoji: '🎤',
  },
  {
    id: ActivityType.DRINKING,
    name: '喝酒',
    icon: 'wine',
    color: COLORS.WHITE,
    bgColor: COLORS.ACTIVITY.DRINKING,
    emoji: '🍺',
  },
  {
    id: ActivityType.MASSAGE,
    name: '按摩',
    icon: 'spa',
    color: COLORS.WHITE,
    bgColor: COLORS.ACTIVITY.MASSAGE,
    emoji: '💆',
  },
];

// ══════════════════════════════════════════════════════════════
// 5. 表单配置
// ══════════════════════════════════════════════════════════════

export const FORM_CONFIG = {
  TITLE: {
    MAX_LENGTH: 30,
    MIN_LENGTH: 2,
    PLACEHOLDER: '添加标题...',
  },
  CONTENT: {
    MAX_LENGTH: 200,
    MIN_LENGTH: 10,
    PLACEHOLDER: '添加正文...',
    MIN_HEIGHT: 80,
    MAX_HEIGHT: 200,
  },
  PARAMETERS: {
    PLACEHOLDER: '设置活动相关参数...',
  },
} as const;

// ══════════════════════════════════════════════════════════════
// 6. 约定项配置
// ══════════════════════════════════════════════════════════════

export const AGREEMENT_CONFIG = {
  TIME: {
    MIN_ADVANCE_HOURS: 2, // 最少提前2小时
    MAX_ADVANCE_DAYS: 30, // 最多提前30天
  },
  LOCATION: {
    SEARCH_PLACEHOLDER: '搜索地址...',
    MAX_ADDRESS_LENGTH: 100,
  },
  PRICING: {
    MIN_AMOUNT: 1,
    MAX_AMOUNT: 9999,
    DEFAULT_CURRENCY: 'coin' as const,
    EXCHANGE_RATE: 0.1, // 金币对人民币汇率 1金币=0.1元
  },
  PARTICIPANTS: {
    MIN_COUNT: 2,
    MAX_COUNT: 20,
    DEFAULT_MAX: 6,
  },
  DEADLINE: {
    MIN_ADVANCE_MINUTES: 30, // 最少提前30分钟
    QUICK_OPTIONS: [
      { key: '1hour', label: '提前1小时', minutes: 60 },
      { key: '6hours', label: '提前6小时', minutes: 360 },
      { key: '1day', label: '提前1天', minutes: 1440 },
    ],
  },
} as const;

// ══════════════════════════════════════════════════════════════
// 7. 支付配置
// ══════════════════════════════════════════════════════════════

export const PAYMENT_CONFIG = {
  METHODS: [
    {
      id: PaymentMethod.COIN,
      name: '金币支付',
      icon: 'coin',
      color: COLORS.ACTIVITY.EXPLORE,
      enabled: true,
    },
    {
      id: PaymentMethod.WECHAT,
      name: '微信支付',
      icon: 'wechat',
      color: '#07C160',
      enabled: false, // 暂未开放
    },
    {
      id: PaymentMethod.ALIPAY,
      name: '支付宝',
      icon: 'alipay',
      color: '#1677FF',
      enabled: false, // 暂未开放
    },
  ],
  
  FEE: {
    BASE_PUBLISH_FEE: 200, // 基础发布费用（金币）
    SERVICE_FEE_RATE: 0.05, // 服务费率 5%
    MIN_SERVICE_FEE: 10, // 最低服务费
    MAX_SERVICE_FEE: 100, // 最高服务费
  },
  
  BALANCE: {
    MIN_BALANCE_WARNING: 50, // 余额不足警告阈值
    RECHARGE_AMOUNTS: [100, 500, 1000, 2000, 5000], // 充值金额选项
  },
} as const;

// ══════════════════════════════════════════════════════════════
// 8. 验证规则
// ══════════════════════════════════════════════════════════════

export const VALIDATION = {
  TITLE: {
    REQUIRED: '请输入活动标题',
    MIN_LENGTH: '标题至少需要2个字符',
    MAX_LENGTH: '标题不能超过30个字符',
    INVALID_CHARS: '标题包含非法字符',
  },
  CONTENT: {
    REQUIRED: '请输入活动正文',
    MIN_LENGTH: '正文至少需要10个字符',
    MAX_LENGTH: '正文不能超过200个字符',
    INVALID_CHARS: '正文包含非法字符',
  },
  ACTIVITY_TYPE: {
    REQUIRED: '请选择活动类型',
  },
  TIME: {
    REQUIRED: '请设置活动时间',
    INVALID_DATE: '请选择有效的日期',
    PAST_DATE: '不能选择过去的时间',
    TOO_EARLY: '活动时间至少要提前2小时',
    TOO_LATE: '活动时间不能超过30天',
  },
  LOCATION: {
    REQUIRED: '请设置活动地点',
    INVALID_ADDRESS: '请输入有效的地址',
  },
  PRICING: {
    REQUIRED: '请设置活动价格',
    INVALID_AMOUNT: '请输入有效的价格',
    MIN_AMOUNT: '价格不能少于1',
    MAX_AMOUNT: '价格不能超过9999',
  },
  PARTICIPANTS: {
    REQUIRED: '请设置参与人数',
    INVALID_COUNT: '请输入有效的人数',
    MIN_COUNT: '人数至少为2人',
    MAX_COUNT: '人数不能超过20人',
  },
  DEADLINE: {
    REQUIRED: '请设置报名截止时间',
    INVALID_TIME: '请选择有效的截止时间',
    TOO_LATE: '截止时间必须早于活动开始时间',
    TOO_EARLY: '截止时间至少要提前30分钟',
  },
} as const;

// ══════════════════════════════════════════════════════════════
// 9. UI文案
// ══════════════════════════════════════════════════════════════

export const TEXTS = {
  // 导航栏
  NAVIGATION: {
    TITLE: '发布组局',
    CANCEL: '取消',
    SAVE: '保存',
  },
  
  // 活动类型
  ACTIVITY_TYPE: {
    TITLE: '类型',
    SUBTITLE: '选择活动类型',
    REQUIRED_HINT: '* 必选',
  },
  
  // 表单
  FORM: {
    TITLE_LABEL: '标题',
    TITLE_REQUIRED: '* 必填',
    CONTENT_LABEL: '正文', 
    CONTENT_REQUIRED: '* 必填',
    PARAMETERS_LABEL: '系数项',
    PARAMETERS_HINT: '可选配置',
  },
  
  // 约定项
  AGREEMENT: {
    TITLE: '约定项',
    REQUIRED: '* 必填',
    TIME_LABEL: '时间',
    TIME_PLACEHOLDER: '选择活动时间',
    LOCATION_LABEL: '地点',
    LOCATION_PLACEHOLDER: '选择活动地点',
    PRICING_LABEL: '定价',
    PRICING_PLACEHOLDER: '设置活动价格',
    PARTICIPANTS_LABEL: '人数',
    PARTICIPANTS_PLACEHOLDER: '设置参与人数',
    DEADLINE_LABEL: '报名截止',
    DEADLINE_PLACEHOLDER: '设置截止时间',
    SELECT_BUTTON: '选择',
  },
  
  // 发布规则
  PUBLISH_RULES: {
    TITLE: '发布规则',
    FEE_NOTICE: '发布组局，平台会收取一定手续费',
    RESPONSIBILITY: '组局双方达成，因活动的组织方默认承担相应责任',
    TIME_POLICY: '组局双方达成，因活动的时间配录需要严格遵守',
    COMPLETION: '组局完成后，如有争议，将会进行进一步的证据审核',
    TERMS_LINK: '服务条款',
    PRIVACY_LINK: '隐私政策',
    CONTACT: '客服咨询',
  },
  
  // 发布按钮
  PUBLISH_BUTTON: {
    NORMAL: '发布',
    LOADING: '发布中...',
    DISABLED: '请完善信息',
  },
  
  // 支付弹窗
  PAYMENT: {
    TITLE: '确认支付',
    AMOUNT_LABEL: '支付金额',
    BALANCE_LABEL: '余额',
    METHOD_LABEL: '支付方式',
    FEE_BREAKDOWN: '费用明细',
    BASE_FEE: '基础费用',
    SERVICE_FEE: '平台服务费',
    DISCOUNT: '优惠减免',
    TOTAL: '总计',
    AGREEMENT_TEXT: '我同意支付以下费用，该金额含服务费',
    PAY_BUTTON: '立即支付',
    CANCEL_BUTTON: '取消支付',
    INSUFFICIENT_BALANCE: '余额不足',
    RECHARGE_BUTTON: '立即充值',
    PROCESSING: '支付处理中...',
    SUCCESS: '支付成功',
    FAILED: '支付失败',
    SECURITY_TIP: '支付安全提示',
  },
  
  // 状态提示
  STATUS: {
    DRAFT_SAVING: '草稿保存中...',
    DRAFT_SAVED: '草稿已保存',
    DRAFT_LOADED: '已恢复草稿',
    PUBLISHING: '发布中...',
    PUBLISH_SUCCESS: '发布成功',
    PUBLISH_FAILED: '发布失败',
    NETWORK_ERROR: '网络错误，请重试',
    VALIDATION_FAILED: '请检查并完善信息',
  },
} as const;

// ══════════════════════════════════════════════════════════════
// 10. 动画配置
// ══════════════════════════════════════════════════════════════

export const ANIMATION = {
  DURATION: {
    FAST: 200,
    NORMAL: 300,
    SLOW: 500,
  },
  
  EASING: {
    EASE_IN: 'ease-in',
    EASE_OUT: 'ease-out',
    EASE_IN_OUT: 'ease-in-out',
  },
  
  MODAL: {
    SLIDE_UP: 'slideInUp',
    SLIDE_DOWN: 'slideOutDown',
    FADE_IN: 'fadeIn',
    FADE_OUT: 'fadeOut',
  },
} as const;

// ══════════════════════════════════════════════════════════════
// 11. Z-Index层级
// ══════════════════════════════════════════════════════════════

export const Z_INDEX = {
  BACKGROUND: 0,
  CONTENT: 1,
  HEADER: 10,
  OVERLAY: 100,
  MODAL: 1000,
  TOAST: 9999,
} as const;

// ══════════════════════════════════════════════════════════════
// 12. API配置
// ══════════════════════════════════════════════════════════════

export const API = {
  ENDPOINTS: {
    PUBLISH_GROUP: '/api/groups/publish',
    UPLOAD_IMAGE: '/api/upload/image',
    SAVE_DRAFT: '/api/groups/draft',
    LOAD_DRAFT: '/api/groups/draft',
    DELETE_DRAFT: '/api/groups/draft',
    PAYMENT_CREATE: '/api/payment/create',
    PAYMENT_CONFIRM: '/api/payment/confirm',
    USER_BALANCE: '/api/user/balance',
  },
  
  TIMEOUT: 30000, // 30秒超时
  
  RETRY: {
    MAX_ATTEMPTS: 3,
    DELAY: 1000, // 1秒延迟
  },
} as const;

// ══════════════════════════════════════════════════════════════
// 13. 本地存储键名
// ══════════════════════════════════════════════════════════════

export const STORAGE_KEYS = {
  DRAFT_DATA: 'publish_draft_data',
  USER_PREFERENCES: 'publish_user_preferences',
  FORM_CACHE: 'publish_form_cache',
} as const;
