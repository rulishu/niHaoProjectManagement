import { ProTable, useTable } from '@uiw-admin/components'
export default function Overdue() {
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
        results: pageSize,
        ...searchValues,
      }
    },
    requestOptions: { method: 'POST' },
  })

  return (
    <ProTable
      paginationProps={{
        pageSizeOptions: [10, 20, 30],
        pageSize: 10,
      }}
      table={table}
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
          render: (index) => <div style={{ color: 'red' }}>{index} </div>,
        },
      ]}
    />
  )
}
