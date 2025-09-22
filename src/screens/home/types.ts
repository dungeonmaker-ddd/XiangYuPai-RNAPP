// 共享类型定义
export interface UserCard {
  id: string;
  avatar: string;
  username: string;
  age: number;
  bio: string;
  services: string[];
  distance: number;
  status: 'online' | 'available' | 'offline';
  photos: string[];
  price?: string;
  region?: string;
  lastActive?: number;
  rating?: number;
  reviewCount?: number;
  // 扩展字段
  isSpecialOffer?: boolean;
  orderCount?: number;
  displayService?: string;
  listIndex?: number;
}

export interface FunctionItem {
  id: string;
  name: string;
  icon: string;
  color: string;
  isHot?: boolean;
  iconSource?: any; // PNG图标源
}

export interface LocationInfo {
  city: string;
  district?: string;
}
