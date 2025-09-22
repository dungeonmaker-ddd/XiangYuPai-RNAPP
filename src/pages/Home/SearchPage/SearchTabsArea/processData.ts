/**
 * SearchTabsArea 数据处理模块
 * 处理搜索标签数据逻辑
 */

import { TAB_CONFIG } from '../constants';
import type { TabType } from '../types';

/**
 * 处理标签数据
 * 返回搜索标签配置列表
 */
export const processTabData = () => {
  return Object.values(TAB_CONFIG);
};

/**
 * 验证标签类型有效性
 */
export const processValidateTabType = (tabType: string): tabType is TabType => {
  return Object.values(TAB_CONFIG).some(tab => tab.key === tabType);
};

/**
 * 获取默认激活标签
 */
export const processGetDefaultTab = (): TabType => {
  return Object.values(TAB_CONFIG)[0].key;
};

/**
 * 根据结果数量排序标签
 */
export const processSortTabsByCount = (
  resultCounts: Record<TabType, number>
): TabType[] => {
  return Object.values(TAB_CONFIG)
    .sort((a, b) => (resultCounts[b.key] || 0) - (resultCounts[a.key] || 0))
    .map(tab => tab.key);
};

/**
 * 处理标签显示状态
 */
export const processTabDisplayState = (
  tabType: TabType,
  isActive: boolean,
  resultCount: number
) => {
  return {
    isActive,
    hasResults: resultCount > 0,
    showCount: resultCount > 0,
    isDisabled: false, // 可以根据业务逻辑设置
  };
};
