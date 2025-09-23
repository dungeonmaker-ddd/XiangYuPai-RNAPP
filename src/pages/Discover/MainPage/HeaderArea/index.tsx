/**
 * 发现页面头部区域组件
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
import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  Platform,
} from 'react-native';
import { HeaderAreaProps } from '../types';
import { COLORS, FONT_SIZES, PAGE_CONFIG } from '../constants';
// #endregion

// #region 2. Types & Schema
interface HeaderState {
  statusBarHeight: number;
}
// #endregion

// #region 3. Constants & Config
const CAMERA_ICON = '📷';
const HEADER_STYLES = {
  height: PAGE_CONFIG.HEADER_HEIGHT,
  paddingTop: PAGE_CONFIG.STATUS_BAR_HEIGHT,
} as const;
// #endregion

// #region 4. Utils & Helpers
const getStatusBarHeight = (): number => {
  return Platform.OS === 'ios' ? PAGE_CONFIG.STATUS_BAR_HEIGHT : StatusBar.currentHeight || 0;
};
// #endregion

// #region 5. State Management
const HeaderArea: React.FC<HeaderAreaProps> = ({
  onCameraPress,
  showLocationIcon = false,
  currentLocation = '',
}) => {
  const [state] = React.useState<HeaderState>({
    statusBarHeight: getStatusBarHeight(),
  });
// #endregion

// #region 6. Domain Logic
const handleCameraPress = React.useCallback(() => {
  onCameraPress();
}, [onCameraPress]);
// #endregion

// #region 7. UI Components & Rendering
  return (
    <View style={styles.container}>
      {/* 状态栏占位 */}
      <View style={[styles.statusBar, { height: state.statusBarHeight }]} />
      
      {/* 头部内容区域 */}
      <View style={styles.headerContent}>
        {/* 左侧区域 - 位置信息 */}
        <View style={styles.leftSection}>
          {showLocationIcon && (
            <View style={styles.locationContainer}>
              <Text style={styles.locationIcon}>📍</Text>
              <Text style={styles.locationText} numberOfLines={1}>
                {currentLocation || '定位中...'}
              </Text>
            </View>
          )}
        </View>
        
        {/* 中央区域 - 标题 */}
        <View style={styles.centerSection}>
          <Text style={styles.title}>发现</Text>
        </View>
        
        {/* 右侧区域 - 拍摄按钮 */}
        <View style={styles.rightSection}>
          <TouchableOpacity
            style={styles.cameraButton}
            onPress={handleCameraPress}
            activeOpacity={0.7}
          >
            <Text style={styles.cameraIcon}>{CAMERA_ICON}</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.BACKGROUND,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.BORDER_LIGHT,
  },
  statusBar: {
    backgroundColor: COLORS.BACKGROUND,
  },
  headerContent: {
    height: PAGE_CONFIG.HEADER_HEIGHT,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  leftSection: {
    flex: 1,
    justifyContent: 'flex-start',
  },
  centerSection: {
    flex: 1,
    alignItems: 'center',
  },
  rightSection: {
    flex: 1,
    alignItems: 'flex-end',
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    maxWidth: 120,
  },
  locationIcon: {
    fontSize: 12,
    marginRight: 4,
  },
  locationText: {
    fontSize: 12,
    color: COLORS.TEXT_TERTIARY,
    flex: 1,
  },
  title: {
    fontSize: FONT_SIZES.TAB_ACTIVE,
    fontWeight: 'bold',
    color: COLORS.TEXT_PRIMARY,
  },
  cameraButton: {
    width: 36,
    height: 36,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: COLORS.BORDER_LIGHT,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.BACKGROUND,
  },
  cameraIcon: {
    fontSize: 20,
  },
});
// #endregion

// #region 8. Exports
export default HeaderArea;
// #endregion
