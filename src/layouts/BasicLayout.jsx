import { useRef, useEffect } from 'react'
import { Badge, Icon } from 'uiw'
import BasicLayout, { useLayouts } from '@uiw-admin/basic-layouts'
import { PassWordChange } from '@/components'
import { Outlet, useNavigate } from 'react-router-dom'
import AuthPage from '@uiw-admin/authorized'
import { useSelector, useDispatch } from 'react-redux'
// import Bread from './Breadcrumb'
// import { BreadcrumbMap } from '@/utils/utils'
import styles from './index.module.less'

function BasicLayoutScreen(props = { routes: [] }) {
  const {
    todolist: { openTotal },
  } = useSelector((state) => state)
  const layouts = useLayouts()
  const navigate = useNavigate()
  const passwordRef = useRef()
  const dispatch = useDispatch()
  const userData = JSON.parse(localStorage.getItem('userData'))
  // eslint-disable-next-line react-hooks/exhaustive-deps
  function refresh(type) {
    type && window.location.reload()
  }

  useEffect(() => {
    // dispatch({
    //   type: 'routeManagement/getInfo',
    // })
    // dispatch({
    //   type: 'routeManagement/getRouters',
    // })
    refresh(false)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // const currUserRouteUrl = routesArr(JSON.parse(localStorage.getItem('routes')))
  const currUserRoute = JSON.parse(localStorage.getItem('routes'))

  let routes = props.routes

  if (currUserRoute) {
    routes = props.routes
  }

  const basicLayoutProps = {
    projectName: '尼好项目测试管理',
    // logo: require('./logo.png'),
    // 刷新权限
    onReloadAuth: async () => {
      await dispatch({ type: 'users/getUserPermis' })
      refresh(true)
    },
    hideLogoutButton: true,
    // hideReloadButton: true,
    // 修改密码以及其他操作在项目中进行
    menus: [
      {
        title: '修改密码',
        icon: 'setting',
        onClick: () => {
          passwordRef?.current?.open()
          layouts.closeMenu()
        },
      },
      {
        title: '团队管理',
        icon: 'usergroup-add',
        onClick: () => {
          navigate('/projectAuth', { replace: true })
        },
      },
      {
        title: '退出登录',
        icon: 'logout',
        onClick: async () => {
          await dispatch({ type: 'users/loginOut' })
          // sessionStorage.clear()
          // localStorage.clear()
          navigate('/login', { replace: true })
        },
      },
    ],
    profile: {
      avatar: userData?.uuid
        ? `/api/file/selectFile/${userData?.uuid}`
        : userData?.path || require('../assets/head.png'),
      userName: userData?.userAccount,
      menuLeft: (
        <>
          <div
            className={styles.title}
            onClick={() => {
              navigate('/home')
            }}>
            工作台
          </div>
          <div
            className={styles.title}
            onClick={() => {
              navigate('/projectList')
            }}>
            项目管理
          </div>
          <div
            className={styles.title}
            onClick={() => {
              navigate('/Authority/users')
            }}>
            系统管理
          </div>
          <div className={styles.title} onClick={() => navigate('/todoList')}>
            <Badge count={openTotal}>
              <Icon type="bell" color="#343a40" style={{ fontSize: 20 }} />
            </Badge>
          </div>

          {/* <div
            className={styles.title}
            onClick={() => {
              navigate('/project/task')
            }}>
            <Badge count={66}>
              <Icon type="bell" color="#343a40" style={{ fontSize: 20 }} />
            </Badge>
          </div> */}
        </>
      ),
    },
    layouts,
    // ...props,
    routes: routes,
    /** 头部 布局 */
    headerLayout: 'top',
    /** 头部背景色 */
    // headerBackground: "#";
    /** 头部字体颜色 */
    // headerFontColor?: string;
  }

  const token = localStorage.getItem('token')
  // 是否是没有左侧菜单的界面
  const isNoMenu = ['/projectList', '/home', '/todoList'].includes(
    props.router.location.pathname
  )
  return (
    <AuthPage redirectPath="/login" authority={!!token}>
      <BasicLayout
        {...basicLayoutProps}
        menuHide={isNoMenu}
        // headerBackground={isNoMenu ? '#f2f2f2' : '#fff'}
      >
        {/* <div style={{ paddingLeft: '10px', paddingBottom: '15px' }}>
          <Bread routeMap={new BreadcrumbMap(props.routes)} />
        </div> */}
        <Outlet />
        <PassWordChange refs={passwordRef} />
        {/* 新增项目弹出框 */}
      </BasicLayout>
    </AuthPage>
  )
}
export default BasicLayoutScreen
