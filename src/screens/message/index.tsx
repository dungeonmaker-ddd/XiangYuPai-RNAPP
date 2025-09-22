// #region 1. File Banner & TOC
/**
 * 消息系统页面父组件 - 集成所有子组件
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
// #endregion

// #region 2. Imports
import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  Alert,
  FlatList
} from 'react-native';

// 内部模块导入
import { MessageCategory, RecentChat } from './types';
import { MESSAGE_CATEGORIES, STYLES } from './constants';
import { useMessage } from './useMessage';
import { navigateToCategory, navigateToChat } from './navigateToTarget';

// 组件区域导入
import MessageHeaderArea from './MessageHeaderArea';
import MessageCategoryArea from './MessageCategoryArea';
import RecentChatListArea from './RecentChatListArea';
// #endregion

// #region 3. Types & Schema
interface MessageScreenProps {
  navigation: {
    navigate: (screen: string, params?: any) => void;
    goBack: () => void;
  };
}

interface MessageScreenState {
  loading: boolean;
  refreshing: boolean;
  error: string | null;
}
// #endregion

// #region 4. Constants & Config
const REFRESH_DURATION = 800;
const SECTION_TYPES = {
  HEADER: 'header',
  CATEGORIES: 'categories', 
  CHATS: 'chats'
} as const;
// #endregion

// #region 5. Utils & Helpers
const createSections = () => [
  { type: SECTION_TYPES.CATEGORIES, id: 'categories' },
  { type: SECTION_TYPES.CHATS, id: 'chats' }
];

const handleApiError = (error: unknown): string => {
  return error instanceof Error ? error.message : '加载消息数据失败';
};
// #endregion

// #region 6. State Management
const useMessageScreen = (navigation: MessageScreenProps['navigation']) => {
  const [screenState, setScreenState] = useState<MessageScreenState>({
    loading: false,
    refreshing: false,
    error: null
  });

  const { 
    categories, 
    loadMessageData, 
    clearAllChats 
  } = useMessage();

  const handleRefresh = useCallback(async () => {
    setScreenState(prev => ({ ...prev, refreshing: true }));
    try {
      await loadMessageData();
    } catch (error) {
      setScreenState(prev => ({ 
        ...prev, 
        error: handleApiError(error) 
      }));
    } finally {
      setScreenState(prev => ({ ...prev, refreshing: false }));
    }
  }, [loadMessageData]);

  useEffect(() => {
    loadMessageData().catch(error => {
      setScreenState(prev => ({ 
        ...prev, 
        error: handleApiError(error) 
      }));
    });
  }, [loadMessageData]);

  return {
    screenState,
    categories,
    handleRefresh,
    clearAllChats
  };
};
// #endregion

// #region 7. Domain Logic
const MessageScreen: React.FC<MessageScreenProps> = ({ navigation }) => {
  const {
    screenState,
    categories,
    handleRefresh,
    clearAllChats
  } = useMessageScreen(navigation);

  // 事件处理函数
  const handleCategoryPress = useCallback((category: MessageCategory) => {
    navigateToCategory(navigation, category);
  }, [navigation]);

  const handleChatPress = useCallback((chat: RecentChat) => {
    navigateToChat(navigation, chat);
  }, [navigation]);

  const handleClearPress = useCallback(() => {
    Alert.alert(
      '清空确认',
      '确定要清空所有对话记录吗？',
      [
        { text: '取消', style: 'cancel' },
        { 
          text: '确定', 
          style: 'destructive',
          onPress: clearAllChats
        }
      ]
    );
  }, [clearAllChats]);

  // 错误处理
  if (screenState.error) {
    Alert.alert('错误', screenState.error, [
      { text: '重试', onPress: handleRefresh }
    ]);
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={STYLES.COLORS.WHITE} />
      
      {/* 消息导航栏区域 */}
      <MessageHeaderArea onClearPress={handleClearPress} />
      
      <FlatList
        data={createSections()}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => {
          switch (item.type) {
            case SECTION_TYPES.CATEGORIES:
              return (
                <MessageCategoryArea
                  categories={categories}
                  onCategoryPress={handleCategoryPress}
                />
              );
            case SECTION_TYPES.CHATS:
              return (
                <RecentChatListArea
                  onChatPress={handleChatPress}
                  onClearAll={handleClearPress}
                />
              );
            default:
              return null;
          }
        }}
        style={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
        refreshing={screenState.refreshing}
        onRefresh={handleRefresh}
      />
    </SafeAreaView>
  );
};
// #endregion

// #region 8. UI Components & Rendering
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: STYLES.COLORS.WHITE
  },
  scrollContainer: {
    flex: 1
  }
});
// #endregion

// #region 9. Exports
export default MessageScreen;
// #endregion
