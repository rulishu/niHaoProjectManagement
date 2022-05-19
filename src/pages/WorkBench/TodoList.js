import { Row, Col, Card, Button } from 'uiw'
import { ProTable, useTable } from '@uiw-admin/components'
import { useDispatch } from 'react-redux'

export default function TodoList() {
  const updateData = (payload) => {
    dispatch({
      type: 'todolist/update',
      payload,
    })
  }
  const dispatch = useDispatch()
  const token = localStorage.getItem('token')
  const table = useTable('/api/ManagerTodoList/selectAll', {
    // 格式化接口返回的数据，必须返回{total 总数, data: 列表数据}的格式
    formatData: (data) => {
      return {
        total: 100,
        data: data?.data,
      }
    },
    // 格式化查询参数 会接收到pageIndex 当前页  searchValues 表单数据
    query: (pageIndex, pageSize, searchValues) => {
      return {
        page: pageIndex,
        pageSize: pageSize,
        ...searchValues,
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
      // dispatch({
      //   type: 'todolist/getSelectAll',
      //   payload: { status: record?.status },
      // })
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
                <ProTable
                  style={{ width: 900 }}
                  paginationProps={{
                    pageSizeOptions: [10, 20, 30],
                    pageSize: 10,
                  }}
                  table={table}
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
                              {rowData.status === 1 ? '去处理' : '完毕'}
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
