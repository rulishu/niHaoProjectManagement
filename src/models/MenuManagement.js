import { Notify } from 'uiw'
import { createModel } from '@rematch/core'
import {
  queryByPage,
  deleteById,
  upDateStatusMenu,
} from '@/servers/menumanagement'

export default createModel()({
  name: 'menumanagement',
  state: {
    drawerVisible: false,
    drawerVisibleAuth: false,
    tableType: '',
    queryInfo: {},
    isView: false,
  },
  effects: (dispatch) => ({
    async queryByPage(payload) {
      const dph = dispatch
      const data = await queryByPage(payload)
      if (data.code === 200) {
        dph.menumanagement.update({
          drawerVisible: true,
          queryInfo: data.data || {},
        })
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
