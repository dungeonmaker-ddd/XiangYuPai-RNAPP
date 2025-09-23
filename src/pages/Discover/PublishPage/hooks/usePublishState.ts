/**
 * 发布主状态管理钩子
 * 
 * 管理发布页面的核心状态
 */

import { useState, useCallback, useMemo } from 'react';
import type { UsePublishStateReturn, PublishState } from './types';
import type { PublishErrors, PublishValidation } from '../types';

// 默认状态
const defaultState: PublishState = {
  isLoading: false,
  isPublishing: false,
  publishProgress: 0,
  errors: {},
  validation: {
    isValid: false,
    titleValid: false,
    contentValid: false,
    mediaValid: true,
    canPublish: false,
    requirements: [],
  },
  currentStep: 'editing',
};

/**
 * 发布主状态管理钩子
 */
export const usePublishState = (): UsePublishStateReturn => {
  const [state, setState] = useState<PublishState>(defaultState);

  // 更新状态
  const updateState = useCallback((updates: Partial<PublishState>) => {
    setState(prev => ({ ...prev, ...updates }));
  }, []);

  // 重置状态
  const resetState = useCallback(() => {
    setState(defaultState);
  }, []);

  // 设置加载状态
  const setLoading = useCallback((loading: boolean) => {
    setState(prev => ({ ...prev, isLoading: loading }));
  }, []);

  // 设置发布状态
  const setPublishing = useCallback((publishing: boolean) => {
    setState(prev => ({ 
      ...prev, 
      isPublishing: publishing,
      currentStep: publishing ? 'validating' : 'editing',
    }));
  }, []);

  // 设置进度
  const setProgress = useCallback((progress: number) => {
    setState(prev => ({ ...prev, publishProgress: progress }));
  }, []);

  // 设置错误
  const setError = useCallback((error: string) => {
    setState(prev => ({ 
      ...prev, 
      errors: { ...prev.errors, general: error },
    }));
  }, []);

  // 清除错误
  const clearErrors = useCallback(() => {
    setState(prev => ({ ...prev, errors: {} }));
  }, []);

  return {
    state,
    updateState,
    resetState,
    setLoading,
    setPublishing,
    setProgress,
    setError,
    clearErrors,
  };
};
