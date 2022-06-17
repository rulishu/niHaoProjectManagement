import { createModel } from '@rematch/core'
import {
  queryByPage,
  addMenuData,
  deleteById,
  editMenu,
  getInfo,
  getRouters,
  queryFuzzyAllProjectMember,
} from '@/servers/menumanagement'
import { Notify } from 'uiw'

export default createModel()({
  name: 'routeManagement',
  state: {
    routeMenuList: [], // 路由菜单
    isOpenModal: false,
    menuItemData: {}, // 当前菜单的数据
    fromData: {},
    fromType: 1, // 1:增加，2，编辑
    userInfo: '', //当前登陆人信息
    userInfoName: '', //账号
    todoListCount: 0,
    userData: {},
    dataUser: [], //成员
  },
  effects: (dispatch) => ({
    // 获取路由列表数据
    async getRouteMenu(payload) {
      const dph = dispatch
      const data = await queryByPage(payload)
      if (data.code === 200) {
        dph.routeManagement.update({
          drawerVisible: true,
          routeMenuList: data.data,
        })
      }
    },
    async getInfo(payload) {
      const dph = dispatch
      const data = await getInfo(payload)
      if (data.code === 200) {
        dph.routeManagement.update({
          userInfo: data?.user?.nickName,
          userInfoName: data?.user?.userName,
          todoListCount: data?.todoListCount,
          userData: data.user,
        })
        const imgs = data?.user?.admin
        // payload.callback && payload.callback(data.user)
        localStorage.setItem('key', imgs)
        return true
      }
    },
    async getRouters(payload) {
      const data = await getRouters()
      if (data.code === 200) {
        payload.callback && payload.callback(data.data)
        return true
      }
    },
    // 增加菜单
    async addMenuData(payload, { routeManagement }) {
      const data = await addMenuData(payload || routeManagement.fromData)
      if (data.code === 200) {
        await dispatch.routeManagement.update({ isOpenModal: false })
        Notify.success({ title: data.message })
        await dispatch.routeManagement.getRouteMenu()
      }
    },
    // 根据id删除菜单
    async deleteById(payload, { routeManagement }) {
      const data = await deleteById(payload)
      if (data.code === 200) {
        Notify.success({ title: data.message })
        await dispatch.routeManagement.getRouteMenu()
      }
    },
    // 编辑菜单
    async editMenu(payload, { routeManagement }) {
      const data = await editMenu(payload || routeManagement.fromData)
      if (data.code === 200) {
        await dispatch.routeManagement.update({ isOpenModal: false })
        Notify.success({ title: data.message })
        await dispatch.routeManagement.getRouteMenu()
      }
    },
    //成员列表不分页
    async queryFuzzyAllProjectMember(payload, { routeManagement }) {
      const data = await queryFuzzyAllProjectMember(payload)
      if (data.code === 200) {
        await dispatch.routeManagement.update({
          dataUser: data.data,
        })
      }
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
