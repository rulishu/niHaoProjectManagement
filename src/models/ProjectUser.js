import { createModel } from '@rematch/core'
import {
  selectUserByProjectId,
  addSaveUser,
  deleteById,
  pullSelectAll,
  // queryById
  // updatePassword
} from '../servers/users'

// const NotifySuccess = (message) => {
//   return Notify.success({ title: message, description: '' })
// }

/**
 * 所有用户列表
 */
export default createModel()({
  name: 'projectuser',
  state: {
    page: 1,
    pageSize: 10,
    total: 0,
    dataList: [], // 数据列表源
    baseDetail: {}, // 详情数据源
    userSelectAllList: [], // 查询所有成员
    modalVisible: false, // 弹窗
  },
  reducers: {
    update: (state, payload) => {
      return {
        ...state,
        ...payload,
      }
    },
  },
  effects: (dispatch) => ({
    async selectUserByProjectId(payload, { projectuser }) {
      const { pageSize, page } = projectuser
      const params = {
        pageSize,
        page,
        ...payload,
      }
      const data = await selectUserByProjectId(params)
      if (data && data.code === 200) {
        dispatch.projectuser.update({
          dataList: data?.data?.list || [],
          total: data?.data?.total,
          page: data?.data.pageNum || page,
          pageSize: data?.data.pageSize || pageSize,
        })
      }
    },
    // 翻页
    async goToPage(payload) {
      const { page, pageSize, projectId } = payload
      await dispatch.projectuser.update({ page, pageSize })
      await dispatch.projectuser.selectUserByProjectId({ projectId: projectId })
    },
    async addSaveUser(params) {
      const data = await addSaveUser(params)
      return data
    },
    async deleteById(params) {
      const data = await deleteById(params)
      return data
    },
    async pullSelectAll(params) {
      const data = await pullSelectAll({
        ...params,
      })
      if (data && data.code === 200) {
        dispatch.projectuser.update({
          userSelectAllList: data?.data || [],
        })
      }
    },
  }),
})
