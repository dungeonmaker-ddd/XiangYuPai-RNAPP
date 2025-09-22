// #region 1. File Banner & TOC
/**
 * 最近对话列表区域组件 - 主要内容区域
 * 包含区域标题和对话列表
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
// #endregion

// #region 2. Imports
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { RecentChatListAreaProps, RecentChat } from '../types';
import { STYLES } from '../constants';
import ChatItemDisplay from './ChatItemDisplay';
// #endregion

// #region 3. Types & Schema
interface SectionHeaderProps {
  onClearAll?: () => void;
}

interface ChatListProps {
  chats: RecentChat[];
  onChatPress: (chat: RecentChat) => void;
}
// #endregion

// #region 4. Constants & Config
const MOCK_RECENT_CHATS: RecentChat[] = [
  {
    id: '1',
    user: {
      id: 'u1',
      nickname: '小明',
      avatar: '',
      isOnline: true,
      lastActiveTime: new Date().toISOString()
    },
    lastMessage: {
      content: '今晚一起玩游戏吗？',
      type: 'text',
      timestamp: new Date(Date.now() - 2 * 60 * 1000).toISOString()
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
      lastActiveTime: new Date(Date.now() - 45 * 60 * 1000).toISOString()
    },
    lastMessage: {
      content: '好的，没问题',
      type: 'text',
      timestamp: new Date(Date.now() - 45 * 60 * 1000).toISOString()
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
      lastActiveTime: new Date(Date.now() - 75 * 60 * 1000).toISOString()
    },
    lastMessage: {
      content: '[图片]',
      type: 'image',
      timestamp: new Date(Date.now() - 75 * 60 * 1000).toISOString()
    },
    unreadCount: 5,
    isTop: false,
    isMuted: true
  }
];

const SECTION_CONFIG = {
  TITLE: '最近对话',
  CLEAR_TEXT: '清空',
  HEADER_MARGIN_TOP: 24,
  HEADER_HORIZONTAL_PADDING: STYLES.SPACING.LG
};
// #endregion

// #region 5. Utils & Helpers
const shouldShowClearButton = (chats: RecentChat[]): boolean => {
  return chats.length > 0;
};

const sortChatsByPriority = (chats: RecentChat[]): RecentChat[] => {
  return [...chats].sort((a, b) => {
    // 置顶优先
    if (a.isTop && !b.isTop) return -1;
    if (!a.isTop && b.isTop) return 1;
    
    // 按时间排序
    return new Date(b.lastMessage.timestamp).getTime() - new Date(a.lastMessage.timestamp).getTime();
  });
};
// #endregion

// #region 6. State Management
// 使用props传递的数据，无需本地状态管理
// #endregion

// #region 7. Domain Logic
const SectionHeader: React.FC<SectionHeaderProps> = ({ onClearAll }) => (
  <View style={styles.sectionHeader}>
    <Text style={styles.sectionTitle}>{SECTION_CONFIG.TITLE}</Text>
    {onClearAll && (
      <TouchableOpacity onPress={onClearAll} activeOpacity={0.7}>
        <Text style={styles.clearButton}>{SECTION_CONFIG.CLEAR_TEXT}</Text>
      </TouchableOpacity>
    )}
  </View>
);

const ChatList: React.FC<ChatListProps> = ({ chats, onChatPress }) => {
  const sortedChats = sortChatsByPriority(chats);
  
  return (
    <View style={styles.chatList}>
      {sortedChats.map((chat) => (
        <ChatItemDisplay
          key={chat.id}
          chat={chat}
          onPress={onChatPress}
        />
      ))}
    </View>
  );
};

const RecentChatListArea: React.FC<RecentChatListAreaProps> = ({
  chats = MOCK_RECENT_CHATS,
  onChatPress,
  onClearAll
}) => {
  const showClearButton = shouldShowClearButton(chats) && onClearAll;

  return (
    <View style={styles.container}>
      <SectionHeader onClearAll={showClearButton ? onClearAll : undefined} />
      <ChatList chats={chats} onChatPress={onChatPress} />
    </View>
  );
};
// #endregion

// #region 8. UI Components & Rendering
const styles = StyleSheet.create({
  // 容器样式
  container: {
    backgroundColor: STYLES.COLORS.WHITE
  },
  
  // 区域标题样式
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: SECTION_CONFIG.HEADER_HORIZONTAL_PADDING,
    paddingTop: SECTION_CONFIG.HEADER_MARGIN_TOP,
    paddingBottom: STYLES.SPACING.MD
  },
  sectionTitle: {
    fontSize: STYLES.FONTS.SIZE.TITLE,
    fontWeight: STYLES.FONTS.WEIGHT.BOLD as any,
    color: STYLES.COLORS.BLACK
  },
  clearButton: {
    fontSize: STYLES.FONTS.SIZE.MEDIUM,
    color: STYLES.COLORS.GRAY,
    fontWeight: STYLES.FONTS.WEIGHT.MEDIUM as any
  },
  
  // 对话列表样式
  chatList: {
    backgroundColor: STYLES.COLORS.WHITE
  }
});
// #endregion

// #region 9. Exports
export default RecentChatListArea;
// #endregion
