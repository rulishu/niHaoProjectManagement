import { Row, Col, Card, Button, Tag } from 'uiw'
import { ProTable, useTable } from '@uiw-admin/components'
export default function TodoList() {
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
        status: 0,
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
              title="待办事项"
              extra={
                <Button
                  basic
                  type="dark"
                  onClick={() => (window.location.href = '#/todoList')}>
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
                  table={table}
                  paginationProps={{ style: { display: 'none' } }}
                  columns={[
                    {
                      title: '待办ID',
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
              </div>
            </Card>
          </Col>
        </Row>
      </div>
    </div>
  )
}
