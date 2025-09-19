/**
 * 提交确认弹窗组件
 * 
 * 功能：
 * - 提交前的二次确认弹窗
 * - 防止误操作
 * - 支持加载状态显示
 */

// #region [1] Imports
import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Modal,
  ActivityIndicator,
  Dimensions,
} from 'react-native';

import { REPORT_CONSTANTS } from '../constants';
// #endregion

// #region [2] Types
interface SubmitConfirmModalProps {
  visible: boolean;
  onConfirm: () => void;
  onCancel: () => void;
  isSubmitting?: boolean;
  title?: string;
  message?: string;
  confirmText?: string;
  cancelText?: string;
}
// #endregion

// #region [3] Constants
const SCREEN_WIDTH = Dimensions.get('window').width;

const MODAL_CONFIG = {
  containerWidth: 280,
  containerHeight: 200,
  borderRadius: 16,
  buttonHeight: 44,
  animationType: 'fade' as const,
} as const;

const DEFAULT_TEXTS = {
  title: '确认提交举报？',
  message: '提交后我们会尽快处理',
  confirmText: '确认',
  cancelText: '取消',
} as const;
// #endregion

// #region [4] Subcomponents
/**
 * 模态背景遮罩
 */
const ModalOverlay: React.FC<{ onPress: () => void }> = ({ onPress }) => (
  <TouchableOpacity
    style={styles.overlay}
    activeOpacity={1}
    onPress={onPress}
  />
);

/**
 * 按钮组件
 */
const ModalButton: React.FC<{
  text: string;
  onPress: () => void;
  type: 'primary' | 'secondary';
  disabled?: boolean;
  loading?: boolean;
}> = ({ text, onPress, type, disabled = false, loading = false }) => {
  const isPrimary = type === 'primary';
  
  return (
    <TouchableOpacity
      style={[
        styles.button,
        isPrimary ? styles.primaryButton : styles.secondaryButton,
        disabled && styles.disabledButton,
      ]}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.8}
    >
      {loading ? (
        <ActivityIndicator
          size="small"
          color={isPrimary ? '#FFFFFF' : REPORT_CONSTANTS.COLORS.PRIMARY}
        />
      ) : (
        <Text
          style={[
            styles.buttonText,
            isPrimary ? styles.primaryButtonText : styles.secondaryButtonText,
            disabled && styles.disabledButtonText,
          ]}
        >
          {text}
        </Text>
      )}
    </TouchableOpacity>
  );
};
// #endregion

// #region [5] Main Component
/**
 * 提交确认弹窗主组件
 */
export const SubmitConfirmModal: React.FC<SubmitConfirmModalProps> = ({
  visible,
  onConfirm,
  onCancel,
  isSubmitting = false,
  title = DEFAULT_TEXTS.title,
  message = DEFAULT_TEXTS.message,
  confirmText = DEFAULT_TEXTS.confirmText,
  cancelText = DEFAULT_TEXTS.cancelText,
}) => {
  return (
    <Modal
      visible={visible}
      transparent
      animationType={MODAL_CONFIG.animationType}
      statusBarTranslucent
      onRequestClose={onCancel}
    >
      {/* 背景遮罩 */}
      <View style={styles.modalContainer}>
        <ModalOverlay onPress={isSubmitting ? () => {} : onCancel} />

        {/* 弹窗内容 */}
        <View style={styles.modalContent}>
          {/* 标题区域 */}
          <View style={styles.titleContainer}>
            <Text style={styles.title}>{title}</Text>
            {message && (
              <Text style={styles.message}>{message}</Text>
            )}
          </View>

          {/* 按钮组 */}
          <View style={styles.buttonContainer}>
            <ModalButton
              text={cancelText}
              onPress={onCancel}
              type="secondary"
              disabled={isSubmitting}
            />
            
            <View style={styles.buttonSpacer} />
            
            <ModalButton
              text={confirmText}
              onPress={onConfirm}
              type="primary"
              disabled={isSubmitting}
              loading={isSubmitting}
            />
          </View>
        </View>
      </View>
    </Modal>
  );
};
// #endregion

// #region [6] Styles
const styles = StyleSheet.create({
  // 模态容器样式
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },

  // 弹窗内容样式
  modalContent: {
    width: MODAL_CONFIG.containerWidth,
    backgroundColor: '#FFFFFF',
    borderRadius: MODAL_CONFIG.borderRadius,
    paddingTop: 24,
    paddingHorizontal: 24,
    paddingBottom: 20,
    shadowColor: '#000000',
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.25,
    shadowRadius: 16,
    elevation: 8,
  },

  // 标题区域样式
  titleContainer: {
    alignItems: 'center',
    marginBottom: 32,
  },
  title: {
    fontSize: 18,
    color: '#333333',
    fontWeight: '600',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 8,
  },
  message: {
    fontSize: 14,
    color: '#666666',
    textAlign: 'center',
    lineHeight: 20,
  },

  // 按钮容器样式
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  buttonSpacer: {
    width: 12,
  },

  // 按钮样式
  button: {
    flex: 1,
    height: MODAL_CONFIG.buttonHeight,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  primaryButton: {
    backgroundColor: REPORT_CONSTANTS.COLORS.PRIMARY,
  },
  secondaryButton: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  disabledButton: {
    opacity: 0.6,
  },

  // 按钮文字样式
  buttonText: {
    fontSize: 16,
    fontWeight: '500',
    textAlign: 'center',
  },
  primaryButtonText: {
    color: '#FFFFFF',
  },
  secondaryButtonText: {
    color: '#666666',
  },
  disabledButtonText: {
    opacity: 0.6,
  },
});
// #endregion

export default SubmitConfirmModal;
