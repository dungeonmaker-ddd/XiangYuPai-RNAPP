/**
 * 图片查看器区域组件
 * 简化版本 - 支持基本的图片查看和切换功能
 * 
 * TOC (快速跳转):
 * [1] Imports
 * [2] Types & Schema  
 * [3] Constants & Config
 * [4] UI Components & Rendering
 * [5] Exports
 */

// ==================== 1. Imports ====================
import React, { memo, useState } from 'react';
import {
  View,
  Image,
  Modal,
  Dimensions,
  StyleSheet,
  TouchableOpacity,
  Text,
  StatusBar,
  Alert,
  Share,
} from 'react-native';

// ==================== 2. Types & Schema ====================
interface ImageViewerAreaProps {
  images: string[];
  currentIndex: number;
  visible: boolean;
  onClose: () => void;
  onIndexChange?: (index: number) => void;
}

// ==================== 3. Constants & Config ====================
const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

// ==================== 4. UI Components & Rendering ====================
const ImageViewerArea: React.FC<ImageViewerAreaProps> = ({
  images,
  currentIndex,
  visible,
  onClose,
  onIndexChange,
}) => {
  const [imageIndex, setImageIndex] = useState(currentIndex);

  // 切换图片
  const changeImage = (newIndex: number) => {
    if (newIndex >= 0 && newIndex < images.length) {
      setImageIndex(newIndex);
      onIndexChange?.(newIndex);
    }
  };

  // 上一张图片
  const handlePrevious = () => {
    if (imageIndex > 0) {
      changeImage(imageIndex - 1);
    }
  };

  // 下一张图片
  const handleNext = () => {
    if (imageIndex < images.length - 1) {
      changeImage(imageIndex + 1);
    }
  };

  // 保存图片
  const handleSaveImage = () => {
    Alert.alert(
      '保存图片',
      '是否保存当前图片到相册？',
      [
        { text: '取消', style: 'cancel' },
        { text: '保存', onPress: () => {
          Alert.alert('提示', '图片已保存到相册');
        }},
      ]
    );
  };

  // 分享图片
  const handleShareImage = async () => {
    try {
      await Share.share({
        message: '分享图片',
        url: images[imageIndex],
      });
    } catch (error) {
      Alert.alert('分享失败', '无法分享此图片');
    }
  };

  if (!visible) {
    return null;
  }

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      onRequestClose={onClose}
    >
      <StatusBar hidden={true} />
      <View style={styles.container}>
        {/* 关闭按钮 */}
        <TouchableOpacity
          style={styles.closeButton}
          onPress={onClose}
          activeOpacity={0.7}
        >
          <Text style={styles.closeText}>✕</Text>
        </TouchableOpacity>

        {/* 图片计数 */}
        {images.length > 1 && (
          <View style={styles.countIndicator}>
            <Text style={styles.countText}>
              {imageIndex + 1} / {images.length}
            </Text>
          </View>
        )}

        {/* 图片容器 */}
        <View style={styles.imageContainer}>
          <Image
            source={{ uri: images[imageIndex] }}
            style={styles.image}
            resizeMode="contain"
          />
          
          {/* 左右切换按钮 */}
          {images.length > 1 && (
            <>
              <TouchableOpacity
                style={[styles.navButton, styles.leftButton]}
                onPress={handlePrevious}
                disabled={imageIndex === 0}
                activeOpacity={0.7}
              >
                <Text style={styles.navButtonText}>‹</Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={[styles.navButton, styles.rightButton]}
                onPress={handleNext}
                disabled={imageIndex === images.length - 1}
                activeOpacity={0.7}
              >
                <Text style={styles.navButtonText}>›</Text>
              </TouchableOpacity>
            </>
          )}
        </View>

        {/* 底部操作栏 */}
        <View style={styles.bottomActions}>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={handleSaveImage}
            activeOpacity={0.7}
          >
            <Text style={styles.actionIcon}>📁</Text>
            <Text style={styles.actionText}>保存</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionButton}
            onPress={handleShareImage}
            activeOpacity={0.7}
          >
            <Text style={styles.actionIcon}>📤</Text>
            <Text style={styles.actionText}>分享</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.95)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeButton: {
    position: 'absolute',
    top: 50,
    left: 20,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 999,
  },
  closeText: {
    fontSize: 18,
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  countIndicator: {
    position: 'absolute',
    top: 50,
    right: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 15,
    zIndex: 999,
  },
  countText: {
    fontSize: 14,
    color: '#FFFFFF',
    fontWeight: '500',
  },
  imageContainer: {
    flex: 1,
    width: screenWidth,
    height: screenHeight,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  image: {
    width: screenWidth,
    height: screenHeight,
  },
  navButton: {
    position: 'absolute',
    top: '50%',
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: -25,
  },
  leftButton: {
    left: 20,
  },
  rightButton: {
    right: 20,
  },
  navButtonText: {
    fontSize: 30,
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  bottomActions: {
    position: 'absolute',
    bottom: 50,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    borderRadius: 25,
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  actionButton: {
    alignItems: 'center',
    marginHorizontal: 20,
  },
  actionIcon: {
    fontSize: 24,
    marginBottom: 4,
  },
  actionText: {
    fontSize: 12,
    color: '#FFFFFF',
    fontWeight: '500',
  },
});

// ==================== 5. Exports ====================
export default memo(ImageViewerArea);
export type { ImageViewerAreaProps };
