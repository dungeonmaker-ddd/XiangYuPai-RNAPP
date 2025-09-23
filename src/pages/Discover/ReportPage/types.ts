// #region 1. File Banner & TOC
/**
 * ReportPage Types - 举报页面类型定义
 * 
 * 定义举报页面相关的所有TypeScript类型、接口和枚举
 */
// #endregion

// #region 2. Core Types
/**
 * 举报类型枚举
 */
export enum ReportType {
  HARASSMENT = 'harassment',        // 辱骂引战
  INAPPROPRIATE = 'inappropriate',  // 色情低俗
  FRAUD = 'fraud',                 // 诈骗
  ILLEGAL = 'illegal',             // 违法犯罪
  FAKE_INFO = 'fake_info',         // 不实信息
  MINORS = 'minors',               // 未成年人相关
  DISTURBING = 'disturbing',       // 内容引人不适
  OTHER = 'other',                 // 其他
}

/**
 * 举报类型选项配置
 */
export interface ReportTypeOption {
  type: ReportType;
  label: string;
  description?: string;
}

/**
 * 举报表单数据
 */
export interface ReportFormData {
  selectedType: ReportType;
  description: string;
  images: string[];
}

/**
 * 举报页面路由参数
 */
export interface ReportPageRouteParams {
  targetId?: string;          // 被举报内容的ID
  targetType?: 'post' | 'user' | 'comment'; // 被举报内容的类型
  reportContext?: string;     // 举报上下文信息
}

/**
 * 举报页面组件Props
 */
export interface ReportPageProps {
  route?: {
    params?: ReportPageRouteParams;
  };
}
// #endregion

// #region 3. Component Props Types
/**
 * 举报类型选择区域组件Props
 */
export interface ReportTypeSelectionAreaProps {
  selectedType: ReportType | null;
  onTypeSelect: (type: ReportType) => void;
  options?: ReportTypeOption[];
}

/**
 * 描述输入区域组件Props
 */
export interface DescriptionInputAreaProps {
  value: string;
  onChange: (text: string) => void;
  maxLength: number;
  placeholder?: string;
}

/**
 * 图片上传区域组件Props
 */
export interface ImageUploadAreaProps {
  images: string[];
  maxImages: number;
  onImageAdd: (imageUri: string) => void;
  onImageRemove: (index: number) => void;
}

/**
 * 提交确认弹窗组件Props
 */
export interface SubmitConfirmModalProps {
  visible: boolean;
  onCancel: () => void;
  onConfirm: () => void;
  isLoading?: boolean;
}

/**
 * 成功反馈弹窗组件Props
 */
export interface SuccessModalProps {
  visible: boolean;
  onConfirm: () => void;
  message?: string;
}
// #endregion

// #region 4. State Types
/**
 * 图片上传状态
 */
export enum ImageUploadStatus {
  IDLE = 'idle',
  UPLOADING = 'uploading',
  SUCCESS = 'success',
  FAILED = 'failed',
}

/**
 * 图片项数据
 */
export interface ImageItem {
  uri: string;
  status: ImageUploadStatus;
  progress?: number;
  error?: string;
}

/**
 * 举报提交状态
 */
export enum SubmitStatus {
  IDLE = 'idle',
  VALIDATING = 'validating',
  SUBMITTING = 'submitting',
  SUCCESS = 'success',
  FAILED = 'failed',
}

/**
 * 举报提交响应
 */
export interface ReportSubmitResponse {
  success: boolean;
  reportId?: string;
  message: string;
  errors?: Record<string, string[]>;
}
// #endregion

// #region 5. API Types
/**
 * 举报提交请求参数
 */
export interface SubmitReportRequest {
  targetId: string;
  targetType: 'post' | 'user' | 'comment';
  reportType: ReportType;
  description?: string;
  images?: string[];
  deviceInfo?: {
    platform: string;
    version: string;
    timestamp: number;
  };
}

/**
 * 图片上传请求参数
 */
export interface UploadImageRequest {
  imageUri: string;
  fileName: string;
  fileType: string;
  fileSize: number;
}

/**
 * 图片上传响应
 */
export interface UploadImageResponse {
  success: boolean;
  imageUrl?: string;
  fileName?: string;
  error?: string;
}
// #endregion

// #region 6. Hook Types
/**
 * 举报页面状态Hook返回类型
 */
export interface UseReportPageState {
  formData: ReportFormData;
  submitStatus: SubmitStatus;
  errors: Record<string, string>;
  isValid: boolean;
}

/**
 * 图片管理Hook返回类型
 */
export interface UseImageManagement {
  images: ImageItem[];
  addImage: (uri: string) => Promise<void>;
  removeImage: (index: number) => void;
  uploadImage: (imageUri: string) => Promise<string>;
  isUploading: boolean;
}
// #endregion

// #region 7. Event Types
/**
 * 举报类型选择事件
 */
export interface ReportTypeSelectEvent {
  type: ReportType;
  timestamp: number;
}

/**
 * 表单验证事件
 */
export interface FormValidationEvent {
  field: string;
  isValid: boolean;
  errors: string[];
}

/**
 * 提交完成事件
 */
export interface SubmitCompleteEvent {
  success: boolean;
  reportId?: string;
  duration: number;
  errors?: string[];
}
// #endregion

// #region 8. Configuration Types
/**
 * 举报页面配置
 */
export interface ReportPageConfig {
  maxDescriptionLength: number;
  maxImages: number;
  allowedImageTypes: string[];
  maxImageSize: number;
  submitTimeout: number;
}

/**
 * 验证规则配置
 */
export interface ValidationConfig {
  requireDescription: boolean;
  minDescriptionLength: number;
  requireImages: boolean;
  minImages: number;
}
// #endregion
