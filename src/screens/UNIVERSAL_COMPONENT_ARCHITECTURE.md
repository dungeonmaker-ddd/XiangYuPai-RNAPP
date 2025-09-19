# 通用组件模块化架构标准

## 📖 概述

本文档定义了一套**跨框架、跨语言的通用组件模块化架构标准**，适用于 React、Vue、Angular、Flutter、UniApp 等任何现代前端框架。这套架构标准基于**具名化、模块化、职责分离**的核心思想，旨在提高代码的可维护性、可复用性和团队协作效率。

## 🎯 核心设计理念

### 1. 框架无关性 (Framework Agnostic)
- 架构思想不依赖特定的技术栈
- 命名规范和文件组织方式通用
- 可在任何支持模块化的语言中实现

### 2. 具名化原则 (Explicit Naming)
- 所有文件都使用具有明确含义的名称
- 文件名直接反映其功能和职责
- 避免使用模糊的通用名称

### 3. 单一职责原则 (Single Responsibility)
- 每个文件只负责一个具体的功能
- 状态管理、事件处理、导航逻辑各司其职
- 便于单独测试、维护和复用

### 4. 自包含原则 (Self-Contained)
- 每个组件模块包含其所有相关代码
- 类型定义、常量、逻辑都在模块内部
- 减少跨模块依赖，提高内聚性

## 📁 通用目录结构

```
ComponentName/
├── Component.[ext]                     # 主组件文件（必需）
├── types.[ext]                         # 类型/接口定义（必需）
├── constants.[ext]                     # 常量定义（可选）
├── use[ComponentName][Feature].[ext]   # 状态管理逻辑（可选）
├── on[ComponentName][Action].[ext]     # 事件处理器（可选）
├── navigateTo[Target].[ext]           # 导航处理器（可选）
└── README.md                          # 组件文档（推荐）
```

**说明**: `[ext]` 代表对应语言的文件扩展名
- React/Vue: `.ts`, `.js`, `.tsx`, `.vue`
- Angular: `.ts`, `.component.ts`
- Flutter: `.dart`
- UniApp: `.js`, `.ts`, `.vue`

## 📋 通用命名规范

### 🏗️ 核心文件命名

| 文件类型 | 命名格式 | 用途说明 |
|---------|---------|----------|
| **主组件** | `Component.[ext]` 或 `index.[ext]` | 组件的主要UI实现 |
| **类型定义** | `types.[ext]` | 数据结构、接口、类型定义 |
| **常量定义** | `constants.[ext]` | 组件相关的常量配置 |
| **文档说明** | `README.md` | 组件使用说明和API文档 |

### 🔧 功能文件命名

| 功能类型 | 命名格式 | 示例 | 用途 |
|---------|---------|------|------|
| **状态管理** | `use[ComponentName][Feature].[ext]` | `useUserCardData.ts` | 封装组件的状态逻辑 |
| **事件处理** | `on[ComponentName][Action].[ext]` | `onUserCardClick.ts` | 处理用户交互事件 |
| **导航处理** | `navigateTo[Target].[ext]` | `navigateToProfile.ts` | 处理页面跳转逻辑 |
| **数据处理** | `process[ComponentName][Data].[ext]` | `processUserCardData.ts` | 数据转换和处理 |
| **验证逻辑** | `validate[ComponentName][Field].[ext]` | `validateUserInput.ts` | 表单验证和数据校验 |

## 🌐 跨框架实现示例

### React/React Native 实现

```
UserCard/
├── index.tsx                           # 主组件
├── types.ts                            # TypeScript 类型定义
├── constants.ts                        # 常量定义
├── useUserCard.ts                      # 状态管理 Hook
├── useUserCardAnimation.ts             # 动画逻辑 Hook
├── onUserCardClick.ts                  # 点击事件处理器
├── onUserCardLike.ts                   # 点赞事件处理器
├── navigateToProfile.ts                # 导航到用户资料
└── README.md                           # 组件文档
```

### Vue 3 实现

```
UserCard/
├── UserCard.vue                        # 主组件
├── types.ts                            # TypeScript 类型定义
├── constants.ts                        # 常量定义
├── useUserCard.ts                      # Composition API 逻辑
├── useUserCardAnimation.ts             # 动画逻辑
├── onUserCardClick.ts                  # 点击事件处理器
├── onUserCardLike.ts                   # 点赞事件处理器
├── navigateToProfile.ts                # 导航处理器
└── README.md                           # 组件文档
```

### Angular 实现

```
UserCard/
├── user-card.component.ts              # 主组件
├── user-card.component.html            # 模板
├── user-card.component.scss            # 样式
├── user-card.types.ts                  # 类型定义
├── user-card.constants.ts              # 常量定义
├── user-card.service.ts                # 业务逻辑服务
├── on-user-card-click.service.ts       # 点击事件服务
├── navigate-to-profile.service.ts      # 导航服务
└── README.md                           # 组件文档
```

### Flutter 实现

```
UserCard/
├── user_card.dart                      # 主组件
├── user_card_types.dart                # 类型定义
├── user_card_constants.dart            # 常量定义
├── user_card_state.dart                # 状态管理
├── on_user_card_click.dart             # 点击事件处理器
├── on_user_card_like.dart              # 点赞事件处理器
├── navigate_to_profile.dart            # 导航处理器
└── README.md                           # 组件文档
```

### UniApp 实现

```
UserCard/
├── UserCard.vue                        # 主组件
├── types.js                            # 类型定义（JSDoc）
├── constants.js                        # 常量定义
├── useUserCard.js                      # 状态管理逻辑
├── onUserCardClick.js                  # 点击事件处理器
├── onUserCardLike.js                   # 点赞事件处理器
├── navigateToProfile.js                # 导航处理器
└── README.md                           # 组件文档
```

## 📝 通用文件模板

### 类型定义模板

```typescript
// React/Vue/Angular TypeScript
export interface ComponentNameProps {
  data: any;
  onAction: () => void;
  style?: any;
  disabled?: boolean;
}

export interface ComponentNameState {
  loading: boolean;
  error: string | null;
}
```

```dart
// Flutter Dart
class ComponentNameProps {
  final dynamic data;
  final VoidCallback onAction;
  final bool disabled;
  
  ComponentNameProps({
    required this.data,
    required this.onAction,
    this.disabled = false,
  });
}

class ComponentNameState {
  final bool loading;
  final String? error;
  
  ComponentNameState({
    this.loading = false,
    this.error,
  });
}
```

```javascript
// UniApp JavaScript (JSDoc)
/**
 * @typedef {Object} ComponentNameProps
 * @property {*} data - 数据
 * @property {Function} onAction - 操作回调
 * @property {Object} [style] - 样式
 * @property {boolean} [disabled] - 是否禁用
 */

/**
 * @typedef {Object} ComponentNameState
 * @property {boolean} loading - 加载状态
 * @property {string|null} error - 错误信息
 */
```

### 常量定义模板

```typescript
// React/Vue/Angular
export const COMPONENT_NAME_CONSTANTS = {
  DEFAULT_HEIGHT: 200,
  ANIMATION_DURATION: 300,
  ERROR_MESSAGE: '操作失败，请重试',
} as const;
```

```dart
// Flutter
class ComponentNameConstants {
  static const double defaultHeight = 200.0;
  static const int animationDuration = 300;
  static const String errorMessage = '操作失败，请重试';
}
```

```javascript
// UniApp
export const COMPONENT_NAME_CONSTANTS = {
  DEFAULT_HEIGHT: 200,
  ANIMATION_DURATION: 300,
  ERROR_MESSAGE: '操作失败，请重试',
};
```

### 状态管理模板

```typescript
// React Hook
export const useComponentName = (props: ComponentNameProps) => {
  const [state, setState] = useState<ComponentNameState>({
    loading: false,
    error: null,
  });

  const handleAction = useCallback(() => {
    // 业务逻辑
  }, []);

  return { state, handleAction };
};
```

```typescript
// Vue 3 Composition API
export const useComponentName = (props: ComponentNameProps) => {
  const state = reactive<ComponentNameState>({
    loading: false,
    error: null,
  });

  const handleAction = () => {
    // 业务逻辑
  };

  return { state, handleAction };
};
```

```dart
// Flutter State Management
class ComponentNameNotifier extends ChangeNotifier {
  ComponentNameState _state = ComponentNameState();
  
  ComponentNameState get state => _state;
  
  void handleAction() {
    // 业务逻辑
    notifyListeners();
  }
}
```

### 事件处理器模板

```typescript
// React/Vue/Angular
export const onComponentNameAction = (props: ComponentNameProps) => {
  try {
    // 记录分析数据
    analytics?.track('component_action', {});
    
    // 执行业务逻辑
    console.log('ComponentName: Action 执行成功');
  } catch (error) {
    console.error('ComponentName: Action 执行失败', error);
  }
};
```

```dart
// Flutter
class ComponentNameEventHandler {
  static void onAction(ComponentNameProps props) {
    try {
      // 记录分析数据
      // 执行业务逻辑
      print('ComponentName: Action 执行成功');
    } catch (error) {
      print('ComponentName: Action 执行失败: $error');
    }
  }
}
```

### 导航处理器模板

```typescript
// React/Vue/Angular
export const navigateToTarget = async (params: NavigateParams): Promise<boolean> => {
  try {
    console.log('NavigationEvent: 准备跳转', params);
    
    // 执行导航逻辑
    router.push('/target-page');
    
    return true;
  } catch (error) {
    console.error('NavigationEvent: 跳转失败', error);
    return false;
  }
};
```

```dart
// Flutter
class NavigationHandler {
  static Future<bool> navigateToTarget(BuildContext context, NavigateParams params) async {
    try {
      print('NavigationEvent: 准备跳转 $params');
      
      await Navigator.pushNamed(context, '/target-page', arguments: params);
      
      return true;
    } catch (error) {
      print('NavigationEvent: 跳转失败 $error');
      return false;
    }
  }
}
```

## 🔧 实施指南

### 通用实施步骤

1. **分析组件需求**
   - 确定组件的主要功能
   - 识别状态管理需求
   - 分析用户交互事件
   - 确定导航需求

2. **创建目录结构**
   - 按照框架规范创建文件
   - 遵循通用命名规范
   - 确保文件职责单一

3. **拆分代码逻辑**
   - 类型定义 → `types.[ext]`
   - 常量配置 → `constants.[ext]`
   - 状态逻辑 → `use[ComponentName][Feature].[ext]`
   - 事件处理 → `on[ComponentName][Action].[ext]`
   - 导航逻辑 → `navigateTo[Target].[ext]`

4. **编写组件文档**
   - 使用说明
   - API 接口
   - 示例代码
   - 注意事项

### 框架特定适配

#### React/React Native
- 使用 Hooks 进行状态管理
- 事件处理器返回处理函数
- 导航使用 React Navigation

#### Vue 2/3
- Vue 2 使用 Mixins 或 Options API
- Vue 3 使用 Composition API
- 导航使用 Vue Router

#### Angular
- 使用 Services 进行业务逻辑封装
- 使用 Dependency Injection
- 导航使用 Angular Router

#### Flutter
- 使用 Provider 或 Bloc 进行状态管理
- 事件处理使用回调函数
- 导航使用 Navigator

#### UniApp
- 兼容 Vue 2 语法
- 使用 Vuex 进行状态管理
- 导航使用 uni.navigateTo

## ✅ 通用最佳实践

### DO ✅

1. **使用具名化文件名** - 让文件名直接说明功能
2. **保持单一职责** - 每个文件只做一件事
3. **提供完整的类型定义** - 确保类型安全
4. **编写详细的组件文档** - 说明用法和API
5. **统一错误处理模式** - 使用一致的错误处理
6. **遵循框架最佳实践** - 结合框架特性优化

### DON'T ❌

1. **不要混合职责** - 避免在一个文件中处理多种逻辑
2. **不要使用通用名称** - 避免 utils、helpers 等模糊命名
3. **不要忽略文档** - 每个组件都应该有使用说明
4. **不要硬编码常量** - 将常量提取到专门文件
5. **不要忽略错误处理** - 每个操作都应该有错误处理
6. **不要违背框架规范** - 遵循各框架的最佳实践

## 🌟 架构优势

### 跨框架一致性
- 统一的思维模式和开发习惯
- 降低技术栈切换成本
- 提高团队协作效率

### 代码质量提升
- 更好的可读性和可维护性
- 更强的可测试性
- 更高的代码复用率

### 开发效率提升
- 快速定位相关代码
- 并行开发不同功能
- 减少代码冲突

### 团队协作优化
- 统一的代码标准
- 更容易的知识传递
- 更高效的代码审查

## 📊 适用场景

### ✅ 适合使用的场景
- 中大型项目开发
- 多人协作开发
- 组件复用需求高
- 需要跨框架迁移
- 长期维护的项目

### ⚠️ 需要权衡的场景
- 小型项目或原型开发
- 开发周期极短的项目
- 团队对架构理解成本较高

## 🔗 相关资源

- [React 组件设计模式](https://react.dev/learn/thinking-in-react)
- [Vue 组件最佳实践](https://vuejs.org/guide/components/registration.html)
- [Angular 组件架构](https://angular.io/guide/component-overview)
- [Flutter 组件设计](https://flutter.dev/docs/development/ui/widgets-intro)
- [软件架构设计原则](https://en.wikipedia.org/wiki/SOLID)

---

**版本**: 1.0.0  
**适用框架**: React, Vue, Angular, Flutter, UniApp, 及其他现代前端框架  
**维护者**: 开发团队
