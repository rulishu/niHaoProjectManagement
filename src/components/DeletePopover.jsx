import { Modal } from 'uiw'

export default function DeletePopover({ isOpen, onConfirm, onClosed }) {
  return (
    // <Popover
    //   trigger="click"
    //   placement="left"
    //   isOpen={isOpen}
    //   onVisibleChange={setIsOpen}
    //   content={
    //     <Card bordered={false} style={{ width: 200 }}>
    //       <div>是否删除该数据</div>
    //       <div
    //         style={{
    //           display: 'flex',
    //           justifyContent: 'flex-end',
    //           marginTop: 15,
    //         }}>
    //         <Button
    //           size="small"
    //           onClick={() => {
    //             setIsOpen(false)
    //           }}>
    //           取消
    //         </Button>
    //         <Button
    //           type="danger"
    //           size="small"
    //           onClick={async () => {
    //             const result = await handleEditTable()
    //             result && setIsOpen(false)
    //           }}>
    //           确定
    //         </Button>
    //       </div>
    //     </Card>
    //   }
    //   >
    <Modal
      title="删除提示"
      isOpen={isOpen}
      confirmText="确定"
      cancelText="取消"
      icon="information"
      type="danger"
      onConfirm={onConfirm}
      onCancel={onClosed}
      onClosed={onClosed}>
      <p>确认删除本条数据吗?</p>
    </Modal>

    // {/* </Popover> */ }
  )
}
