import { useRef, useState, useEffect } from 'react'
import { Badge, Icon } from 'uiw'
import BasicLayout, { useLayouts } from '@uiw-admin/basic-layouts'
import { PassWordChange, ErrorPage } from '@/components'
import { Outlet, useNavigate, useParams } from 'react-router-dom'
import AuthPage from '@uiw-admin/authorized'
import { useSelector, useDispatch } from 'react-redux'
import Bread from './Breadcrumb'
import { BreadcrumbMap } from '@/utils/utils'
import { isRouteExist } from '@/utils/routeRequest'
import styles from './index.module.less'
import './index.css'

function BasicLayoutScreen(props = { routes: [] }) {
  const {
    todolist: { openTotal, status },
    url: { linkedType, url: breadUrl },
  } = useSelector((state) => state)
  const {
    workbench: { todoNotice },
  } = useSelector((state) => state)
  const layouts = useLayouts()
  const navigate = useNavigate()
  const passwordRef = useRef()
  const dispatch = useDispatch()
  const { userAccount } = useParams()
  const [userInfo, setUserInfo] = useState({})
  const [isError, setIsError] = useState(false)
  const pathName = `/${decodeURI(
    props.router.location.pathname.split('/')[1] || ''
  )}`
  const userName = JSON.parse(sessionStorage.getItem('userName'))
  const todoNotices = sessionStorage.getItem('todoNotice')

  // eslint-disable-next-line react-hooks/exhaustive-deps
  async function refresh(type) {
    await dispatch({
      type: 'routeManagement/getInfo',
      payload: {
        callback: (data) => {
          setUserInfo(data)
        },
      },
    })
    type && window.location.reload()
  }
  //
  useEffect(() => {
    const pathArr = pathName.split('/').filter((s) => s)
    const url =
      pathArr.length === 1 ? `/${pathArr[0]}` : `/${pathArr[0]}/${pathArr[1]}`
    // 查询路由权限接口
    const getPageTeam = async () =>
      await dispatch({
        type: 'url/getPageTeam',
        payload: { params: { url } },
      })
    setIsError(!isRouteExist(pathName, userAccount))
    pathArr?.length && pathArr[0] !== 'Authority' && getPageTeam()
  }, [dispatch, pathName, userAccount])

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
    // onLogoClick: () => {
    //   navigate(`/${userName}`)
    // },
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
      // {
      //   title: '团队管理',
      //   icon: 'usergroup-add',
      //   onClick: () => {
      //     navigate(`/${userAccount}/team`)
      //   },
      // },
      {
        title: '用户中心',
        icon: 'user',
        onClick: () => {
          navigate(`/${userInfo?.userName}`, { replace: true })
        },
      },
      {
        title: '退出登录',
        icon: 'logout',
        onClick: async () => {
          await dispatch({ type: 'users/loginOut' })
          sessionStorage.clear()
          localStorage.clear()
          navigate('/login', { replace: true })
        },
      },
    ],
    profile: {
      avatar:
        userInfo?.avatar?.substring(0, 4) === 'http'
          ? userInfo?.avatar
          : userInfo?.avatar?.substring(0, 4) !== 'http' &&
            userInfo?.avatar !== ''
          ? `/api/file/selectFile/${userInfo?.avatar}`
          : userInfo?.path || require('../assets/head.png'),
      userName: userInfo?.userName,
      menuLeft: (
        <>
          <div
            className={styles.title}
            onClick={() => {
              navigate(`/${userName}/dashboard`)
            }}>
            工作台
          </div>
          <div
            className={styles.title}
            onClick={() => {
              navigate(`/${userName}/projectList`)
            }}>
            项目管理
          </div>
          {userInfo?.admin === true ? (
            <div
              className={styles.title}
              onClick={() => {
                navigate('/Authority/users')
              }}>
              系统管理
            </div>
          ) : (
            ''
          )}
          <div
            className={styles.title}
            onClick={() => navigate(`/${userName}/todoList`)}>
            {status === 0 ? (
              <Badge count={todoNotice || todoNotices}>
                <Icon type="bell" color="#343a40" style={{ fontSize: 20 }} />
              </Badge>
            ) : (
              <Badge count={openTotal || todoNotices}>
                <Icon type="bell" color="#343a40" style={{ fontSize: 20 }} />
              </Badge>
            )}
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
  // 是否是没有左侧菜单的界面
  const isNoMenu = ['/projectList', '/home', '/todoList'].includes(pathName)

  const isNoMenuN =
    !![
      '/userHome',
      '/:userId',
      'todoList',
      '/projectList',
      '/dashboard',
      '/tissue',
    ].filter((item) => pathName?.search(item) !== -1).length ||
    pathName.split('/').length <= 2
  const pageName = pathName.split('/')[pathName.split('/').length - 1]
  return (
    <AuthPage redirectPath="/login" authority={!!token}>
      <BasicLayout
        {...basicLayoutProps}
        menuHide={isNoMenu || isNoMenuN}
        // headerBackground={isNoMenu ? '#f2f2f2' : '#fff'}
      >
        {linkedType !== -1 && !isError ? (
          <>
            {pageName !== 'projectList' &&
            `/${pageName}` !== breadUrl &&
            pageName !== 'dashboard' &&
            pageName !== 'todoList' ? (
              <div style={{ paddingLeft: '10px', paddingBottom: '15px' }}>
                <Bread routeMap={new BreadcrumbMap(props.routes)} />
              </div>
            ) : null}
            <Outlet />
            <PassWordChange refs={passwordRef} />
          </>
        ) : (
          <ErrorPage />
        )}
        {/* 新增项目弹出框 */}
      </BasicLayout>
    </AuthPage>
  )
}
export default BasicLayoutScreen
