/**
 * 🎯 NavigationBar 区域事件处理
 */

import { NAVIGATION_CONSTANTS } from './constants';

interface NavigationState {
  isNavigating: boolean;
  canCancel: boolean;
  lastNavigationTime: number;
  confirmationRequired: boolean;
}

export const onNavigate = {
  // 处理取消按钮点击
  handleCancelPress: (
    onCancelPress: () => void,
    navigationState: NavigationState
  ) => {
    // 防止重复点击
    if (navigationState.isNavigating) {
      return;
    }

    // 检查是否可以取消
    if (!navigationState.canCancel) {
      return;
    }

    // 防抖处理
    const now = Date.now();
    const timeSinceLastNavigation = now - navigationState.lastNavigationTime;
    if (timeSinceLastNavigation < NAVIGATION_CONSTANTS.NAVIGATION_DEBOUNCE) {
      return;
    }

    // 执行取消操作
    onCancelPress();
  },

  // 处理标题点击（如果需要）
  handleTitlePress: (title: string) => {
    // 可以添加标题点击逻辑，比如显示页面信息
    console.log('Title pressed:', title);
  },
};
