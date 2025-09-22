/**
 * 🔄 TypeTabs 标签数据处理
 */

import type { ActivityType } from '../../types';

interface TabData {
  key: ActivityType;
  label: string;
}

export const processData = {
  // 处理标签数据
  processTabsData: (activityTypes: any[]): TabData[] => {
    return activityTypes.map(type => ({
      key: type.key,
      label: type.label,
    }));
  },

  // 验证标签数据
  validateTabData: (tabData: TabData[]): boolean => {
    return tabData.every(tab => 
      tab.key && 
      tab.label && 
      typeof tab.key === 'string' && 
      typeof tab.label === 'string'
    );
  },

  // 筛选可见标签
  filterVisibleTabs: (tabData: TabData[], maxVisible: number): TabData[] => {
    return tabData.slice(0, maxVisible);
  },
};
