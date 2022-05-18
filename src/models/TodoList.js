import { createModel } from '@rematch/core'
import { getSelectPage, getStrutsSwitch } from '../servers/TodoList'
import { Notify } from 'uiw'

/**
 * 待办事项
 */
export default createModel()({
  name: 'todolist',
  state: {
    activeKey: '0',
    filter: {
      page: 1,
      pageSize: 10,
    },
    dataList: [],
    total: 0,
    openTataList: [],
    openTotal: 0,
    issueType: '',
    isView: false,
    queryInfo: {},
  },
  effects: (dispatch) => {
    return {
      // 分页查询
      async getList(params, { todolist }) {
        const { filter } = todolist
        const data = await getSelectPage({
          ...filter,
          ...params,
          //   todolistId: '', // useLocation
        })
        if (data && data.code === 200) {
          if (params?.status === '1') {
            dispatch.todolist.update({
              dataList: data?.data.list || [],
              total: data?.data.total,
            })
          } else {
            dispatch.todolist.update({
              openTataList: data?.data.list || [],
              openTotal: data?.data.total,
            })
          }
        }
      },
      async getStrutsSwitch(payload) {
        const { page, pageSize, status } = payload
        let params = {
          ...payload,
        }
        const data = await getStrutsSwitch(params)
        // console.log('data------>11111', data)
        if (data && data.code === 200) {
          Notify.success({ title: data.msg })
        } else {
          Notify.error({ title: data.msg })
        }
        await dispatch.todolist.getList({
          page: page,
          pageSize: pageSize,
          status: status,
        })
      },

      // 翻页

      async goToPage(payload) {
        const { page, pageSize, status, createId } = payload
        await dispatch.todolist.update({
          filter: { page, pageSize },
        })
        await dispatch.todolist.getList({
          status: status,
          createId,
        })
      },
      clean() {
        const dph = dispatch
        dph.todolist.update({
          issueType: '',
          queryInfo: {},
          isView: false,
        })
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
