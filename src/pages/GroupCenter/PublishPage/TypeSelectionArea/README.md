# TypeSelectionArea - 活动类型选择区域

> **提供6种活动类型的图标化选择功能**

## 功能概述

TypeSelectionArea 是组局发布页面的活动类型选择区域，包含6种活动类型的网格选择界面。

## 组件结构

```
TypeSelectionArea/
├── index.tsx              # 主组件 - 类型选择区域容器
├── types.ts               # 类型定义
├── constants.ts           # 常量配置  
├── README.md              # 组件文档
│
├── TypeGrid/              # 🔸 类型网格功能区域
│   ├── index.tsx          # 类型网格主文件
│   ├── types.ts           # 网格类型定义
│   ├── constants.ts       # 网格常量
│   ├── useTypeSelection.ts # 选择状态管理
│   ├── onTypeSelect.ts    # 选择事件处理
│   ├── processTypeData.ts # 类型数据处理
│   └── utilsType.ts       # 类型工具函数
│
└── TypeValidation/        # 🟢 类型验证功能区域
    ├── index.tsx          # 验证主文件
    └── utilsValidation.ts # 验证工具函数
```

## 使用方式

```tsx
import { TypeSelectionArea } from './TypeSelectionArea';

<TypeSelectionArea 
  selectedType={selectedType}
  onTypeSelect={handleTypeSelect}
  validation={validation}
/>
```

## Props 说明

| 属性 | 类型 | 必填 | 默认值 | 说明 |
|------|------|------|--------|------|
| selectedType | ActivityType | ❌ | - | 当前选中的活动类型 |
| onTypeSelect | (type: ActivityType) => void | ✅ | - | 类型选择回调 |
| validation | ValidationState | ❌ | - | 验证状态 |

## 功能区域说明

### TypeGrid - 类型网格功能区域
- 6种活动类型图标展示（探店/私影/台球/K歌/喝酒/按摩）
- 2行3列网格布局
- 选中状态视觉反馈
- 点击动画效果
- 复杂的选择逻辑处理

### TypeValidation - 类型验证功能区域
- 验证错误信息展示
- 验证警告信息展示
- 简单的验证状态显示
