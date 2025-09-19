/**
 * 举报数据管理Hook
 * 
 * 功能：
 * - 管理举报类型数据
 * - 处理数据加载状态
 * - 缓存和本地存储管理
 */

// #region [1] Imports
import { useState, useEffect, useCallback } from 'react';
import { ReportType } from '../types';
import { ReportService } from '../services/ReportService';
// #endregion

// #region [2] Types
interface UseReportDataResult {
  reportTypes: ReportType[];
  isLoading: boolean;
  error: string | null;
  refreshReportTypes: () => Promise<void>;
}

interface ReportDataState {
  reportTypes: ReportType[];
  isLoading: boolean;
  error: string | null;
  lastFetchTime: number | null;
}
// #endregion

// #region [3] Constants
const CACHE_CONFIG = {
  cacheTimeout: 5 * 60 * 1000, // 5分钟缓存
  maxRetries: 3,
  retryDelay: 1000,
} as const;

// 默认举报类型数据（作为fallback）
const DEFAULT_REPORT_TYPES: ReportType[] = [
  {
    id: 'harassment',
    label: '辱骂引战',
    description: '恶意辱骂、人身攻击、引起争端',
  },
  {
    id: 'adult_content',
    label: '色情低俗',
    description: '包含色情、低俗、不雅内容',
  },
  {
    id: 'fraud',
    label: '诈骗',
    description: '虚假信息、诈骗行为、金融欺诈',
  },
  {
    id: 'illegal',
    label: '违法犯罪',
    description: '涉及违法犯罪活动',
  },
  {
    id: 'false_info',
    label: '不实信息',
    description: '虚假新闻、谣言传播',
  },
  {
    id: 'minor_related',
    label: '未成年人相关',
    description: '涉及未成年人不当内容',
  },
  {
    id: 'inappropriate',
    label: '内容引人不适',
    description: '令人不适的内容或行为',
  },
  {
    id: 'other',
    label: '其他',
    description: '其他不当行为或内容',
  },
];
// #endregion

// #region [4] Utils
/**
 * 检查缓存是否有效
 */
const isCacheValid = (lastFetchTime: number | null): boolean => {
  if (!lastFetchTime) return false;
  return Date.now() - lastFetchTime < CACHE_CONFIG.cacheTimeout;
};

/**
 * 延迟执行
 */
const delay = (ms: number): Promise<void> => {
  return new Promise(resolve => setTimeout(resolve, ms));
};
// #endregion

// #region [5] Hook Implementation
/**
 * 举报数据管理Hook
 * 
 * @returns 举报数据和相关操作函数
 */
export const useReportData = (): UseReportDataResult => {
  const [state, setState] = useState<ReportDataState>({
    reportTypes: DEFAULT_REPORT_TYPES,
    isLoading: false,
    error: null,
    lastFetchTime: null,
  });

  /**
   * 更新状态的辅助函数
   */
  const updateState = useCallback((updates: Partial<ReportDataState>) => {
    setState(prevState => ({ ...prevState, ...updates }));
  }, []);

  /**
   * 获取举报类型数据
   */
  const fetchReportTypes = useCallback(async (forceRefresh = false): Promise<void> => {
    // 如果缓存有效且不是强制刷新，直接返回
    if (!forceRefresh && isCacheValid(state.lastFetchTime) && state.reportTypes.length > 0) {
      return;
    }

    updateState({ isLoading: true, error: null });

    let lastError: Error | null = null;

    // 重试机制
    for (let attempt = 1; attempt <= CACHE_CONFIG.maxRetries; attempt++) {
      try {
        const reportTypes = await ReportService.getReportTypes();
        
        updateState({
          reportTypes: reportTypes.length > 0 ? reportTypes : DEFAULT_REPORT_TYPES,
          isLoading: false,
          error: null,
          lastFetchTime: Date.now(),
        });

        // 成功获取数据，记录日志
        if (__DEV__) {
          console.log('举报类型数据获取成功:', {
            count: reportTypes.length,
            attempt,
            timestamp: Date.now(),
          });
        }

        return;

      } catch (error) {
        lastError = error as Error;
        
        // 如果不是最后一次尝试，等待后重试
        if (attempt < CACHE_CONFIG.maxRetries) {
          await delay(CACHE_CONFIG.retryDelay * attempt);
          continue;
        }
      }
    }

    // 所有重试都失败，使用默认数据并设置错误状态
    const errorMessage = lastError?.message || '获取举报类型失败';
    
    updateState({
      reportTypes: DEFAULT_REPORT_TYPES, // 使用默认数据保证功能可用
      isLoading: false,
      error: errorMessage,
      lastFetchTime: Date.now(),
    });

    // 错误日志
    if (__DEV__) {
      console.warn('举报类型数据获取失败，使用默认数据:', {
        error: errorMessage,
        timestamp: Date.now(),
      });
    }
  }, [state.lastFetchTime, state.reportTypes.length, updateState]);

  /**
   * 刷新举报类型数据
   */
  const refreshReportTypes = useCallback(async (): Promise<void> => {
    return fetchReportTypes(true);
  }, [fetchReportTypes]);

  /**
   * 初始化数据加载
   */
  useEffect(() => {
    fetchReportTypes();
  }, [fetchReportTypes]);

  return {
    reportTypes: state.reportTypes,
    isLoading: state.isLoading,
    error: state.error,
    refreshReportTypes,
  };
};
// #endregion

// #region [6] Exports
export type { UseReportDataResult };
export { DEFAULT_REPORT_TYPES };
// #endregion
