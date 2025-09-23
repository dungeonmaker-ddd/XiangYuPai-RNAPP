/**
 * 草稿管理钩子
 * 
 * 管理草稿保存和加载功能
 */

import { useState, useCallback, useEffect } from 'react';
import type { UseDraftManagerReturn } from './types';
import type { PublishContentData } from '../types';
import { AUTO_SAVE_CONFIG } from '../constants';

/**
 * 草稿管理钩子
 */
export const useDraftManager = (): UseDraftManagerReturn => {
  const [hasDraft, setHasDraft] = useState(false);
  const [draftId, setDraftId] = useState<string>();
  const [autoSaveEnabled, setAutoSaveEnabled] = useState(AUTO_SAVE_CONFIG.ENABLED);
  const [isSaving, setIsSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);

  // 初始化检查是否有草稿
  useEffect(() => {
    checkForDraft();
  }, []);

  // 检查是否有草稿
  const checkForDraft = useCallback(async () => {
    try {
      // TODO: 实现从本地存储或服务器检查草稿
      // 模拟检查草稿
      const savedDraftId = localStorage.getItem('publish_draft_id');
      if (savedDraftId) {
        setHasDraft(true);
        setDraftId(savedDraftId);
      }
    } catch (error) {
      console.error('检查草稿失败:', error);
    }
  }, []);

  // 保存草稿
  const saveDraft = useCallback(async (data: PublishContentData) => {
    setIsSaving(true);
    
    try {
      // TODO: 实现草稿保存到本地存储或服务器
      // 模拟保存草稿
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const newDraftId = `draft_${Date.now()}`;
      const draftData = {
        id: newDraftId,
        data,
        savedAt: new Date().toISOString(),
      };
      
      localStorage.setItem('publish_draft', JSON.stringify(draftData));
      localStorage.setItem('publish_draft_id', newDraftId);
      
      setHasDraft(true);
      setDraftId(newDraftId);
      setLastSaved(new Date());
      
    } catch (error) {
      console.error('保存草稿失败:', error);
      throw error;
    } finally {
      setIsSaving(false);
    }
  }, []);

  // 加载草稿
  const loadDraft = useCallback(async (): Promise<PublishContentData | null> => {
    try {
      // TODO: 实现从本地存储或服务器加载草稿
      // 模拟加载草稿
      const savedDraft = localStorage.getItem('publish_draft');
      if (!savedDraft) {
        return null;
      }
      
      const draftData = JSON.parse(savedDraft);
      return draftData.data;
      
    } catch (error) {
      console.error('加载草稿失败:', error);
      return null;
    }
  }, []);

  // 清除草稿
  const clearDraft = useCallback(async () => {
    try {
      // TODO: 实现从本地存储或服务器清除草稿
      // 模拟清除草稿
      localStorage.removeItem('publish_draft');
      localStorage.removeItem('publish_draft_id');
      
      setHasDraft(false);
      setDraftId(undefined);
      setLastSaved(null);
      
    } catch (error) {
      console.error('清除草稿失败:', error);
      throw error;
    }
  }, []);

  // 启用自动保存
  const enableAutoSave = useCallback(() => {
    setAutoSaveEnabled(true);
  }, []);

  // 禁用自动保存
  const disableAutoSave = useCallback(() => {
    setAutoSaveEnabled(false);
  }, []);

  return {
    hasDraft,
    draftId,
    autoSaveEnabled,
    isSaving,
    lastSaved,
    saveDraft,
    loadDraft,
    clearDraft,
    enableAutoSave,
    disableAutoSave,
  };
};
