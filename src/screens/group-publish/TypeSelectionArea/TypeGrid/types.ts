/**
 * 📋 TypeGrid 区域类型定义
 */

import type { ActivityType } from '../../types';

export interface SelectionState {
  selectedType?: ActivityType;
  isAnimating: boolean;
  lastSelectionTime: number;
}

export interface TypeSelectionAction {
  type: 'SELECT_TYPE' | 'START_ANIMATION' | 'FINISH_ANIMATION';
  payload?: any;
}
