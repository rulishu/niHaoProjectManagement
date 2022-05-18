import { request } from '@uiw-admin/utils'

function addProjectMember(params) {
  return request('/api/projectMember/addProjectMember', {
    method: 'POST',
    body: { ...params },
  })
}

export { addProjectMember }
