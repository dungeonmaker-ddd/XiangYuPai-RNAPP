/**
 * 🏷️ 搜索分类标签组件
 * 
 * 功能特性：
 * - 4个搜索分类：全部/用户/下单/话题
 * - 标签切换动画
 * - 结果数量显示
 * - 选中状态指示
 */

import React from 'react';
import {
  View,
  TouchableOpacity,
  Text,
  StyleSheet,
  Animated,
} from 'react-native';

import { SearchTabsProps, TabType } from '../types';
import { COLORS, SPACING, FONTS, LAYOUT, TAB_CONFIG, TEST_IDS } from '../constants';
import { formatCount } from '../utils';

const SearchTabs: React.FC<SearchTabsProps> = ({
  activeTab,
  onTabChange,
  resultCounts = {},
}) => {
  // ══════════════════════════════════════════════════════════════
  // 1. 标签数据
  // ══════════════════════════════════════════════════════════════
  
  const tabs = Object.values(TAB_CONFIG);

  // ══════════════════════════════════════════════════════════════
  // 2. 渲染函数
  // ══════════════════════════════════════════════════════════════
  
  const renderTab = (tab: typeof TAB_CONFIG[TabType]) => {
    const isActive = activeTab === tab.key;
    const count = resultCounts[tab.key] || 0;
    const hasCount = count > 0;

    return (
      <TouchableOpacity
        key={tab.key}
        style={[
          styles.tabButton,
          isActive && styles.tabButtonActive,
        ]}
        onPress={() => onTabChange(tab.key)}
        activeOpacity={0.8}
        testID={`${TEST_IDS.TAB_ALL.replace('all', tab.key)}`}
      >
        {/* 标签内容容器 */}
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

  // ══════════════════════════════════════════════════════════════
  // 3. 主渲染
  // ══════════════════════════════════════════════════════════════
  
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

// ══════════════════════════════════════════════════════════════
// 4. 样式定义
// ══════════════════════════════════════════════════════════════

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
  
  tabButtonActive: {
    backgroundColor: COLORS.primaryLight + '20', // 20% 透明度
  },
  
  tabContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  
  tabIcon: {
    fontSize: FONTS.size.md,
    marginRight: SPACING.xs,
  },
  
  tabIconActive: {
    // 选中状态图标样式
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

export default SearchTabs;
