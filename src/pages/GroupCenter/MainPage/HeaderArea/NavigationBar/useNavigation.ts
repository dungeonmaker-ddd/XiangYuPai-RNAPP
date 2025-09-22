/**
 * 🔄 NavigationBar 区域本地状态管理
 */

import { useState, useCallback } from 'react';
import type { NavigationState } from './types';

const INITIAL_NAVIGATION_STATE: NavigationState = {
  isNavigating: false,
  canGoBack: true,
  lastNavigationTime: 0,
};

export const useNavigation = () => {
  const [navigationState, setNavigationState] = useState<NavigationState>(INITIAL_NAVIGATION_STATE);

  const startNavigation = useCallback(() => {
    setNavigationState(prev => ({
      ...prev,
      isNavigating: true,
      lastNavigationTime: Date.now(),
    }));
  }, []);

  const finishNavigation = useCallback(() => {
    setNavigationState(prev => ({
      ...prev,
      isNavigating: false,
    }));
  }, []);

  const updateBackState = useCallback((canGoBack: boolean) => {
    setNavigationState(prev => ({
      ...prev,
      canGoBack,
    }));
  }, []);

  return {
    navigationState,
    startNavigation,
    finishNavigation,
    updateBackState,
  };
};
