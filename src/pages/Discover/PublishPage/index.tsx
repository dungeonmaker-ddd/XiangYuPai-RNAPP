// #region 1. File Banner & TOC
/**
 * 发布动态主页面 - 完整的内容创作和发布系统
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
import React, { useCallback, useEffect, useMemo, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
  Alert,
  Platform,
  StatusBar,
  Keyboard,
  BackHandler,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';

// 子组件导入
import ContentEditorArea from './ContentEditorArea';
import MediaManagerArea from './MediaManagerArea';
import FunctionTagsArea from './FunctionTagsArea';
import PublishControlArea from './PublishControlArea';
import LocationSelectorDrawer from './LocationSelectorDrawer';
import TopicSelectorPage from './TopicSelectorPage';

// 状态管理导入
import { usePublishState } from './hooks/usePublishState';
import { usePublishData } from './hooks/usePublishData';
import { useMediaManager } from './hooks/useMediaManager';
import { useLocationSelector } from './hooks/useLocationSelector';
import { useTopicSelector } from './hooks/useTopicSelector';
import { useContentValidator } from './hooks/useContentValidator';
import { useDraftManager } from './hooks/useDraftManager';

// 服务导入
import { publishPost } from './services/apiPublish';
import { validateContent } from './services/apiSecurity';

// 工具导入
import { formatPublishData, validatePublishData } from './utils/utilsValidation';
import { showSuccessToast, showErrorToast } from './utils/utilsFormat';

// 类型和常量导入
import type { PublishPageProps, PublishContentData, PublishPageState } from './types';
import {
  COLORS,
  UI_DIMENSIONS,
  SPACING,
  FONT_SIZE,
  FONT_WEIGHT,
  ANIMATION_DURATION,
  BUTTON_TEXT,
  HINT_TEXT,
  PUBLISH_STATUS,
} from './constants';
// #endregion

// #region 3. Types & Schema
interface PublishPageLocalProps extends PublishPageProps {
  navigation?: any;
  route?: any;
}

interface PublishValidationState {
  isValid: boolean;
  errors: string[];
  warnings: string[];
}

interface PublishProgressState {
  step: 'validating' | 'uploading' | 'submitting' | 'complete';
  progress: number;
  message: string;
}
// #endregion

// #region 4. Constants & Config
const KEYBOARD_BEHAVIOR = Platform.OS === 'ios' ? 'padding' : 'height';
const STATUS_BAR_STYLE = 'dark-content';
const HEADER_HEIGHT = UI_DIMENSIONS.NAVBAR_HEIGHT + UI_DIMENSIONS.STATUS_BAR_HEIGHT;
const SCROLL_INDICATOR_INSETS = { right: 1 };
const CONTENT_CONTAINER_STYLE = { paddingBottom: UI_DIMENSIONS.SAFE_AREA_BOTTOM };

// 发布按钮状态配置
const PUBLISH_BUTTON_CONFIG = {
  [PUBLISH_STATUS.IDLE]: {
    text: BUTTON_TEXT.PUBLISH,
    color: COLORS.PRIMARY,
    disabled: true,
  },
  [PUBLISH_STATUS.VALIDATING]: {
    text: '验证中...',
    color: COLORS.GRAY_500,
    disabled: true,
  },
  [PUBLISH_STATUS.UPLOADING]: {
    text: '上传中...',
    color: COLORS.SECONDARY,
    disabled: true,
  },
  [PUBLISH_STATUS.SUBMITTING]: {
    text: BUTTON_TEXT.PUBLISHING,
    color: COLORS.SECONDARY,
    disabled: true,
  },
  [PUBLISH_STATUS.SUCCESS]: {
    text: BUTTON_TEXT.PUBLISH_SUCCESS,
    color: COLORS.SUCCESS,
    disabled: true,
  },
  [PUBLISH_STATUS.ERROR]: {
    text: BUTTON_TEXT.PUBLISH,
    color: COLORS.ERROR,
    disabled: false,
  },
};
// #endregion

// #region 5. Utils & Helpers
const formatError = (error: any): string => {
  if (typeof error === 'string') return error;
  if (error?.message) return error.message;
  return HINT_TEXT.PUBLISH_ERROR;
};

const calculateContentProgress = (contentData: PublishContentData): number => {
  let progress = 0;
  if (contentData.title.length > 0) progress += 25;
  if (contentData.content.length > 0) progress += 25;
  if (contentData.mediaIds.length > 0) progress += 25;
  if (contentData.topicIds.length > 0 || contentData.location) progress += 25;
  return progress;
};

const shouldShowValidationWarning = (validation: PublishValidationState): boolean => {
  return validation.warnings.length > 0 && validation.isValid;
};

const getProgressMessage = (step: string, progress: number): string => {
  switch (step) {
    case 'validating':
      return '正在验证内容...';
    case 'uploading':
      return `正在上传媒体文件... ${Math.round(progress)}%`;
    case 'submitting':
      return '正在发布动态...';
    case 'complete':
      return '发布成功！';
    default:
      return '';
  }
};
// #endregion

// #region 6. State Management
const PublishPage: React.FC<PublishPageLocalProps> = ({
  onPublishSuccess,
  onPublishCancel,
  initialDraft,
  mode = 'create',
  postId,
  navigation,
  route,
}) => {
  // 核心状态管理
  const {
    state: publishState,
    updateState,
    resetState,
    setLoading,
    setError,
  } = usePublishState();

  const {
    contentData,
    updateContentData,
    resetContentData,
  } = usePublishData(initialDraft);

  const {
    mediaItems,
    addMedia,
    removeMedia,
    updateMediaProgress,
    clearMedia,
  } = useMediaManager();

  const {
    isLocationSelectorVisible,
    selectedLocation,
    showLocationSelector,
    hideLocationSelector,
    selectLocation,
    clearLocation,
  } = useLocationSelector();

  const {
    isTopicSelectorVisible,
    selectedTopics,
    showTopicSelector,
    hideTopicSelector,
    selectTopics,
    clearTopics,
  } = useTopicSelector();

  const {
    validation,
    validateContent: validateCurrentContent,
    clearValidation,
  } = useContentValidator();

  const {
    saveDraft,
    loadDraft,
    clearDraft,
    hasDraft,
  } = useDraftManager();

  // 本地状态
  const [publishProgress, setPublishProgress] = React.useState<PublishProgressState>({
    step: 'validating',
    progress: 0,
    message: '',
  });

  const scrollViewRef = useRef<ScrollView>(null);
  const isInitializedRef = useRef(false);
// #endregion

// #region 7. Domain Logic
  // 初始化处理
  useEffect(() => {
    if (!isInitializedRef.current) {
      isInitializedRef.current = true;
      
      // 加载草稿
      if (hasDraft && !initialDraft) {
        loadDraft();
      }
      
      // 编辑模式加载数据
      if (mode === 'edit' && postId) {
        // TODO: 加载编辑数据
      }
    }
  }, [hasDraft, initialDraft, mode, postId, loadDraft]);

  // 返回键处理
  useFocusEffect(
    useCallback(() => {
      const onBackPress = () => {
        handleCancel();
        return true;
      };

      const subscription = BackHandler.addEventListener('hardwareBackPress', onBackPress);
      return () => subscription.remove();
    }, [])
  );

  // 自动保存草稿
  useEffect(() => {
    const timer = setTimeout(() => {
      if (contentData.title || contentData.content || mediaItems.length > 0) {
        saveDraft({
          ...contentData,
          mediaIds: mediaItems.map(item => item.id),
          topicIds: selectedTopics.map(topic => topic.id),
          location: selectedLocation,
        });
      }
    }, 2000);

    return () => clearTimeout(timer);
  }, [contentData, mediaItems, selectedTopics, selectedLocation, saveDraft]);

  // 内容验证
  const handleContentValidation = useCallback(async () => {
    try {
      const currentContent = {
        ...contentData,
        mediaIds: mediaItems.map(item => item.id),
        topicIds: selectedTopics.map(topic => topic.id),
        location: selectedLocation,
      };

      const validationResult = await validateCurrentContent(currentContent);
      
      if (!validationResult.isValid) {
        showErrorToast(validationResult.errors.join(', '));
        return false;
      }

      return true;
    } catch (error) {
      showErrorToast(formatError(error));
      return false;
    }
  }, [contentData, mediaItems, selectedTopics, selectedLocation, validateCurrentContent]);

  // 媒体上传处理
  const handleMediaUpload = useCallback(async (): Promise<string[]> => {
    const uploadedIds: string[] = [];
    
    for (let i = 0; i < mediaItems.length; i++) {
      const item = mediaItems[i];
      
      if (item.uploadStatus === 'uploaded') {
        uploadedIds.push(item.id);
        continue;
      }

      try {
        setPublishProgress(prev => ({
          ...prev,
          step: 'uploading',
          progress: (i / mediaItems.length) * 100,
          message: `正在上传第 ${i + 1} 个文件...`,
        }));

        // TODO: 实际上传逻辑
        await new Promise(resolve => setTimeout(resolve, 1000)); // 模拟上传
        
        updateMediaProgress(item.id, 100, 'uploaded');
        uploadedIds.push(item.id);
      } catch (error) {
        updateMediaProgress(item.id, 0, 'failed', formatError(error));
        throw new Error(`媒体文件上传失败: ${formatError(error)}`);
      }
    }

    return uploadedIds;
  }, [mediaItems, updateMediaProgress]);

  // 发布处理
  const handlePublish = useCallback(async () => {
    try {
      setLoading(true);
      setPublishProgress({ step: 'validating', progress: 0, message: '正在验证内容...' });

      // 1. 内容验证
      const isContentValid = await handleContentValidation();
      if (!isContentValid) {
        setLoading(false);
        return;
      }

      // 2. 媒体上传
      const uploadedMediaIds = await handleMediaUpload();

      // 3. 提交发布
      setPublishProgress({ step: 'submitting', progress: 90, message: '正在发布动态...' });
      
      const publishData = formatPublishData({
        ...contentData,
        mediaIds: uploadedMediaIds,
        topicIds: selectedTopics.map(topic => topic.id),
        location: selectedLocation,
      });

      const result = await publishPost(publishData);

      // 4. 发布成功
      setPublishProgress({ step: 'complete', progress: 100, message: '发布成功！' });
      
      // 清理状态
      clearDraft();
      resetContentData();
      clearMedia();
      clearTopics();
      clearLocation();
      
      showSuccessToast(HINT_TEXT.PUBLISH_SUCCESS);
      
      // 回调处理
      onPublishSuccess?.(result.postId);
      
      // 导航处理
      if (navigation) {
        navigation.goBack();
      }

    } catch (error) {
      setError(formatError(error));
      showErrorToast(formatError(error));
    } finally {
      setLoading(false);
    }
  }, [
    contentData,
    mediaItems,
    selectedTopics,
    selectedLocation,
    handleContentValidation,
    handleMediaUpload,
    setLoading,
    setError,
    clearDraft,
    resetContentData,
    clearMedia,
    clearTopics,
    clearLocation,
    onPublishSuccess,
    navigation,
  ]);

  // 取消处理
  const handleCancel = useCallback(() => {
    const hasContent = contentData.title || contentData.content || mediaItems.length > 0;
    
    if (hasContent) {
      Alert.alert(
        '确认离开',
        '当前编辑的内容将会保存为草稿，确认离开吗？',
        [
          { text: '继续编辑', style: 'cancel' },
          {
            text: '保存草稿并离开',
            onPress: () => {
              saveDraft({
                ...contentData,
                mediaIds: mediaItems.map(item => item.id),
                topicIds: selectedTopics.map(topic => topic.id),
                location: selectedLocation,
              });
              onPublishCancel?.();
              navigation?.goBack();
            },
          },
        ]
      );
    } else {
      onPublishCancel?.();
      navigation?.goBack();
    }
  }, [contentData, mediaItems, selectedTopics, selectedLocation, saveDraft, onPublishCancel, navigation]);

  // 话题选择处理
  const handleTopicSelect = useCallback(() => {
    Keyboard.dismiss();
    showTopicSelector();
  }, [showTopicSelector]);

  // 地点选择处理
  const handleLocationSelect = useCallback(() => {
    Keyboard.dismiss();
    showLocationSelector();
  }, [showLocationSelector]);

  // 媒体添加处理
  const handleMediaAdd = useCallback(() => {
    Keyboard.dismiss();
    // TODO: 打开媒体选择器
  }, []);
// #endregion

// #region 8. UI Components & Rendering
  // 导航栏渲染
  const renderHeader = () => (
    <View style={styles.header}>
      <StatusBar barStyle={STATUS_BAR_STYLE} backgroundColor={COLORS.WHITE} />
      <View style={styles.statusBar} />
      <View style={styles.navbar}>
        <TouchableOpacity
          style={styles.navButton}
          onPress={handleCancel}
          activeOpacity={0.7}
        >
          <Text style={styles.navButtonText}>{BUTTON_TEXT.CANCEL}</Text>
        </TouchableOpacity>
        
        <Text style={styles.navTitle}>动态</Text>
        
        <TouchableOpacity
          style={[
            styles.navButton,
            styles.publishNavButton,
            { opacity: validation.isValid ? 1 : 0.5 }
          ]}
          onPress={handlePublish}
          disabled={!validation.isValid || publishState.isPublishing}
          activeOpacity={0.7}
        >
          <Text style={[
            styles.navButtonText,
            styles.publishNavButtonText,
            { color: validation.isValid ? COLORS.PRIMARY : COLORS.GRAY_500 }
          ]}>
            {publishState.isPublishing ? BUTTON_TEXT.PUBLISHING : BUTTON_TEXT.PUBLISH}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  // 主内容渲染
  const renderContent = () => (
    <ScrollView
      ref={scrollViewRef}
      style={styles.scrollView}
      contentContainerStyle={CONTENT_CONTAINER_STYLE}
      showsVerticalScrollIndicator
      scrollIndicatorInsets={SCROLL_INDICATOR_INSETS}
      keyboardShouldPersistTaps="handled"
    >
      {/* 内容编辑区域 */}
      <ContentEditorArea
        title={contentData.title}
        content={contentData.content}
        onTitleChange={(title) => updateContentData({ title })}
        onContentChange={(content) => updateContentData({ content })}
        errors={publishState.errors}
      />

      {/* 媒体管理区域 */}
      <MediaManagerArea
        mediaItems={mediaItems}
        onAddMedia={handleMediaAdd}
        onRemoveMedia={removeMedia}
        onEditMedia={(id) => {
          // TODO: 打开媒体编辑器
        }}
      />

      {/* 功能标签区域 */}
      <FunctionTagsArea
        selectedTopics={selectedTopics}
        selectedLocation={selectedLocation}
        onTopicSelect={handleTopicSelect}
        onLocationSelect={handleLocationSelect}
        onTopicRemove={(topicId) => {
          const updatedTopics = selectedTopics.filter(topic => topic.id !== topicId);
          selectTopics(updatedTopics);
        }}
        onLocationRemove={clearLocation}
      />
    </ScrollView>
  );

  // 发布控制区域渲染
  const renderPublishControl = () => (
    <PublishControlArea
      isValid={validation.isValid}
      isPublishing={publishState.isPublishing}
      publishProgress={publishProgress.progress}
      onPublish={handlePublish}
      onCancel={handleCancel}
      onDraft={() => {
        saveDraft({
          ...contentData,
          mediaIds: mediaItems.map(item => item.id),
          topicIds: selectedTopics.map(topic => topic.id),
          location: selectedLocation,
        });
        showSuccessToast(HINT_TEXT.DRAFT_SAVED);
      }}
    />
  );

  return (
    <SafeAreaView style={styles.container}>
      {renderHeader()}
      {renderContent()}
      {renderPublishControl()}
      
      {/* 地点选择抽屉 */}
      <LocationSelectorDrawer
        isVisible={isLocationSelectorVisible}
        selectedLocation={selectedLocation}
        onLocationSelect={selectLocation}
        onClose={hideLocationSelector}
      />
      
      {/* 话题选择页面 */}
      <TopicSelectorPage
        isVisible={isTopicSelectorVisible}
        selectedTopics={selectedTopics}
        onTopicsSelect={selectTopics}
        onClose={hideTopicSelector}
      />
    </SafeAreaView>
  );
};

// 样式定义
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.WHITE,
  },
  header: {
    backgroundColor: COLORS.WHITE,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.SEPARATOR,
  },
  statusBar: {
    height: UI_DIMENSIONS.STATUS_BAR_HEIGHT,
    backgroundColor: COLORS.WHITE,
  },
  navbar: {
    height: UI_DIMENSIONS.NAVBAR_HEIGHT,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.LG,
  },
  navButton: {
    width: 80,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
  },
  navButtonText: {
    fontSize: FONT_SIZE.MD,
    color: COLORS.GRAY_900,
  },
  publishNavButton: {
    alignItems: 'flex-end',
  },
  publishNavButtonText: {
    fontWeight: FONT_WEIGHT.MEDIUM,
  },
  navTitle: {
    fontSize: FONT_SIZE.LG,
    fontWeight: FONT_WEIGHT.BOLD,
    color: COLORS.GRAY_900,
    textAlign: 'center',
  },
  scrollView: {
    flex: 1,
    backgroundColor: COLORS.WHITE,
  },
});
// #endregion

// #region 9. Exports
export default PublishPage;
export type { PublishPageProps, PublishPageLocalProps };
// #endregion
