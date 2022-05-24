import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useLocation, matchPath, useParams } from 'react-router-dom'
import { Breadcrumb } from 'uiw'

const Bread = (props) => {
  const { projectId } = useParams()
  const { routeMap } = props
  const location = useLocation()
  const paths = [...routeMap.breadcrumb.keys()].find((item) =>
    matchPath(item, location.pathname)
  )
  const domList = routeMap.breadcrumb.get(paths) || []
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
      {domList?.map((item, index) => {
        if (
          item.path !== '/projectList' &&
          item.path !== '/home' &&
          item.path !== '/todoList' &&
          item.path !== '/userHome/:userId'
        ) {
          return <Breadcrumb.Item key={index}>{item.name}</Breadcrumb.Item>
        }
        return <div key={index}></div>
      })}
      {projectId ? (
        <div style={{ marginLeft: '5px' }}>/ {proName}</div>
      ) : (
        <div></div>
      )}
    </Breadcrumb>
  )
}

export default Bread
