/**
 * TabBar 点击事件处理
 * 处理 Tab 栏的点击交互逻辑
 */

import { TabType } from './types';

export interface TabPressEventData {
  tabKey: TabType;
  tabIndex: number;
  isActive: boolean;
  timestamp: number;
}

// Tab 点击事件处理器
export const onTabBarPress = (
  tabKey: TabType,
  activeTab: TabType,
  onTabPress: (tab: TabType) => void,
  isAnimating: boolean = false
) => {
  // 防止动画期间重复点击
  if (isAnimating) {
    return;
  }
  
  // 防止重复点击相同 Tab
  if (tabKey === activeTab) {
    return;
  }
  
  // 创建事件数据
  const eventData: TabPressEventData = {
    tabKey,
    tabIndex: getTabIndex(tabKey),
    isActive: tabKey === activeTab,
    timestamp: Date.now(),
  };
  
  // 执行回调
  onTabPress(tabKey);
  
  // 可选：添加分析日志
  logTabPressEvent(eventData);
};

// 获取 Tab 索引的辅助函数
const getTabIndex = (tabKey: TabType): number => {
  const tabMap: Record<TabType, number> = {
    follow: 0,
    hot: 1,
    local: 2,
  };
  return tabMap[tabKey] || 0;
};

// Tab 点击事件日志记录
const logTabPressEvent = (eventData: TabPressEventData) => {
  // 开发环境下的日志记录
  if (__DEV__) {
    console.log('TabBar Press Event:', eventData);
  }
  
  // 可以在这里添加分析统计代码
  // Analytics.track('tab_bar_press', {
  //   tab_key: eventData.tabKey,
  //   tab_index: eventData.tabIndex,
  //   timestamp: eventData.timestamp,
  // });
};

// Tab 长按事件处理器（预留扩展）
export const onTabBarLongPress = (
  tabKey: TabType,
  activeTab: TabType,
  onLongPress?: (tab: TabType) => void
) => {
  if (!onLongPress) {
    return;
  }
  
  // 长按事件逻辑
  onLongPress(tabKey);
  
  if (__DEV__) {
    console.log('TabBar Long Press:', tabKey);
  }
};
