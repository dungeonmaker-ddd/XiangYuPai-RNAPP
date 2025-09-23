/**
 * 发布动态页面类型定义
 * 
 * 定义发布动态系统的完整类型体系
 */

// #region 1. 核心发布类型定义
/**
 * 发布内容数据结构
 */
export interface PublishContentData {
  title: string;
  content: string;
  mediaIds: string[];
  topicIds: string[];
  locationId?: string;
  privacy: 'public' | 'friends' | 'private';
  settings: {
    allowComment: boolean;
    allowShare: boolean;
  };
}

/**
 * 媒体文件类型
 */
export interface PublishMediaItem {
  id: string;
  type: 'image' | 'video';
  uri: string;
  fileName: string;
  fileSize: number;
  width?: number;
  height?: number;
  duration?: number; // 视频时长（秒）
  thumbnailUri?: string;
  uploadProgress: number;
  uploadStatus: 'pending' | 'uploading' | 'uploaded' | 'failed';
  uploadError?: string;
}

/**
 * 地点数据类型
 */
export interface PublishLocationData {
  id?: string;
  name: string;
  address: string;
  latitude: number;
  longitude: number;
  category?: string;
  distance?: number;
}

/**
 * 话题数据类型
 */
export interface PublishTopicData {
  id: string;
  name: string;
  description?: string;
  coverUrl?: string;
  hotScore: number;
  participantCount: number;
  category: string;
  isHot: boolean;
}
// #endregion

// #region 2. 发布状态管理类型
/**
 * 发布页面状态
 */
export interface PublishPageState {
  // 内容状态
  contentData: PublishContentData;
  mediaItems: PublishMediaItem[];
  selectedTopics: PublishTopicData[];
  selectedLocation: PublishLocationData | null;
  
  // UI状态
  isLoading: boolean;
  isPublishing: boolean;
  publishProgress: number;
  
  // 错误状态
  errors: PublishErrors;
  
  // 验证状态
  validation: PublishValidation;
  
  // 草稿状态
  hasDraft: boolean;
  draftId?: string;
  autoSaveEnabled: boolean;
}

/**
 * 发布错误状态
 */
export interface PublishErrors {
  title?: string;
  content?: string;
  media?: string;
  topics?: string;
  location?: string;
  network?: string;
  security?: string;
  general?: string;
}

/**
 * 发布验证状态
 */
export interface PublishValidation {
  isValid: boolean;
  titleValid: boolean;
  contentValid: boolean;
  mediaValid: boolean;
  canPublish: boolean;
  requirements: string[];
}
// #endregion

// #region 3. 地点选择相关类型
/**
 * 地点选择状态
 */
export interface LocationSelectorState {
  isVisible: boolean;
  isLocating: boolean;
  locationPermission: 'granted' | 'denied' | 'pending' | 'unknown';
  currentLocation: PublishLocationData | null;
  searchResults: PublishLocationData[];
  searchKeyword: string;
  mapRegion: MapRegion;
  isLoading: boolean;
  error?: string;
}

/**
 * 地图区域类型
 */
export interface MapRegion {
  latitude: number;
  longitude: number;
  latitudeDelta: number;
  longitudeDelta: number;
}

/**
 * 定位服务类型
 */
export interface LocationServiceConfig {
  enableHighAccuracy: boolean;
  timeout: number;
  maximumAge: number;
  distanceFilter: number;
}
// #endregion

// #region 4. 话题选择相关类型
/**
 * 话题选择状态
 */
export interface TopicSelectorState {
  isVisible: boolean;
  selectedCategory: string;
  searchKeyword: string;
  searchResults: PublishTopicData[];
  categoryTopics: Record<string, PublishTopicData[]>;
  selectedTopics: PublishTopicData[];
  isLoading: boolean;
  isSearching: boolean;
  error?: string;
}

/**
 * 话题分类类型
 */
export interface TopicCategory {
  id: string;
  name: string;
  icon?: string;
  color?: string;
  description?: string;
  topicCount: number;
}
// #endregion

// #region 5. 媒体管理相关类型
/**
 * 媒体选择器状态
 */
export interface MediaSelectorState {
  isVisible: boolean;
  sourceType: 'camera' | 'library' | null;
  mediaType: 'photo' | 'video' | 'mixed';
  selectionLimit: number;
  quality: number;
  allowsEditing: boolean;
  permissions: MediaPermissions;
}

/**
 * 媒体权限状态
 */
export interface MediaPermissions {
  camera: 'granted' | 'denied' | 'pending' | 'unknown';
  photoLibrary: 'granted' | 'denied' | 'pending' | 'unknown';
  microphone: 'granted' | 'denied' | 'pending' | 'unknown';
}

/**
 * 媒体编辑选项
 */
export interface MediaEditOptions {
  allowCrop: boolean;
  allowRotate: boolean;
  allowFilter: boolean;
  allowCompress: boolean;
  maxWidth: number;
  maxHeight: number;
  quality: number;
}
// #endregion

// #region 6. API相关类型
/**
 * 发布API请求类型
 */
export interface PublishPostRequest {
  title: string;
  content: string;
  mediaIds: string[];
  topicIds: string[];
  location?: {
    latitude: number;
    longitude: number;
    address: string;
    poiId?: string;
  };
  privacy: string;
  settings: {
    allowComment: boolean;
    allowShare: boolean;
  };
}

/**
 * 媒体上传请求类型
 */
export interface MediaUploadRequest {
  file: File | any;
  type: 'image' | 'video';
  compress: boolean;
  quality?: number;
}

/**
 * 话题搜索请求类型
 */
export interface TopicSearchRequest {
  keyword: string;
  category?: string;
  limit: number;
  offset: number;
}

/**
 * 地点搜索请求类型
 */
export interface LocationSearchRequest {
  keyword: string;
  latitude?: number;
  longitude?: number;
  radius?: number;
  limit: number;
}
// #endregion

// #region 7. 组件Props类型
/**
 * 发布页面Props
 */
export interface PublishPageProps {
  onPublishSuccess?: (postId: string) => void;
  onPublishCancel?: () => void;
  initialDraft?: Partial<PublishContentData>;
  mode?: 'create' | 'edit';
  postId?: string;
}

/**
 * 内容编辑区域Props
 */
export interface ContentEditorProps {
  title: string;
  content: string;
  onTitleChange: (title: string) => void;
  onContentChange: (content: string) => void;
  titlePlaceholder?: string;
  contentPlaceholder?: string;
  maxTitleLength?: number;
  maxContentLength?: number;
  errors?: Pick<PublishErrors, 'title' | 'content'>;
}

/**
 * 媒体管理区域Props
 */
export interface MediaManagerProps {
  mediaItems: PublishMediaItem[];
  onAddMedia: () => void;
  onRemoveMedia: (id: string) => void;
  onEditMedia: (id: string) => void;
  maxItems?: number;
  allowedTypes?: ('image' | 'video')[];
}

/**
 * 功能标签区域Props
 */
export interface FunctionTagsProps {
  selectedTopics: PublishTopicData[];
  selectedLocation: PublishLocationData | null;
  onTopicSelect: () => void;
  onLocationSelect: () => void;
  onTopicRemove: (topicId: string) => void;
  onLocationRemove: () => void;
}

/**
 * 发布控制区域Props
 */
export interface PublishControlProps {
  isValid: boolean;
  isPublishing: boolean;
  publishProgress: number;
  onPublish: () => void;
  onCancel: () => void;
  onDraft: () => void;
}
// #endregion

// #region 8. 事件处理类型
/**
 * 发布事件类型
 */
export type PublishEvent = 
  | { type: 'CONTENT_CHANGE'; payload: { field: keyof PublishContentData; value: any } }
  | { type: 'MEDIA_ADD'; payload: PublishMediaItem[] }
  | { type: 'MEDIA_REMOVE'; payload: string }
  | { type: 'TOPIC_SELECT'; payload: PublishTopicData[] }
  | { type: 'LOCATION_SELECT'; payload: PublishLocationData }
  | { type: 'PUBLISH_START' }
  | { type: 'PUBLISH_PROGRESS'; payload: number }
  | { type: 'PUBLISH_SUCCESS'; payload: string }
  | { type: 'PUBLISH_ERROR'; payload: string }
  | { type: 'VALIDATION_UPDATE'; payload: PublishValidation }
  | { type: 'DRAFT_SAVE'; payload: string }
  | { type: 'DRAFT_LOAD'; payload: PublishContentData };

/**
 * 发布钩子函数类型
 */
export interface PublishHooks {
  onContentChange?: (content: PublishContentData) => void;
  onMediaChange?: (media: PublishMediaItem[]) => void;
  onTopicChange?: (topics: PublishTopicData[]) => void;
  onLocationChange?: (location: PublishLocationData | null) => void;
  onValidationChange?: (validation: PublishValidation) => void;
  onPublishStart?: () => void;
  onPublishProgress?: (progress: number) => void;
  onPublishSuccess?: (postId: string) => void;
  onPublishError?: (error: string) => void;
}
// #endregion

// 导出所有类型（这些文件的类型会在需要时单独导入）
// export type * from './ContentEditorArea/types';
// export type * from './MediaManagerArea/types';
// export type * from './FunctionTagsArea/types';
// export type * from './PublishControlArea/types';
// export type * from './LocationSelectorDrawer/types';
// export type * from './TopicSelectorPage/types';
