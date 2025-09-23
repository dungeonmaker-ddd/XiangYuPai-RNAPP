/**
 * 功能标签区域类型定义
 * 
 * 定义功能标签相关的类型和接口
 */

// #region 1. 功能标签组件类型
/**
 * 功能标签区域Props
 */
export interface FunctionTagsAreaProps {
  selectedTopics: TopicData[];
  selectedLocation: LocationData | null;
  onTopicSelect: () => void;
  onLocationSelect: () => void;
  onTopicRemove: (topicId: string) => void;
  onLocationRemove: () => void;
  disabled?: boolean;
  maxTopics?: number;
}

/**
 * 话题数据类型
 */
export interface TopicData {
  id: string;
  name: string;
  description?: string;
  coverUrl?: string;
  hotScore: number;
  participantCount: number;
  category: string;
  isHot: boolean;
}

/**
 * 地点数据类型
 */
export interface LocationData {
  id?: string;
  name: string;
  address: string;
  latitude: number;
  longitude: number;
  category?: string;
  distance?: number;
}

/**
 * 话题卡片Props
 */
export interface TopicCardProps {
  selectedTopics: TopicData[];
  onSelect: () => void;
  onRemove: (topicId: string) => void;
  maxTopics?: number;
  disabled?: boolean;
}

/**
 * 地点卡片Props
 */
export interface LocationCardProps {
  selectedLocation: LocationData | null;
  onSelect: () => void;
  onRemove: () => void;
  disabled?: boolean;
}
// #endregion

// #region 2. 标签显示类型
/**
 * 话题标签Props
 */
export interface TopicTagProps {
  topic: TopicData;
  onRemove: (topicId: string) => void;
  disabled?: boolean;
  variant?: 'default' | 'compact' | 'outline';
}

/**
 * 位置标签Props
 */
export interface LocationTagProps {
  location: LocationData;
  onRemove: () => void;
  disabled?: boolean;
  showDistance?: boolean;
  variant?: 'default' | 'compact' | 'outline';
}

/**
 * 标签状态
 */
export type TagState = 'normal' | 'selected' | 'disabled' | 'removing';

/**
 * 标签变体
 */
export type TagVariant = 'default' | 'compact' | 'outline' | 'solid';
// #endregion

// #region 3. 交互状态类型
/**
 * 功能卡片状态
 */
export interface FunctionCardState {
  pressed: boolean;
  focused: boolean;
  disabled: boolean;
  loading: boolean;
}

/**
 * 选择器状态
 */
export interface SelectorState {
  topicSelectorVisible: boolean;
  locationSelectorVisible: boolean;
  isSelecting: boolean;
}

/**
 * 验证状态
 */
export interface TagValidationState {
  topicsValid: boolean;
  locationValid: boolean;
  topicsError?: string;
  locationError?: string;
}
// #endregion

// #region 4. 配置类型
/**
 * 功能标签配置
 */
export interface FunctionTagsConfig {
  maxTopics: number;
  requireLocation: boolean;
  requireTopics: boolean;
  enableMultipleTopics: boolean;
  enableLocationSearch: boolean;
  enableTopicSearch: boolean;
}

/**
 * 标签样式配置
 */
export interface TagStyleConfig {
  backgroundColor: string;
  textColor: string;
  borderColor: string;
  borderRadius: number;
  padding: {
    horizontal: number;
    vertical: number;
  };
  fontSize: number;
  fontWeight: string;
}

/**
 * 卡片样式配置
 */
export interface CardStyleConfig {
  backgroundColor: string;
  borderColor: string;
  borderRadius: number;
  padding: number;
  margin: number;
  elevation: number;
  shadowOffset: { x: number; y: number };
  shadowOpacity: number;
  shadowRadius: number;
}
// #endregion

// #region 5. 事件处理类型
/**
 * 功能标签事件
 */
export type FunctionTagsEvent = 
  | { type: 'TOPIC_SELECT_START' }
  | { type: 'TOPIC_SELECT_SUCCESS'; payload: TopicData[] }
  | { type: 'TOPIC_SELECT_CANCEL' }
  | { type: 'TOPIC_REMOVE'; payload: string }
  | { type: 'LOCATION_SELECT_START' }
  | { type: 'LOCATION_SELECT_SUCCESS'; payload: LocationData }
  | { type: 'LOCATION_SELECT_CANCEL' }
  | { type: 'LOCATION_REMOVE' }
  | { type: 'VALIDATION_UPDATE'; payload: TagValidationState };

/**
 * 功能标签回调函数
 */
export interface FunctionTagsCallbacks {
  onTopicSelectStart?: () => void;
  onTopicSelectSuccess?: (topics: TopicData[]) => void;
  onTopicSelectCancel?: () => void;
  onTopicRemove?: (topicId: string) => void;
  onLocationSelectStart?: () => void;
  onLocationSelectSuccess?: (location: LocationData) => void;
  onLocationSelectCancel?: () => void;
  onLocationRemove?: () => void;
  onValidationChange?: (validation: TagValidationState) => void;
}
// #endregion

// #region 6. 数据处理类型
/**
 * 话题搜索结果
 */
export interface TopicSearchResult {
  topics: TopicData[];
  total: number;
  hasMore: boolean;
  query: string;
}

/**
 * 地点搜索结果
 */
export interface LocationSearchResult {
  locations: LocationData[];
  total: number;
  hasMore: boolean;
  query: string;
}

/**
 * 推荐数据
 */
export interface RecommendationData {
  hotTopics: TopicData[];
  nearbyLocations: LocationData[];
  userTopics: TopicData[];
  recentLocations: LocationData[];
}
// #endregion
