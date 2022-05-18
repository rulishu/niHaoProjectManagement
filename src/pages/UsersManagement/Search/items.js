import { Button } from 'uiw'

export const columnsSearch = (handleEditTable) => [
  {
    title: '成员姓名',
    key: 'memberName',
    align: 'center',
  },
  {
    title: '成员角色',
    key: 'memberRole',
    align: 'center',
    render: (memberRole) => (
      <div style={{ textAlign: 'center' }}>
        {memberRole === 0
          ? '开发'
          : memberRole === 1
          ? '测试'
          : memberRole === 2
          ? '项目管理者'
          : ''}
      </div>
    ),
  },
  {
    title: '加入日期',
    key: 'joinTime',
    align: 'center',
  },
  // {
  //   title: '受限用户',
  //   key: 'code',
  //   align: 'center',
  // },
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
