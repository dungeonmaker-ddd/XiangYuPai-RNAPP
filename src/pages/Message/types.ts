/**
 * Message 页面组 - 类型定义
 */

// 用户信息类型
export interface User {
  id: string;
  nickname: string;
  avatar: string;
  isOnline: boolean;
  lastActiveTime: string;
  signature?: string;
}

// 消息类型
export interface ChatMessage {
  id: string;
  senderId: string;
  receiverId: string;
  content: string;
  timestamp: string;
  status: MessageStatus;
  isRead: boolean;
}

// 消息状态枚举
export enum MessageStatus {
  SENDING = 'sending',
  SENT = 'sent',
  READ = 'read',
  FAILED = 'failed'
}

// 点赞收藏消息类型
export interface LikeCollectMessage {
  id: string;
  user: User;
  actionType: 'like' | 'collect';
  targetContent: {
    id: string;
    type: 'post' | 'comment';
    title: string;
    thumbnail?: string;
  };
  timestamp: string;
  isRead: boolean;
}

// 页面组导航参数
export interface MessageNavigationParams {
  tab?: 'main' | 'like-collect' | 'private-chat';
  userId?: string;
  messageType?: 'like' | 'collect';
}