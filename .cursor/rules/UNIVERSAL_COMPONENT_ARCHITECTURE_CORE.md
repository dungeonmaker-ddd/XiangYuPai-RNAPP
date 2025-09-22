# 通用组件模块化架构核心标准

## 🤖 Agent 执行指令

**当 Agent 接收到本架构文档时，必须严格按照以下要求执行：**

### 🎯 强制执行规则

1. **📁 嵌套化主导架构**
   - 组件位置：`src/screens/{PageName}/{ComponentName}/`
   - 默认嵌套化架构，支持多组件页面
   - 移除 `components/` 中间层级
   - 页面级统一管理状态和导航

2. **🔧 完整结构要求**
   - 核心文件必需：`index.[ext]`、`types.[ext]`、`constants.[ext]`、`README.md`
   - 功能层按需创建，职责不得混合
   - API接口层与后端交互层配套出现

3. **🚫 禁止行为**
   - 禁止省略核心文件
   - 禁止职责混合
   - 禁止命名不规范
   - 禁止常量硬编码

## 🏗️ 页面父组件集成架构

```
src/screens/                                        # 页面容器层
├── {PageName}/                                     # 具名页面 (如 discover, home, profile)
│   ├── index.[ext]                                 # 📱 页面父组件 - 集成所有子组件
│   ├── types.[ext]                                 # 📋 页面类型定义 - 导出所有相关类型
│   ├── constants.[ext]                             # ⚙️ 页面常量配置 - 导出所有相关常量
│   ├── README.md                                   # 📖 页面文档 - 包含所有组件说明
│   │
│   ├── 🔄 页面状态管理层 (统一管理)
│   │   ├── use{PageName}.[ext]                     # 页面主状态管理
│   │   ├── use{PageName}Form.[ext]                 # 页面表单状态管理
│   │   └── use{PageName}Data.[ext]                 # 页面数据状态管理
│   │
│   ├── 🧭 页面导航层 (统一管理)
│   │   ├── navigateTo[Target].[ext]                # 页面跳转导航
│   │   ├── navigateBack[Source].[ext]              # 返回导航
│   │   └── navigate{PageName}Flow.[ext]            # 流程导航
│   │
│   ├── {ComponentAreaName1}/                       # ✅ 组件区域1 - 顶部布局区域
│   │   ├── index.[ext]                             # 主组件文件
│   │   ├── types.[ext]                             # 组件类型定义 (可选)
│   │   ├── constants.[ext]                         # 组件常量配置 (可选)
│   │   ├── README.md                               # 组件文档
│   │   │
│   │   ├── {FunctionAreaName1}/                    # 🔸 功能区域1 - 复杂的逻辑，嵌套实现
│   │   │   ├── index.[ext]                         # 区域主文件
│   │   │   ├── types.[ext]                         # 区域类型定义 (可选)
│   │   │   ├── constants.[ext]                     # 区域常量 (可选)
│   │   │   ├── use[LocalState].[ext]               # 区域本地状态
│   │   │   ├── on[Action].[ext]                    # 区域事件处理
│   │   │   ├── api[Action].[ext]                   # 区域API接口
│   │   │   ├── process[Data].[ext]                 # 数据处理
│   │   │   └── utils[Function].[ext]               # 工具函数
│   │   │
│   │   ├── {FunctionAreaName2}/                    # 🟢 功能区域2 扁平实现
│   │   │   ├── index.[ext]                         # 区域主文件
│   │   │   ├── constants.[ext]                     # 区域常量
│   │   │   ├── processData.[ext]                   # 数据处理
│   │   │   └── utilsDisplay.[ext]                  # 显示工具
│   │   │
│   │   └── {FunctionAreaName3}/                    # 🔸 功能区域3 复杂交互，嵌套实现
│   │       ├── index.[ext]                         # 区域主文件
│   │       ├── use[LocalState].[ext]               # 区域本地状态
│   │       ├── on[Action].[ext]                    # 区域事件处理
│   │       ├── processLogic.[ext]                  # 逻辑处理
│   │       └── utilsHelper.[ext]                   # 辅助工具
│   │
│   ├── {ComponentAreaName2}/                       # ✅ 组件区域2 - 主要内容区域
│   │   ├── index.[ext]                             # 主组件文件
│   │   ├── types.[ext]                             # 组件类型定义 (可选)
│   │   ├── constants.[ext]                         # 组件常量配置 (可选)
│   │   ├── README.md                               # 组件文档
│   │   │
│   │   ├── {FunctionAreaName1}/                    # 🔸 功能区域1 - 复杂布局才需要，嵌套实现
│   │   │   ├── index.[ext]                         # 区域主文件
│   │   │   ├── processContent.[ext]                # 内容处理
│   │   │   └── utilsFormat.[ext]                   # 格式化工具
│   │   │
│   │   ├── {FunctionAreaName2}/                    # 🟢 功能区域2 - 展示卡片扁平实现
│   │   │   ├── index.[ext]                         # 区域主文件
│   │   │   └── utilsSimple.[ext]                   # 简单工具
│   │   │
│   │   ├── {FunctionAreaName3}/                    # 🔸 功能区域3 - 复杂处理逻辑，嵌套实现
│   │   │   ├── index.[ext]                         # 区域主文件
│   │   │   ├── processData.[ext]                   # 数据处理
│   │   │   └── utilsDisplay.[ext]                  # 显示工具
│   │   │
│   │   └── {FunctionAreaName4}/                    # 🟢 功能区域4 - 简单展示模块，扁平实现
│   │       ├── index.[ext]                         # 区域主文件
│   │       └── utilsHelper.[ext]                   # 辅助工具
│   │
│   ├── {ComponentAreaName3}/                       # ✅ 组件区域3 - 操作交互区域
│   │   ├── index.[ext]                             # 主组件文件
│   │   ├── types.[ext]                             # 组件类型定义 (可选)
│   │   ├── constants.[ext]                         # 组件常量配置 (可选)
│   │   ├── README.md                               # 组件文档
│   │   │
│   │   ├── {FunctionAreaName1}/                    # 🔸 功能区域1 - 复杂逻辑，嵌套实现
│   │   │   ├── index.[ext]                         # 区域主文件
│   │   │   ├── on[Action].[ext]                    # 交互事件
│   │   │   ├── processInteraction.[ext]            # 交互处理
│   │   │   └── utilsAnimation.[ext]                # 动画工具
│   │   │
│   │   └── {FunctionAreaName2}/                    # 🟢 功能区域2 - 简单操作，扁平实现
│   │       ├── index.[ext]                         # 区域主文件
│   │       └── utilsAnimation.[ext]                # 动画工具
│   │
│   ├── {ComponentAreaName4}/                       # ✅ 组件区域4 - 其他功能区域
│   ├── {ComponentAreaName...}/                     # ✅ 更多组件区域 - 根据页面需要动态添加
│   │
│   ├── 🌐 页面API层 (配套实施 - 与后端交互层同时出现)
│   │   ├── api{PageName}[Action].[ext]             # 页面级API接口
│   │   └── api{PageName}Aggregate.[ext]            # 聚合API接口
│   │
│   ├── 🔌 后端交互层 (配套实施)
│   │   └── backend/                                # 后端代码文件夹
│   │       ├── entity{PageName}.[ext]              # 实体类
│   │       ├── dto{PageName}[Action].[ext]         # 数据传输对象
│   │       ├── controller{PageName}.[ext]          # 控制器
│   │       ├── service{PageName}.[ext]             # 业务服务
│   │       ├── mapper{PageName}.[ext]              # 数据访问 (可选)
│   │       └── sql{PageName}.xml                   # 复杂SQL (可选)
│   │
│   ├── 🔄 页面数据处理层 (按需实施)
│   │   ├── process{PageName}Data.[ext]             # 页面数据处理
│   │   ├── processAggregateData.[ext]              # 聚合数据处理
│   │   └── processValidation.[ext]                 # 数据验证处理
│   │
│   └── 🛠️ 页面工具层 (按需实施)
│       ├── utils{PageName}Display.[ext]            # 页面显示工具
│       ├── utilsCoordination.[ext]                 # 组件协调工具
│       └── utilsGlobal.[ext]                       # 全局工具函数
```

### 💡 架构说明

- **📱 页面父组件**: 负责集成和协调所有子组件
- **🔄 页面状态管理**: 统一管理页面级状态，子组件只管理简单本地状态
- **🧭 页面导航**: 统一管理页面级导航
- **✅ ComponentAreaName**: 使用通用的组件区域命名，通过注释详细描述具体的布局功能和职责
- **🔸🟢 FunctionAreaName**: 使用通用的功能区域命名，通过注释详细描述具体的业务功能、实现复杂度和技术细节

## 📋 命名规范

### 🏷️ 核心文件
| 文件类型 | 命名格式 | 职责描述 |
|---------|---------|----------|
| **主组件** | `index.[ext]` | 组件的主要UI实现和功能组装 |
| **类型定义** | `types.[ext]` | 数据结构、接口、类型定义 |
| **常量定义** | `constants.[ext]` | 组件相关的常量配置 |
| **组件文档** | `README.md` | 组件使用说明和API文档 |

### 🔄 状态管理
| 功能类型 | 命名格式 | 示例 |
|---------|---------|------|
| **页面状态** | `use{PageName}.[ext]` | `useDiscover.[ext]` |
| **表单状态** | `use{PageName}Form.[ext]` | `useDiscoverForm.[ext]` |
| **数据状态** | `use{PageName}Data.[ext]` | `useDiscoverData.[ext]` |
| **本地状态** | `use[LocalState].[ext]` | `useToggle.[ext]` |

### 🎯 事件处理
| 事件类型 | 命名格式 | 示例 |
|---------|---------|------|
| **基础交互** | `on[Action].[ext]` | `onClick.[ext]` |
| **复杂操作** | `on[UserAction].[ext]` | `onLongPress.[ext]` |

### 🧭 导航处理
| 导航类型 | 命名格式 | 示例 |
|---------|---------|------|
| **页面跳转** | `navigateTo[Target].[ext]` | `navigateToProfile.[ext]` |
| **返回导航** | `navigateBack[Source].[ext]` | `navigateBack.[ext]` |
| **流程导航** | `navigate{PageName}Flow.[ext]` | `navigateDiscoverFlow.[ext]` |

### 🌐 API接口
| 接口类型 | 命名格式 | 示例 |
|---------|---------|------|
| **基础接口** | `api[Action].[ext]` | `apiFetch.[ext]` |
| **页面接口** | `api{PageName}[Action].[ext]` | `apiDiscoverFetch.[ext]` |

### 🔄 数据处理 (简化前缀)
| 处理类型 | 命名格式 | 示例 |
|---------|---------|------|
| **数据处理** | `processData.[ext]` | `processData.[ext]` |
| **逻辑处理** | `processLogic.[ext]` | `processLogic.[ext]` |
| **内容处理** | `processContent.[ext]` | `processContent.[ext]` |
| **验证处理** | `processValidation.[ext]` | `processValidation.[ext]` |

### 🛠️ 工具函数 (简化前缀)
| 工具类型 | 命名格式 | 示例 |
|---------|---------|------|
| **显示工具** | `utilsDisplay.[ext]` | `utilsDisplay.[ext]` |
| **辅助工具** | `utilsHelper.[ext]` | `utilsHelper.[ext]` |
| **动画工具** | `utilsAnimation.[ext]` | `utilsAnimation.[ext]` |
| **格式化工具** | `utilsFormat.[ext]` | `utilsFormat.[ext]` |

## 📝 八段式文件内代码编写规范

### 🎯 八段式结构标准

所有 `index.[ext]` 主文件都必须按照以下八段式结构组织代码：

```
// #region 1. File Banner & TOC
/**
 * 组件名称 - 功能描述
 * 
 * TOC (快速跳转):
 * [1] Imports
 * [2] Types & Schema  
 * [3] Constants & Config
 * [4] Utils & Helpers
 * [5] State Management
 * [6] Domain Logic
 * [7] UI Components & Rendering
 * [8] Exports
 */
// #endregion

// #region 2. Imports
// React/框架核心导入
// 第三方库导入
// 内部模块导入 (./types, ./constants, ./use*, ./on*, etc.)
// #endregion

// #region 3. Types & Schema
// Props接口定义
// 本地类型定义 (如果types.[ext]不够用)
// 运行时Schema (可选)
// #endregion

// #region 4. Constants & Config
// 本地常量 (如果constants.[ext]不够用)
// 配置项
// #endregion

// #region 5. Utils & Helpers
// 本地工具函数
// 格式化函数
// 计算函数
// #endregion

// #region 6. State Management
// 状态初始化
// useEffect副作用
// 状态派生和计算
// #endregion

// #region 7. Domain Logic
// 事件处理函数
// 业务逻辑函数
// API调用逻辑
// #endregion

// #region 8. UI Components & Rendering
// 子组件定义 (如果简单的话)
// 主渲染JSX
// 条件渲染逻辑
// 样式定义
// #endregion

// #region 9. Exports
// export default Component
// 可选导出 (types, utils等)
// #endregion
```

### 💡 八段式编写原则

- **严格分段**: 每段职责单一，使用 `#region` 标记
- **顺序固定**: 必须按1-8的顺序组织代码
- **可折叠导航**: 便于快速定位和代码审查
- **自包含**: 避免跨段的复杂依赖关系

## 🤖 Agent 重构操作指南

### 📋 重构执行步骤

1. **分析阶段**: 分析现有组件功能模块，规划完整架构结构
2. **创建阶段**: 创建组件根目录和核心文件，根据功能需求创建对应文件
3. **重构阶段**: 按职责拆分代码到对应文件，遵循简洁实用原则和八段式结构
4. **验证阶段**: 检查文件命名、职责分离、类型完整性、八段式结构完整性

### 🎯 重构质量标准

- 文件命名符合规范，职责单一明确
- 类型定义完整，常量全部提取  
- 主组件简洁清晰，文档完整
- 所有 `index.[ext]` 文件严格遵循八段式结构

## 🎯 核心原则

### 🏗️ 架构原则
1. **嵌套化主导** - 所有组件默认嵌套化架构
2. **移除中间层** - 禁止使用 `components/` 中间层级
3. **多组件并存** - 页面支持多个复杂组件并存
4. **统一标准** - 所有组件按完整架构实施
5. **功能区域导向** - 根据UI功能区域进行模块划分

### 💻 实施原则  
6. **架构完整 + 代码简洁** - 结构完整但实现简洁
7. **强制执行** - Agent 严格按标准执行
8. **渐进演化** - 支持从简单到复杂的演化

---

**版本**: 2.0.0  
**更新日期**: 2024年  
**适用范围**: 所有现代前端框架和编程语言  
**维护者**: 架构团队