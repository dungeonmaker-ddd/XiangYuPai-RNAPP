/**
 * GroupCenter 页面组数据状态管理
 * 
 * 管理 GroupCenter 页面组的数据获取和缓存
 */

import { useState, useEffect, useCallback } from 'react';
import { 
  GroupInfo, 
  GroupParticipant, 
  GroupPaymentInfo, 
  GroupStatistics, 
  GroupFilterOptions,
  GroupPublishData 
} from './types';
import { DEFAULT_GROUP_CONFIG } from './constants';

export const useGroupCenterData = () => {
  // 数据状态
  const [groupList, setGroupList] = useState<GroupInfo[]>([]);
  const [currentGroup, setCurrentGroup] = useState<GroupInfo | null>(null);
  const [myGroups, setMyGroups] = useState<GroupInfo[]>([]);
  const [joinedGroups, setJoinedGroups] = useState<GroupInfo[]>([]);
  const [participants, setParticipants] = useState<GroupParticipant[]>([]);
  const [paymentInfo, setPaymentInfo] = useState<GroupPaymentInfo | null>(null);
  const [statistics, setStatistics] = useState<GroupStatistics | null>(null);
  const [isLoadingGroups, setIsLoadingGroups] = useState(false);
  const [isLoadingDetail, setIsLoadingDetail] = useState(false);
  const [isLoadingPayment, setIsLoadingPayment] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(true);

  // 获取组局列表
  const fetchGroupList = useCallback(async (filter?: GroupFilterOptions, refresh = false) => {
    setIsLoadingGroups(true);
    setError(null);
    
    try {
      // TODO: 实际的 API 调用
      // const response = await apiGroupCenterList({
      //   ...filter,
      //   pageSize: DEFAULT_GROUP_CONFIG.PAGE_SIZE
      // });
      
      // 模拟数据（YAGNI + MVP 原则）
      const mockGroups: GroupInfo[] = [
        {
          id: 'group1',
          title: '王者荣耀五排上分',
          description: '寻找队友一起上分，要求钻石以上段位，会打配合',
          gameType: '王者荣耀',
          gameIcon: 'king_of_glory.png',
          organizerId: 'user1',
          organizerName: '组局达人',
          organizerAvatar: 'avatar1.jpg',
          organizerRating: 4.8,
          location: '北京市朝阳区',
          address: '三里屯网咖',
          startTime: '2024-01-01 19:00:00',
          endTime: '2024-01-01 22:00:00',
          maxParticipants: 5,
          currentParticipants: 3,
          price: 50,
          currency: 'CNY',
          status: 'open',
          tags: ['上分', '配合', '钻石+'],
          requirements: ['钻石段位以上', '会语音沟通', '态度良好'],
          images: ['group1_1.jpg', 'group1_2.jpg'],
          participants: [],
          createdAt: '2024-01-01 10:00:00',
          updatedAt: '2024-01-01 10:00:00',
          isJoined: false,
          isOwner: false,
          isFavorite: false,
        },
        {
          id: 'group2',
          title: '和平精英四排吃鸡',
          description: '一起吃鸡，娱乐为主，新手也欢迎',
          gameType: '和平精英',
          gameIcon: 'peace_elite.png',
          organizerId: 'user2',
          organizerName: '吃鸡小王子',
          organizerAvatar: 'avatar2.jpg',
          organizerRating: 4.5,
          location: '上海市浦东新区',
          address: '陆家嘴电竞馆',
          startTime: '2024-01-01 20:00:00',
          endTime: '2024-01-01 23:00:00',
          maxParticipants: 4,
          currentParticipants: 2,
          price: 0,
          currency: 'CNY',
          status: 'open',
          tags: ['娱乐', '新手友好', '免费'],
          requirements: ['有游戏基础', '友善沟通'],
          images: ['group2_1.jpg'],
          participants: [],
          createdAt: '2024-01-01 11:00:00',
          updatedAt: '2024-01-01 11:00:00',
          isJoined: true,
          isOwner: false,
          isFavorite: true,
        },
        // ... 更多模拟数据
      ];
      
      if (refresh) {
        setGroupList(mockGroups);
      } else {
        setGroupList(prev => [...prev, ...mockGroups]);
      }
      
      setHasMore(mockGroups.length === DEFAULT_GROUP_CONFIG.PAGE_SIZE);
    } catch (err) {
      setError(err instanceof Error ? err.message : '获取组局列表失败');
    } finally {
      setIsLoadingGroups(false);
    }
  }, []);

  // 获取组局详情
  const fetchGroupDetail = useCallback(async (groupId: string) => {
    setIsLoadingDetail(true);
    setError(null);
    
    try {
      // TODO: 实际的 API 调用
      // const response = await apiGroupCenterDetail(groupId);
      
      // 模拟数据（YAGNI + MVP 原则）
      const mockGroup: GroupInfo = {
        id: groupId,
        title: '王者荣耀五排上分',
        description: '寻找队友一起上分，要求钻石以上段位，会打配合。我们是一个稳定的团队，已经一起玩了很久，现在缺几个固定队友。',
        gameType: '王者荣耀',
        gameIcon: 'king_of_glory.png',
        organizerId: 'user1',
        organizerName: '组局达人',
        organizerAvatar: 'avatar1.jpg',
        organizerRating: 4.8,
        location: '北京市朝阳区',
        address: '三里屯网咖，地址：朝阳区三里屯路19号',
        startTime: '2024-01-01 19:00:00',
        endTime: '2024-01-01 22:00:00',
        maxParticipants: 5,
        currentParticipants: 3,
        price: 50,
        currency: 'CNY',
        status: 'open',
        tags: ['上分', '配合', '钻石+'],
        requirements: ['钻石段位以上', '会语音沟通', '态度良好'],
        images: ['group1_1.jpg', 'group1_2.jpg', 'group1_3.jpg'],
        participants: [
          {
            id: 'participant1',
            userId: 'user1',
            userName: '组局达人',
            userAvatar: 'avatar1.jpg',
            userRating: 4.8,
            joinedAt: '2024-01-01 10:00:00',
            status: 'confirmed',
            paymentStatus: 'paid',
            note: '组织者',
          },
          {
            id: 'participant2',
            userId: 'user3',
            userName: '队友A',
            userAvatar: 'avatar3.jpg',
            userRating: 4.2,
            joinedAt: '2024-01-01 12:00:00',
            status: 'confirmed',
            paymentStatus: 'paid',
          },
          {
            id: 'participant3',
            userId: 'user4',
            userName: '队友B',
            userAvatar: 'avatar4.jpg',
            userRating: 4.0,
            joinedAt: '2024-01-01 14:00:00',
            status: 'pending',
            paymentStatus: 'unpaid',
          },
        ],
        createdAt: '2024-01-01 10:00:00',
        updatedAt: '2024-01-01 14:30:00',
        isJoined: false,
        isOwner: false,
        isFavorite: false,
      };
      
      setCurrentGroup(mockGroup);
      setParticipants(mockGroup.participants);
    } catch (err) {
      setError(err instanceof Error ? err.message : '获取组局详情失败');
    } finally {
      setIsLoadingDetail(false);
    }
  }, []);

  // 获取我的组局
  const fetchMyGroups = useCallback(async () => {
    setIsLoadingGroups(true);
    setError(null);
    
    try {
      // TODO: 实际的 API 调用
      // const response = await apiGroupCenterMyGroups();
      
      // 模拟数据（YAGNI + MVP 原则）
      const mockMyGroups: GroupInfo[] = [
        // 我创建的组局
        {
          id: 'mygroup1',
          title: '我的组局1',
          description: '我组织的游戏局',
          gameType: '王者荣耀',
          organizerId: 'currentUser',
          organizerName: '我',
          organizerRating: 4.5,
          location: '北京市',
          startTime: '2024-01-02 19:00:00',
          maxParticipants: 5,
          currentParticipants: 3,
          price: 30,
          currency: 'CNY',
          status: 'open',
          tags: ['上分'],
          participants: [],
          createdAt: '2024-01-01 15:00:00',
          updatedAt: '2024-01-01 15:00:00',
          isJoined: true,
          isOwner: true,
          isFavorite: false,
        },
        // ... 更多模拟数据
      ];
      
      setMyGroups(mockMyGroups);
    } catch (err) {
      setError(err instanceof Error ? err.message : '获取我的组局失败');
    } finally {
      setIsLoadingGroups(false);
    }
  }, []);

  // 加入组局
  const joinGroup = useCallback(async (groupId: string, note?: string) => {
    setIsLoadingDetail(true);
    setError(null);
    
    try {
      // TODO: 实际的 API 调用
      // await apiGroupCenterJoin(groupId, { note });
      
      // 更新本地状态
      setGroupList(prev => 
        prev.map(group => 
          group.id === groupId 
            ? { 
                ...group, 
                isJoined: true,
                currentParticipants: group.currentParticipants + 1
              }
            : group
        )
      );
      
      if (currentGroup?.id === groupId) {
        setCurrentGroup(prev => prev ? {
          ...prev,
          isJoined: true,
          currentParticipants: prev.currentParticipants + 1
        } : prev);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : '加入组局失败');
    } finally {
      setIsLoadingDetail(false);
    }
  }, [currentGroup]);

  // 退出组局
  const leaveGroup = useCallback(async (groupId: string) => {
    setIsLoadingDetail(true);
    setError(null);
    
    try {
      // TODO: 实际的 API 调用
      // await apiGroupCenterLeave(groupId);
      
      // 更新本地状态
      setGroupList(prev => 
        prev.map(group => 
          group.id === groupId 
            ? { 
                ...group, 
                isJoined: false,
                currentParticipants: Math.max(0, group.currentParticipants - 1)
              }
            : group
        )
      );
      
      if (currentGroup?.id === groupId) {
        setCurrentGroup(prev => prev ? {
          ...prev,
          isJoined: false,
          currentParticipants: Math.max(0, prev.currentParticipants - 1)
        } : prev);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : '退出组局失败');
    } finally {
      setIsLoadingDetail(false);
    }
  }, [currentGroup]);

  // 发布组局
  const publishGroup = useCallback(async (publishData: GroupPublishData) => {
    setIsLoadingGroups(true);
    setError(null);
    
    try {
      // TODO: 实际的 API 调用
      // const response = await apiGroupCenterPublish(publishData);
      
      // 模拟创建成功
      const newGroupId = 'new_group_' + Date.now();
      console.log('组局发布成功', { groupId: newGroupId, publishData });
      
      return newGroupId;
    } catch (err) {
      setError(err instanceof Error ? err.message : '发布组局失败');
      throw err;
    } finally {
      setIsLoadingGroups(false);
    }
  }, []);

  // 收藏/取消收藏组局
  const toggleFavorite = useCallback(async (groupId: string) => {
    try {
      // TODO: 实际的 API 调用
      // await apiGroupCenterToggleFavorite(groupId);
      
      // 更新本地状态
      setGroupList(prev => 
        prev.map(group => 
          group.id === groupId 
            ? { ...group, isFavorite: !group.isFavorite }
            : group
        )
      );
      
      if (currentGroup?.id === groupId) {
        setCurrentGroup(prev => prev ? {
          ...prev,
          isFavorite: !prev.isFavorite
        } : prev);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : '收藏操作失败');
    }
  }, [currentGroup]);

  // 刷新数据
  const refreshData = useCallback(async (filter?: GroupFilterOptions) => {
    await fetchGroupList(filter, true);
  }, [fetchGroupList]);

  // 加载更多数据
  const loadMore = useCallback(async (filter?: GroupFilterOptions) => {
    if (!isLoadingGroups && hasMore) {
      await fetchGroupList(filter, false);
    }
  }, [fetchGroupList, isLoadingGroups, hasMore]);

  // 初始化数据加载
  useEffect(() => {
    fetchGroupList(undefined, true);
  }, [fetchGroupList]);

  return {
    // 数据状态
    groupList,
    currentGroup,
    myGroups,
    joinedGroups,
    participants,
    paymentInfo,
    statistics,
    isLoadingGroups,
    isLoadingDetail,
    isLoadingPayment,
    error,
    hasMore,
    
    // 操作方法
    fetchGroupList,
    fetchGroupDetail,
    fetchMyGroups,
    joinGroup,
    leaveGroup,
    publishGroup,
    toggleFavorite,
    refreshData,
    loadMore,
  };
};
