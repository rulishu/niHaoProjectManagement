// import { useEffect } from 'react'
import { Row, Col, Card, Tabs, Button } from 'uiw'
// import { useSelector, useDispatch } from 'react-redux'
import { ProTable, useTable } from '@uiw-admin/components'

export default function TableManage() {
  // const dispatch = useDispatch()
  // const {
  //   home: {  },
  // } = useSelector((state) => state)

  // useEffect(() => {

  // }, [ dispatch])
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
    requestOptions: { method: 'POST' },
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
                  console.log('=>', key, tab)
                }}>
                <Tabs.Pane label="待处理" key="1"></Tabs.Pane>
                <Tabs.Pane label="进行中" key="2"></Tabs.Pane>
                <Tabs.Pane
                  sequence="fadeIn up"
                  label="已逾期"
                  key="3"></Tabs.Pane>
              </Tabs>
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
                    title: '任务名称',
                    key: 'registered',
                  },
                  {
                    title: '指派人',
                    key: 'phone',
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
            </Card>
          </Col>
        </Row>
      </div>
    </div>
  )
}
