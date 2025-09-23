/**
 * 内容编辑区域类型定义
 * 
 * 定义内容编辑器相关的类型和接口
 */

// #region 1. 基础编辑器类型
/**
 * 内容编辑器Props
 */
export interface ContentEditorAreaProps {
  title: string;
  content: string;
  onTitleChange: (title: string) => void;
  onContentChange: (content: string) => void;
  titlePlaceholder?: string;
  contentPlaceholder?: string;
  maxTitleLength?: number;
  maxContentLength?: number;
  errors?: {
    title?: string;
    content?: string;
  };
  disabled?: boolean;
  autoFocus?: boolean;
}

/**
 * 标题输入框Props
 */
export interface TitleInputProps {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  maxLength?: number;
  error?: string;
  disabled?: boolean;
  autoFocus?: boolean;
  onFocus?: () => void;
  onBlur?: () => void;
}

/**
 * 内容输入框Props
 */
export interface ContentInputProps {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  maxLength?: number;
  error?: string;
  disabled?: boolean;
  autoFocus?: boolean;
  minHeight?: number;
  maxHeight?: number;
  onFocus?: () => void;
  onBlur?: () => void;
  onContentSizeChange?: (height: number) => void;
}

/**
 * 字符计数器Props
 */
export interface CharacterCounterProps {
  current: number;
  max: number;
  showWarning?: boolean;
  warningThreshold?: number;
  style?: any;
}
// #endregion

// #region 2. 编辑器状态类型
/**
 * 编辑器状态
 */
export interface ContentEditorState {
  titleFocused: boolean;
  contentFocused: boolean;
  titleHeight: number;
  contentHeight: number;
  keyboardHeight: number;
  isKeyboardVisible: boolean;
}

/**
 * 输入验证状态
 */
export interface InputValidationState {
  titleValid: boolean;
  contentValid: boolean;
  titleError?: string;
  contentError?: string;
  titleWarning?: string;
  contentWarning?: string;
}

/**
 * 编辑器配置
 */
export interface ContentEditorConfig {
  titleMaxLength: number;
  contentMaxLength: number;
  titleMinLength: number;
  contentMinLength: number;
  autoSaveInterval: number;
  warningThreshold: number;
  enableRichText: boolean;
  enableAutoHeight: boolean;
}
// #endregion

// #region 3. 事件处理类型
/**
 * 编辑器事件类型
 */
export type ContentEditorEvent = 
  | { type: 'TITLE_CHANGE'; payload: string }
  | { type: 'CONTENT_CHANGE'; payload: string }
  | { type: 'TITLE_FOCUS' }
  | { type: 'TITLE_BLUR' }
  | { type: 'CONTENT_FOCUS' }
  | { type: 'CONTENT_BLUR' }
  | { type: 'HEIGHT_CHANGE'; payload: { type: 'title' | 'content'; height: number } }
  | { type: 'KEYBOARD_SHOW'; payload: number }
  | { type: 'KEYBOARD_HIDE' }
  | { type: 'VALIDATION_UPDATE'; payload: InputValidationState };

/**
 * 编辑器回调函数
 */
export interface ContentEditorCallbacks {
  onTitleChange?: (title: string) => void;
  onContentChange?: (content: string) => void;
  onTitleFocus?: () => void;
  onTitleBlur?: () => void;
  onContentFocus?: () => void;
  onContentBlur?: () => void;
  onHeightChange?: (type: 'title' | 'content', height: number) => void;
  onValidationChange?: (validation: InputValidationState) => void;
  onKeyboardToggle?: (visible: boolean, height?: number) => void;
}
// #endregion

// #region 4. 富文本相关类型
/**
 * 富文本格式
 */
export interface RichTextFormat {
  bold: boolean;
  italic: boolean;
  underline: boolean;
  fontSize: number;
  color: string;
  backgroundColor?: string;
}

/**
 * 富文本范围
 */
export interface RichTextRange {
  start: number;
  end: number;
  format: RichTextFormat;
}

/**
 * 富文本内容
 */
export interface RichTextContent {
  text: string;
  ranges: RichTextRange[];
}
// #endregion

// #region 5. 自动保存相关类型
/**
 * 自动保存状态
 */
export interface AutoSaveState {
  enabled: boolean;
  lastSaved: Date | null;
  isDirty: boolean;
  isSaving: boolean;
  saveError?: string;
}

/**
 * 草稿数据
 */
export interface DraftData {
  title: string;
  content: string;
  lastModified: Date;
  version: number;
}
// #endregion

// #region 6. 输入框样式类型
/**
 * 输入框状态样式
 */
export interface InputStateStyles {
  normal: any;
  focused: any;
  error: any;
  disabled: any;
  warning: any;
}

/**
 * 编辑器主题
 */
export interface ContentEditorTheme {
  colors: {
    background: string;
    text: string;
    placeholder: string;
    border: string;
    borderFocused: string;
    borderError: string;
    error: string;
    warning: string;
    counter: string;
  };
  fonts: {
    title: any;
    content: any;
    counter: any;
  };
  spacing: {
    padding: number;
    margin: number;
    inputSpacing: number;
  };
}
// #endregion
