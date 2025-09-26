/**
 * ContentCard - 内容卡片组件
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
  TouchableOpacity,
  Text,
  Image,
  StyleSheet,
} from 'react-native';

// 内部模块导入
import { COLORS, SPACING, FONTS } from '../../../constants';
import type { ContentItem } from '../../../types';
import { processContentData } from './processData';
import { utilsContentFormat } from './utilsFormat';
// #endregion

// #region 2. Types & Schema
interface ContentCardProps {
  item: ContentItem;
  keyword: string;
  onPress?: (item: ContentItem) => void;
}
// #endregion

// #region 3. Constants & Config
const CARD_CONFIG = {
  borderRadius: 12,
  imageAspectRatio: 4 / 3,
  avatarSize: 20,
} as const;
// #endregion

// #region 4. Utils & Helpers
// 工具函数已移至 ./utilsFormat.ts
// #endregion

// #region 5. State Management
// 状态管理逻辑
// #endregion

// #region 6. Domain Logic
// 业务逻辑已移至 ./processData.ts
// #endregion

// #region 7. UI Components & Rendering
/**
 * ContentCard 组件 - 内容卡片
 * 展示图片/视频内容的卡片组件
 */
export const ContentCard: React.FC<ContentCardProps> = ({
  item,
  keyword,
  onPress,
}) => {
  const processedItem = processContentData(item);
  const { 
    formatCount, 
    truncateText, 
    getHighlightedTextParts,
    getContentTypeIcon 
  } = utilsContentFormat();

  const handlePress = () => {
    onPress?.(item);
  };

  const renderContentImage = () => {
    if (item.type === 'video') {
      return (
        <View style={styles.videoContainer}>
          <Image
            source={{ uri: item.videoCover || item.images?.[0] }}
            style={styles.contentImage}
            resizeMode="cover"
          />
          <View style={styles.playButton}>
            <Text style={styles.playIcon}>▶️</Text>
          </View>
          {item.videoDuration && (
            <View style={styles.durationBadge}>
              <Text style={styles.durationText}>
                {Math.floor(item.videoDuration / 60)}:{String(item.videoDuration % 60).padStart(2, '0')}
              </Text>
            </View>
          )}
        </View>
      );
    }

    return (
      <View style={styles.imageContainer}>
        <Image
          source={{ uri: item.images?.[0] }}
          style={styles.contentImage}
          resizeMode="cover"
        />
        {(item.images?.length || 0) > 1 && (
          <View style={styles.multiImageBadge}>
            <Text style={styles.multiImageText}>
              1/{item.images?.length}
            </Text>
          </View>
        )}
      </View>
    );
  };

  const renderContentInfo = () => (
    <View style={styles.contentInfo}>
      {/* 内容描述 */}
      <View style={styles.descriptionContainer}>
        <Text style={styles.descriptionText}>
          {getHighlightedTextParts(truncateText(item.description, 50), keyword).map((part, index) => (
            <Text
              key={index}
              style={[
                styles.descriptionText,
                part.highlighted && styles.highlightedText,
              ]}
            >
              {part.text}
            </Text>
          ))}
        </Text>
      </View>
      
      {/* 底部信息栏 */}
      <View style={styles.bottomInfo}>
        {/* 用户信息 */}
        <View style={styles.authorInfo}>
          <Image
            source={{ uri: item.author.avatar }}
            style={styles.authorAvatar}
          />
          <Text style={styles.authorName}>
            {truncateText(item.author.username, 8)}
          </Text>
        </View>
        
        {/* 互动数据 */}
        <View style={styles.statsInfo}>
          <Text style={styles.likeCount}>
            ❤️ {formatCount(item.likeCount)}
          </Text>
        </View>
      </View>
    </View>
  );

  return (
    <TouchableOpacity
      style={styles.card}
      onPress={handlePress}
      activeOpacity={0.9}
    >
      {/* 内容图片/视频 */}
      {renderContentImage()}
      
      {/* 内容信息 */}
      {renderContentInfo()}
    </TouchableOpacity>
  );
};
// #endregion

// #region 8. Styles
const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.backgroundCard,
    borderRadius: CARD_CONFIG.borderRadius,
    overflow: 'hidden',
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  imageContainer: {
    position: 'relative',
    width: '100%',
    aspectRatio: CARD_CONFIG.imageAspectRatio,
  },
  videoContainer: {
    position: 'relative',
    width: '100%',
    aspectRatio: CARD_CONFIG.imageAspectRatio,
  },
  contentImage: {
    width: '100%',
    height: '100%',
  },
  playButton: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: [{ translateX: -24 }, { translateY: -24 }],
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  playIcon: {
    fontSize: 20,
    color: COLORS.white,
  },
  durationBadge: {
    position: 'absolute',
    bottom: 8,
    right: 8,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  durationText: {
    fontSize: FONTS.size.xs,
    color: COLORS.white,
    fontWeight: FONTS.weight.medium,
  },
  multiImageBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  multiImageText: {
    fontSize: FONTS.size.xs,
    color: COLORS.white,
    fontWeight: FONTS.weight.medium,
  },
  contentInfo: {
    padding: SPACING.md,
  },
  descriptionContainer: {
    marginBottom: SPACING.sm,
  },
  descriptionText: {
    fontSize: FONTS.size.md,
    color: COLORS.textPrimary,
    lineHeight: FONTS.lineHeight.normal * FONTS.size.md,
  },
  highlightedText: {
    color: COLORS.primary,
    fontWeight: FONTS.weight.semiBold,
    backgroundColor: COLORS.highlightBackground,
  },
  bottomInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  authorInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  authorAvatar: {
    width: CARD_CONFIG.avatarSize,
    height: CARD_CONFIG.avatarSize,
    borderRadius: CARD_CONFIG.avatarSize / 2,
    marginRight: SPACING.xs,
  },
  authorName: {
    fontSize: FONTS.size.sm,
    color: COLORS.textSecondary,
    flex: 1,
  },
  statsInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  likeCount: {
    fontSize: FONTS.size.sm,
    color: COLORS.textLight,
  },
});
// #endregion

// #region 9. Exports
export default ContentCard;
// #endregion
