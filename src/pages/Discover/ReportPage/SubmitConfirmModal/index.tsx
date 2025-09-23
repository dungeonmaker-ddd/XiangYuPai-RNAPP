// #region 1. File Banner & TOC
/**
 * SubmitConfirmModal - 提交确认弹窗组件
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
} from 'react-native';

import { SubmitConfirmModalProps } from '../types';
import { REPORT_CONSTANTS } from '../constants';
// #endregion

// #region 3. Types & Schema
interface ModalAnimationState {
  overlayOpacity: Animated.Value;
  modalScale: Animated.Value;
  modalOpacity: Animated.Value;
}
// #endregion

// #region 4. Constants & Config
const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

const MODAL_CONFIG = {
  width: REPORT_CONSTANTS.LAYOUT.MODAL_WIDTH,
  height: REPORT_CONSTANTS.LAYOUT.MODAL_HEIGHT,
  borderRadius: REPORT_CONSTANTS.UI.SIZES.MODAL_BORDER_RADIUS,
  buttonHeight: REPORT_CONSTANTS.LAYOUT.BUTTON_HEIGHT,
  buttonWidth: REPORT_CONSTANTS.LAYOUT.BUTTON_WIDTH,
  animationDuration: REPORT_CONSTANTS.UI.ANIMATION.DURATION_NORMAL,
} as const;
// #endregion

// #region 5. Utils & Helpers
const createAnimationValues = (): ModalAnimationState => ({
  overlayOpacity: new Animated.Value(0),
  modalScale: new Animated.Value(0.8),
  modalOpacity: new Animated.Value(0),
});

const animateIn = (animationState: ModalAnimationState) => {
  Animated.parallel([
    Animated.timing(animationState.overlayOpacity, {
      toValue: 1,
      duration: MODAL_CONFIG.animationDuration,
      useNativeDriver: true,
    }),
    Animated.timing(animationState.modalScale, {
      toValue: 1,
      duration: MODAL_CONFIG.animationDuration,
      useNativeDriver: true,
    }),
    Animated.timing(animationState.modalOpacity, {
      toValue: 1,
      duration: MODAL_CONFIG.animationDuration,
      useNativeDriver: true,
    }),
  ]).start();
};

const animateOut = (animationState: ModalAnimationState, onComplete: () => void) => {
  Animated.parallel([
    Animated.timing(animationState.overlayOpacity, {
      toValue: 0,
      duration: MODAL_CONFIG.animationDuration,
      useNativeDriver: true,
    }),
    Animated.timing(animationState.modalScale, {
      toValue: 0.8,
      duration: MODAL_CONFIG.animationDuration,
      useNativeDriver: true,
    }),
    Animated.timing(animationState.modalOpacity, {
      toValue: 0,
      duration: MODAL_CONFIG.animationDuration,
      useNativeDriver: true,
    }),
  ]).start(onComplete);
};
// #endregion

// #region 6. State Management
const useModalAnimation = (visible: boolean) => {
  const animationState = useRef<ModalAnimationState>(createAnimationValues()).current;

  useEffect(() => {
    if (visible) {
      animateIn(animationState);
    }
  }, [visible, animationState]);

  const hideWithAnimation = (onComplete: () => void) => {
    animateOut(animationState, onComplete);
  };

  return { animationState, hideWithAnimation };
};
// #endregion

// #region 7. Domain Logic
const useModalLogic = (
  visible: boolean,
  onCancel: () => void,
  onConfirm: () => void,
  isLoading: boolean = false,
) => {
  const { animationState, hideWithAnimation } = useModalAnimation(visible);

  const handleCancel = () => {
    if (isLoading) return; // 加载中禁止取消
    
    hideWithAnimation(() => {
      onCancel();
    });
  };

  const handleConfirm = () => {
    if (isLoading) return; // 加载中禁止重复提交
    
    onConfirm();
  };

  const handleOverlayPress = () => {
    // 点击遮罩层不关闭弹窗，必须点击按钮
  };

  return {
    animationState,
    handleCancel,
    handleConfirm,
    handleOverlayPress,
  };
};
// #endregion

// #region 8. UI Components & Rendering
/**
 * 加载状态按钮组件
 */
const LoadingButton: React.FC<{
  onPress: () => void;
  isLoading: boolean;
  text: string;
  style?: any;
  textStyle?: any;
}> = ({ onPress, isLoading, text, style, textStyle }) => (
  <TouchableOpacity
    style={[style, { opacity: isLoading ? 0.6 : 1 }]}
    onPress={onPress}
    disabled={isLoading}
    activeOpacity={0.8}
  >
    <Text style={textStyle}>
      {isLoading ? REPORT_CONSTANTS.TEXT.SUBMITTING : text}
    </Text>
  </TouchableOpacity>
);

/**
 * 提交确认弹窗主组件
 */
const SubmitConfirmModal: React.FC<SubmitConfirmModalProps> = ({
  visible,
  onCancel,
  onConfirm,
  isLoading = false,
}) => {
  const {
    animationState,
    handleCancel,
    handleConfirm,
    handleOverlayPress,
  } = useModalLogic(visible, onCancel, onConfirm, isLoading);

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
                {/* 标题 */}
                <Text style={styles.title}>
                  {REPORT_CONSTANTS.TEXT.CONFIRM_TITLE}
                </Text>

                {/* 描述 */}
                <Text style={styles.message}>
                  {REPORT_CONSTANTS.TEXT.CONFIRM_MESSAGE}
                </Text>

                {/* 按钮区域 */}
                <View style={styles.buttonContainer}>
                  {/* 取消按钮 */}
                  <TouchableOpacity
                    style={[styles.button, styles.cancelButton]}
                    onPress={handleCancel}
                    disabled={isLoading}
                    activeOpacity={0.8}
                  >
                    <Text style={[styles.buttonText, styles.cancelButtonText]}>
                      {REPORT_CONSTANTS.TEXT.CONFIRM_CANCEL}
                    </Text>
                  </TouchableOpacity>

                  {/* 确认按钮 */}
                  <LoadingButton
                    onPress={handleConfirm}
                    isLoading={isLoading}
                    text={REPORT_CONSTANTS.TEXT.CONFIRM_SUBMIT}
                    style={[styles.button, styles.confirmButton]}
                    textStyle={[styles.buttonText, styles.confirmButtonText]}
                  />
                </View>
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
    width: MODAL_CONFIG.width,
    backgroundColor: REPORT_CONSTANTS.UI.COLORS.BACKGROUND,
    borderRadius: MODAL_CONFIG.borderRadius,
    paddingVertical: REPORT_CONSTANTS.UI.SPACING.LG,
    paddingHorizontal: REPORT_CONSTANTS.UI.SPACING.LG,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.25,
    shadowRadius: 16,
    elevation: 16,
  },
  title: {
    fontSize: REPORT_CONSTANTS.UI.FONTS.LARGE,
    fontWeight: '600',
    color: REPORT_CONSTANTS.UI.COLORS.TEXT_PRIMARY,
    textAlign: 'center',
    marginBottom: REPORT_CONSTANTS.UI.SPACING.MD,
  },
  message: {
    fontSize: REPORT_CONSTANTS.UI.FONTS.MEDIUM,
    color: REPORT_CONSTANTS.UI.COLORS.TEXT_SECONDARY,
    textAlign: 'center',
    lineHeight: REPORT_CONSTANTS.UI.FONTS.MEDIUM * 1.4,
    marginBottom: REPORT_CONSTANTS.UI.SPACING.LG,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: REPORT_CONSTANTS.UI.SPACING.MD,
  },
  button: {
    flex: 1,
    height: MODAL_CONFIG.buttonHeight,
    borderRadius: REPORT_CONSTANTS.UI.SIZES.BUTTON_BORDER_RADIUS,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cancelButton: {
    borderWidth: 1,
    borderColor: REPORT_CONSTANTS.UI.COLORS.BORDER,
    backgroundColor: REPORT_CONSTANTS.UI.COLORS.BACKGROUND,
  },
  confirmButton: {
    backgroundColor: REPORT_CONSTANTS.UI.COLORS.PRIMARY,
    shadowColor: REPORT_CONSTANTS.UI.COLORS.PRIMARY,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  buttonText: {
    fontSize: REPORT_CONSTANTS.UI.FONTS.MEDIUM,
    fontWeight: '500',
  },
  cancelButtonText: {
    color: REPORT_CONSTANTS.UI.COLORS.TEXT_SECONDARY,
  },
  confirmButtonText: {
    color: '#FFFFFF',
  },
});
// #endregion

// #region 9. Exports
export default SubmitConfirmModal;
export { SubmitConfirmModal };
// #endregion
