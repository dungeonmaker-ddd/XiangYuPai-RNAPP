/**
 * 主屏幕组件 - 全局页面管理
 * 整合首页、发现页面等核心功能，管理全局底部导航
 */

import React, { useState, useCallback } from 'react';
import {
  View,
  StyleSheet,
  StatusBar,
  Platform,
  Alert
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import type { StackNavigationProp } from '@react-navigation/stack';
import type { RootStackParamList } from '../types/navigation';

// 页面组件导入
import { HomeScreen } from './home';
import { DiscoverScreen } from './discover';
import { MessageCenterScreen } from './message';
import { ProfileScreen } from './profile/ProfileScreen';

// 全局导航组件导入
import { GlobalBottomNavigation } from '../navigation';

// 类型定义
type TabScreen = 'home' | 'discover' | 'message' | 'profile';

type MainScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Main'>;

interface MainScreenProps {
  navigation: MainScreenNavigationProp;
}

// 主屏幕组件
const MainScreen: React.FC<MainScreenProps> = ({ navigation }) => {
  const safeAreaInsets = useSafeAreaInsets();
  
  // 当前活跃的标签页
  const [activeTab, setActiveTab] = useState<TabScreen>('home');

  // 处理标签页切换
  const handleTabPress = useCallback((tabId: string) => {
    const validTabs: TabScreen[] = ['home', 'discover', 'message', 'profile'];
    
    if (validTabs.includes(tabId as TabScreen)) {
      setActiveTab(tabId as TabScreen);
    } else {
      // 暂未实现的页面显示提示
      Alert.alert('提示', `${tabId} 页面正在开发中...`);
    }
  }, []);

  // 获取当前页面的StatusBar配置
  const getStatusBarConfig = () => {
    switch (activeTab) {
      case 'home':
        return {
          barStyle: 'light-content' as const,
          backgroundColor: '#8B5CF6'
        };
      case 'discover':
        return {
          barStyle: 'dark-content' as const,
          backgroundColor: '#FFFFFF'
        };
      case 'message':
        return {
          barStyle: 'dark-content' as const,
          backgroundColor: '#FFFFFF'
        };
      case 'profile':
        return {
          barStyle: 'light-content' as const,
          backgroundColor: '#8A2BE2' // 使用Profile页面的紫色主题
        };
      default:
        return {
          barStyle: 'dark-content' as const,
          backgroundColor: '#FFFFFF'
        };
    }
  };

  // 渲染当前活跃的页面内容
  const renderActiveScreen = () => {
    switch (activeTab) {
      case 'home':
        return (
          <View style={styles.pageContainer}>
            <HomeScreen navigation={navigation} />
          </View>
        );
      
      case 'discover':
        return (
          <View style={styles.pageContainer}>
            <DiscoverScreen navigation={navigation} />
          </View>
        );
      
      case 'message':
        return (
          <View style={styles.pageContainer}>
            <MessageCenterScreen navigation={navigation} />
          </View>
        );
      
      case 'profile':
        // 个人中心页面
        return (
          <View style={styles.pageContainer}>
            <ProfileScreen />
          </View>
        );
      
      default:
        return (
          <View style={styles.pageContainer}>
            <HomeScreen />
          </View>
        );
    }
  };

  const statusBarConfig = getStatusBarConfig();

  return (
    <View style={styles.container}>
      {/* 全局StatusBar配置 */}
      <StatusBar 
        barStyle={statusBarConfig.barStyle}
        backgroundColor={statusBarConfig.backgroundColor}
        translucent={false}
      />

      {/* 主内容区域 - 直接渲染页面，不添加额外容器 */}
      {renderActiveScreen()}

      {/* 全局底部导航 */}
      <GlobalBottomNavigation
        activeTab={activeTab}
        onTabPress={handleTabPress}
      />
    </View>
  );
};

// 样式定义
const styles = StyleSheet.create({
  container: {
    flex: 1,
    // 不设置background，让各页面自己控制背景
  },

  pageContainer: {
    flex: 1,
    // 确保每个页面都能占据完整空间
  },

  placeholderContainer: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default MainScreen;
