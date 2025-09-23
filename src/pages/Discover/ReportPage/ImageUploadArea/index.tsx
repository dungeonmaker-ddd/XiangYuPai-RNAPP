// #region 1. File Banner & TOC
/**
 * ImageUploadArea - 图片上传区域组件
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
import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  Alert,
  StyleSheet,
  ActionSheetIOS,
  Platform,
} from 'react-native';
// import { launchImageLibrary, launchCamera, MediaType, ImagePickerResponse } from 'react-native-image-picker';

import { ImageUploadAreaProps } from '../types';
import { REPORT_CONSTANTS } from '../constants';
// #endregion

// #region 3. Types & Schema
// 模拟图片选择器类型定义
type MediaType = 'photo' | 'video' | 'mixed';

interface ImagePickerAsset {
  uri?: string;
  fileSize?: number;
  type?: string;
  fileName?: string;
}

interface ImagePickerResponse {
  didCancel?: boolean;
  errorMessage?: string;
  assets?: ImagePickerAsset[];
}

interface ImagePickerOptions {
  mediaType: MediaType;
  quality: number;
  maxWidth: number;
  maxHeight: number;
  allowsEditing?: boolean;
}

interface UploadState {
  isUploading: boolean;
  uploadProgress: number;
}
// #endregion

// #region 4. Constants & Config
const IMAGE_PICKER_OPTIONS: ImagePickerOptions = {
  mediaType: 'photo',
  quality: REPORT_CONSTANTS.FORM.IMAGE_QUALITY,
  maxWidth: REPORT_CONSTANTS.FORM.IMAGE_MAX_WIDTH,
  maxHeight: REPORT_CONSTANTS.FORM.IMAGE_MAX_HEIGHT,
  allowsEditing: true,
};

const ADD_BUTTON_SIZE = REPORT_CONSTANTS.LAYOUT.IMAGE_CARD_SIZE;
const IMAGE_SIZE = REPORT_CONSTANTS.LAYOUT.IMAGE_CARD_SIZE;
// #endregion

// #region 5. Utils & Helpers
// 模拟图片选择器函数
const launchCamera = (options: ImagePickerOptions, callback: (response: ImagePickerResponse) => void) => {
  // 模拟相机调用
  setTimeout(() => {
    const mockResponse: ImagePickerResponse = {
      assets: [{
        uri: 'file://mock-camera-image.jpg',
        fileSize: 1024 * 1024, // 1MB
        type: 'image/jpeg',
        fileName: 'camera-image.jpg',
      }],
    };
    callback(mockResponse);
  }, 1000);
};

const launchImageLibrary = (options: ImagePickerOptions, callback: (response: ImagePickerResponse) => void) => {
  // 模拟相册调用
  setTimeout(() => {
    const mockResponse: ImagePickerResponse = {
      assets: [{
        uri: 'file://mock-library-image.jpg',
        fileSize: 2 * 1024 * 1024, // 2MB
        type: 'image/jpeg',
        fileName: 'library-image.jpg',
      }],
    };
    callback(mockResponse);
  }, 500);
};

const showImagePicker = (onImageSelected: (uri: string) => void) => {
  const options = [
    { text: '拍照', onPress: () => openCamera(onImageSelected) },
    { text: '从相册选择', onPress: () => openImageLibrary(onImageSelected) },
    { text: '取消', style: 'cancel' as const },
  ];

  if (Platform.OS === 'ios') {
    ActionSheetIOS.showActionSheetWithOptions(
      {
        options: options.map(opt => opt.text),
        cancelButtonIndex: 2,
      },
      (buttonIndex) => {
        if (buttonIndex < 2) {
          options[buttonIndex].onPress();
        }
      },
    );
  } else {
    Alert.alert(
      '选择图片',
      '请选择获取图片的方式',
      options,
    );
  }
};

const openCamera = (onImageSelected: (uri: string) => void) => {
  launchCamera(IMAGE_PICKER_OPTIONS, handleImagePickerResponse(onImageSelected));
};

const openImageLibrary = (onImageSelected: (uri: string) => void) => {
  launchImageLibrary(IMAGE_PICKER_OPTIONS, handleImagePickerResponse(onImageSelected));
};

const handleImagePickerResponse = (onImageSelected: (uri: string) => void) => 
  (response: ImagePickerResponse) => {
    if (response.didCancel || response.errorMessage) {
      return;
    }

    if (response.assets && response.assets[0]) {
      const asset = response.assets[0];
      if (asset.uri) {
        // 验证图片大小
        if (asset.fileSize && asset.fileSize > REPORT_CONSTANTS.FORM.MAX_IMAGE_SIZE) {
          Alert.alert('图片过大', '请选择小于10MB的图片');
          return;
        }
        onImageSelected(asset.uri);
      }
    }
  };

const confirmImageRemoval = (index: number, onRemove: (index: number) => void) => {
  Alert.alert(
    '删除图片',
    '确定要删除这张图片吗？',
    [
      { text: '取消', style: 'cancel' },
      { text: '删除', style: 'destructive', onPress: () => onRemove(index) },
    ],
  );
};
// #endregion

// #region 6. State Management
const useUploadState = (): [UploadState, (updates: Partial<UploadState>) => void] => {
  const [state, setState] = useState<UploadState>({
    isUploading: false,
    uploadProgress: 0,
  });

  const updateState = (updates: Partial<UploadState>) => {
    setState(prev => ({ ...prev, ...updates }));
  };

  return [state, updateState];
};
// #endregion

// #region 7. Domain Logic
const useImageManagement = (
  images: string[],
  maxImages: number,
  onImageAdd: (uri: string) => void,
  onImageRemove: (index: number) => void,
) => {
  const [uploadState, updateUploadState] = useUploadState();

  const handleAddImage = () => {
    if (images.length >= maxImages) {
      Alert.alert('图片数量限制', `最多只能上传${maxImages}张图片`);
      return;
    }

    showImagePicker((uri: string) => {
      updateUploadState({ isUploading: true });
      
      // 模拟上传过程
      setTimeout(() => {
        onImageAdd(uri);
        updateUploadState({ isUploading: false, uploadProgress: 0 });
      }, 1000);
    });
  };

  const handleRemoveImage = (index: number) => {
    confirmImageRemoval(index, onImageRemove);
  };

  const handleImagePress = (uri: string) => {
    // 这里可以实现图片预览功能
    console.log('Preview image:', uri);
  };

  return {
    uploadState,
    handleAddImage,
    handleRemoveImage,
    handleImagePress,
  };
};
// #endregion

// #region 8. UI Components & Rendering
/**
 * 已上传图片组件
 */
const UploadedImage: React.FC<{
  uri: string;
  index: number;
  onRemove: (index: number) => void;
  onPress: (uri: string) => void;
}> = ({ uri, index, onRemove, onPress }) => (
  <View style={styles.imageContainer}>
    <TouchableOpacity
      style={styles.imageWrapper}
      onPress={() => onPress(uri)}
      activeOpacity={0.8}
    >
      <Image source={{ uri }} style={styles.uploadedImage} />
    </TouchableOpacity>
    
    <TouchableOpacity
      style={styles.removeButton}
      onPress={() => onRemove(index)}
      hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
    >
      <Text style={styles.removeButtonText}>×</Text>
    </TouchableOpacity>
  </View>
);

/**
 * 添加图片按钮组件
 */
const AddImageButton: React.FC<{
  onPress: () => void;
  isUploading: boolean;
}> = ({ onPress, isUploading }) => (
  <TouchableOpacity
    style={[styles.addButton, { opacity: isUploading ? 0.5 : 1 }]}
    onPress={onPress}
    disabled={isUploading}
    activeOpacity={0.7}
  >
    <Text style={styles.addButtonIcon}>
      {isUploading ? '⟳' : '+'}
    </Text>
  </TouchableOpacity>
);

/**
 * 图片上传区域主组件
 */
const ImageUploadArea: React.FC<ImageUploadAreaProps> = ({
  images,
  maxImages,
  onImageAdd,
  onImageRemove,
}) => {
  const {
    uploadState,
    handleAddImage,
    handleRemoveImage,
    handleImagePress,
  } = useImageManagement(images, maxImages, onImageAdd, onImageRemove);

  const canAddMore = images.length < maxImages;

  return (
    <View style={styles.container}>
      {/* 区域标题 */}
      <View style={styles.titleContainer}>
        <Text style={styles.sectionTitle}>
          {REPORT_CONSTANTS.TEXT.IMAGE_UPLOAD_TITLE}
        </Text>
        <Text style={styles.subtitle}>
          {REPORT_CONSTANTS.TEXT.IMAGE_UPLOAD_SUBTITLE}
        </Text>
      </View>

      {/* 图片列表 */}
      <View style={styles.imageList}>
        {/* 已上传的图片 */}
        {images.map((uri, index) => (
          <UploadedImage
            key={`${uri}_${index}`}
            uri={uri}
            index={index}
            onRemove={handleRemoveImage}
            onPress={handleImagePress}
          />
        ))}

        {/* 添加图片按钮 */}
        {canAddMore && (
          <AddImageButton
            onPress={handleAddImage}
            isUploading={uploadState.isUploading}
          />
        )}
      </View>

      {/* 提示信息 */}
      {images.length === 0 && (
        <Text style={styles.hintText}>
          可上传图片作为举报证据，最多{maxImages}张
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: REPORT_CONSTANTS.UI.SPACING.MD,
    paddingTop: REPORT_CONSTANTS.UI.SPACING.XL,
    paddingBottom: REPORT_CONSTANTS.UI.SPACING.LG,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginBottom: REPORT_CONSTANTS.UI.SPACING.MD,
  },
  sectionTitle: {
    fontSize: REPORT_CONSTANTS.UI.FONTS.LARGE,
    color: REPORT_CONSTANTS.UI.COLORS.TEXT_PRIMARY,
    fontWeight: '600',
  },
  subtitle: {
    fontSize: REPORT_CONSTANTS.UI.FONTS.REGULAR,
    color: REPORT_CONSTANTS.UI.COLORS.TEXT_PLACEHOLDER,
    marginLeft: REPORT_CONSTANTS.UI.SPACING.SM,
  },
  imageList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: REPORT_CONSTANTS.UI.SPACING.MD,
  },
  imageContainer: {
    position: 'relative',
  },
  imageWrapper: {
    borderRadius: REPORT_CONSTANTS.UI.SIZES.CARD_BORDER_RADIUS,
    overflow: 'hidden',
  },
  uploadedImage: {
    width: IMAGE_SIZE,
    height: IMAGE_SIZE,
    borderRadius: REPORT_CONSTANTS.UI.SIZES.CARD_BORDER_RADIUS,
  },
  removeButton: {
    position: 'absolute',
    top: -8,
    right: -8,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: REPORT_CONSTANTS.UI.COLORS.ERROR,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 4,
  },
  removeButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: 'bold',
    lineHeight: 16,
  },
  addButton: {
    width: ADD_BUTTON_SIZE,
    height: ADD_BUTTON_SIZE,
    borderRadius: REPORT_CONSTANTS.UI.SIZES.CARD_BORDER_RADIUS,
    borderWidth: 2,
    borderStyle: 'dashed',
    borderColor: REPORT_CONSTANTS.UI.COLORS.BORDER,
    backgroundColor: REPORT_CONSTANTS.UI.COLORS.INPUT_BACKGROUND,
    justifyContent: 'center',
    alignItems: 'center',
  },
  addButtonIcon: {
    fontSize: 32,
    color: REPORT_CONSTANTS.UI.COLORS.TEXT_PLACEHOLDER,
    fontWeight: '300',
  },
  hintText: {
    fontSize: REPORT_CONSTANTS.UI.FONTS.SMALL,
    color: REPORT_CONSTANTS.UI.COLORS.TEXT_PLACEHOLDER,
    marginTop: REPORT_CONSTANTS.UI.SPACING.SM,
    lineHeight: 18,
  },
});
// #endregion

// #region 9. Exports
export default ImageUploadArea;
export { ImageUploadArea };
// #endregion
