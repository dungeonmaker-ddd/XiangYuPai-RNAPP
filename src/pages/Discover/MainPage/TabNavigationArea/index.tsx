/**
 * Tab导航区域组件
 * 实现热门/关注/同城三标签切换系统
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
  StyleSheet,
  Animated,
  Dimensions,
} from 'react-native';
import { TabNavigationProps, DiscoverTabType } from '../types';
import { COLORS, FONT_SIZES, TAB_CONFIG, TAB_LABELS, ANIMATION_DURATION } from '../constants';
// #endregion

// #region 2. Types & Schema
interface TabItem {
  key: DiscoverTabType;
  title: string;
  icon: string;
  color: string;
}

interface TabState {
  indicatorPosition: Animated.Value;
  screenWidth: number;
}
// #endregion

// #region 3. Constants & Config
const SCREEN_WIDTH = Dimensions.get('window').width;
const TAB_WIDTH = SCREEN_WIDTH / 3;

const TAB_ITEMS: TabItem[] = [
  {
    key: DiscoverTabType.FOLLOW,
    title: TAB_LABELS[DiscoverTabType.FOLLOW].title,
    icon: TAB_LABELS[DiscoverTabType.FOLLOW].icon,
    color: TAB_LABELS[DiscoverTabType.FOLLOW].color,
  },
  {
    key: DiscoverTabType.HOT,
    title: TAB_LABELS[DiscoverTabType.HOT].title,
    icon: TAB_LABELS[DiscoverTabType.HOT].icon,
    color: TAB_LABELS[DiscoverTabType.HOT].color,
  },
  {
    key: DiscoverTabType.LOCAL,
    title: TAB_LABELS[DiscoverTabType.LOCAL].title,
    icon: TAB_LABELS[DiscoverTabType.LOCAL].icon,
    color: TAB_LABELS[DiscoverTabType.LOCAL].color,
  },
];
// #endregion

// #region 4. Utils & Helpers
const getTabIndex = (tabType: DiscoverTabType): number => {
  return TAB_ITEMS.findIndex(item => item.key === tabType);
};

const getIndicatorPosition = (index: number): number => {
  return index * TAB_WIDTH + (TAB_WIDTH - TAB_CONFIG.TAB_INDICATOR_WIDTH) / 2;
};
// #endregion

// #region 5. State Management
const TabNavigationArea: React.FC<TabNavigationProps> = ({
  activeTab,
  onTabChange,
  hasNewContent = false,
}) => {
  const [state] = React.useState<TabState>(() => ({
    indicatorPosition: new Animated.Value(getIndicatorPosition(getTabIndex(activeTab))),
    screenWidth: SCREEN_WIDTH,
  }));

  // 监听activeTab变化，更新指示器位置
  React.useEffect(() => {
    const targetIndex = getTabIndex(activeTab);
    const targetPosition = getIndicatorPosition(targetIndex);
    
    Animated.timing(state.indicatorPosition, {
      toValue: targetPosition,
      duration: ANIMATION_DURATION.TAB_SWITCH,
      useNativeDriver: false,
    }).start();
  }, [activeTab, state.indicatorPosition]);
// #endregion

// #region 6. Domain Logic
const handleTabPress = React.useCallback((tabType: DiscoverTabType) => {
  if (tabType !== activeTab) {
    onTabChange(tabType);
  }
}, [activeTab, onTabChange]);

const renderTab = React.useCallback((item: TabItem, index: number) => {
  const isActive = item.key === activeTab;
  const tabStyle = [
    styles.tab,
    { width: TAB_WIDTH },
  ];
  
  const textStyle = [
    styles.tabText,
    isActive ? styles.tabTextActive : styles.tabTextInactive,
    isActive && { color: item.color }
  ];

  return (
    <TouchableOpacity
      key={item.key}
      style={tabStyle}
      onPress={() => handleTabPress(item.key)}
      activeOpacity={0.7}
    >
      {/* Tab内容 */}
      <View style={styles.tabContent}>
        <Text style={textStyle}>{item.title}</Text>
        
        {/* 新内容提示点 - 仅关注Tab显示 */}
        {item.key === DiscoverTabType.FOLLOW && hasNewContent && (
          <View style={styles.newContentDot} />
        )}
      </View>
    </TouchableOpacity>
  );
}, [activeTab, hasNewContent, handleTabPress]);
// #endregion

// #region 7. UI Components & Rendering
  return (
    <View style={styles.container}>
      {/* Tab标签行 */}
      <View style={styles.tabsContainer}>
        {TAB_ITEMS.map(renderTab)}
      </View>
      
      {/* 指示器 */}
      <Animated.View
        style={[
          styles.indicator,
          {
            left: state.indicatorPosition,
            backgroundColor: TAB_LABELS[activeTab].color,
          }
        ]}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.BACKGROUND,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.BORDER_LIGHT,
  },
  tabsContainer: {
    flexDirection: 'row',
    height: TAB_CONFIG.TAB_HEIGHT,
  },
  tab: {
    justifyContent: 'center',
    alignItems: 'center',
    height: '100%',
  },
  tabContent: {
    position: 'relative',
    alignItems: 'center',
  },
  tabText: {
    fontSize: FONT_SIZES.TAB_INACTIVE,
    fontWeight: '500',
  },
  tabTextActive: {
    fontSize: FONT_SIZES.TAB_ACTIVE,
    fontWeight: 'bold',
    color: COLORS.TEXT_PRIMARY,
  },
  tabTextInactive: {
    fontSize: FONT_SIZES.TAB_INACTIVE,
    color: COLORS.TEXT_SECONDARY,
  },
  indicator: {
    position: 'absolute',
    bottom: 0,
    width: TAB_CONFIG.TAB_INDICATOR_WIDTH,
    height: TAB_CONFIG.TAB_INDICATOR_HEIGHT,
    borderRadius: TAB_CONFIG.TAB_INDICATOR_HEIGHT / 2,
  },
  newContentDot: {
    position: 'absolute',
    top: -8,
    right: -12,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: COLORS.NEW_CONTENT,
  },
});
// #endregion

// #region 8. Exports
export default TabNavigationArea;
// #endregion
