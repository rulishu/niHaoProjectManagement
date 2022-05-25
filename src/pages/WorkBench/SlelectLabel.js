import { useEffect, useState } from 'react'
import { Row, Col, Card, Tabs, Steps, Tag, Tooltip } from 'uiw' // List,
import { useSelector, useDispatch } from 'react-redux'
import { ProTable, useTable } from '@uiw-admin/components'
import styles from './index.module.less'

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
        data: data?.data,
      }
    },
    // 格式化查询参数 会接收到pageIndex 当前页  searchValues 表单数据
    query: (pageIndex, pageSize, searchValues) => {
      return {
        page: pageIndex,
        pageSize: pageSize,
        assignmentStatus: tab !== '5' ? Number(tab) : '',
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
              <Tabs.Pane label="待处理" key="1">
                <div
                  style={{
                    height: 355,
                    overflowX: 'hidden',
                    overflowY: 'auto',
                  }}>
                  <ProTable
                    paginationProps={{ style: { display: 'none' } }}
                    onCell={(rowData) => {
                      window.location.href = `#/project/taskInfo/${rowData?.projectId}/${rowData?.assignmentId}`
                    }}
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
                        title: '项目',
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
              </Tabs.Pane>
              <Tabs.Pane label="进行中" key="2">
                <div
                  style={{
                    height: 355,
                    overflowX: 'hidden',
                    overflowY: 'auto',
                  }}>
                  <ProTable
                    paginationProps={{ style: { display: 'none' } }}
                    onCell={(rowData) => {
                      window.location.href = `#/project/taskInfo/${rowData?.projectId}/${rowData?.assignmentId}`
                    }}
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
                        title: '项目',
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
              </Tabs.Pane>
              <Tabs.Pane label="已逾期" key="4">
                <div
                  style={{
                    height: 355,
                    overflowX: 'hidden',
                    overflowY: 'auto',
                  }}>
                  <ProTable
                    paginationProps={{ style: { display: 'none' } }}
                    onCell={(rowData) => {
                      window.location.href = `#/project/taskInfo/${rowData?.projectId}/${rowData?.assignmentId}`
                    }}
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
                        title: '项目',
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
              </Tabs.Pane>
              <Tabs.Pane label="我创建的" key="5">
                <div
                  style={{
                    height: 355,
                    overflowX: 'hidden',
                    overflowY: 'auto',
                  }}>
                  <ProTable
                    paginationProps={{ style: { display: 'none' } }}
                    onCell={(rowData) => {
                      window.location.href = `#/project/taskInfo/${rowData?.projectId}/${rowData?.assignmentId}`
                    }}
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
                        title: '项目',
                        key: 'name',
                      },
                      {
                        title: '任务状态',
                        key: 'assignmentStatus',
                        align: 'center',
                        render: (text, key, rowData) => (
                          <div>
                            {text === 1 ? (
                              <Tag color="#F95C2B">未开始</Tag>
                            ) : text === 2 ? (
                              <Tag color="#008EF0">进行中</Tag>
                            ) : text === 3 ? (
                              <Tag color="#28a745">已完成</Tag>
                            ) : text === 4 ? (
                              <Tag color="#dc3545">已逾期</Tag>
                            ) : (
                              ''
                            )}
                          </div>
                        ),
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
              </Tabs.Pane>
            </Tabs>
          </Card>
        </Col>
        <Col fixed style={{ width: '25%' }}>
          <Card title="成员动态" bordered={false}>
            <div className={styles.dynamicList}>
              {/* <List bordered={false}>
                {memberList?.map((a) => {
                  return (
                    <List.Item href={`#/usersManagement/${a?.projectId}`}>
                      {a?.createTime}·{a?.operatingRecords}
                    </List.Item>
                  )
                })}
              </List> */}
              {/* /project/taskInfo/:projectId/:idassignmentId */}
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
                      className={styles.dynamicListLi}
                      onClick={() =>
                        (window.location.href = `#/project/taskInfo/${a?.projectId}/${a?.assignmentId}`)
                      }
                      description={
                        <div className={styles.dynamicListLi}>
                          {a?.operatingRecords}
                        </div>
                      }></Steps.Step>
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
