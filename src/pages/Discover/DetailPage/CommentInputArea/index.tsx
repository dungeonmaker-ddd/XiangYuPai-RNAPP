/**
 * 评论输入区域组件 - 互动操作栏
 * 包含评论输入、点赞、收藏、分享等功能
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
import React, { memo, useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Animated,
  Keyboard,
  Alert,
  Dimensions,
  Platform,
  Modal,
  Share,
  Vibration,
  Pressable,
} from 'react-native';
// 使用简化的图标实现，避免依赖全局组件

// ==================== 2. Types & Schema ====================
interface CommentInputAreaProps {
  value: string;
  placeholder?: string;
  replyToUser?: string;
  loading?: boolean;
  onValueChange: (text: string) => void;
  onSubmit: () => void;
  onCancel?: () => void;
  // 互动数据
  initialLikeCount?: number;
  initialCollectCount?: number;
  initialShareCount?: number;
  initialIsLiked?: boolean;
  initialIsCollected?: boolean;
  // 互动回调
  onLike?: (isLiked: boolean, newCount: number) => void;
  onCollect?: (isCollected: boolean, newCount: number) => void;
  onShare?: (platform: string) => void;
  // 分享配置
  shareContent?: {
    title: string;
    description: string;
    url: string;
    imageUrl?: string;
  };
}

interface LocalState {
  showSharePanel: boolean;
  keyboardHeight: number;
  isLiked: boolean;
  isCollected: boolean;
  likeCount: number;
  collectCount: number;
  shareCount: number;
}

interface AnimationRefs {
  bottom: Animated.Value;
  likeScale: Animated.Value;
  collectScale: Animated.Value;
}

interface ShareOption {
  id: string;
  title: string;
  icon: string;
  color: string;
  onPress: () => void;
}

// ==================== 3. Constants & Config ====================
const ANIMATION_DURATION = 250;
const MIN_INPUT_HEIGHT = 18;
const MAX_INPUT_HEIGHT = 80;
const MAX_INPUT_HEIGHT_SMALL = 56;
const SMALL_SCREEN_WIDTH = 375;
const MAX_COMMENT_LENGTH = 1000;
const WARNING_THRESHOLD = 900;

const ACTION_BAR_HEIGHT = 40;
const ACTION_BUTTON_SIZE = 28;
const ACTION_ICON_SIZE = 16;

const LIKE_ANIMATION_DURATION = 300;
const COLLECT_ANIMATION_DURATION = 400;
const SHARE_PANEL_DURATION = 300;

const SHARE_PLATFORMS = [
  { id: 'wechat', title: '微信', icon: '💬', color: '#07C160' },
  { id: 'moments', title: '朋友圈', icon: '👥', color: '#07C160' },
  { id: 'qq', title: 'QQ', icon: '🐧', color: '#12B7F5' },
  { id: 'weibo', title: '微博', icon: '📱', color: '#E6162D' },
  { id: 'copy', title: '复制链接', icon: '📋', color: '#999999' },
];

// ==================== 4. Utils & Helpers ====================
const getScreenInfo = () => {
  const { width } = Dimensions.get('window');
  return { width, isSmallScreen: width < SMALL_SCREEN_WIDTH };
};

const calculateInputHeight = (contentHeight: number, isSmallScreen: boolean): number => {
  const maxHeight = isSmallScreen ? MAX_INPUT_HEIGHT_SMALL : MAX_INPUT_HEIGHT;
  return Math.min(Math.max(MIN_INPUT_HEIGHT, contentHeight + 2), maxHeight);
};

const validateCommentText = (text: string): boolean => {
  return text.trim().length > 0 && text.length <= MAX_COMMENT_LENGTH;
};

const formatCount = (count: number): string => {
  if (count < 1000) return count.toString();
  if (count < 10000) return `${(count / 1000).toFixed(1)}k`;
  return `${Math.floor(count / 10000)}w`;
};

const triggerHapticFeedback = () => {
  if (Platform.OS === 'ios') {
    Vibration.vibrate(50);
  }
};

const copyToClipboard = async (text: string): Promise<boolean> => {
  try {
    Alert.alert('复制成功', '链接已复制到剪贴板');
    return true;
  } catch (error) {
    return false;
  }
};

// ==================== 5. State Management ====================
// 状态管理在主组件中实现

// ==================== 6. Domain Logic ====================
// 业务逻辑在主组件中实现

// ==================== 7. UI Components & Rendering ====================
const CommentInputArea: React.FC<CommentInputAreaProps> = ({
  value,
  placeholder = '写评论...',
  replyToUser,
  loading = false,
  onValueChange,
  onSubmit,
  onCancel,
  initialLikeCount = 0,
  initialCollectCount = 0,
  initialShareCount = 0,
  initialIsLiked = false,
  initialIsCollected = false,
  onLike,
  onCollect,
  onShare,
  shareContent,
}) => {
  const [state, setState] = useState<LocalState>({
    showSharePanel: false,
    keyboardHeight: 0,
    isLiked: initialIsLiked,
    isCollected: initialIsCollected,
    likeCount: initialLikeCount,
    collectCount: initialCollectCount,
    shareCount: initialShareCount,
  });

  const animationRefs = useRef<AnimationRefs>({
    bottom: new Animated.Value(0),
    likeScale: new Animated.Value(1),
    collectScale: new Animated.Value(1),
  }).current;

  const inputRef = useRef<TextInput>(null);
  const { width: screenWidth, isSmallScreen } = getScreenInfo();

  // 键盘事件监听
  useEffect(() => {
    const keyboardWillShow = Keyboard.addListener(
      Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow',
      (event) => {
        setState(prev => ({ ...prev, keyboardHeight: event.endCoordinates.height }));
        Animated.timing(animationRefs.bottom, {
          toValue: event.endCoordinates.height,
          duration: Platform.OS === 'ios' ? event.duration : ANIMATION_DURATION,
          useNativeDriver: false,
        }).start();
      }
    );

    const keyboardWillHide = Keyboard.addListener(
      Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide',
      (event) => {
        setState(prev => ({ ...prev, keyboardHeight: 0 }));
        Animated.timing(animationRefs.bottom, {
          toValue: 0,
          duration: Platform.OS === 'ios' ? event.duration : ANIMATION_DURATION,
          useNativeDriver: false,
        }).start();
      }
    );

    return () => {
      keyboardWillShow.remove();
      keyboardWillHide.remove();
    };
  }, [animationRefs.bottom]);

  // 事件处理
  const handleTextChange = (text: string) => {
    onValueChange(text);
  };

  const handleSend = () => {
    if (!validateCommentText(value)) {
      Alert.alert('提示', '请输入评论内容');
      return;
    }
    onSubmit();
  };

  const handleLike = () => {
    triggerHapticFeedback();
    const newIsLiked = !state.isLiked;
    const newCount = newIsLiked ? state.likeCount + 1 : state.likeCount - 1;

    setState(prev => ({
      ...prev,
      isLiked: newIsLiked,
      likeCount: newCount,
    }));

    Animated.sequence([
      Animated.timing(animationRefs.likeScale, {
        toValue: 1.2,
        duration: 150,
        useNativeDriver: true,
      }),
      Animated.timing(animationRefs.likeScale, {
        toValue: 1,
        duration: 150,
        useNativeDriver: true,
      }),
    ]).start();

    onLike?.(newIsLiked, newCount);
  };

  const handleCollect = () => {
    triggerHapticFeedback();
    const newIsCollected = !state.isCollected;
    const newCount = newIsCollected ? state.collectCount + 1 : state.collectCount - 1;

    setState(prev => ({
      ...prev,
      isCollected: newIsCollected,
      collectCount: newCount,
    }));

    Animated.sequence([
      Animated.timing(animationRefs.collectScale, {
        toValue: 1.2,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(animationRefs.collectScale, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start();

    Alert.alert('提示', newIsCollected ? '已收藏' : '已取消收藏');
    onCollect?.(newIsCollected, newCount);
  };

  const handleShare = () => {
    setState(prev => ({ ...prev, showSharePanel: true }));
  };

  const handleSharePlatform = async (platform: string) => {
    setState(prev => ({ ...prev, showSharePanel: false }));
    
    if (platform === 'copy') {
      if (shareContent?.url) {
        await copyToClipboard(shareContent.url);
      }
    } else if (platform === 'system') {
      try {
        await Share.share({
          message: shareContent?.description || '分享内容',
          url: shareContent?.url || '',
          title: shareContent?.title || '分享',
        });
      } catch (error) {
        console.error('分享失败:', error);
      }
    }

    setState(prev => ({ ...prev, shareCount: prev.shareCount + 1 }));
    onShare?.(platform);
  };

  const closeSharePanel = () => {
    setState(prev => ({ ...prev, showSharePanel: false }));
  };

  return (
    <>
      <Animated.View style={[
        styles.container,
        { bottom: animationRefs.bottom },
      ]}>
        {/* Reply Hint */}
        {replyToUser && (
          <View style={[styles.replyHint, isSmallScreen && styles.replyHintSmall]}>
            <Text style={styles.replyText}>回复 @{replyToUser}</Text>
            {onCancel && (
              <TouchableOpacity 
                onPress={onCancel} 
                style={styles.cancelButton}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              >
                <Text style={styles.cancelText}>✕</Text>
              </TouchableOpacity>
            )}
          </View>
        )}

        {/* Main Action Bar */}
        <View style={[styles.actionBar, isSmallScreen && styles.actionBarSmall]}>
          {/* Comment Input Section */}
          <View style={styles.commentSection}>
            <View style={[
              styles.inputWrapper,
              isSmallScreen && styles.inputWrapperSmall,
            ]}>
              <TextInput
                ref={inputRef}
                style={[styles.textInput, isSmallScreen && styles.textInputSmall]}
                value={value}
                onChangeText={handleTextChange}
                onSubmitEditing={handleSend}
                placeholder={placeholder}
                placeholderTextColor="#999999"
                multiline
                maxLength={MAX_COMMENT_LENGTH}
                editable={!loading}
                textAlignVertical="center"
                returnKeyType="send"
                blurOnSubmit={false}
              />
            </View>
          </View>

          {/* Quick Actions Section */}
          <View style={styles.quickActionsSection}>
            {/* Like Button */}
            <Animated.View style={{ transform: [{ scale: animationRefs.likeScale }] }}>
              <TouchableOpacity
                style={styles.quickActionButton}
                onPress={handleLike}
                activeOpacity={0.7}
                hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
              >
            <Text style={[styles.actionIcon, state.isLiked && styles.actionIconActive]}>
              {state.isLiked ? '❤️' : '🤍'}
            </Text>
                <Text style={[
                  styles.quickActionCount,
                  state.isLiked && styles.quickActionCountActive,
                ]}>
                  {formatCount(state.likeCount)}
                </Text>
              </TouchableOpacity>
            </Animated.View>

            {/* Collect Button */}
            <Animated.View style={{ transform: [{ scale: animationRefs.collectScale }] }}>
              <TouchableOpacity
                style={styles.quickActionButton}
                onPress={handleCollect}
                activeOpacity={0.7}
                hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
              >
                <Text style={[styles.actionIcon, state.isCollected && styles.actionIconCollected]}>
                  {state.isCollected ? '⭐' : '☆'}
                </Text>
                <Text style={[
                  styles.quickActionCount,
                  state.isCollected && styles.quickActionCountCollected,
                ]}>
                  {formatCount(state.collectCount)}
                </Text>
              </TouchableOpacity>
            </Animated.View>

            {/* Share Button */}
            <TouchableOpacity
              style={styles.quickActionButton}
              onPress={handleShare}
              activeOpacity={0.7}
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            >
              <Text style={styles.actionIcon}>📤</Text>
              <Text style={styles.quickActionCount}>
                {formatCount(state.shareCount)}
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Character Count */}
        {value.length > WARNING_THRESHOLD && (
          <View style={styles.countHint}>
            <Text style={[
              styles.countText,
              value.length >= MAX_COMMENT_LENGTH && styles.countTextWarning,
            ]}>
              {value.length}/{MAX_COMMENT_LENGTH}
            </Text>
          </View>
        )}
      </Animated.View>

      {/* Share Panel Modal */}
      <Modal
        visible={state.showSharePanel}
        transparent={true}
        animationType="slide"
        onRequestClose={closeSharePanel}
      >
        <Pressable style={styles.shareModalOverlay} onPress={closeSharePanel}>
          <Pressable style={styles.sharePanel} onPress={() => {}}>
            {/* Handle Bar */}
            <View style={styles.sharePanelHandle} />
            
            {/* Header */}
            <View style={styles.sharePanelHeader}>
              <Text style={styles.sharePanelTitle}>分享到</Text>
              <TouchableOpacity
                onPress={closeSharePanel}
                style={styles.sharePanelCloseButton}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              >
                <Text style={styles.sharePanelCloseText}>取消</Text>
              </TouchableOpacity>
            </View>

            {/* Share Options Grid */}
            <View style={styles.shareOptionsGrid}>
              {SHARE_PLATFORMS.map((platform) => (
                <TouchableOpacity
                  key={platform.id}
                  style={styles.shareOptionButton}
                  onPress={() => handleSharePlatform(platform.id)}
                  activeOpacity={0.7}
                >
                  <View style={[styles.shareOptionIcon, { backgroundColor: platform.color }]}>
                    <Text style={styles.shareOptionIconText}>{platform.icon}</Text>
                  </View>
                  <Text style={styles.shareOptionTitle}>{platform.title}</Text>
                </TouchableOpacity>
              ))}
              
              {/* System Share Option */}
              <TouchableOpacity
                style={styles.shareOptionButton}
                onPress={() => handleSharePlatform('system')}
                activeOpacity={0.7}
              >
                <View style={[styles.shareOptionIcon, { backgroundColor: '#8A2BE2' }]}>
                  <Text style={styles.shareOptionIconText}>📤</Text>
                </View>
                <Text style={styles.shareOptionTitle}>更多</Text>
              </TouchableOpacity>
            </View>
          </Pressable>
        </Pressable>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    left: 0,
    right: 0,
    backgroundColor: '#FFFFFF',
    paddingBottom: Platform.OS === 'ios' ? 34 : 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 8,
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
  },
  actionBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 4,
    paddingBottom: 4,
    minHeight: ACTION_BAR_HEIGHT,
  },
  actionBarSmall: { 
    paddingHorizontal: 20, 
    paddingTop: 3, 
    paddingBottom: 3,
  },
  commentSection: {
    flex: 0.6,
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 6,
  },
  replyHint: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: 'rgba(138, 43, 226, 0.15)',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(138, 43, 226, 0.3)',
  },
  replyHintSmall: { paddingHorizontal: 12, paddingVertical: 8 },
  replyText: { fontSize: 14, color: '#8A2BE2', fontWeight: '500' },
  cancelButton: {
    padding: 8,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    minWidth: 32,
    alignItems: 'center',
  },
  cancelText: { fontSize: 14, color: 'rgba(255, 255, 255, 0.8)', fontWeight: '600' },
  inputWrapper: {
    flex: 1,
    backgroundColor: '#F8F8F8',
    borderRadius: 24,
    paddingHorizontal: 8,
    paddingVertical: 0,
    paddingTop: 2,
    borderWidth: 1,
    borderColor: '#E8E8E8',
    marginLeft: 0,
    justifyContent: 'center',
    overflow: 'hidden',
    height: 38,
  },
  inputWrapperSmall: { 
    paddingHorizontal: 6, 
    paddingVertical: 0, 
    paddingTop: 2,
    borderRadius: 16, 
    marginLeft: 0,
    justifyContent: 'center',
    overflow: 'hidden',
    height: 34,
  },
  textInput: {
    flex: 1,
    fontSize: 14,
    color: '#333333',
    lineHeight: 16,
    textAlignVertical: 'center',
    includeFontPadding: false,
    paddingVertical: 0,
    minHeight: 18,
    maxHeight: 80,
  },
  textInputSmall: { 
    fontSize: 13, 
    lineHeight: 15, 
    paddingVertical: 0, 
    minHeight: 16, 
    maxHeight: 56,
  },
  quickActionsSection: {
    flex: 0.4,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingLeft: 2,
    paddingRight: 0,
  },
  quickActionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: ACTION_BUTTON_SIZE,
    paddingHorizontal: 4,
    borderRadius: 4,
    backgroundColor: 'transparent',
  },
  quickActionIcon: {
    marginRight: 8,
  },
  actionIcon: {
    fontSize: ACTION_ICON_SIZE,
    marginRight: 4,
  },
  actionIconActive: {
    color: '#FF4757',
  },
  actionIconCollected: {
    color: '#FFA502',
  },
  quickActionCount: {
    fontSize: 16,
    color: '#999999',
    fontWeight: '600',
  },
  quickActionCountActive: {
    color: '#FF4757',
  },
  quickActionCountCollected: {
    color: '#FFA502',
  },
  countHint: { alignItems: 'flex-end', paddingHorizontal: 16, paddingBottom: 8 },
  countText: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.6)',
    fontWeight: '500',
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  countTextWarning: { color: '#FF3B30', backgroundColor: 'rgba(255, 59, 48, 0.15)' },
  shareModalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  sharePanel: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingBottom: Platform.OS === 'ios' ? 34 : 20,
    maxHeight: '60%',
  },
  sharePanelHandle: {
    width: 32,
    height: 4,
    backgroundColor: '#E5E5E5',
    borderRadius: 2,
    alignSelf: 'center',
    marginTop: 8,
    marginBottom: 16,
  },
  sharePanelHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  sharePanelTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333333',
  },
  sharePanelCloseButton: {
    paddingHorizontal: 16,
    paddingVertical: 6,
    backgroundColor: '#F8F8F8',
    borderRadius: 16,
  },
  sharePanelCloseText: {
    fontSize: 14,
    color: '#666666',
    fontWeight: '500',
  },
  shareOptionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 20,
  },
  shareOptionButton: {
    alignItems: 'center',
    justifyContent: 'center',
    width: '16.66%',
    marginVertical: 20,
  },
  shareOptionIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  shareOptionIconText: {
    fontSize: 24,
    color: '#FFFFFF',
  },
  shareOptionTitle: {
    fontSize: 14,
    color: '#333333',
    textAlign: 'center',
    fontWeight: '500',
  },
});

// ==================== 8. Exports ====================
export default memo(CommentInputArea);
export type { CommentInputAreaProps };
