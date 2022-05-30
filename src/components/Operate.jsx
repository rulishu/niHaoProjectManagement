import { Fragment } from 'react'
import { Button, Divider, Icon } from 'uiw'

export default function operateFun({
  onEvenEdit,
  onEvenDelete,
  onAuthorize,
  onUser,
}) {
  return (
    <Fragment>
      {onUser && (
        <Button
          type="success"
          icon={<Icon type="usergroup-add" style={{ fontSize: 14 }} />}
          size="small"
          onClick={() => {
            onUser()
          }}>
          添加成员
        </Button>
      )}
      <Divider type="vertical" />
      {onEvenEdit && (
        <Button
          type="primary"
          icon={<Icon type="edit" style={{ fontSize: 14 }} />}
          size="small"
          onClick={() => {
            onEvenEdit()
          }}>
          编辑
        </Button>
      )}
      <Divider type="vertical" />
      {onEvenDelete && (
        <Button
          type="danger"
          icon={<Icon type="delete" style={{ fontSize: 14 }} />}
          size="small"
          onClick={() => {
            onEvenDelete()
          }}>
          删除
        </Button>
      )}
      {onAuthorize && <Divider type="vertical" />}
      {onAuthorize && (
        <Button
          type="primary"
          icon={<Icon type="edit" style={{ fontSize: 14 }} />}
          size="small"
          onClick={() => {
            onAuthorize()
          }}>
          授权
        </Button>
      )}
    </Fragment>
  )
}
