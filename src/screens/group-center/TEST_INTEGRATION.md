# 🧪 组局发布功能集成测试

## 快速测试步骤

### 1. 启动应用
```bash
# 确保所有依赖已安装
npm install

# 启动应用 (选择一个)
npm run android    # Android
npm run ios        # iOS  
npm start          # Metro bundler
```

### 2. 导航测试路径

```
应用启动
    ↓
主页面 (MainScreen)
    ↓ 点击底部导航或功能入口
组局中心页面 (GroupCenter)
    ↓ 点击右上角 "+ 发布组局" 按钮
组局发布页面 (PublishGroup) ← 新功能
    ↓ 完成发布流程
返回组局中心
```

### 3. 功能验证清单

#### ✅ 导航功能
- [ ] 从组局中心能够打开发布页面
- [ ] 发布页面以模态方式展示
- [ ] 页面从底部滑入动画正常
- [ ] 返回按钮功能正常
- [ ] 系统返回手势正常

#### ✅ 发布页面功能
- [ ] 活动类型选择器正常显示
- [ ] 6种活动类型都能正常选择
- [ ] 表单输入功能正常
- [ ] 字数统计实时更新
- [ ] 约定项设置弹窗能打开
- [ ] 支付确认弹窗能打开

#### ✅ 交互体验
- [ ] 按钮点击有反馈
- [ ] 动画效果流畅
- [ ] 表单验证提示清晰
- [ ] 错误处理友好

## 🔧 调试模式

### 启用详细日志
在 `GroupCenterScreen.tsx` 中：

```typescript
const handlePublishPress = useCallback(() => {
  console.log('🚀 [DEBUG] 点击发布按钮');
  console.log('🚀 [DEBUG] Navigation对象:', navigation);
  
  try {
    navigation?.navigate('PublishGroup');
    console.log('✅ [DEBUG] 导航调用成功');
  } catch (error) {
    console.error('❌ [DEBUG] 导航调用失败:', error);
  }
}, [navigation]);
```

### 检查导航配置
在 `AppNavigator.tsx` 中确认：

```typescript
// 确认这些导入存在
import { PublishGroupScreen } from '../screens/group-center/publish';

// 确认这个Screen配置存在
<Stack.Screen 
  name="PublishGroup" 
  component={PublishGroupScreen}
  options={{
    headerShown: false,
    presentation: 'modal',
    animation: 'slide_from_bottom',
  }}
/>
```

## 📱 预期行为

### 正常流程
1. **点击发布按钮** → 页面从底部滑入
2. **选择活动类型** → 卡片高亮，显示选中状态
3. **填写表单** → 字数统计实时更新
4. **设置约定项** → 弹窗正常打开和关闭
5. **点击发布** → 显示支付确认弹窗
6. **完成支付** → 显示成功提示并返回

### 错误处理
1. **导航失败** → 控制台显示错误信息
2. **表单验证失败** → 显示具体错误提示
3. **网络错误** → 友好的错误提示
4. **支付失败** → 允许重试或取消

## 🐛 常见问题解决

### 问题1：点击发布按钮无反应
**可能原因**：
- Navigation prop未正确传递
- 路由名称拼写错误
- PublishGroupScreen未正确导入

**解决方案**：
```typescript
// 检查GroupCenterScreen的props类型
interface GroupCenterScreenProps {
  navigation?: any; // 确保有navigation prop
  route?: any;
}

// 检查导航调用
navigation?.navigate('PublishGroup'); // 确保路由名称正确
```

### 问题2：发布页面样式异常
**可能原因**：
- 安全区域处理不正确
- 模态展示样式冲突

**解决方案**：
```typescript
// 在PublishGroupScreen中确保安全区域处理
const safeAreaInsets = useSafeAreaInsets();

<View style={[styles.container, { paddingTop: safeAreaInsets.top }]}>
  {/* 页面内容 */}
</View>
```

### 问题3：弹窗不显示
**可能原因**：
- 状态管理错误
- 弹窗组件导入问题

**解决方案**：
```typescript
// 检查弹窗状态
const [showModal, setShowModal] = useState(false);

// 确保弹窗正确渲染
{showModal && (
  <Modal visible={showModal} transparent>
    {/* 弹窗内容 */}
  </Modal>
)}
```

## 📊 性能检查

### 内存使用
- 发布页面打开后内存使用是否正常
- 页面切换时是否有内存泄漏
- 弹窗组件是否正确销毁

### 渲染性能
- 页面切换动画是否流畅
- 表单输入响应是否及时
- 列表滚动是否顺畅

## 🎯 验收标准

### 基本功能 (必须通过)
- [x] 导航功能完全正常
- [x] 发布页面能够正确显示
- [x] 基本交互功能正常
- [x] 错误处理友好

### 进阶功能 (建议通过)
- [x] 动画效果流畅
- [x] 表单验证完整
- [x] 支付流程清晰
- [x] 用户体验优秀

### 性能要求 (推荐通过)
- [x] 页面加载速度快
- [x] 内存使用合理
- [x] 无明显卡顿
- [x] 电池消耗正常

---

**测试完成后，组局发布功能就可以正式投入使用了！** 🎉
