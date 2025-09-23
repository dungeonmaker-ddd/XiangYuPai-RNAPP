# 发现主页面集成示例

本文档展示如何在项目中集成和使用发现主页面模块。

## 🚀 快速集成

### 1. 基础导入

```typescript
import { DiscoverMainPage, DiscoverTabType } from '@/pages/Discover';
```

### 2. 在导航中集成

```typescript
// React Navigation 集成示例
import { createStackNavigator } from '@react-navigation/stack';
import { DiscoverMainPage } from '@/pages/Discover';

const Stack = createStackNavigator();

function DiscoverStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen 
        name="DiscoverMain" 
        component={DiscoverMainPage}
        initialParams={{ initialTab: 'hot' }}
      />
    </Stack.Navigator>
  );
}
```

### 3. 在底部Tab中使用

```typescript
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

const Tab = createBottomTabNavigator();

function MainTabNavigator() {
  return (
    <Tab.Navigator>
      <Tab.Screen 
        name="发现" 
        component={DiscoverMainPage}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Icon name="search" size={size} color={color} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}
```

## 🔧 自定义配置

### 1. 完整Props配置

```typescript
import { DiscoverMainPage, DiscoverTabType } from '@/pages/Discover';

function MyDiscoverPage() {
  return (
    <DiscoverMainPage
      // 初始Tab设置
      initialTab={DiscoverTabType.HOT}
      
      // Tab切换回调
      onTabChange={(tab) => {
        console.log('用户切换到Tab:', tab);
        // 可以在这里添加埋点统计
        analytics.track('discover_tab_switch', { tab });
      }}
      
      // 内容点击处理
      onContentPress={(content) => {
        console.log('用户点击内容:', content.id);
        navigation.navigate('ContentDetail', { 
          contentId: content.id,
          content: content 
        });
      }}
      
      // 用户点击处理
      onUserPress={(user) => {
        console.log('用户点击用户:', user.id);
        navigation.navigate('UserProfile', { 
          userId: user.id,
          user: user 
        });
      }}
      
      // 拍摄按钮处理
      onCameraPress={() => {
        console.log('用户点击拍摄');
        navigation.navigate('CameraScreen');
      }}
    />
  );
}
```

### 2. 结合状态管理

```typescript
import { useDiscoverStore } from '@/stores/discoverStore';

function DiscoverPageWithStore() {
  const { 
    currentTab, 
    setCurrentTab,
    contentList,
    isLoading 
  } = useDiscoverStore();

  return (
    <DiscoverMainPage
      initialTab={currentTab}
      onTabChange={setCurrentTab}
      onContentPress={(content) => {
        // 更新最近查看历史
        useDiscoverStore.getState().addToHistory(content);
        navigation.navigate('ContentDetail', { content });
      }}
    />
  );
}
```

## 📱 响应式布局

### 1. 处理不同屏幕尺寸

```typescript
import { Dimensions } from 'react-native';

function ResponsiveDiscoverPage() {
  const screenWidth = Dimensions.get('window').width;
  const isTablet = screenWidth > 768;

  return (
    <View style={{ flex: 1 }}>
      {isTablet ? (
        // 平板布局：侧边栏 + 主内容
        <View style={{ flexDirection: 'row' }}>
          <View style={{ width: 300 }}>
            <SidebarComponent />
          </View>
          <View style={{ flex: 1 }}>
            <DiscoverMainPage />
          </View>
        </View>
      ) : (
        // 手机布局：全屏显示
        <DiscoverMainPage />
      )}
    </View>
  );
}
```

### 2. 横屏适配

```typescript
import { useDeviceOrientation } from '@react-native-community/hooks';

function OrientationAwareDiscoverPage() {
  const orientation = useDeviceOrientation();

  return (
    <DiscoverMainPage
      style={{
        paddingHorizontal: orientation.landscape ? 60 : 16,
      }}
    />
  );
}
```

## 🎨 主题定制

### 1. 自定义颜色主题

```typescript
import { ThemeProvider } from '@/contexts/ThemeContext';

const customTheme = {
  colors: {
    primary: '#FF6B6B',     // 自定义主色
    hotColor: '#FF8E53',    // 自定义热门色
    followColor: '#4ECDC4', // 自定义关注色
    localColor: '#45B7D1',  // 自定义同城色
  },
};

function ThemedDiscoverPage() {
  return (
    <ThemeProvider theme={customTheme}>
      <DiscoverMainPage />
    </ThemeProvider>
  );
}
```

### 2. 深色模式支持

```typescript
import { useColorScheme } from 'react-native';

function DarkModeDiscoverPage() {
  const colorScheme = useColorScheme();
  
  return (
    <View 
      style={{
        flex: 1,
        backgroundColor: colorScheme === 'dark' ? '#1a1a1a' : '#ffffff'
      }}
    >
      <DiscoverMainPage />
    </View>
  );
}
```

## 🔌 API集成

### 1. 替换模拟数据

```typescript
import { useDiscoverAPI } from '@/hooks/useDiscoverAPI';

function APIIntegratedDiscoverPage() {
  const { 
    fetchHotContent,
    fetchFollowContent,
    fetchLocalContent,
    likeContent 
  } = useDiscoverAPI();

  // 自定义数据获取逻辑
  const handleLoadMore = async (tab: DiscoverTabType) => {
    switch (tab) {
      case 'hot':
        return await fetchHotContent();
      case 'follow':
        return await fetchFollowContent();
      case 'local':
        return await fetchLocalContent();
    }
  };

  return (
    <DiscoverMainPage
      // 可以通过Props传入自定义数据
      contentLoader={handleLoadMore}
      onLike={likeContent}
    />
  );
}
```

### 2. 错误处理

```typescript
import { ErrorBoundary } from 'react-error-boundary';

function ErrorFallback({ error, resetErrorBoundary }) {
  return (
    <View style={styles.errorContainer}>
      <Text style={styles.errorTitle}>发现页面加载失败</Text>
      <Text style={styles.errorMessage}>{error.message}</Text>
      <TouchableOpacity 
        style={styles.retryButton}
        onPress={resetErrorBoundary}
      >
        <Text style={styles.retryText}>重试</Text>
      </TouchableOpacity>
    </View>
  );
}

function SafeDiscoverPage() {
  return (
    <ErrorBoundary
      FallbackComponent={ErrorFallback}
      onError={(error, errorInfo) => {
        console.log('发现页面错误:', error, errorInfo);
        // 错误上报
        crashlytics.recordError(error);
      }}
    >
      <DiscoverMainPage />
    </ErrorBoundary>
  );
}
```

## 📊 数据埋点

### 1. 用户行为追踪

```typescript
import { analytics } from '@/utils/analytics';

function AnalyticsDiscoverPage() {
  React.useEffect(() => {
    // 页面访问埋点
    analytics.track('discover_page_view', {
      timestamp: Date.now(),
      source: 'bottom_tab'
    });
  }, []);

  return (
    <DiscoverMainPage
      onTabChange={(tab) => {
        analytics.track('discover_tab_switch', {
          tab,
          timestamp: Date.now()
        });
      }}
      
      onContentPress={(content) => {
        analytics.track('discover_content_click', {
          contentId: content.id,
          contentType: content.type,
          authorId: content.author.id,
          timestamp: Date.now()
        });
      }}
    />
  );
}
```

### 2. 性能监控

```typescript
import { performance } from '@/utils/performance';

function PerformanceMonitoredDiscoverPage() {
  React.useEffect(() => {
    const startTime = performance.now();
    
    return () => {
      const endTime = performance.now();
      const loadTime = endTime - startTime;
      
      analytics.track('discover_page_performance', {
        loadTime,
        timestamp: Date.now()
      });
    };
  }, []);

  return <DiscoverMainPage />;
}
```

## 🧪 测试示例

### 1. 单元测试

```typescript
// __tests__/DiscoverMainPage.test.tsx
import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { DiscoverMainPage } from '@/pages/Discover';

describe('DiscoverMainPage', () => {
  it('should render three tabs correctly', () => {
    const { getByText } = render(<DiscoverMainPage />);
    
    expect(getByText('热门')).toBeTruthy();
    expect(getByText('关注')).toBeTruthy();
    expect(getByText('同城')).toBeTruthy();
  });

  it('should call onTabChange when tab is pressed', () => {
    const mockOnTabChange = jest.fn();
    const { getByText } = render(
      <DiscoverMainPage onTabChange={mockOnTabChange} />
    );
    
    fireEvent.press(getByText('关注'));
    expect(mockOnTabChange).toHaveBeenCalledWith('follow');
  });
});
```

### 2. 集成测试

```typescript
// __tests__/DiscoverIntegration.test.tsx
import React from 'react';
import { render, waitFor } from '@testing-library/react-native';
import { NavigationContainer } from '@react-navigation/native';
import { DiscoverMainPage } from '@/pages/Discover';

describe('Discover Integration', () => {
  it('should navigate to content detail on content press', async () => {
    const mockNavigate = jest.fn();
    const navigation = { navigate: mockNavigate };
    
    const { getByTestId } = render(
      <NavigationContainer>
        <DiscoverMainPage 
          onContentPress={(content) => 
            navigation.navigate('ContentDetail', { content })
          }
        />
      </NavigationContainer>
    );
    
    const contentCard = getByTestId('content-card-0');
    fireEvent.press(contentCard);
    
    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('ContentDetail', 
        expect.objectContaining({
          content: expect.any(Object)
        })
      );
    });
  });
});
```

## 📝 最佳实践

### 1. 内存管理
```typescript
// 在组件卸载时清理资源
React.useEffect(() => {
  return () => {
    // 清理图片缓存
    ImageCache.clear();
    // 取消进行中的网络请求
    ApiClient.cancelPendingRequests();
  };
}, []);
```

### 2. 网络优化
```typescript
// 预加载策略
const preloadNextPageContent = useCallback(async () => {
  try {
    await ApiClient.preload('/discover/hot', { page: currentPage + 1 });
  } catch (error) {
    console.log('预加载失败:', error);
  }
}, [currentPage]);
```

### 3. 用户体验优化
```typescript
// 骨架屏加载状态
const LoadingSkeleton = () => (
  <View style={styles.skeletonContainer}>
    {Array.from({ length: 6 }).map((_, index) => (
      <SkeletonCard key={index} />
    ))}
  </View>
);
```

---

**维护者**: 开发团队  
**更新时间**: 2024年9月23日  
**版本**: 1.0.0
