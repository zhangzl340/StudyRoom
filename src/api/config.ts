
import type { IPaginationParams } from '@/types/api.types'

/**
 * API基础配置
 */
export const API_CONFIG = {
  // API前缀
  PREFIX: '',
  
  // 默认分页参数
  DEFAULT_PAGINATION: {
    page: 1,
    pageSize: 20,
    orderBy: 'createdAt',
    order: 'desc' as const
  }
}

/**
 * 构建查询参数
 */
export const buildQueryParams = (params: Record<string, any> = {}): string => {
  const filteredParams: Record<string, any> = {}
  
  // 过滤掉undefined和null的参数
  Object.keys(params).forEach(key => {
    if (params[key] !== undefined && params[key] !== null && params[key] !== '') {
      filteredParams[key] = params[key]
    }
  })
  
  const queryString = new URLSearchParams(filteredParams).toString()
  return queryString ? `?${queryString}` : ''
}

/**
 * 处理分页参数
 */
export const buildPaginationParams = (params?: IPaginationParams): string => {
  const paginationParams = {
    ...API_CONFIG.DEFAULT_PAGINATION,
    ...params
  }
  
  return buildQueryParams(paginationParams)
}

/**
 * 统一处理API响应
 */
export const handleApiResponse = async <T>(
  promise: Promise<T>
): Promise<{ data: T; error: Error | null }> => {
  try {
    const data = await promise
    return { data, error: null }
  } catch (error: any) {
    return { data: null as any, error }
  }
}