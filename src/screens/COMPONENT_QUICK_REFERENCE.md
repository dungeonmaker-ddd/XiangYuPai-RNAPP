# 组件架构快速参考

## 📁 标准目录结构
```
ComponentName/
├── index.tsx                           # 主组件
├── types.ts                            # 类型定义
├── constants.ts                        # 常量定义
├── use[ComponentName][Feature].ts      # 具名 Hooks
├── on[ComponentName][Action].ts        # 具名事件处理器
├── navigateTo[Target].ts              # 具名导航事件
└── README.md                          # 组件文档
```

## 📋 命名规范速查

| 文件类型 | 命名格式 | 示例 |
|---------|---------|------|
| **主组件** | `index.tsx` | `index.tsx` |
| **类型定义** | `types.ts` | `types.ts` |
| **常量定义** | `constants.ts` | `constants.ts` |
| **Hooks** | `use[ComponentName][Feature].ts` | `useWaterfallCard.ts` |
| **事件处理器** | `on[ComponentName][Action].ts` | `onWaterfallCardPress.ts` |
| **导航事件** | `navigateTo[Target].ts` | `navigateToCardDetail.ts` |

## 🚀 快速创建命令

```bash
# 创建新组件目录
mkdir ComponentName && cd ComponentName

# 创建基础文件
touch index.tsx types.ts constants.ts README.md

# 创建 Hook 文件
touch useComponentName.ts

# 创建事件处理器
touch onComponentNamePress.ts

# 创建导航事件
touch navigateToTarget.ts
```

## 📝 常用代码片段

### 基础 Props 接口
```typescript
export interface ComponentNameProps {
  // 必需属性
  data: any;
  onPress: () => void;
  
  // 可选属性
  style?: ViewStyle;
  disabled?: boolean;
  
  // 导航相关
  navigation?: any;
  analytics?: any;
  showToast?: (message: string) => void;
}
```

### Hook 基础结构
```typescript
export const useComponentName = (props: ComponentNameProps) => {
  const [state, setState] = useState(initialState);
  
  const handleAction = useCallback(() => {
    // 逻辑处理
  }, []);
  
  return { state, handleAction };
};
```

### 事件处理器基础结构
```typescript
export const onComponentNameAction = (props: ComponentNameProps) => {
  const { analytics, showToast } = props;
  
  try {
    analytics?.track('event_name', {});
    // 执行逻辑
    console.log('ComponentName: Action 执行成功');
  } catch (error) {
    console.error('ComponentName: Action 执行失败', error);
    showToast?.('操作失败，请重试');
  }
};
```

### 导航事件基础结构
```typescript
export const navigateToTarget = async (params: NavigateToTargetParams): Promise<boolean> => {
  try {
    console.log('NavigationEvent: 准备跳转到目标页面', params);
    (params.navigation as any).navigate('TargetScreen', params);
    return true;
  } catch (error) {
    console.error('NavigationEvent: 跳转失败', error);
    params.showToast?.('跳转失败，请重试');
    return false;
  }
};
```

## ✅ 检查清单

### 创建新组件时
- [ ] 创建组件目录
- [ ] 添加 `index.tsx` 主组件文件
- [ ] 添加 `types.ts` 类型定义
- [ ] 添加 `constants.ts`（如需要）
- [ ] 添加具名 Hook 文件（如需要）
- [ ] 添加具名事件处理器（如需要）
- [ ] 添加具名导航事件（如需要）
- [ ] 编写 `README.md` 文档

### 重构现有组件时
- [ ] 分析组件功能和职责
- [ ] 创建新的目录结构
- [ ] 拆分类型定义到 `types.ts`
- [ ] 提取常量到 `constants.ts`
- [ ] 拆分业务逻辑到具名 Hook
- [ ] 拆分事件处理到具名处理器
- [ ] 拆分导航逻辑到具名导航事件
- [ ] 更新主组件文件
- [ ] 更新外部引用
- [ ] 测试功能完整性

## 🎯 最佳实践提醒

1. **文件名要具名化** - 避免通用名称
2. **保持单一职责** - 一个文件只做一件事
3. **添加详细注释** - 解释设计思路
4. **提供类型安全** - 完整的 TypeScript 类型
5. **统一错误处理** - 一致的错误处理模式
6. **编写使用文档** - README.md 说明用法
