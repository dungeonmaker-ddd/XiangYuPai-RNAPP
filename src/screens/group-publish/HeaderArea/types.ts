/**
 * 📋 HeaderArea 类型定义
 */

export interface HeaderAreaProps {
  title: string;
  onCancelPress: () => void;
  onSavePress: () => void;
  showSaveButton?: boolean;
  isDraftSaving?: boolean;
}

export interface NavigationBarProps {
  title: string;
  onCancelPress: () => void;
}

export interface SaveButtonProps {
  onPress: () => void;
  loading?: boolean;
  disabled?: boolean;
}
