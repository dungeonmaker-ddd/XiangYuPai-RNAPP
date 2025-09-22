/**
 * 🔄 TypeGrid 数据处理
 */

import type { ActivityType } from '../../types';

export const processTypeData = {
  // 处理活动类型数据
  processActivityTypes: (activityTypes: any[]) => {
    return activityTypes.map(type => ({
      ...type,
      // 确保所有必要字段存在
      id: type.id,
      name: type.name || type.label,
      emoji: type.emoji,
      color: type.color || '#FFFFFF',
      bgColor: type.bgColor,
    }));
  },

  // 验证类型数据
  validateTypeData: (typeData: any[]): boolean => {
    return typeData.every(type => 
      type.id && 
      type.name && 
      type.emoji &&
      type.bgColor
    );
  },

  // 筛选可用类型
  filterAvailableTypes: (typeData: any[], enabledTypes: ActivityType[]): any[] => {
    return typeData.filter(type => enabledTypes.includes(type.id));
  },

  // 排序类型数据
  sortTypeData: (typeData: any[], order: ActivityType[]): any[] => {
    return typeData.sort((a, b) => {
      const indexA = order.indexOf(a.id);
      const indexB = order.indexOf(b.id);
      return indexA - indexB;
    });
  },
};
