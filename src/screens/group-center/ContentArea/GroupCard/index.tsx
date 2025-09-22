/**
 * 🔸 组局卡片功能区域 - 复杂卡片逻辑嵌套实现
 * 基于架构设计的复杂信息卡片实现
 * 
 * TOC (quick jump):
 * [1] File Banner & TOC
 * [2] Imports
 * [3] Types & Schema
 * [4] Constants & Config
 * [5] Utils & Helpers
 * [6] State Management
 * [7] Domain Logic
 * [8] UI Components & Rendering
 * [9] Exports
 */

// #region 1. File Banner & TOC
/**
 * GroupCard - 组局卡片功能区域
 * 复杂的信息卡片实现，包含背景图、发起者信息、活动详情、参与者状态等
 * 
 * TOC (快速跳转):
 * [1] File Banner & TOC
 * [2] Imports
 * [3] Types & Schema  
 * [4] Constants & Config
 * [5] Utils & Helpers
 * [6] State Management
 * [7] Domain Logic
 * [8] UI Components & Rendering
 * [9] Exports
 */
// #endregion

// #region 2. Imports
import React, { useMemo } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ImageBackground,
  StyleSheet,
  Dimensions,
} from 'react-native';

// 导入本地模块
import { useCardState } from './useCardState';
import { onCardAction } from './onCardAction';
import { processCardData } from './processCardData';
import { utilsCard } from './utilsCard';

// 导入类型和常量
import type { GroupCardProps } from './types';
import { CARD_CONSTANTS } from './constants';
import { COLORS, SPACING, FONT_SIZE, BORDER_RADIUS, ACTIVITY_TYPES } from '../../constants';
// #endregion

// #region 3. Types & Schema
// Props接口定义在父级 types.ts 中
// #endregion

// #region 4. Constants & Config
const { width: screenWidth } = Dimensions.get('window');
const CARD_HEIGHT = 200;
const AVATAR_SIZE = 40;
const MAX_TAGS = 3;
const MAX_PARTICIPANTS_DISPLAY = 5;
// #endregion

// #region 5. Utils & Helpers
const formatDistance = (distance?: number): string => {
  if (!distance) return '';
  return distance < 1 ? `${Math.round(distance * 1000)}m` : `${distance.toFixed(1)}km`;
};

const formatPrice = (amount: number, unit: string): string => {
  const unitText = unit === 'hour' ? '小时' : unit === 'person' ? '人' : '次';
  return `${amount}金币/${unitText}`;
};

const formatParticipantCount = (count: number): string => {
  if (count === 0) return '暂无报名';
  if (count < 10) return `${count}人报名`;
  return `等${count}多位达人报名...`;
};

const getActivityTypeInfo = (type: string) => {
  return ACTIVITY_TYPES.find(item => item.key === type) || {
    key: type,
    label: type,
    icon: '🎯',
    color: COLORS.PRIMARY,
    description: '',
  };
};

const truncateText = (text: string, maxLength: number): string => {
  return text.length > maxLength ? `${text.slice(0, maxLength)}...` : text;
};
// #endregion

// #region 6. State Management
// 状态管理在 useCardState.ts 中定义
// #endregion

// #region 7. Domain Logic
// 事件处理在 onCardAction.ts 中定义
// 数据处理在 processCardData.ts 中定义
// #endregion

// #region 8. UI Components & Rendering
export const GroupCard: React.FC<GroupCardProps> = ({
  activity,
  onPress,
  onAvatarPress,
}) => {
  // 使用本地状态管理
  const { cardState } = useCardState();
  
  // 计算衍生数据
  const activityTypeInfo = useMemo(() => getActivityTypeInfo(activity.type), [activity.type]);
  
  const displayTags = useMemo(() => 
    activity.tags.slice(0, MAX_TAGS), 
    [activity.tags]
  );

  const participantAvatars = useMemo(() => 
    activity.participants
      .slice(0, MAX_PARTICIPANTS_DISPLAY)
      .map(p => p.user),
    [activity.participants]
  );

  // 事件处理
  const handleCardPress = () => {
    onCardAction.handleCardPress(onPress, activity, cardState);
  };

  const handleAvatarPress = () => {
    if (onAvatarPress) {
      onCardAction.handleAvatarPress(onAvatarPress, activity.organizer, cardState);
    }
  };

  // 渲染参与者头像群
  const renderParticipantAvatars = () => {
    if (participantAvatars.length === 0) return null;

    return (
      <View style={styles.avatarGroup}>
        {participantAvatars.map((user, index) => (
          <View
            key={user.id}
            style={[
              styles.participantAvatar,
              { marginLeft: index > 0 ? -8 : 0, zIndex: participantAvatars.length - index }
            ]}
          >
            <Text style={styles.participantAvatarText}>👤</Text>
          </View>
        ))}
      </View>
    );
  };

  // 渲染活动标签
  const renderTags = () => (
    <View style={styles.tagContainer}>
      {displayTags.map((tag, index) => (
        <View key={index} style={styles.tag}>
          <Text style={styles.tagText}>{tag}</Text>
        </View>
      ))}
    </View>
  );

  // 主渲染
  return (
    <TouchableOpacity
      style={styles.cardContainer}
      onPress={handleCardPress}
      activeOpacity={0.9}
    >
      <View style={styles.card}>
        {/* 背景图和渐变遮罩 */}
        <ImageBackground
          source={{ uri: activity.backgroundImage || 'https://via.placeholder.com/400x200' }}
          style={styles.backgroundImage}
          imageStyle={styles.backgroundImageStyle}
        >
          <View style={styles.overlay} />
          
          {/* 发起者头像 */}
          <TouchableOpacity
            style={styles.avatarContainer}
            onPress={handleAvatarPress}
            activeOpacity={0.8}
          >
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>👤</Text>
              {activity.organizer.isOnline && (
                <View style={styles.onlineIndicator} />
              )}
            </View>
          </TouchableOpacity>

          {/* 活动类型标识 */}
          <View style={[styles.typeIndicator, { backgroundColor: activityTypeInfo.color }]}>
            <Text style={styles.typeIcon}>{activityTypeInfo.icon}</Text>
          </View>

          {/* 活动信息区域 */}
          <View style={styles.activityInfo}>
            {/* 活动标题 */}
            <Text style={styles.activityTitle} numberOfLines={1}>
              {truncateText(activity.title, 20)}
            </Text>

            {/* 活动标签 */}
            {renderTags()}

            {/* 活动详细信息 */}
            <View style={styles.detailsContainer}>
              <Text style={styles.detailText} numberOfLines={1}>
                🕐 {activity.details.datetime} 12小时前截止报名
              </Text>
              <Text style={styles.detailText} numberOfLines={1}>
                📍 {truncateText(activity.details.location.name, 25)} {formatDistance(activity.stats.distance)}
              </Text>
              <Text style={styles.priceText}>
                💰 {formatPrice(activity.details.price.amount, activity.details.price.unit)}/人
              </Text>
            </View>

            {/* 参与者信息 */}
            <View style={styles.participantSection}>
              {renderParticipantAvatars()}
              <Text style={styles.participantText}>
                {formatParticipantCount(activity.stats.registrationCount)}
              </Text>
            </View>
          </View>
        </ImageBackground>
      </View>
    </TouchableOpacity>
  );
};

// 样式定义
const styles = StyleSheet.create({
  cardContainer: {
    marginBottom: SPACING.LG,
  },
  card: {
    borderRadius: BORDER_RADIUS.LG,
    overflow: 'hidden',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
  },
  backgroundImage: {
    width: '100%',
    height: CARD_HEIGHT,
    position: 'relative',
  },
  backgroundImageStyle: {
    borderRadius: BORDER_RADIUS.LG,
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    borderRadius: BORDER_RADIUS.LG,
  },

  // 发起者头像
  avatarContainer: {
    position: 'absolute',
    top: SPACING.MD,
    left: SPACING.MD,
  },
  avatar: {
    width: AVATAR_SIZE,
    height: AVATAR_SIZE,
    borderRadius: AVATAR_SIZE / 2,
    backgroundColor: COLORS.CARD_BACKGROUND,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  avatarText: {
    fontSize: FONT_SIZE.LG,
  },
  onlineIndicator: {
    position: 'absolute',
    bottom: 2,
    right: 2,
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: COLORS.SUCCESS,
    borderWidth: 2,
    borderColor: COLORS.CARD_BACKGROUND,
  },

  // 活动类型标识
  typeIndicator: {
    position: 'absolute',
    top: SPACING.MD,
    right: SPACING.MD,
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  typeIcon: {
    fontSize: FONT_SIZE.MD,
  },

  // 活动信息
  activityInfo: {
    position: 'absolute',
    bottom: SPACING.MD,
    left: SPACING.MD,
    right: SPACING.MD,
  },
  activityTitle: {
    fontSize: FONT_SIZE.LG,
    fontWeight: 'bold',
    color: COLORS.TEXT_WHITE,
    marginBottom: SPACING.SM,
  },

  // 标签
  tagContainer: {
    flexDirection: 'row',
    marginBottom: SPACING.SM,
    flexWrap: 'wrap',
  },
  tag: {
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
    paddingHorizontal: SPACING.SM,
    paddingVertical: SPACING.XS,
    borderRadius: BORDER_RADIUS.SM,
    marginRight: SPACING.XS,
    marginBottom: SPACING.XS,
  },
  tagText: {
    fontSize: FONT_SIZE.XS,
    color: COLORS.TEXT_WHITE,
    fontWeight: '500',
  },

  // 详细信息
  detailsContainer: {
    marginBottom: SPACING.SM,
  },
  detailText: {
    fontSize: FONT_SIZE.SM,
    color: COLORS.TEXT_WHITE,
    marginBottom: SPACING.XS,
    opacity: 0.9,
  },
  priceText: {
    fontSize: FONT_SIZE.SM,
    color: '#FFD700',
    fontWeight: '600',
  },

  // 参与者信息
  participantSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  avatarGroup: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  participantAvatar: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: COLORS.CARD_BACKGROUND,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: COLORS.TEXT_WHITE,
  },
  participantAvatarText: {
    fontSize: 10,
  },
  participantText: {
    fontSize: FONT_SIZE.SM,
    color: 'rgba(255, 255, 255, 0.8)',
    flex: 1,
    textAlign: 'right',
  },
});
// #endregion

// #region 9. Exports
export default GroupCard;
// #endregion