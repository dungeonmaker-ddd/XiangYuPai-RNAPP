/**
 * Message 页面组常量配置
 * 
 * 定义页面组级别的通用常量
 */

// 页面组标识
export const MESSAGE_PAGE_GROUP = 'Message';

// 页面类型常量
export const MESSAGE_PAGES = {
  MAIN: 'MainPage',
  LIKE_COLLECT: 'LikeCollectPage',
  PRIVATE_CHAT: 'PrivateChatPage',
} as const;

// 导航路由常量
export const MESSAGE_ROUTES = {
  MAIN: '/message',
  LIKE_COLLECT: '/message/like-collect',
  PRIVATE_CHAT: '/message/private-chat',
} as const;

// 消息类型常量
export const MESSAGE_TYPES = {
  LIKE: 'like',
  COMMENT: 'comment',
  FOLLOW: 'follow',
  SYSTEM: 'system',
  CHAT: 'chat',
} as const;

// 消息状态常量
export const MESSAGE_STATUS = {
  SENDING: 'sending',
  SENT: 'sent',
  DELIVERED: 'delivered',
  FAILED: 'failed',
} as const;

// 默认配置
export const DEFAULT_MESSAGE_CONFIG = {
  PAGE_SIZE: 20,
  MAX_MESSAGE_LENGTH: 500,
  AUTO_REFRESH_INTERVAL: 30000, // 30秒
  CONNECTION_TIMEOUT: 10000, // 10秒
};

// 从子页面导入的常量（重新导出）
export * from './MainPage/constants';
export * from './LikeCollectPage/constants';
export * from './PrivateChatPage/constants';
