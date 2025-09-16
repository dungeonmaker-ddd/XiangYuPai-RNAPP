/**
 * 消息中心主页面
 * 使用三个核心组件：MessageHeader + MessageCategoryGrid + RecentChatList
 * 遵循消息系统模块架构设计 - 简洁清晰的组件拆分
 */

import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  Alert,
  RefreshControl,
  ScrollView
} from 'react-native';
import { MessageCategory, RecentChat } from './types';
import { MESSAGE_CATEGORIES, STYLES } from './constants';
import { MessageHeader, MessageCategoryGrid, RecentChatList } from './components';

// ==================== Types & Interfaces ====================
interface MessageCenterScreenProps {
  navigation: {
    navigate: (screen: string, params?: any) => void;
    goBack: () => void;
  };
}

interface MessageState {
  categories: MessageCategory[];
  loading: boolean;
  refreshing: boolean;
  error: string | null;
}


// ==================== Main Component ====================
const MessageCenterScreen: React.FC<MessageCenterScreenProps> = ({ navigation }) => {
  // ==================== State Management ====================
  const [state, setState] = useState<MessageState>({
    categories: MESSAGE_CATEGORIES.map(cat => ({ ...cat, unreadCount: 0 })),
    loading: false,
    refreshing: false,
    error: null
  });

  // ==================== Domain Logic ====================
  const loadMessageData = useCallback(async () => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    
    try {
      // 模拟API调用延迟
      await new Promise<void>(resolve => setTimeout(resolve, 800));
      
      // 模拟获取未读消息数量
      const mockUnreadCounts = {
        like_collect: Math.floor(Math.random() * 5),
        comment: Math.floor(Math.random() * 3) + 1, // 至少1个
        follower: Math.floor(Math.random() * 8),
        system: Math.floor(Math.random() * 2)
      };
      
      const categoriesWithUnread = MESSAGE_CATEGORIES.map(cat => ({
        ...cat,
        unreadCount: mockUnreadCounts[cat.id as keyof typeof mockUnreadCounts] || 0
      }));
      
      setState(prev => ({
        ...prev,
        categories: categoriesWithUnread,
        loading: false,
        error: null
      }));
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : '加载消息数据失败';
      console.error('加载消息数据失败:', error);
      setState(prev => ({ 
        ...prev, 
        loading: false,
        error: errorMessage
      }));
    }
  }, []);

  const handleRefresh = useCallback(async () => {
    setState(prev => ({ ...prev, refreshing: true }));
    await loadMessageData();
    setState(prev => ({ ...prev, refreshing: false }));
  }, [loadMessageData]);

  // ==================== Event Handlers ====================
  const handleSettingsPress = useCallback(() => {
    Alert.alert(
      '消息设置',
      '即将进入消息设置页面',
      [{ text: '确定' }]
    );
  }, []);

  const handleCategoryPress = useCallback((category: MessageCategory) => {
    Alert.alert(
      '功能提示',
      `点击了${category.title}功能，即将跳转到对应页面`,
      [{ text: '确定' }]
    );
    // 实际项目中这里应该是：
    // navigation.navigate(`${category.id}Screen`);
  }, []);

  const handleChatPress = useCallback((chat: RecentChat) => {
    navigation.navigate('PrivateChatScreen', { 
      userId: chat.user.id,
      userInfo: chat.user
    });
  }, [navigation]);

  const handleClearAllChats = useCallback(() => {
    Alert.alert(
      '清空确认',
      '确定要清空所有对话记录吗？',
      [
        { text: '取消', style: 'cancel' },
        { 
          text: '确定', 
          style: 'destructive',
          onPress: () => {
            Alert.alert('提示', '清空功能已执行');
          }
        }
      ]
    );
  }, []);

  // ==================== Effects ====================
  useEffect(() => {
    loadMessageData();
  }, [loadMessageData]);

  // ==================== Error State ====================
  if (state.error) {
    // 显示错误Alert
    Alert.alert('错误', state.error, [
      { text: '重试', onPress: loadMessageData }
    ]);
    
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="dark-content" backgroundColor={STYLES.COLORS.WHITE} />
        <View style={styles.errorContainer}>
          {/* 错误状态显示 */}
        </View>
      </SafeAreaView>
    );
  }

  // ==================== Main Render ====================
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={STYLES.COLORS.WHITE} />
      
      {/* 消息导航栏 */}
      <MessageHeader
        onClearPress={handleClearAllChats}
        showClearButton={true}
      />
      
      <ScrollView
        style={styles.scrollContainer}
        refreshControl={
          <RefreshControl
            refreshing={state.refreshing}
            onRefresh={handleRefresh}
            colors={[STYLES.COLORS.PRIMARY]}
          />
        }
      >
        {/* 消息分类功能区 */}
        <MessageCategoryGrid
          categories={state.categories}
          onCategoryPress={handleCategoryPress}
        />
        
        {/* 最近对话列表 */}
        <RecentChatList
          onChatPress={handleChatPress}
          onClearAll={handleClearAllChats}
        />
      </ScrollView>
    </SafeAreaView>
  );
};

// ==================== Styles ====================
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: STYLES.COLORS.WHITE
  },
  scrollContainer: {
    flex: 1
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: STYLES.SPACING.XL
  }
});

export default MessageCenterScreen;