import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

// 导入共享常量
import { COLORS } from './constants';

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

// BottomNavigation Component
export const BottomNavigation = ({ activeTab, onTabPress }: BottomNavigationProps) => {
  const safeAreaInsets = useSafeAreaInsets();
  const tabs = [
    { id: 'home', label: '首页' },
    { id: 'discover', label: '发现' },
    { id: 'message', label: '消息' },
    { id: 'profile', label: '我的' },
  ];

  return (
    <View style={[{
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

export default BottomNavigation;
