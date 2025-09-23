// #region 1. File Banner & TOC
/**
 * ReportResponse DTO - 举报响应数据传输对象
 * 
 * 用于返回给前端的举报处理结果
 * 包含成功状态、举报ID和消息信息
 */
// #endregion

// #region 2. Imports
package com.xiangyupai.dto;

import lombok.Data;
import lombok.experimental.Accessors;

import java.io.Serializable;
import java.time.LocalDateTime;
import java.util.Map;
// #endregion

// #region 3. DTO Definition
/**
 * 举报响应DTO
 * 
 * @author System Generated
 * @since 2024-01-01
 */
@Data
@Accessors(chain = true)
public class ReportResponseDTO implements Serializable {

    private static final long serialVersionUID = 1L;

    /**
     * 操作是否成功
     */
    private Boolean success;

    /**
     * 举报ID (成功时返回)
     */
    private Long reportId;

    /**
     * 响应消息
     */
    private String message;

    /**
     * 错误详情 (失败时返回)
     */
    private Map<String, String[]> errors;

    /**
     * 处理时间
     */
    private LocalDateTime timestamp;

    /**
     * 响应码
     */
    private String code;

    /**
     * 创建成功响应
     */
    public static ReportResponseDTO success(Long reportId, String message) {
        return new ReportResponseDTO()
                .setSuccess(true)
                .setReportId(reportId)
                .setMessage(message)
                .setTimestamp(LocalDateTime.now())
                .setCode("SUCCESS");
    }

    /**
     * 创建失败响应
     */
    public static ReportResponseDTO failure(String message, Map<String, String[]> errors) {
        return new ReportResponseDTO()
                .setSuccess(false)
                .setMessage(message)
                .setErrors(errors)
                .setTimestamp(LocalDateTime.now())
                .setCode("FAILURE");
    }

    /**
     * 创建验证失败响应
     */
    public static ReportResponseDTO validationError(String message, Map<String, String[]> errors) {
        return new ReportResponseDTO()
                .setSuccess(false)
                .setMessage(message)
                .setErrors(errors)
                .setTimestamp(LocalDateTime.now())
                .setCode("VALIDATION_ERROR");
    }
}
// #endregion
