/**
 * 发布数据管理钩子
 * 
 * 管理发布内容数据状态
 */

import { useState, useCallback, useEffect } from 'react';
import type { UsePublishDataReturn } from './types';
import type { PublishContentData } from '../types';
import { DEFAULT_PUBLISH_DATA } from '../constants';

/**
 * 发布数据管理钩子
 */
export const usePublishData = (
  initialData?: Partial<PublishContentData>
): UsePublishDataReturn => {
  // 初始化数据
  const [contentData, setContentData] = useState<PublishContentData>(() => ({
    ...DEFAULT_PUBLISH_DATA,
    ...initialData,
  }));

  const [isDirty, setIsDirty] = useState(false);

  // 更新内容数据
  const updateContentData = useCallback((updates: Partial<PublishContentData>) => {
    setContentData(prev => ({ ...prev, ...updates }));
    setIsDirty(true);
  }, []);

  // 重置内容数据
  const resetContentData = useCallback(() => {
    setContentData({ ...DEFAULT_PUBLISH_DATA });
    setIsDirty(false);
  }, []);

  // 设置标题
  const setTitle = useCallback((title: string) => {
    updateContentData({ title });
  }, [updateContentData]);

  // 设置正文
  const setContent = useCallback((content: string) => {
    updateContentData({ content });
  }, [updateContentData]);

  // 标记为已修改
  const markDirty = useCallback(() => {
    setIsDirty(true);
  }, []);

  // 标记为未修改
  const markClean = useCallback(() => {
    setIsDirty(false);
  }, []);

  return {
    contentData,
    isDirty,
    updateContentData,
    resetContentData,
    setTitle,
    setContent,
    markDirty,
    markClean,
  };
};
