/**
 * 📋 ContentArea 类型定义
 */

import type { GroupActivity, UserInfo } from '../types';

export interface GroupCardProps {
  activity: GroupActivity;
  onPress: (activity: GroupActivity) => void;
  onAvatarPress?: (user: UserInfo) => void;
}

export interface ContentAreaProps {
  activities: GroupActivity[];
  loading: boolean;
  refreshing: boolean;
  hasMore: boolean;
  isEmpty: boolean;
  error: string | null;
  onRefresh: () => void;
  onLoadMore: () => void;
  onActivityPress: (activity: GroupActivity) => void;
  onAvatarPress?: (user: UserInfo) => void;
}

export interface GroupListProps {
  activities: GroupActivity[];
  refreshing: boolean;
  hasMore: boolean;
  onRefresh: () => void;
  onLoadMore: () => void;
  onActivityPress: (activity: GroupActivity) => void;
  onAvatarPress?: (user: UserInfo) => void;
}

export interface LoadingStatesProps {
  type: 'loading' | 'empty' | 'error';
  message?: string;
  onRetry?: () => void;
}
