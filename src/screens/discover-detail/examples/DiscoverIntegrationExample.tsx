/**
 * 发现页面集成示例
 * 展示如何在主发现页面中集成详情页面
 */

import React from 'react';
import { TouchableOpacity, StyleSheet } from 'react-native';
import { ContentItem } from '../../discover/types';
import { WaterfallCard } from '../../discover/components';

interface DiscoverIntegrationExampleProps {
  navigation: any;
  item: ContentItem;
  index: number;
  onLike: (itemId: string) => void;
  onCollect: (itemId: string) => void;
  onUserPress: (userId: string) => void;
  onShare: (item: ContentItem) => void;
}

/**
 * 集成详情页面的瀑布流卡片示例
 */
export const DiscoverIntegrationExample: React.FC<DiscoverIntegrationExampleProps> = ({
  navigation,
  item,
  index,
  onLike,
  onCollect,
  onUserPress,
  onShare,
}) => {
  
  // 处理卡片点击 - 导航到详情页
  const handleCardPress = (selectedItem: ContentItem) => {
    navigation.navigate('DiscoverDetail', {
      contentId: selectedItem.id,
      contentItem: selectedItem,
    });
  };

  return (
    <TouchableOpacity
      style={styles.cardContainer}
      onPress={() => handleCardPress(item)}
      activeOpacity={0.9}
    >
      <WaterfallCard
        item={item}
        index={index}
        onPress={handleCardPress}
        onLike={onLike}
        onCollect={onCollect}
        onUserPress={onUserPress}
        onShare={onShare}
      />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    // 确保卡片可以正确响应点击
  },
});

export default DiscoverIntegrationExample;
