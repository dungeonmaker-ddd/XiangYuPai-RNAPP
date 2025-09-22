/**
 * 🔄 NavigationBar 区域本地状态管理
 */

import { useState, useCallback } from 'react';

interface NavigationState {
  isNavigating: boolean;
  canCancel: boolean;
  lastNavigationTime: number;
  confirmationRequired: boolean;
}

const INITIAL_NAVIGATION_STATE: NavigationState = {
  isNavigating: false,
  canCancel: true,
  lastNavigationTime: 0,
  confirmationRequired: false,
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

  const setConfirmationRequired = useCallback((required: boolean) => {
    setNavigationState(prev => ({
      ...prev,
      confirmationRequired: required,
    }));
  }, []);

  const setCancelState = useCallback((canCancel: boolean) => {
    setNavigationState(prev => ({
      ...prev,
      canCancel,
    }));
  }, []);

  return {
    navigationState,
    startNavigation,
    finishNavigation,
    setConfirmationRequired,
    setCancelState,
  };
};
