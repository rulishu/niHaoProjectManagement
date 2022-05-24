import UserLogin from '@uiw-admin/user-login'
import { useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { useEffect } from 'react'
import { Notify } from 'uiw'

export let navigate

const UserLayout = () => {
  navigate = useNavigate()
  const dispatch = useDispatch()

  useEffect(() => {
    const search = window.location.search
    if (search) {
      const code = search.split('code=')[1]
      dispatch({ type: 'login/thirdLogin', payload: { code } })
      if (localStorage.getItem('token')) {
        this.props.history.push('/')
      }
    }
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
  // const goHome = () => {
  //   navigate('/home', { replace: true })
  //   localStorage.setItem('token', 'cccccc')
  //   localStorage.setItem('auth', JSON.stringify(authList || []))
  // }
  const thirdLogin = () => {
    dispatch({ type: 'login/getThirdLoginToken' })
  }
  return (
    <UserLogin
      projectName={'尼好程序开发测试项目管理软件'}
      buttons={[
        {
          title: '登录',
          htmlType: 'submit',
          type: 'primary',
          // onClick: goHome,
        },
        // {
        //   title: '第2方登录',
        // },
        {
          title: '第三方登录',
          type: 'pure',
          onClick: thirdLogin,
        },
      ]}
      api="/api/login"
      btnProps={{ type: 'primary' }}
      saveField={{
        username: 'userAccount',
        password: 'userPassword',
      }}
      onBefore={(store) => ({ ...store })}
      onSuccess={(data) => {
        if (data && data.code === 200) {
          Notify.success({ title: '登录成功' })
          const userDataAccount = localStorage.getItem('userData')
          localStorage.setItem('token', data?.token || '')
          if (data?.data?.user?.userAccount !== userDataAccount?.userAccount) {
            sessionStorage.clear()
          }

          dispatch({
            type: 'routeManagement/getRouters',
            payload: {
              callback: (data) =>
                localStorage.setItem('routes', JSON.stringify(data)),
            },
          })

          localStorage.setItem(
            'userData',
            JSON.stringify(data?.data?.user || {})
          )

          // localStorage.setItem('routes', JSON.stringify(data?.data?.menus || {}))
          let roleAuth = []
          data?.data?.menus.forEach((item) => {
            roleAuth.push(item.path)
          })
          localStorage.setItem('auth', JSON.stringify(authList || []))
          // localStorage.setItem('auth', JSON.stringify(roleAuth || []))
          // if (data?.data?.user?.isGuide) {
          //   navigate('/company', { replace: true })
          // } else {
          navigate('/home', { replace: true })
          // }
        } else {
          Notify.error({ title: '错误通知', description: data?.message })
        }
      }}
    />
  )
}
export default UserLayout
