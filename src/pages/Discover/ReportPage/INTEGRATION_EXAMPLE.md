# 🚀 ReportPage 集成使用示例

> **展示如何在 Discover 页面组中集成和使用举报页面**

---

## 📱 基础导航使用

### 1. 从发现主页面导航到举报页面

```tsx
// 在 DiscoverMainPage 组件中
import { navigateDiscoverFlow } from '../navigateDiscoverFlow';

const handleReportContent = (postId: string) => {
  // 举报内容
  navigateDiscoverFlow.reportContent(postId, 'discover_main');
};

const handleReportUser = (userId: string) => {
  // 举报用户
  navigateDiscoverFlow.reportUser(userId, 'discover_main');
};

// 在渲染中使用
<TouchableOpacity onPress={() => handleReportContent('post_123')}>
  <Text>举报此内容</Text>
</TouchableOpacity>
```

### 2. 从详情页面导航到举报页面

```tsx
// 在 DiscoverDetailPage 组件中
import { navigateDiscoverFlow } from '../navigateDiscoverFlow';

const handleReportComment = (commentId: string) => {
  // 举报评论
  navigateDiscoverFlow.reportComment(commentId, 'discover_detail');
};

// 使用内容交互处理器
const handleContentAction = (action: string, postId: string) => {
  navigateDiscoverFlow.handleContentInteraction(
    action as any, 
    postId
  );
};
```

### 3. 直接使用导航API

```tsx
// 使用 React Navigation 直接导航
import { useNavigation } from '@react-navigation/native';
import type { RootStackParamList } from '../../../types/navigation';

const navigation = useNavigation<NavigationProp<RootStackParamList>>();

const navigateToReport = () => {
  navigation.navigate('DiscoverReport', {
    targetId: 'post_123',
    targetType: 'post',
    reportContext: 'custom_context',
  });
};
```

---

## 🔧 自定义配置使用

### 1. 自定义举报类型选项

```tsx
// 在 ReportPage/constants.ts 中修改
export const CUSTOM_REPORT_OPTIONS: ReportTypeOption[] = [
  {
    type: ReportType.HARASSMENT,
    label: '恶意骚扰',
    description: '包含恶意辱骂、骚扰等不当行为',
  },
  // 添加自定义类型...
];

// 在组件中使用自定义选项
<ReportTypeSelectionArea
  selectedType={selectedType}
  onTypeSelect={handleTypeSelect}
  options={CUSTOM_REPORT_OPTIONS} // 使用自定义选项
/>
```

### 2. 自定义表单配置

```tsx
// 修改表单限制
const CUSTOM_FORM_CONFIG = {
  maxDescriptionLength: 500, // 增加描述长度限制
  maxImages: 5, // 增加图片数量限制
  requireDescription: true, // 要求必填描述
};
```

### 3. 自定义UI样式

```tsx
// 在 constants.ts 中自定义颜色主题
export const CUSTOM_UI_THEME = {
  ...REPORT_CONSTANTS.UI,
  COLORS: {
    ...REPORT_CONSTANTS.UI.COLORS,
    PRIMARY: '#FF6B6B', // 自定义主色调
    PRIMARY_LIGHT: '#FF8E8E',
  },
};
```

---

## 🎯 高级功能集成

### 1. 集成自定义验证逻辑

```tsx
// 创建自定义验证函数
const customValidator = (data: ReportFormData): boolean => {
  // 自定义验证逻辑
  if (data.selectedType === ReportType.FRAUD && !data.description) {
    Alert.alert('提示', '举报诈骗类型需要详细描述');
    return false;
  }
  
  if (data.selectedType === ReportType.INAPPROPRIATE && data.images.length === 0) {
    Alert.alert('提示', '举报不当内容建议提供图片证据');
    return false;
  }
  
  return true;
};

// 在主页面中使用
const handleSubmitPress = () => {
  const formData = formatReportData(state);
  if (customValidator(formData) && validateForm(formData)) {
    updateState({ showConfirmModal: true });
  }
};
```

### 2. 集成分析统计

```tsx
// 添加分析事件追踪
import { REPORT_CONSTANTS } from './constants';

const trackReportEvent = (eventName: string, properties: Record<string, any>) => {
  // 集成你的分析服务
  Analytics.track(eventName, {
    ...properties,
    timestamp: Date.now(),
    page_source: 'discover_report',
  });
};

// 在组件中使用
const handleTypeSelect = (type: ReportType) => {
  updateState({ selectedType: type });
  
  // 追踪类型选择事件
  trackReportEvent(REPORT_CONSTANTS.ANALYTICS.EVENTS.TYPE_SELECT, {
    [REPORT_CONSTANTS.ANALYTICS.PROPERTIES.REPORT_TYPE]: type,
  });
};
```

### 3. 集成API服务

```tsx
// 创建举报API服务
class ReportService {
  static async submitReport(data: SubmitReportRequest): Promise<ReportSubmitResponse> {
    try {
      const response = await fetch('/api/reports/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${getAuthToken()}`,
        },
        body: JSON.stringify(data),
      });
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('举报提交失败:', error);
      throw error;
    }
  }
  
  static async uploadImage(imageUri: string): Promise<string> {
    const formData = new FormData();
    formData.append('image', {
      uri: imageUri,
      type: 'image/jpeg',
      name: 'report_image.jpg',
    } as any);
    
    const response = await fetch('/api/upload/image', {
      method: 'POST',
      headers: {
        'Content-Type': 'multipart/form-data',
        'Authorization': `Bearer ${getAuthToken()}`,
      },
      body: formData,
    });
    
    const result = await response.json();
    return result.imageUrl;
  }
}

// 在组件中使用
const handleConfirmSubmit = async () => {
  updateState({ showConfirmModal: false, isSubmitting: true });
  
  try {
    // 上传图片
    const uploadedImages = await Promise.all(
      state.images.map(uri => ReportService.uploadImage(uri))
    );
    
    // 提交举报
    const result = await ReportService.submitReport({
      targetId: route.params?.targetId || '',
      targetType: route.params?.targetType || 'post',
      reportType: state.selectedType!,
      description: state.description,
      images: uploadedImages,
    });
    
    if (result.success) {
      updateState({ isSubmitting: false, showSuccessModal: true });
    } else {
      throw new Error(result.message);
    }
  } catch (error) {
    updateState({ isSubmitting: false });
    Alert.alert('提交失败', error.message || '网络异常，请稍后重试');
  }
};
```

---

## 🧪 测试集成

### 1. 单元测试示例

```tsx
// __tests__/ReportPage.test.tsx
import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import { ReportPage } from '../ReportPage';

describe('ReportPage', () => {
  const mockRoute = {
    params: {
      targetId: 'test_post_123',
      targetType: 'post' as const,
      reportContext: 'test_context',
    },
  };
  
  it('应该正确渲染举报页面', () => {
    const { getByText, getByPlaceholderText } = render(
      <ReportPage route={mockRoute} />
    );
    
    expect(getByText('举报')).toBeTruthy();
    expect(getByText('请选择你要举报的类型')).toBeTruthy();
    expect(getByPlaceholderText('请描述你举报的原因')).toBeTruthy();
  });
  
  it('应该能够选择举报类型', () => {
    const { getByText } = render(<ReportPage route={mockRoute} />);
    
    const harassmentCard = getByText('辱骂引战');
    fireEvent.press(harassmentCard);
    
    // 验证选中状态
    expect(harassmentCard.parent).toHaveStyle({
      borderColor: '#8A2BE2',
    });
  });
  
  it('应该验证表单提交', async () => {
    const { getByText } = render(<ReportPage route={mockRoute} />);
    
    const submitButton = getByText('提交');
    fireEvent.press(submitButton);
    
    // 应该显示错误提示
    await waitFor(() => {
      expect(getByText('请选择举报类型')).toBeTruthy();
    });
  });
});
```

### 2. 集成测试示例

```tsx
// __tests__/ReportPageIntegration.test.tsx
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import { ReportPage } from '../ReportPage';

const Stack = createStackNavigator();

const TestNavigator = () => (
  <NavigationContainer>
    <Stack.Navigator>
      <Stack.Screen name="ReportPage" component={ReportPage} />
    </Stack.Navigator>
  </NavigationContainer>
);

describe('ReportPage Integration', () => {
  it('应该完成完整的举报流程', async () => {
    const { getByText, getByPlaceholderText } = render(<TestNavigator />);
    
    // 1. 选择举报类型
    fireEvent.press(getByText('辱骂引战'));
    
    // 2. 填写描述
    const descriptionInput = getByPlaceholderText('请描述你举报的原因');
    fireEvent.changeText(descriptionInput, '测试举报描述内容');
    
    // 3. 提交举报
    fireEvent.press(getByText('提交'));
    
    // 4. 确认提交
    await waitFor(() => {
      expect(getByText('确认提交举报？')).toBeTruthy();
    });
    
    fireEvent.press(getByText('确认提交'));
    
    // 5. 验证成功反馈
    await waitFor(() => {
      expect(getByText('已收到您的举报，我们会尽快处理')).toBeTruthy();
    });
  });
});
```

---

## 🚀 生产环境部署

### 1. 环境配置

```tsx
// config/report.config.ts
export const REPORT_CONFIG = {
  development: {
    apiBaseUrl: 'http://localhost:3000/api',
    enableDebugLogs: true,
    mockApiCalls: true,
  },
  production: {
    apiBaseUrl: 'https://api.yourapp.com',
    enableDebugLogs: false,
    mockApiCalls: false,
  },
};

// 在组件中使用
const config = REPORT_CONFIG[__DEV__ ? 'development' : 'production'];
```

### 2. 错误监控集成

```tsx
// 集成错误监控服务
import crashlytics from '@react-native-firebase/crashlytics';

const handleError = (error: Error, context: string) => {
  // 记录错误
  crashlytics().recordError(error);
  
  // 记录自定义属性
  crashlytics().setAttributes({
    component: 'ReportPage',
    context: context,
    timestamp: new Date().toISOString(),
  });
  
  // 在开发环境显示详细错误
  if (__DEV__) {
    console.error(`[ReportPage] ${context}:`, error);
  }
};
```

### 3. 性能监控

```tsx
// 性能监控集成
import perf from '@react-native-firebase/perf';

const usePerformanceTrace = (traceName: string) => {
  const trace = useRef<FirebasePerformanceTypes.Trace | null>(null);
  
  const startTrace = async () => {
    trace.current = perf().newTrace(traceName);
    await trace.current.start();
  };
  
  const stopTrace = async () => {
    if (trace.current) {
      await trace.current.stop();
    }
  };
  
  return { startTrace, stopTrace };
};

// 在组件中使用
const { startTrace, stopTrace } = usePerformanceTrace('report_page_load');

useEffect(() => {
  startTrace();
  
  return () => {
    stopTrace();
  };
}, []);
```

---

*基于通用组件模块化架构核心标准 | 完整集成指南 | 生产环境就绪*
