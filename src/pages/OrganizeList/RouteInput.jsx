import { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Input } from 'uiw'
import styles from './index.module.less'

const RouteInput = (props) => {
  const { onChange, value } = props
  const {
    organizeList: {
      routeMatch: { title, type },
    },
  } = useSelector((state) => state)

  const dispatch = useDispatch()
  useEffect(() => {
    return dispatch({
      type: 'organizeList/updateState',
      payload: {
        routeMatch: { type: 0, title: '请输入正确的路由' },
      },
    })
  }, [dispatch])

  console.log('props', props)
  return (
    <div style={{ width: '100%' }}>
      <Input
        className={type === 2 && styles.routeInput}
        onChange={(e) => onChange(e)}
        value={value}
        placeholder="请输入路由"
      />
      <span
        style={{
          color: type === 1 ? 'green' : type === 2 ? 'red' : '#999',
          fontSize: 12,
        }}>
        {title}
      </span>
    </div>
  )
}
export default RouteInput
