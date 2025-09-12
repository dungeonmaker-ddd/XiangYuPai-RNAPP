/**
 * 发现页面 - 标签导航组件
 * 实现三维内容发现的标签切换功能
 */

import React, { useRef, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Animated,
  Dimensions,
  Platform
} from 'react-native';
import { FilterTabsProps, TabType } from './types';
import { 
  COLORS, 
  FONTS, 
  SPACING, 
  ANIMATION_CONFIG,
  TEST_IDS,
  ACCESSIBILITY_LABELS 
} from './constants';

const { width: screenWidth } = Dimensions.get('window');

// 标签配置
const TABS = [
  { key: TabType.FOLLOWING, title: '关注', testID: TEST_IDS.TAB_FOLLOWING },
  { key: TabType.TRENDING, title: '热门', testID: TEST_IDS.TAB_TRENDING },
  { key: TabType.NEARBY, title: '同城', testID: TEST_IDS.TAB_NEARBY }
];

const FilterTabs: React.FC<FilterTabsProps> = ({
  activeTab,
  onTabChange,
  tabs = TABS
}) => {
  // 动画引用
  const indicatorPosition = useRef(new Animated.Value(0)).current;
  const activeTabIndex = tabs.findIndex(tab => tab.key === activeTab);
  
  // 计算标签和指示器尺寸
  const tabWidth = (screenWidth - SPACING.LG * 2) / tabs.length;
  const indicatorWidth = 24; // 指示器宽度
  const indicatorOffset = tabWidth * activeTabIndex + (tabWidth - indicatorWidth) / 2;

  // 标签切换动画
  useEffect(() => {
    Animated.timing(indicatorPosition, {
      toValue: indicatorOffset,
      duration: ANIMATION_CONFIG.TAB_INDICATOR_DURATION,
      useNativeDriver: true
    }).start();
  }, [activeTab, indicatorOffset]);

  // 处理标签点击
  const handleTabPress = (tab: TabType) => {
    if (tab !== activeTab) {
      // 触觉反馈
      if (Platform.OS === 'ios') {
        // 可以添加 Haptics 反馈
      }
      onTabChange(tab);
    }
  };

  // 渲染单个标签
  const renderTab = (tab: typeof TABS[0], index: number) => {
    const isActive = tab.key === activeTab;
    
    return (
      <TouchableOpacity
        key={tab.key}
        style={[styles.tabButton, { width: tabWidth }]}
        onPress={() => handleTabPress(tab.key)}
        testID={tab.testID}
        accessibilityLabel={ACCESSIBILITY_LABELS.TAB_FOLLOWING}
        accessibilityRole="tab"
        accessibilityState={{ selected: isActive }}
      >
        <View style={styles.tabContent}>
          <Text style={[
            styles.tabText,
            isActive && styles.tabTextActive
          ]}>
            {tab.title}
          </Text>
          
          {/* 可选的角标 */}
          {tabs[index]?.badge && tabs[index].badge > 0 && (
            <View style={styles.badge}>
              <Text style={styles.badgeText}>
                {tabs[index].badge > 99 ? '99+' : tabs[index].badge}
              </Text>
            </View>
          )}
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      {/* 标签容器 */}
      <View style={styles.tabContainer}>
        {tabs.map(renderTab)}
      </View>
      
      {/* 底部指示器 */}
      <View style={styles.indicatorContainer}>
        <Animated.View
          style={[
            styles.indicator,
            {
              width: indicatorWidth,
              transform: [{ translateX: indicatorPosition }]
            }
          ]}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.WHITE,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.BORDER,
    ...Platform.select({
      ios: {
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 4
      },
      android: {
        elevation: 2
      }
    })
  },
  
  tabContainer: {
    flexDirection: 'row',
    paddingHorizontal: SPACING.LG,
    paddingVertical: SPACING.SM
  },
  
  tabButton: {
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: SPACING.SM
  },
  
  tabContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center'
  },
  
  tabText: {
    fontSize: FONTS.SIZE_16,
    fontWeight: FONTS.WEIGHT_REGULAR,
    color: COLORS.TAB_INACTIVE,
    lineHeight: FONTS.SIZE_16 * FONTS.LINE_HEIGHT_1_2
  },
  
  tabTextActive: {
    fontWeight: FONTS.WEIGHT_BOLD,
    color: COLORS.TAB_ACTIVE
  },
  
  badge: {
    position: 'absolute',
    top: -8,
    right: -12,
    backgroundColor: COLORS.ERROR,
    borderRadius: 8,
    minWidth: 16,
    height: 16,
    paddingHorizontal: 4,
    justifyContent: 'center',
    alignItems: 'center'
  },
  
  badgeText: {
    fontSize: FONTS.SIZE_10,
    fontWeight: FONTS.WEIGHT_MEDIUM,
    color: COLORS.WHITE,
    lineHeight: FONTS.SIZE_10 * FONTS.LINE_HEIGHT_1_2
  },
  
  indicatorContainer: {
    height: 2,
    backgroundColor: COLORS.SEPARATOR,
    position: 'relative'
  },
  
  indicator: {
    position: 'absolute',
    bottom: 0,
    height: 2,
    backgroundColor: COLORS.TAB_INDICATOR,
    borderRadius: 1
  }
});

export default FilterTabs;
