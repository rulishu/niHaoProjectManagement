export const items = (queryInfo) => [
  {
    label: '角色名称',
    key: 'roleName',
    widget: 'input',
    initialValue: queryInfo?.roleName,
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
    label: '权限字符',
    key: 'roleKey',
    widget: 'input',
    initialValue: queryInfo?.roleKey,
    widgetProps: {},
    required: true,
    placeholder: '请输入权限字符',
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
        message: '请输入权限字符,长度为2-20',
      },
    ],
  },
  {
    label: '角色顺序',
    key: 'roleSort',
    widget: 'input',
    initialValue: queryInfo?.roleSort,
    widgetProps: {},
    required: true,
    placeholder: '请输入角色顺序',
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
        message: '请输入角色顺序,长度为2-20',
      },
    ],
  },
  {
    label: '状态',
    key: 'status',
    widget: 'select',
    option: [
      { label: '停用', value: '1' },
      { label: '正常', value: '0' },
    ],
    initialValue: queryInfo?.status,
    span: '24',
  },
  {
    label: '备注',
    key: 'remark',
    widget: 'textarea',
    style: { maxWidth: '430px' },
    initialValue: queryInfo?.remark,
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
