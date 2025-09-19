/**
 * 瀑布流卡片主状态管理
 * 基于通用组件架构核心标准 - 状态管理层
 * 
 * @version 2.0.0
 * @author 架构团队
 */

import { useState, useCallback, useEffect, useMemo } from 'react';
import { WaterfallCardProps } from './types';
import { WATERFALL_CARD_DEFAULTS } from './constants';

// =====================================================
// 状态接口定义
// =====================================================

export interface WaterfallCardState {
  // 图片状态
  imageLoaded: boolean;
  imageError: boolean;
  imageLoadingStartTime: number | null;
  
  // 交互状态
  isPressed: boolean;
  isLongPressed: boolean;
  
  // 数据状态
  likeCount: number;
  isLiked: boolean;
  
  // UI状态
  isVisible: boolean;
  animationPhase: 'idle' | 'entering' | 'visible' | 'exiting';
}

export interface WaterfallCardActions {
  // 图片相关操作
  handleImageLoadStart: () => void;
  handleImageLoad: () => void;
  handleImageError: () => void;
  
  // 交互相关操作
  handlePressIn: () => void;
  handlePressOut: () => void;
  handleLongPressStart: () => void;
  handleLongPressEnd: () => void;
  
  // 数据相关操作
  updateLikeStatus: (liked: boolean, count?: number) => void;
  resetState: () => void;
  
  // UI相关操作
  setVisibility: (visible: boolean) => void;
  setAnimationPhase: (phase: WaterfallCardState['animationPhase']) => void;
}

export interface UseWaterfallCardReturn {
  state: WaterfallCardState;
  actions: WaterfallCardActions;
  computed: {
    shouldShowLoadingIndicator: boolean;
    shouldShowErrorState: boolean;
    imageLoadDuration: number | null;
    isInteracting: boolean;
  };
}

// =====================================================
// 主状态管理Hook
// =====================================================

/**
 * 瀑布流卡片主状态管理Hook
 * 管理组件的所有状态和交互逻辑
 */
export const useWaterfallCard = (props: WaterfallCardProps): UseWaterfallCardReturn => {
  const { item, imageQuality = WATERFALL_CARD_DEFAULTS.IMAGE_QUALITY } = props;

  // =====================================================
  // 状态定义
  // =====================================================
  
  // 图片状态
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [imageLoadingStartTime, setImageLoadingStartTime] = useState<number | null>(null);
  
  // 交互状态
  const [isPressed, setIsPressed] = useState(false);
  const [isLongPressed, setIsLongPressed] = useState(false);
  
  // 数据状态
  const [likeCount, setLikeCount] = useState(item.likeCount);
  const [isLiked, setIsLiked] = useState(item.isLiked);
  
  // UI状态
  const [isVisible, setIsVisible] = useState(false);
  const [animationPhase, setAnimationPhase] = useState<WaterfallCardState['animationPhase']>('idle');

  // =====================================================
  // 副作用处理
  // =====================================================
  
  // 监听item变化，同步数据状态
  useEffect(() => {
    setLikeCount(item.likeCount);
    setIsLiked(item.isLiked);
  }, [item.likeCount, item.isLiked]);

  // 监听图片质量变化，重置图片状态
  useEffect(() => {
    setImageLoaded(false);
    setImageError(false);
    setImageLoadingStartTime(null);
  }, [item.imageUrl, imageQuality]);

  // 组件挂载时设置为可见
  useEffect(() => {
    setIsVisible(true);
    setAnimationPhase('entering');
    
    const timer = setTimeout(() => {
      setAnimationPhase('visible');
    }, 300);

    return () => {
      clearTimeout(timer);
      setAnimationPhase('exiting');
    };
  }, []);

  // =====================================================
  // 操作函数
  // =====================================================

  // 图片相关操作
  const handleImageLoadStart = useCallback(() => {
    setImageLoaded(false);
    setImageError(false);
    setImageLoadingStartTime(Date.now());
  }, []);

  const handleImageLoad = useCallback(() => {
    setImageLoaded(true);
    setImageError(false);
  }, []);

  const handleImageError = useCallback(() => {
    setImageLoaded(false);
    setImageError(true);
    console.warn(`图片加载失败: ${item.imageUrl}`);
  }, [item.imageUrl]);

  // 交互相关操作
  const handlePressIn = useCallback(() => {
    setIsPressed(true);
  }, []);

  const handlePressOut = useCallback(() => {
    setIsPressed(false);
  }, []);

  const handleLongPressStart = useCallback(() => {
    setIsLongPressed(true);
  }, []);

  const handleLongPressEnd = useCallback(() => {
    setIsLongPressed(false);
  }, []);

  // 数据相关操作
  const updateLikeStatus = useCallback((liked: boolean, count?: number) => {
    setIsLiked(liked);
    if (count !== undefined) {
      setLikeCount(count);
    } else {
      // 如果没有提供具体数量，根据点赞状态调整
      setLikeCount((prevCount: number) => liked ? prevCount + 1 : Math.max(0, prevCount - 1));
    }
  }, []);

  const resetState = useCallback(() => {
    setImageLoaded(false);
    setImageError(false);
    setImageLoadingStartTime(null);
    setIsPressed(false);
    setIsLongPressed(false);
    setLikeCount(item.likeCount);
    setIsLiked(item.isLiked);
    setAnimationPhase('idle');
  }, [item.likeCount, item.isLiked]);

  // UI相关操作
  const setVisibilityState = useCallback((visible: boolean) => {
    setIsVisible(visible);
  }, []);

  const setAnimationPhaseState = useCallback((phase: WaterfallCardState['animationPhase']) => {
    setAnimationPhase(phase);
  }, []);

  // =====================================================
  // 计算属性
  // =====================================================

  const computed = useMemo(() => ({
    // 是否应该显示加载指示器
    shouldShowLoadingIndicator: !imageLoaded && !imageError,
    
    // 是否应该显示错误状态
    shouldShowErrorState: imageError,
    
    // 图片加载耗时
    imageLoadDuration: imageLoaded && imageLoadingStartTime 
      ? Date.now() - imageLoadingStartTime 
      : null,
    
    // 是否正在交互
    isInteracting: isPressed || isLongPressed,
  }), [imageLoaded, imageError, imageLoadingStartTime, isPressed, isLongPressed]);

  // =====================================================
  // 状态对象组装
  // =====================================================

  const state: WaterfallCardState = {
    imageLoaded,
    imageError,
    imageLoadingStartTime,
    isPressed,
    isLongPressed,
    likeCount,
    isLiked,
    isVisible,
    animationPhase,
  };

  const actions: WaterfallCardActions = {
    handleImageLoadStart,
    handleImageLoad,
    handleImageError,
    handlePressIn,
    handlePressOut,
    handleLongPressStart,
    handleLongPressEnd,
    updateLikeStatus,
    resetState,
    setVisibility: setVisibilityState,
    setAnimationPhase: setAnimationPhaseState,
  };

  return {
    state,
    actions,
    computed,
  };
};

// =====================================================
// 便捷导出
// =====================================================

/**
 * 轻量级瀑布流卡片状态管理
 * 只包含基础的图片和交互状态
 */
export const useWaterfallCardLight = (props: Pick<WaterfallCardProps, 'item'>) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [isPressed, setIsPressed] = useState(false);

  const actions = {
    handleImageLoadStart: useCallback(() => {
      setImageLoaded(false);
      setImageError(false);
    }, []),
    
    handleImageLoad: useCallback(() => {
      setImageLoaded(true);
      setImageError(false);
    }, []),
    
    handleImageError: useCallback(() => {
      setImageLoaded(false);
      setImageError(true);
    }, []),
    
    handlePressIn: useCallback(() => setIsPressed(true), []),
    handlePressOut: useCallback(() => setIsPressed(false), []),
  };

  return {
    state: { imageLoaded, imageError, isPressed },
    actions,
    computed: {
      shouldShowLoadingIndicator: !imageLoaded && !imageError,
      shouldShowErrorState: imageError,
    },
  };
};

/**
 * 性能优化的瀑布流卡片状态管理
 * 包含额外的性能监控和优化逻辑
 */
export const useWaterfallCardOptimized = (props: WaterfallCardProps) => {
  const baseHook = useWaterfallCard(props);
  
  // 性能监控
  const [renderCount, setRenderCount] = useState(0);
  const [lastRenderTime, setLastRenderTime] = useState(Date.now());

  useEffect(() => {
    setRenderCount(prev => prev + 1);
    setLastRenderTime(Date.now());
  });

  const performanceMetrics = useMemo(() => ({
    renderCount,
    lastRenderTime,
    averageRenderInterval: renderCount > 1 ? (Date.now() - lastRenderTime) / renderCount : 0,
  }), [renderCount, lastRenderTime]);

  return {
    ...baseHook,
    performance: performanceMetrics,
  };
};
