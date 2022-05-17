import { createModel } from '@rematch/core'
import { projectCountById } from '../servers/projectoverview'
const projectoverview = createModel()({
  name: 'projectoverview',
  state: {
    listDynamic: [],
    taskId: '1594',
  },
  effects: (dispatch) => ({
    // 查询项目统计
    async projectCountById(payload) {
      const data = await projectCountById(payload)
      console.log('data', data)
      if (data.code === 200) {
        dispatch.projectoverview.update({
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
export default projectoverview
