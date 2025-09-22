/**
 * 🎯 TypeGrid 区域事件处理
 */

import type { ActivityType } from '../../types';
import { TYPE_GRID_CONSTANTS } from './constants';

export const onTypeSelect = {
  // 处理类型选择
  handleTypeSelect: (
    onTypeSelect: (type: ActivityType) => void,
    type: ActivityType,
    updateSelectionState: (updates: any) => void
  ) => {
    // 更新本地状态
    updateSelectionState({
      selectedType: type,
      isAnimating: true,
    });

    // 延迟调用父组件回调，让动画先执行
    setTimeout(() => {
      onTypeSelect(type);
      updateSelectionState({
        isAnimating: false,
      });
    }, TYPE_GRID_CONSTANTS.ANIMATION_DURATION);
  },

  // 处理卡片按下动画
  handleCardPressIn: (scaleValue: any) => {
    scaleValue.setValue(TYPE_GRID_CONSTANTS.SCALE_FACTOR);
  },

  // 处理卡片松开动画
  handleCardPressOut: (scaleValue: any) => {
    scaleValue.setValue(1);
  },
};
