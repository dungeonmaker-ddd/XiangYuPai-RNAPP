// #region 1. File Banner & TOC
/**
 * 图片来源选择器 - 选择拍照或相册的弹窗工具
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
// #endregion

// #region 2. Imports
import {
  Alert,
  ActionSheet,
  Platform,
} from 'react-native';
// #endregion

// #region 3. Types & Schema
type OnCameraCallback = () => void;
type OnLibraryCallback = () => void;
// #endregion

// #region 4. Constants & Config
const PICKER_CONFIG = {
  options: ['拍照', '从相册选择', '取消'],
  cancelButtonIndex: 2,
  title: '选择图片来源',
} as const;
// #endregion

// #region 5. Utils & Helpers
// 显示iOS ActionSheet
const showIOSActionSheet = (
  onCamera: OnCameraCallback,
  onLibrary: OnLibraryCallback
) => {
  ActionSheet.showActionSheetWithOptions(
    {
      options: PICKER_CONFIG.options,
      cancelButtonIndex: PICKER_CONFIG.cancelButtonIndex,
      title: PICKER_CONFIG.title,
    },
    (buttonIndex) => {
      switch (buttonIndex) {
        case 0:
          onCamera();
          break;
        case 1:
          onLibrary();
          break;
        default:
          // 取消操作，不执行任何操作
          break;
      }
    }
  );
};

// 显示Android Alert
const showAndroidAlert = (
  onCamera: OnCameraCallback,
  onLibrary: OnLibraryCallback
) => {
  Alert.alert(
    PICKER_CONFIG.title,
    '',
    [
      { text: '拍照', onPress: onCamera },
      { text: '从相册选择', onPress: onLibrary },
      { text: '取消', style: 'cancel' },
    ]
  );
};
// #endregion

// #region 6. State Management
// 无状态管理需求
// #endregion

// #region 7. Domain Logic
// 平台判断和选择逻辑
// #endregion

// #region 8. UI Components & Rendering
// 此组件为工具类，无UI渲染
// #endregion

// #region 9. Exports
export class ImageSourcePicker {
  /**
   * 显示图片来源选择器
   * 
   * @param onCamera - 选择拍照的回调
   * @param onLibrary - 选择相册的回调
   */
  static show(onCamera: OnCameraCallback, onLibrary: OnLibraryCallback): void {
    if (Platform.OS === 'ios') {
      showIOSActionSheet(onCamera, onLibrary);
    } else {
      showAndroidAlert(onCamera, onLibrary);
    }
  }
}

export default ImageSourcePicker;
// #endregion
