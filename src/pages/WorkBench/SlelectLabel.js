import { useEffect, useState } from 'react'
import { Row, Col, Card, Tabs, Steps } from 'uiw' // List,
import { useSelector, useDispatch } from 'react-redux'
import { ProTable, useTable } from '@uiw-admin/components'
// import styles from './index.module.less'

export default function SlelectLabel() {
  const dispatch = useDispatch()
  const {
    workbench: { memberList },
  } = useSelector((state) => state)
  const [tab, setTab] = useState(1)

  useEffect(() => {
    dispatch({
      type: 'workbench/memberOperator',
    })
  }, [dispatch])
  const token = localStorage.getItem('token')
  const table = useTable('/api/workbench/selectProjectPage', {
    // 格式化接口返回的数据，必须返回{total 总数, data: 列表数据}的格式
    formatData: (data) => {
      return {
        total: data?.data?.total,
        data: data?.data?.list,
      }
    },
    // 格式化查询参数 会接收到pageIndex 当前页  searchValues 表单数据
    query: (pageIndex, pageSize, searchValues) => {
      return {
        page: pageIndex,
        pageSize: pageSize,
        assignmentStatus: tab !== '5' ? tab : '',
        createId: tab === '5' ? 1 : '',
      }
    },
    requestOptions: {
      method: 'POST',
      headers: { Authorization: 'Bearer ' + token },
    },
  })

  return (
    <div>
      <Row gutter={20}>
        <Col fixed style={{ width: '75%' }}>
          <Card title="我的任务" bodyStyle={{ paddingTop: 0 }}>
            <Tabs
              // type="line"
              activeKey="1"
              style={{ marginBottom: 0 }}
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
              <Tabs.Pane label="我创建的" key="5"></Tabs.Pane>
            </Tabs>
            <div
              style={{
                height: 355,
                overflowX: 'hidden',
                overflowY: 'auto',
              }}>
              <ProTable
                onCell={(rowData) => {
                  window.location.href = `#/project/taskInfo/${rowData?.projectId}/${rowData?.assignmentId}`
                }}
                table={table}
                columns={[
                  {
                    title: '任务ID',
                    key: 'assignmentId',
                  },
                  {
                    title: '项目',
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
          </Card>
        </Col>
        <Col fixed style={{ width: '25%' }}>
          <Card title="成员动态" bordered={false}>
            <div
              style={{
                height: 355,
                overflowX: 'hidden',
                overflowY: 'auto',
                marginBottom: 10,
              }}>
              {/* <List bordered={false}>
                {memberList?.map((a) => {
                  return (
                    <List.Item href={`#/usersManagement/${a?.projectId}`}>
                      {a?.createTime}·{a?.operatingRecords}
                    </List.Item>
                  )
                })}
              </List> */}
              <Steps
                direction="vertical"
                progressDot
                status="error"
                current={memberList?.length}
                style={{ padding: '20px 0' }}>
                {memberList?.map((a, key) => {
                  return (
                    <Steps.Step
                      title={a?.createTime}
                      key={key}
                      onClick={() =>
                        (window.location.href = `#/usersManagement/${a?.projectId}`)
                      }
                      description={a?.operatingRecords}></Steps.Step>
                  )
                })}
              </Steps>
            </div>
          </Card>
        </Col>
      </Row>
    </div>
  )
}
