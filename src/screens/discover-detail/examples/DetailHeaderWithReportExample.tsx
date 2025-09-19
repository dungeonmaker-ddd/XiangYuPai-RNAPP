/**
 * DetailHeader集成举报功能使用示例
 * 
 * 展示如何在详情页面中使用DetailHeader并集成举报功能
 */

// #region [1] Imports
import React, { useCallback } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  Text,
  Image,
  Alert,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';

import DetailHeader from '../components/DetailHeader';
import type { ReportTargetType } from '../../report/types';
// #endregion

// #region [2] Types
interface ExampleDetailPageProps {
  route: {
    params: {
      contentId: string;
      authorId: string;
      authorName: string;
      contentTitle: string;
      contentType: 'post' | 'video' | 'image';
    };
  };
}

interface ContentData {
  id: string;
  title: string;
  content: string;
  author: {
    id: string;
    name: string;
    avatar: string;
  };
  images: string[];
  type: 'post' | 'video' | 'image';
  createdAt: string;
}
// #endregion

// #region [3] Mock Data
const mockContentData: ContentData = {
  id: 'content_123',
  title: '美丽的日落风景',
  content: '今天在海边看到了超级美的日落，分享给大家！这是我见过最美的日落之一，橙红色的天空倒映在海面上，真的太震撼了。',
  author: {
    id: 'user_456',
    name: '摄影爱好者小王',
    avatar: 'https://example.com/avatar.jpg',
  },
  images: [
    'https://example.com/sunset1.jpg',
    'https://example.com/sunset2.jpg',
  ],
  type: 'post',
  createdAt: '2024-12-19T10:30:00Z',
};
// #endregion

// #region [4] Main Component
/**
 * 详情页面示例 - 集成举报功能
 */
export const DetailHeaderWithReportExample: React.FC<ExampleDetailPageProps> = ({ route }) => {
  const navigation = useNavigation();
  const { contentId, authorId, authorName, contentTitle, contentType } = route.params;

  // 使用mock数据，实际项目中应该从API获取
  const contentData = mockContentData;

  // 返回按钮处理
  const handleBackPress = useCallback(() => {
    navigation.goBack();
  }, [navigation]);

  // 分享功能处理
  const handleShare = useCallback(() => {
    Alert.alert(
      '分享内容',
      '选择分享方式',
      [
        { text: '取消', style: 'cancel' },
        { text: '复制链接', onPress: () => console.log('复制链接') },
        { text: '分享到微信', onPress: () => console.log('分享到微信') },
        { text: '分享到微博', onPress: () => console.log('分享到微博') },
      ]
    );
  }, []);

  // 屏蔽用户处理
  const handleBlockUser = useCallback(() => {
    Alert.alert(
      '屏蔽用户',
      `确定要屏蔽用户"${contentData.author.name}"吗？屏蔽后将不再看到该用户的内容。`,
      [
        { text: '取消', style: 'cancel' },
        { 
          text: '确定屏蔽', 
          style: 'destructive',
          onPress: () => {
            console.log('屏蔽用户:', contentData.author.id);
            Alert.alert('操作成功', '已屏蔽该用户');
          }
        },
      ]
    );
  }, [contentData.author]);

  // 准备举报目标信息
  const reportTarget = {
    targetId: contentData.id,
    targetType: contentType as ReportTargetType,
    targetTitle: contentData.title,
    targetAuthor: contentData.author.name,
  };

  return (
    <View style={styles.container}>
      {/* 详情页面头部 - 集成举报功能 */}
      <DetailHeader
        onBackPress={handleBackPress}
        onShare={handleShare}
        onBlockUser={handleBlockUser}
        reportTarget={reportTarget}
        showBackground={false}
        backgroundOpacity={0.9}
      />

      {/* 页面内容 */}
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* 内容图片 */}
        {contentData.images.map((imageUri, index) => (
          <View key={index} style={styles.imageContainer}>
            <Image 
              source={{ uri: imageUri }} 
              style={styles.contentImage}
              resizeMode="cover"
            />
          </View>
        ))}

        {/* 内容信息 */}
        <View style={styles.contentInfo}>
          <Text style={styles.contentTitle}>{contentData.title}</Text>
          <Text style={styles.contentText}>{contentData.content}</Text>
          
          {/* 作者信息 */}
          <View style={styles.authorInfo}>
            <Image 
              source={{ uri: contentData.author.avatar }} 
              style={styles.authorAvatar}
            />
            <View style={styles.authorDetails}>
              <Text style={styles.authorName}>{contentData.author.name}</Text>
              <Text style={styles.publishTime}>
                {new Date(contentData.createdAt).toLocaleDateString('zh-CN', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </Text>
            </View>
          </View>
        </View>

        {/* 底部占位，避免内容被遮挡 */}
        <View style={styles.bottomSpacer} />
      </ScrollView>
    </View>
  );
};
// #endregion

// #region [5] Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  content: {
    flex: 1,
  },
  
  // 图片样式
  imageContainer: {
    width: '100%',
    aspectRatio: 16 / 9,
  },
  contentImage: {
    width: '100%',
    height: '100%',
  },

  // 内容信息样式
  contentInfo: {
    backgroundColor: '#FFFFFF',
    padding: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    marginTop: -20,
  },
  contentTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#333333',
    lineHeight: 32,
    marginBottom: 16,
  },
  contentText: {
    fontSize: 16,
    color: '#666666',
    lineHeight: 24,
    marginBottom: 24,
  },

  // 作者信息样式
  authorInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
  },
  authorAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    marginRight: 12,
  },
  authorDetails: {
    flex: 1,
  },
  authorName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333333',
    marginBottom: 4,
  },
  publishTime: {
    fontSize: 14,
    color: '#999999',
  },

  // 底部占位
  bottomSpacer: {
    height: 100,
  },
});
// #endregion

// #region [6] Exports
export default DetailHeaderWithReportExample;
// #endregion
