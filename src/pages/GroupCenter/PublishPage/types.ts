/**
 * 🎯 组局发布功能 - 类型定义
 * 
 * 基于架构设计文档的完整类型系统
 */

// ══════════════════════════════════════════════════════════════
// 1. 活动类型相关
// ══════════════════════════════════════════════════════════════

/** 活动类型枚举 */
export enum ActivityType {
  EXPLORE = 'explore',     // 探店
  PRIVATE_CINEMA = 'cinema', // 私影
  BILLIARDS = 'billiards', // 台球
  KARAOKE = 'karaoke',     // K歌
  DRINKING = 'drinking',   // 喝酒
  MASSAGE = 'massage',     // 按摩
}

/** 活动类型配置 */
export interface ActivityTypeConfig {
  id: ActivityType;
  name: string;
  icon: string;
  color: string;
  bgColor: string;
  emoji: string;
}

// ══════════════════════════════════════════════════════════════
// 2. 表单输入相关
// ══════════════════════════════════════════════════════════════

/** 表单验证状态 */
export interface ValidationState {
  isValid: boolean;
  error?: string;
  warning?: string;
}

/** 标题输入状态 */
export interface TitleInputState {
  value: string;
  validation: ValidationState;
  characterCount: number;
  maxLength: number;
}

/** 正文输入状态 */
export interface ContentInputState {
  value: string;
  validation: ValidationState;
  characterCount: number;
  maxLength: number;
  height?: number; // 自适应高度
}

/** 系数项配置 */
export interface ParameterConfig {
  [key: string]: any;
  // 可扩展的参数配置
}

// ══════════════════════════════════════════════════════════════
// 3. 约定项设置相关
// ══════════════════════════════════════════════════════════════

/** 时间设置 */
export interface TimeSettings {
  startDate: Date;
  startTime: string;
  endTime?: string;
  duration?: number; // 持续时间（分钟）
  isValid: boolean;
}

/** 地点设置 */
export interface LocationSettings {
  address: string;
  latitude?: number;
  longitude?: number;
  detailAddress?: string;
  isCurrentLocation: boolean;
  isValid: boolean;
}

/** 定价设置 */
export interface PricingSettings {
  amount: number;
  currency: 'coin' | 'rmb'; // 金币或人民币
  billingType: 'hourly' | 'per_person' | 'fixed'; // 计费方式
  paymentMethod: 'prepaid' | 'on_site' | 'installment'; // 支付方式
  isValid: boolean;
}

/** 人数设置 */
export interface ParticipantSettings {
  maxCount: number;
  minCount?: number;
  genderRatio?: {
    male?: number;
    female?: number;
    unlimited: boolean;
  };
  ageLimit?: {
    min?: number;
    max?: number;
    unlimited: boolean;
  };
  isValid: boolean;
}

/** 报名截止时间设置 */
export interface DeadlineSettings {
  deadline: Date;
  quickOption?: '1hour' | '6hours' | '1day'; // 快速选择选项
  isValid: boolean;
}

/** 约定项完整设置 */
export interface AgreementSettings {
  time: TimeSettings;
  location: LocationSettings;
  pricing: PricingSettings;
  participants: ParticipantSettings;
  deadline: DeadlineSettings;
}

// ══════════════════════════════════════════════════════════════
// 4. 支付相关
// ══════════════════════════════════════════════════════════════

/** 支付方式 */
export enum PaymentMethod {
  COIN = 'coin',           // 金币支付
  WECHAT = 'wechat',       // 微信支付
  ALIPAY = 'alipay',       // 支付宝
  BANK_CARD = 'bank_card', // 银行卡
}

/** 费用明细 */
export interface FeeBreakdown {
  baseFee: number;      // 基础费用
  serviceFee: number;   // 平台服务费
  discount?: number;    // 优惠减免
  total: number;        // 总计
}

/** 支付状态 */
export enum PaymentStatus {
  IDLE = 'idle',           // 空闲
  PROCESSING = 'processing', // 处理中
  SUCCESS = 'success',     // 成功
  FAILED = 'failed',       // 失败
  CANCELLED = 'cancelled', // 取消
}

/** 支付信息 */
export interface PaymentInfo {
  amount: number;
  currency: 'coin' | 'rmb';
  method: PaymentMethod;
  feeBreakdown: FeeBreakdown;
  userBalance: number;
  status: PaymentStatus;
  transactionId?: string;
}

// ══════════════════════════════════════════════════════════════
// 5. 发布状态管理
// ══════════════════════════════════════════════════════════════

/** 发布步骤 */
export enum PublishStep {
  TYPE_SELECTION = 'type_selection',     // 类型选择
  FORM_INPUT = 'form_input',            // 表单填写
  AGREEMENT_SETUP = 'agreement_setup',   // 约定项设置
  PAYMENT_CONFIRM = 'payment_confirm',   // 支付确认
  PUBLISHING = 'publishing',            // 发布中
  COMPLETED = 'completed',              // 完成
}

/** 表单验证结果 */
export interface FormValidation {
  activityType: ValidationState;
  title: ValidationState;
  content: ValidationState;
  parameters: ValidationState;
  agreement: {
    time: ValidationState;
    location: ValidationState;
    pricing: ValidationState;
    participants: ValidationState;
    deadline: ValidationState;
    overall: ValidationState;
  };
  overall: ValidationState;
}

/** 发布状态 */
export interface PublishState {
  // 当前步骤
  currentStep: PublishStep;
  
  // 表单数据
  selectedActivityType?: ActivityType;
  title: TitleInputState;
  content: ContentInputState;
  parameters: ParameterConfig;
  agreement: AgreementSettings;
  
  // 验证状态
  validation: FormValidation;
  
  // 支付相关
  paymentInfo?: PaymentInfo;
  showPaymentModal: boolean;
  
  // 状态标识
  isLoading: boolean;
  isSubmitting: boolean;
  isDraftSaving: boolean;
  
  // 错误处理
  error?: string;
  
  // 草稿相关
  hasDraft: boolean;
  draftId?: string;
}

// ══════════════════════════════════════════════════════════════
// 6. 组件Props接口
// ══════════════════════════════════════════════════════════════

/** 活动类型选择器Props */
export interface ActivityTypeSelectorProps {
  selectedType?: ActivityType;
  onTypeSelect: (type: ActivityType) => void;
  validation?: ValidationState;
}

/** 发布表单Props */
export interface PublishFormProps {
  title: TitleInputState;
  content: ContentInputState;
  parameters: ParameterConfig;
  onTitleChange: (value: string) => void;
  onContentChange: (value: string) => void;
  onParametersChange: (params: ParameterConfig) => void;
}

/** 约定项设置Props */
export interface AgreementSettingsProps {
  settings: AgreementSettings;
  onSettingsChange: (settings: Partial<AgreementSettings>) => void;
  validation: FormValidation['agreement'];
}

/** 支付弹窗Props */
export interface PaymentModalProps {
  visible: boolean;
  paymentInfo: PaymentInfo;
  onPaymentConfirm: () => void;
  onPaymentCancel: () => void;
  onClose: () => void;
}

/** 主发布页面Props */
export interface PublishGroupScreenProps {
  navigation?: any;
  route?: any;
}

// ══════════════════════════════════════════════════════════════
// 7. API相关接口
// ══════════════════════════════════════════════════════════════

/** 发布请求数据 */
export interface PublishRequest {
  activityType: ActivityType;
  title: string;
  content: string;
  parameters?: ParameterConfig;
  agreement: AgreementSettings;
  paymentTransactionId?: string;
}

/** 发布响应数据 */
export interface PublishResponse {
  success: boolean;
  groupId?: string;
  message?: string;
  error?: string;
}

/** 草稿数据 */
export interface DraftData {
  id: string;
  data: Partial<PublishRequest>;
  createdAt: Date;
  updatedAt: Date;
}

// ══════════════════════════════════════════════════════════════
// 8. 工具类型
// ══════════════════════════════════════════════════════════════

/** 弹窗类型 */
export type ModalType = 
  | 'time_picker'
  | 'location_picker' 
  | 'pricing_setup'
  | 'participant_setup'
  | 'deadline_picker'
  | 'payment_confirm';

/** 快速时间选项 */
export type QuickTimeOption = '1hour' | '6hours' | '1day';

/** 性别筛选 */
export type GenderOption = 'unlimited' | 'male' | 'female';

/** 货币类型 */
export type CurrencyType = 'coin' | 'rmb';

/** 计费类型 */
export type BillingType = 'hourly' | 'per_person' | 'fixed';

/** 支付方式类型 */
export type PaymentMethodType = 'prepaid' | 'on_site' | 'installment';
