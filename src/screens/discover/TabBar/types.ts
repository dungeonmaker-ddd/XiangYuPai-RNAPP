/**
 * TabBar 组件类型定义
 * 包含 Tab 栏相关的接口、类型和枚举定义
 */

// Tab类型枚举
export type TabType = 'follow' | 'hot' | 'local';

// Tab配置接口
export interface TabConfig {
  key: TabType;
  title: string;
  icon?: string;
}

// TabBar 组件 Props
export interface TabBarProps {
  tabs: TabConfig[];
  activeTab: TabType;
  onTabPress: (tab: TabType) => void;
}

// Tab 指示器动画状态
export interface TabIndicatorState {
  animValue: any; // Animated.Value
  isAnimating: boolean;
}

// Tab 项渲染配置
export interface TabItemConfig {
  tab: TabConfig;
  index: number;
  isActive: boolean;
  tabWidth: number;
  onPress: (tabKey: TabType) => void;
}

// Tab 栏状态
export interface TabBarState {
  screenWidth: number;
  tabWidth: number;
  indicatorPosition: number;
}
