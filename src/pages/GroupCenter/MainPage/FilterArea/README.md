# FilterArea - 筛选标签区域

> **提供快速筛选和类型标签切换功能**

## 功能概述

FilterArea 是组局中心页面的筛选功能区域，包含快速筛选标签和活动类型切换标签。

## 组件结构

```
FilterArea/
├── index.tsx              # 主组件 - 筛选区域容器
├── types.ts               # 类型定义
├── constants.ts           # 常量配置  
├── README.md              # 组件文档
│
├── QuickFilters/          # 🔸 快速筛选功能区域
│   ├── index.tsx          # 快速筛选主文件
│   ├── types.ts           # 筛选类型定义
│   ├── constants.ts       # 筛选常量
│   ├── useFilters.ts      # 筛选状态管理
│   ├── onFilterChange.ts  # 筛选事件处理
│   ├── processFilterData.ts # 筛选数据处理
│   └── utilsFilter.ts     # 筛选工具函数
│
└── TypeTabs/              # 🟢 类型标签功能区域
    ├── index.tsx          # 类型标签主文件
    ├── constants.ts       # 标签常量
    ├── processData.ts     # 标签数据处理
    └── utilsDisplay.ts    # 标签显示工具
```

## 使用方式

```tsx
import { FilterArea } from './FilterArea';

<FilterArea 
  filter={filterOptions}
  onFilterChange={handleFilterChange}
  onAdvancedPress={handleAdvancedPress}
/>
```

## Props 说明

| 属性 | 类型 | 必填 | 默认值 | 说明 |
|------|------|------|--------|------|
| filter | FilterOptions | ✅ | - | 当前筛选选项 |
| onFilterChange | (filter: Partial<FilterOptions>) => void | ✅ | - | 筛选变更回调 |
| onAdvancedPress | () => void | ✅ | - | 高级筛选按钮点击回调 |

## 功能区域说明

### QuickFilters - 快速筛选功能区域
- 排序方式选择（智能排序/最新发布/距离最近/价格最低）
- 性别筛选选择（不限性别/只看女生/只看男生）
- 高级筛选入口按钮
- 复杂的筛选逻辑处理

### TypeTabs - 类型标签功能区域
- 活动类型标签展示（全部/探店/私影/台球/K歌/喝酒/按摩）
- 横向滚动支持
- 标签选中状态管理
- 简单的展示功能
