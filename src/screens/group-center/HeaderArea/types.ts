/**
 * 📋 HeaderArea 类型定义
 */

export interface HeaderAreaProps {
  title: string;
  onBackPress: () => void;
  onPublishPress: () => void;
  showPublishButton?: boolean;
}

export interface NavigationBarProps {
  title: string;
  onBackPress: () => void;
}

export interface PublishButtonProps {
  onPress: () => void;
  disabled?: boolean;
  loading?: boolean;
}
