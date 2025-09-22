/**
 * 地区选择模块 - 页面主状态管理
 * 
 * TOC (快速跳转):
 * [1] Imports
 * [2] Types & Schema  
 * [3] Constants & Config
 * [4] Utils & Helpers
 * [5] State Management
 * [6] Domain Logic
 * [7] UI Components & Rendering
 * [8] Exports
 */

// #region 1. Imports
import { useState, useCallback, useEffect } from 'react';
import { Platform, PermissionsAndroid, Alert } from 'react-native';
import type {
  LocationSelectorState,
  RegionInfo,
  CurrentLocationInfo,
  LocationPermissionStatus,
} from './types';
import {
  ERROR_MESSAGES,
  API_CONFIG,
  STORAGE_KEYS,
} from './constants';
// #endregion

// #region 2. Types & Schema
interface UseHomeLocationProps {
  initialLocation?: CurrentLocationInfo;
}

interface UseHomeLocationReturn {
  state: LocationSelectorState;
  actions: {
    handleGetCurrentLocation: () => Promise<void>;
    handleSelectRegion: (region: RegionInfo) => Promise<void>;
    handleSearch: (query: string) => void;
    handleAlphabetPress: (letter: string) => void;
    resetState: () => void;
  };
}
// #endregion

// #region 3. Constants & Config
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
  
  // 热门城市
  { code: '440300', name: '深圳', pinyin: 'shenzhen', firstLetter: 'S', level: 'city', hot: true },
  { code: '310100', name: '上海', pinyin: 'shanghai', firstLetter: 'S', level: 'city', hot: true },
  { code: '330100', name: '杭州', pinyin: 'hangzhou', firstLetter: 'H', level: 'city', hot: true },
  { code: '440100', name: '广州', pinyin: 'guangzhou', firstLetter: 'G', level: 'city', hot: true },
];

const HOT_CITIES_FROM_REGIONS = MOCK_REGIONS.filter(region => region.hot);
// #endregion

// #region 4. Utils & Helpers
// 防抖函数
const debounce = (func: Function, delay: number) => {
  let timeoutId: number;
  return (...args: any[]) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func.apply(null, args), delay);
  };
};

// 获取定位权限
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
  
  return true;
};

// 获取当前位置
const getCurrentLocation = (): Promise<CurrentLocationInfo> => {
  return new Promise((resolve, reject) => {
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
    }, 1000);
  });
};

// 存储最近访问
const saveRecentLocation = async (location: RegionInfo): Promise<void> => {
  try {
    console.log('Save recent location:', location);
  } catch (error) {
    console.error('Failed to save recent location:', error);
  }
};
// #endregion

// #region 5. State Management
const useHomeLocation = ({ initialLocation }: UseHomeLocationProps = {}): UseHomeLocationReturn => {
  const [state, setState] = useState<LocationSelectorState>({
    regions: MOCK_REGIONS,
    hotCities: HOT_CITIES_FROM_REGIONS,
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

  // 重置状态
  const resetState = useCallback(() => {
    setState(prev => ({
      ...prev,
      selectedLocation: null,
      searchQuery: '',
      activeAlphabet: null,
      error: null,
      locationError: null,
    }));
  }, []);

  return {
    state,
    actions: {
      handleGetCurrentLocation,
      handleSelectRegion,
      handleSearch,
      handleAlphabetPress,
      resetState,
    },
  };
};
// #endregion

// #region 6. Domain Logic
// 业务逻辑在上面的 useHomeLocation hook 中实现
// #endregion

// #region 7. UI Components & Rendering
// 此文件为状态管理文件，不包含UI组件
// #endregion

// #region 8. Exports
export default useHomeLocation;
export type { UseHomeLocationProps, UseHomeLocationReturn };
// #endregion
