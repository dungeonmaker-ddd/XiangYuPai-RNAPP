/**
 * 标题图标按钮组件
 * 可复用的功能卡片组件，支持图标、标题、角标和动画效果
 */

import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Image,
} from 'react-native';

import { COLORS, SIZES, FONT_SIZES, ANIMATIONS } from '../constants';

// 图标映射配置 - PNG图标
const PNG_ICONS: { [key: string]: any } = {
  // 交易功能图标
  'document-text-outline': require('./transaction/我的发布.png'),
  'receipt-outline': require('./transaction/我的订单.png'),
  'bag-outline': require('./transaction/我的购买.png'),
  'mail-outline': require('./transaction/我的报名.png'),
  
  // 功能图标
  'person-outline': require('./fuction/个人中心.png'),
  'radio-button-on-outline': require('./fuction/状态.png'),
  'wallet-outline': require('./fuction/钱包.png'),
  'diamond-outline': require('./fuction/金币.png'),
  'settings-outline': require('./fuction/设置.png'),
  'headset-outline': require('./fuction/客服.png'),
  'ribbon-outline': require('./fuction/达人认证.png'),
};

// 备用Emoji图标配置（作为fallback）
const EMOJI_ICONS: { [key: string]: string } = {
  'person-outline': '👤',
  'radio-button-on-outline': '🔘',
  'wallet-outline': '💰',
  'diamond-outline': '💎',
  'settings-outline': '⚙️',
  'headset-outline': '🎧',
  'ribbon-outline': '👑',
};

export interface TitleIconButtonProps {
  /** 功能配置 */
  config: {
    id: string;
    title: string;
    icon: string;
    color: string;
  };
  /** 角标数量 */
  badge?: number;
  /** 点击回调 */
  onPress: () => void;
  /** 自定义样式 */
  style?: any;
  /** 无障碍标签 */
  accessibilityLabel?: string;
  /** 无障碍提示 */
  accessibilityHint?: string;
  /** 按钮尺寸 */
  size?: 'small' | 'large';
}

export const TitleIconButton: React.FC<TitleIconButtonProps> = React.memo(({
  config,
  badge = 0,
  onPress,
  style,
  accessibilityLabel,
  accessibilityHint,
  size = 'small', // 默认使用小尺寸
}) => {
  const scaleValue = React.useRef(new Animated.Value(1)).current;

  // 根据尺寸获取样式配置
  const sizeConfig = React.useMemo(() => {
    if (size === 'large') {
      return {
        cardMinHeight: 85,
        cardMaxHeight: 84,
        iconSize: 48,
        iconRadius: 24,
        iconImageSize: 42,
        iconTextSize: 22,
        iconMarginBottom: 8,
        titleFontSize: FONT_SIZES.BODY_SMALL,
      };
    } else {
      return {
        cardMinHeight: 75,
        cardMaxHeight: 84,
        iconSize: 42,
        iconRadius: 21,
        iconImageSize: 36,
        iconTextSize: 20,
        iconMarginBottom: 6,
        titleFontSize: FONT_SIZES.BODY_SMALL,
      };
    }
  }, [size]);

  const handlePressIn = () => {
    Animated.spring(scaleValue, {
      toValue: ANIMATIONS.SCALE_PRESS,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleValue, {
      toValue: 1,
      useNativeDriver: true,
    }).start();
  };

  return (
    <Animated.View
      style={[
        styles.functionCard,
        {
          minHeight: sizeConfig.cardMinHeight,
          maxHeight: sizeConfig.cardMaxHeight,
          transform: [{ scale: scaleValue }],
        },
        style,
      ]}
    >
      <TouchableOpacity
        style={styles.touchable}
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        activeOpacity={0.8}
        accessible={true}
        accessibilityRole="button"
        accessibilityLabel={
          accessibilityLabel || 
          `${config.title}${badge > 0 ? `, ${badge} 条新消息` : ''}`
        }
        accessibilityHint={accessibilityHint || `点击进入${config.title}页面`}
      >
        <View style={styles.cardContent}>
          {/* 图标容器 */}
          <View style={[
            styles.iconContainer,
            {
              width: sizeConfig.iconSize,
              height: sizeConfig.iconSize,
              borderRadius: sizeConfig.iconRadius,
              marginBottom: sizeConfig.iconMarginBottom,
            }
          ]}>
            {/* 优先使用PNG图标，否则使用Emoji */}
            {PNG_ICONS[config.icon] ? (
              <Image 
                source={PNG_ICONS[config.icon]} 
                style={[
                  styles.iconImage,
                  {
                    width: sizeConfig.iconImageSize,
                    height: sizeConfig.iconImageSize,
                  }
                ]}
                resizeMode="contain"
              />
            ) : (
              <Text style={[
                styles.iconText,
                { fontSize: sizeConfig.iconTextSize }
              ]}>
                {EMOJI_ICONS[config.icon] || '📱'}
              </Text>
            )}
            
            {/* 角标 */}
            {badge > 0 && (
              <View style={styles.badge}>
                <Text style={styles.badgeText}>
                  {badge > 99 ? '99+' : badge.toString()}
                </Text>
              </View>
            )}
          </View>

          {/* 标题 */}
          <Text style={[
            styles.cardTitle,
            { fontSize: sizeConfig.titleFontSize }
          ]} numberOfLines={1}>
            {config.title}
          </Text>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
});

const styles = StyleSheet.create({
  functionCard: {
    flex: 1, // 使用flex布局，平均分配空间
    aspectRatio: 1, // 保持正方形比例
    // 高度由sizeConfig动态控制
  },
  touchable: {
    flex: 1,
    borderRadius: SIZES.COMPONENT_RADIUS + 2,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    margin: 0, // 确保没有默认边距
    padding: 0, // 确保没有默认内边距
  },
  cardContent: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconContainer: {
    // 尺寸由sizeConfig动态控制
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    // 移除所有阴影效果
  },
  iconText: {
    // 字体大小由sizeConfig动态控制
    textAlign: 'center',
  },
  iconImage: {
    // 尺寸由sizeConfig动态控制
  },
  badge: {
    position: 'absolute',
    top: -3,
    right: -3,
    minWidth: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: COLORS.ERROR,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 5,
    borderWidth: 2,
    borderColor: COLORS.WHITE,
    shadowColor: COLORS.ERROR,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 4,
  },
  badgeText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: COLORS.WHITE,
    lineHeight: 12,
    textAlign: 'center',
  },
  cardTitle: {
    // 字体大小由sizeConfig动态控制
    color: COLORS.BLACK,
    textAlign: 'center',
    width: '100%',
    paddingHorizontal: 4,
    lineHeight: 14,
  },
});

export default TitleIconButton;
