/**
 * UserCardComponent 格式化工具模块
 * 处理用户卡片格式化相关的工具函数
 */

import { COLORS } from '../../constants';
import type { UserCard } from '../../types';

/**
 * 卡片格式化工具函数
 */
export const utilsCardFormat = () => {
  /**
   * 格式化距离显示
   */
  const formatDistance = (distance: number): string => {
    return distance < 1 ? `${(distance * 1000).toFixed(0)}m` : `${distance.toFixed(1)}km`;
  };

  /**
   * 截断文本
   */
  const truncateText = (text: string, maxLength: number): string => {
    return text.length > maxLength ? `${text.slice(0, maxLength)}...` : text;
  };

  /**
   * 格式化状态显示
   */
  const formatStatus = (status: UserCard['status']) => {
    switch (status) {
      case 'online':
        return { color: COLORS.green, text: '在线' };
      case 'available':
        return { color: COLORS.orange, text: '可预约' };
      default:
        return { color: COLORS.gray500, text: '离线' };
    }
  };

  /**
   * 格式化价格显示
   */
  const formatPrice = (price?: string): string => {
    if (!price) return '面议';
    return price;
  };

  /**
   * 格式化时间显示
   */
  const formatTime = (timestamp: number): string => {
    const now = Date.now();
    const diff = now - timestamp;
    const minutes = Math.floor(diff / (1000 * 60));
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (minutes < 1) return '刚刚';
    if (minutes < 60) return `${minutes}分钟前`;
    if (hours < 24) return `${hours}小时前`;
    return `${days}天前`;
  };

  return {
    formatDistance,
    truncateText,
    formatStatus,
    formatPrice,
    formatTime,
  };
};

/**
 * 卡片样式工具函数
 */
export const utilsCardStyle = () => {
  /**
   * 获取状态点颜色
   */
  const getStatusDotColor = (status: UserCard['status']): string => {
    switch (status) {
      case 'online': return COLORS.green;
      case 'available': return COLORS.orange;
      default: return COLORS.gray500;
    }
  };

  /**
   * 获取年龄标签样式
   */
  const getAgeTagStyle = (age: number) => {
    return {
      backgroundColor: age < 25 ? COLORS.pink : COLORS.primary,
    };
  };

  return {
    getStatusDotColor,
    getAgeTagStyle,
  };
};
