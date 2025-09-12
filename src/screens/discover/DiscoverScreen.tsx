/**
 * 发现页面 - 主入口文件  
 * 实现三维内容发现体系：关注/热门/同城
 */

import React, { useState, useCallback, useEffect, useRef } from 'react';
import {
  View,
  StyleSheet,
  Platform,
  Alert,
  Dimensions,
  TouchableOpacity,
  Text
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

// 组件导入
import FilterTabs from './FilterTabs';
import MasonryLayout from './MasonryLayout';
import ContentCard from './ContentCard';
import BottomNavigation from './BottomNavigation';

// 类型和常量导入
import {
  TabType,
  ContentItem,
  DiscoverState,
  UserInfo,
  LocationInfo,
  ContentType
} from './types';
import {
  COLORS,
  SPACING,
  TAB_CONFIG,
  PAGINATION,
  ERROR_MESSAGES,
  Z_INDEX
} from './constants';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

// 拍摄按钮组件
const CameraButton: React.FC<{ onPress: () => void }> = ({ onPress }) => (
  <View style={styles.cameraButtonContainer}>
    <TouchableOpacity 
      style={styles.cameraButton}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <Text style={styles.cameraIcon}>📷</Text>
    </TouchableOpacity>
  </View>
);

const DiscoverScreen: React.FC = () => {
  const safeAreaInsets = useSafeAreaInsets();
  
  // 状态管理
  const [state, setState] = useState<DiscoverState>({
    activeTab: TabType.FOLLOWING,
    
    followingData: [],
    trendingData: [],
    nearbyData: [],
    
    followingLoading: false,
    trendingLoading: false,
    nearbyLoading: false,
    
    followingRefreshing: false,
    trendingRefreshing: false,
    nearbyRefreshing: false,
    
    followingError: null,
    trendingError: null,
    nearbyError: null,
    
    followingPage: 1,
    trendingPage: 1,
    nearbyPage: 1,
    
    followingHasMore: true,
    trendingHasMore: true,
    nearbyHasMore: true,
    
    userLocation: null,
    locationPermission: 'undetermined'
  });

  // 引用
  const abortControllerRef = useRef<AbortController>();
  const mountedRef = useRef(true);

  // 生成模拟数据
  const generateMockData = useCallback((type: TabType, page: number): ContentItem[] => {
    const items: ContentItem[] = [];
    const baseIndex = (page - 1) * PAGINATION.PAGE_SIZE;
    
    for (let i = 0; i < PAGINATION.PAGE_SIZE; i++) {
      const index = baseIndex + i;
      const contentTypes = [ContentType.IMAGE, ContentType.VIDEO, ContentType.TEXT];
      const randomType = contentTypes[Math.floor(Math.random() * contentTypes.length)];
      
      const item: ContentItem = {
        id: `${type}-${index}`,
        type: randomType,
        user: {
          id: `user-${index}`,
          avatar: `https://picsum.photos/100/100?random=${index}`,
          nickname: `用户${index + 1}`,
          isVerified: Math.random() > 0.7,
          isFollowed: type === TabType.FOLLOWING ? true : Math.random() > 0.8,
          isOnline: Math.random() > 0.6
        },
        content: Math.random() > 0.3 ? `这是一段内容描述 ${index + 1}。今天天气真不错，出来看看风景。#美好生活# #随手拍#` : undefined,
        media: randomType === ContentType.TEXT ? undefined : [{
          id: `media-${index}`,
          url: randomType === ContentType.VIDEO 
            ? `https://picsum.photos/400/300?random=${index}`
            : `https://picsum.photos/${200 + (index % 3) * 50}/${150 + (index % 4) * 40}?random=${index}`,
          width: 400,
          height: randomType === ContentType.VIDEO ? 300 : 200 + (index % 5) * 100,
          thumbnailUrl: `https://picsum.photos/400/300?random=${index}`,
          duration: randomType === ContentType.VIDEO ? 60 + (index % 5) * 30 : undefined
        }],
        tags: Math.random() > 0.6 ? ['生活', '美食', '旅行'][Math.floor(Math.random() * 3)] ? [`${['生活', '美食', '旅行'][Math.floor(Math.random() * 3)]}`] : undefined : undefined,
        location: type === TabType.NEARBY ? {
          id: `location-${index}`,
          name: `${['南山区', '福田区', '罗湖区'][index % 3]}·${['科技园', '市民中心', '东门'][index % 3]}`,
          distance: `${(Math.random() * 5).toFixed(1)}km`
        } : undefined,
        createdAt: new Date(Date.now() - Math.random() * 86400000 * 7).toISOString(),
        updatedAt: new Date().toISOString(),
        
        likeCount: Math.floor(Math.random() * 1000),
        commentCount: Math.floor(Math.random() * 100),
        shareCount: Math.floor(Math.random() * 50),
        isLiked: Math.random() > 0.7,
        
        hotScore: type === TabType.TRENDING ? Math.floor(Math.random() * 5000) + 1000 : undefined,
        trendingReason: type === TabType.TRENDING ? ['因为你关注了相关用户', '热门话题', '同城热门'][Math.floor(Math.random() * 3)] : undefined,
        
        isNearby: type === TabType.NEARBY,
        distanceFromUser: type === TabType.NEARBY ? `${(Math.random() * 10).toFixed(1)}km` : undefined
      };
      
      items.push(item);
    }
    
    return items;
  }, []);

  // 模拟网络请求
  const mockFetch = useCallback(async (type: TabType, page: number): Promise<{ data: ContentItem[], hasMore: boolean }> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const data = generateMockData(type, page);
        const hasMore = page < 5; // 最多5页数据
        resolve({ data, hasMore });
      }, 800 + Math.random() * 1200); // 随机延迟
    });
  }, [generateMockData]);

  // 获取内容数据
  const fetchContent = useCallback(async (type: TabType, page: number = 1, isRefresh: boolean = false) => {
    if (!mountedRef.current) return;

    // 取消之前的请求
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    abortControllerRef.current = new AbortController();

    const stateKey = `${type}Loading` as keyof DiscoverState;
    const refreshKey = `${type}Refreshing` as keyof DiscoverState;
    const errorKey = `${type}Error` as keyof DiscoverState;
    const dataKey = `${type}Data` as keyof DiscoverState;
    const hasMoreKey = `${type}HasMore` as keyof DiscoverState;
    const pageKey = `${type}Page` as keyof DiscoverState;

    try {
      setState(prev => ({
        ...prev,
        [isRefresh ? refreshKey : stateKey]: true,
        [errorKey]: null
      }));

      const result = await mockFetch(type, page);

      if (!mountedRef.current) return;

      setState(prev => ({
        ...prev,
        [dataKey]: isRefresh || page === 1 ? result.data : [...(prev[dataKey] as ContentItem[]), ...result.data],
        [hasMoreKey]: result.hasMore,
        [pageKey]: page,
        [isRefresh ? refreshKey : stateKey]: false,
        [errorKey]: null
      }));

    } catch (error) {
      if (!mountedRef.current) return;
      
      setState(prev => ({
        ...prev,
        [isRefresh ? refreshKey : stateKey]: false,
        [errorKey]: error instanceof Error ? error.message : ERROR_MESSAGES.LOAD_FAILED
      }));
    }
  }, [mockFetch]);

  // 处理标签页切换
  const handleTabChange = useCallback((tab: TabType) => {
    setState(prev => ({ ...prev, activeTab: tab }));
    
    // 如果该标签页还没有数据，则加载
    const dataKey = `${tab}Data` as keyof DiscoverState;
    if ((state[dataKey] as ContentItem[]).length === 0) {
      fetchContent(tab, 1);
    }
  }, [state, fetchContent]);

  // 处理下拉刷新
  const handleRefresh = useCallback(() => {
    fetchContent(state.activeTab, 1, true);
  }, [state.activeTab, fetchContent]);

  // 处理上拉加载更多
  const handleEndReached = useCallback(() => {
    const loadingKey = `${state.activeTab}Loading` as keyof DiscoverState;
    const hasMoreKey = `${state.activeTab}HasMore` as keyof DiscoverState;
    const pageKey = `${state.activeTab}Page` as keyof DiscoverState;
    
    if (state[loadingKey] || !state[hasMoreKey]) return;
    
    const nextPage = (state[pageKey] as number) + 1;
    fetchContent(state.activeTab, nextPage);
  }, [state, fetchContent]);

  // 处理内容卡片点击
  const handleContentPress = useCallback((item: ContentItem) => {
    Alert.alert('内容详情', `查看 ${item.user.nickname} 的内容详情`);
  }, []);

  // 处理点赞
  const handleLike = useCallback((item: ContentItem) => {
    const dataKey = `${state.activeTab}Data` as keyof DiscoverState;
    const currentData = state[dataKey] as ContentItem[];
    
    setState(prev => ({
      ...prev,
      [dataKey]: currentData.map(content => 
        content.id === item.id 
          ? {
              ...content,
              isLiked: !content.isLiked,
              likeCount: content.isLiked ? content.likeCount - 1 : content.likeCount + 1
            }
          : content
      )
    }));
  }, [state.activeTab]);

  // 处理评论
  const handleComment = useCallback((item: ContentItem) => {
    Alert.alert('评论', `评论 ${item.user.nickname} 的内容`);
  }, []);

  // 处理分享
  const handleShare = useCallback((item: ContentItem) => {
    Alert.alert('分享', `分享 ${item.user.nickname} 的内容`);
  }, []);

  // 处理用户点击
  const handleUserPress = useCallback((user: UserInfo) => {
    Alert.alert('用户详情', `查看 ${user.nickname} 的详情页面`);
  }, []);

  // 处理位置点击
  const handleLocationPress = useCallback((location: LocationInfo) => {
    Alert.alert('位置详情', `查看位置：${location.name}`);
  }, []);

  // 处理更多操作
  const handleMore = useCallback((item: ContentItem) => {
    Alert.alert('更多操作', '举报、不感兴趣、屏蔽用户', [
      { text: '取消', style: 'cancel' },
      { text: '举报', style: 'destructive' },
      { text: '不感兴趣' },
      { text: '屏蔽用户', style: 'destructive' }
    ]);
  }, []);

  // 处理拍摄按钮点击
  const handleCameraPress = useCallback(() => {
    Alert.alert('发布内容', '选择发布类型', [
      { text: '取消', style: 'cancel' },
      { text: '拍照', onPress: () => Alert.alert('拍照', '打开相机拍照') },
      { text: '录视频', onPress: () => Alert.alert('录视频', '打开相机录视频') },
      { text: '从相册选择', onPress: () => Alert.alert('相册', '从相册选择图片/视频') }
    ]);
  }, []);

  // 处理底部导航切换
  const handleBottomTabPress = useCallback((tabId: string) => {
    Alert.alert('导航', `切换到 ${tabId} 页面`);
  }, []);

  // 渲染内容项
  const renderContentItem = useCallback((item: ContentItem, index: number) => (
    <ContentCard
      key={item.id}
      item={item}
      onPress={handleContentPress}
      onLike={handleLike}
      onComment={handleComment}
      onShare={handleShare}
      onUserPress={handleUserPress}
      onLocationPress={handleLocationPress}
      onMore={handleMore}
    />
  ), [
    handleContentPress,
    handleLike,
    handleComment,
    handleShare,
    handleUserPress,
    handleLocationPress,
    handleMore
  ]);

  // 获取当前标签页数据
  const getCurrentTabData = useCallback(() => {
    const dataKey = `${state.activeTab}Data` as keyof DiscoverState;
    return state[dataKey] as ContentItem[];
  }, [state]);

  const getCurrentTabLoading = useCallback(() => {
    const loadingKey = `${state.activeTab}Loading` as keyof DiscoverState;
    return state[loadingKey] as boolean;
  }, [state]);

  const getCurrentTabRefreshing = useCallback(() => {
    const refreshingKey = `${state.activeTab}Refreshing` as keyof DiscoverState;
    return state[refreshingKey] as boolean;
  }, [state]);

  const getCurrentTabError = useCallback(() => {
    const errorKey = `${state.activeTab}Error` as keyof DiscoverState;
    return state[errorKey] as string | null;
  }, [state]);

  // 初始化数据加载
  useEffect(() => {
    fetchContent(TabType.FOLLOWING, 1);
    return () => {
      mountedRef.current = false;
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

  return (
    <View style={styles.container}>
      {/* 状态栏配置已移至MainScreen统一管理 */}

      {/* 顶部安全区域 */}
      <View style={[styles.safeArea, { height: safeAreaInsets.top }]} />

      {/* 页面头部导航 */}
      <View style={styles.header}>
        <FilterTabs
          activeTab={state.activeTab}
          onTabChange={handleTabChange}
          tabs={TAB_CONFIG}
        />
        
        {/* 拍摄按钮 */}
        <CameraButton onPress={handleCameraPress} />
      </View>

      {/* 主内容区域 */}
      <View style={styles.content}>
        <MasonryLayout
          data={getCurrentTabData()}
          renderItem={renderContentItem}
          onEndReached={handleEndReached}
          onRefresh={handleRefresh}
          refreshing={getCurrentTabRefreshing()}
          loading={getCurrentTabLoading()}
          error={getCurrentTabError()}
          emptyText={
            state.activeTab === TabType.FOLLOWING ? ERROR_MESSAGES.EMPTY_FOLLOWING :
            state.activeTab === TabType.TRENDING ? ERROR_MESSAGES.EMPTY_TRENDING :
            ERROR_MESSAGES.EMPTY_NEARBY
          }
        />
      </View>

      {/* 底部导航 */}
      <BottomNavigation
        activeTab="discover"
        onTabPress={handleBottomTabPress}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.WHITE
  },

  safeArea: {
    backgroundColor: COLORS.WHITE
  },

  header: {
    position: 'relative',
    backgroundColor: COLORS.WHITE,
    zIndex: Z_INDEX.HEADER
  },

  // 拍摄按钮容器
  cameraButtonContainer: {
    position: 'absolute',
    top: 8,
    right: SPACING.LG,
    zIndex: Z_INDEX.HEADER + 1
  },

  cameraButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: COLORS.WHITE,
    borderWidth: 1,
    borderColor: COLORS.BORDER,
    justifyContent: 'center',
    alignItems: 'center',
    ...Platform.select({
      ios: {
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8
      },
      android: {
        elevation: 4
      }
    })
  },

  cameraIcon: {
    fontSize: 20,
    color: COLORS.PRIMARY
  },

  content: {
    flex: 1,
    backgroundColor: COLORS.BACKGROUND
  }
});

export default DiscoverScreen;
