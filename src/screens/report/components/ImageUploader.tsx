/**
 * 图片上传组件
 * 
 * 功能：
 * - 支持拍照和相册选择
 * - 最多上传9张图片
 * - 图片预览和删除功能
 * - 图片压缩和格式优化
 */

// #region [1] Imports
import React, { useCallback } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  StyleSheet,
  ScrollView,
  Alert,
  ActionSheet,
  Platform,
} from 'react-native';
import { launchCamera, launchImageLibrary, ImagePickerResponse, MediaType } from 'react-native-image-picker';

import { REPORT_CONSTANTS } from '../constants';
// #endregion

// #region [2] Types
interface ImageUploaderProps {
  images: string[];
  onImagesChange: (images: string[]) => void;
  maxImages?: number;
}

interface ImageItemProps {
  uri: string;
  index: number;
  onDelete: (index: number) => void;
  onPreview: (uri: string) => void;
}
// #endregion

// #region [3] Constants
const IMAGE_CONFIG = {
  imageSize: 120,
  borderRadius: 12,
  maxImages: 9,
  quality: 0.8,
  maxWidth: 1024,
  maxHeight: 1024,
} as const;

const SPACING = {
  container: 16,
  grid: 12,
  title: 16,
} as const;

const PICKER_OPTIONS = {
  mediaType: 'photo' as MediaType,
  quality: IMAGE_CONFIG.quality,
  maxWidth: IMAGE_CONFIG.maxWidth,
  maxHeight: IMAGE_CONFIG.maxHeight,
  includeBase64: false,
  includeExtra: false,
};
// #endregion

// #region [4] Utils
/**
 * 显示图片来源选择器
 */
const showImageSourcePicker = (onCamera: () => void, onLibrary: () => void) => {
  const options = ['拍照', '从相册选择', '取消'];
  const cancelButtonIndex = 2;

  if (Platform.OS === 'ios') {
    ActionSheet.showActionSheetWithOptions(
      {
        options,
        cancelButtonIndex,
        title: '选择图片来源',
      },
      (buttonIndex) => {
        if (buttonIndex === 0) {
          onCamera();
        } else if (buttonIndex === 1) {
          onLibrary();
        }
      }
    );
  } else {
    Alert.alert(
      '选择图片来源',
      '',
      [
        { text: '拍照', onPress: onCamera },
        { text: '从相册选择', onPress: onLibrary },
        { text: '取消', style: 'cancel' },
      ]
    );
  }
};

/**
 * 处理图片选择结果
 */
const handleImagePickerResponse = (
  response: ImagePickerResponse,
  onSuccess: (uri: string) => void,
  onError: (error: string) => void
) => {
  if (response.didCancel) {
    return;
  }

  if (response.errorMessage) {
    onError(response.errorMessage);
    return;
  }

  if (response.assets && response.assets.length > 0) {
    const asset = response.assets[0];
    if (asset.uri) {
      onSuccess(asset.uri);
    } else {
      onError('获取图片失败');
    }
  } else {
    onError('未选择图片');
  }
};
// #endregion

// #region [5] Subcomponents
/**
 * 单个图片项组件
 */
const ImageItem: React.FC<ImageItemProps> = ({ uri, index, onDelete, onPreview }) => {
  const handleDelete = useCallback(() => {
    Alert.alert(
      '删除图片',
      '确定要删除这张图片吗？',
      [
        { text: '取消', style: 'cancel' },
        { text: '删除', style: 'destructive', onPress: () => onDelete(index) },
      ]
    );
  }, [index, onDelete]);

  const handlePreview = useCallback(() => {
    onPreview(uri);
  }, [uri, onPreview]);

  return (
    <View style={styles.imageItem}>
      <TouchableOpacity onPress={handlePreview} activeOpacity={0.8}>
        <Image source={{ uri }} style={styles.image} resizeMode="cover" />
      </TouchableOpacity>
      
      <TouchableOpacity
        style={styles.deleteButton}
        onPress={handleDelete}
        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
      >
        <Text style={styles.deleteButtonText}>×</Text>
      </TouchableOpacity>
    </View>
  );
};

/**
 * 添加图片按钮组件
 */
const AddImageButton: React.FC<{ onPress: () => void }> = ({ onPress }) => (
  <TouchableOpacity
    style={styles.addButton}
    onPress={onPress}
    activeOpacity={0.7}
  >
    <Text style={styles.addButtonIcon}>+</Text>
  </TouchableOpacity>
);
// #endregion

// #region [6] Main Component
/**
 * 图片上传器主组件
 */
export const ImageUploader: React.FC<ImageUploaderProps> = ({
  images,
  onImagesChange,
  maxImages = IMAGE_CONFIG.maxImages,
}) => {
  // 添加图片
  const addImage = useCallback((uri: string) => {
    if (images.length < maxImages) {
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
    launchCamera(PICKER_OPTIONS, (response) => {
      handleImagePickerResponse(
        response,
        addImage,
        (error) => Alert.alert('拍照失败', error)
      );
    });
  }, [addImage]);

  // 从相册选择
  const handleLibrary = useCallback(() => {
    launchImageLibrary(PICKER_OPTIONS, (response) => {
      handleImagePickerResponse(
        response,
        addImage,
        (error) => Alert.alert('选择图片失败', error)
      );
    });
  }, [addImage]);

  // 显示图片来源选择
  const handleAddImage = useCallback(() => {
    if (images.length >= maxImages) {
      Alert.alert('提示', `最多只能上传${maxImages}张图片`);
      return;
    }

    showImageSourcePicker(handleCamera, handleLibrary);
  }, [images.length, maxImages, handleCamera, handleLibrary]);

  const canAddMore = images.length < maxImages;

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
      >
        {/* 已上传的图片 */}
        {images.map((uri, index) => (
          <ImageItem
            key={`${uri}-${index}`}
            uri={uri}
            index={index}
            onDelete={deleteImage}
            onPreview={previewImage}
          />
        ))}

        {/* 添加图片按钮 */}
        {canAddMore && (
          <AddImageButton onPress={handleAddImage} />
        )}
      </ScrollView>

      {/* 提示文字 */}
      <Text style={styles.hintText}>
        最多可上传{maxImages}张图片，支持JPG、PNG格式
      </Text>
    </View>
  );
};
// #endregion

// #region [7] Styles
const styles = StyleSheet.create({
  container: {
    paddingHorizontal: SPACING.container,
    paddingBottom: 32,
  },

  // 标题样式
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginBottom: SPACING.title,
  },
  title: {
    fontSize: 18,
    color: '#333333',
    fontWeight: '600',
    lineHeight: 24,
  },
  subtitle: {
    fontSize: 14,
    color: '#999999',
    marginLeft: 8,
    lineHeight: 20,
  },

  // 滚动容器样式
  scrollContainer: {
    paddingRight: SPACING.container,
  },

  // 图片项样式
  imageItem: {
    marginRight: SPACING.grid,
    position: 'relative',
  },
  image: {
    width: IMAGE_CONFIG.imageSize,
    height: IMAGE_CONFIG.imageSize,
    borderRadius: IMAGE_CONFIG.borderRadius,
    backgroundColor: '#F5F5F5',
  },
  deleteButton: {
    position: 'absolute',
    top: -6,
    right: -6,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#FF4444',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 3,
  },
  deleteButtonText: {
    fontSize: 14,
    color: '#FFFFFF',
    fontWeight: 'bold',
    lineHeight: 16,
  },

  // 添加按钮样式
  addButton: {
    width: IMAGE_CONFIG.imageSize,
    height: IMAGE_CONFIG.imageSize,
    borderRadius: IMAGE_CONFIG.borderRadius,
    borderWidth: 2,
    borderColor: '#CCCCCC',
    borderStyle: 'dashed',
    backgroundColor: 'transparent',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SPACING.grid,
  },
  addButtonIcon: {
    fontSize: 32,
    color: '#999999',
    fontWeight: '300',
    lineHeight: 36,
  },

  // 提示文字样式
  hintText: {
    fontSize: 12,
    color: '#999999',
    marginTop: 12,
    lineHeight: 16,
    paddingLeft: 4,
  },
});
// #endregion

export default ImageUploader;
