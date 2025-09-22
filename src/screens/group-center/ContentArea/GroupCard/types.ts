/**
 * 📋 GroupCard 区域类型定义
 */

import type { GroupActivity, UserInfo } from '../../types';

export interface GroupCardProps {
  activity: GroupActivity;
  onPress: (activity: GroupActivity) => void;
  onAvatarPress?: (user: UserInfo) => void;
}

export interface CardState {
  isPressed: boolean;
  isLoading: boolean;
  lastInteractionTime: number;
}
