/**
 * HeaderArea - 顶部导航区域组件
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
  Image,
  StyleSheet,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

// 内部模块导入
import { COLORS } from '../constants';
import type { LocationInfo } from '../types';
// #endregion

// #region 2. Types & Schema
interface HeaderAreaProps {
  location: LocationInfo;
  onLocationPress: () => void;
  onSearch: (query: string) => void;
  onSearchPress?: () => void;
}
// #endregion

// #region 3. Constants & Config
// 组件特定常量
// #endregion

// #region 4. Utils & Helpers
// 本地工具函数
// #endregion

// #region 5. State Management
// 状态管理逻辑
// #endregion

// #region 6. Domain Logic
// 业务逻辑处理
// #endregion

// #region 7. UI Components & Rendering
/**
 * HeaderArea 组件 - 顶部导航区域
 * 包含位置显示和搜索功能
 */
const HeaderArea: React.FC<HeaderAreaProps> = ({ 
  location, 
  onLocationPress, 
  onSearch, 
  onSearchPress 
}) => {
  const safeAreaInsets = useSafeAreaInsets();

  return (
    <View style={[
      styles.container, 
      { paddingTop: safeAreaInsets.top }
    ]}>
      <View style={styles.contentRow}>
        {/* 位置显示组件 */}
        <TouchableOpacity 
          style={styles.locationButton} 
          onPress={onLocationPress}
        >
          <Text style={styles.locationIcon}>📍</Text>
          <Text style={styles.locationText}>{location.city}</Text>
        </TouchableOpacity>

        {/* 搜索框组件 */}
        <TouchableOpacity 
          style={styles.searchContainer}
          onPress={onSearchPress}
          activeOpacity={0.8}
        >
          <Text style={styles.searchIcon}>🔍</Text>
          <Text style={styles.searchPlaceholder}>
            搜索词
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};
// #endregion

// #region 8. Styles
const styles = StyleSheet.create({
  container: {
    backgroundColor: 'transparent',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  contentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  locationButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  locationIcon: {
    width: 22,
    height: 22,
  },
  locationText: {
    color: COLORS.white,
    fontSize: 14,
    fontWeight: '500',
  },
  searchContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderRadius: 19.78,
    borderWidth: 0.58,
    borderColor: '#FFFFFF',
    paddingHorizontal: 16,
    height: 30,
    gap: 8,
  },
  searchIcon: {
    width: 17.45,
    height: 17.45,
  },
  searchPlaceholder: {
    flex: 1,
    color: COLORS.white,
    fontFamily: 'PingFang SC',
    fontSize: 14,
    opacity: 0.8,
  },
});
// #endregion

// #region 9. Exports
export default HeaderArea;
export type { HeaderAreaProps };
// #endregion
