/**
 * Tab栏组件
 * 顶部标签切换组件，支持关注/热门/同城三个Tab
 */

import React, { memo, useCallback, useRef, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Animated,
  Dimensions,
} from 'react-native';
import { TabBarProps, TabType } from '../types';
import { COLORS, TYPOGRAPHY, LAYOUT_CONSTANTS, ANIMATION_CONFIG, TEST_IDS } from '../constants';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export const TabBar = memo<TabBarProps>(({ tabs, activeTab, onTabPress }) => {
  const indicatorAnim = useRef(new Animated.Value(0)).current;
  const tabWidth = SCREEN_WIDTH / tabs.length;

  // 获取Tab索引
  const getTabIndex = useCallback((tabKey: TabType): number => {
    return tabs.findIndex(tab => tab.key === tabKey);
  }, [tabs]);

  // 更新指示器位置
  const updateIndicatorPosition = useCallback((tabKey: TabType) => {
    const index = getTabIndex(tabKey);
    const toValue = index * tabWidth;
    
    Animated.timing(indicatorAnim, {
      toValue,
      duration: ANIMATION_CONFIG.TAB_SWITCH_DURATION,
      useNativeDriver: true,
    }).start();
  }, [indicatorAnim, tabWidth, getTabIndex]);

  // 监听activeTab变化，更新指示器位置
  useEffect(() => {
    updateIndicatorPosition(activeTab);
  }, [activeTab, updateIndicatorPosition]);

  // 处理Tab点击
  const handleTabPress = useCallback((tabKey: TabType) => {
    if (tabKey !== activeTab) {
      onTabPress(tabKey);
    }
  }, [activeTab, onTabPress]);

  // 渲染单个Tab
  const renderTab = useCallback((tab: { key: TabType; title: string }, index: number) => {
    const isActive = tab.key === activeTab;
    
    return (
      <TouchableOpacity
        key={tab.key}
        style={[styles.tabItem, { width: tabWidth }]}
        onPress={() => handleTabPress(tab.key)}
        activeOpacity={0.7}
        testID={`${TEST_IDS.TAB_BAR}_${tab.key}`}
      >
        <Text style={[
          styles.tabText,
          isActive ? styles.activeTabText : styles.inactiveTabText
        ]}>
          {tab.title}
        </Text>
      </TouchableOpacity>
    );
  }, [activeTab, tabWidth, handleTabPress]);

  return (
    <View style={styles.container} testID={TEST_IDS.TAB_BAR}>
      {/* Tab项容器 */}
      <View style={styles.tabContainer}>
        {tabs.map(renderTab)}
      </View>
      
      {/* 底部指示器 */}
      <View style={styles.indicatorContainer}>
        <Animated.View
          style={[
            styles.indicator,
            {
              width: tabWidth * 0.3, // 指示器宽度为Tab宽度的30%
              transform: [
                {
                  translateX: Animated.add(
                    indicatorAnim,
                    new Animated.Value(tabWidth * 0.35) // 居中对齐
                  ),
                },
              ],
            },
          ]}
        />
      </View>
    </View>
  );
});

TabBar.displayName = 'TabBar';

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.BACKGROUND,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.BORDER_LIGHT,
    paddingTop: 44,
  },
  
  tabContainer: {
    flexDirection: 'row',
    height: LAYOUT_CONSTANTS.TAB_BAR_HEIGHT,
    alignItems: 'center',
  },
  
  tabItem: {
    justifyContent: 'center',
    alignItems: 'center',
    height: '100%',
  },
  
  tabText: {
    ...TYPOGRAPHY.BODY_MEDIUM,
    fontWeight: '500',
  },
  
  activeTabText: {
    color: COLORS.TEXT_PRIMARY,
    fontWeight: 'bold',
    fontSize: 18,
  },
  
  inactiveTabText: {
    color: COLORS.TEXT_SECONDARY,
    fontSize: 16,
  },
  
  indicatorContainer: {
    height: 2,
    backgroundColor: COLORS.TRANSPARENT,
    position: 'relative',
  },
  
  indicator: {
    height: 2,
    backgroundColor: COLORS.PRIMARY,
    borderRadius: 1,
    position: 'absolute',
    bottom: 0,
  },
});
