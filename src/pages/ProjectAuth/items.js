import { Button, Tooltip } from 'uiw'

export const columns = (onTable) => [
  {
    title: '编号',
    key: 'code',
    align: 'center',
  },
  {
    title: '分组名称',
    key: 'name',
    align: 'center',
  },
  {
    title: '分组描述',
    key: 'mshu',
    align: 'center',
  },
  {
    title: '用户列表',
    key: 'gender',
    align: 'center',
  },
  {
    title: '操作',
    key: 'edit',
    width: 180,
    align: 'center',
    render: (text, key, rowData) => (
      <div>
        <Tooltip placement="top" content="项目维护权限">
          <Button
            size="small"
            icon="lock"
            onClick={() => onTable('lock', rowData)}
          />
        </Tooltip>
        <Tooltip placement="top" content="维护分组用户">
          <Button
            size="small"
            icon="usergroup-add"
            onClick={() => onTable('lock', rowData)}
          />
        </Tooltip>
        <Tooltip placement="top" content="项目编辑分组">
          <Button
            size="small"
            icon="edit"
            onClick={() => onTable('lock', rowData)}
          />
        </Tooltip>
        <Tooltip placement="top" content="删除分组">
          <Button
            size="small"
            icon="delete"
            onClick={() => onTable('lock', rowData)}
          />
        </Tooltip>
      </div>
    ),
  },
]
