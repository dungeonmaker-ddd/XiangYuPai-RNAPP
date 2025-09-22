# 🏠 首页模块 - 嵌套化主导架构

> **基于通用组件模块化架构核心标准的完整重构实现**

## 📁 架构概览

```
src/screens/home/                           # 首页页面容器层
├── index.tsx                               # 📱 页面父组件 - 集成所有子组件
├── types.ts                                # 📋 页面类型定义 - 导出所有相关类型
├── constants.ts                            # ⚙️ 页面常量配置 - 导出所有相关常量
├── README.md                               # 📖 页面文档 - 包含所有组件说明
│
├── 🔄 页面状态管理层 (统一管理)
│   ├── useHomeState.ts                     # 页面主状态管理
│   ├── useHomeNavigation.ts                # 页面导航状态管理
│   └── useHomeData.ts                      # 页面数据状态管理
│
├── HeaderArea/                             # ✅ 顶部导航区域
│   ├── index.tsx                           # 主组件文件
│   └── README.md                           # 组件文档
│
├── GameBannerArea/                         # ✅ 游戏推广横幅区域
│   ├── index.tsx                           # 主组件文件
│   └── README.md                           # 组件文档
│
├── FunctionGridArea/                       # ✅ 功能服务网格区域
│   ├── index.tsx                           # 主组件文件
│   ├── processData.ts                      # 数据处理
│   ├── utilsLayout.ts                      # 布局工具
│   └── README.md                           # 组件文档
│
├── LimitedOffersArea/                      # ✅ 限时专享区域
│   ├── index.tsx                           # 主组件文件
│   ├── processData.ts                      # 数据处理
│   ├── utilsLayout.ts                      # 布局工具
│   └── README.md                           # 组件文档
│
├── TeamPartyArea/                          # ✅ 组队聚会区域
│   ├── index.tsx                           # 主组件文件
│   └── README.md                           # 组件文档
│
├── FilterTabsArea/                         # ✅ 筛选标签栏区域 (复杂嵌套)
│   ├── index.tsx                           # 主组件文件
│   ├── processData.ts                      # 数据处理
│   ├── utilsLayout.ts                      # 布局工具
│   ├── RegionSelector/                     # 🔸 地区选择功能区域
│   │   ├── index.tsx                       # 区域主文件
│   │   └── processData.ts                  # 数据处理
│   ├── FilterSelector/                     # 🔸 筛选器功能区域
│   │   ├── index.tsx                       # 区域主文件
│   │   └── processData.ts                  # 数据处理
│   └── README.md                           # 组件文档
│
└── UserListArea/                           # ✅ 用户列表区域 (复杂嵌套)
    ├── index.tsx                           # 主组件文件
    ├── processData.ts                      # 数据处理
    ├── utilsLayout.ts                      # 布局工具
    ├── UserCardComponent/                  # 🔸 用户卡片功能区域
    │   ├── index.tsx                       # 区域主文件
    │   ├── processData.ts                  # 数据处理
    │   └── utilsFormat.ts                  # 格式化工具
    └── README.md                           # 组件文档
```

## 🎯 架构特性

### 1. 嵌套化主导架构
- ✅ **移除components中间层**：所有组件直接嵌套在页面下
- ✅ **区域化组织**：按UI功能区域划分组件架构
- ✅ **复杂度适配**：简单区域扁平实现，复杂区域嵌套实现

### 2. 八段式结构标准
所有 `index.tsx` 文件严格遵循八段式结构：
```typescript
// #region 1. Imports
// #region 2. Types & Schema  
// #region 3. Constants & Config
// #region 4. Utils & Helpers
// #region 5. State Management
// #region 6. Domain Logic
// #region 7. UI Components & Rendering
// #region 8. Exports
```

### 3. 职责分离原则
- **processData.ts**：数据处理逻辑
- **utilsLayout.ts**：布局工具函数
- **utilsFormat.ts**：格式化工具函数
- **index.tsx**：组件UI实现和功能组装

### 4. 统一状态管理
- **useHomeState.ts**：页面级状态管理
- **useHomeNavigation.ts**：页面级导航管理
- **useHomeData.ts**：页面级数据管理

## 🔧 使用说明

### 导入方式
```typescript
// 导入页面组件
import HomeScreen from './screens/home';

// 导入特定区域组件
import HeaderArea from './screens/home/HeaderArea';
import FunctionGridArea from './screens/home/FunctionGridArea';

// 导入类型和常量
import { UserCard, COLORS } from './screens/home';
```

### 扩展新区域
1. 在 `src/screens/home/` 下创建新区域文件夹
2. 创建 `index.tsx` 主组件文件（遵循八段式结构）
3. 根据复杂度创建 `processData.ts`、`utilsLayout.ts` 等功能文件
4. 在页面父组件中集成新区域

### 修改现有区域
1. 定位到对应区域文件夹
2. 修改 `index.tsx` 主组件文件
3. 相关业务逻辑修改对应的 `processData.ts` 等文件
4. 保持八段式结构完整性

## 📋 质量标准

### ✅ 架构完整性
- [x] 所有组件按嵌套化架构组织
- [x] 核心文件（index.tsx、types.ts、constants.ts、README.md）完整
- [x] 功能层按需创建，职责单一

### ✅ 代码规范性
- [x] 所有主文件遵循八段式结构
- [x] 命名规范统一（驼峰命名、语义化）
- [x] 类型定义完整，常量全部提取

### ✅ 功能完整性
- [x] 8个主要功能区域全部实现
- [x] 复杂区域（FilterTabsArea、UserListArea）嵌套实现
- [x] 状态管理、导航管理、数据管理分离

---

**版本**: 2.0.0  
**重构日期**: 2024年12月  
**架构标准**: 通用组件模块化架构核心标准  
**维护者**: 架构团队
