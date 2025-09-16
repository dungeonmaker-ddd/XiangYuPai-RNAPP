/**
 * 发现详情页面主组件
 * 基于架构设计文档实现的完整详情页面
 */

import React, { memo, useState, useRef } from 'react';
import {
  View,
  StyleSheet,
  StatusBar,
  TouchableOpacity,
  Text,
  Dimensions,
  SafeAreaView,
  ScrollView,
  Alert,
  Animated,
} from 'react-native';

import { DiscoverDetailPageProps } from './types';
import { useDiscoverDetail } from './hooks/useDiscoverDetail';
import {
  UserInfoCard,
  CommentList,
  CommentInput,
  ImageViewer,
  DetailHeader,
} from './components';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

const DiscoverDetailPage: React.FC<DiscoverDetailPageProps> = ({
  navigation,
  route,
}) => {
  const { contentId, contentItem } = route.params;
  
  // 使用主业务Hook
  const {
    contentItem: currentContent,
    comments,
    isContentLoading,
    isCommentsLoading,
    isCommentExpanded,
    commentInputText,
    showImageViewer: showImageViewerState,
    currentImageIndex,
    handleLike,
    handleCollect,
    handleFollow,
    handleShare,
    handleAddComment,
    handleCommentLike,
    handleCommentAction,
    toggleCommentExpansion,
    updateCommentInput,
    openImageViewer,
    hideImageViewer,
    hasContent,
  } = useDiscoverDetail(contentId, contentItem);

  // 本地状态
  const [replyToUser, setReplyToUser] = useState<string>('');

  // 手势动画值 - 使用标准Animated API
  const scale = useRef(new Animated.Value(1)).current;
  const translateX = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(0)).current;
  const opacity = useRef(new Animated.Value(1)).current;

  // 处理双击放大/缩小
  const handleDoubleTap = () => {
    const currentScale = (scale as any)._value || 1;
    if (currentScale <= 1.1) {
      // 放大到2倍
      Animated.parallel([
        Animated.spring(scale, { 
          toValue: 2, 
          useNativeDriver: true,
          tension: 100,
          friction: 8,
        }),
      ]).start();
    } else {
      // 缩小到1倍并重置位置
      Animated.parallel([
        Animated.spring(scale, { 
          toValue: 1, 
          useNativeDriver: true,
          tension: 100,
          friction: 8,
        }),
        Animated.spring(translateX, { 
          toValue: 0, 
          useNativeDriver: true,
          tension: 100,
          friction: 8,
        }),
        Animated.spring(translateY, { 
          toValue: 0, 
          useNativeDriver: true,
          tension: 100,
          friction: 8,
        }),
      ]).start();
    }
  };

  // 处理单击 - 不再需要切换评论，因为评论区域已经可见
  const handleSingleTap = () => {
    // 可以在这里添加其他单击逻辑，比如隐藏/显示界面元素
    console.log('Single tap on image');
  };

  // 处理图片点击
  const handleImagePress = () => {
    if (currentContent?.imageUrl) {
      openImageViewer(0);
    }
  };

  // 动画样式
  const animatedImageStyle = {
    transform: [
      { scale },
      { translateX },
      { translateY },
    ],
  };

  const animatedContainerStyle = {
    opacity,
  };

  // 处理返回
  const handleGoBack = () => {
    navigation.goBack();
  };

  // 处理举报
  const handleReport = () => {
    Alert.alert('举报', '已提交举报');
  };

  // 处理屏蔽用户
  const handleBlockUser = () => {
    Alert.alert('屏蔽', '已屏蔽该用户');
  };

  // 处理用户点击
  const handleUserPress = (userId?: string) => {
    // TODO: 导航到用户详情页
    console.log('Navigate to user:', userId || currentContent?.user.id);
  };

  // 处理评论回复
  const handleCommentReply = (comment: any) => {
    setReplyToUser(comment.user.nickname);
    toggleCommentExpansion();
  };

  // 处理评论提交
  const handleCommentSubmit = () => {
    handleAddComment(commentInputText, replyToUser ? 'parent_id' : undefined);
    setReplyToUser('');
  };

  // 处理评论取消
  const handleCommentCancel = () => {
    setReplyToUser('');
    updateCommentInput('');
  };


  // 加载状态
  if (isContentLoading || !hasContent) {
    return (
      <View style={styles.loadingContainer}>
        <StatusBar hidden={true} />
        <TouchableOpacity style={styles.backButton} onPress={handleGoBack}>
          <Text style={styles.backIcon}>‹</Text>
        </TouchableOpacity>
        <Text style={styles.loadingText}>加载中...</Text>
      </View>
    );
  }

  const content = currentContent!;

  return (
    <View style={styles.container}>
      <StatusBar hidden={true} />
      
      {/* 顶部导航栏 - 使用DetailHeader组件 */}
      <DetailHeader
        onBackPress={handleGoBack}
        onShare={handleShare}
        onReport={handleReport}
        onBlockUser={handleBlockUser}
      />

      {/* 可滚动的主内容区域 */}
      <ScrollView 
        style={styles.scrollContainer}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        bounces={true}
      >
        {/* 图片展示区域 - 40% */}
        <View style={styles.imageContainer}>
          <TouchableOpacity 
            onPress={handleSingleTap} 
            onLongPress={handleDoubleTap}
            delayLongPress={300}
            activeOpacity={1}
            style={styles.imageWrapper}
          >
            <Animated.Image
              source={{ uri: content.imageUrl }}
              style={[styles.contentImage, animatedImageStyle]}
              resizeMode="cover"
            />
          </TouchableOpacity>
          
          {/* 图片指示器 - 如果有多张图片 */}
          {/* TODO: 当支持多图时显示 */}
          {false && (
            <View style={styles.imageIndicator}>
              <View style={styles.indicatorDot} />
              <View style={[styles.indicatorDot, styles.indicatorDotInactive]} />
            </View>
          )}
        </View>

        {/* 用户信息区域 - 中心位置 */}
        <View style={styles.userInfoSection}>
          <UserInfoCard
            user={content.user}
            content={{
              title: content.title,
              description: content.description,
              createdAt: content.createdAt,
              location: content.location,
              tags: content.tags,
            }}
            isFollowing={content.user.isFollowing}
            onFollowPress={handleFollow}
            onUserPress={() => handleUserPress()}
          />

        </View>

        {/* 评论区域 - 底部30% */}
        <View style={styles.commentSection}>
          {/* 评论列表 */}
          <CommentList
            comments={comments}
            loading={isCommentsLoading}
            onCommentLike={handleCommentLike}
            onCommentReply={handleCommentReply}
            onCommentAction={handleCommentAction}
            onUserPress={handleUserPress}
          />
        </View>
      </ScrollView>

      {/* 评论输入框 - 固定在底部 */}
      <View style={styles.commentInputContainer}>
        <CommentInput
          value={commentInputText}
          placeholder={replyToUser ? `回复 @${replyToUser}` : '写评论...'}
          replyToUser={replyToUser}
          onValueChange={updateCommentInput}
          onSubmit={handleCommentSubmit}
          onCancel={replyToUser ? handleCommentCancel : undefined}
        />
      </View>

      {/* 图片查看器 */}
      <ImageViewer
        images={[content.imageUrl]}
        currentIndex={currentImageIndex}
        visible={showImageViewerState}
        onClose={hideImageViewer}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  loadingContainer: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
    color: '#333333',
    marginTop: 20,
  },
  backButton: {
    position: 'absolute',
    top: 50,
    left: 20,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  backIcon: {
    fontSize: 24,
    color: '#333333',
    fontWeight: 'bold',
  },
  scrollContainer: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 100, // 为底部评论输入框留出空间
  },
  imageContainer: {
    height: screenHeight * 0.4,
    justifyContent: 'center',
    alignItems: 'center',
  },
  imageWrapper: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: screenWidth,
  },
  contentImage: {
    width: screenWidth,
    height: '100%',
  },
    userInfoSection: {
      backgroundColor: '#FFFFFF',
      paddingHorizontal: 16,
      paddingVertical: 20,
      borderTopLeftRadius: 16,
      borderTopRightRadius: 16,
      overflow: 'hidden',
      marginTop: -16, // 向上移动44px覆盖图片尾部
    },
  commentSection: {
    minHeight: screenHeight * 0.3,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
  },
  commentInputContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
    paddingBottom: 34, // 为iOS底部安全区域留出空间
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
  },
  imageIndicator: {
    position: 'absolute',
    bottom: 120,
    alignSelf: 'center',
    flexDirection: 'row',
    alignItems: 'center',
  },
  indicatorDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#333333',
    marginHorizontal: 4,
  },
  indicatorDotInactive: {
    backgroundColor: 'rgba(51, 51, 51, 0.5)',
  },
});

export default memo(DiscoverDetailPage);
