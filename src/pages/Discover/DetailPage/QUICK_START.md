# 🚀 快速集成指南

## 1️⃣ 路由配置

在你的主导航文件中添加详情页路由：

```typescript
// App.tsx 或 主导航文件
import { DiscoverDetailPage } from '@/screens/discover-detail';

const Stack = createStackNavigator();

function AppNavigator() {
  return (
    <Stack.Navigator>
      {/* 现有路由 */}
      
      {/* 添加详情页路由 */}
      <Stack.Screen 
        name="DiscoverDetail" 
        component={DiscoverDetailPage}
        options={{ 
          headerShown: false,
          presentation: 'modal',
        }}
      />
    </Stack.Navigator>
  );
}
```

## 2️⃣ 在发现页面中集成

修改你的 `DiscoverScreen.tsx`：

```typescript
// src/screens/discover/DiscoverScreen.tsx
const handleItemPress = (item: ContentItem) => {
  navigation.navigate('DiscoverDetail', {
    contentId: item.id,
    contentItem: item, // 可选：传递完整数据避免重复请求
  });
};

// 在WaterfallList中使用
<WaterfallList
  data={contentData}
  onItemPress={handleItemPress}
  // ... 其他props
/>
```

## 3️⃣ 修改瀑布流卡片

确保你的 `WaterfallCard` 支持点击：

```typescript
// src/screens/discover/components/WaterfallCard.tsx
const WaterfallCard = ({ item, onPress, ...props }) => {
  return (
    <TouchableOpacity onPress={() => onPress(item)}>
      {/* 卡片内容 */}
    </TouchableOpacity>
  );
};
```

## 4️⃣ 测试导航

现在你可以：
1. 在发现页面点击任意内容卡片
2. 自动导航到详情页面
3. 享受完整的详情页体验

## 🎯 功能特性

✅ **沉浸式全屏展示**  
✅ **双击放大缩小**  
✅ **实时点赞收藏**  
✅ **完整评论系统**  
✅ **手势交互支持**  
✅ **模态评论展示**  

## 🔧 自定义配置

如需自定义，可以：

```typescript
// 使用Hook进行自定义
import { useDiscoverDetail } from '@/screens/discover-detail';

const CustomDetailPage = ({ route }) => {
  const { contentId } = route.params;
  const {
    handleLike,
    handleComment,
    // ... 其他状态和方法
  } = useDiscoverDetail(contentId);
  
  // 自定义UI和逻辑
};
```

## 📱 完成！

现在你的应用就有了完整的详情页功能，完全基于原型图设计！
