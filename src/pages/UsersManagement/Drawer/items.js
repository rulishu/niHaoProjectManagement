export const items = (queryInfo) => {
  return [
    {
      label: '用户',
      key: 'user',
      widget: 'input',
      initialValue: queryInfo?.user,
      required: true,
      placeholder: '请输入客户姓名',
      rules: [{ required: true, message: '请输入客户姓名' }],
    },
    {
      label: '角色',
      key: 'role',
      widget: 'input',
      initialValue: queryInfo?.role,
      required: true,
      placeholder: '请输入客户姓名',
      rules: [{ required: true, message: '请输入客户姓名' }],
    },
    {
      label: '加入日期',
      key: 'time',
      widget: 'input',
      initialValue: queryInfo?.time,
      required: true,
      placeholder: '请输入客户姓名',
      rules: [{ required: true, message: '请输入客户姓名' }],
    },
    {
      label: '受限用户',
      key: 'name',
      widget: 'input',
      initialValue: queryInfo?.name,
      required: true,
      placeholder: '请输入客户姓名',
      rules: [{ required: true, message: '请输入客户姓名' }],
    },
  ]
}
