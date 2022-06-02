export const itemsDetail = (queryInfo, tableType) => [
  {
    label: '字典类型名称',
    key: 'dictName',
    widget: 'input',
    initialValue: queryInfo?.dictName,
    widgetProps: {},
    required: true,
    rules: [
      {
        required: true,
        validator: (value = '') => {
          if (value.length < 2 || value.length > 50) return false
          return true
        },
        message: '请输入字典类型名称,长度为2-50',
      },
    ],
    placeholder: '请输入字典类型名称',
    span: '24',
  },
  {
    label: '字典类型编码',
    key: 'dictType',
    widget: 'input',
    initialValue: queryInfo?.dictType,
    widgetProps: {
      // disabled: tableType !== 'add',
    },
    required: true,
    rules: [
      {
        required: true,
        validator: (value = '') => {
          if (value.length < 2 || value.length > 50) return false
          return true
        },
        message: '请输入字典类型编码,长度为2-50',
      },
    ],
    placeholder: '请输入字典类型编码',
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
    span: '24',
    required: true,
    rules: [
      {
        required: true,
        message: '请选择状态',
      },
    ],
  },
  {
    label: '备注',
    key: 'remark',
    placeholder: '请输入备注',
    widget: 'textarea',
    initialValue: queryInfo?.remark,
    span: '24',
  },
]
