/**
 * 📋 TypeSelectionArea 类型定义
 */

import type { ActivityType, ValidationState } from '../types';

export interface TypeSelectionAreaProps {
  selectedType?: ActivityType;
  onTypeSelect: (type: ActivityType) => void;
  validation?: ValidationState;
}

export interface TypeGridProps {
  selectedType?: ActivityType;
  onTypeSelect: (type: ActivityType) => void;
}

export interface TypeValidationProps {
  validation?: ValidationState;
}
