/**
 * 📍 地区选择模块 - 基于标准化架构的600行模块设计
 *
 * TOC (quick jump):
 * [1] Imports & Types (30-50行)
 * [2] Constants & Config (40-60行)
 * [3] Utils & Helpers (80-120行)
 * [4] State Management (80-120行)
 * [5] Subcomponents (150-200行)
 * [6] Main Component (120-160行)
 * [7] Styles (60-90行)
 * [8] Exports (10-20行)
 */

// ══════════════════════════════════════════════════════════════
// 1. Imports & Types (30-50行)
// ══════════════════════════════════════════════════════════════
import React, { useState, useCallback, useEffect, useMemo, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  ScrollView,
  TextInput,
  Alert,
  Platform,
  PermissionsAndroid,
  ActivityIndicator,
  StyleSheet,
  Dimensions,
  StatusBar,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';

// 导入类型和常量
import type {
  LocationSelectorScreenProps,
  LocationSelectorState,
  RegionInfo,
  CurrentLocationInfo,
  AlphabetItem,
  LocationPermissionStatus,
} from './types';
import {
  COLORS,
  SPACING,
  SIZES,
  FONTS,
  HOT_CITIES,
  ALPHABET,
  API_CONFIG,
  ERROR_MESSAGES,
  SUCCESS_MESSAGES,
  PLACEHOLDER_TEXTS,
  STORAGE_KEYS,
} from './constants';

// ══════════════════════════════════════════════════════════════
// 2. Constants & Config (40-60行)
// ══════════════════════════════════════════════════════════════
const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

// 模拟地区数据 - 实际项目中应该从API获取
const MOCK_REGIONS: RegionInfo[] = [
  // A
  { code: '513200', name: '阿坝藏族羌族自治州', pinyin: 'aba', firstLetter: 'A', level: 'city' },
  { code: '652900', name: '阿克苏地区', pinyin: 'akesu', firstLetter: 'A', level: 'city' },
  { code: '152900', name: '阿拉善盟', pinyin: 'alashan', firstLetter: 'A', level: 'city' },
  { code: '230700', name: '安达市', pinyin: 'anda', firstLetter: 'A', level: 'city' },
  { code: '340800', name: '安庆市', pinyin: 'anqing', firstLetter: 'A', level: 'city' },
  
  // B
  { code: '110100', name: '北京', pinyin: 'beijing', firstLetter: 'B', level: 'city', hot: true },
  { code: '130600', name: '保定市', pinyin: 'baoding', firstLetter: 'B', level: 'city' },
  { code: '220200', name: '白城市', pinyin: 'baicheng', firstLetter: 'B', level: 'city' },
  { code: '450500', name: '北海市', pinyin: 'beihai', firstLetter: 'B', level: 'city' },
  { code: '210300', name: '本溪市', pinyin: 'benxi', firstLetter: 'B', level: 'city' },
  
  // C
  { code: '510100', name: '成都', pinyin: 'chengdu', firstLetter: 'C', level: 'city', hot: true },
  { code: '500100', name: '重庆', pinyin: 'chongqing', firstLetter: 'C', level: 'city', hot: true },
  { code: '220100', name: '长春市', pinyin: 'changchun', firstLetter: 'C', level: 'city' },
  { code: '430100', name: '长沙市', pinyin: 'changsha', firstLetter: 'C', level: 'city' },
  { code: '130900', name: '沧州市', pinyin: 'cangzhou', firstLetter: 'C', level: 'city' },
  
  // D
  { code: '210200', name: '大连市', pinyin: 'dalian', firstLetter: 'D', level: 'city' },
  { code: '370200', name: '东营市', pinyin: 'dongying', firstLetter: 'D', level: 'city' },
  { code: '511700', name: '达州市', pinyin: 'dazhou', firstLetter: 'D', level: 'city' },
  { code: '230600', name: '大庆市', pinyin: 'daqing', firstLetter: 'D', level: 'city' },
  
  // 更多城市...
  { code: '440300', name: '深圳', pinyin: 'shenzhen', firstLetter: 'S', level: 'city', hot: true },
  { code: '310100', name: '上海', pinyin: 'shanghai', firstLetter: 'S', level: 'city', hot: true },
  { code: '330100', name: '杭州', pinyin: 'hangzhou', firstLetter: 'H', level: 'city', hot: true },
  { code: '440100', name: '广州', pinyin: 'guangzhou', firstLetter: 'G', level: 'city', hot: true },
];

// ══════════════════════════════════════════════════════════════
// 3. Utils & Helpers (80-120行)
// ══════════════════════════════════════════════════════════════
// 防抖函数
const debounce = (func: Function, delay: number) => {
  let timeoutId: number;
  return (...args: any[]) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func.apply(null, args), delay);
  };
};

// 获取定位权限 - 简化版本，实际项目中可以添加更完整的权限处理
const requestLocationPermission = async (): Promise<boolean> => {
  if (Platform.OS === 'android') {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        {
          title: '位置权限',
          message: '应用需要访问您的位置信息来提供更好的服务',
          buttonNeutral: '稍后询问',
          buttonNegative: '拒绝',
          buttonPositive: '允许',
        }
      );
      return granted === PermissionsAndroid.RESULTS.GRANTED;
    } catch (err) {
      return false;
    }
  }
  
  // iOS 会在第一次使用时自动请求权限
  return true;
};

// 获取当前位置 - 使用内置API
const getCurrentLocation = (): Promise<CurrentLocationInfo> => {
  return new Promise((resolve, reject) => {
    // 对于演示目的，我们直接返回模拟位置
    // 在实际项目中，可以使用 navigator.geolocation 或第三方库
    setTimeout(() => {
      const mockLocation: CurrentLocationInfo = {
        city: '深圳',
        district: '南山区',
        coordinates: {
          latitude: 22.5431,
          longitude: 114.0579,
        },
        accuracy: 10,
        timestamp: Date.now(),
      };
      resolve(mockLocation);
    }, 1000); // 模拟网络请求延迟
  });
};

// 搜索地区
const searchRegions = (query: string, regions: RegionInfo[]): RegionInfo[] => {
  if (!query.trim()) return [];
  
  const lowerQuery = query.toLowerCase();
  return regions.filter(region => 
    region.name.toLowerCase().includes(lowerQuery) ||
    region.pinyin.toLowerCase().includes(lowerQuery) ||
    region.firstLetter.toLowerCase() === lowerQuery
  );
};

// 按字母分组地区
const groupRegionsByAlphabet = (regions: RegionInfo[]): AlphabetItem[] => {
  const grouped = regions.reduce((acc, region) => {
    const letter = region.firstLetter;
    if (!acc[letter]) {
      acc[letter] = [];
    }
    acc[letter].push(region);
    return acc;
  }, {} as Record<string, RegionInfo[]>);

  return ALPHABET.map((letter, index) => ({
    letter,
    regions: grouped[letter] || [],
    sectionIndex: index,
  })).filter(item => item.regions.length > 0);
};

// 存储最近访问
const saveRecentLocation = async (location: RegionInfo): Promise<void> => {
  try {
    // 实际项目中使用 AsyncStorage
    console.log('Save recent location:', location);
  } catch (error) {
    console.error('Failed to save recent location:', error);
  }
};

// ══════════════════════════════════════════════════════════════
// 4. State Management (80-120行)
// ══════════════════════════════════════════════════════════════
const useLocationSelectorState = (initialLocation?: CurrentLocationInfo) => {
  const [state, setState] = useState<LocationSelectorState>({
    regions: MOCK_REGIONS,
    hotCities: HOT_CITIES.map(city => ({ ...city, level: 'city' as const })),
    recentLocations: [],
    currentLocation: initialLocation || null,
    selectedLocation: null,
    locationPermission: 'undetermined',
    loading: false,
    locating: false,
    searchQuery: '',
    activeAlphabet: null,
    error: null,
    locationError: null,
  });

  // 获取当前定位
  const handleGetCurrentLocation = useCallback(async () => {
    setState(prev => ({ ...prev, locating: true, locationError: null }));
    
    try {
      const hasPermission = await requestLocationPermission();
      if (!hasPermission) {
        throw new Error(ERROR_MESSAGES.locationDenied);
      }
      
      const location = await getCurrentLocation();
      setState(prev => ({
        ...prev,
        currentLocation: location,
        locationPermission: 'granted',
        locating: false,
      }));
    } catch (error) {
      setState(prev => ({
        ...prev,
        locationError: error instanceof Error ? error.message : ERROR_MESSAGES.locationUnknown,
        locationPermission: 'denied',
        locating: false,
      }));
    }
  }, []);

  // 选择地区
  const handleSelectRegion = useCallback(async (region: RegionInfo) => {
    setState(prev => ({ ...prev, selectedLocation: region }));
    await saveRecentLocation(region);
  }, []);

  // 搜索地区
  const handleSearch = useCallback(
    debounce((query: string) => {
      setState(prev => ({ ...prev, searchQuery: query }));
    }, 300),
    []
  );

  // 字母导航
  const handleAlphabetPress = useCallback((letter: string) => {
    setState(prev => ({ ...prev, activeAlphabet: letter }));
  }, []);

  return {
    state,
    setState,
    handleGetCurrentLocation,
    handleSelectRegion,
    handleSearch,
    handleAlphabetPress,
  };
};

// ══════════════════════════════════════════════════════════════
// 5. Subcomponents (150-200行)
// ══════════════════════════════════════════════════════════════

// 当前定位卡片
const CurrentLocationCard: React.FC<{
  location: CurrentLocationInfo | null;
  loading: boolean;
  error: string | null;
  onPress: () => void;
  onLocationPress: () => void;
}> = ({ location, loading, error, onPress, onLocationPress }) => (
  <View style={styles.section}>
    <Text style={styles.sectionTitle}>定位 / 最近访问</Text>
    <TouchableOpacity
      style={[styles.locationCard, location && styles.locationCardActive]}
      onPress={location ? onPress : onLocationPress}
      activeOpacity={0.7}
    >
      <View style={styles.locationCardContent}>
        <View style={styles.locationIcon}>
          <Text style={styles.locationIconText}>📍</Text>
        </View>
        <View style={styles.locationInfo}>
          {loading ? (
            <ActivityIndicator size="small" color={COLORS.primary} />
          ) : error ? (
            <Text style={styles.locationError}>{error}</Text>
          ) : location ? (
            <>
              <Text style={styles.locationName}>{location.city}</Text>
              {location.district && (
                <Text style={styles.locationDistrict}>{location.district}</Text>
              )}
            </>
          ) : (
            <Text style={styles.locationPlaceholder}>点击获取当前位置</Text>
          )}
        </View>
        {location && (
          <View style={styles.locationStatus}>
            <Text style={styles.locationStatusText}>✓</Text>
          </View>
        )}
      </View>
    </TouchableOpacity>
  </View>
);

// 热门城市网格
const HotCitiesGrid: React.FC<{
  cities: RegionInfo[];
  selectedLocation: RegionInfo | null;
  onCityPress: (city: RegionInfo) => void;
}> = ({ cities, selectedLocation, onCityPress }) => (
  <View style={styles.section}>
    <Text style={styles.sectionTitle}>热门城市</Text>
    <View style={styles.hotCitiesGrid}>
      {cities.map((city) => (
        <TouchableOpacity
          key={city.code}
          style={[
            styles.hotCityCard,
            selectedLocation?.code === city.code && styles.hotCityCardSelected,
          ]}
          onPress={() => onCityPress(city)}
          activeOpacity={0.7}
        >
          <Text
            style={[
              styles.hotCityText,
              selectedLocation?.code === city.code && styles.hotCityTextSelected,
            ]}
          >
            {city.name}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  </View>
);

// 字母索引
const AlphabetIndex: React.FC<{
  activeAlphabet: string | null;
  onAlphabetPress: (letter: string) => void;
}> = ({ activeAlphabet, onAlphabetPress }) => (
  <View style={styles.alphabetContainer}>
    {ALPHABET.map((letter) => (
      <TouchableOpacity
        key={letter}
        style={[
          styles.alphabetItem,
          activeAlphabet === letter && styles.alphabetItemActive,
        ]}
        onPress={() => onAlphabetPress(letter)}
        activeOpacity={0.7}
      >
        <Text
          style={[
            styles.alphabetText,
            activeAlphabet === letter && styles.alphabetTextActive,
          ]}
        >
          {letter}
        </Text>
      </TouchableOpacity>
    ))}
  </View>
);

// 地区列表项
const RegionListItem: React.FC<{
  region: RegionInfo;
  selected: boolean;
  onPress: (region: RegionInfo) => void;
}> = ({ region, selected, onPress }) => (
  <TouchableOpacity
    style={[styles.regionItem, selected && styles.regionItemSelected]}
    onPress={() => onPress(region)}
    activeOpacity={0.7}
  >
    <Text style={[styles.regionText, selected && styles.regionTextSelected]}>
      {region.name}
    </Text>
    {selected && (
      <Text style={styles.regionSelectedIcon}>✓</Text>
    )}
  </TouchableOpacity>
);

// ══════════════════════════════════════════════════════════════
// 6. Main Component (120-160行)
// ══════════════════════════════════════════════════════════════
const LocationSelectorScreen: React.FC<LocationSelectorScreenProps> = ({
  route,
  navigation,
}) => {
  const safeAreaInsets = useSafeAreaInsets();
  const flatListRef = useRef<FlatList>(null);
  
  const initialLocation = route?.params?.currentLocation;
  const onLocationSelected = route?.params?.onLocationSelected;
  
  const {
    state,
    handleGetCurrentLocation,
    handleSelectRegion,
    handleSearch,
    handleAlphabetPress,
  } = useLocationSelectorState(initialLocation);

  // 处理返回
  const handleGoBack = useCallback(() => {
    navigation?.goBack();
  }, [navigation]);

  // 处理地区选择
  const handleRegionPress = useCallback(async (region: RegionInfo) => {
    await handleSelectRegion(region);
    onLocationSelected?.(region);
    navigation?.goBack();
  }, [handleSelectRegion, onLocationSelected, navigation]);

  // 处理当前定位选择
  const handleCurrentLocationPress = useCallback(() => {
    if (state.currentLocation) {
      const locationAsRegion: RegionInfo = {
        code: 'current',
        name: state.currentLocation.city,
        pinyin: 'current',
        firstLetter: 'C',
        level: 'city',
      };
      handleRegionPress(locationAsRegion);
    }
  }, [state.currentLocation, handleRegionPress]);

  // 字母分组数据
  const alphabetData = useMemo(() => 
    groupRegionsByAlphabet(state.regions), 
    [state.regions]
  );

  // 搜索结果
  const searchResults = useMemo(() => 
    searchRegions(state.searchQuery, state.regions),
    [state.searchQuery, state.regions]
  );

  // 渲染数据
  const renderData = state.searchQuery ? searchResults : state.regions;

  const renderRegionItem = useCallback(({ item }: { item: RegionInfo }) => (
    <RegionListItem
      region={item}
      selected={state.selectedLocation?.code === item.code}
      onPress={handleRegionPress}
    />
  ), [state.selectedLocation, handleRegionPress]);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.background} />
      
      {/* 头部导航 */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={handleGoBack}>
          <Text style={styles.backButtonText}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>定位</Text>
        <View style={styles.headerRight} />
      </View>

      {/* 主要内容 */}
      <View style={styles.content}>
        {/* 当前定位区域 */}
        <CurrentLocationCard
          location={state.currentLocation}
          loading={state.locating}
          error={state.locationError}
          onPress={handleCurrentLocationPress}
          onLocationPress={handleGetCurrentLocation}
        />

        {/* 热门城市 */}
        <HotCitiesGrid
          cities={state.hotCities}
          selectedLocation={state.selectedLocation}
          onCityPress={handleRegionPress}
        />

        {/* 搜索框 */}
        <View style={styles.searchContainer}>
          <TextInput
            style={styles.searchInput}
            placeholder={PLACEHOLDER_TEXTS.search}
            placeholderTextColor={COLORS.textLight}
            value={state.searchQuery}
            onChangeText={handleSearch}
          />
        </View>

        {/* 地区列表 */}
        <View style={styles.regionListContainer}>
          <FlatList
            ref={flatListRef}
            data={renderData}
            keyExtractor={(item) => item.code}
            renderItem={renderRegionItem}
            showsVerticalScrollIndicator={false}
            style={styles.regionList}
          />
          
          {/* 字母索引 */}
          <AlphabetIndex
            activeAlphabet={state.activeAlphabet}
            onAlphabetPress={handleAlphabetPress}
          />
        </View>
      </View>
    </SafeAreaView>
  );
};

// ══════════════════════════════════════════════════════════════
// 7. Styles (60-90行)
// ══════════════════════════════════════════════════════════════
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  
  // 头部样式
  header: {
    height: SIZES.headerHeight,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SPACING.lg,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  backButton: {
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backButtonText: {
    fontSize: FONTS.size.xl,
    color: COLORS.textPrimary,
  },
  headerTitle: {
    flex: 1,
    textAlign: 'center',
    fontSize: FONTS.size.lg,
    fontWeight: '600',
    color: COLORS.textPrimary,
  },
  headerRight: {
    width: 32,
  },
  
  // 内容样式
  content: {
    flex: 1,
  },
  section: {
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
  },
  sectionTitle: {
    fontSize: FONTS.size.md,
    fontWeight: '500',
    color: COLORS.textSecondary,
    marginBottom: SPACING.md,
  },
  
  // 定位卡片
  locationCard: {
    backgroundColor: COLORS.backgroundGray,
    borderRadius: SIZES.radiusMedium,
    padding: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  locationCardActive: {
    borderColor: COLORS.primary,
    backgroundColor: COLORS.selected,
  },
  locationCardContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  locationIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SPACING.md,
  },
  locationIconText: {
    fontSize: FONTS.size.md,
  },
  locationInfo: {
    flex: 1,
  },
  locationName: {
    fontSize: FONTS.size.md,
    fontWeight: '500',
    color: COLORS.textPrimary,
  },
  locationDistrict: {
    fontSize: FONTS.size.sm,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  locationError: {
    fontSize: FONTS.size.sm,
    color: COLORS.error,
  },
  locationPlaceholder: {
    fontSize: FONTS.size.md,
    color: COLORS.textLight,
  },
  locationStatus: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: COLORS.success,
    justifyContent: 'center',
    alignItems: 'center',
  },
  locationStatusText: {
    fontSize: FONTS.size.xs,
    color: COLORS.textWhite,
  },
  
  // 热门城市
  hotCitiesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SPACING.sm,
  },
  hotCityCard: {
    width: SIZES.hotCityCardWidth,
    height: SIZES.hotCityCardHeight,
    backgroundColor: COLORS.backgroundGray,
    borderRadius: SIZES.radiusSmall,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  hotCityCardSelected: {
    backgroundColor: COLORS.selected,
    borderColor: COLORS.primary,
  },
  hotCityText: {
    fontSize: FONTS.size.sm,
    color: COLORS.textPrimary,
  },
  hotCityTextSelected: {
    color: COLORS.primary,
    fontWeight: '500',
  },
  
  // 搜索
  searchContainer: {
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
  },
  searchInput: {
    height: 40,
    backgroundColor: COLORS.backgroundGray,
    borderRadius: SIZES.radiusMedium,
    paddingHorizontal: SPACING.md,
    fontSize: FONTS.size.md,
    color: COLORS.textPrimary,
  },
  
  // 地区列表
  regionListContainer: {
    flex: 1,
    flexDirection: 'row',
  },
  regionList: {
    flex: 1,
  },
  regionItem: {
    height: SIZES.cardHeight,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.lg,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.borderLight,
  },
  regionItemSelected: {
    backgroundColor: COLORS.selected,
  },
  regionText: {
    fontSize: FONTS.size.md,
    color: COLORS.textPrimary,
  },
  regionTextSelected: {
    color: COLORS.primary,
    fontWeight: '500',
  },
  regionSelectedIcon: {
    fontSize: FONTS.size.md,
    color: COLORS.primary,
  },
  
  // 字母索引
  alphabetContainer: {
    width: SIZES.alphabetWidth,
    paddingVertical: SPACING.md,
    alignItems: 'center',
  },
  alphabetItem: {
    height: SIZES.alphabetItemHeight,
    justifyContent: 'center',
    alignItems: 'center',
  },
  alphabetItemActive: {
    backgroundColor: COLORS.primary,
    borderRadius: SIZES.alphabetItemHeight / 2,
    width: SIZES.alphabetItemHeight,
  },
  alphabetText: {
    fontSize: FONTS.size.xs,
    color: COLORS.textSecondary,
  },
  alphabetTextActive: {
    color: COLORS.textWhite,
    fontWeight: '500',
  },
});

// ══════════════════════════════════════════════════════════════
// 8. Exports (10-20行)
// ══════════════════════════════════════════════════════════════
export default LocationSelectorScreen;
export type { LocationSelectorScreenProps };
