/**
 * RegionSelector 数据处理模块
 * 处理地区选择相关数据
 */

/**
 * 地区选项数据
 */
const REGION_OPTIONS = [
  '全部',
  '南山区',
  '福田区', 
  '罗湖区',
  '宝安区',
  '龙岗区',
  '龙华区',
  '坪山区',
  '光明区',
  '盐田区'
] as const;

/**
 * 处理地区数据
 * 返回可选择的地区列表
 */
export const processRegionData = (): string[] => {
  return [...REGION_OPTIONS];
};

/**
 * 验证地区有效性
 */
export const processValidateRegion = (region: string): boolean => {
  return REGION_OPTIONS.includes(region as any);
};

/**
 * 获取默认地区
 */
export const processGetDefaultRegion = (): string => {
  return REGION_OPTIONS[0];
};
