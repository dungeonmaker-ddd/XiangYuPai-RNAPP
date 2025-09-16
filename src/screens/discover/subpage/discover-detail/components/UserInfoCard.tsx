/**
 * 用户信息卡片组件
 * 显示发布用户的头像、昵称、发布内容、标签等信息
 */

import React, { memo } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from 'react-native';
import { UserInfoCardProps } from '../types';

const UserInfoCard: React.FC<UserInfoCardProps> = ({
  user,
  content,
  isFollowing,
  onFollowPress,
  onUserPress,
}) => {
  // 格式化时间显示
  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) {
      return '刚刚';
    } else if (diffInHours < 24) {
      return `${diffInHours}小时前`;
    } else if (diffInHours < 24 * 7) {
      const days = Math.floor(diffInHours / 24);
      return `${days}天前`;
    } else {
      return date.toLocaleDateString('zh-CN', { month: '2-digit', day: '2-digit' });
    }
  };

  // 处理标签点击
  const handleTagPress = (tag: string) => {
    // TODO: 导航到话题页面
    console.log('Tag pressed:', tag);
  };

  return (
    <View style={styles.container}>
      {/* 用户头像和操作区域 */}
      <View style={styles.userSection}>
        <TouchableOpacity 
          style={styles.userInfo} 
          onPress={onUserPress}
          activeOpacity={0.7}
        >
          <Image source={{ uri: user.avatar }} style={styles.avatar} />
          <View style={styles.userBasicInfo}>
            <View style={styles.nameRow}>
              <Text style={styles.nickname}>{user.nickname}</Text>
              {user.level && (
                <View style={styles.levelBadge}>
                  <Text style={styles.levelText}>{user.level}</Text>
                </View>
              )}
              {user.verified && (
                <View style={styles.verifiedBadge}>
                  <Text style={styles.verifiedIcon}>✓</Text>
                </View>
              )}
            </View>
          </View>
        </TouchableOpacity>

        {/* 关注按钮 */}
        <TouchableOpacity
          style={[
            styles.followButton,
            isFollowing && styles.followButtonActive,
          ]}
          onPress={onFollowPress}
          activeOpacity={0.8}
        >
          <Text style={[
            styles.followButtonText,
            isFollowing && styles.followButtonTextActive,
          ]}>
            {isFollowing ? '已关注' : '关注'}
          </Text>
        </TouchableOpacity>
      </View>

      {/* 内容区域 */}
      <View style={styles.contentSection}>
        {/* 发布文案 */}
        <Text style={styles.contentTitle} numberOfLines={2}>
          {content.title}
        </Text>
        
        {/* 详细描述 */}
        {content.description && (
          <Text style={styles.contentDescription} numberOfLines={3}>
            {content.description}
          </Text>
        )}

        {/* 标签区域 */}
        {content.tags && content.tags.length > 0 && (
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.tagsContainer}
            contentContainerStyle={styles.tagsContent}
          >
            {content.tags.map((tag, index) => (
              <TouchableOpacity
                key={index}
                style={styles.tagButton}
                onPress={() => handleTagPress(tag)}
                activeOpacity={0.7}
              >
                <Text style={styles.tagText}>{tag}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        )}

        {/* 位置和时间信息 */}
        <View style={styles.metaInfo}>
          <Text style={styles.timeText}>
            {formatTime(content.createdAt)}
          </Text>
          {content.location && (
            <>
              <View style={styles.separator} />
              <Text style={styles.locationText}>
                📍 {content.location.address}
              </Text>
            </>
          )}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    marginTop: 'auto',
  },
  userSection: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 12,
  },
  userInfo: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    borderWidth: 2,
    borderColor: 'rgba(51, 51, 51, 0.1)',
    marginRight: 12,
  },
  userBasicInfo: {
    flex: 1,
  },
  contentSection: {
    paddingHorizontal: 16,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  nickname: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333333',
    marginRight: 8,
  },
  levelBadge: {
    backgroundColor: '#FF3B30',
    borderRadius: 8,
    paddingHorizontal: 6,
    paddingVertical: 2,
    marginRight: 6,
  },
  levelText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  verifiedBadge: {
    backgroundColor: '#007AFF',
    borderRadius: 8,
    width: 16,
    height: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  verifiedIcon: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  contentTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000000',
    lineHeight: 20,
    marginBottom: 4,
  },
  contentDescription: {
    fontSize: 16,
    color: '#000000',
    lineHeight: 20,
  },
  followButton: {
    backgroundColor: '#8A2BE2',
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginLeft: 12,
  },
  followButtonActive: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: 'rgba(51, 51, 51, 0.4)',
  },
  followButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  followButtonTextActive: {
    color: 'rgba(51, 51, 51, 0.8)',
  },
  tagsContainer: {
    marginBottom: 8,
  },
  tagsContent: {
    paddingRight: 16,
  },
  tagButton: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#007AFF',
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
    marginRight: 8,
  },
  tagText: {
    fontSize: 12,
    color: '#007AFF',
    fontWeight: '500',
  },
  metaInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 16,
  },
  timeText: {
    fontSize: 12,
    color: 'rgba(51, 51, 51, 0.6)',
  },
  separator: {
    width: 1,
    height: 12,
    backgroundColor: 'rgba(51, 51, 51, 0.3)',
    marginHorizontal: 8,
  },
  locationText: {
    fontSize: 12,
    color: 'rgba(51, 51, 51, 0.6)',
  },
});

export default memo(UserInfoCard);
