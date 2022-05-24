import { Button, Tag } from 'uiw'

export const columnsSearch = (handleEditTable) => [
  {
    title: '部门名称',
    key: 'deptName',
    align: 'center',
    props: {
      widget: 'input',
      widgetProps: {
        placeholder: '输入部门名称',
      },
    },
  },
  {
    title: '排序',
    key: 'orderNum',
    align: 'center',
  },
  {
    title: '负责人',
    key: 'leader',
    align: 'center',
  },
  {
    title: '联系电话',
    key: 'phone',
    align: 'center',
  },
  {
    title: '邮箱',
    key: 'email',
    align: 'center',
  },
  {
    title: '部门状态',
    key: 'status',
    align: 'center',
    props: {
      widget: 'select',
      widgetProps: {
        placeholder: '输入部门状态',
      },
      option: [
        { label: '全部', value: 1 },
        { label: '正常', value: 2 },
        { label: '停用', value: 3 },
      ],
    },
    render: (code) => {
      return (
        <div>
          {code === '1' ? (
            <Tag light color="#dc3545">
              停用
            </Tag>
          ) : (
            <Tag light color="#28a745">
              正常
            </Tag>
          )}
        </div>
      )
    },
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
          type="success"
          icon="edit"
          onClick={() => handleEditTable('edit', rowData)}>
          编辑
        </Button>
        <Button
          size="small"
          type="danger"
          icon="user-delete"
          onClick={() => handleEditTable('del', rowData)}>
          删除
        </Button>
      </div>
    ),
  },
]
