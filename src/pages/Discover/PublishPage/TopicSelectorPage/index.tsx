// #region 1. File Banner & TOC
/**
 * 话题选择页面组件 - 全屏话题选择界面
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
import React, { useCallback, useState } from 'react';
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  SafeAreaView,
} from 'react-native';

// 类型导入
import type { PublishTopicData } from '../types';
// #endregion

// #region 3. Types & Schema
interface TopicSelectorPageProps {
  isVisible: boolean;
  selectedTopics: PublishTopicData[];
  onTopicsSelect: (topics: PublishTopicData[]) => void;
  onClose: () => void;
}
// #endregion

// #region 4. Constants & Config
const mockTopics: PublishTopicData[] = [
  {
    id: '1',
    name: 'React Native',
    description: '移动应用开发',
    hotScore: 95,
    participantCount: 10000,
    category: 'tech',
    isHot: true,
  },
  {
    id: '2',
    name: '前端开发',
    description: 'Web前端技术',
    hotScore: 90,
    participantCount: 8000,
    category: 'tech',
    isHot: true,
  },
  {
    id: '3',
    name: '设计分享',
    description: 'UI/UX设计',
    hotScore: 85,
    participantCount: 6000,
    category: 'design',
    isHot: false,
  },
];
// #endregion

// #region 5. Utils & Helpers
const isTopicSelected = (topic: PublishTopicData, selectedTopics: PublishTopicData[]): boolean => {
  return selectedTopics.some(selected => selected.id === topic.id);
};
// #endregion

// #region 6. State Management
const TopicSelectorPage: React.FC<TopicSelectorPageProps> = ({
  isVisible,
  selectedTopics,
  onTopicsSelect,
  onClose,
}) => {
  const [currentSelection, setCurrentSelection] = useState<PublishTopicData[]>(selectedTopics);
// #endregion

// #region 7. Domain Logic
  const handleTopicToggle = useCallback((topic: PublishTopicData) => {
    setCurrentSelection(prev => {
      const isSelected = isTopicSelected(topic, prev);
      
      if (isSelected) {
        // 移除话题
        return prev.filter(t => t.id !== topic.id);
      } else {
        // 添加话题（限制最多3个）
        if (prev.length >= 3) {
          return prev;
        }
        return [...prev, topic];
      }
    });
  }, []);

  const handleConfirm = useCallback(() => {
    onTopicsSelect(currentSelection);
    onClose();
  }, [currentSelection, onTopicsSelect, onClose]);

  const handleCancel = useCallback(() => {
    setCurrentSelection(selectedTopics);
    onClose();
  }, [selectedTopics, onClose]);
// #endregion

// #region 8. UI Components & Rendering
  return (
    <Modal
      visible={isVisible}
      animationType="slide"
      presentationStyle="fullScreen"
    >
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={handleCancel}>
            <Text style={styles.cancelButton}>取消</Text>
          </TouchableOpacity>
          
          <Text style={styles.title}>选择话题</Text>
          
          <TouchableOpacity onPress={handleConfirm}>
            <Text style={styles.confirmButton}>确定</Text>
          </TouchableOpacity>
        </View>
        
        <View style={styles.selectedInfo}>
          <Text style={styles.selectedText}>
            已选择 {currentSelection.length}/3 个话题
          </Text>
        </View>
        
        <ScrollView style={styles.content}>
          {mockTopics.map((topic) => {
            const isSelected = isTopicSelected(topic, currentSelection);
            
            return (
              <TouchableOpacity
                key={topic.id}
                style={[
                  styles.topicItem,
                  isSelected && styles.topicItemSelected,
                ]}
                onPress={() => handleTopicToggle(topic)}
              >
                <View style={styles.topicInfo}>
                  <Text style={[
                    styles.topicName,
                    isSelected && styles.topicNameSelected,
                  ]}>
                    {topic.name}
                    {topic.isHot && <Text style={styles.hotBadge}> 🔥</Text>}
                  </Text>
                  <Text style={styles.topicDescription}>
                    {topic.description}
                  </Text>
                  <Text style={styles.topicStats}>
                    {topic.participantCount} 人参与
                  </Text>
                </View>
                
                <View style={[
                  styles.checkbox,
                  isSelected && styles.checkboxSelected,
                ]}>
                  {isSelected && <Text style={styles.checkmark}>✓</Text>}
                </View>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </SafeAreaView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E5',
  },
  cancelButton: {
    fontSize: 16,
    color: '#666666',
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333333',
  },
  confirmButton: {
    fontSize: 16,
    color: '#8A2BE2',
    fontWeight: '500',
  },
  selectedInfo: {
    padding: 16,
    backgroundColor: '#F8F8F8',
  },
  selectedText: {
    fontSize: 14,
    color: '#666666',
    textAlign: 'center',
  },
  content: {
    flex: 1,
  },
  topicItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  topicItemSelected: {
    backgroundColor: '#F5F0FF',
  },
  topicInfo: {
    flex: 1,
  },
  topicName: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333333',
    marginBottom: 4,
  },
  topicNameSelected: {
    color: '#8A2BE2',
  },
  topicDescription: {
    fontSize: 14,
    color: '#666666',
    marginBottom: 4,
  },
  topicStats: {
    fontSize: 12,
    color: '#999999',
  },
  hotBadge: {
    fontSize: 14,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#DDDDDD',
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxSelected: {
    backgroundColor: '#8A2BE2',
    borderColor: '#8A2BE2',
  },
  checkmark: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
// #endregion

// #region 9. Exports
export default TopicSelectorPage;
export type { TopicSelectorPageProps };
// #endregion
