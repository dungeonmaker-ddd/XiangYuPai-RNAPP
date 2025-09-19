/**
 * 卡片点击事件使用示例
 * 展示如何在不同场景下使用卡片点击事件处理器
 */

import React from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { WaterfallContainer } from '../components';
import { onWaterfallCardClick, createWaterfallCardClickHandler, defaultWaterfallCardClickHandler } from '../WaterfallCard/onWaterfallCardClick';
import { ContentItem, TabType } from '../types';

// =====================================================
// 示例1: 直接使用事件处理器
// =====================================================

export const DirectUsageExample: React.FC<{
  data: ContentItem[];
  navigation: any;
}> = ({ data, navigation }) => {
  
  // 自定义Toast显示
  const showToast = (message: string) => {
    Alert.alert('提示', message);
  };

  // 直接使用事件处理器
  return (
    <WaterfallContainer
      data={data}
      tabType={"hot" as TabType}
      onLoadMore={() => {}}
      onRefresh={() => {}}
      refreshing={false}
      loading={false}
      hasMore={true}
      // 传递事件处理配置
      navigation={navigation}
      showToast={showToast}
    />
  );
};

// =====================================================
// 示例2: 使用预配置的点击处理器
// =====================================================

export const PreConfiguredExample: React.FC<{
  data: ContentItem[];
  navigation: any;
  analytics: any;
}> = ({ data, navigation, analytics }) => {
  
  // 创建预配置的处理器
  const waterfallCardClickHandler = createWaterfallCardClickHandler({
    navigation,
    analytics,
    showToast: (message: string) => {
      console.log('Toast:', message);
      // 这里可以调用实际的Toast组件
    },
  });

  // 如果需要手动处理点击事件
  const handleManualCardClick = async (item: ContentItem, index: number) => {
    try {
      const result = await waterfallCardClickHandler(item, index, 'hot');
      console.log('点击结果:', result);
    } catch (error) {
      console.error('点击处理失败:', error);
    }
  };

  return (
    <WaterfallContainer
      data={data}
      tabType={"follow" as TabType}
      onLoadMore={() => {}}
      onRefresh={() => {}}
      refreshing={false}
      loading={false}
      hasMore={true}
      navigation={navigation}
      analytics={analytics}
    />
  );
};

// =====================================================
// 示例3: 使用默认处理器（最简单）
// =====================================================

export const SimpleExample: React.FC<{
  data: ContentItem[];
}> = ({ data }) => {
  
  return (
    <WaterfallContainer
      data={data}
      tabType={"local" as TabType}
      onLoadMore={() => {}}
      onRefresh={() => {}}
      refreshing={false}
      loading={false}
      hasMore={true}
      // 不传递navigation等参数，使用默认行为
    />
  );
};

// =====================================================
// 示例4: 自定义事件处理逻辑
// =====================================================

export const CustomHandlerExample: React.FC<{
  data: ContentItem[];
  navigation: any;
}> = ({ data, navigation }) => {
  
  // 自定义的Toast显示函数
  const customShowToast = (message: string) => {
    // 这里可以集成第三方Toast库
    Alert.alert('自定义提示', message, [
      { text: '确定', style: 'default' },
    ]);
  };

  // 自定义分析服务
  const customAnalytics = {
    track: (event: string, properties: any) => {
      console.log('📊 自定义分析:', { event, properties });
      // 这里可以发送到你的分析服务
    },
  };

  return (
    <WaterfallContainer
      data={data}
      tabType={"follow" as TabType}
      onLoadMore={() => {}}
      onRefresh={() => {}}
      refreshing={false}
      loading={false}
      hasMore={true}
      navigation={navigation}
      analytics={customAnalytics}
      showToast={customShowToast}
    />
  );
};

// =====================================================
// 示例5: 完整的集成示例
// =====================================================

export const FullIntegrationExample: React.FC<{
  data: ContentItem[];
  navigation: any;
  onLoadMore: () => void;
  onRefresh: () => void;
  refreshing: boolean;
  loading: boolean;
  hasMore: boolean;
}> = ({ 
  data, 
  navigation, 
  onLoadMore, 
  onRefresh, 
  refreshing, 
  loading, 
  hasMore 
}) => {
  
  // 完整的事件处理配置
  const handleLike = (itemId: string) => {
    console.log('点赞:', itemId);
    // 调用点赞API
    // 注意：其他交互（收藏、用户点击、分享）都已经在 onWaterfallCardClick 事件处理器中处理
  };

  const showToast = (message: string) => {
    // 使用实际的Toast组件
    console.log('🔔', message);
  };

  const analytics = {
    track: (event: string, properties: any) => {
      console.log('📈 Analytics:', { event, properties });
    },
  };

  return (
    <View style={styles.container}>
      <WaterfallContainer
        data={data}
        tabType={"hot" as TabType}
        onLoadMore={onLoadMore}
        onRefresh={onRefresh}
        refreshing={refreshing}
        loading={loading}
        hasMore={hasMore}
        onLike={handleLike}
        navigation={navigation}
        analytics={analytics}
        showToast={showToast}
        imageQuality="high"
        showStatusBar={true}
        enableVirtualization={true}
      />
    </View>
  );
};

// =====================================================
// 示例6: 在现有组件中集成
// =====================================================

export const IntegrateInExistingComponent: React.FC = () => {
  // 模拟数据
  const mockData: ContentItem[] = [
    // 这里应该是真实的数据
  ];

  // 模拟navigation
  const mockNavigation = {
    navigate: (screen: string, params?: any) => {
      console.log(`导航到 ${screen}:`, params);
    },
  };

  return (
    <View style={styles.container}>
      <WaterfallContainer
        data={mockData}
        tabType={"hot" as TabType}
        onLoadMore={() => console.log('加载更多')}
        onRefresh={() => console.log('刷新')}
        refreshing={false}
        loading={false}
        hasMore={true}
        navigation={mockNavigation}
        showToast={(message) => console.log('Toast:', message)}
      />
    </View>
  );
};

// =====================================================
// 样式
// =====================================================

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
});

// =====================================================
// 使用说明
// =====================================================

/**
 * 使用步骤：
 * 
 * 1. 基础使用 - 只需要传递 data, tabType, navigation
 * 2. 自定义Toast - 传递 showToast 函数
 * 3. 添加分析 - 传递 analytics 对象
 * 4. 处理其他事件 - 传递 onLike, onCollect 等回调
 * 
 * 事件处理器的优点：
 * - UI组件保持纯净，只负责展示
 * - 业务逻辑集中在事件处理器中
 * - 易于测试和维护
 * - 可以在多个模块中复用
 * - 统一的错误处理和分析上报
 */
