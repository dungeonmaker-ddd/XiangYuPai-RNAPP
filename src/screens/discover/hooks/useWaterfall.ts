/**
 * 瀑布流布局管理Hook
 * 负责瀑布流的布局计算、尺寸管理、性能优化等UI布局逻辑
 */

import { useState, useCallback, useEffect, useMemo, useRef } from 'react';
import { Dimensions, ScaledSize } from 'react-native';
import { ContentItem } from '../types';
import { LAYOUT_CONSTANTS } from '../constants';

// 瀑布流布局项接口
export interface WaterfallLayoutItem extends ContentItem {
  columnIndex: number;
  x: number;
  y: number;
  calculatedWidth: number;
  calculatedHeight: number;
  imageHeight: number;
  contentHeight: number;
}

// 布局配置接口
interface WaterfallConfig {
  columnCount: number;
  columnGap: number;
  rowGap: number;
  paddingHorizontal: number;
  contentPadding: number;
}

// Hook状态接口
interface UseWaterfallState {
  layoutData: WaterfallLayoutItem[];
  columnHeights: number[];
  totalHeight: number;
  layoutReady: boolean;
  screenDimensions: ScaledSize;
  cardWidth: number;
}

// Hook返回值接口
interface UseWaterfallResult {
  // 布局数据
  layoutData: WaterfallLayoutItem[];
  columnCount: number;
  cardWidth: number;
  totalHeight: number;
  layoutReady: boolean;
  
  // 布局控制
  updateLayout: (data: ContentItem[]) => void;
  recalculateLayout: () => void;
  setColumnCount: (count: number) => void;
  resetLayout: () => void;
  
  // 配置管理
  updateConfig: (config: Partial<WaterfallConfig>) => void;
  getConfig: () => WaterfallConfig;
  
  // 事件回调
  onLayoutChange?: (layout: WaterfallLayoutItem[]) => void;
  onScrollToTop?: () => void;
  onScrollToBottom?: () => void;
  onLayoutError?: (error: Error) => void;
}

// Hook配置选项
interface UseWaterfallOptions {
  initialColumnCount?: number;
  columnGap?: number;
  rowGap?: number;
  paddingHorizontal?: number;
  contentPadding?: number;
  onLayoutChange?: (layout: WaterfallLayoutItem[]) => void;
  onScrollToTop?: () => void;
  onScrollToBottom?: () => void;
  onLayoutError?: (error: Error) => void;
}

// 默认配置
const DEFAULT_CONFIG: WaterfallConfig = {
  columnCount: LAYOUT_CONSTANTS.COLUMN_COUNT,
  columnGap: LAYOUT_CONSTANTS.COLUMN_GAP,
  rowGap: LAYOUT_CONSTANTS.MARGIN_MEDIUM,
  paddingHorizontal: LAYOUT_CONSTANTS.PADDING_HORIZONTAL,
  contentPadding: LAYOUT_CONSTANTS.PADDING_VERTICAL,
};

// 内容区域固定高度配置
const CONTENT_HEIGHTS = {
  USER_INFO_ROW: 40,      // 用户信息行高度
  TITLE_LINE_HEIGHT: 20,  // 标题行高
  ACTION_ROW: 36,         // 操作按钮行高度
  PADDING: 24,            // 内边距总和
};

export const useWaterfall = (
  initialData: ContentItem[] = [],
  options: UseWaterfallOptions = {}
): UseWaterfallResult => {
  
  // 配置状态
  const [config, setConfig] = useState<WaterfallConfig>({
    ...DEFAULT_CONFIG,
    columnCount: options.initialColumnCount || DEFAULT_CONFIG.columnCount,
    columnGap: options.columnGap || DEFAULT_CONFIG.columnGap,
    rowGap: options.rowGap || DEFAULT_CONFIG.rowGap,
    paddingHorizontal: options.paddingHorizontal || DEFAULT_CONFIG.paddingHorizontal,
    contentPadding: options.contentPadding || DEFAULT_CONFIG.contentPadding,
  });
  
  // Hook主状态
  const [state, setState] = useState<UseWaterfallState>(() => {
    const screenDimensions = Dimensions.get('window');
    const cardWidth = calculateCardWidth(screenDimensions.width, config);
    
    return {
      layoutData: [],
      columnHeights: new Array(config.columnCount).fill(0),
      totalHeight: 0,
      layoutReady: false,
      screenDimensions,
      cardWidth,
    };
  });
  
  // 原始数据引用
  const dataRef = useRef<ContentItem[]>(initialData);
  
  // 布局计算缓存
  const layoutCacheRef = useRef<Map<string, WaterfallLayoutItem>>(new Map());
  
  // 事件回调引用
  const callbacksRef = useRef({
    onLayoutChange: options.onLayoutChange,
    onScrollToTop: options.onScrollToTop,
    onScrollToBottom: options.onScrollToBottom,
    onLayoutError: options.onLayoutError,
  });

  // 更新回调引用
  useEffect(() => {
    callbacksRef.current = {
      onLayoutChange: options.onLayoutChange,
      onScrollToTop: options.onScrollToTop,
      onScrollToBottom: options.onScrollToBottom,
      onLayoutError: options.onLayoutError,
    };
  }, [options.onLayoutChange, options.onScrollToTop, options.onScrollToBottom, options.onLayoutError]);

  // 计算卡片宽度
  const calculateCardWidth = useCallback((screenWidth: number, layoutConfig: WaterfallConfig): number => {
    const availableWidth = screenWidth - layoutConfig.paddingHorizontal * 2;
    const totalGap = layoutConfig.columnGap * (layoutConfig.columnCount - 1);
    return (availableWidth - totalGap) / layoutConfig.columnCount;
  }, []);

  // 计算内容高度
  const calculateContentHeight = useCallback((item: ContentItem, cardWidth: number): number => {
    // 计算标题文字行数（假设每行20px）
    const titleLength = item.title.length;
    const titleLines = Math.min(Math.ceil(titleLength / 15), 3); // 最多3行
    const titleHeight = titleLines * CONTENT_HEIGHTS.TITLE_LINE_HEIGHT;
    
    // 基础内容高度
    let contentHeight = CONTENT_HEIGHTS.USER_INFO_ROW + titleHeight + CONTENT_HEIGHTS.PADDING;
    
    // 如果有评论或分享，添加操作行高度
    if (item.commentCount > 0 || item.shareCount > 0) {
      contentHeight += CONTENT_HEIGHTS.ACTION_ROW;
    }
    
    return contentHeight;
  }, []);

  // 计算图片高度
  const calculateImageHeight = useCallback((item: ContentItem, cardWidth: number): number => {
    if (item.width && item.height && item.width > 0) {
      return (item.height / item.width) * cardWidth;
    }
    
    // 默认比例 4:3
    return cardWidth * 0.75;
  }, []);

  // 选择最短的列
  const selectShortestColumn = useCallback((columnHeights: number[]): number => {
    let shortestIndex = 0;
    let shortestHeight = columnHeights[0];
    
    for (let i = 1; i < columnHeights.length; i++) {
      if (columnHeights[i] < shortestHeight) {
        shortestHeight = columnHeights[i];
        shortestIndex = i;
      }
    }
    
    return shortestIndex;
  }, []);

  // 计算单个项目的布局
  const calculateItemLayout = useCallback((
    item: ContentItem,
    columnIndex: number,
    yPosition: number,
    cardWidth: number
  ): WaterfallLayoutItem => {
    
    // 检查缓存
    const cacheKey = `${item.id}_${columnIndex}_${cardWidth}`;
    const cached = layoutCacheRef.current.get(cacheKey);
    if (cached && cached.y === yPosition) {
      return cached;
    }
    
    const imageHeight = calculateImageHeight(item, cardWidth);
    const contentHeight = calculateContentHeight(item, cardWidth);
    const calculatedHeight = imageHeight + contentHeight;
    
    const layoutItem: WaterfallLayoutItem = {
      ...item,
      columnIndex,
      x: columnIndex * (cardWidth + config.columnGap),
      y: yPosition,
      calculatedWidth: cardWidth,
      calculatedHeight,
      imageHeight,
      contentHeight,
    };
    
    // 缓存结果
    layoutCacheRef.current.set(cacheKey, layoutItem);
    
    return layoutItem;
  }, [config.columnGap, calculateImageHeight, calculateContentHeight]);

  // 执行瀑布流布局计算
  const performLayoutCalculation = useCallback((data: ContentItem[], cardWidth: number): WaterfallLayoutItem[] => {
    try {
      const layoutData: WaterfallLayoutItem[] = [];
      const columnHeights = new Array(config.columnCount).fill(0);
      
      for (const item of data) {
        // 选择最短的列
        const columnIndex = selectShortestColumn(columnHeights);
        const yPosition = columnHeights[columnIndex];
        
        // 计算布局
        const layoutItem = calculateItemLayout(item, columnIndex, yPosition, cardWidth);
        layoutData.push(layoutItem);
        
        // 更新列高度
        columnHeights[columnIndex] = yPosition + layoutItem.calculatedHeight + config.rowGap;
      }
      
      // 更新状态中的列高度和总高度
      const totalHeight = Math.max(...columnHeights);
      setState(prev => ({
        ...prev,
        columnHeights,
        totalHeight,
      }));
      
      return layoutData;
      
    } catch (error) {
      console.error('瀑布流布局计算失败:', error);
      callbacksRef.current.onLayoutError?.(error as Error);
      return [];
    }
  }, [config.columnCount, config.rowGap, selectShortestColumn, calculateItemLayout]);

  // 防抖的布局计算
  const debouncedLayoutCalculation = useMemo(() => {
    let timeoutId: number;
    
    return (data: ContentItem[], cardWidth: number) => {
      clearTimeout(timeoutId);
      
      timeoutId = setTimeout(() => {
        const layoutData = performLayoutCalculation(data, cardWidth);
        
        setState(prev => ({
          ...prev,
          layoutData,
          layoutReady: true,
        }));
        
        // 触发布局变化回调
        callbacksRef.current.onLayoutChange?.(layoutData);
      }, 16); // 大约一帧的时间
    };
  }, [performLayoutCalculation]);

  // 更新布局数据
  const updateLayout = useCallback((data: ContentItem[]) => {
    dataRef.current = data;
    setState(prev => ({ ...prev, layoutReady: false }));
    debouncedLayoutCalculation(data, state.cardWidth);
  }, [state.cardWidth, debouncedLayoutCalculation]);

  // 重新计算布局
  const recalculateLayout = useCallback(() => {
    // 清除缓存
    layoutCacheRef.current.clear();
    
    // 重新计算卡片宽度
    const newCardWidth = calculateCardWidth(state.screenDimensions.width, config);
    
    setState(prev => ({
      ...prev,
      cardWidth: newCardWidth,
      layoutReady: false,
    }));
    
    // 重新计算布局
    debouncedLayoutCalculation(dataRef.current, newCardWidth);
  }, [state.screenDimensions.width, config, calculateCardWidth, debouncedLayoutCalculation]);

  // 设置列数
  const setColumnCount = useCallback((count: number) => {
    if (count < 1 || count > 4) {
      console.warn('列数应该在1-4之间');
      return;
    }
    
    setConfig(prev => ({ ...prev, columnCount: count }));
  }, []);

  // 重置布局
  const resetLayout = useCallback(() => {
    layoutCacheRef.current.clear();
    
    setState(prev => ({
      ...prev,
      layoutData: [],
      columnHeights: new Array(config.columnCount).fill(0),
      totalHeight: 0,
      layoutReady: false,
    }));
  }, [config.columnCount]);

  // 更新配置
  const updateConfig = useCallback((newConfig: Partial<WaterfallConfig>) => {
    setConfig(prev => ({ ...prev, ...newConfig }));
  }, []);

  // 获取配置
  const getConfig = useCallback((): WaterfallConfig => {
    return { ...config };
  }, [config]);

  // 监听屏幕尺寸变化
  useEffect(() => {
    const subscription = Dimensions.addEventListener('change', ({ window }) => {
      setState(prev => ({
        ...prev,
        screenDimensions: window,
      }));
      
      // 重新计算布局
      const newCardWidth = calculateCardWidth(window.width, config);
      setState(prev => ({
        ...prev,
        cardWidth: newCardWidth,
        layoutReady: false,
      }));
      
      debouncedLayoutCalculation(dataRef.current, newCardWidth);
    });

    return () => {
      subscription?.remove();
    };
  }, [config, calculateCardWidth, debouncedLayoutCalculation]);

  // 监听配置变化
  useEffect(() => {
    recalculateLayout();
  }, [config.columnCount, config.columnGap, config.paddingHorizontal]);

  // 初始化布局
  useEffect(() => {
    if (initialData.length > 0) {
      updateLayout(initialData);
    }
  }, []); // 只在挂载时执行

  // 返回Hook接口
  return {
    // 布局数据
    layoutData: state.layoutData,
    columnCount: config.columnCount,
    cardWidth: state.cardWidth,
    totalHeight: state.totalHeight,
    layoutReady: state.layoutReady,
    
    // 布局控制
    updateLayout,
    recalculateLayout,
    setColumnCount,
    resetLayout,
    
    // 配置管理
    updateConfig,
    getConfig,
    
    // 事件回调（透传）
    onLayoutChange: callbacksRef.current.onLayoutChange,
    onScrollToTop: callbacksRef.current.onScrollToTop,
    onScrollToBottom: callbacksRef.current.onScrollToBottom,
    onLayoutError: callbacksRef.current.onLayoutError,
  };
};
