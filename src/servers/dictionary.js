import request from '@/utils/request'

/**
 * 分页查询字典列表数据
 */
export function queryByPage(params) {
  return request('/api/dict/queryByPage', {
    method: 'POST',
    body: { ...params },
  })
}
/**
 * 分页查询字典列表数据
 */
export function getQueryAll(params) {
  return request('/api/system/post/list', {
    method: 'POST',
    body: { ...params },
  })
}
/**
 * 通过字典id查询字典信息
 */
export function queryById(params) {
  return request(`/api/dict/queryById/${params}`, {
    method: 'GET',
  })
}

/**
 * 根据id删除字典项
 */
export function deleteById(params) {
  return request('/api/dict/deleteById', {
    method: 'POST',
    body: params,
  })
}

/**
 * 根据id删除字典类型
 */
export function deleteByTypeId(params) {
  return request('/api/dict/deleteByTypeId', {
    method: 'POST',
    body: params,
  })
}

// 新增字典
export const addByDict = '/api/dict/add'
// 新增字典函数
export function addByDictFn(params) {
  return request('/api/dict/add', {
    method: 'POST',
    body: params,
  })
}

// 修改字典
export const editByDict = '/api/dict/edit'

/**
 * 分组出不同类型的字典
 */
export function groupByDict() {
  return request('/api/dict/groupByCode', {
    method: 'GET',
  })
}
