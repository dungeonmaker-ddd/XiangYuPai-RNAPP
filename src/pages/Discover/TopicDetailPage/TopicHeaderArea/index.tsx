/**
 * 话题头部区域组件
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

// #region 1. Imports
import React, { memo } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  Platform,
} from 'react-native';

import { TopicHeaderAreaProps } from '../types';
import { TOPIC_DETAIL_CONSTANTS } from '../constants';
// #endregion

// #region 2. Types & Schema
interface HeaderButtonProps {
  onPress: () => void;
  children: React.ReactNode;
  style?: any;
}
// #endregion

// #region 3. Constants & Config
const HEADER_HEIGHT = TOPIC_DETAIL_CONSTANTS.HEADER_HEIGHT;
const STATUS_BAR_HEIGHT = Platform.OS === 'ios' 
  ? TOPIC_DETAIL_CONSTANTS.STATUS_BAR_HEIGHT 
  : TOPIC_DETAIL_CONSTANTS.ANDROID_STATUS_BAR_HEIGHT;
// #endregion

// #region 4. Utils & Helpers
const formatTopicTitle = (title: string): string => {
  return title.length > 20 ? `${title.substring(0, 20)}...` : title;
};
// #endregion

// #region 5. State Management
// 无需状态管理
// #endregion

// #region 6. Domain Logic
// 头部按钮组件
const HeaderButton: React.FC<HeaderButtonProps> = ({ onPress, children, style }) => (
  <TouchableOpacity
    onPress={onPress}
    style={[styles.headerButton, style]}
    activeOpacity={0.7}
    hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
  >
    {children}
  </TouchableOpacity>
);
// #endregion

// #region 7. UI Components & Rendering
const TopicHeaderArea: React.FC<TopicHeaderAreaProps> = ({
  title,
  onBackPress,
  onShare,
  showBackground = true,
  backgroundColor = TOPIC_DETAIL_CONSTANTS.CARD_BACKGROUND,
}) => {
  return (
    <>
      {/* 状态栏 */}
      <StatusBar
        barStyle="dark-content"
        backgroundColor={backgroundColor}
        translucent={false}
      />
      
      {/* 头部容器 */}
      <View style={[
        styles.container,
        showBackground && { backgroundColor }
      ]}>
        {/* 返回按钮 */}
        <HeaderButton onPress={onBackPress} style={styles.backButton}>
          <Text style={styles.backIcon}>‹</Text>
        </HeaderButton>
        
        {/* 话题标题 */}
        <View style={styles.titleContainer}>
          <Text style={styles.title} numberOfLines={1}>
            {formatTopicTitle(title)}
          </Text>
        </View>
        
        {/* 分享按钮 */}
        {onShare && (
          <HeaderButton onPress={onShare} style={styles.shareButton}>
            <Text style={styles.shareIcon}>⤴</Text>
          </HeaderButton>
        )}
        
        {/* 占位符（如果没有分享按钮） */}
        {!onShare && <View style={styles.placeholder} />}
      </View>
    </>
  );
};
// #endregion

// #region 8. Styles
const styles = StyleSheet.create({
  container: {
    height: HEADER_HEIGHT,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: TOPIC_DETAIL_CONSTANTS.SECTION_PADDING,
    borderBottomWidth: 1,
    borderBottomColor: TOPIC_DETAIL_CONSTANTS.BORDER_LIGHT,
    shadowColor: TOPIC_DETAIL_CONSTANTS.SHADOW_COLOR,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: TOPIC_DETAIL_CONSTANTS.SHADOW_OPACITY,
    shadowRadius: 4,
    elevation: TOPIC_DETAIL_CONSTANTS.SHADOW_ELEVATION,
  },
  headerButton: {
    width: TOPIC_DETAIL_CONSTANTS.MIN_TOUCH_AREA,
    height: TOPIC_DETAIL_CONSTANTS.MIN_TOUCH_AREA,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: TOPIC_DETAIL_CONSTANTS.SMALL_BORDER_RADIUS,
  },
  backButton: {
    marginRight: TOPIC_DETAIL_CONSTANTS.SMALL_SPACING,
  },
  backIcon: {
    fontSize: TOPIC_DETAIL_CONSTANTS.FONT.HUGE,
    color: TOPIC_DETAIL_CONSTANTS.TEXT_PRIMARY,
    fontWeight: TOPIC_DETAIL_CONSTANTS.FONT_WEIGHT.BOLD,
  },
  titleContainer: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: TOPIC_DETAIL_CONSTANTS.ITEM_SPACING,
  },
  title: {
    fontSize: TOPIC_DETAIL_CONSTANTS.FONT.LARGE,
    fontWeight: TOPIC_DETAIL_CONSTANTS.FONT_WEIGHT.SEMIBOLD,
    color: TOPIC_DETAIL_CONSTANTS.TEXT_PRIMARY,
    textAlign: 'center',
  },
  shareButton: {
    marginLeft: TOPIC_DETAIL_CONSTANTS.SMALL_SPACING,
  },
  shareIcon: {
    fontSize: TOPIC_DETAIL_CONSTANTS.FONT.LARGE,
    color: TOPIC_DETAIL_CONSTANTS.TEXT_SECONDARY,
    fontWeight: TOPIC_DETAIL_CONSTANTS.FONT_WEIGHT.MEDIUM,
  },
  placeholder: {
    width: TOPIC_DETAIL_CONSTANTS.MIN_TOUCH_AREA,
    height: TOPIC_DETAIL_CONSTANTS.MIN_TOUCH_AREA,
  },
});
// #endregion

// #region 9. Exports
export default memo(TopicHeaderArea);
// #endregion
