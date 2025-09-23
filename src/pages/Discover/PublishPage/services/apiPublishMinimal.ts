/**
 * 发布动态精简API接口 - 只包含前端实际需要的接口
 * 
 * 🎯 按需设计原则：严格按照前端页面功能需求设计API调用
 * ❌ 移除过度设计：批量操作、复杂统计、管理功能等前端不需要的接口
 */

import { httpClient } from '@/utils/http';
import type { ApiResponse, PageResponse } from '@/types/api';
import type {
  PublishPostRequestDTO,
  PublishPostResponseDTO,
  DraftSaveRequestDTO,
  DraftSaveResponseDTO,
  MediaUploadRequestDTO,
  MediaUploadResponseDTO,
  TopicSearchRequestDTO,
  TopicSearchResponseDTO,
  LocationSearchRequestDTO,
  LocationSearchResponseDTO,
} from '../types';

// API基础路径
const API_BASE_PATH = '/api/v1/publish';

/**
 * 发布动态API接口类 - 精简版
 * 
 * 🎯 只包含前端PublishPage、LocationSelectorDrawer、TopicSelectorPage实际需要的功能
 */
export class PublishPostApi {
  
  // ============ 核心发布功能 - 前端PublishPage实际需要 ============

  /**
   * 发布动态 - 前端发布按钮功能
   */
  static async publishPost(data: PublishPostRequestDTO): Promise<ApiResponse<PublishPostResponseDTO>> {
    return httpClient.post<PublishPostResponseDTO>(`${API_BASE_PATH}/posts`, data);
  }

  /**
   * 删除动态 - 前端删除功能
   */
  static async deletePost(postId: string): Promise<ApiResponse<void>> {
    return httpClient.delete<void>(`${API_BASE_PATH}/posts/${postId}`);
  }

  // ============ 草稿功能 - 前端DraftManager实际需要 ============

  /**
   * 保存草稿 - 前端自动保存功能
   */
  static async saveDraft(data: DraftSaveRequestDTO): Promise<ApiResponse<DraftSaveResponseDTO>> {
    return httpClient.post<DraftSaveResponseDTO>(`${API_BASE_PATH}/drafts`, data);
  }

  /**
   * 获取草稿详情 - 前端恢复草稿功能
   */
  static async getDraftDetail(draftId: string): Promise<ApiResponse<PublishPostRequestDTO>> {
    return httpClient.get<PublishPostRequestDTO>(`${API_BASE_PATH}/drafts/${draftId}`);
  }

  /**
   * 删除草稿 - 前端删除草稿功能
   */
  static async deleteDraft(draftId: string): Promise<ApiResponse<void>> {
    return httpClient.delete<void>(`${API_BASE_PATH}/drafts/${draftId}`);
  }

  // ============ 内容安全检测 - 前端ContentValidator实际需要 ============

  /**
   * 内容安全检测 - 前端发布前验证
   */
  static async checkContentSecurity(content: string): Promise<ApiResponse<boolean>> {
    return httpClient.post<boolean>(`${API_BASE_PATH}/security/content-check`, null, {
      params: { content },
    });
  }
}

/**
 * 媒体文件API接口类 - 精简版
 */
export class PublishMediaApi {
  
  // ============ 媒体管理功能 - 前端MediaManagerArea实际需要 ============

  /**
   * 上传媒体文件 - 前端媒体上传功能
   */
  static async uploadMedia(
    file: File, 
    options: Partial<MediaUploadRequestDTO> = {}
  ): Promise<ApiResponse<MediaUploadResponseDTO>> {
    const formData = new FormData();
    formData.append('file', file);
    
    // 添加其他参数
    Object.entries(options).forEach(([key, value]) => {
      if (value !== undefined) {
        formData.append(key, String(value));
      }
    });

    return httpClient.post<MediaUploadResponseDTO>(`${API_BASE_PATH}/media/upload`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  }

  /**
   * 删除媒体文件 - 前端删除媒体功能
   */
  static async deleteMedia(mediaId: string): Promise<ApiResponse<void>> {
    return httpClient.delete<void>(`${API_BASE_PATH}/media/${mediaId}`);
  }
}

/**
 * 话题API接口类 - 精简版
 */
export class PublishTopicApi {
  
  // ============ 话题搜索功能 - 前端TopicSelectorPage实际需要 ============

  /**
   * 搜索话题 - 前端话题搜索功能
   */
  static async searchTopics(params: {
    keyword: string;
    category?: string;
    limit?: number;
    offset?: number;
  }): Promise<ApiResponse<TopicSearchResponseDTO>> {
    const request: TopicSearchRequestDTO = {
      keyword: params.keyword,
      category: params.category,
      limit: params.limit || 20,
      offset: params.offset || 0,
      sortBy: 'hot',
    };

    return httpClient.get<TopicSearchResponseDTO>(`${API_BASE_PATH}/topics/search`, {
      params: request,
    });
  }

  /**
   * 获取热门话题 - 前端话题推荐功能
   */
  static async getHotTopics(params: {
    pageNum?: number;
    pageSize?: number;
  } = {}): Promise<ApiResponse<PageResponse<TopicSearchResponseDTO.TopicItemDTO>>> {
    return httpClient.get<PageResponse<TopicSearchResponseDTO.TopicItemDTO>>(`${API_BASE_PATH}/topics/hot`, {
      params: {
        pageNum: params.pageNum || 1,
        pageSize: params.pageSize || 20,
      },
    });
  }
}

/**
 * 地点API接口类 - 精简版
 */
export class PublishLocationApi {
  
  // ============ 地点搜索功能 - 前端LocationSelectorDrawer实际需要 ============

  /**
   * 搜索地点 - 前端地点搜索功能
   */
  static async searchLocations(params: {
    keyword: string;
    latitude?: number;
    longitude?: number;
    radius?: number;
    limit?: number;
  }): Promise<ApiResponse<LocationSearchResponseDTO>> {
    const request: LocationSearchRequestDTO = {
      keyword: params.keyword,
      latitude: params.latitude,
      longitude: params.longitude,
      radius: params.radius || 5000,
      limit: params.limit || 20,
    };

    return httpClient.get<LocationSearchResponseDTO>(`${API_BASE_PATH}/locations/search`, {
      params: request,
    });
  }

  /**
   * 获取周边地点 - 前端GPS定位功能
   */
  static async getNearbyLocations(params: {
    latitude: number;
    longitude: number;
    radius?: number;
    limit?: number;
  }): Promise<ApiResponse<LocationSearchResponseDTO>> {
    return httpClient.get<LocationSearchResponseDTO>(`${API_BASE_PATH}/locations/nearby`, {
      params: {
        latitude: params.latitude,
        longitude: params.longitude,
        radius: params.radius || 5000,
        limit: params.limit || 20,
      },
    });
  }
}

// ============ 统一导出 ============

/**
 * 发布系统完整API - 所有精简后的API接口
 */
export const PublishApi = {
  // 动态发布
  publishPost: PublishPostApi.publishPost,
  deletePost: PublishPostApi.deletePost,
  
  // 草稿管理
  saveDraft: PublishPostApi.saveDraft,
  getDraftDetail: PublishPostApi.getDraftDetail,
  deleteDraft: PublishPostApi.deleteDraft,
  
  // 安全检测
  checkContentSecurity: PublishPostApi.checkContentSecurity,
  
  // 媒体管理
  uploadMedia: PublishMediaApi.uploadMedia,
  deleteMedia: PublishMediaApi.deleteMedia,
  
  // 话题功能
  searchTopics: PublishTopicApi.searchTopics,
  getHotTopics: PublishTopicApi.getHotTopics,
  
  // 地点功能
  searchLocations: PublishLocationApi.searchLocations,
  getNearbyLocations: PublishLocationApi.getNearbyLocations,
};

// 默认导出
export default PublishApi;

// ============ 🚫 已移除的过度设计接口 ============
/*
 * 以下接口已移除，因为前端实际不需要：
 * 
 * ❌ 复杂查询接口：
 *    - queryPosts() - 前端发布页面不需要查询动态列表
 *    - getPostDetail() - 前端发布页面不需要查看动态详情
 *    - advancedSearch() - 前端搜索功能简单
 * 
 * ❌ 批量操作接口：
 *    - batchOperation() - 前端没有批量删除功能
 *    - batchUploadMedia() - 前端没有批量上传功能
 * 
 * ❌ 统计分析接口：
 *    - getUserStatistics() - 前端没有统计页面
 *    - getPostStatistics() - 前端没有数据分析功能
 *    - getHotContent() - 前端没有热门内容展示
 * 
 * ❌ 社交功能接口：
 *    - updateInteraction() - 前端发布页面不需要点赞分享
 *    - getPostComments() - 前端发布页面不需要评论功能
 *    - addComment() - 前端发布页面不需要评论功能
 *    - favoritePost() - 前端发布页面不需要收藏功能
 * 
 * ❌ 高级功能接口：
 *    - previewPost() - 前端没有预览功能
 *    - getPublishSuggestions() - 前端没有发布建议功能
 *    - getPostTemplates() - 前端没有模板功能
 *    - createFromTemplate() - 前端没有模板创建功能
 * 
 * ❌ 管理功能接口：
 *    - reportPost() - 前端发布页面不需要举报功能
 *    - auditContent() - 前端不是管理后台
 * 
 * 🎯 精简后的接口总数：12个核心接口
 *    vs 原设计的35+个接口（减少65%以上）
 * 
 * ✅ 保留的核心功能与前端页面对应：
 * 
 * 📱 PublishPage 主页面：
 *    - publishPost() - 发布按钮
 *    - deletePost() - 删除功能  
 *    - checkContentSecurity() - 内容验证
 * 
 * 💾 DraftManager 草稿管理：
 *    - saveDraft() - 自动保存
 *    - getDraftDetail() - 恢复草稿
 *    - deleteDraft() - 删除草稿
 * 
 * 🖼️ MediaManagerArea 媒体管理：
 *    - uploadMedia() - 上传图片/视频
 *    - deleteMedia() - 删除媒体文件
 * 
 * 🏷️ TopicSelectorPage 话题选择：
 *    - searchTopics() - 搜索话题
 *    - getHotTopics() - 热门推荐
 * 
 * 📍 LocationSelectorDrawer 地点选择：
 *    - searchLocations() - 搜索地点
 *    - getNearbyLocations() - GPS定位
 */
