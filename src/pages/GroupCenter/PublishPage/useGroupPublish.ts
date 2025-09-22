/**
 * 🔄 组局发布页面主状态管理
 * 统一管理页面级状态，子组件只管理简单本地状态
 * 
 * TOC (quick jump):
 * [1] Imports & Types
 * [2] Constants & Config  
 * [3] Utils & Helpers
 * [4] State Management
 * [5] Domain Logic
 * [6] Exports
 */

// #region 1. Imports & Types
import { useState, useCallback, useEffect } from 'react';
import type { 
  PublishState, 
  ActivityType,
  TitleInputState,
  ContentInputState,
  ParameterConfig,
  AgreementSettings,
  FormValidation,
  PaymentInfo,
  PublishStep
} from './types';
import { FORM_CONFIG, PAYMENT_CONFIG, VALIDATION } from './constants';
// #endregion

// #region 2. Constants & Config
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

const INITIAL_AGREEMENT_SETTINGS: AgreementSettings = {
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

const INITIAL_STATE: PublishState = {
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
};
// #endregion

// #region 3. Utils & Helpers
const validateTitle = (value: string) => {
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

const validateContent = (value: string) => {
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

const validateActivityType = (type?: ActivityType) => {
  if (!type) {
    return { isValid: false, error: VALIDATION.ACTIVITY_TYPE.REQUIRED };
  }
  return { isValid: true };
};
// #endregion

// #region 4. State Management
export const useGroupPublish = () => {
  const [state, setState] = useState<PublishState>(INITIAL_STATE);

  // 计算整体验证状态
  const updateOverallValidation = useCallback(() => {
    const agreementOverall = state.agreement.time.isValid && 
                           state.agreement.location.isValid && 
                           state.agreement.pricing.isValid && 
                           state.agreement.participants.isValid && 
                           state.agreement.deadline.isValid;

    const overallValid = state.validation.activityType.isValid &&
                        state.validation.title.isValid &&
                        state.validation.content.isValid &&
                        agreementOverall;

    setState(prev => ({
      ...prev,
      validation: {
        ...prev.validation,
        agreement: {
          ...prev.validation.agreement,
          overall: { isValid: agreementOverall },
        },
        overall: { isValid: overallValid },
      },
    }));
  }, [state.agreement, state.validation]);

  const canPublish = state.validation.overall.isValid && !state.isSubmitting;
// #endregion

// #region 5. Domain Logic
  // 设置活动类型
  const setActivityType = useCallback((type: ActivityType) => {
    const validation = validateActivityType(type);
    setState(prev => ({
      ...prev,
      selectedActivityType: type,
      validation: {
        ...prev.validation,
        activityType: validation,
      },
    }));
  }, []);

  // 更新标题
  const updateTitle = useCallback((value: string) => {
    const validation = validateTitle(value);
    setState(prev => ({
      ...prev,
      title: {
        ...prev.title,
        value,
        characterCount: value.length,
        validation,
      },
      validation: {
        ...prev.validation,
        title: validation,
      },
    }));
  }, []);

  // 更新正文
  const updateContent = useCallback((value: string) => {
    const validation = validateContent(value);
    setState(prev => ({
      ...prev,
      content: {
        ...prev.content,
        value,
        characterCount: value.length,
        validation,
      },
      validation: {
        ...prev.validation,
        content: validation,
      },
    }));
  }, []);

  // 更新参数配置
  const updateParameters = useCallback((params: ParameterConfig) => {
    setState(prev => ({
      ...prev,
      parameters: params,
    }));
  }, []);

  // 更新约定项设置
  const updateAgreement = useCallback((settings: Partial<AgreementSettings>) => {
    setState(prev => ({
      ...prev,
      agreement: {
        ...prev.agreement,
        ...settings,
      },
    }));
  }, []);

  // 设置支付信息
  const setPaymentInfo = useCallback((paymentInfo: PaymentInfo | undefined) => {
    setState(prev => ({
      ...prev,
      paymentInfo,
    }));
  }, []);

  // 设置支付弹窗显示状态
  const setShowPaymentModal = useCallback((show: boolean) => {
    setState(prev => ({
      ...prev,
      showPaymentModal: show,
    }));
  }, []);

  // 设置提交状态
  const setSubmitting = useCallback((submitting: boolean) => {
    setState(prev => ({
      ...prev,
      isSubmitting: submitting,
    }));
  }, []);

  // 设置草稿保存状态
  const setDraftSaving = useCallback((saving: boolean) => {
    setState(prev => ({
      ...prev,
      isDraftSaving: saving,
    }));
  }, []);

  // 重置表单
  const resetForm = useCallback(() => {
    setState(INITIAL_STATE);
  }, []);

  // 自动更新验证状态
  useEffect(() => {
    updateOverallValidation();
  }, [updateOverallValidation]);
// #endregion

// #region 6. Exports
  return {
    // 状态
    state,
    canPublish,
    
    // 操作方法
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
  };
};
// #endregion
