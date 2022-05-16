import { Notify } from 'uiw'
import { createModel } from '@rematch/core'
import {
  selectRole,
  deleteRole,
  upDateStatusRole,
  getAllRoleList,
  menuTiers,
  selectListByRoleId,
} from '@/servers/rolemanagement'

export default createModel()({
  name: 'rolemanagement',
  state: {
    drawerVisible: false,
    drawerVisibleAuth: false,
    tableType: '',
    queryInfo: {},
    isView: false,
    allRoleList: [],
    allMenuList: [],
    dataRoleMenu: [],
  },
  effects: (dispatch) => ({
    async selectRole(payload) {
      const dph = dispatch
      const data = await selectRole(payload)
      if (data.code === 200) {
        dph.rolemanagement.update({
          queryInfo: data.data || {},
        })
      }
    },
    async deleteRole(payload) {
      const data = await deleteRole(payload)
      if (data.code === 200) {
        Notify.success({ title: data.message })
      }
    },
    async upDateStatusRole(payload) {
      const params = { status: payload.status, id: payload.id }
      const data = await upDateStatusRole(params)
      if (data.code === 200) {
        Notify.success({ description: data.message })
      }
    },
    // 获取所有的角色列表
    async getAllRoleList() {
      const data = await getAllRoleList()
      if (data.code === 200) {
        dispatch.rolemanagement.update({
          allRoleList: data.data.filter((item) => item.status === 0),
        })
      }
    },
    // 查询所有菜单树
    async menuTiers() {
      const data = await menuTiers()
      if (data.code === 200) {
        dispatch.rolemanagement.update({ allMenuList: data.data })
      }
    },
    async selectListByRoleId(payload) {
      const dph = dispatch
      const data = await selectListByRoleId(payload)
      if (data.code === 200) {
        dph.rolemanagement.update({
          dataRoleMenu: data.data || [],
        })
      }
    },
    clean() {
      const dph = dispatch
      dph.rolemanagement.update({
        drawerVisible: false,
        drawerVisibleAuth: false,
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
