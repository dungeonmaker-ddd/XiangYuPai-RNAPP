// #region 1. File Banner & TOC
/**
 * 模态遮罩组件 - 模态弹窗的背景遮罩
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
import React from 'react';
import {
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
// #endregion

// #region 3. Types & Schema
interface ModalOverlayProps {
  onPress: () => void;
}
// #endregion

// #region 4. Constants & Config
// 样式常量在StyleSheet中定义
// #endregion

// #region 5. Utils & Helpers
// 无复杂工具函数需求
// #endregion

// #region 6. State Management
// 无状态管理需求
// #endregion

// #region 7. Domain Logic
// 无复杂业务逻辑
// #endregion

// #region 8. UI Components & Rendering
export const ModalOverlay: React.FC<ModalOverlayProps> = React.memo(({
  onPress,
}) => {
  return (
    <TouchableOpacity
      style={styles.overlay}
      activeOpacity={1}
      onPress={onPress}
      accessible={true}
      accessibilityRole="button"
      accessibilityLabel="关闭弹窗"
      accessibilityHint="点击空白区域关闭弹窗"
    />
  );
});

const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
});
// #endregion

// #region 9. Exports
export default ModalOverlay;
// #endregion
