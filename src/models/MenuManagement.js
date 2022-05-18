import { Notify } from 'uiw'
import { createModel } from '@rematch/core'
import {
  getList,
  deleteById,
  upDateStatusMenu,
  getAdd,
  getDelete,
  getEdit,
} from '@/servers/menumanagement'

export default createModel()({
  name: 'menumanagement',
  state: {
    drawerVisible: false,
    drawerVisibleAuth: false,
    tableType: '',
    queryInfo: {},
    isView: false,
    dataSourceList: [],
  },
  effects: (dispatch) => ({
    // 获取菜单列表
    async getList(payload) {
      const dph = dispatch
      const data = await getList(payload)
      if (data.code === 200) {
        dph.menumanagement.update({
          dataSourceList: data.data || [],
        })
      }
    },
    // 新增
    async getAdd(payload, menumanagement) {
      const dph = dispatch
      const data = await getAdd(payload)
      if (data.code === 200) {
        dph.menumanagement.update({
          drawerVisible: false,
          drawerVisiText: '',
        })
        menumanagement.menumanagement.tablePro.onSearch()
      }
    },
    // 删除
    async getDelete(payload, menumanagement) {
      const dph = dispatch
      const data = await getDelete(payload)
      if (data.code === 200) {
        dph.menumanagement.update({
          drawerVisible: false,
          drawerVisiText: '',
        })
        menumanagement.menumanagement.tablePro.onSearch()
      }
    },
    // 编辑
    async getEdit(payload, menumanagement) {
      const dph = dispatch
      const data = await getEdit(payload)
      if (data.code === 200) {
        dph.menumanagement.update({
          drawerVisible: false,
          drawerVisiText: '',
        })
        menumanagement.menumanagement.tablePro.onSearch()
      }
    },
    async deleteById(payload) {
      const data = await deleteById(payload)
      if (data.code === 200) {
        Notify.success({ title: data.message })
        return true
      }
    },
    async upDateStatusMenu(payload) {
      const params = { status: payload.status, id: payload.id }
      const data = await upDateStatusMenu(params)
      if (data.code === 200) {
        Notify.success({ description: data.message })
        return true
      }
    },
    clean() {
      const dph = dispatch
      dph.menumanagement.update({
        drawerVisible: false,
        tableType: '',
        queryInfo: {},
        isView: false,
      })
    },
  }),
  reducers: {
    update: (state, payload) => {
      return {
        ...state,
        ...payload,
      }
    },
  },
})
