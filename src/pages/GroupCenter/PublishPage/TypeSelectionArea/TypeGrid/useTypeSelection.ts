/**
 * 🔄 TypeGrid 区域本地状态管理
 */

import { useState, useCallback, useEffect } from 'react';
import type { ActivityType } from '../../types';

interface SelectionState {
  selectedType?: ActivityType;
  isAnimating: boolean;
  lastSelectionTime: number;
}

interface UseTypeSelectionProps {
  selectedType?: ActivityType;
}

export const useTypeSelection = ({ selectedType }: UseTypeSelectionProps) => {
  const [selectionState, setSelectionState] = useState<SelectionState>({
    selectedType,
    isAnimating: false,
    lastSelectionTime: 0,
  });

  const updateSelectionState = useCallback((updates: Partial<SelectionState>) => {
    setSelectionState(prev => ({
      ...prev,
      ...updates,
      lastSelectionTime: Date.now(),
    }));
  }, []);

  const startAnimation = useCallback(() => {
    setSelectionState(prev => ({
      ...prev,
      isAnimating: true,
    }));
  }, []);

  const finishAnimation = useCallback(() => {
    setSelectionState(prev => ({
      ...prev,
      isAnimating: false,
    }));
  }, []);

  // 监听外部选择变化
  useEffect(() => {
    setSelectionState(prev => ({
      ...prev,
      selectedType,
    }));
  }, [selectedType]);

  return {
    selectionState,
    updateSelectionState,
    startAnimation,
    finishAnimation,
  };
};
