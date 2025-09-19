/**
 * 瀑布流模块主状态管理
 * 基于通用组件架构核心标准 - 状态管理层
 * 
 * @version 2.0.0
 * @author 架构团队
 */

import { useState, useCallback, useMemo } from 'react';
import { 
  WaterfallModuleState, 
  ContentItem, 
  TabType, 
  LayoutConfig, 
  LayoutItem 
} from './types';
import { DEFAULT_LAYOUT_CONFIG } from './constants';

/**
 * 瀑布流模块主状态管理Hook
 * 集中管理瀑布流的所有状态
 */
export const useWaterfallModule = (initialData: ContentItem[] = []) => {
  // #region 数据状态
  const [data, setData] = useState<ContentItem[]>(initialData);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [error, setError] = useState<string | null>(null);
  // #endregion

  // #region 布局状态
  const [layoutConfig, setLayoutConfig] = useState<LayoutConfig>(DEFAULT_LAYOUT_CONFIG);
  const [layoutItems, setLayoutItems] = useState<LayoutItem[]>([]);
  const [totalHeight, setTotalHeight] = useState(0);
  // #endregion

  // #region 滚动状态
  const [scrollOffset, setScrollOffset] = useState(0);
  const [containerHeight, setContainerHeight] = useState(0);
  const [lastScrollDirection, setLastScrollDirection] = useState<'up' | 'down'>('down');
  // #endregion

  // #region 虚拟化状态
  const [visibleItems, setVisibleItems] = useState<LayoutItem[]>([]);
  const [virtualizedItemStates] = useState(new Map<string, 'visible' | 'buffered' | 'recycled'>());
  // #endregion

  // #region 状态更新方法
  /**
   * 更新数据
   */
  const updateData = useCallback((newData: ContentItem[]) => {
    setData(newData);
    setError(null);
  }, []);

  /**
   * 追加数据（加载更多）
   */
  const appendData = useCallback((newItems: ContentItem[]) => {
    setData(prev => [...prev, ...newItems]);
    if (newItems.length === 0) {
      setHasMore(false);
    }
  }, []);

  /**
   * 更新布局配置
   */
  const updateLayoutConfig = useCallback((newConfig: Partial<LayoutConfig>) => {
    setLayoutConfig(prev => ({ ...prev, ...newConfig }));
  }, []);

  /**
   * 更新滚动状态
   */
  const updateScrollState = useCallback((
    offset: number, 
    height: number, 
    direction: 'up' | 'down'
  ) => {
    setScrollOffset(offset);
    setContainerHeight(height);
    setLastScrollDirection(direction);
  }, []);

  /**
   * 更新可见项目
   */
  const updateVisibleItems = useCallback((items: LayoutItem[]) => {
    setVisibleItems(items);
  }, []);
  // #endregion

  // #region 加载状态管理
  /**
   * 开始加载
   */
  const startLoading = useCallback(() => {
    setLoading(true);
    setError(null);
  }, []);

  /**
   * 结束加载
   */
  const stopLoading = useCallback(() => {
    setLoading(false);
  }, []);

  /**
   * 开始刷新
   */
  const startRefreshing = useCallback(() => {
    setRefreshing(true);
    setError(null);
  }, []);

  /**
   * 结束刷新
   */
  const stopRefreshing = useCallback(() => {
    setRefreshing(false);
  }, []);

  /**
   * 设置错误状态
   */
  const setErrorState = useCallback((errorMessage: string) => {
    setError(errorMessage);
    setLoading(false);
    setRefreshing(false);
  }, []);
  // #endregion

  // #region 计算属性
  /**
   * 完整的模块状态
   */
  const moduleState = useMemo((): WaterfallModuleState => ({
    // 数据状态
    data,
    loading,
    refreshing,
    hasMore,
    
    // 布局状态
    layoutConfig,
    layoutItems,
    totalHeight,
    
    // 滚动状态
    scrollOffset,
    containerHeight,
    lastScrollDirection,
    
    // 虚拟化状态
    visibleItems,
    virtualizedItemStates,
  }), [
    data, loading, refreshing, hasMore,
    layoutConfig, layoutItems, totalHeight,
    scrollOffset, containerHeight, lastScrollDirection,
    visibleItems, virtualizedItemStates
  ]);

  /**
   * 是否为空状态
   */
  const isEmpty = useMemo(() => {
    return data.length === 0 && !loading && !refreshing;
  }, [data.length, loading, refreshing]);

  /**
   * 是否可以加载更多
   */
  const canLoadMore = useMemo(() => {
    return hasMore && !loading && !refreshing && data.length > 0;
  }, [hasMore, loading, refreshing, data.length]);
  // #endregion

  // #region 重置方法
  /**
   * 重置所有状态
   */
  const reset = useCallback(() => {
    setData([]);
    setLoading(false);
    setRefreshing(false);
    setHasMore(true);
    setError(null);
    setLayoutItems([]);
    setTotalHeight(0);
    setScrollOffset(0);
    setContainerHeight(0);
    setVisibleItems([]);
    virtualizedItemStates.clear();
  }, [virtualizedItemStates]);
  // #endregion

  return {
    // 状态
    moduleState,
    data,
    loading,
    refreshing,
    hasMore,
    error,
    layoutConfig,
    layoutItems,
    totalHeight,
    scrollOffset,
    containerHeight,
    lastScrollDirection,
    visibleItems,
    isEmpty,
    canLoadMore,

    // 方法
    updateData,
    appendData,
    updateLayoutConfig,
    updateScrollState,
    updateVisibleItems,
    startLoading,
    stopLoading,
    startRefreshing,
    stopRefreshing,
    setErrorState,
    reset,
  };
};
