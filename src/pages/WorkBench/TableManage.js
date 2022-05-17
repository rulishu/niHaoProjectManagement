import { useEffect } from 'react'
import { Row, Col, Card, Tabs, Button } from 'uiw'
import { useSelector, useDispatch } from 'react-redux'
import { ProTable, useTable } from '@uiw-admin/components'

export default function TableManage() {
  const dispatch = useDispatch()
  const {
    home: { taskId },
  } = useSelector((state) => state)

  useEffect(() => {
    dispatch({
      type: 'home/queryProject',
      payload: { record: taskId },
    })
    dispatch({
      type: 'home/selectOperatingRecord',
      payload: taskId,
    })
  }, [taskId, dispatch])
  const table = useTable('https://randomuser.me/api', {
    // 格式化接口返回的数据，必须返回{total 总数, data: 列表数据}的格式
    formatData: (data) => {
      return {
        total: 100,
        data: data.results,
      }
    },
    // 格式化查询参数 会接收到pageIndex 当前页  searchValues 表单数据
    query: (pageIndex, pageSize, searchValues) => {
      return {
        page: pageIndex,
        results: pageSize,
        ...searchValues,
      }
    },
    requestOptions: { method: 'GET' },
  })

  return (
    <div>
      <div>
        <Row gutter={20}>
          <Col span="16">
            <Card
              title={
                <Tabs
                  type="line"
                  activeKey="1"
                  onTabClick={(tab, key, e) => {
                    console.log('=>', key, tab)
                  }}>
                  <Tabs.Pane label="所有待处理" key="1"></Tabs.Pane>
                  <Tabs.Pane label="进行中" key="2">
                    {/* <Ongoing /> */}
                  </Tabs.Pane>
                  <Tabs.Pane sequence="fadeIn up" label="已延期" key="3">
                    {/* <Overdue /> */}
                  </Tabs.Pane>
                </Tabs>
              }
              extra={<Button>更多</Button>}>
              <ProTable
                bordered
                style={{ width: 900 }}
                paginationProps={{
                  pageSizeOptions: [10, 20, 30],
                  pageSize: 10,
                }}
                table={table}
                columns={[
                  {
                    title: '项目',
                    key: 'name',
                    render: (text) => {
                      return (
                        <div>
                          {text.title}.{text.first}
                          {text.last}
                        </div>
                      )
                    },
                  },
                  {
                    title: '任务名称',
                    key: 'registered',
                    render: (text) => {
                      return <div>{text.age}</div>
                    },
                  },
                  {
                    title: '任务状态',
                    key: 'registered',
                    render: (text) => {
                      return <div>{text.age}</div>
                    },
                  },
                  {
                    title: '创建人',
                    key: 'phone',
                  },
                  {
                    title: '任务状态',
                    key: 'gender',
                  },
                  {
                    title: '截止时间',
                    key: 'gender1',
                  },
                  {
                    title: '创建时间',
                    key: 'gender2',
                  },
                ]}
              />
            </Card>
          </Col>
        </Row>
      </div>
    </div>
  )
}
