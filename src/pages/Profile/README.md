# Profile 页面组

## 📖 概述

Profile 页面组包含用户个人资料相关的所有页面和功能，采用层级化页面组架构。

## 🏗️ 架构结构

```
src/pages/Profile/                                  # Profile 页面组
├── index.ts                                        # 页面组入口文件
├── types.ts                                        # 页面组类型定义
├── constants.ts                                    # 页面组常量配置
├── README.md                                       # 页面组文档
│
├── MainPage/                                       # 主页面 - 用户个人资料展示
│   ├── index.tsx                                   # 主页面实现（从 ProfileScreen.tsx 迁移）
│   ├── types.ts                                    # 主页面类型定义
│   ├── constants.ts                                # 主页面常量配置
│   ├── README.md                                   # 主页面文档
│   │
│   ├── UserInfoArea/                               # 用户信息区域
│   ├── TransactionArea/                            # 交易功能区域
│   ├── ToolsArea/                                  # 工具区域
│   └── SharedComponents/                           # 共享组件区域
│
└── ReportPage/                                     # 举报页面 - 用户举报功能
    ├── index.tsx                                   # 举报页面实现（从 ReportScreen.tsx 迁移）
    ├── types.ts                                    # 举报页面类型定义
    ├── constants.ts                                # 举报页面常量配置
    └── [其他组件区域...]                           # 举报页面的各个功能区域
```

## 🎯 页面说明

### 📱 MainPage - 主页面
- **功能**: 用户个人资料展示和基础操作
- **位置**: `./MainPage/`
- **入口**: `index.tsx`（从 `ProfileScreen.tsx` 迁移）

### 📝 ReportPage - 举报页面
- **功能**: 用户举报功能，包含举报类型选择、描述输入、图片上传等
- **位置**: `./ReportPage/`
- **入口**: `index.tsx`（从 `ReportScreen.tsx` 迁移）
- **原始位置**: `src/screens/profile-report/`

## 🔄 迁移状态

### ✅ 已完成
- [x] 基础目录结构创建
- [x] 主页面内容迁移 (`src/screens/profile` → `./MainPage/`)
- [x] 举报页面内容迁移 (`src/screens/profile-report` → `./ReportPage/`)
- [x] 页面组入口文件创建
- [x] 页面组基础架构文件创建

### 🔄 进行中
- [ ] 组件区域重构（将现有组件重构为组件区域模式）
- [ ] 导入路径更新
- [ ] 功能测试验证

### 📋 待完成
- [ ] 页面组状态管理层创建
- [ ] 页面组导航层创建
- [ ] API接口层完善（如需要）
- [ ] 文档完善

## 🚀 使用方式

### 导入页面组件
```typescript
// 导入主页面
import { ProfileMainPage } from '@/pages/Profile';

// 导入举报页面
import { ProfileReportPage } from '@/pages/Profile';

// 导入类型和常量
import { ProfileNavigationParams, PROFILE_ROUTES } from '@/pages/Profile';
```

### 导航使用
```typescript
// 导航到主页面
navigation.navigate(PROFILE_ROUTES.MAIN);

// 导航到举报页面
navigation.navigate(PROFILE_ROUTES.REPORT, { reportType: 'user' });
```

## 📝 注意事项

1. **架构标准**: 严格遵循 `UNIVERSAL_COMPONENT_ARCHITECTURE_CORE.md` 标准
2. **迁移安全**: 原始文件保留在 `src/screens/` 目录，迁移验证后再清理
3. **路径更新**: 需要更新所有相关的导入路径
4. **功能完整**: 确保迁移后功能无丢失

## 🔗 相关文档

- [UNIVERSAL_COMPONENT_ARCHITECTURE_CORE.md](../../.cursor/rules/UNIVERSAL_COMPONENT_ARCHITECTURE_CORE.md)
- [MainPage README](./MainPage/README.md)
- [ReportPage README](./ReportPage/README.md)
