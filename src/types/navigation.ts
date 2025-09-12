/**
 * Navigation Types
 * 导航相关的类型定义
 */

export interface NavigationProp {
  navigate: (screen: string, params?: any) => void;
  goBack: () => void;
  push: (screen: string, params?: any) => void;
  replace: (screen: string, params?: any) => void;
  reset: (config: any) => void;
}

export interface RouteProp {
  key: string;
  name: string;
  params?: any;
}

export interface ScreenProps {
  navigation: NavigationProp;
  route: RouteProp;
}

// 路由参数类型定义
export type RootStackParamList = {
  Home: undefined;
  UserDetail: { userId: string };
  FunctionDetail: { functionId: string };
  LocationSelector: { currentLocation?: any; onLocationSelect?: (location: any) => void };
  TeamCenter: undefined;
  LimitedOffers: undefined;
  SearchResult: { query: string };
};

export type HomeStackParamList = {
  HomeScreen: undefined;
};
