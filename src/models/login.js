import { history } from '@uiw-admin/router-control'
import { createModel } from '@rematch/core'
import {
  submitLogin,
  getThirdLoginToken,
  authorAndLogin,
  register,
  getRegisterSwitch,
  emailValidityChecks,
} from '../servers/login'
import { getInfo } from '../servers/menumanagement'

import { Notify } from 'uiw'

const login = createModel()({
  name: 'login',
  state: {
    userData: null,
    token: null,
    isLogin: true,
    isRegister: false,
    submitLoading: false, //登录按钮loading样式
    registerLoading: false, //注册按钮loading样式
  },
  reducers: {
    updateState: (state, payload) => ({
      ...state,
      ...payload,
    }),
  },
  effects: (dispatch) => ({
    async submit() {
      dispatch.login.updateState({
        token: '测试2',
      })
      sessionStorage.setItem('auth', JSON.stringify(['/home', '/dac']))
      history.push('/home') // this.updateState()
      // await login({ username: 'test', password: 'www' });
      // dispatch.sharks.increment(payload)
      // `dispatch.s` will suggest `sharks`
    },

    //登录
    async submitLogin(param) {
      let logindata = { username: param.username, password: param.password }
      const data = await submitLogin(logindata)

      dispatch.login.updateState({
        submitLoading: false,
      })

      if (data && data.code === 200) {
        const lastPath =
          JSON.parse(localStorage.getItem('lastPath')) !== '/login'
            ? JSON.parse(localStorage.getItem('lastPath'))
            : null
        param?.setIsOk && param.setIsOk(false)
        Notify.success({ title: '登录成功' })
        // const userDataAccount = localStorage.getItem('userData')
        localStorage.setItem('token', data?.token || '')
        // if (data?.data?.user?.userAccount !== userDataAccount?.userAccount) {
        //   sessionStorage.clear()
        // }
        dispatch({
          type: 'routeManagement/getRouters',
          payload: {
            callback: (data) =>
              localStorage.setItem('routes', JSON.stringify(data)),
          },
        })

        const userData = await getInfo()
        sessionStorage.setItem(
          'userName',
          JSON.stringify(userData?.user.userName)
        )
        sessionStorage.setItem('userAccount', userData?.user.userName)
        localStorage.setItem('userAccount', userData?.user.userName)
        localStorage.setItem('userData', JSON.stringify(userData?.user || {}))
        let roleAuth = []
        data?.data?.menus.forEach((item) => {
          roleAuth.push(item.path)
        })
        let authList = [
          '/todoList',
          '/tableList',
          '/issues-center/:id',
          '/home',
          '/demo',
          '/dom',
          '/dom/*',
          '/dom/milestone',
          '/milestone',
          '/milestone/*',
          '/project',
          '/project/*',
          '/projectList',
          '/project/task',
          '/project/newIssue',
          '/exceptions',
          '/exceptions/403',
          '/exceptions/404',
          '/exceptions/500',
          '/*',
        ]
        localStorage.setItem('auth', JSON.stringify(authList || []))
        let navigate = param.navigate
        await navigate(lastPath || `/dashboard`, {
          replace: true,
        })
        return data
      }
    },

    //第三方登录
    async getThirdLoginToken() {
      dispatch.login.updateState({
        submitLoading: true,
      })
      const data = await getThirdLoginToken()
      if (data && data.data) {
        window.location.href = data.data.gitLabUrl
        dispatch.login.updateState({
          submitLoading: false,
        })
      } else {
        dispatch.login.updateState({
          submitLoading: false,
        })
      }
    },

    //第三方登录
    async authorAndLogin(param) {
      const data = await authorAndLogin(param)
      if (data && data.code === 200) {
        localStorage.setItem('token', data.data.token)
        // let url = window.location.host
        // url = url.replace(/(\?|#)[^'"]*/, '')
        window.location.href = `/#/dashboard`
        if (localStorage.getItem('token')) {
          history.push(`/dashboard`)
          const userData = await getInfo()
          sessionStorage.setItem(
            'userName',
            JSON.stringify(userData?.user.userName)
          )
          sessionStorage.setItem('userAccount', userData?.user.userName)
          localStorage.setItem('userAccount', userData?.user.userName)
          localStorage.setItem('userData', JSON.stringify(userData?.user || {}))
        }
        dispatch({
          type: 'routeManagement/getRouters',
          payload: {
            callback: (data) =>
              localStorage.setItem('routes', JSON.stringify(data)),
          },
        })
      }
    },

    //注册新用户
    async register(param) {
      const data = await register(param)
      if (data && data.code === 200) {
        Notify.success({
          title: '成功通知',
          description: data?.message + '请登录!',
        })
        dispatch.login.updateState({
          isLogin: true,
          registerLoading: false,
        })
      } else {
        dispatch.login.updateState({
          registerLoading: false,
        })
      }
    },

    //注册功能开启设置
    async getRegisterSwitch() {
      const data = await getRegisterSwitch()
      if (data && data.code === 200) {
        dispatch.login.updateState({
          isRegister: data.data,
        })
      }
    },

    //注册邮箱
    async emailValidityChecks(payload) {
      const { param, callback } = payload
      const data = await emailValidityChecks(param)
      if (data && data.code === 200) {
        callback && callback(3)
        dispatch.login.updateState({
          isRegister: data.data,
        })
      }
      if (data && data.code === 400) {
        callback && callback(2)
      }
    },
  }),
})
export default login
