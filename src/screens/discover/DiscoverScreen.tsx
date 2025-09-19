/**
 * 发现页面主组件
 * 纯组件组装器，整合 TabBar 和 WaterfallList 两个子组件
 */

import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  SafeAreaView,
  StatusBar,
} from 'react-native';
import TabBar from './TabBar';
import { WaterfallList } from './WaterfallList';
import type { TabType } from './TabBar/types';
import { DEFAULT_TABS } from './TabBar/constants';

export const DiscoverScreen: React.FC<{ navigation?: any }> = ({ navigation }) => {
  const [activeTab, setActiveTab] = useState<TabType>('hot');

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      
      {/* 顶部导航栏 */}
      <TabBar
        tabs={DEFAULT_TABS}
        activeTab={activeTab}
        onTabPress={setActiveTab}
      />

      {/* 主内容区域 */}
      <View style={styles.content}>
        <WaterfallList
          data={[]}
          onRefresh={() => {}}
          onLoadMore={() => {}}
          navigation={navigation}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  
  content: {
    flex: 1,
  },
});