import { createModel } from '@rematch/core'
import {
  myProject,
  memberOperator,
  selectAllProjectPage,
  selectProjectPage,
} from '../servers/workbench'
import { Notify } from 'uiw'

const workbench = createModel()({
  name: 'workbench',
  state: {
    listDynamic: [],
    projectList: [],
    memberList: [],
    allList: [],
    personList: [],
  },
  effects: (dispatch) => ({
    // 我近期参与的项目统计
    async myProject(payload) {
      const data = await myProject(payload)
      if (data.code === 200) {
        dispatch.workbench.update({
          projectList: data?.data || [],
        })
      } else {
        Notify.error({ title: `失败` + data.message })
      }
    },
    // 成员动态
    async memberOperator(payload) {
      const data = await memberOperator(payload)
      if (data.code === 200) {
        dispatch.workbench.update({
          memberList: data?.data || [],
        })
      } else {
        Notify.error({ title: `失败` + data.message })
      }
    },

    // 查询所有任务
    async selectAllProjectPage(payload) {
      const data = await selectAllProjectPage(payload)
      if (data.code === 200) {
        dispatch.workbench.update({
          allList: data?.data || [],
        })
      } else {
        Notify.error({ title: `失败` + data.message })
      }
    },

    // 查询个人任务
    async selectProjectPage(payload) {
      const data = await selectProjectPage(payload)
      if (data.code === 200) {
        dispatch.workbench.update({
          personList: data?.data || [],
        })
      } else {
        Notify.error({ title: `失败` + data.message })
      }
    },
  }),
  reducers: {
    update: (state, payload) => {
      return { ...state, ...payload }
    },
  },
})
export default workbench
