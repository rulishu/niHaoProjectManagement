export const items = (queryInfo) => [
  // userId
  {
    label: '岗位名称',
    key: 'postName',
    widget: 'input',
    initialValue: queryInfo?.postName,
    span: '24',
    required: true,
  },
  {
    label: '岗位编码',
    key: 'postCode',
    widget: 'input',
    initialValue: queryInfo?.postCode,
    span: '24',
    required: true,
  },
  {
    label: '岗位顺序',
    key: 'postSort',
    widget: 'input',
    initialValue: queryInfo?.postSort,
    span: '24',
    required: true,
  },
  {
    label: '岗位状态',
    key: 'status',
    widget: 'select',
    option: [
      { label: '正常', value: '0' },
      { label: '停用', value: '1' },
    ],
    initialValue: queryInfo?.status,
    span: '24',
    required: true,
  },
  {
    label: '备注',
    key: 'remark',
    widget: 'textarea',
    initialValue: queryInfo?.remark,
    span: '24',
  },
]
