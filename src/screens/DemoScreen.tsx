/**
 * 📱 演示页面 - 模块展示入口
 * 展示所有已完成的页面模块
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  StatusBar,
  Dimensions,
  ImageBackground
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

// 导入页面组件
import { HomeScreen } from './home';
import { DiscoverScreen } from './discover';
import { GroupCenterScreen } from './group-center';
import { NavigationProp, RouteProp } from '../types/navigation';

const { width: screenWidth } = Dimensions.get('window');

interface DemoScreenProps {
  navigation: NavigationProp;
  route: RouteProp;
}

type PageType = 'demo' | 'home' | 'discover' | 'group-center';

const DemoScreen: React.FC<DemoScreenProps> = ({ navigation, route }) => {
  const [currentPage, setCurrentPage] = useState<PageType>('demo');

  // 页面配置
  const pages = [
    {
      id: 'home' as PageType,
      title: '🏠 首页模块',
      description: '基于PGAS栅格系统的精确UI架构\n用户卡片 + 功能网格 + 限时优惠',
      status: '✅ 已完成',
      features: [
        '双列用户卡片瀑布流',
        '功能网格导航',
        '限时优惠滚动',
        '组队开黑板块',
        '智能筛选系统'
      ]
    },
    {
      id: 'discover' as PageType,
      title: '🔍 发现页面',
      description: '三维内容发现体系\n关注/热门/同城内容展示',
      status: '✅ 已完成',
      features: [
        '智能双列瀑布流布局',
        '三标签页切换(关注/热门/同城)',
        '多媒体内容卡片',
        '社交互动功能',
        '地理位置服务'
      ]
    },
    {
      id: 'group-center' as PageType,
      title: '🎯 组局中心',
      description: '完整社交组局业务闭环\n发布/筛选/报名/支付流程',
      status: '✅ 已完成',
      features: [
        '组局发布系统',
        '智能筛选浏览',
        '详情展示页面',
        '报名支付流程',
        '状态管理系统'
      ]
    }
  ];

  // 渲染演示页面
  const renderDemoPage = () => (
    <ImageBackground
      source={require('../../assets/images/backgrounds/linearGradint.png')}
      style={styles.demoContainer}
      resizeMode="cover"
    >
      <StatusBar barStyle="light-content" backgroundColor="#8B5CF6" />
      
      {/* 头部标题 */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>🚀 AwesomeProject</Text>
        <Text style={styles.headerSubtitle}>React Native 模块展示</Text>
      </View>

      {/* 页面列表 */}
      <ScrollView style={styles.pageList} showsVerticalScrollIndicator={false}>
        {pages.map((page) => (
          <TouchableOpacity
            key={page.id}
            style={styles.pageCard}
            onPress={() => setCurrentPage(page.id)}
            activeOpacity={0.8}
          >
            <View style={styles.pageCardHeader}>
              <Text style={styles.pageTitle}>{page.title}</Text>
              <Text style={styles.pageStatus}>{page.status}</Text>
            </View>
            
            <Text style={styles.pageDescription}>{page.description}</Text>
            
            <View style={styles.featuresContainer}>
              <Text style={styles.featuresTitle}>主要功能：</Text>
              {page.features.map((feature, index) => (
                <Text key={index} style={styles.featureItem}>
                  • {feature}
                </Text>
              ))}
            </View>
            
            <View style={styles.pageCardFooter}>
              <Text style={styles.tapToView}>点击查看 →</Text>
            </View>
          </TouchableOpacity>
        ))}
        
        {/* 更多模块计划 */}
        <View style={styles.comingSoonCard}>
          <Text style={styles.comingSoonTitle}>🔮 更多模块</Text>
          <Text style={styles.comingSoonText}>
            🎮 游戏中心 - 开发中{'\n'}
            💬 聊天模块 - 规划中{'\n'}
            👤 个人中心 - 规划中{'\n'}
            🛒 商城模块 - 规划中
          </Text>
        </View>
      </ScrollView>
      
      {/* 底部信息 */}
      <View style={styles.footer}>
        <Text style={styles.footerText}>
          基于单文件模块化架构设计 • 无共享依赖
        </Text>
      </View>
    </ImageBackground>
  );

  // 渲染当前选中的页面
  const renderCurrentPage = () => {
    switch (currentPage) {
      case 'home':
        return <HomeScreen navigation={navigation} route={route} />;
      case 'discover':
        return <DiscoverScreen />;
      case 'group-center':
        return <GroupCenterScreen navigation={navigation} route={route} />;
      default:
        return renderDemoPage();
    }
  };

  // 如果不在演示页面，显示返回按钮
  const showBackButton = currentPage !== 'demo';

  return (
    <SafeAreaView style={styles.container}>
      {showBackButton && (
        <View style={styles.backButtonContainer}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => setCurrentPage('demo')}
          >
            <Text style={styles.backButtonText}>← 返回演示</Text>
          </TouchableOpacity>
        </View>
      )}
      
      {renderCurrentPage()}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF'
  },

  // 返回按钮
  backButtonContainer: {
    position: 'absolute',
    top: 50,
    left: 16,
    zIndex: 1000,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 6
  },

  backButton: {
    flexDirection: 'row',
    alignItems: 'center'
  },

  backButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '500'
  },

  // 演示页面样式
  demoContainer: {
    flex: 1,
    backgroundColor: '#8B5CF6'
  },

  header: {
    paddingTop: 60,
    paddingBottom: 30,
    paddingHorizontal: 24,
    alignItems: 'center'
  },

  headerTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 8
  },

  headerSubtitle: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.9)',
    textAlign: 'center'
  },

  pageList: {
    flex: 1,
    paddingHorizontal: 20
  },

  pageCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4
  },

  pageCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12
  },

  pageTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1F2937',
    flex: 1
  },

  pageStatus: {
    fontSize: 12,
    color: '#10B981',
    fontWeight: '600',
    backgroundColor: '#D1FAE5',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12
  },

  pageDescription: {
    fontSize: 14,
    color: '#6B7280',
    lineHeight: 20,
    marginBottom: 16
  },

  featuresContainer: {
    marginBottom: 16
  },

  featuresTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8
  },

  featureItem: {
    fontSize: 13,
    color: '#6B7280',
    lineHeight: 18,
    marginBottom: 4
  },

  pageCardFooter: {
    alignItems: 'flex-end'
  },

  tapToView: {
    fontSize: 14,
    color: '#8B5CF6',
    fontWeight: '500'
  },

  // 即将推出卡片
  comingSoonCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    borderWidth: 2,
    borderColor: 'rgba(139, 92, 246, 0.2)',
    borderStyle: 'dashed'
  },

  comingSoonTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#6B7280',
    marginBottom: 12,
    textAlign: 'center'
  },

  comingSoonText: {
    fontSize: 14,
    color: '#9CA3AF',
    lineHeight: 22,
    textAlign: 'center'
  },

  footer: {
    paddingVertical: 20,
    paddingHorizontal: 24,
    alignItems: 'center'
  },

  footerText: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.8)',
    textAlign: 'center'
  }
});

export default DemoScreen;
