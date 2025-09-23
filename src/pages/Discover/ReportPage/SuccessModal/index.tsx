// #region 1. File Banner & TOC
/**
 * SuccessModal - 成功反馈弹窗组件
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
import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  Animated,
  StyleSheet,
  Dimensions,
  TouchableWithoutFeedback,
  Platform,
  Vibration,
} from 'react-native';

import { SuccessModalProps } from '../types';
import { REPORT_CONSTANTS } from '../constants';
// #endregion

// #region 3. Types & Schema
interface SuccessModalAnimationState {
  overlayOpacity: Animated.Value;
  modalScale: Animated.Value;
  modalOpacity: Animated.Value;
  buttonScale: Animated.Value;
}
// #endregion

// #region 4. Constants & Config
const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

const SUCCESS_MODAL_CONFIG = {
  width: REPORT_CONSTANTS.LAYOUT.MODAL_WIDTH,
  height: REPORT_CONSTANTS.LAYOUT.MODAL_HEIGHT,
  borderRadius: REPORT_CONSTANTS.UI.SIZES.MODAL_BORDER_RADIUS,
  buttonHeight: REPORT_CONSTANTS.LAYOUT.BUTTON_HEIGHT,
  buttonWidth: REPORT_CONSTANTS.LAYOUT.BUTTON_WIDTH,
  animationDuration: REPORT_CONSTANTS.UI.ANIMATION.DURATION_NORMAL,
  buttonAnimationDuration: REPORT_CONSTANTS.UI.ANIMATION.DURATION_FAST,
} as const;
// #endregion

// #region 5. Utils & Helpers
const createSuccessAnimationValues = (): SuccessModalAnimationState => ({
  overlayOpacity: new Animated.Value(0),
  modalScale: new Animated.Value(0.8),
  modalOpacity: new Animated.Value(0),
  buttonScale: new Animated.Value(1),
});

const animateSuccessIn = (animationState: SuccessModalAnimationState) => {
  Animated.parallel([
    Animated.timing(animationState.overlayOpacity, {
      toValue: 1,
      duration: SUCCESS_MODAL_CONFIG.animationDuration,
      useNativeDriver: true,
    }),
    Animated.sequence([
      Animated.timing(animationState.modalOpacity, {
        toValue: 1,
        duration: SUCCESS_MODAL_CONFIG.animationDuration * 0.6,
        useNativeDriver: true,
      }),
      Animated.spring(animationState.modalScale, {
        toValue: 1,
        tension: 100,
        friction: 8,
        useNativeDriver: true,
      }),
    ]),
  ]).start();
};

const animateSuccessOut = (animationState: SuccessModalAnimationState, onComplete: () => void) => {
  Animated.parallel([
    Animated.timing(animationState.overlayOpacity, {
      toValue: 0,
      duration: SUCCESS_MODAL_CONFIG.animationDuration,
      useNativeDriver: true,
    }),
    Animated.timing(animationState.modalScale, {
      toValue: 0.9,
      duration: SUCCESS_MODAL_CONFIG.animationDuration,
      useNativeDriver: true,
    }),
    Animated.timing(animationState.modalOpacity, {
      toValue: 0,
      duration: SUCCESS_MODAL_CONFIG.animationDuration,
      useNativeDriver: true,
    }),
  ]).start(onComplete);
};

const animateButtonPress = (buttonScale: Animated.Value, onComplete: () => void) => {
  Animated.sequence([
    Animated.timing(buttonScale, {
      toValue: 0.95,
      duration: SUCCESS_MODAL_CONFIG.buttonAnimationDuration,
      useNativeDriver: true,
    }),
    Animated.timing(buttonScale, {
      toValue: 1,
      duration: SUCCESS_MODAL_CONFIG.buttonAnimationDuration * 1.5,
      useNativeDriver: true,
    }),
  ]).start(onComplete);
};

const triggerHapticFeedback = () => {
  if (Platform.OS === 'ios') {
    // iOS 触觉反馈
    const HapticFeedback = require('react-native').HapticFeedback;
    if (HapticFeedback?.trigger) {
      HapticFeedback.trigger('notificationSuccess');
    }
  } else {
    // Android 震动反馈
    Vibration.vibrate(100);
  }
};
// #endregion

// #region 6. State Management
const useSuccessModalAnimation = (visible: boolean) => {
  const animationState = useRef<SuccessModalAnimationState>(createSuccessAnimationValues()).current;

  useEffect(() => {
    if (visible) {
      animateSuccessIn(animationState);
      // 触发成功反馈
      triggerHapticFeedback();
    }
  }, [visible, animationState]);

  const hideWithAnimation = (onComplete: () => void) => {
    animateSuccessOut(animationState, onComplete);
  };

  const handleButtonPress = (onComplete: () => void) => {
    animateButtonPress(animationState.buttonScale, onComplete);
  };

  return { animationState, hideWithAnimation, handleButtonPress };
};
// #endregion

// #region 7. Domain Logic
const useSuccessModalLogic = (
  visible: boolean,
  onConfirm: () => void,
  message?: string,
) => {
  const { animationState, hideWithAnimation, handleButtonPress } = useSuccessModalAnimation(visible);

  const handleConfirm = () => {
    // 按钮按下动画 + 触觉反馈
    triggerHapticFeedback();
    
    handleButtonPress(() => {
      hideWithAnimation(() => {
        onConfirm();
      });
    });
  };

  const handleOverlayPress = () => {
    // 点击遮罩层不关闭弹窗，必须点击确定按钮
  };

  const displayMessage = message || REPORT_CONSTANTS.TEXT.SUCCESS_MESSAGE;

  return {
    animationState,
    handleConfirm,
    handleOverlayPress,
    displayMessage,
  };
};
// #endregion

// #region 8. UI Components & Rendering
/**
 * 成功按钮组件
 */
const SuccessButton: React.FC<{
  onPress: () => void;
  text: string;
  buttonScale: Animated.Value;
}> = ({ onPress, text, buttonScale }) => (
  <Animated.View style={{ transform: [{ scale: buttonScale }] }}>
    <TouchableOpacity
      style={styles.confirmButton}
      onPress={onPress}
      activeOpacity={1} // 使用自定义动画，不使用默认的 activeOpacity
    >
      <Text style={styles.confirmButtonText}>
        {text}
      </Text>
    </TouchableOpacity>
  </Animated.View>
);

/**
 * 成功反馈弹窗主组件
 */
const SuccessModal: React.FC<SuccessModalProps> = ({
  visible,
  onConfirm,
  message,
}) => {
  const {
    animationState,
    handleConfirm,
    handleOverlayPress,
    displayMessage,
  } = useSuccessModalLogic(visible, onConfirm, message);

  if (!visible) return null;

  return (
    <Modal
      transparent
      visible={visible}
      animationType="none"
      statusBarTranslucent
    >
      {/* 遮罩层 */}
      <TouchableWithoutFeedback onPress={handleOverlayPress}>
        <Animated.View
          style={[
            styles.overlay,
            { opacity: animationState.overlayOpacity },
          ]}
        >
          {/* 防止事件冒泡的容器 */}
          <TouchableWithoutFeedback>
            <Animated.View
              style={[
                styles.modalContainer,
                {
                  opacity: animationState.modalOpacity,
                  transform: [{ scale: animationState.modalScale }],
                },
              ]}
            >
              {/* 弹窗内容 */}
              <View style={styles.modal}>
                {/* 成功消息 */}
                <Text style={styles.message}>
                  {displayMessage}
                </Text>

                {/* 确定按钮 */}
                <SuccessButton
                  onPress={handleConfirm}
                  text={REPORT_CONSTANTS.TEXT.SUCCESS_BUTTON}
                  buttonScale={animationState.buttonScale}
                />
              </View>
            </Animated.View>
          </TouchableWithoutFeedback>
        </Animated.View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  modal: {
    width: SUCCESS_MODAL_CONFIG.width,
    height: SUCCESS_MODAL_CONFIG.height,
    backgroundColor: REPORT_CONSTANTS.UI.COLORS.BACKGROUND,
    borderRadius: SUCCESS_MODAL_CONFIG.borderRadius,
    paddingTop: REPORT_CONSTANTS.UI.SPACING.XL,
    paddingBottom: REPORT_CONSTANTS.UI.SPACING.LG,
    paddingHorizontal: REPORT_CONSTANTS.UI.SPACING.LG,
    justifyContent: 'space-between',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.12,
    shadowRadius: 32,
    elevation: 16,
  },
  message: {
    fontSize: 17,
    fontWeight: '500',
    color: REPORT_CONSTANTS.UI.COLORS.TEXT_PRIMARY,
    textAlign: 'center',
    lineHeight: 17 * 1.4,
    paddingHorizontal: REPORT_CONSTANTS.UI.SPACING.SM,
  },
  confirmButton: {
    width: SUCCESS_MODAL_CONFIG.buttonWidth,
    height: SUCCESS_MODAL_CONFIG.buttonHeight,
    borderRadius: REPORT_CONSTANTS.UI.SIZES.BUTTON_BORDER_RADIUS,
    justifyContent: 'center',
    alignItems: 'center',
    // 渐变紫色背景
    backgroundColor: REPORT_CONSTANTS.UI.COLORS.PRIMARY,
    shadowColor: REPORT_CONSTANTS.UI.COLORS.PRIMARY,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  confirmButtonText: {
    fontSize: REPORT_CONSTANTS.UI.FONTS.MEDIUM,
    fontWeight: '600',
    color: '#FFFFFF',
  },
});
// #endregion

// #region 9. Exports
export default SuccessModal;
export { SuccessModal };
// #endregion
