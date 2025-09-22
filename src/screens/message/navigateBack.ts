// #region 1. File Banner & TOC
/**
 * 返回导航处理
 * 
 * TOC (快速跳转):
 * [1] Imports
 * [2] Types & Schema
 * [3] Constants & Config
 * [4] Utils & Helpers
 * [5] Navigation Functions
 * [6] State Management
 * [7] Error Handling
 * [8] Exports
 */
// #endregion

// #region 2. Imports
import { Alert, BackHandler } from 'react-native';
import { NavigationProp } from './types';
import { NAVIGATION_PARAMS } from './constants';
// #endregion

// #region 3. Types & Schema
interface BackNavigationOptions {
  animated?: boolean;
  duration?: number;
  confirmBeforeExit?: boolean;
  saveState?: boolean;
}

interface BackNavigationState {
  canGoBack: boolean;
  currentRoute: string;
  previousRoute?: string;
}
// #endregion

// #region 4. Constants & Config
const DEFAULT_BACK_OPTIONS: BackNavigationOptions = {
  animated: true,
  duration: NAVIGATION_PARAMS.FADE_DURATION,
  confirmBeforeExit: false,
  saveState: true
};

const EXIT_CONFIRMATION_DELAY = 2000; // 2秒内再次按返回键退出
let lastBackPressed = 0;
// #endregion

// #region 5. Utils & Helpers
const shouldConfirmExit = (options: BackNavigationOptions): boolean => {
  return options.confirmBeforeExit === true;
};

const isDoubleBackPress = (): boolean => {
  const now = Date.now();
  if (now - lastBackPressed < EXIT_CONFIRMATION_DELAY) {
    return true;
  }
  lastBackPressed = now;
  return false;
};

const showExitConfirmation = (): Promise<boolean> => {
  return new Promise((resolve) => {
    Alert.alert(
      '退出确认',
      '确定要退出消息页面吗？',
      [
        { text: '取消', onPress: () => resolve(false), style: 'cancel' },
        { text: '确定', onPress: () => resolve(true) }
      ]
    );
  });
};
// #endregion

// #region 6. Navigation Functions
export const navigateBack = async (
  navigation: NavigationProp,
  options: BackNavigationOptions = {}
): Promise<void> => {
  try {
    const finalOptions = { ...DEFAULT_BACK_OPTIONS, ...options };
    
    // 检查是否需要确认退出
    if (shouldConfirmExit(finalOptions)) {
      const shouldExit = await showExitConfirmation();
      if (!shouldExit) {
        return;
      }
    }

    // 保存状态（如果需要）
    if (finalOptions.saveState) {
      await saveNavigationState();
    }

    // 执行返回导航
    navigation.goBack();
    
    if (__DEV__) {
      console.log('[Navigation] 执行返回导航');
    }
    
  } catch (error) {
    console.error('返回导航失败:', error);
    Alert.alert('导航错误', '返回操作失败，请稍后重试');
  }
};

export const handleHardwareBackPress = (
  navigation: NavigationProp,
  options: BackNavigationOptions = {}
): boolean => {
  try {
    // 双击退出逻辑
    if (options.confirmBeforeExit) {
      if (isDoubleBackPress()) {
        return false; // 让系统处理退出
      } else {
        Alert.alert('提示', '再按一次返回键退出');
        return true; // 阻止默认行为
      }
    }

    // 直接返回
    navigateBack(navigation, options);
    return true;
    
  } catch (error) {
    console.error('硬件返回键处理失败:', error);
    return false;
  }
};
// #endregion

// #region 7. State Management
const saveNavigationState = async (): Promise<void> => {
  try {
    // 这里可以保存导航状态到本地存储
    // 例如：AsyncStorage.setItem('navigationState', JSON.stringify(state));
    if (__DEV__) {
      console.log('[Navigation] 保存导航状态');
    }
  } catch (error) {
    console.error('保存导航状态失败:', error);
  }
};

const restoreNavigationState = async (): Promise<BackNavigationState | null> => {
  try {
    // 这里可以从本地存储恢复导航状态
    // 例如：const state = await AsyncStorage.getItem('navigationState');
    if (__DEV__) {
      console.log('[Navigation] 恢复导航状态');
    }
    return null;
  } catch (error) {
    console.error('恢复导航状态失败:', error);
    return null;
  }
};
// #endregion

// #region 8. Error Handling
export const handleBackNavigationError = (error: Error, context: string): void => {
  console.error(`[Back Navigation Error] ${context}:`, error);
  
  const userFriendlyMessage = error.message.includes('navigation') 
    ? '页面返回失败，请稍后重试'
    : '操作失败，请重新尝试';
    
  Alert.alert('操作错误', userFriendlyMessage);
};
// #endregion

// #region 9. Exports
export const backNavigationUtils = {
  navigateBack,
  handleHardwareBackPress,
  saveNavigationState,
  restoreNavigationState,
  handleBackNavigationError
};

export default backNavigationUtils;
// #endregion
