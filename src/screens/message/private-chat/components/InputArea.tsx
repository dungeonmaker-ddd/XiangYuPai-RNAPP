/**
 * 消息输入区域组件
 * 包含输入框、功能按钮和发送按钮
 * 基于消息系统模块架构设计实现
 */

import React, { useState, useRef } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Platform, Image, Animated } from 'react-native';
import { STYLES } from '../../constants';

interface InputAreaProps {
  value: string;
  onChangeText: (text: string) => void;
  onSend: () => void;
  onImagePicker?: () => void;
  onCameraPicker?: () => void;
  placeholder?: string;
}

const InputArea: React.FC<InputAreaProps> = ({
  value,
  onChangeText,
  onSend,
  onImagePicker,
  onCameraPicker,
  placeholder = '请输入内容...'
}) => {
  const canSend = value.trim().length > 0;
  
  // 调整输入框高度以匹配42px容器和36x36按钮
  const SINGLE_LINE_HEIGHT = 16 + 10; // 更紧凑的高度计算
  const MIN_HEIGHT = 30; // 调整最小高度以适应42px容器
  const MAX_HEIGHT = 36;  // 限制最大高度以适应容器
  
  const [inputHeight, setInputHeight] = useState(MIN_HEIGHT);
  const heightAnimation = useRef(new Animated.Value(MIN_HEIGHT)).current;
  
  // 处理文本内容变化
  const handleTextChange = (text: string) => {
    onChangeText(text);
    
    // 如果文本清空，重置高度
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
    // 根据内容高度计算新的输入框高度，但限制在容器范围内
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
    resetInputHeight(); // 发送后重置高度
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
              maxLength={1000}
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
    alignItems: 'center', // 改为居中对齐以适应42px高度
    paddingHorizontal: STYLES.SPACING.SM, // 减少水平边距以适应48px宽度要求
    paddingVertical: 3,   // 减少垂直边距以适应42px高度
    minHeight: 42, // 设置容器高度为42px
    maxHeight: 42  // 限制最大高度为42px
  },
  functionsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: STYLES.SPACING.SM
  },
  functionButton: {
    width: 32,  // 调整按钮尺寸为32x32
    height: 32,
    borderRadius: 16,
    backgroundColor: STYLES.COLORS.LIGHT_GRAY,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: STYLES.SPACING.SM, // 保持按钮间距
    // 0.2s缩放动画效果通过activeOpacity实现
  },
  functionIcon: {
    width: 20,  // 调整图标尺寸，保持合适比例
    height: 20,
    tintColor: STYLES.COLORS.GRAY
  },
  inputWrapper: {
    flex: 1,
    marginRight: STYLES.SPACING.SM
  },
  textInputContainer: {
    borderWidth: 1,
    borderColor: STYLES.COLORS.BORDER_GRAY,
    borderRadius: 20, // 20px圆角，符合架构设计
    backgroundColor: STYLES.COLORS.WHITE,
    justifyContent: 'center'
  },
  textInput: {
    paddingHorizontal: 12, // 减少水平内边距以适应紧凑设计
    paddingVertical: 5,    // 减少垂直内边距以适应42px容器
    fontSize: 15,          // 稍微减小字体以适应紧凑设计
    lineHeight: 18,        // 减小行高以适应容器
    color: STYLES.COLORS.BLACK,
    backgroundColor: 'transparent',
    textAlignVertical: 'center', // 单行时居中对齐
    borderWidth: 0 // 移除边框，由容器处理
  },
  sendButton: {
    width: 36,  // 发送按钮宽度36px
    height: 36, // 发送按钮高度36px，正方形
    borderRadius: 18, // 圆角半径
    backgroundColor: '#F8F8F8', // F8背景色
    borderWidth: 1, // 添加边框
    borderColor: STYLES.COLORS.GRAY, // 灰色边框
    justifyContent: 'center',
    alignItems: 'center'
  },
  sendIcon: {
    fontSize: 16,  // 保持合适的图标字体大小
    color: STYLES.COLORS.GRAY // 改为灰色箭头
  },
  bottomPadding: {
    height: 32, // 44px下方留白
    backgroundColor: STYLES.COLORS.WHITE
  },
  safeArea: {
    height: STYLES.SIZES.SAFE_AREA_BOTTOM,
    backgroundColor: STYLES.COLORS.WHITE
  }
});

export default InputArea;
