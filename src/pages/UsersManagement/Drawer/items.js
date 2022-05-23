export const items = (queryInfo) => {
  return [
    {
      label: '成员姓名',
      key: 'memberName',
      widget: 'input',
      initialValue: queryInfo?.memberName,
      required: true,
      placeholder: '请输入成员姓名',
      span: '24',
      rules: [{ required: true, message: '请输入成员姓名' }],
    },
    {
      label: '成员角色',
      key: 'memberRole',
      widget: 'select',
      initialValue: queryInfo?.memberRole,
      required: true,
      option: [
        { label: '开发', value: 1 },
        { label: '测试', value: 2 },
        { label: '项目管理者', value: 3 },
      ],
      span: '24',
      placeholder: '请输入成员角色',
      rules: [{ required: true, message: '请输入成员角色' }],
    },
    {
      label: '访问到期日期',
      key: 'accessExpirationTime',
      widget: 'dateInput',
      initialValue: queryInfo?.accessExpirationTime,
      span: '24',
      required: true,
      widgetProps: {
        format: 'YYYY-MM-DD HH:mm:ss',
      },
      placeholder: '请输入访问到期日期',
      rules: [{ required: true, message: '请输入访问到期日期' }],
    },
  ]
}
export const memberItems = (queryInfo, userIdList) => {
  return [
    {
      label: '选择账户姓名邮箱',
      key: 'userId',
      widget: 'searchSelect',
      initialValue: queryInfo?.userId,
      required: true,
      placeholder: '请选择账户姓名邮箱',
      option: userIdList,
      span: '24',
      rules: [{ required: true, message: '请选择账户姓名邮箱' }],
    },
    {
      label: '选择成员角色',
      key: 'memberRole',
      widget: 'select',
      initialValue: queryInfo?.memberRole,
      required: true,
      option: [
        { label: '开发', value: 1 },
        { label: '测试', value: 2 },
        { label: '项目管理者', value: 3 },
      ],
      span: '24',
      placeholder: '请选择成员角色',
      rules: [{ required: true, message: '请选择成员角色' }],
    },
    {
      label: '访问到期日期',
      key: 'accessExpirationTime',
      widget: 'dateInput',
      initialValue: queryInfo?.accessExpirationTime,
      span: '24',
      required: true,
      widgetProps: {
        format: 'YYYY-MM-DD HH:mm:ss',
      },
      placeholder: '请输入访问到期日期',
      rules: [{ required: true, message: '请输入访问到期日期' }],
    },
  ]
}
export const groupItems = (queryInfo, teamIdList) => {
  return [
    {
      label: '选择要邀请的团队',
      key: 'teamId',
      widget: 'searchSelect',
      initialValue: queryInfo?.teamId,
      required: true,
      option: teamIdList,
      placeholder: '选择要邀请的团队',
      span: '24',
      rules: [{ required: true, message: '请选择要邀请的团队' }],
    },
    {
      label: '选择成员角色',
      key: 'memberRole',
      widget: 'select',
      initialValue: queryInfo?.memberRole,
      required: true,
      option: [
        { label: '开发', value: 1 },
        { label: '测试', value: 2 },
        { label: '项目管理者', value: 3 },
      ],
      span: '24',
      placeholder: '请输入选择成员角色',
      rules: [{ required: true, message: '请选择成员角色' }],
    },
    {
      label: '访问到期日期',
      key: 'accessExpirationTime',
      widget: 'dateInput',
      initialValue: queryInfo?.accessExpirationTime,
      span: '24',
      required: true,
      widgetProps: {
        format: 'YYYY-MM-DD HH:mm:ss',
      },
      placeholder: '请输入访问到期日期',
      rules: [{ required: true, message: '请输入访问到期日期' }],
    },
  ]
}
