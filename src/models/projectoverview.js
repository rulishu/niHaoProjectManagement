import { createModel } from '@rematch/core'
import {
  getProjectCountById,
  getProjectDynamics,
  getProjectMembers,
} from '../servers/projectoverview'
import { Notify } from 'uiw'

const NotifyError = (message) => {
  return Notify.error({ description: message })
}
const projectoverview = createModel()({
  name: 'projectoverview',
  state: {
    allDataSource: {},
    projectMembersList: [],
    projectDynamicsList: [],
    projectId: '',
    page: 1,
    pageSize: 10,
  },
  effects: (dispatch) => ({
    // 查询项目统计
    async getProjectCountById(payload) {
      const data = await getProjectCountById(payload)
      if (data.code === 200) {
        dispatch.projectoverview.update({
          allDataSource: data?.data || [],
        })
      } else {
        NotifyError(data.msg)
      }
    },
    // 查询项目动态
    async getProjectDynamics(payload) {
      const data = await getProjectDynamics(payload)
      if (data.code === 200) {
        dispatch.projectoverview.update({
          projectDynamicsList: data?.data || [],
        })
      } else {
        NotifyError(data.msg)
      }
    },

    //查询项目成员
    async getProjectMembers(payload) {
      const data = await getProjectMembers(payload)
      if (data.code === 200) {
        dispatch.projectoverview.update({
          projectMembersList: data?.data || [],
        })
      } else {
        NotifyError(data.msg)
      }
    },
  }),

  reducers: {
    update: (state, payload) => {
      return { ...state, ...payload }
    },
  },
})
export default projectoverview
