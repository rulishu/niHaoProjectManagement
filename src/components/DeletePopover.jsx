import { useState } from 'react'
import { Popover, Card, Button } from 'uiw'

export default function DeletePopover({ handleEditTable, disabled }) {
  const [isOpen, setIsOpen] = useState(false)
  return (
    <Popover
      trigger="click"
      placement="left"
      isOpen={isOpen}
      onVisibleChange={setIsOpen}
      content={
        <Card bordered={false} style={{ width: 200 }}>
          <div>是否删除该数据</div>
          <div
            style={{
              display: 'flex',
              justifyContent: 'flex-end',
              marginTop: 15,
            }}>
            <Button
              size="small"
              onClick={() => {
                setIsOpen(false)
              }}>
              取消
            </Button>
            <Button
              type="danger"
              size="small"
              onClick={async () => {
                const result = await handleEditTable()
                result && setIsOpen(false)
              }}>
              确定
            </Button>
          </div>
        </Card>
      }>
      <Button size="small" type="danger" disabled={disabled}>
        删除
      </Button>
    </Popover>
  )
}
