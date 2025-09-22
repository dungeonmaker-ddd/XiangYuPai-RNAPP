# 📋 DetailHeader集成举报功能指南

> **如何在详情页面头部组件中集成举报模块**

## 🎯 **功能概述**

`DetailHeader`组件现在已经集成了举报功能，可以：
- **自动导航**到举报页面
- **传递举报目标信息**
- **支持自定义举报回调**
- **保持原有功能**不变

---

## 🚀 **快速使用**

### 📋 **基础用法**
```typescript
import DetailHeader from './components/DetailHeader';

<DetailHeader
  onBackPress={handleBackPress}
  reportTarget={{
    targetId: 'content_123',
    targetType: 'content',
    targetTitle: '内容标题',
    targetAuthor: '作者名称',
  }}
  onShare={handleShare}
  onBlockUser={handleBlockUser}
/>
```

### 🎯 **完整示例**
```typescript
import React, { useCallback } from 'react';
import { useNavigation } from '@react-navigation/native';
import DetailHeader from './components/DetailHeader';
import type { ReportTargetType } from '../report/types';

const MyDetailPage = ({ route }) => {
  const navigation = useNavigation();
  const { contentId, authorId, contentTitle, authorName } = route.params;

  // 返回处理
  const handleBackPress = useCallback(() => {
    navigation.goBack();
  }, [navigation]);

  // 分享处理
  const handleShare = useCallback(() => {
    // 分享逻辑
  }, []);

  // 屏蔽用户处理
  const handleBlockUser = useCallback(() => {
    // 屏蔽逻辑
  }, []);

  // 准备举报目标信息
  const reportTarget = {
    targetId: contentId,
    targetType: 'content' as ReportTargetType,
    targetTitle: contentTitle,
    targetAuthor: authorName,
  };

  return (
    <View>
      <DetailHeader
        onBackPress={handleBackPress}
        onShare={handleShare}
        onBlockUser={handleBlockUser}
        reportTarget={reportTarget}
      />
      {/* 其他内容 */}
    </View>
  );
};
```

---

## ⚙️ **API参考**

### 📊 **新增Props**

#### `reportTarget?: ReportTargetInfo`
举报目标信息，用于内置举报功能

```typescript
interface ReportTargetInfo {
  targetId: string;           // 举报目标ID
  targetType: ReportTargetType; // 举报目标类型
  targetTitle?: string;       // 目标标题（可选）
  targetAuthor?: string;      // 目标作者（可选）
}

type ReportTargetType = 'user' | 'content' | 'comment' | 'post';
```

#### `onReport?: () => void`（已有，行为变更）
- **如果提供**：使用自定义举报回调
- **如果不提供**：使用内置导航跳转到举报页面

---

## 🔧 **使用场景**

### 🎯 **场景1：使用内置举报功能（推荐）**
```typescript
<DetailHeader
  onBackPress={handleBackPress}
  reportTarget={{
    targetId: post.id,
    targetType: 'post',
    targetTitle: post.title,
    targetAuthor: post.author.name,
  }}
/>
```

**优点**：
- ✅ 自动导航到举报页面
- ✅ 自动传递目标信息
- ✅ 无需额外代码

### 🎯 **场景2：使用自定义举报回调**
```typescript
const handleCustomReport = useCallback(() => {
  // 自定义举报逻辑
  navigation.navigate('CustomReportScreen', { 
    targetId: post.id 
  });
}, []);

<DetailHeader
  onBackPress={handleBackPress}
  onReport={handleCustomReport}
/>
```

**优点**：
- ✅ 完全自定义控制
- ✅ 可以添加额外逻辑
- ✅ 兼容现有代码

### 🎯 **场景3：混合使用**
```typescript
<DetailHeader
  onBackPress={handleBackPress}
  onReport={customReportCallback}  // 优先使用自定义回调
  reportTarget={targetInfo}        // 作为备用方案
/>
```

---

## 🎨 **举报目标类型说明**

### 📋 **支持的目标类型**
| 类型 | 说明 | 使用场景 |
|------|------|----------|
| `'user'` | 用户 | 举报用户账号、个人资料等 |
| `'content'` | 内容 | 举报文章、视频、图片等内容 |
| `'comment'` | 评论 | 举报评论、回复等 |
| `'post'` | 帖子 | 举报论坛帖子、动态等 |

### 🎯 **选择正确的类型**
```typescript
// 举报用户
reportTarget: {
  targetId: user.id,
  targetType: 'user',
  targetTitle: user.nickname,
}

// 举报内容
reportTarget: {
  targetId: content.id,
  targetType: 'content',
  targetTitle: content.title,
  targetAuthor: content.author.name,
}

// 举报评论
reportTarget: {
  targetId: comment.id,
  targetType: 'comment',
  targetTitle: comment.content.substring(0, 50), // 截取前50字符
  targetAuthor: comment.author.name,
}
```

---

## 🔄 **迁移指南**

### 📊 **从旧版本迁移**

#### **旧版本代码**：
```typescript
<DetailHeader
  onBackPress={handleBackPress}
  onReport={() => {
    navigation.navigate('ReportScreen', {
      targetId: post.id,
      targetType: 'post',
    });
  }}
/>
```

#### **新版本代码（推荐）**：
```typescript
<DetailHeader
  onBackPress={handleBackPress}
  reportTarget={{
    targetId: post.id,
    targetType: 'post',
    targetTitle: post.title,
    targetAuthor: post.author.name,
  }}
/>
```

#### **迁移优势**：
- ✅ 代码更简洁
- ✅ 自动传递更多信息
- ✅ 统一的举报入口
- ✅ 更好的类型安全

---

## 🧪 **测试建议**

### 📋 **测试用例**
```typescript
describe('DetailHeader举报功能', () => {
  it('应该能够使用内置举报功能', () => {
    const reportTarget = {
      targetId: 'test_id',
      targetType: 'content',
      targetTitle: 'Test Title',
    };
    
    render(
      <DetailHeader
        onBackPress={jest.fn()}
        reportTarget={reportTarget}
      />
    );
    
    // 测试举报按钮点击
    fireEvent.press(screen.getByText('举报'));
    
    // 验证导航调用
    expect(mockNavigate).toHaveBeenCalledWith('ReportScreen', reportTarget);
  });

  it('应该优先使用自定义举报回调', () => {
    const onReport = jest.fn();
    
    render(
      <DetailHeader
        onBackPress={jest.fn()}
        onReport={onReport}
        reportTarget={{ targetId: 'test', targetType: 'content' }}
      />
    );
    
    fireEvent.press(screen.getByText('举报'));
    
    expect(onReport).toHaveBeenCalled();
    expect(mockNavigate).not.toHaveBeenCalled();
  });
});
```

---

## ⚠️ **注意事项**

### 🔍 **重要提醒**
1. **导航配置**：确保在导航器中注册了`ReportScreen`
2. **类型导入**：正确导入`ReportTargetType`类型
3. **目标信息**：尽量提供完整的举报目标信息
4. **错误处理**：监听控制台警告，确保配置正确

### 🛡️ **最佳实践**
1. **优先使用内置功能**：减少重复代码
2. **提供完整信息**：包含`targetTitle`和`targetAuthor`
3. **保持一致性**：在整个应用中使用相同的举报入口
4. **测试覆盖**：确保举报功能在各种场景下正常工作

---

## 🔗 **相关文档**

- [举报模块完整文档](../report/README.md)
- [举报页面使用指南](../report/README.md#使用方法)
- [举报类型定义](../report/types.ts)
- [导航配置指南](../../navigation/README.md)

---

**📝 文档版本**：v1.0  
**🗓️ 更新时间**：2024年12月  
**🎯 适用场景**：详情页面集成举报功能**
