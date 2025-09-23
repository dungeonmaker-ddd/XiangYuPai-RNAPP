/**
 * 媒体管理钩子
 * 
 * 管理媒体文件的状态和操作
 */

import { useState, useCallback, useMemo } from 'react';
import type { UseMediaManagerReturn } from './types';
import type { PublishMediaItem } from '../types';
import { MEDIA_LIMITS } from '../constants';

/**
 * 媒体管理钩子
 */
export const useMediaManager = (): UseMediaManagerReturn => {
  const [mediaItems, setMediaItems] = useState<PublishMediaItem[]>([]);
  const [uploading, setUploading] = useState<string[]>([]);

  // 计算总进度
  const totalProgress = useMemo(() => {
    if (mediaItems.length === 0) return 0;
    
    const totalProgress = mediaItems.reduce((sum, item) => sum + item.uploadProgress, 0);
    return Math.round(totalProgress / mediaItems.length);
  }, [mediaItems]);

  // 添加媒体
  const addMedia = useCallback((items: PublishMediaItem[]) => {
    setMediaItems(prev => {
      const newItems = [...prev, ...items];
      return newItems.slice(0, MEDIA_LIMITS.MAX_ITEMS); // 限制最大数量
    });
  }, []);

  // 移除媒体
  const removeMedia = useCallback((id: string) => {
    setMediaItems(prev => prev.filter(item => item.id !== id));
    setUploading(prev => prev.filter(uploadId => uploadId !== id));
  }, []);

  // 更新媒体
  const updateMedia = useCallback((id: string, updates: Partial<PublishMediaItem>) => {
    setMediaItems(prev => 
      prev.map(item => 
        item.id === id ? { ...item, ...updates } : item
      )
    );
  }, []);

  // 更新媒体进度
  const updateMediaProgress = useCallback((
    id: string, 
    progress: number, 
    status?: string, 
    error?: string
  ) => {
    setMediaItems(prev => 
      prev.map(item => 
        item.id === id 
          ? { 
              ...item, 
              uploadProgress: progress,
              uploadStatus: status as any || item.uploadStatus,
              uploadError: error,
            }
          : item
      )
    );
  }, []);

  // 清除所有媒体
  const clearMedia = useCallback(() => {
    setMediaItems([]);
    setUploading([]);
  }, []);

  // 开始上传
  const startUpload = useCallback((id: string) => {
    setUploading(prev => [...prev, id]);
    updateMediaProgress(id, 0, 'uploading');
  }, [updateMediaProgress]);

  // 完成上传
  const completeUpload = useCallback((id: string) => {
    setUploading(prev => prev.filter(uploadId => uploadId !== id));
    updateMediaProgress(id, 100, 'uploaded');
  }, [updateMediaProgress]);

  // 上传失败
  const failUpload = useCallback((id: string, error: string) => {
    setUploading(prev => prev.filter(uploadId => uploadId !== id));
    updateMediaProgress(id, 0, 'failed', error);
  }, [updateMediaProgress]);

  return {
    mediaItems,
    uploading,
    totalProgress,
    addMedia,
    removeMedia,
    updateMedia,
    updateMediaProgress,
    clearMedia,
    startUpload,
    completeUpload,
    failUpload,
  };
};
