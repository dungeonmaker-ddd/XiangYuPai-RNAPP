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

// 导入地区选择相关类型
import type { RegionInfo, CurrentLocationInfo } from '../pages/Home/types';
// 导入消息相关类型
import type { User } from '../pages/Message/types';
// 导入发现页面相关类型
import type { DiscoverContentItem as ContentItem, ReportPageRouteParams } from '../pages/Discover/types';

// 路由参数类型定义
export type RootStackParamList = {
  Main: undefined;
  LocationSelector: {
    currentLocation?: CurrentLocationInfo;
    onLocationSelected?: (location: RegionInfo) => void;
  };
  Search: undefined; // 搜索页面
  UserDetail: { userId: string };
  FunctionDetail: { functionId: string };
  TeamCenter: undefined;
  GroupCenter: undefined; // 组局中心页面
  PublishGroup: undefined; // 组局发布页面
  PrivateChatScreen: { // 私聊对话页面
    userId: string;
    userInfo: User;
  };
  DiscoverDetail: { // 发现详情页面
    contentId: string;
    contentItem?: ContentItem;
  };
  DiscoverReport: ReportPageRouteParams; // 举报页面
  LimitedOffers: undefined;
  SearchResult: { query: string };
};

export type HomeStackParamList = {
  HomeScreen: undefined;
};
