/**
 * 瀑布流卡片组件常量定义
 * 基于通用组件架构核心标准 - 常量配置层
 * 
 * @version 2.0.0
 * @author 架构团队
 */

import { WaterfallCardImageQuality } from './types';

/**
 * 图片质量配置常量
 * 基于CDN参数的图片优化配置
 */
export const WATERFALL_CARD_IMAGE_QUALITY_CONFIG = {
  low: '?imageView2/2/w/300/q/70',
  standard: '?imageView2/2/w/600/q/80',
  high: '',
} as const;

/**
 * 卡片默认配置常量
 * 组件的默认行为配置
 */
export const WATERFALL_CARD_DEFAULTS = {
  /** 默认图片质量 */
  IMAGE_QUALITY: 'standard' as WaterfallCardImageQuality,
  
  /** 默认卡片宽度（用于高度计算） */
  CARD_WIDTH: 180,
  
  /** 图片加载超时阈值（毫秒） */
  LOADING_THRESHOLD: 1000,
  
  /** 默认图片高度（当无法计算时） */
  DEFAULT_IMAGE_HEIGHT: 200,
} as const;

/**
 * 数字格式化阈值常量
 * 用于格式化显示数字的分界点
 */
export const WATERFALL_CARD_FORMAT_THRESHOLDS = {
  /** 千位分界点 */
  THOUSAND: 1000,
  
  /** 万位分界点 */
  TEN_THOUSAND: 10000,
} as const;

/**
 * 交互配置常量
 * 用户交互相关的配置
 */
export const WATERFALL_CARD_INTERACTION = {
  /** 点击波纹颜色 */
  RIPPLE_COLOR: 'rgba(0,0,0,0.1)',
  
  /** 活跃透明度 */
  ACTIVE_OPACITY: 0.7,
  
  /** 用户头像点击透明度 */
  AVATAR_ACTIVE_OPACITY: 0.8,
} as const;
