/**
 * LimitedOffersArea 数据处理模块
 * 处理限时专享数据逻辑
 */

import type { UserCard } from '../types';

/**
 * 处理专享数据
 * 对用户数据进行专享展示优化
 */
export const processOfferData = (offers: UserCard[]): UserCard[] => {
  return offers.map((user, index) => ({
    ...user,
    // 为专享用户添加特殊标识
    isSpecialOffer: true,
    // 计算下单数量（模拟数据）
    orderCount: 89 - index * 12,
    // 优化服务描述
    displayService: user.services[0] || '游戏陪玩',
  }));
};

/**
 * 按评分排序专享用户
 */
export const processSortByRating = (offers: UserCard[]): UserCard[] => {
  return [...offers].sort((a, b) => (b.rating || 0) - (a.rating || 0));
};

/**
 * 按价格排序专享用户
 */
export const processSortByPrice = (offers: UserCard[]): UserCard[] => {
  return [...offers].sort((a, b) => {
    const priceA = parseFloat(a.price?.replace(/[^\d.]/g, '') || '0');
    const priceB = parseFloat(b.price?.replace(/[^\d.]/g, '') || '0');
    return priceA - priceB;
  });
};

/**
 * 筛选热门专享用户
 */
export const processFilterHot = (offers: UserCard[]): UserCard[] => {
  return offers.filter(user => 
    (user.rating || 0) >= 4.5 && 
    (user.reviewCount || 0) >= 50
  );
};
