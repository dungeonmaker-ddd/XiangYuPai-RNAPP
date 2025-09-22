/**
 * 评论列表区域组件
 * 显示评论列表、子评论、评论互动等功能
 * 
 * TOC (快速跳转):
 * [1] Imports
 * [2] Types & Schema  
 * [3] Constants & Config
 * [4] Utils & Helpers
 * [5] State Management
 * [6] Domain Logic
 * [7] UI Components & Rendering
 * [8] Exports
 */

// ==================== 1. Imports ====================
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
// 使用简化的图标实现，避免依赖全局组件

// ==================== 2. Types & Schema ====================
interface CommentItem {
  id: string;
  content: string;
  user: {
    id: string;
    nickname: string;
    avatar: string;
    isFollowing?: boolean;
    verified?: boolean;
    level?: number;
  };
  likeCount: number;
  isLiked: boolean;
  createdAt: string;
  location?: {
    address: string;
    latitude?: number;
    longitude?: number;
    distance?: number;
  };
  parentId?: string;
  replies?: CommentItem[];
}

type CommentActionType = 'like' | 'reply' | 'delete' | 'report';

interface CommentListAreaProps {
  comments: CommentItem[];
  loading: boolean;
  onCommentLike: (commentId: string) => void;
  onCommentReply: (comment: CommentItem) => void;
  onCommentAction: (commentId: string, action: CommentActionType) => void;
  onUserPress: (userId: string) => void;
  ListHeaderComponent?: React.ComponentType<any> | React.ReactElement | null;
  style?: any;
  contentContainerStyle?: any;
  showsVerticalScrollIndicator?: boolean;
  bounces?: boolean;
  showHeader?: boolean;
  commentCount?: number;
}

interface CommentItemComponentProps {
  comment: CommentItem;
  isReply?: boolean;
  onLike: (commentId: string) => void;
  onReply: (comment: CommentItem) => void;
  onAction: (commentId: string, action: CommentActionType) => void;
  onUserPress: (userId: string) => void;
}

// ==================== 3. Constants & Config ====================
const AVATAR_SIZE = 36;
const REPLY_INDENT = 24;
const PADDING_HORIZONTAL = 20;
const PADDING_VERTICAL = 8;

// ==================== 4. Utils & Helpers ====================
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

// ==================== 5. State Management ====================
// 状态管理在子组件中实现

// ==================== 6. Domain Logic ====================
// 业务逻辑由父组件处理

// ==================== 7. UI Components & Rendering ====================
const CommentItemComponent: React.FC<CommentItemComponentProps> = ({
  comment,
  isReply = false,
  onLike,
  onReply,
  onAction,
  onUserPress,
}) => {
  const [showActions, setShowActions] = useState(false);

  const handleLongPress = () => {
    const actions = [
      { text: '取消', style: 'cancel' as const },
      { text: '复制', onPress: () => {
        onAction(comment.id, 'reply');
      }},
      { text: '举报', onPress: () => onAction(comment.id, 'report') },
    ];

    if (comment.user.id === 'current_user' || comment.user.id === 'user1') {
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
            <Text style={[styles.actionIcon, comment.isLiked && styles.actionIconActive]}>
              {comment.isLiked ? '❤️' : '🤍'}
            </Text>
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

const CommentListArea: React.FC<CommentListAreaProps> = ({
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

  const renderCommentHeader = () => {
    if (!showHeader) return null;
    
    const totalComments = commentCount !== undefined ? commentCount : comments.length;
    
    return (
      <View style={styles.commentSectionHeader}>
        <Text style={styles.commentTitle}>评论 {totalComments}</Text>
      </View>
    );
  };

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

  const renderEmptyComponent = () => (
    <View style={styles.emptyContainer}>
      <Text style={styles.emptyText}>还没有评论，来说点什么吧~</Text>
    </View>
  );

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
      removeClippedSubviews={true}
      maxToRenderPerBatch={10}
      windowSize={10}
      initialNumToRender={8}
      getItemLayout={undefined}
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
  commentContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingVertical: PADDING_VERTICAL,
    paddingHorizontal: PADDING_HORIZONTAL,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0, 0, 0, 0.05)',
  },
  replyContainer: {
    marginLeft: REPLY_INDENT,
    paddingLeft: 12,
  },
  commentAvatar: {
    width: AVATAR_SIZE,
    height: AVATAR_SIZE,
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
  actionIcon: {
    marginRight: 4,
    fontSize: 14,
  },
  actionIconActive: {
    color: '#FF4757',
  },
  actionCount: {
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

// ==================== 8. Exports ====================
export default memo(CommentListArea);
export type { CommentItem, CommentActionType, CommentListAreaProps };
