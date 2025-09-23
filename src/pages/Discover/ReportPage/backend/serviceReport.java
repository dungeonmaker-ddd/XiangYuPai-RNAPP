// #region 1. File Banner & TOC
/**
 * Report Service - 举报业务服务接口 (精简版)
 * 
 * 只定义前端实际需要的核心业务方法
 * 避免过度设计，专注于实际需求
 */
// #endregion

// #region 2. Imports
package com.xiangyupai.service;

import com.baomidou.mybatisplus.extension.service.IService;
import com.xiangyupai.dto.ReportSubmitDTO;
import com.xiangyupai.entity.Report;
// #endregion

// #region 3. Service Interface Definition
/**
 * 举报业务服务接口 - 精简版
 * 只包含前端举报功能必需的方法
 * 
 * @author System Generated
 * @since 2024-01-01
 */
public interface ReportService extends IService<Report> {

    // #region 4. 核心业务方法 - 前端必需
    /**
     * 提交举报 - 前端唯一需要的核心方法
     * 
     * @param submitDTO 举报提交数据
     * @param reporterUserId 举报用户ID
     * @param ipAddress 客户端IP地址
     * @param userAgent 用户代理信息
     * @return 举报ID
     */
    Long submitReport(ReportSubmitDTO submitDTO, Long reporterUserId, String ipAddress, String userAgent);

    /**
     * 验证举报提交数据 - 内部使用
     * 
     * @param submitDTO 举报提交数据
     * @param reporterUserId 举报用户ID
     * @return 验证结果消息，null表示验证通过
     */
    String validateReportSubmission(ReportSubmitDTO submitDTO, Long reporterUserId);

    /**
     * 检查是否重复举报 - 内部使用
     * 
     * @param targetId 被举报目标ID
     * @param targetType 被举报目标类型
     * @param reporterUserId 举报用户ID
     * @return 是否重复举报
     */
    boolean isDuplicateReport(String targetId, String targetType, Long reporterUserId);
    // #endregion
}
// #endregion
