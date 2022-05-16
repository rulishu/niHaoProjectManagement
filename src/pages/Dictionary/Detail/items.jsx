export const itemsDetail = (queryInfo, tableType) => [
  {
    label: '字典类型编码',
    key: 'dictTypeCode',
    widget: 'input',
    initialValue: queryInfo?.dictTypeCode,
    widgetProps: {
      disabled: tableType !== 'add',
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
    label: '字典类型名称',
    key: 'dictTypeName',
    widget: 'input',
    initialValue: queryInfo?.dictTypeName,
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
    label: '数据状态',
    key: 'deleteMark',
    widget: 'radio',
    initialValue: queryInfo?.deleteMark,
    hide: tableType === 'add',
    option: [
      { value: 0, label: '正常' },
      { value: 2, label: '停用' },
    ],
  },
]
