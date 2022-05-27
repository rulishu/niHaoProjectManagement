import { Notify } from 'uiw'
import { createModel } from '@rematch/core'
import {
  queryByPage,
  addNewUser,
  deleteById,
  editNewUser,
  editGetInfo,
  queryById,
  updatePassword,
  getAllCompaniesProjects,
  saveBatchUser,
  getUserCompanyProjects,
  guideUpdate,
  getRegisterSwitch,
  registerSwitch,
} from '../servers/allusers'
import {
  uploadFile,
  selectFilePathById,
  downloadFilePathById,
} from '../servers/fileQuery'

const NotifySuccess = (message) => {
  return Notify.success({ title: message, description: '' })
}

/**
 * 所有用户列表
 */
const allusers = createModel()({
  name: 'allusers',
  state: {
    filter: {
      userAccount: '',
      userName: '',
      userPosition: '',
    },
    page: 1,
    pageSize: 10,
    pages: 1,
    total: 0,
    dataList: [], // 数据列表源
    UserList: [], //多 用户数据
    baseDetail: {}, // 详情数据源
    uuid: '', // 成员头像uuid
    imgUrl: '', // 头像的url
    cUser: {}, // 当前用户信息
    roleList: [], // 用户角色列表
    // memberAvatarArr: [], // 成员头像数组
    // allCompanyList: [],
    // allProjectList: [],
    allCompaniesProjects: [],
    userCompaniesProjects: [],
    UserCompanyList: [],
    UserProjectList: [],
    membersItemsList: {},
    rolesDataInfo: {},
    postsDataInfo: {},
    isRegister: false, //是否开启注册功能
    types: '', //2:编辑用户
  },
  reducers: {
    update: (state, payload) => {
      return {
        ...state,
        ...payload,
      }
    },
  },
  effects: (dispatch) => ({
    async queryByPage(params, { allusers }, callback) {
      const { pageSize, page, filter } = allusers
      const data = await queryByPage({
        pageSize,
        page,
        ...filter,
        ...params,
      })
      if (data && data.code === 200) {
        await dispatch.allusers.update({
          dataList: data?.rows || [],
          total: data?.total,
          pageSize: params.pageSize || pageSize,
          page: params.page || page,
        })
        callback && callback(data?.rows)
      }
    },
    // 获取多个
    async getUserList() {
      const data = await queryByPage({ pageSize: 99, page: 1 })
      if (data && data.code === 200) {
        dispatch.allusers.update({ UserList: data?.rows || [] })
      }
    },
    // 新增成员
    async addNewUser(payload) {
      const { params, callback } = payload
      const data = await addNewUser(params)
      if (data && data.code === 200) {
        await callback()
        NotifySuccess(data.message)
      }
    },
    async deleteById(params, { allusers }) {
      const data = await deleteById({ ids: [params] })
      const { pageSize, page } = allusers
      if (data && data.code === 200) {
        dispatch.allusers.update({ page: 1 })
        NotifySuccess(data.message)
        await dispatch.allusers.queryByPage(pageSize, page)
      }
    },
    async editNewUser(payload) {
      const { param, callback } = payload
      await editGetInfo(param.userId)
      const data = await editNewUser(param)
      if (data && data.code === 200) {
        await callback()
        NotifySuccess(data.message)
      }
      await dispatch.userHome.getUserInfo({ id: param.userId })
    },
    async queryById(params) {
      const data = await queryById(params)
      if (data && data.code === 200) {
        dispatch.allusers.update({
          rolesDataInfo: data?.roleIds[0], // data?.roles?.find(e=>e?.roleId === data?.roleIds[0]) || {},
          postsDataInfo: data?.postIds[0], // data?.posts?.find(e=>e?.postId === ) || {},
          baseDetail: data.data,
          uuid: data.data?.uuid || '',
        })
      }
    },
    //修改引导状态
    async guideUpdate(payload) {
      const { params } = payload
      const data = await guideUpdate(params)
      if (data && data.code === 200) {
        // NotifySuccess(data.message)
      }
    },
    async updatePassword({ params, callback }) {
      const data = await updatePassword(params)
      if (callback) {
        callback(data)
      }
    },
    // 上传头像
    async getUploadAvatar(params) {
      const data = await uploadFile({ file: params })
      if (data && data.code === 200) {
        await dispatch.allusers.update({ uuid: data.data })
      }
    },
    async upLoadImg(payload) {
      const data = await uploadFile(payload)
      return data
    },
    // 根据uuid获取图片
    async getNewUserAvatar(params) {
      const data = await selectFilePathById(params)
      if (data && data.code === 200) {
        await dispatch.allusers.update({ imgUrl: data.data })
      }
    },
    // 根据uuid下载图片
    async getNewUserAvatarFile(params) {
      const data = await downloadFilePathById(params)
      console.log('根据uuid下载图片---->', data)
      // let blob = new Blob([data], { type: 'image/png' })
      // let url = URL.createObjectURL(blob)
      // // if (data && data.code === 200) {
      // await dispatch.allusers.update({ imgUrl: url })
      // }
    },
    // 获取所有的公司以及项目列表
    async getAllCompanyProjects() {
      const data = await getAllCompaniesProjects()
      data &&
        data.code === 200 &&
        (await dispatch.allusers.update({ allCompaniesProjects: data.data }))
    },
    // 获取指定角色的公司与项目
    async getUserCompanyProjects(params, { allusers }) {
      const { cUser } = allusers
      const data = await getUserCompanyProjects(params || cUser.id)
      if (data && data.code === 200) {
        await dispatch.allusers.update({ userCompaniesProjects: data.data })
      }
    },
    // 保存用户的公司与项目
    async saveBatchUser(params, { allusers }) {
      const data = await saveBatchUser(params)
      if (data && data.code === 200) {
        NotifySuccess(data.message)
      }
    },
    // 获取是否开启注册功能
    async getRegisterSwitch() {
      const data = await getRegisterSwitch()
      if (data && data.code === 200) {
        dispatch.allusers.update({ isRegister: data.data })
      }
    },
    // 设置注册功能
    async registerSwitch() {
      const data = await registerSwitch()
      if (data && data.code === 200) {
        NotifySuccess(data.message)
      }
    },
  }),
})

export default allusers
