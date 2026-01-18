// 常量定义
/**
 * 应用配置常量
 */
export const APP_CONFIG = {
  TITLE: import.meta.env.VITE_APP_TITLE || '高校自习室智能预约平台',
  VERSION: import.meta.env.VITE_APP_VERSION || '1.0.0',
  
  // API配置
  API_BASE_URL: import.meta.env.VITE_API_BASE_URL || '/api',
  WS_BASE_URL: import.meta.env.VITE_WS_BASE_URL || '/ws',
  REQUEST_TIMEOUT: parseInt(import.meta.env.VITE_REQUEST_TIMEOUT || '10000'),
  
  // 功能开关
  ENABLE_MOCK: import.meta.env.VITE_ENABLE_MOCK === 'true',
  ENABLE_DEBUG: import.meta.env.VITE_ENABLE_DEBUG === 'true',
  
  // 页面配置
  PAGE_SIZE: parseInt(import.meta.env.VITE_PAGE_SIZE || '20'),
  MAX_RESERVATION_HOURS: parseInt(import.meta.env.VITE_MAX_RESERVATION_HOURS || '4'),
  
  // 缓存配置
  TOKEN_KEY: 'access_token',
  USER_INFO_KEY: 'user_info',
  THEME_KEY: 'theme',
  LANGUAGE_KEY: 'language'
}

/**
 * 业务规则常量
 */
export const BUSINESS_RULES = {
  // 预约规则
  MAX_RESERVATION_PER_DAY: 3, // 每人每天最多预约次数
  MAX_FUTURE_DAYS: 7, // 最多可预约未来天数
  MIN_RESERVATION_MINUTES: 30, // 最短预约时长（分钟）
  MAX_RESERVATION_MINUTES: 240, // 最长预约时长（分钟）
  
  // 签到规则
  CHECK_IN_EARLY_MINUTES: 15, // 可提前签到分钟数
  CHECK_IN_LATE_MINUTES: 30, // 可迟到签到分钟数
  AUTO_CANCEL_MINUTES: 30, // 预约未签到自动取消时间
  
  // 暂时离开规则
  TEMP_LEAVE_MAX_MINUTES: 30, // 暂时离开最长时间
  TEMP_LEAVE_ALLOWED_TIMES: 2, // 每场预约允许暂时离开次数
  
  // 违规规则
  NO_SHOW_PENALTY: -10, // 预约未到扣分
  LATE_CHECK_IN_PENALTY: -5, // 迟到扣分
  EXCEED_TIME_PENALTY: -5, // 超时使用扣分
  CREDIT_SCORE_MIN: 0, // 最低信用分
  CREDIT_SCORE_MAX: 100, // 最高信用分
  CREDIT_SCORE_LOW_THRESHOLD: 60 // 低信用分阈值
}

/**
 * 时间常量
 */
export const TIME_CONSTANTS = {
  // 时间格式
  DATE_FORMAT: 'YYYY-MM-DD',
  TIME_FORMAT: 'HH:mm',
  DATETIME_FORMAT: 'YYYY-MM-DD HH:mm:ss',
  
  // 时间段
  DAY_START_TIME: '08:00',
  DAY_END_TIME: '22:00',
  NIGHT_START_TIME: '22:00',
  NIGHT_END_TIME: '08:00',
  
  // 星期
  WEEKDAYS: ['周日', '周一', '周二', '周三', '周四', '周五', '周六'],
  WEEKDAYS_SHORT: ['日', '一', '二', '三', '四', '五', '六']
}

/**
 * 座位相关常量
 */
export const SEAT_CONSTANTS = {
  // 座位状态颜色
  STATUS_COLORS: {
    available: '#67C23A', // 可用 - 绿色
    occupied: '#F56C6C', // 占用中 - 红色
    reserved: '#E6A23C', // 已预约 - 橙色
    temp_leave: '#409EFF', // 暂时离开 - 蓝色
    maintenance: '#909399', // 维修中 - 灰色
    disabled: '#DCDFE6' // 已禁用 - 浅灰
  },
  
  // 座位状态文本
  STATUS_TEXTS: {
    available: '可用',
    occupied: '占用中',
    reserved: '已预约',
    temp_leave: '暂时离开',
    maintenance: '维修中',
    disabled: '已禁用'
  },
  
  // 座位类型图标
  TYPE_ICONS: {
    standard: 'icon-seat-standard',
    window: 'icon-seat-window',
    power: 'icon-seat-power',
    large: 'icon-seat-large',
    silent: 'icon-seat-silent',
    group: 'icon-seat-group'
  },
  
  // 座位类型文本
  TYPE_TEXTS: {
    standard: '标准座位',
    window: '靠窗座位',
    power: '有电源座位',
    large: '宽敞座位',
    silent: '静音区座位',
    group: '小组讨论座位'
  }
}

/**
 * 预约相关常量
 */
export const RESERVATION_CONSTANTS = {
  // 预约状态颜色
  STATUS_COLORS: {
    pending: '#E6A23C', // 待开始 - 橙色
    checked_in: '#67C23A', // 已签到 - 绿色
    checked_out: '#409EFF', // 已签退 - 蓝色
    cancelled: '#909399', // 已取消 - 灰色
    expired: '#F56C6C', // 已过期 - 红色
    violated: '#F56C6C' // 违规 - 红色
  },
  
  // 预约状态文本
  STATUS_TEXTS: {
    pending: '待开始',
    checked_in: '使用中',
    checked_out: '已结束',
    cancelled: '已取消',
    expired: '已过期',
    violated: '违规'
  },
  
  // 签到方式文本
  CHECK_IN_METHOD_TEXTS: {
    qr_code: '扫码签到',
    face_recognition: '人脸识别',
    manual: '手动签到'
  },
  
  // 违规类型文本
  VIOLATION_TYPE_TEXTS: {
    no_show: '预约未到',
    late_check_in: '迟到',
    late_check_out: '晚退',
    early_check_out: '早退',
    exceed_time: '超时使用',
    illegal_occupy: '非法占用'
  }
}

/**
 * 路由常量
 */
export const ROUTE_PATHS = {
  // 学生端路由
  STUDENT: {
    HOME: '/',
    LOGIN: '/login',
    REGISTER: '/register',
    ROOM_DETAIL: '/room/:id',
    MY_RESERVATIONS: '/my-reservations',
    PROFILE: '/profile',
    CHECK_IN: '/check-in'
  },
  
  // 管理端路由
  ADMIN: {
    DASHBOARD: '/admin/dashboard',
    ROOMS: '/admin/rooms',
    USERS: '/admin/users',
    STATISTICS: '/admin/statistics',
    SETTINGS: '/admin/settings',
    ANNOUNCEMENTS: '/admin/announcements'
  }
}

/**
 * 本地存储键名
 */
export const STORAGE_KEYS = {
  AUTH_TOKEN: 'study_room_auth_token',
  USER_INFO: 'study_room_user_info',
  THEME_MODE: 'study_room_theme_mode',
  LANGUAGE: 'study_room_language',
  LAST_VISITED_ROOM: 'study_room_last_visited_room'
}

/**
 * 错误消息常量
 */
export const ERROR_MESSAGES = {
  NETWORK_ERROR: '网络连接异常，请检查网络设置',
  SERVER_ERROR: '服务器内部错误，请稍后重试',
  TIMEOUT_ERROR: '请求超时，请检查网络连接',
  AUTH_EXPIRED: '登录已过期，请重新登录',
  NO_PERMISSION: '没有操作权限',
  NOT_FOUND: '请求的资源不存在',
  PARAM_ERROR: '参数错误',
  OPERATION_FAILED: '操作失败，请稍后重试'
}