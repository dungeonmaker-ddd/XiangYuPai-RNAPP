/**
 * 虚拟化管理器
 * 负责虚拟滚动的性能优化和内存管理
 */

import { LayoutItem } from './WaterfallLayoutEngine';

// 虚拟化配置接口
export interface VirtualizationConfig {
  enabled: boolean;
  bufferSize: number; // 缓冲区大小（屏幕高度的倍数）
  recycleThreshold: number; // 回收阈值
  maxCacheSize: number; // 最大缓存数量
}

// 可见项目范围
export interface VisibleRange {
  startIndex: number;
  endIndex: number;
  visibleItems: LayoutItem[];
}

/**
 * 虚拟化管理器类
 */
export class VirtualizationManager {
  private config: VirtualizationConfig;
  private cachedItems: Map<string, LayoutItem> = new Map();
  private lastVisibleRange: VisibleRange | null = null;

  constructor(config?: Partial<VirtualizationConfig>) {
    const defaultConfig: VirtualizationConfig = {
      enabled: true,
      bufferSize: 1.5,
      recycleThreshold: 50,
      maxCacheSize: 100,
    };

    this.config = { ...defaultConfig, ...config };
  }

  /**
   * 获取可见的items
   */
  public getVisibleItems(
    allItems: LayoutItem[],
    scrollOffset: number,
    containerHeight: number
  ): LayoutItem[] {
    if (!this.config.enabled || allItems.length === 0) {
      return allItems;
    }

    const bufferHeight = containerHeight * this.config.bufferSize;
    const visibleTop = Math.max(0, scrollOffset - bufferHeight);
    const visibleBottom = scrollOffset + containerHeight + bufferHeight;

    // 二分查找优化
    const startIndex = this.findStartIndex(allItems, visibleTop);
    const endIndex = this.findEndIndex(allItems, visibleBottom, startIndex);

    const visibleItems = allItems.slice(startIndex, endIndex + 1);

    // 缓存可见项目
    this.cacheVisibleItems(visibleItems);

    // 记录当前可见范围
    this.lastVisibleRange = {
      startIndex,
      endIndex,
      visibleItems,
    };

    return visibleItems;
  }

  /**
   * 二分查找起始索引
   */
  private findStartIndex(items: LayoutItem[], targetY: number): number {
    let left = 0;
    let right = items.length - 1;
    let result = 0;

    while (left <= right) {
      const mid = Math.floor((left + right) / 2);
      const item = items[mid];

      if (item.y + item.height >= targetY) {
        result = mid;
        right = mid - 1;
      } else {
        left = mid + 1;
      }
    }

    return result;
  }

  /**
   * 二分查找结束索引
   */
  private findEndIndex(items: LayoutItem[], targetY: number, startIndex: number): number {
    let left = startIndex;
    let right = items.length - 1;
    let result = items.length - 1;

    while (left <= right) {
      const mid = Math.floor((left + right) / 2);
      const item = items[mid];

      if (item.y <= targetY) {
        result = mid;
        left = mid + 1;
      } else {
        right = mid - 1;
      }
    }

    return result;
  }

  /**
   * 缓存可见项目
   */
  private cacheVisibleItems(items: LayoutItem[]): void {
    items.forEach(item => {
      this.cachedItems.set(item.id, item);
    });

    // 清理过期缓存
    this.cleanupCache();
  }

  /**
   * 清理过期缓存
   */
  private cleanupCache(): void {
    if (this.cachedItems.size > this.config.maxCacheSize) {
      const itemsToRemove = this.cachedItems.size - this.config.maxCacheSize;
      const keys = Array.from(this.cachedItems.keys());
      
      for (let i = 0; i < itemsToRemove; i++) {
        this.cachedItems.delete(keys[i]);
      }
    }
  }

  /**
   * 获取缓存的项目
   */
  public getCachedItem(id: string): LayoutItem | undefined {
    return this.cachedItems.get(id);
  }

  /**
   * 清空所有缓存
   */
  public clearCache(): void {
    this.cachedItems.clear();
    this.lastVisibleRange = null;
  }

  /**
   * 获取最后可见范围
   */
  public getLastVisibleRange(): VisibleRange | null {
    return this.lastVisibleRange;
  }

  /**
   * 更新配置
   */
  public updateConfig(newConfig: Partial<VirtualizationConfig>): void {
    this.config = { ...this.config, ...newConfig };
  }

  /**
   * 获取当前配置
   */
  public getConfig(): VirtualizationConfig {
    return { ...this.config };
  }

  /**
   * 获取缓存统计信息
   */
  public getCacheStats(): {
    cacheSize: number;
    maxCacheSize: number;
    lastVisibleCount: number;
  } {
    return {
      cacheSize: this.cachedItems.size,
      maxCacheSize: this.config.maxCacheSize,
      lastVisibleCount: this.lastVisibleRange?.visibleItems.length || 0,
    };
  }

  /**
   * 预计算下一批可见项目
   */
  public preloadNextBatch(
    allItems: LayoutItem[],
    currentScrollOffset: number,
    containerHeight: number,
    scrollDirection: 'up' | 'down' = 'down'
  ): LayoutItem[] {
    if (!this.config.enabled || !this.lastVisibleRange) {
      return [];
    }

    const bufferHeight = containerHeight * this.config.bufferSize;
    let preloadTop: number, preloadBottom: number;

    if (scrollDirection === 'down') {
      // 向下滚动，预加载下方内容
      preloadTop = currentScrollOffset + containerHeight;
      preloadBottom = preloadTop + bufferHeight;
    } else {
      // 向上滚动，预加载上方内容
      preloadBottom = currentScrollOffset;
      preloadTop = preloadBottom - bufferHeight;
    }

    const startIndex = this.findStartIndex(allItems, preloadTop);
    const endIndex = this.findEndIndex(allItems, preloadBottom, startIndex);

    return allItems.slice(startIndex, endIndex + 1);
  }

  /**
   * 检查是否需要回收组件
   */
  public shouldRecycleComponents(): boolean {
    return this.cachedItems.size > this.config.recycleThreshold;
  }
}

/**
 * 创建默认虚拟化管理器实例
 */
export const createDefaultVirtualizationManager = (): VirtualizationManager => {
  return new VirtualizationManager({
    enabled: true,
    bufferSize: 1.5,
    recycleThreshold: 50,
    maxCacheSize: 100,
  });
};
