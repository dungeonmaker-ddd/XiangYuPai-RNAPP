/**
 * 🎯 组局发布主页面
 * 
 * TOC (quick jump):
 * [1] Imports & Types (50-70行)
 * [2] Constants & Config (30-50行)  
 * [3] Utils & Helpers (60-80行)
 * [4] State Management (120-180行)
 * [5] Form Validation (80-120行)
 * [6] Event Handlers (100-140行)
 * [7] Main Component (120-160行)
 * [8] Styles (60-90行)
 * [9] Exports (10-20行)
 */

import React, { useState, useCallback, useEffect, useRef } from 'react';
import {
  View,
  ScrollView,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  StatusBar,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

// ══════════════════════════════════════════════════════════════
// 1. Imports & Types (50-70行)
// ══════════════════════════════════════════════════════════════

import type {
  PublishGroupScreenProps,
  PublishState,
  ActivityType,
  TitleInputState,
  ContentInputState,
  ParameterConfig,
  AgreementSettings as AgreementSettingsType,
  FormValidation,
  ValidationState,
  TimeSettings,
  LocationSettings,
  PricingSettings,
  ParticipantSettings,
  DeadlineSettings,
  PaymentInfo,
  FeeBreakdown,
} from './types';

import {
  PublishStep,
  PaymentStatus,
} from './types';

import {
  COLORS,
  SPACING,
  BORDER_RADIUS,
  FONT_SIZE,
  FONT_WEIGHT,
  TEXTS,
  FORM_CONFIG,
  AGREEMENT_CONFIG,
  PAYMENT_CONFIG,
  VALIDATION,
  Z_INDEX,
} from './constants';

// 导入组件
import ActivityTypeSelector from './components/ActivityTypeSelector';
import PublishForm from './components/PublishForm';
import AgreementSettings from './components/AgreementSettings';
import PaymentModal from './components/PaymentModal';

// ══════════════════════════════════════════════════════════════
// 2. Constants & Config (30-50行)
// ══════════════════════════════════════════════════════════════

// 初始化状态
const INITIAL_TITLE_STATE: TitleInputState = {
  value: '',
  validation: { isValid: false },
  characterCount: 0,
  maxLength: FORM_CONFIG.TITLE.MAX_LENGTH,
};

const INITIAL_CONTENT_STATE: ContentInputState = {
  value: '',
  validation: { isValid: false },
  characterCount: 0,
  maxLength: FORM_CONFIG.CONTENT.MAX_LENGTH,
};

const INITIAL_AGREEMENT_SETTINGS: AgreementSettingsType = {
  time: {
    startDate: new Date(),
    startTime: '09:00',
    isValid: false,
  },
  location: {
    address: '',
    isCurrentLocation: false,
    isValid: false,
  },
  pricing: {
    amount: 0,
    currency: 'coin',
    billingType: 'hourly',
    paymentMethod: 'prepaid',
    isValid: false,
  },
  participants: {
    maxCount: 6,
    minCount: 2,
    genderRatio: { unlimited: true },
    ageLimit: { unlimited: true },
    isValid: false,
  },
  deadline: {
    deadline: new Date(),
    isValid: false,
  },
};

// ══════════════════════════════════════════════════════════════
// 3. Utils & Helpers (60-80行)
// ══════════════════════════════════════════════════════════════

// 验证工具函数
const validateTitle = (value: string): ValidationState => {
  if (!value.trim()) {
    return { isValid: false, error: VALIDATION.TITLE.REQUIRED };
  }
  if (value.length < FORM_CONFIG.TITLE.MIN_LENGTH) {
    return { isValid: false, error: VALIDATION.TITLE.MIN_LENGTH };
  }
  if (value.length > FORM_CONFIG.TITLE.MAX_LENGTH) {
    return { isValid: false, error: VALIDATION.TITLE.MAX_LENGTH };
  }
  return { isValid: true };
};

const validateContent = (value: string): ValidationState => {
  if (!value.trim()) {
    return { isValid: false, error: VALIDATION.CONTENT.REQUIRED };
  }
  if (value.length < FORM_CONFIG.CONTENT.MIN_LENGTH) {
    return { isValid: false, error: VALIDATION.CONTENT.MIN_LENGTH };
  }
  if (value.length > FORM_CONFIG.CONTENT.MAX_LENGTH) {
    return { isValid: false, error: VALIDATION.CONTENT.MAX_LENGTH };
  }
  return { isValid: true };
};

const validateActivityType = (type?: ActivityType): ValidationState => {
  if (!type) {
    return { isValid: false, error: VALIDATION.ACTIVITY_TYPE.REQUIRED };
  }
  return { isValid: true };
};

// 计算费用明细
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

// ══════════════════════════════════════════════════════════════
// 4. 主组件：组局发布页面
// ══════════════════════════════════════════════════════════════

const PublishGroupScreen: React.FC<PublishGroupScreenProps> = ({
  navigation,
  route,
}) => {
  const safeAreaInsets = useSafeAreaInsets();
  const scrollViewRef = useRef<ScrollView>(null);

  // ══════════════════════════════════════════════════════════════
  // 4.1 State Management (120-180行)
  // ══════════════════════════════════════════════════════════════

  const [publishState, setPublishState] = useState<PublishState>({
    currentStep: PublishStep.TYPE_SELECTION,
    title: INITIAL_TITLE_STATE,
    content: INITIAL_CONTENT_STATE,
    parameters: {},
    agreement: INITIAL_AGREEMENT_SETTINGS,
    validation: {
      activityType: { isValid: false },
      title: { isValid: false },
      content: { isValid: false },
      parameters: { isValid: true },
      agreement: {
        time: { isValid: false },
        location: { isValid: false },
        pricing: { isValid: false },
        participants: { isValid: false },
        deadline: { isValid: false },
        overall: { isValid: false },
      },
      overall: { isValid: false },
    },
    showPaymentModal: false,
    isLoading: false,
    isSubmitting: false,
    isDraftSaving: false,
    hasDraft: false,
  });

  // ══════════════════════════════════════════════════════════════
  // 4.2 Form Validation (80-120行)
  // ══════════════════════════════════════════════════════════════

  // 更新验证状态
  const updateValidation = useCallback(() => {
    const activityTypeValidation = validateActivityType(publishState.selectedActivityType);
    const titleValidation = validateTitle(publishState.title.value);
    const contentValidation = validateContent(publishState.content.value);
    
    const agreementValidation = {
      time: { isValid: publishState.agreement.time.isValid },
      location: { isValid: publishState.agreement.location.isValid },
      pricing: { isValid: publishState.agreement.pricing.isValid },
      participants: { isValid: publishState.agreement.participants.isValid },
      deadline: { isValid: publishState.agreement.deadline.isValid },
      overall: { 
        isValid: publishState.agreement.time.isValid && 
                publishState.agreement.location.isValid && 
                publishState.agreement.pricing.isValid && 
                publishState.agreement.participants.isValid && 
                publishState.agreement.deadline.isValid 
      },
    };

    const overallValidation = {
      isValid: activityTypeValidation.isValid &&
               titleValidation.isValid &&
               contentValidation.isValid &&
               agreementValidation.overall.isValid,
    };

    setPublishState(prev => ({
      ...prev,
      validation: {
        activityType: activityTypeValidation,
        title: titleValidation,
        content: contentValidation,
        parameters: { isValid: true },
        agreement: agreementValidation,
        overall: overallValidation,
      },
    }));
  }, [publishState.selectedActivityType, publishState.title.value, publishState.content.value, publishState.agreement]);

  // 在相关状态变化时更新验证
  useEffect(() => {
    updateValidation();
  }, [updateValidation]);

  // ══════════════════════════════════════════════════════════════
  // 4.3 Event Handlers (100-140行)
  // ══════════════════════════════════════════════════════════════

  // 处理活动类型选择
  const handleActivityTypeSelect = useCallback((type: ActivityType) => {
    setPublishState(prev => ({
      ...prev,
      selectedActivityType: type,
    }));
  }, []);

  // 处理标题输入
  const handleTitleChange = useCallback((value: string) => {
    const validation = validateTitle(value);
    setPublishState(prev => ({
      ...prev,
      title: {
        ...prev.title,
        value,
        characterCount: value.length,
        validation,
      },
    }));
  }, []);

  // 处理正文输入
  const handleContentChange = useCallback((value: string) => {
    const validation = validateContent(value);
    setPublishState(prev => ({
      ...prev,
      content: {
        ...prev.content,
        value,
        characterCount: value.length,
        validation,
      },
    }));
  }, []);

  // 处理系数项参数变化
  const handleParametersChange = useCallback((params: ParameterConfig) => {
    setPublishState(prev => ({
      ...prev,
      parameters: params,
    }));
  }, []);

  // 处理约定项设置变化
  const handleAgreementChange = useCallback((settings: Partial<AgreementSettingsType>) => {
    setPublishState(prev => ({
      ...prev,
      agreement: {
        ...prev.agreement,
        ...settings,
      },
    }));
  }, []);

  // 处理发布按钮点击
  const handlePublishPress = useCallback(() => {
    if (!publishState.validation.overall.isValid) {
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
      status: PaymentStatus.IDLE,
    };

    setPublishState(prev => ({
      ...prev,
      paymentInfo,
      showPaymentModal: true,
    }));
  }, [publishState.validation.overall.isValid]);

  // 处理支付确认
  const handlePaymentConfirm = useCallback(() => {
    setPublishState(prev => ({
      ...prev,
      showPaymentModal: false,
      isSubmitting: true,
    }));

    // 模拟发布处理
    setTimeout(() => {
      Alert.alert('发布成功', '您的组局已成功发布！', [
        {
          text: '查看详情',
          onPress: () => {
            // 跳转到组局详情页
            navigation?.goBack?.();
          },
        },
      ]);
      setPublishState(prev => ({
        ...prev,
        isSubmitting: false,
      }));
    }, 2000);
  }, [navigation]);

  // 处理支付取消
  const handlePaymentCancel = useCallback(() => {
    setPublishState(prev => ({
      ...prev,
      showPaymentModal: false,
    }));
  }, []);

  // 处理页面返回
  const handleGoBack = useCallback(() => {
    if (publishState.title.value || publishState.content.value || publishState.selectedActivityType) {
      Alert.alert(
        '确认离开',
        '您有未保存的内容，确定要离开吗？',
        [
          { text: '继续编辑', style: 'cancel' },
          { text: '离开', style: 'destructive', onPress: () => navigation?.goBack?.() },
        ]
      );
    } else {
      navigation?.goBack?.();
    }
  }, [publishState.title.value, publishState.content.value, publishState.selectedActivityType, navigation]);

  // ══════════════════════════════════════════════════════════════
  // 4.4 Main Component Render (120-160行)
  // ══════════════════════════════════════════════════════════════

  return (
    <View style={[styles.container, { paddingTop: safeAreaInsets.top }]}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.WHITE} />
      
      {/* 导航栏 */}
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.headerButton}
          onPress={handleGoBack}
        >
          <Text style={styles.headerButtonText}>
            {TEXTS.NAVIGATION.CANCEL}
          </Text>
        </TouchableOpacity>
        
        <Text style={styles.headerTitle}>
          {TEXTS.NAVIGATION.TITLE}
        </Text>
        
        <TouchableOpacity 
          style={styles.headerButton}
          onPress={() => {/* TODO: 保存草稿 */}}
        >
          <Text style={styles.headerButtonText}>
            {TEXTS.NAVIGATION.SAVE}
          </Text>
        </TouchableOpacity>
      </View>

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
          {/* 活动类型选择 */}
          <ActivityTypeSelector
            selectedType={publishState.selectedActivityType}
            onTypeSelect={handleActivityTypeSelect}
            validation={publishState.validation.activityType}
          />

          {/* 发布表单 */}
          <PublishForm
            title={publishState.title}
            content={publishState.content}
            parameters={publishState.parameters}
            onTitleChange={handleTitleChange}
            onContentChange={handleContentChange}
            onParametersChange={handleParametersChange}
          />

          {/* 约定项设置 */}
          <AgreementSettings
            settings={publishState.agreement}
            onSettingsChange={handleAgreementChange}
            validation={publishState.validation.agreement}
          />

          {/* 发布规则提示 */}
          <View style={styles.rulesSection}>
            <Text style={styles.rulesTitle}>
              {TEXTS.PUBLISH_RULES.TITLE}
            </Text>
            <Text style={styles.rulesText}>
              {TEXTS.PUBLISH_RULES.FEE_NOTICE}
            </Text>
            <Text style={styles.rulesText}>
              {TEXTS.PUBLISH_RULES.RESPONSIBILITY}
            </Text>
            <Text style={styles.rulesText}>
              {TEXTS.PUBLISH_RULES.TIME_POLICY}
            </Text>
            <Text style={styles.rulesText}>
              {TEXTS.PUBLISH_RULES.COMPLETION}
            </Text>
          </View>

          {/* 底部间距 */}
          <View style={styles.bottomSpacing} />
        </ScrollView>
      </KeyboardAvoidingView>

      {/* 发布按钮 */}
      <View style={[styles.publishSection, { paddingBottom: safeAreaInsets.bottom }]}>
        <TouchableOpacity
          style={[
            styles.publishButton,
            !publishState.validation.overall.isValid && styles.publishButtonDisabled,
            publishState.isSubmitting && styles.publishButtonLoading,
          ]}
          onPress={handlePublishPress}
          disabled={!publishState.validation.overall.isValid || publishState.isSubmitting}
        >
          <Text style={styles.publishButtonText}>
            {publishState.isSubmitting 
              ? TEXTS.PUBLISH_BUTTON.LOADING
              : publishState.validation.overall.isValid 
                ? TEXTS.PUBLISH_BUTTON.NORMAL
                : TEXTS.PUBLISH_BUTTON.DISABLED
            }
          </Text>
        </TouchableOpacity>
      </View>

      {/* 支付确认弹窗 */}
      {publishState.paymentInfo && (
        <PaymentModal
          visible={publishState.showPaymentModal}
          paymentInfo={publishState.paymentInfo}
          onPaymentConfirm={handlePaymentConfirm}
          onPaymentCancel={handlePaymentCancel}
          onClose={handlePaymentCancel}
        />
      )}
    </View>
  );
};

// ══════════════════════════════════════════════════════════════
// 5. Styles (60-90行)
// ══════════════════════════════════════════════════════════════

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.BACKGROUND,
  },

  // 导航栏
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.MD,
    paddingVertical: SPACING.MD,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.BORDER,
    backgroundColor: COLORS.WHITE,
    zIndex: Z_INDEX.HEADER,
  },

  headerButton: {
    paddingHorizontal: SPACING.SM,
    paddingVertical: SPACING.XS,
    minWidth: 60,
  },

  headerButtonText: {
    fontSize: FONT_SIZE.MD,
    color: COLORS.PRIMARY,
    fontWeight: FONT_WEIGHT.MEDIUM,
  },

  headerTitle: {
    fontSize: FONT_SIZE.LG,
    fontWeight: FONT_WEIGHT.SEMIBOLD,
    color: COLORS.TEXT_PRIMARY,
  },

  // 主要内容
  content: {
    flex: 1,
  },

  scrollView: {
    flex: 1,
  },

  // 发布规则
  rulesSection: {
    paddingHorizontal: SPACING.MD,
    paddingVertical: SPACING.LG,
    backgroundColor: COLORS.GRAY_50,
    marginHorizontal: SPACING.MD,
    marginTop: SPACING.LG,
    borderRadius: BORDER_RADIUS.MD,
  },

  rulesTitle: {
    fontSize: FONT_SIZE.MD,
    fontWeight: FONT_WEIGHT.SEMIBOLD,
    color: COLORS.TEXT_PRIMARY,
    marginBottom: SPACING.SM,
  },

  rulesText: {
    fontSize: FONT_SIZE.SM,
    color: COLORS.TEXT_SECONDARY,
    lineHeight: 20,
    marginBottom: SPACING.XS,
  },

  // 底部间距
  bottomSpacing: {
    height: 100, // 为底部按钮留出空间
  },

  // 发布按钮区域
  publishSection: {
    paddingHorizontal: SPACING.MD,
    paddingTop: SPACING.MD,
    backgroundColor: COLORS.WHITE,
    borderTopWidth: 1,
    borderTopColor: COLORS.BORDER,
  },

  publishButton: {
    backgroundColor: COLORS.PRIMARY,
    paddingVertical: SPACING.LG,
    borderRadius: BORDER_RADIUS.MD,
    alignItems: 'center',
    justifyContent: 'center',
  },

  publishButtonDisabled: {
    backgroundColor: COLORS.GRAY_300,
  },

  publishButtonLoading: {
    backgroundColor: COLORS.PRIMARY,
    opacity: 0.8,
  },

  publishButtonText: {
    color: COLORS.WHITE,
    fontSize: FONT_SIZE.LG,
    fontWeight: FONT_WEIGHT.SEMIBOLD,
  },
});

// ══════════════════════════════════════════════════════════════
// 6. Exports (10-20行)
// ══════════════════════════════════════════════════════════════

export default PublishGroupScreen;
