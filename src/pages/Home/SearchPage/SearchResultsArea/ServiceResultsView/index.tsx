/**
 * ServiceResultsView - 服务搜索结果视图组件
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

// #region 1. Imports
import React, { useCallback } from 'react';
import {
  View,
  FlatList,
  TouchableOpacity,
  Text,
  Image,
  StyleSheet,
  RefreshControl,
  ActivityIndicator,
} from 'react-native';

// 内部模块导入
import { COLORS, SPACING, FONTS } from '../../constants';
import type { ServiceInfo } from '../../types';
// #endregion

// #region 2. Types & Schema
interface ServiceResultsViewProps {
  results: ServiceInfo[];
  keyword: string;
  loading: boolean;
  onLoadMore?: () => void;
  onRefresh?: () => void;
  refreshing?: boolean;
  onServicePress?: (service: ServiceInfo) => void;
}

interface ServiceCardProps {
  service: ServiceInfo;
  keyword: string;
  onPress?: (service: ServiceInfo) => void;
}
// #endregion

// #region 3. Constants & Config
const SERVICE_CARD_CONFIG = {
  height: 120,
  avatarSize: 48,
  borderRadius: 8,
} as const;
// #endregion

// #region 4. Utils & Helpers
const formatPrice = (price: number, unit: string): string => {
  return `${price} ${unit}`;
};

const formatRating = (rating: number): string => {
  return rating.toFixed(1);
};

const formatDistance = (distance?: number): string => {
  if (!distance) return '';
  if (distance < 1) return '<1km';
  if (distance < 10) return `${distance.toFixed(1)}km`;
  return `${Math.round(distance)}km`;
};

const truncateText = (text: string, maxLength: number): string => {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength - 3) + '...';
};
// #endregion

// #region 5. State Management
// 状态管理逻辑
// #endregion

// #region 6. Domain Logic
// 业务逻辑处理
// #endregion

// #region 7. UI Components & Rendering
/**
 * ServiceCard 组件 - 服务信息卡片
 */
const ServiceCard: React.FC<ServiceCardProps> = ({ service, keyword, onPress }) => {
  const handlePress = () => {
    onPress?.(service);
  };

  const renderHighlightedText = (text: string, style: any) => {
    if (!keyword) {
      return <Text style={style}>{text}</Text>;
    }

    const parts = text.split(new RegExp(`(${keyword})`, 'gi'));
    return (
      <Text style={style}>
        {parts.map((part, index) => (
          <Text
            key={index}
            style={[
              style,
              part.toLowerCase() === keyword.toLowerCase() && styles.highlightedText,
            ]}
          >
            {part}
          </Text>
        ))}
      </Text>
    );
  };

  return (
    <TouchableOpacity
      style={styles.serviceCard}
      onPress={handlePress}
      activeOpacity={0.8}
    >
      {/* 服务提供者头像 */}
      <View style={styles.avatarContainer}>
        <Image
          source={{ uri: service.provider.avatar }}
          style={styles.avatar}
          // 移除默认头像，使用条件渲染替代
        />
      </View>

      {/* 服务信息 */}
      <View style={styles.serviceInfo}>
        {/* 服务提供者信息 */}
        <View style={styles.providerRow}>
          {renderHighlightedText(service.provider.username, styles.providerName)}
          <Text style={styles.genderIcon}>
            {service.provider.gender === 'male' ? '♂️' : '♀️'}
          </Text>
          {service.location?.distance && (
            <Text style={styles.distanceText}>
              {formatDistance(service.location.distance)}
            </Text>
          )}
        </View>

        {/* 游戏和技能标签 */}
        <View style={styles.tagsRow}>
          <View style={[styles.tag, styles.gameTag]}>
            <Text style={[styles.tagText, styles.gameTagText]}>
              {service.gameType}
            </Text>
          </View>
          <View style={[styles.tag, styles.skillTag]}>
            <Text style={[styles.tagText, styles.skillTagText]}>
              {service.skillLevel}
            </Text>
          </View>
        </View>

        {/* 服务描述 */}
        <View style={styles.descriptionRow}>
          {renderHighlightedText(
            truncateText(service.description, 60), 
            styles.serviceDescription
          )}
        </View>

        {/* 联系方式和评分 */}
        <View style={styles.bottomRow}>
          <Text style={styles.contactInfo}>
            {truncateText(service.contact, 25)}
          </Text>
          <View style={styles.ratingContainer}>
            <Text style={styles.ratingText}>
              ⭐ {formatRating(service.rating)}
            </Text>
          </View>
        </View>
      </View>

      {/* 右侧价格和操作 */}
      <View style={styles.rightInfo}>
        <Text style={styles.priceText}>
          {formatPrice(service.price, service.priceUnit)}
        </Text>
        
        <TouchableOpacity style={styles.orderButton}>
          <Text style={styles.orderButtonText}>下单</Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
};

/**
 * ServiceResultsView 组件 - 服务搜索结果视图
 */
const ServiceResultsView: React.FC<ServiceResultsViewProps> = ({
  results,
  keyword,
  loading,
  onLoadMore,
  onRefresh,
  refreshing = false,
  onServicePress,
}) => {
  const renderServiceItem = useCallback(({ item }: { item: ServiceInfo }) => (
    <ServiceCard
      service={item}
      keyword={keyword}
      onPress={onServicePress}
    />
  ), [keyword, onServicePress]);

  const renderListEmpty = useCallback(() => {
    if (loading) {
      return (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={COLORS.primary} />
          <Text style={styles.loadingText}>搜索服务中...</Text>
        </View>
      );
    }
    
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyIcon}>📋</Text>
        <Text style={styles.emptyText}>暂无相关服务</Text>
        <Text style={styles.emptyHint}>试试其他关键词</Text>
      </View>
    );
  }, [loading]);

  const renderListFooter = useCallback(() => {
    if (loading && results.length > 0) {
      return (
        <View style={styles.footerContainer}>
          <ActivityIndicator size="small" color={COLORS.primary} />
          <Text style={styles.footerText}>加载更多...</Text>
        </View>
      );
    }
    return null;
  }, [loading, results.length]);

  const keyExtractor = useCallback((item: ServiceInfo) => item.id, []);

  return (
    <View style={styles.container}>
      <FlatList
        data={results}
        renderItem={renderServiceItem}
        keyExtractor={keyExtractor}
        ListEmptyComponent={renderListEmpty}
        ListFooterComponent={renderListFooter}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        onEndReached={onLoadMore}
        onEndReachedThreshold={0.1}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[COLORS.primary]}
            tintColor={COLORS.primary}
          />
        }
      />
    </View>
  );
};
// #endregion

// #region 8. Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  listContent: {
    padding: SPACING.md,
    flexGrow: 1,
  },
  serviceCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    padding: SPACING.md,
    marginBottom: SPACING.md,
    borderRadius: SERVICE_CARD_CONFIG.borderRadius,
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    minHeight: SERVICE_CARD_CONFIG.height,
  },
  avatarContainer: {
    marginRight: SPACING.md,
    alignSelf: 'flex-start',
  },
  avatar: {
    width: SERVICE_CARD_CONFIG.avatarSize,
    height: SERVICE_CARD_CONFIG.avatarSize,
    borderRadius: SERVICE_CARD_CONFIG.avatarSize / 2,
  },
  serviceInfo: {
    flex: 1,
  },
  providerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.xs,
  },
  providerName: {
    fontSize: FONTS.size.md,
    fontWeight: FONTS.weight.semiBold,
    color: COLORS.textPrimary,
    marginRight: SPACING.xs,
  },
  genderIcon: {
    fontSize: FONTS.size.sm,
    marginRight: SPACING.xs,
  },
  distanceText: {
    fontSize: FONTS.size.xs,
    color: COLORS.textLight,
    marginLeft: 'auto',
  },
  tagsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.xs,
  },
  tag: {
    paddingHorizontal: SPACING.xs,
    paddingVertical: 2,
    borderRadius: 4,
    marginRight: SPACING.xs,
  },
  gameTag: {
    backgroundColor: COLORS.info + '20',
  },
  skillTag: {
    backgroundColor: COLORS.warning + '20',
  },
  tagText: {
    fontSize: FONTS.size.xs,
    fontWeight: FONTS.weight.medium,
  },
  gameTagText: {
    color: COLORS.info,
  },
  skillTagText: {
    color: COLORS.warning,
  },
  descriptionRow: {
    marginBottom: SPACING.xs,
  },
  serviceDescription: {
    fontSize: FONTS.size.sm,
    color: COLORS.textPrimary,
    lineHeight: FONTS.lineHeight.normal * FONTS.size.sm,
  },
  highlightedText: {
    color: COLORS.primary,
    backgroundColor: COLORS.highlightBackground,
  },
  bottomRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  contactInfo: {
    fontSize: FONTS.size.xs,
    color: COLORS.info,
    flex: 1,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ratingText: {
    fontSize: FONTS.size.xs,
    color: COLORS.textLight,
  },
  rightInfo: {
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    height: '100%',
    paddingVertical: SPACING.xs,
  },
  priceText: {
    fontSize: FONTS.size.lg,
    fontWeight: FONTS.weight.bold,
    color: COLORS.error,
    textAlign: 'center',
  },
  orderButton: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.xs,
    borderRadius: 16,
    minWidth: 60,
    alignItems: 'center',
  },
  orderButtonText: {
    fontSize: FONTS.size.sm,
    fontWeight: FONTS.weight.semiBold,
    color: COLORS.white,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 40,
  },
  loadingText: {
    fontSize: FONTS.size.md,
    color: COLORS.textLight,
    marginTop: SPACING.md,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyIcon: {
    fontSize: 48,
    marginBottom: SPACING.lg,
    opacity: 0.3,
  },
  emptyText: {
    fontSize: FONTS.size.lg,
    fontWeight: FONTS.weight.medium,
    color: COLORS.textLight,
    marginBottom: SPACING.sm,
  },
  emptyHint: {
    fontSize: FONTS.size.sm,
    color: COLORS.textLight,
    textAlign: 'center',
  },
  footerContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 20,
    gap: 8,
  },
  footerText: {
    fontSize: FONTS.size.sm,
    color: COLORS.textLight,
  },
});
// #endregion

// #region 9. Exports
export default ServiceResultsView;
export type { ServiceResultsViewProps };
// #endregion
