/**
 * 评论列表组件
 * 显示评论列表、子评论、评论互动等功能
 */

import React, { memo, useState } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  Alert,
} from 'react-native';
import { CommentListProps, CommentItem, CommentActionType } from '../types';
import { Icon, ICON_PATHS } from '../../../globalComponents';

// 扩展CommentListProps以支持FlatList属性
interface ExtendedCommentListProps extends CommentListProps {
  ListHeaderComponent?: React.ComponentType<any> | React.ReactElement | null;
  style?: any;
  contentContainerStyle?: any;
  showsVerticalScrollIndicator?: boolean;
  bounces?: boolean;
  showHeader?: boolean; // 是否显示评论区标题
  commentCount?: number; // 评论数量，用于标题显示
}

interface CommentItemComponentProps {
  comment: CommentItem;
  isReply?: boolean;
  onLike: (commentId: string) => void;
  onReply: (comment: CommentItem) => void;
  onAction: (commentId: string, action: CommentActionType) => void;
  onUserPress: (userId: string) => void;
}

// 单个评论组件
const CommentItemComponent: React.FC<CommentItemComponentProps> = ({
  comment,
  isReply = false,
  onLike,
  onReply,
  onAction,
  onUserPress,
}) => {
  const [showActions, setShowActions] = useState(false);

  // 格式化时间
  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) {
      return '刚刚';
    } else if (diffInMinutes < 60) {
      return `${diffInMinutes}分钟前`;
    } else if (diffInMinutes < 24 * 60) {
      const hours = Math.floor(diffInMinutes / 60);
      return `${hours}小时前`;
    } else {
      const date = new Date(dateString);
      return `${date.getMonth() + 1}-${date.getDate()} ${date.getHours()}:${date.getMinutes().toString().padStart(2, '0')}`;
    }
  };

  // 处理长按显示操作菜单
  const handleLongPress = () => {
    const actions = [
      { text: '取消', style: 'cancel' as const },
      { text: '复制', onPress: () => {
        // 这里可以添加复制到剪贴板的逻辑
        onAction(comment.id, 'reply');
      }},
      { text: '举报', onPress: () => onAction(comment.id, 'report') },
    ];

    // 只有当前用户的评论才显示删除选项
    if (comment.user.id === 'current_user' || comment.user.id === 'user1') { // 模拟当前用户
      actions.push({
        text: '删除', 
        style: 'destructive' as any,
        onPress: () => onAction(comment.id, 'delete')
      });
    }

    Alert.alert('评论操作', '选择操作', actions);
  };

  return (
    <View style={[styles.commentContainer, isReply && styles.replyContainer]}>
      {/* 用户头像 */}
      <TouchableOpacity
        onPress={() => onUserPress(comment.user.id)}
        activeOpacity={0.7}
      >
        <Image source={{ uri: comment.user.avatar }} style={styles.commentAvatar} />
      </TouchableOpacity>

      {/* 评论内容区域 */}
      <View style={styles.commentContent}>
        {/* 用户信息行 */}
        <View style={styles.commentHeader}>
          <TouchableOpacity onPress={() => onUserPress(comment.user.id)} style={styles.userInfo}>
            <Text style={styles.commentUsername}>{comment.user.nickname}</Text>
          </TouchableOpacity>
          
          {/* 点赞按钮移到右侧 */}
          <TouchableOpacity
            style={styles.likeButton}
            onPress={() => onLike(comment.id)}
            activeOpacity={0.7}
          >
            <Icon
              source={ICON_PATHS.LIKE}
              type="like"
              state={comment.isLiked ? 'active' : 'default'}
              size={16}
              style={styles.actionIcon}
            />
            {comment.likeCount > 0 && (
              <Text style={styles.actionCount}>{comment.likeCount}</Text>
            )}
          </TouchableOpacity>
        </View>

        {/* 评论文字内容 */}
        <TouchableOpacity onLongPress={handleLongPress} activeOpacity={1}>
          <Text style={styles.commentText}>{comment.content}</Text>
        </TouchableOpacity>

        {/* 时间和位置信息 */}
        <View style={styles.timeLocationContainer}>
          <Text style={styles.commentTime}>{formatTime(comment.createdAt)}</Text>
          {comment.location && (
            <Text style={styles.commentLocation}>
              📍 {comment.location.address}
              {comment.location.distance && (
                <Text style={styles.distanceText}> • {comment.location.distance < 1 ? 
                  `${(comment.location.distance * 1000).toFixed(0)}m` : 
                  `${comment.location.distance.toFixed(1)}km`}</Text>
              )}
            </Text>
          )}
        </View>

      </View>
    </View>
  );
};

// 评论列表主组件
const CommentList: React.FC<ExtendedCommentListProps> = ({
  comments,
  loading,
  onCommentLike,
  onCommentReply,
  onCommentAction,
  onUserPress,
  ListHeaderComponent,
  style,
  contentContainerStyle,
  showsVerticalScrollIndicator = true,
  bounces = true,
  showHeader = true,
  commentCount,
}) => {
  // 渲染评论项
  const renderComment = ({ item }: { item: CommentItem }) => (
    <View>
      {/* 主评论 */}
      <CommentItemComponent
        comment={item}
        onLike={onCommentLike}
        onReply={onCommentReply}
        onAction={onCommentAction}
        onUserPress={onUserPress}
      />

      {/* 子评论/回复 */}
      {item.replies && item.replies.length > 0 && (
        <View style={styles.repliesContainer}>
          {item.replies.map((reply) => (
            <CommentItemComponent
              key={reply.id}
              comment={reply}
              isReply={true}
              onLike={onCommentLike}
              onReply={onCommentReply}
              onAction={onCommentAction}
              onUserPress={onUserPress}
            />
          ))}
        </View>
      )}
    </View>
  );

  // 渲染评论标题
  const renderCommentHeader = () => {
    if (!showHeader) return null;
    
    const totalComments = commentCount !== undefined ? commentCount : comments.length;
    
    return (
      <View style={styles.commentSectionHeader}>
        <Text style={styles.commentTitle}>评论 {totalComments}</Text>
      </View>
    );
  };

  // 组合头部组件
  const renderCombinedHeader = () => {
    return (
      <View>
        {React.isValidElement(ListHeaderComponent) 
          ? ListHeaderComponent 
          : ListHeaderComponent 
            ? React.createElement(ListHeaderComponent) 
            : null}
        {renderCommentHeader()}
      </View>
    );
  };

  // 空状态
  const renderEmptyComponent = () => (
    <View style={styles.emptyContainer}>
      <Text style={styles.emptyText}>还没有评论，来说点什么吧~</Text>
    </View>
  );

  // 加载状态
  if (loading && comments.length === 0) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>加载中...</Text>
      </View>
    );
  }

  return (
    <FlatList
      data={comments}
      keyExtractor={(item) => item.id}
      renderItem={renderComment}
      ListEmptyComponent={renderEmptyComponent}
      ListHeaderComponent={ListHeaderComponent ? renderCombinedHeader : renderCommentHeader}
      showsVerticalScrollIndicator={showsVerticalScrollIndicator}
      bounces={bounces}
      style={[styles.container, style]}
      contentContainerStyle={contentContainerStyle}
      // 性能优化配置
      removeClippedSubviews={true}
      maxToRenderPerBatch={10}
      windowSize={10}
      initialNumToRender={8}
      getItemLayout={undefined} // 由于评论高度不固定，不使用getItemLayout
    />
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    flex: 1,
  },
  topDivider: {
    height: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.08)',
    marginHorizontal: 16,
    marginTop: 8,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 8,
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333333',
  },
  headerCount: {
    fontSize: 12,
    color: 'rgba(0, 0, 0, 0.6)',
    marginLeft: 8,
  },
  list: {
    flex: 1,
    paddingHorizontal: 16,
  },
  commentContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0, 0, 0, 0.05)',
  },
  replyContainer: {
    marginLeft: 24,
    paddingLeft: 12,
  },
  commentAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.1)',
  },
  commentContent: {
    flex: 1,
    marginLeft: 10,
  },
  commentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 2,
  },
  likeButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  timeLocationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
    flexWrap: 'wrap',
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  commentUsername: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333333',
    marginRight: 4,
  },
  verifiedIcon: {
    fontSize: 12,
    backgroundColor: '#1890FF',
    color: '#FFFFFF',
    borderRadius: 8,
    paddingHorizontal: 4,
    paddingVertical: 1,
    marginRight: 4,
    textAlign: 'center',
    lineHeight: 16,
  },
  levelBadge: {
    backgroundColor: '#F0F0F0',
    borderRadius: 8,
    paddingHorizontal: 6,
    paddingVertical: 2,
    marginRight: 4,
  },
  levelText: {
    fontSize: 10,
    color: '#666666',
    fontWeight: '500',
  },
  commentTime: {
    fontSize: 12,
    color: 'rgba(0, 0, 0, 0.6)',
    marginRight: 6,
  },
  commentText: {
    fontSize: 14,
    color: '#333333',
    lineHeight: 20,
    marginBottom: 2,
  },
  commentLocation: {
    fontSize: 12,
    color: 'rgba(0, 0, 0, 0.6)',
  },
  distanceText: {
    fontSize: 12,
    color: 'rgba(0, 0, 0, 0.5)',
    fontWeight: '400',
  },
  commentActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
  },
  actionIcon: {
    marginRight: 4,
  },
  actionCount: {
    fontSize: 12,
    color: 'rgba(0, 0, 0, 0.6)',
  },
  actionText: {
    fontSize: 12,
    color: 'rgba(0, 0, 0, 0.6)',
  },
  repliesContainer: {
    marginTop: 8,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
    paddingHorizontal: 20,
  },
  emptyText: {
    fontSize: 14,
    color: 'rgba(0, 0, 0, 0.6)',
  },
  loadingContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
    paddingHorizontal: 20,
  },
  loadingText: {
    fontSize: 14,
    color: 'rgba(0, 0, 0, 0.6)',
  },
  commentSectionHeader: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
  },
  commentTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333333',
  },
});

export default memo(CommentList);
