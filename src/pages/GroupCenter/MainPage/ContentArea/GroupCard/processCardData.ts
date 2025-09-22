/**
 * 🔄 GroupCard 数据处理
 */

import type { GroupActivity, UserInfo } from '../../types';

export const processCardData = {
  // 处理活动数据
  processActivityData: (activity: GroupActivity) => {
    return {
      ...activity,
      title: activity.title.trim(),
      description: activity.description.trim(),
    };
  },

  // 处理参与者数据
  processParticipantData: (participants: any[], maxDisplay: number) => {
    return participants
      .slice(0, maxDisplay)
      .map(p => p.user);
  },

  // 验证卡片数据
  validateCardData: (activity: GroupActivity): boolean => {
    return !!(
      activity.id &&
      activity.title &&
      activity.organizer &&
      activity.details
    );
  },
};
