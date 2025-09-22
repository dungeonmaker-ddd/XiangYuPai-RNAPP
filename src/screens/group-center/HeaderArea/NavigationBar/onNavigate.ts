/**
 * 🎯 NavigationBar 区域事件处理
 */

import type { NavigationState } from './types';
import { NAVIGATION_CONSTANTS } from './constants';

export const onNavigate = {
  // 处理返回按钮点击
  handleBackPress: (
    onBackPress: () => void,
    navigationState: NavigationState
  ) => {
    // 防止重复点击
    if (navigationState.isNavigating) {
      return;
    }

    // 检查是否可以返回
    if (!navigationState.canGoBack) {
      return;
    }

    // 防抖处理
    const now = Date.now();
    const timeSinceLastNavigation = now - navigationState.lastNavigationTime;
    if (timeSinceLastNavigation < NAVIGATION_CONSTANTS.NAVIGATION_DEBOUNCE) {
      return;
    }

    // 执行返回操作
    onBackPress();
  },

  // 处理标题点击（如果需要）
  handleTitlePress: (title: string) => {
    // 可以添加标题点击逻辑，比如显示页面信息
    console.log('Title pressed:', title);
  },
};
