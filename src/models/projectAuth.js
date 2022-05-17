import { createModel } from '@rematch/core'
import { getSelectPage } from '../servers/projectAuth'

/**
 * 任务Project
 */
export default createModel()({
  name: 'projectAuth',
  state: {
    dataList: [
      { code: '1', name: 'ceshi', mshu: '测试', gender: '张三，李四' },
    ],
    isView: false,
  },
  effects: (dispatch) => {
    return {
      async getList(params, { projectAuth }) {
        const data = await getSelectPage({ ...params })
        if (data && data.code === 200) {
          dispatch.projectAuth.update({
            dataList: data?.data.list || [],
            total: data?.data.total,
          })
        }
      },
    }
  },
  reducers: {
    update: (state, payload) => {
      return {
        ...state,
        ...payload,
      }
    },
  },
})
