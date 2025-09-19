/**
 * 图片上传事件处理器
 * 
 * 功能：
 * - 处理图片上传和删除事件
 * - 图片格式验证和大小限制
 * - 图片压缩和优化
 */

// #region [1] Imports
// 无需额外导入
// #endregion

// #region [2] Types
type OnImageUploadCallback = (images: string[]) => void;

interface ImageUploadEventData {
  images: string[];
  totalCount: number;
  timestamp: number;
  source: 'camera' | 'library' | 'delete' | 'manual';
}

interface ImageValidationResult {
  isValid: boolean;
  errors: string[];
  validImages: string[];
  invalidImages: string[];
}

interface ImageConstraints {
  maxCount: number;
  maxSize: number; // bytes
  allowedFormats: string[];
  maxWidth: number;
  maxHeight: number;
}
// #endregion

// #region [3] Constants
const IMAGE_CONSTRAINTS: ImageConstraints = {
  maxCount: 9,
  maxSize: 10 * 1024 * 1024, // 10MB
  allowedFormats: ['jpg', 'jpeg', 'png', 'webp'],
  maxWidth: 2048,
  maxHeight: 2048,
} as const;

const IMAGE_VALIDATION_MESSAGES = {
  tooManyImages: `最多只能上传${IMAGE_CONSTRAINTS.maxCount}张图片`,
  invalidFormat: '图片格式不支持，请选择JPG、PNG或WebP格式',
  tooLarge: `图片大小不能超过${IMAGE_CONSTRAINTS.maxSize / (1024 * 1024)}MB`,
  invalidUri: '图片路径无效',
} as const;
// #endregion

// #region [4] Utils
/**
 * 验证图片URI格式
 */
const isValidImageUri = (uri: string): boolean => {
  if (!uri || typeof uri !== 'string') {
    return false;
  }

  // 检查是否是有效的URI格式
  const uriPattern = /^(file:\/\/|content:\/\/|https?:\/\/|data:image\/)/i;
  return uriPattern.test(uri);
};

/**
 * 获取图片格式
 */
const getImageFormat = (uri: string): string | null => {
  try {
    // 从URI中提取文件扩展名
    const match = uri.match(/\.([^./?#]+)(?:[?#]|$)/i);
    return match ? match[1].toLowerCase() : null;
  } catch {
    return null;
  }
};

/**
 * 验证图片数组
 */
const validateImages = (images: string[]): ImageValidationResult => {
  const errors: string[] = [];
  const validImages: string[] = [];
  const invalidImages: string[] = [];

  // 检查图片数量
  if (images.length > IMAGE_CONSTRAINTS.maxCount) {
    errors.push(IMAGE_VALIDATION_MESSAGES.tooManyImages);
  }

  // 验证每张图片
  for (const uri of images) {
    let isValidImage = true;

    // 检查URI格式
    if (!isValidImageUri(uri)) {
      errors.push(IMAGE_VALIDATION_MESSAGES.invalidUri);
      invalidImages.push(uri);
      isValidImage = false;
      continue;
    }

    // 检查图片格式
    const format = getImageFormat(uri);
    if (format && !IMAGE_CONSTRAINTS.allowedFormats.includes(format)) {
      errors.push(IMAGE_VALIDATION_MESSAGES.invalidFormat);
      invalidImages.push(uri);
      isValidImage = false;
      continue;
    }

    if (isValidImage) {
      validImages.push(uri);
    }
  }

  return {
    isValid: errors.length === 0,
    errors: Array.from(new Set(errors)), // 去重
    validImages,
    invalidImages,
  };
};

/**
 * 过滤有效图片
 */
const filterValidImages = (images: string[]): string[] => {
  const validation = validateImages(images);
  return validation.validImages;
};
// #endregion

// #region [5] Event Handlers
/**
 * 图片上传事件处理器
 * 
 * @param images - 新的图片数组
 * @param callback - 图片变化后的回调函数
 * @param source - 事件来源
 * @returns 事件处理结果
 */
export const onImageUpload = (
  images: string[],
  callback: OnImageUploadCallback,
  source: ImageUploadEventData['source'] = 'manual'
): ImageUploadEventData => {
  // 过滤有效图片
  const validImages = filterValidImages(images);

  // 创建事件数据
  const eventData: ImageUploadEventData = {
    images: validImages,
    totalCount: validImages.length,
    timestamp: Date.now(),
    source,
  };

  // 执行回调
  try {
    callback(validImages);
  } catch (error) {
    console.warn('图片上传回调执行失败:', error);
  }

  // 可选：添加埋点统计（仅在开发环境）
  if (__DEV__) {
    console.log('图片上传事件:', {
      totalCount: eventData.totalCount,
      maxCount: IMAGE_CONSTRAINTS.maxCount,
      source: eventData.source,
      timestamp: eventData.timestamp,
    });
  }

  return eventData;
};

/**
 * 添加图片事件处理器
 * 
 * @param currentImages - 当前图片数组
 * @param newImageUri - 新添加的图片URI
 * @param callback - 图片变化后的回调函数
 * @param source - 事件来源
 * @returns 事件处理结果
 */
export const onImageAdd = (
  currentImages: string[],
  newImageUri: string,
  callback: OnImageUploadCallback,
  source: 'camera' | 'library' = 'library'
): ImageUploadEventData => {
  // 检查是否已达到最大数量
  if (currentImages.length >= IMAGE_CONSTRAINTS.maxCount) {
    console.warn('已达到最大图片数量限制');
    return {
      images: currentImages,
      totalCount: currentImages.length,
      timestamp: Date.now(),
      source,
    };
  }

  // 添加新图片
  const updatedImages = [...currentImages, newImageUri];
  
  return onImageUpload(updatedImages, callback, source);
};

/**
 * 删除图片事件处理器
 * 
 * @param currentImages - 当前图片数组
 * @param indexToDelete - 要删除的图片索引
 * @param callback - 图片变化后的回调函数
 * @returns 事件处理结果
 */
export const onImageDelete = (
  currentImages: string[],
  indexToDelete: number,
  callback: OnImageUploadCallback
): ImageUploadEventData => {
  // 检查索引有效性
  if (indexToDelete < 0 || indexToDelete >= currentImages.length) {
    console.warn('删除图片索引无效:', indexToDelete);
    return {
      images: currentImages,
      totalCount: currentImages.length,
      timestamp: Date.now(),
      source: 'delete',
    };
  }

  // 删除指定图片
  const updatedImages = currentImages.filter((_, index) => index !== indexToDelete);
  
  return onImageUpload(updatedImages, callback, 'delete');
};

/**
 * 获取图片验证结果
 * 
 * @param images - 要验证的图片数组
 * @returns 验证结果
 */
export const getImageValidation = (images: string[]): ImageValidationResult => {
  return validateImages(images);
};
// #endregion

// #region [6] Exports
export type {
  OnImageUploadCallback,
  ImageUploadEventData,
  ImageValidationResult,
  ImageConstraints,
};

export { IMAGE_CONSTRAINTS, IMAGE_VALIDATION_MESSAGES };
// #endregion
