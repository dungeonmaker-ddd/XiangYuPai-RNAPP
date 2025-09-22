# HeaderArea - 头部导航区域

> **负责页面头部导航栏和发布按钮的展示和交互**

## 功能概述

HeaderArea 是组局中心页面的头部导航区域，包含返回按钮、页面标题和发布组局按钮。

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
└── PublishButton/         # 🟢 发布按钮功能区域
    ├── index.tsx          # 发布按钮主文件
    ├── constants.ts       # 按钮常量
    └── utilsButton.ts     # 按钮工具函数
```

## 使用方式

```tsx
import { HeaderArea } from './HeaderArea';

<HeaderArea 
  title="组局中心"
  onBackPress={handleBack}
  onPublishPress={handlePublish}
  showPublishButton={true}
/>
```

## Props 说明

| 属性 | 类型 | 必填 | 默认值 | 说明 |
|------|------|------|--------|------|
| title | string | ✅ | - | 页面标题 |
| onBackPress | () => void | ✅ | - | 返回按钮点击回调 |
| onPublishPress | () => void | ✅ | - | 发布按钮点击回调 |
| showPublishButton | boolean | ❌ | true | 是否显示发布按钮 |

## 功能区域说明

### NavigationBar - 导航栏功能区域
- 返回按钮交互
- 页面标题显示  
- 导航状态管理
- 复杂导航逻辑处理

### PublishButton - 发布按钮功能区域
- 发布按钮展示
- 点击交互处理
- 按钮状态管理
- 简单发布功能
