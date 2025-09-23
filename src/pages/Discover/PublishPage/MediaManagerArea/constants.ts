/**
 * 媒体管理区域常量配置
 * 
 * 定义媒体管理的所有常量配置
 */

// #region 1. 媒体限制常量
export const MEDIA_LIMITS = {
  MAX_ITEMS: 9,
  MAX_FILE_SIZE: 10 * 1024 * 1024, // 10MB
  MAX_VIDEO_SIZE: 100 * 1024 * 1024, // 100MB
  MAX_VIDEO_DURATION: 60, // 60秒
  MAX_TOTAL_SIZE: 500 * 1024 * 1024, // 500MB
  THUMBNAIL_SIZE: 120,
} as const;

export const IMAGE_LIMITS = {
  MAX_WIDTH: 2048,
  MAX_HEIGHT: 2048,
  MIN_WIDTH: 100,
  MIN_HEIGHT: 100,
  QUALITY: 0.8,
} as const;

export const VIDEO_LIMITS = {
  MAX_WIDTH: 1920,
  MAX_HEIGHT: 1080,
  MIN_WIDTH: 240,
  MIN_HEIGHT: 240,
  MAX_DURATION: 60,
  QUALITY: 'medium',
} as const;
// #endregion

// #region 2. 支持的格式
export const SUPPORTED_FORMATS = {
  IMAGE: ['jpg', 'jpeg', 'png', 'webp', 'heic'],
  VIDEO: ['mp4', 'mov', 'avi', 'mkv', '3gp'],
  MIME_TYPES: {
    IMAGE: ['image/jpeg', 'image/png', 'image/webp', 'image/heic'],
    VIDEO: ['video/mp4', 'video/quicktime', 'video/avi', 'video/x-msvideo'],
  },
} as const;
// #endregion

// #region 3. UI尺寸常量
export const MEDIA_UI = {
  THUMBNAIL_SIZE: 120,
  THUMBNAIL_RADIUS: 8,
  ADD_BUTTON_SIZE: 120,
  ADD_BUTTON_RADIUS: 8,
  CONTAINER_PADDING: 16,
  ITEM_SPACING: 12,
  GRID_COLUMNS: 3,
  PROGRESS_HEIGHT: 4,
  OVERLAY_OPACITY: 0.7,
} as const;

export const MEDIA_COLORS = {
  BACKGROUND: '#FFFFFF',
  BORDER: '#E5E5E5',
  ADD_BUTTON_BG: '#F8F8F8',
  ADD_BUTTON_BORDER: '#DDDDDD',
  ADD_ICON: '#CCCCCC',
  OVERLAY: 'rgba(0, 0, 0, 0.5)',
  PROGRESS_BG: 'rgba(255, 255, 255, 0.3)',
  PROGRESS_FILL: '#8A2BE2',
  ERROR: '#FF3B30',
  SUCCESS: '#34C759',
  WARNING: '#FF9500',
} as const;
// #endregion

// #region 4. 上传状态常量
export const UPLOAD_STATUS = {
  PENDING: 'pending',
  UPLOADING: 'uploading',
  UPLOADED: 'uploaded',
  FAILED: 'failed',
} as const;

export const UPLOAD_CONFIG = {
  CHUNK_SIZE: 1024 * 1024, // 1MB
  TIMEOUT: 30000, // 30秒
  RETRY_COUNT: 3,
  RETRY_DELAY: 1000, // 1秒
  CONCURRENT_UPLOADS: 2,
} as const;
// #endregion

// #region 5. 媒体选择器配置
export const PICKER_CONFIG = {
  QUALITY: 0.8,
  SELECTION_LIMIT: 9,
  INCLUDE_BASE64: false,
  INCLUDE_EXTRA: true,
  ALLOWS_EDITING: true,
  CAMERA_TYPE: 'back',
  FLASH_MODE: 'auto',
} as const;

export const PICKER_OPTIONS = {
  CAMERA: {
    mediaType: 'mixed',
    includeBase64: false,
    maxHeight: 2000,
    maxWidth: 2000,
    quality: 0.8,
  },
  LIBRARY: {
    mediaType: 'mixed',
    includeBase64: false,
    maxHeight: 2000,
    maxWidth: 2000,
    quality: 0.8,
    selectionLimit: 9,
  },
} as const;
// #endregion

// #region 6. 权限相关常量
export const PERMISSION_TYPES = {
  CAMERA: 'camera',
  PHOTO_LIBRARY: 'photoLibrary',
  MICROPHONE: 'microphone',
} as const;

export const PERMISSION_STATUS = {
  GRANTED: 'granted',
  DENIED: 'denied',
  PENDING: 'pending',
  UNKNOWN: 'unknown',
} as const;

export const PERMISSION_MESSAGES = {
  CAMERA_DENIED: '需要相机权限以拍照，请在设置中开启',
  PHOTO_DENIED: '需要相册权限以选择照片，请在设置中开启',
  MICROPHONE_DENIED: '需要麦克风权限以录制视频，请在设置中开启',
} as const;
// #endregion

// #region 7. 错误消息常量
export const ERROR_MESSAGES = {
  FILE_TOO_LARGE: '文件大小超过限制',
  FORMAT_NOT_SUPPORTED: '不支持的文件格式',
  VIDEO_TOO_LONG: '视频时长超过限制',
  RESOLUTION_TOO_HIGH: '图片分辨率超过限制',
  RESOLUTION_TOO_LOW: '图片分辨率过低',
  UPLOAD_FAILED: '上传失败，请重试',
  NETWORK_ERROR: '网络连接异常',
  SERVER_ERROR: '服务器错误',
  PERMISSION_DENIED: '权限被拒绝',
  MAX_ITEMS_EXCEEDED: '媒体数量超过限制',
  PROCESSING_ERROR: '媒体处理失败',
} as const;

export const SUCCESS_MESSAGES = {
  UPLOAD_SUCCESS: '上传成功',
  PROCESSING_SUCCESS: '处理完成',
  PERMISSION_GRANTED: '权限已授予',
} as const;
// #endregion

// #region 8. 按钮文本常量
export const BUTTON_TEXTS = {
  ADD_MEDIA: '添加图片',
  ADD_PHOTO: '添加照片',
  ADD_VIDEO: '添加视频',
  TAKE_PHOTO: '拍照',
  RECORD_VIDEO: '录制视频',
  CHOOSE_FROM_LIBRARY: '从相册选择',
  EDIT: '编辑',
  DELETE: '删除',
  CROP: '裁剪',
  ROTATE: '旋转',
  FILTER: '滤镜',
  RETRY: '重试',
  CANCEL: '取消',
  CONFIRM: '确认',
  SAVE: '保存',
} as const;

export const HINT_TEXTS = {
  MAX_ITEMS: '最多可添加9张图片或视频',
  TAP_TO_EDIT: '点击编辑',
  LONG_PRESS_DELETE: '长按删除',
  UPLOADING: '上传中...',
  PROCESSING: '处理中...',
  UPLOAD_FAILED: '上传失败，点击重试',
  NO_MEDIA: '还没有添加媒体',
  DRAG_TO_REORDER: '拖拽调整顺序',
} as const;
// #endregion

// #region 9. 动画常量
export const ANIMATION = {
  DURATION_FAST: 150,
  DURATION_NORMAL: 250,
  DURATION_SLOW: 350,
  SPRING_CONFIG: {
    tension: 100,
    friction: 8,
  },
  SCALE_PRESSED: 0.95,
  OPACITY_PRESSED: 0.7,
} as const;
// #endregion
