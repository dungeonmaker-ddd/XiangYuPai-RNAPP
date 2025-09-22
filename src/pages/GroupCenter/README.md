# GroupCenter 页面组

## 📖 概述

GroupCenter 页面组是应用的组局功能核心模块，包含组局中心展示、组局发布、支付管理等相关页面，采用层级化页面组架构。这是一个功能完整的游戏组局平台。

## 🏗️ 架构结构

```
src/pages/GroupCenter/                              # GroupCenter 页面组
├── index.ts                                        # 页面组入口文件
├── types.ts                                        # 页面组类型定义
├── constants.ts                                    # 页面组常量配置
├── README.md                                       # 页面组文档
│
├── MainPage/                                       # 主页面 - 组局中心展示
│   ├── index.tsx                                   # 主页面实现（从 GroupCenterScreen.tsx 迁移）
│   ├── types.ts                                    # 主页面类型定义
│   ├── constants.ts                                # 主页面常量配置
│   ├── README.md                                   # 主页面文档
│   │
│   ├── HeaderArea/                                 # 头部区域（已按新架构组织）
│   │   ├── index.tsx                               # 头部主组件
│   │   ├── types.ts                                # 头部类型定义
│   │   ├── constants.ts                            # 头部常量配置
│   │   ├── README.md                               # 头部文档
│   │   │
│   │   ├── NavigationBar/                          # 🔸 导航栏功能区域
│   │   │   ├── index.tsx                           # 导航栏组件
│   │   │   ├── types.ts                            # 导航栏类型
│   │   │   ├── constants.ts                        # 导航栏常量
│   │   │   ├── useNavigation.ts                    # 导航状态管理
│   │   │   ├── onNavigate.ts                       # 导航事件处理
│   │   │   └── utilsNavigation.ts                  # 导航工具函数
│   │   │
│   │   └── PublishButton/                          # 🔸 发布按钮功能区域
│   │       ├── index.tsx                           # 发布按钮组件
│   │       ├── constants.ts                        # 发布按钮常量
│   │       └── utilsButton.ts                      # 按钮工具函数
│   │
│   ├── FilterArea/                                 # 筛选区域（已按新架构组织）
│   │   ├── index.tsx                               # 筛选主组件
│   │   ├── types.ts                                # 筛选类型定义
│   │   ├── constants.ts                            # 筛选常量配置
│   │   ├── README.md                               # 筛选文档
│   │   │
│   │   ├── QuickFilters/                           # 🔸 快速筛选功能区域
│   │   │   ├── index.tsx                           # 快速筛选组件
│   │   │   ├── types.ts                            # 筛选类型
│   │   │   ├── constants.ts                        # 筛选常量
│   │   │   ├── useFilters.ts                       # 筛选状态管理
│   │   │   ├── onFilterChange.ts                   # 筛选事件处理
│   │   │   ├── processFilterData.ts                # 筛选数据处理
│   │   │   └── utilsFilter.ts                      # 筛选工具函数
│   │   │
│   │   └── TypeTabs/                               # 🔸 类型标签功能区域
│   │       ├── index.tsx                           # 类型标签组件
│   │       ├── constants.ts                        # 标签常量
│   │       ├── processData.ts                      # 数据处理
│   │       └── utilsDisplay.ts                     # 显示工具
│   │
│   ├── ContentArea/                                # 内容区域（已按新架构组织）
│   │   ├── index.tsx                               # 内容主组件
│   │   ├── types.ts                                # 内容类型定义
│   │   ├── constants.ts                            # 内容常量配置
│   │   │
│   │   ├── GroupCard/                              # 🔸 组局卡片功能区域
│   │   │   ├── index.tsx                           # 组局卡片组件
│   │   │   ├── types.ts                            # 卡片类型
│   │   │   ├── constants.ts                        # 卡片常量
│   │   │   ├── README.md                           # 卡片文档
│   │   │   ├── useCardState.ts                     # 卡片状态管理
│   │   │   ├── onCardAction.ts                     # 卡片事件处理
│   │   │   ├── processCardData.ts                  # 卡片数据处理
│   │   │   └── utilsCard.ts                        # 卡片工具函数
│   │   │
│   │   ├── GroupList/                              # 🟢 组局列表功能区域
│   │   │   └── index.tsx                           # 列表组件
│   │   │
│   │   └── LoadingStates/                          # 🟢 加载状态功能区域
│   │       └── index.tsx                           # 加载状态组件
│   │
│   ├── [架构设计文档]                              # 完整的架构设计文档
│   │   ├── 组局中心模块架构设计.md
│   │   ├── 组局发布支付功能架构设计.md
│   │   └── 组局报名流程架构设计.md
│   │
│   ├── useGroupCenter.ts                           # 组局中心状态管理
│   ├── useGroupCenterData.ts                       # 组局中心数据管理
│   ├── navigateBack.ts                             # 返回导航
│   └── navigateToDetail.ts                         # 详情导航
│
├── PublishPage/                                    # 发布页面 - 组局发布功能
│   ├── index.tsx                                   # 发布页面实现（从 PublishGroupScreen.tsx 迁移）
│   ├── types.ts                                    # 发布页面类型定义
│   ├── constants.ts                                # 发布页面常量配置
│   ├── README.md                                   # 发布页面文档
│   │
│   ├── HeaderArea/                                 # 发布页头部区域（已按新架构组织）
│   │   ├── index.tsx                               # 头部主组件
│   │   ├── types.ts                                # 头部类型定义
│   │   ├── constants.ts                            # 头部常量配置
│   │   ├── README.md                               # 头部文档
│   │   │
│   │   ├── NavigationBar/                          # 🔸 导航栏功能区域
│   │   │   ├── index.tsx                           # 导航栏组件
│   │   │   ├── types.ts                            # 导航栏类型
│   │   │   ├── constants.ts                        # 导航栏常量
│   │   │   ├── useNavigation.ts                    # 导航状态管理
│   │   │   ├── onNavigate.ts                       # 导航事件处理
│   │   │   └── utilsNavigation.ts                  # 导航工具函数
│   │   │
│   │   └── SaveButton/                             # 🔸 保存按钮功能区域
│   │       ├── index.tsx                           # 保存按钮组件
│   │       ├── constants.ts                        # 按钮常量
│   │       └── utilsButton.ts                      # 按钮工具函数
│   │
│   ├── TypeSelectionArea/                          # 类型选择区域（已按新架构组织）
│   │   ├── index.tsx                               # 类型选择主组件
│   │   ├── types.ts                                # 类型选择类型定义
│   │   ├── constants.ts                            # 类型选择常量配置
│   │   ├── README.md                               # 类型选择文档
│   │   │
│   │   ├── TypeGrid/                               # 🔸 类型网格功能区域
│   │   │   ├── index.tsx                           # 类型网格组件
│   │   │   ├── types.ts                            # 网格类型
│   │   │   ├── constants.ts                        # 网格常量
│   │   │   ├── useTypeSelection.ts                 # 类型选择状态管理
│   │   │   ├── onTypeSelect.ts                     # 类型选择事件处理
│   │   │   ├── processTypeData.ts                  # 类型数据处理
│   │   │   └── utilsType.ts                        # 类型工具函数
│   │   │
│   │   └── TypeValidation/                         # 🔸 类型验证功能区域
│   │       ├── index.tsx                           # 类型验证组件
│   │       └── utilsValidation.ts                  # 验证工具函数
│   │
│   ├── useGroupPublish.ts                          # 组局发布状态管理
│   ├── navigateBack.ts                             # 返回导航
│   ├── navigateToPayment.ts                        # 支付导航
│   ├── INTEGRATION_GUIDE.md                        # 集成指南
│   ├── REFACTOR_VALIDATION.md                      # 重构验证文档
│   └── 组局发布支付功能架构设计.md                  # 发布支付架构设计
│
├── useGroupCenter.ts                               # 页面组主状态管理
├── useGroupCenterData.ts                          # 页面组数据状态管理
└── navigateGroupCenterFlow.ts                     # 页面组导航流程管理
```

## 🎯 页面说明

### 📱 MainPage - 组局中心主页面
- **功能**: 组局展示和筛选，包含组局列表、快速筛选、类型标签等
- **位置**: `./MainPage/`
- **入口**: `index.tsx`（从 `GroupCenterScreen.tsx` 迁移）
- **原始位置**: `src/screens/group-center/`
- **特色**: 完整的组件区域架构，包含 HeaderArea、FilterArea、ContentArea

### 📝 PublishPage - 组局发布页面
- **功能**: 组局发布和编辑，包含类型选择、信息填写、发布设置等
- **位置**: `./PublishPage/`
- **入口**: `index.tsx`（从 `PublishGroupScreen.tsx` 迁移）
- **原始位置**: `src/screens/group-publish/`
- **特色**: 完整的发布流程，包含 HeaderArea、TypeSelectionArea

## 🔄 迁移状态

### ✅ 已完成
- [x] 基础目录结构创建
- [x] 主页面内容迁移 (`src/screens/group-center` → `./MainPage/`)
- [x] 发布页面内容迁移 (`src/screens/group-publish` → `./PublishPage/`)
- [x] 页面组入口文件创建
- [x] 页面组基础架构文件创建
- [x] 页面组状态管理层创建
- [x] 页面组导航层创建
- [x] 完整的组件区域架构保留

### ✅ 架构优势
- **完整的组件区域架构**: 两个页面都已经按照新架构标准组织
- **功能区域完整**: 包含完整的状态管理、事件处理、数据处理、工具函数
- **文档完整**: 包含详细的架构设计文档和使用指南
- **类型定义完整**: 涵盖组局、支付、统计等完整业务类型

### 🔄 进行中
- [ ] 导入路径更新
- [ ] 功能测试验证

### 📋 待完成
- [ ] API接口层完善（组局CRUD、支付接口等）
- [ ] 实时数据同步（WebSocket）
- [ ] 支付流程完善
- [ ] 地图集成
- [ ] 推送通知集成
- [ ] 性能优化

## 🚀 使用方式

### 导入页面组件
```typescript
// 导入主页面
import { GroupCenterMainPage } from '@/pages/GroupCenter';

// 导入子页面
import { GroupCenterPublishPage } from '@/pages/GroupCenter';

// 导入类型和常量
import { 
  GroupCenterNavigationParams, 
  GroupInfo, 
  GroupPublishData,
  GROUP_CENTER_ROUTES, 
  GAME_TYPES 
} from '@/pages/GroupCenter';

// 导入状态管理
import { 
  useGroupCenter, 
  useGroupCenterData, 
  navigateGroupCenterFlow 
} from '@/pages/GroupCenter';
```

### 状态管理使用
```typescript
const MyComponent = () => {
  // 使用页面组状态管理
  const {
    currentFilter,
    publishData,
    filterByGameType,
    updatePublishData,
    validatePublishData,
  } = useGroupCenter();

  // 使用数据状态管理
  const {
    groupList,
    currentGroup,
    isLoadingGroups,
    joinGroup,
    publishGroup,
    toggleFavorite,
    loadMore,
  } = useGroupCenterData();

  // 处理组局操作
  const handleGroupAction = (action: string, groupId: string) => {
    navigateGroupCenterFlow.handleGroupAction(action, groupId, { 
      price: currentGroup?.price 
    });
  };

  return (
    // 组件JSX
  );
};
```

### 导航使用
```typescript
// 导航到各个页面
navigateGroupCenterFlow.toMain();
navigateGroupCenterFlow.toPublish({ publishData: templateData });

// 复合导航操作
navigateGroupCenterFlow.viewGroupDetail('group123', 'user456');
navigateGroupCenterFlow.joinGroupWithPayment('group123', 50);
navigateGroupCenterFlow.chatWithOrganizer('user456', '组织者', 'group123');

// 筛选导航
navigateGroupCenterFlow.filterByGameType('王者荣耀');
navigateGroupCenterFlow.filterByTimeRange('today');

// 处理交互导航
navigateGroupCenterFlow.handleGroupAction('join', 'group123', { price: 50 });
navigateGroupCenterFlow.handleUserAction('chat', 'user456', '用户名');

// 发布流程导航
navigateGroupCenterFlow.handlePublishFlow('start');
navigateGroupCenterFlow.handlePublishFlow('success');
```

### 发布组局使用
```typescript
const publishGroup = async () => {
  // 验证发布数据
  const validation = validatePublishData();
  if (!validation.isValid) {
    console.error('发布数据验证失败:', validation.errors);
    return;
  }

  try {
    // 发布组局
    const groupId = await publishGroup(publishData);
    navigateGroupCenterFlow.handlePublishFlow('success');
  } catch (error) {
    console.error('发布失败:', error);
  }
};
```

## 📝 注意事项

1. **架构标准**: 严格遵循 `UNIVERSAL_COMPONENT_ARCHITECTURE_CORE.md` 标准
2. **支付集成**: 需要集成支付网关（微信支付、支付宝等）
3. **实时通信**: 需要WebSocket实现实时组局状态更新
4. **地图服务**: 需要集成地图服务显示组局位置
5. **推送通知**: 组局状态变化需要推送通知
6. **数据缓存**: 组局列表和详情的本地缓存策略
7. **权限管理**: 组局创建者和参与者的权限控制
8. **安全性**: 支付安全和用户数据保护

## 🔗 相关文档

- [UNIVERSAL_COMPONENT_ARCHITECTURE_CORE.md](../../.cursor/rules/UNIVERSAL_COMPONENT_ARCHITECTURE_CORE.md)
- [MainPage README](./MainPage/README.md)
- [PublishPage README](./PublishPage/README.md)
- [组局中心模块架构设计.md](./MainPage/组局中心模块架构设计.md)
- [组局发布支付功能架构设计.md](./MainPage/组局发布支付功能架构设计.md)
- [组局报名流程架构设计.md](./MainPage/组局报名流程架构设计.md)
- [发布页集成指南](./PublishPage/INTEGRATION_GUIDE.md)
- [重构验证文档](./PublishPage/REFACTOR_VALIDATION.md)

## 💰 业务特色

### 完整的组局生态
- **多游戏支持**: 支持王者荣耀、和平精英、英雄联盟等多种游戏
- **智能筛选**: 按游戏类型、地点、时间、价格等多维度筛选
- **支付系统**: 完整的支付流程和退款机制
- **评价系统**: 组织者和参与者互相评价
- **地理位置**: 基于位置的组局推荐

### 高级功能
- **实时状态**: 组局状态实时更新
- **智能推荐**: 基于用户偏好的组局推荐
- **社交功能**: 组局内聊天、好友系统
- **数据统计**: 完整的组局数据分析
- **安全保障**: 支付安全和纠纷处理机制
