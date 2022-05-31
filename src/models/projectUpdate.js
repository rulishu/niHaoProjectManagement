import { createModel } from '@rematch/core'
import {
  queryProject,
  addProject,
  updateProject,
  selectAllUserlist,
} from '@/servers/projectList'
import { uploadFile } from '../servers/fileQuery'
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
    isHangup: false, //项目是否挂起
    fileIds: '', //Logo文件的id
  },
  reducers: {
    updateState: (state, payload) => ({
      ...state,
      ...payload,
    }),
  },
  effects: (dispatch) => ({
    //获取用户列表信息
    async selectAllUserlist(params) {
      const dph = dispatch
      const data = await selectAllUserlist()
      let list = data?.rows
      let arr = []
      list?.forEach((element) => {
        let value = element.userId
        let label = element.nickName + '  ' + element.email
        arr.push({
          value,
          label,
        })
      })
      if (data.code === 200) {
        dph.projectUpdate.updateState({
          userList: arr,
          drawerType: params.drawerType,
          drawerVisible: true,
        })
      }
    },

    //打开关闭新增或编辑项目的弹出框
    async updataProject(params) {
      const dph = dispatch
      if (params.drawerType === 'add') {
        //新增
        dph.projectUpdate.selectAllUserlist({
          drawerType: 'add',
        }) //获取用户列表信息
      } else {
        //编辑
        delete params.drawerType
        dph.projectUpdate.selectAllUserlist({
          drawerType: 'edit',
        }) //获取用户列表信息
        dph.projectUpdate.updateState({
          id: params.id,
        })
        const data = await queryProject(params) //获取项目详细信息
        if (data.code === 200) {
          let isrigiht
          data.data.status === 3 ? (isrigiht = true) : (isrigiht = false)
          dph.projectUpdate.updateState({
            isHangup: isrigiht,
            seachValue: data.data,
            drawerVisible: true,
          })
        }
      }
    },

    //新增项目
    async addProject(params) {
      const dph = dispatch
      const { seachValue, callback, userName } = params
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
      //判断是否是用户个人页-新增项目数据回显
      if (userName !== undefined) {
        await dispatch.userHome.getUserInfoByAccount(userName)
      }
    },

    //编辑项目
    async updateProject(params, state) {
      let { seachValue, callback } = params
      const dph = dispatch

      if (
        seachValue?.status === false ||
        state.projectUpdate.isHangup === true
      ) {
        seachValue.status = 0
      } else if (seachValue.status === true) {
        seachValue.status = 3
      }

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

    // 上传项目Logo
    async uploadFile(params) {
      const dph = dispatch
      const data = await uploadFile(params)
      if (data && data.code === 200) {
        dph.projectUpdate.updateState({
          fileIds: data.data,
        })
        Notify.success({
          description: data.message,
        })
      }
    },
  }),
})
export default projectUpdate
