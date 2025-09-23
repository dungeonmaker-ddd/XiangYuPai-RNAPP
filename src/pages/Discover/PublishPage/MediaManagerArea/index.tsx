// #region 1. File Banner & TOC
/**
 * 媒体管理区域组件 - 图片和视频管理功能
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
  Image,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  ActivityIndicator,
  Dimensions,
} from 'react-native';

// 类型和常量导入
import type { MediaManagerAreaProps, MediaItem, MediaType } from './types';
import {
  MEDIA_LIMITS,
  MEDIA_UI,
  MEDIA_COLORS,
  UPLOAD_STATUS,
  ERROR_MESSAGES,
  BUTTON_TEXTS,
  HINT_TEXTS,
  ANIMATION,
} from './constants';
// #endregion

// #region 3. Types & Schema
interface MediaThumbnailProps {
  item: MediaItem;
  onRemove: (id: string) => void;
  onEdit: (id: string) => void;
  size: number;
  disabled?: boolean;
}

interface AddMediaButtonProps {
  onPress: () => void;
  disabled?: boolean;
  currentCount: number;
  maxCount: number;
  size: number;
}

interface ProgressOverlayProps {
  progress: number;
  status: string;
  size: number;
}
// #endregion

// #region 4. Constants & Config
const { width: SCREEN_WIDTH } = Dimensions.get('window');
const CONTAINER_PADDING = MEDIA_UI.CONTAINER_PADDING * 2;
const AVAILABLE_WIDTH = SCREEN_WIDTH - CONTAINER_PADDING;
const ITEM_SIZE = (AVAILABLE_WIDTH - (MEDIA_UI.ITEM_SPACING * 2)) / 3;

const DEFAULT_THUMBNAIL_SIZE = ITEM_SIZE;
const MAX_ITEMS_PER_ROW = 3;
const PROGRESS_OVERLAY_OPACITY = 0.8;
// #endregion

// #region 5. Utils & Helpers
const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
};

const formatDuration = (seconds: number): string => {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, '0')}`;
};

const getMediaIcon = (type: MediaType): string => {
  return type === 'video' ? '▶️' : '📷';
};

const isValidMediaItem = (item: MediaItem): boolean => {
  return item.uri && item.uri.length > 0;
};

const calculateGridLayout = (itemCount: number) => {
  const rows = Math.ceil(itemCount / MAX_ITEMS_PER_ROW);
  const lastRowItems = itemCount % MAX_ITEMS_PER_ROW || MAX_ITEMS_PER_ROW;
  return { rows, lastRowItems };
};

const shouldShowAddButton = (currentCount: number, maxCount: number): boolean => {
  return currentCount < maxCount;
};
// #endregion

// #region 6. State Management
const MediaManagerArea: React.FC<MediaManagerAreaProps> = ({
  mediaItems,
  onAddMedia,
  onRemoveMedia,
  onEditMedia,
  maxItems = MEDIA_LIMITS.MAX_ITEMS,
  allowedTypes = ['image', 'video'],
  disabled = false,
  loading = false,
}) => {
  // 本地状态
  const [selectedItemId, setSelectedItemId] = useState<string | null>(null);

  // 计算属性
  const validMediaItems = useMemo(() => 
    mediaItems.filter(isValidMediaItem),
    [mediaItems]
  );

  const canAddMore = useMemo(() => 
    shouldShowAddButton(validMediaItems.length, maxItems),
    [validMediaItems.length, maxItems]
  );

  const gridLayout = useMemo(() => 
    calculateGridLayout(validMediaItems.length + (canAddMore ? 1 : 0)),
    [validMediaItems.length, canAddMore]
  );
// #endregion

// #region 7. Domain Logic
  // 媒体删除确认
  const handleRemoveMedia = useCallback((id: string) => {
    Alert.alert(
      '删除媒体',
      '确定要删除这个媒体文件吗？',
      [
        { text: '取消', style: 'cancel' },
        {
          text: '删除',
          style: 'destructive',
          onPress: () => onRemoveMedia(id),
        },
      ]
    );
  }, [onRemoveMedia]);

  // 媒体编辑处理
  const handleEditMedia = useCallback((id: string) => {
    setSelectedItemId(id);
    onEditMedia(id);
  }, [onEditMedia]);

  // 媒体项长按处理
  const handleLongPressMedia = useCallback((id: string) => {
    setSelectedItemId(id);
    // 可以显示上下文菜单或其他操作
  }, []);

  // 添加媒体处理
  const handleAddMedia = useCallback(() => {
    if (validMediaItems.length >= maxItems) {
      Alert.alert('提示', `最多只能添加${maxItems}个媒体文件`);
      return;
    }
    onAddMedia();
  }, [validMediaItems.length, maxItems, onAddMedia]);
// #endregion

// #region 8. UI Components & Rendering
  // 进度覆盖层组件
  const ProgressOverlay: React.FC<ProgressOverlayProps> = ({ 
    progress, 
    status, 
    size 
  }) => (
    <View style={[
      styles.progressOverlay,
      { width: size, height: size }
    ]}>
      <View style={styles.progressContainer}>
        {status === UPLOAD_STATUS.UPLOADING ? (
          <>
            <ActivityIndicator color={MEDIA_COLORS.PROGRESS_FILL} size="small" />
            <Text style={styles.progressText}>{Math.round(progress)}%</Text>
          </>
        ) : status === UPLOAD_STATUS.FAILED ? (
          <>
            <Text style={styles.errorIcon}>⚠️</Text>
            <Text style={styles.errorText}>失败</Text>
          </>
        ) : null}
      </View>
    </View>
  );

  // 媒体缩略图组件
  const MediaThumbnail: React.FC<MediaThumbnailProps> = ({ 
    item, 
    onRemove, 
    onEdit, 
    size,
    disabled = false,
  }) => (
    <TouchableOpacity
      style={[
        styles.mediaThumbnail,
        { width: size, height: size },
        selectedItemId === item.id && styles.mediaThumbnailSelected,
        disabled && styles.mediaThumbnailDisabled,
      ]}
      onPress={() => handleEditMedia(item.id)}
      onLongPress={() => handleLongPressMedia(item.id)}
      disabled={disabled}
      activeOpacity={ANIMATION.OPACITY_PRESSED}
    >
      <Image
        source={{ uri: item.thumbnailUri || item.uri }}
        style={[styles.mediaImage, { width: size, height: size }]}
        resizeMode="cover"
      />
      
      {/* 视频时长标识 */}
      {item.type === 'video' && item.duration && (
        <View style={styles.videoDurationBadge}>
          <Text style={styles.videoDurationText}>
            {formatDuration(item.duration)}
          </Text>
        </View>
      )}
      
      {/* 媒体类型图标 */}
      <View style={styles.mediaTypeIcon}>
        <Text style={styles.mediaTypeText}>
          {getMediaIcon(item.type)}
        </Text>
      </View>
      
      {/* 删除按钮 */}
      <TouchableOpacity
        style={styles.removeButton}
        onPress={() => handleRemoveMedia(item.id)}
        hitSlop={{ top: 10, right: 10, bottom: 10, left: 10 }}
      >
        <Text style={styles.removeButtonText}>✕</Text>
      </TouchableOpacity>
      
      {/* 上传进度覆盖层 */}
      {(item.uploadStatus === UPLOAD_STATUS.UPLOADING || 
        item.uploadStatus === UPLOAD_STATUS.FAILED) && (
        <ProgressOverlay
          progress={item.uploadProgress}
          status={item.uploadStatus}
          size={size}
        />
      )}
      
      {/* 文件信息 */}
      <View style={styles.mediaInfo}>
        <Text style={styles.mediaInfoText}>
          {formatFileSize(item.fileSize)}
        </Text>
      </View>
    </TouchableOpacity>
  );

  // 添加媒体按钮组件
  const AddMediaButton: React.FC<AddMediaButtonProps> = ({ 
    onPress, 
    disabled, 
    currentCount, 
    maxCount, 
    size 
  }) => (
    <TouchableOpacity
      style={[
        styles.addMediaButton,
        { width: size, height: size },
        disabled && styles.addMediaButtonDisabled,
      ]}
      onPress={onPress}
      disabled={disabled}
      activeOpacity={ANIMATION.OPACITY_PRESSED}
    >
      <Text style={[
        styles.addMediaIcon,
        disabled && styles.addMediaIconDisabled,
      ]}>
        ➕
      </Text>
      <Text style={[
        styles.addMediaText,
        disabled && styles.addMediaTextDisabled,
      ]}>
        添加
      </Text>
      <Text style={styles.addMediaCount}>
        {currentCount}/{maxCount}
      </Text>
    </TouchableOpacity>
  );

  // 媒体网格渲染
  const renderMediaGrid = () => {
    const items = [...validMediaItems];
    if (canAddMore && !disabled) {
      items.push(null as any); // 添加按钮占位
    }

    const rows: (MediaItem | null)[][] = [];
    for (let i = 0; i < items.length; i += MAX_ITEMS_PER_ROW) {
      rows.push(items.slice(i, i + MAX_ITEMS_PER_ROW));
    }

    return (
      <View style={styles.mediaGrid}>
        {rows.map((row, rowIndex) => (
          <View key={rowIndex} style={styles.mediaRow}>
            {row.map((item, itemIndex) => {
              const globalIndex = rowIndex * MAX_ITEMS_PER_ROW + itemIndex;
              
              if (!item) {
                // 添加按钮
                return (
                  <AddMediaButton
                    key="add-button"
                    onPress={handleAddMedia}
                    disabled={disabled || loading}
                    currentCount={validMediaItems.length}
                    maxCount={maxItems}
                    size={DEFAULT_THUMBNAIL_SIZE}
                  />
                );
              }

              return (
                <MediaThumbnail
                  key={item.id}
                  item={item}
                  onRemove={handleRemoveMedia}
                  onEdit={handleEditMedia}
                  size={DEFAULT_THUMBNAIL_SIZE}
                  disabled={disabled}
                />
              );
            })}
          </View>
        ))}
      </View>
    );
  };

  // 提示信息渲染
  const renderHints = () => {
    if (validMediaItems.length === 0 && !loading) {
      return (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyIcon}>📷</Text>
          <Text style={styles.emptyText}>{HINT_TEXTS.NO_MEDIA}</Text>
          <Text style={styles.hintText}>{HINT_TEXTS.MAX_ITEMS}</Text>
        </View>
      );
    }

    return (
      <View style={styles.hintsContainer}>
        <Text style={styles.hintText}>
          {HINT_TEXTS.MAX_ITEMS}
        </Text>
      </View>
    );
  };

  // 主渲染
  return (
    <View style={styles.container}>
      {validMediaItems.length > 0 || canAddMore ? (
        renderMediaGrid()
      ) : (
        renderHints()
      )}
      
      {loading && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator color={MEDIA_COLORS.PROGRESS_FILL} />
          <Text style={styles.loadingText}>处理中...</Text>
        </View>
      )}
    </View>
  );
};

// 样式定义
const styles = StyleSheet.create({
  container: {
    backgroundColor: MEDIA_COLORS.BACKGROUND,
    paddingHorizontal: MEDIA_UI.CONTAINER_PADDING,
    paddingVertical: MEDIA_UI.ITEM_SPACING,
  },
  
  // 网格布局
  mediaGrid: {
    flex: 1,
  },
  mediaRow: {
    flexDirection: 'row',
    marginBottom: MEDIA_UI.ITEM_SPACING,
    justifyContent: 'flex-start',
  },
  
  // 媒体缩略图样式
  mediaThumbnail: {
    borderRadius: MEDIA_UI.THUMBNAIL_RADIUS,
    marginRight: MEDIA_UI.ITEM_SPACING,
    backgroundColor: MEDIA_COLORS.BORDER,
    overflow: 'hidden',
    position: 'relative',
  },
  mediaThumbnailSelected: {
    borderWidth: 2,
    borderColor: MEDIA_COLORS.PROGRESS_FILL,
  },
  mediaThumbnailDisabled: {
    opacity: 0.5,
  },
  mediaImage: {
    borderRadius: MEDIA_UI.THUMBNAIL_RADIUS,
  },
  
  // 媒体信息覆盖层
  videoDurationBadge: {
    position: 'absolute',
    bottom: 4,
    left: 4,
    backgroundColor: MEDIA_COLORS.OVERLAY,
    paddingHorizontal: 4,
    paddingVertical: 2,
    borderRadius: 4,
  },
  videoDurationText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '500',
  },
  mediaTypeIcon: {
    position: 'absolute',
    top: 4,
    left: 4,
  },
  mediaTypeText: {
    fontSize: 16,
  },
  mediaInfo: {
    position: 'absolute',
    bottom: 4,
    right: 4,
    backgroundColor: MEDIA_COLORS.OVERLAY,
    paddingHorizontal: 4,
    paddingVertical: 2,
    borderRadius: 4,
  },
  mediaInfoText: {
    color: '#FFFFFF',
    fontSize: 10,
  },
  
  // 删除按钮
  removeButton: {
    position: 'absolute',
    top: 4,
    right: 4,
    width: 20,
    height: 20,
    backgroundColor: MEDIA_COLORS.ERROR,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  removeButtonText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: 'bold',
  },
  
  // 进度覆盖层
  progressOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    backgroundColor: MEDIA_COLORS.OVERLAY,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: MEDIA_UI.THUMBNAIL_RADIUS,
  },
  progressContainer: {
    alignItems: 'center',
  },
  progressText: {
    color: '#FFFFFF',
    fontSize: 12,
    marginTop: 4,
    fontWeight: '500',
  },
  errorIcon: {
    fontSize: 20,
  },
  errorText: {
    color: '#FFFFFF',
    fontSize: 10,
    marginTop: 4,
  },
  
  // 添加按钮样式
  addMediaButton: {
    borderRadius: MEDIA_UI.ADD_BUTTON_RADIUS,
    backgroundColor: MEDIA_COLORS.ADD_BUTTON_BG,
    borderWidth: 2,
    borderColor: MEDIA_COLORS.ADD_BUTTON_BORDER,
    borderStyle: 'dashed',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: MEDIA_UI.ITEM_SPACING,
  },
  addMediaButtonDisabled: {
    opacity: 0.5,
  },
  addMediaIcon: {
    fontSize: 32,
    color: MEDIA_COLORS.ADD_ICON,
    marginBottom: 4,
  },
  addMediaIconDisabled: {
    color: MEDIA_COLORS.BORDER,
  },
  addMediaText: {
    fontSize: 12,
    color: MEDIA_COLORS.ADD_ICON,
    fontWeight: '500',
  },
  addMediaTextDisabled: {
    color: MEDIA_COLORS.BORDER,
  },
  addMediaCount: {
    fontSize: 10,
    color: MEDIA_COLORS.ADD_ICON,
    marginTop: 2,
  },
  
  // 空状态样式
  emptyContainer: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyIcon: {
    fontSize: 48,
    marginBottom: 12,
  },
  emptyText: {
    fontSize: 16,
    color: '#666666',
    marginBottom: 8,
  },
  
  // 提示信息
  hintsContainer: {
    marginTop: 8,
  },
  hintText: {
    fontSize: 12,
    color: '#999999',
    textAlign: 'center',
  },
  
  // 加载覆盖层
  loadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 8,
    fontSize: 14,
    color: '#666666',
  },
});
// #endregion

// #region 9. Exports
export default MediaManagerArea;
export type { MediaManagerAreaProps };
// #endregion
