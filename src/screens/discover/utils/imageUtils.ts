/**
 * 图片尺寸计算工具函数
 * 用于处理瀑布流布局中的图片尺寸管理
 */

import { IMAGE_CONFIG, LAYOUT_CONSTANTS } from '../constants';
import { ContentItem } from '../types';

// 图片尺寸计算结果
export interface ImageDimensions {
  width: number;
  height: number;
  aspectRatio: number;
  displayWidth: number;
  displayHeight: number;
}

/**
 * 计算瀑布流卡片的图片尺寸
 * @param item 内容项
 * @param cardWidth 卡片宽度
 * @returns 计算后的图片尺寸信息
 */
export const calculateImageDimensions = (
  item: ContentItem,
  cardWidth: number
): ImageDimensions => {
  const { width: originalWidth, height: originalHeight } = item;
  
  // 确保原始尺寸有效
  const safeOriginalWidth = Math.max(originalWidth || IMAGE_CONFIG.WATERFALL.MIN_WIDTH, 1);
  const safeOriginalHeight = Math.max(originalHeight || IMAGE_CONFIG.WATERFALL.MIN_HEIGHT, 1);
  
  // 计算原始宽高比
  let aspectRatio = safeOriginalWidth / safeOriginalHeight;
  
  // 限制宽高比在合理范围内
  aspectRatio = Math.max(
    IMAGE_CONFIG.WATERFALL.MIN_ASPECT_RATIO,
    Math.min(IMAGE_CONFIG.WATERFALL.MAX_ASPECT_RATIO, aspectRatio)
  );
  
  // 如果宽高比异常，使用默认比例
  if (!Number.isFinite(aspectRatio) || aspectRatio <= 0) {
    aspectRatio = IMAGE_CONFIG.WATERFALL.DEFAULT_ASPECT_RATIO;
  }
  
  // 计算显示尺寸
  const displayWidth = cardWidth;
  let displayHeight = displayWidth / aspectRatio;
  
  // 限制显示高度在合理范围内
  const maxDisplayHeight = cardWidth * (1 / IMAGE_CONFIG.WATERFALL.MIN_ASPECT_RATIO);
  const minDisplayHeight = cardWidth * (1 / IMAGE_CONFIG.WATERFALL.MAX_ASPECT_RATIO);
  
  displayHeight = Math.max(minDisplayHeight, Math.min(maxDisplayHeight, displayHeight));
  
  return {
    width: safeOriginalWidth,
    height: safeOriginalHeight,
    aspectRatio,
    displayWidth,
    displayHeight,
  };
};

/**
 * 计算瀑布流卡片的总高度
 * @param item 内容项
 * @param cardWidth 卡片宽度
 * @returns 卡片总高度（图片高度 + 内容区域高度）
 */
export const calculateCardHeight = (
  item: ContentItem,
  cardWidth: number
): number => {
  const { displayHeight } = calculateImageDimensions(item, cardWidth);
  return displayHeight + IMAGE_CONFIG.WATERFALL.CONTENT_HEIGHT;
};

/**
 * 验证图片尺寸是否在合理范围内
 * @param width 图片宽度
 * @param height 图片高度
 * @returns 是否合理
 */
export const validateImageDimensions = (width: number, height: number): boolean => {
  const aspectRatio = width / height;
  
  return (
    width >= IMAGE_CONFIG.WATERFALL.MIN_WIDTH &&
    width <= IMAGE_CONFIG.WATERFALL.MAX_WIDTH &&
    height >= IMAGE_CONFIG.WATERFALL.MIN_HEIGHT &&
    height <= IMAGE_CONFIG.WATERFALL.MAX_HEIGHT &&
    aspectRatio >= IMAGE_CONFIG.WATERFALL.MIN_ASPECT_RATIO &&
    aspectRatio <= IMAGE_CONFIG.WATERFALL.MAX_ASPECT_RATIO
  );
};

/**
 * 规范化图片尺寸数据
 * @param item 内容项
 * @returns 规范化后的内容项
 */
export const normalizeImageData = (item: ContentItem): ContentItem => {
  const { width, height } = item;
  
  // 如果尺寸数据无效，使用默认值
  if (!width || !height || width <= 0 || height <= 0) {
    const defaultWidth = IMAGE_CONFIG.WATERFALL.MIN_WIDTH;
    const defaultHeight = defaultWidth / IMAGE_CONFIG.WATERFALL.DEFAULT_ASPECT_RATIO;
    
    return {
      ...item,
      width: defaultWidth,
      height: defaultHeight,
    };
  }
  
  // 如果尺寸超出范围，进行调整
  if (!validateImageDimensions(width, height)) {
    const aspectRatio = width / height;
    let normalizedWidth = width;
    let normalizedHeight = height;
    
    // 调整到合理范围
    if (width > IMAGE_CONFIG.WATERFALL.MAX_WIDTH) {
      normalizedWidth = IMAGE_CONFIG.WATERFALL.MAX_WIDTH;
      normalizedHeight = normalizedWidth / aspectRatio;
    } else if (width < IMAGE_CONFIG.WATERFALL.MIN_WIDTH) {
      normalizedWidth = IMAGE_CONFIG.WATERFALL.MIN_WIDTH;
      normalizedHeight = normalizedWidth / aspectRatio;
    }
    
    if (normalizedHeight > IMAGE_CONFIG.WATERFALL.MAX_HEIGHT) {
      normalizedHeight = IMAGE_CONFIG.WATERFALL.MAX_HEIGHT;
      normalizedWidth = normalizedHeight * aspectRatio;
    } else if (normalizedHeight < IMAGE_CONFIG.WATERFALL.MIN_HEIGHT) {
      normalizedHeight = IMAGE_CONFIG.WATERFALL.MIN_HEIGHT;
      normalizedWidth = normalizedHeight * aspectRatio;
    }
    
    return {
      ...item,
      width: Math.round(normalizedWidth),
      height: Math.round(normalizedHeight),
    };
  }
  
  return item;
};

/**
 * 批量规范化图片数据
 * @param items 内容项列表
 * @returns 规范化后的内容项列表
 */
export const normalizeImageDataBatch = (items: ContentItem[]): ContentItem[] => {
  return items.map(normalizeImageData);
};
