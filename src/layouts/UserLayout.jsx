import UserLogin from '@uiw-admin/user-login'
import { useNavigate } from 'react-router-dom'

export let navigate

const UserLayout = () => {
  navigate = useNavigate()
  let authList = [
    '/TodoList',
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
        //   title: '注册'
        // }
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
          const userDataAccount = localStorage.getItem('userData')
          if (data?.data?.user?.userAccount !== userDataAccount?.userAccount) {
            sessionStorage.clear()
          }
          localStorage.setItem('userData', JSON.stringify(data?.data?.user))
          localStorage.setItem('token', data?.token || '')
          localStorage.setItem('routes', JSON.stringify(data?.data?.menus))
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
        }
      }}
    />
  )
}
export default UserLayout
