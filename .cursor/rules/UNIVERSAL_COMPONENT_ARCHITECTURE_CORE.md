# 通用组件模块化架构核心标准 v2.2

## 🤖 Agent 执行指令

**当 Agent 接收到本架构文档时，必须严格按照以下要求执行：**

### 🎯 强制执行规则

1. **📁 层级化页面组主导架构**
   - 页面组位置：`src/pages/{PageGroupName}/`
   - 主页面位置：`src/pages/{PageGroupName}/MainPage/`
   - 子页面位置：`src/pages/{PageGroupName}/{SubFunction}Page/`
   - 组件位置：`src/pages/{PageGroupName}/{PageType}Page/{ComponentName}/`
   - 默认嵌套化架构，支持页面组内多页面管理
   - 移除 `components/` 中间层级
   - 页面组级统一管理状态和导航

2. **🔧 完整结构要求**
   - 核心文件必需：`index.[ext]`、`types.[ext]`、`constants.[ext]`、`README.md`
   - 功能层按需创建，职责不得混合
   - API接口层与后端交互层配套出现

3. **🚫 禁止行为**
   - 禁止省略核心文件
   - 禁止职责混合
   - 禁止命名不规范
   - 禁止常量硬编码

## 🏗️ 层级化页面组集成架构

```
src/pages/                                          # 页面容器层
├── {PageGroupName}/                                # 📦 页面组 (主功能模块，如 UserProfile, ProductCatalog)
│   ├── index.[ext]                                 # 🏠 页面组入口 - 导出所有页面组件
│   ├── types.[ext]                                 # 📋 页面组类型定义 - 导出所有相关类型
│   ├── constants.[ext]                             # ⚙️ 页面组常量配置 - 导出所有相关常量
│   ├── README.md                                   # 📖 页面组文档 - 包含所有页面说明
│   │
│   ├── 🏠 主页面层 (Main Page)
│   │   ├── MainPage/                               # 📱 主页面组件 - 页面组的主入口
│   │   │   ├── index.[ext]                         # 主页面实现
│   │   │   ├── types.[ext]                         # 主页面类型定义
│   │   │   ├── constants.[ext]                     # 主页面常量配置
│   │   │   ├── README.md                           # 主页面文档
│   │   │   │
│   │   │   ├── {ComponentAreaName1}/               # ✅ 组件区域1 - 顶部布局区域
│   │   │   │   ├── index.[ext]                     # 主组件文件
│   │   │   │   ├── types.[ext]                     # 组件类型定义 (可选)
│   │   │   │   ├── constants.[ext]                 # 组件常量配置 (可选)
│   │   │   │   ├── README.md                       # 组件文档
│   │   │   │   │
│   │   │   │   ├── {FunctionAreaName1}/            # 🔸 功能区域1 - 复杂的逻辑，嵌套实现
│   │   │   │   │   ├── index.[ext]                 # 区域主文件
│   │   │   │   │   ├── types.[ext]                 # 区域类型定义 (可选)
│   │   │   │   │   ├── constants.[ext]             # 区域常量 (可选)
│   │   │   │   │   ├── use[LocalState].[ext]       # 区域本地状态
│   │   │   │   │   ├── on[Action].[ext]            # 区域事件处理
│   │   │   │   │   ├── api[Action].[ext]           # 区域API接口
│   │   │   │   │   ├── process[Data].[ext]         # 数据处理
│   │   │   │   │   └── utils[Function].[ext]       # 工具函数
│   │   │   │   │
│   │   │   │   ├── {FunctionAreaName2}/            # 🟢 功能区域2 - 扁平实现
│   │   │   │   │   ├── index.[ext]                 # 区域主文件
│   │   │   │   │   ├── constants.[ext]             # 区域常量
│   │   │   │   │   ├── processData.[ext]           # 数据处理
│   │   │   │   │   └── utilsDisplay.[ext]          # 显示工具
│   │   │   │   │
│   │   │   │   └── {FunctionAreaName3}/            # 🔸 功能区域3 - 复杂交互，嵌套实现
│   │   │   │       ├── index.[ext]                 # 区域主文件
│   │   │   │       ├── use[LocalState].[ext]       # 区域本地状态
│   │   │   │       ├── on[Action].[ext]            # 区域事件处理
│   │   │   │       ├── processLogic.[ext]          # 逻辑处理
│   │   │   │       └── utilsHelper.[ext]           # 辅助工具
│   │   │   │
│   │   │   ├── {ComponentAreaName2}/               # ✅ 组件区域2 - 主要内容区域
│   │   │   └── {ComponentAreaName3}/               # ✅ 组件区域3 - 操作交互区域
│   │   │
│   │   ├── 🔄 页面组状态管理层 (统一管理)
│   │   │   ├── use{PageGroup}.[ext]                # 页面组主状态管理
│   │   │   ├── use{PageGroup}Data.[ext]            # 页面组数据状态管理
│   │   │   └── use{PageGroup}Flow.[ext]            # 页面组流程状态管理
│   │   │
│   │   └── 🧭 页面组导航层 (统一管理)
│   │       ├── navigate{PageGroup}Flow.[ext]       # 页面组内导航流程
│   │       ├── navigateToSubPages.[ext]            # 子页面导航
│   │       └── navigateBack{PageGroup}.[ext]       # 返回导航
│   │
│   ├── 📄 子页面层 (Sub Pages) - 最多10个相关页面
│   │   ├── {SubFunction1}Page/                     # 🎯 子功能页面1 - 如详情展示、数据查看等
│   │   │   ├── index.[ext]                         # 子功能页实现
│   │   │   ├── types.[ext]                         # 子功能页类型定义
│   │   │   ├── constants.[ext]                     # 子功能页常量配置
│   │   │   ├── README.md                           # 子功能页文档
│   │   │   │
│   │   │   ├── {ComponentAreaName1}/               # ✅ 子功能页组件区域1
│   │   │   └── {ComponentAreaName2}/               # ✅ 子功能页组件区域2
│   │   │
│   │   ├── {SubFunction2}Page/                     # 🎯 子功能页面2 - 如表单输入、数据编辑等
│   │   │   ├── index.[ext]                         # 子功能页实现
│   │   │   ├── types.[ext]                         # 子功能页类型定义
│   │   │   ├── constants.[ext]                     # 子功能页常量配置
│   │   │   ├── README.md                           # 子功能页文档
│   │   │   │
│   │   │   ├── {ComponentAreaName1}/               # ✅ 子功能页组件区域1
│   │   │   ├── {ComponentAreaName2}/               # ✅ 子功能页组件区域2
│   │   │   └── {ComponentAreaName3}/               # ✅ 子功能页组件区域3
│   │   │
│   │   ├── {SubFunction3}Page/                     # 🎯 子功能页面3 - 如列表管理、搜索筛选等
│   │   ├── {SubFunction4}Page/                     # 🎯 子功能页面4 - 如设置配置、偏好管理等
│   │   ├── {SubFunction5}Page/                     # 🎯 子功能页面5 - 如操作处理、状态变更等
│   │   ├── {SubFunction...}Page/                   # 🎯 更多子功能页面 - 根据业务需要定义
│   │   └── ...                                     # 最多10个子页面
│   │
│   ├── 🌐 页面组API层 (配套实施 - 与后端交互层同时出现)
│   │   ├── api{PageGroup}Main.[ext]                # 主页面API接口
│   │   ├── api{PageGroup}[SubFunction].[ext]       # 子功能页面API接口
│   │   └── api{PageGroup}Aggregate.[ext]           # 聚合API接口
│   │
│   ├── 🔌 后端交互层 (配套实施)
│   │   └── backend/                                # 后端代码文件夹
│   │       ├── entity{PageGroup}.[ext]             # 实体类
│   │       ├── dto{PageGroup}[Action].[ext]        # 数据传输对象
│   │       ├── controller{PageGroup}.[ext]         # 控制器
│   │       ├── service{PageGroup}.[ext]            # 业务服务
│   │       ├── mapper{PageGroup}.[ext]             # 数据访问 (可选)
│   │       └── sql{PageGroup}.xml                  # 复杂SQL (可选)
│   │
│   ├── 🔄 页面组数据处理层 (按需实施)
│   │   ├── process{PageGroup}Data.[ext]            # 页面组数据处理
│   │   ├── processSharedLogic.[ext]                # 共享逻辑处理
│   │   └── processValidation.[ext]                 # 数据验证处理
│   │
│   └── 🛠️ 页面组工具层 (按需实施)
│       ├── utils{PageGroup}Display.[ext]           # 页面组显示工具
│       ├── utilsSharedHelper.[ext]                 # 共享辅助工具
│       └── utilsNavigation.[ext]                   # 导航工具
```

### 💡 架构说明

- **📦 页面组**: 主功能模块，包含最多10个相关页面
- **📱 主页面**: 页面组的主入口，负责集成和协调所有子组件
- **📄 子页面**: `{SubFunction}Page/` 通用化命名，根据具体业务功能定义
- **🔄 页面组状态管理**: 统一管理页面组级状态，子组件只管理简单本地状态
- **🧭 页面组导航**: 统一管理页面组级导航
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

### 📁 页面组命名
|| 层级类型 | 命名格式 | 示例 | 说明 |
||---------|---------|------|------|
|| **页面组** | `{PageGroupName}/` | `UserProfile/`, `ProductCatalog/` | 主功能模块，最多10个相关页面 |
|| **主页面** | `MainPage/` | `MainPage/` | 固定命名，页面组的主入口 |
|| **子功能页面** | `{SubFunction}Page/` | `DetailPage/`, `FormPage/`, `EditPage/` | 通用化子功能页面命名 |
|| **通用示例** | `{SubFunction}Page/` | `ReportPage/`, `SharePage/`, `SettingsPage/` | 根据具体业务功能定义 |

### 🔄 状态管理
| 功能类型 | 命名格式 | 示例 |
|---------|---------|------|
| **页面组状态** | `use{PageGroup}.[ext]` | `useUserProfile.[ext]` |
| **页面组数据** | `use{PageGroup}Data.[ext]` | `useUserProfileData.[ext]` |
| **页面组流程** | `use{PageGroup}Flow.[ext]` | `useUserProfileFlow.[ext]` |
| **子功能页状态** | `use{SubFunction}.[ext]` | `useDetail.[ext]`, `useForm.[ext]`, `useReport.[ext]` |
| **本地状态** | `use[LocalState].[ext]` | `useToggle.[ext]` |

### 🎯 事件处理
| 事件类型 | 命名格式 | 示例 |
|---------|---------|------|
| **基础交互** | `on[Action].[ext]` | `onClick.[ext]` |
| **复杂操作** | `on[UserAction].[ext]` | `onLongPress.[ext]` |

### 🧭 导航处理
| 导航类型 | 命名格式 | 示例 |
|---------|---------|------|
| **页面组内导航** | `navigate{PageGroup}Flow.[ext]` | `navigateUserProfileFlow.[ext]` |
| **子页面导航** | `navigateToSubPages.[ext]` | `navigateToSubPages.[ext]` |
| **具体页面导航** | `navigateTo{SubFunction}.[ext]` | `navigateToDetail.[ext]`, `navigateToForm.[ext]` |
| **返回导航** | `navigateBack{PageGroup}.[ext]` | `navigateBackUserProfile.[ext]` |

### 🌐 API接口
| 接口类型 | 命名格式 | 示例 |
|---------|---------|------|
| **主页面API** | `api{PageGroup}Main.[ext]` | `apiUserProfileMain.[ext]` |
| **子功能页API** | `api{PageGroup}[SubFunction].[ext]` | `apiUserProfileDetail.[ext]`, `apiUserProfileForm.[ext]` |
| **聚合API** | `api{PageGroup}Aggregate.[ext]` | `apiUserProfileAggregate.[ext]` |

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
1. **层级化页面组主导** - 所有页面按页面组层级化架构
2. **移除中间层** - 禁止使用 `components/` 中间层级
3. **多页面并存** - 页面组支持多个相关页面并存
4. **统一标准** - 所有页面组按完整架构实施
5. **功能区域导向** - 根据UI功能区域进行模块划分

### 💻 实施原则  
6. **架构完整 + 代码简洁** - 结构完整但实现简洁
7. **强制执行** - Agent 严格按标准执行
8. **渐进演化** - 支持从简单到复杂的演化

---

**版本**: 2.2.0  
**更新日期**: 2024年  
**适用范围**: 所有现代前端框架和编程语言  
**维护者**: 架构团队