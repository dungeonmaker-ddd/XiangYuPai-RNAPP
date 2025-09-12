/**
 * 发现页面 - 底部导航组件
 * 复用 home 页面的底部导航，保持一致的设计风格
 */

import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  Platform
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { COLORS, FONTS, SPACING } from './constants';

interface BottomNavigationProps {
  activeTab: string;
  onTabPress: (tabId: string) => void;
}

// 底部导航图标映射
const TAB_ICONS = {
  home: {
    active: require('../../../assets/images/home/bottom-navigation/home-active.png'),
    inactive: require('../../../assets/images/home/bottom-navigation/home-inactive.png'),
  },
  discover: {
    active: require('../../../assets/images/home/bottom-navigation/discover-active.png'),
    inactive: require('../../../assets/images/home/bottom-navigation/discover-inactive.png'),
  },
  message: {
    active: require('../../../assets/images/home/bottom-navigation/message-active.png'),
    inactive: require('../../../assets/images/home/bottom-navigation/message-inactive.png'),
  },
  profile: {
    active: require('../../../assets/images/home/bottom-navigation/profile-active.png'),
    inactive: require('../../../assets/images/home/bottom-navigation/profile-inactive.png'),
  },
};

// 导航标签配置
const TAB_CONFIG = [
  { id: 'home', label: '首页' },
  { id: 'discover', label: '发现' },
  { id: 'message', label: '消息' },
  { id: 'profile', label: '我的' },
];

const BottomNavigation: React.FC<BottomNavigationProps> = ({ 
  activeTab, 
  onTabPress 
}) => {
  const safeAreaInsets = useSafeAreaInsets();

  // 渲染单个标签页
  const renderTab = (tab: typeof TAB_CONFIG[0]) => {
    const isActive = activeTab === tab.id;
    const iconSource = TAB_ICONS[tab.id as keyof typeof TAB_ICONS];
    
    return (
      <TouchableOpacity
        key={tab.id}
        style={styles.tabButton}
        onPress={() => onTabPress(tab.id)}
        activeOpacity={0.7}
        accessibilityRole="tab"
        accessibilityState={{ selected: isActive }}
        accessibilityLabel={tab.label}
      >
        {/* 标签图标 */}
        <Image 
          source={isActive ? iconSource.active : iconSource.inactive}
          style={styles.tabIcon}
          resizeMode="contain"
        />
        
        {/* 标签文字 */}
        <Text style={[
          styles.tabLabel,
          isActive && styles.tabLabelActive
        ]}>
          {tab.label}
        </Text>
      </TouchableOpacity>
    );
  };

  return (
    <View style={[
      styles.container,
      { paddingBottom: safeAreaInsets.bottom }
    ]}>
      <View style={styles.tabContainer}>
        {TAB_CONFIG.map(renderTab)}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.WHITE,
    borderTopWidth: 1,
    borderTopColor: COLORS.BORDER,
    ...Platform.select({
      ios: {
        shadowOffset: { width: 0, height: -2 },
        shadowOpacity: 0.05,
        shadowRadius: 4
      },
      android: {
        elevation: 8
      }
    })
  },

  tabContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: SPACING.SM
  },

  tabButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: SPACING.XS
  },

  tabIcon: {
    width: 24,
    height: 24,
    marginBottom: 2
  },

  tabLabel: {
    fontSize: FONTS.SIZE_12,
    color: COLORS.GRAY_500,
    fontWeight: FONTS.WEIGHT_REGULAR,
    lineHeight: FONTS.SIZE_12 * FONTS.LINE_HEIGHT_1_2
  },

  tabLabelActive: {
    color: COLORS.PRIMARY,
    fontWeight: FONTS.WEIGHT_BOLD
  }
});

export default BottomNavigation;
