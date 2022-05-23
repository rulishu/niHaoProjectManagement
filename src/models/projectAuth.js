import { createModel } from '@rematch/core'
import {
  getSelectPage,
  getinset,
  getupdate,
  getdelete,
  getall,
} from '../servers/projectAuth'

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
    isMain: false,
    isUsers: false,
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
      // 新增团队
      async getinset(payload) {
        const { params } = payload
        const data = await getinset(params)
        console.log('新增团队', data)
      },
      // 根据团队 ID 删除团队
      async getdelete(params) {
        const data = await getdelete(params)
        console.log('删除团队', data)
      },
      // 修改团队
      async getupdate(payload) {
        const { params } = payload
        const data = await getupdate(params)
        console.log('修改团队', data)
      },
      // 分页查找团队
      async getall(params, { team }) {
        const param = { page: 1, pageSize: 10, ...params }
        const data = await getall(param)
        if (data && data.code === 200) {
          dispatch.team.update({
            dataList: data?.data?.list,
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
