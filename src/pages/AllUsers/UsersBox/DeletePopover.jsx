import { useState } from 'react'
import { Button, Popover, Card, Tooltip } from 'uiw'

const DeletePopover = (props) => {
  const { data, handleEdit } = props
  const [isOpen, setIsOpen] = useState(false)

  return (
    <Popover
      trigger="click"
      placement="top"
      isOpen={isOpen}
      content={
        <Card>
          <div>确定删除该成员</div>
          <div
            style={{
              display: 'flex',
              justifyContent: 'flex-end',
              marginTop: 15,
            }}>
            <Button size="small" onClick={() => setIsOpen(false)}>
              取消
            </Button>
            <Button
              type="danger"
              size="small"
              onClick={() => {
                handleEdit(data?.id, 'delete')
                setIsOpen(false)
              }}>
              确定
            </Button>
          </div>
        </Card>
      }>
      <div>
        <Tooltip placement="top" content="删除">
          <Button
            icon="delete"
            type="light"
            size="small"
            onClick={() => setIsOpen(true)}></Button>
        </Tooltip>
      </div>
    </Popover>
  )
}

export default DeletePopover
