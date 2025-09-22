# 👤 我的页面模块

> 基于通用组件模块化架构核心标准的完整个人中心功能模块

## 📁 模块结构

```
src/screens/profile/
├── ProfileScreen.tsx                    # 主页面组件 (≈300行)
├── UserInfoArea/                        # 用户信息展示区域
│   ├── index.tsx                       # 用户信息组件 (八段式结构)
│   ├── userhead/                       # 头像资源目录
│   │   └── 用户名称.png                # 默认头像图片
│   ├── types.ts                        # 区域类型定义 (可选)
│   ├── constants.ts                    # 区域常量配置 (可选)
│   └── README.md                       # 区域文档
├── TransactionArea/                     # 交易功能区域
│   ├── index.tsx                       # 交易功能组件 (八段式结构)
│   ├── FunctionButton/                 # 功能按钮组件
│   │   ├── index.tsx                   # 按钮组件 (八段式结构)
│   │   ├── transaction/                # 交易图标资源
│   │   │   ├── 我的发布.png
│   │   │   ├── 我的订单.png
│   │   │   ├── 我的购买.png
│   │   │   └── 我的报名.png
│   │   └── function/                   # 功能图标资源
│   │       ├── 个人中心.png
│   │       ├── 状态.png
│   │       ├── 钱包.png
│   │       ├── 金币.png
│   │       ├── 设置.png
│   │       ├── 客服.png
│   │       └── 达人认证.png
│   └── LayoutCard/                     # 布局卡片组件
│       └── index.tsx                   # 卡片组件 (八段式结构)
├── ToolsArea/                          # 工具功能区域
│   ├── index.tsx                       # 工具功能组件 (八段式结构)
│   ├── types.ts                        # 区域类型定义 (可选)
│   ├── constants.ts                    # 区域常量配置 (可选)
│   └── README.md                       # 区域文档
├── SharedComponents/                    # 共享组件
│   └── SkeletonLoader/                 # 骨架屏组件
│       └── index.tsx                   # 骨架屏组件 (八段式结构)
├── types.ts                            # 页面类型定义 (完整类型系统)
├── constants.ts                        # 页面常量配置 (颜色、尺寸、功能配置等)
├── index.ts                            # 模块主导出文件
└── README.md                           # 模块说明文档
```

## 🎯 设计原则

### 1. **嵌套化主导架构**
- ✅ 采用嵌套化主导架构，移除 `components/` 中间层级
- ✅ 组件位置：`src/screens/profile/{ComponentAreaName}/`
- ✅ 页面级统一管理状态和导航
- ✅ 支持多组件页面的复杂布局

### 2. **八段式代码结构**
- ✅ 所有 `index.tsx` 文件严格遵循八段式结构
- ✅ 使用 `#region` 标记，便于代码折叠和导航
- ✅ 按固定顺序组织：Imports → Types → Constants → Utils → State → Logic → UI → Exports
- ✅ 每段职责单一，避免跨段复杂依赖

### 3. **功能区域导向**
- ✅ 按UI功能区域进行模块划分：UserInfoArea、TransactionArea、ToolsArea
- ✅ 每个区域自包含完整功能，包含所有必需的资源和逻辑
- ✅ 强隔离设计，禁止跨区域直接引用
- ✅ 支持复杂交互的嵌套实现和简单展示的扁平实现

### 4. **架构完整 + 代码简洁**
- ✅ 结构完整但实现简洁，避免过度抽象
- ✅ 主组件控制在300行以内，子组件各自独立
- ✅ 遵循YAGNI原则，只实现当前需要的功能
- ✅ 支持从简单到复杂的渐进演化

## 🚀 使用方式

### 基础使用
```tsx
import { ProfileScreen } from '@/screens/profile';
// 或者
import ProfileScreen from '@/screens/profile';

// 在导航中使用
<Stack.Screen 
  name="Profile" 
  component={ProfileScreen} 
  options={{ headerShown: false }}
/>
```

### 单独使用组件
```tsx
import { 
  UserInfoArea, 
  TransactionArea, 
  ToolsArea 
} from '@/screens/profile';

// 自定义使用
<UserInfoArea 
  userInfo={userInfo}
  onAvatarPress={handleAvatarPress}
  onEditNickname={handleEditNickname}
  onEditBio={handleEditBio}
  onViewProfile={handleViewProfile}
/>
```

### 类型使用
```tsx
import type { 
  UserInfo, 
  TransactionCounts, 
  ProfilePageState,
  UserInfoAreaProps,
  TransactionAreaProps,
  ToolsAreaProps
} from '@/screens/profile';

const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
```

## 🎨 设计特性

### 视觉设计
- **紫色渐变背景**：#8A2BE2 → #B19CD9 营造高端感
- **卡片化布局**：白色卡片与渐变背景形成层次对比
- **统一图标系统**：圆形背景 + 白色图标设计语言
- **角标提醒系统**：红色圆形角标显示未读数量

### 交互设计
- **一致性反馈**：0.2s缩放动画 + 点击波纹效果
- **状态指示**：在线状态、认证标识、角标数字
- **手势支持**：下拉刷新、长按菜单等
- **错误容错**：网络异常、加载失败的友好提示

## 🔧 功能模块

### 1. 用户信息区域 (`UserInfoArea`)
- ✅ 头像展示和编辑 (60x60px圆形头像)
- ✅ 昵称和简介实时编辑，支持点击编辑
- ✅ 在线状态指示器 (绿色圆点)
- ✅ 认证标识显示 (蓝色勾号)
- ✅ 操作按钮 (查看资料)
- ✅ 八段式代码结构，便于维护

### 2. 交易功能区域 (`TransactionArea`)
- ✅ 4宫格功能布局：发布/订单/购买/报名
- ✅ 角标提醒：新订单、新报名状态 (红色角标)
- ✅ PNG图标 + Emoji备用方案
- ✅ 卡片阴影效果和动画反馈
- ✅ 嵌套组件架构：`FunctionButton` + `LayoutCard`

### 3. 工具功能区域 (`ToolsArea`)
- ✅ 多行功能网格：个人中心、状态、钱包、金币
- ✅ 系统功能：设置、客服、达人认证
- ✅ 钱包余额和金币数量动态显示
- ✅ 智能角标提醒和状态指示
- ✅ 复用 `FunctionButton` 组件，保持一致性

## 📱 响应式适配

- **屏幕尺寸**：支持iPhone SE (375px) → iPhone Pro Max (428px)
- **安全区域**：适配刘海屏和Home Indicator
- **字体缩放**：支持系统字体大小设置
- **横屏模式**：功能网格自动调整布局

## 🔍 代码质量

### 类型安全
- ✅ 完整的TypeScript类型定义
- ✅ 严格的Props类型检查
- ✅ API响应类型约束

### 性能优化
- ✅ useCallback优化回调函数
- ✅ 图片懒加载和缓存
- ✅ 组件按需渲染
- ✅ 动画性能优化

### 错误处理
- ✅ 网络异常处理
- ✅ 加载状态管理
- ✅ 用户友好的错误提示
- ✅ 边界条件处理

## 🛠️ 扩展指南

### 添加新功能区域
1. 创建新的功能区域目录：`src/screens/profile/{NewArea}/`
2. 按照八段式结构创建 `index.tsx` 主文件
3. 在 `types.ts` 中添加区域Props类型
4. 在主页面 `ProfileScreen.tsx` 中集成新区域
5. 更新 `index.ts` 导出文件

### 添加嵌套功能组件
1. 在功能区域下创建子组件目录：`{Area}/{Component}/`
2. 按照八段式结构实现组件逻辑
3. 添加必要的资源文件 (图标、图片等)
4. 在父区域组件中引用和使用

### 修改样式和配置
1. 在 `constants.ts` 中修改 `COLORS`、`SIZES` 等常量
2. 所有组件会自动应用新的设计规范
3. 支持按功能区域进行局部样式定制

### 添加API接口
1. 在 `constants.ts` 中添加 `API_ENDPOINTS`
2. 在 `types.ts` 中定义接口类型
3. 在对应功能区域中实现API调用逻辑
4. 遵循数据处理层的职责分离原则

## 📊 性能指标

- **首屏加载**：< 3秒 (3G网络)
- **交互响应**：< 100ms
- **动画流畅度**：60fps
- **内存使用**：< 50MB
- **包体积增量**：< 200KB

## 🔗 相关文档

- [设计文档](./我的页面模块架构设计.md)
- [RN模块结构设计](../../.cursor/rules/chatgpt-export_RN模块结构设计.md)
- [TypeScript规范](https://www.typescriptlang.org/docs/)
- [React Native指南](https://reactnative.dev/docs/getting-started)

---

## 📈 重构成果

### 🏗️ 架构升级
- ✅ **嵌套化主导**：移除 `components/` 中间层，采用功能区域架构
- ✅ **八段式结构**：所有 `index.tsx` 文件遵循标准化代码组织
- ✅ **职责清晰**：UserInfoArea、TransactionArea、ToolsArea 各司其职
- ✅ **向后兼容**：保持原有API接口，平滑迁移

### 📊 代码质量
- ✅ **结构清晰**：嵌套目录结构，便于定位和维护
- ✅ **类型完整**：新增区域Props类型，增强类型安全
- ✅ **资源整理**：图标资源按功能分类，便于管理
- ✅ **文档完善**：更新架构说明和使用指南

### 🚀 开发效率
- ✅ **快速定位**：八段式结构 + region标记，支持代码折叠
- ✅ **独立开发**：功能区域强隔离，支持并行开发
- ✅ **易于扩展**：标准化架构，新功能开发更高效
- ✅ **维护友好**：职责单一，bug定位和修复更快速

---

**重构时间**：2024年12月22日  
**版本**：v2.0 (基于通用组件模块化架构核心标准)  
**维护者**：开发团队  
**架构标准**：嵌套化主导 + 八段式结构  
**代码行数**：约1000行 (重构后增加架构完整性)  
**兼容性**：React Native 0.70+ / 向后兼容v1.0接口
