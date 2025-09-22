/**
 * FilterSelector 数据处理模块
 * 处理筛选条件相关数据
 */

/**
 * 筛选选项数据
 */
const FILTER_OPTIONS = [
  '全部',
  '在线',
  '可预约',
  '新人',
  '高评分',
  '附近优先',
  '价格优惠',
  '服务完善'
] as const;

/**
 * 处理筛选数据
 * 返回可选择的筛选条件列表
 */
export const processFilterData = (): string[] => {
  return [...FILTER_OPTIONS];
};

/**
 * 验证筛选条件有效性
 */
export const processValidateFilter = (filter: string): boolean => {
  return FILTER_OPTIONS.includes(filter as any);
};

/**
 * 获取默认筛选条件
 */
export const processGetDefaultFilter = (): string => {
  return FILTER_OPTIONS[0];
};
