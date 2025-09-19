/**
 * 举报模块常量配置
 * 
 * 包含所有举报相关的常量定义和配置项
 */

// #region [1] Imports
import {
  ReportConfig,
  ImageConstraints,
  ValidationRules,
  ReportThemeColors,
  ReportComponentSizes,
  ReportSpacing,
} from './types';
// #endregion

// #region [2] 基础常量
/**
 * 举报类型ID常量
 */
export const REPORT_TYPE_IDS = {
  HARASSMENT: 'harassment',
  ADULT_CONTENT: 'adult_content',
  FRAUD: 'fraud',
  ILLEGAL: 'illegal',
  FALSE_INFO: 'false_info',
  MINOR_RELATED: 'minor_related',
  INAPPROPRIATE: 'inappropriate',
  OTHER: 'other',
} as const;

/**
 * 举报状态常量
 */
export const REPORT_STATUS = {
  PENDING: 'pending',
  REVIEWING: 'reviewing',
  APPROVED: 'approved',
  REJECTED: 'rejected',
  CLOSED: 'closed',
} as const;

/**
 * 举报目标类型常量
 */
export const REPORT_TARGET_TYPES = {
  USER: 'user',
  CONTENT: 'content',
  COMMENT: 'comment',
  POST: 'post',
} as const;
// #endregion

// #region [3] 配置常量
/**
 * 举报模块主要配置
 */
export const REPORT_CONFIG: ReportConfig = {
  maxDescriptionLength: 200,
  maxImages: 9,
  allowedImageFormats: ['jpg', 'jpeg', 'png', 'webp'],
  maxImageSize: 10 * 1024 * 1024, // 10MB
  submitTimeout: 30000, // 30秒
  retryAttempts: 3,
} as const;

/**
 * 图片约束配置
 */
export const IMAGE_CONSTRAINTS: ImageConstraints = {
  maxCount: REPORT_CONFIG.maxImages,
  maxSize: REPORT_CONFIG.maxImageSize,
  allowedFormats: REPORT_CONFIG.allowedImageFormats,
  maxWidth: 2048,
  maxHeight: 2048,
  quality: 0.8,
} as const;

/**
 * 表单验证规则
 */
export const VALIDATION_RULES: ValidationRules = {
  description: {
    minLength: 1,
    maxLength: REPORT_CONFIG.maxDescriptionLength,
    required: true,
  },
  images: {
    maxCount: REPORT_CONFIG.maxImages,
    required: false,
  },
  type: {
    required: true,
  },
} as const;
// #endregion

// #region [4] UI主题配置
/**
 * 主题颜色配置
 */
export const THEME_COLORS: ReportThemeColors = {
  primary: '#8A2BE2',
  secondary: '#6A1B9A',
  success: '#4CAF50',
  warning: '#FF9800',
  error: '#F44336',
  text: {
    primary: '#333333',
    secondary: '#666666',
    disabled: '#999999',
    placeholder: '#CCCCCC',
  },
  background: {
    primary: '#FFFFFF',
    secondary: '#F5F5F5',
    modal: '#FFFFFF',
    overlay: 'rgba(0, 0, 0, 0.5)',
  },
  border: {
    default: '#E0E0E0',
    active: '#8A2BE2',
    error: '#F44336',
  },
} as const;

/**
 * 组件尺寸配置
 */
export const COMPONENT_SIZES: ReportComponentSizes = {
  header: {
    height: 56,
  },
  card: {
    height: 56,
    borderRadius: 12,
  },
  input: {
    minHeight: 200,
    borderRadius: 12,
    padding: 16,
  },
  image: {
    size: 120,
    borderRadius: 12,
  },
  button: {
    height: 44,
    borderRadius: 8,
    padding: 16,
  },
  modal: {
    width: 280,
    height: 200,
    borderRadius: 16,
  },
} as const;

/**
 * 间距配置
 */
export const SPACING: ReportSpacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  container: 16,
  section: 32,
} as const;
// #endregion

// #region [5] 动画配置
/**
 * 动画时长配置
 */
export const ANIMATION_DURATION = {
  fast: 150,
  normal: 200,
  slow: 300,
  modal: 300,
} as const;

/**
 * 动画缓动函数
 */
export const ANIMATION_EASING = {
  easeInOut: 'ease-in-out',
  easeIn: 'ease-in',
  easeOut: 'ease-out',
  linear: 'linear',
} as const;
// #endregion

// #region [6] 网络配置
/**
 * API配置
 */
export const API_CONFIG = {
  baseUrl: 'https://api.example.com',
  timeout: REPORT_CONFIG.submitTimeout,
  retryAttempts: REPORT_CONFIG.retryAttempts,
  retryDelay: 1000,
} as const;

/**
 * API端点
 */
export const API_ENDPOINTS = {
  submitReport: '/reports',
  getReportTypes: '/reports/types',
  uploadImage: '/upload/images',
  getReportStatus: '/reports/{reportId}/status',
} as const;

/**
 * HTTP状态码
 */
export const HTTP_STATUS_CODES = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  TOO_MANY_REQUESTS: 429,
  INTERNAL_SERVER_ERROR: 500,
} as const;
// #endregion

// #region [7] 错误信息
/**
 * 错误信息常量
 */
export const ERROR_MESSAGES = {
  NETWORK_ERROR: '网络连接失败，请检查网络后重试',
  TIMEOUT_ERROR: '请求超时，请重试',
  SERVER_ERROR: '服务器繁忙，请稍后重试',
  VALIDATION_ERROR: '输入信息有误，请检查后重试',
  RATE_LIMIT_ERROR: '操作过于频繁，请稍后再试',
  DUPLICATE_ERROR: '请勿重复提交',
  UNKNOWN_ERROR: '操作失败，请稍后重试',
  
  // 表单验证错误
  TYPE_REQUIRED: '请选择举报类型',
  DESCRIPTION_REQUIRED: '请填写举报描述',
  DESCRIPTION_TOO_LONG: `举报描述不能超过${REPORT_CONFIG.maxDescriptionLength}字`,
  IMAGES_TOO_MANY: `最多只能上传${REPORT_CONFIG.maxImages}张图片`,
  IMAGE_FORMAT_ERROR: '图片格式不支持，请选择JPG、PNG或WebP格式',
  IMAGE_SIZE_ERROR: `图片大小不能超过${REPORT_CONFIG.maxImageSize / (1024 * 1024)}MB`,
} as const;

/**
 * 成功信息常量
 */
export const SUCCESS_MESSAGES = {
  SUBMIT_SUCCESS: '举报提交成功',
  UPLOAD_SUCCESS: '图片上传成功',
  VALIDATION_SUCCESS: '信息验证通过',
} as const;
// #endregion

// #region [8] 默认值
/**
 * 默认配置值
 */
export const DEFAULT_VALUES = {
  placeholder: {
    description: '请描述你举报的原因',
    search: '搜索举报类型',
  },
  modal: {
    title: '确认提交举报？',
    message: '提交后我们会尽快处理',
    confirmText: '确认',
    cancelText: '取消',
  },
  loading: {
    text: '加载中...',
    submitting: '提交中...',
    uploading: '上传中...',
  },
  empty: {
    text: '暂无数据',
    description: '没有找到相关内容',
  },
} as const;
// #endregion

// #region [9] 测试ID
/**
 * 测试ID常量（用于自动化测试）
 */
export const TEST_IDS = {
  // 页面
  reportScreen: 'report-screen',
  
  // 头部
  header: 'report-header',
  backButton: 'report-back-button',
  submitButton: 'report-submit-button',
  
  // 组件
  typeSelector: 'report-type-selector',
  descriptionInput: 'report-description-input',
  imageUploader: 'report-image-uploader',
  confirmModal: 'report-confirm-modal',
  
  // 按钮
  confirmButton: 'report-confirm-button',
  cancelButton: 'report-cancel-button',
  addImageButton: 'report-add-image-button',
  deleteImageButton: 'report-delete-image-button',
  
  // 输入框
  descriptionTextInput: 'report-description-text-input',
  
  // 列表项
  typeCard: 'report-type-card',
  imageItem: 'report-image-item',
} as const;
// #endregion

// #region [10] 统一导出
/**
 * 举报模块所有常量的统一导出
 */
export const REPORT_CONSTANTS = {
  TYPES: REPORT_TYPE_IDS,
  STATUS: REPORT_STATUS,
  TARGET_TYPES: REPORT_TARGET_TYPES,
  CONFIG: REPORT_CONFIG,
  COLORS: THEME_COLORS,
  SIZES: COMPONENT_SIZES,
  SPACING,
  ANIMATION: {
    DURATION: ANIMATION_DURATION,
    EASING: ANIMATION_EASING,
  },
  API: {
    CONFIG: API_CONFIG,
    ENDPOINTS: API_ENDPOINTS,
    STATUS_CODES: HTTP_STATUS_CODES,
  },
  MESSAGES: {
    ERROR: ERROR_MESSAGES,
    SUCCESS: SUCCESS_MESSAGES,
  },
  DEFAULTS: DEFAULT_VALUES,
  TEST_IDS,
} as const;
// #endregion
