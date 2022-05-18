import { Notify } from 'uiw'
import { createModel } from '@rematch/core'
import {
  selectRole,
  deleteRole,
  upDateStatusRole,
  getAllRoleList,
  menuTiers,
  selectListByRoleId,
  getAdd,
  getDelete,
  getEdit,
  getInfo,
  getTreeSelect,
  roleMenuTreeselect,
  changeStatus,
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
    tablePro: {},
    // 菜单列表
    menuOptions: [],
    checkedKeys: [],
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
    // 新增
    async getAdd(payload, rolemanagement) {
      const dph = dispatch
      const data = await getAdd(payload)
      if (data.code === 200) {
        dph.rolemanagement.update({
          drawerVisible: false,
          drawerVisiText: '',
        })
        rolemanagement.rolemanagement.tablePro.onSearch()
      }
    },
    // 删除
    async getDelete(payload, rolemanagement) {
      const dph = dispatch
      const data = await getDelete(payload)
      if (data.code === 200) {
        dph.rolemanagement.update({
          drawerVisible: false,
          drawerVisiText: '',
        })
        rolemanagement.rolemanagement.tablePro.onSearch()
      }
    },
    // 编辑
    async getEdit(payload, rolemanagement) {
      const dph = dispatch
      const data = await getEdit(payload)
      if (data.code === 200) {
        dph.rolemanagement.update({
          drawerVisible: false,
          drawerVisiText: '',
        })
        rolemanagement.rolemanagement.tablePro.onSearch()
      }
    },
    // 根据角色编号获取详细信息
    async getInfo(payload) {
      const dph = dispatch
      const data = await getInfo(payload)
      if (data.code === 200) {
        dph.rolemanagement.update({
          drawerVisible: true,
          queryInfo: data.data || {},
        })
      }
    },
    // 获取菜单下拉树列表
    async getTreeSelect(payload) {
      const dph = dispatch
      const data = await getTreeSelect(payload)
      if (data.code === 200) {
        dph.rolemanagement.update({
          menuOptions: data.data || [],
        })
      }
    },
    // 加载对应角色菜单列表树
    async roleMenuTreeselect(payload) {
      const dph = dispatch
      const data = await roleMenuTreeselect(payload)
      if (data.code === 200) {
        dph.rolemanagement.update({
          menuOptions: data.menus || [],
          checkedKeys: data.checkedKeys || [],
        })
      }
    },
    // 角色状态修改
    async changeStatus(payload) {
      const data = await changeStatus(payload)
      if (data.code === 200) {
        Notify.success({ description: data.msg })
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
