import { createModel } from '@rematch/core'
import { selectOneInfo } from '../servers/projectList'

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
        dispatch.projectuser.update({
          dataList: data?.data?.list || [],
          total: data?.data?.total,
          page: data?.data.pageNum || page,
          pageSize: data?.data.pageSize || pageSize,
        })
      }
    },
  }),
})
export default projectlist
