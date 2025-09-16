/**
 * 用户头像组件
 * 支持不同尺寸和默认头像
 */

import React from 'react';
import { Image, StyleSheet, View } from 'react-native';
import { STYLES } from '../constants';

interface UserAvatarProps {
  uri?: string;
  size?: 'small' | 'medium' | 'large';
  style?: any;
}

const UserAvatar: React.FC<UserAvatarProps> = ({
  uri,
  size = 'medium',
  style
}) => {
  const defaultAvatar = require('../../../../assets/images/common/default-avatar.png');
  
  const getSizeStyle = () => {
    switch (size) {
      case 'small':
        return { width: 32, height: 32, borderRadius: 16 };
      case 'large':
        return { width: 60, height: 60, borderRadius: 30 };
      case 'medium':
      default:
        return { width: 44, height: 44, borderRadius: 22 };
    }
  };

  return (
    <View style={[styles.container, getSizeStyle(), style]}>
      <Image
        source={uri ? { uri } : defaultAvatar}
        style={[styles.avatar, getSizeStyle()]}
        defaultSource={defaultAvatar}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    overflow: 'hidden',
    backgroundColor: STYLES.COLORS.LIGHT_GRAY
  },
  avatar: {
    width: '100%',
    height: '100%'
  }
});

export default UserAvatar;
