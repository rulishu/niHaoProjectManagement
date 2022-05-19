import { createModel } from '@rematch/core'
import { Notify } from 'uiw'
import {
  selectOneInfo,
  deleteProject,
  selectNumber,
} from '../servers/projectList'

/**
 * 项目列表
 */
const projectlist = createModel()({
  name: 'projectlist',
  state: {
    page: 1,
    pageSize: 10,
    total: 0,
    type: '10',
    dataList: [], // 数据列表源
    proNum: {}, //各类型项目数量
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
    async selectOneInfo(payload, { projectlist }) {
      const { pageSize, page, type } = projectlist
      let params = {
        pageSize,
        page,
        type,
        ...payload,
      }
      const data = await selectOneInfo(params)
      if (data && data.code === 200) {
        dispatch.projectlist.update({
          dataList: data?.data?.list || [],
          total: data?.data?.total,
          page: data?.data.pageNum || page,
          pageSize: data?.data.pageSize || pageSize,
        })
      }
    },

    //获取用户各状态项目总数
    async selectNumber(payload) {
      const data = await selectNumber(payload)
      if (data && data.code === 200) {
        dispatch.projectlist.update({
          proNum: data.data,
        })
      } else {
        Notify.error({ title: data.message })
      }
    },

    //删除单条项目
    async deleteProject(payload) {
      const { setDeleteOpen, id, search } = payload
      const data = await deleteProject(id)
      if (data && data.code === 200) {
        Notify.success({ title: data.data })
        setDeleteOpen(false)
        search()
        dispatch.projectlist.selectNumber()
      } else {
        Notify.error({ title: data.data })
      }
    },
  }),
})
export default projectlist
