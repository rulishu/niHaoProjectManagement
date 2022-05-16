import { ProTable, useTable } from '@uiw-admin/components'
import { Split, Card, Tabs } from 'uiw'
export default function TableManage() {
  const table = useTable('/api/getList', {
    // 格式化接口返回的数据，必须返回{total 总数, data: 列表数据}的格式
    formatData: (data) => {
      return {
        total: data.total,
        data: data.data,
      }
    },
    // 格式化查询参数 会接收到pageIndex 当前页  searchValues 表单数据
    query: (pageIndex, pageSize, searchValues) => {
      return {
        page: pageIndex,
        pageSize,
        data: searchValues,
      }
    },
  })

  return (
    <div style={{ marginTop: 5 }}>
      <Split
        style={{ height: 400, border: '1px solid #d5d5d5', borderRadius: 3 }}>
        <div style={{ width: '70%', minWidth: 30 }}>
          <Card style={{ height: '100%' }}>
            <Tabs
              type="line"
              activeKey="1"
              onTabClick={(tab, key, e) => {
                console.log('=>', key, tab)
              }}>
              <Tabs.Pane label="所有待处理" key="1">
                <ProTable
                  table={table}
                  onPageChange={() => {
                    table.selection.unSelectAll()
                  }}
                  paginationProps={{
                    pageSizeOptions: [10, 20, 30],
                    pageSize: 10,
                    onShowSizeChange: (current, pageSize) => {
                      console.log(current, pageSize)
                    },
                  }}
                  columns={[
                    {
                      title: 'id',
                      key: 'id',
                    },
                    {
                      title: '项目',
                      key: 'name',
                    },
                    {
                      title: '任务名称',
                      key: 'info',
                    },
                    {
                      title: '创建人',
                      key: 'createname',
                    },
                    {
                      title: '截止时间',
                      key: 'endtime',
                    },
                    {
                      title: '状态',
                      key: 'state',
                      render: (index) => (
                        <div style={{ color: 'red' }}>{index} </div>
                      ),
                    },
                  ]}
                />
              </Tabs.Pane>
              <Tabs.Pane label="进行中" key="2">
                <ProTable
                  table={table}
                  onPageChange={() => {
                    table.selection.unSelectAll()
                  }}
                  paginationProps={{
                    pageSizeOptions: [10, 20, 30],
                    pageSize: 10,
                    onShowSizeChange: (current, pageSize) => {
                      console.log(current, pageSize)
                    },
                  }}
                  columns={[
                    {
                      title: 'id',
                      key: 'id',
                    },
                    {
                      title: '项目',
                      key: 'name',
                    },
                    {
                      title: '任务名称',
                      key: 'info',
                    },
                    {
                      title: '创建人',
                      key: 'createname',
                    },
                    {
                      title: '截止时间',
                      key: 'endtime',
                    },
                    {
                      title: '状态',
                      key: 'state',
                      render: (index) => (
                        <div style={{ color: 'red' }}>{index} </div>
                      ),
                    },
                  ]}
                />
              </Tabs.Pane>
              <Tabs.Pane sequence="fadeIn up" label="已逾期" key="3">
                <ProTable
                  table={table}
                  onPageChange={() => {
                    table.selection.unSelectAll()
                  }}
                  paginationProps={{
                    pageSizeOptions: [10, 20, 30],
                    pageSize: 10,
                    onShowSizeChange: (current, pageSize) => {
                      console.log(current, pageSize)
                    },
                  }}
                  columns={[
                    {
                      title: 'id',
                      key: 'id',
                    },
                    {
                      title: '项目',
                      key: 'name',
                    },
                    {
                      title: '任务名称',
                      key: 'info',
                    },
                    {
                      title: '创建人',
                      key: 'createname',
                    },
                    {
                      title: '截止时间',
                      key: 'endtime',
                    },
                    {
                      title: '状态',
                      key: 'state',
                      render: (index) => (
                        <div style={{ color: 'red' }}>{index} </div>
                      ),
                    },
                  ]}
                />
              </Tabs.Pane>
              {/* <Tabs.Pane label="更多" style={{marginRight:10}}>
              </Tabs.Pane> */}
            </Tabs>
          </Card>
        </div>
        <div style={{ width: '30%', minWidth: 20 }}>
          {/* <Card
            title="成员动态"
            bordered={false}
            style={{ height: '100%' }}></Card> */}
        </div>
      </Split>
    </div>
  )
}
