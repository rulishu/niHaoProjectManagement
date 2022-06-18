import { Button } from 'uiw'
import formatter from '@uiw/formatter'

export const columnsSearch = (
  handleEditTable,
  userInfo,
  userRole,
  memberRoles,
  own
) => [
  {
    title: '成员姓名',
    key: 'memberName',
    align: 'center',
    width: 250,
    props: {
      widget: 'input',
      widgetProps: {
        placeholder: '输入成员姓名',
      },
    },
  },
  {
    title: '成员角色',
    key: 'memberRole',
    align: 'center',
    render: (memberRole) => (
      <div style={{ textAlign: 'center' }}>
        {memberRole === 1
          ? '开发'
          : memberRole === 2
          ? '测试'
          : memberRole === 3
          ? '项目管理者'
          : ''}
      </div>
    ),
  },
  {
    title: '加入日期',
    key: 'createTime',
    align: 'center',
    render: (createTime) => {
      return createTime ? (
        <div>{formatter('YYYY-MM-DD', new Date(createTime))}</div>
      ) : (
        ''
      )
    },
  },
  {
    title: '访问到期日期',
    key: 'accessExpirationTime',
    align: 'center',
    render: (accessExpirationTime) => {
      return accessExpirationTime ? (
        <div>{formatter('YYYY-MM-DD', new Date(accessExpirationTime))}</div>
      ) : (
        ''
      )
    },
  },
  {
    title: '操作',
    key: 'edit',
    width: 150,
    align: 'center',
    render: (text, key, rowData) => (
      <div>
        {own === 'true' || Number(memberRoles) === 3 ? (
          <Button
            size="small"
            icon="edit"
            type="primary"
            disabled={userRole === '开发' || userRole === '测试' ? true : false}
            onClick={() => handleEditTable('edit', rowData)}>
            编辑
          </Button>
        ) : (
          ''
        )}
        {own === 'true' || Number(memberRoles) === 3 ? (
          userInfo === rowData?.memberName ? (
            <Button
              size="small"
              type="danger"
              icon="close"
              onClick={() => handleEditTable('out', rowData)}>
              退出
            </Button>
          ) : (
            <Button
              size="small"
              type="danger"
              icon="user-delete"
              disabled={
                rowData?.memberName === userInfo ||
                userRole === '开发' ||
                userRole === '测试'
                  ? true
                  : false
              }
              onClick={() => handleEditTable('del', rowData)}>
              删除
            </Button>
          )
        ) : userInfo === rowData?.memberName ? (
          <Button
            size="small"
            type="danger"
            icon="close"
            onClick={() => handleEditTable('out', rowData)}>
            退出
          </Button>
        ) : (
          ''
        )}
      </div>
    ),
  },
]
