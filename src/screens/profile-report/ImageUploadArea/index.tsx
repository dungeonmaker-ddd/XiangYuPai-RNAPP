// #region 1. File Banner & TOC
/**
 * 图片上传区域 - 支持拍照和相册选择，最多9张图片
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
  Text,
  StyleSheet,
  ScrollView,
  Alert,
} from 'react-native';

// 内部导入
import type { ImageUploadAreaProps } from '../types';
import { REPORT_CONSTANTS } from '../constants';
import { ImageItem } from './ImageItem';
import { AddImageButton } from './AddImageButton';
import { ImageSourcePicker } from './ImageSourcePicker';
// #endregion

// #region 3. Types & Schema
interface LocalProps extends ImageUploadAreaProps {
  // 扩展本地Props
}
// #endregion

// #region 4. Constants & Config
const UPLOAD_CONFIG = {
  imageSize: 120,
  borderRadius: 12,
  maxImages: 9,
  gridSpacing: 12,
  sectionPadding: 16,
} as const;

const HINT_TEXT = {
  default: `最多可上传${UPLOAD_CONFIG.maxImages}张图片，支持JPG、PNG格式`,
  maxReached: `已达到最大上传数量限制`,
} as const;
// #endregion

// #region 5. Utils & Helpers
// 检查是否可以添加更多图片
const canAddMoreImages = (currentCount: number, maxCount: number): boolean => {
  return currentCount < maxCount;
};

// 获取提示文字
const getHintText = (currentCount: number, maxCount: number): string => {
  return canAddMoreImages(currentCount, maxCount) 
    ? HINT_TEXT.default 
    : HINT_TEXT.maxReached;
};
// #endregion

// #region 6. State Management
// 无复杂状态管理需求
// #endregion

// #region 7. Domain Logic
// 图片操作逻辑
const handleImageSourceSelection = (
  onCamera: () => void,
  onLibrary: () => void
) => {
  return ImageSourcePicker.show(onCamera, onLibrary);
};
// #endregion

// #region 8. UI Components & Rendering
export const ImageUploadArea: React.FC<LocalProps> = ({
  images,
  onImagesChange,
  maxImages = UPLOAD_CONFIG.maxImages,
  disabled = false,
}) => {
  // 添加图片
  const addImage = useCallback((uri: string) => {
    if (canAddMoreImages(images.length, maxImages)) {
      onImagesChange([...images, uri]);
    }
  }, [images, maxImages, onImagesChange]);

  // 删除图片
  const deleteImage = useCallback((index: number) => {
    const newImages = images.filter((_, i) => i !== index);
    onImagesChange(newImages);
  }, [images, onImagesChange]);

  // 预览图片
  const previewImage = useCallback((uri: string) => {
    // TODO: 实现图片预览功能
    Alert.alert('图片预览', '预览功能待实现');
  }, []);

  // 拍照
  const handleCamera = useCallback(() => {
    // TODO: 实现相机拍照
    console.log('Camera capture');
  }, []);

  // 从相册选择
  const handleLibrary = useCallback(() => {
    // TODO: 实现相册选择
    console.log('Library selection');
  }, []);

  // 显示图片来源选择
  const handleAddImage = useCallback(() => {
    if (!canAddMoreImages(images.length, maxImages)) {
      Alert.alert('提示', `最多只能上传${maxImages}张图片`);
      return;
    }

    if (disabled) {
      return;
    }

    handleImageSourceSelection(handleCamera, handleLibrary);
  }, [images.length, maxImages, disabled, handleCamera, handleLibrary]);

  const canAddMore = canAddMoreImages(images.length, maxImages);
  const hintText = getHintText(images.length, maxImages);

  return (
    <View style={styles.container}>
      {/* 标题区域 */}
      <View style={styles.titleContainer}>
        <Text style={styles.title}>上传图片</Text>
        <Text style={styles.subtitle}>(选填)</Text>
      </View>

      {/* 图片网格 */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContainer}
        accessible={true}
        accessibilityLabel={`图片上传区域，已上传${images.length}张图片`}
      >
        {/* 已上传的图片 */}
        {images.map((uri, index) => (
          <ImageItem
            key={`${uri}-${index}`}
            uri={uri}
            index={index}
            onDelete={deleteImage}
            onPreview={previewImage}
            disabled={disabled}
            style={styles.imageItem}
          />
        ))}

        {/* 添加图片按钮 */}
        {canAddMore && (
          <AddImageButton 
            onPress={handleAddImage}
            disabled={disabled}
            style={styles.addButton}
          />
        )}
      </ScrollView>

      {/* 提示文字 */}
      <Text 
        style={styles.hintText}
        accessible={true}
        accessibilityLabel={hintText}
      >
        {hintText}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: UPLOAD_CONFIG.sectionPadding,
    paddingBottom: 32,
  },

  // 标题样式
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginBottom: 16,
  },
  title: {
    fontSize: 18,
    color: REPORT_CONSTANTS.COLORS.text.primary,
    fontWeight: '600',
    lineHeight: 24,
  },
  subtitle: {
    fontSize: 14,
    color: REPORT_CONSTANTS.COLORS.text.disabled,
    marginLeft: 8,
    lineHeight: 20,
  },

  // 滚动容器样式
  scrollContainer: {
    paddingRight: UPLOAD_CONFIG.sectionPadding,
  },

  // 图片项样式
  imageItem: {
    marginRight: UPLOAD_CONFIG.gridSpacing,
  },

  // 添加按钮样式
  addButton: {
    marginRight: UPLOAD_CONFIG.gridSpacing,
  },

  // 提示文字样式
  hintText: {
    fontSize: 12,
    color: REPORT_CONSTANTS.COLORS.text.disabled,
    marginTop: 12,
    lineHeight: 16,
    paddingLeft: 4,
  },
});
// #endregion

// #region 9. Exports
export default ImageUploadArea;
// #endregion
