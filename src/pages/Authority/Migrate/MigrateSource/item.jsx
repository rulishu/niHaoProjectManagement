import { Button, Tooltip, Icon } from 'uiw'

const sourceTypeObj = { 10: 'GitLab', 20: 'GitHub', 30: '禅道' }

export const columns = (methods) => {
  const { getDataByIdSource, delDatSource, synchrodata, loading, migrateId } =
    methods
  return [
    {
      title: '迁移源名称',
      key: 'name',
      width: 200,
      props: {
        widget: 'input',
        widgetProps: {
          placeholder: '请输入迁移源名称',
        },
      },
    },
    {
      title: '迁移源类型',
      key: 'type',
      width: 120,
      ellipsis: true,
      align: 'center',
      render: (text) => <div>{sourceTypeObj[+text]}</div>,
    },
    {
      title: '迁移源地址',
      key: 'url',
      width: 220,
      ellipsis: true,
      align: 'center',
    },
    {
      title: '创建时间',
      key: 'createTime',
      width: 180,
      ellipsis: true,
      align: 'center',
    },
    {
      title: '更新时间',
      key: 'updateTime',
      width: 180,
      ellipsis: true,
      align: 'center',
    },
    {
      title: '备注',
      key: 'remark',
      ellipsis: true,
      align: 'center',
      render: (remark) => (
        <div style={{ textAlign: 'center' }}>
          <Tooltip placement="leftTop" content={remark}>
            <span>{remark || ''}</span>
          </Tooltip>
        </div>
      ),
    },
    {
      title: '操作',
      key: 'edit',
      width: 210,
      align: 'center',
      render: (text, key, rowData) => {
        return (
          <div>
            <Button
              size="small"
              type="success"
              icon="eye-o"
              onClick={() => getDataByIdSource(rowData.id, 3)}
            />
            <Button
              size="small"
              type="primary"
              icon="edit"
              onClick={() => getDataByIdSource(rowData.id, 2)}
            />
            <Button
              size="small"
              type="danger"
              icon="delete"
              onClick={() => delDatSource(rowData.id)}
            />
            <Button
              size="small"
              type="warning"
              disabled={loading.effects.migrate.synchronizationControl}
              onClick={() => synchrodata(rowData)}>
              <Icon
                type="reload"
                spin={
                  migrateId === rowData.id &&
                  loading.effects.migrate.synchronizationControl
                }
              />
              同步数据
            </Button>
          </div>
        )
      },
    },
  ]
}

export const formItem = (initialValue, type) => [
  {
    label: '名称',
    key: 'name',
    placeholder: '请输入名称',
    rules: [{ required: true, message: '请输入名称' }],
    required: true,
    widget: 'input',
    initialValue: initialValue?.name,
    disabled: type === 3,
    widgetProps: {},
    span: '24',
  },
  {
    label: type === 1 ? 'token' : 'token(加密后)',
    key: 'token',
    placeholder: '请输入token',
    rules: [{ required: true, message: '请输入token' }],
    required: true,
    widget: 'input',
    initialValue: initialValue?.token,
    disabled: type === 3,
    widgetProps: {},
    span: '24',
  },
  {
    label: '备注',
    key: 'remark',
    placeholder: '请输入备注',
    widget: 'input',
    initialValue: initialValue?.remark,
    disabled: type === 3,
    widgetProps: {},
    span: '24',
  },
  {
    label: '迁移类型',
    key: 'type',
    required: true,
    widget: 'select',
    initialValue: initialValue?.type,
    disabled: type === 3,
    rules: [{ required: true, message: '请选择迁移类型' }],
    widgetProps: {},
    span: '24',
    option: [
      { value: 10, label: 'GitLab' },
      { value: 20, label: 'GitHub' },
      { value: 30, label: '禅道' },
    ],
  },
  {
    label: '迁移路径',
    key: 'url',
    required: true,
    placeholder: '请输入迁移路径',
    rules: [{ required: true, message: '请输入迁移路径' }],
    widget: 'input',
    initialValue: initialValue?.url,
    disabled: type === 3,
    widgetProps: {},
    span: '24',
  },
]

// 第三方迁移配置
// type: 10：gitlab 20：github 30：禅道
export const configItem = (initialValue, type) => {
  return [
    {
      label: 'GitLab第三方应用ID',
      key: 'clientId',
      required: true,
      inline: true,
      widget: 'input',
      initialValue: initialValue?.clientId,
      widgetProps: {},
      span: '24',
      rules: [{ required: true, message: '请输入' }],
    },
    {
      label: 'GitLab第三方应用密钥',
      key: 'clientSecret',
      required: true,
      inline: true,
      widget: 'input',
      initialValue: initialValue?.clientSecret,
      widgetProps: {},
      span: '24',
      rules: [{ required: true, message: '请输入' }],
    },
    // {
    //   label: 'GitLab第三方Url',
    //   key: 'gitLabUrl',
    //   required: true,
    //   widget: 'input',
    //   initialValue: initialValue?.gitLabUrl,
    //   widgetProps: {},
    //   span: '24',
    // },
    {
      label: '授权类型',
      key: 'grantType',
      required: true,
      inline: true,
      widget: 'input',
      initialValue: initialValue?.grantType,
      widgetProps: {},
      span: '24',
      rules: [{ required: true, message: '请输入' }],
    },
    {
      label: '回调网址',
      key: 'redirectUri',
      required: true,
      inline: true,
      widget: 'input',
      initialValue: initialValue?.redirectUri,
      widgetProps: {},
      span: '24',
      rules: [{ required: true, message: '请输入' }],
    },
    {
      label: '响应类型',
      key: 'responseType',
      required: true,
      inline: true,
      widget: 'input',
      initialValue: initialValue?.responseType,
      widgetProps: {},
      span: '24',
      rules: [{ required: true, message: '请输入' }],
    },
    {
      label: '授权范围',
      key: 'scope',
      required: true,
      inline: true,
      widget: 'input',
      initialValue: initialValue?.scope,
      widgetProps: {},
      span: '24',
      rules: [{ required: true, message: '请输入' }],
    },
    // {
    //   label: 'token',
    //   key: 'token',
    //   required: true,
    //   widget: 'input',
    //   initialValue: initialValue?.token,
    //   widgetProps: {},
    //   span: '24'
    // },
    {
      label: 'GitLab地址',
      key: 'url',
      required: true,
      inline: true,
      widget: 'input',
      initialValue: initialValue?.url,
      widgetProps: {},
      span: '24',
      rules: [{ required: true, message: '请输入' }],
    },
  ]
}
