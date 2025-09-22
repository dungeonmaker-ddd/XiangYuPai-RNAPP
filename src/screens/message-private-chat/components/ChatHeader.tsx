/**
 * 聊天页面头部组件
 * 显示用户信息、在线状态和通话按钮
 */

import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { User } from '../../types';
import { STYLES } from '../../constants';

interface ChatHeaderProps {
  userInfo: User;
  onBack: () => void;
}

const ChatHeader: React.FC<ChatHeaderProps> = ({
  userInfo,
  onBack
}) => {
  const getOnlineStatusText = () => {
    if (userInfo.isOnline) {
      return '在线';
    }
    
    const lastActiveTime = new Date(userInfo.lastActiveTime);
    const now = new Date();
    const diffMinutes = Math.floor((now.getTime() - lastActiveTime.getTime()) / (1000 * 60));
    
    if (diffMinutes < 60) return `${diffMinutes}分钟前在线`;
    if (diffMinutes < 24 * 60) return `${Math.floor(diffMinutes / 60)}小时前在线`;
    return lastActiveTime.toLocaleDateString('zh-CN', { month: '2-digit', day: '2-digit' }) + '在线';
  };

  return (
    <View style={styles.container}>
      {/* 左侧返回按钮 */}
      <View style={styles.leftSection}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={onBack}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          activeOpacity={0.7}
        >
          <Image 
            source={require('../pchat/返回上一页.png')} 
            style={styles.backIcon}
            resizeMode="contain"
          />
        </TouchableOpacity>
      </View>
      
      {/* 中间用户信息区域 - 绝对居中 */}
      <View style={styles.userInfoContainer}>
        <Text style={styles.nickname} numberOfLines={1}>
          {userInfo.nickname}
        </Text>
        <Text
          style={[
            styles.onlineStatus,
            { color: userInfo.isOnline ? STYLES.COLORS.GREEN : STYLES.COLORS.GRAY }
          ]}
        >
          {getOnlineStatusText()}
        </Text>
      </View>
      
      {/* 右侧占位区域 - 保持标题居中 */}
      <View style={styles.rightSpacer} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 100,
    backgroundColor: STYLES.COLORS.WHITE,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: STYLES.SPACING.LG,
    paddingTop: 44,
    borderBottomWidth: 1,
    borderBottomColor: STYLES.COLORS.BORDER_GRAY
  },
  leftSection: {
    flex: 1,
    minWidth: 0,
    flexBasis: 0,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start'
  },
  backButton: {
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center'
  },
  backIcon: {
    width: 20,
    height: 20,
    tintColor: STYLES.COLORS.BLACK
  },
  userInfoContainer: {
    alignItems: 'center',
    justifyContent: 'center'
  },
  nickname: {
    fontSize: STYLES.FONTS.SIZE.LARGE,
    fontWeight: STYLES.FONTS.WEIGHT.BOLD as any,
    color: STYLES.COLORS.BLACK,
    marginBottom: 2
  },
  onlineStatus: {
    fontSize: STYLES.FONTS.SIZE.MEDIUM,
    fontWeight: STYLES.FONTS.WEIGHT.MEDIUM as any
  },
  rightSpacer: {
    flex: 1,
    minWidth: 0,
    flexBasis: 0
  }
});

export default ChatHeader;
