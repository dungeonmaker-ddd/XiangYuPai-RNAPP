/**
 * MessageBubble 使用示例
 * 展示如何使用新的动态消息功能
 */

import React from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import MessageBubble, { ExtendedChatMessage, DynamicContent } from './MessageBubble';
import { User, MessageStatus } from '../../types';

// 示例用户数据
const sampleUser: User = {
  id: '1',
  nickname: '小美',
  avatar: 'https://example.com/avatar1.jpg',
  isOnline: true,
  lastActiveTime: '2024-01-15T10:30:00Z'
};

const currentUser: User = {
  id: '2',
  nickname: '我',
  avatar: 'https://example.com/avatar2.jpg',
  isOnline: true,
  lastActiveTime: '2024-01-15T10:35:00Z'
};

// 示例动态内容
const sampleDynamicContent: DynamicContent = {
  id: 'dynamic_1',
  photos: [
    'https://picsum.photos/300/360?random=1'
  ],
  title: '今天的美好时光 ✨',
  likes: 88,
  timestamp: '2024-01-15T10:25:00Z'
};

// 示例消息数据
const sampleMessages: ExtendedChatMessage[] = [
  // 文本消息
  {
    id: 'msg_1',
    senderId: '1',
    receiverId: '2',
    content: '嗨，你好！今天天气真不错呢～',
    type: 'text',
    timestamp: '2024-01-15T10:20:00Z',
    status: 'read' as MessageStatus,
    isFromMe: false
  },
  
  // 我的回复
  {
    id: 'msg_2',
    senderId: '2',
    receiverId: '1',
    content: '是的呢！正好适合出去拍照',
    type: 'text',
    timestamp: '2024-01-15T10:21:00Z',
    status: 'read' as MessageStatus,
    isFromMe: true
  },

  // 图片消息
  {
    id: 'msg_3',
    senderId: '1',
    receiverId: '2',
    content: 'https://example.com/shared-image.jpg',
    type: 'image',
    timestamp: '2024-01-15T10:22:00Z',
    status: 'read' as MessageStatus,
    isFromMe: false
  },

  // 动态消息 - 对方发送
  {
    id: 'msg_4',
    senderId: '1',
    receiverId: '2',
    content: '分享了一个动态',
    type: 'dynamic',
    timestamp: '2024-01-15T10:25:00Z',
    status: 'read' as MessageStatus,
    isFromMe: false,
    dynamicContent: sampleDynamicContent
  },

  // 我的动态消息
  {
    id: 'msg_5',
    senderId: '2',
    receiverId: '1',
    content: '我也来分享一下',
    type: 'dynamic',
    timestamp: '2024-01-15T10:30:00Z',
    status: 'sent' as MessageStatus,
    isFromMe: true,
    dynamicContent: {
      id: 'dynamic_2',
      photos: [
        'https://picsum.photos/300/360?random=2'
      ],
      title: '刚刚拍的风景照',
      likes: 45,
      timestamp: '2024-01-15T10:30:00Z'
    }
  }
];

const MessageBubbleExample: React.FC = () => {
  const handleMessagePress = (message: ExtendedChatMessage) => {
    console.log('Message pressed:', message.id);
  };

  const handleDynamicPress = (dynamicId: string, photoIndex: number) => {
    console.log('Dynamic photo pressed:', dynamicId, photoIndex);
  };

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {sampleMessages.map((message) => (
          <MessageBubble
            key={message.id}
            message={message}
            userInfo={message.isFromMe ? currentUser : sampleUser}
            onPress={handleMessagePress}
            onDynamicPress={handleDynamicPress}
          />
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5'
  },
  scrollView: {
    flex: 1,
    padding: 16
  }
});

export default MessageBubbleExample;
