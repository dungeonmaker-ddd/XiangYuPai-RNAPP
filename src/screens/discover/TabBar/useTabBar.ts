/**
 * TabBar 状态管理 Hook
 * 管理 Tab 栏的状态、动画和交互逻辑
 */

import { useCallback, useRef, useEffect, useState } from 'react';
import { Animated, Dimensions } from 'react-native';
import { TabBarProps, TabType, TabBarState, TabIndicatorState } from './types';
import { TAB_ANIMATION_CONFIG } from './constants';

export const useTabBar = (props: TabBarProps) => {
  const { tabs, activeTab, onTabPress } = props;
  
  // 屏幕尺寸状态
  const [screenWidth, setScreenWidth] = useState(Dimensions.get('window').width);
  
  // 动画引用
  const indicatorAnim = useRef(new Animated.Value(0)).current;
  const [isAnimating, setIsAnimating] = useState(false);
  
  // 计算 Tab 宽度
  const tabWidth = screenWidth / tabs.length;
  
  // 获取 Tab 索引
  const getTabIndex = useCallback((tabKey: TabType): number => {
    return tabs.findIndex(tab => tab.key === tabKey);
  }, [tabs]);
  
  // 更新指示器位置
  const updateIndicatorPosition = useCallback((tabKey: TabType) => {
    const index = getTabIndex(tabKey);
    const toValue = index * tabWidth;
    
    setIsAnimating(true);
    
    Animated.timing(indicatorAnim, {
      toValue,
      duration: TAB_ANIMATION_CONFIG.SWITCH_DURATION,
      useNativeDriver: TAB_ANIMATION_CONFIG.USE_NATIVE_DRIVER,
    }).start(() => {
      setIsAnimating(false);
    });
  }, [indicatorAnim, tabWidth, getTabIndex]);
  
  // 处理 Tab 点击
  const handleTabPress = useCallback((tabKey: TabType) => {
    if (tabKey !== activeTab && !isAnimating) {
      onTabPress(tabKey);
    }
  }, [activeTab, onTabPress, isAnimating]);
  
  // 监听 activeTab 变化，更新指示器位置
  useEffect(() => {
    updateIndicatorPosition(activeTab);
  }, [activeTab, updateIndicatorPosition]);
  
  // 监听屏幕尺寸变化
  useEffect(() => {
    const subscription = Dimensions.addEventListener('change', ({ window }) => {
      setScreenWidth(window.width);
    });
    
    return () => subscription?.remove();
  }, []);
  
  // Tab 栏状态
  const tabBarState: TabBarState = {
    screenWidth,
    tabWidth,
    indicatorPosition: getTabIndex(activeTab) * tabWidth,
  };
  
  // 指示器状态
  const indicatorState: TabIndicatorState = {
    animValue: indicatorAnim,
    isAnimating,
  };
  
  return {
    // 状态
    tabBarState,
    indicatorState,
    
    // 方法
    handleTabPress,
    getTabIndex,
    
    // 计算属性
    tabWidth,
    isAnimating,
  };
};
