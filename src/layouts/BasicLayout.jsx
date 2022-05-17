import { useRef, useEffect } from 'react'
import { Badge, Icon } from 'uiw'
import BasicLayout, { useLayouts } from '@uiw-admin/basic-layouts'
import { PassWordChange } from '@/components'
import { Outlet, useNavigate } from 'react-router-dom'
import AuthPage from '@uiw-admin/authorized'
import Bread from './Breadcrumb'
import { BreadcrumbMap } from '@/utils/utils'
import { useDispatch } from 'react-redux'
import ProjectManagement from '../components/ProjectManagement'
// import styles from './index.module.less'

function BasicLayoutScreen(props = { routes: [] }) {
  const layouts = useLayouts()
  const navigate = useNavigate()
  const passwordRef = useRef()
  const dispatch = useDispatch()
  const userData = localStorage.getItem('userData')

  const updateDataGlobal = (payload) => {
    dispatch({
      type: 'global/updateState',
      payload,
    })
  }

  // eslint-disable-next-line react-hooks/exhaustive-deps
  function refresh(type) {
    type && window.location.reload()
  }

  useEffect(() => {
    dispatch({
      type: 'routeManagement/getInfo',
    })
    dispatch({
      type: 'routeManagement/getRouters',
    })
    refresh(false)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // const currUserRouteUrl = routesArr(JSON.parse(localStorage.getItem('routes')))
  const currUserRoute = localStorage.getItem('routes')
  let routes = props.routes

  if (currUserRoute) {
    routes = props.routes
  }

  const basicLayoutProps = {
    projectName: '尼好项目测试管理',
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
            style={{ marginRight: 15 }}
            onClick={() => {
              updateDataGlobal({ drawerVisible: true })
            }}>
            新增项目
          </div>

          <div
            style={{ marginRight: 15, marginTop: 12, cursor: 'pointer' }}
            onClick={() => navigate('/TodoList')}>
            <Icon type="save" color="#343a40" style={{ fontSize: 20 }} />
          </div>

          <div
            style={{ marginRight: 15, cursor: 'pointer' }}
            onClick={() => {
              navigate('/project/task')
            }}>
            <Badge count={66}>
              <Icon type="bell" color="#343a40" style={{ fontSize: 20 }} />
            </Badge>
          </div>
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
  return (
    <AuthPage redirectPath="/login" authority={!!token}>
      <BasicLayout
        {...basicLayoutProps}
        menuHide={['/projectList'].includes(props.router.location.pathname)}>
        <div style={{ paddingLeft: '10px', paddingBottom: '15px' }}>
          <Bread routeMap={new BreadcrumbMap(props.routes)} />
        </div>
        <Outlet />
        <PassWordChange refs={passwordRef} />
        <ProjectManagement></ProjectManagement>
        {/* 新增项目弹出框 */}
      </BasicLayout>
    </AuthPage>
  )
}
export default BasicLayoutScreen
