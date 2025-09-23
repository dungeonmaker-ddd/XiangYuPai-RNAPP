/**
 * 话题详情业务服务接口 - 只定义前端需要的核心业务方法
 * 
 * 核心方法：
 * 1. 获取话题信息
 * 2. 获取话题动态列表（分页）
 * 3. 点赞/取消点赞动态
 * 
 * 设计原则：最小化接口，避免过度设计
 */

// #region 1. Imports
package com.xiangyupai.pages.discover.topicdetail.service;

import com.xiangyupai.pages.discover.topicdetail.dto.*;
import com.xiangyupai.pages.discover.topicdetail.vo.TopicPostQueryVO;

import java.util.List;
import java.util.Map;
import java.util.concurrent.CompletableFuture;
// #endregion

// #region 2. Service Interface Definition

/**
 * 话题详情业务服务接口
 * 
 * 只定义前端实际需要的3个核心业务方法：
 * - 话题信息查询
 * - 话题动态列表查询（分页）
 * - 动态点赞操作
 */
public interface TopicDetailService {
// #endregion

// #region 3. Core Business Methods - 只保留前端实际需要的3个核心方法

    /**
     * 获取话题基本信息
     * 
     * @param request 获取话题信息请求
     * @return 话题详细信息
     */
    GetTopicInfoResponseDTO getTopicInfo(GetTopicInfoRequestDTO request);

    /**
     * 获取话题动态列表（分页）
     * 
     * @param request 获取话题动态列表请求
     * @return 分页的动态列表响应
     */
    GetTopicPostsResponseDTO getTopicPosts(GetTopicPostsRequestDTO request);

    /**
     * 点赞/取消点赞动态
     * 
     * @param request 点赞请求
     * @return 点赞结果
     */
    LikeTopicPostResponseDTO likePost(LikeTopicPostRequestDTO request);

// #endregion

    // 删除了大量过度设计的方法
    // 前端只需要这3个核心方法即可满足话题详情页面的所有需求
}
