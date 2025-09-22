/**
 * SearchTabsArea - 搜索分类标签区域组件
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
  TouchableOpacity,
  Text,
  StyleSheet,
} from 'react-native';

// 内部模块导入
import { COLORS, SPACING, FONTS, LAYOUT, TAB_CONFIG } from '../constants';
import type { TabType } from '../types';
import { processTabData } from './processData';
import { utilsTabLayout } from './utilsLayout';
// #endregion

// #region 2. Types & Schema
interface SearchTabsAreaProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
  resultCounts?: Record<TabType, number>;
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
 * SearchTabsArea 组件 - 搜索分类标签区域
 * 提供全部/用户/下单/话题的分类切换
 */
const SearchTabsArea: React.FC<SearchTabsAreaProps> = ({
  activeTab,
  onTabChange,
  resultCounts = {},
}) => {
  const tabs = processTabData();
  const { getTabStyle, formatCount } = utilsTabLayout();

  const renderTab = (tab: typeof tabs[0]) => {
    const isActive = activeTab === tab.key;
    const count = resultCounts[tab.key] || 0;
    const hasCount = count > 0;

    return (
      <TouchableOpacity
        key={tab.key}
        style={[
          styles.tabButton,
          getTabStyle(isActive),
        ]}
        onPress={() => onTabChange(tab.key)}
        activeOpacity={0.8}
      >
        <View style={styles.tabContent}>
          {/* 标签图标 */}
          <Text style={[
            styles.tabIcon,
            isActive && styles.tabIconActive,
          ]}>
            {tab.icon}
          </Text>
          
          {/* 标签文字 */}
          <Text style={[
            styles.tabText,
            isActive && styles.tabTextActive,
          ]}>
            {tab.title}
          </Text>
          
          {/* 结果数量 */}
          {hasCount && (
            <Text style={[
              styles.tabCount,
              isActive && styles.tabCountActive,
            ]}>
              {formatCount(count)}
            </Text>
          )}
        </View>
        
        {/* 选中指示器 */}
        {isActive && (
          <View style={styles.activeIndicator} />
        )}
      </TouchableOpacity>
    );
  };

  const renderTabSeparator = (index: number) => {
    if (index === tabs.length - 1) {
      return null;
    }

    return (
      <View
        key={`separator-${index}`}
        style={styles.tabSeparator}
      />
    );
  };

  return (
    <View style={styles.container}>
      {/* 标签列表 */}
      <View style={styles.tabList}>
        {tabs.map((tab, index) => (
          <React.Fragment key={tab.key}>
            {renderTab(tab)}
            {renderTabSeparator(index)}
          </React.Fragment>
        ))}
      </View>
      
      {/* 底部分割线 */}
      <View style={styles.bottomBorder} />
    </View>
  );
};
// #endregion

// #region 8. Styles
const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.white,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.borderLight,
  },
  tabList: {
    flexDirection: 'row',
    height: LAYOUT.TAB_BAR_HEIGHT,
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingHorizontal: SPACING.md,
  },
  tabButton: {
    flex: 1,
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    borderRadius: 16,
    marginHorizontal: SPACING.xs,
  },
  tabContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabIcon: {
    fontSize: FONTS.size.md,
    marginRight: SPACING.xs,
    color: COLORS.textSecondary,
  },
  tabIconActive: {
    color: COLORS.primary,
  },
  tabText: {
    fontSize: FONTS.size.md,
    fontWeight: FONTS.weight.medium,
    color: COLORS.textSecondary,
  },
  tabTextActive: {
    color: COLORS.primary,
    fontWeight: FONTS.weight.semiBold,
  },
  tabCount: {
    fontSize: FONTS.size.xs,
    fontWeight: FONTS.weight.medium,
    color: COLORS.textLight,
    marginLeft: SPACING.xs,
    backgroundColor: COLORS.gray200,
    paddingHorizontal: SPACING.xs,
    paddingVertical: 2,
    borderRadius: 8,
    minWidth: 16,
    textAlign: 'center',
  },
  tabCountActive: {
    color: COLORS.white,
    backgroundColor: COLORS.primary,
  },
  tabSeparator: {
    width: 1,
    height: 20,
    backgroundColor: COLORS.borderLight,
    marginHorizontal: SPACING.xs,
  },
  activeIndicator: {
    position: 'absolute',
    bottom: 0,
    left: '20%',
    right: '20%',
    height: 2,
    backgroundColor: COLORS.primary,
    borderRadius: 1,
  },
  bottomBorder: {
    height: 1,
    backgroundColor: COLORS.borderLight,
  },
});
// #endregion

// #region 9. Exports
export default SearchTabsArea;
export type { SearchTabsAreaProps };
// #endregion
