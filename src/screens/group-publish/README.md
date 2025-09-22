# 🎯 组局发布功能模块

> **基于通用组件架构核心标准的完整发布+支付闭环系统**  
> **架构等级：★★★★ (发布+支付闭环功能)**

## 📖 模块概述

### 功能定位
**组局发布功能模块**是组局中心的核心发布流程，包含从活动类型选择、信息填写、参数设置到支付确认的完整发布闭环，支持6种活动类型的完整发布流程。

### 核心特性
- ✅ **6种活动类型选择**：探店、私影、台球、K歌、喝酒、按摩的图标化选择
- ✅ **完整信息填写**：标题、正文、系数项、约定项的结构化表单
- ✅ **灵活参数配置**：时间、地点、定价、人数、报名截止时间设置
- ✅ **支付确认流程**：金币支付、余额检查、费用明细展示
- ✅ **发布规则提示**：平台手续费、服务条款的透明化展示

## 🏗️ 架构结构

```
src/screens/group-publish/
├── index.tsx                    # 📱 页面父组件 - 集成所有子组件
├── types.ts                     # 📋 页面类型定义 - 导出所有相关类型
├── constants.ts                 # ⚙️ 页面常量配置 - 导出所有相关常量
├── README.md                    # 📖 页面文档 - 包含所有组件说明
│
├── 🔄 页面状态管理层
│   ├── useGroupPublish.ts       # 页面主状态管理
│   ├── useGroupPublishForm.ts   # 页面表单状态管理
│   └── useGroupPublishData.ts   # 页面数据状态管理
│
├── 🧭 页面导航层
│   ├── navigateToPayment.ts     # 页面跳转导航
│   ├── navigateBack.ts          # 返回导航
│   └── navigateGroupPublishFlow.ts # 流程导航
│
├── HeaderArea/                  # ✅ 组件区域1 - 头部导航区域
│   ├── index.tsx               # 主组件文件
│   ├── types.ts                # 组件类型定义
│   ├── constants.ts            # 组件常量配置
│   ├── README.md               # 组件文档
│   │
│   ├── NavigationBar/          # 🔸 功能区域1 - 导航栏功能（复杂嵌套）
│   │   ├── index.tsx           # 区域主文件
│   │   ├── types.ts            # 区域类型定义
│   │   ├── constants.ts        # 区域常量
│   │   ├── useNavigation.ts    # 区域本地状态
│   │   ├── onNavigate.ts       # 区域事件处理
│   │   └── utilsNavigation.ts  # 导航工具
│   │
│   └── SaveButton/             # 🟢 功能区域2 - 保存按钮（扁平实现）
│       ├── index.tsx           # 区域主文件
│       ├── constants.ts        # 区域常量
│       └── utilsButton.ts      # 按钮工具
│
├── TypeSelectionArea/          # ✅ 组件区域2 - 活动类型选择区域
│   ├── index.tsx               # 主组件文件
│   ├── types.ts                # 组件类型定义
│   ├── constants.ts            # 组件常量配置
│   ├── README.md               # 组件文档
│   │
│   ├── TypeGrid/               # 🔸 功能区域1 - 类型网格（复杂嵌套）
│   │   ├── index.tsx           # 区域主文件
│   │   ├── types.ts            # 区域类型定义
│   │   ├── constants.ts        # 区域常量
│   │   ├── useTypeSelection.ts # 区域本地状态
│   │   ├── onTypeSelect.ts     # 区域事件处理
│   │   ├── processTypeData.ts  # 数据处理
│   │   └── utilsType.ts        # 类型工具
│   │
│   └── TypeValidation/         # 🟢 功能区域2 - 类型验证（扁平实现）
│       ├── index.tsx           # 区域主文件
│       └── utilsValidation.ts  # 验证工具
│
├── FormInputArea/              # ✅ 组件区域3 - 表单输入区域
│   ├── index.tsx               # 主组件文件
│   ├── types.ts                # 组件类型定义
│   ├── constants.ts            # 组件常量配置
│   ├── README.md               # 组件文档
│   │
│   ├── TitleInput/             # 🔸 功能区域1 - 标题输入（复杂嵌套）
│   │   ├── index.tsx           # 区域主文件
│   │   ├── types.ts            # 区域类型定义
│   │   ├── constants.ts        # 区域常量
│   │   ├── useTitleInput.ts    # 区域本地状态
│   │   ├── onTitleChange.ts    # 区域事件处理
│   │   ├── processTitleData.ts # 数据处理
│   │   └── utilsTitle.ts       # 标题工具
│   │
│   ├── ContentInput/           # 🔸 功能区域2 - 正文输入（复杂嵌套）
│   │   ├── index.tsx           # 区域主文件
│   │   ├── types.ts            # 区域类型定义
│   │   ├── constants.ts        # 区域常量
│   │   ├── useContentInput.ts  # 区域本地状态
│   │   ├── onContentChange.ts  # 区域事件处理
│   │   ├── processContentData.ts # 数据处理
│   │   └── utilsContent.ts     # 内容工具
│   │
│   └── ParameterConfig/        # 🟢 功能区域3 - 系数项配置（扁平实现）
│       ├── index.tsx           # 区域主文件
│       └── utilsParameter.ts   # 参数工具
│
├── AgreementArea/              # ✅ 组件区域4 - 约定项设置区域
│   ├── index.tsx               # 主组件文件
│   ├── types.ts                # 组件类型定义
│   ├── constants.ts            # 组件常量配置
│   ├── README.md               # 组件文档
│   │
│   ├── TimeSettings/           # 🔸 功能区域1 - 时间设置（复杂嵌套）
│   │   ├── index.tsx           # 区域主文件
│   │   ├── types.ts            # 区域类型定义
│   │   ├── constants.ts        # 区域常量
│   │   ├── useTimeSettings.ts  # 区域本地状态
│   │   ├── onTimeChange.ts     # 区域事件处理
│   │   ├── processTimeData.ts  # 数据处理
│   │   └── utilsTime.ts        # 时间工具
│   │
│   ├── LocationSettings/       # 🔸 功能区域2 - 地点设置（复杂嵌套）
│   │   ├── index.tsx           # 区域主文件
│   │   ├── types.ts            # 区域类型定义
│   │   ├── constants.ts        # 区域常量
│   │   ├── useLocationSettings.ts # 区域本地状态
│   │   ├── onLocationChange.ts # 区域事件处理
│   │   ├── processLocationData.ts # 数据处理
│   │   └── utilsLocation.ts    # 地点工具
│   │
│   ├── PricingSettings/        # 🔸 功能区域3 - 定价设置（复杂嵌套）
│   │   ├── index.tsx           # 区域主文件
│   │   ├── types.ts            # 区域类型定义
│   │   ├── constants.ts        # 区域常量
│   │   ├── usePricingSettings.ts # 区域本地状态
│   │   ├── onPricingChange.ts  # 区域事件处理
│   │   ├── processPricingData.ts # 数据处理
│   │   └── utilsPricing.ts     # 定价工具
│   │
│   ├── ParticipantSettings/    # 🔸 功能区域4 - 人数设置（复杂嵌套）
│   │   ├── index.tsx           # 区域主文件
│   │   ├── types.ts            # 区域类型定义
│   │   ├── constants.ts        # 区域常量
│   │   ├── useParticipantSettings.ts # 区域本地状态
│   │   ├── onParticipantChange.ts # 区域事件处理
│   │   ├── processParticipantData.ts # 数据处理
│   │   └── utilsParticipant.ts # 人数工具
│   │
│   └── DeadlineSettings/       # 🔸 功能区域5 - 截止时间设置（复杂嵌套）
│       ├── index.tsx           # 区域主文件
│       ├── types.ts            # 区域类型定义
│       ├── constants.ts        # 区域常量
│       ├── useDeadlineSettings.ts # 区域本地状态
│       ├── onDeadlineChange.ts # 区域事件处理
│       ├── processDeadlineData.ts # 数据处理
│       └── utilsDeadline.ts    # 截止时间工具
│
├── PaymentArea/                # ✅ 组件区域5 - 支付确认区域
│   ├── index.tsx               # 主组件文件
│   ├── types.ts                # 组件类型定义
│   ├── constants.ts            # 组件常量配置
│   ├── README.md               # 组件文档
│   │
│   ├── PaymentModal/           # 🔸 功能区域1 - 支付弹窗（复杂嵌套）
│   │   ├── index.tsx           # 区域主文件
│   │   ├── types.ts            # 区域类型定义
│   │   ├── constants.ts        # 区域常量
│   │   ├── usePaymentModal.ts  # 区域本地状态
│   │   ├── onPaymentAction.ts  # 区域事件处理
│   │   ├── processPaymentData.ts # 数据处理
│   │   └── utilsPayment.ts     # 支付工具
│   │
│   └── PaymentValidation/      # 🟢 功能区域2 - 支付验证（扁平实现）
│       ├── index.tsx           # 区域主文件
│       └── utilsValidation.ts  # 验证工具
│
├── 🌐 页面API层
│   ├── apiGroupPublishCreate.ts # 页面级API接口
│   └── apiGroupPublishAggregate.ts # 聚合API接口
│
├── 🔄 页面数据处理层
│   ├── processGroupPublishData.ts # 页面数据处理
│   ├── processAggregateData.ts    # 聚合数据处理
│   └── processValidation.ts       # 数据验证处理
│
└── 🛠️ 页面工具层
    ├── utilsGroupPublishDisplay.ts # 页面显示工具
    ├── utilsCoordination.ts        # 组件协调工具
    └── utilsGlobal.ts              # 全局工具函数
```

## 🎯 组件区域说明

### HeaderArea - 头部导航区域
负责页面头部导航栏（取消/标题/保存）的展示和交互。

### TypeSelectionArea - 活动类型选择区域  
提供6种活动类型的图标化选择功能。

### FormInputArea - 表单输入区域
包含标题、正文、系数项的完整表单输入功能。

### AgreementArea - 约定项设置区域
提供时间、地点、定价、人数、截止时间的完整设置功能。

### PaymentArea - 支付确认区域
处理支付确认弹窗和支付验证流程。

## 📋 使用方式

```typescript
import { GroupPublishScreen } from './src/screens/group-publish';

// 在导航中使用
<Stack.Screen 
  name="PublishGroup" 
  component={GroupPublishScreen}
  options={{
    headerShown: false,
    presentation: 'modal',
    animation: 'slide_from_bottom',
  }}
/>
```

## 🔧 开发规范

### 八段式代码结构
所有 `index.tsx` 文件必须遵循八段式结构：
1. File Banner & TOC
2. Imports  
3. Types & Schema
4. Constants & Config
5. Utils & Helpers
6. State Management
7. Domain Logic  
8. UI Components & Rendering
9. Exports

### 命名规范
- 组件区域：使用功能描述 + Area 后缀
- 功能区域：使用具体功能名称
- 文件命名：遵循 camelCase 或 PascalCase

### 职责分离
- 每个区域职责单一明确
- 状态管理统一在页面级
- 工具函数按功能分类
- API接口与数据处理分离

---

**版本**: 1.0.0  
**创建日期**: 2024年12月19日  
**架构标准**: 通用组件架构核心标准 v2.0.0  
**复杂度等级**: ★★★★