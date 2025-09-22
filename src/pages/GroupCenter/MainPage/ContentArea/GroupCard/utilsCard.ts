/**
 * 🛠️ GroupCard 卡片工具函数
 */

import { CARD_CONSTANTS } from './constants';

export const utilsCard = {
  // 格式化距离
  formatDistance: (distance?: number): string => {
    if (!distance) return '';
    return distance < 1 ? `${Math.round(distance * 1000)}m` : `${distance.toFixed(1)}km`;
  },

  // 格式化价格
  formatPrice: (amount: number, unit: string): string => {
    const unitText = unit === 'hour' ? '小时' : unit === 'person' ? '人' : '次';
    return `${amount}金币/${unitText}`;
  },

  // 格式化参与者数量
  formatParticipantCount: (count: number): string => {
    if (count === 0) return '暂无报名';
    if (count < 10) return `${count}人报名`;
    return `等${count}多位达人报名...`;
  },

  // 截断文本
  truncateText: (text: string, maxLength: number): string => {
    return text.length > maxLength ? `${text.slice(0, maxLength)}...` : text;
  },

  // 计算卡片高度
  calculateCardHeight: (hasParticipants: boolean): number => {
    return hasParticipants ? CARD_CONSTANTS.HEIGHT : CARD_CONSTANTS.HEIGHT - 30;
  },
};
