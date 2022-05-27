import { createModel } from '@rematch/core'
import { getUserInfo, getUserInfoByAccount } from '@/servers/userHome'

/**
 * 待办事项
 */
export default createModel()({
  name: 'userHome',
  state: {
    user: {}, // 管理员查看用户首页内容
    userDynamics: [], //	用户动态
    userProjectList: [], // 用户项目
    userTask: [], // 用户任务
  },
  reducers: {
    update: (state, payload) => {
      return {
        ...state,
        ...payload,
      }
    },
  },
  effects: (dispatch) => {
    return {
      async getUserInfo(params, { userHome }) {
        const data = await getUserInfo(params)
        if (data && data.code === 200) {
          const { user, userDynamics, userProjectList, userTask } = data.data
          dispatch({
            type: 'userHome/update',
            payload: { user, userDynamics, userProjectList, userTask },
          })
        }
      },
      async getUserInfoByAccount(params, { userHome }) {
        const data = await getUserInfoByAccount(params)
        if (data && data.code === 200) {
          const { user, userDynamics, userProjectList, userTask } = data.data
          dispatch({
            type: 'userHome/update',
            payload: { user, userDynamics, userProjectList, userTask },
          })
        }
      },
    }
  },
})
