/**
 * 导航使用示例
 * 展示如何从主页面导航到详情页面
 */

import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { ContentItem } from '../../../types';

interface NavigationExampleProps {
  navigation: any;
  contentItem: ContentItem;
}

export const NavigationExample: React.FC<NavigationExampleProps> = ({
  navigation,
  contentItem,
}) => {
  
  const handleNavigateToDetail = () => {
    navigation.navigate('DiscoverDetail', {
      contentId: contentItem.id,
      contentItem: contentItem,
    });
  };

  return (
    <TouchableOpacity 
      style={styles.button} 
      onPress={handleNavigateToDetail}
      activeOpacity={0.7}
    >
      <Text style={styles.buttonText}>查看详情</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    backgroundColor: '#8A2BE2',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
});

export default NavigationExample;
