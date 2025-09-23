// #region 1. File Banner & TOC
/**
 * 私聊对话页面 - 类型定义
 * 
 * TOC (快速跳转):
 * [1] Imports
 * [2] Page Props
 * [3] Message Types
 * [4] User Types
 * [5] Chat State Types
 * [6] Input Types
 * [7] Media Types
 * [8] API Types
 * [9] Event Handler Types
 * [10] Component Props Types
 * [11] Animation Types
 */
// #endregion

// #region 2. Imports
import { User, ChatMessage, MessageStatus } from '../types';
import { MESSAGE_TYPES, MESSAGE_STATUS } from './constants';
// #endregion

// #region 3. Page Props
export interface PrivateChatPageProps {
  navigation: any;
  route: {
    params: {
      userId: string;
      userInfo: User;
      chatId?: string;
      autoFocus?: boolean;
    };
  };
}
// #endregion

// #region 4. Message Types
export type MessageType = typeof MESSAGE_TYPES[keyof typeof MESSAGE_TYPES];
export type MessageStatusType = typeof MESSAGE_STATUS[keyof typeof MESSAGE_STATUS];

export interface ExtendedChatMessage extends ChatMessage {
  type: MessageType;
  isFromMe: boolean;
  dynamicContent?: DynamicContent;
  imageContent?: ImageContent;
  systemContent?: SystemContent;
  replyTo?: string; // 回复的消息ID
  edited?: boolean;
  editedAt?: string;
}

export interface DynamicContent {
  id: string;
  photos: string[];
  title: string;
  likes: number;
  timestamp: string;
  description?: string;
  location?: string;
  tags?: string[];
}

export interface ImageContent {
  id: string;
  url: string;
  width: number;
  height: number;
  size: number;
  thumbnail?: string;
}

export interface SystemContent {
  type: 'join' | 'leave' | 'notification';
  message: string;
  data?: any;
}
// #endregion

// #region 5. User Types
export interface ChatUser extends User {
  isTyping?: boolean;
  lastSeen?: string;
  chatSettings?: {
    muted: boolean;
    blocked: boolean;
    starred: boolean;
  };
}

export interface UserPresence {
  isOnline: boolean;
  lastActiveTime: string;
  currentActivity?: 'typing' | 'viewing' | 'idle';
}
// #endregion

// #region 6. Chat State Types
export interface ChatState {
  messages: ExtendedChatMessage[];
  loading: boolean;
  sending: boolean;
  hasMore: boolean;
  page: number;
  error: string | null;
  typing: boolean;
  connected: boolean;
}

export interface InputState {
  text: string;
  height: number;
  focused: boolean;
  attachmentMode: boolean;
  voiceMode: boolean;
}

export interface KeyboardState {
  height: number;
  visible: boolean;
  animating: boolean;
}

export interface ScrollState {
  atBottom: boolean;
  showScrollToBottom: boolean;
  unreadCount: number;
  lastReadMessageId?: string;
}
// #endregion

// #region 7. Input Types
export interface MessageDraft {
  text: string;
  timestamp: string;
  replyTo?: string;
  attachments?: MediaAttachment[];
}

export interface MediaAttachment {
  id: string;
  type: 'image' | 'video' | 'file';
  uri: string;
  name?: string;
  size?: number;
  mimeType?: string;
  thumbnail?: string;
}

export interface VoiceMessage {
  id: string;
  uri: string;
  duration: number;
  waveform?: number[];
}
// #endregion

// #region 8. Media Types
export interface ImagePickerResult {
  uri: string;
  width: number;
  height: number;
  fileSize: number;
  type: string;
  fileName?: string;
}

export interface CameraResult {
  uri: string;
  width: number;
  height: number;
  fileSize: number;
  base64?: string;
}

export interface MediaUploadProgress {
  id: string;
  progress: number;
  status: 'uploading' | 'completed' | 'failed';
  error?: string;
}
// #endregion

// #region 9. API Types
export interface GetChatHistoryRequest {
  chatId: string;
  page: number;
  pageSize: number;
  beforeMessageId?: string;
}

export interface GetChatHistoryResponse {
  messages: ExtendedChatMessage[];
  hasMore: boolean;
  nextPage?: number;
  totalCount: number;
}

export interface SendMessageRequest {
  chatId: string;
  content: string;
  type: MessageType;
  replyToMessageId?: string;
  attachments?: MediaAttachment[];
  dynamicContent?: DynamicContent;
}

export interface SendMessageResponse {
  message: ExtendedChatMessage;
  tempId: string;
}

export interface MarkMessagesReadRequest {
  chatId: string;
  messageIds: string[];
}

export interface UploadMediaRequest {
  file: File | Blob;
  type: 'image' | 'video' | 'file';
  chatId: string;
}

export interface UploadMediaResponse {
  url: string;
  thumbnail?: string;
  metadata: {
    width?: number;
    height?: number;
    duration?: number;
    size: number;
  };
}
// #endregion

// #region 10. Event Handler Types
export interface ChatEventHandlers {
  onSendMessage: (text: string) => void;
  onSendDynamic: (dynamic: DynamicContent) => void;
  onSendImage: (image: ImagePickerResult) => void;
  onMessagePress: (message: ExtendedChatMessage) => void;
  onUserPress: (userId: string) => void;
  onRetryMessage: (messageId: string) => void;
  onDeleteMessage: (messageId: string) => void;
  onReplyMessage: (message: ExtendedChatMessage) => void;
  onEditMessage: (messageId: string, newText: string) => void;
  onScrollToBottom: () => void;
  onLoadMore: () => void;
}

export interface InputEventHandlers {
  onTextChange: (text: string) => void;
  onSend: () => void;
  onAttachment: () => void;
  onCamera: () => void;
  onVoice: () => void;
  onFocus: () => void;
  onBlur: () => void;
}

export interface MessageItemEventHandlers {
  onPress: (message: ExtendedChatMessage) => void;
  onLongPress: (message: ExtendedChatMessage) => void;
  onRetry: (messageId: string) => void;
  onDynamicPress: (dynamicId: string, photoIndex: number) => void;
  onImagePress: (imageUrl: string) => void;
  onUserPress: (userId: string) => void;
}
// #endregion

// #region 11. Component Props Types
export interface ChatHeaderProps {
  userInfo: ChatUser;
  online: boolean;
  typing: boolean;
  onBack: () => void;
  onUserPress: () => void;
  onCall?: () => void;
  onVideoCall?: () => void;
  onMore?: () => void;
}

export interface MessageListProps {
  messages: ExtendedChatMessage[];
  loading: boolean;
  hasMore: boolean;
  userInfo: ChatUser;
  pendingMessage?: ExtendedChatMessage | null;
  onLoadMore: () => void;
  onMessagePress: (message: ExtendedChatMessage) => void;
  onRetry: (messageId: string) => void;
  onDynamicPress: (dynamicId: string, photoIndex: number) => void;
  onMessageSent?: () => void;
}

export interface MessageInputProps {
  value: string;
  placeholder: string;
  maxLength?: number;
  multiline?: boolean;
  onChangeText: (text: string) => void;
  onSend: () => void;
  onImagePicker: () => void;
  onCameraPicker: () => void;
  disabled?: boolean;
}

export interface MessageBubbleProps {
  message: ExtendedChatMessage;
  isFromMe: boolean;
  showTimestamp?: boolean;
  showAvatar?: boolean;
  onPress?: (message: ExtendedChatMessage) => void;
  onLongPress?: (message: ExtendedChatMessage) => void;
  onRetry?: (messageId: string) => void;
  onDynamicPress?: (dynamicId: string, photoIndex: number) => void;
}

export interface TypingIndicatorProps {
  visible: boolean;
  users: ChatUser[];
}
// #endregion

// #region 12. Animation Types
export interface MessageAnimation {
  appear: {
    duration: number;
    delay: number;
  };
  send: {
    duration: number;
    scale: number;
  };
  bubble: {
    duration: number;
    damping: number;
  };
}

export interface InputAnimation {
  expand: {
    duration: number;
    easing: string;
  };
  send: {
    duration: number;
    scale: number;
  };
}

export interface KeyboardAnimation {
  duration: number;
  easing: string;
}
// #endregion

// #region 13. Error Types
export interface ChatError {
  code: string;
  message: string;
  messageId?: string;
  retryable: boolean;
}

export type ErrorHandler = (error: ChatError) => void;
// #endregion

// #region 14. Utility Types
export type ChatId = string;
export type UserId = string;
export type MessageId = string;
export type Timestamp = string;

export interface PaginationParams {
  page: number;
  pageSize: number;
  hasMore: boolean;
}

export interface ConnectionState {
  connected: boolean;
  reconnecting: boolean;
  lastConnected?: string;
  error?: string;
}

export interface ChatMetrics {
  messageCount: number;
  unreadCount: number;
  lastMessage?: ExtendedChatMessage;
  lastActivity: string;
}
// #endregion
