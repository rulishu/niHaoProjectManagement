export const items = (queryInfo, TreeData) => [
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
  },
  {
    label: '状态',
    key: 'status',
    widget: 'select',
    option: [
      { label: '正常', value: '0' },
      { label: '停用', value: '1' },
    ],
    initialValue: queryInfo?.status,
    required: true,
    span: '24',
    rules: [
      {
        required: true,
        message: '请选择状态',
      },
    ],
  },
  {
    label: '菜单权限',
    key: 'menuIds',
    widget: 'TreeData',
    initialValue: queryInfo?.menuIds,
    span: '24',
  },
  {
    label: '备注',
    key: 'remark',
    widget: 'textarea',
    placeholder: '请输入备注',
    style: { maxWidth: '430px' },
    initialValue: queryInfo?.remark,
    span: '24',
  },
]
