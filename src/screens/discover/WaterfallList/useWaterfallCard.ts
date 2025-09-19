/**
 * 瀑布流卡片状态管理
 * 基于通用组件架构核心标准 - 状态管理层
 * 
 * @version 2.0.0
 * @author 架构团队
 */

import { useState, useCallback, useRef, useMemo } from 'react';
import { WaterfallCardState } from './types';
import { IMAGE_CONSTANTS, UX_CONSTANTS } from './constants';

/**
 * 瀑布流卡片状态管理Hook
 * 管理单个卡片的所有状态
 */
export const useWaterfallCard = (itemId: string, initialLikeCount: number = 0, initialIsLiked: boolean = false) => {
  // #region 图片状态
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [imageLoadingStartTime, setImageLoadingStartTime] = useState<number | null>(null);
  // #endregion

  // #region 交互状态
  const [isPressed, setIsPressed] = useState(false);
  const [isLongPressed, setIsLongPressed] = useState(false);
  // #endregion

  // #region 数据状态
  const [likeCount, setLikeCount] = useState(initialLikeCount);
  const [isLiked, setIsLiked] = useState(initialIsLiked);
  // #endregion

  // #region UI状态
  const [isVisible, setIsVisible] = useState(false);
  const [animationPhase, setAnimationPhase] = useState<'idle' | 'entering' | 'visible' | 'exiting'>('idle');
  // #endregion

  // #region Refs
  const longPressTimerRef = useRef<NodeJS.Timeout | null>(null);
  const imageLoadTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  // #endregion

  // #region 图片加载处理
  /**
   * 开始图片加载
   */
  const startImageLoading = useCallback(() => {
    setImageLoaded(false);
    setImageError(false);
    setImageLoadingStartTime(Date.now());

    // 设置加载超时
    if (imageLoadTimeoutRef.current) {
      clearTimeout(imageLoadTimeoutRef.current);
    }
    
    imageLoadTimeoutRef.current = setTimeout(() => {
      if (!imageLoaded) {
        setImageError(true);
        setImageLoadingStartTime(null);
      }
    }, IMAGE_CONSTANTS.LOADING_TIMEOUT);
  }, [imageLoaded]);

  /**
   * 图片加载成功
   */
  const handleImageLoad = useCallback(() => {
    setImageLoaded(true);
    setImageError(false);
    
    if (imageLoadTimeoutRef.current) {
      clearTimeout(imageLoadTimeoutRef.current);
      imageLoadTimeoutRef.current = null;
    }
    
    // 记录加载时间
    if (imageLoadingStartTime) {
      const loadTime = Date.now() - imageLoadingStartTime;
      if (__DEV__) {
        console.log(`图片加载完成 [${itemId}]: ${loadTime}ms`);
      }
      setImageLoadingStartTime(null);
    }
  }, [itemId, imageLoadingStartTime]);

  /**
   * 图片加载失败
   */
  const handleImageError = useCallback(() => {
    setImageError(true);
    setImageLoaded(false);
    setImageLoadingStartTime(null);
    
    if (imageLoadTimeoutRef.current) {
      clearTimeout(imageLoadTimeoutRef.current);
      imageLoadTimeoutRef.current = null;
    }
  }, []);
  // #endregion

  // #region 交互处理
  /**
   * 开始按压
   */
  const startPress = useCallback(() => {
    setIsPressed(true);
    
    // 开始长按计时
    longPressTimerRef.current = setTimeout(() => {
      setIsLongPressed(true);
    }, UX_CONSTANTS.LONG_PRESS_DELAY);
  }, []);

  /**
   * 结束按压
   */
  const endPress = useCallback(() => {
    setIsPressed(false);
    setIsLongPressed(false);
    
    if (longPressTimerRef.current) {
      clearTimeout(longPressTimerRef.current);
      longPressTimerRef.current = null;
    }
  }, []);

  /**
   * 处理点赞
   */
  const handleLike = useCallback((newIsLiked: boolean) => {
    const prevIsLiked = isLiked;
    const prevCount = likeCount;
    
    // 乐观更新
    setIsLiked(newIsLiked);
    setLikeCount((prevCount: number) => newIsLiked ? prevCount + 1 : Math.max(0, prevCount - 1));
    
    return {
      prevIsLiked,
      prevCount,
      rollback: () => {
        setIsLiked(prevIsLiked);
        setLikeCount(prevCount);
      }
    };
  }, [isLiked, likeCount]);
  // #endregion

  // #region 可见性管理
  /**
   * 进入可视区域
   */
  const enterViewport = useCallback(() => {
    if (!isVisible) {
      setIsVisible(true);
      setAnimationPhase('entering');
      
      // 延迟设置为可见状态
      setTimeout(() => {
        setAnimationPhase('visible');
      }, UX_CONSTANTS.MIN_LOADING_TIME);
    }
  }, [isVisible]);

  /**
   * 离开可视区域
   */
  const exitViewport = useCallback(() => {
    if (isVisible) {
      setAnimationPhase('exiting');
      
      // 延迟设置为不可见状态
      setTimeout(() => {
        setIsVisible(false);
        setAnimationPhase('idle');
      }, UX_CONSTANTS.MIN_LOADING_TIME);
    }
  }, [isVisible]);
  // #endregion

  // #region 计算属性
  /**
   * 完整的卡片状态
   */
  const cardState = useMemo((): WaterfallCardState => ({
    // 图片状态
    imageLoaded,
    imageError,
    imageLoadingStartTime,
    
    // 交互状态
    isPressed,
    isLongPressed,
    
    // 数据状态
    likeCount,
    isLiked,
    
    // UI状态
    isVisible,
    animationPhase,
  }), [
    imageLoaded, imageError, imageLoadingStartTime,
    isPressed, isLongPressed,
    likeCount, isLiked,
    isVisible, animationPhase
  ]);

  /**
   * 是否正在加载图片
   */
  const isImageLoading = useMemo(() => {
    return !imageLoaded && !imageError && imageLoadingStartTime !== null;
  }, [imageLoaded, imageError, imageLoadingStartTime]);

  /**
   * 图片加载时长
   */
  const imageLoadDuration = useMemo(() => {
    if (imageLoadingStartTime && imageLoaded) {
      return Date.now() - imageLoadingStartTime;
    }
    return null;
  }, [imageLoadingStartTime, imageLoaded]);
  // #endregion

  // #region 重置方法
  /**
   * 重置所有状态
   */
  const reset = useCallback(() => {
    setImageLoaded(false);
    setImageError(false);
    setImageLoadingStartTime(null);
    setIsPressed(false);
    setIsLongPressed(false);
    setLikeCount(initialLikeCount);
    setIsLiked(initialIsLiked);
    setIsVisible(false);
    setAnimationPhase('idle');
    
    // 清理定时器
    if (longPressTimerRef.current) {
      clearTimeout(longPressTimerRef.current);
      longPressTimerRef.current = null;
    }
    
    if (imageLoadTimeoutRef.current) {
      clearTimeout(imageLoadTimeoutRef.current);
      imageLoadTimeoutRef.current = null;
    }
  }, [initialLikeCount, initialIsLiked]);
  // #endregion

  // #region 清理
  /**
   * 组件卸载时清理
   */
  const cleanup = useCallback(() => {
    if (longPressTimerRef.current) {
      clearTimeout(longPressTimerRef.current);
    }
    
    if (imageLoadTimeoutRef.current) {
      clearTimeout(imageLoadTimeoutRef.current);
    }
  }, []);
  // #endregion

  return {
    // 状态
    cardState,
    imageLoaded,
    imageError,
    isImageLoading,
    imageLoadDuration,
    isPressed,
    isLongPressed,
    likeCount,
    isLiked,
    isVisible,
    animationPhase,

    // 方法
    startImageLoading,
    handleImageLoad,
    handleImageError,
    startPress,
    endPress,
    handleLike,
    enterViewport,
    exitViewport,
    reset,
    cleanup,
  };
};
