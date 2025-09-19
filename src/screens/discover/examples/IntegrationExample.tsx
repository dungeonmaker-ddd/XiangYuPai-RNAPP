/**
 * 发现页面完整集成示例
 * 展示如何在发现页面中使用更新后的点击处理器
 */

import React from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { ContentItem, TabType } from '../types';
import { WaterfallCard } from '../components';
import { onWaterfallCardClick } from '../WaterfallCard/onWaterfallCardClick';

interface IntegrationExampleProps {
  navigation: any;
  items: ContentItem[];
  currentTab: TabType;
}

/**
 * 集成示例组件
 * 展示如何正确使用瀑布流卡片点击处理器
 */
export const IntegrationExample: React.FC<IntegrationExampleProps> = ({
  navigation,
  items,
  currentTab,
}) => {
  
  // 处理卡片点击 - 使用更新后的事件处理器
  const handleCardPress = async (item: ContentItem, index: number) => {
    try {
      const result = await onWaterfallCardClick({
        item,
        index,
        tabType: currentTab,
        navigation,
        // 可选：添加分析服务
        analytics: {
          track: (event: string, properties: any) => {
            console.log('📊 Analytics:', event, properties);
            // 这里集成实际的分析服务，如Firebase、友盟等
          },
        },
        // 可选：自定义Toast显示
        showToast: (message: string) => {
          Alert.alert('提示', message);
          // 或者使用react-native-toast-message等Toast库
        },
      });

      if (result.success) {
        console.log('✅ 导航成功:', result.data);
      } else {
        console.log('❌ 导航失败:', result.message);
      }
    } catch (error) {
      console.error('处理卡片点击失败:', error);
      Alert.alert('错误', '打开内容失败，请重试');
    }
  };

  // 处理其他互动操作
  const handleLike = (itemId: string) => {
    console.log('点赞:', itemId);
    // 实现点赞逻辑
  };

  const handleCollect = (itemId: string) => {
    console.log('收藏:', itemId);
    // 实现收藏逻辑
  };

  const handleUserPress = (userId: string) => {
    console.log('查看用户:', userId);
    // 导航到用户详情页面
    navigation.navigate('UserDetail', { userId });
  };

  const handleShare = (item: ContentItem) => {
    console.log('分享:', item.title);
    // 实现分享逻辑
  };

  return (
    <View style={styles.container}>
      {items.map((item, index) => (
        <WaterfallCard
          key={item.id}
          item={item}
          index={index}
          onPress={(selectedItem) => handleCardPress(selectedItem, index)}
          onLike={handleLike}
          onCollect={handleCollect}
          onUserPress={handleUserPress}
          onShare={handleShare}
        />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
});

export default IntegrationExample;
