// #region 1. File Banner & TOC
/**
 * 功能按钮组件 - 可复用的功能卡片按钮
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
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Image,
} from 'react-native';

// 内部导入
import { COLORS, SIZES, FONT_SIZES, ANIMATIONS } from '../../constants';
// #endregion

// #region 3. Types & Schema
export interface FunctionButtonProps {
  config: {
    id: string;
    title: string;
    icon: string;
    color: string;
  };
  badge?: number;
  onPress: () => void;
  style?: any;
  accessibilityLabel?: string;
  accessibilityHint?: string;
  size?: 'small' | 'large';
}
// #endregion

// #region 4. Constants & Config
// 图标映射配置 - PNG图标
const PNG_ICONS: { [key: string]: any } = {
  // 交易功能图标
  'document-text-outline': require('./transaction/我的发布.png'),
  'receipt-outline': require('./transaction/我的订单.png'),
  'bag-outline': require('./transaction/我的购买.png'),
  'mail-outline': require('./transaction/我的报名.png'),
  
  // 功能图标
  'person-outline': require('./function/个人中心.png'),
  'radio-button-on-outline': require('./function/状态.png'),
  'wallet-outline': require('./function/钱包.png'),
  'diamond-outline': require('./function/金币.png'),
  'settings-outline': require('./function/设置.png'),
  'headset-outline': require('./function/客服.png'),
  'ribbon-outline': require('./function/达人认证.png'),
};

// 备用Emoji图标配置（作为fallback）
const EMOJI_ICONS: { [key: string]: string } = {
  'document-text-outline': '📄',
  'receipt-outline': '🧾',
  'bag-outline': '🛒',
  'mail-outline': '📨',
  'person-outline': '👤',
  'radio-button-on-outline': '🔘',
  'wallet-outline': '💰',
  'diamond-outline': '💎',
  'settings-outline': '⚙️',
  'headset-outline': '🎧',
  'ribbon-outline': '👑',
};
// #endregion

// #region 5. Utils & Helpers
const getSizeConfig = (size: 'small' | 'large') => {
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
};
// #endregion

// #region 6. State Management
// 动画状态通过useRef管理
// #endregion

// #region 7. Domain Logic
// 事件处理逻辑
// #endregion

// #region 8. UI Components & Rendering
export const FunctionButton: React.FC<FunctionButtonProps> = React.memo(({
  config,
  badge = 0,
  onPress,
  style,
  accessibilityLabel,
  accessibilityHint,
  size = 'small',
}) => {
  const scaleValue = React.useRef(new Animated.Value(1)).current;
  const sizeConfig = getSizeConfig(size);

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
              backgroundColor: config.color,
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
    flex: 1,
    aspectRatio: 1,
  },
  touchable: {
    flex: 1,
    borderRadius: SIZES.COMPONENT_RADIUS + 2,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    margin: 0,
    padding: 0,
  },
  cardContent: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  iconText: {
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
    color: COLORS.BLACK,
    textAlign: 'center',
    width: '100%',
    paddingHorizontal: 4,
    lineHeight: 14,
  },
});
// #endregion

// #region 9. Exports
export default FunctionButton;
// #endregion
