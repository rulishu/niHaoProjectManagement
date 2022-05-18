export const items = (queryInfo) => {
  return [
    {
      label: '成员姓名',
      key: 'user',
      widget: 'input',
      initialValue: queryInfo?.user,
      required: true,
      placeholder: '请输入成员姓名',
      span: '24',
      rules: [{ required: true, message: '请输入成员姓名' }],
    },
    {
      label: '成员角色',
      key: 'role',
      widget: 'select',
      initialValue: queryInfo?.role,
      required: true,
      option: [
        { label: '开发者', value: '开发者' },
        { label: '管理者', value: '管理者' },
      ],
      span: '24',
      placeholder: '请输入成员角色',
      rules: [{ required: true, message: '请输入成员角色' }],
    },
    {
      label: '加入日期',
      key: 'time',
      widget: 'dateInput',
      initialValue: queryInfo?.time,
      required: true,
      span: '24',
      placeholder: '请输入加入日期',
      rules: [{ required: true, message: '请输入加入日期' }],
    },
    {
      label: '受限用户',
      key: 'name',
      widget: 'select',
      initialValue: queryInfo?.name,
      required: true,
      option: [
        { label: '是', value: '是' },
        { label: '否', value: '管理者' },
      ],
      span: '24',
      placeholder: '请输入受限用户',
      rules: [{ required: true, message: '请输入受限用户' }],
    },
  ]
}
export const memberItems = (queryInfo) => {
  return [
    {
      label: '选择账户地址',
      key: 'user',
      widget: 'input',
      initialValue: queryInfo?.user,
      required: true,
      placeholder: '请输入账户地址',
      span: '24',
      rules: [{ required: true, message: '请输入账户地址' }],
    },
    {
      label: '选择成员角色',
      key: 'role',
      widget: 'select',
      initialValue: queryInfo?.role,
      required: true,
      option: [
        { label: '开发者', value: '开发者' },
        { label: '管理者', value: '管理者' },
      ],
      span: '24',
      placeholder: '请选择成员角色',
      rules: [{ required: true, message: '请选择成员角色' }],
    },
    {
      label: '访问到期日期',
      key: 'time',
      widget: 'dateInput',
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
      rules: [{ required: true, message: '请选择要邀请的群组' }],
    },
    {
      label: '选择成员角色',
      key: 'role',
      widget: 'select',
      initialValue: queryInfo?.role,
      required: true,
      option: [
        { label: '开发者', value: '开发者' },
        { label: '管理者', value: '管理者' },
      ],
      span: '24',
      placeholder: '请输入选择成员角色',
      rules: [{ required: true, message: '请选择成员角色' }],
    },
    {
      label: '访问到期日期',
      key: 'time',
      widget: 'dateInput',
      initialValue: queryInfo?.time,
      span: '24',
      placeholder: '请输入访问到期日期',
      rules: [{ required: true, message: '请输入访问到期日期' }],
    },
  ]
}
