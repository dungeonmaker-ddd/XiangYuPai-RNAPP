/**
 * 举报类型选择事件处理器
 * 
 * 功能：
 * - 处理用户点击选择举报类型的事件
 * - 更新选中状态
 * - 触发表单验证
 */

// #region [1] Imports
import { ReportType } from '../types';
// #endregion

// #region [2] Types
type OnReportTypeSelectCallback = (selectedType: ReportType) => void;

interface ReportTypeSelectEventData {
  selectedType: ReportType;
  timestamp: number;
  source: 'user_click';
}
// #endregion

// #region [3] Event Handler
/**
 * 举报类型选择事件处理器
 * 
 * @param reportType - 选中的举报类型
 * @param callback - 选择完成后的回调函数
 * @returns 事件处理结果
 */
export const onReportTypeSelect = (
  reportType: ReportType,
  callback: OnReportTypeSelectCallback
): ReportTypeSelectEventData => {
  // 创建事件数据
  const eventData: ReportTypeSelectEventData = {
    selectedType: reportType,
    timestamp: Date.now(),
    source: 'user_click',
  };

  // 执行回调
  try {
    callback(reportType);
  } catch (error) {
    console.warn('举报类型选择回调执行失败:', error);
  }

  // 可选：添加埋点统计
  if (__DEV__) {
    console.log('举报类型选择事件:', {
      typeId: reportType.id,
      typeLabel: reportType.label,
      timestamp: eventData.timestamp,
    });
  }

  return eventData;
};
// #endregion

// #region [4] Exports
export type { OnReportTypeSelectCallback, ReportTypeSelectEventData };
// #endregion
