/**
 * 发布页面数据验证工具
 * 
 * 提供数据格式化和验证功能
 */

import type { PublishContentData } from '../types';
import { CONTENT_LIMITS } from '../constants';

/**
 * 格式化发布数据
 * 
 * @param data 原始数据
 * @returns 格式化后的数据
 */
export const formatPublishData = (data: PublishContentData): PublishContentData => {
  return {
    title: data.title?.trim() || '',
    content: data.content?.trim() || '',
    mediaIds: data.mediaIds || [],
    topicIds: data.topicIds || [],
    locationId: data.locationId,
    privacy: data.privacy || 'public',
    settings: {
      allowComment: data.settings?.allowComment ?? true,
      allowShare: data.settings?.allowShare ?? true,
    },
  };
};

/**
 * 验证发布数据
 * 
 * @param data 发布数据
 * @returns 验证结果
 */
export const validatePublishData = (data: PublishContentData): {
  isValid: boolean;
  errors: string[];
} => {
  const errors: string[] = [];

  // 验证标题
  if (!data.title?.trim()) {
    errors.push('标题不能为空');
  } else if (data.title.length > CONTENT_LIMITS.TITLE_MAX_LENGTH) {
    errors.push(`标题不能超过${CONTENT_LIMITS.TITLE_MAX_LENGTH}个字符`);
  }

  // 验证内容
  if (!data.content?.trim()) {
    errors.push('内容不能为空');
  } else if (data.content.length > CONTENT_LIMITS.CONTENT_MAX_LENGTH) {
    errors.push(`内容不能超过${CONTENT_LIMITS.CONTENT_MAX_LENGTH}个字符`);
  }

  // 验证媒体数量
  if (data.mediaIds && data.mediaIds.length > CONTENT_LIMITS.MEDIA_MAX_COUNT) {
    errors.push(`媒体文件不能超过${CONTENT_LIMITS.MEDIA_MAX_COUNT}个`);
  }

  // 验证话题数量
  if (data.topicIds && data.topicIds.length > CONTENT_LIMITS.TOPIC_MAX_COUNT) {
    errors.push(`话题不能超过${CONTENT_LIMITS.TOPIC_MAX_COUNT}个`);
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};

/**
 * 验证媒体文件
 * 
 * @param file 文件对象
 * @returns 验证结果
 */
export const validateMediaFile = (file: {
  size: number;
  type: string;
  name: string;
}): {
  isValid: boolean;
  error?: string;
} => {
  // 检查文件大小（100MB限制）
  const maxSize = 100 * 1024 * 1024; // 100MB
  if (file.size > maxSize) {
    return {
      isValid: false,
      error: '文件大小不能超过100MB',
    };
  }

  // 检查文件类型
  const allowedTypes = [
    'image/jpeg',
    'image/jpg', 
    'image/png',
    'image/gif',
    'video/mp4',
    'video/mov',
    'video/avi',
  ];

  if (!allowedTypes.includes(file.type)) {
    return {
      isValid: false,
      error: '不支持的文件格式',
    };
  }

  return {
    isValid: true,
  };
};

/**
 * 验证文本内容安全性
 * 
 * @param content 文本内容
 * @returns 是否安全
 */
export const validateContentSafety = (content: string): boolean => {
  // 基础敏感词检测
  const sensitiveWords = [
    '敏感词1', '敏感词2', // 实际项目中应该从配置文件或API获取
  ];

  const lowerContent = content.toLowerCase();
  return !sensitiveWords.some(word => lowerContent.includes(word.toLowerCase()));
};

/**
 * 格式化字符数显示
 * 
 * @param current 当前字符数
 * @param max 最大字符数
 * @returns 格式化字符串
 */
export const formatCharacterCount = (current: number, max: number): string => {
  return `${current}/${max}`;
};

/**
 * 检查是否接近字符限制
 * 
 * @param current 当前字符数
 * @param max 最大字符数
 * @param threshold 阈值（默认90%）
 * @returns 是否接近限制
 */
export const isNearCharacterLimit = (
  current: number, 
  max: number, 
  threshold: number = 0.9
): boolean => {
  return current / max >= threshold;
};
