// #region 1. File Banner & TOC
/**
 * 用户信息展示区域 - 个人中心顶部用户信息展示
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
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  StyleSheet,
} from 'react-native';

// 内部导入
import type { UserInfoAreaProps } from '../types';
import { COLORS, SIZES, FONT_SIZES, DEFAULT_VALUES } from '../constants';
// #endregion

// #region 3. Types & Schema
interface LocalProps extends UserInfoAreaProps {
  // 扩展本地Props
}
// #endregion

// #region 4. Constants & Config
const defaultAvatarImage = require('./userhead/用户名称.png');
// #endregion

// #region 5. Utils & Helpers
const getAvatarSource = (avatar: string | null) => {
  return avatar ? { uri: avatar } : defaultAvatarImage;
};

const getDisplayBio = (bio: string) => {
  return bio || DEFAULT_VALUES.DEFAULT_BIO;
};

const isDefaultBio = (bio: string) => {
  return bio === DEFAULT_VALUES.DEFAULT_BIO;
};
// #endregion

// #region 6. State Management
// 无复杂状态管理需求
// #endregion

// #region 7. Domain Logic
// 事件处理逻辑已通过props传入
// #endregion

// #region 8. UI Components & Rendering
export const UserInfoArea: React.FC<LocalProps> = ({
  userInfo,
  onAvatarPress,
  onEditNickname,
  onEditBio,
  onViewProfile,
}) => {
  const avatarSource = getAvatarSource(userInfo?.avatar || null);
  const displayBio = getDisplayBio(userInfo?.bio || '');
  const bioIsDefault = isDefaultBio(displayBio);

  return (
    <View style={styles.container}>
      {/* 头像区域 */}
      <View style={styles.avatarSection}>
        <TouchableOpacity
          style={styles.avatarContainer}
          onPress={onAvatarPress}
          activeOpacity={0.8}
          accessible={true}
          accessibilityRole="button"
          accessibilityLabel="更换头像"
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
        <TouchableOpacity
          style={styles.nicknameRow}
          onPress={onEditNickname}
          activeOpacity={0.7}
          accessible={true}
          accessibilityRole="button"
          accessibilityLabel={`编辑昵称: ${userInfo?.nickname || '未设置昵称'}`}
        >
          <Text style={styles.nickname} numberOfLines={1}>
            {userInfo?.nickname || '未设置昵称'}
          </Text>
          <Text style={styles.editIcon}>✏️</Text>
        </TouchableOpacity>

        {/* 简介行 */}
        <TouchableOpacity
          style={styles.bioContainer}
          onPress={onEditBio}
          activeOpacity={0.7}
          accessible={true}
          accessibilityRole="button"
          accessibilityLabel={`编辑简介: ${displayBio}`}
        >
          <Text
            style={[
              styles.bio,
              bioIsDefault && styles.bioPlaceholder,
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
          <Text style={styles.verifiedIcon}>✓</Text>
        </View>
      )}

      {/* 操作按钮区域 */}
      <View style={styles.actionButtons}>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={onViewProfile}
          activeOpacity={0.8}
          accessible={true}
          accessibilityRole="button"
          accessibilityLabel="查看完整资料"
        >
          <Text style={styles.actionButtonText}>查看资料</Text>
        </TouchableOpacity>
      </View>
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
    position: 'relative',
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
  editIcon: {
    fontSize: 14,
    marginLeft: SIZES.PADDING_XS,
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
    right: SIZES.PADDING_M + 80,
  },
  verifiedIcon: {
    fontSize: 20,
    color: COLORS.SUCCESS,
    textAlign: 'center',
  },
  actionButtons: {
    position: 'absolute',
    top: SIZES.PADDING_S + 64,
    right: SIZES.PADDING_M,
  },
  actionButton: {
    paddingHorizontal: SIZES.PADDING_S,
    paddingVertical: SIZES.PADDING_XS,
    borderRadius: SIZES.COMPONENT_RADIUS,
    borderWidth: 1,
    borderColor: COLORS.WHITE,
    backgroundColor: 'rgba(255,255,255,0.1)',
  },
  actionButtonText: {
    fontSize: FONT_SIZES.BODY_SMALL,
    color: COLORS.WHITE,
    fontWeight: '500',
  },
});
// #endregion

// #region 9. Exports
export default UserInfoArea;
// #endregion
