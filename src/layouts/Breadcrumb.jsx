import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useLocation, matchPath, useParams } from 'react-router-dom'
import { Breadcrumb } from 'uiw'

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
  const { proName } = projectlist
  useEffect(() => {
    if (projectId) {
      dispatch({
        type: 'projectlist/queryProject',
        payload: { id: projectId },
      })
    }
  }, [projectId, dispatch])
  return (
    <Breadcrumb>
      {projectId ? (
        <div style={{ marginRight: '5px' }}>{proName} /</div>
      ) : (
        <div></div>
      )}
      {domList?.map((item, index) => {
        const { path, name } = item
        if (
          path !== '/projectList' &&
          path !== '/home' &&
          path !== '/todoList' &&
          path !== '/userHome/:userId'
        ) {
          return <Breadcrumb.Item key={index}>{name}</Breadcrumb.Item>
        }
        return <div key={index}></div>
      })}
    </Breadcrumb>
  )
}

export default Bread
