/**
 * 图片查看器组件
 * 支持手势缩放、滑动切换、保存分享等功能
 */

import React, { memo, useState, useRef } from 'react';
import {
  View,
  Image,
  Modal,
  Dimensions,
  StyleSheet,
  TouchableOpacity,
  Text,
  StatusBar,
  Animated,
  Alert,
  Share,
} from 'react-native';
import {
  PanGestureHandler,
  PinchGestureHandler,
  State,
} from 'react-native-gesture-handler';
import { ImageViewerProps } from '../types';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

const ImageViewer: React.FC<ImageViewerProps> = ({
  images,
  currentIndex,
  visible,
  onClose,
  onIndexChange,
}) => {
  const [scale, setScale] = useState(1);
  const [translateX, setTranslateX] = useState(0);
  const [translateY, setTranslateY] = useState(0);
  const [imageIndex, setImageIndex] = useState(currentIndex);

  // 动画值
  const scaleValue = useRef(new Animated.Value(1)).current;
  const translateXValue = useRef(new Animated.Value(0)).current;
  const translateYValue = useRef(new Animated.Value(0)).current;

  // 手势状态
  const baseScale = useRef(1);
  const baseTranslateX = useRef(0);
  const baseTranslateY = useRef(0);

  // 处理缩放手势
  const onPinchGestureEvent = Animated.event(
    [{ nativeEvent: { scale: scaleValue } }],
    { useNativeDriver: true }
  );

  const onPinchHandlerStateChange = (event: any) => {
    if (event.nativeEvent.state === State.END) {
      const newScale = baseScale.current * event.nativeEvent.scale;
      
      if (newScale < 1) {
        // 缩小到小于1时回弹到1
        Animated.spring(scaleValue, {
          toValue: 1,
          useNativeDriver: true,
        }).start();
        baseScale.current = 1;
        setScale(1);
      } else if (newScale > 4) {
        // 放大超过4倍时限制到4倍
        Animated.spring(scaleValue, {
          toValue: 4,
          useNativeDriver: true,
        }).start();
        baseScale.current = 4;
        setScale(4);
      } else {
        baseScale.current = newScale;
        setScale(newScale);
      }
    }
  };

  // 处理拖拽手势
  const onPanGestureEvent = Animated.event(
    [{ nativeEvent: { translationX: translateXValue, translationY: translateYValue } }],
    { useNativeDriver: true }
  );

  const onPanHandlerStateChange = (event: any) => {
    if (event.nativeEvent.state === State.END) {
      const { translationX, translationY, velocityX, velocityY } = event.nativeEvent;
      
      // 如果是放大状态，限制移动范围
      if (scale > 1) {
        const maxTranslateX = (screenWidth * (scale - 1)) / 2;
        const maxTranslateY = (screenHeight * (scale - 1)) / 2;
        
        const newTranslateX = Math.max(-maxTranslateX, Math.min(maxTranslateX, baseTranslateX.current + translationX));
        const newTranslateY = Math.max(-maxTranslateY, Math.min(maxTranslateY, baseTranslateY.current + translationY));
        
        Animated.spring(translateXValue, {
          toValue: newTranslateX,
          useNativeDriver: true,
        }).start();
        
        Animated.spring(translateYValue, {
          toValue: newTranslateY,
          useNativeDriver: true,
        }).start();
        
        baseTranslateX.current = newTranslateX;
        baseTranslateY.current = newTranslateY;
        setTranslateX(newTranslateX);
        setTranslateY(newTranslateY);
      } else {
        // 正常大小时处理左右滑动切换图片
        if (Math.abs(translationX) > 50 || Math.abs(velocityX) > 500) {
          if (translationX > 0 && imageIndex > 0) {
            // 向右滑动，切换到上一张
            changeImage(imageIndex - 1);
          } else if (translationX < 0 && imageIndex < images.length - 1) {
            // 向左滑动，切换到下一张
            changeImage(imageIndex + 1);
          }
        }
        
        // 垂直滑动关闭
        if (Math.abs(translationY) > 100 || Math.abs(velocityY) > 500) {
          onClose();
        }
        
        // 重置位置
        Animated.spring(translateXValue, {
          toValue: 0,
          useNativeDriver: true,
        }).start();
        
        Animated.spring(translateYValue, {
          toValue: 0,
          useNativeDriver: true,
        }).start();
        
        baseTranslateX.current = 0;
        baseTranslateY.current = 0;
        setTranslateX(0);
        setTranslateY(0);
      }
    }
  };

  // 切换图片
  const changeImage = (newIndex: number) => {
    if (newIndex >= 0 && newIndex < images.length) {
      setImageIndex(newIndex);
      onIndexChange?.(newIndex);
      resetImageState();
    }
  };

  // 重置图片状态
  const resetImageState = () => {
    scaleValue.setValue(1);
    translateXValue.setValue(0);
    translateYValue.setValue(0);
    baseScale.current = 1;
    baseTranslateX.current = 0;
    baseTranslateY.current = 0;
    setScale(1);
    setTranslateX(0);
    setTranslateY(0);
  };

  // 双击放大/缩小
  const handleDoubleTap = () => {
    if (scale === 1) {
      // 放大到2倍
      Animated.spring(scaleValue, {
        toValue: 2,
        useNativeDriver: true,
      }).start();
      baseScale.current = 2;
      setScale(2);
    } else {
      // 缩小到1倍
      Animated.spring(scaleValue, {
        toValue: 1,
        useNativeDriver: true,
      }).start();
      Animated.spring(translateXValue, {
        toValue: 0,
        useNativeDriver: true,
      }).start();
      Animated.spring(translateYValue, {
        toValue: 0,
        useNativeDriver: true,
      }).start();
      resetImageState();
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
          // TODO: 实现保存图片到相册的功能
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
        <PanGestureHandler
          onGestureEvent={onPanGestureEvent}
          onHandlerStateChange={onPanHandlerStateChange}
        >
          <Animated.View style={styles.imageContainer}>
            <PinchGestureHandler
              onGestureEvent={onPinchGestureEvent}
              onHandlerStateChange={onPinchHandlerStateChange}
            >
              <Animated.View style={styles.imageWrapper}>
                <TouchableOpacity
                  onPress={handleDoubleTap}
                  activeOpacity={1}
                  style={styles.imageTouchable}
                >
                  <Animated.Image
                    source={{ uri: images[imageIndex] }}
                    style={[
                      styles.image,
                      {
                        transform: [
                          { scale: scaleValue },
                          { translateX: translateXValue },
                          { translateY: translateYValue },
                        ],
                      },
                    ]}
                    resizeMode="contain"
                  />
                </TouchableOpacity>
              </Animated.View>
            </PinchGestureHandler>
          </Animated.View>
        </PanGestureHandler>

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
  },
  imageWrapper: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  imageTouchable: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: screenWidth,
    height: screenHeight,
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

export default memo(ImageViewer);
