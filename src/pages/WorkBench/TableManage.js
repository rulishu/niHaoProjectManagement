import { useState } from 'react'
import { Row, Col, Card, Tabs, Button } from 'uiw'
import { ProTable, useTable } from '@uiw-admin/components'

export default function TableManage() {
  const [tab, setTab] = useState(1)
  const token = localStorage.getItem('token')
  const table = useTable('/api/workbench/selectAllProjectPage', {
    // 格式化接口返回的数据，必须返回{total 总数, data: 列表数据}的格式
    formatData: (data) => {
      return {
        total: data.data?.total,
        data: data.data,
      }
    },
    // 格式化查询参数 会接收到pageIndex 当前页  searchValues 表单数据
    query: (pageIndex, pageSize, searchValues) => {
      return {
        page: pageIndex,
        pageSize: pageSize,
        assignmentStatus: tab,
      }
    },
    requestOptions: {
      method: 'POST',
      headers: { Authorization: 'Bearer ' + token },
    },
  })

  return (
    <div>
      <div>
        <Row gutter={20}>
          <Col fixed style={{ width: '75%' }}>
            <Card
              title="所有项目"
              extra={
                <Button
                  basic
                  type="dark"
                  onClick={() => (window.location.href = '#/projectList')}>
                  更多
                </Button>
              }
              bodyStyle={{ paddingTop: 0 }}>
              <Tabs
                // type="line"
                activeKey="1"
                onTabClick={(tab, key, e) => {
                  setTab(tab)
                  table.onSearch()
                }}>
                <Tabs.Pane label="待处理" key="1"></Tabs.Pane>
                <Tabs.Pane label="进行中" key="2"></Tabs.Pane>
                <Tabs.Pane
                  sequence="fadeIn up"
                  label="已逾期"
                  key="4"></Tabs.Pane>
              </Tabs>
              <div
                style={{
                  height: 355,
                  overflowX: 'hidden',
                  overflowY: 'auto',
                }}>
                <ProTable
                  style={{ width: 900 }}
                  paginationProps={{
                    pageSizeOptions: [10, 20, 30],
                    pageSize: 10,
                  }}
                  table={table}
                  columns={[
                    {
                      title: '任务id',
                      key: 'assignmentId',
                    },
                    {
                      title: '项目名',
                      key: 'name',
                    },
                    {
                      title: '任务状态',
                      key: 'assignmentStatus',
                      render: (text) => {
                        if (text === 1) {
                          return <div>未开始</div>
                        } else if (text === 2) {
                          return <div>进行中</div>
                        } else if (text === 3) {
                          return <div>已完成</div>
                        } else if (text === 4) {
                          return <div>已逾期</div>
                        }
                      },
                    },
                    {
                      title: '指派人',
                      key: 'assigneeUserName',
                    },
                    {
                      title: '创建人',
                      key: 'createName',
                    },
                    {
                      title: '任务状态',
                      key: 'assignmentStatus',
                    },
                    {
                      title: '截止时间',
                      key: 'dueDate',
                    },
                  ]}
                />
              </div>
            </Card>
          </Col>
        </Row>
      </div>
    </div>
  )
}
