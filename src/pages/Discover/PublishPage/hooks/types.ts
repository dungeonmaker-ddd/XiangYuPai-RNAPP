/**
 * 发布页面钩子类型定义
 * 
 * 定义所有状态管理钩子的类型
 */

import type { 
  PublishContentData, 
  PublishMediaItem, 
  PublishTopicData, 
  PublishLocationData,
  PublishErrors,
  PublishValidation 
} from '../types';

// #region 1. 核心状态类型
/**
 * 发布主状态
 */
export interface PublishState {
  isLoading: boolean;
  isPublishing: boolean;
  publishProgress: number;
  errors: PublishErrors;
  validation: PublishValidation;
  currentStep: 'editing' | 'validating' | 'uploading' | 'submitting' | 'completed';
}

/**
 * 发布数据状态
 */
export interface PublishData {
  contentData: PublishContentData;
  isDirty: boolean;
  lastModified: Date | null;
}
// #endregion

// #region 2. 媒体管理状态
/**
 * 媒体管理状态
 */
export interface MediaManagerState {
  items: PublishMediaItem[];
  uploading: string[]; // 正在上传的媒体ID列表
  uploadQueue: string[]; // 上传队列
  totalProgress: number;
  errors: Record<string, string>;
}
// #endregion

// #region 3. 位置选择状态
/**
 * 位置选择状态
 */
export interface LocationSelectorState {
  isVisible: boolean;
  isLocating: boolean;
  locationPermission: 'granted' | 'denied' | 'pending' | 'unknown';
  currentLocation: PublishLocationData | null;
  selectedLocation: PublishLocationData | null;
  searchResults: PublishLocationData[];
  searchKeyword: string;
  isLoading: boolean;
  error?: string;
}
// #endregion

// #region 4. 话题选择状态
/**
 * 话题选择状态
 */
export interface TopicSelectorState {
  isVisible: boolean;
  selectedTopics: PublishTopicData[];
  selectedCategory: string;
  searchKeyword: string;
  searchResults: PublishTopicData[];
  categoryTopics: Record<string, PublishTopicData[]>;
  isLoading: boolean;
  isSearching: boolean;
  error?: string;
}
// #endregion

// #region 5. 验证状态
/**
 * 验证状态
 */
export interface ValidationState {
  isValid: boolean;
  isValidating: boolean;
  lastValidated: Date | null;
  errors: string[];
  warnings: string[];
  fieldErrors: Record<string, string>;
}
// #endregion

// #region 6. 草稿状态
/**
 * 草稿状态
 */
export interface DraftState {
  hasDraft: boolean;
  draftId?: string;
  autoSaveEnabled: boolean;
  isSaving: boolean;
  lastSaved: Date | null;
  saveError?: string;
}
// #endregion

// #region 7. 钩子返回类型
/**
 * usePublishState 返回类型
 */
export interface UsePublishStateReturn {
  state: PublishState;
  updateState: (updates: Partial<PublishState>) => void;
  resetState: () => void;
  setLoading: (loading: boolean) => void;
  setPublishing: (publishing: boolean) => void;
  setProgress: (progress: number) => void;
  setError: (error: string) => void;
  clearErrors: () => void;
}

/**
 * usePublishData 返回类型
 */
export interface UsePublishDataReturn {
  contentData: PublishContentData;
  isDirty: boolean;
  updateContentData: (updates: Partial<PublishContentData>) => void;
  resetContentData: () => void;
  setTitle: (title: string) => void;
  setContent: (content: string) => void;
  markDirty: () => void;
  markClean: () => void;
}

/**
 * useMediaManager 返回类型
 */
export interface UseMediaManagerReturn {
  mediaItems: PublishMediaItem[];
  uploading: string[];
  totalProgress: number;
  addMedia: (items: PublishMediaItem[]) => void;
  removeMedia: (id: string) => void;
  updateMedia: (id: string, updates: Partial<PublishMediaItem>) => void;
  updateMediaProgress: (id: string, progress: number, status?: string, error?: string) => void;
  clearMedia: () => void;
  startUpload: (id: string) => void;
  completeUpload: (id: string) => void;
  failUpload: (id: string, error: string) => void;
}

/**
 * useLocationSelector 返回类型
 */
export interface UseLocationSelectorReturn {
  isLocationSelectorVisible: boolean;
  selectedLocation: PublishLocationData | null;
  currentLocation: PublishLocationData | null;
  searchResults: PublishLocationData[];
  isLocating: boolean;
  showLocationSelector: () => void;
  hideLocationSelector: () => void;
  selectLocation: (location: PublishLocationData) => void;
  clearLocation: () => void;
  getCurrentLocation: () => Promise<void>;
  searchLocations: (keyword: string) => Promise<void>;
}

/**
 * useTopicSelector 返回类型
 */
export interface UseTopicSelectorReturn {
  isTopicSelectorVisible: boolean;
  selectedTopics: PublishTopicData[];
  categoryTopics: Record<string, PublishTopicData[]>;
  searchResults: PublishTopicData[];
  showTopicSelector: () => void;
  hideTopicSelector: () => void;
  selectTopics: (topics: PublishTopicData[]) => void;
  addTopic: (topic: PublishTopicData) => boolean;
  removeTopic: (topicId: string) => void;
  clearTopics: () => void;
  searchTopics: (keyword: string) => Promise<void>;
  loadCategoryTopics: (category: string) => Promise<void>;
}

/**
 * useContentValidator 返回类型
 */
export interface UseContentValidatorReturn {
  validation: ValidationState;
  validateContent: (content: PublishContentData) => Promise<ValidationState>;
  clearValidation: () => void;
  isValid: boolean;
  errors: string[];
  warnings: string[];
}

/**
 * useDraftManager 返回类型
 */
export interface UseDraftManagerReturn {
  hasDraft: boolean;
  draftId?: string;
  autoSaveEnabled: boolean;
  isSaving: boolean;
  lastSaved: Date | null;
  saveDraft: (data: PublishContentData) => Promise<void>;
  loadDraft: () => Promise<PublishContentData | null>;
  clearDraft: () => Promise<void>;
  enableAutoSave: () => void;
  disableAutoSave: () => void;
}
// #endregion
