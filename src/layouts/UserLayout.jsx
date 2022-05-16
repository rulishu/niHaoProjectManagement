import UserLogin from '@uiw-admin/user-login'
import { useNavigate } from 'react-router-dom'

export let navigate

const UserLayout = () => {
  navigate = useNavigate()

  return (
    <UserLogin
      projectName={'尼好程序开发测试项目管理软件'}
      buttons={[
        {
          title: '登录',
          htmlType: 'submit',
          type: 'primary',
        },
        // {
        //   title: '注册'
        // }
      ]}
      api="/api/login/login"
      btnProps={{ type: 'primary' }}
      saveField={{
        userName: 'userAccount',
        passWord: 'userPassword',
      }}
      onBefore={(store) => ({ ...store })}
      onSuccess={(data) => {
        if (data && data.code === 200) {
          const userDataAccount =
            JSON.parse(localStorage.getItem('userData')) || ''
          if (data?.data?.user?.userAccount !== userDataAccount?.userAccount) {
            sessionStorage.clear()
          }
          localStorage.setItem('userData', JSON.stringify(data?.data?.user))
          localStorage.setItem('token', JSON.stringify(data?.data?.token))
          localStorage.setItem('routes', JSON.stringify(data?.data?.menus))
          let roleAuth = []
          data?.data?.menus.forEach((item) => {
            roleAuth.push(item.path)
          })
          localStorage.setItem('auth', JSON.stringify(roleAuth || []))
          if (data?.data?.user?.isGuide) {
            navigate('/company', { replace: true })
          } else {
            navigate('/home', { replace: true })
          }
        }
      }}
    />
  )
}
export default UserLayout
