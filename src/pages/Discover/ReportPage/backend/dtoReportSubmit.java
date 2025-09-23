// #region 1. File Banner & TOC
/**
 * ReportSubmit DTO - 举报提交数据传输对象
 * 
 * 用于前端提交举报信息时的数据传输
 * 与前端ReportFormData保持一致的数据结构
 */
// #endregion

// #region 2. Imports
package com.xiangyupai.dto;

import lombok.Data;
import lombok.experimental.Accessors;

import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;
import java.io.Serializable;
import java.util.List;
// #endregion

// #region 3. DTO Definition
/**
 * 举报提交请求DTO
 * 
 * @author System Generated
 * @since 2024-01-01
 */
@Data
@Accessors(chain = true)
public class ReportSubmitDTO implements Serializable {

    private static final long serialVersionUID = 1L;

    /**
     * 被举报目标ID
     */
    @NotBlank(message = "被举报目标ID不能为空")
    private String targetId;

    /**
     * 被举报目标类型 (post/user/comment)
     */
    @NotBlank(message = "被举报目标类型不能为空")
    private String targetType;

    /**
     * 举报类型 (harassment/inappropriate/fraud/illegal/fake_info/minors/disturbing/other)
     */
    @NotBlank(message = "举报类型不能为空")
    private String reportType;

    /**
     * 举报描述
     */
    @Size(max = 200, message = "举报描述不能超过200字符")
    private String description;

    /**
     * 举报图片URL列表
     */
    @Size(max = 3, message = "最多只能上传3张图片")
    private List<String> images;

    /**
     * 举报上下文信息
     */
    private String reportContext;

    /**
     * 设备信息
     */
    private DeviceInfo deviceInfo;

    /**
     * 设备信息内部类
     */
    @Data
    @Accessors(chain = true)
    public static class DeviceInfo implements Serializable {
        
        private static final long serialVersionUID = 1L;

        /**
         * 平台类型 (iOS/Android/Web)
         */
        private String platform;

        /**
         * 应用版本
         */
        private String version;

        /**
         * 系统版本
         */
        private String systemVersion;

        /**
         * 设备型号
         */
        private String deviceModel;

        /**
         * 提交时间戳
         */
        private Long timestamp;
    }
}
// #endregion
