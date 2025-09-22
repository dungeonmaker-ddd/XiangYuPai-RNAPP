/**
 * 🔍 搜索模块类型定义
 * 
 * 基于搜索结果模块架构设计的完整类型系统
 * 支持多维度搜索：全部/用户/下单/话题
 */

// ══════════════════════════════════════════════════════════════
// 1. 基础枚举类型
// ══════════════════════════════════════════════════════════════

/** 搜索分类标签类型 */
export enum TabType {
  ALL = 'all',        // 全部
  USERS = 'users',    // 用户
  ORDERS = 'orders',  // 下单
  TOPICS = 'topics'   // 话题
}

/** 内容类型 */
export enum ContentType {
  IMAGE = 'image',    // 图片内容
  VIDEO = 'video',    // 视频内容
  TEXT = 'text',      // 文字动态
  ACTIVITY = 'activity' // 同城活动
}

/** 用户状态 */
export enum UserStatus {
  ONLINE = 'online',           // 在线
  OFFLINE = 'offline',         // 离线
  AVAILABLE = 'available',     // 可预约
  BUSY = 'busy'               // 忙碌
}

/** 关注状态 */
export enum FollowStatus {
  NOT_FOLLOWED = 'not_followed',   // 未关注
  FOLLOWED = 'followed',           // 已关注
  MUTUAL = 'mutual'                // 互相关注
}

// ══════════════════════════════════════════════════════════════
// 2. 基础数据类型
// ══════════════════════════════════════════════════════════════

/** 位置信息 */
export interface LocationInfo {
  latitude: number;
  longitude: number;
  address: string;
  city: string;
  distance?: number; // 距离（km）
}

/** 用户基本信息 */
export interface UserInfo {
  id: string;
  username: string;
  avatar: string;
  gender: 'male' | 'female';
  age?: number;
  isVerified: boolean;        // 是否认证
  status: UserStatus;
  location?: LocationInfo;
  bio: string;               // 个性签名
  tags: string[];            // 用户标签
  gameSkills: string[];      // 游戏技能
}

/** 内容项数据 */
export interface ContentItem {
  id: string;
  type: ContentType;
  title: string;
  description: string;
  images?: string[];         // 图片列表
  videoUrl?: string;         // 视频URL
  videoCover?: string;       // 视频封面
  videoDuration?: number;    // 视频时长（秒）
  author: UserInfo;          // 作者信息
  likeCount: number;         // 点赞数
  commentCount: number;      // 评论数
  shareCount: number;        // 分享数
  createdAt: string;         // 创建时间
  location?: LocationInfo;   // 位置信息
  tags: string[];           // 内容标签
}

/** 服务信息 */
export interface ServiceInfo {
  id: string;
  provider: UserInfo;        // 服务提供者
  title: string;             // 服务标题
  description: string;       // 服务描述
  gameType: string;          // 游戏类型
  skillLevel: string;        // 技能等级
  price: number;             // 价格
  priceUnit: string;         // 价格单位
  contact: string;           // 联系方式
  rating: number;            // 评分
  orderCount: number;        // 订单数量
  tags: string[];           // 服务标签
  location?: LocationInfo;   // 位置信息
}

/** 话题信息 */
export interface TopicInfo {
  id: string;
  name: string;              // 话题名称
  description: string;       // 话题描述
  icon: string;             // 话题图标
  category: string;         // 话题分类
  isHot: boolean;           // 是否热门
  followCount: number;      // 关注人数
  postCount: number;        // 帖子数量
  isFollowed: boolean;      // 是否已关注
  tags: string[];          // 话题标签
}

// ══════════════════════════════════════════════════════════════
// 3. 搜索相关类型
// ══════════════════════════════════════════════════════════════

/** 搜索建议项 */
export interface SearchSuggestion {
  id: string;
  text: string;             // 建议文本
  type: 'keyword' | 'user' | 'topic'; // 建议类型
  highlight?: string;       // 高亮部分
}

/** 搜索历史项 */
export interface SearchHistoryItem {
  id: string;
  keyword: string;          // 搜索关键词
  timestamp: number;        // 搜索时间戳
  resultCount: number;      // 结果数量
}

/** 搜索参数 */
export interface SearchParams {
  keyword: string;          // 搜索关键词
  type: TabType;           // 搜索类型
  page: number;            // 页码
  pageSize: number;        // 每页数量
  filters?: SearchFilters; // 搜索过滤条件
}

/** 搜索过滤条件 */
export interface SearchFilters {
  location?: LocationInfo;  // 位置过滤
  gender?: 'male' | 'female'; // 性别过滤
  ageRange?: [number, number]; // 年龄范围
  priceRange?: [number, number]; // 价格范围
  tags?: string[];         // 标签过滤
  isOnline?: boolean;      // 是否在线
  isVerified?: boolean;    // 是否认证
}

/** 搜索结果 */
export interface SearchResult<T = any> {
  items: T[];              // 结果项列表
  total: number;           // 总数量
  page: number;            // 当前页码
  pageSize: number;        // 每页数量
  hasMore: boolean;        // 是否有更多
  keyword: string;         // 搜索关键词
  timestamp: number;       // 搜索时间戳
}

// ══════════════════════════════════════════════════════════════
// 4. 组件Props类型
// ══════════════════════════════════════════════════════════════

/** 搜索输入框Props */
export interface SearchInputProps {
  value: string;
  placeholder?: string;
  onChangeText: (text: string) => void;
  onSearch: (keyword: string) => void;
  onClear: () => void;
  loading?: boolean;
  autoFocus?: boolean;
}

/** 搜索标签Props */
export interface SearchTabsProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
  resultCounts?: Record<TabType, number>;
}

/** 搜索历史Props */
export interface SearchHistoryProps {
  history: SearchHistoryItem[];
  onHistorySelect: (item: SearchHistoryItem) => void;
  onHistoryClear: () => void;
  onHistoryDelete: (id: string) => void;
}

/** 搜索建议Props */
export interface SearchSuggestionsProps {
  suggestions: SearchSuggestion[];
  onSuggestionSelect: (suggestion: SearchSuggestion) => void;
  keyword: string;
}

/** 内容卡片Props */
export interface ContentCardProps {
  item: ContentItem;
  onPress: (item: ContentItem) => void;
  onUserPress: (user: UserInfo) => void;
  onLike: (id: string) => void;
  onComment: (id: string) => void;
  onShare: (id: string) => void;
}

/** 用户结果卡片Props */
export interface UserResultCardProps {
  user: UserInfo;
  followStatus: FollowStatus;
  onPress: (user: UserInfo) => void;
  onFollow: (userId: string) => void;
  onContact: (userId: string) => void;
}

/** 服务结果卡片Props */
export interface ServiceResultCardProps {
  service: ServiceInfo;
  onPress: (service: ServiceInfo) => void;
  onOrder: (serviceId: string) => void;
  onContact: (userId: string) => void;
}

/** 话题结果卡片Props */
export interface TopicResultCardProps {
  topic: TopicInfo;
  onPress: (topic: TopicInfo) => void;
  onFollow: (topicId: string) => void;
}

// ══════════════════════════════════════════════════════════════
// 5. 状态管理类型
// ══════════════════════════════════════════════════════════════

/** 搜索状态 */
export interface SearchState {
  // 搜索基础状态
  keyword: string;
  activeTab: TabType;
  
  // 搜索结果
  allResults: ContentItem[];
  userResults: UserInfo[];
  serviceResults: ServiceInfo[];
  topicResults: TopicInfo[];
  
  // 加载状态
  loading: boolean;
  refreshing: boolean;
  loadingMore: boolean;
  
  // 错误状态
  error: string | null;
  
  // 分页状态
  currentPage: Record<TabType, number>;
  hasMore: Record<TabType, boolean>;
  
  // 搜索辅助
  suggestions: SearchSuggestion[];
  history: SearchHistoryItem[];
  
  // UI状态
  showSuggestions: boolean;
  showHistory: boolean;
}

/** 搜索Action类型 */
export type SearchAction =
  | { type: 'SET_KEYWORD'; payload: string }
  | { type: 'SET_ACTIVE_TAB'; payload: TabType }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_REFRESHING'; payload: boolean }
  | { type: 'SET_LOADING_MORE'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'SET_ALL_RESULTS'; payload: ContentItem[] }
  | { type: 'SET_USER_RESULTS'; payload: UserInfo[] }
  | { type: 'SET_SERVICE_RESULTS'; payload: ServiceInfo[] }
  | { type: 'SET_TOPIC_RESULTS'; payload: TopicInfo[] }
  | { type: 'APPEND_RESULTS'; payload: { tab: TabType; data: any[] } }
  | { type: 'SET_SUGGESTIONS'; payload: SearchSuggestion[] }
  | { type: 'SET_HISTORY'; payload: SearchHistoryItem[] }
  | { type: 'ADD_HISTORY'; payload: SearchHistoryItem }
  | { type: 'REMOVE_HISTORY'; payload: string }
  | { type: 'CLEAR_HISTORY' }
  | { type: 'SET_SHOW_SUGGESTIONS'; payload: boolean }
  | { type: 'SET_SHOW_HISTORY'; payload: boolean }
  | { type: 'UPDATE_PAGE'; payload: { tab: TabType; page: number } }
  | { type: 'SET_HAS_MORE'; payload: { tab: TabType; hasMore: boolean } }
  | { type: 'RESET_SEARCH' };

// ══════════════════════════════════════════════════════════════
// 6. API相关类型
// ══════════════════════════════════════════════════════════════

/** API响应基础类型 */
export interface ApiResponse<T = any> {
  success: boolean;
  data: T;
  message?: string;
  code?: number;
  timestamp: number;
}

/** 搜索API请求参数 */
export interface SearchApiParams {
  q: string;                // 查询关键词
  type?: string;           // 搜索类型
  page?: number;           // 页码
  limit?: number;          // 每页数量
  filters?: Record<string, any>; // 过滤条件
}

/** 搜索建议API响应 */
export interface SearchSuggestionsResponse {
  suggestions: SearchSuggestion[];
  total: number;
}

/** 搜索结果API响应 */
export interface SearchResultsResponse<T = any> {
  items: T[];
  pagination: {
    page: number;
    pageSize: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
  meta: {
    keyword: string;
    searchTime: number;
    filters: Record<string, any>;
  };
}

// ══════════════════════════════════════════════════════════════
// 7. Hook返回类型
// ══════════════════════════════════════════════════════════════

/** 搜索状态Hook返回类型 */
export interface UseSearchStateReturn {
  state: SearchState;
  actions: {
    setKeyword: (keyword: string) => void;
    setActiveTab: (tab: TabType) => void;
    search: (keyword: string, tab?: TabType) => Promise<void>;
    loadMore: () => Promise<void>;
    refresh: () => Promise<void>;
    clearSearch: () => void;
    addToHistory: (keyword: string, resultCount: number) => void;
    clearHistory: () => void;
    removeHistoryItem: (id: string) => void;
  };
}

/** 搜索API Hook返回类型 */
export interface UseSearchApiReturn {
  searchAll: (params: SearchParams) => Promise<SearchResult<ContentItem>>;
  searchUsers: (params: SearchParams) => Promise<SearchResult<UserInfo>>;
  searchServices: (params: SearchParams) => Promise<SearchResult<ServiceInfo>>;
  searchTopics: (params: SearchParams) => Promise<SearchResult<TopicInfo>>;
  getSuggestions: (keyword: string) => Promise<SearchSuggestion[]>;
  loading: boolean;
  error: string | null;
}

/** 搜索历史Hook返回类型 */
export interface UseSearchHistoryReturn {
  history: SearchHistoryItem[];
  addHistory: (keyword: string, resultCount: number) => void;
  removeHistory: (id: string) => void;
  clearHistory: () => void;
  loading: boolean;
}
