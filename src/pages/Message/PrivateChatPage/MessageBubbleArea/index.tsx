/**
 * 消息气泡区域组件
 * 支持多种消息类型：文字、图片、动态等
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
import React from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet } from 'react-native';
import { ChatMessage, User, MessageStatus } from '../../types';
import { STYLES } from '../../constants';
import UserAvatar from '../../MainPage/components/UserAvatar';

// ==================== 2. Types & Schema ====================
export interface DynamicContent {
  id: string;
  photos: string[];
  title: string;
  likes: number;
  timestamp: string;
}

export interface ExtendedChatMessage extends Omit<ChatMessage, 'type'> {
  type: 'text' | 'image' | 'dynamic';
  dynamicContent?: DynamicContent;
  isFromMe: boolean;
}

interface MessageBubbleAreaProps {
  message: ExtendedChatMessage;
  userInfo: User;
  onPress?: (message: ExtendedChatMessage) => void;
  onDynamicPress?: (dynamicId: string, photoIndex: number) => void;
  onRetry?: (messageId: string) => void;
}

// ==================== 3. Constants & Config ====================
// 使用纯色占位符替代默认图片
const DEFAULT_IMAGE_STYLE = {
  backgroundColor: '#e0e0e0',
  justifyContent: 'center' as const,
  alignItems: 'center' as const,
};
const STATUS_ICONS = {
  sending: '⏳',
  sent: '✓',
  read: '✓✓',
  failed: '❌'
} as const;

// ==================== 4. Utils & Helpers ====================
const formatTime = (timestamp: string) => {
  return new Date(timestamp).toLocaleTimeString('zh-CN', { 
    hour: '2-digit', 
    minute: '2-digit' 
  });
};

const getStatusIcon = (status: MessageStatus) => {
  return STATUS_ICONS[status] || '';
};

const truncateText = (text: string, maxLength: number): string => {
  return text.length > maxLength ? `${text.slice(0, maxLength)}...` : text;
};

// ==================== 5. State Management ====================
// 无状态组件，状态由父组件管理

// ==================== 6. Domain Logic ====================
// 业务逻辑由父组件处理，此组件专注于展示

// ==================== 7. UI Components & Rendering ====================
const MessageBubbleArea: React.FC<MessageBubbleAreaProps> = ({
  message,
  userInfo,
  onPress,
  onDynamicPress,
  onRetry
}) => {
  const renderTextMessage = () => (
    <View
      style={[
        styles.bubbleContainer,
        message.isFromMe ? styles.myBubbleContainer : styles.otherBubbleContainer
      ]}
    >
      <Text
        style={[
          styles.messageText,
          message.isFromMe ? styles.myMessageText : styles.otherMessageText
        ]}
      >
        {message.content}
      </Text>
    </View>
  );

  const renderImageMessage = () => {
    return (
      <TouchableOpacity
        style={[
          styles.bubbleContainer,
          styles.imageBubbleContainer,
          message.isFromMe ? styles.myBubbleContainer : styles.otherBubbleContainer
        ]}
        onPress={() => onPress && onPress(message)}
        activeOpacity={0.8}
      >
        <Image
          source={message.content ? { uri: message.content } : DEFAULT_IMAGE}
          style={styles.messageImage}
          defaultSource={DEFAULT_IMAGE}
        />
        <Text
          style={[
            styles.imageDescription,
            message.isFromMe ? styles.myMessageText : styles.otherMessageText
          ]}
        >
          图片
        </Text>
      </TouchableOpacity>
    );
  };

  const renderDynamicMessage = () => {
    if (!message.dynamicContent) return null;

    const { dynamicContent } = message;
    const mainPhoto = dynamicContent.photos[0];

    return (
      <View
        style={[
          styles.bubbleContainer,
          styles.dynamicBubbleContainer,
          message.isFromMe ? styles.myBubbleContainer : styles.otherBubbleContainer
        ]}
      >
        {/* 动态标题 */}
        <Text
          style={[
            styles.dynamicTitle,
            message.isFromMe ? styles.myMessageText : styles.otherMessageText
          ]}
        >
          {truncateText(dynamicContent.title, 30)}
        </Text>

        {/* 单张动态图片 */}
        <TouchableOpacity 
          style={styles.singleDynamicImageContainer}
          onPress={() => onDynamicPress && onDynamicPress(dynamicContent.id, 0)}
          activeOpacity={0.8}
        >
          <Image source={{ uri: mainPhoto }} style={styles.singleDynamicImage} />
          {/* 互动信息覆盖层 */}
          <View style={styles.dynamicStats}>
            <Text style={styles.dynamicLikes}>❤️ {dynamicContent.likes}</Text>
          </View>
        </TouchableOpacity>

        {/* 时间戳 */}
        <Text
          style={[
            styles.dynamicTimestamp,
            message.isFromMe ? styles.myMessageText : styles.otherMessageText
          ]}
        >
          {formatTime(dynamicContent.timestamp)}
        </Text>
      </View>
    );
  };

  const renderMessageContent = () => {
    switch (message.type) {
      case 'image':
        return renderImageMessage();
      case 'dynamic':
        return renderDynamicMessage();
      case 'text':
      default:
        return renderTextMessage();
    }
  };

  return (
    <View
      style={[
        styles.messageContainer,
        message.isFromMe ? styles.myMessageContainer : styles.otherMessageContainer
      ]}
    >
      {/* 对方消息显示头像 */}
      {!message.isFromMe && (
        <View style={styles.avatarContainer}>
          <UserAvatar
            uri={userInfo.avatar}
            size="medium"
          />
        </View>
      )}
      
      {/* 消息内容 */}
      <View style={styles.messageContentContainer}>
        {renderMessageContent()}
        
        {/* 时间戳和状态 */}
        <View
          style={[
            styles.messageMetaContainer,
            message.isFromMe ? styles.myMessageMeta : styles.otherMessageMeta
          ]}
        >
          <Text style={styles.timestamp}>{formatTime(message.timestamp)}</Text>
          
          {/* 发送状态（仅自己的消息显示） */}
          {message.isFromMe && (
            <View style={styles.statusContainer}>
              <Text
                style={[
                  styles.statusIcon,
                  message.status === 'read' && styles.readStatusIcon,
                  message.status === 'failed' && styles.failedStatusIcon
                ]}
              >
                {getStatusIcon(message.status)}
              </Text>
              
              {/* 重发按钮（仅发送失败时显示） */}
              {message.status === 'failed' && onRetry && (
                <TouchableOpacity
                  style={styles.retryButton}
                  onPress={() => onRetry(message.id)}
                  hitSlop={{ top: 5, bottom: 5, left: 5, right: 5 }}
                >
                  <Text style={styles.retryText}>重发</Text>
                </TouchableOpacity>
              )}
            </View>
          )}
        </View>
      </View>
      
      {/* 自己消息显示头像 */}
      {message.isFromMe && (
        <View style={styles.avatarContainer}>
          <UserAvatar
            uri=""
            size="medium"
          />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  messageContainer: {
    flexDirection: 'row',
    marginVertical: STYLES.SPACING.XS,
    paddingHorizontal: STYLES.SPACING.SM
  },
  myMessageContainer: {
    justifyContent: 'flex-end'
  },
  otherMessageContainer: {
    justifyContent: 'flex-start'
  },
  avatarContainer: {
    marginHorizontal: STYLES.SPACING.XS
  },
  messageContentContainer: {
    maxWidth: '70%'
  },
  bubbleContainer: {
    paddingHorizontal: STYLES.SPACING.LG,
    paddingVertical: STYLES.SPACING.MD,
    borderRadius: STYLES.SIZES.BORDER_RADIUS.MEDIUM,
    shadowColor: STYLES.COLORS.BLACK,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1
  },
  myBubbleContainer: {
    backgroundColor: STYLES.COLORS.PRIMARY,
    borderBottomRightRadius: 4
  },
  otherBubbleContainer: {
    backgroundColor: STYLES.COLORS.LIGHT_GRAY,
    borderBottomLeftRadius: 4
  },
  imageBubbleContainer: {
    padding: STYLES.SPACING.SM
  },
  messageText: {
    fontSize: STYLES.FONTS.SIZE.LARGE,
    lineHeight: 22
  },
  myMessageText: {
    color: STYLES.COLORS.WHITE
  },
  otherMessageText: {
    color: STYLES.COLORS.BLACK
  },
  messageImage: {
    width: 200,
    height: 200,
    borderRadius: STYLES.SIZES.BORDER_RADIUS.SMALL,
    marginBottom: STYLES.SPACING.XS
  },
  imageDescription: {
    fontSize: STYLES.FONTS.SIZE.MEDIUM
  },
  messageMetaContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: STYLES.SPACING.XS
  },
  myMessageMeta: {
    justifyContent: 'flex-end'
  },
  otherMessageMeta: {
    justifyContent: 'flex-start'
  },
  timestamp: {
    fontSize: STYLES.FONTS.SIZE.SMALL,
    color: STYLES.COLORS.GRAY,
    marginHorizontal: STYLES.SPACING.XS
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  statusIcon: {
    fontSize: STYLES.FONTS.SIZE.SMALL,
    color: STYLES.COLORS.GRAY
  },
  readStatusIcon: {
    color: STYLES.COLORS.BLUE
  },
  failedStatusIcon: {
    color: STYLES.COLORS.RED
  },
  retryButton: {
    marginLeft: STYLES.SPACING.XS,
    paddingHorizontal: STYLES.SPACING.SM,
    paddingVertical: 2,
    backgroundColor: STYLES.COLORS.PRIMARY,
    borderRadius: 8
  },
  retryText: {
    fontSize: STYLES.FONTS.SIZE.SMALL,
    color: STYLES.COLORS.WHITE,
    fontWeight: '500'
  },

  // 动态消息样式
  dynamicBubbleContainer: {
    padding: STYLES.SPACING.MD,
    minWidth: 200,
    maxWidth: 280
  },
  dynamicTitle: {
    fontSize: STYLES.FONTS.SIZE.MEDIUM,
    fontWeight: '600',
    marginBottom: STYLES.SPACING.SM
  },
  singleDynamicImageContainer: {
    width: '100%',
    aspectRatio: 1.2,
    borderRadius: STYLES.SIZES.BORDER_RADIUS.SMALL,
    overflow: 'hidden',
    position: 'relative',
    backgroundColor: STYLES.COLORS.LIGHT_GRAY,
    marginBottom: STYLES.SPACING.SM
  },
  singleDynamicImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover'
  },
  dynamicStats: {
    position: 'absolute',
    top: 4,
    right: 4,
    backgroundColor: 'rgba(0,0,0,0.7)',
    paddingHorizontal: 4,
    paddingVertical: 2,
    borderRadius: 8
  },
  dynamicLikes: {
    color: STYLES.COLORS.WHITE,
    fontSize: 8,
    fontWeight: '500'
  },
  dynamicTimestamp: {
    fontSize: STYLES.FONTS.SIZE.SMALL,
    opacity: 0.6,
    textAlign: 'right'
  }
});

// ==================== 8. Exports ====================
export default MessageBubbleArea;

});

// ==================== 8. Exports ====================
export default MessageBubbleArea;
