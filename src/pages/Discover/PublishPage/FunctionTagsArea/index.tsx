// #region 1. File Banner & TOC
/**
 * 功能标签区域组件 - 话题和地点选择功能
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
import React, { useCallback, useMemo, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Animated,
} from 'react-native';

// 类型和常量导入
import type { FunctionTagsAreaProps, TopicData, LocationData, TagState } from './types';
import {
  TAG_LIMITS,
  TAGS_UI,
  TAGS_COLORS,
  TAGS_FONTS,
  TAG_LABELS,
  TAG_HINTS,
  TAG_ICONS,
  TAG_ANIMATION,
  CARD_CONFIG,
  TAG_VARIANTS,
} from './constants';
// #endregion

// #region 3. Types & Schema
interface TopicTagProps {
  topic: TopicData;
  onRemove: (topicId: string) => void;
  disabled?: boolean;
  state?: TagState;
}

interface LocationTagProps {
  location: LocationData;
  onRemove: () => void;
  disabled?: boolean;
  showDistance?: boolean;
}

interface FunctionCardProps {
  icon: string;
  label: string;
  content: React.ReactNode;
  onPress: () => void;
  disabled?: boolean;
}
// #endregion

// #region 4. Constants & Config
const TOPIC_TAG_MAX_LENGTH = 15;
const LOCATION_NAME_MAX_LENGTH = 20;
const ADDRESS_MAX_LENGTH = 30;

const PRESS_ANIMATION_CONFIG = {
  duration: TAG_ANIMATION.DURATION_FAST,
  useNativeDriver: true,
};

const TAG_ANIMATION_CONFIG = {
  duration: TAG_ANIMATION.DURATION_NORMAL,
  useNativeDriver: false,
};
// #endregion

// #region 5. Utils & Helpers
const truncateText = (text: string, maxLength: number): string => {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength - 1) + '…';
};

const formatLocationName = (location: LocationData): string => {
  return truncateText(location.name, LOCATION_NAME_MAX_LENGTH);
};

const formatLocationAddress = (location: LocationData): string => {
  return truncateText(location.address, ADDRESS_MAX_LENGTH);
};

const formatDistance = (distance?: number): string => {
  if (!distance) return '';
  if (distance < 1000) {
    return `${Math.round(distance)}m`;
  }
  return `${(distance / 1000).toFixed(1)}km`;
};

const isTopicLimitReached = (topics: TopicData[], maxTopics: number): boolean => {
  return topics.length >= maxTopics;
};

const getTopicDisplayText = (topics: TopicData[]): string => {
  if (topics.length === 0) {
    return TAG_LABELS.NO_TOPICS_SELECTED;
  }
  if (topics.length === 1) {
    return truncateText(topics[0].name, TOPIC_TAG_MAX_LENGTH);
  }
  return `${topics.length}${TAG_LABELS.MULTIPLE_TOPICS}`;
};
// #endregion

// #region 6. State Management
const FunctionTagsArea: React.FC<FunctionTagsAreaProps> = ({
  selectedTopics,
  selectedLocation,
  onTopicSelect,
  onLocationSelect,
  onTopicRemove,
  onLocationRemove,
  disabled = false,
  maxTopics = TAG_LIMITS.MAX_TOPICS,
}) => {
  // 动画状态
  const [topicCardScale] = useState(new Animated.Value(1));
  const [locationCardScale] = useState(new Animated.Value(1));

  // 计算属性
  const hasTopics = useMemo(() => selectedTopics.length > 0, [selectedTopics]);
  const hasLocation = useMemo(() => selectedLocation !== null, [selectedLocation]);
  const topicLimitReached = useMemo(() => 
    isTopicLimitReached(selectedTopics, maxTopics), 
    [selectedTopics, maxTopics]
  );
// #endregion

// #region 7. Domain Logic
  // 卡片按压动画
  const animateCardPress = useCallback((animatedValue: Animated.Value, pressed: boolean) => {
    Animated.timing(animatedValue, {
      toValue: pressed ? TAG_ANIMATION.PRESS_SCALE : 1,
      ...PRESS_ANIMATION_CONFIG,
    }).start();
  }, []);

  // 话题卡片按压处理
  const handleTopicCardPressIn = useCallback(() => {
    if (!disabled) {
      animateCardPress(topicCardScale, true);
    }
  }, [disabled, topicCardScale, animateCardPress]);

  const handleTopicCardPressOut = useCallback(() => {
    animateCardPress(topicCardScale, false);
  }, [topicCardScale, animateCardPress]);

  // 地点卡片按压处理
  const handleLocationCardPressIn = useCallback(() => {
    if (!disabled) {
      animateCardPress(locationCardScale, true);
    }
  }, [disabled, locationCardScale, animateCardPress]);

  const handleLocationCardPressOut = useCallback(() => {
    animateCardPress(locationCardScale, false);
  }, [locationCardScale, animateCardPress]);

  // 话题选择处理
  const handleTopicSelect = useCallback(() => {
    if (disabled) return;
    onTopicSelect();
  }, [disabled, onTopicSelect]);

  // 地点选择处理
  const handleLocationSelect = useCallback(() => {
    if (disabled) return;
    onLocationSelect();
  }, [disabled, onLocationSelect]);

  // 话题移除处理
  const handleTopicRemove = useCallback((topicId: string) => {
    if (disabled) return;
    onTopicRemove(topicId);
  }, [disabled, onTopicRemove]);

  // 地点移除处理
  const handleLocationRemove = useCallback(() => {
    if (disabled) return;
    onLocationRemove();
  }, [disabled, onLocationRemove]);
// #endregion

// #region 8. UI Components & Rendering
  // 话题标签组件
  const TopicTag: React.FC<TopicTagProps> = ({ 
    topic, 
    onRemove, 
    disabled = false,
    state = 'normal',
  }) => (
    <View style={[
      styles.topicTag,
      disabled && styles.topicTagDisabled,
      state === 'selected' && styles.topicTagSelected,
    ]}>
      <Text style={[
        styles.topicTagText,
        disabled && styles.topicTagTextDisabled,
      ]}>
        {truncateText(topic.name, TOPIC_TAG_MAX_LENGTH)}
      </Text>
      
      {topic.isHot && (
        <Text style={styles.hotIcon}>{TAG_ICONS.HOT}</Text>
      )}
      
      <TouchableOpacity
        style={styles.topicRemoveButton}
        onPress={() => onRemove(topic.id)}
        disabled={disabled}
        hitSlop={{ top: 8, right: 8, bottom: 8, left: 8 }}
      >
        <Text style={styles.topicRemoveText}>{TAG_ICONS.CLOSE}</Text>
      </TouchableOpacity>
    </View>
  );

  // 地点标签组件
  const LocationTag: React.FC<LocationTagProps> = ({ 
    location, 
    onRemove, 
    disabled = false,
    showDistance = true,
  }) => (
    <View style={[
      styles.locationTag,
      disabled && styles.locationTagDisabled,
    ]}>
      <View style={styles.locationInfo}>
        <Text style={[
          styles.locationName,
          disabled && styles.locationNameDisabled,
        ]}>
          {formatLocationName(location)}
        </Text>
        <Text style={[
          styles.locationAddress,
          disabled && styles.locationAddressDisabled,
        ]}>
          {formatLocationAddress(location)}
        </Text>
      </View>
      
      {showDistance && location.distance && (
        <Text style={styles.locationDistance}>
          {formatDistance(location.distance)}
        </Text>
      )}
      
      <TouchableOpacity
        style={styles.locationRemoveButton}
        onPress={onRemove}
        disabled={disabled}
        hitSlop={{ top: 8, right: 8, bottom: 8, left: 8 }}
      >
        <Text style={styles.locationRemoveText}>{TAG_ICONS.CLOSE}</Text>
      </TouchableOpacity>
    </View>
  );

  // 功能卡片组件
  const FunctionCard: React.FC<FunctionCardProps> = ({ 
    icon, 
    label, 
    content, 
    onPress, 
    disabled = false 
  }) => (
    <TouchableOpacity
      style={[
        styles.functionCard,
        disabled && styles.functionCardDisabled,
      ]}
      onPress={onPress}
      disabled={disabled}
      activeOpacity={TAG_ANIMATION.PRESS_OPACITY}
    >
      <View style={styles.cardHeader}>
        <View style={styles.cardIcon}>
          <Text style={styles.cardIconText}>{icon}</Text>
        </View>
        <Text style={[
          styles.cardLabel,
          disabled && styles.cardLabelDisabled,
        ]}>
          {label}
        </Text>
        <Text style={[
          styles.cardArrow,
          disabled && styles.cardArrowDisabled,
        ]}>
          {TAG_ICONS.ARROW_RIGHT}
        </Text>
      </View>
      
      <View style={styles.cardContent}>
        {content}
      </View>
    </TouchableOpacity>
  );

  // 话题卡片内容渲染
  const renderTopicCardContent = () => {
    if (!hasTopics) {
      return (
        <Text style={styles.placeholderText}>
          {TAG_LABELS.TOPIC_PLACEHOLDER}
        </Text>
      );
    }

    if (selectedTopics.length === 1) {
      return (
        <TopicTag
          topic={selectedTopics[0]}
          onRemove={handleTopicRemove}
          disabled={disabled}
        />
      );
    }

    return (
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        style={styles.topicTagsContainer}
        contentContainerStyle={styles.topicTagsContent}
      >
        {selectedTopics.map((topic) => (
          <TopicTag
            key={topic.id}
            topic={topic}
            onRemove={handleTopicRemove}
            disabled={disabled}
          />
        ))}
      </ScrollView>
    );
  };

  // 地点卡片内容渲染
  const renderLocationCardContent = () => {
    if (!hasLocation) {
      return (
        <Text style={styles.placeholderText}>
          {TAG_LABELS.LOCATION_PLACEHOLDER}
        </Text>
      );
    }

    return (
      <LocationTag
        location={selectedLocation!}
        onRemove={handleLocationRemove}
        disabled={disabled}
        showDistance={true}
      />
    );
  };

  // 主渲染
  return (
    <View style={styles.container}>
      {/* 话题选择卡片 */}
      <Animated.View style={{ transform: [{ scale: topicCardScale }] }}>
        <FunctionCard
          icon={CARD_CONFIG.TOPIC_CARD.icon}
          label={CARD_CONFIG.TOPIC_CARD.label}
          content={renderTopicCardContent()}
          onPress={handleTopicSelect}
          disabled={disabled}
        />
      </Animated.View>

      {/* 地点选择卡片 */}
      <Animated.View style={{ transform: [{ scale: locationCardScale }] }}>
        <FunctionCard
          icon={CARD_CONFIG.LOCATION_CARD.icon}
          label={CARD_CONFIG.LOCATION_CARD.label}
          content={renderLocationCardContent()}
          onPress={handleLocationSelect}
          disabled={disabled}
        />
      </Animated.View>

      {/* 提示信息 */}
      {topicLimitReached && (
        <Text style={styles.hintText}>
          {TAG_HINTS.TOPIC_LIMIT_REACHED}
        </Text>
      )}
    </View>
  );
};

// 样式定义
const styles = StyleSheet.create({
  container: {
    backgroundColor: TAGS_COLORS.BACKGROUND,
    paddingHorizontal: TAGS_UI.CARD_PADDING,
    paddingVertical: TAGS_UI.CARD_MARGIN,
  },
  
  // 功能卡片样式
  functionCard: {
    backgroundColor: TAGS_COLORS.CARD_BACKGROUND,
    borderWidth: 1,
    borderColor: TAGS_COLORS.CARD_BORDER,
    borderRadius: TAGS_UI.CARD_BORDER_RADIUS,
    padding: TAGS_UI.CARD_PADDING,
    marginBottom: TAGS_UI.CARD_MARGIN,
    minHeight: TAGS_UI.CARD_HEIGHT,
  },
  functionCardDisabled: {
    opacity: 0.5,
    backgroundColor: '#F5F5F5',
  },
  
  // 卡片头部
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  cardIcon: {
    width: TAGS_UI.ICON_SIZE,
    height: TAGS_UI.ICON_SIZE,
    marginRight: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardIconText: {
    fontSize: TAGS_FONTS.ICON_SIZE,
  },
  cardLabel: {
    flex: 1,
    fontSize: TAGS_FONTS.LABEL_SIZE,
    fontWeight: TAGS_FONTS.LABEL_WEIGHT,
    color: TAGS_COLORS.TEXT_PRIMARY,
  },
  cardLabelDisabled: {
    color: TAGS_COLORS.TEXT_SECONDARY,
  },
  cardArrow: {
    fontSize: TAGS_UI.ARROW_SIZE,
    color: TAGS_COLORS.ARROW_COLOR,
  },
  cardArrowDisabled: {
    color: TAGS_COLORS.TEXT_PLACEHOLDER,
  },
  
  // 卡片内容
  cardContent: {
    flex: 1,
    justifyContent: 'center',
  },
  placeholderText: {
    fontSize: TAGS_FONTS.PLACEHOLDER_SIZE,
    fontWeight: TAGS_FONTS.PLACEHOLDER_WEIGHT,
    color: TAGS_COLORS.TEXT_PLACEHOLDER,
  },
  
  // 话题标签样式
  topicTagsContainer: {
    maxHeight: TAGS_UI.TAG_HEIGHT + 8,
  },
  topicTagsContent: {
    alignItems: 'center',
  },
  topicTag: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: TAGS_COLORS.TAG_BACKGROUND,
    borderRadius: TAGS_UI.TAG_BORDER_RADIUS,
    paddingHorizontal: TAGS_UI.TAG_PADDING_HORIZONTAL,
    paddingVertical: TAGS_UI.TAG_PADDING_VERTICAL,
    marginRight: TAGS_UI.TAG_MARGIN,
    height: TAGS_UI.TAG_HEIGHT,
  },
  topicTagSelected: {
    backgroundColor: TAGS_COLORS.TAG_BACKGROUND,
  },
  topicTagDisabled: {
    opacity: 0.5,
  },
  topicTagText: {
    fontSize: TAGS_FONTS.TAG_SIZE,
    fontWeight: TAGS_FONTS.TAG_WEIGHT,
    color: TAGS_COLORS.TAG_TEXT,
    marginRight: 4,
  },
  topicTagTextDisabled: {
    color: TAGS_COLORS.TEXT_PLACEHOLDER,
  },
  hotIcon: {
    fontSize: 12,
    marginRight: 4,
  },
  topicRemoveButton: {
    width: 16,
    height: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  topicRemoveText: {
    fontSize: 12,
    color: TAGS_COLORS.TAG_REMOVE,
    fontWeight: 'bold',
  },
  
  // 地点标签样式
  locationTag: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'transparent',
    paddingVertical: 4,
  },
  locationTagDisabled: {
    opacity: 0.5,
  },
  locationInfo: {
    flex: 1,
  },
  locationName: {
    fontSize: TAGS_FONTS.VALUE_SIZE,
    fontWeight: TAGS_FONTS.VALUE_WEIGHT,
    color: TAGS_COLORS.TEXT_PRIMARY,
    marginBottom: 2,
  },
  locationNameDisabled: {
    color: TAGS_COLORS.TEXT_PLACEHOLDER,
  },
  locationAddress: {
    fontSize: 12,
    color: TAGS_COLORS.TEXT_SECONDARY,
  },
  locationAddressDisabled: {
    color: TAGS_COLORS.TEXT_PLACEHOLDER,
  },
  locationDistance: {
    fontSize: 12,
    color: TAGS_COLORS.TEXT_SECONDARY,
    marginRight: 8,
  },
  locationRemoveButton: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: TAGS_COLORS.TAG_BACKGROUND,
    justifyContent: 'center',
    alignItems: 'center',
  },
  locationRemoveText: {
    fontSize: 12,
    color: TAGS_COLORS.TAG_REMOVE,
    fontWeight: 'bold',
  },
  
  // 提示信息
  hintText: {
    fontSize: 12,
    color: TAGS_COLORS.TEXT_SECONDARY,
    textAlign: 'center',
    marginTop: 4,
  },
});
// #endregion

// #region 9. Exports
export default FunctionTagsArea;
export type { FunctionTagsAreaProps };
// #endregion
