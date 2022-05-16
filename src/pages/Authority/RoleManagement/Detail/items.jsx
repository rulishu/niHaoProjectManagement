export const items = (queryInfo) => [
  {
    label: '角色名称',
    key: 'name',
    widget: 'input',
    initialValue: queryInfo?.name,
    widgetProps: {},
    required: true,
    placeholder: '请输入角色名称',
    span: '24',
    rules: [
      {
        required: true,
        validator: (item) => {
          if (item.length < 2 || item.length > 30) {
            return false
          }
          return !!item
        },
        message: '请输入角色名称,长度为2-20',
      },
    ],
  },
  {
    label: '备注',
    key: 'desc',
    widget: 'textarea',
    style: { maxWidth: '430px' },
    initialValue: queryInfo?.desc,
    span: '24',
    rules: [
      {
        validator: (item) => {
          if (item && (item.length < 2 || item.length > 30)) {
            return false
          }
          return !!item
        },
        message: '请输入备注,长度为2-20',
      },
    ],
  },
]
