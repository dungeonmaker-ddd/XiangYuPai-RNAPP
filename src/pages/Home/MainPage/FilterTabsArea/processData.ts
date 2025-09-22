/**
 * FilterTabsArea 数据处理模块
 * 处理筛选标签数据逻辑
 */

/**
 * 筛选标签数据
 */
const FILTER_TABS = [
  { id: 'nearby', label: '附近', active: true },
  { id: 'recommend', label: '推荐', active: false },
  { id: 'latest', label: '最新', active: false },
] as const;

/**
 * 处理标签数据
 * 返回筛选标签配置
 */
export const processTabData = () => {
  return [...FILTER_TABS];
};

/**
 * 验证标签ID有效性
 */
export const processValidateTabId = (tabId: string): boolean => {
  return FILTER_TABS.some(tab => tab.id === tabId);
};

/**
 * 获取默认激活标签
 */
export const processGetDefaultTab = (): string => {
  const defaultTab = FILTER_TABS.find(tab => tab.active);
  return defaultTab?.id || FILTER_TABS[0].id;
};
