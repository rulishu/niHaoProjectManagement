import { Split, Card, Tabs } from 'uiw'
import Pendings from './Pendings'
import Ongoing from './Ongoing'
import Overdue from './Overdue'
import OurCreate from './OurCreate'
import { ShowSteps } from '@/components'
import { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'

export default function TableUser() {
  const dispatch = useDispatch()
  const {
    workbench: { listDynamic, taskId },
  } = useSelector((state) => state)
  useEffect(() => {
    // 优先判断是否存在ID
    dispatch({
      type: 'workbench/selectOperatingRecord',
      payload: { projectId: taskId },
    })
  }, [taskId, dispatch])

  const listDynamicData = () => {
    const newData = listDynamic?.map((item) => {
      const date = item?.slice(0, item?.indexOf(' '))
      const time = item?.slice(item?.indexOf(' ') + 1, item?.indexOf(','))
      const text = item?.substr(item?.indexOf(',') + 1)
      return { date, time, text }
    })
    let textArr = [],
      newDate = ''
    return newData
      .map((item, index) => {
        if (item?.date !== newDate) {
          newDate = item.date
          textArr = []
        }
        textArr.push(item)
        if (newData[index + 1]?.date !== newDate)
          return { ...item, dayDynamics: textArr }
        return undefined
      })
      .filter((s) => s)
  }

  return (
    <div style={{ marginTop: 5 }}>
      <Split
        style={{ height: 400, border: '1px solid #d5d5d5', borderRadius: 3 }}>
        <div style={{ width: '60%', minWidth: 30 }}>
          <Card style={{ height: '100%' }}>
            <Tabs
              type="line"
              activeKey="1"
              onTabClick={(tab, key, e) => {
                console.log('=>', key, tab)
              }}>
              <Tabs.Pane label="待处理" key="1">
                <Pendings />
              </Tabs.Pane>
              <Tabs.Pane label="进行中" key="2">
                <Ongoing />
              </Tabs.Pane>
              <Tabs.Pane sequence="fadeIn up" label="已逾期" key="3">
                <Overdue />
              </Tabs.Pane>
              <Tabs.Pane label="我创建的" key="4">
                <OurCreate />
              </Tabs.Pane>
              <Tabs.Pane label="更多" style={{ marginRight: 100 }}></Tabs.Pane>
            </Tabs>
          </Card>
        </div>
        <div style={{ width: '40%', minWidth: 100, height: '100%' }}>
          <Card title="成员动态" bordered={false} style={{ height: '100%' }}>
            <div
              style={{ height: 320, overflowX: 'hidden', overflowY: 'auto' }}>
              <ShowSteps listData={listDynamicData()} size="small" />
            </div>
          </Card>
        </div>
      </Split>
    </div>
  )
}
