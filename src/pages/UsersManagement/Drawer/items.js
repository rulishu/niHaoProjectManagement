export const items = (queryInfo) => {
  return [
    {
      label: '用户',
      key: 'user',
      widget: 'input',
      initialValue: queryInfo?.user,
      required: true,
      placeholder: '请输入客户姓名',
      span: '24',
      rules: [{ required: true, message: '请输入客户姓名' }],
    },
    {
      label: '角色',
      key: 'role',
      widget: 'input',
      initialValue: queryInfo?.role,
      required: true,
      span: '24',
      placeholder: '请输入客户姓名',
      rules: [{ required: true, message: '请输入客户姓名' }],
    },
    {
      label: '加入日期',
      key: 'time',
      widget: 'input',
      initialValue: queryInfo?.time,
      required: true,
      span: '24',
      placeholder: '请输入客户姓名',
      rules: [{ required: true, message: '请输入客户姓名' }],
    },
    {
      label: '受限用户',
      key: 'name',
      widget: 'input',
      initialValue: queryInfo?.name,
      required: true,
      span: '24',
      placeholder: '请输入客户姓名',
      rules: [{ required: true, message: '请输入客户姓名' }],
    },
  ]
}
export const memberItems = (queryInfo) => {
  return [
    {
      label: 'GitLab用户或电子邮件地址',
      key: 'user',
      widget: 'input',
      initialValue: queryInfo?.user,
      required: true,
      placeholder: '请输入GitLab用户或电子邮件地址',
      span: '24',
      rules: [{ required: true, message: '请输入GitLab用户或电子邮件地址' }],
    },
    {
      label: '选择角色',
      key: 'role',
      widget: 'input',
      initialValue: queryInfo?.role,
      required: true,
      span: '24',
      placeholder: '请输入选择角色',
      rules: [{ required: true, message: '请输入选择角色' }],
    },
    {
      label: '访问到期日期',
      key: 'time',
      widget: 'input',
      initialValue: queryInfo?.time,
      span: '24',
      placeholder: '请输入访问到期日期',
      rules: [{ required: true, message: '请输入访问到期日期' }],
    },
  ]
}
export const groupItems = (queryInfo) => {
  return [
    {
      label: '选择要邀请的群组',
      key: 'user',
      widget: 'input',
      initialValue: queryInfo?.user,
      required: true,
      placeholder: '选择要邀请的群组',
      span: '24',
      rules: [{ required: true, message: '请输入选择要邀请的群组' }],
    },
    {
      label: '选择角色',
      key: 'role',
      widget: 'input',
      initialValue: queryInfo?.role,
      required: true,
      span: '24',
      placeholder: '请输入选择角色',
      rules: [{ required: true, message: '请输入选择角色' }],
    },
    {
      label: '访问到期日期',
      key: 'time',
      widget: 'input',
      initialValue: queryInfo?.time,
      span: '24',
      placeholder: '请输入访问到期日期',
      rules: [{ required: true, message: '请输入访问到期日期' }],
    },
  ]
}
