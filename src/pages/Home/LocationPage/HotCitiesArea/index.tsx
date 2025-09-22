/**
 * 地区选择模块 - 热门城市区域
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
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import type { RegionInfo } from '../types';
import { COLORS, FONTS, SIZES, SPACING } from '../constants';
// #endregion

// #region 2. Types & Schema
interface HotCitiesAreaProps {
  cities: RegionInfo[];
  selectedLocation: RegionInfo | null;
  onCityPress: (city: RegionInfo) => void;
}
// #endregion

// #region 3. Constants & Config
const SECTION_TITLE = '热门城市';
const CITIES_PER_ROW = 4;
// #endregion

// #region 4. Utils & Helpers
// 计算城市卡片宽度
const calculateCityCardWidth = (): number => {
  const totalPadding = SPACING.lg * 2; // 左右边距
  const gapSpace = SPACING.sm * (CITIES_PER_ROW - 1); // 城市间隙
  const availableWidth = SIZES.screenWidth - totalPadding - gapSpace;
  return availableWidth / CITIES_PER_ROW;
};
// #endregion

// #region 5. State Management
// 此组件不包含内部状态管理
// #endregion

// #region 6. Domain Logic
// 业务逻辑通过props传入
// #endregion

// #region 7. UI Components & Rendering
const HotCitiesArea: React.FC<HotCitiesAreaProps> = ({
  cities,
  selectedLocation,
  onCityPress,
}) => {
  const cityCardWidth = calculateCityCardWidth();

  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{SECTION_TITLE}</Text>
      
      <View style={styles.hotCitiesGrid}>
        {cities.map((city) => {
          const isSelected = selectedLocation?.code === city.code;
          
          return (
            <TouchableOpacity
              key={city.code}
              style={[
                styles.hotCityCard,
                { width: cityCardWidth },
                isSelected && styles.hotCityCardSelected,
              ]}
              onPress={() => onCityPress(city)}
              activeOpacity={0.7}
            >
              <Text
                style={[
                  styles.hotCityText,
                  isSelected && styles.hotCityTextSelected,
                ]}
                numberOfLines={1}
                ellipsizeMode="tail"
              >
                {city.name}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
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
  
  // 热门城市网格
  hotCitiesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SPACING.sm,
  },
  hotCityCard: {
    height: SIZES.hotCityCardHeight,
    backgroundColor: COLORS.backgroundGray,
    borderRadius: SIZES.radiusSmall,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.border,
    paddingHorizontal: SPACING.xs,
  },
  hotCityCardSelected: {
    backgroundColor: COLORS.selected,
    borderColor: COLORS.primary,
  },
  hotCityText: {
    fontSize: FONTS.size.sm,
    color: COLORS.textPrimary,
    textAlign: 'center',
  },
  hotCityTextSelected: {
    color: COLORS.primary,
    fontWeight: '500',
  },
});
// #endregion

// #region 8. Exports
export default HotCitiesArea;
export type { HotCitiesAreaProps };
// #endregion
