/**
 * 应用主导航器 - Stack Navigator配置
 */

import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

// 导入页面组件
import MainScreen from '../screens/MainScreen';
import { LocationSelectorScreen } from '../screens/home-location';
import { SearchScreen } from '../screens/home-search';
import { GroupCenterScreen } from '../screens/group-center';
import { PublishGroupScreen } from '../screens/group-publish';
import { PrivateChatScreen } from '../screens/message/private-chat';
import { DiscoverDetailPage } from '../screens/discover-detail';

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
          component={MainScreen}
          options={{
            headerShown: false,
          }}
        />
        
        {/* 地区选择页面 */}
        <Stack.Screen 
          name="LocationSelector" 
          component={LocationSelectorScreen}
          options={{
            headerShown: false,
            presentation: 'modal', // 模态展示
          }}
        />
        
        {/* 搜索页面 */}
        <Stack.Screen 
          name="Search" 
          component={SearchScreen}
          options={{
            headerShown: false,
            animation: 'slide_from_right', // 从右侧滑入
          }}
        />
        
        {/* 组局中心页面 */}
        <Stack.Screen 
          name="GroupCenter" 
          component={GroupCenterScreen}
          options={{
            headerShown: false,
            animation: 'slide_from_right', // 从右侧滑入
          }}
        />
        
        {/* 组局发布页面 */}
        <Stack.Screen 
          name="PublishGroup" 
          component={PublishGroupScreen}
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
