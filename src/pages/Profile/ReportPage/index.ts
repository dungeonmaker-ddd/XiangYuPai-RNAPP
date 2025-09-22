/**
 * 举报模块主导出文件
 * 
 * 统一导出举报模块的所有公共接口
 */

// #region [1] 主组件导出
export { default as ReportScreen } from './ReportScreen';
export type { ReportScreenProps } from './ReportScreen';
// #endregion

// #region [2] 子组件导出 - 基于新的嵌套化架构
export { TypeSelectionArea } from './TypeSelectionArea';
export { DescriptionInputArea } from './DescriptionInputArea';
export { ImageUploadArea } from './ImageUploadArea';
export { SubmitConfirmModal } from './SharedComponents/SubmitConfirmModal';

// 保持向后兼容的别名导出
export { TypeSelectionArea as ReportTypeSelector } from './TypeSelectionArea';
export { DescriptionInputArea as ReportDescriptionInput } from './DescriptionInputArea';
export { ImageUploadArea as ImageUploader } from './ImageUploadArea';
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
  
  // 组件Props类型 - 基于新的嵌套化架构
  TypeSelectionAreaProps,
  DescriptionInputAreaProps,
  ImageUploadAreaProps,
  SubmitConfirmModalProps,
  // 向后兼容的类型别名
  ReportTypeSelectorProps,
  ReportDescriptionInputProps,
  ImageUploaderProps,
  
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
