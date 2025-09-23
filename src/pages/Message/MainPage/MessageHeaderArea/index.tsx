// #region 1. File Banner & TOC
/**
 * 消息导航栏区域组件 - 顶部布局区域
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
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { MessageHeaderAreaProps } from '../types';
import { STYLES } from '../constants';
// #endregion

// #region 3. Types & Schema
interface HeaderButtonProps {
  onPress: () => void;
  icon: any;
  style?: any;
}
// #endregion

// #region 4. Constants & Config
const HEADER_CONFIG = {
  HEIGHT: 100,
  PADDING_TOP: 44,
  ICON_SIZE: 22,
  TITLE_SIZE: STYLES.FONTS.SIZE.TITLE
};
// #endregion

// #region 5. Utils & Helpers
const createHeaderLayout = () => ({
  leftFlex: 1,
  centerFlex: 0,
  rightFlex: 1
});

const getIconSource = (iconName: string) => {
  const iconMap: { [key: string]: any } = {
    clear: require('./title/清理.png')
  };
  return iconMap[iconName];
};
// #endregion

// #region 6. State Management
// 无需复杂状态管理，使用简单的props传递
// #endregion

// #region 7. Domain Logic
const HeaderButton: React.FC<HeaderButtonProps> = ({ onPress, icon, style }) => (
  <TouchableOpacity
    style={[styles.actionButton, style]}
    onPress={onPress}
    activeOpacity={0.7}
  >
    <Image 
      source={icon}
      style={styles.actionIcon}
      resizeMode="contain"
    />
  </TouchableOpacity>
);

const MessageHeaderArea: React.FC<MessageHeaderAreaProps> = ({
  onClearPress,
  showClearButton = true
}) => {
  const layout = createHeaderLayout();
  
  return (
    <View style={styles.container}>
      {/* 左侧占位区域 - 保持标题居中 */}
      <View style={[styles.sideArea, { flex: layout.leftFlex }]} />
      
      {/* 中间标题区域 - 绝对居中 */}
      <View style={styles.titleContainer}>
        <Text style={styles.title}>消息</Text>
      </View>
      
      {/* 右侧操作区域 */}
      <View style={[styles.sideArea, styles.rightActions, { flex: layout.rightFlex }]}>
        {showClearButton && onClearPress && (
          <HeaderButton
            onPress={onClearPress}
            icon={getIconSource('clear')}
          />
        )}
      </View>
    </View>
  );
};
// #endregion

// #region 8. UI Components & Rendering
const styles = StyleSheet.create({
  container: {
    height: HEADER_CONFIG.HEIGHT,
    backgroundColor: STYLES.COLORS.WHITE,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: STYLES.SPACING.LG,
    paddingTop: HEADER_CONFIG.PADDING_TOP,
    borderBottomWidth: 1,
    borderBottomColor: STYLES.COLORS.BORDER_GRAY
  },
  sideArea: {
    minWidth: 0,
    flexBasis: 0
  },
  titleContainer: {
    alignItems: 'center',
    justifyContent: 'center'
  },
  title: {
    fontSize: HEADER_CONFIG.TITLE_SIZE,
    fontWeight: STYLES.FONTS.WEIGHT.BOLD as any,
    color: STYLES.COLORS.BLACK
  },
  rightActions: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingLeft: STYLES.SPACING.XS
  },
  actionButton: {
    paddingVertical: STYLES.SPACING.XS,
    paddingHorizontal: STYLES.SPACING.XS
  },
  actionIcon: {
    width: HEADER_CONFIG.ICON_SIZE,
    height: HEADER_CONFIG.ICON_SIZE
  }
});
// #endregion

// #region 9. Exports
export default MessageHeaderArea;
// #endregion
