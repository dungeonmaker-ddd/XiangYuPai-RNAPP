/**
 * 🔄 GroupCard 区域本地状态管理
 */

import { useState, useCallback } from 'react';
import type { CardState } from './types';

const INITIAL_CARD_STATE: CardState = {
  isPressed: false,
  isLoading: false,
  lastInteractionTime: 0,
};

export const useCardState = () => {
  const [cardState, setCardState] = useState<CardState>(INITIAL_CARD_STATE);

  const setPressed = useCallback((isPressed: boolean) => {
    setCardState(prev => ({
      ...prev,
      isPressed,
      lastInteractionTime: Date.now(),
    }));
  }, []);

  const setLoading = useCallback((isLoading: boolean) => {
    setCardState(prev => ({
      ...prev,
      isLoading,
    }));
  }, []);

  return {
    cardState,
    setPressed,
    setLoading,
  };
};
