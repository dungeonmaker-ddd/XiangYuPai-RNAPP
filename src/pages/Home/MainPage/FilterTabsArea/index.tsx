/**
 * FilterTabsArea - 筛选标签栏区域组件
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
import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';

// 内部模块导入
import { COLORS } from '../constants';
import { RegionSelector } from './RegionSelector';
import { FilterSelector } from './FilterSelector';
import { processTabData } from './processData';
import { utilsTabLayout } from './utilsLayout';
// #endregion

// #region 2. Types & Schema
interface FilterTabsAreaProps {
  activeTab: string;
  onTabPress: (tabId: string) => void;
  activeRegion?: string;
  onRegionPress?: (region: string) => void;
}
// #endregion

// #region 3. Constants & Config
// 常量已移至 ./processData.ts
// #endregion

// #region 4. Utils & Helpers
// 工具函数已移至 ./utilsLayout.ts
// #endregion

// #region 5. State Management
// 状态管理逻辑
// #endregion

// #region 6. Domain Logic
// 业务逻辑已移至 ./processData.ts
// #endregion

// #region 7. UI Components & Rendering
/**
 * FilterTabsArea 组件 - 筛选标签栏区域
 * 包含标签切换和筛选功能
 */
const FilterTabsArea: React.FC<FilterTabsAreaProps> = ({ 
  activeTab, 
  onTabPress, 
  activeRegion = '全部', 
  onRegionPress 
}) => {
  const [showRegionModal, setShowRegionModal] = useState(false);
  const [showFilterModal, setShowFilterModal] = useState(false);

  const filterTabs = processTabData();
  const { getContainerStyle, getTabStyle } = utilsTabLayout();

  const renderFilterTab = (tab: typeof filterTabs[0]) => (
    <TouchableOpacity
      key={tab.id}
      style={[
        styles.tabButton,
        getTabStyle(activeTab === tab.id),
      ]}
      onPress={() => onTabPress(tab.id)}
    >
      <Text style={[
        styles.tabText,
        activeTab === tab.id && styles.tabTextActive
      ]}>
        {tab.label}
      </Text>
    </TouchableOpacity>
  );

  return (
    <View style={[styles.container, getContainerStyle()]}>
      {/* 筛选标签行 */}
      <View style={styles.tabsRow}>
        {filterTabs.map(renderFilterTab)}
      </View>
      
      {/* 筛选按钮行 */}
      <View style={styles.filtersRow}>
        <RegionSelector
          activeRegion={activeRegion}
          onRegionPress={onRegionPress}
          showModal={showRegionModal}
          setShowModal={setShowRegionModal}
        />
        
        <FilterSelector
          showModal={showFilterModal}
          setShowModal={setShowFilterModal}
        />
      </View>
    </View>
  );
};
// #endregion

// #region 8. Styles
const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.gray50,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.gray100,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  tabsRow: {
    flexDirection: 'row',
    gap: 10,
  },
  tabButton: {
    borderRadius: 20,
    width: 65,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.gray100,
    backgroundColor: 'transparent',
  },
  tabText: {
    fontSize: 14,
    color: COLORS.gray500,
  },
  tabTextActive: {
    color: COLORS.white,
    fontWeight: '600',
  },
  filtersRow: {
    flexDirection: 'row',
    gap: 10,
  },
});
// #endregion

// #region 9. Exports
export default FilterTabsArea;
export type { FilterTabsAreaProps };
// #endregion
