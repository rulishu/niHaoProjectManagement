import { createModel } from '@rematch/core'
import {
  queryProject,
  addProject,
  updateProject,
  selectAllUserlist,
} from '@/servers/projectList'
import { Notify } from 'uiw'

const projectUpdate = createModel()({
  name: 'projectUpdate',
  state: {
    drawerVisible: false, //新增项目或编辑项目的弹出框
    seachValue: {}, //新增项目或编辑项目的更改的内容
    drawerType: '', //新增项目或编辑项目
    id: '', //需要编辑项目的id
    userList: [], //新增项目或编辑项目的项目负责人列表
    fun: {},
  },
  reducers: {
    updateState: (state, payload) => ({
      ...state,
      ...payload,
    }),
  },
  effects: (dispatch) => ({
    //获取用户列表信息
    async selectAllUserlist() {
      const dph = dispatch
      const data = await selectAllUserlist()
      let list = data.rows
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
        dph.projectUpdate.updateState({
          userList: arr,
        })
      }
    },

    //打开关闭新增或编辑项目的弹出框
    async updataProject(params) {
      const dph = dispatch
      dph.projectUpdate.updateState({
        drawerVisible: true,
      })
      if (params.drawerType === 'add') {
        //新增
        dph.projectUpdate.selectAllUserlist() //获取用户列表信息
        dph.projectUpdate.updateState({
          drawerType: 'add',
          drawerVisible: true,
        })
      } else {
        //编辑
        delete params.drawerType
        dph.projectUpdate.selectAllUserlist() //获取用户列表信息
        dph.projectUpdate.updateState({
          id: params.id,
          drawerType: 'edit',
        })
        const data = await queryProject(params) //获取项目详细信息
        if (data.code === 200) {
          dph.projectUpdate.updateState({
            seachValue: data.data,
            drawerVisible: true,
          })
        }
      }
    },

    //新增项目
    async addProject(params) {
      const dph = dispatch
      const { seachValue, callback } = params
      const data = await addProject(seachValue)
      if (data.code === 200) {
        Notify.success({
          description: data.message,
        })
        dph.projectUpdate.updateState({
          seachValue: {},
          drawerVisible: false,
        })
        callback && callback()
      }
    },

    //编辑项目
    async updateProject(params) {
      const { seachValue, callback } = params
      const dph = dispatch
      const data = await updateProject(seachValue)
      if (data.code === 200) {
        dph.projectUpdate.updateState({
          seachValue: {},
          drawerVisible: false,
          id: '',
        })
        callback && callback()
        Notify.success({
          description: data.message,
        })
      }
    },
  }),
})
export default projectUpdate
