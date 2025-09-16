/**
 * Profile模块主导出文件
 * 基于功能域拆分的完整模块导出
 */

// 主组件导出
export { ProfileScreen } from './ProfileScreen';
export { default as ProfileScreenDefault } from './ProfileScreen';

// 子组件导出
export {
  UserHeader,
  TransactionSection,
  FunctionGrid,
} from './components';

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
