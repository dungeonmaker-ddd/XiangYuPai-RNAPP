/**
 * 赞和收藏消息项组件
 * 显示单个点赞或收藏消息
 */

import React from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet } from 'react-native';
import { LikeCollectMessage } from '../../types';
import { STYLES } from '../../constants';
import { UserAvatar } from '../../components';

interface LikeCollectItemProps {
  message: LikeCollectMessage;
  onPress: (message: LikeCollectMessage) => void;
  onUserPress: (userId: string) => void;
}

const LikeCollectItem: React.FC<LikeCollectItemProps> = ({
  message,
  onPress,
  onUserPress
}) => {
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

  const defaultThumbnail = require('../../../../../assets/images/common/default-avatar.png');

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
          source={message.targetContent.thumbnail ? { uri: message.targetContent.thumbnail } : defaultThumbnail}
          style={styles.thumbnail}
          defaultSource={defaultThumbnail}
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
    fontWeight: STYLES.FONTS.WEIGHT.BOLD,
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

export default LikeCollectItem;
