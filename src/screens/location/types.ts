/**
 * 地区选择模块 - 类型定义
 */

// 地区信息接口
export interface RegionInfo {
  code: string;          // 地区代码
  name: string;          // 地区名称
  pinyin: string;        // 拼音
  firstLetter: string;   // 首字母
  level: 'province' | 'city' | 'district'; // 层级
  parentCode?: string;   // 父级代码
  hot?: boolean;         // 是否热门城市
  coordinates?: {        // 坐标信息
    latitude: number;
    longitude: number;
  };
}

// 当前位置信息
export interface CurrentLocationInfo {
  city: string;
  district?: string;
  coordinates?: {
    latitude: number;
    longitude: number;
  };
  accuracy?: number;     // 定位精度
  timestamp?: number;    // 定位时间戳
}

// 定位权限状态
export type LocationPermissionStatus = 
  | 'undetermined'       // 未确定
  | 'granted'           // 已授权
  | 'denied'            // 已拒绝
  | 'restricted';       // 受限制

// 页面状态接口
export interface LocationSelectorState {
  // 数据状态
  regions: RegionInfo[];
  hotCities: RegionInfo[];
  recentLocations: RegionInfo[];
  
  // 当前状态
  currentLocation: CurrentLocationInfo | null;
  selectedLocation: RegionInfo | null;
  
  // 权限状态
  locationPermission: LocationPermissionStatus;
  
  // UI状态
  loading: boolean;
  locating: boolean;
  searchQuery: string;
  activeAlphabet: string | null;
  
  // 错误状态
  error: string | null;
  locationError: string | null;
}

// 字母索引项
export interface AlphabetItem {
  letter: string;
  regions: RegionInfo[];
  sectionIndex: number;
}

// 组件Props类型
export interface LocationSelectorScreenProps {
  // 导航参数
  route?: {
    params?: {
      currentLocation?: CurrentLocationInfo;
      onLocationSelected?: (location: RegionInfo) => void;
    };
  };
  navigation?: any;
}

export interface CurrentLocationCardProps {
  location: CurrentLocationInfo | null;
  loading: boolean;
  error: string | null;
  onPress: () => void;
  onLocationPress: () => void;
}

export interface HotCitiesGridProps {
  cities: RegionInfo[];
  selectedLocation: RegionInfo | null;
  onCityPress: (city: RegionInfo) => void;
}

export interface AlphabetIndexProps {
  alphabetData: AlphabetItem[];
  activeAlphabet: string | null;
  onAlphabetPress: (letter: string) => void;
}

export interface RegionListProps {
  regions: RegionInfo[];
  selectedLocation: RegionInfo | null;
  searchQuery: string;
  onRegionPress: (region: RegionInfo) => void;
  onScroll?: (event: any) => void;
}
