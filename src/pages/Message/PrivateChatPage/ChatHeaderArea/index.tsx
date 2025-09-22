/**
 * 聊天头部区域组件
 * 显示用户信息、在线状态和返回导航
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
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { User } from '../../types';
import { STYLES } from '../../constants';

// ==================== 2. Types & Schema ====================
interface ChatHeaderAreaProps {
  userInfo: User;
  onBack: () => void;
}

// ==================== 3. Constants & Config ====================
const HEADER_HEIGHT = 100;
const STATUS_BAR_HEIGHT = 44;
const BUTTON_SIZE = 32;
const ICON_SIZE = 20;

// ==================== 4. Utils & Helpers ====================
const getOnlineStatusText = (userInfo: User) => {
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

// ==================== 5. State Management ====================
// 无状态组件，状态由父组件管理

// ==================== 6. Domain Logic ====================
// 业务逻辑由父组件处理，此组件专注于展示

// ==================== 7. UI Components & Rendering ====================
const ChatHeaderArea: React.FC<ChatHeaderAreaProps> = ({
  userInfo,
  onBack
}) => {
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
          {getOnlineStatusText(userInfo)}
        </Text>
      </View>
      
      {/* 右侧占位区域 - 保持标题居中 */}
      <View style={styles.rightSpacer} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: HEADER_HEIGHT,
    backgroundColor: STYLES.COLORS.WHITE,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: STYLES.SPACING.LG,
    paddingTop: STATUS_BAR_HEIGHT,
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
    width: BUTTON_SIZE,
    height: BUTTON_SIZE,
    justifyContent: 'center',
    alignItems: 'center'
  },
  backIcon: {
    width: ICON_SIZE,
    height: ICON_SIZE,
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

// ==================== 8. Exports ====================
export default ChatHeaderArea;
