/**
 * LimitedOffersArea - 限时专享区域组件
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
import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Image,
  StyleSheet,
} from 'react-native';

// 内部模块导入
import { COLORS } from '../constants';
import type { UserCard } from '../types';
// 内联导入避免模块解析问题
const { processOfferData } = require('./processData');
const { utilsCardLayout } = require('./utilsLayout');
// #endregion

// #region 2. Types & Schema
interface LimitedOffersAreaProps {
  offers: UserCard[];
  onUserPress: (user: UserCard) => void;
  onMorePress: () => void;
}
// #endregion

// #region 3. Constants & Config
const CARD_CONFIG = {
  width: 140,
  aspectRatio: 1,
  marginRight: 12,
} as const;
// #endregion

// #region 4. Utils & Helpers
// 工具函数已移至 ./utilsLayout.ts
// #endregion

// #region 5. State Management
// 状态管理逻辑
// #endregion

// #region 6. Domain Logic
// 业务逻辑已移至 ./processData.ts
// #endregion

// #region 7. UI Components & Rendering
/**
 * LimitedOffersArea 组件 - 限时专享区域
 * 横向滚动的用户专享卡片列表
 */
const LimitedOffersArea: React.FC<LimitedOffersAreaProps> = ({ 
  offers, 
  onUserPress, 
  onMorePress 
}) => {
  const processedOffers = processOfferData(offers);
  const { getCardStyle, getImageStyle } = utilsCardLayout();

  const renderOfferCard = (user: UserCard, index: number): React.ReactElement => (
    <TouchableOpacity
      key={user.id}
      style={styles.offerCard}
      onPress={() => onUserPress(user)}
    >
      <View style={styles.imageContainer}>
        <Image
          source={require('../../../../assets/images/common/default-avatar.png')}
          style={styles.userImage}
        />
        <View style={styles.orderBadge}>
          <Text style={styles.orderText}>
            近期{89 - index * 12}人下单
          </Text>
        </View>
      </View>

      <View style={styles.userInfo}>
        <Text style={styles.userName}>
          {user.username}
        </Text>
        <Text style={styles.userService}>
          {user.services[0] ? `${user.services[0]}区 荣耀王者` : '微信区 荣耀王者'}
        </Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {/* 标题栏 */}
      <View style={styles.headerRow}>
        <View style={styles.titleGroup}>
          <Text style={styles.mainTitle}>限时专享</Text>
          <View style={styles.qualityBadge}>
            <Text style={styles.badgeText}>优质陪玩</Text>
          </View>
        </View>
        <TouchableOpacity onPress={onMorePress}>
          <Text style={styles.moreText}>查看更多 {'>'}</Text>
        </TouchableOpacity>
      </View>

      {/* 横向滚动卡片列表 */}
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {processedOffers.map((user: UserCard, index: number) => renderOfferCard(user, index))}
      </ScrollView>
    </View>
  );
};
// #endregion

// #region 8. Styles
const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  titleGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  mainTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
  },
  qualityBadge: {
    borderTopLeftRadius: 15,
    borderTopRightRadius: 0,
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 15,
    paddingHorizontal: 8,
    paddingVertical: 4,
    backgroundColor: '#FF6B47',
  },
  badgeText: {
    color: COLORS.white,
    fontSize: 11,
    fontWeight: '500',
  },
  moreText: {
    color: COLORS.gray500,
    fontSize: 14,
  },
  scrollContent: {
    paddingRight: 16,
  },
  offerCard: {
    width: CARD_CONFIG.width,
    marginRight: CARD_CONFIG.marginRight,
    borderRadius: 12,
  },
  imageContainer: {
    position: 'relative',
    width: '100%',
    aspectRatio: CARD_CONFIG.aspectRatio,
    overflow: 'hidden',
    borderRadius: 12,
  },
  userImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  orderBadge: {
    position: 'absolute',
    bottom: 8,
    right: 8,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  orderText: {
    color: COLORS.white,
    fontSize: 11,
    fontWeight: '500',
  },
  userInfo: {
    alignItems: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  userName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 4,
    textAlign: 'left',
  },
  userService: {
    fontSize: 12,
    color: COLORS.gray500,
    textAlign: 'left',
  },
});
// #endregion

// #region 9. Exports
export default LimitedOffersArea;
export type { LimitedOffersAreaProps };
// #endregion
