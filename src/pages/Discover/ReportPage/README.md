# 🚨 ReportPage - 举报页面模块

> **基于通用组件模块化架构核心标准实现的举报页面**

---

## 📋 模块概览

举报页面是 Discover 页面组的子功能页面，提供完整的内容举报功能，包括举报类型选择、描述输入、图片上传和提交确认等功能。

### 🎯 核心功能

- **举报类型选择** - 8种举报类型的网格卡片选择
- **描述输入** - 支持最大200字的多行文本输入
- **图片上传** - 支持相机拍照和相册选择，最多3张图片
- **提交确认** - 双层弹窗确认机制，防止误操作
- **成功反馈** - 带触觉反馈的成功提示弹窗

---

## 🏗️ 架构结构

```
src/pages/Discover/ReportPage/
├── index.tsx                           # 📱 主页面组件
├── types.ts                           # 📋 类型定义
├── constants.ts                       # ⚙️ 常量配置
├── README.md                          # 📖 文档说明
│
├── ReportTypeSelectionArea/           # ✅ 举报类型选择区域
│   └── index.tsx                      # 2列网格布局的类型卡片选择
├── DescriptionInputArea/              # ✅ 描述输入区域
│   └── index.tsx                      # 多行文本输入框 + 字数统计
├── ImageUploadArea/                   # ✅ 图片上传区域
│   └── index.tsx                      # 相机/相册选择 + 图片管理
├── SubmitConfirmModal/                # ✅ 提交确认弹窗
│   └── index.tsx                      # 双按钮确认对话框
└── SuccessModal/                      # ✅ 成功反馈弹窗
    └── index.tsx                      # 成功消息 + 触觉反馈
```

---

## 🎨 设计特色

### 📱 视觉设计
- **极简风格** - 白色背景 + 紫色主色调
- **网格布局** - 2列均匀分布的举报类型卡片
- **状态反馈** - 选中/未选中状态的清晰视觉区分
- **圆润设计** - 12px卡片圆角 + 20px按钮圆角

### 🎯 交互设计
- **单选模式** - 举报类型只能选择一个
- **实时验证** - 字数统计、图片数量限制
- **双层确认** - 提交确认 → 成功反馈弹窗
- **触觉反馈** - iOS Haptic Feedback + Android Vibration

### 🔧 技术亮点
- **渐变动画** - 输入框聚焦的边框颜色渐变
- **弹窗管理** - 完整的弹窗显示/隐藏动画
- **图片处理** - 自动压缩和格式转换
- **错误处理** - 完整的网络和权限错误处理

---

## 🚀 使用指南

### 💻 基础使用

```tsx
import { ReportPage } from '@/pages/Discover/ReportPage';

// 在导航器中使用
<Stack.Screen 
  name="ReportPage" 
  component={ReportPage}
  options={{
    headerShown: false, // 使用自定义导航栏
  }}
/>

// 导航到举报页面
navigation.navigate('ReportPage', {
  targetId: 'post_123',
  targetType: 'post',
  reportContext: 'discover_main',
});
```

### 🔧 组件配置

```tsx
// constants.ts 中的主要配置
export const FORM_CONFIG = {
  MAX_DESCRIPTION_LENGTH: 200,    // 描述最大字符数
  MAX_IMAGES: 3,                  // 最大图片数量
  MAX_IMAGE_SIZE: 10 * 1024 * 1024, // 最大图片大小 10MB
  IMAGE_QUALITY: 0.8,             // 图片压缩质量
};

// 举报类型配置
export const REPORT_TYPE_OPTIONS = [
  { type: ReportType.HARASSMENT, label: '辱骂引战' },
  { type: ReportType.INAPPROPRIATE, label: '色情低俗' },
  // ... 更多类型
];
```

### 📡 API 集成

```tsx
// 提交举报的API调用示例
const submitReport = async (formData: ReportFormData) => {
  try {
    const response = await fetch('/api/reports/submit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        targetId: route.params?.targetId,
        targetType: route.params?.targetType,
        reportType: formData.selectedType,
        description: formData.description,
        images: formData.images,
      }),
    });
    
    return await response.json();
  } catch (error) {
    throw new Error('提交失败');
  }
};
```

---

## 🎛️ 配置选项

### 🏷️ 举报类型选项

| 类型值 | 显示名称 | 描述 |
|-------|----------|------|
| `harassment` | 辱骂引战 | 包含恶意辱骂、挑衅、引发争论的内容 |
| `inappropriate` | 色情低俗 | 包含色情、低俗、不雅的内容 |
| `fraud` | 诈骗 | 涉及金融诈骗、虚假交易等诈骗行为 |
| `illegal` | 违法犯罪 | 涉及违法犯罪活动的内容 |
| `fake_info` | 不实信息 | 传播虚假信息、谣言等不实内容 |
| `minors` | 未成年人相关 | 涉及未成年人不当内容或安全问题 |
| `disturbing` | 内容引人不适 | 令人感到不适、恶心或恐惧的内容 |
| `other` | 其他 | 其他不符合社区规范的内容 |

### 🎨 UI 配置

```tsx
export const UI_CONSTANTS = {
  COLORS: {
    PRIMARY: '#8A2BE2',           // 主紫色
    PRIMARY_LIGHT: '#9370DB',     // 浅紫色
    BACKGROUND: '#FFFFFF',        // 背景白色
    TEXT_PRIMARY: '#333333',      // 主文字颜色
    TEXT_SECONDARY: '#666666',    // 次要文字颜色
    TEXT_PLACEHOLDER: '#999999',  // 占位符颜色
    BORDER: '#E5E5E5',           // 边框颜色
    BORDER_ACTIVE: '#8A2BE2',    // 激活边框颜色
    INPUT_BACKGROUND: '#F5F5F5',  // 输入框背景
    ERROR: '#FF4444',            // 错误颜色
  },
  SIZES: {
    HEADER_HEIGHT: 56,           // 导航栏高度
    CARD_BORDER_RADIUS: 12,      // 卡片圆角
    BUTTON_BORDER_RADIUS: 20,    // 按钮圆角
    INPUT_BORDER_RADIUS: 12,     // 输入框圆角
    MODAL_BORDER_RADIUS: 16,     // 弹窗圆角
  },
};
```

---

## 🔧 开发指南

### 📁 文件组织原则

1. **八段式代码结构** - 所有主组件文件都按照八段式标准组织
2. **职责单一** - 每个组件区域负责单一功能
3. **类型安全** - 完整的 TypeScript 类型定义
4. **常量外置** - 所有配置项统一管理

### 🧪 测试要点

- **表单验证** - 测试各种输入组合的验证逻辑
- **图片上传** - 测试不同格式和大小的图片处理
- **弹窗交互** - 测试弹窗的显示/隐藏动画
- **错误处理** - 测试网络异常和权限错误场景

### 🔍 调试建议

```tsx
// 开启调试模式
const DEBUG_MODE = __DEV__ && false;

if (DEBUG_MODE) {
  console.log('Report form data:', formData);
  console.log('Validation result:', isValid);
}
```

---

## 🚀 扩展功能

### 🔮 未来增强

1. **多媒体支持** - 支持视频文件上传
2. **批量举报** - 支持一次举报多个内容
3. **举报历史** - 查看用户的举报记录
4. **智能推荐** - 基于内容智能推荐举报类型
5. **实时审核** - 集成内容审核API实时检测

### 🔌 扩展接口

```tsx
// 扩展的举报页面Props
interface ExtendedReportPageProps extends ReportPageProps {
  autoSelectType?: ReportType;     // 自动选择类型
  hiddenTypes?: ReportType[];      // 隐藏特定类型
  customValidator?: (data: ReportFormData) => boolean;
  onSubmitSuccess?: (reportId: string) => void;
  onSubmitError?: (error: Error) => void;
}
```

---

## 📊 性能优化

### ⚡ 优化策略

1. **懒加载** - 弹窗组件按需加载
2. **图片压缩** - 自动压缩上传图片
3. **内存管理** - 及时清理动画和定时器
4. **网络优化** - 请求防抖和重试机制

### 📈 性能指标

- **页面加载时间** < 500ms
- **图片上传时间** < 3s (1MB图片)
- **表单提交时间** < 2s
- **动画帧率** > 60fps

---

## 🔗 相关链接

- [通用组件模块化架构核心标准](../../../.cursor/rules/UNIVERSAL_COMPONENT_ARCHITECTURE_CORE.md)
- [Discover 页面组文档](../README.md)
- [图片选择器文档](https://github.com/react-native-image-picker/react-native-image-picker)
- [React Navigation 文档](https://reactnavigation.org/)

---

*基于通用组件模块化架构核心标准 v2.2 | 遵循八段式代码结构 | 支持完整用户体验流程*
