import { Split, Card, Tabs } from 'uiw'
import Ongoing from './Ongoing'
import Pendings from './Pendings'
import Overdue from './Overdue'

export default function TableManage() {
  return (
    <div style={{ marginTop: 5 }}>
      <Split
        style={{ height: 400, border: '1px solid #d5d5d5', borderRadius: 3 }}>
        <div style={{ width: '100%', minWidth: 30 }}>
          <Card style={{ height: '100%' }}>
            <Tabs
              type="line"
              activeKey="1"
              onTabClick={(tab, key, e) => {
                console.log('=>', key, tab)
              }}>
              <Tabs.Pane label="所有待处理" key="1">
                <Pendings />
              </Tabs.Pane>
              <Tabs.Pane label="进行中" key="2">
                <Ongoing />
              </Tabs.Pane>
              <Tabs.Pane sequence="fadeIn up" label="已逾期" key="3">
                <Overdue />
              </Tabs.Pane>
              <Tabs.Pane
                label="更多"
                style={{ marginRight: 10 }}
                key="4"></Tabs.Pane>
            </Tabs>
          </Card>
        </div>
      </Split>
    </div>
  )
}
