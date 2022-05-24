export const items = (queryInfo, tableType) => [
  {
    label: '设备名称',
    key: 'equipmentName',
    widget: 'input',
    initialValue: queryInfo?.equipmentName,
    widgetProps: {},
    required: true,
    placeholder: '输入设备名称',
    rules: [{ required: true, message: '输入设备名称' }],
    span: '12',
  },
  {
    label: '设备类型',
    key: 'equipmentType',
    widget: 'input',
    initialValue: queryInfo?.equipmentType,
    widgetProps: {},
    required: true,
    placeholder: '输入设备类型',
    rules: [{ required: true, message: '输入设备类型' }],
    span: '12',
  },
  {
    label: '创建时间',
    key: 'createTime',
    widget: 'input',
    initialValue: queryInfo?.createTime,
    widgetProps: {},
    required: true,
    placeholder: '选择创建时间',
    hide: tableType !== 'view',
    readSpan: 1,
  },
  {
    label: '更新时间',
    key: 'updateTime',
    widget: 'input',
    initialValue: queryInfo?.updateTime,
    widgetProps: {},
    required: true,
    placeholder: '选择更新时间',
    hide: tableType !== 'view',
    readSpan: 1,
  },
]
