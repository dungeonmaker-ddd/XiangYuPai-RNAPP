/**
 * 地区选择模块 - 定位推荐区域
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
import { View, Text, TouchableOpacity, ActivityIndicator, StyleSheet } from 'react-native';
import type { CurrentLocationInfo } from '../types';
import { COLORS, FONTS, SIZES, SPACING } from '../constants';
// #endregion

// #region 2. Types & Schema
interface LocationRecommendAreaProps {
  currentLocation: CurrentLocationInfo | null;
  loading: boolean;
  error: string | null;
  onCurrentLocationPress: () => void;
  onGetLocationPress: () => void;
}
// #endregion

// #region 3. Constants & Config
const SECTION_TITLE = '定位 / 最近访问';
const LOCATION_ICON = '📍';
const SUCCESS_ICON = '✓';
const PLACEHOLDER_TEXT = '点击获取当前位置';
// #endregion

// #region 4. Utils & Helpers
// 此组件不需要复杂的工具函数
// #endregion

// #region 5. State Management
// 此组件不包含内部状态管理
// #endregion

// #region 6. Domain Logic
// 业务逻辑通过props传入
// #endregion

// #region 7. UI Components & Rendering
const LocationRecommendArea: React.FC<LocationRecommendAreaProps> = ({
  currentLocation,
  loading,
  error,
  onCurrentLocationPress,
  onGetLocationPress,
}) => {
  const hasLocation = currentLocation && !error;
  
  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{SECTION_TITLE}</Text>
      
      <TouchableOpacity
        style={[styles.locationCard, hasLocation && styles.locationCardActive]}
        onPress={hasLocation ? onCurrentLocationPress : onGetLocationPress}
        activeOpacity={0.7}
      >
        <View style={styles.locationCardContent}>
          {/* 定位图标 */}
          <View style={styles.locationIcon}>
            <Text style={styles.locationIconText}>{LOCATION_ICON}</Text>
          </View>
          
          {/* 位置信息 */}
          <View style={styles.locationInfo}>
            {loading ? (
              <View style={styles.loadingContainer}>
                <ActivityIndicator size="small" color={COLORS.primary} />
                <Text style={styles.loadingText}>定位中...</Text>
              </View>
            ) : error ? (
              <Text style={styles.locationError}>{error}</Text>
            ) : currentLocation ? (
              <>
                <Text style={styles.locationName}>{currentLocation.city}</Text>
                {currentLocation.district && (
                  <Text style={styles.locationDistrict}>
                    {currentLocation.district}
                  </Text>
                )}
              </>
            ) : (
              <Text style={styles.locationPlaceholder}>{PLACEHOLDER_TEXT}</Text>
            )}
          </View>
          
          {/* 选择状态 */}
          {hasLocation && (
            <View style={styles.locationStatus}>
              <Text style={styles.locationStatusText}>{SUCCESS_ICON}</Text>
            </View>
          )}
        </View>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  section: {
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
  },
  sectionTitle: {
    fontSize: FONTS.size.md,
    fontWeight: '500',
    color: COLORS.textSecondary,
    marginBottom: SPACING.md,
  },
  
  // 定位卡片
  locationCard: {
    backgroundColor: COLORS.backgroundGray,
    borderRadius: SIZES.radiusMedium,
    padding: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  locationCardActive: {
    borderColor: COLORS.primary,
    backgroundColor: COLORS.selected,
  },
  locationCardContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  locationIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SPACING.md,
  },
  locationIconText: {
    fontSize: FONTS.size.md,
  },
  locationInfo: {
    flex: 1,
  },
  locationName: {
    fontSize: FONTS.size.md,
    fontWeight: '500',
    color: COLORS.textPrimary,
  },
  locationDistrict: {
    fontSize: FONTS.size.sm,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  locationError: {
    fontSize: FONTS.size.sm,
    color: COLORS.error,
  },
  locationPlaceholder: {
    fontSize: FONTS.size.md,
    color: COLORS.textLight,
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: FONTS.size.md,
    color: COLORS.textSecondary,
    marginLeft: SPACING.sm,
  },
  locationStatus: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: COLORS.success,
    justifyContent: 'center',
    alignItems: 'center',
  },
  locationStatusText: {
    fontSize: FONTS.size.xs,
    color: COLORS.textWhite,
  },
});
// #endregion

// #region 8. Exports
export default LocationRecommendArea;
export type { LocationRecommendAreaProps };
// #endregion
