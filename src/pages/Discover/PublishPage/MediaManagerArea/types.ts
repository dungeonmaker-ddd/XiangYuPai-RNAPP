/**
 * 媒体管理区域类型定义
 * 
 * 定义媒体管理相关的类型和接口
 */

// #region 1. 媒体管理组件类型
/**
 * 媒体管理区域Props
 */
export interface MediaManagerAreaProps {
  mediaItems: MediaItem[];
  onAddMedia: () => void;
  onRemoveMedia: (id: string) => void;
  onEditMedia: (id: string) => void;
  maxItems?: number;
  allowedTypes?: MediaType[];
  disabled?: boolean;
  loading?: boolean;
}

/**
 * 媒体项类型
 */
export interface MediaItem {
  id: string;
  type: MediaType;
  uri: string;
  fileName: string;
  fileSize: number;
  width?: number;
  height?: number;
  duration?: number; // 视频时长（秒）
  thumbnailUri?: string;
  uploadProgress: number;
  uploadStatus: MediaUploadStatus;
  uploadError?: string;
  createdAt: Date;
}

/**
 * 媒体类型
 */
export type MediaType = 'image' | 'video';

/**
 * 媒体上传状态
 */
export type MediaUploadStatus = 'pending' | 'uploading' | 'uploaded' | 'failed';

/**
 * 媒体缩略图Props
 */
export interface MediaThumbnailProps {
  item: MediaItem;
  onRemove: (id: string) => void;
  onEdit: (id: string) => void;
  size?: number;
  disabled?: boolean;
  showProgress?: boolean;
}

/**
 * 添加媒体按钮Props
 */
export interface AddMediaButtonProps {
  onPress: () => void;
  disabled?: boolean;
  maxItems?: number;
  currentCount?: number;
  size?: number;
}
// #endregion

// #region 2. 媒体选择器类型
/**
 * 媒体选择器配置
 */
export interface MediaSelectorConfig {
  mediaType: 'photo' | 'video' | 'mixed';
  selectionLimit: number;
  quality: number;
  allowsEditing: boolean;
  includeBase64: boolean;
  includeExtra: boolean;
}

/**
 * 媒体选择结果
 */
export interface MediaPickerResult {
  assets: MediaAsset[];
  didCancel: boolean;
  errorMessage?: string;
}

/**
 * 媒体资源
 */
export interface MediaAsset {
  uri: string;
  type: MediaType;
  fileName?: string;
  fileSize?: number;
  width?: number;
  height?: number;
  duration?: number;
  base64?: string;
}

/**
 * 媒体权限状态
 */
export interface MediaPermissions {
  camera: PermissionStatus;
  photoLibrary: PermissionStatus;
  microphone: PermissionStatus;
}

/**
 * 权限状态
 */
export type PermissionStatus = 'granted' | 'denied' | 'pending' | 'unknown';
// #endregion

// #region 3. 媒体编辑类型
/**
 * 媒体编辑选项
 */
export interface MediaEditOptions {
  allowCrop: boolean;
  allowRotate: boolean;
  allowFilter: boolean;
  cropAspectRatio?: number;
  quality: number;
  maxWidth?: number;
  maxHeight?: number;
}

/**
 * 媒体编辑结果
 */
export interface MediaEditResult {
  uri: string;
  width: number;
  height: number;
  fileSize: number;
  cancelled: boolean;
}

/**
 * 图片裁剪配置
 */
export interface ImageCropConfig {
  x: number;
  y: number;
  width: number;
  height: number;
  aspectRatio?: number;
}

/**
 * 视频编辑配置
 */
export interface VideoEditConfig {
  startTime: number;
  endTime: number;
  quality: 'low' | 'medium' | 'high';
}
// #endregion

// #region 4. 媒体处理类型
/**
 * 媒体压缩配置
 */
export interface MediaCompressionConfig {
  quality: number;
  maxWidth: number;
  maxHeight: number;
  format: 'jpeg' | 'png' | 'webp';
  enableResize: boolean;
}

/**
 * 媒体上传配置
 */
export interface MediaUploadConfig {
  endpoint: string;
  headers: Record<string, string>;
  formData: Record<string, any>;
  timeout: number;
  retryCount: number;
  chunkSize: number;
}

/**
 * 媒体上传进度
 */
export interface MediaUploadProgress {
  loaded: number;
  total: number;
  percentage: number;
  speed: number; // bytes/second
  timeRemaining: number; // seconds
}

/**
 * 媒体上传结果
 */
export interface MediaUploadResult {
  id: string;
  url: string;
  thumbnailUrl?: string;
  metadata: MediaMetadata;
}

/**
 * 媒体元数据
 */
export interface MediaMetadata {
  fileName: string;
  fileSize: number;
  mimeType: string;
  width?: number;
  height?: number;
  duration?: number;
  format: string;
  uploadedAt: Date;
}
// #endregion

// #region 5. 事件处理类型
/**
 * 媒体管理事件
 */
export type MediaManagerEvent = 
  | { type: 'MEDIA_ADD'; payload: MediaItem[] }
  | { type: 'MEDIA_REMOVE'; payload: string }
  | { type: 'MEDIA_EDIT'; payload: { id: string; data: Partial<MediaItem> } }
  | { type: 'UPLOAD_START'; payload: string }
  | { type: 'UPLOAD_PROGRESS'; payload: { id: string; progress: MediaUploadProgress } }
  | { type: 'UPLOAD_SUCCESS'; payload: { id: string; result: MediaUploadResult } }
  | { type: 'UPLOAD_ERROR'; payload: { id: string; error: string } }
  | { type: 'PERMISSION_REQUEST'; payload: keyof MediaPermissions }
  | { type: 'PERMISSION_GRANTED'; payload: keyof MediaPermissions }
  | { type: 'PERMISSION_DENIED'; payload: keyof MediaPermissions };

/**
 * 媒体管理回调函数
 */
export interface MediaManagerCallbacks {
  onMediaAdd?: (items: MediaItem[]) => void;
  onMediaRemove?: (id: string) => void;
  onMediaEdit?: (id: string, data: Partial<MediaItem>) => void;
  onUploadStart?: (id: string) => void;
  onUploadProgress?: (id: string, progress: MediaUploadProgress) => void;
  onUploadSuccess?: (id: string, result: MediaUploadResult) => void;
  onUploadError?: (id: string, error: string) => void;
  onPermissionRequest?: (permission: keyof MediaPermissions) => void;
  onPermissionResult?: (permission: keyof MediaPermissions, granted: boolean) => void;
}
// #endregion

// #region 6. 验证和限制类型
/**
 * 媒体验证规则
 */
export interface MediaValidationRules {
  maxFileSize: number;
  maxDuration: number; // 视频最大时长
  allowedFormats: string[];
  maxWidth: number;
  maxHeight: number;
  minWidth: number;
  minHeight: number;
}

/**
 * 媒体验证结果
 */
export interface MediaValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
}

/**
 * 媒体限制配置
 */
export interface MediaLimits {
  maxItems: number;
  maxTotalSize: number;
  allowedTypes: MediaType[];
  imageMaxSize: number;
  videoMaxSize: number;
  videoMaxDuration: number;
}
// #endregion
