/**
 * 举报页面主组件
 * 
 * TOC (quick jump):
 * [1] Imports
 * [2] Types & Schemas  
 * [3] Constants & Config
 * [4] Utils & Helpers
 * [5] State Management
 * [6] Event Handlers
 * [7] Subcomponents
 * [8] Main Component
 * [9] Styles
 * [10] Exports
 */

// #region [1] Imports
import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  Alert,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';

// 内部组件导入
import { ReportTypeSelector } from './components/ReportTypeSelector';
import { ReportDescriptionInput } from './components/ReportDescriptionInput';
import { ImageUploader } from './components/ImageUploader';
import { SubmitConfirmModal } from './components/SubmitConfirmModal';

// 事件处理器导入
import { onReportTypeSelect } from './events/onReportTypeSelect';
import { onDescriptionChange } from './events/onDescriptionChange';
import { onImageUpload } from './events/onImageUpload';
import { onReportSubmit } from './events/onReportSubmit';

// 业务逻辑导入
import { useReportData } from './hooks/useReportData';
import { ReportService } from './services/ReportService';

// 类型和常量导入
import { ReportType, ReportFormData, ReportValidationError } from './types';
import { REPORT_CONSTANTS } from './constants';
// #endregion

// #region [2] Types & Schemas
interface ReportScreenProps {
  route: {
    params: {
      targetId: string;
      targetType: 'user' | 'content';
      targetTitle?: string;
    };
  };
}

interface ReportFormState {
  selectedType: ReportType | null;
  description: string;
  images: string[];
  isSubmitting: boolean;
  validationErrors: ReportValidationError[];
  showConfirmModal: boolean;
}
// #endregion

// #region [3] Constants & Config
const SCREEN_CONFIG = {
  maxDescriptionLength: 200,
  maxImages: 9,
  submitButtonHeight: 44,
  headerHeight: 56,
} as const;

const VALIDATION_RULES = {
  minDescriptionLength: 1,
  maxDescriptionLength: SCREEN_CONFIG.maxDescriptionLength,
  requiredFields: ['selectedType', 'description'] as const,
} as const;
// #endregion

// #region [4] Utils & Helpers
/**
 * 验证表单数据
 */
const validateForm = (formData: Partial<ReportFormData>): ReportValidationError[] => {
  const errors: ReportValidationError[] = [];

  if (!formData.selectedType) {
    errors.push({ field: 'selectedType', message: '请选择举报类型' });
  }

  if (!formData.description || formData.description.trim().length === 0) {
    errors.push({ field: 'description', message: '请填写举报描述' });
  } else if (formData.description.length > VALIDATION_RULES.maxDescriptionLength) {
    errors.push({ field: 'description', message: `描述不能超过${VALIDATION_RULES.maxDescriptionLength}字` });
  }

  return errors;
};

/**
 * 检查提交按钮是否可用
 */
const isSubmitEnabled = (formState: ReportFormState): boolean => {
  return !!(
    formState.selectedType &&
    formState.description.trim().length > 0 &&
    formState.description.length <= VALIDATION_RULES.maxDescriptionLength &&
    !formState.isSubmitting
  );
};
// #endregion

// #region [5] State Management
const useReportForm = (initialData?: Partial<ReportFormData>) => {
  const [formState, setFormState] = useState<ReportFormState>({
    selectedType: initialData?.selectedType || null,
    description: initialData?.description || '',
    images: initialData?.images || [],
    isSubmitting: false,
    validationErrors: [],
    showConfirmModal: false,
  });

  const updateFormState = useCallback((updates: Partial<ReportFormState>) => {
    setFormState(prev => ({ ...prev, ...updates }));
  }, []);

  const validateCurrentForm = useCallback(() => {
    const errors = validateForm({
      selectedType: formState.selectedType,
      description: formState.description,
      images: formState.images,
    });
    updateFormState({ validationErrors: errors });
    return errors.length === 0;
  }, [formState.selectedType, formState.description, formState.images, updateFormState]);

  return {
    formState,
    updateFormState,
    validateCurrentForm,
    isValid: isSubmitEnabled(formState),
  };
};
// #endregion

// #region [6] Event Handlers
/**
 * 举报类型选择事件处理
 */
const handleReportTypeSelect = (
  reportType: ReportType,
  updateFormState: (updates: Partial<ReportFormState>) => void
) => {
  return onReportTypeSelect(reportType, (selectedType) => {
    updateFormState({ selectedType });
  });
};

/**
 * 描述内容变化事件处理
 */
const handleDescriptionChange = (
  text: string,
  updateFormState: (updates: Partial<ReportFormState>) => void
) => {
  return onDescriptionChange(text, (description) => {
    updateFormState({ description });
  });
};

/**
 * 图片上传事件处理
 */
const handleImageUpload = (
  images: string[],
  updateFormState: (updates: Partial<ReportFormState>) => void
) => {
  return onImageUpload(images, (uploadedImages) => {
    updateFormState({ images: uploadedImages });
  });
};

/**
 * 提交确认事件处理
 */
const handleSubmitConfirm = (
  formData: ReportFormData,
  targetInfo: { targetId: string; targetType: string },
  updateFormState: (updates: Partial<ReportFormState>) => void,
  navigation: any
) => {
  return onReportSubmit(
    formData,
    targetInfo,
    {
      onStart: () => updateFormState({ isSubmitting: true }),
      onSuccess: () => {
        updateFormState({ isSubmitting: false, showConfirmModal: false });
        Alert.alert('举报提交成功', '我们会在24小时内处理您的举报', [
          { text: '确定', onPress: () => navigation.goBack() }
        ]);
      },
      onError: (error) => {
        updateFormState({ isSubmitting: false });
        Alert.alert('提交失败', error.message || '请稍后重试');
      },
    }
  );
};
// #endregion

// #region [7] Subcomponents
/**
 * 页面头部组件
 */
const ReportHeader: React.FC<{
  onBack: () => void;
  onSubmit: () => void;
  isSubmitEnabled: boolean;
  isSubmitting: boolean;
}> = ({ onBack, onSubmit, isSubmitEnabled, isSubmitting }) => (
  <View style={styles.header}>
    <TouchableOpacity style={styles.backButton} onPress={onBack}>
      <Text style={styles.backButtonText}>{'<'}</Text>
    </TouchableOpacity>
    
    <Text style={styles.headerTitle}>举报</Text>
    
    <TouchableOpacity
      style={[styles.submitButton, isSubmitEnabled && styles.submitButtonEnabled]}
      onPress={onSubmit}
      disabled={!isSubmitEnabled || isSubmitting}
    >
      {isSubmitting ? (
        <ActivityIndicator size="small" color="#FFFFFF" />
      ) : (
        <Text style={[styles.submitButtonText, isSubmitEnabled && styles.submitButtonTextEnabled]}>
          提交
        </Text>
      )}
    </TouchableOpacity>
  </View>
);
// #endregion

// #region [8] Main Component
/**
 * 举报页面主组件
 */
export const ReportScreen: React.FC<ReportScreenProps> = ({ route }) => {
  const navigation = useNavigation();
  const { targetId, targetType, targetTitle } = route.params;
  
  // 状态管理
  const { formState, updateFormState, validateCurrentForm, isValid } = useReportForm();
  
  // 数据管理
  const { reportTypes, isLoading } = useReportData();

  // 事件处理函数
  const handleTypeSelect = useCallback((type: ReportType) => {
    handleReportTypeSelect(type, updateFormState);
  }, [updateFormState]);

  const handleDescChange = useCallback((text: string) => {
    handleDescriptionChange(text, updateFormState);
  }, [updateFormState]);

  const handleImagesUpload = useCallback((images: string[]) => {
    handleImageUpload(images, updateFormState);
  }, [updateFormState]);

  const handleSubmitPress = useCallback(() => {
    if (validateCurrentForm()) {
      updateFormState({ showConfirmModal: true });
    }
  }, [validateCurrentForm, updateFormState]);

  const handleConfirmSubmit = useCallback(() => {
    const formData: ReportFormData = {
      selectedType: formState.selectedType!,
      description: formState.description,
      images: formState.images,
    };

    handleSubmitConfirm(
      formData,
      { targetId, targetType },
      updateFormState,
      navigation
    );
  }, [formState, targetId, targetType, updateFormState, navigation]);

  const handleBack = useCallback(() => {
    if (formState.description.trim() || formState.selectedType || formState.images.length > 0) {
      Alert.alert(
        '确认退出',
        '您的举报内容尚未提交，确定要退出吗？',
        [
          { text: '取消', style: 'cancel' },
          { text: '确定', onPress: () => navigation.goBack() }
        ]
      );
    } else {
      navigation.goBack();
    }
  }, [formState, navigation]);

  if (isLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={REPORT_CONSTANTS.COLORS.PRIMARY} />
          <Text style={styles.loadingText}>加载中...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* 页面头部 */}
      <ReportHeader
        onBack={handleBack}
        onSubmit={handleSubmitPress}
        isSubmitEnabled={isValid}
        isSubmitting={formState.isSubmitting}
      />

      {/* 主要内容区域 */}
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* 举报类型选择 */}
        <ReportTypeSelector
          reportTypes={reportTypes}
          selectedType={formState.selectedType}
          onTypeSelect={handleTypeSelect}
          validationError={formState.validationErrors.find(e => e.field === 'selectedType')}
        />

        {/* 举报描述输入 */}
        <ReportDescriptionInput
          value={formState.description}
          onChangeText={handleDescChange}
          maxLength={SCREEN_CONFIG.maxDescriptionLength}
          validationError={formState.validationErrors.find(e => e.field === 'description')}
        />

        {/* 图片上传 */}
        <ImageUploader
          images={formState.images}
          onImagesChange={handleImagesUpload}
          maxImages={SCREEN_CONFIG.maxImages}
        />
      </ScrollView>

      {/* 提交确认弹窗 */}
      <SubmitConfirmModal
        visible={formState.showConfirmModal}
        onConfirm={handleConfirmSubmit}
        onCancel={() => updateFormState({ showConfirmModal: false })}
        isSubmitting={formState.isSubmitting}
      />
    </SafeAreaView>
  );
};
// #endregion

// #region [9] Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  
  // 头部样式
  header: {
    height: SCREEN_CONFIG.headerHeight,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E5',
    backgroundColor: '#FFFFFF',
  },
  backButton: {
    width: 44,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backButtonText: {
    fontSize: 24,
    color: '#333333',
    fontWeight: '400',
  },
  headerTitle: {
    fontSize: 18,
    color: '#333333',
    fontWeight: '600',
    textAlign: 'center',
  },
  submitButton: {
    height: 32,
    paddingHorizontal: 16,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
    backgroundColor: '#F5F5F5',
  },
  submitButtonEnabled: {
    backgroundColor: '#8A2BE2',
  },
  submitButtonText: {
    fontSize: 16,
    color: '#999999',
    fontWeight: '500',
  },
  submitButtonTextEnabled: {
    color: '#FFFFFF',
  },

  // 内容区域样式
  scrollView: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },

  // 加载状态样式
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
  loadingText: {
    fontSize: 16,
    color: '#666666',
    marginTop: 12,
  },
});
// #endregion

// #region [10] Exports
export default ReportScreen;
export type { ReportScreenProps };
// #endregion
