/**
 * Profile模块主导出文件
 * 基于功能域拆分的完整模块导出
 */

// 主组件导出
export { ProfileScreen } from './ProfileScreen';
export { default as ProfileScreenDefault } from './ProfileScreen';

// 子组件导出 - 基于新的嵌套化架构
export { UserInfoArea } from './UserInfoArea';
export { TransactionArea } from './TransactionArea';
export { ToolsArea } from './ToolsArea';
export { SkeletonLoader, AvatarSkeleton, FunctionCardSkeleton } from './SharedComponents/SkeletonLoader';

// 保持向后兼容的别名导出
export { UserInfoArea as UserHeader } from './UserInfoArea';
export { TransactionArea as TransactionSection } from './TransactionArea';
export { ToolsArea as FunctionGrid } from './ToolsArea';

// 类型导出
export type {
  UserInfo,
  UserStatus,
  UserUpdateRequest,
  UploadResult,
  TransactionCounts,
  WalletInfo,
  FunctionConfig,
  ProfilePageState,
  UserInfoAreaProps,
  TransactionAreaProps,
  ToolsAreaProps,
  // 向后兼容的类型别名
  UserHeaderProps,
  TransactionSectionProps,
  ToolsSectionProps,
  ApiResponse,
  PageResult,
  AppError,
  EditModalProps,
  AvatarOption,
  ProfileStackParamList,
  ProfileEvent,
  ProfileService,
  UseProfileReturn,
} from './types';

// 常量导出
export {
  COLORS,
  SIZES,
  FONT_SIZES,
  ANIMATIONS,
  TRANSACTION_FUNCTIONS,
  TOOL_FUNCTIONS,
  API_ENDPOINTS,
  DEFAULT_VALUES,
  USER_STATUS,
  ERROR_MESSAGES,
} from './constants';

// 默认导出主组件
import ProfileScreen from './ProfileScreen';
export default ProfileScreen;
