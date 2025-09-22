/**
 * 主页面组 - 全局页面管理
 * 整合首页、发现页面等核心功能，管理全局底部导航
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

// ==================== 1. Imports ====================
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
import type { RootStackParamList } from '../../types/navigation';

// 页面组件导入 - 使用新的 pages/ 架构
import { HomeMainPage } from '../Home';
import { DiscoverMainPage } from '../Discover';
import { MessageMainPage } from '../Message';
import { ProfileMainPage } from '../Profile';

// 全局导航组件导入
import { GlobalBottomNavigation } from '../../navigation';

// ==================== 2. Types & Schema ====================
type TabScreen = 'home' | 'discover' | 'message' | 'profile';

type MainScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Main'>;

interface MainPageProps {
  navigation: MainScreenNavigationProp;
}

// ==================== 3. Constants & Config ====================
const VALID_TABS: TabScreen[] = ['home', 'discover', 'message', 'profile'];

const STATUS_BAR_CONFIG = {
  home: {
    barStyle: 'light-content' as const,
    backgroundColor: '#8B5CF6'
  },
  discover: {
    barStyle: 'dark-content' as const,
    backgroundColor: '#FFFFFF'
  },
  message: {
    barStyle: 'dark-content' as const,
    backgroundColor: '#FFFFFF'
  },
  profile: {
    barStyle: 'light-content' as const,
    backgroundColor: '#8A2BE2'
  }
} as const;

// ==================== 4. Utils & Helpers ====================
const getStatusBarConfig = (activeTab: TabScreen) => {
  return STATUS_BAR_CONFIG[activeTab] || STATUS_BAR_CONFIG.discover;
};

// ==================== 5. State Management ====================
// 状态管理在主组件中实现

// ==================== 6. Domain Logic ====================
// 业务逻辑在主组件中实现

// ==================== 7. UI Components & Rendering ====================
const MainPage: React.FC<MainPageProps> = ({ navigation }) => {
  const safeAreaInsets = useSafeAreaInsets();
  
  // 当前活跃的标签页
  const [activeTab, setActiveTab] = useState<TabScreen>('home');

  // 处理标签页切换
  const handleTabPress = useCallback((tabId: string) => {
    if (VALID_TABS.includes(tabId as TabScreen)) {
      setActiveTab(tabId as TabScreen);
    } else {
      Alert.alert('提示', `${tabId} 页面正在开发中...`);
    }
  }, []);

  // 渲染当前活跃的页面内容
  const renderActiveScreen = () => {
    switch (activeTab) {
      case 'home':
        return (
          <View style={styles.pageContainer}>
            <HomeMainPage navigation={navigation} />
          </View>
        );
      
      case 'discover':
        return (
          <View style={styles.pageContainer}>
            <DiscoverMainPage navigation={navigation} />
          </View>
        );
      
      case 'message':
        return (
          <View style={styles.pageContainer}>
            <MessageMainPage navigation={navigation} />
          </View>
        );
      
      case 'profile':
        return (
          <View style={styles.pageContainer}>
            <ProfileMainPage navigation={navigation} />
          </View>
        );
      
      default:
        return (
          <View style={styles.pageContainer}>
            <HomeMainPage navigation={navigation} />
          </View>
        );
    }
  };

  const statusBarConfig = getStatusBarConfig(activeTab);

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

// ==================== 8. Exports ====================
export default MainPage;
