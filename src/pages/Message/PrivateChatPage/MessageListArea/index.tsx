/**
 * 消息列表区域组件
 * 负责消息数据管理、渲染和滚动控制
 * 
 * TOC (快速跳转):
 * [1] Imports
 * [2] Types & Schema  
 * [3] Constants & Config
 * [4] Utils & Helpers
 * [5] State Management
 * [6] Domain Logic
 * [7] UI Components & Rendering
 * [8] Exports
 */

// ==================== 1. Imports ====================
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { View, FlatList, Text, StyleSheet } from 'react-native';
import { User, MessageStatus } from '../../types';
import { STYLES } from '../../constants';
import MessageBubbleArea, { ExtendedChatMessage } from '../MessageBubbleArea';

// ==================== 2. Types & Schema ====================
interface MessageListAreaProps {
  userInfo: User;
  pendingMessage?: ExtendedChatMessage | null;
  onMessageSent?: () => void;
  onMessagePress?: (message: ExtendedChatMessage) => void;
  onDynamicPress?: (dynamicId: string, photoIndex: number) => void;
  onRetry?: (messageId: string) => void;
}

// ==================== 3. Constants & Config ====================
const MOCK_MESSAGES: ExtendedChatMessage[] = [
  {
    id: '1',
    senderId: 'user1',
    receiverId: 'currentUser',
    content: '什么时候有空能接我的订单',
    type: 'text',
    timestamp: '2024-12-19T10:25:00Z',
    status: MessageStatus.READ,
    isFromMe: false
  },
  {
    id: '2',
    senderId: 'currentUser',
    receiverId: 'user1',
    content: '现在就可以',
    type: 'text',
    timestamp: '2024-12-19T10:26:00Z',
    status: MessageStatus.READ,
    isFromMe: true
  },
  {
    id: '3',
    senderId: 'currentUser',
    receiverId: 'user1',
    content: 'https://picsum.photos/400/300?random=100',
    type: 'image',
    timestamp: '2024-12-19T10:27:00Z',
    status: MessageStatus.SENT,
    isFromMe: true
  },
  {
    id: '4',
    senderId: 'user1',
    receiverId: 'currentUser',
    content: '哇，好漂亮！',
    type: 'text',
    timestamp: '2024-12-19T10:28:00Z',
    status: MessageStatus.READ,
    isFromMe: false
  },
  {
    id: '5',
    senderId: 'user1',
    receiverId: 'currentUser',
    content: '分享了一个动态',
    type: 'dynamic',
    timestamp: '2024-12-19T10:30:00Z',
    status: MessageStatus.READ,
    isFromMe: false,
    dynamicContent: {
      id: 'dynamic_1',
      photos: [
        'https://picsum.photos/300/360?random=1'
      ],
      title: '今天的美好时光 ✨',
      likes: 88,
      timestamp: '2024-12-19T10:30:00Z'
    }
  },
  {
    id: '6',
    senderId: 'currentUser',
    receiverId: 'user1',
    content: '我也来分享一下',
    type: 'dynamic',
    timestamp: '2024-12-19T10:35:00Z',
    status: MessageStatus.SENT,
    isFromMe: true,
    dynamicContent: {
      id: 'dynamic_2',
      photos: [
        'https://picsum.photos/300/360?random=6'
      ],
      title: '刚刚拍的风景照',
      likes: 45,
      timestamp: '2024-12-19T10:35:00Z'
    }
  },
  {
    id: '7',
    senderId: 'user1',
    receiverId: 'currentUser',
    content: '太棒了，我们什么时候一起去拍照？',
    type: 'text',
    timestamp: '2024-12-19T10:36:00Z',
    status: MessageStatus.READ,
    isFromMe: false
  },
  {
    id: '8',
    senderId: 'currentUser',
    receiverId: 'user1',
    content: '好啊，我们周末一起去！',
    type: 'text',
    timestamp: '2024-12-19T10:37:00Z',
    status: MessageStatus.FAILED,
    isFromMe: true
  }
];

// ==================== 4. Utils & Helpers ====================
const formatTime = (timestamp: string) => {
  const date = new Date(timestamp);
  const now = new Date();
  const diffMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
  
  if (diffMinutes < 5) return '';
  if (diffMinutes < 60) return `${diffMinutes}分钟前`;
  if (diffMinutes < 24 * 60) return date.toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' });
  return date.toLocaleDateString('zh-CN', { month: '2-digit', day: '2-digit' });
};

// ==================== 5. State Management ====================
const useMessageData = () => {
  const [messages, setMessages] = useState<ExtendedChatMessage[]>([]);
  const [loading, setLoading] = useState(false);

  const loadMessages = useCallback(async () => {
    setLoading(true);
    try {
      await new Promise<void>(resolve => setTimeout(resolve, 800));
      setMessages(MOCK_MESSAGES);
    } catch (error) {
      console.error('加载聊天记录失败:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  const addMessage = useCallback((message: ExtendedChatMessage) => {
    setMessages(prev => [...prev, message]);
  }, []);

  const updateMessageStatus = useCallback((messageId: string, status: MessageStatus) => {
    setMessages(prev =>
      prev.map(msg =>
        msg.id === messageId ? { ...msg, status } : msg
      )
    );
  }, []);

  const retryMessage = useCallback(async (messageId: string) => {
    const messageToRetry = messages.find(m => m.id === messageId);
    if (!messageToRetry) return;

    updateMessageStatus(messageId, MessageStatus.SENDING);

    try {
      await new Promise<void>(resolve => setTimeout(resolve, 1000));
      updateMessageStatus(messageId, MessageStatus.SENT);
    } catch (error) {
      updateMessageStatus(messageId, MessageStatus.FAILED);
      console.error('重发消息失败:', error);
    }
  }, [messages, updateMessageStatus]);

  return {
    messages,
    loading,
    loadMessages,
    addMessage,
    updateMessageStatus,
    retryMessage
  };
};

// ==================== 6. Domain Logic ====================
// 消息处理逻辑在 useMessageData Hook 中实现

// ==================== 7. UI Components & Rendering ====================
const MessageListArea: React.FC<MessageListAreaProps> = ({
  userInfo,
  pendingMessage,
  onMessageSent,
  onMessagePress,
  onDynamicPress,
  onRetry
}) => {
  const flatListRef = useRef<FlatList>(null);
  const { messages, loading, loadMessages, addMessage, updateMessageStatus, retryMessage } = useMessageData();
  const lastProcessedMessageId = useRef<string | null>(null);

  // 自动滚动到底部
  const scrollToBottom = useCallback((animated: boolean = true) => {
    if (messages.length > 0) {
      setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated });
      }, 100);
    }
  }, [messages.length]);

  // 组件初始化时加载消息
  useEffect(() => {
    loadMessages();
  }, [loadMessages]);

  // 处理待发送的消息
  useEffect(() => {
    if (pendingMessage && pendingMessage.id !== lastProcessedMessageId.current) {
      lastProcessedMessageId.current = pendingMessage.id;
      
      addMessage(pendingMessage);
      scrollToBottom(true);

      const sendMessage = async () => {
        try {
          await new Promise<void>(resolve => setTimeout(resolve, 1000));
          updateMessageStatus(pendingMessage.id, MessageStatus.SENT);
        } catch (error) {
          updateMessageStatus(pendingMessage.id, MessageStatus.FAILED);
          console.error('发送消息失败:', error);
        } finally {
          if (onMessageSent) {
            onMessageSent();
          }
        }
      };

      sendMessage();
    }
  }, [pendingMessage, addMessage, updateMessageStatus, onMessageSent, scrollToBottom]);

  // 消息变化时自动滚动
  useEffect(() => {
    scrollToBottom(false);
  }, [scrollToBottom]);

  // 处理重发消息
  const handleRetryMessage = useCallback(async (messageId: string) => {
    await retryMessage(messageId);
    if (onRetry) {
      onRetry(messageId);
    }
  }, [retryMessage, onRetry]);

  // 时间分隔线组件
  const TimeDivider = useCallback(({ timestamp }: { timestamp: string }) => {
    const timeText = formatTime(timestamp);
    if (!timeText) return null;

    return (
      <View style={styles.timeDivider}>
        <View style={styles.timeDividerLine} />
        <Text style={styles.timeDividerText}>{timeText}</Text>
        <View style={styles.timeDividerLine} />
      </View>
    );
  }, []);

  // 渲染消息项
  const renderMessage = useCallback(({ item, index }: { item: ExtendedChatMessage; index: number }) => {
    const showTimeDivider = index === 0 || 
      (new Date(item.timestamp).getTime() - new Date(messages[index - 1].timestamp).getTime()) > 5 * 60 * 1000;

    return (
      <View>
        {showTimeDivider && <TimeDivider timestamp={item.timestamp} />}
        <MessageBubbleArea
          message={item}
          userInfo={userInfo}
          onPress={onMessagePress}
          onDynamicPress={onDynamicPress}
          onRetry={handleRetryMessage}
        />
      </View>
    );
  }, [messages, userInfo, onMessagePress, onDynamicPress, handleRetryMessage, TimeDivider]);

  // 优化渲染性能
  const keyExtractor = useCallback((item: ExtendedChatMessage) => item.id, []);
  const getItemLayout = useCallback((data: any, index: number) => ({
    length: 80,
    offset: 80 * index,
    index,
  }), []);

  return (
    <View style={styles.container}>
      <FlatList
        ref={flatListRef}
        data={messages}
        keyExtractor={keyExtractor}
        renderItem={renderMessage}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.messageListContent}
        onContentSizeChange={() => scrollToBottom(true)}
        getItemLayout={getItemLayout}
        removeClippedSubviews={true}
        maxToRenderPerBatch={10}
        windowSize={10}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: STYLES.COLORS.WHITE
  },
  messageListContent: {
    paddingVertical: STYLES.SPACING.MD,
    paddingHorizontal: STYLES.SPACING.LG
  },
  timeDivider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: STYLES.SPACING.MD
  },
  timeDividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: STYLES.COLORS.BORDER_GRAY
  },
  timeDividerText: {
    fontSize: STYLES.FONTS.SIZE.SMALL,
    color: STYLES.COLORS.GRAY,
    backgroundColor: STYLES.COLORS.LIGHT_GRAY,
    paddingHorizontal: STYLES.SPACING.SM,
    paddingVertical: STYLES.SPACING.XS,
    borderRadius: STYLES.SIZES.BORDER_RADIUS.SMALL,
    marginHorizontal: STYLES.SPACING.SM
  }
});

// ==================== 8. Exports ====================
export default MessageListArea;
export { useMessageData };
export type { MessageListAreaProps };
