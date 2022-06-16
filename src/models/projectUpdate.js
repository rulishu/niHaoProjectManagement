import { createModel } from '@rematch/core'
import {
  queryProject,
  addProject,
  updateProject,
  selectAllUserlist,
} from '@/servers/projectList'
import { queryFuzzyAllUser } from '../servers/usersManagement'
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
    editLoading: false, //新增编辑项目loading
    originData: [], //项目成员原信息
  },
  reducers: {
    updateState: (state, payload) => ({
      ...state,
      ...payload,
    }),
  },
  effects: (dispatch) => ({
    //获取项目成员信息(编辑的时候获取该项目的所有成员)
    async selectAllUserlist(params) {
      const dph = dispatch
      const data = await selectAllUserlist(params)
      let list = data?.rows
      let arr = []
      list?.forEach((element) => {
        let key = element.userId
        let memberName = element.nickName + '  ' + element.email
        arr.push({
          key,
          memberName,
        })
      })
      if (data.code === 200) {
        dph.projectUpdate.updateState({
          userList: arr,
          drawerType: 'edit',
          drawerVisible: true,
          originData: list,
        })
      }
    },

    //打开关闭新增或编辑项目的弹出框
    async updataProject(params) {
      const dph = dispatch
      if (params.drawerType === 'add') {
        dph.projectUpdate.updateState({
          drawerType: 'add',
          drawerVisible: true,
        })
      } else {
        //编辑
        dph.projectUpdate.updateState({
          id: params.id,
        })
        dph.projectUpdate.selectAllUserlist({ id: params.id }) //获取项目成员信息

        const data = await queryProject({ id: params.id }) //获取项目详细信息
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
      const { newValue, callback, userName } = params
      const data = await addProject(newValue)
      if (data.code === 200) {
        Notify.success({
          description: data.message,
        })
        dph.projectUpdate.updateState({
          seachValue: {},
          drawerVisible: false,
          editLoading: false,
        })
        callback && callback() //回调刷新界面
      }
      //判断是否是用户个人页-新增项目数据回显
      if (userName !== undefined) {
        await dispatch.userHome.getUserInfoByAccount(userName)
      }
    },

    //编辑项目
    async updateProject(params, state) {
      let { newValue, callback } = params
      const dph = dispatch
      if (newValue?.status === state.projectUpdate.isHangup) {
        delete newValue.status
      } else {
        if (newValue.status === true) {
          newValue.status = 3
        } else {
          newValue.status = 1
        }
      }

      const data = await updateProject(newValue)
      if (data.code === 200) {
        dph.projectUpdate.updateState({
          seachValue: {},
          drawerVisible: false,
          id: '',
          editLoading: false,
        })
        callback && callback() //回调刷新界面
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

    // 模糊查询成员
    async queryFuzzyAllUser(payload, state) {
      // const dph = dispatch
      const data = await queryFuzzyAllUser(payload)
      if (data.code === 200) {
        let originData = state.projectUpdate.originData
        let newData = data.rows

        // eslint-disable-next-line
        originData.map((item) => {
          // eslint-disable-next-line
          newData.map((itemA, index) => {
            if (item.userId === itemA.userId) {
              newData.splice(index, 1)
            }
          })
        })
        console.log(newData)

        // dph.department.updateState({
        //   userIdList: userIdList,
        //   dataList: data?.rows,
        // })
      }
    },
  }),
})
export default projectUpdate
