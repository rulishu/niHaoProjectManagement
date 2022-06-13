import request from '../utils/request'

/**
 * 查询用户列表数据
 * @page
 * @pageSize
 *
 */
export const queryByPage = (params) => {
  return request('/api/system/user/list', {
    method: 'POST',
    body: params,
  })
}

//查询用户列表不分页
export const listNotPage = (params) => {
  console.log('params', params)
  return request('/api/system/user/listNotPage', {
    method: 'POST',
    body: params,
  })
}

// 新增用户列表数据
export const addNewUser = (params) => {
  return request('/api/system/user/add', {
    method: 'POST',
    body: params,
  })
}

// 根据id删除用户
export const deleteById = (params) => {
  return request('/api/system/user/remove', {
    method: 'POST',
    body: params,
  })
}

// 修改用户
export const editNewUser = (params) => {
  return request('/api/system/user/edit', {
    method: 'POST',
    body: params,
  })
}
// 修改个人用户
export const editNewperson = (params) => {
  return request('/api/system/user/profile/update', {
    method: 'POST',
    body: params,
  })
}
//个人信息
export const editGetInfo = (params) => {
  return request(`/api/system/user/profile/get`, {
    method: 'POST',
    body: params,
  })
}
//
// 通过用户id查询用户信息
export const queryById = (params) => {
  return request(`/api/system/user/getInfoToken/${params}`, {
    method: 'POST',
    requestType: 'urlencoded',
    body: params,
  })
}

// 修改账户登入密码
export const updatePassword = (params) => {
  return request('/api/system/user/profile/updatePwd', {
    method: 'POST',
    body: params,
  })
}

// 修改引导状态
export const guideUpdate = (params) => {
  return request('/api/managerUser/guideUpdate', {
    method: 'POST',
    body: params,
  })
}

// // 根据公司列表
// export const getSelectCompany = (params) => {
//   return request('/api/managerURP/selectCompany', {
//     method: 'POST',
//     body: params,
//     requestType: 'form',
//   })
// }

// // 根据成员查公司
// export const getUserCompanyList = (params) => {
//   return request('/api/managerURP/selectCompanyByUserId', {
//     method: 'POST',
//     body: params,
//   })
// }

// // 根据人员查项目
// export const getUserProjectList = (params) => {
//   return request('/api/managerURP/selectProjectListByUserId', {
//     method: 'POST',
//     body: params,
//   })
// }

// // 编辑成员的公司
// export const editUserCompany = (params) => {
//   return request('/api/managerURP/managerUCSave', {
//     method: 'POST',
//     body: params,
//   })
// }

// // 编辑成员的项目
// export const editUserProject = (params) => {
//   return request('/api/managerURP/mangerURPSaves', {
//     method: 'POST',
//     body: params,
//   })
// }

// 获取所有的公司与项目
export const getAllCompaniesProjects = (params) => {
  return request('/api/managerUCP/selectCompanyDetail', {
    method: 'POST',
    body: params,
  })
}

// 批量新增项目用户
export const saveBatchUser = (params) => {
  return request('/api/managerUCP/mangerUCPSaves', {
    method: 'POST',
    body: params,
  })
}

// 查询单个用户的公司和项目
export const getUserCompanyProjects = (params) => {
  return request(`/api/managerUCP/selectCompanyByUserId?userId=${params}`, {
    method: 'GET',
  })
}

// 获取是否开启注册功能
export const getRegisterSwitch = () => {
  return request('/api/system/config/getRegisterSwitch', {
    method: 'GET',
  })
}

// 设置开启注册功能
export const registerSwitch = () => {
  return request('/api/system/config/registerSwitch', {
    method: 'GET',
  })
}

//重置密码
export const resetPwd = (params) => {
  return request('/api/system/user/resetPwd', {
    method: 'POST',
    body: params,
  })
}
