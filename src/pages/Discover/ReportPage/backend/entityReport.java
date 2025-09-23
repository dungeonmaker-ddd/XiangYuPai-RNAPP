// #region 1. File Banner & TOC
/**
 * Report Entity - 举报数据实体类
 * 
 * MyBatis-Plus实体类，映射t_report表
 * 包含举报信息的完整数据结构定义
 */
// #endregion

// #region 2. Imports
package com.xiangyupai.entity;

import com.baomidou.mybatisplus.annotation.*;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.experimental.Accessors;

import java.io.Serializable;
import java.time.LocalDateTime;
// #endregion

// #region 3. Entity Definition
/**
 * 举报信息实体类
 * 
 * @author System Generated
 * @since 2024-01-01
 */
@Data
@EqualsAndHashCode(callSuper = false)
@Accessors(chain = true)
@TableName("t_report")
public class Report implements Serializable {

    private static final long serialVersionUID = 1L;

    /**
     * 举报ID - 主键
     */
    @TableId(value = "id", type = IdType.ASSIGN_ID)
    private Long id;

    /**
     * 举报用户ID
     */
    @TableField("reporter_user_id")
    private Long reporterUserId;

    /**
     * 被举报目标ID
     */
    @TableField("target_id")
    private String targetId;

    /**
     * 被举报目标类型 (post/user/comment)
     */
    @TableField("target_type")
    private String targetType;

    /**
     * 举报类型 (harassment/inappropriate/fraud/illegal/fake_info/minors/disturbing/other)
     */
    @TableField("report_type")
    private String reportType;

    /**
     * 举报描述
     */
    @TableField("description")
    private String description;

    /**
     * 举报图片 (JSON数组格式存储)
     */
    @TableField("images")
    private String images;

    /**
     * 举报上下文 (来源页面信息)
     */
    @TableField("report_context")
    private String reportContext;

    /**
     * 处理状态 (pending/processing/resolved/rejected)
     */
    @TableField("status")
    private String status;

    /**
     * 处理结果说明
     */
    @TableField("resolution_note")
    private String resolutionNote;

    /**
     * 处理人员ID
     */
    @TableField("handler_user_id")
    private Long handlerUserId;

    /**
     * 处理时间
     */
    @TableField("handled_at")
    private LocalDateTime handledAt;

    /**
     * 设备信息 (JSON格式存储)
     */
    @TableField("device_info")
    private String deviceInfo;

    /**
     * IP地址
     */
    @TableField("ip_address")
    private String ipAddress;

    /**
     * 用户代理信息
     */
    @TableField("user_agent")
    private String userAgent;

    /**
     * 创建时间
     */
    @TableField(value = "created_at", fill = FieldFill.INSERT)
    private LocalDateTime createdAt;

    /**
     * 更新时间
     */
    @TableField(value = "updated_at", fill = FieldFill.INSERT_UPDATE)
    private LocalDateTime updatedAt;

    /**
     * 逻辑删除标识 (0:未删除 1:已删除)
     */
    @TableLogic
    @TableField("deleted")
    private Integer deleted;

    /**
     * 乐观锁版本号
     */
    @Version
    @TableField("version")
    private Integer version;
}
// #endregion
