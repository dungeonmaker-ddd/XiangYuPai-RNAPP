// #region 1. File Banner & TOC
/**
 * ReportPage Constants - 举报页面常量配置
 * 
 * 定义举报页面所有相关的常量、配置项和静态数据
 */
// #endregion

// #region 2. Imports
import { ReportType, ReportTypeOption, ReportPageConfig, ValidationConfig } from './types';
// #endregion

// #region 3. Report Type Options
/**
 * 举报类型选项配置
 */
export const REPORT_TYPE_OPTIONS: ReportTypeOption[] = [
  {
    type: ReportType.HARASSMENT,
    label: '辱骂引战',
    description: '包含恶意辱骂、挑衅、引发争论的内容',
  },
  {
    type: ReportType.INAPPROPRIATE,
    label: '色情低俗',
    description: '包含色情、低俗、不雅的内容',
  },
  {
    type: ReportType.FRAUD,
    label: '诈骗',
    description: '涉及金融诈骗、虚假交易等诈骗行为',
  },
  {
    type: ReportType.ILLEGAL,
    label: '违法犯罪',
    description: '涉及违法犯罪活动的内容',
  },
  {
    type: ReportType.FAKE_INFO,
    label: '不实信息',
    description: '传播虚假信息、谣言等不实内容',
  },
  {
    type: ReportType.MINORS,
    label: '未成年人相关',
    description: '涉及未成年人不当内容或安全问题',
  },
  {
    type: ReportType.DISTURBING,
    label: '内容引人不适',
    description: '令人感到不适、恶心或恐惧的内容',
  },
  {
    type: ReportType.OTHER,
    label: '其他',
    description: '其他不符合社区规范的内容',
  },
];
// #endregion

// #region 4. UI Constants
/**
 * UI 样式常量
 */
export const UI_CONSTANTS = {
  // 颜色配置
  COLORS: {
    PRIMARY: '#8A2BE2',
    PRIMARY_LIGHT: '#9370DB',
    BACKGROUND: '#FFFFFF',
    TEXT_PRIMARY: '#333333',
    TEXT_SECONDARY: '#666666',
    TEXT_PLACEHOLDER: '#999999',
    BORDER: '#E5E5E5',
    BORDER_ACTIVE: '#8A2BE2',
    INPUT_BACKGROUND: '#F5F5F5',
    ERROR: '#FF4444',
    SUCCESS: '#4CAF50',
    WARNING: '#FF9800',
  },
  
  // 尺寸配置
  SIZES: {
    HEADER_HEIGHT: 56,
    CARD_BORDER_RADIUS: 12,
    BUTTON_BORDER_RADIUS: 20,
    INPUT_BORDER_RADIUS: 12,
    MODAL_BORDER_RADIUS: 16,
    SAFE_AREA_BOTTOM: 34,
  },
  
  // 间距配置
  SPACING: {
    XS: 4,
    SM: 8,
    MD: 16,
    LG: 24,
    XL: 32,
    XXL: 48,
  },
  
  // 字体配置
  FONTS: {
    SMALL: 12,
    REGULAR: 14,
    MEDIUM: 16,
    LARGE: 18,
    XLARGE: 20,
  },
  
  // 动画配置
  ANIMATION: {
    DURATION_FAST: 150,
    DURATION_NORMAL: 300,
    DURATION_SLOW: 500,
  },
} as const;
// #endregion

// #region 5. Form Configuration
/**
 * 表单配置常量
 */
export const FORM_CONFIG = {
  MAX_DESCRIPTION_LENGTH: 200,
  MAX_IMAGES: 3,
  ALLOWED_IMAGE_TYPES: ['image/jpeg', 'image/png', 'image/webp'],
  MAX_IMAGE_SIZE: 10 * 1024 * 1024, // 10MB
  IMAGE_QUALITY: 0.8,
  IMAGE_MAX_WIDTH: 1920,
  IMAGE_MAX_HEIGHT: 1920,
} as const;

/**
 * 验证配置
 */
export const VALIDATION_CONFIG: ValidationConfig = {
  requireDescription: false,
  minDescriptionLength: 0,
  requireImages: false,
  minImages: 0,
};

/**
 * 页面配置
 */
export const REPORT_PAGE_CONFIG: ReportPageConfig = {
  maxDescriptionLength: FORM_CONFIG.MAX_DESCRIPTION_LENGTH,
  maxImages: FORM_CONFIG.MAX_IMAGES,
  allowedImageTypes: [...FORM_CONFIG.ALLOWED_IMAGE_TYPES],
  maxImageSize: FORM_CONFIG.MAX_IMAGE_SIZE,
  submitTimeout: 30000, // 30秒
};
// #endregion

// #region 6. Text Constants
/**
 * 文本常量
 */
export const TEXT_CONSTANTS = {
  // 页面标题和导航
  PAGE_TITLE: '举报',
  BACK_BUTTON: '<',
  SUBMIT_BUTTON: '提交',
  
  // 区域标题
  TYPE_SELECTION_TITLE: '请选择你要举报的类型',
  DESCRIPTION_TITLE: '举报描述',
  IMAGE_UPLOAD_TITLE: '上传图片',
  IMAGE_UPLOAD_SUBTITLE: '(选填)',
  
  // 占位符文本
  DESCRIPTION_PLACEHOLDER: '请描述你举报的原因',
  
  // 弹窗文本
  CONFIRM_TITLE: '确认提交举报？',
  CONFIRM_MESSAGE: '提交后我们会在24小时内处理',
  CONFIRM_CANCEL: '取消',
  CONFIRM_SUBMIT: '确认提交',
  
  SUCCESS_MESSAGE: '已收到您的举报，我们会尽快处理',
  SUCCESS_BUTTON: '确定',
  
  // 错误信息
  ERROR_NO_TYPE: '请选择举报类型',
  ERROR_DESCRIPTION_TOO_LONG: '描述不能超过200字',
  ERROR_NETWORK: '网络异常，请稍后重试',
  ERROR_UPLOAD_FAILED: '图片上传失败',
  ERROR_INVALID_IMAGE: '图片格式不支持或文件过大',
  
  // 状态文本
  UPLOADING: '上传中...',
  SUBMITTING: '提交中...',
  PROCESSING: '处理中...',
} as const;
// #endregion

// #region 7. Layout Constants
/**
 * 布局常量
 */
export const LAYOUT_CONSTANTS = {
  // 网格布局
  GRID_COLUMNS: 2,
  GRID_ITEM_SPACING: 8,
  GRID_VERTICAL_SPACING: 12,
  
  // 卡片尺寸
  TYPE_CARD_HEIGHT: 48,
  IMAGE_CARD_SIZE: 120,
  
  // 输入框配置
  DESCRIPTION_INPUT_HEIGHT: 200,
  INPUT_PADDING: 16,
  
  // 弹窗配置
  MODAL_WIDTH: 300,
  MODAL_HEIGHT: 180,
  BUTTON_HEIGHT: 44,
  BUTTON_WIDTH: 200,
  
  // 安全区域
  IOS_STATUS_BAR_HEIGHT: 44,
  ANDROID_STATUS_BAR_HEIGHT: 24,
} as const;
// #endregion

// #region 8. API Constants
/**
 * API 相关常量
 */
export const API_CONSTANTS = {
  // 接口端点
  ENDPOINTS: {
    SUBMIT_REPORT: '/api/reports/submit',
    UPLOAD_IMAGE: '/api/upload/image',
    VALIDATE_CONTENT: '/api/content/validate',
  },
  
  // 请求配置
  REQUEST_TIMEOUT: 30000,
  UPLOAD_TIMEOUT: 60000,
  RETRY_ATTEMPTS: 3,
  RETRY_DELAY: 1000,
  
  // 响应码
  SUCCESS_CODES: [200, 201],
  CLIENT_ERROR_CODES: [400, 401, 403, 404, 422],
  SERVER_ERROR_CODES: [500, 502, 503, 504],
} as const;
// #endregion

// #region 9. Analytics Constants
/**
 * 分析和统计常量
 */
export const ANALYTICS_CONSTANTS = {
  // 事件名称
  EVENTS: {
    PAGE_VIEW: 'report_page_view',
    TYPE_SELECT: 'report_type_select',
    DESCRIPTION_INPUT: 'report_description_input',
    IMAGE_ADD: 'report_image_add',
    IMAGE_REMOVE: 'report_image_remove',
    SUBMIT_ATTEMPT: 'report_submit_attempt',
    SUBMIT_SUCCESS: 'report_submit_success',
    SUBMIT_FAILED: 'report_submit_failed',
    PAGE_EXIT: 'report_page_exit',
  },
  
  // 属性名称
  PROPERTIES: {
    REPORT_TYPE: 'report_type',
    HAS_DESCRIPTION: 'has_description',
    IMAGE_COUNT: 'image_count',
    SUBMIT_DURATION: 'submit_duration',
    ERROR_CODE: 'error_code',
    SOURCE_PAGE: 'source_page',
  },
} as const;
// #endregion

// #region 10. Export Aggregation
/**
 * 主要常量聚合导出
 */
export const REPORT_CONSTANTS = {
  TYPE_OPTIONS: REPORT_TYPE_OPTIONS,
  UI: UI_CONSTANTS,
  FORM: FORM_CONFIG,
  TEXT: TEXT_CONSTANTS,
  LAYOUT: LAYOUT_CONSTANTS,
  API: API_CONSTANTS,
  ANALYTICS: ANALYTICS_CONSTANTS,
  VALIDATION: VALIDATION_CONFIG,
  CONFIG: REPORT_PAGE_CONFIG,
} as const;
// #endregion
