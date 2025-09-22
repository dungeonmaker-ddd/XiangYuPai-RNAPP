/**
 * Message 页面组 - 数据状态管理
 */

import { useState, useCallback } from 'react';
import { ChatMessage, LikeCollectMessage } from './types';

export const useMessageData = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [likeCollectMessages, setLikeCollectMessages] = useState<LikeCollectMessage[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchMessages = useCallback(async () => {
    setLoading(true);
    try {
      // 模拟API调用
      await new Promise<void>(resolve => setTimeout(resolve, 1000));
      // 设置模拟数据
    } catch (error) {
      console.error('获取消息失败:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  const markMessageAsRead = useCallback((messageId: string) => {
    setMessages(prev => 
      prev.map(msg => 
        msg.id === messageId ? { ...msg, isRead: true } : msg
      )
    );
  }, []);

  return {
    messages,
    likeCollectMessages,
    loading,
    fetchMessages,
    markMessageAsRead,
  };
};