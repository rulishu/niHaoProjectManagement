import request from '@/utils/request'

/**
 * 第三方迁移
 */

/**
 * GitLab第三方迁移配置
 */

// 获取GitLab第三方迁移配置
export const getConfigControl = () => {
  return request('/api/system/transfer/gitlab/config/getConfig', {
    method: 'POST',
  })
}

// 设置GitLab第三方迁移配置
export const setConfigControl = (params) => {
  return request('/api/system/transfer/gitlab/config/setConfig', {
    method: 'POST',
    body: params,
  })
}

/**
 * 第三方迁入源控制层
 */

// 根据主键删除数据
export const delDataByIdSource = (params) => {
  return request('/api/system/transfersource/delete', {
    method: 'POST',
  })
}

// 新增数据
export const addDataSource = (params) => {
  return request(`/api/system/transfersource/insert`, {
    method: 'POST',
    body: params,
  })
}

// 根据主键id查询数据
export const getDataByIdSource = (params) => {
  return request(`/api/system/transfersource/selectById/${params}`, {
    method: 'POST',
  })
}

// 分页-条件查询列表数据
export const getPagingDataSource = (params) => {
  return request(`/api/system/transfersource/selectPage`, {
    method: 'POST',
    body: params,
  })
}

// 根据主键id更新数据
export const updateDataByIdSource = (params) => {
  return request(`/api/system/transfersource/update`, {
    method: 'POST',
    body: params,
  })
}

/**
 * 第三方迁移明细控制层
 */

// 根据主键id查询数据
export const getDataByIdDetail = (params) => {
  return request(`/api/system/transferdetail/selectById/${params}`, {
    method: 'POST',
  })
}

// 分页-条件查询列表数据
export const getPagingDataDetail = (params) => {
  return request(`/api/system/transferdetail/selectPage`, {
    method: 'POST',
    body: params,
  })
}
