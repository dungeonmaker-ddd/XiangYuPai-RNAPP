/**
 * 消息输入区域组件
 * 包含输入框、功能按钮和发送按钮
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
import React, { useState, useRef } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Platform, Image, Animated } from 'react-native';
import { STYLES } from '../../constants';

// ==================== 2. Types & Schema ====================
interface InputAreaProps {
  value: string;
  onChangeText: (text: string) => void;
  onSend: () => void;
  onImagePicker?: () => void;
  onCameraPicker?: () => void;
  placeholder?: string;
}

// ==================== 3. Constants & Config ====================
const SINGLE_LINE_HEIGHT = 16 + 10;
const MIN_HEIGHT = 30;
const MAX_HEIGHT = 36;
const CONTAINER_HEIGHT = 42;
const BUTTON_SIZE = 32;
const SEND_BUTTON_SIZE = 36;
const FUNCTION_ICON_SIZE = 20;
const MAX_LENGTH = 1000;

// ==================== 4. Utils & Helpers ====================
// 工具函数在组件内部实现

// ==================== 5. State Management ====================
// 状态管理在主组件中实现

// ==================== 6. Domain Logic ====================
// 业务逻辑由父组件处理

// ==================== 7. UI Components & Rendering ====================
const InputArea: React.FC<InputAreaProps> = ({
  value,
  onChangeText,
  onSend,
  onImagePicker,
  onCameraPicker,
  placeholder = '请输入内容...'
}) => {
  const canSend = value.trim().length > 0;
  const [inputHeight, setInputHeight] = useState(MIN_HEIGHT);
  const heightAnimation = useRef(new Animated.Value(MIN_HEIGHT)).current;
  
  // 处理文本内容变化
  const handleTextChange = (text: string) => {
    onChangeText(text);
    
    if (text.trim().length === 0) {
      resetInputHeight();
    }
  };
  
  // 重置输入框高度
  const resetInputHeight = () => {
    setInputHeight(MIN_HEIGHT);
    
    Animated.timing(heightAnimation, {
      toValue: MIN_HEIGHT,
      duration: 200,
      useNativeDriver: false,
    }).start();
  };
  
  // 处理输入框内容尺寸变化
  const handleContentSizeChange = (event: any) => {
    const { height } = event.nativeEvent.contentSize;
    const newHeight = Math.max(MIN_HEIGHT, Math.min(MAX_HEIGHT, height + 10));
    
    if (newHeight !== inputHeight) {
      setInputHeight(newHeight);
      Animated.timing(heightAnimation, {
        toValue: newHeight,
        duration: 150,
        useNativeDriver: false,
      }).start();
    }
  };
  
  // 处理发送消息
  const handleSend = () => {
    onSend();
    resetInputHeight();
  };

  return (
    <View style={styles.container}>
      <View style={styles.inputContainer}>
        {/* 功能扩展区域 */}
        <View style={styles.functionsContainer}>
          {/* 拍照按钮 */}
          {onCameraPicker && (
            <TouchableOpacity
              style={styles.functionButton}
              onPress={onCameraPicker}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              activeOpacity={0.8}
            >
              <Image 
                source={require('../pchat/立刻拍照.png')} 
                style={styles.functionIcon}
                resizeMode="contain"
              />
            </TouchableOpacity>
          )}
          
          {/* 相册按钮 */}
          {onImagePicker && (
            <TouchableOpacity
              style={styles.functionButton}
              onPress={onImagePicker}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              activeOpacity={0.8}
            >
              <Image 
                source={require('../pchat/选择图片.png')} 
                style={styles.functionIcon}
                resizeMode="contain"
              />
            </TouchableOpacity>
          )}
        </View>
        
        {/* 消息输入框 */}
        <View style={styles.inputWrapper}>
          <Animated.View style={[styles.textInputContainer, { height: heightAnimation }]}>
            <TextInput
              style={[styles.textInput, { height: '100%' }]}
              value={value}
              onChangeText={handleTextChange}
              onContentSizeChange={handleContentSizeChange}
              placeholder={placeholder}
              placeholderTextColor={STYLES.COLORS.GRAY}
              multiline
              maxLength={MAX_LENGTH}
              blurOnSubmit={false}
              returnKeyType="send"
              onSubmitEditing={canSend ? handleSend : undefined}
            />
          </Animated.View>
        </View>
        
        {/* 发送按钮 */}
        <TouchableOpacity
          style={[
            styles.sendButton,
            {
              opacity: canSend ? 1 : 0.5
            }
          ]}
          onPress={handleSend}
          disabled={!canSend}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          activeOpacity={canSend ? 0.9 : 1}
        >
          <Text style={styles.sendIcon}>➤</Text>
        </TouchableOpacity>
      </View>
      
      {/* 下方留白区域 */}
      <View style={styles.bottomPadding} />
      
      {/* 安全区域适配 */}
      {Platform.OS === 'ios' && (
        <View style={styles.safeArea} />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: STYLES.COLORS.WHITE,
    borderTopWidth: 1,
    borderTopColor: STYLES.COLORS.BORDER_GRAY
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: STYLES.SPACING.SM,
    paddingVertical: 3,
    minHeight: CONTAINER_HEIGHT,
    maxHeight: CONTAINER_HEIGHT
  },
  functionsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: STYLES.SPACING.SM
  },
  functionButton: {
    width: BUTTON_SIZE,
    height: BUTTON_SIZE,
    borderRadius: 16,
    backgroundColor: STYLES.COLORS.LIGHT_GRAY,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: STYLES.SPACING.SM,
  },
  functionIcon: {
    width: FUNCTION_ICON_SIZE,
    height: FUNCTION_ICON_SIZE,
    tintColor: STYLES.COLORS.GRAY
  },
  inputWrapper: {
    flex: 1,
    marginRight: STYLES.SPACING.SM
  },
  textInputContainer: {
    borderWidth: 1,
    borderColor: STYLES.COLORS.BORDER_GRAY,
    borderRadius: 20,
    backgroundColor: STYLES.COLORS.WHITE,
    justifyContent: 'center'
  },
  textInput: {
    paddingHorizontal: 12,
    paddingVertical: 5,
    fontSize: 15,
    lineHeight: 18,
    color: STYLES.COLORS.BLACK,
    backgroundColor: 'transparent',
    textAlignVertical: 'center',
    borderWidth: 0
  },
  sendButton: {
    width: SEND_BUTTON_SIZE,
    height: SEND_BUTTON_SIZE,
    borderRadius: 18,
    backgroundColor: '#F8F8F8',
    borderWidth: 1,
    borderColor: STYLES.COLORS.GRAY,
    justifyContent: 'center',
    alignItems: 'center'
  },
  sendIcon: {
    fontSize: 16,
    color: STYLES.COLORS.GRAY
  },
  bottomPadding: {
    height: 32,
    backgroundColor: STYLES.COLORS.WHITE
  },
  safeArea: {
    height: STYLES.SIZES.SAFE_AREA_BOTTOM,
    backgroundColor: STYLES.COLORS.WHITE
  }
});

// ==================== 8. Exports ====================
export default InputArea;
