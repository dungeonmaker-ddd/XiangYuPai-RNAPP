/**
 * 🏠 首页模块 - 基于PGAS栅格系统的精确UI架构设计
 *
 * TOC (quick jump):
 * [1] Imports & Types (50-70行)
 * [2] Constants & Config (40-60行)
 * [3] Utils & Helpers (60-80行)
 * [4] State Management (80-120行)
 * [5] Subcomponents (200-280行)
 * [6] Main Component (120-160行)
 * [7] Styles (80-120行)
 * [8] Exports (10-20行)
 */

// ══════════════════════════════════════════════════════════════
// 1. Imports & Types (50-70行)
// ══════════════════════════════════════════════════════════════
import React, { useState, useCallback, useEffect, useMemo } from 'react';
import {
  View,
  ScrollView,
  Text,
  TouchableOpacity,
  FlatList,
  Image,
  StatusBar,
  ImageBackground,
  TextInput,
  ActivityIndicator,
  StyleSheet,
  Dimensions,
  Platform,
  Linking,
  RefreshControl,
} from 'react-native';
// 暂时移除LinearGradient，使用CSS渐变替代方案
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';

// 注意：此组件现在作为独立页面使用，不再依赖导航参数

// 导入 UI 模块组件
import { HeaderSection } from './components/HeaderSection';
import { GameBanner } from './components/GameBanner';
import { FunctionGrid } from './components/FunctionGrid';
import { LimitedOffers } from './components/LimitedOffers';
import { TeamPartySection } from './components/TeamPartySection';
import { FilterTabs } from './components/FilterTabs';
import { UserCard as UserCardComponent } from './components/UserCard';

// 导入常量
import { COLORS, SCREEN_WIDTH, SCREEN_HEIGHT } from './constants';
import type { UserCard, FunctionItem, LocationInfo } from './types';

// 导入地区选择模块类型
import type { RegionInfo } from '../location/types';

// ICON_MAP 已移动到 ./components/FunctionGrid.tsx

// 类型定义
interface HomeScreenProps {
  // 导航支持 - 可选，用于支持地区选择等功能
  navigation?: {
    navigate: (screen: string, params?: any) => void;
    goBack: () => void;
  };
}

// UserCard, FunctionItem, LocationInfo 类型已移动到 ./types.ts

// ══════════════════════════════════════════════════════════════
// 2. Constants & Config (40-60行)
// ══════════════════════════════════════════════════════════════
// SCREEN_WIDTH, SCREEN_HEIGHT, COLORS, GRID_CONFIG 已移动到 ./constants.ts
// FILTER_TABS 已移动到 ./components/FilterTabs.tsx

// FUNCTION_ITEMS 已移动到 ./components/FunctionGrid.tsx

// ══════════════════════════════════════════════════════════════
// 3. Utils & Helpers (60-80行)
// ══════════════════════════════════════════════════════════════
// formatDistance, truncateText, getStatusColor, getStatusText 已移动到 ./components/UserCard.tsx

const debounce = (func: Function, delay: number) => {
  let timeoutId: number;
  return (...args: any[]) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func.apply(null, args), delay);
  };
};

// 真实Mock数据
const MOCK_USERNAMES = [
  '小雪儿', '甜心宝贝', '柠檬小姐', '樱花妹妹', '蜜桃公主', 
  '星空少女', '阳光美眉', '薄荷清香', '玫瑰花开', '梦幻天使',
  '可爱多多', '糖果女孩', '清纯佳人', '温柔小猫', '活力少女',
  '优雅女神', '甜美公主', '青春靓丽', '魅力四射', '完美女神'
];

const MOCK_BIOS = [
  '喜欢旅行和美食，寻找有趣的灵魂~',
  '热爱生活，享受每一个美好时刻',
  '爱笑的女孩运气都不会太差哦',
  '专业陪玩，让你的生活更精彩',
  '温柔体贴，愿意倾听你的故事',
  '活泼开朗，带给你满满正能量',
  '这个家伙很神秘，没有填写简介',
  '喜欢音乐和电影，我们聊聊吧',
  '高颜值小姐姐在线等你撩~',
  '甜美可人，期待与你的邂逅'
];

const MOCK_SERVICES = [
  ['模特', '拍照', '陪逛'],
  ['K歌', '聊天', '游戏'],
  ['按摩', '足疗', 'spa'],
  ['陪玩', '王者荣耀', '和平精英'],
  ['探店', '美食', '咖啡'],
  ['私影', '写真', '摄影'],
  ['台球', '桌游', '娱乐'],
  ['喝酒', '聚会', '夜生活']
];

const MOCK_REGIONS = [
  { name: '南山区', distance: [0.5, 3] },
  { name: '福田区', distance: [2, 8] },
  { name: '罗湖区', distance: [3, 12] },
  { name: '宝安区', distance: [5, 15] },
  { name: '龙岗区', distance: [8, 20] }
];

// 根据筛选条件生成Mock数据
const generateMockUsers = (filter: string = 'nearby', region?: string): UserCard[] => {
  const baseCount = 20;
  const users: UserCard[] = [];
  
  for (let i = 0; i < baseCount; i++) {
    const selectedRegion = region ? 
      MOCK_REGIONS.find(r => r.name === region) : 
      MOCK_REGIONS[i % MOCK_REGIONS.length];
    
    const [minDist, maxDist] = selectedRegion?.distance || [0.5, 10];
    let distance = minDist + Math.random() * (maxDist - minDist);
    
    // 根据筛选类型调整数据
    let status: UserCard['status'] = 'offline';
    let lastActiveTime = Date.now() - Math.random() * 24 * 60 * 60 * 1000; // 24小时内
    
    switch (filter) {
      case 'nearby':
        distance = Math.random() * 5; // 附近限制在5km内
        status = Math.random() > 0.3 ? 'online' : Math.random() > 0.5 ? 'available' : 'offline';
        break;
      case 'recommend':
        status = Math.random() > 0.2 ? 'online' : 'available'; // 推荐多在线用户
        lastActiveTime = Date.now() - Math.random() * 2 * 60 * 60 * 1000; // 2小时内活跃
        break;
      case 'latest':
        status = Math.random() > 0.1 ? 'online' : 'available'; // 最新多为新用户
        lastActiveTime = Date.now() - Math.random() * 30 * 60 * 1000; // 30分钟内
        break;
    }

    const user: UserCard = {
      id: `user-${filter}-${i + 1}`,
      avatar: `https://picsum.photos/100/100?random=${i + 1}&sig=${filter}`,
      username: MOCK_USERNAMES[i % MOCK_USERNAMES.length],
      age: 18 + (i % 12),
      bio: MOCK_BIOS[i % MOCK_BIOS.length],
      services: MOCK_SERVICES[i % MOCK_SERVICES.length],
      distance: Math.round(distance * 10) / 10,
      status,
      photos: Array.from({ length: Math.min(9, 3 + (i % 7)) }, (_, j) => 
        `https://picsum.photos/200/200?random=${i * 10 + j + 100}&sig=${filter}`
      ),
      price: i % 3 === 0 ? `¥${80 + i * 15}/小时` : undefined,
      region: selectedRegion?.name || '南山区',
      lastActive: lastActiveTime,
      rating: 4.2 + Math.random() * 0.8, // 4.2-5.0评分
      reviewCount: Math.floor(Math.random() * 200) + 10,
    };
    
    users.push(user);
  }
  
  // 根据筛选类型排序
  switch (filter) {
    case 'nearby':
      return users.sort((a, b) => a.distance - b.distance);
    case 'recommend':
      return users.sort((a, b) => (b.rating || 0) - (a.rating || 0));
    case 'latest':
      return users.sort((a, b) => (b.lastActive || 0) - (a.lastActive || 0));
    default:
      return users;
  }
};

// ══════════════════════════════════════════════════════════════
// 4. State Management (80-120行)
// ══════════════════════════════════════════════════════════════
const useHomeScreenState = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('nearby');
  const [activeRegion, setActiveRegion] = useState('全部');
  const [users, setUsers] = useState<UserCard[]>([]);
  const [limitedOffers, setLimitedOffers] = useState<UserCard[]>([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [location, setLocation] = useState<LocationInfo>({ city: '深圳' });

  // 模拟数据加载
  const loadUsers = useCallback(async () => {
    setLoading(true);
    try {
      // 模拟API调用延迟
      await new Promise<void>(resolve => setTimeout(() => resolve(), 800));
      const regionFilter = activeRegion === '全部' ? undefined : activeRegion;
      const mockUsers = generateMockUsers(activeFilter, regionFilter);
      setUsers(mockUsers);
    } catch (error) {
      console.error('Failed to load users:', error);
    } finally {
      setLoading(false);
    }
  }, [activeFilter, activeRegion]);

  // 处理地区选择结果
  const handleLocationSelected = useCallback((selectedRegion: RegionInfo) => {
    setLocation({
      city: selectedRegion.name,
      district: selectedRegion.level === 'district' ? selectedRegion.name : undefined,
    });
    // 重新加载基于新位置的数据
    loadUsers();
  }, [loadUsers]);

  const loadLimitedOffers = useCallback(async () => {
    try {
      const mockOffers = generateMockUsers().slice(0, 5);
      setLimitedOffers(mockOffers);
    } catch (error) {
      console.error('Failed to load limited offers:', error);
    }
  }, []);

  const handleSearch = useMemo(
    () => debounce(async (query: string) => {
      if (query.trim()) {
        const regionFilter = activeRegion === '全部' ? undefined : activeRegion;
        const allUsers = generateMockUsers(activeFilter, regionFilter);
        const filteredUsers = allUsers.filter(user =>
          user.username.includes(query) || 
          user.services.some((service: string) => service.includes(query)) ||
          user.bio.includes(query)
        );
        setUsers(filteredUsers);
      } else {
        loadUsers();
      }
    }, 300),
    [loadUsers, activeFilter, activeRegion]
  );

  const handleRefresh = useCallback(() => {
    setRefreshing(true);
    Promise.all([loadUsers(), loadLimitedOffers()]).finally(() => {
      setRefreshing(false);
    });
  }, [loadUsers, loadLimitedOffers]);

  useEffect(() => {
    loadUsers();
    loadLimitedOffers();
  }, [loadUsers, loadLimitedOffers]);

  return {
    searchQuery,
    setSearchQuery,
    activeFilter,
    setActiveFilter,
    activeRegion,
    setActiveRegion,
    users,
    limitedOffers,
    loading,
    refreshing,
    location,
    setLocation,
    handleLocationSelected,
    handleSearch,
    handleRefresh,
  };
};

// ══════════════════════════════════════════════════════════════
// 5. Subcomponents (200-280行)
// ══════════════════════════════════════════════════════════════

// HeaderSection 组件已拆分到 ./components/HeaderSection.tsx

// GameBanner 组件已拆分到 ./components/GameBanner.tsx

// FunctionGrid 组件已拆分到 ./components/FunctionGrid.tsx

// LimitedOffers 组件已拆分到 ./components/LimitedOffers.tsx

// TeamPartySection 组件已拆分到 ./components/TeamPartySection.tsx

// FilterTabs 组件已拆分到 ./components/FilterTabs.tsx

// UserCard 组件已拆分到 ./components/UserCard.tsx

// 注意：底部导航已提升到全局导航模块

// ══════════════════════════════════════════════════════════════
// 6. Main Component (120-160行)
// ══════════════════════════════════════════════════════════════
const HomeScreen: React.FC<HomeScreenProps> = ({ navigation }) => {
  const {
    searchQuery,
    setSearchQuery,
    activeFilter,
    setActiveFilter,
    activeRegion,
    setActiveRegion,
    users,
    limitedOffers,
    loading,
    refreshing,
    location,
    handleLocationSelected,
    handleSearch,
    handleRefresh,
  } = useHomeScreenState();

  const handleUserPress = useCallback((user: UserCard) => {
    // navigation.navigate('UserDetail', { userId: user.id });
    console.log('Navigate to user detail:', user.id);
  }, []);

  const handleFunctionPress = useCallback((functionId: string) => {
    // navigation.navigate('FunctionDetail', { functionId });
    console.log('Navigate to function detail:', functionId);
  }, []);

  const handleLocationPress = useCallback(() => {
    if (navigation) {
      navigation.navigate('LocationSelector', {
        currentLocation: {
          city: location.city,
          district: location.district,
        },
        onLocationSelected: handleLocationSelected,
      });
    } else {
      // 如果没有导航，则显示提示或使用其他方式
      console.log('Open location selector - navigation not available');
      console.log('Current location:', location);
    }
  }, [navigation, location, handleLocationSelected]);

  const handleMoreTeamPartyPress = useCallback(() => {
    if (navigation) {
      navigation.navigate('GroupCenter');
    } else {
      console.log('Navigate to group center (navigation not available)');
    }
  }, [navigation]);

  const handleGameBannerPress = useCallback(() => {
    Linking.openURL('https://apps.apple.com/app/example');
  }, []);

  const handleTeamPartyPress = useCallback(() => {
    if (navigation) {
      navigation.navigate('GroupCenter');
    } else {
      console.log('Navigate to group center (navigation not available)');
    }
  }, [navigation]);

  const handleMoreOffersPress = useCallback(() => {
    // navigation.navigate('LimitedOffers');
    console.log('Navigate to more offers');
  }, []);

  const handleSearchPress = useCallback(() => {
    if (navigation) {
      navigation.navigate('Search');
    } else {
      console.log('Navigate to search - navigation not available');
    }
  }, [navigation]);


  const renderUserItem = useCallback(({ item }: { item: UserCard }) => (
    <UserCardComponent user={item} onPress={() => handleUserPress(item)} />
  ), [handleUserPress]);

  const renderListHeader = useCallback(() => (
    <ImageBackground
      source={require('../../../assets/images/backgrounds/linearGradint.png')}
      style={{ flex: 1, marginTop: -44 }}
      resizeMode="cover"
    >
      <View style={{ backgroundColor: 'transparent', paddingTop: 44 }}>
        <GameBanner onPress={handleGameBannerPress} />
        <FunctionGrid onFunctionPress={handleFunctionPress} />
        <LimitedOffers
          offers={limitedOffers}
          onUserPress={handleUserPress}
          onMorePress={handleMoreOffersPress}
        />
        <TeamPartySection 
          onPress={handleTeamPartyPress}
          onMorePress={handleMoreTeamPartyPress}
        />
        <FilterTabs
          activeTab={activeFilter}
          onTabPress={setActiveFilter}
          activeRegion={activeRegion}
          onRegionPress={setActiveRegion}
        />
      </View>
    </ImageBackground>
  ), [
    handleGameBannerPress,
    handleFunctionPress,
    limitedOffers,
    handleUserPress,
    handleMoreOffersPress,
    handleTeamPartyPress,
    activeFilter,
    setActiveFilter,
  ]);

  const renderListEmpty = useCallback(() => {
    if (loading) {
      return (
        <View style={[styles.center, { padding: 40 }]}>
          <ActivityIndicator size="large" color={COLORS.primary} />
          <Text style={[styles.textGray, { marginTop: 12 }]}>加载中...</Text>
        </View>
      );
    }
    return (
      <View style={[styles.center, { padding: 40 }]}>
        <Text style={[styles.textGray, { fontSize: 16 }]}>暂无用户</Text>
      </View>
    );
  }, [loading]);

  return (
    <View style={styles.container}>
      {/* 渐变背景图片 */}
      <ImageBackground
        source={require('../../../assets/images/backgrounds/linearGradint.png')}
        style={styles.gradientBackground}
        resizeMode="cover"
      />
      
      {/* L1.1: 顶部导航区域 */}
      <HeaderSection
        location={location}
        onLocationPress={handleLocationPress}
        onSearch={(query: string) => {
          setSearchQuery(query);
          handleSearch(query);
        }}
        onSearchPress={handleSearchPress}
      />

      {/* L1.2-L1.7: 主内容区域 - 使用FlatList避免嵌套滚动 */}
      <FlatList
        data={users}
        keyExtractor={(item) => item.id}
        renderItem={renderUserItem}
        ListHeaderComponent={renderListHeader}
        ListEmptyComponent={renderListEmpty}
        contentContainerStyle={styles.flatListContainer}
        showsVerticalScrollIndicator={false}
        style={{ flex: 1, backgroundColor: COLORS.gray100 }}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            colors={[COLORS.primary]}
            tintColor={COLORS.primary}
          />
        }
      />

    </View>
  );
};

// ══════════════════════════════════════════════════════════════
// 7. 公共样式 (精简版)
// ══════════════════════════════════════════════════════════════
const styles = StyleSheet.create({
  // 基础布局
  container: {
    flex: 1,
    position: 'relative',
  },
  gradientBackground: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: -1,
  },

  // 公共布局样式
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rowSpaceBetween: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  column: {
    flexDirection: 'column',
  },
  center: {
    alignItems: 'center',
    justifyContent: 'center',
  },

  // 公共文字样式
  text: {
    fontSize: 14,
    color: COLORS.gray900,
  },
  textWhite: {
    color: COLORS.white,
  },
  textGray: {
    color: COLORS.gray500,
  },
  textBold: {
    fontWeight: '600',
  },
  textCenter: {
    textAlign: 'center',
  },

  // 公共间距
  padding16: {
    padding: 16,
  },
  paddingH16: {
    paddingHorizontal: 16,
  },
  paddingV12: {
    paddingVertical: 12,
  },
  margin8: {
    margin: 8,
  },
  marginV8: {
    marginVertical: 8,
  },

  // 公共边框和阴影
  borderRadius12: {
    borderRadius: 12,
  },
  shadow: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 2,
  },

  // 特殊样式保留
  flatListContainer: {
    flexGrow: 1,
  },
});

// ══════════════════════════════════════════════════════════════
// 8. Exports (10-20行)
// ══════════════════════════════════════════════════════════════
export default HomeScreen;
export type { HomeScreenProps };
// UserCard, FunctionItem, LocationInfo, COLORS, GRID_CONFIG 已移动到 ./components/ 和 ./types.ts 中