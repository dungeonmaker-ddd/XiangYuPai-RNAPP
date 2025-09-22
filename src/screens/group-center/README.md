# 🎯 组局中心模块

> **基于通用组件架构核心标准的完整社交组局业务闭环系统**  
> **架构等级：★★★★★ (大型多功能页面)**

## 📖 模块概述

### 功能定位
**组局中心模块**是应用的核心社交功能实现，提供从组局发布、筛选浏览、详情展示、报名支付到状态反馈的完整社交组局业务闭环。

### 核心特性
- ✅ **组局发布系统**：多类型活动 + 详细设置 + 约定条件 + 支付管理
- ✅ **智能筛选浏览**：类型筛选 + 条件筛选 + 个性化推荐 + 实时更新
- ✅ **完整详情展示**：活动信息 + 发起者资料 + 参与者状态 + 交互功能
- ✅ **流畅报名流程**：条件检查 → 确认支付 → 状态跟踪 → 结果反馈
- ✅ **完善状态管理**：等待选择 + 报名成功 + 报名失败 + 退款处理

## 🏗️ 架构结构

```
src/screens/group-center/
├── index.tsx                    # 📱 页面父组件 - 集成所有子组件
├── types.ts                     # 📋 页面类型定义 - 导出所有相关类型
├── constants.ts                 # ⚙️ 页面常量配置 - 导出所有相关常量
├── README.md                    # 📖 页面文档 - 包含所有组件说明
│
├── 🔄 页面状态管理层
│   ├── useGroupCenter.ts        # 页面主状态管理
│   ├── useGroupCenterForm.ts    # 页面表单状态管理
│   └── useGroupCenterData.ts    # 页面数据状态管理
│
├── 🧭 页面导航层
│   ├── navigateToDetail.ts      # 页面跳转导航
│   ├── navigateBack.ts          # 返回导航
│   └── navigateGroupCenterFlow.ts # 流程导航
│
├── HeaderArea/                  # ✅ 组件区域1 - 头部导航区域
│   ├── index.tsx               # 主组件文件
│   ├── types.ts                # 组件类型定义
│   ├── constants.ts            # 组件常量配置
│   ├── README.md               # 组件文档
│   │
│   ├── NavigationBar/          # 🔸 功能区域1 - 导航栏功能
│   │   ├── index.tsx           # 区域主文件
│   │   ├── types.ts            # 区域类型定义
│   │   ├── constants.ts        # 区域常量
│   │   ├── useNavigation.ts    # 区域本地状态
│   │   ├── onNavigate.ts       # 区域事件处理
│   │   └── utilsNavigation.ts  # 导航工具
│   │
│   └── PublishButton/          # 🟢 功能区域2 - 发布按钮
│       ├── index.tsx           # 区域主文件
│       ├── constants.ts        # 区域常量
│       └── utilsButton.ts      # 按钮工具
│
├── FilterArea/                 # ✅ 组件区域2 - 筛选标签区域
│   ├── index.tsx               # 主组件文件
│   ├── types.ts                # 组件类型定义
│   ├── constants.ts            # 组件常量配置
│   ├── README.md               # 组件文档
│   │
│   ├── QuickFilters/           # 🔸 功能区域1 - 快速筛选
│   │   ├── index.tsx           # 区域主文件
│   │   ├── types.ts            # 区域类型定义
│   │   ├── constants.ts        # 区域常量
│   │   ├── useFilters.ts       # 区域本地状态
│   │   ├── onFilterChange.ts   # 区域事件处理
│   │   ├── processFilterData.ts # 数据处理
│   │   └── utilsFilter.ts      # 筛选工具
│   │
│   └── TypeTabs/               # 🟢 功能区域2 - 类型标签
│       ├── index.tsx           # 区域主文件
│       ├── constants.ts        # 区域常量
│       ├── processData.ts      # 数据处理
│       └── utilsDisplay.ts     # 显示工具
│
├── ContentArea/                # ✅ 组件区域3 - 主要内容区域
│   ├── index.tsx               # 主组件文件
│   ├── types.ts                # 组件类型定义
│   ├── constants.ts            # 组件常量配置
│   ├── README.md               # 组件文档
│   │
│   ├── GroupList/              # 🔸 功能区域1 - 组局列表
│   │   ├── index.tsx           # 区域主文件
│   │   ├── types.ts            # 区域类型定义
│   │   ├── constants.ts        # 区域常量
│   │   ├── useListState.ts     # 区域本地状态
│   │   ├── onListAction.ts     # 区域事件处理
│   │   ├── processListData.ts  # 数据处理
│   │   └── utilsList.ts        # 列表工具
│   │
│   ├── GroupCard/              # 🔸 功能区域2 - 组局卡片
│   │   ├── index.tsx           # 区域主文件
│   │   ├── types.ts            # 区域类型定义
│   │   ├── constants.ts        # 区域常量
│   │   ├── useCardState.ts     # 区域本地状态
│   │   ├── onCardAction.ts     # 区域事件处理
│   │   ├── processCardData.ts  # 数据处理
│   │   └── utilsCard.ts        # 卡片工具
│   │
│   └── LoadingStates/          # 🟢 功能区域3 - 加载状态
│       ├── index.tsx           # 区域主文件
│       └── utilsLoading.ts     # 加载工具
│
├── 🌐 页面API层
│   ├── apiGroupCenterFetch.ts   # 页面级API接口
│   └── apiGroupCenterAggregate.ts # 聚合API接口
│
├── 🔄 页面数据处理层
│   ├── processGroupCenterData.ts # 页面数据处理
│   ├── processAggregateData.ts   # 聚合数据处理
│   └── processValidation.ts      # 数据验证处理
│
└── 🛠️ 页面工具层
    ├── utilsGroupCenterDisplay.ts # 页面显示工具
    ├── utilsCoordination.ts       # 组件协调工具
    └── utilsGlobal.ts             # 全局工具函数
```

## 🎯 组件区域说明

### HeaderArea - 头部导航区域
负责页面头部导航栏和发布按钮的展示和交互。

### FilterArea - 筛选标签区域  
提供快速筛选和类型标签切换功能。

### ContentArea - 主要内容区域
展示组局列表、组局卡片和各种加载状态。

## 📋 使用方式

```typescript
import { GroupCenterScreen } from './src/screens/group-center';

// 在导航中使用
<Stack.Screen 
  name="GroupCenter" 
  component={GroupCenterScreen}
  options={{
    headerShown: false,
  }}
/>
```

## 🔧 开发规范

### 八段式代码结构
所有 `index.tsx` 文件必须遵循八段式结构：
1. File Banner & TOC
2. Imports  
3. Types & Schema
4. Constants & Config
5. Utils & Helpers
6. State Management
7. Domain Logic  
8. UI Components & Rendering
9. Exports

### 命名规范
- 组件区域：使用通用名称 + 注释说明具体功能
- 功能区域：使用通用名称 + 注释说明业务功能
- 文件命名：遵循 camelCase 或 PascalCase

### 职责分离
- 每个区域职责单一明确
- 状态管理统一在页面级
- 工具函数按功能分类
- API接口与数据处理分离

---

**版本**: 1.0.0  
**创建日期**: 2024年12月19日  
**架构标准**: 通用组件架构核心标准 v2.0.0  
**复杂度等级**: ★★★★★
