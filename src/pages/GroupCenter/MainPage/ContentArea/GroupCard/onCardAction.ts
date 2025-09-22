/**
 * 🎯 GroupCard 区域事件处理
 */

import type { GroupActivity, UserInfo } from '../../types';
import type { CardState } from './types';

export const onCardAction = {
  // 处理卡片点击
  handleCardPress: (
    onPress: (activity: GroupActivity) => void,
    activity: GroupActivity,
    cardState: CardState
  ) => {
    // 防止重复点击
    if (cardState.isPressed || cardState.isLoading) {
      return;
    }

    // 执行点击回调
    onPress(activity);
  },

  // 处理头像点击
  handleAvatarPress: (
    onAvatarPress: (user: UserInfo) => void,
    user: UserInfo,
    cardState: CardState
  ) => {
    // 防止重复点击
    if (cardState.isPressed || cardState.isLoading) {
      return;
    }

    // 执行头像点击回调
    onAvatarPress(user);
  },
};
