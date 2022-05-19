import { Row, Col, Card, Button } from 'uiw'
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
        ...searchValues,
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
                      render: (text) => {
                        return <div>查看</div>
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
