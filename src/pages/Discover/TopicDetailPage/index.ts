/**
 * 话题详情页面模块导出 - 最小化导出设计
 * 
 * 只导出前端实际需要的核心模块：
 * - 主要组件
 * - 业务逻辑Hook  
 * - API服务
 */

// #region 1. 主要组件导出
export { default as DiscoverTopicDetailPage } from './TopicDetailPage';
// #endregion

// #region 2. 业务逻辑Hooks导出
export { useTopicDetail } from './hooks';
// #endregion

// #region 3. API服务导出
export { apiDiscoverTopicDetail } from './apiDiscoverTopicDetail';
// #endregion

// #region 4. 核心类型导出（供其他模块使用）
export type {
  TopicInfo,
  TopicPostItem,
  GetTopicInfoRequest,
  GetTopicInfoResponse,
  GetTopicPostsRequest,
  GetTopicPostsResponse,
  LikeTopicPostRequest,
  LikeTopicPostResponse,
} from './types';
// #endregion

// #region 5. 默认导出
export { default } from './TopicDetailPage';
// #endregion
