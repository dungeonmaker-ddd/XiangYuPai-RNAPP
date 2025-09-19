/**
 * 用户信息卡片组件
 * 显示发布用户的头像、昵称、性别年龄、发布内容、标签等信息
 * 按照原型图完整实现所有UI元素和交互
 * 遵循8段式编码逻辑架构设计
 */

// #region 1. Imports
import React, { memo, useCallback } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from 'react-native';
import { UserInfoCardProps } from '../types';
import { UserInfo } from '../../discover/types';
// #endregion

// #region 2. Types & Props Extensions
// 扩展用户信息类型，支持性别年龄和个性签名
interface ExtendedUserInfo extends UserInfo {
  gender?: 'male' | 'female';
  age?: number;
  bio?: string;
}

// 内部组件Props
interface GenderAgeBadgeProps {
  gender: 'male' | 'female';
  age: number;
}

interface TagButtonProps {
  tag: string;
  onPress: (tag: string) => void;
}
// #endregion

// #region 3. Constants & Config
const CONSTANTS = {
  AVATAR_SIZE: 48,
  BORDER_RADIUS: 24,
  GENDER_AGE_BADGE: {
    FEMALE_COLOR: '#FF69B4',
    MALE_COLOR: '#4A90E2',
    BORDER_RADIUS: 8,
    PADDING_HORIZONTAL: 6,
    PADDING_VERTICAL: 2,
  },
  TAG: {
    BACKGROUND_COLOR: '#F0F8FF',
    TEXT_COLOR: '#1890FF',
    BORDER_RADIUS: 12,
    PADDING_HORIZONTAL: 8,
    PADDING_VERTICAL: 4,
    MARGIN_RIGHT: 8,
  },
  FOLLOW_BUTTON: {
    ACTIVE_COLOR: '#8A2BE2',
    BORDER_RADIUS: 16,
    PADDING_HORIZONTAL: 16,
    PADDING_VERTICAL: 8,
  },
  SPACING: {
    CONTAINER_HORIZONTAL: 20,
    CONTAINER_VERTICAL: 16,
    AVATAR_MARGIN_RIGHT: 12,
    NAME_MARGIN_RIGHT: 8,
    CONTENT_MARGIN_BOTTOM: 8,
    TAGS_MARGIN_BOTTOM: 8,
    META_PADDING_TOP: 4,
  },
} as const;
// #endregion

// #region 4. Utils & Helpers
const formatTime = (dateString: string): string => {
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
    // 按原图格式: 01-10
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${month}-${day}`;
  }
};

const getGenderSymbol = (gender: 'male' | 'female'): string => {
  return gender === 'female' ? '♀' : '♂';
};

const getGenderColor = (gender: 'male' | 'female'): string => {
  return gender === 'male' 
    ? CONSTANTS.GENDER_AGE_BADGE.MALE_COLOR 
    : CONSTANTS.GENDER_AGE_BADGE.FEMALE_COLOR;
};
// #endregion

// #region 5. Subcomponents
const GenderAgeBadge: React.FC<GenderAgeBadgeProps> = memo(({ gender, age }) => (
  <View style={[
    styles.genderAgeBadge,
    { backgroundColor: getGenderColor(gender) }
  ]}>
    <Text style={styles.genderAgeText}>
      {getGenderSymbol(gender)}{age}
    </Text>
  </View>
));

const TagButton: React.FC<TagButtonProps> = memo(({ tag, onPress }) => (
  <TouchableOpacity
    style={styles.tagButton}
    onPress={() => onPress(tag)}
    activeOpacity={0.7}
  >
    <Text style={styles.tagText}>#{tag}</Text>
  </TouchableOpacity>
));

// #endregion

// #region 6. Main Component
const UserInfoCard: React.FC<UserInfoCardProps> = ({
  user,
  content,
  isFollowing,
  onFollowPress,
  onUserPress,
}) => {
  // 类型安全的用户信息扩展
  const extendedUser = user as ExtendedUserInfo;
  // #region 7. Event Handlers
  const handleTagPress = useCallback((tag: string) => {
    // TODO: 导航到话题页面
    console.log('Tag pressed:', tag);
  }, []);

  const handleFollowPress = useCallback(() => {
    onFollowPress();
  }, [onFollowPress]);

  const handleUserPress = useCallback(() => {
    onUserPress();
  }, [onUserPress]);
  // #endregion

  // #region 8. UI Rendering
  return (
    <View style={styles.container}>
      {/* 用户头像和操作区域 */}
      <View style={styles.userSection}>
        <TouchableOpacity 
          style={styles.userInfo} 
          onPress={handleUserPress}
          activeOpacity={0.7}
        >
          <Image source={{ uri: extendedUser.avatar }} style={styles.avatar} />
          <View style={styles.userBasicInfo}>
            <View style={styles.nameRow}>
              <Text style={styles.nickname}>{extendedUser.nickname}</Text>
              
              {/* 性别年龄标识 - 原图中的"♀19"粉色标签 */}
              {extendedUser.gender && extendedUser.age && (
                <GenderAgeBadge 
                  gender={extendedUser.gender} 
                  age={extendedUser.age} 
                />
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
          onPress={handleFollowPress}
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
        {/* 动态内容标题 */}
        <Text style={styles.contentTitle} numberOfLines={2}>
          {content.title}
        </Text>
        
        {/* 动态详细内容 - 英雄联盟相关内容 */}
        {content.description && (
          <Text style={styles.contentDescription} numberOfLines={3}>
            {content.description}
          </Text>
        )}

        {/* 话题标签区域 - 按原图"#S10全球总决赛"格式 */}
        {content.tags && content.tags.length > 0 && (
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.tagsContainer}
            contentContainerStyle={styles.tagsContent}
          >
            {content.tags.map((tag, index) => (
              <TagButton
                key={`tag-${index}-${tag}`}
                tag={tag}
                onPress={handleTagPress}
              />
            ))}
          </ScrollView>
        )}

        {/* 位置和时间信息 - 按原图"01-10 河北"格式 */}
        <View style={styles.metaInfo}>
          <Text style={styles.timeText}>
            {formatTime(content.createdAt)}
          </Text>
          {content.location && (
            <>
              <View style={styles.separator} />
              <Text style={styles.locationText}>
                {content.location.address}
              </Text>
            </>
          )}
        </View>

        {/* 底部分割线 */}
        <View style={styles.bottomSeparator} />
      </View>
    </View>
  );
  // #endregion
};

// #region 9. Styles
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
    paddingHorizontal: CONSTANTS.SPACING.CONTAINER_HORIZONTAL,
    paddingTop: CONSTANTS.SPACING.CONTAINER_VERTICAL,
    paddingBottom: 12,
  },
  userInfo: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: CONSTANTS.AVATAR_SIZE,
    height: CONSTANTS.AVATAR_SIZE,
    borderRadius: CONSTANTS.BORDER_RADIUS,
    borderWidth: 2,
    borderColor: 'rgba(51, 51, 51, 0.1)',
    marginRight: CONSTANTS.SPACING.AVATAR_MARGIN_RIGHT,
  },
  userBasicInfo: {
    flex: 1,
  },
  contentSection: {
    paddingHorizontal: CONSTANTS.SPACING.CONTAINER_HORIZONTAL,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  nickname: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333333',
    marginRight: CONSTANTS.SPACING.NAME_MARGIN_RIGHT,
  },
  genderAgeBadge: {
    borderRadius: CONSTANTS.GENDER_AGE_BADGE.BORDER_RADIUS,
    paddingHorizontal: CONSTANTS.GENDER_AGE_BADGE.PADDING_HORIZONTAL,
    paddingVertical: CONSTANTS.GENDER_AGE_BADGE.PADDING_VERTICAL,
    marginRight: 6,
  },
  genderAgeText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  contentTitle: {
    fontSize: 16,
    fontWeight: 'normal',
    color: '#000000',
    lineHeight: 20,
    marginBottom: CONSTANTS.SPACING.CONTENT_MARGIN_BOTTOM,
  },
  contentDescription: {
    fontSize: 16,
    color: '#666666',
    lineHeight: 20,
    marginBottom: CONSTANTS.SPACING.CONTENT_MARGIN_BOTTOM,
  },
  followButton: {
    backgroundColor: CONSTANTS.FOLLOW_BUTTON.ACTIVE_COLOR,
    borderRadius: CONSTANTS.FOLLOW_BUTTON.BORDER_RADIUS,
    paddingHorizontal: CONSTANTS.FOLLOW_BUTTON.PADDING_HORIZONTAL,
    paddingVertical: CONSTANTS.FOLLOW_BUTTON.PADDING_VERTICAL,
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
    marginBottom: CONSTANTS.SPACING.TAGS_MARGIN_BOTTOM,
  },
  tagsContent: {
    paddingRight: 16,
  },
  tagButton: {
    backgroundColor: CONSTANTS.TAG.BACKGROUND_COLOR,
    borderRadius: CONSTANTS.TAG.BORDER_RADIUS,
    paddingHorizontal: CONSTANTS.TAG.PADDING_HORIZONTAL,
    paddingVertical: CONSTANTS.TAG.PADDING_VERTICAL,
    marginRight: CONSTANTS.TAG.MARGIN_RIGHT,
  },
  tagText: {
    fontSize: 12,
    color: CONSTANTS.TAG.TEXT_COLOR,
    fontWeight: '500',
  },
  metaInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: CONSTANTS.SPACING.META_PADDING_TOP,
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
  bottomSeparator: {
    height: 1,
    backgroundColor: '#F0F0F0',
    marginTop: 16,
  },
});
// #endregion

// #region 10. Exports
export default memo(UserInfoCard);
export type { ExtendedUserInfo, GenderAgeBadgeProps, TagButtonProps };
// #endregion
