# 🗃️ 发现页面数据管理系统

> **基于《纯结构架构图标准模板》的企业级数据管理解决方案**

## 📖 概述

这个数据管理系统将发现页面的数据逻辑完全独立出来，实现了**高内聚、低耦合**的架构设计，可以轻松地在其他模块中复用。

## 🏗️ 架构设计

### 📊 三层架构
```
【数据服务层】DiscoverDataService
    ↓
【状态管理层】useDiscoverData Hook  
    ↓
【UI组件层】DiscoverScreen / Other Components
```

### 🔧 核心组件

#### 1. **DiscoverDataService** - 数据服务层
- ✅ 单例模式，全局统一管理
- ✅ 内置缓存机制，提升性能
- ✅ 自动重试和错误处理
- ✅ 分页管理和数据持久化

#### 2. **useDiscoverData** - 状态管理Hook
- ✅ React状态与数据服务的桥接
- ✅ 乐观更新和回滚机制
- ✅ 自动刷新和生命周期管理
- ✅ 错误状态和重试逻辑

#### 3. **服务配置系统**
- ✅ 环境适配（开发/生产/测试）
- ✅ 灵活的配置选项
- ✅ 预设配置方案

## 🚀 使用方式

### 方式1: 使用React Hook（推荐）

```typescript
import { useDiscoverData } from '../services';

const MyComponent = () => {
  const {
    currentContent,
    currentLoading,
    switchTab,
    refreshContent,
    likeContent,
  } = useDiscoverData({
    initialTab: 'hot',
    enableCache: true,
    enableAutoRefresh: true,
  });

  return (
    <View>
      {currentContent.map(item => (
        <TouchableOpacity 
          key={item.id}
          onPress={() => likeContent(item.id)}
        >
          <Text>{item.title}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};
```

### 方式2: 直接使用API服务

```typescript
import { DiscoverAPI } from '../services';

const loadContent = async () => {
  try {
    const response = await DiscoverAPI.getContentList('hot', 1);
    console.log('获取到内容:', response.list);
  } catch (error) {
    console.error('加载失败:', error);
  }
};

// 点赞功能
const handleLike = async (itemId: string) => {
  try {
    await DiscoverAPI.likeContent(itemId);
    console.log('点赞成功');
  } catch (error) {
    console.error('点赞失败:', error);
  }
};
```

### 方式3: 配置化使用

```typescript
import { configureDiscoverServices, ServicePresets } from '../services';

// 使用预设配置
const config = configureDiscoverServices(ServicePresets.production);

// 或自定义配置
const customConfig = configureDiscoverServices({
  enableCache: true,
  cacheExpireTime: 10 * 60 * 1000, // 10分钟
  enableAutoRefresh: false,
});
```

## 📋 API参考

### DiscoverAPI方法

| 方法 | 参数 | 返回值 | 说明 |
|------|------|--------|------|
| `getContentList` | `(tabType, page?)` | `Promise<ContentListResponse>` | 获取内容列表 |
| `refreshContent` | `(tabType)` | `Promise<ContentListResponse>` | 刷新内容 |
| `loadMoreContent` | `(tabType)` | `Promise<ContentListResponse>` | 加载更多 |
| `likeContent` | `(itemId)` | `Promise<LikeResponse>` | 点赞内容 |
| `unlikeContent` | `(itemId)` | `Promise<LikeResponse>` | 取消点赞 |
| `clearCache` | `()` | `void` | 清除缓存 |
| `getCacheStats` | `()` | `Object` | 获取缓存统计 |

### useDiscoverData Hook

#### 配置选项
```typescript
interface UseDiscoverDataConfig {
  initialTab?: TabType;           // 初始Tab
  enableAutoRefresh?: boolean;    // 启用自动刷新
  autoRefreshInterval?: number;   // 自动刷新间隔(ms)
  enableCache?: boolean;          // 启用缓存
}
```

#### 返回值
```typescript
interface UseDiscoverDataReturn {
  // 状态数据
  state: DiscoverState;
  currentContent: ContentItem[];
  currentLoading: boolean;
  currentRefreshing: boolean;
  currentHasMore: boolean;
  
  // 操作函数
  switchTab: (tabType: TabType) => void;
  refreshContent: () => Promise<void>;
  loadMoreContent: () => Promise<void>;
  likeContent: (itemId: string) => Promise<void>;
  
  // 工具函数
  clearCache: () => void;
  getCacheStats: () => any;
  retryLastRequest: () => Promise<void>;
}
```

## 🔧 高级用法

### 1. 在其他模块中使用

```typescript
// 在用户页面中获取热门内容
import { DiscoverAPI } from '../../discover/services';

const UserProfileScreen = () => {
  const [userContent, setUserContent] = useState([]);

  useEffect(() => {
    // 复用发现页面的数据服务
    DiscoverAPI.getContentList('hot', 1)
      .then(response => setUserContent(response.list.slice(0, 5)))
      .catch(console.error);
  }, []);

  return (
    <View>
      <Text>用户相关的热门内容</Text>
      {/* 渲染内容 */}
    </View>
  );
};
```

### 2. 自定义缓存策略

```typescript
import { discoverDataService } from '../services';

// 配置更长的缓存时间
discoverDataService.updateConfig({
  enableCache: true,
  cacheExpireTime: 30 * 60 * 1000, // 30分钟
  maxRetryCount: 5,
});
```

### 3. 监听数据变化

```typescript
const MyComponent = () => {
  const { state, getCacheStats } = useDiscoverData();

  // 监听缓存变化
  useEffect(() => {
    const stats = getCacheStats();
    console.log('缓存状态更新:', stats);
  }, [state.content]);

  return <View>...</View>;
};
```

## 🎛️ 环境配置

### 开发环境
```typescript
import { ServicePresets, quickConfigure } from '../services';

// 开发环境：短缓存，自动刷新
quickConfigure('development');
```

### 生产环境
```typescript
// 生产环境：长缓存，无自动刷新
quickConfigure('production');
```

### 测试环境
```typescript
// 测试环境：无缓存，便于测试
quickConfigure('test');
```

## ⚡ 性能优化特性

### 1. **智能缓存**
- 基于时间的缓存失效
- 内存使用优化
- 自动清理机制

### 2. **乐观更新**
- 点赞等操作先更新UI
- 失败时自动回滚
- 用户体验优先

### 3. **错误处理**
- 自动重试机制
- 优雅降级
- 错误状态管理

### 4. **分页优化**
- 智能分页管理
- 数据去重
- 内存控制

## 🔄 数据流向

```
用户操作 → Hook状态管理 → 数据服务 → API调用 → 缓存更新 → UI更新
    ↑                                                           ↓
    └──────────── 乐观更新/错误回滚 ←──────────────────────────────┘
```

## 📊 监控与调试

### 开发调试
```typescript
const { getCacheStats } = useDiscoverData();

// 查看缓存统计
console.log(getCacheStats());

// 清除缓存重新测试
DiscoverAPI.clearCache();
```

### 性能监控
```typescript
// 可以集成性能监控
const startTime = Date.now();
await DiscoverAPI.getContentList('hot', 1);
console.log('API耗时:', Date.now() - startTime);
```

## 🎯 最佳实践

### 1. **Hook优先**
- 优先使用 `useDiscoverData` Hook
- 直接API调用仅用于特殊场景

### 2. **合理配置缓存**
- 生产环境启用长缓存
- 开发环境使用短缓存便于调试

### 3. **错误处理**
- 总是使用try-catch包裹API调用
- 为用户提供友好的错误提示

### 4. **性能考虑**
- 合理设置自动刷新间隔
- 及时清理不需要的缓存

## 🔮 扩展可能

这个数据管理系统的设计允许轻松扩展：

- ✅ 添加新的API端点
- ✅ 集成WebSocket实时更新
- ✅ 支持离线数据同步
- ✅ 添加数据分析和监控
- ✅ 集成推荐算法

---

*基于《纯结构架构图标准模板》设计 | 企业级数据管理解决方案*
