/**
 * 发布动态页面常量配置
 * 
 * 定义发布动态系统的所有常量配置
 */

// #region 1. 页面标识常量
export const PUBLISH_PAGE_ID = 'PublishPage';
export const PUBLISH_PAGE_TITLE = '动态';
export const PUBLISH_PAGE_ROUTE = '/discover/publish';
// #endregion

// #region 2. 内容限制常量
/**
 * 内容长度限制
 */
export const CONTENT_LIMITS = {
  TITLE_MAX_LENGTH: 50,
  CONTENT_MAX_LENGTH: 1000,
  TOPIC_MAX_COUNT: 3,
  MEDIA_MAX_COUNT: 9,
  VIDEO_MAX_DURATION: 60, // 秒
  LOCATION_SEARCH_MAX_RESULTS: 20,
  TOPIC_SEARCH_MAX_RESULTS: 50,
} as const;

/**
 * 媒体文件限制
 */
export const MEDIA_LIMITS = {
  IMAGE_MAX_SIZE: 10 * 1024 * 1024, // 10MB
  VIDEO_MAX_SIZE: 100 * 1024 * 1024, // 100MB
  IMAGE_MAX_WIDTH: 2048,
  IMAGE_MAX_HEIGHT: 2048,
  VIDEO_MAX_WIDTH: 1920,
  VIDEO_MAX_HEIGHT: 1080,
  THUMBNAIL_SIZE: 200,
} as const;

/**
 * 压缩质量设置
 */
export const COMPRESSION_QUALITY = {
  IMAGE_HIGH: 0.9,
  IMAGE_MEDIUM: 0.7,
  IMAGE_LOW: 0.5,
  VIDEO_HIGH: 'high',
  VIDEO_MEDIUM: 'medium',
  VIDEO_LOW: 'low',
} as const;
// #endregion

// #region 3. UI尺寸常量
/**
 * 组件尺寸
 */
export const UI_DIMENSIONS = {
  // 导航栏
  NAVBAR_HEIGHT: 56,
  STATUS_BAR_HEIGHT: 44,
  
  // 输入框
  TITLE_INPUT_HEIGHT: 60,
  CONTENT_INPUT_MIN_HEIGHT: 120,
  CONTENT_INPUT_MAX_HEIGHT: 300,
  
  // 媒体
  MEDIA_THUMBNAIL_SIZE: 120,
  MEDIA_ADD_BUTTON_SIZE: 120,
  
  // 功能标签
  FUNCTION_TAGS_HEIGHT: 100,
  TAG_ITEM_HEIGHT: 80,
  
  // 发布控制
  PUBLISH_CONTROL_HEIGHT: 80,
  PUBLISH_BUTTON_HEIGHT: 48,
  SAFE_AREA_BOTTOM: 34,
  
  // 抽屉
  DRAWER_MAX_HEIGHT_RATIO: 0.7,
  DRAWER_BORDER_RADIUS: 20,
  
  // 地图
  MAP_PREVIEW_HEIGHT: 200,
} as const;

/**
 * 间距常量
 */
export const SPACING = {
  XS: 4,
  SM: 8,
  MD: 12,
  LG: 16,
  XL: 20,
  XXL: 24,
  XXXL: 32,
} as const;

/**
 * 圆角常量
 */
export const BORDER_RADIUS = {
  SM: 8,
  MD: 12,
  LG: 16,
  XL: 20,
  XXL: 24,
  BUTTON: 24,
  TAG: 12,
  CARD: 8,
} as const;
// #endregion

// #region 4. 颜色常量
/**
 * 主题颜色
 */
export const COLORS = {
  // 主色调
  PRIMARY: '#8A2BE2',
  PRIMARY_LIGHT: '#9370DB',
  PRIMARY_DARK: '#7B1FA2',
  
  // 辅助色
  SECONDARY: '#007AFF',
  SUCCESS: '#34C759',
  WARNING: '#FF9500',
  ERROR: '#FF3B30',
  
  // 中性色
  BLACK: '#000000',
  WHITE: '#FFFFFF',
  GRAY_900: '#333333',
  GRAY_700: '#666666',
  GRAY_500: '#999999',
  GRAY_300: '#CCCCCC',
  GRAY_200: '#DDDDDD',
  GRAY_100: '#F5F5F5',
  GRAY_50: '#F8F8F8',
  
  // 背景色
  BACKGROUND: '#FFFFFF',
  BACKGROUND_SECONDARY: '#F8F8F8',
  OVERLAY: 'rgba(0, 0, 0, 0.4)',
  SEPARATOR: '#E5E5E5',
  
  // 功能色
  LIKE: '#FF3B30',
  COLLECT: '#FF9500',
  SHARE: '#007AFF',
  COMMENT: '#666666',
} as const;

/**
 * 透明度常量
 */
export const OPACITY = {
  DISABLED: 0.3,
  OVERLAY: 0.4,
  PRESSED: 0.8,
  LOADING: 0.6,
} as const;
// #endregion

// #region 5. 动画常量
/**
 * 动画时长
 */
export const ANIMATION_DURATION = {
  FAST: 150,      // 0.15s - 快速反馈
  NORMAL: 200,    // 0.2s - 标准交互
  SLOW: 300,      // 0.3s - 页面转场
  DRAWER: 300,    // 0.3s - 抽屉动画
  BUTTON: 100,    // 0.1s - 按钮反馈
} as const;

/**
 * 缓动函数
 */
export const EASING = {
  EASE_OUT: 'ease-out',
  EASE_IN: 'ease-in',
  EASE_IN_OUT: 'ease-in-out',
  SPRING: 'spring',
} as const;
// #endregion

// #region 6. 字体常量
/**
 * 字体大小
 */
export const FONT_SIZE = {
  XS: 12,   // 提示文字
  SM: 14,   // 辅助文字
  MD: 16,   // 正文
  LG: 18,   // 标题
  XL: 20,   // 大标题
  XXL: 24,  // 特大标题
} as const;

/**
 * 字体权重
 */
export const FONT_WEIGHT = {
  NORMAL: '400',
  MEDIUM: '500',
  SEMIBOLD: '600',
  BOLD: '700',
} as const;

/**
 * 行高
 */
export const LINE_HEIGHT = {
  TIGHT: 1.2,
  NORMAL: 1.4,
  RELAXED: 1.5,
  LOOSE: 1.6,
} as const;
// #endregion

// #region 7. 功能状态常量
/**
 * 发布状态
 */
export const PUBLISH_STATUS = {
  IDLE: 'idle',
  VALIDATING: 'validating',
  UPLOADING: 'uploading',
  SUBMITTING: 'submitting',
  SUCCESS: 'success',
  ERROR: 'error',
} as const;

/**
 * 媒体状态
 */
export const MEDIA_STATUS = {
  PENDING: 'pending',
  UPLOADING: 'uploading',
  UPLOADED: 'uploaded',
  FAILED: 'failed',
} as const;

/**
 * 位置权限状态
 */
export const LOCATION_PERMISSION = {
  GRANTED: 'granted',
  DENIED: 'denied',
  PENDING: 'pending',
  UNKNOWN: 'unknown',
} as const;

/**
 * 媒体权限状态
 */
export const MEDIA_PERMISSION = {
  GRANTED: 'granted',
  DENIED: 'denied',
  PENDING: 'pending',
  UNKNOWN: 'unknown',
} as const;
// #endregion

// #region 8. 默认配置
/**
 * 默认发布数据
 */
export const DEFAULT_PUBLISH_DATA = {
  title: '',
  content: '',
  mediaIds: [],
  topicIds: [],
  location: null,
  privacy: 'public',
  allowComment: true,
  allowShare: true,
} as const;

/**
 * 默认地图区域
 */
export const DEFAULT_MAP_REGION = {
  latitude: 22.5431, // 深圳
  longitude: 114.0579,
  latitudeDelta: 0.01,
  longitudeDelta: 0.01,
} as const;

/**
 * 默认定位配置
 */
export const DEFAULT_LOCATION_CONFIG = {
  enableHighAccuracy: true,
  timeout: 10000,
  maximumAge: 60000,
  distanceFilter: 10,
} as const;

/**
 * 默认媒体配置
 */
export const DEFAULT_MEDIA_CONFIG = {
  mediaType: 'mixed',
  selectionLimit: 9,
  quality: 0.8,
  allowsEditing: true,
} as const;
// #endregion

// #region 9. 占位符文本
/**
 * 占位符文本
 */
export const PLACEHOLDER_TEXT = {
  TITLE: '添加标题',
  CONTENT: '添加正文',
  TOPIC_SEARCH: '搜索更多话题',
  LOCATION_SEARCH: '搜索地址',
  NO_TOPICS: '暂无话题',
  NO_LOCATIONS: '暂无地点',
  NO_MEDIA: '暂无媒体',
} as const;

/**
 * 按钮文本
 */
export const BUTTON_TEXT = {
  CANCEL: '取消',
  PUBLISH: '发布',
  PUBLISHING: '发布中...',
  PUBLISH_SUCCESS: '发布成功',
  DRAFT: '存草稿',
  SELECT_TOPIC: '选择话题',
  SELECT_LOCATION: '选择地点',
  AUTO_LOCATE: '自动定位',
  ADD_MEDIA: '添加图片',
  EDIT: '编辑',
  DELETE: '删除',
  ROTATE: '旋转',
  CROP: '裁剪',
  RETRY: '重试',
  CONFIRM: '确定',
} as const;

/**
 * 提示文本
 */
export const HINT_TEXT = {
  MEDIA_LIMIT: '最多可添加9张图片',
  TOPIC_LIMIT: '最多可选择3个话题',
  TITLE_LIMIT: '标题最多50个字符',
  CONTENT_LIMIT: '正文最多1000个字符',
  LOCATION_PERMISSION: '需要位置权限以获取当前位置',
  CAMERA_PERMISSION: '需要相机权限以拍照',
  PHOTO_PERMISSION: '需要相册权限以选择照片',
  NETWORK_ERROR: '网络连接异常，请检查网络设置',
  PUBLISH_SUCCESS: '动态发布成功',
  PUBLISH_ERROR: '发布失败，请重试',
  CONTENT_SECURITY: '内容包含敏感信息，请修改后重试',
  DRAFT_SAVED: '草稿已保存',
  DRAFT_LOADED: '草稿已恢复',
} as const;
// #endregion

// #region 10. 话题分类常量
/**
 * 话题分类
 */
export const TOPIC_CATEGORIES = [
  {
    id: 'recommended',
    name: '推荐',
    icon: '⭐',
    color: '#8A2BE2',
    description: '为你推荐的热门话题',
  },
  {
    id: 'game',
    name: '游戏',
    icon: '🎮',
    color: '#007AFF',
    description: '游戏相关话题',
  },
  {
    id: 'entertainment',
    name: '娱乐',
    icon: '🎬',
    color: '#FF3B30',
    description: '娱乐八卦话题',
  },
  {
    id: 'life',
    name: '生活',
    icon: '🏠',
    color: '#34C759',
    description: '日常生活话题',
  },
  {
    id: 'food',
    name: '探店',
    icon: '🍔',
    color: '#FF9500',
    description: '美食探店话题',
  },
  {
    id: 'hot',
    name: '热门',
    icon: '🔥',
    color: '#FF6B35',
    description: '当前热门话题',
  },
] as const;
// #endregion

// #region 11. API端点常量
/**
 * API端点
 */
export const API_ENDPOINTS = {
  // 发布相关
  PUBLISH_POST: '/api/v1/posts',
  UPLOAD_MEDIA: '/api/v1/media/upload',
  
  // 话题相关
  SEARCH_TOPICS: '/api/v1/topics/search',
  GET_TOPIC_CATEGORIES: '/api/v1/topics/categories',
  GET_HOT_TOPICS: '/api/v1/topics/hot',
  GET_RECOMMENDED_TOPICS: '/api/v1/topics/recommended',
  
  // 地点相关
  SEARCH_LOCATIONS: '/api/v1/locations/search',
  GET_NEARBY_LOCATIONS: '/api/v1/locations/nearby',
  GEOCODE: '/api/v1/locations/geocode',
  REVERSE_GEOCODE: '/api/v1/locations/reverse-geocode',
  
  // 草稿相关
  SAVE_DRAFT: '/api/v1/drafts',
  GET_DRAFTS: '/api/v1/drafts',
  DELETE_DRAFT: '/api/v1/drafts/:id',
  
  // 内容安全
  CONTENT_SECURITY: '/api/v1/security/content',
  MEDIA_SECURITY: '/api/v1/security/media',
} as const;
// #endregion

// #region 12. 错误代码常量
/**
 * 错误代码
 */
export const ERROR_CODES = {
  // 网络错误
  NETWORK_ERROR: 'NETWORK_ERROR',
  TIMEOUT_ERROR: 'TIMEOUT_ERROR',
  
  // 内容错误
  CONTENT_TOO_LONG: 'CONTENT_TOO_LONG',
  CONTENT_EMPTY: 'CONTENT_EMPTY',
  CONTENT_SECURITY_VIOLATION: 'CONTENT_SECURITY_VIOLATION',
  
  // 媒体错误
  MEDIA_TOO_LARGE: 'MEDIA_TOO_LARGE',
  MEDIA_FORMAT_UNSUPPORTED: 'MEDIA_FORMAT_UNSUPPORTED',
  MEDIA_UPLOAD_FAILED: 'MEDIA_UPLOAD_FAILED',
  
  // 权限错误
  LOCATION_PERMISSION_DENIED: 'LOCATION_PERMISSION_DENIED',
  CAMERA_PERMISSION_DENIED: 'CAMERA_PERMISSION_DENIED',
  PHOTO_PERMISSION_DENIED: 'PHOTO_PERMISSION_DENIED',
  
  // 服务器错误
  SERVER_ERROR: 'SERVER_ERROR',
  VALIDATION_ERROR: 'VALIDATION_ERROR',
  RATE_LIMIT_EXCEEDED: 'RATE_LIMIT_EXCEEDED',
} as const;
// #endregion

// 导出所有常量
export * from './ContentEditorArea/constants';
export * from './MediaManagerArea/constants';
export * from './FunctionTagsArea/constants';
export * from './PublishControlArea/constants';
// export * from './LocationSelectorDrawer/constants'; // 文件不存在，暂时注释
// export * from './TopicSelectorPage/constants'; // 文件不存在，暂时注释
