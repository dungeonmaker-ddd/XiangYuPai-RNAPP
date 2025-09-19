/**
 * 互动操作栏组件使用示例
 * 展示如何使用重构后的InteractionActionBar组件
 */

import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import InteractionActionBar from './CommentInput';
import { InteractionActionBarProps } from '../types';

interface ExampleProps {
  contentId: string;
  initialData?: {
    likeCount: number;
    collectCount: number;
    shareCount: number;
    isLiked: boolean;
    isCollected: boolean;
  };
}

const InteractionActionBarExample: React.FC<ExampleProps> = ({
  contentId,
  initialData = {
    likeCount: 28,
    collectCount: 15,
    shareCount: 8,
    isLiked: false,
    isCollected: false,
  },
}) => {
  const [commentText, setCommentText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // 评论提交处理
  const handleCommentSubmit = async () => {
    if (commentText.trim().length === 0) return;
    
    setIsSubmitting(true);
    try {
      // 模拟API调用
      await new Promise(resolve => setTimeout(resolve, 1000));
      console.log('发布评论:', commentText);
      setCommentText(''); // 清空输入
    } catch (error) {
      console.error('评论发布失败:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // 点赞处理
  const handleLike = async (isLiked: boolean, newCount: number) => {
    try {
      // 模拟API调用
      console.log('点赞操作:', { contentId, isLiked, newCount });
      // 这里通常会调用后端API更新点赞状态
    } catch (error) {
      console.error('点赞操作失败:', error);
    }
  };

  // 收藏处理
  const handleCollect = async (isCollected: boolean, newCount: number) => {
    try {
      // 模拟API调用
      console.log('收藏操作:', { contentId, isCollected, newCount });
      // 这里通常会调用后端API更新收藏状态
    } catch (error) {
      console.error('收藏操作失败:', error);
    }
  };

  // 分享处理
  const handleShare = (platform: string) => {
    console.log('分享到平台:', platform);
    // 这里可以集成具体的分享SDK
    // 或者统计分享数据
  };

  const interactionProps: InteractionActionBarProps = {
    // 评论相关
    value: commentText,
    placeholder: '写评论...',
    loading: isSubmitting,
    onValueChange: setCommentText,
    onSubmit: handleCommentSubmit,
    
    // 互动数据
    initialLikeCount: initialData.likeCount,
    initialCollectCount: initialData.collectCount,
    initialShareCount: initialData.shareCount,
    initialIsLiked: initialData.isLiked,
    initialIsCollected: initialData.isCollected,
    
    // 互动回调
    onLike: handleLike,
    onCollect: handleCollect,
    onShare: handleShare,
    
    // 分享配置
    shareContent: {
      title: '精彩内容分享',
      description: '来看看这个有趣的内容',
      url: `https://example.com/content/${contentId}`,
      imageUrl: 'https://example.com/image.jpg',
    },
  };

  return (
    <View style={styles.container}>
      <InteractionActionBar {...interactionProps} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-end',
  },
});

export default InteractionActionBarExample;
