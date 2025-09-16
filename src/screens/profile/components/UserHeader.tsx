/**
 * 用户头部信息组件
 * 包含头像、昵称、简介和操作按钮
 */

import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  StyleSheet,
} from 'react-native';
// import Icon from 'react-native-vector-icons/Ionicons';

import type { UserHeaderProps } from '../types';
import { COLORS, SIZES, FONT_SIZES, DEFAULT_VALUES } from '../constants';

// 导入本地默认头像
const defaultAvatarImage = require('./userhead/用户名称.png');

export const UserHeader: React.FC<UserHeaderProps> = ({
  userInfo,
  onAvatarPress,
  onEditNickname,
  onEditBio,
  onViewProfile,
}) => {
  const avatarSource = userInfo?.avatar 
    ? { uri: userInfo.avatar }
    : defaultAvatarImage;

  const displayBio = userInfo?.bio || DEFAULT_VALUES.DEFAULT_BIO;
  const isDefaultBio = displayBio === DEFAULT_VALUES.DEFAULT_BIO;

  return (
    <View style={styles.container}>
      {/* 头像区域 */}
      <View style={styles.avatarSection}>
        <TouchableOpacity
          style={styles.avatarContainer}
          onPress={onAvatarPress}
          activeOpacity={0.8}
        >
          <Image
            source={avatarSource}
            style={styles.avatar}
            defaultSource={defaultAvatarImage}
          />
          
          {/* 在线状态指示 */}
          {userInfo?.status === 'online' && (
            <View style={styles.onlineIndicator} />
          )}
          
        </TouchableOpacity>
      </View>

      {/* 用户信息区域 */}
      <View style={styles.userInfoSection}>
        {/* 昵称行 */}
        <View style={styles.nicknameRow}>
          <Text style={styles.nickname} numberOfLines={1}>
            {userInfo?.nickname || '未设置昵称'}
          </Text>
        </View>

        {/* 简介行 */}
        <TouchableOpacity
          style={styles.bioContainer}
          onPress={onEditBio}
          activeOpacity={0.7}
        >
          <Text
            style={[
              styles.bio,
              isDefaultBio && styles.bioPlaceholder,
            ]}
            numberOfLines={2}
          >
            {displayBio}
          </Text>
        </TouchableOpacity>

      </View>

      {/* 认证标识 */}
      {userInfo?.isVerified && (
        <View style={styles.verifiedBadge}>
          <Text style={[styles.iconText, { color: COLORS.SUCCESS, fontSize: 20 }]}>✓</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    paddingHorizontal: SIZES.PADDING_M,
    paddingTop: SIZES.PADDING_S + 54,
    paddingBottom: SIZES.PADDING_S + 20,
    alignItems: 'flex-start',
  },
  avatarSection: {
    marginRight: SIZES.PADDING_S,
  },
  avatarContainer: {
    position: 'relative',
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    borderWidth: 2,
    borderColor: COLORS.WHITE,
    // 添加头像阴影效果
    shadowColor: COLORS.BLACK,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 3,
  },
  onlineIndicator: {
    position: 'absolute',
    bottom: 4,
    right: 4,
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: COLORS.SUCCESS,
    borderWidth: 2,
    borderColor: COLORS.WHITE,
  },
  userInfoSection: {
    flex: 1,
    paddingTop: 2,
  },
  nicknameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SIZES.PADDING_XS,
  },
  nickname: {
    fontSize: FONT_SIZES.TITLE_MEDIUM,
    fontWeight: 'bold',
    color: COLORS.WHITE,
    flex: 1,
  },
  bioContainer: {
    marginBottom: 0,
  },
  bio: {
    fontSize: FONT_SIZES.BODY_SMALL,
    color: COLORS.WHITE,
    lineHeight: 16,
  },
  bioPlaceholder: {
    opacity: 0.7,
    fontStyle: 'italic',
  },
  verifiedBadge: {
    position: 'absolute',
    top: SIZES.PADDING_S + 44,
    right: SIZES.PADDING_M,
  },
  iconText: {
    fontSize: 16,
    textAlign: 'center',
  },
});

export default UserHeader;
