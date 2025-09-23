/**
 * 内容安全检测API服务
 * 
 * 提供内容安全验证功能
 */

import { httpClient } from '@/utils/http';
import type { ApiResponse } from '@/types/api';

/**
 * 验证内容安全性
 * 
 * @param content 要验证的内容
 * @returns 验证结果
 */
export const validateContent = async (content: string): Promise<ApiResponse<boolean>> => {
  try {
    const response = await httpClient.post<boolean>('/api/v1/publish/security/content-check', null, {
      params: { content },
    });
    return response;
  } catch (error) {
    console.error('内容安全检测失败:', error);
    throw error;
  }
};

/**
 * 验证媒体文件安全性
 * 
 * @param mediaId 媒体文件ID
 * @returns 验证结果
 */
export const validateMedia = async (mediaId: string): Promise<ApiResponse<boolean>> => {
  try {
    const response = await httpClient.post<boolean>('/api/v1/publish/security/media-check', null, {
      params: { mediaId },
    });
    return response;
  } catch (error) {
    console.error('媒体安全检测失败:', error);
    throw error;
  }
};

/**
 * 批量验证内容安全性
 * 
 * @param contents 要验证的内容数组
 * @returns 验证结果数组
 */
export const validateContents = async (contents: string[]): Promise<ApiResponse<boolean[]>> => {
  try {
    const response = await httpClient.post<boolean[]>('/api/v1/publish/security/batch-content-check', {
      contents,
    });
    return response;
  } catch (error) {
    console.error('批量内容安全检测失败:', error);
    throw error;
  }
};

/**
 * 检测敏感词
 * 
 * @param text 要检测的文本
 * @returns 敏感词列表
 */
export const detectSensitiveWords = (text: string): string[] => {
  // 本地敏感词检测（简单实现）
  const sensitiveWords = [
    '敏感词1', '敏感词2', // 实际项目中应该从配置获取
  ];
  
  const foundWords: string[] = [];
  const lowerText = text.toLowerCase();
  
  sensitiveWords.forEach(word => {
    if (lowerText.includes(word.toLowerCase())) {
      foundWords.push(word);
    }
  });
  
  return foundWords;
};

/**
 * 过滤敏感词
 * 
 * @param text 原始文本
 * @param replacement 替换字符（默认为*）
 * @returns 过滤后的文本
 */
export const filterSensitiveWords = (text: string, replacement: string = '*'): string => {
  const sensitiveWords = [
    '敏感词1', '敏感词2', // 实际项目中应该从配置获取
  ];
  
  let filteredText = text;
  
  sensitiveWords.forEach(word => {
    const regex = new RegExp(word, 'gi');
    filteredText = filteredText.replace(regex, replacement.repeat(word.length));
  });
  
  return filteredText;
};

/**
 * 检查文本是否包含违规内容
 * 
 * @param text 要检查的文本
 * @returns 检查结果
 */
export const checkTextViolation = (text: string): {
  isViolation: boolean;
  violationType?: string;
  reason?: string;
} => {
  // 简单的违规检测逻辑
  const violations = [
    { pattern: /敏感词/, type: 'sensitive', reason: '包含敏感词汇' },
    { pattern: /违法/, type: 'illegal', reason: '包含违法内容' },
    { pattern: /广告/, type: 'spam', reason: '疑似广告内容' },
  ];
  
  for (const violation of violations) {
    if (violation.pattern.test(text)) {
      return {
        isViolation: true,
        violationType: violation.type,
        reason: violation.reason,
      };
    }
  }
  
  return {
    isViolation: false,
  };
};

/**
 * 验证URL安全性
 * 
 * @param url 要验证的URL
 * @returns 是否安全
 */
export const validateUrl = (url: string): boolean => {
  try {
    const urlObj = new URL(url);
    
    // 检查协议
    if (!['http:', 'https:'].includes(urlObj.protocol)) {
      return false;
    }
    
    // 检查域名黑名单
    const blacklistedDomains = [
      'malicious.com',
      'spam.com',
      // 实际项目中应该从配置获取
    ];
    
    if (blacklistedDomains.includes(urlObj.hostname)) {
      return false;
    }
    
    return true;
  } catch {
    return false;
  }
};
