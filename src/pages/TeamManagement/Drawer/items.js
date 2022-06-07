export const items = (queryInfo, drawerType) => [
  {
    label: '团队名',
    key: 'teamName',
    widget: 'input',
    initialValue: queryInfo?.teamName,
    widgetProps: {},
    required: true,
    placeholder: '输入团队名',
    rules: [{ required: true, message: '请输入团队名' }],
    span: '24',
  },
  {
    label: '团队描述',
    key: 'teamDes',
    widget: 'input',
    initialValue: queryInfo?.teamDes,
    widgetProps: {},
    required: true,
    placeholder: '团队描述',
    rules: [{ required: true, message: '请输入团队描述' }],
    span: '24',
  },
]
