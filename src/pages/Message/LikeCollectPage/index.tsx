/**
 * 赞和收藏消息页面
 * 显示用户的点赞和收藏消息列表
 * 基于消息系统模块架构设计 - 250行实现
 */

import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  FlatList,
  TouchableOpacity,
  Alert,
  RefreshControl
} from 'react-native';
import { LikeCollectMessage } from '../types';
import { STYLES } from '../constants';
import { UserAvatar } from '../MainPage/components';
import LikeCollectItemArea from './LikeCollectItemArea';

// ==================== Types ====================
interface LikeCollectScreenProps {
  navigation: any;
}

// ==================== Constants ====================
const MOCK_LIKE_COLLECT_DATA: LikeCollectMessage[] = [
  {
    id: '1',
    user: {
      id: 'user1',
      nickname: '用户名称123',
      avatar: '',
      isOnline: true,
      lastActiveTime: '2024-12-19T10:30:00Z'
    },
    actionType: 'like',
    targetContent: {
      id: 'content1',
      type: 'comment',
      title: '这里是评论 这里是评论 这里是评论',
      thumbnail: ''
    },
    timestamp: '2024-12-19T10:29:00Z',
    isRead: false
  },
  {
    id: '2',
    user: {
      id: 'user2',
      nickname: '用户名称123',
      avatar: '',
      isOnline: false,
      lastActiveTime: '2024-12-19T09:15:00Z'
    },
    actionType: 'collect',
    targetContent: {
      id: 'content2',
      type: 'post',
      title: '这里是作品标题',
      thumbnail: ''
    },
    timestamp: '2024-12-19T09:15:00Z',
    isRead: false
  }
];

// ==================== Main Component ====================
const LikeCollectScreen: React.FC<LikeCollectScreenProps> = ({ navigation }) => {
  // ==================== State Management ====================
  const [messages, setMessages] = useState<LikeCollectMessage[]>([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  // ==================== Domain Logic ====================
  const loadMessages = useCallback(async () => {
    setLoading(true);
    try {
      // 模拟API调用
      await new Promise(resolve => setTimeout(resolve, 800));
      setMessages(MOCK_LIKE_COLLECT_DATA);
    } catch (error) {
      console.error('加载赞和收藏消息失败:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  const handleRefresh = useCallback(async () => {
    setRefreshing(true);
    await loadMessages();
    setRefreshing(false);
  }, [loadMessages]);

  const handleClearAll = useCallback(() => {
    Alert.alert(
      '清空消息',
      '确定要清空所有赞和收藏消息吗？',
      [
        { text: '取消', style: 'cancel' },
        {
          text: '确定',
          style: 'destructive',
          onPress: () => setMessages([])
        }
      ]
    );
  }, []);

  const handleMessagePress = useCallback((message: LikeCollectMessage) => {
    // 标记为已读
    setMessages(prev => 
      prev.map(msg => 
        msg.id === message.id ? { ...msg, isRead: true } : msg
      )
    );
    
    // 跳转到内容详情
    console.log('查看内容详情:', message.targetContent.title);
  }, []);

  const handleUserPress = useCallback((userId: string) => {
    console.log('查看用户详情:', userId);
    // navigation.navigate('UserProfileScreen', { userId });
  }, []);

  // ==================== Effects ====================
  useEffect(() => {
    loadMessages();
  }, [loadMessages]);

  // ==================== Subcomponents ====================
  const Header = () => (
    <View style={styles.header}>
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => navigation.goBack()}
        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
      >
        <Text style={styles.backIcon}>←</Text>
      </TouchableOpacity>
      
      <Text style={styles.headerTitle}>赞和收藏</Text>
      
      <TouchableOpacity
        style={styles.clearButton}
        onPress={handleClearAll}
        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
      >
        <Text style={styles.clearText}>清空</Text>
      </TouchableOpacity>
    </View>
  );

  const EmptyState = () => (
    <View style={styles.emptyContainer}>
      <Text style={styles.emptyText}>暂无赞和收藏消息</Text>
    </View>
  );

  // ==================== UI Rendering ====================
  const renderMessage = ({ item }: { item: LikeCollectMessage }) => (
    <LikeCollectItemArea
      message={item}
      onPress={handleMessagePress}
      onUserPress={handleUserPress}
    />
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={STYLES.COLORS.WHITE} />
      
      {/* 页面导航栏 */}
      <Header />
      
      {/* 消息列表 */}
      <FlatList
        data={messages}
        keyExtractor={(item) => item.id}
        renderItem={renderMessage}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            colors={[STYLES.COLORS.PRIMARY]}
          />
        }
        ListEmptyComponent={EmptyState}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
      />
    </SafeAreaView>
  );
};

// ==================== Styles ====================
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: STYLES.COLORS.WHITE
  },
  header: {
    height: STYLES.SIZES.HEADER_HEIGHT,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: STYLES.SPACING.LG,
    backgroundColor: STYLES.COLORS.WHITE,
    borderBottomWidth: 1,
    borderBottomColor: STYLES.COLORS.BORDER_GRAY
  },
  backButton: {
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center'
  },
  backIcon: {
    fontSize: STYLES.SIZES.ICON_MEDIUM,
    color: STYLES.COLORS.BLACK
  },
  headerTitle: {
    fontSize: STYLES.FONTS.SIZE.TITLE,
    fontWeight: STYLES.FONTS.WEIGHT.BOLD as any,
    color: STYLES.COLORS.BLACK,
    flex: 1,
    textAlign: 'center'
  },
  clearButton: {
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center'
  },
  clearText: {
    fontSize: STYLES.FONTS.SIZE.LARGE,
    color: STYLES.COLORS.GRAY
  },
  separator: {
    height: 1,
    backgroundColor: STYLES.COLORS.BORDER_GRAY,
    marginLeft: STYLES.SPACING.LG + STYLES.SIZES.AVATAR_LARGE + STYLES.SPACING.LG
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60
  },
  emptyText: {
    fontSize: STYLES.FONTS.SIZE.LARGE,
    color: STYLES.COLORS.GRAY
  }
});

export default LikeCollectScreen;
