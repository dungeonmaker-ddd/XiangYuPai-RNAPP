/**
 * Message 页面组 - 主状态管理
 */

import { useState, useCallback } from 'react';

export const useMessage = () => {
  const [unreadCount, setUnreadCount] = useState(0);
  const [currentChatId, setCurrentChatId] = useState<string | null>(null);

  const incrementUnreadCount = useCallback(() => {
    setUnreadCount(prev => prev + 1);
  }, []);

  const resetUnreadCount = useCallback(() => {
    setUnreadCount(0);
  }, []);

  return {
    unreadCount,
    currentChatId,
    setCurrentChatId,
    incrementUnreadCount,
    resetUnreadCount,
  };
};