import { Button } from 'uiw'

export const columnsSearch = (handleEditTable) => [
  {
    title: '成员姓名',
    key: 'memberName',
    align: 'center',
    props: {
      widget: 'input',
      widgetProps: {
        placeholder: '输入成员姓名',
      },
    },
  },
  {
    title: '成员角色',
    key: 'memberRole',
    align: 'center',
    render: (memberRole) => (
      <div style={{ textAlign: 'center' }}>
        {memberRole === 1
          ? '开发'
          : memberRole === 2
          ? '测试'
          : memberRole === 3
          ? '项目管理者'
          : ''}
      </div>
    ),
  },
  {
    title: '加入日期',
    key: 'createTime',
    align: 'center',
  },
  {
    title: '访问到期日期',
    key: 'accessExpirationTime',
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
