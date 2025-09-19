/**
 * TabBar 主组件
 * 顶部标签切换组件，支持关注/热门/同城三个Tab
 */

import React, { memo, useCallback } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Animated,
} from 'react-native';

// 内部模块导入
import { TabBarProps, TabConfig, TabType } from './types';
import { TAB_BAR_TEST_IDS } from './constants';
import { useTabBar } from './useTabBar';
import { onTabBarPress } from './onTabBarPress';
import {
  formatTabItemStyle,
  formatTabTextStyle,
  formatIndicatorStyle,
  formatContainerStyle,
  formatTabContainerStyle,
  formatIndicatorContainerStyle,
  formatTabTitle,
  formatTestId,
} from './formatTabBarDisplay';

export const TabBar = memo<TabBarProps>(({ tabs, activeTab, onTabPress }) => {
  // 使用状态管理 Hook
  const {
    tabBarState,
    indicatorState,
    handleTabPress,
    tabWidth,
    isAnimating,
  } = useTabBar({ tabs, activeTab, onTabPress });

  // 处理 Tab 点击事件
  const handleTabItemPress = useCallback((tabKey: TabType) => {
    onTabBarPress(tabKey, activeTab, onTabPress, isAnimating);
  }, [activeTab, onTabPress, isAnimating]);

  // 渲染单个 Tab 项
  const renderTabItem = useCallback((tab: TabConfig, index: number) => {
    const isActive = tab.key === activeTab;
    
    const tabItemConfig = {
      tab,
      index,
      isActive,
      tabWidth,
      onPress: handleTabItemPress,
    };

    return (
      <TouchableOpacity
        key={tab.key}
        style={formatTabItemStyle(tabItemConfig)}
        onPress={() => handleTabItemPress(tab.key)}
        activeOpacity={0.7}
        testID={formatTestId(TAB_BAR_TEST_IDS.TAB_ITEM, tab.key)}
      >
        <Text style={formatTabTextStyle(isActive)}>
          {formatTabTitle(tab)}
        </Text>
      </TouchableOpacity>
    );
  }, [activeTab, tabWidth, handleTabItemPress]);

  return (
    <View style={formatContainerStyle()} testID={TAB_BAR_TEST_IDS.TAB_BAR}>
      {/* Tab 项容器 */}
      <View style={formatTabContainerStyle()}>
        {tabs.map(renderTabItem)}
      </View>
      
      {/* 底部指示器 */}
      <View style={formatIndicatorContainerStyle()}>
        <Animated.View
          style={formatIndicatorStyle(tabWidth, indicatorState.animValue)}
          testID={TAB_BAR_TEST_IDS.TAB_INDICATOR}
        />
      </View>
    </View>
  );
});

TabBar.displayName = 'TabBar';

// 导出组件和相关类型
export default TabBar;
export type { TabBarProps, TabConfig, TabType } from './types';
