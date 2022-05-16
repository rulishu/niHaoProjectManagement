import { createModel } from '@rematch/core'
import { selectOperatingRecord } from '../servers/workbench'
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
  }),
  reducers: {
    update: (state, payload) => {
      return { ...state, ...payload }
    },
  },
})
export default workbench
