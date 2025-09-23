/**
 * 发布页面状态管理钩子导出
 * 
 * 统一导出所有状态管理相关的钩子函数
 */

// 核心状态管理
export { usePublishState } from './usePublishState';
export { usePublishData } from './usePublishData';

// 功能模块状态管理
export { useMediaManager } from './useMediaManager';
export { useLocationSelector } from './useLocationSelector';
export { useTopicSelector } from './useTopicSelector';

// 辅助功能钩子
export { useContentValidator } from './useContentValidator';
export { useDraftManager } from './useDraftManager';

// 类型导出
export type {
  PublishState,
  PublishData,
  MediaManagerState,
  LocationSelectorState,
  TopicSelectorState,
  ValidationState,
  DraftState,
} from './types';
