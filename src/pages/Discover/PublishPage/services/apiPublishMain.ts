/**
 * 发布动态主API接口 - 前端调用入口
 * 
 * 职责：
 * 1. 封装HTTP请求调用
 * 2. 处理请求参数和响应数据
 * 3. 统一错误处理和重试机制
 * 4. 与后端Controller接口对应
 */

import { httpClient } from '@/utils/http';
import type { ApiResponse, PageResponse } from '@/types/api';
import type {
  PublishPostRequestDTO,
  PublishPostResponseDTO,
  DraftSaveRequestDTO,
  DraftSaveResponseDTO,
} from '../types';

// API基础路径
const API_BASE_PATH = '/api/v1/publish';

/**
 * 发布动态接口类
 */
export class PublishPostApi {
  
  /**
   * 发布动态
   * 
   * @param data 发布请求数据
   * @returns 发布响应
   */
  static async publishPost(data: PublishPostRequestDTO): Promise<ApiResponse<PublishPostResponseDTO>> {
    return httpClient.post<PublishPostResponseDTO>(`${API_BASE_PATH}/posts`, data);
  }

  /**
   * 编辑动态
   * 
   * @param postId 动态ID
   * @param data 编辑请求数据
   * @returns 编辑响应
   */
  static async updatePost(
    postId: string, 
    data: PublishPostRequestDTO
  ): Promise<ApiResponse<PublishPostResponseDTO>> {
    return httpClient.put<PublishPostResponseDTO>(`${API_BASE_PATH}/posts/${postId}`, data);
  }

  /**
   * 删除动态
   * 
   * @param postId 动态ID
   * @returns 删除响应
   */
  static async deletePost(postId: string): Promise<ApiResponse<void>> {
    return httpClient.delete<void>(`${API_BASE_PATH}/posts/${postId}`);
  }

  /**
   * 查询动态列表
   * 
   * @param params 查询参数
   * @returns 动态列表
   */
  static async queryPosts(params: {
    userId?: string;
    status?: string[];
    privacy?: string;
    keyword?: string;
    pageNum?: number;
    pageSize?: number;
    sortField?: string;
    sortOrder?: string;
  }): Promise<ApiResponse<PageResponse<PublishPostResponseDTO>>> {
    return httpClient.get<PageResponse<PublishPostResponseDTO>>(`${API_BASE_PATH}/posts`, {
      params,
    });
  }

  /**
   * 获取动态详情
   * 
   * @param postId 动态ID
   * @returns 动态详情
   */
  static async getPostDetail(postId: string): Promise<ApiResponse<PublishPostResponseDTO>> {
    return httpClient.get<PublishPostResponseDTO>(`${API_BASE_PATH}/posts/${postId}`);
  }

  /**
   * 保存草稿
   * 
   * @param data 草稿数据
   * @returns 保存响应
   */
  static async saveDraft(data: DraftSaveRequestDTO): Promise<ApiResponse<DraftSaveResponseDTO>> {
    return httpClient.post<DraftSaveResponseDTO>(`${API_BASE_PATH}/drafts`, data);
  }

  /**
   * 获取草稿列表
   * 
   * @param params 查询参数
   * @returns 草稿列表
   */
  static async getDrafts(params: {
    pageNum?: number;
    pageSize?: number;
  } = {}): Promise<ApiResponse<PageResponse<DraftSaveResponseDTO>>> {
    return httpClient.get<PageResponse<DraftSaveResponseDTO>>(`${API_BASE_PATH}/drafts`, {
      params,
    });
  }

  /**
   * 获取草稿详情
   * 
   * @param draftId 草稿ID
   * @returns 草稿内容
   */
  static async getDraftDetail(draftId: string): Promise<ApiResponse<PublishPostRequestDTO>> {
    return httpClient.get<PublishPostRequestDTO>(`${API_BASE_PATH}/drafts/${draftId}`);
  }

  /**
   * 删除草稿
   * 
   * @param draftId 草稿ID
   * @returns 删除响应
   */
  static async deleteDraft(draftId: string): Promise<ApiResponse<void>> {
    return httpClient.delete<void>(`${API_BASE_PATH}/drafts/${draftId}`);
  }

  /**
   * 内容安全检测
   * 
   * @param content 检测内容
   * @returns 检测结果
   */
  static async checkContentSecurity(content: string): Promise<ApiResponse<boolean>> {
    return httpClient.post<boolean>(`${API_BASE_PATH}/security/content-check`, null, {
      params: { content },
    });
  }

  /**
   * 获取用户发布统计
   * 
   * @param params 统计参数
   * @returns 统计结果
   */
  static async getUserStatistics(params: {
    userId?: string;
    timeType?: 'daily' | 'weekly' | 'monthly';
    startTime?: string;
    endTime?: string;
  }): Promise<ApiResponse<any>> {
    return httpClient.get<any>(`${API_BASE_PATH}/statistics/user`, {
      params,
    });
  }

  /**
   * 获取热门内容
   * 
   * @param params 查询参数
   * @returns 热门内容列表
   */
  static async getHotContent(params: {
    hotType?: 'trending' | 'popular' | 'latest_hot';
    timeWindow?: '1h' | '6h' | '12h' | '24h' | '7d' | '30d';
    pageSize?: number;
  } = {}): Promise<ApiResponse<PageResponse<PublishPostResponseDTO>>> {
    return httpClient.get<PageResponse<PublishPostResponseDTO>>(`${API_BASE_PATH}/hot-content`, {
      params,
    });
  }

  /**
   * 批量操作动态
   * 
   * @param postIds 动态ID列表
   * @param action 操作类型
   * @returns 操作响应
   */
  static async batchOperation(
    postIds: string[], 
    action: 'delete' | 'archive' | 'publish'
  ): Promise<ApiResponse<void>> {
    return httpClient.post<void>(`${API_BASE_PATH}/posts/batch-operation`, {
      postIds,
      action,
    });
  }

  /**
   * 获取动态统计信息
   * 
   * @param postId 动态ID
   * @returns 统计信息
   */
  static async getPostStatistics(postId: string): Promise<ApiResponse<{
    likeCount: number;
    commentCount: number;
    shareCount: number;
    viewCount: number;
    hotScore: number;
  }>> {
    return httpClient.get(`${API_BASE_PATH}/posts/${postId}/statistics`);
  }

  /**
   * 更新动态互动数据
   * 
   * @param postId 动态ID
   * @param action 操作类型
   * @returns 更新响应
   */
  static async updateInteraction(
    postId: string, 
    action: 'like' | 'unlike' | 'share' | 'view'
  ): Promise<ApiResponse<void>> {
    return httpClient.post<void>(`${API_BASE_PATH}/posts/${postId}/interaction`, {
      action,
    });
  }

  /**
   * 举报动态
   * 
   * @param postId 动态ID
   * @param reason 举报原因
   * @param description 描述
   * @returns 举报响应
   */
  static async reportPost(
    postId: string, 
    reason: string, 
    description?: string
  ): Promise<ApiResponse<void>> {
    return httpClient.post<void>(`${API_BASE_PATH}/posts/${postId}/report`, {
      reason,
      description,
    });
  }

  /**
   * 收藏动态
   * 
   * @param postId 动态ID
   * @returns 收藏响应
   */
  static async favoritePost(postId: string): Promise<ApiResponse<void>> {
    return httpClient.post<void>(`${API_BASE_PATH}/posts/${postId}/favorite`);
  }

  /**
   * 取消收藏动态
   * 
   * @param postId 动态ID
   * @returns 取消收藏响应
   */
  static async unfavoritePost(postId: string): Promise<ApiResponse<void>> {
    return httpClient.delete<void>(`${API_BASE_PATH}/posts/${postId}/favorite`);
  }

  /**
   * 获取收藏的动态列表
   * 
   * @param params 查询参数
   * @returns 收藏列表
   */
  static async getFavoritePosts(params: {
    pageNum?: number;
    pageSize?: number;
  } = {}): Promise<ApiResponse<PageResponse<PublishPostResponseDTO>>> {
    return httpClient.get<PageResponse<PublishPostResponseDTO>>(`${API_BASE_PATH}/favorites`, {
      params,
    });
  }

  /**
   * 获取动态评论
   * 
   * @param postId 动态ID
   * @param params 查询参数
   * @returns 评论列表
   */
  static async getPostComments(postId: string, params: {
    pageNum?: number;
    pageSize?: number;
    sortOrder?: 'latest' | 'hot';
  } = {}): Promise<ApiResponse<PageResponse<any>>> {
    return httpClient.get(`${API_BASE_PATH}/posts/${postId}/comments`, {
      params,
    });
  }

  /**
   * 添加评论
   * 
   * @param postId 动态ID
   * @param content 评论内容
   * @param parentId 父评论ID（可选）
   * @returns 评论响应
   */
  static async addComment(
    postId: string, 
    content: string, 
    parentId?: string
  ): Promise<ApiResponse<any>> {
    return httpClient.post(`${API_BASE_PATH}/posts/${postId}/comments`, {
      content,
      parentId,
    });
  }

  /**
   * 删除评论
   * 
   * @param postId 动态ID
   * @param commentId 评论ID
   * @returns 删除响应
   */
  static async deleteComment(postId: string, commentId: string): Promise<ApiResponse<void>> {
    return httpClient.delete(`${API_BASE_PATH}/posts/${postId}/comments/${commentId}`);
  }

  /**
   * 预览动态（不保存）
   * 
   * @param data 动态数据
   * @returns 预览数据
   */
  static async previewPost(data: PublishPostRequestDTO): Promise<ApiResponse<{
    previewUrl: string;
    estimatedReach: number;
    suggestedTags: string[];
    contentScore: number;
  }>> {
    return httpClient.post(`${API_BASE_PATH}/posts/preview`, data);
  }

  /**
   * 获取发布建议
   * 
   * @param data 部分动态数据
   * @returns 发布建议
   */
  static async getPublishSuggestions(data: Partial<PublishPostRequestDTO>): Promise<ApiResponse<{
    titleSuggestions: string[];
    tagSuggestions: string[];
    bestPublishTime: string;
    contentScore: number;
    improvements: string[];
  }>> {
    return httpClient.post(`${API_BASE_PATH}/posts/suggestions`, data);
  }

  /**
   * 获取动态模板
   * 
   * @param params 查询参数
   * @returns 模板列表
   */
  static async getPostTemplates(params: {
    category?: string;
    pageNum?: number;
    pageSize?: number;
  } = {}): Promise<ApiResponse<PageResponse<{
    id: string;
    name: string;
    description: string;
    template: Partial<PublishPostRequestDTO>;
    category: string;
    usageCount: number;
  }>>> {
    return httpClient.get(`${API_BASE_PATH}/templates`, {
      params,
    });
  }

  /**
   * 使用模板创建动态
   * 
   * @param templateId 模板ID
   * @param customData 自定义数据
   * @returns 创建的草稿
   */
  static async createFromTemplate(
    templateId: string, 
    customData?: Partial<PublishPostRequestDTO>
  ): Promise<ApiResponse<DraftSaveResponseDTO>> {
    return httpClient.post(`${API_BASE_PATH}/templates/${templateId}/create`, customData || {});
  }
}

// 默认导出
export default PublishPostApi;
