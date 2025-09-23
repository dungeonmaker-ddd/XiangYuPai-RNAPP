/**
 * 话题详情页面Hooks模块导出
 * 
 * TOC (快速跳转):
 * [1] Main Business Hooks
 * [2] Utility Hooks
 * [3] Custom Hooks
 * [4] Re-exports
 * [5] Default Export
 */

// #region 1. Main Business Hooks
export { useTopicDetail } from './useTopicDetail';
// #endregion

// #region 2. Utility Hooks
// TODO: 添加其他工具性Hooks
// export { useTopicDetailCache } from './useTopicDetailCache';
// export { useTopicDetailAnimation } from './useTopicDetailAnimation';
// #endregion

// #region 3. Custom Hooks
// TODO: 添加自定义Hooks
// export { useTopicDetailGestures } from './useTopicDetailGestures';
// export { useTopicDetailAnalytics } from './useTopicDetailAnalytics';
// #endregion

// #region 4. Re-exports
// 重新导出所有相关类型
export type {
  TopicInfo,
  TopicPostItem,
  TopicDetailState,
  TopicStats,
  PostUser,
} from '../types';
// #endregion

// #region 5. Default Export
export default {
  useTopicDetail,
};
// #endregion
