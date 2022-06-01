import { Button, Divider } from 'uiw'

export const columnsSearch = (handleEditTable, userInfo) => [
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
        <Divider type="vertical" />
        <Button
          size="small"
          icon="edit"
          type="primary"
          onClick={() => handleEditTable('edit', rowData)}>
          编辑
        </Button>
        <Divider type="vertical" />
        <Button
          size="small"
          type="danger"
          icon="user-delete"
          disabled={rowData?.memberName === userInfo ? true : false}
          onClick={() => handleEditTable('del', rowData)}>
          删除
        </Button>
      </div>
    ),
  },
]
