/**
 * 📱 组局中心主页面 - 页面父组件
 * 基于通用组件架构核心标准的完整实现
 * 
 * TOC (quick jump):
 * [1] File Banner & TOC
 * [2] Imports
 * [3] Types & Schema
 * [4] Constants & Config
 * [5] Utils & Helpers
 * [6] State Management
 * [7] Domain Logic
 * [8] UI Components & Rendering
 * [9] Exports
 */

// #region 1. File Banner & TOC
/**
 * GroupCenterScreen - 组局中心主页面
 * 集成所有子组件，提供完整的社交组局业务闭环
 * 
 * TOC (快速跳转):
 * [1] File Banner & TOC
 * [2] Imports
 * [3] Types & Schema  
 * [4] Constants & Config
 * [5] Utils & Helpers
 * [6] State Management
 * [7] Domain Logic
 * [8] UI Components & Rendering
 * [9] Exports
 */
// #endregion

// #region 2. Imports
import React, { useCallback, useEffect } from 'react';
import { View, StatusBar, StyleSheet } from 'react-native';

// 导入页面状态管理
import { useGroupCenter } from './useGroupCenter';
import { useGroupCenterData } from './useGroupCenterData';

// 导入页面导航
import { navigateToDetail } from './navigateToDetail';
import { navigateBack } from './navigateBack';

// 导入组件区域
import { HeaderArea } from './HeaderArea';
import { FilterArea } from './FilterArea';
import { ContentArea } from './ContentArea';

// 导入类型和常量
import type { GroupActivity, UserInfo } from './types';
import { COLORS, TEXTS } from './constants';
// #endregion

// #region 3. Types & Schema
interface GroupCenterScreenProps {
  navigation?: any;
  route?: any;
}
// #endregion

// #region 4. Constants & Config
// Mock数据 - 用于演示
const MOCK_ACTIVITIES: GroupActivity[] = [
  {
    id: '1',
    type: 'ktv',
    title: 'k歌两小时',
    description: '周末K歌放松，一起嗨唱',
    backgroundImage: 'https://example.com/ktv-bg.jpg',
    organizer: {
      id: 'user1',
      nickname: '昵称123',
      avatar: 'https://example.com/avatar1.jpg',
      isOnline: true,
      isVerified: true,
      creditScore: 95,
      totalActivities: 28,
      tags: ['高质量', '人人'],
    },
    details: {
      datetime: '6月10日18:00',
      location: {
        name: '福田区下沙KK ONE海底捞',
        address: '深圳市福田区下沙KK ONE',
        coordinates: { latitude: 22.5431, longitude: 114.0579 },
      },
      price: { amount: 300, unit: 'hour', currency: 'coins' },
      maxParticipants: 4,
      registrationDeadline: '6月10日16:00',
    },
    participants: [],
    waitingList: [],
    status: 'active',
    createdAt: '2024-06-09T10:00:00Z',
    updatedAt: '2024-06-09T10:00:00Z',
    stats: {
      viewCount: 156,
      registrationCount: 50,
      distance: 2.3,
    },
    tags: ['高质量', '人人'],
  },
];
// #endregion

// #region 5. Utils & Helpers
const debounce = (func: Function, delay: number) => {
  let timeoutId: ReturnType<typeof setTimeout>;
  return (...args: any[]) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func.apply(null, args), delay);
  };
};
// #endregion

// #region 6. State Management
const GroupCenterScreen: React.FC<GroupCenterScreenProps> = ({ navigation }) => {
  // 使用页面主状态管理
  const {
    state,
    filteredActivities,
    isLoading,
    isEmpty,
    setActivities,
    updateFilter,
    setLoading,
    setRefreshing,
    setError,
    setSelectedActivity,
    setAdvancedFilterVisible,
  } = useGroupCenter();

  // 使用页面数据状态管理
  const {
    getCachedData,
    setCachedData,
    generateCacheKey,
    shouldRefreshData,
  } = useGroupCenterData();

  // 初始化数据
  useEffect(() => {
    setActivities(MOCK_ACTIVITIES);
  }, [setActivities]);
// #endregion

// #region 7. Domain Logic
  // 处理刷新
  const handleRefresh = useCallback(async () => {
    setRefreshing(true);
    setError(null);
    
    try {
      // 模拟API请求
      await new Promise<void>(resolve => setTimeout(() => resolve(), 1000));
      setActivities(MOCK_ACTIVITIES);
    } catch (error) {
      setError('刷新失败，请稍后重试');
    } finally {
      setRefreshing(false);
    }
  }, [setRefreshing, setError, setActivities]);

  // 处理加载更多
  const handleLoadMore = useCallback(async () => {
    if (isLoading || !state.hasMore) return;
    
    setLoading(true);
    try {
      // 模拟API请求
      await new Promise<void>(resolve => setTimeout(() => resolve(), 1000));
      // 实际应该添加新数据
    } catch (error) {
      setError('加载失败，请稍后重试');
    } finally {
      setLoading(false);
    }
  }, [isLoading, state.hasMore, setLoading, setError]);

  // 处理筛选变更
  const handleFilterChange = useCallback((newFilter: any) => {
    updateFilter(newFilter);
  }, [updateFilter]);

  // 处理活动点击
  const handleActivityPress = useCallback((activity: GroupActivity) => {
    setSelectedActivity(activity);
    navigateToDetail(navigation, activity);
  }, [navigation, setSelectedActivity]);

  // 处理头像点击
  const handleAvatarPress = useCallback((user: UserInfo) => {
    console.log('查看用户资料:', user.nickname);
  }, []);

  // 处理返回
  const handleBackPress = useCallback(() => {
    navigateBack(navigation);
  }, [navigation]);

  // 处理发布
  const handlePublishPress = useCallback(() => {
    navigation?.navigate('PublishGroup');
  }, [navigation]);

  // 处理高级筛选
  const handleAdvancedPress = useCallback(() => {
    setAdvancedFilterVisible(true);
  }, [setAdvancedFilterVisible]);
// #endregion

// #region 8. UI Components & Rendering
  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.BACKGROUND} />
      
      {/* 头部导航区域 */}
      <HeaderArea
        title={TEXTS.TITLES.GROUP_CENTER}
        onBackPress={handleBackPress}
        onPublishPress={handlePublishPress}
      />
      
      {/* 筛选标签区域 */}
      <FilterArea
        filter={state.filter.options}
        onFilterChange={handleFilterChange}
        onAdvancedPress={handleAdvancedPress}
      />
      
      {/* 主要内容区域 */}
      <ContentArea
        activities={filteredActivities}
        loading={isLoading}
        refreshing={state.refreshing}
        hasMore={state.hasMore}
        isEmpty={isEmpty}
        error={state.error}
        onRefresh={handleRefresh}
        onLoadMore={handleLoadMore}
        onActivityPress={handleActivityPress}
        onAvatarPress={handleAvatarPress}
      />
    </View>
  );
};

// 样式定义
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.BACKGROUND,
  },
});
// #endregion

// #region 9. Exports
export default GroupCenterScreen;
export { GroupCenterScreen };
export type { GroupCenterScreenProps };
// #endregion
