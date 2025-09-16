/**
 * 消息系统模块 - 全局类型定义
 * 基于消息系统模块架构设计文档
 */

// 消息类型枚举
export enum MessageType {
  LIKE_COLLECT = 'like_collect',
  COMMENT = 'comment', 
  FOLLOWER = 'follower',
  SYSTEM_NOTIFICATION = 'system_notification',
  PRIVATE_CHAT = 'private_chat'
}

// 消息状态枚举
export enum MessageStatus {
  UNREAD = 'unread',
  READ = 'read',
  SENDING = 'sending',
  SENT = 'sent',
  FAILED = 'failed'
}

// 用户在线状态
export enum OnlineStatus {
  ONLINE = 'online',
  OFFLINE = 'offline',
  AWAY = 'away'
}

// 基础用户信息
export interface User {
  id: string;
  nickname: string;
  avatar: string;
  isOnline: boolean;
  lastActiveTime: string;
  signature?: string;
}

// 消息分类卡片
export interface MessageCategory {
  id: string;
  type: MessageType;
  title: string;
  icon: string;
  iconColor: string;
  unreadCount: number;
  route: string;
}

// 最近对话项
export interface RecentChat {
  id: string;
  user: User;
  lastMessage: {
    content: string;
    type: 'text' | 'image' | 'voice';
    timestamp: string;
  };
  unreadCount: number;
  isTop: boolean;
  isMuted: boolean;
}

// 点赞收藏消息
export interface LikeCollectMessage {
  id: string;
  user: User;
  actionType: 'like' | 'collect';
  targetContent: {
    id: string;
    type: 'post' | 'comment';
    title: string;
    thumbnail: string;
  };
  timestamp: string;
  isRead: boolean;
}

// 评论消息
export interface CommentMessage {
  id: string;
  user: User;
  content: string;
  targetContent: {
    id: string;
    title: string;
    thumbnail: string;
  };
  timestamp: string;
  isRead: boolean;
}

// 粉丝消息
export interface FollowerMessage {
  id: string;
  user: User;
  actionType: 'follow' | 'unfollow';
  timestamp: string;
  isRead: boolean;
  followStatus: 'following' | 'not_following' | 'mutual';
}

// 系统通知
export interface SystemNotification {
  id: string;
  title: string;
  content: string;
  priority: 'high' | 'medium' | 'low';
  type: 'profile' | 'system' | 'activity';
  timestamp: string;
  isRead: boolean;
  actions?: {
    primary?: { text: string; action: string; };
    secondary?: { text: string; action: string; };
  };
}

// 聊天消息
export interface ChatMessage {
  id: string;
  senderId: string;
  receiverId: string;
  content: string;
  type: 'text' | 'image' | 'voice';
  timestamp: string;
  status: MessageStatus;
  isFromMe: boolean;
}

// 聊天对话
export interface ChatConversation {
  id: string;
  user: User;
  messages: ChatMessage[];
  lastMessage?: ChatMessage;
  unreadCount: number;
}
