/**
 * 举报模块事件处理器导出索引
 */

export { onReportTypeSelect } from './onReportTypeSelect';
export type { OnReportTypeSelectCallback, ReportTypeSelectEventData } from './onReportTypeSelect';

export { 
  onDescriptionChange,
  getDescriptionValidation,
  formatDescription,
  DESCRIPTION_CONSTRAINTS,
} from './onDescriptionChange';
export type { 
  OnDescriptionChangeCallback,
  DescriptionChangeEventData,
  DescriptionValidationResult,
} from './onDescriptionChange';

export {
  onImageUpload,
  onImageAdd,
  onImageDelete,
  getImageValidation,
  IMAGE_CONSTRAINTS,
  IMAGE_VALIDATION_MESSAGES,
} from './onImageUpload';
export type {
  OnImageUploadCallback,
  ImageUploadEventData,
  ImageValidationResult,
  ImageConstraints,
} from './onImageUpload';

export {
  onReportSubmit,
  canSubmitReport,
  getFormValidation,
  SUBMIT_CONFIG,
  ERROR_MESSAGES,
  ERROR_CODES,
} from './onReportSubmit';
export type {
  SubmitCallbacks,
  SubmitSuccessResult,
  SubmitErrorResult,
  ReportSubmitEventData,
  TargetInfo,
  SubmitStatus,
} from './onReportSubmit';
