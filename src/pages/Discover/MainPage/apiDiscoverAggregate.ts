/**
 * 发现聚合API接口层
 * 复合业务接口 - 多个API组合调用
 * 
 * TOC (快速跳转):
 * [1] Imports
 * [2] Types & Schema  
 * [3] Constants & Config
 * [4] Utils & Helpers
 * [5] Aggregate Methods
 * [6] Batch Operations
 * [7] Performance Optimization
 * [8] Exports
 */

// #region 1. Imports
import {
  getHotContentList,
  getFollowContentList,
  getLocalContentList,
  toggleLikeContent,
  toggleFollowUser,
  updateUserLocation,
  apiCache,
} from './apiDiscoverMain';
import { 
  ContentListParams, 
  ContentItem, 
  DiscoverTabType, 
  UserInfo,
  LocationInfo 
} from './types';
import { API_CONFIG } from './constants';
// #endregion

// #region 2. Types & Schema
interface TabContentData {
  [DiscoverTabType.HOT]: ContentItem[];
  [DiscoverTabType.FOLLOW]: ContentItem[];
  [DiscoverTabType.LOCAL]: ContentItem[];
}

interface TabLoadingState {
  [DiscoverTabType.HOT]: boolean;
  [DiscoverTabType.FOLLOW]: boolean;
  [DiscoverTabType.LOCAL]: boolean;
}

interface TabMetadata {
  [DiscoverTabType.HOT]: { lastUpdateTime: number; hasMore: boolean; nextCursor?: string };
  [DiscoverTabType.FOLLOW]: { lastUpdateTime: number; hasMore: boolean; nextCursor?: string };
  [DiscoverTabType.LOCAL]: { lastUpdateTime: number; hasMore: boolean; nextCursor?: string };
}

interface UserEngagementData {
  userId: string;
  likedContentIds: string[];
  collectedContentIds: string[];
  followedUserIds: string[];
  engagementScore: number;
}

interface ContentRecommendationParams {
  userId: string;
  currentTab: DiscoverTabType;
  viewHistory: string[];
  location?: LocationInfo;
  preferences?: {
    contentTypes: string[];
    topics: string[];
  };
}

interface BatchInteractionParams {
  userId: string;
  interactions: Array<{
    contentId: string;
    type: 'like' | 'collect' | 'share';
    action: 'add' | 'remove';
  }>;
}
// #endregion

// #region 3. Constants & Config
const CACHE_KEYS = {
  ALL_TABS_DATA: 'discover:all_tabs_data',
  USER_ENGAGEMENT: 'discover:user_engagement',
  RECOMMENDATION: 'discover:recommendation',
  TAB_METADATA: 'discover:tab_metadata',
} as const;

const PRELOAD_CONFIG = {
  ENABLED: true,
  TAB_COUNT: 2, // 预加载相邻2个Tab的数据
  PAGE_COUNT: 1, // 预加载下一页数据
  DELAY: 1000, // 预加载延迟1秒
} as const;

const BATCH_CONFIG = {
  MAX_BATCH_SIZE: 10,
  BATCH_INTERVAL: 500, // 批量操作间隔500ms
} as const;
// #endregion

// #region 4. Utils & Helpers
class DiscoverAggregateManager {
  private tabData: Partial<TabContentData> = {};
  private tabMetadata: Partial<TabMetadata> = {};
  private loadingStates: Partial<TabLoadingState> = {};
  private preloadTimers = new Map<DiscoverTabType, NodeJS.Timeout>();

  /**
   * 获取缓存键
   */
  private getCacheKey(prefix: string, params: any): string {
    const paramString = JSON.stringify(params);
    const hash = this.simpleHash(paramString);
    return `${prefix}:${hash}`;
  }

  /**
   * 简单哈希函数
   */
  private simpleHash(str: string): string {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32bit integer
    }
    return Math.abs(hash).toString(36);
  }

  /**
   * 智能缓存策略
   */
  private shouldUseCache(tab: DiscoverTabType, params: ContentListParams): boolean {
    const metadata = this.tabMetadata[tab];
    if (!metadata) return false;

    const cacheAge = Date.now() - metadata.lastUpdateTime;
    const maxAge = tab === DiscoverTabType.HOT ? 2 * 60 * 1000 : 5 * 60 * 1000; // 热门2分钟，其他5分钟

    return cacheAge < maxAge && params.page === 1;
  }

  /**
   * 预加载策略
   */
  private schedulePreload(currentTab: DiscoverTabType, params: ContentListParams): void {
    if (!PRELOAD_CONFIG.ENABLED) return;

    // 清除现有预加载定时器
    this.preloadTimers.forEach((timer) => clearTimeout(timer));
    this.preloadTimers.clear();

    // 预加载相邻Tab数据
    const tabOrder = [DiscoverTabType.FOLLOW, DiscoverTabType.HOT, DiscoverTabType.LOCAL];
    const currentIndex = tabOrder.indexOf(currentTab);
    
    for (let i = 1; i <= PRELOAD_CONFIG.TAB_COUNT; i++) {
      const nextIndex = (currentIndex + i) % tabOrder.length;
      const nextTab = tabOrder[nextIndex];
      
      const timer = setTimeout(() => {
        this.preloadTabData(nextTab, { ...params, page: 1 });
      }, PRELOAD_CONFIG.DELAY * i);
      
      this.preloadTimers.set(nextTab, timer);
    }
  }

  /**
   * 预加载Tab数据
   */
  private async preloadTabData(tab: DiscoverTabType, params: ContentListParams): Promise<void> {
    if (this.loadingStates[tab]) return;

    try {
      this.loadingStates[tab] = true;
      
      let response;
      switch (tab) {
        case DiscoverTabType.HOT:
          response = await getHotContentList(params);
          break;
        case DiscoverTabType.FOLLOW:
          response = await getFollowContentList(params);
          break;
        case DiscoverTabType.LOCAL:
          response = await getLocalContentList(params);
          break;
        default:
          return;
      }

      // 缓存预加载数据
      const cacheKey = this.getCacheKey(`preload:${tab}`, params);
      apiCache.set(cacheKey, response.data, API_CONFIG.CACHE_EXPIRY_TIME);
      
      console.log(`预加载完成: ${tab}`, response.data.list.length);
    } catch (error) {
      console.warn(`预加载失败: ${tab}`, error);
    } finally {
      this.loadingStates[tab] = false;
    }
  }

  /**
   * 更新Tab元数据
   */
  private updateTabMetadata(tab: DiscoverTabType, hasMore: boolean, nextCursor?: string): void {
    this.tabMetadata[tab] = {
      lastUpdateTime: Date.now(),
      hasMore,
      nextCursor,
    };
  }
}

const aggregateManager = new DiscoverAggregateManager();
// #endregion

// #region 5. Aggregate Methods

/**
 * 初始化所有Tab数据
 * 用户首次进入发现页面时调用
 */
export const initializeAllTabsData = async (params: {
  userId?: string;
  location?: LocationInfo;
  pageSize?: number;
}): Promise<{
  hot: ContentItem[];
  follow: ContentItem[];
  local: ContentItem[];
  metadata: TabMetadata;
}> => {
  const { userId, location, pageSize = API_CONFIG.DEFAULT_PAGE_SIZE } = params;
  
  // 检查缓存
  const cacheKey = aggregateManager['getCacheKey'](CACHE_KEYS.ALL_TABS_DATA, params);
  const cached = apiCache.get(cacheKey);
  if (cached) {
    return cached;
  }

  try {
    // 并行请求所有Tab数据
    const [hotResponse, followResponse, localResponse] = await Promise.allSettled([
      getHotContentList({ 
        tab: DiscoverTabType.HOT, 
        page: 1, 
        size: pageSize, 
        userId 
      }),
      userId ? getFollowContentList({ 
        tab: DiscoverTabType.FOLLOW, 
        page: 1, 
        size: pageSize, 
        userId 
      }) : Promise.resolve({ data: { list: [], hasMore: false } }),
      location ? getLocalContentList({ 
        tab: DiscoverTabType.LOCAL, 
        page: 1, 
        size: pageSize, 
        userId, 
        location 
      }) : Promise.resolve({ data: { list: [], hasMore: false } }),
    ]);

    const result = {
      hot: hotResponse.status === 'fulfilled' ? hotResponse.value.data.list : [],
      follow: followResponse.status === 'fulfilled' ? followResponse.value.data.list : [],
      local: localResponse.status === 'fulfilled' ? localResponse.value.data.list : [],
      metadata: {
        [DiscoverTabType.HOT]: {
          lastUpdateTime: Date.now(),
          hasMore: hotResponse.status === 'fulfilled' ? hotResponse.value.data.hasMore : false,
          nextCursor: hotResponse.status === 'fulfilled' ? hotResponse.value.data.nextCursor : undefined,
        },
        [DiscoverTabType.FOLLOW]: {
          lastUpdateTime: Date.now(),
          hasMore: followResponse.status === 'fulfilled' ? followResponse.value.data.hasMore : false,
          nextCursor: followResponse.status === 'fulfilled' ? followResponse.value.data.nextCursor : undefined,
        },
        [DiscoverTabType.LOCAL]: {
          lastUpdateTime: Date.now(),
          hasMore: localResponse.status === 'fulfilled' ? localResponse.value.data.hasMore : false,
          nextCursor: localResponse.status === 'fulfilled' ? localResponse.value.data.nextCursor : undefined,
        },
      } as TabMetadata,
    };

    // 缓存结果
    apiCache.set(cacheKey, result, API_CONFIG.CACHE_EXPIRY_TIME);
    
    return result;
  } catch (error) {
    throw new Error(`初始化Tab数据失败: ${error.message}`);
  }
};

/**
 * 智能内容推荐
 * 基于用户行为和偏好推荐内容
 */
export const getRecommendedContent = async (params: ContentRecommendationParams): Promise<ContentItem[]> => {
  const cacheKey = aggregateManager['getCacheKey'](CACHE_KEYS.RECOMMENDATION, params);
  const cached = apiCache.get(cacheKey);
  if (cached) {
    return cached;
  }

  try {
    // 这里会调用推荐算法服务
    // 暂时使用混合策略：基于当前Tab + 用户历史 + 位置信息
    const baseParams = {
      tab: params.currentTab,
      page: 1,
      size: 20,
      userId: params.userId,
      location: params.location,
    };

    let recommendedContent: ContentItem[] = [];

    switch (params.currentTab) {
      case DiscoverTabType.HOT:
        const hotResponse = await getHotContentList(baseParams);
        recommendedContent = hotResponse.data.list;
        break;
        
      case DiscoverTabType.FOLLOW:
        const followResponse = await getFollowContentList(baseParams);
        recommendedContent = followResponse.data.list;
        break;
        
      case DiscoverTabType.LOCAL:
        const localResponse = await getLocalContentList(baseParams);
        recommendedContent = localResponse.data.list;
        break;
    }

    // 基于用户偏好过滤和排序
    if (params.preferences) {
      recommendedContent = recommendedContent.filter(item => {
        // 内容类型过滤
        if (params.preferences.contentTypes.length > 0) {
          return params.preferences.contentTypes.includes(item.type);
        }
        
        // 话题过滤
        if (params.preferences.topics.length > 0 && item.tags) {
          return item.tags.some(tag => params.preferences.topics.includes(tag));
        }
        
        return true;
      });
    }

    // 缓存推荐结果（较短的缓存时间）
    apiCache.set(cacheKey, recommendedContent, 10 * 60 * 1000); // 10分钟
    
    return recommendedContent;
  } catch (error) {
    throw new Error(`获取推荐内容失败: ${error.message}`);
  }
};

/**
 * 获取用户参与度数据
 * 用于个性化推荐和用户画像
 */
export const getUserEngagementData = async (userId: string): Promise<UserEngagementData> => {
  const cacheKey = `${CACHE_KEYS.USER_ENGAGEMENT}:${userId}`;
  const cached = apiCache.get(cacheKey);
  if (cached) {
    return cached;
  }

  try {
    // 这里会调用用户行为分析服务
    // 暂时返回模拟数据
    const engagementData: UserEngagementData = {
      userId,
      likedContentIds: [], // 从用户行为记录获取
      collectedContentIds: [], // 从用户行为记录获取
      followedUserIds: [], // 从关注关系获取
      engagementScore: 0, // 基于互动频率计算
    };

    // 缓存用户参与度数据（较长缓存时间）
    apiCache.set(cacheKey, engagementData, 30 * 60 * 1000); // 30分钟
    
    return engagementData;
  } catch (error) {
    throw new Error(`获取用户参与度数据失败: ${error.message}`);
  }
};
// #endregion

// #region 6. Batch Operations

// 移除批量操作 - 前端实际上是单个操作，不需要批量接口

/**
 * 智能预加载管理
 * 基于用户行为预测并预加载可能需要的内容
 */
export const smartPreloadManager = {
  /**
   * 开始智能预加载
   */
  startPreloading: (currentTab: DiscoverTabType, params: ContentListParams) => {
    aggregateManager['schedulePreload'](currentTab, params);
  },

  /**
   * 停止所有预加载
   */
  stopPreloading: () => {
    aggregateManager['preloadTimers'].forEach(timer => clearTimeout(timer));
    aggregateManager['preloadTimers'].clear();
  },

  /**
   * 检查预加载状态
   */
  getPreloadStatus: (): Record<DiscoverTabType, boolean> => {
    return {
      [DiscoverTabType.HOT]: aggregateManager['loadingStates'][DiscoverTabType.HOT] || false,
      [DiscoverTabType.FOLLOW]: aggregateManager['loadingStates'][DiscoverTabType.FOLLOW] || false,
      [DiscoverTabType.LOCAL]: aggregateManager['loadingStates'][DiscoverTabType.LOCAL] || false,
    };
  },
};
// #endregion

// #region 7. Performance Optimization

/**
 * 性能监控和优化
 */
export const performanceOptimizer = {
  /**
   * 监控API性能
   */
  monitorApiPerformance: (apiName: string, startTime: number) => {
    const duration = Date.now() - startTime;
    console.log(`API性能监控 - ${apiName}: ${duration}ms`);
    
    // 这里可以上报到性能监控平台
    if (typeof window !== 'undefined' && window.performance) {
      window.performance.mark(`api-${apiName}-end`);
      window.performance.measure(`api-${apiName}`, `api-${apiName}-start`, `api-${apiName}-end`);
    }
  },

  /**
   * 清理过期缓存
   */
  cleanupExpiredCache: () => {
    apiCache.clearExpired();
  },

  /**
   * 获取缓存统计信息
   */
  getCacheStats: () => {
    return {
      size: apiCache['cache'].size,
      maxSize: apiCache['maxSize'],
      hitRate: 0, // 这里需要实现命中率统计
    };
  },
};

/**
 * 错误恢复策略
 */
export const errorRecoveryManager = {
  /**
   * 重试策略
   */
  retryWithBackoff: async <T>(
    operation: () => Promise<T>,
    maxRetries: number = 3,
    baseDelay: number = 1000
  ): Promise<T> => {
    let lastError: Error;
    
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        return await operation();
      } catch (error) {
        lastError = error;
        
        if (attempt === maxRetries) {
          throw lastError;
        }
        
        const delay = baseDelay * Math.pow(2, attempt - 1);
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
    
    throw lastError;
  },

  /**
   * 降级策略
   */
  fallbackToCache: <T>(cacheKey: string, defaultValue: T): T => {
    const cached = apiCache.get(cacheKey);
    return cached || defaultValue;
  },
};
// #endregion

// #region 8. Exports
export default {
  initializeAllTabsData,
  getRecommendedContent,
  getUserEngagementData,
  batchUserInteractions,
  smartPreloadManager,
  performanceOptimizer,
  errorRecoveryManager,
};
// #endregion
