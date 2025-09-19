/**
 * 举报模块主导出文件
 * 
 * 统一导出举报模块的所有公共接口
 */

// #region [1] 主组件导出
export { default as ReportScreen } from './ReportScreen';
export type { ReportScreenProps } from './ReportScreen';
// #endregion

// #region [2] 子组件导出
export {
  ReportTypeSelector,
  ReportDescriptionInput,
  ImageUploader,
  SubmitConfirmModal,
} from './components';
// #endregion

// #region [3] Hooks导出
export { useReportData, DEFAULT_REPORT_TYPES } from './hooks';
export type { UseReportDataResult } from './hooks';
// #endregion

// #region [4] Services导出
export { ReportService, API_CONFIG, API_ENDPOINTS, HTTP_STATUS } from './services';
export type {
  SubmitReportRequest,
  SubmitReportResponse,
  GetReportTypesResponse,
  ApiError,
} from './services';
// #endregion

// #region [5] 事件处理器导出
export {
  onReportTypeSelect,
  onDescriptionChange,
  onImageUpload,
  onReportSubmit,
  canSubmitReport,
  getFormValidation,
} from './events';
// #endregion

// #region [6] 类型定义导出
export type {
  // 基础类型
  ReportType,
  ReportFormData,
  ReportValidationError,
  ReportTargetType,
  ReportStatus,
  ReportPriority,
  ReportRecord,
  
  // 组件Props类型
  ReportTypeSelectorProps,
  ReportDescriptionInputProps,
  ImageUploaderProps,
  SubmitConfirmModalProps,
  
  // Hook类型
  UseReportDataResult,
  UseReportFormResult,
  
  // 事件类型
  ReportTargetInfo,
  ReportSubmitCallbacks,
  ReportSubmitResult,
  ReportSubmitError,
  
  // 配置类型
  ReportConfig,
  ImageConstraints,
  ValidationRules,
  ReportThemeColors,
  ReportComponentSizes,
  ReportSpacing,
  
  // 导航类型
  ReportScreenParams,
  ReportScreenNavigationProps,
} from './types';
// #endregion

// #region [7] 常量导出
export {
  REPORT_CONSTANTS,
  REPORT_TYPE_IDS,
  REPORT_STATUS,
  REPORT_TARGET_TYPES,
  REPORT_CONFIG,
  IMAGE_CONSTRAINTS,
  VALIDATION_RULES,
  THEME_COLORS,
  COMPONENT_SIZES,
  SPACING,
  ERROR_MESSAGES,
  SUCCESS_MESSAGES,
  DEFAULT_VALUES,
  TEST_IDS,
} from './constants';
// #endregion
