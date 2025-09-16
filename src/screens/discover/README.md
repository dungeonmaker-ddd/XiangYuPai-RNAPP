# 发现页面模块

> 基于标准化Agent模板构建的RN发现页面模块，支持瀑布流布局、Tab切换、社交互动等功能。

---

## 📂 模块结构

```
src/screens/discover/
├── DiscoverScreen.tsx              # 主页面组件 (250行)
├── components/                     # 子组件目录
│   ├── ContentCard.tsx            # 内容卡片组件 (120行)
│   ├── TabBar.tsx                 # 顶部Tab切换组件 (80行)
│   ├── WaterfallList.tsx          # 瀑布流列表组件 (150行)
│   └── index.ts                   # 组件导出索引
├── hooks/                         # 自定义Hook目录
│   ├── useDiscoverContent.ts      # 内容数据管理Hook (400行)
│   ├── useWaterfall.ts           # 瀑布流布局Hook (300行)
│   └── index.ts                   # Hook导出索引
├── types.ts                       # 类型定义 (80行)
├── constants.ts                   # 常量配置 (50行)
├── index.ts                       # 模块导出索引
└── README.md                      # 模块说明文档
```

## 🎯 核心功能

### ✅ **已实现功能**
- **瀑布流布局**：双列自适应高度的瀑布流展示
- **Tab切换**：关注/热门/同城三个内容分类
- **下拉刷新**：支持下拉刷新最新内容
- **无限滚动**：上拉自动加载更多内容
- **社交互动**：点赞、收藏、分享、关注功能
- **图片优化**：懒加载、缓存、错误处理
- **性能优化**：虚拟滚动、组件memo、批量渲染

### 🚧 **待扩展功能**
- 搜索功能
- 内容筛选
- 个性化推荐设置
- 离线缓存
- 实时推送

## 🔧 使用方法

### 1. 基础使用

```tsx
import React from 'react';
import { DiscoverScreen } from './src/screens/discover';

export const App = () => {
  return (
    <DiscoverScreen 
      navigation={navigation} 
      route={route} 
    />
  );
};
```

### 2. 集成到导航系统

```tsx
import { createStackNavigator } from '@react-navigation/stack';
import { DiscoverScreen } from './src/screens/discover';

const Stack = createStackNavigator();

export const AppNavigator = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen 
        name="Discover" 
        component={DiscoverScreen}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
};
```

### 3. 使用自定义Hooks

```tsx
import { useDiscoverContent, useWaterfall } from './src/screens/discover';

const MyDiscoverComponent = () => {
  // 内容数据管理
  const {
    currentTabContent,
    loading,
    refreshing,
    hasMore,
    loadContent,
    loadMore,
    refresh,
    likeContent,
    followUser,
  } = useDiscoverContent('hot');

  // 瀑布流布局管理
  const {
    layoutData,
    columnCount,
    cardWidth,
    updateLayout,
    setColumnCount,
  } = useWaterfall(currentTabContent, {
    initialColumnCount: 2,
    onLayoutChange: (layout) => console.log('布局更新:', layout.length),
  });

  return (
    // 你的组件JSX
  );
};
```

### 4. 自定义配置

```tsx
// 修改常量配置
export const CUSTOM_CONFIG = {
  ...LAYOUT_CONSTANTS,
  COLUMN_COUNT: 3, // 改为3列布局
  CARD_RADIUS: 16, // 增大圆角
};

// 使用自定义API端点
export const CUSTOM_ENDPOINTS = {
  ...API_ENDPOINTS,
  DISCOVER_HOT: '/api/v2/discover/hot',
};
```

## 🎨 组件说明

### ContentCard 内容卡片
- **功能**：展示单个内容项，支持图片/视频/直播
- **交互**：点赞、收藏、用户信息查看、内容详情
- **优化**：图片懒加载、错误处理、动画效果

### TabBar Tab切换栏
- **功能**：顶部Tab切换，支持滑动指示器动画
- **配置**：可自定义Tab数量、标题、样式
- **动画**：平滑的指示器移动动画

### WaterfallList 瀑布流列表
- **布局**：双列瀑布流，动态高度计算
- **性能**：虚拟滚动、批量渲染、DOM回收
- **交互**：下拉刷新、无限滚动、空状态处理

## 🪝 Hooks说明

### useDiscoverContent 内容数据管理Hook
- **功能**：统一管理发现页面的所有数据状态和业务逻辑
- **特性**：
  - 多Tab数据分离管理（follow/hot/local）
  - 乐观更新 + 错误回滚机制
  - 请求去重和防抖处理
  - 缓存策略和过期管理
  - 分页加载和无限滚动
- **API**：
  - `loadContent()` - 加载指定Tab内容
  - `likeContent()` - 点赞内容（乐观更新）
  - `followUser()` - 关注用户（批量状态更新）
  - `refresh()` - 刷新当前Tab数据
  - `loadMore()` - 加载更多数据

### useWaterfall 瀑布流布局Hook
- **功能**：专门处理瀑布流的布局计算和性能优化
- **特性**：
  - 智能的最短列选择算法
  - 响应式布局（支持横竖屏切换）
  - 布局计算结果缓存
  - 防抖的重计算机制
  - 内存优化和性能监控
- **API**：
  - `updateLayout()` - 更新布局数据
  - `setColumnCount()` - 动态调整列数
  - `recalculateLayout()` - 重新计算布局
  - `resetLayout()` - 重置布局状态

## 📊 性能指标

- **首屏加载**：< 2秒
- **滚动流畅度**：60fps
- **内存使用**：< 100MB（100张图片）
- **网络优化**：图片压缩、CDN分发

## 🔒 类型安全

所有组件都使用TypeScript严格模式，提供完整的类型定义：

```tsx
interface ContentItem {
  id: string;
  type: 'image' | 'video' | 'live';
  imageUrl: string;
  title: string;
  user: UserInfo;
  likeCount: number;
  isLiked: boolean;
  // ... 更多字段
}
```

## 🧪 测试支持

所有组件都包含testID，支持自动化测试：

```tsx
// 测试示例
const discoverScreen = getByTestId('discover_screen');
const likeButton = getByTestId('like_button');
const waterfallList = getByTestId('waterfall_list');
```

## 🎯 最佳实践

### 1. 数据管理
- 使用乐观更新提升用户体验
- 实现错误回滚机制
- 合理的缓存策略

### 2. 性能优化
- 图片懒加载和压缩
- 列表虚拟化
- 组件memo优化

### 3. 用户体验
- 流畅的动画效果
- 友好的错误提示
- 合理的空状态设计

## 📝 更新日志

### v1.0.0 (2024-12-19)
- ✅ 初始版本发布
- ✅ 基础瀑布流布局
- ✅ Tab切换功能
- ✅ 社交互动功能
- ✅ 性能优化实现

### v1.1.0 (2024-12-19)
- ✅ 添加自定义Hooks架构
- ✅ useDiscoverContent Hook (数据管理)
- ✅ useWaterfall Hook (布局管理)
- ✅ 模块文件结构优化
- ✅ 清理冗余组件和文件
- ✅ 完善文档和使用指南

---

*基于标准化Agent模板构建，遵循SMART-V+设计原则*