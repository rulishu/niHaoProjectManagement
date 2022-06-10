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
  // const {
  //     workbench: { todoNotice },
  // } = useSelector((state) => state)
  const {
    routeManagement: { todoListCount, userData },
  } = useSelector((state) => state)
  const layouts = useLayouts()
  const navigate = useNavigate()
  const passwordRef = useRef()
  const dispatch = useDispatch()
  const { userAccount } = useParams()
  // const [userData, setuserData] = useState({})
  const [isError, setIsError] = useState(false)
  const fullPathName = props.router.location.pathname
  const pathName = `/${decodeURI(fullPathName.split('/')[1] || '')}`
  const todoNotices = sessionStorage.getItem('todoNotice')
  // 是否处于没用左侧菜单的页面
  const isNoMenu = ['/projectList', '/todoList'].includes(pathName)
  const isGetPageTeam = ['projectList', 'Authority'].includes(
    fullPathName.split('/').filter((s) => s)[0]
  )

  // eslint-disable-next-line react-hooks/exhaustive-deps
  async function refresh(type) {
    await dispatch({
      type: 'routeManagement/getInfo',
      // payload: {
      //   callback: (data) => {
      //     setuserData(data)
      //   },
      // },
    })
    type && window.location.reload()
  }
  //
  useEffect(() => {
    const pathArr = fullPathName.split('/').filter((s) => s)
    const url =
      pathArr.length === 1 ? `/${pathArr[0]}` : `/${pathArr[0]}/${pathArr[1]}`
    // 查询路由权限接口
    const getPageTeam = async () =>
      await dispatch({
        type: 'url/getPageTeam',
        payload: { params: { url } },
      })
    !isNoMenu && setIsError(!isRouteExist(pathName, userAccount))
    // 特护的几个鲁豫，强制不显示404
    if (isGetPageTeam) {
      dispatch({
        type: 'url/updateState',
        payload: { linkedType: 0 },
      })
      setIsError(false)
    }
    pathArr?.length && pathArr[0] !== 'Authority' && getPageTeam()
  }, [dispatch, isNoMenu, pathName, fullPathName, userAccount, isGetPageTeam])

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
    onLogoClick: () => {
      navigate(`/dashboard`, { replace: true })
    },
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
        title: '用户中心',
        icon: 'user',
        onClick: () => {
          navigate(`/${userData?.userName}`, { replace: true })
          layouts.closeMenu()
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
        userData?.avatar?.substring(0, 4) === 'http'
          ? userData?.avatar
          : userData?.avatar?.substring(0, 4) !== 'http' &&
            userData?.avatar !== ''
          ? `/api/file/selectFile/${userData?.avatar}`
          : userData?.path,
      userName: userData?.userName,
      menuLeft: (
        <>
          <div
            className={styles.title}
            onClick={() => {
              navigate(`/dashboard`)
            }}>
            工作台
          </div>
          <div
            className={styles.title}
            onClick={() => {
              navigate(`/projectList`)
            }}>
            项目管理
          </div>
          {userData?.admin === true ? (
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
          <div className={styles.title} onClick={() => navigate(`/todoList`)}>
            {status === 0 ? (
              <Badge
                count={
                  todoListCount !== 0 && todoNotices !== 0
                    ? todoListCount || todoNotices
                    : 0
                }>
                <Icon type="bell" color="#343a40" style={{ fontSize: 20 }} />
              </Badge>
            ) : (
              <Badge
                count={
                  openTotal !== 0 && todoNotices !== 0
                    ? openTotal || todoNotices
                    : 0
                }>
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

  // 判断是否处于一级路由
  // const isNoMenuN = fullPathName.split('/').length <= 2
  const pageName = pathName.split('/')[pathName.split('/').length - 1]
  return (
    <AuthPage redirectPath="/login" authority={!!token}>
      <BasicLayout
        {...basicLayoutProps}
        // menuHide={true}
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
