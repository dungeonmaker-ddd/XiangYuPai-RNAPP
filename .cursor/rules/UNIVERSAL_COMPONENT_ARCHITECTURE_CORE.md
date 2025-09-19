# 通用组件模块化架构核心标准

## 🤖 Agent 执行指令 (重要)

**当 Agent 接收到本架构文档时，必须严格按照以下要求执行：**

### 🎯 强制执行规则

1. **📁 伪页面组件架构重构**
   - 必须按照"伪页面组件架构"进行扁平化重构
   - 组件位置：`src/screens/{PageName}/{ComponentName}/`
   - 移除 `components/` 中间层级，让组件直接位于页面下
   - 不得省略任何应该包含的文件类型
   - 必须使用文档中定义的命名规范

2. **🔧 完整性要求**
   - 必须包含所有能涉及到的架构部分
   - 统一按照"完整结构"标准实施，不存在分级选择
   - 不得因为"简化"而忽略应有的模块拆分

3. **📋 必须创建的核心文件**
   ```
   src/screens/{PageName}/{ComponentName}/     # 伪页面组件根目录
   ├── {ComponentName}.[ext]                   # 主组件文件 (必需)
   ├── types.[ext]                             # 类型定义 (必需)
   ├── constants.[ext]                         # 常量定义 (必需)
   ├── use{ComponentName}.[ext]                # 主状态管理 (必需)
   ├── [其他功能文件按需创建...]
   ├── README.md                               # 组件文档 (必需)
   └── [功能文件根据实际需求添加，但必须遵循完整架构标准]
   ```
   
   **重要：当需要API接口时，必须同时创建前端接口层和后端交互层！**

4. **🚫 禁止行为**
   - 禁止将多个职责混合在一个文件中
   - 禁止使用模糊的文件命名
   - 禁止省略类型定义和常量提取
   - 禁止忽略错误处理和边界情况
   - 禁止只创建前端API接口而不创建对应的后端交互层

5. **✅ 验证清单**
   - 检查文件命名是否符合规范
   - 检查职责是否单一明确
   - 检查是否包含完整的类型定义
   - 检查是否提供了使用文档
   - 检查API接口层是否配套了完整的后端交互层

### 🎭 伪页面组件架构实施要求

- **扁平化组织**: 所有组件必须直接位于 `src/screens/{PageName}/{ComponentName}/`
- **移除中间层**: 禁止使用 `components/` 中间层级
- **统一标准**: 所有伪页面组件都必须按照"完整结构"进行重构
- **不允许简化**: 不得因为组件看似简单而省略应有的模块拆分
- **前瞻性设计**: 即使当前功能简单，也要为未来扩展预留完整的架构空间
- **平等地位**: 伪页面组件与页面主文件处于同一目录层级

### 💡 代码实施原则 (YAGNI + MVP)

**架构完整 ≠ 代码复杂**：虽然架构必须完整，但具体实施的文件代码必须遵循 **YAGNI + MVP** 原则：

#### 🎯 **YAGNI 原则** (You Aren't Gonna Need It)
- **只实现当前需要的功能** - 不预先实现可能用到的功能
- **避免过度设计** - 不添加当前用不到的复杂逻辑
- **简单优先** - 优先选择最简单的实现方式

#### 🚀 **MVP 原则** (Minimum Viable Product)
- **最小可用实现** - 每个文件只包含核心必需功能
- **渐进式完善** - 后续根据实际需求逐步完善
- **快速迭代** - 优先实现可用版本，再优化完善

#### 📋 **实施策略**

```typescript
// ✅ 推荐：YAGNI + MVP 实施
// types.ts - 只定义当前需要的类型
export interface UserCardProps {
  id: string;
  name: string;
  avatar?: string;
}

// constants.ts - 只定义当前使用的常量
export const USER_CARD_HEIGHT = 120;

// useUserCard.ts - 只实现核心状态管理
export const useUserCard = (props: UserCardProps) => {
  const [isLoading, setIsLoading] = useState(false);
  return { isLoading, setIsLoading };
};

// ❌ 避免：过度设计
// 不要预先实现可能用不到的复杂状态管理、缓存机制、复杂计算等
```

#### 🔄 **架构与实施的平衡**

| 层面 | 要求 | 原则 |
|------|------|------|
| **架构层面** | 完整结构，预留扩展空间 | 前瞻性设计 |
| **代码层面** | 最小可用实现，渐进完善 | YAGNI + MVP |

### 📝 YAGNI + MVP 代码编写指导

#### 🎯 **各文件类型的 YAGNI + MVP 实施标准**

##### **types.ts - 类型定义文件**
```typescript
// ✅ 推荐：只定义当前需要的类型
export interface UserCardProps {
  id: string;
  name: string;
  avatar?: string; // 可选属性用 ? 标记
}

// ❌ 避免：预定义可能用到的复杂类型
// export interface UserCardAdvancedProps extends UserCardProps {
//   permissions?: Permission[];
//   metadata?: Record<string, any>;
//   callbacks?: UserCardCallbacks;
// }
```

##### **constants.ts - 常量定义文件**
```typescript
// ✅ 推荐：只定义当前使用的常量
export const USER_CARD_HEIGHT = 120;
export const DEFAULT_AVATAR = '/images/default-avatar.png';

// ❌ 避免：预定义大量可能用到的常量
// export const USER_CARD_ANIMATION_DURATION = 300;
// export const USER_CARD_CACHE_TTL = 5 * 60 * 1000;
// export const USER_CARD_RETRY_ATTEMPTS = 3;
```

##### **use[ComponentName].ts - 状态管理文件**
```typescript
// ✅ 推荐：最小可用状态管理
export const useUserCard = (props: UserCardProps) => {
  const [isLoading, setIsLoading] = useState(false);
  
  return {
    isLoading,
    setIsLoading,
  };
};

// ❌ 避免：复杂的状态管理预设
// const [cache, setCache] = useState<Map<string, UserData>>(new Map());
// const [retryCount, setRetryCount] = useState(0);
// const [lastFetchTime, setLastFetchTime] = useState<Date | null>(null);
```

##### **on[ComponentName][Action].ts - 事件处理文件**
```typescript
// ✅ 推荐：核心事件处理
export const onUserCardClick = (userId: string) => {
  console.log('User card clicked:', userId);
  // 基础点击处理逻辑
};

// ❌ 避免：复杂的事件处理预设
// export const onUserCardDoubleClick = ...
// export const onUserCardLongPress = ...
// export const onUserCardSwipe = ...
```

##### **api[ComponentName][Action].ts - API接口文件**
```typescript
// ✅ 推荐：核心API接口
export const apiUserCardFetch = async (id: string) => {
  const response = await fetch(`/api/users/${id}`);
  return response.json();
};

// ❌ 避免：预设复杂API接口
// export const apiUserCardBatchFetch = ...
// export const apiUserCardCacheManager = ...
// export const apiUserCardRetryWrapper = ...
```

#### 🔄 **渐进式完善策略**

1. **第一版实现** - MVP 版本
   - 只实现核心必需功能
   - 基础的类型定义和状态管理
   - 简单的事件处理和API调用

2. **后续迭代** - 根据实际需求扩展
   - 添加新的类型定义（当需要时）
   - 扩展状态管理（当业务复杂时）
   - 增加事件处理（当交互丰富时）
   - 完善API接口（当数据需求增加时）

#### 💡 **YAGNI + MVP 核心原则**

| 原则 | 说明 | 实施方式 |
|------|------|----------|
| **需要时再添加** | 不预先实现可能用到的功能 | 从最简单的实现开始 |
| **保持简洁** | 每个文件只包含核心功能 | 避免过度抽象和复杂逻辑 |
| **快速迭代** | 优先可用版本，后续完善 | MVP → 渐进式改进 |
| **避免过度设计** | 不添加当前用不到的代码 | 专注于当前需求 |

**重要提醒：不要问用户"是否需要"，直接按照伪页面组件完整架构标准实施重构！但每个文件的具体代码实现必须遵循 YAGNI + MVP 原则！**

---

## 📖 核心理念

本文档定义了一套**跨框架、跨语言的通用组件模块化架构标准**，基于**具名化、模块化、职责分离**的核心思想，适用于任何现代前端框架和编程语言。

## 🎯 四大设计原则

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

## 🏗️ 伪页面组件架构 (Pseudo-Page Component Architecture)

### 📍 伪页面组件定义

**伪页面组件**是一种扁平化的组件组织方式，让子组件直接位于页面层级下，拥有更大的架构自主权，成为具有页面级别功能复杂度的独立组件模块。

### 🎯 架构位置与层级关系

```
src/screens/                                        # 页面容器层
├── {PageName}/                                     # 具名页面 (如 discover, home, profile)
│   ├── {ComponentName}/                            # ✅ 伪页面组件 (直接在页面下)
│   │   ├── index.[ext]                             # 主组件文件
│   │   ├── types.[ext]                             # 类型定义
│   │   ├── constants.[ext]                         # 常量配置
│   │   ├── use{ComponentName}.[ext]                # 状态管理
│   │   ├── on{ComponentName}[Action].[ext]         # 事件处理
│   │   └── [其他架构文件...]                       # 按完整架构标准组织
│   ├── {AnotherComponent}/                         # ✅ 另一个伪页面组件
│   ├── {PageName}Screen.tsx                        # 页面主文件
│   ├── hooks/                                      # 页面级状态管理
│   ├── events/                                     # 页面级事件处理
│   └── services/                                   # 页面级数据服务
```

### 🚫 移除的中间层级

**不再使用的组织方式 (已废弃)**:
```
src/screens/{PageName}/
├── components/                                     # ❌ 移除的中间层
│   ├── {ComponentName}/                            # ❌ 过深的嵌套
│   └── {AnotherComponent}/                         # ❌ 过深的嵌套
```

### 🎭 伪页面组件的四大权力

#### 1. **位置权力** - 平等地位
- **直接位于页面下**: `src/screens/{PageName}/{ComponentName}/`
- **无中间层级**: 移除 `components/` 层级
- **与页面主文件平等**: 处于同一目录层级

#### 2. **架构权力** - 完整自主
- **完整应用架构标准**: 按 UNIVERSAL_COMPONENT_ARCHITECTURE_CORE 组织
- **自主文件组织**: 内部可以有完整的文件结构
- **独立职责分离**: 状态、事件、数据处理等各司其职

#### 3. **功能权力** - 业务完整
- **状态管理权**: 可以有自己的 `use{ComponentName}.ts`
- **事件处理权**: 可以有自己的 `on{ComponentName}[Action].ts`
- **数据处理权**: 可以有自己的 `process{ComponentName}[Data].ts`
- **API调用权**: 可以有自己的 `api{ComponentName}[Action].ts`

#### 4. **扩展权力** - 成长潜力
- **可成长为子页面**: 功能复杂时可以进一步扩展
- **独立测试维护**: 可以独立进行单元测试和维护
- **团队协作友好**: 可以由不同开发者独立开发

### 📋 实际应用示例

#### **Discover 页面的伪页面组件架构**
```
src/screens/discover/                               # 页面层
├── WaterfallCard/                                 # ✅ 伪页面组件
│   ├── WaterfallCard.tsx                          # 主组件文件
│   ├── types.ts                                   # 类型定义
│   ├── constants.ts                               # 常量配置
│   ├── useWaterfallCard.ts                        # 状态管理
│   ├── onWaterfallCardClick.ts                    # 事件处理
│   ├── processWaterfallCardImage.ts               # 数据处理
│   ├── formatWaterfallCardDisplay.ts              # 工具函数
│   └── README.md                                  # 组件文档
├── TabBar/                                        # ✅ 伪页面组件
│   ├── TabBar.tsx
│   ├── types.ts
│   ├── constants.ts
│   ├── useTabBar.ts
│   └── onTabBarChange.ts
├── ContentCard/                                   # ✅ 伪页面组件
├── DiscoverScreen.tsx                             # 页面主文件
├── hooks/                                         # 页面级状态管理
├── events/                                        # 页面级事件处理
└── services/                                      # 页面级数据服务
```

#### **Home 页面的伪页面组件架构**
```
src/screens/home/                                  # 页面层
├── UserCard/                                      # ✅ 伪页面组件
│   ├── UserCard.tsx
│   ├── types.ts
│   ├── constants.ts
│   ├── useUserCard.ts
│   ├── onUserCardClick.ts
│   └── README.md
├── FilterTabs/                                    # ✅ 伪页面组件
├── GameBanner/                                    # ✅ 伪页面组件
├── FunctionGrid/                                  # ✅ 伪页面组件
├── HomeScreen.tsx                                 # 页面主文件
└── [其他页面级文件...]
```

## 📁 通用目录结构标准

### 🔧 完整结构 (统一标准，必须实施)

```
src/screens/{PageName}/{ComponentName}/             # 伪页面组件根目录
│
├── 🏗️ 核心文件 (必需)
│   ├── {ComponentName}.[ext]                       # 主组件文件 - UI渲染和功能组装
│   ├── types.[ext]                                 # 类型定义 - 接口、类型、约束
│   ├── constants.[ext]                             # 常量定义 - 配置、默认值
│   └── README.md                                   # 组件文档 - 使用说明、API
│
├── 🔄 状态管理层 (可选)
│   ├── use[ComponentName].[ext]                    # 主状态管理 - 核心业务状态
│   ├── use[ComponentName][Feature].[ext]           # 功能状态 - 特定功能状态
│   ├── use[ComponentName]Form.[ext]                # 表单状态 - 表单数据管理
│   └── use[ComponentName]Data.[ext]                # 数据状态 - 数据获取管理
│
├── ⚡ 事件处理层 (可选)
│   ├── on[ComponentName][Action].[ext]             # 基础交互 - 点击、输入事件
│   ├── on[ComponentName][UserAction].[ext]         # 复杂操作 - 长按、滑动事件
│   ├── on[ComponentName]Submit.[ext]               # 表单操作 - 提交、验证事件
│   └── on[ComponentName][FlowAction].[ext]         # 流程操作 - 多步骤事件
│
├── 🧭 导航处理层 (可选)
│   ├── navigateTo[Target].[ext]                    # 页面跳转 - 目标页面导航
│   ├── navigateBack[Source].[ext]                  # 返回导航 - 返回上级页面
│   └── navigate[ComponentName]Flow.[ext]           # 流程导航 - 多步骤流程
│
├── 🌐 API接口层 (与后端交互层配套出现)
│   ├── api[ComponentName][Action].[ext]            # 基础接口 - 数据获取接口
│   ├── api[ComponentName][DataSource].[ext]        # 数据源接口 - 特定数据源
│   ├── api[ComponentName]Update.[ext]              # 操作接口 - 数据更新接口
│   └── api[ComponentName]Batch.[ext]               # 批量接口 - 批量操作接口
│
├── 🔌 后端交互层 (与API接口层配套出现)
│   └── backend/                                    # 后端代码文件夹
│       ├── entity[ComponentName].[ext]             # 实体类 - 数据模型定义
│       ├── dto[ComponentName][Action].[ext]        # 数据传输对象 - 请求响应模型
│       ├── controller[ComponentName].[ext]         # 控制器 - REST API接口
│       ├── service[ComponentName].[ext]            # 业务服务 - QueryWrapper业务逻辑
│       ├── mapper[ComponentName].[ext]             # 数据访问接口 - 仅在需要特殊查询时
│       └── sql[ComponentName].xml                  # 复杂SQL查询 - 仅在极复杂SQL时
│
├── 🔄 数据处理层 (可选)
│   ├── process[ComponentName][Data].[ext]          # 数据处理 - 原始数据处理
│   ├── transform[ComponentName]Format.[ext]        # 数据转换 - 格式转换逻辑
│   ├── validate[ComponentName][Input].[ext]        # 数据验证 - 输入验证逻辑
│   └── filter[ComponentName]List.[ext]             # 数据过滤 - 筛选过滤逻辑
│
└── 🛠️ 工具函数层 (可选)
    ├── format[ComponentName][Display].[ext]        # 格式化工具 - 显示格式化
    ├── calculate[ComponentName][Value].[ext]       # 计算工具 - 数值计算逻辑
    ├── animate[ComponentName]Transition.[ext]      # 动画工具 - 动画过渡效果
    └── sort[ComponentName]List.[ext]               # 排序工具 - 列表排序逻辑
```

## 📋 通用命名规范体系

### 🏷️ 核心文件命名

| 文件类型 | 命名格式 | 职责描述 |
|---------|---------|----------|
| **主组件** | `{ComponentName}.[ext]` | 组件的主要UI实现和功能组装 |
| **类型定义** | `types.[ext]` | 数据结构、接口、类型定义 |
| **常量定义** | `constants.[ext]` | 组件相关的常量配置 |
| **组件文档** | `README.md` | 组件使用说明和API文档 |

### 🏗️ 主组件文件详细构成

#### 📋 主组件文件 (`{ComponentName}.[ext]`) 的核心职责
- **UI渲染逻辑** - 组件的视觉呈现和布局结构
- **功能模块组装** - 整合状态管理、事件处理、导航等模块
- **Props接口实现** - 实现对外暴露的属性接口
- **生命周期管理** - 处理组件的初始化、更新、销毁
- **条件渲染控制** - 根据状态控制不同UI的显示
- **样式应用** - 组件的样式定义和应用

#### 🔧 主组件文件的典型结构层次

```
主组件文件 ({ComponentName}.[ext])
│
├── 📦 导入声明区域
│   ├── 框架核心导入 (React, Vue, Angular等)
│   ├── UI组件库导入 (Button, Input, Modal等)
│   ├── 内部类型导入 (./types)
│   ├── 内部常量导入 (./constants)
│   ├── 状态管理导入 (./use[ComponentName]*)
│   ├── 事件处理导入 (./on[ComponentName]*)
│   ├── 导航处理导入 (./navigateTo*)
│   ├── API接口导入 (./api[ComponentName]*)
│   └── 工具函数导入 (./format*, ./process*等)
│
├── 🎯 组件定义区域
│   ├── Props接口接收
│   ├── Props默认值设置
│   └── Props解构和验证
│
├── 🔄 状态管理区域
│   ├── 主状态管理 (use[ComponentName])
│   ├── 功能状态管理 (use[ComponentName][Feature])
│   ├── 表单状态管理 (use[ComponentName]Form)
│   └── 数据状态管理 (use[ComponentName]Data)
│
├── ⚡ 事件处理区域
│   ├── 用户交互事件封装
│   ├── 表单提交事件封装
│   ├── 导航跳转事件封装
│   └── API调用事件封装
│
├── 🧮 计算属性区域
│   ├── 数据处理和转换
│   ├── 格式化显示逻辑
│   ├── 条件判断逻辑
│   └── 派生状态计算
│
├── 🎨 渲染逻辑区域
│   ├── 加载状态渲染
│   ├── 错误状态渲染
│   ├── 空状态渲染
│   └── 主要内容渲染
│
├── 💅 样式定义区域
│   ├── 容器样式
│   ├── 内容样式
│   ├── 交互样式
│   └── 状态样式
│
└── 📤 导出声明区域
    ├── 主组件导出
    └── 类型接口导出
```

#### 🎭 主组件文件的可能构成模式

##### 🟢 简单展示型组件构成
```
简单组件 ({ComponentName}.[ext])
├── 基础导入 (框架 + 内部types)
├── Props接收
├── 基础渲染逻辑
├── 简单样式定义
└── 组件导出
```

##### 🟡 交互型组件构成
```
交互组件 ({ComponentName}.[ext])
├── 扩展导入 (+ 状态管理 + 事件处理)
├── Props接收和验证
├── 状态管理 (1-2个hooks)
├── 事件处理封装 (2-3个事件)
├── 条件渲染逻辑
├── 完整样式定义
└── 组件和类型导出
```

##### 🔴 复杂业务型组件构成
```
复杂组件 ({ComponentName}.[ext])
├── 完整导入 (框架 + 所有内部模块)
├── Props接收、验证、默认值
├── 多层状态管理 (3-5个hooks)
├── 完整事件处理 (5-8个事件)
├── API调用集成
├── 数据处理和计算
├── 多状态条件渲染
├── 完整样式系统
└── 完整导出接口
```

#### 📐 主组件文件的设计原则

| 原则 | 说明 | 实现方式 |
|------|------|----------|
| **单一入口** | 作为组件功能的唯一入口点 | 所有外部调用都通过主组件 |
| **功能组装** | 整合各个功能模块，而非实现具体逻辑 | 导入并调用各个功能模块 |
| **接口实现** | 实现对外承诺的Props接口 | 严格按照types定义实现 |
| **状态协调** | 协调不同状态管理模块 | 合理组合多个state hooks |
| **UI控制** | 控制组件的视觉呈现和交互 | 负责渲染逻辑和样式应用 |
| **错误边界** | 处理组件级别的错误状态 | 实现错误状态的UI展示 |

#### 🔄 主组件文件与其他文件的协作关系

```
主组件 ({ComponentName}.[ext])
    ↓ 导入使用
┌── types.[ext] ──────────── 提供类型定义和接口约束
├── constants.[ext] ──────── 提供常量配置和默认值
├── use[ComponentName]* ──── 提供状态管理和业务逻辑
├── on[ComponentName]* ───── 提供事件处理和用户交互
├── navigateTo* ─────────── 提供页面跳转和路由导航
├── api[ComponentName]* ─── 提供数据获取和接口调用
├── process[ComponentName]* - 提供数据处理和转换逻辑
└── format[ComponentName]* - 提供格式化和工具函数
    ↓ 组合调用
主组件渲染输出 → 对外提供完整的组件功能
```

#### 📦 外部导入使用方式

**使用具名主组件文件的优势**：

```typescript
// ✅ 推荐：直接导入具名主组件
import UserCard from './UserCard/UserCard';
import WaterfallCard from './WaterfallCard/WaterfallCard';
import TabBar from './TabBar/TabBar';

// 使用时非常明确
<UserCard id="123" name="张三" />
<WaterfallCard data={cardData} />
<TabBar activeTab={currentTab} />
```

**与 index 文件对比**：

```typescript
// ❌ 不推荐：使用 index 文件（模糊不清）
import UserCard from './UserCard';  // 不知道导入的具体是什么文件
import WaterfallCard from './WaterfallCard';  // 可能是 index.tsx, index.js 等

// ✅ 推荐：使用具名文件（明确清晰）
import UserCard from './UserCard/UserCard';  // 明确知道导入的是 UserCard.tsx
import WaterfallCard from './WaterfallCard/WaterfallCard';  // 明确知道导入的是 WaterfallCard.tsx
```

**导入明确性优势**：
- **代码可读性更强** - 一眼就知道导入的是哪个具体文件
- **IDE 支持更好** - 自动补全和跳转更准确
- **调试更方便** - 错误信息会显示具体的文件名
- **重构更安全** - 重命名时影响范围更明确

#### 💡 主组件文件的最佳实践

##### ✅ 应该做的 (DO)
- **保持主组件的简洁性** - 主要负责组装和渲染
- **合理使用内部模块** - 充分利用拆分出的功能文件
- **提供完整的错误处理** - 处理各种异常状态
- **保持Props接口的稳定** - 避免频繁变更对外接口
- **添加适当的注释** - 说明复杂的渲染逻辑

##### ❌ 避免做的 (DON'T)
- **在主组件中写复杂业务逻辑** - 应拆分到对应的功能文件
- **硬编码常量和配置** - 应提取到constants文件
- **混合多种职责** - 避免在渲染逻辑中处理数据
- **忽略错误状态** - 必须处理加载、错误、空状态
- **过度复杂的条件渲染** - 复杂逻辑应提取到计算属性

## 🔌 MyBatis Plus 后端架构详细说明

### 📁 后端文件夹结构

```
ComponentName/backend/                              # 后端代码专用文件夹
├── entity[ComponentName].java                      # 实体类 - MP注解数据模型
├── dto[ComponentName][Action].java                 # 数据传输对象 - 请求响应结构
├── controller[ComponentName].java                  # 控制器 - REST API接口
├── service[ComponentName].java                     # 业务服务 - QueryWrapper业务逻辑
├── mapper[ComponentName].java                      # 数据访问接口 - 仅在需要特殊查询时
└── sql[ComponentName].xml                          # 复杂SQL查询 - 仅在极复杂SQL时
```

### 🏗️ Entity 实体类构成 (MyBatis Plus)

#### 📊 实体类必要组成部分

```
Entity实体类 (entity[ComponentName].java)
├── 🏷️ 类注解
│   ├── @TableName("table_name") - 表名映射
│   ├── @Data - Lombok数据注解
│   ├── @Builder - 建造者模式
│   └── @AllArgsConstructor/@NoArgsConstructor - 构造函数
│
├── 🆔 主键字段
│   ├── @TableId(type = IdType.AUTO) - 自增主键
│   ├── private Long id - 主键ID
│   └── private String uuid - 全局唯一标识(可选)
│
├── 📝 业务字段
│   ├── @TableField("column_name") - 字段映射
│   ├── private String name - 业务名称
│   ├── private String title - 标题
│   ├── private String content - 内容
│   ├── private Integer status - 状态字段
│   └── private String type - 类型分类
│
├── 🔗 关联字段
│   ├── private Long userId - 用户ID外键
│   ├── private Long parentId - 父级ID
│   ├── @TableField(exist = false) - 非数据库字段
│   └── private List<SubEntity> children - 关联集合
│
├── 📅 时间字段
│   ├── @TableField(fill = FieldFill.INSERT) - 插入时填充
│   ├── private LocalDateTime createdAt - 创建时间
│   ├── @TableField(fill = FieldFill.INSERT_UPDATE) - 插入更新时填充
│   ├── private LocalDateTime updatedAt - 更新时间
│   └── private LocalDateTime deletedAt - 软删除时间
│
├── 👤 操作字段
│   ├── private Long createdBy - 创建人ID
│   ├── private Long updatedBy - 更新人ID
│   └── private Long ownerId - 所有者ID
│
└── 🏷️ 扩展字段
    ├── @TableField(typeHandler = JsonTypeHandler.class) - JSON处理
    ├── private Map<String, Object> metadata - 元数据
    ├── private List<String> tags - 标签列表
    └── private String extra - 扩展信息
```

### 📨 DTO 数据传输对象构成

#### 🎯 DTO 文件标准结构

```
DTO文件 (dto[ComponentName][Action].java)
├── 📥 请求DTO类
│   ├── @Data @Builder - Lombok注解
│   ├── @Valid - 验证注解
│   ├── CreateRequest - 创建请求
│   │   ├── @NotBlank private String name
│   │   ├── @NotNull private String title
│   │   └── private Map<String, Object> metadata
│   ├── UpdateRequest - 更新请求
│   │   ├── @NotNull private Long id
│   │   ├── private String name
│   │   └── private Integer status
│   ├── QueryRequest - 查询请求
│   │   ├── private String keyword
│   │   ├── private Integer status
│   │   ├── private LocalDateTime startTime
│   │   └── private LocalDateTime endTime
│   └── BatchRequest - 批量请求
│       ├── @NotEmpty private List<Long> ids
│       └── private Integer batchStatus
│
├── 📤 响应DTO类
│   ├── DetailResponse - 详情响应
│   │   ├── private Long id
│   │   ├── private String name
│   │   ├── private UserInfo userInfo
│   │   └── private LocalDateTime createdAt
│   ├── ListResponse - 列表响应
│   │   ├── private Long id
│   │   ├── private String name
│   │   ├── private Integer status
│   │   └── private String summary
│   └── PageResponse<T> - 分页响应
│       ├── private List<T> records
│       ├── private Long total
│       ├── private Long current
│       └── private Long size
│
└── 🏷️ 基础类型
    ├── PageRequest - 分页请求
    │   ├── private Long current = 1L
    │   ├── private Long size = 10L
    │   ├── private String orderBy
    │   └── private Boolean isAsc = true
    └── BaseResponse<T> - 统一响应
        ├── private Integer code
        ├── private String message
        ├── private T data
        └── private Long timestamp
```

### 🎮 Controller 控制器构成

#### 🔧 控制器标准结构

```
Controller (controller[ComponentName].java)
├── 🏷️ 类注解
│   ├── @RestController - REST控制器
│   ├── @RequestMapping("/api/usercard") - 路由前缀
│   ├── @Api(tags = "用户卡片管理") - Swagger文档
│   └── @Validated - 参数验证
│
├── 🔗 依赖注入
│   ├── @Autowired private UserCardService userCardService
│   └── @Resource private RedisTemplate redisTemplate
│
├── 📊 CRUD接口
│   ├── @PostMapping("/create") - 创建
│   │   ├── @ApiOperation("创建用户卡片")
│   │   ├── public BaseResponse<Long> create(
│   │   ├──     @Valid @RequestBody CreateRequest request)
│   │   └── return userCardService.create(request)
│   │
│   ├── @GetMapping("/{id}") - 查询详情
│   │   ├── @ApiOperation("获取用户卡片详情")
│   │   ├── public BaseResponse<DetailResponse> getById(
│   │   ├──     @PathVariable Long id)
│   │   └── return userCardService.getById(id)
│   │
│   ├── @PutMapping("/update") - 更新
│   │   ├── @ApiOperation("更新用户卡片")
│   │   ├── public BaseResponse<Boolean> update(
│   │   ├──     @Valid @RequestBody UpdateRequest request)
│   │   └── return userCardService.update(request)
│   │
│   └── @DeleteMapping("/{id}") - 删除
│       ├── @ApiOperation("删除用户卡片")
│       ├── public BaseResponse<Boolean> delete(
│       ├──     @PathVariable Long id)
│       └── return userCardService.delete(id)
│
├── 📋 查询接口
│   ├── @GetMapping("/list") - 列表查询
│   │   ├── public BaseResponse<PageResponse<ListResponse>> list(
│   │   ├──     @Valid QueryRequest request,
│   │   ├──     PageRequest pageRequest)
│   │   └── return userCardService.list(request, pageRequest)
│   │
│   └── @GetMapping("/search") - 搜索接口
│       ├── @ApiOperation("搜索用户卡片")
│       ├── public BaseResponse<List<ListResponse>> search(
│       ├──     @RequestParam String keyword)
│       └── return userCardService.search(keyword)
│
└── 🔄 批量接口
    ├── @PostMapping("/batch/create") - 批量创建
    ├── @PutMapping("/batch/update") - 批量更新
    └── @DeleteMapping("/batch/delete") - 批量删除
```

### 🔧 Service 业务服务构成 (QueryWrapper)

#### 🎯 Service 标准结构

```
Service (service[ComponentName].java)
├── 🏷️ 类注解
│   ├── @Service - 服务注解
│   ├── @Transactional - 事务管理
│   └── @Slf4j - 日志注解
│
├── 🔗 依赖注入
│   ├── @Autowired private UserCardMapper userCardMapper
│   ├── @Autowired private RedisTemplate redisTemplate
│   └── @Resource private UserService userService
│
├── 📊 CRUD方法 (使用QueryWrapper)
│   ├── public Long create(CreateRequest request)
│   │   ├── // 数据验证和转换
│   │   ├── UserCard entity = convertToEntity(request)
│   │   ├── // 设置创建信息
│   │   ├── entity.setCreatedAt(LocalDateTime.now())
│   │   ├── // 保存到数据库
│   │   ├── userCardMapper.insert(entity)
│   │   └── return entity.getId()
│   │
│   ├── public DetailResponse getById(Long id)
│   │   ├── // 构建查询条件
│   │   ├── QueryWrapper<UserCard> wrapper = new QueryWrapper<>()
│   │   ├──     .eq("id", id)
│   │   ├──     .eq("deleted_at", null)
│   │   ├── UserCard entity = userCardMapper.selectOne(wrapper)
│   │   └── return convertToDetailResponse(entity)
│   │
│   ├── public Boolean update(UpdateRequest request)
│   │   ├── // 构建更新条件
│   │   ├── UpdateWrapper<UserCard> wrapper = new UpdateWrapper<>()
│   │   ├──     .eq("id", request.getId())
│   │   ├──     .set("updated_at", LocalDateTime.now())
│   │   ├── // 动态更新字段
│   │   ├── if (request.getName() != null) wrapper.set("name", request.getName())
│   │   ├── if (request.getStatus() != null) wrapper.set("status", request.getStatus())
│   │   └── return userCardMapper.update(null, wrapper) > 0
│   │
│   └── public Boolean delete(Long id)
│       ├── // 软删除实现
│       ├── UpdateWrapper<UserCard> wrapper = new UpdateWrapper<>()
│       ├──     .eq("id", id)
│       ├──     .set("deleted_at", LocalDateTime.now())
│       └── return userCardMapper.update(null, wrapper) > 0
│
├── 📋 查询方法 (复杂QueryWrapper)
│   ├── public PageResponse<ListResponse> list(QueryRequest request, PageRequest pageRequest)
│   │   ├── // 构建复杂查询条件
│   │   ├── QueryWrapper<UserCard> wrapper = new QueryWrapper<UserCard>()
│   │   ├──     .like(StringUtils.isNotBlank(request.getKeyword()), "name", request.getKeyword())
│   │   ├──     .eq(request.getStatus() != null, "status", request.getStatus())
│   │   ├──     .between(request.getStartTime() != null && request.getEndTime() != null,
│   │   ├──         "created_at", request.getStartTime(), request.getEndTime())
│   │   ├──     .orderByDesc("created_at")
│   │   ├── // 分页查询
│   │   ├── Page<UserCard> page = new Page<>(pageRequest.getCurrent(), pageRequest.getSize())
│   │   ├── IPage<UserCard> result = userCardMapper.selectPage(page, wrapper)
│   │   └── return convertToPageResponse(result)
│   │
│   └── public List<ListResponse> search(String keyword)
│       ├── // 全文搜索QueryWrapper
│       ├── QueryWrapper<UserCard> wrapper = new QueryWrapper<UserCard>()
│       ├──     .and(w -> w.like("name", keyword)
│       ├──         .or().like("title", keyword)
│       ├──         .or().like("content", keyword))
│       ├──     .eq("status", 1)
│       ├──     .orderByDesc("created_at")
│       ├──     .last("LIMIT 50")
│       └── return convertToListResponse(userCardMapper.selectList(wrapper))
│
└── 🔄 批量方法
    ├── public Boolean batchCreate(List<CreateRequest> requests)
    │   ├── List<UserCard> entities = requests.stream()
    │   ├──     .map(this::convertToEntity).collect(Collectors.toList())
    │   └── return userCardService.saveBatch(entities)
    │
    └── public Boolean batchUpdateStatus(List<Long> ids, Integer status)
        ├── UpdateWrapper<UserCard> wrapper = new UpdateWrapper<UserCard>()
        ├──     .in("id", ids)
        ├──     .set("status", status)
        ├──     .set("updated_at", LocalDateTime.now())
        └── return userCardMapper.update(null, wrapper) > 0
```

### 🗺️ Mapper 数据访问层构成 (QueryWrapper 简化版)

#### 🎯 QueryWrapper 时代的 Mapper 定位

**使用 QueryWrapper 后，大部分场景下 Mapper 层可以极度简化！**

#### 🔄 简化的 Mapper 接口结构

```
Mapper (mapper[ComponentName].java) - 可选文件
├── 🏷️ 最小接口注解
│   ├── @Mapper - MyBatis映射器
│   └── @Repository - 仓储注解(可选)
│
├── 🔗 仅继承BaseMapper (核心)
│   └── public interface UserCardMapper extends BaseMapper<UserCard>
│   // 这一行代码就获得了所有基础CRUD方法！
│   // insert(), selectById(), updateById(), deleteById()
│   // selectList(), selectPage(), selectCount()等
│
├── 📊 特殊场景自定义方法 (仅在必要时添加)
│   ├── // 极复杂的关联查询 (QueryWrapper难以处理)
│   ├── @Select("SELECT uc.*, u.username, p.profile_url " +
│   ├──         "FROM user_card uc " +
│   ├──         "LEFT JOIN user u ON uc.user_id = u.id " +
│   ├──         "LEFT JOIN user_profile p ON u.id = p.user_id " +
│   ├──         "WHERE uc.id = #{id}")
│   ├── UserCardDetailVO getDetailWithUserProfile(@Param("id") Long id)
│   │
│   ├── // 原生SQL性能优化查询
│   ├── @Select("SELECT * FROM user_card USE INDEX(idx_status_created) " +
│   ├──         "WHERE status = #{status} ORDER BY created_at DESC LIMIT #{limit}")
│   ├── List<UserCard> selectByStatusOptimized(@Param("status") Integer status, @Param("limit") Integer limit)
│   │
│   └── // 存储过程调用 (特殊业务场景)
│       ├── @Select("{CALL proc_user_card_statistics(#{userId})}")
│       └── Map<String, Object> getUserCardStatistics(@Param("userId") Long userId)
│
└── 💡 QueryWrapper 替代说明
    ├── // ❌ 不再需要这些方法 (QueryWrapper可以完美处理)
    ├── // List<UserCard> selectByName(String name)  
    ├── // ✅ 用 QueryWrapper 替代: 
    ├── // wrapper.eq("name", name)
    ├── 
    ├── // ❌ 不再需要这些方法
    ├── // List<UserCard> selectByStatusAndTime(Integer status, LocalDateTime start, LocalDateTime end)
    ├── // ✅ 用 QueryWrapper 替代:
    ├── // wrapper.eq("status", status).between("created_at", start, end)
    ├──
    ├── // ❌ 不再需要这些方法  
    ├── // int updateStatusById(Long id, Integer status)
    ├── // ✅ 用 UpdateWrapper 替代:
    └── // updateWrapper.eq("id", id).set("status", status)
```

#### 🚀 Service 层直接使用 BaseMapper + QueryWrapper

```
Service中的典型用法 (service[ComponentName].java)
├── 🔗 注入简化的Mapper
│   └── @Autowired private UserCardMapper userCardMapper;
│
├── 📊 QueryWrapper 替代复杂查询
│   ├── // 代替原来需要写在Mapper中的复杂方法
│   ├── public List<UserCard> findByComplexCondition(String keyword, Integer status, LocalDateTime start) {
│   ├──     QueryWrapper<UserCard> wrapper = new QueryWrapper<UserCard>()
│   ├──         .like(StringUtils.isNotBlank(keyword), "name", keyword)
│   ├──         .or().like(StringUtils.isNotBlank(keyword), "title", keyword)
│   ├──         .eq(status != null, "status", status)
│   ├──         .ge(start != null, "created_at", start)
│   ├──         .orderByDesc("created_at");
│   ├──     return userCardMapper.selectList(wrapper);
│   └── }
│
├── 🔄 UpdateWrapper 替代复杂更新
│   ├── public Boolean batchUpdateStatus(List<Long> ids, Integer status) {
│   ├──     UpdateWrapper<UserCard> wrapper = new UpdateWrapper<UserCard>()
│   ├──         .in("id", ids)
│   ├──         .set("status", status)
│   ├──         .set("updated_at", LocalDateTime.now());
│   ├──     return userCardMapper.update(null, wrapper) > 0;
│   └── }
│
└── 📈 分页查询也在Service中处理
    ├── public IPage<UserCard> getPageList(QueryRequest request, Long current, Long size) {
    ├──     Page<UserCard> page = new Page<>(current, size);
    ├──     QueryWrapper<UserCard> wrapper = new QueryWrapper<UserCard>()
    ├──         .like(StringUtils.isNotBlank(request.getKeyword()), "name", request.getKeyword())
    ├──         .eq(request.getStatus() != null, "status", request.getStatus())
    ├──         .orderByDesc("created_at");
    ├──     return userCardMapper.selectPage(page, wrapper);
    └── }
```

#### 💡 是否需要 Mapper 文件的判断标准

| 场景 | 是否需要 Mapper | 说明 |
|------|----------------|------|
| **简单 CRUD** | ❌ 不需要 | BaseMapper 已提供所有基础方法 |
| **条件查询** | ❌ 不需要 | QueryWrapper 可以处理 99% 的条件查询 |
| **分页查询** | ❌ 不需要 | `selectPage(page, wrapper)` 完美支持 |
| **批量操作** | ❌ 不需要 | `saveBatch()`, UpdateWrapper 批量更新 |
| **统计查询** | ❌ 不需要 | `selectCount(wrapper)` 可以处理大部分统计 |
| **复杂关联查询** | ✅ 可能需要 | 3表以上关联，QueryWrapper 难以处理 |
| **性能优化查询** | ✅ 可能需要 | 需要使用索引提示、原生 SQL 优化 |
| **存储过程调用** | ✅ 需要 | QueryWrapper 无法处理存储过程 |
| **复杂业务SQL** | ✅ 可能需要 | 特殊的业务逻辑 SQL |

### 📄 SQL 配置文件构成

#### 🎯 XML 映射文件结构

```
SQL配置 (sql[ComponentName].xml)
├── 📋 基础配置
│   ├── <?xml version="1.0" encoding="UTF-8"?>
│   ├── <!DOCTYPE mapper PUBLIC "-//mybatis.org//DTD Mapper 3.0//EN" 
│   ├──     "http://mybatis.org/dtd/mybatis-3-mapper.dtd">
│   └── <mapper namespace="com.example.mapper.UserCardMapper">
│
├── 🔍 ResultMap定义
│   ├── <resultMap id="BaseResultMap" type="com.example.entity.UserCard">
│   ├──     <id column="id" property="id" jdbcType="BIGINT"/>
│   ├──     <result column="name" property="name" jdbcType="VARCHAR"/>
│   ├──     <result column="created_at" property="createdAt" jdbcType="TIMESTAMP"/>
│   └── </resultMap>
│
├── 📊 复杂查询SQL
│   ├── <select id="selectByComplexCondition" resultMap="BaseResultMap">
│   ├──     SELECT * FROM user_card 
│   ├──     <where>
│   ├──         deleted_at IS NULL
│   ├──         <if test="condition.keyword != null and condition.keyword != ''">
│   ├──             AND (name LIKE CONCAT('%', #{condition.keyword}, '%')
│   ├──             OR title LIKE CONCAT('%', #{condition.keyword}, '%'))
│   ├──         </if>
│   ├──         <if test="condition.status != null">
│   ├──             AND status = #{condition.status}
│   ├──         </if>
│   ├──         <if test="condition.userIds != null and condition.userIds.size() > 0">
│   ├──             AND user_id IN
│   ├──             <foreach collection="condition.userIds" item="userId" open="(" separator="," close=")">
│   ├──                 #{userId}
│   ├──             </foreach>
│   ├──         </if>
│   ├──     </where>
│   ├──     ORDER BY created_at DESC
│   └── </select>
│
├── 📈 统计查询SQL
│   ├── <select id="getStatistics" resultType="map">
│   ├──     SELECT 
│   ├──         COUNT(*) as total,
│   ├──         COUNT(CASE WHEN status = 1 THEN 1 END) as active,
│   ├──         COUNT(CASE WHEN DATE(created_at) = CURDATE() THEN 1 END) as today
│   ├──     FROM user_card 
│   ├──     WHERE deleted_at IS NULL
│   └── </select>
│
└── 🔄 批量操作SQL
    ├── <insert id="batchInsertSelective">
    ├──     INSERT INTO user_card 
    ├──     <trim prefix="(" suffix=")" suffixOverrides=",">
    ├──         name, title, user_id, created_at,
    ├──     </trim>
    ├──     VALUES
    ├──     <foreach collection="list" item="item" separator=",">
    ├──         <trim prefix="(" suffix=")" suffixOverrides=",">
    ├──             #{item.name}, #{item.title}, #{item.userId}, #{item.createdAt},
    ├──         </trim>
    ├──     </foreach>
    └── </insert>
```

### 🎣 状态管理命名

| 功能类型 | 命名格式 | 示例 | 职责 |
|---------|---------|------|------|
| **主状态管理** | `use[ComponentName].[ext]` | `useUserCard.[ext]` | 组件核心状态逻辑 |
| **功能状态** | `use[ComponentName][Feature].[ext]` | `useUserCardAnimation.[ext]` | 特定功能状态管理 |
| **数据状态** | `use[ComponentName][DataSource].[ext]` | `useUserCardData.[ext]` | 数据获取和管理 |
| **表单状态** | `use[ComponentName][Form].[ext]` | `useUserCardForm.[ext]` | 表单状态管理 |

### 🎯 事件处理命名 (专注用户操作)

| 事件类型 | 命名格式 | 示例 | 职责 |
|---------|---------|------|------|
| **基础交互** | `on[ComponentName][Action].[ext]` | `onUserCardClick.[ext]` | 处理基础用户操作 (点击、输入) |
| **复杂操作** | `on[ComponentName][UserAction].[ext]` | `onUserCardLongPress.[ext]` | 处理复杂用户操作 (长按、滑动) |
| **表单操作** | `on[ComponentName][FormAction].[ext]` | `onUserCardSubmit.[ext]` | 处理表单相关操作 |
| **多步操作** | `on[ComponentName][FlowAction].[ext]` | `onUserCardConfirm.[ext]` | 处理多步骤用户操作 |

### 🧭 导航处理命名

| 导航类型 | 命名格式 | 示例 | 职责 |
|---------|---------|------|------|
| **页面跳转** | `navigateTo[Target].[ext]` | `navigateToProfile.[ext]` | 跳转到目标页面 |
| **返回导航** | `navigateBack[Source].[ext]` | `navigateBackFromProfile.[ext]` | 从当前页面返回 |
| **流程导航** | `navigate[ComponentName][Flow].[ext]` | `navigateUserCardFlow.[ext]` | 多步骤流程导航 |
| **条件导航** | `navigateIf[Condition].[ext]` | `navigateIfLoggedIn.[ext]` | 条件性导航跳转 |

### 🌐 API接口处理命名

| 接口类型 | 命名格式 | 示例 | 职责 |
|---------|---------|------|------|
| **基础接口** | `api[ComponentName][Action].[ext]` | `apiUserCardFetch.[ext]` | 基础数据获取接口 |
| **数据源接口** | `api[ComponentName][DataSource].[ext]` | `apiUserCardProfile.[ext]` | 特定数据源接口 |
| **操作接口** | `api[ComponentName][Operation].[ext]` | `apiUserCardUpdate.[ext]` | 数据操作接口 (增删改) |
| **批量接口** | `api[ComponentName][Batch].[ext]` | `apiUserCardBatchLoad.[ext]` | 批量操作接口 |

### 🔌 后端交互层命名 (MyBatis Plus + QueryWrapper 架构)

| 交互类型 | 命名格式 | 示例 | 职责 | 使用场景 |
|---------|---------|------|------|----------|
| **实体类** | `entity[ComponentName].[ext]` | `entityUserCard.java` | 数据模型和业务实体定义 (MP注解) | ✅ 必需 |
| **数据传输对象** | `dto[ComponentName][Action].[ext]` | `dtoUserCardRequest.java` | 请求响应数据结构 | ✅ 必需 |
| **控制器** | `controller[ComponentName].[ext]` | `controllerUserCard.java` | REST API接口和路由定义 | ✅ 必需 |
| **业务服务** | `service[ComponentName].[ext]` | `serviceUserCard.java` | 业务逻辑封装 (主要使用QueryWrapper) | ✅ 必需 |
| **数据访问接口** | `mapper[ComponentName].[ext]` | `mapperUserCard.java` | 数据访问接口 | 🟡 仅在需要特殊查询时 |
| **复杂SQL配置** | `sql[ComponentName].xml` | `sqlUserCard.xml` | 复杂SQL查询配置 | 🟡 仅在极复杂SQL时 |

### 🔄 数据处理命名

| 处理类型 | 命名格式 | 示例 | 职责 |
|---------|---------|------|------|
| **数据处理** | `process[ComponentName][Data].[ext]` | `processUserCardData.[ext]` | 原始数据处理 |
| **数据转换** | `transform[ComponentName][Format].[ext]` | `transformUserCardFormat.[ext]` | 数据格式转换 |
| **数据验证** | `validate[ComponentName][Input].[ext]` | `validateUserCardInput.[ext]` | 输入数据验证 |
| **数据过滤** | `filter[ComponentName][Criteria].[ext]` | `filterUserCardList.[ext]` | 数据筛选过滤 |

### 🛠️ 工具函数命名

| 工具类型 | 命名格式 | 示例 | 职责 |
|---------|---------|------|------|
| **格式化** | `format[ComponentName][Display].[ext]` | `formatUserCardDisplay.[ext]` | 显示格式化 |
| **计算逻辑** | `calculate[ComponentName][Value].[ext]` | `calculateUserCardScore.[ext]` | 数值计算逻辑 |
| **动画逻辑** | `animate[ComponentName][Transition].[ext]` | `animateUserCardTransition.[ext]` | 动画过渡效果 |
| **工具函数** | `[verb][ComponentName][Object].[ext]` | `sortUserCardList.[ext]` | 通用工具函数 |

## 🏗️ 扁平化目录结构说明

### 📦 组件根目录 (扁平化组织)
```
ComponentName/                          # 组件名称，使用PascalCase
├── {ComponentName}.[ext]               # 主组件实现 (必需)
├── types.[ext]                         # 类型定义 (必需)
├── constants.[ext]                     # 常量配置 (可选)
├── README.md                          # 文档说明 (推荐)
│
├── use[ComponentName]*.[ext]           # 状态管理相关文件
├── on[ComponentName]*.[ext]            # 用户操作事件相关文件
├── navigateTo*.[ext]                   # 导航处理相关文件
├── api[ComponentName]*.[ext]           # API接口相关文件
├── process[ComponentName]*.[ext]       # 数据处理相关文件
└── format[ComponentName]*.[ext]        # 工具函数相关文件
```

### 📋 扁平化组织的优势
- **减少文件夹嵌套** - 避免过深的目录层级
- **快速定位文件** - 通过文件名前缀快速找到相关功能
- **适度耦合** - 相关功能文件在同一层级，便于维护
- **符合现有结构** - 适配 `xxxPage/xxxComponentName/` 的现有组织方式

## 📐 扁平化文件组织原则

### 🎯 按功能前缀组织
```
ComponentName/
├── {ComponentName}.[ext]               # 主组件 (UI渲染和组装)
├── types.[ext]                         # 类型定义
├── constants.[ext]                     # 常量配置
│
├── use[ComponentName]*.[ext]           # 状态管理 (use前缀)
├── on[ComponentName]*.[ext]            # 用户事件 (on前缀)  
├── navigateTo*.[ext]                   # 导航处理 (navigate前缀)
├── api[ComponentName]*.[ext]           # 接口调用 (api前缀)
├── process[ComponentName]*.[ext]       # 数据处理 (process前缀)
└── format[ComponentName]*.[ext]        # 工具函数 (format/calculate等前缀)
```

### 🔗 扁平化依赖关系
```
主组件 ({ComponentName}.[ext])
    ↓ 直接导入
状态管理 (use*) + 用户事件 (on*) + 导航 (navigate*) + 接口 (api*)
    ↓ 可能依赖  
数据处理 (process*) + 工具函数 (format*等)
    ↓ 基础依赖
类型定义 (types) + 常量配置 (constants)
```

### 📋 适度耦合的好处
- **减少文件跳转** - 相关文件都在同一目录下
- **降低复杂度** - 避免过度的抽象和分层
- **提高开发效率** - 快速找到和修改相关功能
- **符合项目现状** - 适配现有的组件组织结构

## 📊 统一架构标准 (所有组件必须实施)

### 🎯 完整组件结构 (统一标准)
```
ComponentName/
├── {ComponentName}.[ext]               # 主组件
├── types.[ext]                         # 类型定义
├── constants.[ext]                     # 常量定义
├── use[ComponentName].[ext]            # 主状态管理
├── use[ComponentName][Feature].[ext]   # 功能状态管理 (按需)
├── on[ComponentName][Action].[ext]     # 基础用户事件
├── on[ComponentName][UserAction].[ext] # 复杂用户操作 (按需)
├── navigateTo[Target].[ext]           # 导航处理 (按需)
├── api[ComponentName][Action].[ext]    # 基础API接口 (与backend/配套)
├── api[ComponentName][DataSource].[ext] # 数据源接口 (与backend/配套)
├── backend/                           # 后端代码文件夹 (与api*配套)
│   ├── entity[ComponentName].java      # MyBatis Plus实体类
│   ├── dto[ComponentName][Action].java # 数据传输对象
│   ├── controller[ComponentName].java  # REST API控制器
│   ├── service[ComponentName].java     # QueryWrapper业务服务
│   ├── mapper[ComponentName].java      # 数据访问接口 - 仅在需要特殊查询时
│   └── sql[ComponentName].xml          # 复杂SQL查询 - 仅在极复杂SQL时
├── process[ComponentName][Data].[ext]  # 数据处理 (按需)
├── format[ComponentName][Display].[ext] # 格式化工具 (按需)
└── README.md                          # 文档
```

### 🔧 实施原则

1. **核心文件必须创建**: `{ComponentName} + types + constants + use[ComponentName] + README`
2. **功能文件按需创建**: 根据组件实际功能需求创建对应的功能文件
3. **API与后端配套**: 创建API接口层时必须同时创建完整的后端交互层
4. **预留扩展空间**: 即使当前不需要，也要考虑未来可能的扩展需求
5. **不允许简化**: 不得因为组件当前简单而省略应有的架构设计

**适用场景**: 所有组件，无论复杂度如何，都按此标准实施

## ✅ 架构实施检查清单

### 📋 组件创建检查清单

#### 🔍 规划阶段
- [ ] 确定组件复杂度级别 (Basic/Intermediate/Advanced)
- [ ] 分析组件功能需求和职责边界
- [ ] 设计组件的对外接口 (Props/API)
- [ ] 确定需要的文件类型和数量

#### 🏗️ 创建阶段
- [ ] 创建组件根目录 (使用PascalCase命名)
- [ ] 创建主组件文件 `Component.[ext]`
- [ ] 创建类型定义文件 `types.[ext]`
- [ ] 创建组件文档 `README.md`
- [ ] 根据复杂度创建其他必要文件

#### 🔧 实现阶段
- [ ] 实现主组件的UI逻辑
- [ ] 定义完整的类型接口
- [ ] 提取和定义常量配置
- [ ] 实现状态管理逻辑 (如需要)
- [ ] 实现事件处理逻辑 (如需要)
- [ ] 实现导航处理逻辑 (如需要)
- [ ] 实现数据处理逻辑 (如需要)

#### 📝 文档阶段
- [ ] 编写组件使用说明
- [ ] 编写API接口文档
- [ ] 提供使用示例代码
- [ ] 说明注意事项和限制

#### ✅ 质量检查
- [ ] 确保文件命名遵循规范
- [ ] 确保每个文件职责单一
- [ ] 确保类型定义完整
- [ ] 确保错误处理完善
- [ ] 进行功能测试验证

### 🔄 重构现有组件检查清单

#### 📊 分析阶段
- [ ] 分析现有组件的功能和职责
- [ ] 识别可拆分的逻辑模块
- [ ] 评估重构的必要性和收益
- [ ] 制定重构计划和步骤

#### 🚧 重构阶段
- [ ] 创建新的目录结构
- [ ] 拆分类型定义到 `types.[ext]`
- [ ] 提取常量到 `constants.[ext]`
- [ ] 拆分状态管理逻辑
- [ ] 拆分事件处理逻辑
- [ ] 拆分导航处理逻辑
- [ ] 拆分数据处理逻辑
- [ ] 重构主组件文件

#### 🔗 集成阶段
- [ ] 更新组件内部引用关系
- [ ] 更新外部组件引用
- [ ] 更新测试用例
- [ ] 验证功能完整性

#### 📚 维护阶段
- [ ] 更新组件文档
- [ ] 清理旧的代码文件
- [ ] 通知团队成员变更
- [ ] 监控重构后的稳定性

## 🎯 架构收益与价值

### 💡 开发效率提升
- **快速定位**: 通过文件名直接找到相关功能代码
- **并行开发**: 不同开发者可以同时开发不同功能模块
- **减少冲突**: 文件职责明确，减少代码合并冲突
- **复用性强**: 功能模块可以在多个组件间复用

### 🔧 维护性提升
- **职责清晰**: 每个文件的作用一目了然
- **影响范围小**: 修改某个功能不会影响其他功能
- **测试友好**: 每个功能模块可以独立测试
- **重构安全**: 清晰的依赖关系使重构更安全

### 👥 团队协作优化
- **标准统一**: 所有组件遵循相同的组织标准
- **学习成本低**: 新团队成员容易理解代码结构
- **知识传递**: 清晰的文档和结构便于知识传递
- **代码审查**: 更容易进行代码审查和质量控制

### 🚀 项目扩展性
- **技术栈迁移**: 架构思想可以跨框架应用
- **功能扩展**: 新增功能时有明确的添加位置
- **性能优化**: 清晰的模块边界便于性能优化
- **长期演进**: 支持项目的长期发展和演进

---

## 🤖 Agent 重构操作指南

### 📋 重构执行步骤

#### 1️⃣ 分析阶段 (必须执行)
```
✅ 分析现有组件的所有功能模块
✅ 识别所有需要拆分的逻辑模块
✅ 列出需要创建的完整文件清单
✅ 规划完整的架构结构 (不允许简化)
```

#### 2️⃣ 创建阶段 (按顺序执行)
```
1. 创建组件根目录 ComponentName/
2. 创建核心文件：
   ✅ {ComponentName}.[ext] - 主组件文件
   ✅ types.[ext] - 类型定义文件
   ✅ constants.[ext] - 常量定义文件
   ✅ README.md - 组件文档文件
3. 根据复杂度创建功能文件：
   ✅ use[ComponentName]*.[ext] - 状态管理文件
   ✅ on[ComponentName]*.[ext] - 事件处理文件
   ✅ navigateTo*.[ext] - 导航处理文件
   ✅ api[ComponentName]*.[ext] - API接口文件（与backend/配套）
   ✅ backend/ - 后端交互文件夹（与api*配套，必须同时创建）
   ✅ process[ComponentName]*.[ext] - 数据处理文件
   ✅ format[ComponentName]*.[ext] - 工具函数文件
```

#### 3️⃣ 重构阶段 (逐文件执行 - 遵循 YAGNI + MVP)
```
✅ 将原组件代码按职责拆分到对应文件
✅ 提取所有类型定义到 types.[ext] (仅当前需要的类型)
✅ 提取所有常量到 constants.[ext] (仅当前使用的常量)
✅ 拆分状态管理逻辑到 use*.[ext] (最小可用状态管理)
✅ 拆分事件处理逻辑到 on*.[ext] (核心事件处理)
✅ 拆分导航逻辑到 navigate*.[ext] (基础导航功能)
✅ 拆分API调用到 api*.[ext] (核心API接口，配套backend/)
✅ 创建完整后端交互层 backend/ (最小可用后端实现)
✅ 拆分数据处理到 process*.[ext] (基础数据处理)
✅ 重构主组件文件，整合各模块 (简洁的组装逻辑)

🎯 重构原则：架构完整 + 实现简洁 (YAGNI + MVP)
```

#### 4️⃣ 验证阶段 (质量检查)
```
✅ 检查文件命名是否符合规范
✅ 检查每个文件职责是否单一
✅ 检查类型定义是否完整
✅ 检查导入导出是否正确
✅ 检查是否有遗漏的功能模块
✅ 编写完整的 README.md 文档
```

### 🎯 重构质量标准

#### ✅ 合格标准
- [x] 所有文件命名符合规范
- [x] 每个文件职责单一明确
- [x] 类型定义完整准确
- [x] 常量全部提取
- [x] 主组件文件简洁清晰
- [x] 提供完整的使用文档
- [x] 错误处理完善

#### 🚫 不合格表现
- [ ] 文件命名模糊不清
- [ ] 多个职责混合在一个文件
- [ ] 缺少类型定义
- [ ] 硬编码常量
- [ ] 主组件过于复杂
- [ ] 缺少使用文档
- [ ] 忽略错误处理

### 📝 重构报告模板

**Agent 完成重构后必须提供以下报告：**

```markdown
## 🔧 组件重构报告

### 📊 重构概况
- **组件名称**: ComponentName
- **架构标准**: 完整结构 (统一标准)
- **创建文件数**: X 个
- **重构前文件数**: Y 个

### 📁 文件结构
```
ComponentName/
├── index.[ext]                 # 主组件 - [功能描述]
├── types.[ext]                 # 类型定义 - [包含类型数量]
├── constants.[ext]             # 常量定义 - [常量数量]
├── [其他文件...]
└── README.md                   # 使用文档
```

### 🔧 重构内容
1. **类型定义拆分**: 提取了 X 个类型定义
2. **常量提取**: 提取了 Y 个常量
3. **状态管理**: 拆分了 Z 个状态管理模块
4. **事件处理**: 拆分了 W 个事件处理模块
5. **[其他拆分内容...]**

### 📋 质量检查
- [x] 文件命名规范 ✅
- [x] 职责单一性 ✅
- [x] 类型完整性 ✅
- [x] 文档完整性 ✅

### 🎯 使用方式
[提供重构后组件的使用示例]
```

**🚨 强制要求：Agent 必须严格按照本文档的完整架构标准执行重构，不得省略任何步骤，不得简化任何结构！**

---

## 🔄 伪页面组件迁移指南

### 📋 从 components/ 层级迁移到扁平化架构

#### 🎯 迁移目标

**从**:
```
src/screens/{PageName}/
├── components/                                     # ❌ 需要移除的中间层
│   ├── {ComponentName}.tsx                        # ❌ 单文件组件
│   └── {AnotherComponent}/                        # ❌ 已重构但位置错误的组件
```

**到**:
```
src/screens/{PageName}/                            # 页面层
├── {ComponentName}/                               # ✅ 伪页面组件 (扁平化)
│   ├── {ComponentName}.tsx                        # 主组件文件
│   ├── types.ts                                   # 类型定义
│   ├── constants.ts                               # 常量配置
│   ├── use{ComponentName}.ts                      # 状态管理
│   └── [其他架构文件...]
├── {AnotherComponent}/                            # ✅ 另一个伪页面组件
└── {PageName}Screen.tsx                           # 页面主文件
```

#### 🚀 迁移步骤

##### 1️⃣ **单文件组件 → 伪页面组件**

**迁移前**: `src/screens/home/components/UserCard.tsx`

**迁移后**:
```
src/screens/home/UserCard/                         # ✅ 新的伪页面组件位置
├── UserCard.tsx                                   # 从原 UserCard.tsx 重构
├── types.ts                                       # 提取类型定义
├── constants.ts                                   # 提取常量
├── useUserCard.ts                                 # 提取状态管理
├── onUserCardClick.ts                             # 提取事件处理
└── README.md                                      # 组件文档
```

##### 2️⃣ **已重构组件 → 位置调整**

**迁移前**: `src/screens/discover/components/WaterfallCard/`

**迁移后**: `src/screens/discover/WaterfallCard/` (仅调整位置)

##### 3️⃣ **更新导入路径**

**迁移前**:
```typescript
import UserCard from './components/UserCard';
import WaterfallCard from './components/WaterfallCard';
```

**迁移后**:
```typescript
import UserCard from './UserCard';
import WaterfallCard from './WaterfallCard';
```

##### 4️⃣ **移除空的 components/ 文件夹**

所有组件迁移完成后，删除空的 `components/` 文件夹。

#### ✅ 迁移验证清单

- [ ] 所有组件都位于 `src/screens/{PageName}/{ComponentName}/`
- [ ] 不存在 `components/` 中间层级
- [ ] 单文件组件已重构为完整架构结构
- [ ] 导入路径已更新
- [ ] 功能测试通过
- [ ] 每个伪页面组件都有完整的架构文件

### 🎯 伪页面组件架构收益

#### ✅ **扁平化优势**
1. **减少层级嵌套** - 移除不必要的 `components/` 中间层
2. **提升组件地位** - 组件获得更大的架构自主权
3. **便于功能扩展** - 组件可以轻松成长为复杂功能模块
4. **开发效率提升** - 减少文件路径长度，提高开发体验
5. **职责更清晰** - 每个组件都是独立的功能单元

#### 🔄 **重构策略**
1. **保留已重构的组件** - 如 `WaterfallCard/` 已经符合架构标准，仅需调整位置
2. **重构单文件组件** - 将 `.tsx` 单文件重构为文件夹结构
3. **移除中间层级** - 将所有组件提升到页面层级
4. **更新导入路径** - 更新相关的 import 语句

#### 🚀 **最终效果**
每个伪页面组件都成为**"小页面"**，拥有完整的功能和架构权力，支持独立开发、测试和维护！

---

## 📄 文档信息

**版本**: 2.0.0  
**更新日期**: 2024年  
**适用范围**: 所有现代前端框架和编程语言  
**架构标准**: 统一完整结构，无分级简化  
**维护者**: 架构团队

### 🎯 伪页面组件架构核心原则总结

#### 🏗️ **架构层面原则**
1. **扁平化组织** - 所有组件直接位于 `src/screens/{PageName}/{ComponentName}/`
2. **移除中间层** - 禁止使用 `components/` 中间层级
3. **统一标准** - 所有伪页面组件都按完整架构实施
4. **不允许简化** - 禁止因组件简单而省略结构
5. **前瞻性设计** - 为未来扩展预留完整架构空间
6. **平等地位** - 伪页面组件与页面主文件处于同一层级

#### 💻 **代码实施原则**
7. **YAGNI 原则** - 只实现当前需要的功能，避免过度设计
8. **MVP 原则** - 每个文件只包含核心必需功能，渐进式完善
9. **架构完整 + 实现简洁** - 结构完整但代码简洁
10. **快速迭代** - 优先可用版本，后续根据需求完善

#### 🚀 **执行原则**
11. **强制执行** - Agent 必须严格按标准执行，无选择余地
12. **双重标准** - 架构必须完整，代码必须简洁 (YAGNI + MVP)
