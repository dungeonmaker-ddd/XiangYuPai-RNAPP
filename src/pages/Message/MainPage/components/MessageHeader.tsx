/**
 * 消息导航栏组件
 * 固定头部 - 高度56px - 白色背景
 * 包含页面标题和设置按钮
 */

import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { STYLES } from '../constants';

interface MessageHeaderProps {
  onClearPress?: () => void;
  showClearButton?: boolean;
}

const MessageHeader: React.FC<MessageHeaderProps> = ({
  onClearPress,
  showClearButton = true
}) => {
  return (
    <View style={styles.container}>
      {/* 左侧占位区域 - 保持标题居中 */}
      <View style={styles.leftSpacer} />
      
      {/* 中间标题区域 - 绝对居中 */}
      <View style={styles.titleContainer}>
        <Text style={styles.title}>消息</Text>
      </View>
      
      {/* 右侧操作区域 */}
      <View style={styles.rightActions}>
        {/* 清理按钮 */}
        {showClearButton && onClearPress && (
          <TouchableOpacity
            style={styles.clearButton}
            onPress={onClearPress}
            activeOpacity={0.7}
          >
            <Image 
              source={require('./title/清理.png')} 
              style={styles.clearIcon}
            />
          </TouchableOpacity>
        )}
      </View>
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
  leftSpacer: {
    flex: 1,
    minWidth: 0,
    flexBasis: 0
  },
  titleContainer: {
    alignItems: 'center',
    justifyContent: 'center'
  },
  title: {
    fontSize: STYLES.FONTS.SIZE.TITLE,
    fontWeight: STYLES.FONTS.WEIGHT.BOLD as any,
    color: STYLES.COLORS.BLACK
  },
  rightActions: {
    flex: 1,
    minWidth: 0,
    flexBasis: 0,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingLeft: 6
  },
  clearButton: {
    paddingVertical: STYLES.SPACING.XS,
    paddingHorizontal: STYLES.SPACING.XS
  },
  clearIcon: {
    width: 22,
    height: 22,
    resizeMode: 'contain'
  }
});

export default MessageHeader;
