/**
 * 发布控制区域类型定义
 * 
 * 定义发布控制相关的类型和接口
 */

// #region 1. 发布控制组件类型
/**
 * 发布控制区域Props
 */
export interface PublishControlAreaProps {
  isValid: boolean;
  isPublishing: boolean;
  publishProgress: number;
  onPublish: () => void;
  onCancel: () => void;
  onDraft: () => void;
  disabled?: boolean;
  showProgress?: boolean;
  showDraft?: boolean;
}

/**
 * 发布按钮Props
 */
export interface PublishButtonProps {
  isValid: boolean;
  isPublishing: boolean;
  progress?: number;
  onPress: () => void;
  disabled?: boolean;
  text?: string;
  variant?: PublishButtonVariant;
}

/**
 * 进度指示器Props
 */
export interface ProgressIndicatorProps {
  progress: number;
  isVisible: boolean;
  message?: string;
  variant?: ProgressVariant;
}

/**
 * 操作按钮Props
 */
export interface ActionButtonProps {
  text: string;
  onPress: () => void;
  disabled?: boolean;
  variant?: ActionButtonVariant;
  icon?: string;
}
// #endregion

// #region 2. 按钮变体类型
/**
 * 发布按钮变体
 */
export type PublishButtonVariant = 
  | 'primary'     // 主要按钮（发布）
  | 'secondary'   // 次要按钮（草稿）
  | 'disabled'    // 禁用状态
  | 'loading'     // 加载状态
  | 'success'     // 成功状态
  | 'error';      // 错误状态

/**
 * 操作按钮变体
 */
export type ActionButtonVariant = 
  | 'text'        // 文本按钮
  | 'outline'     // 边框按钮
  | 'ghost'       // 幽灵按钮
  | 'link';       // 链接按钮

/**
 * 进度变体
 */
export type ProgressVariant = 
  | 'linear'      // 线性进度条
  | 'circular'    // 圆形进度
  | 'dots'        // 点状进度
  | 'spinner';    // 旋转器
// #endregion

// #region 3. 状态类型
/**
 * 发布状态
 */
export type PublishState = 
  | 'idle'        // 空闲状态
  | 'validating'  // 验证中
  | 'uploading'   // 上传中
  | 'submitting'  // 提交中
  | 'success'     // 成功
  | 'error';      // 错误

/**
 * 按钮状态
 */
export interface ButtonState {
  pressed: boolean;
  focused: boolean;
  disabled: boolean;
  loading: boolean;
}

/**
 * 控制区域状态
 */
export interface ControlAreaState {
  publishState: PublishState;
  buttonState: ButtonState;
  progress: number;
  message: string;
  canPublish: boolean;
  canSaveDraft: boolean;
}
// #endregion

// #region 4. 事件处理类型
/**
 * 发布控制事件
 */
export type PublishControlEvent = 
  | { type: 'PUBLISH_START' }
  | { type: 'PUBLISH_PROGRESS'; payload: number }
  | { type: 'PUBLISH_SUCCESS' }
  | { type: 'PUBLISH_ERROR'; payload: string }
  | { type: 'PUBLISH_CANCEL' }
  | { type: 'DRAFT_SAVE' }
  | { type: 'VALIDATION_CHANGE'; payload: boolean }
  | { type: 'STATE_RESET' };

/**
 * 发布控制回调函数
 */
export interface PublishControlCallbacks {
  onPublishStart?: () => void;
  onPublishProgress?: (progress: number) => void;
  onPublishSuccess?: () => void;
  onPublishError?: (error: string) => void;
  onPublishCancel?: () => void;
  onDraftSave?: () => void;
  onValidationChange?: (isValid: boolean) => void;
  onStateChange?: (state: ControlAreaState) => void;
}
// #endregion

// #region 5. 配置类型
/**
 * 发布按钮配置
 */
export interface PublishButtonConfig {
  text: string;
  backgroundColor: string;
  textColor: string;
  borderColor?: string;
  borderWidth?: number;
  borderRadius: number;
  fontSize: number;
  fontWeight: string;
  height: number;
  minWidth: number;
  padding: {
    horizontal: number;
    vertical: number;
  };
  shadow: {
    enabled: boolean;
    color: string;
    offset: { x: number; y: number };
    opacity: number;
    radius: number;
  };
}

/**
 * 进度配置
 */
export interface ProgressConfig {
  height: number;
  backgroundColor: string;
  fillColor: string;
  borderRadius: number;
  animationDuration: number;
  showPercentage: boolean;
  showMessage: boolean;
}

/**
 * 控制区域配置
 */
export interface ControlAreaConfig {
  height: number;
  backgroundColor: string;
  borderColor?: string;
  borderWidth?: number;
  padding: {
    horizontal: number;
    vertical: number;
  };
  safeArea: {
    bottom: number;
  };
  layout: 'horizontal' | 'vertical';
  alignment: 'left' | 'center' | 'right' | 'space-between';
}
// #endregion

// #region 6. 样式类型
/**
 * 按钮样式状态
 */
export interface ButtonStyleState {
  normal: any;
  pressed: any;
  disabled: any;
  loading: any;
  success: any;
  error: any;
}

/**
 * 动画配置
 */
export interface AnimationConfig {
  duration: number;
  easing: string;
  useNativeDriver: boolean;
  delay?: number;
}

/**
 * 触觉反馈配置
 */
export interface HapticConfig {
  enabled: boolean;
  type: 'light' | 'medium' | 'heavy' | 'success' | 'warning' | 'error';
  pattern?: number[];
}
// #endregion

// #region 7. 验证类型
/**
 * 发布验证规则
 */
export interface PublishValidationRules {
  requireContent: boolean;
  requireMedia: boolean;
  requireTopics: boolean;
  requireLocation: boolean;
  minContentLength: number;
  maxContentLength: number;
  minTopics: number;
  maxTopics: number;
  allowedMediaTypes: string[];
  maxMediaSize: number;
}

/**
 * 验证结果
 */
export interface ValidationResult {
  isValid: boolean;
  errors: ValidationError[];
  warnings: ValidationWarning[];
  score: number; // 内容质量评分 0-100
}

/**
 * 验证错误
 */
export interface ValidationError {
  field: string;
  code: string;
  message: string;
  severity: 'error' | 'warning' | 'info';
}

/**
 * 验证警告
 */
export interface ValidationWarning {
  field: string;
  code: string;
  message: string;
  suggestion?: string;
}
// #endregion
