import { Row, Col, Card, Button, Tabs } from 'uiw'
import { ProTable, useTable } from '@uiw-admin/components'
import { useDispatch } from 'react-redux'
import { useState } from 'react'
export default function TodoList() {
  const updateData = (payload) => {
    dispatch({
      type: 'todolist/update',
      payload,
    })
  }
  const dispatch = useDispatch()

  const [tab, setTab] = useState(1)
  const token = localStorage.getItem('token')
  const table = useTable('/api/ManagerTodoList/selectAll', {
    // 格式化接口返回的数据，必须返回{total 总数, data: 列表数据}的格式
    formatData: (data) => {
      return {
        data: data?.data,
      }
    },
    // 格式化查询参数 会接收到pageIndex 当前页  searchValues 表单数据
    query: (pageIndex, pageSize, searchValues) => {
      return {
        page: pageIndex,
        pageSize: pageSize,
        status: Number(tab),
      }
    },
    requestOptions: {
      method: 'POST',
      headers: { Authorization: 'Bearer ' + token },
    },
  })

  // 操作
  async function handleEditTable(type, record) {
    updateData({
      isView: type === 'view',
      tableType: type,
    })
    if (type === 'del') {
      dispatch({
        type: 'todolist/getStrutsSwitch',
        payload: { id: record?.id },
      })
    }
  }
  return (
    <div>
      <div>
        <Row gutter={20}>
          <Col fixed style={{ width: '75%' }}>
            <Card
              title="待办事项"
              extra={
                <Button
                  basic
                  type="dark"
                  onClick={() => (window.location.href = '#/TodoList')}>
                  更多
                </Button>
              }>
              <div
                style={{
                  maxHeight: 355,
                  overflowX: 'hidden',
                  overflowY: 'auto',
                }}>
                <Tabs
                  // type="line"
                  activeKey="1"
                  onTabClick={(tab, key, e) => {
                    setTab(tab)
                    table.onSearch()
                  }}>
                  <Tabs.Pane label="待办" key="0">
                    <ProTable
                      table={table}
                      paginationProps={{ style: { display: 'none' } }}
                      columns={[
                        {
                          title: '待办id',
                          key: 'id',
                        },

                        {
                          title: '待办内容',
                          key: 'doConnent',
                        },
                        {
                          title: '项目名称',
                          key: 'projectName',
                        },
                        {
                          title: '时间',
                          key: 'createTime',
                        },
                        {
                          title: '状态',
                          key: 'status',
                          render: (text) => {
                            if (text === 0) {
                              return <Tag color="#F95C2B">未开始</Tag>
                            } else if (text === 1) {
                              return <Tag color="#28a745">已完成</Tag>
                            }
                          },
                        },
                      ]}
                    />
                  </Tabs.Pane>
                  <Tabs.Pane label="已完成" key="1">
                    <ProTable
                      table={table}
                      paginationProps={{ style: { display: 'none' } }}
                      columns={[
                        {
                          title: '待办id',
                          key: 'id',
                        },

                    {
                      title: '待办内容',
                      key: 'doConnent',
                    },
                    {
                      title: '项目名称',
                      key: 'projectName',
                    },
                    {
                      title: '时间',
                      key: 'createTime',
                    },
                    {
                      title: '操作',
                      key: 'gender',
                      render: (text, key, rowData) => {
                        return (
                          <div>
                            <Button
                              size="small"
                              type="primary"
                              onClick={handleEditTable.bind(
                                this,
                                'del',
                                rowData
                              )}>
                              完毕
                            </Button>
                          </div>
                        )
                      },
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
