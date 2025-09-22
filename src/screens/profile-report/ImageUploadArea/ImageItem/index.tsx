// #region 1. File Banner & TOC
/**
 * 图片项组件 - 单个图片的显示和操作
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
import React, { useCallback } from 'react';
import {
  View,
  TouchableOpacity,
  Image,
  StyleSheet,
  Alert,
} from 'react-native';

// 内部导入
import { REPORT_CONSTANTS } from '../../constants';
import { DeleteButton } from './DeleteButton';
// #endregion

// #region 3. Types & Schema
interface ImageItemProps {
  uri: string;
  index: number;
  onDelete: (index: number) => void;
  onPreview: (uri: string) => void;
  disabled?: boolean;
  style?: any;
}
// #endregion

// #region 4. Constants & Config
const IMAGE_CONFIG = {
  size: 120,
  borderRadius: 12,
  deleteButtonSize: 20,
  deleteButtonOffset: -6,
} as const;
// #endregion

// #region 5. Utils & Helpers
// 无复杂工具函数需求
// #endregion

// #region 6. State Management
// 无状态管理需求
// #endregion

// #region 7. Domain Logic
// 删除确认逻辑
const showDeleteConfirmation = (onConfirm: () => void) => {
  Alert.alert(
    '删除图片',
    '确定要删除这张图片吗？',
    [
      { text: '取消', style: 'cancel' },
      { text: '删除', style: 'destructive', onPress: onConfirm },
    ]
  );
};
// #endregion

// #region 8. UI Components & Rendering
export const ImageItem: React.FC<ImageItemProps> = React.memo(({
  uri,
  index,
  onDelete,
  onPreview,
  disabled = false,
  style,
}) => {
  const handleDelete = useCallback(() => {
    if (disabled) return;
    
    showDeleteConfirmation(() => {
      onDelete(index);
    });
  }, [index, onDelete, disabled]);

  const handlePreview = useCallback(() => {
    if (disabled) return;
    
    onPreview(uri);
  }, [uri, onPreview, disabled]);

  return (
    <View style={[styles.container, style]}>
      {/* 图片预览 */}
      <TouchableOpacity 
        onPress={handlePreview} 
        activeOpacity={disabled ? 1 : 0.8}
        accessible={true}
        accessibilityRole="button"
        accessibilityLabel={`查看第${index + 1}张图片`}
        accessibilityHint="点击可全屏预览图片"
        disabled={disabled}
      >
        <Image 
          source={{ uri }} 
          style={[
            styles.image,
            disabled && styles.imageDisabled,
          ]}
          resizeMode="cover"
        />
      </TouchableOpacity>
      
      {/* 删除按钮 */}
      {!disabled && (
        <DeleteButton
          onPress={handleDelete}
          style={styles.deleteButton}
          accessibilityLabel={`删除第${index + 1}张图片`}
        />
      )}
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    position: 'relative',
  },
  image: {
    width: IMAGE_CONFIG.size,
    height: IMAGE_CONFIG.size,
    borderRadius: IMAGE_CONFIG.borderRadius,
    backgroundColor: REPORT_CONSTANTS.COLORS.background.secondary,
  },
  imageDisabled: {
    opacity: 0.6,
  },
  deleteButton: {
    position: 'absolute',
    top: IMAGE_CONFIG.deleteButtonOffset,
    right: IMAGE_CONFIG.deleteButtonOffset,
  },
});
// #endregion

// #region 9. Exports
export default ImageItem;
// #endregion
