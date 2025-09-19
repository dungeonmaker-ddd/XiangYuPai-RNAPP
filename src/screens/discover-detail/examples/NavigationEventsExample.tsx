/**
 * 导航事件使用示例
 * 
 * 展示如何在组件中使用导航事件处理器
 */

import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { createNavigationEventHandlers } from '../events';

const NavigationEventsExample: React.FC = () => {
  const navigation = useNavigation();
  const navigationHandlers = createNavigationEventHandlers(navigation as any);

  const handleReportExample = () => {
    navigationHandlers.navigateToReport({
      targetId: 'example_content_123',
      targetType: 'content',
      targetTitle: '示例内容标题',
      targetAuthor: '示例用户',
    });
  };

  const handleProfileExample = () => {
    navigationHandlers.navigateToProfile({
      userId: 'user_123',
      username: '示例用户名',
      avatarUrl: 'https://example.com/avatar.jpg',
    });
  };

  const handleChatExample = () => {
    navigationHandlers.navigateToChat({
      userId: 'user_123',
      username: '示例用户名',
      avatarUrl: 'https://example.com/avatar.jpg',
    });
  };

  const handleDiscoverExample = () => {
    navigationHandlers.navigateToDiscover({
      filterTag: '美食',
      searchKeyword: '火锅',
    });
  };

  const handleBackToDiscoverExample = () => {
    navigationHandlers.navigateBackToDiscover();
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>导航事件使用示例</Text>
      
      <TouchableOpacity style={styles.button} onPress={handleReportExample}>
        <Text style={styles.buttonText}>跳转到举报页面</Text>
      </TouchableOpacity>
      
      <TouchableOpacity style={styles.button} onPress={handleProfileExample}>
        <Text style={styles.buttonText}>跳转到用户资料页面</Text>
      </TouchableOpacity>
      
      <TouchableOpacity style={styles.button} onPress={handleChatExample}>
        <Text style={styles.buttonText}>跳转到私聊页面</Text>
      </TouchableOpacity>
      
      <TouchableOpacity style={styles.button} onPress={handleDiscoverExample}>
        <Text style={styles.buttonText}>跳转到发现页面（带参数）</Text>
      </TouchableOpacity>
      
      <TouchableOpacity style={styles.button} onPress={handleBackToDiscoverExample}>
        <Text style={styles.buttonText}>返回到发现页面</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#F5F5F5',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  button: {
    backgroundColor: '#007AFF',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginBottom: 10,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    textAlign: 'center',
  },
});

export default NavigationEventsExample;
