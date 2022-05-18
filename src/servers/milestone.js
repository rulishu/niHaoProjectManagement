// 里程碑
import request from '@/utils/request'

/**
 * 分页查询里程碑
 */
export function queryPaging(params) {
  return request('/api/milestones/selectPage', {
    method: 'POST',
    body: { ...params },
  })
}

/**
 * 新增里程碑
 */
export function addMilestones(params) {
  return request('/api/milestones/milestonesSave', {
    method: 'POST',
    body: { ...params },
  })
}

/**
 * 根据id查询里程碑详情
 */
export function getMilestonesInfo(params) {
  return request('/api/milestones/selectById', {
    method: 'POST',
    body: { ...params },
  })
}

/**
 * 删除里程碑
 */
export function deleteMilestones(params) {
  return request('/api/milestones/delete', {
    method: 'POST',
    body: { ...params },
  })
}

/**
 * 编辑里程碑
 */
export function updateMilestones(params) {
  return request('/api/milestones/milestonesUpdate', {
    method: 'POST',
    body: { ...params },
  })
}

/**
 * 编辑里程碑状态
 */
export function editStatusMilestones(params) {
  return request('/api/milestones/updatestatus', {
    method: 'POST',
    body: { ...params },
  })
}

// 所有里程碑查询
export function getSelectAll(params) {
  return request('/api/milestones/selectAll', {
    method: 'POST',
    body: { ...params },
  })
}
