/**
 * 外部模块使用示例
 * 展示如何在其他模块中集成发现页面的数据服务
 */

import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { 
  DiscoverAPI, 
  useDiscoverData, 
  configureDiscoverServices, 
  ServicePresets 
} from '../services';
import { ContentItem, TabType } from '../types';

// =====================================================
// 示例1: 直接使用API服务（不使用React Hook）
// =====================================================

export const DirectAPIExample: React.FC = () => {
  const [hotContent, setHotContent] = useState<ContentItem[]>([]);
  const [loading, setLoading] = useState(false);

  const loadHotContent = async () => {
    setLoading(true);
    try {
      const response = await DiscoverAPI.getContentList('hot', 1);
      setHotContent(response.list);
    } catch (error) {
      console.error('加载失败:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadHotContent();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>直接API调用示例</Text>
      {loading ? (
        <Text>加载中...</Text>
      ) : (
        <FlatList
          data={hotContent.slice(0, 5)} // 只显示前5个
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <Text style={styles.item}>{item.title}</Text>
          )}
        />
      )}
      <TouchableOpacity style={styles.button} onPress={loadHotContent}>
        <Text>刷新</Text>
      </TouchableOpacity>
    </View>
  );
};

// =====================================================
// 示例2: 使用React Hook（推荐方式）
// =====================================================

export const HookBasedExample: React.FC = () => {
  const {
    currentContent,
    currentLoading,
    currentRefreshing,
    switchTab,
    refreshContent,
    state,
  } = useDiscoverData({
    initialTab: 'hot',
    enableCache: true,
  });

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Hook使用示例</Text>
      
      {/* Tab切换 */}
      <View style={styles.tabContainer}>
        {(['hot', 'follow', 'local'] as TabType[]).map(tab => (
          <TouchableOpacity
            key={tab}
            style={[
              styles.tab,
              state.currentTab === tab && styles.activeTab
            ]}
            onPress={() => switchTab(tab)}
          >
            <Text style={[
              styles.tabText,
              state.currentTab === tab && styles.activeTabText
            ]}>
              {tab}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* 内容列表 */}
      {currentLoading ? (
        <Text>加载中...</Text>
      ) : (
        <FlatList
          data={currentContent.slice(0, 5)} // 只显示前5个
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <Text style={styles.item}>{item.title}</Text>
          )}
          refreshing={currentRefreshing}
          onRefresh={refreshContent}
        />
      )}
    </View>
  );
};

// =====================================================
// 示例3: 配置化使用
// =====================================================

export const ConfigurableExample: React.FC = () => {
  const [configured, setConfigured] = useState(false);

  // 配置服务
  useEffect(() => {
    const config = configureDiscoverServices(ServicePresets.development);
    setConfigured(true);
  }, []);

  const {
    currentContent,
    currentLoading,
    getCacheStats,
  } = useDiscoverData({
    initialTab: 'hot',
    enableAutoRefresh: true, // 启用自动刷新
    autoRefreshInterval: 10000, // 10秒刷新一次
  });

  const showCacheStats = () => {
    const stats = getCacheStats();
    console.log('缓存统计:', stats);
  };

  if (!configured) {
    return <Text>配置中...</Text>;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>配置化使用示例</Text>
      <Text style={styles.subtitle}>自动刷新: 每10秒</Text>
      
      {currentLoading ? (
        <Text>加载中...</Text>
      ) : (
        <FlatList
          data={currentContent.slice(0, 3)}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <Text style={styles.item}>{item.title}</Text>
          )}
        />
      )}
      
      <TouchableOpacity style={styles.button} onPress={showCacheStats}>
        <Text>查看缓存统计</Text>
      </TouchableOpacity>
    </View>
  );
};

// =====================================================
// 示例4: 在其他页面中使用部分功能
// =====================================================

export const PartialFeatureExample: React.FC = () => {
  const [likedItems, setLikedItems] = useState<string[]>([]);

  // 只使用点赞功能
  const handleLike = async (itemId: string) => {
    try {
      await DiscoverAPI.likeContent(itemId);
      setLikedItems(prev => [...prev, itemId]);
    } catch (error) {
      console.error('点赞失败:', error);
    }
  };

  // 获取一些内容用于演示
  const [demoContent, setDemoContent] = useState<ContentItem[]>([]);

  useEffect(() => {
    DiscoverAPI.getContentList('hot', 1)
      .then(response => setDemoContent(response.list.slice(0, 3)))
      .catch(console.error);
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>部分功能使用示例</Text>
      <Text style={styles.subtitle}>只使用点赞功能</Text>
      
      {demoContent.map(item => (
        <View key={item.id} style={styles.itemContainer}>
          <Text style={styles.item}>{item.title}</Text>
          <TouchableOpacity
            style={[
              styles.likeButton,
              likedItems.includes(item.id) && styles.likedButton
            ]}
            onPress={() => handleLike(item.id)}
          >
            <Text style={styles.likeText}>
              {likedItems.includes(item.id) ? '已赞' : '点赞'}
            </Text>
          </TouchableOpacity>
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
    marginBottom: 16,
  },
  item: {
    padding: 8,
    backgroundColor: '#f0f0f0',
    marginBottom: 4,
    borderRadius: 4,
  },
  button: {
    backgroundColor: '#8A2BE2',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 16,
  },
  tabContainer: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  tab: {
    flex: 1,
    padding: 8,
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
    marginHorizontal: 2,
    borderRadius: 4,
  },
  activeTab: {
    backgroundColor: '#8A2BE2',
  },
  tabText: {
    color: '#333',
  },
  activeTabText: {
    color: 'white',
  },
  itemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  likeButton: {
    backgroundColor: '#ddd',
    padding: 8,
    borderRadius: 4,
  },
  likedButton: {
    backgroundColor: '#FF3B30',
  },
  likeText: {
    color: 'white',
    fontSize: 12,
  },
});

// =====================================================
// 集成示例组件
// =====================================================

export const DataServiceExamples: React.FC = () => {
  const [currentExample, setCurrentExample] = useState(0);

  const examples = [
    { title: '直接API调用', component: DirectAPIExample },
    { title: 'Hook使用', component: HookBasedExample },
    { title: '配置化使用', component: ConfigurableExample },
    { title: '部分功能使用', component: PartialFeatureExample },
  ];

  const CurrentComponent = examples[currentExample].component;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>数据服务使用示例</Text>
      
      {/* 示例切换按钮 */}
      <View style={styles.tabContainer}>
        {examples.map((example, index) => (
          <TouchableOpacity
            key={index}
            style={[
              styles.tab,
              currentExample === index && styles.activeTab
            ]}
            onPress={() => setCurrentExample(index)}
          >
            <Text style={[
              styles.tabText,
              currentExample === index && styles.activeTabText
            ]}>
              {example.title}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* 当前示例 */}
      <CurrentComponent />
    </View>
  );
};
