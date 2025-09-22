/**
 * GroupCenter 页面组常量配置
 * 
 * 定义页面组级别的通用常量
 */

// 页面组标识
export const GROUP_CENTER_PAGE_GROUP = 'GroupCenter';

// 页面类型常量
export const GROUP_CENTER_PAGES = {
  MAIN: 'MainPage',
  PUBLISH: 'PublishPage',
} as const;

// 导航路由常量
export const GROUP_CENTER_ROUTES = {
  MAIN: '/group-center',
  PUBLISH: '/group-center/publish',
} as const;

// 游戏类型常量
export const GAME_TYPES = {
  KING_OF_GLORY: '王者荣耀',
  PEACE_ELITE: '和平精英',
  LOL: '英雄联盟',
  VALORANT: 'Valorant',
  CSGO: 'CS:GO',
  DOTA2: 'Dota2',
  OVERWATCH: '守望先锋',
  APEX: 'Apex英雄',
  FORTNITE: '堡垒之夜',
  PUBG: 'PUBG',
  MINECRAFT: '我的世界',
  GENSHIN: '原神',
  OTHER: '其他',
} as const;

// 组局状态常量
export const GROUP_STATUS = {
  OPEN: 'open',
  FULL: 'full',
  CLOSED: 'closed',
  CANCELLED: 'cancelled',
  COMPLETED: 'completed',
} as const;

// 组局类型常量
export const GROUP_TYPES = {
  CASUAL: 'casual',
  COMPETITIVE: 'competitive',
  LEARNING: 'learning',
  ALL: 'all',
} as const;

// 参与者状态常量
export const PARTICIPANT_STATUS = {
  PENDING: 'pending',
  CONFIRMED: 'confirmed',
  CANCELLED: 'cancelled',
} as const;

// 支付状态常量
export const PAYMENT_STATUS = {
  UNPAID: 'unpaid',
  PAID: 'paid',
  REFUNDED: 'refunded',
} as const;

// 支付方式常量
export const PAYMENT_METHODS = {
  WECHAT: 'wechat',
  ALIPAY: 'alipay',
  CARD: 'card',
  BALANCE: 'balance',
} as const;

// 排序方式常量
export const SORT_OPTIONS = {
  TIME: 'time',
  DISTANCE: 'distance',
  POPULARITY: 'popularity',
  PRICE: 'price',
} as const;

// 时间范围常量
export const TIME_RANGES = {
  TODAY: 'today',
  TOMORROW: 'tomorrow',
  WEEK: 'week',
  ALL: 'all',
} as const;

// 默认配置
export const DEFAULT_GROUP_CONFIG = {
  PAGE_SIZE: 10,
  MAX_PARTICIPANTS: 20,
  MIN_PARTICIPANTS: 2,
  MAX_TITLE_LENGTH: 50,
  MAX_DESCRIPTION_LENGTH: 500,
  MAX_IMAGES: 6,
  DEFAULT_DURATION: 2, // 小时
  MIN_ADVANCE_TIME: 30, // 分钟
  MAX_ADVANCE_TIME: 7 * 24 * 60, // 7天，分钟
  DEFAULT_PRICE: 0,
  MAX_PRICE: 9999,
  AUTO_REFRESH_INTERVAL: 60000, // 60秒
};

// 默认筛选选项
export const DEFAULT_FILTER_OPTIONS: GroupFilterOptions = {
  gameType: [],
  location: '',
  ageRange: 'all',
  gender: 'all',
  groupType: 'all',
  timeRange: 'all',
  sortBy: 'time',
  priceRange: [0, 9999],
};

// 默认发布数据
export const DEFAULT_PUBLISH_DATA: GroupPublishData = {
  title: '',
  description: '',
  gameType: '',
  location: '',
  address: '',
  maxParticipants: 4,
  price: 0,
  currency: 'CNY',
  tags: [],
  requirements: [],
  images: [],
  isPrivate: false,
  autoConfirm: true,
};

// 年龄范围选项
export const AGE_RANGE_OPTIONS = [
  { label: '不限', value: 'all' },
  { label: '18-25岁', value: '18-25' },
  { label: '26-35岁', value: '26-35' },
  { label: '36-45岁', value: '36-45' },
  { label: '45岁以上', value: '45+' },
] as const;

// 性别选项
export const GENDER_OPTIONS = [
  { label: '不限', value: 'all' },
  { label: '男性', value: 'male' },
  { label: '女性', value: 'female' },
] as const;

// 从子页面导入的常量（重新导出）
export * from './MainPage/constants';
export * from './PublishPage/constants';
