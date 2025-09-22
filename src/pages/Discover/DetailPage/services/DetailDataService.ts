/**
 * 详情页面数据服务
 * 负责内容获取、评论管理、互动操作等API调用
 */

import { 
  DetailContentRequest,
  DetailContentResponse,
  CommentsRequest,
  CommentsResponse,
  AddCommentRequest,
  InteractionRequest,
  InteractionResponse,
  CommentItem,
  InteractionType,
} from '../types';
import { ContentItem } from '../../discover/WaterfallList/types';

// 模拟API延迟
const API_DELAY = 1000;

// 模拟API基础URL
const API_BASE_URL = 'https://api.xiangyupai.com/v1';

/**
 * 详情页面数据服务类
 */
export class DetailDataService {
  
  /**
   * 获取内容详情
   */
  static async getContentDetail(request: DetailContentRequest): Promise<DetailContentResponse> {
    // 模拟API调用
    await new Promise<void>(resolve => setTimeout(resolve, API_DELAY));
    
    // 模拟返回数据 - 包含完整的用户扩展信息
    const mockContent: ContentItem = {
      id: request.contentId,
      type: 'image',
      imageUrl: 'https://picsum.photos/400/600?random=' + request.contentId,
      title: '新赛季，新征程',
      description: '英雄联盟2021新赛季已开启，段位解锁更改让赛季初上分更激动人心❤️，速速上分吧！',
      user: {
        id: 'user_001',
        nickname: '门前游过一群鸭',
        avatar: 'https://picsum.photos/100/100?random=user001',
        isFollowing: false,
        verified: true,
        level: 19,
        // 扩展字段 - 详情页专用
        gender: 'female' as 'female',
        age: 19,
        bio: '新赛季，新征程',
      } as any,
      likeCount: 28,
      commentCount: 1,
      shareCount: 28,
      isLiked: false,
      isCollected: false,
      createdAt: '2024-01-10T08:00:00Z',
      updatedAt: '2024-01-10T08:00:00Z',
      location: {
        latitude: 38.0428,
        longitude: 114.5149,
        address: '河北',
      },
      tags: ['#S10全球总决赛', '#英雄联盟'],
      width: 400,
      height: 600,
    };

    // 模拟相关内容推荐 - 包含扩展用户信息
    const relatedContents: ContentItem[] = Array.from({ length: 5 }, (_, index) => ({
      id: `related_${index}`,
      type: 'image' as const,
      imageUrl: `https://picsum.photos/200/300?random=related${index}`,
      title: `相关内容 ${index + 1}`,
      description: `这是相关内容的描述 ${index + 1}`,
      user: {
        id: `user_${index}`,
        nickname: `用户${index + 1}`,
        avatar: `https://picsum.photos/50/50?random=user${index}`,
        isFollowing: false,
        // 为相关内容用户也添加扩展字段
        gender: index % 2 === 0 ? 'female' : 'male',
        age: 18 + index * 2,
        bio: `用户${index + 1}的个性签名`,
        verified: index % 3 === 0,
        level: index + 1,
      } as any,
      likeCount: Math.floor(Math.random() * 100),
      commentCount: Math.floor(Math.random() * 20),
      shareCount: Math.floor(Math.random() * 50),
      isLiked: false,
      isCollected: false,
      createdAt: new Date(Date.now() - Math.random() * 86400000 * 7).toISOString(),
      updatedAt: new Date().toISOString(),
      width: 200,
      height: 300,
    }));

    return {
      content: mockContent,
      relatedContents,
    };
  }

  /**
   * 获取评论列表
   */
  static async getComments(request: CommentsRequest): Promise<CommentsResponse> {
    await new Promise<void>(resolve => setTimeout(resolve, API_DELAY / 2));
    
    const mockComments: CommentItem[] = [
      {
        id: '1',
        content: '这个地方真的太美了！我上次去的时候也是这样的感觉，特别是晚上的时候灯光很棒✨',
        user: {
          id: 'user1',
          nickname: '小美',
          avatar: 'https://via.placeholder.com/100x100/FFB6C1/FFFFFF?text=小美',
          isFollowing: false,
          verified: true,
          level: 5
        },
        createdAt: new Date(Date.now() - 5 * 60 * 1000).toISOString(), // 5分钟前
        likeCount: 12,
        isLiked: true,
        location: {
          address: '北京市朝阳区三里屯',
          latitude: 39.9388,
          longitude: 116.4471,
          distance: 0.8
        },
        replies: [
          {
            id: '1-1',
            content: '是的呢，我也想去看看！',
            user: {
              id: 'user2',
              nickname: '旅行达人',
              avatar: 'https://via.placeholder.com/100x100/87CEEB/FFFFFF?text=达人',
              isFollowing: true,
              verified: false,
              level: 3
            },
            createdAt: new Date(Date.now() - 3 * 60 * 1000).toISOString(), // 3分钟前
            likeCount: 3,
            isLiked: false,
            parentId: '1'
          }
        ]
      },
      {
        id: '2',
        content: '拍照技术不错啊，构图很棒！请问用的什么相机？📷',
        user: {
          id: 'user3',
          nickname: '摄影师老王',
          avatar: 'https://via.placeholder.com/100x100/98FB98/FFFFFF?text=老王',
          isFollowing: false,
          verified: true,
          level: 8
        },
        createdAt: new Date(Date.now() - 15 * 60 * 1000).toISOString(), // 15分钟前
        likeCount: 8,
        isLiked: false,
        replies: [
          {
            id: '2-1',
            content: '看起来像是用的单反，效果真不错',
            user: {
              id: 'user8',
              nickname: '摄影小白',
              avatar: 'https://via.placeholder.com/100x100/DEB887/FFFFFF?text=小白',
              isFollowing: false,
              verified: false,
              level: 1
            },
            createdAt: new Date(Date.now() - 10 * 60 * 1000).toISOString(), // 10分钟前
            likeCount: 1,
            isLiked: false,
            parentId: '2'
          }
        ]
      },
      {
        id: '3',
        content: '哇塞！这也太好看了吧，马上安排上！有没有详细攻略？🗺️',
        user: {
          id: 'user4',
          nickname: '爱旅游的小李',
          avatar: 'https://via.placeholder.com/100x100/DDA0DD/FFFFFF?text=小李',
          isFollowing: false,
          verified: false,
          level: 4
        },
        createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2小时前
        likeCount: 25,
        isLiked: true,
        location: {
          address: '上海市黄浦区外滩',
          latitude: 31.2397,
          longitude: 121.4997,
          distance: 1200.5
        },
        replies: [
          {
            id: '3-1',
            content: '我也想知道攻略！求楼主分享 🙏',
            user: {
              id: 'user5',
              nickname: '小白',
              avatar: 'https://via.placeholder.com/100x100/F0E68C/FFFFFF?text=小白',
              isFollowing: false,
              verified: false,
              level: 2
            },
            createdAt: new Date(Date.now() - 1.5 * 60 * 60 * 1000).toISOString(), // 1.5小时前
            likeCount: 2,
            isLiked: false,
            parentId: '3'
          },
          {
            id: '3-2',
            content: '楼主快出攻略吧！已经收藏了',
            user: {
              id: 'user6',
              nickname: '等攻略的人',
              avatar: 'https://via.placeholder.com/100x100/FFA07A/FFFFFF?text=等待',
              isFollowing: false,
              verified: false,
              level: 3
            },
            createdAt: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(), // 1小时前
            likeCount: 1,
            isLiked: false,
            parentId: '3'
          }
        ]
      },
      {
        id: '4',
        content: '景色很美，就是人有点多😅 不过还是值得一去的',
        user: {
          id: 'user7',
          nickname: '独行侠',
          avatar: 'https://via.placeholder.com/100x100/20B2AA/FFFFFF?text=独行',
          isFollowing: false,
          verified: false,
          level: 6
        },
        createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(), // 1天前
        likeCount: 5,
        isLiked: false,
        replies: []
      },
      {
        id: '5',
        content: '这个角度拍的真好！我之前去的时候没找到这个位置',
        user: {
          id: 'user9',
          nickname: '风景收集者',
          avatar: 'https://via.placeholder.com/100x100/9370DB/FFFFFF?text=收集',
          isFollowing: true,
          verified: true,
          level: 7
        },
        createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(), // 3天前
        likeCount: 18,
        isLiked: true,
        location: {
          address: '广州市天河区珠江新城',
          latitude: 23.1167,
          longitude: 113.3833,
          distance: 2100.2
        },
        replies: [
          {
            id: '5-1',
            content: '我可以告诉你具体位置，私信我吧',
            user: {
              id: 'user1', // 原发布者回复
              nickname: '小美',
              avatar: 'https://via.placeholder.com/100x100/FFB6C1/FFFFFF?text=小美',
              isFollowing: false,
              verified: true,
              level: 5
            },
            createdAt: new Date(Date.now() - 2.5 * 24 * 60 * 60 * 1000).toISOString(), // 2.5天前
            likeCount: 8,
            isLiked: false,
            parentId: '5'
          },
          {
            id: '5-2',
            content: '太好了！马上私信你 ✨',
            user: {
              id: 'user9',
              nickname: '风景收集者',
              avatar: 'https://via.placeholder.com/100x100/9370DB/FFFFFF?text=收集',
              isFollowing: true,
              verified: true,
              level: 7
            },
            createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), // 2天前
            likeCount: 3,
            isLiked: true,
            parentId: '5'
          }
        ]
      }
    ];

    return {
      comments: mockComments,
      total: mockComments.length,
      hasMore: false,
    };
  }

  /**
   * 添加评论
   */
  static async addComment(request: AddCommentRequest): Promise<CommentItem> {
    await new Promise<void>(resolve => setTimeout(resolve, API_DELAY / 2));
    
    const newComment: CommentItem = {
      id: `comment_${Date.now()}`,
      content: request.content,
      user: {
        id: 'current_user',
        nickname: '当前用户',
        avatar: 'https://picsum.photos/80/80?random=currentuser',
        isFollowing: false,
      },
      likeCount: 0,
      isLiked: false,
      createdAt: new Date().toISOString(),
      parentId: request.parentId,
    };

    return newComment;
  }

  /**
   * 点赞/取消点赞内容
   */
  static async toggleLike(request: InteractionRequest): Promise<InteractionResponse> {
    await new Promise<void>(resolve => setTimeout(resolve, 300));
    
    // 模拟点赞逻辑
    const isCurrentlyLiked = Math.random() > 0.5; // 模拟当前状态
    const newIsLiked = !isCurrentlyLiked;
    const newCount = Math.floor(Math.random() * 100) + (newIsLiked ? 1 : -1);

    return {
      success: true,
      newCount: Math.max(0, newCount),
      isActive: newIsLiked,
    };
  }

  /**
   * 收藏/取消收藏内容
   */
  static async toggleCollect(request: InteractionRequest): Promise<InteractionResponse> {
    await new Promise<void>(resolve => setTimeout(resolve, 300));
    
    const isCurrentlyCollected = Math.random() > 0.5;
    const newIsCollected = !isCurrentlyCollected;
    const newCount = Math.floor(Math.random() * 50) + (newIsCollected ? 1 : -1);

    return {
      success: true,
      newCount: Math.max(0, newCount),
      isActive: newIsCollected,
    };
  }

  /**
   * 关注/取消关注用户
   */
  static async toggleFollow(userId: string): Promise<InteractionResponse> {
    await new Promise<void>(resolve => setTimeout(resolve, 400));
    
    const isCurrentlyFollowing = Math.random() > 0.5;
    const newIsFollowing = !isCurrentlyFollowing;

    return {
      success: true,
      newCount: 0, // 关注不需要计数
      isActive: newIsFollowing,
    };
  }

  /**
   * 点赞/取消点赞评论
   */
  static async toggleCommentLike(commentId: string): Promise<InteractionResponse> {
    await new Promise<void>(resolve => setTimeout(resolve, 200));
    
    const isCurrentlyLiked = Math.random() > 0.5;
    const newIsLiked = !isCurrentlyLiked;
    const newCount = Math.floor(Math.random() * 20) + (newIsLiked ? 1 : -1);

    return {
      success: true,
      newCount: Math.max(0, newCount),
      isActive: newIsLiked,
    };
  }

  /**
   * 分享内容
   */
  static async shareContent(contentId: string, platform?: string): Promise<{ success: boolean; shareUrl?: string }> {
    await new Promise<void>(resolve => setTimeout(resolve, 500));
    
    const shareUrl = `${API_BASE_URL}/share/content/${contentId}`;
    
    return {
      success: true,
      shareUrl,
    };
  }

  /**
   * 举报内容
   */
  static async reportContent(contentId: string, reason: string): Promise<{ success: boolean }> {
    await new Promise<void>(resolve => setTimeout(resolve, 800));
    
    return {
      success: true,
    };
  }

  /**
   * 举报评论
   */
  static async reportComment(commentId: string, reason: string): Promise<{ success: boolean }> {
    await new Promise<void>(resolve => setTimeout(resolve, 600));
    
    return {
      success: true,
    };
  }

  /**
   * 删除评论
   */
  static async deleteComment(commentId: string): Promise<{ success: boolean }> {
    await new Promise<void>(resolve => setTimeout(resolve, 400));
    
    return {
      success: true,
    };
  }
}

export default DetailDataService;
