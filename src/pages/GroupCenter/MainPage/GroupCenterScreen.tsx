/**
 * 🎯 组局中心主页面
 * 
 * TOC (quick jump):
 * [1] Imports & Types (30-50行)
 * [2] Constants & Config (20-30行)
 * [3] Utils & Helpers (40-60行)
 * [4] State Management (80-120行)
 * [5] Main Component (120-160行)
 * [6] Styles (60-80行)
 * [7] Exports (5-10行)
 */

// ══════════════════════════════════════════════════════════════
// 1. Imports & Types (30-50行)
// ══════════════════════════════════════════════════════════════
import React, { useState, useCallback, useEffect, useMemo, useRef } from 'react';
import {
  View,
  ScrollView,
  Text,
  TouchableOpacity,
  FlatList,
  RefreshControl,
  StatusBar,
  StyleSheet,
  Alert,
  Dimensions,
  Platform,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

// 导入类型和常量
import type {
  GroupActivity,
  FilterOptions,
  GroupCenterState,
  SortType,
  GenderFilter,
  ActivityType,
  UserInfo,
} from './types';
import {
  COLORS,
  SPACING,
  FONT_SIZE,
  BORDER_RADIUS,
  TEXTS,
  PAGINATION,
  LOADING,
  ACTIVITY_TYPES,
  SORT_OPTIONS,
  GENDER_OPTIONS,
} from './constants';

// 导入组件
import { GroupCard } from './components/GroupCard';
// import { QuickFilters } from './components/QuickFilters';
// import { FilterSystem } from './components/FilterSystem';

// 临时接口定义
interface GroupCenterScreenProps {
  navigation?: any;
  route?: any;
}

// ══════════════════════════════════════════════════════════════
// 2. Constants & Config (20-30行)
// ══════════════════════════════════════════════════════════════
const { width: screenWidth } = Dimensions.get('window');

// 默认筛选配置
const DEFAULT_FILTER: FilterOptions = {
  sort: 'smart',
  gender: 'all',
  activityType: 'all',
  advanced: {},
};

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
  // 可以添加更多mock数据...
];

// ══════════════════════════════════════════════════════════════
// 3. Utils & Helpers (40-60行)
// ══════════════════════════════════════════════════════════════
const debounce = (func: Function, delay: number) => {
  let timeoutId: ReturnType<typeof setTimeout>;
  return (...args: any[]) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func.apply(null, args), delay);
  };
};

const formatDistance = (distance?: number): string => {
  if (!distance) return '';
  return distance < 1 ? `${Math.round(distance * 1000)}m` : `${distance.toFixed(1)}km`;
};

const formatPrice = (amount: number, unit: string): string => {
  return `${amount}金币/${unit === 'hour' ? '小时' : '人'}`;
};

const formatParticipantCount = (count: number): string => {
  if (count === 0) return '暂无报名';
  if (count < 10) return `${count}人报名`;
  return `等${count}多位达人报名...`;
};

const getActivityTypeLabel = (type: ActivityType): string => {
  const activityType = ACTIVITY_TYPES.find(item => item.key === type);
  return activityType?.label || type;
};

const getActivityTypeColor = (type: ActivityType): string => {
  const activityType = ACTIVITY_TYPES.find(item => item.key === type);
  return activityType?.color || COLORS.PRIMARY;
};

// ══════════════════════════════════════════════════════════════
// 4. State Management (80-120行)
// ══════════════════════════════════════════════════════════════
const GroupCenterScreen: React.FC<GroupCenterScreenProps> = ({ navigation }) => {
  const safeAreaInsets = useSafeAreaInsets();
  const flatListRef = useRef<FlatList>(null);
  
  // 主要状态
  const [state, setState] = useState<GroupCenterState>({
    activities: MOCK_ACTIVITIES,
    loading: false,
    refreshing: false,
    hasMore: true,
    page: PAGINATION.INITIAL_PAGE,
    error: null,
    filter: {
      options: DEFAULT_FILTER,
      isAdvancedVisible: false,
      activeFiltersCount: 0,
    },
    selectedActivity: null,
    userLocation: null,
  });

  // 计算衍生状态
  const filteredActivities = useMemo(() => {
    let filtered = [...state.activities];
    const { options } = state.filter;
    
    // 按活动类型筛选
    if (options.activityType !== 'all') {
      filtered = filtered.filter(activity => activity.type === options.activityType);
    }
    
    // 按排序方式排序
    switch (options.sort) {
      case 'latest':
        filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        break;
      case 'nearest':
        filtered.sort((a, b) => (a.stats.distance || 0) - (b.stats.distance || 0));
        break;
      case 'cheapest':
        filtered.sort((a, b) => a.details.price.amount - b.details.price.amount);
        break;
      default: // smart
        // 智能排序逻辑可以更复杂
        break;
    }
    
    return filtered;
  }, [state.activities, state.filter.options]);

  // 事件处理函数
  const handleRefresh = useCallback(async () => {
    setState(prev => ({ ...prev, refreshing: true, error: null }));
    
    try {
      // 模拟API请求
      await new Promise<void>(resolve => setTimeout(() => resolve(), 1000));
      
      setState(prev => ({
        ...prev,
        refreshing: false,
        activities: MOCK_ACTIVITIES, // 实际应该是新数据
        page: PAGINATION.INITIAL_PAGE,
      }));
    } catch (error) {
      setState(prev => ({
        ...prev,
        refreshing: false,
        error: '刷新失败，请稍后重试',
      }));
    }
  }, []);

  const handleLoadMore = useCallback(async () => {
    if (state.loading || !state.hasMore) return;
    
    setState(prev => ({ ...prev, loading: true }));
    
    try {
      // 模拟API请求
      await new Promise<void>(resolve => setTimeout(() => resolve(), 1000));
      
      setState(prev => ({
        ...prev,
        loading: false,
        page: prev.page + 1,
        // hasMore: false, // 实际根据API返回决定
      }));
    } catch (error) {
      setState(prev => ({
        ...prev,
        loading: false,
        error: '加载失败，请稍后重试',
      }));
    }
  }, [state.loading, state.hasMore]);

  const handleFilterChange = useCallback((newFilter: Partial<FilterOptions>) => {
    setState(prev => ({
      ...prev,
      filter: {
        ...prev.filter,
        options: { ...prev.filter.options, ...newFilter },
      },
    }));
  }, []);

  const handleActivityPress = useCallback((activity: GroupActivity) => {
    setState(prev => ({ ...prev, selectedActivity: activity }));
    // 导航到详情页面
    // navigation?.navigate('GroupDetail', { activity });
    console.log('打开活动详情:', activity.title);
  }, []);

  const handlePublishPress = useCallback(() => {
    // 导航到发布页面
    navigation?.navigate('PublishGroup');
  }, [navigation]);

  const handleAdvancedFilterPress = useCallback(() => {
    setState(prev => ({
      ...prev,
      filter: { ...prev.filter, isAdvancedVisible: true },
    }));
  }, []);

  // ══════════════════════════════════════════════════════════════
  // 5. Main Component (120-160行)
  // ══════════════════════════════════════════════════════════════

  // 渲染头部导航栏
  const renderHeader = () => (
    <View style={[styles.header, { paddingTop: safeAreaInsets.top }]}>
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => navigation?.goBack()}
      >
        <Text style={styles.backText}>←</Text>
      </TouchableOpacity>
      
      <Text style={styles.headerTitle}>{TEXTS.TITLES.GROUP_CENTER}</Text>
      
      <TouchableOpacity
        style={styles.publishButton}
        onPress={handlePublishPress}
      >
        <Text style={styles.publishText}>+ 发布组局</Text>
      </TouchableOpacity>
    </View>
  );

  // 渲染快速筛选栏
  const renderQuickFilters = () => (
    <View style={styles.filterContainer}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.filterScrollContent}
      >
        {/* 排序选择 */}
        <TouchableOpacity style={styles.filterTag}>
          <Text style={styles.filterTagText}>
            {SORT_OPTIONS.find(opt => opt.key === state.filter.options.sort)?.label}
          </Text>
          <Text style={styles.filterArrow}>▼</Text>
        </TouchableOpacity>

        {/* 性别筛选 */}
        <TouchableOpacity style={styles.filterTag}>
          <Text style={styles.filterTagText}>
            {GENDER_OPTIONS.find(opt => opt.key === state.filter.options.gender)?.label}
          </Text>
          <Text style={styles.filterArrow}>▼</Text>
        </TouchableOpacity>

        {/* 高级筛选 */}
        <TouchableOpacity
          style={styles.advancedFilterButton}
          onPress={handleAdvancedFilterPress}
        >
          <Text style={styles.advancedFilterText}>筛选</Text>
        </TouchableOpacity>
      </ScrollView>

      {/* 活动类型标签 */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.typeScrollContent}
      >
        <TouchableOpacity
          style={[
            styles.typeTag,
            state.filter.options.activityType === 'all' && styles.typeTagActive
          ]}
          onPress={() => handleFilterChange({ activityType: 'all' })}
        >
          <Text style={[
            styles.typeTagText,
            state.filter.options.activityType === 'all' && styles.typeTagTextActive
          ]}>
            全部
          </Text>
        </TouchableOpacity>

        {ACTIVITY_TYPES.map((type) => (
          <TouchableOpacity
            key={type.key}
            style={[
              styles.typeTag,
              state.filter.options.activityType === type.key && styles.typeTagActive
            ]}
            onPress={() => handleFilterChange({ activityType: type.key })}
          >
            <Text style={[
              styles.typeTagText,
              state.filter.options.activityType === type.key && styles.typeTagTextActive
            ]}>
              {type.label}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );

  // 渲染活动卡片
  const renderActivityCard = ({ item }: { item: GroupActivity }) => (
    <GroupCard
      activity={item}
      onPress={handleActivityPress}
      onAvatarPress={(user) => {
        console.log('查看用户资料:', user.nickname);
        // 可以导航到用户详情页面
      }}
    />
  );

  // 主渲染
  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.BACKGROUND} />
      
      {renderHeader()}
      {renderQuickFilters()}
      
      <FlatList
        ref={flatListRef}
        data={filteredActivities}
        keyExtractor={(item) => item.id}
        renderItem={renderActivityCard}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={state.refreshing}
            onRefresh={handleRefresh}
            colors={[COLORS.PRIMARY]}
            tintColor={COLORS.PRIMARY}
          />
        }
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.3}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>{TEXTS.STATUS.EMPTY}</Text>
          </View>
        }
      />
    </View>
  );
};

// ══════════════════════════════════════════════════════════════
// 6. Styles (60-80行)
// ══════════════════════════════════════════════════════════════
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.BACKGROUND,
  },
  
  // 头部样式
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.LG,
    paddingBottom: SPACING.MD,
    backgroundColor: COLORS.CARD_BACKGROUND,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.BORDER_LIGHT,
  },
  backButton: {
    padding: SPACING.SM,
  },
  backText: {
    fontSize: FONT_SIZE.LG,
    color: COLORS.TEXT_PRIMARY,
  },
  headerTitle: {
    fontSize: FONT_SIZE.LG,
    fontWeight: 'bold',
    color: COLORS.TEXT_PRIMARY,
  },
  publishButton: {
    backgroundColor: COLORS.PRIMARY,
    paddingHorizontal: SPACING.MD,
    paddingVertical: SPACING.SM,
    borderRadius: BORDER_RADIUS.LG,
  },
  publishText: {
    color: COLORS.TEXT_WHITE,
    fontSize: FONT_SIZE.SM,
    fontWeight: '600',
  },

  // 筛选样式
  filterContainer: {
    backgroundColor: COLORS.CARD_BACKGROUND,
    paddingVertical: SPACING.SM,
  },
  filterScrollContent: {
    paddingHorizontal: SPACING.LG,
  },
  filterTag: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.BACKGROUND,
    paddingHorizontal: SPACING.MD,
    paddingVertical: SPACING.SM,
    borderRadius: BORDER_RADIUS.LG,
    marginRight: SPACING.SM,
  },
  filterTagText: {
    fontSize: FONT_SIZE.SM,
    color: COLORS.TEXT_PRIMARY,
    marginRight: SPACING.XS,
  },
  filterArrow: {
    fontSize: FONT_SIZE.XS,
    color: COLORS.TEXT_SECONDARY,
  },
  advancedFilterButton: {
    backgroundColor: COLORS.BACKGROUND,
    paddingHorizontal: SPACING.MD,
    paddingVertical: SPACING.SM,
    borderRadius: BORDER_RADIUS.LG,
  },
  advancedFilterText: {
    fontSize: FONT_SIZE.SM,
    color: COLORS.TEXT_PRIMARY,
  },
  
  typeScrollContent: {
    paddingHorizontal: SPACING.LG,
    marginTop: SPACING.SM,
  },
  typeTag: {
    paddingHorizontal: SPACING.MD,
    paddingVertical: SPACING.SM,
    borderRadius: BORDER_RADIUS.LG,
    marginRight: SPACING.SM,
    backgroundColor: COLORS.BACKGROUND,
  },
  typeTagActive: {
    backgroundColor: COLORS.PRIMARY,
  },
  typeTagText: {
    fontSize: FONT_SIZE.SM,
    color: COLORS.TEXT_PRIMARY,
  },
  typeTagTextActive: {
    color: COLORS.TEXT_WHITE,
  },

  // 列表样式
  listContent: {
    padding: SPACING.LG,
  },
  

  // 空状态样式
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: SPACING.XXXL,
  },
  emptyText: {
    fontSize: FONT_SIZE.MD,
    color: COLORS.TEXT_SECONDARY,
  },
});

// ══════════════════════════════════════════════════════════════
// 7. Exports (5-10行)
// ══════════════════════════════════════════════════════════════
export default GroupCenterScreen;
