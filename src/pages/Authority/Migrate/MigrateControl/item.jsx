import { Button, Tooltip, Dropdown, Menu } from 'uiw'
const menu = (rowData, goMigrateControlSynch) => {
  const aaa = () => {
    goMigrateControlSynch(rowData.id)
    console.log(rowData.id)
  }
  return (
    <Menu bordered style={{ maxWidth: 200 }}>
      <Menu.Item text="同步项目数据" onClick={() => aaa('label')} />
      <Menu.Item text="同步标签数据" onClick={() => aaa('label')} />
      <Menu.Item text="同步里程碑数据" onClick={() => aaa('label')} />
      <Menu.Item text="同步issues数据" onClick={() => aaa('label')} />
    </Menu>
  )
}
const sourceTypeObj = { 10: 'GitLab', 20: 'GitHub', 30: '禅道' }

const contentBox = (value) => {
  return <div>{value}</div>
}

export const columns = (props) => {
  const { goMigrateControlSynch } = props
  return [
    {
      title: '项目名称',
      key: 'projectName',
      ellipsis: true,
      align: 'left',
      width: 240,
      props: {
        widget: 'input',
        widgetProps: {
          placeholder: '请输入项目名称',
        },
      },
      render: (text) => {
        return (
          <Tooltip placement="top" content={contentBox(text)}>
            <span>{text}</span>
          </Tooltip>
        )
      },
    },
    {
      title: '来源类型',
      key: 'sourceType',
      ellipsis: true,
      align: 'left',
      width: 100,
      render: (text) => {
        return <span>{sourceTypeObj[+text]}</span>
      },
    },
    {
      title: 'ssh地址',
      key: 'sshUrl',
      ellipsis: true,
      align: 'left',
      width: 300,
      render: (text) => {
        return (
          <Tooltip placement="top" content={contentBox(text)}>
            <span>{text}</span>
          </Tooltip>
        )
      },
    },
    {
      title: '描述',
      key: 'description',
      ellipsis: true,
      align: 'left',
      render: (text) => {
        return (
          <Tooltip placement="top" content={contentBox(text)}>
            <span>{text}</span>
          </Tooltip>
        )
      },
    },
    // {
    //   title: '默认分支',
    //   key: 'defaultBranch',
    //   ellipsis: true,
    //   align: 'center',
    // },
    // {
    //   title: '迁移源类型',
    //   key: 'type',
    //   ellipsis: true,
    //   align: 'center',
    // },
    // {
    //   title: 'ssh地址',
    //   key: 'sshUrl',
    //   ellipsis: true,
    //   align: 'center',
    // },
    // {
    //   title: '迁移状态',
    //   key: 'transferStatus',
    //   ellipsis: true,
    //   align: 'center',
    // },
    // {
    //   title: 'web地址',
    //   key: 'webUrl',
    //   ellipsis: true,
    //   align: 'center',
    // },
    // {
    //   title: '项目Issue',
    //   key: 'issues',
    //   ellipsis: true,
    //   align: 'center',
    // },
    // {
    //   title: '迁移任务id',
    //   key: 'id',
    //   ellipsis: true,
    //   align: 'center',
    // },
    // {
    //   title: '末尾编号',
    //   key: 'issuesFineCode',
    //   ellipsis: true,
    //   align: 'center',
    // },
    // {
    //   title: 'issues迁移状态',
    //   key: 'issuesTransferStatus',
    //   ellipsis: true,
    //   align: 'center',
    // },
    // {
    //   title: 'issues最新迁移时间',
    //   key: 'issuesTransferTime',
    //   ellipsis: true,
    //   align: 'center',
    // },
    // {
    //   title: '路径',
    //   key: 'path',
    //   ellipsis: true,
    //   align: 'center',
    // },
    // {
    //   title: '项目标签',
    //   key: 'labels',
    //   ellipsis: true,
    //   align: 'center',
    // },
    // {
    //   title: '项目里程碑',
    //   key: 'projectMember',
    //   ellipsis: true,
    //   align: 'center',
    // },
    // {
    //   title: '项目名称',
    //   key: 'projectName',
    //   ellipsis: true,
    //   align: 'center',
    // },
    // {
    //   title: '项目状态',
    //   key: 'projectStatus',
    //   ellipsis: true,
    //   align: 'center',
    // },
    // {
    //   title: '来源端id',
    //   key: 'sourceId',
    //   ellipsis: true,
    //   align: 'center',
    // },
    // {
    //   title: '来源类型',
    //   key: 'sourceType',
    //   ellipsis: true,
    //   align: 'center',
    // },
    // {
    //   title: '描述',
    //   key: 'description',
    //   ellipsis: true,
    //   align: 'center',
    // },
    {
      title: '操作',
      key: 'edit',
      width: 120,
      align: 'center',
      fixed: 'right',
      render: (text, key, rowData) => {
        console.log(text, key, rowData)
        return (
          <div>
            <Tooltip placement="top" content="查看">
              <Button
                size="small"
                type="success"
                icon="eye-o"
                onClick={() => goMigrateControlSynch(rowData?.id)}
              />
            </Tooltip>
            {/* <Tooltip placement="top" content="编辑">
              <Button
                size="small"
                type="primary"
                icon="edit"
                onClick={() => getDataByIdControl(rowData?.id)}
              />
            </Tooltip> */}
            <Dropdown
              trigger="click"
              placement="top"
              menu={menu(rowData, goMigrateControlSynch)}>
              <Button icon="more" />
            </Dropdown>
          </div>
        )
      },
    },
  ]
}

// export const formItem = (initialValue, type) => [
//   {
//     label: '默认分支',
//     key: 'defaultBranch',
//     required: true,
//     widget: 'input',
//     initialValue: initialValue?.name,
//     disabled: type === 3,
//     widgetProps: {},
//     span: '12',
//   },
//   {
//     label: 'http_url地址',
//     key: 'httpUrl',
//     required: true,
//     widget: 'input',
//     initialValue: initialValue?.name,
//     disabled: type === 3,
//     widgetProps: {},
//     span: '12',
//   },
//   {
//     label: '末尾编号',
//     key: 'issuesFineCode',
//     required: true,
//     widget: 'input',
//     initialValue: initialValue?.name,
//     disabled: type === 3,
//     widgetProps: {},
//     span: '12',
//   },
//   {
//     label: '项目Issue',
//     key: 'issues',
//     required: true,
//     widget: 'input',
//     initialValue: initialValue?.name,
//     disabled: type === 3,
//     widgetProps: {},
//     span: '12',
//   },
//   {
//     label: '末尾编号',
//     key: 'issuesFineCode',
//     required: true,
//     widget: 'input',
//     initialValue: initialValue?.name,
//     disabled: type === 3,
//     widgetProps: {},
//     span: '12',
//   },
//   {
//     label: 'issues迁移状态',
//     key: 'issuesTransferStatus',
//     required: true,
//     widget: 'input',
//     initialValue: initialValue?.name,
//     disabled: type === 3,
//     widgetProps: {},
//     span: '12',
//   },
//   {
//     label: 'issues最新迁移时间',
//     key: 'issuesTransferTime',
//     required: true,
//     widget: 'input',
//     initialValue: initialValue?.name,
//     disabled: type === 3,
//     widgetProps: {},
//     span: '12',
//   },
//   {
//     label: '项目标签',
//     key: 'labels',
//     required: true,
//     widget: 'input',
//     initialValue: initialValue?.name,
//     disabled: type === 3,
//     widgetProps: {},
//     span: '12',
//   },
//   {
//     label: '路径',
//     key: 'path',
//     required: true,
//     widget: 'input',
//     initialValue: initialValue?.name,
//     disabled: type === 3,
//     widgetProps: {},
//     span: '12',
//   },
//   {
//     label: '项目创建时间',
//     key: 'projectCreateTime',
//     required: true,
//     widget: 'input',
//     initialValue: initialValue?.name,
//     disabled: type === 3,
//     widgetProps: {},
//     span: '12',
//   },
//   {
//     label: '项目里程碑',
//     key: 'projectMember',
//     required: true,
//     widget: 'input',
//     initialValue: initialValue?.name,
//     disabled: type === 3,
//     widgetProps: {},
//     span: '12',
//   },
//   {
//     label: '项目名称',
//     key: 'projectName',
//     required: true,
//     widget: 'input',
//     initialValue: initialValue?.name,
//     disabled: type === 3,
//     widgetProps: {},
//     span: '12',
//   },
//   {
//     label: '项目状态',
//     key: 'projectStatus',
//     required: true,
//     widget: 'input',
//     initialValue: initialValue?.name,
//     disabled: type === 3,
//     widgetProps: {},
//     span: '12',
//   },
//   {
//     label: '来源端id',
//     key: 'sourceId',
//     required: true,
//     widget: 'input',
//     initialValue: initialValue?.name,
//     disabled: type === 3,
//     widgetProps: {},
//     span: '12',
//   },
//   {
//     label: 'ssh地址',
//     key: 'sshUrl',
//     required: true,
//     widget: 'input',
//     initialValue: initialValue?.name,
//     disabled: type === 3,
//     widgetProps: {},
//     span: '12',
//   },
//   {
//     label: '迁移明细',
//     key: 'transferDetails',
//     required: true,
//     widget: 'input',
//     initialValue: initialValue?.name,
//     disabled: type === 3,
//     widgetProps: {},
//     span: '12',
//   },
//   {
//     label: '迁移源id',
//     key: 'transferSourceId',
//     required: true,
//     widget: 'input',
//     initialValue: initialValue?.name,
//     disabled: type === 3,
//     widgetProps: {},
//     span: '12',
//   },
//   {
//     label: '迁移状态',
//     key: 'transferStatus',
//     required: true,
//     widget: 'input',
//     initialValue: initialValue?.name,
//     disabled: type === 3,
//     widgetProps: {},
//     span: '12',
//   },
//   {
//     label: '最新迁移时间',
//     key: 'transferTime',
//     required: true,
//     widget: 'input',
//     initialValue: initialValue?.name,
//     disabled: type === 3,
//     widgetProps: {},
//     span: '12',
//   },
//   {
//     label: 'web地址',
//     key: 'webUrl',
//     required: true,
//     widget: 'input',
//     initialValue: initialValue?.name,
//     disabled: type === 3,
//     widgetProps: {},
//     span: '12',
//   },
// ]
