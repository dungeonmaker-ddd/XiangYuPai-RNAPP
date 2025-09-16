/**
 * 私聊对话页面 - 600-800行单文件结构示例
 * 基于消息系统模块架构设计的实现
 * 
 * TOC (quick jump):
 * [1] Imports
 * [2] Types & Schemas  
 * [3] Constants & Config
 * [4] Utils & Helpers
 * [5] State Management
 * [6] Domain Logic
 * [7] Subcomponents
 * [8] Main Component
 * [9] Styles
 * [10] Exports
 */

// #region [1] Imports (20-30 lines)
import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Image,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { launchImageLibrary, launchCamera } from 'react-native-image-picker';
import WebSocket from 'ws';
// #endregion

// #region [2] Types & Schemas (40-60 lines)
interface ChatUser {
  id: string;
  nickname: string;
  avatar: string;
  isOnline: boolean;
  lastSeen?: Date;
}

interface Message {
  id: string;
  senderId: string;
  receiverId: string;
  content: string;
  type: 'text' | 'image' | 'voice';
  timestamp: Date;
  status: 'sending' | 'sent' | 'read';
  imageUrl?: string;
  voiceUrl?: string;
  voiceDuration?: number;
}

interface ChatScreenProps {
  userId: string;
  conversationId: string;
}

interface ChatState {
  messages: Message[];
  isLoading: boolean;
  isTyping: boolean;
  hasMoreMessages: boolean;
  error: string | null;
}

type MessageStatus = 'sending' | 'sent' | 'read' | 'failed';
type InputMode = 'text' | 'voice';
// #endregion

// #region [3] Constants & Config (20-30 lines)
const CHAT_CONFIG = {
  MESSAGE_LIMIT: 20,
  MAX_MESSAGE_LENGTH: 1000,
  RECONNECT_INTERVAL: 3000,
  TYPING_TIMEOUT: 2000,
  MESSAGE_BUBBLE_MAX_WIDTH: '70%',
  VOICE_MAX_DURATION: 60,
} as const;

const COLORS = {
  PRIMARY: '#8A2BE2',
  SECONDARY: '#9370DB',
  GRAY_LIGHT: '#F5F5F5',
  GRAY_MEDIUM: '#CCCCCC',
  GRAY_DARK: '#666666',
  WHITE: '#FFFFFF',
  BLACK: '#000000',
  GREEN_ONLINE: '#00C851',
  RED_ERROR: '#FF4444',
} as const;

const SPACING = {
  XS: 4,
  SM: 8,
  MD: 16,
  LG: 24,
  XL: 32,
} as const;
// #endregion

// #region [4] Utils & Helpers (40-60 lines)
const formatMessageTime = (timestamp: Date): string => {
  const now = new Date();
  const diff = now.getTime() - timestamp.getTime();
  const minutes = Math.floor(diff / 60000);
  
  if (minutes < 1) return '刚刚';
  if (minutes < 60) return `${minutes}分钟前`;
  if (minutes < 1440) return `${Math.floor(minutes / 60)}小时前`;
  
  return timestamp.toLocaleDateString('zh-CN', {
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  });
};

const formatOnlineStatus = (user: ChatUser): string => {
  if (user.isOnline) return '在线';
  if (!user.lastSeen) return '离线';
  
  const diff = new Date().getTime() - user.lastSeen.getTime();
  const minutes = Math.floor(diff / 60000);
  
  if (minutes < 60) return `${minutes}分钟前在线`;
  if (minutes < 1440) return `${Math.floor(minutes / 60)}小时前在线`;
  return `${Math.floor(minutes / 1440)}天前在线`;
};

const generateMessageId = (): string => {
  return `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};

const validateMessage = (content: string): boolean => {
  return content.trim().length > 0 && content.length <= CHAT_CONFIG.MAX_MESSAGE_LENGTH;
};
// #endregion

// #region [5] State Management (60-80 lines)
const useChatState = (userId: string, conversationId: string) => {
  const [state, setState] = useState<ChatState>({
    messages: [],
    isLoading: false,
    isTyping: false,
    hasMoreMessages: true,
    error: null,
  });
  
  const [inputText, setInputText] = useState('');
  const [inputMode, setInputMode] = useState<InputMode>('text');
  const [currentUser, setCurrentUser] = useState<ChatUser | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  
  const wsRef = useRef<WebSocket | null>(null);
  const scrollViewRef = useRef<ScrollView>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout>();

  const updateMessages = useCallback((newMessages: Message[]) => {
    setState(prev => ({
      ...prev,
      messages: [...prev.messages, ...newMessages].sort(
        (a, b) => a.timestamp.getTime() - b.timestamp.getTime()
      ),
    }));
  }, []);

  const updateMessageStatus = useCallback((messageId: string, status: MessageStatus) => {
    setState(prev => ({
      ...prev,
      messages: prev.messages.map(msg =>
        msg.id === messageId ? { ...msg, status } : msg
      ),
    }));
  }, []);

  const setError = useCallback((error: string | null) => {
    setState(prev => ({ ...prev, error }));
  }, []);

  const setLoading = useCallback((isLoading: boolean) => {
    setState(prev => ({ ...prev, isLoading }));
  }, []);

  return {
    state,
    inputText,
    setInputText,
    inputMode,
    setInputMode,
    currentUser,
    setCurrentUser,
    isConnected,
    setIsConnected,
    wsRef,
    scrollViewRef,
    typingTimeoutRef,
    updateMessages,
    updateMessageStatus,
    setError,
    setLoading,
  };
};
// #endregion

// #region [6] Domain Logic (80-120 lines)
const useChatLogic = (userId: string, conversationId: string) => {
  const chatState = useChatState(userId, conversationId);
  const {
    state,
    inputText,
    setInputText,
    currentUser,
    setCurrentUser,
    isConnected,
    setIsConnected,
    wsRef,
    scrollViewRef,
    updateMessages,
    updateMessageStatus,
    setError,
    setLoading,
  } = chatState;

  // WebSocket连接管理
  const connectWebSocket = useCallback(() => {
    try {
      wsRef.current = new WebSocket(`ws://api.example.com/chat/${conversationId}`);
      
      wsRef.current.onopen = () => {
        setIsConnected(true);
        setError(null);
      };

      wsRef.current.onmessage = (event) => {
        const message = JSON.parse(event.data);
        updateMessages([message]);
        scrollToBottom();
      };

      wsRef.current.onclose = () => {
        setIsConnected(false);
        // 自动重连
        setTimeout(connectWebSocket, CHAT_CONFIG.RECONNECT_INTERVAL);
      };

      wsRef.current.onerror = () => {
        setError('连接失败，请检查网络');
      };
    } catch (error) {
      setError('连接失败');
    }
  }, [conversationId]);

  // 发送文字消息
  const sendTextMessage = useCallback(async () => {
    if (!validateMessage(inputText) || !isConnected) return;

    const message: Message = {
      id: generateMessageId(),
      senderId: userId,
      receiverId: currentUser?.id || '',
      content: inputText.trim(),
      type: 'text',
      timestamp: new Date(),
      status: 'sending',
    };

    updateMessages([message]);
    setInputText('');
    scrollToBottom();

    try {
      wsRef.current?.send(JSON.stringify(message));
      updateMessageStatus(message.id, 'sent');
    } catch (error) {
      updateMessageStatus(message.id, 'failed');
    }
  }, [inputText, isConnected, userId, currentUser]);

  // 发送图片消息
  const sendImageMessage = useCallback(async (imageUri: string) => {
    if (!isConnected) return;

    const message: Message = {
      id: generateMessageId(),
      senderId: userId,
      receiverId: currentUser?.id || '',
      content: '[图片]',
      type: 'image',
      timestamp: new Date(),
      status: 'sending',
      imageUrl: imageUri,
    };

    updateMessages([message]);
    scrollToBottom();

    try {
      // 上传图片并发送消息
      wsRef.current?.send(JSON.stringify(message));
      updateMessageStatus(message.id, 'sent');
    } catch (error) {
      updateMessageStatus(message.id, 'failed');
    }
  }, [isConnected, userId, currentUser]);

  // 滚动到底部
  const scrollToBottom = useCallback(() => {
    setTimeout(() => {
      scrollViewRef.current?.scrollToEnd({ animated: true });
    }, 100);
  }, []);

  // 加载历史消息
  const loadMoreMessages = useCallback(async () => {
    if (state.isLoading || !state.hasMoreMessages) return;

    setLoading(true);
    try {
      // 模拟API调用
      const response = await fetch(`/api/messages/${conversationId}?limit=${CHAT_CONFIG.MESSAGE_LIMIT}`);
      const newMessages = await response.json();
      updateMessages(newMessages);
    } catch (error) {
      setError('加载消息失败');
    } finally {
      setLoading(false);
    }
  }, [conversationId, state.isLoading, state.hasMoreMessages]);

  return {
    ...chatState,
    connectWebSocket,
    sendTextMessage,
    sendImageMessage,
    scrollToBottom,
    loadMoreMessages,
  };
};
// #endregion

// #region [7] Subcomponents (150-200 lines)
// 聊天头部组件
const ChatHeader: React.FC<{ user: ChatUser; onBack: () => void }> = ({ user, onBack }) => (
  <View style={styles.header}>
    <TouchableOpacity onPress={onBack} style={styles.backButton}>
      <Text style={styles.backText}>{'<'}</Text>
    </TouchableOpacity>
    <View style={styles.userInfo}>
      <Text style={styles.userName}>{user.nickname}</Text>
      <Text style={[styles.userStatus, { color: user.isOnline ? COLORS.GREEN_ONLINE : COLORS.GRAY_DARK }]}>
        {formatOnlineStatus(user)}
      </Text>
    </View>
  </View>
);

// 消息气泡组件
const MessageBubble: React.FC<{ message: Message; isOwn: boolean }> = ({ message, isOwn }) => (
  <View style={[styles.messageContainer, isOwn ? styles.ownMessage : styles.otherMessage]}>
    {!isOwn && (
      <Image source={{ uri: message.senderId }} style={styles.avatar} />
    )}
    <View style={[
      styles.messageBubble,
      isOwn ? styles.ownBubble : styles.otherBubble
    ]}>
      {message.type === 'image' ? (
        <Image source={{ uri: message.imageUrl }} style={styles.messageImage} />
      ) : (
        <Text style={[styles.messageText, { color: isOwn ? COLORS.WHITE : COLORS.BLACK }]}>
          {message.content}
        </Text>
      )}
    </View>
    {isOwn && (
      <View style={styles.messageStatus}>
        {message.status === 'sending' && <Text style={styles.statusText}>⏳</Text>}
        {message.status === 'sent' && <Text style={styles.statusText}>✓</Text>}
        {message.status === 'read' && <Text style={styles.statusText}>✓✓</Text>}
        {message.status === 'failed' && <Text style={styles.statusText}>❌</Text>}
      </View>
    )}
  </View>
);

// 消息输入组件
const MessageInput: React.FC<{
  value: string;
  onChangeText: (text: string) => void;
  onSend: () => void;
  onImagePicker: () => void;
  onCamera: () => void;
}> = ({ value, onChangeText, onSend, onImagePicker, onCamera }) => (
  <View style={styles.inputContainer}>
    <TouchableOpacity onPress={onCamera} style={styles.actionButton}>
      <Text style={styles.actionText}>📷</Text>
    </TouchableOpacity>
    <TouchableOpacity onPress={onImagePicker} style={styles.actionButton}>
      <Text style={styles.actionText}>🖼️</Text>
    </TouchableOpacity>
    <TextInput
      style={styles.textInput}
      value={value}
      onChangeText={onChangeText}
      placeholder="请输入内容..."
      multiline
      maxLength={CHAT_CONFIG.MAX_MESSAGE_LENGTH}
    />
    <TouchableOpacity
      onPress={onSend}
      style={[styles.sendButton, { opacity: value.trim() ? 1 : 0.5 }]}
      disabled={!value.trim()}
    >
      <Text style={styles.sendText}>📤</Text>
    </TouchableOpacity>
  </View>
);

// 时间分隔线组件
const TimeDivider: React.FC<{ timestamp: Date }> = ({ timestamp }) => (
  <View style={styles.timeDivider}>
    <View style={styles.dividerLine} />
    <Text style={styles.dividerText}>{formatMessageTime(timestamp)}</Text>
    <View style={styles.dividerLine} />
  </View>
);
// #endregion

// #region [8] Main Component (100-150 lines)
const ChatScreen: React.FC<ChatScreenProps> = ({ userId, conversationId }) => {
  const navigation = useNavigation();
  const route = useRoute();
  
  const {
    state,
    inputText,
    setInputText,
    currentUser,
    scrollViewRef,
    connectWebSocket,
    sendTextMessage,
    sendImageMessage,
    scrollToBottom,
    loadMoreMessages,
  } = useChatLogic(userId, conversationId);

  // 初始化
  useEffect(() => {
    connectWebSocket();
    loadMoreMessages();
    
    // 设置当前用户信息（从路由参数获取）
    const userInfo = route.params?.userInfo;
    if (userInfo) {
      setCurrentUser(userInfo);
    }

    return () => {
      wsRef.current?.close();
    };
  }, []);

  // 处理图片选择
  const handleImagePicker = useCallback(() => {
    Alert.alert(
      '选择图片',
      '请选择图片来源',
      [
        { text: '取消', style: 'cancel' },
        { text: '相册', onPress: () => openImageLibrary() },
        { text: '拍照', onPress: () => openCamera() },
      ]
    );
  }, []);

  const openImageLibrary = useCallback(() => {
    launchImageLibrary({ mediaType: 'photo' }, (response) => {
      if (response.assets?.[0]?.uri) {
        sendImageMessage(response.assets[0].uri);
      }
    });
  }, [sendImageMessage]);

  const openCamera = useCallback(() => {
    launchCamera({ mediaType: 'photo' }, (response) => {
      if (response.assets?.[0]?.uri) {
        sendImageMessage(response.assets[0].uri);
      }
    });
  }, [sendImageMessage]);

  // 处理发送消息
  const handleSend = useCallback(() => {
    sendTextMessage();
  }, [sendTextMessage]);

  // 渲染消息列表
  const renderMessages = () => {
    let lastMessageDate: Date | null = null;
    
    return state.messages.map((message, index) => {
      const showTimeDivider = !lastMessageDate || 
        message.timestamp.getTime() - lastMessageDate.getTime() > 5 * 60 * 1000;
      
      lastMessageDate = message.timestamp;
      
      return (
        <React.Fragment key={message.id}>
          {showTimeDivider && <TimeDivider timestamp={message.timestamp} />}
          <MessageBubble 
            message={message} 
            isOwn={message.senderId === userId}
          />
        </React.Fragment>
      );
    });
  };

  if (!currentUser) {
    return (
      <View style={styles.loadingContainer}>
        <Text>加载中...</Text>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView 
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ChatHeader 
        user={currentUser} 
        onBack={() => navigation.goBack()} 
      />
      
      <ScrollView
        ref={scrollViewRef}
        style={styles.messagesContainer}
        onContentSizeChange={scrollToBottom}
      >
        {renderMessages()}
      </ScrollView>

      <MessageInput
        value={inputText}
        onChangeText={setInputText}
        onSend={handleSend}
        onImagePicker={handleImagePicker}
        onCamera={openCamera}
      />
      
      {Platform.OS === 'ios' && <View style={styles.safeArea} />}
    </KeyboardAvoidingView>
  );
};
// #endregion

// #region [9] Styles (60-90 lines)
const styles = {
  container: {
    flex: 1,
    backgroundColor: COLORS.WHITE,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SPACING.MD,
    paddingVertical: SPACING.SM,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.GRAY_LIGHT,
  },
  backButton: {
    padding: SPACING.SM,
  },
  backText: {
    fontSize: 24,
    color: COLORS.BLACK,
  },
  userInfo: {
    flex: 1,
    alignItems: 'center',
  },
  userName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.BLACK,
  },
  userStatus: {
    fontSize: 14,
    marginTop: 2,
  },
  messagesContainer: {
    flex: 1,
    paddingHorizontal: SPACING.MD,
  },
  messageContainer: {
    flexDirection: 'row',
    marginVertical: SPACING.XS,
  },
  ownMessage: {
    justifyContent: 'flex-end',
  },
  otherMessage: {
    justifyContent: 'flex-start',
  },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    marginRight: SPACING.SM,
  },
  messageBubble: {
    maxWidth: CHAT_CONFIG.MESSAGE_BUBBLE_MAX_WIDTH,
    paddingHorizontal: SPACING.MD,
    paddingVertical: SPACING.SM,
    borderRadius: 12,
  },
  ownBubble: {
    backgroundColor: COLORS.PRIMARY,
    borderBottomRightRadius: 4,
  },
  otherBubble: {
    backgroundColor: COLORS.GRAY_LIGHT,
    borderBottomLeftRadius: 4,
  },
  messageText: {
    fontSize: 16,
    lineHeight: 20,
  },
  messageImage: {
    width: 200,
    height: 200,
    borderRadius: 8,
  },
  messageStatus: {
    alignSelf: 'flex-end',
    marginLeft: SPACING.XS,
  },
  statusText: {
    fontSize: 12,
    color: COLORS.GRAY_DARK,
  },
  timeDivider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: SPACING.MD,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: COLORS.GRAY_MEDIUM,
  },
  dividerText: {
    fontSize: 12,
    color: COLORS.GRAY_DARK,
    backgroundColor: COLORS.WHITE,
    paddingHorizontal: SPACING.SM,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    paddingHorizontal: SPACING.MD,
    paddingVertical: SPACING.SM,
    borderTopWidth: 1,
    borderTopColor: COLORS.GRAY_LIGHT,
  },
  actionButton: {
    padding: SPACING.SM,
    marginRight: SPACING.XS,
  },
  actionText: {
    fontSize: 24,
  },
  textInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: COLORS.GRAY_MEDIUM,
    borderRadius: 20,
    paddingHorizontal: SPACING.MD,
    paddingVertical: SPACING.SM,
    maxHeight: 120,
    fontSize: 16,
  },
  sendButton: {
    marginLeft: SPACING.SM,
    padding: SPACING.SM,
    backgroundColor: COLORS.PRIMARY,
    borderRadius: 20,
  },
  sendText: {
    fontSize: 20,
  },
  safeArea: {
    height: 34,
    backgroundColor: COLORS.WHITE,
  },
};
// #endregion

// #region [10] Exports (5-10 lines)
export default ChatScreen;
export type { ChatScreenProps, Message, ChatUser };
// #endregion