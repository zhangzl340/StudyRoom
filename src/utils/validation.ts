// 表单验证
/**
 * 验证用户名格式
 * 规则：4-20位字母、数字、下划线，字母开头
 */
export const validateUsername = (username: string): boolean => {
  const reg = /^[a-zA-Z][a-zA-Z0-9_]{3,19}$/
  return reg.test(username)
}

/**
 * 验证密码强度
 * 规则：8-20位，至少包含字母和数字
 */
export const validatePassword = (password: string): boolean => {
  const reg = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*#?&]{8,20}$/
  return reg.test(password)
}

/**
 * 验证邮箱格式
 */
export const validateEmail = (email: string): boolean => {
  const reg = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
  return reg.test(email)
}

/**
 * 验证手机号格式
 */
export const validatePhone = (phone: string): boolean => {
  const reg = /^1[3-9]\d{9}$/
  return reg.test(phone)
}

/**
 * 验证学号格式
 * 规则：10-15位数字
 */
export const validateStudentId = (studentId: string): boolean => {
  const reg = /^\d{10,15}$/
  return reg.test(studentId)
}

/**
 * 验证身份证号格式
 */
export const validateIdCard = (idCard: string): boolean => {
  const reg = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/
  return reg.test(idCard)
}

/**
 * 验证时间格式（HH:mm）
 */
export const validateTime = (time: string): boolean => {
  const reg = /^([01]\d|2[0-3]):([0-5]\d)$/
  return reg.test(time)
}

/**
 * 验证时间段（结束时间晚于开始时间）
 */
export const validateTimeRange = (startTime: string, endTime: string): boolean => {
  if (!validateTime(startTime) || !validateTime(endTime)) {
    return false
  }
  
  const start = new Date(`2000-01-01 ${startTime}`)
  const end = new Date(`2000-01-01 ${endTime}`)
  
  return end > start
}

/**
 * 验证预约时长（不超过最大时长）
 */
export const validateReservationDuration = (
  startTime: Date,
  endTime: Date,
  maxHours: number = 4
): boolean => {
  const durationMs = endTime.getTime() - startTime.getTime()
  const durationHours = durationMs / (1000 * 60 * 60)
  
  return durationHours <= maxHours && durationHours > 0
}

/**
 * 验证是否为正整数
 */
export const validatePositiveInteger = (value: string | number): boolean => {
  const num = Number(value)
  return Number.isInteger(num) && num > 0
}

/**
 * 验证是否为非负整数
 */
export const validateNonNegativeInteger = (value: string | number): boolean => {
  const num = Number(value)
  return Number.isInteger(num) && num >= 0
}

/**
 * 验证字符串长度
 */
export const validateLength = (
  str: string,
  min: number = 1,
  max: number = 255
): boolean => {
  const length = str.trim().length
  return length >= min && length <= max
}

/**
 * 获取验证错误消息
 */
export const getValidationMessage = (type: string): string => {
  const messages: Record<string, string> = {
    username: '用户名格式不正确（4-20位字母、数字、下划线，字母开头）',
    password: '密码格式不正确（8-20位，至少包含字母和数字）',
    email: '邮箱格式不正确',
    phone: '手机号格式不正确',
    studentId: '学号格式不正确（10-15位数字）',
    idCard: '身份证号格式不正确',
    time: '时间格式不正确（HH:mm）',
    required: '此项为必填项',
    maxLength: '输入内容过长',
    minLength: '输入内容过短',
    number: '请输入数字',
    integer: '请输入整数',
    positive: '请输入正数',
    timeRange: '结束时间必须晚于开始时间',
    duration: '预约时长超过限制'
  }
  
  return messages[type] || '格式不正确'
}

/**
 * 表单验证器
 */
export class Validator {
  private errors: Record<string, string> = {}
  
  constructor(private data: Record<string, any>) {}
  
  /**
   * 验证必填字段
   */
  required(field: string, message?: string): this {
    if (!this.data[field] || this.data[field].toString().trim() === '') {
      this.errors[field] = message || getValidationMessage('required')
    }
    return this
  }
  
  /**
   * 验证用户名
   */
  username(field: string, message?: string): this {
    if (this.data[field] && !validateUsername(this.data[field])) {
      this.errors[field] = message || getValidationMessage('username')
    }
    return this
  }
  
  /**
   * 验证密码
   */
  password(field: string, message?: string): this {
    if (this.data[field] && !validatePassword(this.data[field])) {
      this.errors[field] = message || getValidationMessage('password')
    }
    return this
  }
  
  /**
   * 验证邮箱
   */
  email(field: string, message?: string): this {
    if (this.data[field] && !validateEmail(this.data[field])) {
      this.errors[field] = message || getValidationMessage('email')
    }
    return this
  }
  
  /**
   * 验证手机号
   */
  phone(field: string, message?: string): this {
    if (this.data[field] && !validatePhone(this.data[field])) {
      this.errors[field] = message || getValidationMessage('phone')
    }
    return this
  }
  
  /**
   * 获取验证结果
   */
  validate(): { isValid: boolean; errors: Record<string, string> } {
    return {
      isValid: Object.keys(this.errors).length === 0,
      errors: this.errors
    }
  }
}