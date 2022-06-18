import { Row, Col, Card, Button, Tag, Tooltip } from 'uiw'
import { ProTable, useTable } from '@uiw-admin/components'
import { useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
// import styles from './index.module.less'

export default function TodoList() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
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
  function handleEditTable(type, record) {
    if (type === 'del') {
      dispatch({
        type: 'todolist/getStrutsSwitch',
        payload: { id: record?.id },
      })
    }
    table.onSearch()
  }
  return (
    <div>
      <div>
        <Row gutter={20}>
          <Col fixed style={{ width: '75%' }}>
            <Card
              title="待办事项"
              extra={
                <Button basic type="dark" onClick={() => navigate(`/todoList`)}>
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
                      width: 200,
                      ellipsis: true,
                      render: (doConnent) => (
                        <Tooltip placement="topLeft" content={doConnent}>
                          {doConnent}
                        </Tooltip>
                      ),
                    },
                    {
                      title: '项目名称',
                      key: 'projectName',
                      width: 200,
                      ellipsis: true,
                      render: (projectName) => (
                        <Tooltip placement="topLeft" content={projectName}>
                          {projectName}
                        </Tooltip>
                      ),
                    },
                    {
                      title: '时间',
                      key: 'createTime',
                      width: 180,
                    },
                    {
                      title: '状态',
                      key: 'status',
                      width: 80,
                      render: (text) => {
                        if (text === 0) {
                          return <Tag color="#F95C2B">未开始</Tag>
                        } else if (text === 1) {
                          return <Tag color="#28a745">已完成</Tag>
                        }
                      },
                    },
                    {
                      title: '操作',
                      key: 'edit',
                      width: 80,
                      align: 'center',
                      render: (text, key, rowData) => (
                        <div>
                          <Button
                            size="small"
                            type="primary"
                            onClick={() => handleEditTable('del', rowData)}>
                            完毕
                          </Button>
                        </div>
                      ),
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
