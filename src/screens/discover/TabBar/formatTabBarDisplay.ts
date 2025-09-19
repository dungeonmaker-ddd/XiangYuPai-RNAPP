/**
 * TabBar 显示格式化工具
 * 处理 Tab 栏的显示格式化和样式计算
 */

import { ViewStyle, TextStyle, Animated } from 'react-native';
import { TabType, TabConfig, TabItemConfig } from './types';
import { TAB_BAR_CONSTANTS, TAB_BAR_COLORS, TAB_BAR_TYPOGRAPHY } from './constants';

// 格式化 Tab 项样式
export const formatTabItemStyle = (config: TabItemConfig): ViewStyle => {
  const { tabWidth, isActive } = config;
  
  return {
    justifyContent: 'center',
    alignItems: 'center',
    height: TAB_BAR_CONSTANTS.TAB_BAR_HEIGHT,
    width: tabWidth,
  };
};

// 格式化 Tab 文本样式
export const formatTabTextStyle = (isActive: boolean): TextStyle => {
  return {
    ...TAB_BAR_TYPOGRAPHY.BODY_MEDIUM,
    fontWeight: isActive 
      ? TAB_BAR_TYPOGRAPHY.ACTIVE_FONT_WEIGHT 
      : TAB_BAR_TYPOGRAPHY.INACTIVE_FONT_WEIGHT,
    fontSize: isActive 
      ? TAB_BAR_TYPOGRAPHY.ACTIVE_FONT_SIZE 
      : TAB_BAR_TYPOGRAPHY.INACTIVE_FONT_SIZE,
    color: isActive 
      ? TAB_BAR_COLORS.TEXT_PRIMARY 
      : TAB_BAR_COLORS.TEXT_SECONDARY,
  };
};

// 格式化指示器样式
export const formatIndicatorStyle = (
  tabWidth: number,
  indicatorAnim: Animated.Value
): ViewStyle => {
  const indicatorWidth = tabWidth * TAB_BAR_CONSTANTS.INDICATOR_WIDTH_RATIO;
  const offsetValue = tabWidth * TAB_BAR_CONSTANTS.INDICATOR_OFFSET_RATIO;
  
  return {
    height: TAB_BAR_CONSTANTS.INDICATOR_HEIGHT,
    width: indicatorWidth,
    backgroundColor: TAB_BAR_COLORS.PRIMARY,
    borderRadius: TAB_BAR_CONSTANTS.INDICATOR_BORDER_RADIUS,
    position: 'absolute',
    bottom: 0,
    transform: [
      {
        translateX: Animated.add(
          indicatorAnim,
          new Animated.Value(offsetValue)
        ),
      },
    ],
  };
};

// 格式化容器样式
export const formatContainerStyle = (): ViewStyle => {
  return {
    backgroundColor: TAB_BAR_COLORS.BACKGROUND,
    borderBottomWidth: TAB_BAR_CONSTANTS.BORDER_WIDTH,
    borderBottomColor: TAB_BAR_COLORS.BORDER_LIGHT,
    paddingTop: TAB_BAR_CONSTANTS.STATUS_BAR_PADDING,
  };
};

// 格式化 Tab 容器样式
export const formatTabContainerStyle = (): ViewStyle => {
  return {
    flexDirection: 'row',
    height: TAB_BAR_CONSTANTS.TAB_BAR_HEIGHT,
    alignItems: 'center',
  };
};

// 格式化指示器容器样式
export const formatIndicatorContainerStyle = (): ViewStyle => {
  return {
    height: TAB_BAR_CONSTANTS.INDICATOR_HEIGHT,
    backgroundColor: TAB_BAR_COLORS.TRANSPARENT,
    position: 'relative',
  };
};

// 获取 Tab 显示标题
export const formatTabTitle = (tab: TabConfig): string => {
  return tab.title || tab.key;
};

// 获取测试 ID
export const formatTestId = (baseId: string, suffix?: string): string => {
  return suffix ? `${baseId}_${suffix}` : baseId;
};

// 计算 Tab 索引
export const calculateTabIndex = (tabs: TabConfig[], tabKey: TabType): number => {
  return tabs.findIndex(tab => tab.key === tabKey);
};

// 计算指示器位置
export const calculateIndicatorPosition = (
  tabIndex: number, 
  tabWidth: number
): number => {
  return tabIndex * tabWidth;
};
