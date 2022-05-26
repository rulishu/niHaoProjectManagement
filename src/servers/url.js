import request from '@/utils/request'

/**
 * 一级路由控制层
 */
export const getUrlType = (params) => {
  return request('/api/system/ManagerFirstUrl/urlDetail', {
    method: 'POST',
    body: params,
  })
}
