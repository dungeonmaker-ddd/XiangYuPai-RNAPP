/**
 * 全局底部导航组件
 * 提升自home模块的BottomNavigation，作为全局导航管理器
 */

import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

// 导入共享常量 [[memory:8830196]]
const COLORS = {
  primary: '#8B5CF6',
  primaryLight: '#A855F7',
  white: '#FFFFFF',
  gray50: '#F8F8F8',
  gray100: '#F3F4F6',
  gray500: '#6B7280',
  gray900: '#111827',
  // 渐变色定义
  gradientStart: 'rgba(115, 127, 225, 1)', // 蓝紫色起始
  gradientEnd: 'rgba(175, 56, 217, 1)',    // 粉紫色结束
} as const;

interface GlobalBottomNavigationProps {
  activeTab: string;
  onTabPress: (tabId: string) => void;
}

// 底部导航图标映射
const TAB_ICONS = {
  home: {
    active: require('../../assets/images/home/bottom-navigation/home-active.png'),
    inactive: require('../../assets/images/home/bottom-navigation/home-inactive.png'),
  },
  discover: {
    active: require('../../assets/images/home/bottom-navigation/discover-active.png'),
    inactive: require('../../assets/images/home/bottom-navigation/discover-inactive.png'),
  },
  message: {
    active: require('../../assets/images/home/bottom-navigation/message-active.png'),
    inactive: require('../../assets/images/home/bottom-navigation/message-inactive.png'),
  },
  profile: {
    active: require('../../assets/images/home/bottom-navigation/profile-active.png'),
    inactive: require('../../assets/images/home/bottom-navigation/profile-inactive.png'),
  },
};

// 全局底部导航组件
const GlobalBottomNavigation = ({ activeTab, onTabPress }: GlobalBottomNavigationProps) => {
  const safeAreaInsets = useSafeAreaInsets();
  
  // 导航标签配置
  const tabs = [
    { id: 'home', label: '首页' },
    { id: 'discover', label: '发现' },
    { id: 'message', label: '消息' },
    { id: 'profile', label: '我的' },
  ];

  return (
    <View style={[styles.container, {
      backgroundColor: COLORS.white,
      borderTopWidth: 1,
      borderTopColor: COLORS.gray100,
      paddingBottom: safeAreaInsets.bottom
    }]}>
      <View style={[styles.row, { paddingVertical: 8 }]}>
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          const iconSource = TAB_ICONS[tab.id as keyof typeof TAB_ICONS];
          
          return (
            <TouchableOpacity
              key={tab.id}
              style={[styles.center, { flex: 1, paddingVertical: 4 }]}
              onPress={() => onTabPress(tab.id)}
              activeOpacity={0.7}
            >
              <Image 
                source={isActive ? iconSource.active : iconSource.inactive}
                style={{
                  width: 24,
                  height: 24,
                  marginBottom: 2
                }}
                resizeMode="contain"
              />
              <Text style={[styles.text, {
                fontSize: 12,
                color: isActive ? COLORS.primary : COLORS.gray500,
                fontWeight: isActive ? '600' : 'normal'
              }]}>
                {tab.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
};

// 样式定义
const styles = StyleSheet.create({
  // 容器样式
  container: {
    // 样式将通过内联方式应用
  },

  // 公共布局样式
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  center: {
    alignItems: 'center',
    justifyContent: 'center',
  },

  // 公共文字样式
  text: {
    fontSize: 14,
    color: '#111827',
  },
});

export default GlobalBottomNavigation;
