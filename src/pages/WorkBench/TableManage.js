import { useState } from 'react'
import { Row, Col, Card, Tabs, Button, Tag, Tooltip } from 'uiw'
import { ProTable, useTable } from '@uiw-admin/components'
import { useNavigate } from 'react-router-dom'
import styles from './index.module.less'

export default function TableManage() {
  const [tab, setTab] = useState(1)
  const token = localStorage.getItem('token')
  const navigate = useNavigate()
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
        assignmentStatus: Number(tab),
      }
    },
    requestOptions: {
      method: 'POST',
      headers: { Authorization: 'Bearer ' + token },
    },
  })
  const TableListUser = () => {
    return (
      <div
        style={{
          height: 355,
          overflowX: 'hidden',
          overflowY: 'auto',
        }}>
        <ProTable
          className={styles.mouseList}
          onCell={(rowData) => {
            navigate(
              `${rowData?.projectUrl}/task/taskInfo/${rowData?.assignmentId}`
            )
          }}
          paginationProps={{ style: { display: 'none' } }}
          style={{ width: 900 }}
          table={table}
          columns={[
            {
              title: '任务标题',
              key: 'assignmentTitle',
              width: 200,
              ellipsis: true,
              render: (address) => (
                <Tooltip placement="topLeft" content={address}>
                  {address}
                </Tooltip>
              ),
            },
            // {
            //   title: '任务ID',
            //   key: 'assignmentId',
            // },
            {
              title: '项目名',
              key: 'name',
            },
            {
              title: '任务状态',
              key: 'assignmentStatus',
              render: (text) => {
                if (text === 1) {
                  return <Tag color="#F95C2B">未开始</Tag>
                } else if (text === 2) {
                  return <Tag color="#008EF0">进行中</Tag>
                } else if (text === 3) {
                  return <Tag color="#28a745">已完成</Tag>
                } else if (text === 4) {
                  return <Tag color="#dc3545">已逾期</Tag>
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
              title: '截止时间',
              key: 'dueDate',
            },
          ]}
        />
      </div>
    )
  }

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
                  onClick={() => {
                    navigate(`/projectList`)
                  }}>
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
                <Tabs.Pane label="待处理" key="1">
                  {TableListUser()}
                </Tabs.Pane>
                <Tabs.Pane label="进行中" key="2">
                  {TableListUser()}
                </Tabs.Pane>
                <Tabs.Pane sequence="fadeIn up" label="已逾期" key="4">
                  {TableListUser()}
                </Tabs.Pane>
              </Tabs>
            </Card>
          </Col>
        </Row>
      </div>
    </div>
  )
}
