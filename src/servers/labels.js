import request from '@/utils/request'

/**
 * 标签
 */

/**
 * 标签：条件查询-不分页
 */
export const getAllLabelData = (params) => {
  return request('/api/managerLabels/selectList', {
    method: 'POST',
    body: params,
  })
}

/**
 * 标签：删除
 */
export const deleteLabel = (params) => {
  return request('/api/managerLabels/delete', {
    method: 'POST',
    body: params,
  })
}

/**
 * 标签：新增
 */
export const addLabelItem = (params) => {
  return request('/api/managerLabels/insert', {
    method: 'POST',
    body: params,
  })
}

/**
 * 标签：根据主键id查询
 */
export const getLabelInfoById = (params) => {
  return request(`/api/managerLabels/selectById/${params}`, {
    method: 'POST',
  })
}

/**
 * 标签：分页查询
 */
export const getAllLabelPageData = (params) => {
  return request('/api/managerLabels/selectPage', {
    method: 'POST',
    body: params,
  })
}

/**
 * 标签：修改
 */
export const editLabelInfo = (params) => {
  return request('/api/managerLabels/update', {
    method: 'POST',
    body: params,
  })
}
