/**
 * 最近对话列表组件
 * 包含区域标题和对话列表
 * 支持用户头像、在线状态、未读角标、消息预览
 */

import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { RecentChat } from '../types';
import { STYLES } from '../constants';

// 模拟数据
const MOCK_RECENT_CHATS: RecentChat[] = [
  {
    id: '1',
    user: {
      id: 'u1',
      nickname: '小明',
      avatar: '',
      isOnline: true,
      lastActiveTime: '2025-01-15T10:30:00Z'
    },
    lastMessage: {
      content: '今晚一起玩游戏吗？',
      type: 'text',
      timestamp: '2025-01-15T10:30:00Z'
    },
    unreadCount: 2,
    isTop: false,
    isMuted: false
  },
  {
    id: '2',
    user: {
      id: 'u2',
      nickname: '小红',
      avatar: '',
      isOnline: false,
      lastActiveTime: '2025-01-15T09:15:00Z'
    },
    lastMessage: {
      content: '好的，没问题',
      type: 'text',
      timestamp: '2025-01-15T09:15:00Z'
    },
    unreadCount: 0,
    isTop: true,
    isMuted: false
  },
  {
    id: '3',
    user: {
      id: 'u3',
      nickname: '游戏达人',
      avatar: '',
      isOnline: true,
      lastActiveTime: '2025-01-15T08:45:00Z'
    },
    lastMessage: {
      content: '[图片]',
      type: 'image',
      timestamp: '2025-01-15T08:45:00Z'
    },
    unreadCount: 5,
    isTop: false,
    isMuted: true
  }
];

interface RecentChatListProps {
  chats?: RecentChat[];
  onChatPress: (chat: RecentChat) => void;
  onClearAll?: () => void;
}

interface ChatItemProps {
  chat: RecentChat;
  onPress: (chat: RecentChat) => void;
}

const ChatItem: React.FC<ChatItemProps> = ({ chat, onPress }) => {
  // 时间格式化函数
  const formatTime = (timestamp: string) => {
    const now = new Date();
    const messageTime = new Date(timestamp);
    const diffMinutes = Math.floor((now.getTime() - messageTime.getTime()) / (1000 * 60));
    
    if (diffMinutes < 1) return '刚刚';
    if (diffMinutes < 60) return `${diffMinutes}分钟前`;
    if (diffMinutes < 24 * 60) return `${Math.floor(diffMinutes / 60)}小时前`;
    return messageTime.toLocaleDateString('zh-CN', { month: '2-digit', day: '2-digit' });
  };

  // 消息类型前缀
  const getMessageTypePrefix = (type: string) => {
    switch (type) {
      case 'image': return '[图片]';
      case 'voice': return '[语音]';
      case 'video': return '[视频]';
      default: return '';
    }
  };

  // 使用纯色占位符替代默认头像图片
  const defaultAvatarStyle = {
    backgroundColor: '#e0e0e0',
    justifyContent: 'center' as const,
    alignItems: 'center' as const,
  };
  const avatarSize = STYLES.SIZES.AVATAR_LARGE;

  return (
    <TouchableOpacity
      style={styles.chatItem}
      onPress={() => onPress(chat)}
      activeOpacity={0.7}
    >
      {/* 用户头像区域 */}
      <View style={styles.avatarContainer}>
        <View style={[styles.avatarWrapper, { width: avatarSize, height: avatarSize }]}>
          <Image
            source={chat.user.avatar ? { uri: chat.user.avatar } : defaultAvatar}
            style={[styles.avatar, { width: avatarSize, height: avatarSize }]}
            defaultSource={defaultAvatar}
          />
          
          {/* 在线状态指示器 */}
          {chat.user.isOnline && (
            <View
              style={[
                styles.onlineIndicator,
                {
                  width: avatarSize * 0.25,
                  height: avatarSize * 0.25,
                  borderRadius: avatarSize * 0.125
                }
              ]}
            />
          )}
          
          {/* 未读消息角标 */}
          {chat.unreadCount > 0 && (
            <View style={[styles.unreadBadge, { 
              minWidth: avatarSize * 0.3,
              height: avatarSize * 0.3,
              borderRadius: avatarSize * 0.15
            }]}>
              <Text style={[styles.unreadText, { fontSize: avatarSize * 0.2 }]}>
                {chat.unreadCount > 99 ? '99+' : chat.unreadCount.toString()}
              </Text>
            </View>
          )}
        </View>
      </View>
      
      {/* 消息信息区域 */}
      <View style={styles.messageInfo}>
        {/* 用户昵称和时间行 */}
        <View style={styles.nameTimeRow}>
          <Text style={styles.nickname}>{chat.user.nickname}</Text>
          <Text style={styles.timestamp}>{formatTime(chat.lastMessage.timestamp)}</Text>
        </View>
        
        {/* 最后消息预览行 */}
        <View style={styles.messagePreviewRow}>
          <Text
            style={[
              styles.messagePreview,
              chat.unreadCount > 0 && styles.unreadMessage
            ]}
            numberOfLines={1}
          >
            {getMessageTypePrefix(chat.lastMessage.type)}
            {chat.lastMessage.content}
          </Text>
        </View>
      </View>
      
      {/* 右侧状态区域 */}
      <View style={styles.statusArea}>
        {/* 未读状态指示器 */}
        {chat.unreadCount > 0 && (
          <View style={styles.unreadIndicator} />
        )}
        
        {/* 免打扰图标 */}
        {chat.isMuted && (
          <Text style={styles.muteIcon}>🔇</Text>
        )}
      </View>
    </TouchableOpacity>
  );
};

const RecentChatList: React.FC<RecentChatListProps> = ({
  chats = MOCK_RECENT_CHATS,
  onChatPress,
  onClearAll
}) => {
  return (
    <View style={styles.container}>
      {chats.map((chat) => (
        <ChatItem key={chat.id} chat={chat} onPress={onChatPress} />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  // 容器样式
  container: {
    backgroundColor: STYLES.COLORS.WHITE
  },
  
  // 对话项样式
  chatItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: STYLES.SPACING.LG,
    paddingVertical: STYLES.SPACING.MD,
    backgroundColor: STYLES.COLORS.WHITE,
    minHeight: STYLES.SIZES.CHAT_ITEM_HEIGHT
  },
  
  // 头像样式
  avatarContainer: {
    marginRight: STYLES.SPACING.LG
  },
  avatarWrapper: {
    position: 'relative'
  },
  avatar: {
    borderRadius: 100,
    borderWidth: 2,
    borderColor: STYLES.COLORS.WHITE
  },
  onlineIndicator: {
    position: 'absolute',
    bottom: -2,
    right: -2,
    backgroundColor: STYLES.COLORS.GREEN,
    borderWidth: 2,
    borderColor: STYLES.COLORS.WHITE
  },
  unreadBadge: {
    position: 'absolute',
    top: -2,
    right: -2,
    backgroundColor: STYLES.COLORS.RED,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 2
  },
  unreadText: {
    color: STYLES.COLORS.WHITE,
    fontWeight: STYLES.FONTS.WEIGHT.BOLD as any
  },
  
  // 消息信息样式
  messageInfo: {
    flex: 1,
    justifyContent: 'center'
  },
  nameTimeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: STYLES.SPACING.XS
  },
  nickname: {
    fontSize: STYLES.FONTS.SIZE.LARGE,
    fontWeight: STYLES.FONTS.WEIGHT.BOLD as any,
    color: STYLES.COLORS.BLACK
  },
  timestamp: {
    fontSize: STYLES.FONTS.SIZE.SMALL,
    color: STYLES.COLORS.GRAY
  },
  messagePreviewRow: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  messagePreview: {
    flex: 1,
    fontSize: STYLES.FONTS.SIZE.MEDIUM,
    color: STYLES.COLORS.GRAY
  },
  unreadMessage: {
    fontWeight: STYLES.FONTS.WEIGHT.BOLD as any,
    color: STYLES.COLORS.BLACK
  },
  
  // 状态区域样式
  statusArea: {
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: STYLES.SPACING.SM
  },
  unreadIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: STYLES.COLORS.BLUE,
    marginBottom: STYLES.SPACING.XS
  },
  muteIcon: {
    fontSize: STYLES.FONTS.SIZE.SMALL,
    color: STYLES.COLORS.GRAY
  }
});

export default RecentChatList;
