/**
 * 评论输入组件
 * 提供评论输入、表情选择、图片上传等功能
 */

import React, { memo, useState, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Animated,
  Keyboard,
  Alert,
} from 'react-native';
import { CommentInputProps } from '../types';

const CommentInput: React.FC<CommentInputProps> = ({
  value,
  placeholder = '写评论...',
  replyToUser,
  loading = false,
  onValueChange,
  onSubmit,
  onCancel,
}) => {
  const [showEmojiPanel, setShowEmojiPanel] = useState(false);
  const [inputHeight, setInputHeight] = useState(36);
  const animatedHeight = useRef(new Animated.Value(36)).current;
  const inputRef = useRef<TextInput>(null);

  // 常用表情列表
  const commonEmojis = [
    '😀', '😂', '🥰', '😍', '🤔', '👍', '❤️', '🔥',
    '😭', '😊', '😎', '🥺', '😴', '🤗', '👏', '🎉',
    '😱', '🙄', '😤', '💪', '🤝', '🙏', '💕', '✨',
  ];

  // 处理文本变化
  const handleTextChange = (text: string) => {
    onValueChange(text);
  };

  // 处理输入框高度变化
  const handleContentSizeChange = (event: any) => {
    const newHeight = Math.min(Math.max(36, event.nativeEvent.contentSize.height), 100);
    if (newHeight !== inputHeight) {
      setInputHeight(newHeight);
      Animated.timing(animatedHeight, {
        toValue: newHeight,
        duration: 200,
        useNativeDriver: false,
      }).start();
    }
  };

  // 处理表情选择
  const handleEmojiSelect = (emoji: string) => {
    const newText = value + emoji;
    onValueChange(newText);
    setShowEmojiPanel(false);
    inputRef.current?.focus();
  };

  // 处理发送
  const handleSend = () => {
    if (!value.trim()) {
      Alert.alert('提示', '请输入评论内容');
      return;
    }
    onSubmit();
  };

  // 处理表情面板切换
  const toggleEmojiPanel = () => {
    if (showEmojiPanel) {
      Keyboard.dismiss();
    }
    setShowEmojiPanel(!showEmojiPanel);
  };

  // 处理拍照
  const handleTakePhoto = () => {
    Alert.alert(
      '添加图片',
      '选择图片来源',
      [
        { text: '取消', style: 'cancel' },
        { text: '拍照', onPress: () => console.log('拍照') },
        { text: '相册', onPress: () => console.log('相册') },
      ]
    );
  };

  return (
    <View style={styles.container}>
      {/* 回复提示 */}
      {replyToUser && (
        <View style={styles.replyHint}>
          <Text style={styles.replyText}>回复 @{replyToUser}</Text>
          {onCancel && (
            <TouchableOpacity onPress={onCancel} style={styles.cancelButton}>
              <Text style={styles.cancelText}>✕</Text>
            </TouchableOpacity>
          )}
        </View>
      )}

      {/* 输入框区域 */}
      <View style={styles.inputContainer}>
        {/* 主输入框 */}
        <Animated.View style={[styles.inputWrapper, { height: animatedHeight }]}>
          <TextInput
            ref={inputRef}
            style={styles.textInput}
            value={value}
            onChangeText={handleTextChange}
            onContentSizeChange={handleContentSizeChange}
            placeholder={placeholder}
            placeholderTextColor="rgba(255, 255, 255, 0.5)"
            multiline
            maxLength={500}
            editable={!loading}
          />
          
          {/* 输入框内的功能按钮 */}
          <View style={styles.inputActions}>
            {/* 表情按钮 */}
            <TouchableOpacity
              style={styles.actionButton}
              onPress={toggleEmojiPanel}
              activeOpacity={0.7}
            >
              <Text style={styles.actionIcon}>😊</Text>
            </TouchableOpacity>

            {/* 拍照按钮 */}
            <TouchableOpacity
              style={styles.actionButton}
              onPress={handleTakePhoto}
              activeOpacity={0.7}
            >
              <Text style={styles.actionIcon}>📷</Text>
            </TouchableOpacity>
          </View>
        </Animated.View>

        {/* 发送按钮 */}
        <TouchableOpacity
          style={[
            styles.sendButton,
            (value.trim() && !loading) && styles.sendButtonActive,
          ]}
          onPress={handleSend}
          disabled={!value.trim() || loading}
          activeOpacity={0.8}
        >
          <Text style={[
            styles.sendIcon,
            (value.trim() && !loading) && styles.sendIconActive,
          ]}>
            {loading ? '⏳' : '📤'}
          </Text>
        </TouchableOpacity>
      </View>

      {/* 表情面板 */}
      {showEmojiPanel && (
        <View style={styles.emojiPanel}>
          <View style={styles.emojiGrid}>
            {commonEmojis.map((emoji, index) => (
              <TouchableOpacity
                key={index}
                style={styles.emojiButton}
                onPress={() => handleEmojiSelect(emoji)}
                activeOpacity={0.7}
              >
                <Text style={styles.emojiText}>{emoji}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      )}

      {/* 字数提示 */}
      {value.length > 400 && (
        <View style={styles.countHint}>
          <Text style={[
            styles.countText,
            value.length >= 500 && styles.countTextWarning,
          ]}>
            {value.length}/500
          </Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'rgba(0, 0, 0, 0.9)',
    paddingBottom: 34, // 为iPhone安全区域预留空间
  },
  replyHint: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  replyText: {
    fontSize: 14,
    color: '#007AFF',
  },
  cancelButton: {
    padding: 4,
  },
  cancelText: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.6)',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  inputWrapper: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginRight: 12,
    flexDirection: 'row',
    alignItems: 'flex-end',
  },
  textInput: {
    flex: 1,
    fontSize: 16,
    color: '#FFFFFF',
    lineHeight: 20,
    maxHeight: 100,
    textAlignVertical: 'top',
  },
  inputActions: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 8,
  },
  actionButton: {
    padding: 4,
    marginLeft: 4,
  },
  actionIcon: {
    fontSize: 20,
  },
  sendButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  sendButtonActive: {
    backgroundColor: '#8A2BE2',
  },
  sendIcon: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.6)',
  },
  sendIconActive: {
    color: '#FFFFFF',
  },
  emojiPanel: {
    backgroundColor: 'rgba(0, 0, 0, 0.95)',
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.1)',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  emojiGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  emojiButton: {
    width: '12.5%',
    aspectRatio: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 4,
  },
  emojiText: {
    fontSize: 24,
  },
  countHint: {
    alignItems: 'flex-end',
    paddingHorizontal: 16,
    paddingBottom: 8,
  },
  countText: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.6)',
  },
  countTextWarning: {
    color: '#FF3B30',
  },
});

export default memo(CommentInput);
