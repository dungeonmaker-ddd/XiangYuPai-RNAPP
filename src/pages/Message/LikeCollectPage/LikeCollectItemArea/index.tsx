/**
 * 点赞收藏项区域组件
 * 显示单个点赞或收藏消息项
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
import { LikeCollectMessage } from '../../types';
import { STYLES } from '../../constants';
import { UserAvatar } from '../../MainPage/components';

// ==================== 2. Types & Schema ====================
interface LikeCollectItemAreaProps {
  message: LikeCollectMessage;
  onPress: (message: LikeCollectMessage) => void;
  onUserPress: (userId: string) => void;
}

// ==================== 3. Constants & Config ====================
// 使用纯色占位符替代默认头像图片
const DEFAULT_THUMBNAIL_STYLE = {
  backgroundColor: '#e0e0e0',
  justifyContent: 'center' as const,
  alignItems: 'center' as const,
};

// ==================== 4. Utils & Helpers ====================
const formatTime = (timestamp: string) => {
  const now = new Date();
  const messageTime = new Date(timestamp);
  const diffMinutes = Math.floor((now.getTime() - messageTime.getTime()) / (1000 * 60));
  
  if (diffMinutes < 1) return '刚刚';
  if (diffMinutes < 60) return `${diffMinutes}分钟前`;
  if (diffMinutes < 24 * 60) return `${Math.floor(diffMinutes / 60)}小时前`;
  return messageTime.toLocaleDateString('zh-CN', { month: '2-digit', day: '2-digit' });
};

const getActionText = (actionType: 'like' | 'collect') => {
  return actionType === 'like' ? '点赞了你的评论' : '收藏了你的作品';
};

const getActionIcon = (actionType: 'like' | 'collect') => {
  return actionType === 'like' ? '💖' : '⭐';
};

// ==================== 5. State Management ====================
// 无状态组件，状态由父组件管理

// ==================== 6. Domain Logic ====================
// 业务逻辑由父组件处理，此组件专注于展示

// ==================== 7. UI Components & Rendering ====================
const LikeCollectItemArea: React.FC<LikeCollectItemAreaProps> = ({
  message,
  onPress,
  onUserPress
}) => {
  return (
    <TouchableOpacity
      style={styles.container}
      onPress={() => onPress(message)}
      activeOpacity={0.7}
    >
      {/* 左侧头像区域 */}
      <TouchableOpacity
        style={styles.avatarContainer}
        onPress={() => onUserPress(message.user.id)}
        activeOpacity={0.7}
      >
        <UserAvatar
          uri={message.user.avatar}
          size="large"
        />
        
        {/* 操作类型图标 */}
        <View style={styles.actionIconContainer}>
          <Text style={styles.actionIcon}>{getActionIcon(message.actionType)}</Text>
        </View>
      </TouchableOpacity>
      
      {/* 中央消息信息区域 */}
      <View style={styles.messageInfo}>
        {/* 用户操作信息行 */}
        <View style={styles.actionInfoRow}>
          <Text style={styles.nickname}>{message.user.nickname}</Text>
          <Text style={styles.actionText}>{getActionText(message.actionType)}</Text>
          <Text style={styles.timestamp}>{formatTime(message.timestamp)}</Text>
        </View>
        
        {/* 相关内容预览行 */}
        <Text
          style={styles.contentPreview}
          numberOfLines={2}
        >
          {message.targetContent.title}
        </Text>
      </View>
      
      {/* 右侧内容缩略图 */}
      <TouchableOpacity
        style={styles.thumbnailContainer}
        onPress={() => onPress(message)}
        activeOpacity={0.7}
      >
        <Image
          source={message.targetContent.thumbnail ? { uri: message.targetContent.thumbnail } : DEFAULT_THUMBNAIL}
          style={styles.thumbnail}
          defaultSource={DEFAULT_THUMBNAIL}
        />
        
        {/* 内容类型标识 */}
        {message.targetContent.type === 'post' && (
          <View style={styles.contentTypeOverlay}>
            <Text style={styles.contentTypeIcon}>📝</Text>
          </View>
        )}
      </TouchableOpacity>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: STYLES.SPACING.LG,
    paddingVertical: STYLES.SPACING.MD,
    backgroundColor: STYLES.COLORS.WHITE,
    minHeight: STYLES.SIZES.MESSAGE_ITEM_HEIGHT
  },
  avatarContainer: {
    position: 'relative',
    marginRight: STYLES.SPACING.LG
  },
  actionIconContainer: {
    position: 'absolute',
    bottom: -2,
    right: -2,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: STYLES.COLORS.WHITE,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: STYLES.COLORS.WHITE
  },
  actionIcon: {
    fontSize: 12
  },
  messageInfo: {
    flex: 1,
    justifyContent: 'center',
    marginRight: STYLES.SPACING.LG
  },
  actionInfoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: STYLES.SPACING.XS,
    flexWrap: 'wrap'
  },
  nickname: {
    fontSize: STYLES.FONTS.SIZE.LARGE,
    fontWeight: STYLES.FONTS.WEIGHT.BOLD as any,
    color: STYLES.COLORS.BLACK,
    marginRight: STYLES.SPACING.XS
  },
  actionText: {
    fontSize: STYLES.FONTS.SIZE.LARGE,
    color: STYLES.COLORS.GRAY,
    marginRight: STYLES.SPACING.XS
  },
  timestamp: {
    fontSize: STYLES.FONTS.SIZE.SMALL,
    color: STYLES.COLORS.GRAY,
    marginLeft: 'auto'
  },
  contentPreview: {
    fontSize: STYLES.FONTS.SIZE.MEDIUM,
    color: STYLES.COLORS.GRAY,
    lineHeight: 20
  },
  thumbnailContainer: {
    position: 'relative'
  },
  thumbnail: {
    width: 48,
    height: 48,
    borderRadius: STYLES.SIZES.BORDER_RADIUS.SMALL,
    borderWidth: 1,
    borderColor: STYLES.COLORS.BORDER_GRAY
  },
  contentTypeOverlay: {
    position: 'absolute',
    bottom: 2,
    left: 2,
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    alignItems: 'center'
  },
  contentTypeIcon: {
    fontSize: 8,
    color: STYLES.COLORS.WHITE
  }
});

// ==================== 8. Exports ====================
export default LikeCollectItemArea;

});

// ==================== 8. Exports ====================
export default LikeCollectItemArea;
