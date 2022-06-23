import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {
  useLocation,
  matchPath,
  useParams,
  useNavigate,
} from 'react-router-dom'
import { Breadcrumb, Avatar, Button } from 'uiw'
import styles from './index.module.less'

const Bread = (props) => {
  const { projectId } = useParams()
  const { routeMap } = props
  const location = useLocation()
  const searchStr = location.pathname.indexOf('/Authority/') !== -1
  const searchPath = () => {
    if (searchStr) {
      const paths = [...routeMap.breadcrumb.keys()].find((item) => {
        return item === location.pathname
      })
      return paths
    } else {
      const paths = [...routeMap.breadcrumb.keys()].find((item) =>
        matchPath(item, location.pathname)
      )
      return paths
    }
  }
  const domList = routeMap.breadcrumb.get(searchPath()) || []
  const dispatch = useDispatch()
  const { projectlist } = useSelector((state) => state)
  const { proName, projectAvatar, projectUrl } = projectlist
  useEffect(() => {
    if (projectId) {
      dispatch({
        type: 'projectlist/queryProject',
        payload: { id: projectId },
      })
    }
  }, [projectId, dispatch])
  const navigate = useNavigate()

  // 点击项目名称跳转
  const onClickitem = () => {
    navigate(`${projectUrl}`)
  }
  // 点击里程碑/任务管理跳转
  const onClickthree = () => {
    const issue = domList.at(1).name
    if (issue === '任务列表') {
      navigate(`${projectUrl}/task`)
    } else if (issue === '里程碑') {
      navigate(`${projectUrl}/milestone`)
    } else if (issue === '标签管理') {
      navigate(`${projectUrl}/labels`)
    }
  }
  const AvatarImage = (
    <Avatar size="mini" src={`/api/file/selectFile/${projectAvatar}`} />
  )
  return (
    <Breadcrumb className={styles.breadcrumbBox}>
      {projectId ? (
        <div>
          {projectAvatar ? AvatarImage : ''}
          <Button onClick={() => onClickitem()} type="link">
            {proName}
          </Button>
          /
        </div>
      ) : (
        <div></div>
      )}
      {domList?.length === 3 ? (
        <Breadcrumb.Item>
          <Button
            type="link"
            className={styles.itemText}
            onClick={() => onClickthree()}>
            {domList.at(1).name}
          </Button>
          <span style={{ marginRight: 5 }}>/</span> {domList.at(2).name}
        </Breadcrumb.Item>
      ) : (
        domList?.map((item, index) => {
          const { path, name } = item
          if (
            path !== '/projectList' &&
            path !== '/dashboard' &&
            path !== '/todoList' &&
            path !== '/:userAccount'
          ) {
            return (
              <Breadcrumb.Item
                key={index}
                style={{ marginLeft: 7, fontSize: 14 }}>
                {name}
              </Breadcrumb.Item>
            )
          }
          return <div key={index}></div>
        })
      )}
    </Breadcrumb>
  )
}

export default Bread
