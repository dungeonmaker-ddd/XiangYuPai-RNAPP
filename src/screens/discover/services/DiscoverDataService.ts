/**
 * 发现页面数据服务
 * 基于《纯结构架构图标准模板》的数据管理模块
 * 负责数据获取、状态管理、缓存处理
 */

import { ContentItem, TabType, ContentListResponse, ApiResponse, LikeResponse } from '../types';
import { API_ENDPOINTS, REQUEST_CONFIG, ERROR_MESSAGES } from '../constants';

// 数据服务配置接口
export interface DataServiceConfig {
  enableCache: boolean;
  cacheExpireTime: number;
  maxRetryCount: number;
  requestTimeout: number;
}

// 数据缓存接口
interface DataCache {
  [key: string]: {
    data: ContentItem[];
    timestamp: number;
    hasMore: boolean;
    totalCount: number;
  };
}

// 分页信息接口
interface PaginationInfo {
  [key in TabType]: {
    currentPage: number;
    nextCursor?: string;
    hasMore: boolean;
  };
}

/**
 * 发现页面数据服务类
 */
export class DiscoverDataService {
  private static instance: DiscoverDataService;
  private config: DataServiceConfig;
  private cache: DataCache = {};
  private pagination: PaginationInfo = {
    follow: { currentPage: 1, hasMore: true },
    hot: { currentPage: 1, hasMore: true },
    local: { currentPage: 1, hasMore: true },
  };

  private constructor(config?: Partial<DataServiceConfig>) {
    this.config = {
      enableCache: true,
      cacheExpireTime: 5 * 60 * 1000, // 5分钟
      maxRetryCount: 3,
      requestTimeout: 10000,
      ...config,
    };
  }

  /**
   * 获取单例实例
   */
  public static getInstance(config?: Partial<DataServiceConfig>): DiscoverDataService {
    if (!DiscoverDataService.instance) {
      DiscoverDataService.instance = new DiscoverDataService(config);
    }
    return DiscoverDataService.instance;
  }

  /**
   * 生成模拟内容数据
   */
  private generateMockContent(page: number, tabType: TabType, pageSize: number = 20): ContentItem[] {
    return Array.from({ length: pageSize }, (_, index) => {
      const id = `${tabType}_${page}_${index}`;
      const imageIndex = (page - 1) * pageSize + index + 1;
      
      return {
        id,
        type: Math.random() > 0.8 ? 'video' : 'image',
        imageUrl: `https://picsum.photos/400/${300 + Math.floor(Math.random() * 200)}?random=${imageIndex}`,
        title: `瀑布流内容 ${tabType} ${imageIndex}`,
        description: '这是一个测试描述内容，用于展示卡片布局效果。',
        user: {
          id: `user_${imageIndex}`,
          nickname: `用户${imageIndex}`,
          avatar: `https://picsum.photos/100/100?random=${imageIndex + 1000}`,
          isFollowing: Math.random() > 0.7,
          verified: Math.random() > 0.8,
        },
        likeCount: Math.floor(Math.random() * 1000),
        commentCount: Math.floor(Math.random() * 100),
        shareCount: Math.floor(Math.random() * 50),
        isLiked: Math.random() > 0.8,
        isCollected: Math.random() > 0.9,
        createdAt: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString(),
        updatedAt: new Date().toISOString(),
        width: 400,
        height: 300 + Math.floor(Math.random() * 200),
        tags: this.generateRandomTags(),
        location: Math.random() > 0.5 ? {
          latitude: 39.9042 + (Math.random() - 0.5) * 0.1,
          longitude: 116.4074 + (Math.random() - 0.5) * 0.1,
          address: `北京市朝阳区测试地址${imageIndex}`,
        } : undefined,
      };
    });
  }

  /**
   * 生成随机标签
   */
  private generateRandomTags(): string[] {
    const allTags = ['美食', '旅行', '摄影', '日常', '风景', '萌宠', '时尚', '健身', '音乐', '艺术'];
    const tagCount = Math.floor(Math.random() * 3) + 1; // 1-3个标签
    const shuffled = allTags.sort(() => 0.5 - Math.random());
    return shuffled.slice(0, tagCount);
  }

  /**
   * 模拟API调用
   */
  private async mockApiCall<T>(data: T, delay: number = 800): Promise<ApiResponse<T>> {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        // 模拟网络错误 (5% 概率)
        if (Math.random() < 0.05) {
          reject(new Error(ERROR_MESSAGES.NETWORK_ERROR));
          return;
        }
        
        resolve({
          code: 200,
          message: 'success',
          data,
          success: true,
        });
      }, delay);
    });
  }

  /**
   * 获取缓存key
   */
  private getCacheKey(tabType: TabType, page: number): string {
    return `${tabType}_page_${page}`;
  }

  /**
   * 检查缓存是否有效
   */
  private isCacheValid(cacheKey: string): boolean {
    if (!this.config.enableCache || !this.cache[cacheKey]) {
      return false;
    }
    
    const cacheItem = this.cache[cacheKey];
    const now = Date.now();
    return (now - cacheItem.timestamp) < this.config.cacheExpireTime;
  }

  /**
   * 设置缓存
   */
  private setCache(cacheKey: string, data: ContentItem[], hasMore: boolean, totalCount: number): void {
    if (!this.config.enableCache) return;
    
    this.cache[cacheKey] = {
      data,
      timestamp: Date.now(),
      hasMore,
      totalCount,
    };
  }

  /**
   * 获取内容列表
   */
  public async getContentList(
    tabType: TabType, 
    page: number = 1, 
    pageSize: number = REQUEST_CONFIG.PAGE_SIZE
  ): Promise<ContentListResponse> {
    const cacheKey = this.getCacheKey(tabType, page);
    
    // 检查缓存
    if (this.isCacheValid(cacheKey)) {
      const cachedData = this.cache[cacheKey];
      return {
        list: cachedData.data,
        hasMore: cachedData.hasMore,
        nextCursor: cachedData.hasMore ? `page_${page + 1}` : undefined,
        total: cachedData.totalCount,
      };
    }

    try {
      // 生成模拟数据
      const mockContent = this.generateMockContent(page, tabType, pageSize);
      const hasMore = page < 5; // 模拟5页数据
      const totalCount = 100;

      const mockResponse: ContentListResponse = {
        list: mockContent,
        hasMore,
        nextCursor: hasMore ? `page_${page + 1}` : undefined,
        total: totalCount,
      };

      // 模拟API调用
      const response = await this.mockApiCall(mockResponse);
      
      if (response.success) {
        // 更新分页信息
        this.pagination[tabType] = {
          currentPage: page,
          nextCursor: response.data.nextCursor,
          hasMore: response.data.hasMore,
        };

        // 设置缓存
        this.setCache(cacheKey, response.data.list, response.data.hasMore, response.data.total);
        
        return response.data;
      } else {
        throw new Error(response.message || ERROR_MESSAGES.SERVER_ERROR);
      }
    } catch (error) {
      console.error(`获取${tabType}内容失败:`, error);
      throw error;
    }
  }

  /**
   * 刷新内容（清除缓存并重新获取）
   */
  public async refreshContent(tabType: TabType): Promise<ContentListResponse> {
    // 清除相关缓存
    Object.keys(this.cache).forEach(key => {
      if (key.startsWith(tabType)) {
        delete this.cache[key];
      }
    });

    // 重置分页信息
    this.pagination[tabType] = {
      currentPage: 1,
      hasMore: true,
    };

    return this.getContentList(tabType, 1);
  }

  /**
   * 加载更多内容
   */
  public async loadMoreContent(tabType: TabType): Promise<ContentListResponse> {
    const paginationInfo = this.pagination[tabType];
    
    if (!paginationInfo.hasMore) {
      return {
        list: [],
        hasMore: false,
        total: 0,
      };
    }

    const nextPage = paginationInfo.currentPage + 1;
    return this.getContentList(tabType, nextPage);
  }

  /**
   * 点赞内容
   */
  public async likeContent(itemId: string): Promise<LikeResponse> {
    try {
      const mockResponse: LikeResponse = {
        isLiked: true,
        likeCount: Math.floor(Math.random() * 1000) + 1,
      };

      const response = await this.mockApiCall(mockResponse, 300);
      
      if (response.success) {
        // 更新缓存中的点赞状态
        this.updateItemInCache(itemId, { 
          isLiked: response.data.isLiked,
          likeCount: response.data.likeCount,
        });
        
        return response.data;
      } else {
        throw new Error(response.message || ERROR_MESSAGES.LIKE_ERROR);
      }
    } catch (error) {
      console.error('点赞失败:', error);
      throw error;
    }
  }

  /**
   * 取消点赞
   */
  public async unlikeContent(itemId: string): Promise<LikeResponse> {
    try {
      const mockResponse: LikeResponse = {
        isLiked: false,
        likeCount: Math.floor(Math.random() * 1000),
      };

      const response = await this.mockApiCall(mockResponse, 300);
      
      if (response.success) {
        // 更新缓存中的点赞状态
        this.updateItemInCache(itemId, { 
          isLiked: response.data.isLiked,
          likeCount: response.data.likeCount,
        });
        
        return response.data;
      } else {
        throw new Error(response.message || ERROR_MESSAGES.LIKE_ERROR);
      }
    } catch (error) {
      console.error('取消点赞失败:', error);
      throw error;
    }
  }

  /**
   * 更新缓存中的特定item
   */
  private updateItemInCache(itemId: string, updates: Partial<ContentItem>): void {
    Object.keys(this.cache).forEach(cacheKey => {
      const cacheItem = this.cache[cacheKey];
      const itemIndex = cacheItem.data.findIndex(item => item.id === itemId);
      
      if (itemIndex !== -1) {
        cacheItem.data[itemIndex] = {
          ...cacheItem.data[itemIndex],
          ...updates,
        };
      }
    });
  }

  /**
   * 获取分页信息
   */
  public getPaginationInfo(tabType: TabType) {
    return this.pagination[tabType];
  }

  /**
   * 清除所有缓存
   */
  public clearCache(): void {
    this.cache = {};
  }

  /**
   * 清除特定Tab的缓存
   */
  public clearTabCache(tabType: TabType): void {
    Object.keys(this.cache).forEach(key => {
      if (key.startsWith(tabType)) {
        delete this.cache[key];
      }
    });
  }

  /**
   * 获取缓存统计信息
   */
  public getCacheStats() {
    const totalItems = Object.values(this.cache).reduce((total, cache) => total + cache.data.length, 0);
    const cacheKeys = Object.keys(this.cache);
    
    return {
      totalCacheKeys: cacheKeys.length,
      totalCachedItems: totalItems,
      cacheKeys,
      cacheSize: JSON.stringify(this.cache).length, // 粗略的缓存大小估算
    };
  }

  /**
   * 更新服务配置
   */
  public updateConfig(newConfig: Partial<DataServiceConfig>): void {
    this.config = { ...this.config, ...newConfig };
  }
}

// 导出默认实例
export const discoverDataService = DiscoverDataService.getInstance();

// 导出便捷的API函数
export const DiscoverAPI = {
  getContentList: (tabType: TabType, page?: number) => 
    discoverDataService.getContentList(tabType, page),
    
  refreshContent: (tabType: TabType) => 
    discoverDataService.refreshContent(tabType),
    
  loadMoreContent: (tabType: TabType) => 
    discoverDataService.loadMoreContent(tabType),
    
  likeContent: (itemId: string) => 
    discoverDataService.likeContent(itemId),
    
  unlikeContent: (itemId: string) => 
    discoverDataService.unlikeContent(itemId),
    
  clearCache: () => 
    discoverDataService.clearCache(),
    
  getCacheStats: () => 
    discoverDataService.getCacheStats(),
};
