/**
 * 举报模块类型定义
 * 
 * 包含所有举报相关的TypeScript类型定义
 */

// #region [1] 基础类型定义
/**
 * 举报类型
 */
export interface ReportType {
  id: string;
  label: string;
  description: string;
}

/**
 * 举报表单数据
 */
export interface ReportFormData {
  selectedType: ReportType | null;
  description: string;
  images: string[];
}

/**
 * 举报验证错误
 */
export interface ReportValidationError {
  field: string;
  message: string;
}
// #endregion

// #region [2] API相关类型
/**
 * 举报目标类型
 */
export type ReportTargetType = 'user' | 'content' | 'comment' | 'post';

/**
 * 举报状态
 */
export type ReportStatus = 'pending' | 'reviewing' | 'approved' | 'rejected' | 'closed';

/**
 * 举报优先级
 */
export type ReportPriority = 'low' | 'medium' | 'high' | 'urgent';

/**
 * 举报记录
 */
export interface ReportRecord {
  id: string;
  reporterId: string;
  targetId: string;
  targetType: ReportTargetType;
  type: ReportType;
  description: string;
  images: string[];
  status: ReportStatus;
  priority: ReportPriority;
  createdAt: string;
  updatedAt: string;
  reviewerId?: string;
  reviewNote?: string;
  resolvedAt?: string;
}
// #endregion

// #region [3] 组件Props类型 - 基于新的嵌套化架构
/**
 * 类型选择区域Props
 */
export interface TypeSelectionAreaProps {
  reportTypes: ReportType[];
  selectedType: ReportType | null;
  onTypeSelect: (type: ReportType) => void;
  validationError?: ReportValidationError;
  disabled?: boolean;
}

/**
 * 描述输入区域Props
 */
export interface DescriptionInputAreaProps {
  value: string;
  onChangeText: (text: string) => void;
  maxLength: number;
  placeholder?: string;
  validationError?: ReportValidationError;
  disabled?: boolean;
}

/**
 * 图片上传区域Props
 */
export interface ImageUploadAreaProps {
  images: string[];
  onImagesChange: (images: string[]) => void;
  maxImages?: number;
  disabled?: boolean;
}

/**
 * 提交确认弹窗Props
 */
export interface SubmitConfirmModalProps {
  visible: boolean;
  onConfirm: () => void;
  onCancel: () => void;
  isSubmitting?: boolean;
  title?: string;
  message?: string;
  confirmText?: string;
  cancelText?: string;
}

// 保持向后兼容的类型别名
export interface ReportTypeSelectorProps extends TypeSelectionAreaProps {}
export interface ReportDescriptionInputProps extends DescriptionInputAreaProps {}
export interface ImageUploaderProps extends ImageUploadAreaProps {}
// #endregion

// #region [4] Hook相关类型
/**
 * 举报数据Hook返回类型
 */
export interface UseReportDataResult {
  reportTypes: ReportType[];
  isLoading: boolean;
  error: string | null;
  refreshReportTypes: () => Promise<void>;
}

/**
 * 举报表单Hook返回类型
 */
export interface UseReportFormResult {
  formData: ReportFormData;
  validationErrors: ReportValidationError[];
  isValid: boolean;
  isSubmitting: boolean;
  updateFormData: (updates: Partial<ReportFormData>) => void;
  validateForm: () => boolean;
  submitReport: (targetInfo: ReportTargetInfo) => Promise<void>;
  resetForm: () => void;
}
// #endregion

// #region [5] 事件相关类型
/**
 * 举报目标信息
 */
export interface ReportTargetInfo {
  targetId: string;
  targetType: ReportTargetType;
  targetTitle?: string;
  targetAuthor?: string;
}

/**
 * 举报提交回调
 */
export interface ReportSubmitCallbacks {
  onStart?: () => void;
  onSuccess?: (result: ReportSubmitResult) => void;
  onError?: (error: ReportSubmitError) => void;
  onComplete?: () => void;
}

/**
 * 举报提交结果
 */
export interface ReportSubmitResult {
  reportId: string;
  message: string;
  status: 'success';
  timestamp: number;
}

/**
 * 举报提交错误
 */
export interface ReportSubmitError {
  code: string;
  message: string;
  details?: any;
  timestamp: number;
}
// #endregion

// #region [6] 配置相关类型
/**
 * 举报配置
 */
export interface ReportConfig {
  maxDescriptionLength: number;
  maxImages: number;
  allowedImageFormats: string[];
  maxImageSize: number;
  submitTimeout: number;
  retryAttempts: number;
}

/**
 * 图片约束配置
 */
export interface ImageConstraints {
  maxCount: number;
  maxSize: number;
  allowedFormats: string[];
  maxWidth: number;
  maxHeight: number;
  quality: number;
}

/**
 * 验证规则配置
 */
export interface ValidationRules {
  description: {
    minLength: number;
    maxLength: number;
    required: boolean;
  };
  images: {
    maxCount: number;
    required: boolean;
  };
  type: {
    required: boolean;
  };
}
// #endregion

// #region [7] 样式相关类型
/**
 * 主题颜色配置
 */
export interface ReportThemeColors {
  primary: string;
  secondary: string;
  success: string;
  warning: string;
  error: string;
  text: {
    primary: string;
    secondary: string;
    disabled: string;
    placeholder: string;
  };
  background: {
    primary: string;
    secondary: string;
    modal: string;
    overlay: string;
  };
  border: {
    default: string;
    active: string;
    error: string;
  };
}

/**
 * 组件尺寸配置
 */
export interface ReportComponentSizes {
  header: {
    height: number;
  };
  card: {
    height: number;
    borderRadius: number;
  };
  input: {
    minHeight: number;
    borderRadius: number;
    padding: number;
  };
  image: {
    size: number;
    borderRadius: number;
  };
  button: {
    height: number;
    borderRadius: number;
    padding: number;
  };
  modal: {
    width: number;
    height: number;
    borderRadius: number;
  };
}

/**
 * 间距配置
 */
export interface ReportSpacing {
  xs: number;
  sm: number;
  md: number;
  lg: number;
  xl: number;
  container: number;
  section: number;
}
// #endregion

// #region [8] 导航相关类型
/**
 * 举报页面路由参数
 */
export interface ReportScreenParams {
  targetId: string;
  targetType: ReportTargetType;
  targetTitle?: string;
  targetAuthor?: string;
}

/**
 * 举报页面导航Props
 */
export interface ReportScreenNavigationProps {
  route: {
    params: ReportScreenParams;
  };
  navigation: {
    goBack: () => void;
    navigate: (screen: string, params?: any) => void;
  };
}
// #endregion
