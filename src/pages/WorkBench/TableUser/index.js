import { Split, Card, Tabs } from 'uiw'
import Pendings from './Pendings'
import Ongoing from './Ongoing'
import Overdue from './Overdue'
import OurCreate from './OurCreate'

export default function TableUser() {
  return (
    <div style={{ marginTop: 5 }}>
      <Split
        style={{ height: 400, border: '1px solid #d5d5d5', borderRadius: 3 }}>
        <div style={{ width: '70%', minWidth: 30 }}>
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
        <div style={{ width: '30%', minWidth: 100, height: '100%' }}>
          <Card
            title="成员动态"
            bordered={false}
            style={{ height: '100%' }}></Card>
        </div>
      </Split>
    </div>
  )
}
