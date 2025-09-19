/**
 * 瀑布流卡片图片处理工具
 * 基于通用组件架构核心标准 - 数据处理层
 * 
 * @version 2.0.0
 * @author 架构团队
 */

import { WaterfallCardImageQuality } from './types';
import { WATERFALL_CARD_IMAGE_QUALITY_CONFIG, WATERFALL_CARD_DEFAULTS } from './constants';

/**
 * 获取优化后的图片URL
 * 根据质量设置返回对应的CDN参数优化后的图片地址
 * 
 * @param url 原始图片URL
 * @param quality 图片质量等级
 * @returns 优化后的图片URL
 * 
 * @example
 * getOptimizedImageUrl('https://example.com/image.jpg', 'standard')
 * // => 'https://example.com/image.jpg?imageView2/2/w/600/q/80'
 */
export const getOptimizedImageUrl = (url: string, quality: WaterfallCardImageQuality): string => {
  if (!url) {
    return '';
  }
  
  const qualityParam = WATERFALL_CARD_IMAGE_QUALITY_CONFIG[quality];
  return `${url}${qualityParam}`;
};

/**
 * 计算图片显示高度
 * 基于图片原始尺寸和卡片宽度计算合适的显示高度
 * 
 * @param width 图片原始宽度
 * @param height 图片原始高度
 * @param cardWidth 卡片宽度（默认使用配置中的值）
 * @returns 计算后的显示高度
 * 
 * @example
 * calculateImageDisplayHeight(800, 600, 200) => 150
 * calculateImageDisplayHeight(undefined, undefined) => 200 (默认高度)
 */
export const calculateImageDisplayHeight = (
  width: number | undefined,
  height: number | undefined,
  cardWidth: number = WATERFALL_CARD_DEFAULTS.CARD_WIDTH
): number => {
  // 如果没有尺寸信息，返回默认高度
  if (!width || !height || width <= 0 || height <= 0) {
    return WATERFALL_CARD_DEFAULTS.DEFAULT_IMAGE_HEIGHT;
  }
  
  // 计算宽高比
  const aspectRatio = height / width;
  
  // 根据卡片宽度计算对应高度
  const calculatedHeight = cardWidth * aspectRatio;
  
  // 限制最小和最大高度，避免极端情况
  const minHeight = 120;
  const maxHeight = 400;
  
  return Math.max(minHeight, Math.min(maxHeight, calculatedHeight));
};

/**
 * 验证图片URL格式
 * 检查图片URL是否符合基本格式要求
 * 
 * @param url 图片URL
 * @returns 是否为有效的图片URL
 */
export const validateImageUrl = (url: string): boolean => {
  if (!url || typeof url !== 'string') {
    return false;
  }
  
  // 基本的URL格式检查
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

/**
 * 获取图片加载错误时的占位符URL
 * 返回默认的占位符图片地址
 * 
 * @param width 占位符宽度
 * @param height 占位符高度
 * @returns 占位符图片URL
 */
export const getPlaceholderImageUrl = (width: number = 300, height: number = 200): string => {
  return `https://via.placeholder.com/${width}x${height}/f0f0f0/999999?text=加载失败`;
};
