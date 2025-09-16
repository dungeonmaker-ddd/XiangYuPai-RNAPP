/**
 * 使用示例组件
 * 展示如何在主发现页面中集成详情页面
 */

import React from 'react';
import { Alert } from 'react-native';

// 示例：在WaterfallCard的点击事件中导航到详情页
export const navigateToDetailExample = (navigation: any, item: any) => {
  // 方法1：直接导航
  navigation.navigate('DiscoverDetail', {
    contentId: item.id,
    contentItem: item,
  });
};

// 示例：在DiscoverScreen中处理卡片点击
export const handleWaterfallCardClick = (navigation: any) => {
  return (item: any) => {
    try {
      // 记录用户行为
      console.log('User clicked on content:', item.id);
      
      // 导航到详情页
      navigation.navigate('DiscoverDetail', {
        contentId: item.id,
        contentItem: item, // 传递完整数据避免重复请求
      });
    } catch (error) {
      console.error('Navigation error:', error);
      Alert.alert('错误', '无法打开详情页面');
    }
  };
};

// 示例：路由配置
export const routeConfigExample = `
// 在 App.tsx 或主导航文件中添加路由
import { DiscoverDetailPage } from '@/screens/discover/subpage';

const Stack = createStackNavigator();

function AppNavigator() {
  return (
    <Stack.Navigator>
      {/* 其他路由 */}
      <Stack.Screen 
        name="DiscoverDetail" 
        component={DiscoverDetailPage}
        options={{ 
          headerShown: false,
          presentation: 'modal', // iOS模态展示
          animationTypeForReplace: 'push',
        }}
      />
    </Stack.Navigator>
  );
}
`;

// 示例：在现有DiscoverScreen中集成
export const integrateWithDiscoverScreen = `
// 在 DiscoverScreen.tsx 中
import { handleWaterfallCardClick } from './subpage/discover-detail/examples/UsageExample';

const DiscoverScreen = ({ navigation }) => {
  const onItemPress = handleWaterfallCardClick(navigation);
  
  return (
    <WaterfallList
      data={contentData}
      onItemPress={onItemPress}
      // ... 其他props
    />
  );
};
`;

export default {
  navigateToDetailExample,
  handleWaterfallCardClick,
  routeConfigExample,
  integrateWithDiscoverScreen,
};
