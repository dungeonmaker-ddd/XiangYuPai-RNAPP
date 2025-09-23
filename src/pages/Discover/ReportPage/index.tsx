// #region 1. File Banner & TOC
/**
 * ReportPage - 举报页面主组件
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
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  StatusBar,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';

// 组件区域导入
import { ReportTypeSelectionArea } from './ReportTypeSelectionArea';
import { DescriptionInputArea } from './DescriptionInputArea';
import { ImageUploadArea } from './ImageUploadArea';
import { SubmitConfirmModal } from './SubmitConfirmModal';
import { SuccessModal } from './SuccessModal';

// 类型和常量导入
import { ReportPageProps, ReportFormData, ReportType } from './types';
import { REPORT_CONSTANTS } from './constants';
// #endregion

// #region 3. Types & Schema
interface ReportPageState {
  selectedType: ReportType | null;
  description: string;
  images: string[];
  isSubmitting: boolean;
  showConfirmModal: boolean;
  showSuccessModal: boolean;
}
// #endregion

// #region 4. Constants & Config
const COMPONENT_CONFIG = {
  maxDescriptionLength: 200,
  maxImages: 3,
  animationDuration: 300,
} as const;
// #endregion

// #region 5. Utils & Helpers
const validateForm = (data: ReportFormData): boolean => {
  return !!data.selectedType;
};

const formatReportData = (state: ReportPageState): ReportFormData => ({
  selectedType: state.selectedType!,
  description: state.description.trim(),
  images: state.images,
});
// #endregion

// #region 6. State Management
const useReportPageState = () => {
  const [state, setState] = useState<ReportPageState>({
    selectedType: null,
    description: '',
    images: [],
    isSubmitting: false,
    showConfirmModal: false,
    showSuccessModal: false,
  });

  const updateState = (updates: Partial<ReportPageState>) => {
    setState(prev => ({ ...prev, ...updates }));
  };

  return { state, updateState };
};
// #endregion

// #region 7. Domain Logic
const useReportLogic = (state: ReportPageState, updateState: (updates: Partial<ReportPageState>) => void) => {
  const navigation = useNavigation();

  // 处理举报类型选择
  const handleTypeSelect = (type: ReportType) => {
    updateState({ selectedType: type });
  };

  // 处理描述输入
  const handleDescriptionChange = (text: string) => {
    if (text.length <= COMPONENT_CONFIG.maxDescriptionLength) {
      updateState({ description: text });
    }
  };

  // 处理图片添加
  const handleImageAdd = (imageUri: string) => {
    if (state.images.length < COMPONENT_CONFIG.maxImages) {
      updateState({ images: [...state.images, imageUri] });
    }
  };

  // 处理图片删除
  const handleImageRemove = (index: number) => {
    const newImages = state.images.filter((_, i) => i !== index);
    updateState({ images: newImages });
  };

  // 处理提交按钮点击
  const handleSubmitPress = () => {
    const formData = formatReportData(state);
    if (validateForm(formData)) {
      updateState({ showConfirmModal: true });
    } else {
      Alert.alert('提示', '请选择举报类型');
    }
  };

  // 处理确认提交
  const handleConfirmSubmit = async () => {
    updateState({ 
      showConfirmModal: false, 
      isSubmitting: true 
    });

    try {
      // 模拟API调用
      await new Promise<void>(resolve => setTimeout(() => resolve(), 2000));
      
      updateState({ 
        isSubmitting: false, 
        showSuccessModal: true 
      });
    } catch (error) {
      updateState({ isSubmitting: false });
      Alert.alert('提交失败', '网络异常，请稍后重试');
    }
  };

  // 处理成功确认
  const handleSuccessConfirm = () => {
    updateState({ showSuccessModal: false });
    navigation.goBack();
  };

  // 处理返回
  const handleGoBack = () => {
    navigation.goBack();
  };

  return {
    handleTypeSelect,
    handleDescriptionChange,
    handleImageAdd,
    handleImageRemove,
    handleSubmitPress,
    handleConfirmSubmit,
    handleSuccessConfirm,
    handleGoBack,
  };
};
// #endregion

// #region 8. UI Components & Rendering
const ReportPage: React.FC<ReportPageProps> = ({ route }) => {
  const { state, updateState } = useReportPageState();
  const {
    handleTypeSelect,
    handleDescriptionChange,
    handleImageAdd,
    handleImageRemove,
    handleSubmitPress,
    handleConfirmSubmit,
    handleSuccessConfirm,
    handleGoBack,
  } = useReportLogic(state, updateState);

  // 计算提交按钮状态
  const isSubmitEnabled = !!state.selectedType && !state.isSubmitting;

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      
      {/* 导航栏 */}
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton} 
          onPress={handleGoBack}
        >
          <Text style={styles.backButtonText}>{'<'}</Text>
        </TouchableOpacity>
        
        <Text style={styles.headerTitle}>举报</Text>
        
        <TouchableOpacity 
          style={[
            styles.submitButton,
            { opacity: isSubmitEnabled ? 1 : 0.5 }
          ]}
          onPress={handleSubmitPress}
          disabled={!isSubmitEnabled}
        >
          <Text style={[
            styles.submitButtonText,
            { color: isSubmitEnabled ? '#8A2BE2' : '#999999' }
          ]}>
            提交
          </Text>
        </TouchableOpacity>
      </View>

      {/* 主要内容区域 */}
      <ScrollView 
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        {/* 举报类型选择区域 */}
        <ReportTypeSelectionArea
          selectedType={state.selectedType}
          onTypeSelect={handleTypeSelect}
        />

        {/* 举报描述输入区域 */}
        <DescriptionInputArea
          value={state.description}
          onChange={handleDescriptionChange}
          maxLength={COMPONENT_CONFIG.maxDescriptionLength}
        />

        {/* 图片上传区域 */}
        <ImageUploadArea
          images={state.images}
          maxImages={COMPONENT_CONFIG.maxImages}
          onImageAdd={handleImageAdd}
          onImageRemove={handleImageRemove}
        />
      </ScrollView>

      {/* 提交确认弹窗 */}
      <SubmitConfirmModal
        visible={state.showConfirmModal}
        onCancel={() => updateState({ showConfirmModal: false })}
        onConfirm={handleConfirmSubmit}
        isLoading={state.isSubmitting}
      />

      {/* 成功反馈弹窗 */}
      <SuccessModal
        visible={state.showSuccessModal}
        onConfirm={handleSuccessConfirm}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    height: 56,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  backButton: {
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backButtonText: {
    fontSize: 18,
    color: '#333333',
    fontWeight: '500',
  },
  headerTitle: {
    fontSize: 18,
    color: '#333333',
    fontWeight: '600',
  },
  submitButton: {
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  submitButtonText: {
    fontSize: 16,
    fontWeight: '500',
  },
  scrollView: {
    flex: 1,
  },
});
// #endregion

// #region 9. Exports
export default ReportPage;
export { ReportPage };
// #endregion
