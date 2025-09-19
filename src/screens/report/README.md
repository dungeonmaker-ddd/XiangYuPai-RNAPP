# 📋 举报模块 (Report Module)

> **基于纯结构架构图标准模板的举报系统完整实现**

## 📊 **模块概览**

### 🎯 **核心功能**
- **举报类型选择**：8种预设举报类型，单选模式
- **举报描述输入**：200字限制的多行文本输入
- **图片证据上传**：支持拍照和相册选择，最多9张图片
- **表单验证**：实时验证和提交前验证双重保障
- **提交确认**：确认对话框防止误操作

### 🏗️ **技术架构**
- **页面层级**：主页面 + 预览弹窗 + 确认对话框
- **状态管理**：表单验证状态 + 图片上传状态 + 提交状态
- **数据服务**：举报API + 图片上传 + 内容审核
- **用户体验**：实时反馈 + 动画效果 + 错误处理

---

## 📂 **目录结构**

```
src/screens/report/
├── ReportScreen.tsx              # 主页面组件
├── components/                   # 子组件目录
│   ├── ReportTypeSelector.tsx    # 举报类型选择器
│   ├── ReportDescriptionInput.tsx # 描述输入组件
│   ├── ImageUploader.tsx         # 图片上传组件
│   ├── SubmitConfirmModal.tsx    # 提交确认弹窗
│   └── index.ts                  # 组件导出索引
├── events/                       # 事件处理目录
│   ├── onReportTypeSelect.ts     # 类型选择事件
│   ├── onDescriptionChange.ts    # 描述变化事件
│   ├── onImageUpload.ts          # 图片上传事件
│   ├── onReportSubmit.ts         # 提交事件
│   └── index.ts                  # 事件导出索引
├── hooks/                        # Hooks目录
│   ├── useReportData.ts          # 数据管理Hook
│   └── index.ts                  # Hook导出索引
├── services/                     # 服务目录
│   ├── ReportService.ts          # 举报服务类
│   └── index.ts                  # 服务导出索引
├── types.ts                      # 类型定义
├── constants.ts                  # 常量配置
├── index.ts                      # 模块总导出
└── README.md                     # 模块文档
```

---

## 🎨 **设计标准**

### 📱 **UI设计规范**
- **色彩系统**：主色紫色#8A2BE2，辅助色灰色#666666，错误色红色#FF4444
- **字体规范**：PingFang SC，标题18sp粗体，正文16sp常规，辅助文字14sp
- **圆角标准**：卡片12px，按钮8px，图片容器12px
- **间距系统**：16px基础间距，24px区域间距，32px大区域间距

### 🔧 **交互设计**
- **状态反馈**：0.2s动画时长，按钮点击缩放效果，颜色过渡动画
- **表单验证**：实时验证 + 提交前验证，错误状态红色提示
- **图片上传**：支持拍照和相册，最多9张，自动压缩优化
- **确认机制**：重要操作二次确认，防止误操作

### 🛡️ **安全设计**
- **内容审核**：提交前预审核，敏感词过滤
- **防刷机制**：限制举报频率，识别恶意行为
- **数据加密**：敏感信息加密传输和存储
- **权限控制**：相机和相册权限管理

---

## 🚀 **使用方法**

### 📋 **基础使用**
```typescript
import { ReportScreen } from '@/screens/report';

// 在导航中使用
navigation.navigate('ReportScreen', {
  targetId: 'user_123',
  targetType: 'user',
  targetTitle: '用户名称',
});
```

### 🎯 **组件单独使用**
```typescript
import {
  ReportTypeSelector,
  ReportDescriptionInput,
  ImageUploader,
} from '@/screens/report';

// 举报类型选择器
<ReportTypeSelector
  reportTypes={reportTypes}
  selectedType={selectedType}
  onTypeSelect={handleTypeSelect}
/>

// 描述输入组件
<ReportDescriptionInput
  value={description}
  onChangeText={handleDescriptionChange}
  maxLength={200}
/>

// 图片上传组件
<ImageUploader
  images={images}
  onImagesChange={handleImagesChange}
  maxImages={9}
/>
```

### 🔧 **Hook使用**
```typescript
import { useReportData } from '@/screens/report';

const MyComponent = () => {
  const { reportTypes, isLoading, error, refreshReportTypes } = useReportData();
  
  // 使用数据...
};
```

### 📡 **服务调用**
```typescript
import { ReportService } from '@/screens/report';

// 提交举报
const result = await ReportService.submitReport({
  type: 'harassment',
  description: '举报描述',
  images: ['image1.jpg', 'image2.jpg'],
  targetId: 'target_123',
  targetType: 'user',
  timestamp: Date.now(),
});

// 获取举报类型
const reportTypes = await ReportService.getReportTypes();
```

---

## ⚙️ **配置选项**

### 📊 **基础配置**
```typescript
import { REPORT_CONFIG } from '@/screens/report';

// 修改配置
const customConfig = {
  ...REPORT_CONFIG,
  maxDescriptionLength: 500,
  maxImages: 5,
};
```

### 🎨 **主题配置**
```typescript
import { THEME_COLORS } from '@/screens/report';

// 自定义主题
const customTheme = {
  ...THEME_COLORS,
  primary: '#FF5722',
  error: '#E91E63',
};
```

### 🔧 **验证规则**
```typescript
import { VALIDATION_RULES } from '@/screens/report';

// 自定义验证规则
const customRules = {
  ...VALIDATION_RULES,
  description: {
    minLength: 10,
    maxLength: 300,
    required: true,
  },
};
```

---

## 🧪 **测试支持**

### 📋 **测试ID**
```typescript
import { TEST_IDS } from '@/screens/report';

// 使用测试ID
<TouchableOpacity testID={TEST_IDS.submitButton}>
  <Text>提交</Text>
</TouchableOpacity>
```

### 🔍 **单元测试示例**
```typescript
import { getFormValidation, canSubmitReport } from '@/screens/report';

describe('Report Form Validation', () => {
  it('should validate form data correctly', () => {
    const formData = {
      selectedType: { id: 'harassment', label: '辱骂引战' },
      description: '测试描述',
      images: [],
    };
    
    const validation = getFormValidation(formData);
    expect(validation.isValid).toBe(true);
  });
});
```

---

## 📈 **性能优化**

### ⚡ **优化策略**
- **组件懒加载**：大型组件按需加载
- **图片压缩**：自动压缩和格式优化
- **缓存机制**：举报类型数据缓存5分钟
- **防抖处理**：输入事件防抖处理

### 📊 **内存管理**
- **及时清理**：组件卸载时清理监听器
- **图片释放**：及时释放图片资源
- **状态重置**：页面离开时重置状态

---

## 🔧 **开发指南**

### 📝 **代码规范**
- **8段式结构**：严格按照8段式编码逻辑
- **类型安全**：完整的TypeScript类型定义
- **错误处理**：完善的错误边界和异常处理
- **注释规范**：详细的JSDoc注释

### 🚀 **扩展开发**
- **新增举报类型**：在constants.ts中添加新类型
- **自定义验证**：扩展验证规则和错误消息
- **主题定制**：修改主题配置实现个性化
- **API扩展**：在ReportService中添加新接口

---

## 📋 **API文档**

### 🔗 **接口列表**
- `POST /reports` - 提交举报
- `GET /reports/types` - 获取举报类型
- `POST /upload/images` - 上传图片
- `GET /reports/{reportId}/status` - 查询举报状态

### 📊 **数据格式**
```typescript
// 提交举报请求
interface SubmitReportRequest {
  type: string;
  description: string;
  images: string[];
  targetId: string;
  targetType: string;
  timestamp: number;
}

// 提交举报响应
interface SubmitReportResponse {
  reportId: string;
  message: string;
  status: 'success';
  timestamp: number;
}
```

---

## 🐛 **故障排除**

### ❓ **常见问题**
1. **图片上传失败** - 检查图片格式和大小限制
2. **提交超时** - 检查网络连接和服务器状态
3. **验证失败** - 检查表单数据格式和必填项
4. **权限问题** - 检查相机和相册访问权限

### 🔧 **调试技巧**
- **开发模式日志**：__DEV__环境下查看详细日志
- **网络请求监控**：使用网络调试工具监控API调用
- **状态调试**：使用React DevTools查看组件状态
- **性能分析**：使用Flipper进行性能分析

---

**📝 文档版本**：v1.0  
**🗓️ 创建时间**：2024年12月  
**👥 适用团队**：产品、设计、开发、测试  
**🎯 应用场景**：移动端举报功能完整实现
