# 组件模块化架构指导文档

## 📖 概述

本文档定义了项目中组件的标准化模块架构，旨在提高代码的可维护性、可复用性和可读性。每个组件都应该按照这种模块化的方式进行组织，实现高内聚、低耦合的设计目标。

## 🎯 设计原则

### 1. 具名化原则
- 所有文件都使用具有明确含义的名称
- 文件名直接反映其功能和职责
- 避免使用通用名称如 `utils.ts`、`helpers.ts`

### 2. 单一职责原则
- 每个文件只负责一个具体的功能
- Hook、Event、Navigation 各司其职
- 便于单独测试和维护

### 3. 自包含原则
- 每个组件模块包含其所有相关代码
- 类型定义、常量、逻辑都在模块内部
- 减少跨模块依赖

## 📁 标准目录结构

```
ComponentName/
├── index.tsx                           # 主组件文件（必需）
├── types.ts                            # 类型定义（必需）
├── constants.ts                        # 常量定义（可选）
├── use[ComponentName][Feature].ts      # 具名 Hooks（可选）
├── on[ComponentName][Action].ts        # 具名事件处理器（可选）
├── navigateTo[Target].ts              # 具名导航事件（可选）
└── README.md                          # 组件文档（推荐）
```

## 📋 文件命名规范

### 🎣 Hooks 命名规范

**格式**: `use[ComponentName][Feature].ts`

**示例**:
- `useWaterfallCard.ts` - 主要业务逻辑 Hook
- `useWaterfallCardAnimation.ts` - 动画相关 Hook
- `useWaterfallCardImage.ts` - 图片加载相关 Hook
- `useTabBarState.ts` - Tab 状态管理 Hook
- `useModalDialog.ts` - 弹窗主逻辑 Hook
- `useFormValidation.ts` - 表单验证 Hook

**用途**:
- 封装组件的状态管理逻辑
- 处理复杂的副作用
- 提供可复用的业务逻辑

### 🎯 事件处理器命名规范

**格式**: `on[ComponentName][Action].ts`

**示例**:
- `onWaterfallCardPress.ts` - 卡片点击事件
- `onWaterfallCardLike.ts` - 点赞事件
- `onWaterfallCardLongPress.ts` - 长按事件
- `onTabBarSwitch.ts` - Tab 切换事件
- `onModalDialogConfirm.ts` - 弹窗确认事件
- `onFormSubmit.ts` - 表单提交事件

**用途**:
- 处理用户交互事件
- 执行业务逻辑
- 触发状态更新

### 🧭 导航事件命名规范

**格式**: `navigateTo[Target].ts`

**示例**:
- `navigateToCardDetail.ts` - 跳转到卡片详情
- `navigateToUserProfile.ts` - 跳转到用户资料
- `navigateToTabContent.ts` - 跳转到 Tab 内容
- `navigateToSettingsPage.ts` - 跳转到设置页面
- `navigateBackToHome.ts` - 返回到首页

**用途**:
- 处理页面跳转逻辑
- 管理导航参数
- 提供统一的导航接口

### 📄 其他文件命名规范

**必需文件**:
- `index.tsx` - 主组件文件
- `types.ts` - 类型定义文件

**可选文件**:
- `constants.ts` - 常量定义
- `README.md` - 组件文档

## 🔧 实施指南

### 步骤 1: 分析现有组件

在重构前，先分析组件的功能：

```typescript
// 分析清单
1. 组件有哪些 Props？
2. 组件有哪些内部状态？
3. 组件有哪些用户交互事件？
4. 组件需要哪些导航功能？
5. 组件有哪些复杂的业务逻辑？
6. 组件使用了哪些常量？
```

### 步骤 2: 创建目录结构

```bash
mkdir ComponentName
cd ComponentName
touch index.tsx types.ts constants.ts README.md
```

### 步骤 3: 拆分文件内容

按照职责将代码拆分到对应的文件中：

1. **类型定义** → `types.ts`
2. **常量定义** → `constants.ts`  
3. **业务逻辑** → `use[ComponentName][Feature].ts`
4. **事件处理** → `on[ComponentName][Action].ts`
5. **导航逻辑** → `navigateTo[Target].ts`
6. **主组件** → `index.tsx`

### 步骤 4: 更新导入导出

确保所有文件都有正确的导入导出关系。

## 📝 文件模板

### types.ts 模板

```typescript
/**
 * [ComponentName] 组件类型定义
 */

// 主要 Props 接口
export interface [ComponentName]Props {
  // 必需属性
  data: any;
  onPress: () => void;
  
  // 可选属性
  style?: ViewStyle;
  disabled?: boolean;
  
  // 事件回调
  onLongPress?: () => void;
  onError?: (error: Error) => void;
  
  // 导航相关
  navigation?: any;
  analytics?: any;
  showToast?: (message: string) => void;
}

// 内部状态接口
export interface [ComponentName]State {
  loading: boolean;
  error: string | null;
  // ... 其他状态
}

// 其他相关类型
export type [ComponentName]Mode = 'default' | 'compact' | 'expanded';
export type [ComponentName]Status = 'idle' | 'loading' | 'success' | 'error';
```

### constants.ts 模板

```typescript
/**
 * [ComponentName] 组件常量定义
 */

export const [COMPONENT_NAME]_CONSTANTS = {
  // 尺寸相关
  DEFAULT_HEIGHT: 200,
  MIN_WIDTH: 100,
  MAX_WIDTH: 400,
  
  // 时间相关
  ANIMATION_DURATION: 300,
  DEBOUNCE_DELAY: 500,
  TIMEOUT_DURATION: 5000,
  
  // 状态相关
  DEFAULT_MODE: 'default' as const,
  DEFAULT_STATUS: 'idle' as const,
  
  // 文本相关
  PLACEHOLDER_TEXT: '请输入内容',
  ERROR_MESSAGE: '操作失败，请重试',
  SUCCESS_MESSAGE: '操作成功',
} as const;

// 导出类型
export type [ComponentName]Constants = typeof [COMPONENT_NAME]_CONSTANTS;
```

### Hook 模板

```typescript
/**
 * [ComponentName] [功能描述] Hook
 */

import { useState, useCallback, useEffect } from 'react';
import { [ComponentName]Props, [ComponentName]State } from './types';
import { [COMPONENT_NAME]_CONSTANTS } from './constants';

export const use[ComponentName][Feature] = (props: [ComponentName]Props) => {
  // 状态管理
  const [state, setState] = useState<[ComponentName]State>({
    loading: false,
    error: null,
  });

  // 业务逻辑方法
  const handleSomeAction = useCallback(() => {
    // 实现具体逻辑
  }, []);

  // 副作用处理
  useEffect(() => {
    // 初始化逻辑
  }, []);

  // 返回接口
  return {
    state,
    handleSomeAction,
    // ... 其他方法
  };
};
```

### 事件处理器模板

```typescript
/**
 * [ComponentName] [事件描述] 事件处理器
 */

import { [ComponentName]Props } from './types';
import { navigateTo[Target] } from './navigateTo[Target]';

export const on[ComponentName][Action] = (props: [ComponentName]Props) => {
  const { navigation, analytics, showToast } = props;

  try {
    // 记录分析数据
    analytics?.track('[component_name]_[action]', {
      // 分析参数
    });

    // 执行主要逻辑
    // ...

    // 可能的导航操作
    if (navigation) {
      navigateTo[Target]({
        navigation,
        showToast,
        // 其他参数
      });
    }

    console.log('[ComponentName]: [Action] 执行成功');
  } catch (error) {
    console.error('[ComponentName]: [Action] 执行失败', error);
    showToast?.('操作失败，请重试');
  }
};
```

### 导航事件模板

```typescript
/**
 * 导航到 [目标页面]
 */

import type { NavigationProp, ParamListBase } from '@react-navigation/native';

export interface NavigateTo[Target]Params {
  // 导航参数
  id: string;
  title?: string;
  
  // 系统参数
  navigation?: NavigationProp<ParamListBase>;
  showToast?: (message: string) => void;
}

/**
 * 导航到 [目标页面]
 * @param params - 导航参数
 * @returns Promise<boolean> - 导航是否成功
 */
export const navigateTo[Target] = async (
  params: NavigateTo[Target]Params
): Promise<boolean> => {
  const { navigation, showToast } = params;

  try {
    console.log('NavigationEvent: 准备跳转到 [目标页面]', params);

    // 参数验证
    if (!params.id) {
      console.error('NavigationEvent: 缺少必需参数');
      return false;
    }

    if (!navigation) {
      console.error('NavigationEvent: 缺少 navigation 实例');
      return false;
    }

    // 执行导航
    (navigation as any).navigate('[TargetScreen]', {
      id: params.id,
      title: params.title,
    });

    console.log('NavigationEvent: 成功跳转到 [目标页面]');
    return true;
  } catch (error) {
    console.error('NavigationEvent: 跳转到 [目标页面] 失败', error);
    showToast?.('跳转失败，请重试');
    return false;
  }
};
```

### 主组件模板

```typescript
/**
 * [ComponentName] 组件
 * 
 * 功能描述：
 * - 功能1
 * - 功能2
 * - 功能3
 */

import React, { memo } from 'react';
import { View, StyleSheet } from 'react-native';

// 导入模块内部文件
import { [ComponentName]Props } from './types';
import { [COMPONENT_NAME]_CONSTANTS } from './constants';
import { use[ComponentName] } from './use[ComponentName]';
import { on[ComponentName]Press } from './on[ComponentName]Press';

const [ComponentName]: React.FC<[ComponentName]Props> = (props) => {
  // 使用 Hook
  const { state, methods } = use[ComponentName](props);

  // 事件处理
  const handlePress = () => {
    on[ComponentName]Press(props);
  };

  return (
    <View style={styles.container}>
      {/* 组件内容 */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    // 样式定义
  },
});

export default memo([ComponentName]);

// 导出类型供外部使用
export type { [ComponentName]Props } from './types';
```

## 🚀 迁移策略

### 渐进式迁移

1. **选择试点组件** - 从相对独立的组件开始
2. **创建新结构** - 按照规范创建新的目录结构
3. **拆分现有代码** - 将代码按职责拆分到对应文件
4. **更新引用** - 逐步更新组件的引用方式
5. **测试验证** - 确保功能正常
6. **推广应用** - 在其他组件中应用相同模式

### 向后兼容

在项目根目录维护一个兼容性 `index.ts` 文件：

```typescript
// 兼容性导出
export { default as WaterfallCard } from './WaterfallCard';
export { default as TabBar } from './TabBar';
export { default as ContentCard } from './ContentCard';

// 类型导出
export type { WaterfallCardProps } from './WaterfallCard/types';
export type { TabBarProps } from './TabBar/types';
export type { ContentCardProps } from './ContentCard/types';
```

## ✅ 最佳实践

### DO ✅

1. **使用具名化文件名** - 让文件名直接说明功能
2. **保持单一职责** - 每个文件只做一件事
3. **添加详细注释** - 解释为什么这样设计
4. **编写组件文档** - 在 README.md 中说明用法
5. **提供类型定义** - 确保 TypeScript 类型安全
6. **统一错误处理** - 使用一致的错误处理模式

### DON'T ❌

1. **不要混合职责** - 避免在一个文件中处理多种逻辑
2. **不要使用通用名称** - 避免 utils.ts、helpers.ts 等
3. **不要忽略文档** - 每个组件都应该有使用说明
4. **不要跳过类型定义** - 确保类型安全
5. **不要硬编码常量** - 将常量提取到 constants.ts
6. **不要忽略错误处理** - 每个操作都应该有错误处理

## 📊 收益分析

### 开发效率提升
- **快速定位** - 通过文件名直接找到相关代码
- **并行开发** - 不同开发者可以同时开发不同功能
- **减少冲突** - 文件职责明确，减少合并冲突

### 代码质量提升
- **更好的测试** - 每个功能可以独立测试
- **更易维护** - 修改某个功能不会影响其他功能
- **更强复用** - Hook 和事件处理器可以在多处复用

### 团队协作提升
- **统一标准** - 所有组件都遵循相同的结构
- **知识共享** - 新团队成员容易理解代码结构
- **代码审查** - 更容易进行代码审查和重构

## 🔗 相关资源

- [React Hooks 最佳实践](https://react.dev/reference/react)
- [TypeScript 类型定义指南](https://www.typescriptlang.org/)
- [React Navigation 文档](https://reactnavigation.org/)
- [组件设计原则](https://react.dev/learn/thinking-in-react)

## 📞 支持与反馈

如果在使用过程中遇到问题或有改进建议，请：

1. 查看现有的组件示例
2. 参考本文档的模板
3. 与团队成员讨论
4. 提出改进建议

---

**版本**: 1.0.0  
**最后更新**: 2024年  
**维护者**: 开发团队
