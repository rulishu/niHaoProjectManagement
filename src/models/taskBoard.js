import { createModel } from '@rematch/core'
// import { Notify } from 'uiw'
import { selectAllTabulation } from '../servers/taskBoard'

/**
 * 项目列表
 */
const taskboard = createModel()({
  name: 'taskboard',
  state: {
    page: 1,
    pageSize: 10,
    total: 0,
    dataList: [],
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
    //查询项目
    async selectOneInfo(payload, { taskboard }) {
      const { pageSize, page, type } = taskboard
      let params = {
        pageSize,
        page,
        type,
        ...payload,
      }
      const data = await selectAllTabulation(params)
      if (data && data.code === 200) {
        dispatch.taskboard.update({
          dataList: data?.data?.list || [],
          total: data?.data?.total,
          page: data?.data.pageNum || page,
          pageSize: data?.data.pageSize || pageSize,
        })
      }
    },
  }),
})
export default taskboard
