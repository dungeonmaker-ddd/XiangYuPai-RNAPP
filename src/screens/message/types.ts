// #region 1. File Banner & TOC
/**
 * 消息系统模块 - 类型定义
 * 基于消息系统模块架构设计文档
 * 
 * TOC (快速跳转):
 * [1] Enums
 * [2] Base Types
 * [3] Message Types
 * [4] Component Props Types
 * [5] State Types
 * [6] API Types
 * [7] Utility Types
 */
// #endregion

// #region 2. Enums
export enum MessageType {
  LIKE_COLLECT = 'like_collect',
  COMMENT = 'comment', 
  FOLLOWER = 'follower',
  SYSTEM_NOTIFICATION = 'system_notification',
  PRIVATE_CHAT = 'private_chat'
}

export enum MessageStatus {
  UNREAD = 'unread',
  READ = 'read',
  SENDING = 'sending',
  SENT = 'sent',
  FAILED = 'failed'
}

export enum OnlineStatus {
  ONLINE = 'online',
  OFFLINE = 'offline',
  AWAY = 'away'
}
// #endregion

// #region 3. Base Types
export interface User {
  id: string;
  nickname: string;
  avatar: string;
  isOnline: boolean;
  lastActiveTime: string;
  signature?: string;
}

export interface BaseMessage {
  id: string;
  timestamp: string;
  isRead: boolean;
}
// #endregion

// #region 4. Message Types
export interface MessageCategory {
  id: string;
  type: MessageType;
  title: string;
  icon: string;
  iconColor: string;
  unreadCount: number;
  route: string;
}

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

export interface LikeCollectMessage extends BaseMessage {
  user: User;
  actionType: 'like' | 'collect';
  targetContent: {
    id: string;
    type: 'post' | 'comment';
    title: string;
    thumbnail: string;
  };
}

export interface CommentMessage extends BaseMessage {
  user: User;
  content: string;
  targetContent: {
    id: string;
    title: string;
    thumbnail: string;
  };
}

export interface FollowerMessage extends BaseMessage {
  user: User;
  actionType: 'follow' | 'unfollow';
  followStatus: 'following' | 'not_following' | 'mutual';
}

export interface SystemNotification extends BaseMessage {
  title: string;
  content: string;
  priority: 'high' | 'medium' | 'low';
  type: 'profile' | 'system' | 'activity';
  actions?: {
    primary?: { text: string; action: string; };
    secondary?: { text: string; action: string; };
  };
}

export interface ChatMessage extends BaseMessage {
  senderId: string;
  receiverId: string;
  content: string;
  type: 'text' | 'image' | 'voice';
  status: MessageStatus;
  isFromMe: boolean;
}
// #endregion

// #region 5. Component Props Types
export interface MessageHeaderAreaProps {
  onClearPress?: () => void;
  showClearButton?: boolean;
}

export interface MessageCategoryAreaProps {
  categories: MessageCategory[];
  onCategoryPress: (category: MessageCategory) => void;
}

export interface RecentChatListAreaProps {
  chats?: RecentChat[];
  onChatPress: (chat: RecentChat) => void;
  onClearAll?: () => void;
}
// #endregion

// #region 6. State Types
export interface MessageState {
  categories: MessageCategory[];
  recentChats: RecentChat[];
  loading: boolean;
  error: string | null;
}

export interface ChatConversation {
  id: string;
  user: User;
  messages: ChatMessage[];
  lastMessage?: ChatMessage;
  unreadCount: number;
}
// #endregion

// #region 7. API Types
export interface LoadMessageDataResponse {
  categories: MessageCategory[];
  recentChats: RecentChat[];
}

export interface MessageApiError {
  code: string;
  message: string;
  details?: any;
}
// #endregion

// #region 8. Utility Types
export type NavigationProp = {
  navigate: (screen: string, params?: any) => void;
  goBack: () => void;
};

export type MessageActionType = 
  | 'LOAD_DATA'
  | 'REFRESH_DATA'
  | 'CLEAR_CHATS'
  | 'UPDATE_CATEGORY_COUNT'
  | 'SET_ERROR';

export interface MessageAction {
  type: MessageActionType;
  payload?: any;
}
// #endregion