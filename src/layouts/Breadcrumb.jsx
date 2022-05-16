import { Breadcrumb } from 'uiw'
import { useLocation, matchPath } from 'react-router-dom'

const Bread = (props) => {
  const { routeMap } = props
  const location = useLocation()
  const paths = [...routeMap.breadcrumb.keys()].find((item) =>
    matchPath(item, location.pathname)
  )
  const domList = routeMap.breadcrumb.get(paths) || []
  return (
    <Breadcrumb>
      {domList?.map((item, index) => {
        return <Breadcrumb.Item key={index}>{item.name}</Breadcrumb.Item>
      })}
    </Breadcrumb>
  )
}

export default Bread
