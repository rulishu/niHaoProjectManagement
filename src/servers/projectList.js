import request from '@/utils/request'

/**
 * 新增项目
 */
export function addProject(params) {
  return request('/api/project/add', {
    method: 'POST',
    body: { ...params },
  })
}

/**
 * 分页查询项目信息
 */
export function selectPageList(params) {
  return request('/api/project/selectPageList', {
    method: 'POST',
    body: { ...params },
  })
}

/**
 * 删除项目
 */
export function deleteProject(params) {
  return request(`/api/project/delete/${params}`, {
    method: 'POST',
  })
}

/**
 * 修改项目
 */
export function updateProject(params) {
  return request('/api/project/update', {
    method: 'POST',
    body: { ...params },
  })
}

/**
 * 查询项目信息
 */
export function queryProject(params) {
  return request(`/api/project/select/${params.id}`, {
    method: 'POST',
    body: params,
  })
}
/**
 * 批量删除
 */
export function batchDelete(params) {
  return request('/api/project/batchDelete', {
    method: 'POST',
    body: params,
  })
}
/**
 * 批量增加
 */
export function batchAdd(params) {
  return request('/api/project/batchAdd', {
    method: 'POST',
    body: params,
  })
}
/**
 * 查询项目的操作动态
 */
export function selectOperatingRecord(params) {
  return request('/api/project/selectOperatingRecord', {
    method: 'POST',
    body: params,
  })
}

/**
 * 查询项目统计
 */
export function projectCountById(params) {
  return request('/api/project/projectCountById', {
    method: 'POST',
    body: params,
  })
}

/**
 * 获取当前用户的项目
 */
export function selectOneInfo(params) {
  return request('/api/project/selectOneInfo', {
    method: 'POST',
    body: params,
  })
}

/**
 * 获取所有用户
 */
export function selectAllUser(params) {
  return request('/api/project/selectAllUser', {
    method: 'POST',
    body: params,
  })
}

/**
 * 获取所有用户
 */
export function selectAllUserlist(params) {
  return request('/api/system/user/queryFuzzyAllUser', {
    method: 'POST',
    body: params,
  })
}

/**
 * 获取用户各状态项目总数
 */
export function selectNumber(params) {
  return request('/api/project/selectNumber', {
    method: 'POST',
    body: params,
  })
}
