# 📁 页面模块组织规范

## 🎯 统一模块结构

为了保持代码的一致性和可维护性，所有页面模块都应遵循以下标准结构：

### 📂 标准目录结构

```
src/screens/
├── [module-name]/              # 模块文件夹
│   ├── [ModuleName]Screen.tsx  # 主页面组件
│   ├── components/             # 子组件目录
│   │   ├── Component1.tsx      # 子组件文件
│   │   ├── Component2.tsx      
│   │   ├── ...
│   │   └── index.ts            # 组件导出索引
│   ├── types.ts                # 类型定义
│   ├── constants.ts            # 常量配置
│   ├── index.ts                # 模块导出索引
│   └── README.md               # 模块说明文档
├── MainScreen.tsx              # 全局主屏幕
├── DemoScreen.tsx              # 演示页面
└── index.ts                    # 总导出索引
```

### 📋 文件职责说明

#### 1. **主页面组件** (`[ModuleName]Screen.tsx`)
- 模块的入口组件
- 负责状态管理和业务逻辑
- 组合子组件构建完整页面

#### 2. **components/ 目录**
- 存放该模块的所有子组件
- 每个组件独立文件
- 通过 `index.ts` 统一导出

#### 3. **types.ts**
- 定义模块相关的所有类型接口
- 包括组件Props、状态接口、API接口等

#### 4. **constants.ts**
- 模块相关的常量配置
- 颜色、尺寸、配置项等

#### 5. **index.ts** (模块根目录)
```typescript
// 主页面组件
export { default as [ModuleName]Screen } from './[ModuleName]Screen';

// 子组件导出
export * from './components';

// 类型和常量导出
export * from './types';
export * from './constants';
```

#### 6. **components/index.ts**
```typescript
// 组件导出
export { ComponentName } from './ComponentName';
export { default as ComponentName } from './ComponentName';

// 常量导出 (从上级目录)
export * from '../constants';
```

## 🔧 实现示例

### ✅ Home 模块 (已重构)
```
src/screens/home/
├── HomeScreen.tsx              # 主页面
├── components/                 # 子组件目录
│   ├── HeaderSection.tsx       # 头部区域
│   ├── GameBanner.tsx          # 游戏横幅
│   ├── FunctionGrid.tsx        # 功能网格
│   ├── LimitedOffers.tsx       # 限时优惠
│   ├── TeamPartySection.tsx    # 组队区域
│   ├── FilterTabs.tsx          # 筛选标签
│   ├── UserCard.tsx            # 用户卡片
│   ├── BottomNavigation.tsx    # 底部导航
│   ├── 三角形.png              # 组件资源
│   └── index.ts                # 组件导出
├── types.ts                    # 类型定义
├── constants.ts                # 常量配置
└── index.ts                    # 模块导出
```

### ✅ Discover 模块 (已重构)
```
src/screens/discover/
├── DiscoverScreen.tsx          # 主页面
├── components/                 # 子组件目录
│   ├── FilterTabs.tsx          # 筛选标签
│   ├── MasonryLayout.tsx       # 瀑布流布局
│   ├── ContentCard.tsx         # 内容卡片
│   ├── UserCard.tsx            # 用户卡片
│   ├── BottomNavigation.tsx    # 底部导航
│   └── index.ts                # 组件导出
├── types.ts                    # 类型定义
├── constants.ts                # 常量配置
├── README.md                   # 模块说明
└── index.ts                    # 模块导出
```

## 📝 路径引用规范

### 1. **组件内部引用**
```typescript
// 在 components/ 内的组件中
import { COLORS } from '../constants';     // 引用上级常量
import { SomeType } from '../types';       // 引用上级类型

// 引用资源文件 (注意层级)
require('../../../../assets/images/...');  // 从 components/ 到 assets/
```

### 2. **主页面组件引用**
```typescript
// 在主页面组件中
import {
  ComponentA,
  ComponentB,
  COLORS
} from './components';                      // 从 components/index.ts 导入
import { SomeType } from './types';        // 引用同级类型
```

### 3. **外部引用**
```typescript
// 在其他模块中使用
import { HomeScreen, UserCard } from '../home';
import { DiscoverScreen } from '../discover';
```

## 🎨 命名规范

### 1. **文件命名**
- 组件文件：`PascalCase.tsx` (如 `UserCard.tsx`)
- 主页面：`[ModuleName]Screen.tsx` (如 `HomeScreen.tsx`)
- 配置文件：`lowercase.ts` (如 `constants.ts`, `types.ts`)

### 2. **导出命名**
- 默认导出：组件名与文件名一致
- 命名导出：用于工具函数、常量等

### 3. **目录命名**
- 模块目录：`lowercase` (如 `home/`, `discover/`)
- 子目录：`lowercase` (如 `components/`)

## 🚀 迁移指南

### 将现有模块迁移到新结构：

1. **创建目录结构**
```bash
mkdir src/screens/[module-name]/components
```

2. **移动主页面文件**
```bash
move [ModuleName]Screen.tsx [module-name]/[ModuleName]Screen.tsx
```

3. **移动子组件到 components/**
```bash
move Component1.tsx [module-name]/components/Component1.tsx
```

4. **创建导出文件**
- 创建 `components/index.ts`
- 更新模块 `index.ts`

5. **修复路径引用**
- 更新组件内的 `require()` 路径
- 更新 `import` 语句路径

6. **更新外部引用**
- 修改其他文件中的导入路径

## ✨ 优势

### 1. **模块化清晰**
- 每个模块独立完整
- 职责边界明确
- 便于团队协作

### 2. **可维护性强**
- 统一的结构便于理解
- 组件复用更容易
- 重构影响范围可控

### 3. **扩展性好**
- 新模块遵循相同规范
- 组件可独立开发测试
- 支持渐进式重构

### 4. **开发体验佳**
- IDE 支持更好
- 导入路径清晰
- 文件查找更快

## 📚 相关资源

- [Home模块实现](./home/README.md)
- [Discover模块实现](./discover/README.md)
- [组件开发规范](../components/README.md)
- [类型定义规范](../types/README.md)

---

**注意**: 所有新模块都应严格遵循此规范，现有模块建议逐步迁移到新结构。
