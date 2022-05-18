import { createModel } from '@rematch/core'
import { Notify } from 'uiw'
import { selectOneInfo, deleteProject } from '../servers/projectList'

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
    //查询项目deleteProject
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
        dispatch.projectuser.update({
          dataList: data?.data?.list || [],
          total: data?.data?.total,
          page: data?.data.pageNum || page,
          pageSize: data?.data.pageSize || pageSize,
        })
      }
    },

    //删除单条项目
    async deleteProject(payload) {
      const data = await deleteProject(payload)
      if (data && data.code === 200) {
        Notify.success({ title: data.data })
      } else {
        Notify.error({ title: data.data })
      }
    },
  }),
})
export default projectlist
