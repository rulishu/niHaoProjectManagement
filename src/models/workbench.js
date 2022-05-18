import { createModel } from '@rematch/core'
import {
  selectOperatingRecord,
  myProject,
  memberOperator,
} from '../servers/workbench'
import { Notify } from 'uiw'

const workbench = createModel()({
  name: 'workbench',
  state: {
    listDynamic: [],
    projectList: [],
    taskId: '1594',
  },
  effects: (dispatch) => ({
    // 查询项目的操作动态
    async selectOperatingRecord(payload) {
      const data = await selectOperatingRecord(payload)
      if (data.code === 200) {
        dispatch.workbench.update({
          listDynamic: data?.data || [],
        })
      }
    },

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
      console.log('成员动态===>', data)
      if (data.code === 200) {
        dispatch.workbench.update({
          listDynamic: data?.data || [],
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
