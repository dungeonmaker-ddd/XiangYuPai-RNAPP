# 👤 我的页面模块

> 基于RN模块结构设计的完整个人中心功能模块

## 📁 模块结构

```
src/screens/profile/
├── ProfileScreen.tsx           # 主页面组件 (≈300行)
├── components/                 # 子组件目录
│   ├── UserHeader.tsx         # 用户信息头部组件
│   ├── TransactionSection.tsx # 交易功能4宫格组件  
│   ├── ToolsSection.tsx       # 工具功能区域组件
│   ├── FunctionCard.tsx       # 通用功能卡片组件
│   └── index.ts               # 组件导出索引
├── types.ts                   # 类型定义 (完整类型系统)
├── constants.ts               # 常量配置 (颜色、尺寸、功能配置等)
├── index.ts                   # 模块主导出文件
└── README.md                  # 模块说明文档
```

## 🎯 设计原则

### 1. **功能域拆分 (Domain-based)**
- ✅ 按功能模块垂直拆分，每个组件职责单一
- ✅ 强隔离设计，禁止跨模块引用
- ✅ 自包含完整功能，包含所有必需的类型、常量、组件

### 2. **单文件架构优化**
- ✅ 主组件控制在300行以内
- ✅ 子组件各自独立，便于维护和测试
- ✅ 遵循YAGNI原则，只实现当前需要的功能

### 3. **代码复用策略**
- ✅ ≤30行的通用函数允许模块内拷贝
- ✅ 拒绝共享库依赖，避免过度抽象
- ✅ 组件设计支持复用但不强制共享

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
  UserHeader, 
  TransactionSection, 
  FunctionCard 
} from '@/screens/profile';

// 自定义使用
<UserHeader 
  userInfo={userInfo}
  onAvatarPress={handleAvatarPress}
  onEditNickname={handleEditNickname}
/>
```

### 类型使用
```tsx
import type { 
  UserInfo, 
  TransactionCounts, 
  ProfilePageState 
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

### 1. 用户信息区域 (`UserHeader`)
- ✅ 头像展示和编辑 (80x80px圆形头像)
- ✅ 昵称和简介实时编辑
- ✅ 在线状态指示器
- ✅ 认证标识显示
- ✅ 操作按钮 (查看资料、分享名片)

### 2. 交易功能区域 (`TransactionSection`)
- ✅ 4宫格功能布局：发布/订单/购买/报名
- ✅ 角标提醒：新订单、新报名状态
- ✅ 统计数据展示
- ✅ 卡片阴影效果

### 3. 工具功能区域 (`ToolsSection`)
- ✅ 多行功能网格：个人中心、状态、钱包、金币
- ✅ 系统功能：设置、客服、达人认证
- ✅ 钱包信息快览
- ✅ 智能角标提醒

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

### 添加新功能
1. 在 `constants.ts` 中添加功能配置
2. 在 `types.ts` 中定义相关类型
3. 创建对应的组件文件
4. 在主组件中集成新功能

### 修改样式
1. 在 `constants.ts` 中修改 `COLORS`、`SIZES` 等常量
2. 所有组件会自动应用新的设计规范

### 添加API接口
1. 在 `constants.ts` 中添加 `API_ENDPOINTS`
2. 在 `types.ts` 中定义接口类型
3. 在主组件中实现API调用逻辑

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

**创建时间**：2024年12月19日  
**版本**：v1.0  
**维护者**：开发团队  
**代码行数**：约800行 (主组件300行 + 子组件500行)  
**测试覆盖率**：待完善  
**兼容性**：React Native 0.70+
