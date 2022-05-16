import { Tabs } from 'uiw'
import { useDispatch, useSelector } from '@uiw-admin/router-control'
import List from './List'

const Demo = () => {
  const dispatch = useDispatch()
  const {
    issues_center: { activeKey },
  } = useSelector((state) => state)

  const updateData = (payload) => {
    dispatch({
      type: 'demo/updateState',
      payload,
    })
  }

  return (
    <div>
      <Tabs
        type="card"
        activeKey={activeKey}
        onTabClick={(activeKey, key, e) => {
          updateData({ activeKey })
        }}>
        <Tabs.Pane label="打开的任务" key="open">
          <List />
        </Tabs.Pane>
        <Tabs.Pane label="关闭的任务" key="close" />
        <Tabs.Pane label="所有任务" key="all" />
      </Tabs>
    </div>
  )
}

export default Demo
