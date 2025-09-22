/**
 * 应用主导航器 - Stack Navigator配置
 */

import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

// 导入页面组件
import { MainPage } from '../pages/Main';
import { HomeLocationPage } from '../pages/Home';
import { HomeSearchPage } from '../pages/Home';
import { GroupCenterMainPage } from '../pages/GroupCenter';
import { GroupCenterPublishPage } from '../pages/GroupCenter';
import { PrivateChatScreen } from '../pages/Message/PrivateChatPage';
import { DiscoverDetailPage } from '../pages/Discover/DetailPage';

// 导入类型定义
import type { RootStackParamList } from '../types/navigation';

const Stack = createStackNavigator<RootStackParamList>();

const AppNavigator: React.FC = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Main"
        screenOptions={{
          headerShown: false, // 默认隐藏头部
        }}
      >
        {/* 主屏幕 - 包含标签页导航 */}
        <Stack.Screen 
          name="Main" 
          component={MainPage}
          options={{
            headerShown: false,
          }}
        />
        
        {/* 地区选择页面 */}
        <Stack.Screen 
          name="LocationSelector" 
          component={HomeLocationPage}
          options={{
            headerShown: false,
            presentation: 'modal', // 模态展示
          }}
        />
        
        {/* 搜索页面 */}
        <Stack.Screen 
          name="Search" 
          component={HomeSearchPage}
          options={{
            headerShown: false,
            animation: 'slide_from_right', // 从右侧滑入
          }}
        />
        
        {/* 组局中心页面 */}
        <Stack.Screen 
          name="GroupCenter" 
          component={GroupCenterMainPage}
          options={{
            headerShown: false,
            animation: 'slide_from_right', // 从右侧滑入
          }}
        />
        
        {/* 组局发布页面 */}
        <Stack.Screen 
          name="PublishGroup" 
          component={GroupCenterPublishPage}
          options={{
            headerShown: false,
            presentation: 'modal', // 模态展示
            animation: 'slide_from_bottom', // 从底部滑入
          }}
        />
        
        {/* 私聊对话页面 */}
        <Stack.Screen 
          name="PrivateChatScreen" 
          component={PrivateChatScreen}
          options={{
            headerShown: false,
            animation: 'slide_from_right', // 从右侧滑入
          }}
        />
        
        {/* 发现详情页面 */}
        <Stack.Screen 
          name="DiscoverDetail" 
          component={DiscoverDetailPage}
          options={{
            headerShown: false,
            animation: 'slide_from_right', // 从右侧滑入
            presentation: 'card', // 卡片展示模式
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
