/**
 * 发现页面模块导出索引
 */

// 主组件
export { DiscoverScreen } from './DiscoverScreen';

// 子组件
export * from './components';

// 自定义Hooks
export * from './hooks';

// 子页面
export * from './subpage';

// 工具函数
export {
  calculateImageDimensions,
  calculateCardHeight,
  validateImageDimensions,
  normalizeImageData,
  normalizeImageDataBatch,
} from './utils/imageUtils';

// 类型定义
export type {
  ContentItem,
  UserInfo,
  TabType,
  TabConfig,
  DiscoverScreenProps,
  ContentCardProps,
  TabBarProps,
  WaterfallListProps,
  DiscoverState,
  ApiResponse,
  ContentListResponse,
  LikeResponse,
  FollowResponse,
  AppError,
} from './types';

// 工具类型
export type { ImageDimensions } from './utils/imageUtils';

// 常量
export {
  API_ENDPOINTS,
  LAYOUT_CONSTANTS,
  COLORS,
  TYPOGRAPHY,
  TABS,
  ANIMATION_CONFIG,
  REQUEST_CONFIG,
  IMAGE_CONFIG,
  ERROR_MESSAGES,
  SUCCESS_MESSAGES,
  TEST_IDS,
} from './constants';