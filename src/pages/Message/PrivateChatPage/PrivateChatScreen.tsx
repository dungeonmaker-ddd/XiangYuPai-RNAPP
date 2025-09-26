/**
 * 私聊对话页面
 * 一对一聊天界面，专注于布局和交互控制
 * 数据逻辑由MessageList子模块处理
 */

import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  KeyboardAvoidingView,
  Platform,
  Alert,
  Keyboard,
  TouchableWithoutFeedback
} from 'react-native';
import { User, MessageStatus } from '../types';
import { STYLES } from '../constants';
import ChatHeaderArea from './ChatHeaderArea';
import MessageListArea from './MessageListArea';
import InputArea from './InputArea';
import { ExtendedChatMessage, DynamicContent } from './MessageBubbleArea';

// ==================== Types ====================
interface PrivateChatScreenProps {
  navigation: any;
  route: {
    params: {
      userId: string;
      userInfo: User;
    };
  };
}

// ==================== Constants ====================
const MOCK_USER_INFO: User = {
  id: 'user1',
  nickname: '用户昵称',
  avatar: '',
  isOnline: true,
  lastActiveTime: '2024-12-19T10:30:00Z',
  signature: '用户个性签名'
};

// ==================== Main Component ====================
const PrivateChatScreen: React.FC<PrivateChatScreenProps> = ({ navigation, route }) => {
  // ==================== State Management ====================
  const [inputText, setInputText] = useState('');
  const [userInfo, setUserInfo] = useState<User>(MOCK_USER_INFO);
  const [pendingMessage, setPendingMessage] = useState<ExtendedChatMessage | null>(null);
  const [keyboardHeight, setKeyboardHeight] = useState(0);

  // ==================== Message Creation Logic ====================
  // 生成唯一消息ID
  const generateMessageId = useCallback(() => {
    return `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }, []);

  const createTextMessage = useCallback((content: string): ExtendedChatMessage => {
    return {
      id: generateMessageId(),
      senderId: 'currentUser',
      receiverId: userInfo.id,
      content: content.trim(),
      type: 'text',
      timestamp: new Date().toISOString(),
      status: MessageStatus.SENDING,
      isFromMe: true
    };
  }, [userInfo.id, generateMessageId]);

  const createDynamicMessage = useCallback((dynamicContent: DynamicContent): ExtendedChatMessage => {
    return {
      id: generateMessageId(),
      senderId: 'currentUser',
      receiverId: userInfo.id,
      content: '分享了一个动态',
      type: 'dynamic',
      timestamp: new Date().toISOString(),
      status: MessageStatus.SENDING,
      isFromMe: true,
      dynamicContent
    };
  }, [userInfo.id, generateMessageId]);

  // ==================== Interaction Logic ====================
  const handleSendPress = useCallback(() => {
    if (!inputText.trim()) return;
    
    // 创建新消息并通过MessageList发送
    const newMessage = createTextMessage(inputText);
    setPendingMessage(newMessage);
    setInputText(''); // 立即清空输入框
  }, [inputText, createTextMessage]);

  const sendDynamicMessage = useCallback((dynamicContent: DynamicContent) => {
    // 创建动态消息并通过MessageList发送
    const newMessage = createDynamicMessage(dynamicContent);
    setPendingMessage(newMessage);
  }, [createDynamicMessage]);

  // 消息发送完成的回调
  const handleMessageSent = useCallback(() => {
    setPendingMessage(null);
  }, []);

  const handleCameraPicker = useCallback(() => {
    console.log('打开相机拍照');
    // TODO: 集成相机功能
  }, []);

  const handleImagePicker = useCallback(() => {
    Alert.alert(
      '选择内容',
      '请选择要发送的内容类型',
      [
        { text: '取消', style: 'cancel' },
        { text: '相册', onPress: () => console.log('打开相册') },
        { 
          text: '发送动态', 
          onPress: () => {
            // 发送测试动态消息
            const testDynamic: DynamicContent = {
              id: `dynamic_${Date.now()}`,
              photos: [
                `https://picsum.photos/300/360?random=${Math.floor(Math.random() * 100)}`
              ],
              title: '测试动态消息 🎉',
              likes: Math.floor(Math.random() * 100),
              timestamp: new Date().toISOString()
            };
            sendDynamicMessage(testDynamic);
          }
        }
      ]
    );
  }, [sendDynamicMessage]);

  const handleMessagePress = useCallback((message: ExtendedChatMessage) => {
    if (message.type === 'image') {
      console.log('查看图片详情');
    } else if (message.type === 'dynamic') {
      console.log('查看动态详情:', message.dynamicContent?.title);
    }
  }, []);

  const handleDynamicPress = useCallback((dynamicId: string, photoIndex: number) => {
    console.log('查看动态图片:', dynamicId, photoIndex);
    // 这里可以打开图片查看器或跳转到动态详情页
  }, []);

  const handleRetryMessage = useCallback((messageId: string) => {
    console.log('重发消息:', messageId);
    // TODO: 通过MessageList组件或数据层重发消息
  }, []);

  // 点击空白区域收起键盘
  const dismissKeyboard = useCallback(() => {
    Keyboard.dismiss();
  }, []);

  // ==================== Effects ====================
  useEffect(() => {
    // 获取用户信息
    if (route.params?.userInfo) {
      setUserInfo(route.params.userInfo);
    }
  }, [route.params]);

  // 键盘事件监听
  useEffect(() => {
    const keyboardWillShowListener = Keyboard.addListener(
      Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow',
      (e) => {
        setKeyboardHeight(e.endCoordinates.height);
      }
    );

    const keyboardWillHideListener = Keyboard.addListener(
      Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide',
      () => {
        setKeyboardHeight(0);
      }
    );

    return () => {
      keyboardWillShowListener.remove();
      keyboardWillHideListener.remove();
    };
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={STYLES.COLORS.WHITE} />
      
      {/* 对话导航栏 */}
      <ChatHeaderArea
        userInfo={userInfo}
        onBack={() => navigation.goBack()}
      />
      
      <TouchableWithoutFeedback onPress={dismissKeyboard}>
        <KeyboardAvoidingView
          style={styles.chatContainer}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          keyboardVerticalOffset={Platform.OS === 'ios' ? 88 : 0}
        >
          {/* 消息列表区域 - 由MessageList子模块处理 */}
          <TouchableWithoutFeedback onPress={dismissKeyboard}>
            <View style={styles.messageContainer}>
              <MessageListArea
                userInfo={userInfo}
                pendingMessage={pendingMessage}
                onMessageSent={handleMessageSent}
                onMessagePress={handleMessagePress}
                onDynamicPress={handleDynamicPress}
                onRetry={handleRetryMessage}
              />
            </View>
          </TouchableWithoutFeedback>
          
          {/* 消息输入区域 */}
          <InputArea
            value={inputText}
            onChangeText={setInputText}
            onSend={handleSendPress}
            onImagePicker={handleImagePicker}
            onCameraPicker={handleCameraPicker}
            placeholder="请输入内容..."
          />
        </KeyboardAvoidingView>
      </TouchableWithoutFeedback>
    </SafeAreaView>
  );
};

// ==================== Styles ====================
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: STYLES.COLORS.WHITE
  },
  chatContainer: {
    flex: 1
  },
  messageContainer: {
    flex: 1
  }
});

export default PrivateChatScreen;
