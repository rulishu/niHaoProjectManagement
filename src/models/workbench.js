import { createModel } from '@rematch/core'
import { selectOperatingRecord, myProject } from '../servers/workbench'
const workbench = createModel()({
  name: 'workbench',
  state: {
    listDynamic: [],
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
      console.log('data===>', data)
      if (data.code === 200) {
        dispatch.workbench.update({
          listDynamic: data?.data || [],
        })
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
