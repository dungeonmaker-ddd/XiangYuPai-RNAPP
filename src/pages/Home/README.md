# Home 页面组

## 📖 概述

Home 页面组是应用的核心功能模块，包含首页展示、位置选择、搜索功能等相关页面，采用层级化页面组架构。

## 🏗️ 架构结构

```
src/pages/Home/                                    # Home 页面组
├── index.ts                                        # 页面组入口文件
├── types.ts                                        # 页面组类型定义
├── constants.ts                                    # 页面组常量配置
├── README.md                                       # 页面组文档
│
├── MainPage/                                       # 主页面 - 首页展示
│   ├── index.tsx                                   # 主页面实现（从 HomeScreen.tsx 迁移）
│   ├── types.ts                                    # 主页面类型定义
│   ├── constants.ts                                # 主页面常量配置
│   ├── README.md                                   # 主页面文档
│   │
│   ├── HeaderArea/                                 # 头部区域
│   ├── GameBannerArea/                             # 游戏横幅区域
│   ├── FunctionGridArea/                           # 功能网格区域
│   ├── FilterTabsArea/                             # 筛选标签区域
│   │   ├── FilterSelector/                         # 筛选器功能区域
│   │   └── RegionSelector/                         # 地区选择功能区域
│   ├── TeamPartyArea/                              # 组队区域
│   ├── LimitedOffersArea/                          # 限时优惠区域
│   └── UserListArea/                               # 用户列表区域
│       └── UserCardComponent/                      # 用户卡片功能区域
│
├── LocationPage/                                   # 位置选择页面
│   ├── index.tsx                                   # 位置页面实现（从 HomeLocationScreen.tsx 迁移）
│   ├── types.ts                                    # 位置页面类型定义
│   ├── constants.ts                                # 位置页面常量配置
│   ├── README.md                                   # 位置页面文档
│   │
│   ├── HeaderArea/                                 # 头部区域
│   ├── HotCitiesArea/                              # 热门城市区域
│   ├── LocationRecommendArea/                      # 位置推荐区域
│   └── RegionListArea/                             # 地区列表区域
│       ├── AlphabetIndex/                          # 字母索引功能区域
│       └── RegionListItem/                         # 地区列表项功能区域
│
├── SearchPage/                                     # 搜索页面
│   ├── index.tsx                                   # 搜索页面实现（从 SearchScreen.tsx 迁移）
│   ├── types.ts                                    # 搜索页面类型定义
│   ├── constants.ts                                # 搜索页面常量配置
│   ├── README.md                                   # 搜索页面文档
│   │
│   ├── SearchHeaderArea/                           # 搜索头部区域
│   ├── SearchInputArea/                            # 搜索输入区域
│   ├── SearchTabsArea/                             # 搜索标签区域
│   ├── SearchHistoryArea/                          # 搜索历史区域
│   ├── SearchSuggestionsArea/                      # 搜索建议区域
│   └── SearchResultsArea/                          # 搜索结果区域
│       └── AllResultsView/                         # 全部结果视图功能区域
│           └── ContentCard/                        # 内容卡片功能区域
│
├── useHome.ts                                      # 页面组主状态管理
├── useHomeData.ts                                  # 页面组数据状态管理
└── navigateHomeFlow.ts                             # 页面组导航流程管理
```

## 🎯 页面说明

### 📱 MainPage - 主页面
- **功能**: 首页展示，包含游戏横幅、功能网格、筛选标签、用户列表等
- **位置**: `./MainPage/`
- **入口**: `index.tsx`（从 `HomeScreen.tsx` 迁移）
- **原始位置**: `src/screens/home/`

### 📍 LocationPage - 位置选择页面
- **功能**: 地区选择，包含热门城市、地区推荐、字母索引等
- **位置**: `./LocationPage/`
- **入口**: `index.tsx`（从 `HomeLocationScreen.tsx` 迁移）
- **原始位置**: `src/screens/home-location/`

### 🔍 SearchPage - 搜索页面
- **功能**: 搜索功能，包含搜索输入、历史记录、建议、结果展示等
- **位置**: `./SearchPage/`
- **入口**: `index.tsx`（从 `SearchScreen.tsx` 迁移）
- **原始位置**: `src/screens/home-search/`

## 🔄 迁移状态

### ✅ 已完成
- [x] 基础目录结构创建
- [x] 主页面内容迁移 (`src/screens/home` → `./MainPage/`)
- [x] 位置页面内容迁移 (`src/screens/home-location` → `./LocationPage/`)
- [x] 搜索页面内容迁移 (`src/screens/home-search` → `./SearchPage/`)
- [x] 页面组入口文件创建
- [x] 页面组基础架构文件创建
- [x] 页面组状态管理层创建
- [x] 页面组导航层创建

### 🔄 进行中
- [ ] 组件区域重构验证
- [ ] 导入路径更新
- [ ] 功能测试验证

### 📋 待完成
- [ ] API接口层完善（如需要）
- [ ] 数据处理层完善
- [ ] 工具函数层完善
- [ ] 文档完善

## 🚀 使用方式

### 导入页面组件
```typescript
// 导入主页面
import { HomeMainPage } from '@/pages/Home';

// 导入子页面
import { HomeLocationPage, HomeSearchPage } from '@/pages/Home';

// 导入类型和常量
import { HomeNavigationParams, HOME_ROUTES } from '@/pages/Home';

// 导入状态管理
import { useHome, useHomeData, navigateHomeFlow } from '@/pages/Home';
```

### 状态管理使用
```typescript
const MyComponent = () => {
  // 使用页面组状态管理
  const {
    currentRegion,
    selectedFilters,
    setCurrentRegion,
    updateFilters,
  } = useHome();

  // 使用数据状态管理
  const {
    users,
    regions,
    isLoadingUsers,
    fetchUsers,
  } = useHomeData();

  // 使用导航流程
  const handleLocationSelect = (region: string) => {
    setCurrentRegion(region);
    navigateHomeFlow.selectRegionAndReturn(region);
  };

  return (
    // 组件JSX
  );
};
```

### 导航使用
```typescript
// 导航到各个页面
navigateHomeFlow.toMain();
navigateHomeFlow.toLocation({ currentRegion: 'Beijing' });
navigateHomeFlow.toSearch({ keyword: 'keyword' });

// 复合导航操作
navigateHomeFlow.searchWithFilters('游戏', { gameType: ['王者荣耀'] });
```

## 📝 注意事项

1. **架构标准**: 严格遵循 `UNIVERSAL_COMPONENT_ARCHITECTURE_CORE.md` 标准
2. **状态共享**: 页面组内的状态通过 `useHome` 和 `useHomeData` 共享
3. **导航统一**: 所有页面间导航通过 `navigateHomeFlow` 统一管理
4. **数据缓存**: `useHomeData` 提供数据缓存和刷新机制
5. **类型安全**: 所有接口和参数都有完整的 TypeScript 类型定义

## 🔗 相关文档

- [UNIVERSAL_COMPONENT_ARCHITECTURE_CORE.md](../../.cursor/rules/UNIVERSAL_COMPONENT_ARCHITECTURE_CORE.md)
- [MainPage README](./MainPage/README.md)
- [LocationPage README](./LocationPage/README.md)
- [SearchPage README](./SearchPage/README.md)
