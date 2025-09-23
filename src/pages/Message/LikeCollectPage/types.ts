// #region 1. File Banner & TOC
/**
 * 赞和收藏页面 - 类型定义
 * 
 * TOC (快速跳转):
 * [1] Imports
 * [2] Page Props
 * [3] Action Types
 * [4] Content Types
 * [5] UI State Types
 * [6] API Types
 * [7] Event Handler Types
 */
// #endregion

// #region 2. Imports
import { User, LikeCollectMessage } from '../types';
import { ACTION_TYPES, TARGET_CONTENT_TYPES } from './constants';
// #endregion

// #region 3. Page Props
export interface LikeCollectPageProps {
  navigation: any;
  route?: {
    params?: {
      filterType?: ActionType;
      autoRefresh?: boolean;
    };
  };
}
// #endregion

// #region 4. Action Types
export type ActionType = typeof ACTION_TYPES[keyof typeof ACTION_TYPES];

export interface ActionInfo {
  icon: string;
  text: string;
  color: string;
}

export type ActionConfigMap = {
  [K in ActionType]: ActionInfo;
};
// #endregion

// #region 5. Content Types
export type ContentType = typeof TARGET_CONTENT_TYPES[keyof typeof TARGET_CONTENT_TYPES];

export interface ContentInfo {
  icon: string;
  label: string;
}

export type ContentConfigMap = {
  [K in ContentType]: ContentInfo;
};

export interface TargetContent {
  id: string;
  type: ContentType;
  title: string;
  thumbnail?: string;
  description?: string;
  authorId?: string;
}
// #endregion

// #region 6. UI State Types
export interface LikeCollectPageState {
  messages: LikeCollectMessage[];
  loading: boolean;
  refreshing: boolean;
  error: string | null;
  hasMore: boolean;
  page: number;
}

export interface FilterState {
  actionType: ActionType | 'all';
  contentType: ContentType | 'all';
  dateRange: 'today' | 'week' | 'month' | 'all';
}

export interface EmptyState {
  icon: string;
  title: string;
  subtitle: string;
  actionText?: string;
  onAction?: () => void;
}
// #endregion

// #region 7. API Types
export interface GetLikeCollectMessagesRequest {
  page: number;
  pageSize: number;
  actionType?: ActionType;
  contentType?: ContentType;
  startDate?: string;
  endDate?: string;
}

export interface GetLikeCollectMessagesResponse {
  messages: LikeCollectMessage[];
  total: number;
  hasMore: boolean;
  nextPage?: number;
}

export interface MarkMessageReadRequest {
  messageId: string;
}

export interface MarkMessageReadResponse {
  success: boolean;
  messageId: string;
}

export interface ClearAllMessagesRequest {
  actionType?: ActionType;
  confirmCode?: string;
}

export interface ClearAllMessagesResponse {
  success: boolean;
  deletedCount: number;
}
// #endregion

// #region 8. Event Handler Types
export interface LikeCollectEventHandlers {
  onMessagePress: (message: LikeCollectMessage) => void;
  onUserPress: (userId: string) => void;
  onContentPress: (content: TargetContent) => void;
  onRefresh: () => Promise<void>;
  onLoadMore: () => Promise<void>;
  onClearAll: () => Promise<void>;
  onFilterChange: (filter: FilterState) => void;
  onRetry: () => void;
}

export interface MessageItemEventHandlers {
  onPress: (message: LikeCollectMessage) => void;
  onUserPress: (userId: string) => void;
  onContentPress: (content: TargetContent) => void;
  onLongPress?: (message: LikeCollectMessage) => void;
}
// #endregion

// #region 9. Component Props Types
export interface LikeCollectHeaderProps {
  title: string;
  unreadCount: number;
  onBack: () => void;
  onClearAll: () => void;
  onFilter?: () => void;
}

export interface LikeCollectListProps {
  messages: LikeCollectMessage[];
  loading: boolean;
  refreshing: boolean;
  hasMore: boolean;
  onRefresh: () => Promise<void>;
  onLoadMore: () => Promise<void>;
  onMessagePress: (message: LikeCollectMessage) => void;
  onUserPress: (userId: string) => void;
  emptyState?: EmptyState;
}

export interface MessageFilterProps {
  filter: FilterState;
  onFilterChange: (filter: FilterState) => void;
  visible: boolean;
  onClose: () => void;
}
// #endregion

// #region 10. Animation Types
export interface AnimationConfig {
  duration: number;
  delay?: number;
  easing?: string;
}

export interface SpringConfig {
  damping: number;
  stiffness: number;
  mass?: number;
}

export interface MessageItemAnimation {
  appear: AnimationConfig;
  press: AnimationConfig;
  readStateChange: AnimationConfig;
}
// #endregion

// #region 11. Error Types
export interface LikeCollectError {
  code: string;
  message: string;
  details?: any;
}

export type ErrorHandler = (error: LikeCollectError) => void;
// #endregion

// #region 12. Utility Types
export type Timestamp = string;
export type UserId = string;
export type MessageId = string;
export type ContentId = string;

export interface TimeDisplayOptions {
  format: 'relative' | 'absolute';
  showSeconds?: boolean;
  showDate?: boolean;
}

export interface PaginationInfo {
  page: number;
  pageSize: number;
  total: number;
  hasMore: boolean;
}
// #endregion
