/**
 * 🔸 组局列表功能区域 - 复杂列表逻辑嵌套实现
 */

import React from 'react';
import { FlatList, RefreshControl, StyleSheet } from 'react-native';
import { GroupCard } from '../GroupCard';
import type { GroupListProps } from '../types';
import { COLORS, SPACING } from '../../constants';

export const GroupList: React.FC<GroupListProps> = ({
  activities,
  refreshing,
  hasMore,
  onRefresh,
  onLoadMore,
  onActivityPress,
  onAvatarPress,
}) => {
  const renderItem = ({ item }: { item: any }) => (
    <GroupCard
      activity={item}
      onPress={onActivityPress}
      onAvatarPress={onAvatarPress}
    />
  );

  return (
    <FlatList
      data={activities}
      keyExtractor={(item) => item.id}
      renderItem={renderItem}
      contentContainerStyle={styles.container}
      showsVerticalScrollIndicator={false}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={onRefresh}
          colors={[COLORS.PRIMARY]}
          tintColor={COLORS.PRIMARY}
        />
      }
      onEndReached={onLoadMore}
      onEndReachedThreshold={0.3}
    />
  );
};

const styles = StyleSheet.create({
  container: {
    padding: SPACING.LG,
  },
});

export default GroupList;
