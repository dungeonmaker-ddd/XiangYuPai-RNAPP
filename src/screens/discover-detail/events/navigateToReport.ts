/**
 * 导航到举报页面事件处理器
 * 
 * 功能：
 * - 处理跳转到举报页面的导航逻辑
 * - 统一管理举报页面的参数传递
 * - 提供错误处理和日志记录
 */

import type { NavigationProp, ParamListBase } from '@react-navigation/native';
import type { ReportTargetType } from '../../report/types';

export interface ReportNavigationParams {
  /** 举报目标ID */
  targetId: string;
  /** 举报目标类型 */
  targetType: ReportTargetType;
  /** 举报目标标题（可选） */
  targetTitle?: string;
  /** 举报目标作者（可选） */
  targetAuthor?: string;
}

/**
 * 导航到举报页面
 * @param navigation - React Navigation 实例
 * @param params - 举报页面参数
 * @returns Promise<boolean> - 导航是否成功
 */
export const navigateToReport = async (
  navigation: NavigationProp<ParamListBase>,
  params: ReportNavigationParams
): Promise<boolean> => {
  try {
    console.log('NavigationEvent: 准备跳转到举报页面', params);
    
    // 参数验证
    if (!params.targetId || !params.targetType) {
      console.error('NavigationEvent: 举报页面参数不完整', params);
      return false;
    }

    // 执行导航
    (navigation as any).navigate('ReportScreen', {
      targetId: params.targetId,
      targetType: params.targetType,
      targetTitle: params.targetTitle,
      targetAuthor: params.targetAuthor,
    });

    console.log('NavigationEvent: 成功跳转到举报页面');
    return true;
  } catch (error) {
    console.error('NavigationEvent: 跳转到举报页面失败', error);
    return false;
  }
};

/**
 * 创建举报导航处理器
 * @param navigation - React Navigation 实例
 * @returns 举报导航处理函数
 */
export const createReportNavigationHandler = (navigation: NavigationProp<ParamListBase>) => {
  return (params: ReportNavigationParams) => navigateToReport(navigation, params);
};
