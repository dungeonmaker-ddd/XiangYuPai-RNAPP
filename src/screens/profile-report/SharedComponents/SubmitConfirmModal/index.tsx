// #region 1. File Banner & TOC
/**
 * 提交确认弹窗组件 - 提交前的二次确认弹窗
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
  TouchableOpacity,
  StyleSheet,
  Modal,
  ActivityIndicator,
  Dimensions,
} from 'react-native';

// 内部导入
import { REPORT_CONSTANTS } from '../../constants';
import { ModalOverlay } from './ModalOverlay';
import { ModalButton } from './ModalButton';
// #endregion

// #region 3. Types & Schema
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

// #region 4. Constants & Config
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

// #region 5. Utils & Helpers
// 无复杂工具函数需求
// #endregion

// #region 6. State Management
// 无状态管理需求
// #endregion

// #region 7. Domain Logic
// 事件处理逻辑已通过props传入
// #endregion

// #region 8. UI Components & Rendering
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
      accessible={true}
      accessibilityViewIsModal={true}
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
              style={styles.button}
            />
            
            <View style={styles.buttonSpacer} />
            
            <ModalButton
              text={confirmText}
              onPress={onConfirm}
              type="primary"
              disabled={isSubmitting}
              loading={isSubmitting}
              style={styles.button}
            />
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  // 模态容器样式
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: REPORT_CONSTANTS.COLORS.background.overlay,
  },

  // 弹窗内容样式
  modalContent: {
    width: MODAL_CONFIG.containerWidth,
    backgroundColor: REPORT_CONSTANTS.COLORS.background.modal,
    borderRadius: MODAL_CONFIG.borderRadius,
    paddingTop: 24,
    paddingHorizontal: 24,
    paddingBottom: 20,
    shadowColor: REPORT_CONSTANTS.COLORS.text.primary,
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
    color: REPORT_CONSTANTS.COLORS.text.primary,
    fontWeight: '600',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 8,
  },
  message: {
    fontSize: 14,
    color: REPORT_CONSTANTS.COLORS.text.secondary,
    textAlign: 'center',
    lineHeight: 20,
  },

  // 按钮容器样式
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  button: {
    flex: 1,
  },
  buttonSpacer: {
    width: 12,
  },
});
// #endregion

// #region 9. Exports
export default SubmitConfirmModal;
// #endregion
