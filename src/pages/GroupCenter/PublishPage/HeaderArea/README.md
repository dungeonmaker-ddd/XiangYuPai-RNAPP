# HeaderArea - 头部导航区域

> **负责发布页面头部导航栏（取消/标题/保存）的展示和交互**

## 功能概述

HeaderArea 是组局发布页面的头部导航区域，包含取消按钮、页面标题和保存草稿按钮。

## 组件结构

```
HeaderArea/
├── index.tsx              # 主组件 - 头部导航区域容器
├── types.ts               # 类型定义
├── constants.ts           # 常量配置  
├── README.md              # 组件文档
│
├── NavigationBar/         # 🔸 导航栏功能区域
│   ├── index.tsx          # 导航栏主文件
│   ├── types.ts           # 导航栏类型
│   ├── constants.ts       # 导航栏常量
│   ├── useNavigation.ts   # 导航状态管理
│   ├── onNavigate.ts      # 导航事件处理
│   └── utilsNavigation.ts # 导航工具函数
│
└── SaveButton/            # 🟢 保存按钮功能区域
    ├── index.tsx          # 保存按钮主文件
    ├── constants.ts       # 按钮常量
    └── utilsButton.ts     # 按钮工具函数
```

## 使用方式

```tsx
import { HeaderArea } from './HeaderArea';

<HeaderArea 
  title="发布组局"
  onCancelPress={handleCancel}
  onSavePress={handleSave}
  isDraftSaving={isDraftSaving}
/>
```

## Props 说明

| 属性 | 类型 | 必填 | 默认值 | 说明 |
|------|------|------|--------|------|
| title | string | ✅ | - | 页面标题 |
| onCancelPress | () => void | ✅ | - | 取消按钮点击回调 |
| onSavePress | () => void | ✅ | - | 保存按钮点击回调 |
| showSaveButton | boolean | ❌ | true | 是否显示保存按钮 |
| isDraftSaving | boolean | ❌ | false | 是否正在保存草稿 |

## 功能区域说明

### NavigationBar - 导航栏功能区域
- 取消按钮交互（包含确认逻辑）
- 页面标题显示  
- 导航状态管理
- 复杂导航逻辑处理

### SaveButton - 保存按钮功能区域
- 保存按钮展示
- 点击交互处理
- 加载状态管理
- 简单保存功能
