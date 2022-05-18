import { createModel } from '@rematch/core'
import {
  queryProject,
  addProject,
  updateProject,
  selectAllUser,
} from '@/servers/projectList'
import { Notify } from 'uiw'

const global = createModel()({
  name: 'global',
  state: {
    test: '测试全局State',
    drawerVisible: false, //新增项目或编辑项目的弹出框
    seachValue: {}, //新增项目或编辑项目的更改的内容
    drawerType: 'add', //新增项目或编辑项目
    id: '', //需要编辑项目的id
    userList: {}, //新增项目或编辑项目的项目负责人列表
  },
  reducers: {
    updateState: (state, payload) => ({
      ...state,
      ...payload,
    }),
  },
  effects: (dispatch) => ({
    async verify() {
      const dph = dispatch
      dph.global.updateState({
        test: '测试2',
      })
    },

    //获取用户列表信息
    async selectAllUser() {
      const dph = dispatch
      const data = await selectAllUser()
      let list = data.data
      let arr = []
      list.forEach((element) => {
        let value = element.userId
        let label = element.userName
        arr.push({
          value,
          label,
        })
      })
      if (data.code === 200) {
        dph.global.updateState({
          userList: arr,
        })
      }
    },

    //打开关闭新增或编辑项目的弹出框
    async updataProject(params) {
      const dph = dispatch
      if (params.drawerType === 'add') {
        //新增
        await dph.global.selectAllUser() //获取用户列表信息
        dph.global.updateState({
          drawerType: 'add',
          drawerVisible: true,
        })
      } else {
        //编辑
        delete params.drawerType
        await dph.global.selectAllUser() //获取用户列表信息
        const data = await queryProject(params) //获取项目详细信息
        if (data.code === 200) {
          dph.global.updateState({
            seachValue: data.data,
            drawerType: 'edit',
            drawerVisible: true,
          })
        } else {
          Notify.error({
            description: data.message,
          })
        }
      }
    },

    //新增项目
    async addProject(params) {
      const data = await addProject(params)
      if (data.code === 200) {
        Notify.success({
          description: data.message,
        })
      }
    },

    //编辑项目
    async updateProject(params) {
      const data = await updateProject(params)
      if (data.code === 200) {
        Notify.success({
          description: data.message,
        })
      }
    },
  }),
})
export default global
