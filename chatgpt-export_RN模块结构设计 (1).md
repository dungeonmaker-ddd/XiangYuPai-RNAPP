# RN模块结构设计

> 你了解RN吗，我们如果要编写一个300行的RN模块级单文件，应该怎么设计这个单文件的结构架构？
> 可以使用树状图描述吗

当然可以，我来帮你梳理一下。你提到要写一个 **React Native (RN) 模块级单文件**，大约 300 行代码。这种文件通常适合用来实现一个功能较为完整的独立模块（例如：一个带有业务逻辑的 UI 组件、某个特定功能的服务模块、或是状态管理逻辑）。

在设计时，关键是 **分层清晰、职责明确、可扩展性强**。下面我给你一个建议的结构框架，并用树状图来描述。

---

## 设计思路

1. **头部区域（Imports & 常量定义）**
   - 引入必要的库、RN组件、第三方依赖
   - 定义常量、配置项、样式基础变量

2. **工具函数（Utils）**
   - 只与该模块相关的纯函数
   - 数据处理、格式化逻辑

3. **状态管理 / Hooks**
   - 使用 `useState` / `useReducer` / `useContext` 等
   - 业务相关的副作用 (`useEffect`)

4. **UI 组件主体**
   - 模块的主要 UI 结构
   - 逻辑与渲染清晰分离
   - 复用子组件（尽量写在同一文件内，但保持简短）

5. **样式定义**
   - 使用 `StyleSheet.create`
   - 保持和结构清晰对应

6. **导出**
   - 默认导出主组件
   - 可能导出一些工具函数（供测试或复用）

---

## 树状图结构

```
RNModule.js (≈300行)
├── Imports
│   ├── React, React Native 基础库
│   ├── 第三方依赖 (e.g. axios, react-navigation)
│   ├── 内部模块/常量
│
├── Constants & Config
│   ├── API_ENDPOINT
│   ├── DEFAULT_VALUES
│
├── Utils (工具函数)
│   ├── formatData()
│   ├── calculateSomething()
│
├── Hooks & State
│   ├── useState / useReducer
│   ├── useEffect (初始化、监听)
│
├── SubComponents (内部小组件)
│   ├── <Header />
│   ├── <ItemCard />
│
├── Main Component (核心模块)
│   ├── 初始化 & 状态逻辑
│   ├── 事件处理函数 (handleClick, handleSubmit)
│   ├── JSX 渲染结构
│       ├── Header
│       ├── ScrollView / FlatList
│       ├── Footer
│
├── Styles
│   ├── container
│   ├── header
│   ├── item
│   ├── footer
│
└── Exports
    ├── export default RNModule
    └── export { formatData } (可选)
```

---

这样拆分的好处是：
- **可维护性强**：逻辑、UI、样式分开，300 行不至于凌乱。
- **可扩展性好**：将子组件局部化，未来可以抽离到单独文件。
- **测试友好**：工具函数与主逻辑分开，可以单测。

---

要不要我帮你写一个 **300 行左右的 RN 模板文件样例**（包含真实结构，但逻辑可以是示例性的，比如一个带搜索和列表展示的模块）？这样你能直接拿去当脚手架用。

-----

> 现在让我们思考600行的模块级单文件的树状结构架构图

当然行！把单文件做成 600 行时，关键是**按“层”和“切片”双维度组织**：上层是通用层次（导入→常量→工具→数据→状态→UI→样式→导出），侧向再按“业务切片/子组件/子服务”成组收纳，避免横向散落。下面给你两套常见形态的树状结构图（带行数预算区间），你可按实际裁剪。

---

# 600 行蓝图 A：**复合 UI 模块（复杂屏/复合组件）**

```
FeatureScreen.tsx (≈600 lines)
├─ 1. Imports (20–40)
│    ├─ React/RN 核心、第三方库、类型
│    └─ 内部依赖（icons、主题、hooks）
│
├─ 2. Types & Props (20–40)
│    ├─ Props / State / DTO 类型（TS）或 PropTypes
│    └─ TestIDs 枚举、枚举型常量
│
├─ 3. Constants & Config (20–35)
│    ├─ API_ENDPOINTS、feature flags、分页尺寸
│    └─ 字符串常量（建议只放关键字，长文案外移）
│
├─ 4. Utils (30–50)
│    ├─ 纯函数：formatX, mapDtoToVm, validators
│    └─ 性能：memoize、浅比较、排序/筛选
│
├─ 5. Data Access (Service in-file) (40–70)
│    ├─ fetchX / postY（含超时/重试/取消）
│    ├─ schema 校验（zod/yup，可选）
│    └─ 缓存策略（内存 LRU/Map）与失效
│
├─ 6. State & Hooks (60–90)
│    ├─ useReducer / useMachine（状态图/状态枚举）
│    ├─ useEffect：初始化、订阅、清理
│    └─ selectors（从 state 派生 UI 数据）
│
├─ 7. Subcomponents (3–4 个) (100–150)
│    ├─ <HeaderBar />（标题、搜索框、操作区）
│    ├─ <ListItem />（项渲染，解耦交互/展示）
│    ├─ <EmptyState /> / <ErrorState />
│    └─ <FooterActions />（批量操作/提交）
│
├─ 8. Main Component (80–120)
│    ├─ 事件处理（handleSearch/Refresh/Select）
│    ├─ 渲染：Header → List/SectionList → Footer
│    └─ 无障碍与可测试性（accessibilityLabel、testID）
│
├─ 9. Styles (40–60)
│    ├─ StyleSheet.create({ ... })
│    └─ 变量化尺寸/间距/颜色（与主题衔接）
│
└─ 10. Exports (5–10)
     ├─ export default FeatureScreen
     └─ 可选导出：某些 utils / types 供单测使用
```

**使用要点**
- **子组件就近内聚**：每个子组件控制在 25–60 行（JSX 简洁 + 明确 props）。
- **状态集中**：避免在子组件里分散发请求；子组件只收 props、派发回调。
- **数据边界清晰**：Data Access 与 Utils 不引用 UI。
- **测试与可观测性**：testID 常量集中、关键分支打日志（可封装到 utils.log）。

---

# 600 行蓝图 B：**非 UI 业务模块（Hook/Service 单文件）**

适合“数据与逻辑很重、UI 另行拆分”的场景。

```
useFeatureService.ts (≈600 lines)
├─ 1. Imports (15–30)
│
├─ 2. Types & Schemas (40–70)
│    ├─ 公共类型：DomainModel, Query, Result, Error
│    └─ zod/yup schema 与转换器
│
├─ 3. Constants & Config (20–30)
│    ├─ 端点、重试/退避策略、cache TTL、上限
│
├─ 4. Core Utils (40–60)
│    ├─ normalize/denormalize、diff/merge、keyBuilder
│    └─ 重试/backoff、节流/防抖、超时控制
│
├─ 5. Transport Layer (30–50)
│    ├─ request(baseConfig) → { get/post/abort }
│    └─ 拦截器：鉴权、错误映射、网络状态
│
├─ 6. Cache Layer (40–60)
│    ├─ 内存缓存（Map/LRU）、索引键策略
│    └─ 持久化（AsyncStorage，可选开关）
│
├─ 7. Domain Operations (80–120)
│    ├─ list/query/get/create/update/remove
│    └─ 批量/事务性操作、并发/队列控制
│
├─ 8. Hook Facade (80–110)
│    ├─ useFeatureService(params)
│    │    ├─ useReducer 状态机（idle/loading/sync/error）
│    │    ├─ effects：预取/失效/轮询（可选）
│    │    └─ 返回 API：data, error, actions, status, metrics
│
├─ 9. Selectors & Derivations (30–40)
│    └─ 面向 UI 的派生数据与 memo 选择器
│
├─ 10. Telemetry & Guards (20–30)
│    ├─ 事件/埋点（可注入），速率/配额保护
│
└─ 11. Exports (10–20)
     ├─ export default useFeatureService
     └─ 导出 types/selectors 供 UI 与测试
```

**使用要点**
- **分层可替换**：Transport/Cache 可注入，便于测试与环境切换。
- **操作幂等**：键策略 + 去重 + 合并更新，避免 UI 抖动。
- **错误即数据**：错误映射为领域错误类型，统一在 Hook 层返回。

---

## 快速落地清单（适用于两种蓝图）

- **行数守恒**：约束每段的行数上限（见上）。一旦超出，优先把**工具函数**或**子组件**拆出文件。
- **折叠标记**：用区域注释让编辑器好折叠（示例：`// #region Utils … // #endregion`）。
- **命名前缀**：事件用 `handleX`，选择器用 `selectX`，纯函数动词开头。
- **可测试性**：将复杂逻辑下沉到 utils；公开少量 helpers 供单测。
- **可访问性/可观测性**：testID 常量集中，Error 边界与空态单独子组件。
- **性能**：列表虚拟化（FlatList/SectionList）、关键选择器 `useMemo`、项组件 `React.memo`。
- **国际化/主题**：长文案与主题 token 尽量外置，只在单文件内引用关键常量。

---

## 可复制的区块模板（摘录，用于文件骨架）

```ts
// 1) Imports
// 2) Types & Props
// 3) Constants & Config
// 4) Utils
// 5) Data Access / Transport
// 6) State & Hooks
// 7) Subcomponents / Domain Ops
// 8) Main Component / Hook Facade
// 9) Styles (UI 模块) / Selectors (Service 模块)
// 10) Telemetry & Guards
// 11) Exports
```

如果你告诉我这个 600 行文件更偏 **UI 页面** 还是 **业务 Hook/Service**，我可以按其中一套蓝图给你产出一份“可直接粘贴”的骨架代码（含注释与占位函数），开箱即用。

-----

> 现在让我们思考1000行的模块级单文件的树状结构架构图

好的！1000 行的模块级单文件，重点是**分层更细**、**切片更清**、**可折叠导航**与**可测试/可观测**内建。下面给你三套实战蓝图（UI 重、逻辑重、桥接型），都带行数预算与树状结构，方便直接落地。

# 总体原则（适用于 1000 行）
- **双维组织**：纵向按层（Imports→类型→常量→工具→数据→状态→UI→样式→导出），横向按“业务切片/子组件/子服务”分组。
- **可折叠导航**：每段用 `// #region <Section>` / `// #endregion`，并在文件头放“索引锚点”便于跳转。
- **边界清晰**：UI 绝不直接触达网络/存储；数据→状态→UI 单向流。
- **测试优先**：复杂逻辑沉到 utils/selectors；对外导出少量纯函数给单测。
- **可观测性**：埋点、日志、防抖限流与错误映射在“Infra 层”完成，UI 仅消费。

---

# 蓝图 A：复杂 Feature Screen（UI+业务并重）
**适用**：大型页面/复合组件（列表+筛选+详情+批量操作+离线/乐观更新）

```
FeatureScreen.tsx (≈1000 lines)
├─ 0. File Banner & TOC (5–10)
│   └─ 索引锚点、约定说明、快速跳转注释
│
├─ 1. Imports (30–50)
│   ├─ React/RN 基础、第三方库（navigation, form, schema）
│   └─ icons/主题/haptics/tracking 等内部依赖
│
├─ 2. Types & Runtime Schemas (60–100)
│   ├─ Props/State/Action/DTO/VM 类型
│   └─ zod/yup schema + 适配器（DTO⇄VM）
│
├─ 3. Feature Flags & Constants (30–50)
│   ├─ API_ENDPOINTS、分页、开关、testIDs、a11y 字符串
│   └─ 空态/错误文案 key（长文案外置，只留 key）
│
├─ 4. Utils & Mappers (80–120)
│   ├─ formatX/mapY/sort/filter/guard/assert
│   └─ 节流/防抖/backoff/memoize/浅比较
│
├─ 5. Transport Layer (60–100)
│   ├─ request(base) + 拦截器（鉴权、错误映射、超时/重试/取消）
│   └─ fetchList/fetchDetail/create/update/remove（纯函数返回 Promise）
│
├─ 6. Cache & Persistence (60–90)
│   ├─ 内存缓存 Map/LRU、键策略、失效/预取
│   └─ AsyncStorage 落盘（可选开关）
│
├─ 7. State Machine (100–150)
│   ├─ useReducer/useMachine：idle→loading→ready→error→syncing
│   ├─ 乐观更新/回滚/并发合并、重放队列（离线）
│   └─ Actions/Reducers/Guards/Effects（严格分块）
│
├─ 8. Selectors (40–60)
│   ├─ 派生 UI 数据、计数/分组、权限/可见性
│   └─ useMemo + shallowEqual，导出少量可单测函数
│
├─ 9. Subcomponents (4–7 个，220–300)
│   ├─ <HeaderBar/>：标题/搜索/筛选（40–60）
│   ├─ <Toolbar/>：批量操作/导出/撤销（25–45）
│   ├─ <ListItem/>：展示/交互分离（45–70）
│   ├─ <EmptyState/> / <ErrorState/>（20–35）
│   ├─ <DetailSheet/>：底部抽屉/侧滑（50–80）
│   └─ <FooterActions/>：提交/翻页/统计（25–40）
│
├─ 10. Main Component (100–140)
│   ├─ 参数解析、状态装配、订阅/清理（effects）
│   ├─ 事件：handleSearch/Refresh/Select/Submit
│   └─ JSX：Header → Toolbar → List/SectionList → Detail → Footer
│
├─ 11. Styles (60–90)
│   ├─ 主题 token→StyleSheet.create；尺寸/间距/层级集中
│   └─ 动画/手势（可抽 helpers）
│
├─ 12. Telemetry & Guards (20–30)
│   ├─ 埋点/日志门面（debug 开关），速率/配额保护
│
└─ 13. Exports (10–20)
    ├─ export default FeatureScreen
    └─ 导出少量 utils/selectors/types 供测试/复用
```

**行数分配提示**
- 子组件 5 个时每个控制在 40–60 行；复杂的（如 DetailSheet）保留到 70–80 行。
- Reducer 与 Effects 分段可折叠；每类 Action 不超过 10–12 个。

---

# 蓝图 B：逻辑/数据重的 Hook+Service 单文件
**适用**：UI 很薄，数据管道/并发/缓存/同步很重的业务域

```
useFeatureService.ts (≈1000 lines)
├─ 0. File Banner & TOC (5–10)
│
├─ 1. Imports (20–35)
│
├─ 2. Domain Types & Schemas (80–120)
│   ├─ DomainModel/Query/Pagination/Error/Permission
│   └─ zod schema、编解码器、版本迁移
│
├─ 3. Config & Flags (30–40)
│   ├─ 退避策略/重试上限/并发度/TTL/轮询间隔
│
├─ 4. Core Utils (90–130)
│   ├─ diff/merge/normalize/denormalize、keyBuilder
│   ├─ 乐观补丁/回滚、冲突解决策略
│   └─ 队列/并发控制器、Abort/超时包裹
│
├─ 5. Transport (60–90)
│   ├─ request(baseConfig) → get/post/patch/delete/abort
│   └─ 拦截器：鉴权更新、错误映射（HTTP→DomainError）
│
├─ 6. Cache Layer (80–120)
│   ├─ Memory(LRU) + AsyncStorage；分区命名空间
│   └─ 失效/预取/回源/去重（de-dupe）与订阅通知
│
├─ 7. Sync & Reconciliation (70–110)
│   ├─ 离线队列、前台/后台刷新、指数退避
│   └─ 冲突检测、版本时间戳、最终一致性
│
├─ 8. Domain Operations (120–160)
│   ├─ list/query/get/create/update/remove/batch
│   └─ 事务/依赖链/幂等/重放
│
├─ 9. Hook Facade (100–140)
│   ├─ useFeatureService(params)
│   │   ├─ useReducer 状态机、selectors、effects
│   │   └─ 返回：data/error/status/actions/metrics
│
├─ 10. Selectors & Derivations (40–60)
│   └─ 面向 UI 的 memo 选择器
│
├─ 11. Telemetry/Quota/Guards (20–35)
│
└─ 12. Exports (10–20)
```

**要点**
- 外部只看见 `useFeatureService` 与若干类型。
- 操作必须**幂等**，并对“乐观更新→冲突→回滚”有一套固定流程。

---

# 蓝图 C：Native Bridge + RN 包装的桥接型单文件
**适用**：自定义原生模块（相机/地图/支付）+ RN 层包装与降噪

```
BridgeModule.tsx (≈1000 lines)
├─ 0. File Banner & TOC (5–10)
│
├─ 1. Imports (25–40)
│   ├─ react-native 原生模块接口、Platform、Permissions
│
├─ 2. Types & Contracts (80–110)
│   ├─ 原生 API 契约、事件/回调类型、错误码枚举
│
├─ 3. Config & Guards (30–40)
│   ├─ 权限映射、平台差异开关、超时/重试
│
├─ 4. Native Adapters (90–130)
│   ├─ iOS/Android 差异适配、参数归一化、错误归一化
│
├─ 5. Event Emitter Layer (50–70)
│   ├─ 订阅/退订、桥接事件节流/合并
│
├─ 6. Transport Wrapper (40–60)
│   ├─ 调用原生方法的统一门面（带日志/埋点/防抖）
│
├─ 7. Cache & Session (50–70)
│   ├─ 会话状态、权限缓存、设备能力探测缓存
│
├─ 8. Feature Facade API (120–170)
│   ├─ 高阶 API：openX/takeY/scanZ、参数校验与结果规范化
│
├─ 9. React Hook API (80–120)
│   ├─ useBridgeFeature：装配状态、订阅原生事件、清理
│
├─ 10. Reference UI (Demo/可选) (120–160)
│   ├─ 演示/调试页面（开发时可 tree-shake 掉）
│
├─ 11. Error Boundaries & Fallbacks (20–35)
│
├─ 12. Typesafe Selectors & Helpers (30–40)
│
└─ 13. Exports (10–20)
```

**要点**
- **契约优先**：类型&错误码对齐原生实现，先定义后适配。
- 通过统一门面把权限、平台差异、异常全部**挡在 UI 之外**。

---

# 文件头「索引锚点」示例（建议复制到你的 1000 行文件顶部）
```
/**
 * TOC (quick jump):
 * [1] Imports
 * [2] Types & Schemas
 * [3] Flags & Constants
 * [4] Utils & Mappers
 * [5] Transport
 * [6] Cache & Persistence
 * [7] State Machine / Sync
 * [8] Selectors
 * [9] Subcomponents / Facade
 * [10] Main Component / Hook
 * [11] Styles or Extra
 * [12] Telemetry & Guards
 * [13] Exports
 */
```

---

# 何时从 1000 行拆分为多文件（**触发器**）
- 任意子组件 > 100 行，且被独立复用 → 抽出到 `components/`.
- Reducer/Effects 逻辑 > 180 行，分为 `state/` 下的 `actions.ts`、`reducers.ts`、`effects.ts`.
- Transport/Cache 出现平台分支或 3+ 种策略 → `infra/transport.ts`、`infra/cache.ts`.
- Schema & Mappers > 120 行 → `model/` 目录化，避免循环依赖。

---

# 落地小清单
- 事件命名：`handleX`；选择器：`selectX`；纯函数动词开头。
- testIDs/a11yLabel 统一常量化；长文案/i18n & 主题 token 外置。
- 所有外部可见 API/类型在**同一导出段**集中导出，便于查看与单测。
- 评论/日志可通过 `DEV && log()` 或注入式 logger 控制开关。

---

需要的话，我可以基于你更偏向的蓝图（A/B/C）直接产出**可粘贴的空骨架代码**（含 `#region` 折叠、注释位与占位函数），方便你在此之上填入业务逻辑。

-----

> 如果我们检测，文件体积大到2000行，应该怎样设计文件夹的结构架构，怎样去拆分各个部分，从1000行的

太好了——当你的单文件已经涨到 ~2000 行，就不再适合继续“加码”了。最稳妥的做法是把**原先 1000 行蓝图**按“层”和“业务切片”两条轴拆成一个**可演进的特性级（feature-based）目录**，并用**公共出口（barrel）**+**依赖规则**把边界固化住。下面给你一份可直接落地的方案（含树状结构、从 1000 行逐步迁移的映射表、依赖/Lint 规则与拆分阈值）。

---

# 推荐目录形态（Feature-first）

以单个功能域 `feature-x` 为根，既能局部自治，又能渐进抽离到共享层。

```
features/
└─ feature-x/
   ├─ api/                 # 远程调用与端点
   │  ├─ client.ts
   │  ├─ endpoints.ts
   │  └─ interceptors.ts
   ├─ model/               # 类型与运行时校验
   │  ├─ types.ts
   │  ├─ schemas.ts
   │  └─ mappers.ts
   ├─ lib/                 # 纯工具（与 UI/网络无关）
   │  ├─ format.ts
   │  ├─ guard.ts
   │  └─ throttle.ts
   ├─ state/               # 状态机/Reducer/Effects/Selectors
   │  ├─ actions.ts
   │  ├─ reducer.ts
   │  ├─ effects.ts
   │  └─ selectors.ts
   ├─ cache/               # 内存/持久化缓存（可选）
   │  ├─ memory.ts
   │  └─ persistence.ts
   ├─ telemetry/           # 埋点/日志/配额（可注入）
   │  ├─ logger.ts
   │  └─ analytics.ts
   ├─ config/              # 常量/开关/TestIDs
   │  ├─ flags.ts
   │  └─ constants.ts
   ├─ hooks/               # React Hooks 门面
   │  └─ useFeatureService.ts
   ├─ ui/                  # 仅展示&交互的子组件
   │  ├─ HeaderBar/
   │  │  ├─ HeaderBar.tsx
   │  │  ├─ styles.ts
   │  │  └─ index.ts
   │  ├─ ListItem/
   │  ├─ EmptyState/
   │  ├─ DetailSheet/
   │  └─ index.ts          # 汇总导出本目录组件
   ├─ pages/               # 复合页面/容器组件
   │  └─ FeatureScreen.tsx
   ├─ __tests__/           # 该特性域的单元/集成测试
   ├─ __mocks__/           # 测试桩
   └─ index.ts             # 该 feature 的公共出口（barrel）
```

> **依赖方向（强约束）**
> `lib`/`model` → 被所有层引用
> `api`/`cache`/`telemetry` → 仅被 `state`/`hooks` 调用
> `state`/`hooks` → 被 `pages`/`ui` 消费
> `ui` → 不得反向依赖 `api`/`state`（只收 props/hook 返回值）

---

## 从“1000 行单文件”到“目录化”的 **映射表**

| 1000 行蓝图区块 | 拆分去向 | 备注 |
|---|---|---|
| Imports | 各子文件自行引入；跨目录用 `index.ts` 汇总 | 配合路径别名简化导入 |
| Types & Schemas | `model/types.ts`, `model/schemas.ts` | DTO⇄VM 的 `mappers.ts` 同目录 |
| Flags & Constants | `config/constants.ts`, `config/flags.ts` | testIDs/a11y 字符串也在此 |
| Utils & Mappers | `lib/*.ts`、`model/mappers.ts` | 纯函数放 `lib`，有领域含义的映射放 `model` |
| Transport | `api/client.ts`, `api/endpoints.ts`, `api/interceptors.ts` | 只暴露纯 Promise API |
| Cache & Persistence | `cache/memory.ts`, `cache/persistence.ts` | 可被 `state/effects` 使用 |
| State Machine | `state/actions.ts`、`state/reducer.ts`、`state/effects.ts` | Effects 内只调用 `api`/`cache` |
| Selectors | `state/selectors.ts` | 保持纯函数，方便单测 |
| Subcomponents | `ui/<Component>/` | 一个组件一个小文件夹 |
| Main Component | `pages/FeatureScreen.tsx` | 容器装配 hooks/selectors |
| Styles | 各组件内 `styles.ts` | 避免集中样式巨文件 |
| Telemetry & Guards | `telemetry/*` | 用注入式 logger，便于禁用 |
| Exports | `index.ts`（barrel） | 仅暴露公共 API/类型/组件 |

---

## 渐进式重构路径（建议 6 步）

1) **先立“公共出口”**：在 `features/feature-x/index.ts` 暴露你希望外界使用的 API（页面、hook、类型）。
2) **抽 `model` 与 `lib`**：把类型/校验/映射和纯工具从大文件平移出来，修正引用。
3) **抽 `api` 与 `cache`**：把网络与缓存迁移，并让 Effects 只通过 API 门面访问。
4) **切 `state`**：Reducer/Actions/Effects/Selectors 四拆；保证每块 < 200 行。
5) **切 `ui`**：把子组件一组件一目录迁移，`index.ts` 汇总导出。样式随组件走。
6) **落 `pages`**：把原“Main Component”迁移到容器页面，改用 hooks/selectors 装配数据流。

> 每次迁移都先把**引用指向 barrel**，确保调用端 import 路径稳定，再逐步替换内部实现。

---

## 依赖与 Lint 规则（防回潮）

**tsconfig 路径别名**
```json
// tsconfig.json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@features/*": ["features/*"],
      "@feature-x/*": ["features/feature-x/*"]
    }
  }
}
```

**ESLint 约束单向依赖（示例）**
```js
// .eslintrc.js
module.exports = {
  rules: {
    'no-restricted-imports': [
      'error',
      {
        paths: [
          { name: '@feature-x/ui', importNames: ['*'], message: 'UI cannot import from state/api' },
        ],
        patterns: [
          // 禁止从更“下层”向“上层”倒灌
          '@feature-x/ui/**/!(index).{ts,tsx}',
          '@feature-x/state/**/*.{ts,tsx} -> 禁止被 api/cache 引用',
        ],
      },
    ],
  },
};
```

> 工具更强可用 Nx/rsbuild 的“模块边界”插件；但上面的 ESLint 也足够先用。

---

## 组件与文件夹粒度（**拆分阈值**）

- **组件文件 > 150 行** 或 含 3+ 逻辑分支 → 拆为容器（容器调 hook）+ 展示组件
- **Reducer > 200 行** 或 `Action` > 12 个 → 拆子 reducer 或按“子领域”分模块
- **Selectors > 100 行** → 拆为 `selectors/list.ts`, `selectors/detail.ts`
- **Utils > 200 行** → 按职能拆 `format/`, `guard/`, `collection/`
- **API > 150 行** → 端点分文件：`api/list.ts`, `api/detail.ts`

---

## Barrel（公共出口）示例

```ts
// features/feature-x/index.ts
export { default as FeatureScreen } from './pages/FeatureScreen';
export { useFeatureService } from './hooks/useFeatureService';
export type { FeatureItem, FeatureQuery } from './model/types';
```

> 外部只从 `@features/feature-x` 引入，形成**防腐层**；内部重构不影响调用方。

---

## 可选：跨 Feature 的共享层

若多个特性复用相同工具/基础设施，再抽到项目级：

```
shared/
├─ ui/            # 通用按钮、模态、空态
├─ lib/           # 无框架纯工具
├─ api/           # 跨域的请求 client（不含具体端点）
├─ theme/         # 设计令牌
├─ i18n/
└─ index.ts
```

---

## 替代形态（逻辑/数据更重）

当 UI 很薄、逻辑很重时，把 `pages/ui` 缩至最小，把门面集中到 hook：

```
features/feature-x/
├─ service/          # domain ops（原 state+api 的融合层）
├─ hooks/            # useFeatureService.ts（唯一对外门面）
├─ model/ lib/ state/ api/ ...（同上）
└─ pages/ui/（可选）
```

---

### 小结

- **目标**：以特性为单位的“自治模块”，通过 barrel 暴露最小 API 面，内部**单向依赖**。
- **路径**：按“model/lib → api/cache → state → ui/pages”顺序迁移，保证每一步可运行。
- **守护**：路径别名 + ESLint 规则锁边界，结合拆分阈值避免再度长成“2000 行巨石”。

如果你告诉我当前这个 2000 行文件主要是**页面为主**还是**服务/数据为主**，我可以把上面的树直接替换成一份**定制的迁移清单 + 目录骨架（含空文件）**，你复制就能开工。

-----

> 页面+多子模块级功能/小页面为主

太好了，既然你的场景是“**页面为主 + 多子模块级功能/小页面**”，那就按**feature-first**把“一个 2000 行巨页”切成“一个特性工作台（workbench）+ 多个子页面 + UI 组件库 + 状态与数据层”。下面给你一份可直接落地的目录蓝图、迁移映射、依赖约束，以及可粘贴的骨架示例。

# 目标形态（Feature-first + 子页面）
```
app/
├─ navigation/
│  ├─ RootNavigator.tsx            # App 根导航
│  └─ feature-x.navigator.tsx      # 该 Feature 的局部导航（Stack/Tab）
│
├─ features/
│  └─ feature-x/
│     ├─ pages/                    # 容器与子页面（有数据装配）
│     │  ├─ WorkbenchScreen.tsx    # 主页面（工作台/聚合页）
│     │  └─ subpages/
│     │     ├─ SearchScreen.tsx
│     │     ├─ DetailsScreen.tsx
│     │     ├─ BulkActionScreen.tsx
│     │     └─ SettingsScreen.tsx
│     ├─ ui/                       # 纯展示/小交互组件（无数据请求）
│     │  ├─ HeaderBar/
│     │  │  ├─ HeaderBar.tsx
│     │  │  ├─ styles.ts
│     │  │  └─ index.ts
│     │  ├─ ListItem/
│     │  ├─ SummaryCard/
│     │  ├─ EmptyState/
│     │  └─ index.ts               # 汇总导出本目录组件
│     ├─ hooks/
│     │  └─ useFeatureXService.ts  # 该特性的门面 Hook
│     ├─ state/                    # 状态机 + 副作用 + 选择器
│     │  ├─ actions.ts
│     │  ├─ reducer.ts
│     │  ├─ effects.ts
│     │  └─ selectors.ts
│     ├─ api/
│     │  ├─ client.ts              # request base & 拦截器
│     │  ├─ endpoints.ts
│     │  └─ index.ts
│     ├─ model/
│     │  ├─ types.ts               # DTO/VM/Params/Error
│     │  ├─ schemas.ts             # zod/yup 运行时校验
│     │  └─ mappers.ts             # DTO ⇄ VM
│     ├─ lib/                      # 纯工具（无 UI/网络）
│     │  ├─ format.ts
│     │  ├─ guard.ts
│     │  └─ throttle.ts
│     ├─ cache/
│     │  ├─ memory.ts
│     │  └─ persistence.ts
│     ├─ config/
│     │  ├─ constants.ts           # PAGE_SIZE, testIDs, a11y keys
│     │  └─ flags.ts               # feature toggles
│     ├─ telemetry/
│     │  ├─ logger.ts
│     │  └─ analytics.ts
│     ├─ __tests__/                # 单元/集成测试
│     └─ index.ts                  # Barrel：对外公共出口
│
├─ shared/                          # 可复用的跨 Feature 资产
│  ├─ ui/
│  ├─ lib/
│  ├─ theme/
│  ├─ i18n/
│  └─ index.ts
└─ app.json / tsconfig.json / etc.
```

## 依赖规则（强约束）
- `ui` 只依赖 `shared/ui|theme|i18n` 与 `model/types`；**不得**直接依赖 `api/state/cache`。
- `pages` 依赖 `hooks/state/selectors/ui`；**不**直接碰 `api`。
- `hooks/state` 可依赖 `api/cache/model/lib/config/telemetry`。
- 外部模块只从 `features/feature-x/index.ts` 引入（barrel 作为防腐层）。

---

# 从 2000 行巨页到目录的迁移映射
| 巨页区块 | 去向 |
|---|---|
| 导入/类型/常量 | `model/types.ts`、`config/constants.ts` |
| 运行时校验/schema | `model/schemas.ts` |
| DTO⇄VM 转换 | `model/mappers.ts` |
| 纯工具（格式化/防抖等） | `lib/*.ts` |
| 网络请求/端点/拦截器 | `api/*.ts` |
| 缓存（内存/持久化） | `cache/*.ts` |
| Reducer/Actions/Effects/Selectors | `state/*.ts` |
| 子组件（ListItem、EmptyState…） | `ui/<Component>/*` |
| 主页面/子页面 UI | `pages/*` |
| 埋点/日志/配额 | `telemetry/*` |
| 对外导出 | `index.ts`（barrel） |

**建议迁移顺序**：`model/lib → api/cache → state → ui → pages → navigation`

---

# 路由与子页面编排（RN Navigation 示例）
**feature 局部导航**（在 `navigation/feature-x.navigator.tsx`）：
```tsx
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import WorkbenchScreen from '@feature-x/pages/WorkbenchScreen';
import SearchScreen from '@feature-x/pages/subpages/SearchScreen';
import DetailsScreen from '@feature-x/pages/subpages/DetailsScreen';
import SettingsScreen from '@feature-x/pages/subpages/SettingsScreen';

export type FeatureXParamList = {
  Workbench: undefined;
  Search: { q?: string };
  Details: { id: string };
  Settings: undefined;
};

const Stack = createNativeStackNavigator<FeatureXParamList>();

export default function FeatureXNavigator() {
  return (
    <Stack.Navigator initialRouteName="Workbench">
      <Stack.Screen name="Workbench" component={WorkbenchScreen} />
      <Stack.Screen name="Search" component={SearchScreen} />
      <Stack.Screen name="Details" component={DetailsScreen} />
      <Stack.Screen name="Settings" component={SettingsScreen} />
    </Stack.Navigator>
  );
}
```

**barrel 出口**（`features/feature-x/index.ts`）：
```ts
export { default as FeatureXNavigator } from '../../navigation/feature-x.navigator';
export { default as WorkbenchScreen } from './pages/WorkbenchScreen';
export { useFeatureXService } from './hooks/useFeatureXService';
export type { FeatureItem, FeatureQuery } from './model/types';
```

---

# 可粘贴骨架（页面 + 子组件）
**Workbench（容器页）**：数据装配 + 分发到子页面/组件
```tsx
// features/feature-x/pages/WorkbenchScreen.tsx
import React, { useMemo } from 'react';
import { View, FlatList } from 'react-native';
import { useFeatureXService } from '../hooks/useFeatureXService';
import { HeaderBar } from '../ui';
import ListItem from '../ui/ListItem/ListItem';

export default function WorkbenchScreen() {
  const { data, status, actions, selectors } = useFeatureXService();
  const items = useMemo(() => selectors.selectList(data), [data, selectors]);

  return (
    <View style={{ flex: 1 }}>
      <HeaderBar
        onSearch={q => actions.search(q)}
        onOpenSettings={() => actions.openSettings()}
      />
      <FlatList
        data={items}
        keyExtractor={it => it.id}
        renderItem={({ item }) => (
          <ListItem item={item} onPress={() => actions.openDetails(item.id)} />
        )}
      />
    </View>
  );
}
```

**子组件（展示型）**：
```tsx
// features/feature-x/ui/ListItem/ListItem.tsx
import React from 'react';
import { Pressable, Text, View } from 'react-native';
import { styles } from './styles';
import type { FeatureItem } from '../../model/types';

export default function ListItem({
  item,
  onPress,
}: { item: FeatureItem; onPress: () => void }) {
  return (
    <Pressable onPress={onPress} accessibilityLabel={`item-${item.id}`}>
      <View style={styles.container}>
        <Text style={styles.title}>{item.title}</Text>
        <Text numberOfLines={1} style={styles.subtitle}>{item.subtitle}</Text>
      </View>
    </Pressable>
  );
}
```

---

# 拆分阈值与命名规范
- **组件文件 > 150 行** 或包含 3+ 复杂分支 → 拆容器/展示组件。
- **Reducer > 200 行** 或 `Action` > 12 → 分子 reducer；effects 按“use case”分文件。
- **Selectors > 100 行** → `selectors/list.ts`、`selectors/detail.ts` 拆分。
- 命名：事件 `handleX`；动作 `doX`；选择器 `selectX`；工具动词开头。
- `testID`/a11y key 统一在 `config/constants.ts` 暴露，便于测试与可访问性。

---

# Lint 与路径别名（防止反向依赖）
**tsconfig 路径别名**
```json
{
  "compilerOptions": {
    "baseUrl": "app",
    "paths": {
      "@feature-x/*": ["features/feature-x/*"],
      "@shared/*": ["shared/*"]
    }
  }
}
```

**ESLint 方向约束（示例）**
```js
// .eslintrc.js
module.exports = {
  rules: {
    'no-restricted-imports': ['error', {
      patterns: [
        // UI 不得依赖状态/网络
        { group: ['@feature-x/state/*', '@feature-x/api/*'], message: 'UI should not import state/api' },
      ],
    }],
  },
};
```

---

# 测试与性能要点
- **测试**：`@testing-library/react-native` 做组件测试；selectors/utils 纯函数单测；关键 user flow 用 Detox。
- **性能**：列表用 `FlatList`（`keyExtractor`、`getItemLayout`、`removeClippedSubviews`）；子项 `React.memo`；选择器 `useMemo` + 浅比较；避免在 `renderItem` 里创建新函数（用 `useCallback`）。

---

# 迁移步骤（最少回归风险）
1) 先建 `index.ts`（barrel），把旧调用改为从 barrel 引用（接口不变）。
2) 抽 `model/lib`；随后迁 `api/cache`；再迁 `state`；最后迁 `ui/pages`。
3) 引入 `feature-x.navigator.tsx`，把子页面逐个接入导航。
4) 打开 ESLint 约束与 CI，防止回潮。

---

需要的话，我可以把上述骨架扩成**可直接复制的完整空文件集**（每个文件带 5–20 行注释/占位），你按你的子页面清单（例如：搜索、详情、批处理、设置）替换即可。