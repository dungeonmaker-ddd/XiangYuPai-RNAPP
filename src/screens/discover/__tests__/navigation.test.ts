/**
 * 导航集成测试
 * 测试从瀑布流卡片到详情页面的导航流程
 */

import { onWaterfallCardClick } from '../WaterfallCard/onWaterfallCardClick';
import { ContentItem, TabType } from '../types';

// Mock navigation object
const mockNavigation = {
  navigate: jest.fn(),
  goBack: jest.fn(),
  push: jest.fn(),
  replace: jest.fn(),
  reset: jest.fn(),
};

// Mock analytics service
const mockAnalytics = {
  track: jest.fn(),
};

// Mock toast function
const mockShowToast = jest.fn();

// Mock content item
const mockContentItem: ContentItem = {
  id: 'test-content-001',
  type: 'image',
  imageUrl: 'https://example.com/image.jpg',
  title: '测试内容标题',
  description: '这是一个测试内容的描述',
  user: {
    id: 'user-001',
    nickname: '测试用户',
    avatar: 'https://example.com/avatar.jpg',
    isFollowing: false,
    verified: true,
    level: 10,
  },
  likeCount: 128,
  commentCount: 45,
  shareCount: 23,
  isLiked: false,
  isCollected: false,
  createdAt: '2024-01-10T08:00:00Z',
  updatedAt: '2024-01-10T08:00:00Z',
  location: {
    latitude: 39.9042,
    longitude: 116.4074,
    address: '北京',
  },
  tags: ['#测试标签', '#单元测试'],
  width: 400,
  height: 600,
};

describe('Navigation Integration', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('onWaterfallCardClick', () => {
    it('should navigate to DiscoverDetail with correct parameters', async () => {
      const result = await onWaterfallCardClick({
        item: mockContentItem,
        index: 2,
        tabType: 'hot' as TabType,
        navigation: mockNavigation,
        analytics: mockAnalytics,
        showToast: mockShowToast,
      });

      // 验证导航调用
      expect(mockNavigation.navigate).toHaveBeenCalledWith('DiscoverDetail', {
        contentId: 'test-content-001',
        contentItem: mockContentItem,
        sourceTab: 'hot',
        sourceIndex: 2,
        context: {
          referrer: 'discover_waterfall',
          timestamp: expect.any(Number),
        },
      });

      // 验证返回结果
      expect(result.success).toBe(true);
      expect(result.action).toBe('navigate_detail');
      expect(result.data?.targetScreen).toBe('DiscoverDetail');
    });

    it('should track analytics when navigation succeeds', async () => {
      await onWaterfallCardClick({
        item: mockContentItem,
        index: 1,
        tabType: 'follow' as TabType,
        navigation: mockNavigation,
        analytics: mockAnalytics,
        showToast: mockShowToast,
      });

      // 验证分析数据被记录
      expect(mockAnalytics.track).toHaveBeenCalledWith('card_click', {
        content_id: 'test-content-001',
        content_type: 'image',
        content_title: '测试内容标题',
        author_id: 'user-001',
        author_nickname: '测试用户',
        position: 1,
        tab_type: 'follow',
        like_count: 128,
        comment_count: 45,
        share_count: 23,
        is_liked: false,
        is_collected: false,
        is_following_author: false,
        content_created_at: '2024-01-10T08:00:00Z',
        click_timestamp: expect.any(Number),
        platform: 'react-native',
      });
    });

    it('should show toast message on successful navigation', async () => {
      await onWaterfallCardClick({
        item: mockContentItem,
        index: 0,
        tabType: 'local' as TabType,
        navigation: mockNavigation,
        analytics: mockAnalytics,
        showToast: mockShowToast,
      });

      // 验证Toast消息
      expect(mockShowToast).toHaveBeenCalledWith('查看内容: 测试内容标题');
    });

    it('should handle navigation error gracefully', async () => {
      const errorNavigation = {
        navigate: jest.fn().mockImplementation(() => {
          throw new Error('Navigation failed');
        }),
      };

      const result = await onWaterfallCardClick({
        item: mockContentItem,
        index: 0,
        tabType: 'hot' as TabType,
        navigation: errorNavigation,
        analytics: mockAnalytics,
        showToast: mockShowToast,
      });

      expect(result.success).toBe(false);
      expect(result.action).toBe('error');
      expect(mockShowToast).toHaveBeenCalledWith('打开内容失败，请重试');
    });

    it('should handle missing navigation object', async () => {
      const result = await onWaterfallCardClick({
        item: mockContentItem,
        index: 0,
        tabType: 'hot' as TabType,
        // navigation 未传递
        analytics: mockAnalytics,
        showToast: mockShowToast,
      });

      expect(result.success).toBe(true);
      expect(result.action).toBe('navigate');
      expect(result.message).toContain('导航功能在当前环境不可用');
    });

    it('should validate content item parameters', async () => {
      const invalidItem = {
        ...mockContentItem,
        id: '', // 无效的ID
      };

      const result = await onWaterfallCardClick({
        item: invalidItem,
        index: 0,
        tabType: 'hot' as TabType,
        navigation: mockNavigation,
        analytics: mockAnalytics,
        showToast: mockShowToast,
      });

      expect(result.success).toBe(false);
      expect(result.action).toBe('error');
      expect(mockShowToast).toHaveBeenCalledWith('打开内容失败，请重试');
    });
  });

  describe('Navigation Type Safety', () => {
    it('should accept valid DiscoverDetail parameters', () => {
      // 这个测试主要验证TypeScript类型正确性
      const validParams = {
        contentId: 'test-id',
        contentItem: mockContentItem,
      };

      // 如果类型定义正确，这行代码应该通过TypeScript编译
      const navigationCall = () => {
        mockNavigation.navigate('DiscoverDetail', validParams);
      };

      expect(navigationCall).not.toThrow();
    });
  });
});

export { mockContentItem, mockNavigation, mockAnalytics, mockShowToast };
