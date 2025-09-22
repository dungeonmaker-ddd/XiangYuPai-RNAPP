/**
 * SearchInputArea 验证处理模块
 * 处理搜索输入验证逻辑
 */

import { SEARCH_CONFIG } from '../constants';

/**
 * 搜索输入验证结果
 */
export interface ValidationResult {
  valid: boolean;
  error?: string;
}

/**
 * 处理输入验证
 * 验证搜索关键词的有效性
 */
export const processInputValidation = (keyword: string): ValidationResult => {
  const cleanKeyword = keyword.trim();
  
  if (!cleanKeyword) {
    return { valid: false, error: '请输入搜索关键词' };
  }
  
  if (cleanKeyword.length < SEARCH_CONFIG.MIN_KEYWORD_LENGTH) {
    return { valid: false, error: '搜索关键词太短' };
  }
  
  if (cleanKeyword.length > SEARCH_CONFIG.MAX_KEYWORD_LENGTH) {
    return { valid: false, error: '搜索关键词太长' };
  }
  
  // 检查是否包含非法字符
  const illegalChars = /[<>\"'&]/g;
  if (illegalChars.test(cleanKeyword)) {
    return { valid: false, error: '搜索关键词包含非法字符' };
  }
  
  return { valid: true };
};

/**
 * 处理关键词清理
 * 清理和格式化搜索关键词
 */
export const processKeywordCleanup = (keyword: string): string => {
  return keyword
    .trim()
    .replace(/[^\w\s\u4e00-\u9fa5]/g, '') // 保留字母、数字、空格、中文
    .replace(/\s+/g, ' '); // 合并多个空格
};

/**
 * 处理敏感词检查
 * 检查关键词是否包含敏感词
 */
export const processSensitiveWordCheck = (keyword: string): ValidationResult => {
  // 敏感词列表（实际项目中应该从服务端获取）
  const sensitiveWords = ['敏感词1', '敏感词2'];
  
  const lowerKeyword = keyword.toLowerCase();
  for (const word of sensitiveWords) {
    if (lowerKeyword.includes(word.toLowerCase())) {
      return { valid: false, error: '搜索内容包含敏感词' };
    }
  }
  
  return { valid: true };
};
