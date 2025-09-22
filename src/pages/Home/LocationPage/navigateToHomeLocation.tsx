/**
 * 地区选择模块 - 页面跳转导航
 * 
 * TOC (快速跳转):
 * [1] Imports
 * [2] Types & Schema  
 * [3] Constants & Config
 * [4] Utils & Helpers
 * [5] State Management
 * [6] Domain Logic
 * [7] UI Components & Rendering
 * [8] Exports
 */

// #region 1. Imports
import type { RegionInfo, CurrentLocationInfo } from './types';
// #endregion

// #region 2. Types & Schema
interface NavigateToHomeLocationParams {
  currentLocation?: CurrentLocationInfo;
  onLocationSelected?: (location: RegionInfo) => void;
}

interface NavigationObject {
  navigate: (screenName: string, params?: any) => void;
  goBack: () => void;
}
// #endregion

// #region 3. Constants & Config
const SCREEN_NAME = 'HomeLocationSelector';
// #endregion

// #region 4. Utils & Helpers
// 导航辅助函数在下面的Domain Logic部分实现
// #endregion

// #region 5. State Management
// 此文件不包含状态管理
// #endregion

// #region 6. Domain Logic
/**
 * 导航到地区选择页面
 */
const navigateToHomeLocation = (
  navigation: NavigationObject,
  params?: NavigateToHomeLocationParams
) => {
  navigation.navigate(SCREEN_NAME, params);
};

/**
 * 从地区选择页面返回
 */
const navigateBackFromHomeLocation = (navigation: NavigationObject) => {
  navigation.goBack();
};

/**
 * 处理地区选择完成后的导航
 */
const handleLocationSelectionComplete = (
  navigation: NavigationObject,
  selectedLocation: RegionInfo,
  onLocationSelected?: (location: RegionInfo) => void
) => {
  // 执行回调
  onLocationSelected?.(selectedLocation);
  
  // 返回上级页面
  navigation.goBack();
};
// #endregion

// #region 7. UI Components & Rendering
// 此文件不包含UI组件
// #endregion

// #region 8. Exports
export {
  navigateToHomeLocation,
  navigateBackFromHomeLocation,
  handleLocationSelectionComplete,
  SCREEN_NAME,
};

export type {
  NavigateToHomeLocationParams,
  NavigationObject,
};
// #endregion
