import { Button } from 'uiw'
export const columns = (methods) => {
  const { getDataByIdSource, delDatSource, synchrodata } = methods
  return [
    {
      title: '迁移源名称',
      key: 'name',
      width: 200,
      props: {
        widget: 'input',
        widgetProps: {
          placeholder: '请输入迁移源名称',
        },
      },
    },
    {
      title: '迁移源类型',
      key: 'type',
      width: 120,
      ellipsis: true,
      align: 'center',
    },
    {
      title: '迁移源地址',
      key: 'url',
      width: 220,
      ellipsis: true,
      align: 'center',
    },
    {
      title: '创建时间',
      key: 'createTime',
      width: 180,
      ellipsis: true,
      align: 'center',
    },
    {
      title: '更新时间',
      key: 'updateTime',
      width: 180,
      ellipsis: true,
      align: 'center',
    },
    {
      title: '备注',
      key: 'remark',
      ellipsis: true,
      align: 'center',
    },
    {
      title: '操作',
      key: 'edit',
      width: 300,
      align: 'center',
      render: (text, key, rowData) => {
        // console.log(text, key, rowData);
        return (
          <div>
            <Button
              size="small"
              type="success"
              icon="eye-o"
              onClick={() => getDataByIdSource(rowData.id, 3)}
            />
            <Button
              size="small"
              type="primary"
              icon="edit"
              onClick={() => getDataByIdSource(rowData.id, 2)}
            />
            <Button
              size="small"
              type="danger"
              icon="delete"
              onClick={() => delDatSource(rowData.id)}
            />
            <Button
              size="small"
              type="warning"
              icon="reload"
              onClick={() => synchrodata(rowData)}>
              同步项目数据
            </Button>
          </div>
        )
      },
    },
  ]
}

export const formItem = (initialValue, type) => [
  {
    label: '名称',
    key: 'name',
    required: true,
    widget: 'input',
    initialValue: initialValue?.name,
    disabled: type === 3,
    widgetProps: {},
    span: '24',
  },
  {
    label: type === 1 ? 'token' : 'token(加密后)',
    key: 'token',
    required: true,
    widget: 'input',
    initialValue: initialValue?.token,
    disabled: type === 3,
    widgetProps: {},
    span: '24',
  },
  {
    label: '备注',
    key: 'remark',
    widget: 'input',
    initialValue: initialValue?.remark,
    disabled: type === 3,
    widgetProps: {},
    span: '24',
  },
  {
    label: '迁移类型',
    key: 'type',
    required: true,
    widget: 'select',
    initialValue: initialValue?.type,
    disabled: type === 3,
    widgetProps: {},
    span: '24',
    option: [
      { value: 10, label: 'GitLab' },
      { value: 20, label: 'GitHub' },
      { value: 30, label: '禅道' },
    ],
  },
  {
    label: '迁移路径',
    key: 'url',
    required: true,
    widget: 'input',
    initialValue: initialValue?.url,
    disabled: type === 3,
    widgetProps: {},
    span: '24',
  },
]
