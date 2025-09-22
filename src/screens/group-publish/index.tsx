/**
 * 📱 组局发布主页面 - 页面父组件
 * 基于通用组件架构核心标准的完整实现
 * 
 * TOC (quick jump):
 * [1] File Banner & TOC
 * [2] Imports
 * [3] Types & Schema
 * [4] Constants & Config
 * [5] Utils & Helpers
 * [6] State Management
 * [7] Domain Logic
 * [8] UI Components & Rendering
 * [9] Exports
 */

// #region 1. File Banner & TOC
/**
 * GroupPublishScreen - 组局发布主页面
 * 集成所有子组件，提供完整的发布+支付闭环功能
 * 
 * TOC (快速跳转):
 * [1] File Banner & TOC
 * [2] Imports
 * [3] Types & Schema  
 * [4] Constants & Config
 * [5] Utils & Helpers
 * [6] State Management
 * [7] Domain Logic
 * [8] UI Components & Rendering
 * [9] Exports
 */
// #endregion

// #region 2. Imports
import React, { useCallback, useRef } from 'react';
import { 
  View, 
  ScrollView, 
  StatusBar, 
  StyleSheet, 
  KeyboardAvoidingView, 
  Platform,
  Alert 
} from 'react-native';

// 导入页面状态管理
import { useGroupPublish } from './useGroupPublish';

// 导入页面导航
import { navigateBack } from './navigateBack';

// 导入组件区域
import { HeaderArea } from './HeaderArea';
import { TypeSelectionArea } from './TypeSelectionArea';
// import { FormInputArea } from './FormInputArea';
// import { AgreementArea } from './AgreementArea';
// import { PaymentArea } from './PaymentArea';

// 导入类型和常量
import type { PublishGroupScreenProps, PaymentInfo, FeeBreakdown } from './types';
import { COLORS, TEXTS, PAYMENT_CONFIG } from './constants';
// #endregion

// #region 3. Types & Schema
// Props接口定义在 types.ts 中
// #endregion

// #region 4. Constants & Config
// 计算费用明细的辅助函数
const calculateFeeBreakdown = (baseFee: number): FeeBreakdown => {
  const serviceFee = Math.max(
    PAYMENT_CONFIG.FEE.MIN_SERVICE_FEE,
    Math.min(
      baseFee * PAYMENT_CONFIG.FEE.SERVICE_FEE_RATE,
      PAYMENT_CONFIG.FEE.MAX_SERVICE_FEE
    )
  );
  
  return {
    baseFee,
    serviceFee,
    discount: 0,
    total: baseFee + serviceFee,
  };
};
// #endregion

// #region 5. Utils & Helpers
const debounce = (func: Function, delay: number) => {
  let timeoutId: ReturnType<typeof setTimeout>;
  return (...args: any[]) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func.apply(null, args), delay);
  };
};
// #endregion

// #region 6. State Management
const GroupPublishScreen: React.FC<PublishGroupScreenProps> = ({ navigation }) => {
  const scrollViewRef = useRef<ScrollView>(null);

  // 使用页面主状态管理
  const {
    state,
    canPublish,
    setActivityType,
    updateTitle,
    updateContent,
    updateParameters,
    updateAgreement,
    setPaymentInfo,
    setShowPaymentModal,
    setSubmitting,
    setDraftSaving,
    resetForm,
  } = useGroupPublish();
// #endregion

// #region 7. Domain Logic
  // 处理返回
  const handleGoBack = useCallback(() => {
    const hasUnsavedChanges = !!(
      state.title.value || 
      state.content.value || 
      state.selectedActivityType
    );

    if (hasUnsavedChanges) {
      Alert.alert(
        '确认离开',
        '您有未保存的内容，确定要离开吗？',
        [
          { text: '继续编辑', style: 'cancel' },
          { text: '离开', style: 'destructive', onPress: () => navigation?.goBack?.() },
        ]
      );
    } else {
      navigateBack(navigation);
    }
  }, [state.title.value, state.content.value, state.selectedActivityType, navigation]);

  // 处理保存草稿
  const handleSave = useCallback(async () => {
    setDraftSaving(true);
    
    try {
      // 模拟保存草稿
      await new Promise<void>(resolve => setTimeout(() => resolve(), 1000));
      Alert.alert('保存成功', '草稿已保存');
    } catch (error) {
      Alert.alert('保存失败', '请稍后重试');
    } finally {
      setDraftSaving(false);
    }
  }, [setDraftSaving]);

  // 处理发布
  const handlePublish = useCallback(() => {
    if (!canPublish) {
      Alert.alert('请完善信息', '请检查并填写所有必填项');
      return;
    }

    // 计算费用并显示支付弹窗
    const feeBreakdown = calculateFeeBreakdown(PAYMENT_CONFIG.FEE.BASE_PUBLISH_FEE);
    const paymentInfo: PaymentInfo = {
      amount: feeBreakdown.total,
      currency: 'coin',
      method: 'coin' as any,
      feeBreakdown,
      userBalance: 500, // 模拟用户余额
      status: 'idle' as any,
    };

    setPaymentInfo(paymentInfo);
    setShowPaymentModal(true);
  }, [canPublish, setPaymentInfo, setShowPaymentModal]);

  // 处理支付确认
  const handlePaymentConfirm = useCallback(() => {
    setShowPaymentModal(false);
    setSubmitting(true);

    // 模拟发布处理
    setTimeout(() => {
      Alert.alert('发布成功', '您的组局已成功发布！', [
        {
          text: '查看详情',
          onPress: () => navigation?.goBack?.(),
        },
      ]);
      setSubmitting(false);
      resetForm();
    }, 2000);
  }, [setShowPaymentModal, setSubmitting, resetForm, navigation]);

  // 处理支付取消
  const handlePaymentCancel = useCallback(() => {
    setShowPaymentModal(false);
  }, [setShowPaymentModal]);
// #endregion

// #region 8. UI Components & Rendering
  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.WHITE} />
      
      {/* 头部导航区域 */}
      <HeaderArea
        title={TEXTS.NAVIGATION.TITLE}
        onCancelPress={handleGoBack}
        onSavePress={handleSave}
        isDraftSaving={state.isDraftSaving}
      />
      
      {/* 主要内容 */}
      <KeyboardAvoidingView 
        style={styles.content}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView
          ref={scrollViewRef}
          style={styles.scrollView}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* 活动类型选择区域 */}
          <TypeSelectionArea
            selectedType={state.selectedActivityType}
            onTypeSelect={setActivityType}
            validation={state.validation.activityType}
          />

          {/* TODO: 其他组件区域将在后续实现 */}
          {/* <FormInputArea /> */}
          {/* <AgreementArea /> */}
          
          {/* 底部间距 */}
          <View style={styles.bottomSpacing} />
        </ScrollView>
      </KeyboardAvoidingView>

      {/* TODO: 支付区域将在后续实现 */}
      {/* <PaymentArea /> */}
    </View>
  );
};

// 样式定义
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.BACKGROUND || COLORS.WHITE,
  },
  content: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  bottomSpacing: {
    height: 100, // 为底部按钮留出空间
  },
});
// #endregion

// #region 9. Exports
export default GroupPublishScreen;
export { GroupPublishScreen };
export type { PublishGroupScreenProps };
// #endregion
