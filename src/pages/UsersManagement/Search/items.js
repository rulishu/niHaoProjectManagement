import { Button } from 'uiw'

export const columnsSearch = (handleEditTable) => [
  {
    title: '成员姓名',
    key: 'code',
    align: 'center',
  },
  {
    title: '成员角色',
    key: 'code',
    align: 'center',
  },
  {
    title: '加入日期',
    key: 'code',
    align: 'center',
  },
  {
    title: '受限用户',
    key: 'code',
    align: 'center',
  },
  {
    title: '操作',
    key: 'edit',
    width: 200,
    align: 'center',
    render: (text, key, rowData) => (
      <div>
        <Button
          size="small"
          icon="edit"
          onClick={() => handleEditTable('edit', rowData)}>
          编辑
        </Button>
        <Button
          size="small"
          icon="user-delete"
          onClick={() => handleEditTable('del', rowData)}>
          删除
        </Button>
      </div>
    ),
  },
]
