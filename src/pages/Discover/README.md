# Discover 页面组

## 📖 概述

Discover 页面组是应用的内容发现核心模块，包含内容展示、详情查看、互动功能等相关页面，采用层级化页面组架构。

## 🏗️ 架构结构

```
src/pages/Discover/                                 # Discover 页面组
├── index.ts                                        # 页面组入口文件
├── types.ts                                        # 页面组类型定义
├── constants.ts                                    # 页面组常量配置
├── README.md                                       # 页面组文档
│
├── MainPage/                                       # 主页面 - 内容发现展示
│   ├── index.tsx                                   # 主页面实现（新创建，待完善）
│   ├── types.ts                                    # 主页面类型定义
│   ├── constants.ts                                # 主页面常量配置
│   ├── README.md                                   # 主页面文档
│   │
│   ├── 纯结构架构图标准模板.md                     # 架构设计文档
│   ├── [UI设计图片资源]                            # 各种UI设计图片
│   │   ├── 发现-热门.png
│   │   ├── 发现-同城.png
│   │   ├── 发现-关注.png
│   │   ├── 动态-图文.png
│   │   ├── 动态-视频.png
│   │   ├── 发布-动态.png
│   │   └── [其他设计图片...]
│   │
│   └── [待创建的组件区域]
│       ├── TabBarArea/                             # 标签栏区域（热门/同城/关注）
│       ├── ContentFeedArea/                        # 内容流区域（瀑布流）
│       ├── FilterArea/                             # 筛选区域
│       └── PublishButtonArea/                      # 发布按钮区域
│
├── DetailPage/                                     # 详情页面 - 内容详情展示
│   ├── index.tsx                                   # 详情页面实现（从 DiscoverDetailPage.tsx 迁移）
│   ├── types.ts                                    # 详情页面类型定义
│   ├── constants.ts                                # 详情页面常量配置
│   ├── README.md                                   # 详情页面文档
│   │
│   ├── components/                                 # ⚠️ 待重构的组件目录
│   │   ├── CommentInput.tsx                        # 评论输入组件
│   │   ├── CommentList.tsx                         # 评论列表组件
│   │   ├── DetailHeader.tsx                        # 详情头部组件
│   │   ├── ImageViewer.tsx                         # 图片查看器组件
│   │   ├── UserInfoCard.tsx                        # 用户信息卡片组件
│   │   ├── InteractionActionBarExample.tsx         # 交互操作栏示例
│   │   └── README_InteractionActionBar.md          # 交互操作栏文档
│   │
│   ├── events/                                     # 事件处理（已按新架构组织）
│   │   ├── navigateToChat.ts                       # 导航到聊天
│   │   ├── navigateToDiscover.ts                   # 导航到发现页
│   │   ├── navigateToProfile.ts                    # 导航到用户页
│   │   ├── navigateToReport.ts                     # 导航到举报页
│   │   └── README.md                               # 事件处理文档
│   │
│   ├── examples/                                   # 使用示例
│   │   ├── DetailHeaderWithReportExample.tsx       # 带举报功能的头部示例
│   │   ├── DiscoverIntegrationExample.tsx          # 发现页集成示例
│   │   ├── NavigationEventsExample.tsx             # 导航事件示例
│   │   ├── NavigationExample.tsx                   # 导航示例
│   │   └── UsageExample.tsx                        # 使用示例
│   │
│   ├── hooks/                                      # 状态管理钩子
│   │   └── useDiscoverDetail.ts                    # 详情页状态管理
│   │
│   ├── services/                                   # 数据服务
│   │   └── DetailDataService.ts                    # 详情数据服务
│   │
│   └── types/                                      # 详情页类型定义
│       └── index.ts                                # 类型定义文件
│
├── useDiscover.ts                                  # 页面组主状态管理
├── useDiscoverData.ts                              # 页面组数据状态管理
└── navigateDiscoverFlow.ts                        # 页面组导航流程管理
```

## 🎯 页面说明

### 📱 MainPage - 内容发现主页面
- **功能**: 内容发现展示，包含热门、同城、关注三个标签页，瀑布流内容展示
- **位置**: `./MainPage/`
- **入口**: `index.tsx`（新创建，待完善具体功能）
- **原始位置**: `src/screens/discover/`
- **特色**: 包含完整的UI设计图片资源和架构设计文档

### 📄 DetailPage - 内容详情页面
- **功能**: 内容详情展示，包含评论、互动、用户信息等完整功能
- **位置**: `./DetailPage/`
- **入口**: `index.tsx`（从 `DiscoverDetailPage.tsx` 迁移）
- **原始位置**: `src/screens/discover-detail/`
- **特色**: 完整的组件体系、事件处理、状态管理、数据服务

## 🔄 迁移状态

### ✅ 已完成
- [x] 基础目录结构创建
- [x] 主页面内容迁移 (`src/screens/discover` → `./MainPage/`)
- [x] 详情页面内容迁移 (`src/screens/discover-detail` → `./DetailPage/`)
- [x] 页面组入口文件创建
- [x] 页面组基础架构文件创建
- [x] 页面组状态管理层创建
- [x] 页面组导航层创建

### 🔄 进行中
- [ ] MainPage 具体功能实现（目前只是基础框架）
- [ ] 移除 DetailPage 中的 `components/` 中间层级
- [ ] 导入路径更新
- [ ] 功能测试验证

### 📋 待完成
- [ ] MainPage 组件区域创建和实现
- [ ] DetailPage 组件区域重构（将 `components/` 下的组件重构为组件区域）
- [ ] API接口层完善（内容获取、互动接口等）
- [ ] 图片和视频处理优化
- [ ] 无限滚动和虚拟化列表
- [ ] 文档完善

## ⚠️ 重构注意事项

### MainPage 待实现功能
当前 MainPage 只是基础框架，需要实现：
- 标签栏切换（热门/同城/关注）
- 瀑布流内容展示
- 下拉刷新和上拉加载
- 筛选和搜索功能
- 发布按钮和快速操作

### DetailPage 需要重构的 `components/` 目录
```
DetailPage/components/ → 重构为组件区域：
├── CommentInput.tsx → CommentInputArea/
├── CommentList.tsx → CommentListArea/
├── DetailHeader.tsx → DetailHeaderArea/
├── ImageViewer.tsx → ImageViewerArea/
├── UserInfoCard.tsx → UserInfoCardArea/
└── InteractionActionBarExample.tsx → InteractionActionBarArea/examples/
```

## 🚀 使用方式

### 导入页面组件
```typescript
// 导入主页面
import { DiscoverMainPage } from '@/pages/Discover';

// 导入子页面
import { DiscoverDetailPage } from '@/pages/Discover';

// 导入类型和常量
import { 
  DiscoverNavigationParams, 
  DiscoverContentItem, 
  DISCOVER_ROUTES, 
  DISCOVER_CATEGORIES 
} from '@/pages/Discover';

// 导入状态管理
import { useDiscover, useDiscoverData, navigateDiscoverFlow } from '@/pages/Discover';
```

### 状态管理使用
```typescript
const MyComponent = () => {
  // 使用页面组状态管理
  const {
    currentFilter,
    currentPostId,
    switchCategory,
    addTagFilter,
  } = useDiscover();

  // 使用数据状态管理
  const {
    contentList,
    currentPost,
    isLoadingContent,
    toggleLike,
    toggleCollect,
    loadMore,
  } = useDiscoverData();

  // 处理内容交互
  const handleContentClick = (postId: string, userId?: string) => {
    navigateDiscoverFlow.viewPostDetail(postId, userId);
  };

  return (
    // 组件JSX
  );
};
```

### 导航使用
```typescript
// 导航到各个页面
navigateDiscoverFlow.toMain();
navigateDiscoverFlow.toDetail({ postId: 'post123' });

// 复合导航操作
navigateDiscoverFlow.viewPostDetail('post123', 'user456');
navigateDiscoverFlow.chatWithUser('user456', '用户名');
navigateDiscoverFlow.reportContent('post123');

// 筛选导航
navigateDiscoverFlow.filterByCategory('hot');
navigateDiscoverFlow.filterByTag('王者荣耀');

// 处理交互导航
navigateDiscoverFlow.handleContentInteraction('view', 'post123', 'user456');
navigateDiscoverFlow.handleUserInteraction('chat', 'user456', '用户名');
```

## 📝 注意事项

1. **架构标准**: 严格遵循 `UNIVERSAL_COMPONENT_ARCHITECTURE_CORE.md` 标准
2. **内容类型**: 支持文字、图片、视频多种内容类型
3. **性能优化**: 需要虚拟化列表和图片懒加载
4. **实时更新**: 考虑点赞、评论等实时状态同步
5. **缓存策略**: 内容列表和详情的本地缓存
6. **组件重构**: DetailPage 需要将现有 `components/` 重构为组件区域架构
7. **MainPage 完善**: 需要实现完整的内容发现功能

## 🔗 相关文档

- [UNIVERSAL_COMPONENT_ARCHITECTURE_CORE.md](../../.cursor/rules/UNIVERSAL_COMPONENT_ARCHITECTURE_CORE.md)
- [MainPage README](./MainPage/README.md)
- [DetailPage README](./DetailPage/README.md)
- [纯结构架构图标准模板.md](./MainPage/纯结构架构图标准模板.md)
- [DetailPage 组件文档](./DetailPage/components/README_InteractionActionBar.md)
