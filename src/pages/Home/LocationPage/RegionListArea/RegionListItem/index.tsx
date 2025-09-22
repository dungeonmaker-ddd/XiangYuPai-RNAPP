/**
 * 地区选择模块 - 地区列表项
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
import type { RegionInfo } from '../../types';
import { COLORS, FONTS, SIZES, SPACING } from '../../constants';
// #endregion

// #region 2. Types & Schema
interface RegionListItemProps {
  region: RegionInfo;
  selected: boolean;
  onPress: (region: RegionInfo) => void;
}
// #endregion

// #region 3. Constants & Config
const SELECTED_ICON = '✓';
// #endregion

// #region 4. Utils & Helpers
// 此组件不需要复杂的工具函数
// #endregion

// #region 5. State Management
// 此组件不包含状态管理
// #endregion

// #region 6. Domain Logic
// 业务逻辑通过props传入
// #endregion

// #region 7. UI Components & Rendering
const RegionListItem: React.FC<RegionListItemProps> = ({ 
  region, 
  selected, 
  onPress 
}) => {
  return (
    <TouchableOpacity
      style={[styles.regionItem, selected && styles.regionItemSelected]}
      onPress={() => onPress(region)}
      activeOpacity={0.7}
    >
      <Text style={[styles.regionText, selected && styles.regionTextSelected]}>
        {region.name}
      </Text>
      
      {selected && (
        <Text style={styles.regionSelectedIcon}>{SELECTED_ICON}</Text>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  regionItem: {
    height: SIZES.cardHeight,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.lg,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.borderLight,
    backgroundColor: COLORS.background,
  },
  regionItemSelected: {
    backgroundColor: COLORS.selected,
  },
  regionText: {
    fontSize: FONTS.size.md,
    color: COLORS.textPrimary,
  },
  regionTextSelected: {
    color: COLORS.primary,
    fontWeight: '500',
  },
  regionSelectedIcon: {
    fontSize: FONTS.size.md,
    color: COLORS.primary,
    fontWeight: '500',
  },
});
// #endregion

// #region 8. Exports
export default RegionListItem;
export type { RegionListItemProps };
// #endregion
