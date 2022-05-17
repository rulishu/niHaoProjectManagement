export const items = (queryInfo) => [
  // userId
  {
    label: '岗位名称',
    key: 'userId',
    widget: 'input',
    initialValue: queryInfo?.userId,
    span: '12',
    required: true,
  },
  {
    label: '岗位编码',
    key: 'deviceName',
    widget: 'input',
    initialValue: queryInfo?.deviceName,
    span: '12',
    required: true,
  },
  {
    label: '岗位顺序',
    key: 'deviceAddress',
    widget: 'input',
    initialValue: queryInfo?.deviceAddress,
    span: '12',
    required: true,
  },
  {
    label: '岗位状态',
    key: 'status',
    widget: 'select',
    option: [
      { label: '正常', value: '1' },
      { label: '停用', value: '2' },
    ],
    initialValue: queryInfo?.status,
    span: '12',
    required: true,
  },
  {
    label: '备注',
    key: 'workTime',
    widget: 'textarea',
    initialValue: queryInfo?.workTime,
    span: '12',
  },
]
