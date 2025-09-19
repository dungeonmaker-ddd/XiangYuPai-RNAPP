# TabBar 组件

顶部标签切换组件，支持关注/热门/同城三个Tab，具有平滑的动画指示器效果。

## 🎯 功能特性

- ✅ 支持多个 Tab 切换
- ✅ 平滑的指示器动画效果
- ✅ 响应式布局适配
- ✅ 完整的事件处理
- ✅ TypeScript 类型支持
- ✅ 测试友好的设计

## 📁 文件结构

```
TabBar/
├── index.tsx                    # 主组件 - UI渲染和功能组装
├── types.ts                     # 类型定义 - 接口、类型、约束
├── constants.ts                 # 常量定义 - 配置、默认值
├── useTabBar.ts                 # 状态管理 - 核心业务状态
├── onTabBarPress.ts             # 事件处理 - 点击交互逻辑
├── formatTabBarDisplay.ts       # 工具函数 - 样式格式化
└── README.md                    # 组件文档 - 使用说明
```

## 🔧 API 接口

### Props

| 属性 | 类型 | 必需 | 默认值 | 说明 |
|------|------|------|--------|------|
| `tabs` | `TabConfig[]` | ✅ | - | Tab 配置数组 |
| `activeTab` | `TabType` | ✅ | - | 当前激活的 Tab |
| `onTabPress` | `(tab: TabType) => void` | ✅ | - | Tab 点击回调函数 |

### 类型定义

```typescript
// Tab 类型
export type TabType = 'follow' | 'hot' | 'local';

// Tab 配置
export interface TabConfig {
  key: TabType;
  title: string;
  icon?: string;
}

// 组件 Props
export interface TabBarProps {
  tabs: TabConfig[];
  activeTab: TabType;
  onTabPress: (tab: TabType) => void;
}
```

## 📖 使用示例

### 基础用法

```tsx
import React, { useState } from 'react';
import { TabBar } from './TabBar';
import type { TabType, TabConfig } from './TabBar';

const ExampleScreen = () => {
  const [activeTab, setActiveTab] = useState<TabType>('hot');
  
  const tabs: TabConfig[] = [
    { key: 'follow', title: '关注' },
    { key: 'hot', title: '热门' },
    { key: 'local', title: '同城' },
  ];

  const handleTabPress = (tab: TabType) => {
    setActiveTab(tab);
    // 处理 Tab 切换逻辑
    console.log('切换到:', tab);
  };

  return (
    <TabBar
      tabs={tabs}
      activeTab={activeTab}
      onTabPress={handleTabPress}
    />
  );
};
```

### 自定义 Tab 配置

```tsx
const customTabs: TabConfig[] = [
  { key: 'follow', title: '我的关注', icon: 'heart' },
  { key: 'hot', title: '热门推荐', icon: 'fire' },
  { key: 'local', title: '本地内容', icon: 'location' },
];

<TabBar
  tabs={customTabs}
  activeTab={activeTab}
  onTabPress={handleTabPress}
/>
```

## 🎨 样式定制

### 主要样式常量

```typescript
// 布局常量
export const TAB_BAR_CONSTANTS = {
  TAB_BAR_HEIGHT: 48,           // Tab 栏高度
  STATUS_BAR_PADDING: 44,       // 状态栏内边距
  INDICATOR_HEIGHT: 2,          // 指示器高度
  INDICATOR_WIDTH_RATIO: 0.3,   // 指示器宽度比例
  ACTIVE_OPACITY: 0.7,          // 点击透明度
};

// 颜色常量
export const TAB_BAR_COLORS = {
  BACKGROUND: '#FFFFFF',        // 背景色
  TEXT_PRIMARY: '#333333',      // 主文本色
  TEXT_SECONDARY: '#999999',    // 次要文本色
  PRIMARY: '#FF6B6B',          // 主题色
  BORDER_LIGHT: '#F0F0F0',     // 边框色
};
```

## ⚡ 性能特性

- **memo 优化**: 使用 React.memo 避免不必要的重渲染
- **useCallback 优化**: 事件处理函数使用 useCallback 缓存
- **原生动画**: 使用 useNativeDriver 实现高性能动画
- **响应式设计**: 自动适配不同屏幕尺寸

## 🧪 测试支持

组件提供了完整的测试 ID 支持：

```typescript
export const TAB_BAR_TEST_IDS = {
  TAB_BAR: 'tab_bar_container',
  TAB_ITEM: 'tab_bar_item',
  TAB_INDICATOR: 'tab_bar_indicator',
};
```

### 测试示例

```typescript
// 测试 Tab 点击
const followTab = getByTestId('tab_bar_item_follow');
fireEvent.press(followTab);

// 测试指示器存在
const indicator = getByTestId('tab_bar_indicator');
expect(indicator).toBeTruthy();
```

## 🔄 状态管理

### 内部状态

- `screenWidth`: 屏幕宽度
- `tabWidth`: 单个 Tab 宽度
- `indicatorPosition`: 指示器位置
- `isAnimating`: 动画状态

### 动画系统

- **切换动画**: 300ms 平滑过渡
- **指示器动画**: 原生驱动的位移动画
- **防抖处理**: 动画期间禁止重复点击

## 🚨 注意事项

1. **Tab 数量限制**: 建议不超过 5 个 Tab，以保证良好的用户体验
2. **标题长度**: Tab 标题建议控制在 2-4 个字符内
3. **响应式适配**: 组件会自动适配屏幕宽度，但超长标题可能显示不全
4. **动画性能**: 使用了 useNativeDriver，在低端设备上也有良好性能

## 🔧 扩展开发

### 添加新的 Tab 类型

1. 在 `types.ts` 中扩展 `TabType`：
```typescript
export type TabType = 'follow' | 'hot' | 'local' | 'newType';
```

2. 在 `constants.ts` 中添加对应配置：
```typescript
export const DEFAULT_TABS: TabConfig[] = [
  // ... 现有配置
  { key: 'newType', title: '新类型' },
];
```

### 自定义动画效果

可以在 `constants.ts` 中修改动画配置：

```typescript
export const TAB_ANIMATION_CONFIG = {
  SWITCH_DURATION: 500, // 修改动画持续时间
  USE_NATIVE_DRIVER: true,
} as const;
```

## 📝 更新日志

### v1.0.0
- ✅ 初始版本发布
- ✅ 基础 Tab 切换功能
- ✅ 动画指示器效果
- ✅ TypeScript 支持
- ✅ 测试友好设计
