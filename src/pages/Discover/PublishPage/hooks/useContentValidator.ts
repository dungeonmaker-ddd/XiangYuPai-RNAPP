/**
 * 内容验证钩子
 * 
 * 管理内容验证功能
 */

import { useState, useCallback, useMemo } from 'react';
import type { UseContentValidatorReturn, ValidationState } from './types';
import type { PublishContentData } from '../types';
import { CONTENT_LIMITS } from '../constants';

// 默认验证状态
const defaultValidationState: ValidationState = {
  isValid: false,
  isValidating: false,
  lastValidated: null,
  errors: [],
  warnings: [],
  fieldErrors: {},
};

/**
 * 内容验证钩子
 */
export const useContentValidator = (): UseContentValidatorReturn => {
  const [validation, setValidation] = useState<ValidationState>(defaultValidationState);

  // 验证标题
  const validateTitle = useCallback((title: string): string[] => {
    const errors: string[] = [];
    
    if (!title.trim()) {
      errors.push('标题不能为空');
    } else if (title.length > CONTENT_LIMITS.TITLE_MAX_LENGTH) {
      errors.push(`标题不能超过${CONTENT_LIMITS.TITLE_MAX_LENGTH}个字符`);
    }
    
    return errors;
  }, []);

  // 验证正文
  const validateContent = useCallback((content: string): string[] => {
    const errors: string[] = [];
    
    if (!content.trim()) {
      errors.push('正文不能为空');
    } else if (content.length > CONTENT_LIMITS.CONTENT_MAX_LENGTH) {
      errors.push(`正文不能超过${CONTENT_LIMITS.CONTENT_MAX_LENGTH}个字符`);
    }
    
    return errors;
  }, []);

  // 验证媒体
  const validateMedia = useCallback((mediaIds: string[]): string[] => {
    const errors: string[] = [];
    
    if (mediaIds.length > CONTENT_LIMITS.MEDIA_MAX_COUNT) {
      errors.push(`媒体文件不能超过${CONTENT_LIMITS.MEDIA_MAX_COUNT}个`);
    }
    
    return errors;
  }, []);

  // 验证话题
  const validateTopics = useCallback((topicIds: string[]): string[] => {
    const errors: string[] = [];
    
    if (topicIds.length > CONTENT_LIMITS.TOPIC_MAX_COUNT) {
      errors.push(`话题不能超过${CONTENT_LIMITS.TOPIC_MAX_COUNT}个`);
    }
    
    return errors;
  }, []);

  // 主要验证函数
  const validateFullContent = useCallback(async (content: PublishContentData): Promise<ValidationState> => {
    setValidation(prev => ({ ...prev, isValidating: true }));
    
    try {
      // 模拟异步验证（如服务器端验证）
      await new Promise(resolve => setTimeout(() => resolve(undefined), 300));
      
      const titleErrors = validateTitle(content.title);
      const contentErrors = validateContent(content.content);
      const mediaErrors = validateMedia(content.mediaIds);
      const topicErrors = validateTopics(content.topicIds);
      
      const allErrors = [
        ...titleErrors,
        ...contentErrors,
        ...mediaErrors,
        ...topicErrors,
      ];
      
      const fieldErrors: Record<string, string> = {};
      if (titleErrors.length > 0) fieldErrors.title = titleErrors[0];
      if (contentErrors.length > 0) fieldErrors.content = contentErrors[0];
      if (mediaErrors.length > 0) fieldErrors.media = mediaErrors[0];
      if (topicErrors.length > 0) fieldErrors.topics = topicErrors[0];
      
      // 生成警告
      const warnings: string[] = [];
      if (content.title.length > CONTENT_LIMITS.TITLE_MAX_LENGTH * 0.8) {
        warnings.push('标题接近字数限制');
      }
      if (content.content.length > CONTENT_LIMITS.CONTENT_MAX_LENGTH * 0.8) {
        warnings.push('正文接近字数限制');
      }
      
      const validationResult: ValidationState = {
        isValid: allErrors.length === 0,
        isValidating: false,
        lastValidated: new Date(),
        errors: allErrors,
        warnings,
        fieldErrors,
      };
      
      setValidation(validationResult);
      return validationResult;
      
    } catch (error) {
      const errorResult: ValidationState = {
        isValid: false,
        isValidating: false,
        lastValidated: new Date(),
        errors: ['验证过程中出现错误'],
        warnings: [],
        fieldErrors: { general: '验证失败' },
      };
      
      setValidation(errorResult);
      return errorResult;
    }
  }, [validateTitle, validateContent, validateMedia, validateTopics]);

  // 清除验证结果
  const clearValidation = useCallback(() => {
    setValidation(defaultValidationState);
  }, []);

  // 计算属性
  const isValid = useMemo(() => validation.isValid, [validation.isValid]);
  const errors = useMemo(() => validation.errors, [validation.errors]);
  const warnings = useMemo(() => validation.warnings, [validation.warnings]);

  return {
    validation,
    validateContent: validateFullContent,
    clearValidation,
    isValid,
    errors,
    warnings,
  };
};
